import { Header } from "@/components/Header";
import { SectionRenderer } from "@/components/home/SectionRenderer";
import { TransitionScreen } from "@/components/motion/TransitionScreen";
import { Skeleton } from "@/components/States";
import { Button, Txt } from "@/components/ui";
import type { Section } from "@/data/types";
import { useCare } from "@/store/careStore";
import { space } from "@/theme";
import { useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
export default function Home() {
  const config = useCare((s) => s.config);
  const configStatus = useCare((s) => s.configStatus);
  const message = useCare((s) => s.message);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const viewability = useMemo(() => ({ itemVisiblePercentThreshold: 10 }), []);
  const onViewable = useCallback(
    ({
      viewableItems,
    }: {
      viewableItems: { item: Section; isViewable: boolean }[];
    }) =>
      setVisibleIds((old) => {
        const next = new Set(old);
        viewableItems.forEach((v) => {
          if (v.isViewable) next.add(v.item.id);
        });
        return next.size === old.size ? old : next;
      }),
    [],
  );
  const scroll = useSharedValue(0);
  const handler = useAnimatedScrollHandler((e) => {
    scroll.value = e.contentOffset.y;
  });
  return (
    <TransitionScreen>
      <View style={{ flex: 1, backgroundColor: config.theme.background }}>
        <Header scroll={scroll} />
        <Animated.FlatList
          data={config.sections}
          keyExtractor={(s) => s.id}
          onScroll={handler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: space.xl }}
          extraData={visibleIds}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={viewability}
          refreshing={configStatus === "loading"}
          onRefresh={() => void useCare.getState().loadConfig()}
          initialNumToRender={3}
          windowSize={5}
          maxToRenderPerBatch={3}
          ListHeaderComponent={
            configStatus === "loading" ? (
              <Skeleton kind="home" />
            ) : message ? (
              <View style={{ padding: space.xl }}>
                <Txt accessibilityRole="alert">{message}</Txt>
                <Button
                  title="Retry home"
                  secondary
                  onPress={() => void useCare.getState().loadConfig()}
                />
              </View>
            ) : undefined
          }
          renderItem={({ item: s }) => (
            <SectionRenderer
              section={s}
              visible={visibleIds.has(s.id)}
              scroll={scroll}
            />
          )}
        />
      </View>
    </TransitionScreen>
  );
}
