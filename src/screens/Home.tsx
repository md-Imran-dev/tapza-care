import { space, type, useTheme } from "../theme";
import { memo, useCallback, useState, useEffect, useMemo } from "react";
import { Skeleton } from "../components/States";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  View,
  type ViewStyle,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  withTiming,
  type SharedValue,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useAuth } from "../state/auth";
import type {
  Section,
  HeroItem,
  ChipItem,
  QuickActionItem,
  ServiceItem,
  DoctorCarouselItem,
  OfferItem,
} from "../data/types";
import { useCare } from "../state/app";
import { Header } from "../components/Header";
import { Button, Icon, styles, Txt } from "../components/ui";
const book = (id: string) =>
  router.push({ pathname: "/booking", params: { doctorId: id } });
function Band({
  section,
  children,
}: {
  section: Section;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const b = section.background;
  const backgroundValue = b.value;
  const style: ViewStyle = { paddingVertical: space.xl };
  if (b.kind === "gradient") {
    const colors = backgroundValue.match(/#[a-fA-F0-9]{3,8}/g) ?? [
      theme.colors.secondary,
      theme.colors.primary,
    ];
    return (
      <View style={style}>
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          style={{ position: "absolute", inset: 0 }}
        />
        {children}
      </View>
    );
  }
  if (b.kind === "image")
    return (
      <ImageBackground source={{ uri: backgroundValue }} style={style}>
        {children}
      </ImageBackground>
    );
  return (
    <View style={[style, { backgroundColor: backgroundValue }]}>
      {children}
    </View>
  );
}
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
  );
}

export const SectionRenderer = memo(function SectionRenderer({
  section: s,
  visible = true,
  scroll,
}: {
  section: Section;
  visible?: boolean;
  scroll: SharedValue<number>;
}) {
  const palette = useTheme().colors;
  const config = useCare((state) => state.config);
  const doctors = useCare((state) => state.doctors);
  const name = useAuth((state) => state.session?.name ?? "there");
  const offset = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    if (visible) offset.value = withTiming(1, { duration: 400 });
  }, [visible, offset]);
  const revealStyle = useAnimatedStyle(() => ({
    opacity: offset.value,
    transform: [{ translateY: (1 - offset.value) * 24 }],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: Math.min(scroll.value * 0.12, 45) },
      { scale: 1.12 },
    ],
  }));

  if (
    ![
      "hero_banner",
      "category_chips",
      "quick_actions",
      "service_grid",
      "doctor_carousel",
      "offer_strip",
    ].includes(s.type)
  )
    return null;
  let content: React.ReactNode;
  if (s.type === "hero_banner") {
    const h = s.items[0] as HeroItem;
    content = (
      <View
        style={{
          marginHorizontal: space.xl,
          borderRadius: 28,
          overflow: "hidden",
          minHeight: 290,
        }}
      >
        <Animated.Image
          source={{ uri: h.image }}
          style={[
            { position: "absolute", width: "100%", height: "100%" },
            imageStyle,
          ]}
        />
        <LinearGradient
          colors={[palette.overlay, palette.heroFade]}
          style={{ padding: space.xl, gap: space.md }}
        >
          <Txt
            style={{
              alignSelf: "flex-start",
              color: palette.white,
              backgroundColor: palette.white + "25",
              borderRadius: 18,
              paddingHorizontal: space.md,
              paddingVertical: space.xs,
              fontSize: type.micro,
              fontWeight: "700",
            }}
          >
            🟢{" "}
            {config.theme.festival.name === "diwali"
              ? "Festival hours 7AM–11PM"
              : "Open today till 9 PM"}
          </Txt>
          <Txt
            style={{
              fontSize: type.title,
              lineHeight: 31,
              fontWeight: "900",
              color: palette.white,
              maxWidth: 250,
            }}
          >
            {h.greeting.replace("Lakshmi garu", name)}
          </Txt>
          <Txt
            style={{
              fontSize: type.small,
              lineHeight: 19,
              color: palette.white + "CC",
            }}
          >
            {h.sub}
          </Txt>
          <View style={styles.row}>
            <Pressable
              onPress={() => book("d1")}
              style={{
                backgroundColor: palette.white,
                borderRadius: 30,
                padding: space.lg,
                minHeight: 48,
              }}
            >
              <Txt style={{ fontWeight: "800" }}>{h.cta}</Txt>
            </Pressable>
            <Pressable
              onPress={() => router.push("/contact")}
              style={{
                borderWidth: 1,
                borderColor: palette.white + "66",
                borderRadius: 30,
                padding: space.lg,
                minHeight: 48,
              }}
            >
              <Txt style={{ color: palette.white, fontWeight: "700" }}>
                WhatsApp us
              </Txt>
            </Pressable>
          </View>
          <View style={styles.row}>
            {h.stats.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  borderRadius: 15,
                  padding: space.md,
                  backgroundColor: palette.white + "28",
                  alignItems: "center",
                  gap: space.xxs,
                }}
              >
                <Txt
                  style={{
                    color: palette.white,
                    fontWeight: "900",
                    fontSize: type.label,
                  }}
                >
                  {stat.value}
                </Txt>
                <Txt
                  style={{ color: palette.white + "BB", fontSize: type.micro }}
                >
                  {stat.label}
                </Txt>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  } else if (s.type === "category_chips")
    content = (
      <View style={{ gap: space.md }}>
        <Txt style={[styles.heading, { marginHorizontal: space.xl }]}>
          {s.title}
        </Txt>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.sm }}
        >
          {(s.items as ChipItem[]).map((c) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/doctors",
                  params: { category: c.label },
                })
              }
              key={c.id}
              style={[
                styles.row,
                {
                  backgroundColor: palette.white,
                  borderRadius: 30,
                  padding: space.sm,
                  paddingRight: space.lg,
                  minHeight: 54,
                  borderWidth: 1,
                  borderColor: palette.line,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: palette.paleGreen,
                  borderRadius: 24,
                  padding: space.sm,
                }}
              >
                <Icon name={c.icon} color={config.theme.primary} size={20} />
              </View>
              <View>
                <Txt style={{ fontWeight: "800" }}>{c.label}</Txt>
                <Txt style={styles.sub}>{c.count}</Txt>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  else if (s.type === "offer_strip") {
    const o = s.items[0] as OfferItem;
    content = (
      <View style={[styles.row, { paddingHorizontal: space.xl }]}>
        <Icon name="sparkles" color={config.theme.accent} />
        <Txt
          style={{
            flex: 1,
            color: palette.white,
            fontSize: type.caption,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {o.message}
        </Txt>
        <Txt
          style={{
            color: palette.white,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: palette.white + "80",
            padding: space.xxs,
            borderRadius: 6,
            fontSize: type.micro,
            fontWeight: "800",
          }}
        >
          {o.code}
        </Txt>
      </View>
    );
  } else if (s.type === "quick_actions")
    content = (
      <View style={{ paddingHorizontal: space.xl, gap: space.md }}>
        <Txt style={styles.heading}>{s.title}</Txt>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          {(s.items as QuickActionItem[]).map((q, i) => (
            <Pressable
              key={q.id}
              onPress={() =>
                router.push(
                  (
                    [
                      "/doctors",
                      "/prescriptions",
                      "/reminders",
                      "/family",
                    ] as const
                  )[i],
                )
              }
              style={{
                flex: 1,
                backgroundColor: [
                  palette.paleGreen,
                  palette.peach,
                  palette.blue,
                  palette.purple,
                ][i],
                borderRadius: 20,
                paddingVertical: space.md,
                alignItems: "center",
                gap: space.xs,
                borderWidth: 1,
                borderColor: palette.line,
              }}
            >
              <View
                style={{
                  backgroundColor: palette.white,
                  padding: space.md,
                  borderRadius: 28,
                }}
              >
                <Icon
                  name={["calendar", "rx", "bell", "user"][i]}
                  color={
                    [
                      config.theme.primary,
                      palette.orange,
                      palette.indigo,
                      palette.violet,
                    ][i]
                  }
                />
              </View>
              <Txt style={{ fontSize: type.micro, fontWeight: "800" }}>
                {q.label}
              </Txt>
              <Txt
                style={{
                  fontSize: type.micro,
                  color: palette.muted,
                  textAlign: "center",
                }}
              >
                {q.desc}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>
    );
  else if (s.type === "service_grid")
    content = (
      <View style={{ paddingHorizontal: space.xl, gap: space.sm }}>
        <Txt style={styles.heading}>{s.title}</Txt>
        <Txt style={styles.sub}>{s.subtitle}</Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.md }}>
          {(s.items as ServiceItem[]).map((item) => (
            <View
              key={item.id}
              style={{
                width: "48%",
                flexGrow: 1,
                backgroundColor: palette.white,
                borderRadius: 20,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: palette.line,
              }}
            >
              <View>
                <Image
                  source={{ uri: item.image }}
                  style={{ height: 115, width: "100%" }}
                />
                {!!item.badge && (
                  <Txt
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: config.theme.accent,
                      color: palette.white,
                      borderRadius: 16,
                      paddingHorizontal: space.sm,
                      paddingVertical: space.xxs,
                      fontSize: type.micro,
                      fontWeight: "800",
                    }}
                  >
                    {item.badge}
                  </Txt>
                )}
              </View>
              <View style={{ padding: space.md, gap: space.xs }}>
                <Txt
                  style={{
                    fontWeight: "800",
                    fontSize: type.small,
                    minHeight: 34,
                  }}
                >
                  {item.name}
                </Txt>
                <Txt style={{ fontSize: type.micro, color: palette.orange }}>
                  ★ {item.rating}
                </Txt>
                <Txt
                  style={{
                    color: config.theme.primary,
                    fontWeight: "900",
                    fontSize: type.lead,
                  }}
                >
                  {item.priceInr === 0 ? "FREE" : `₹${item.priceInr}`}
                </Txt>
                <Button
                  title="ADD +"
                  onPress={() =>
                    router.push({
                      pathname: "/booking",
                      params: {
                        doctorId: "d1",
                        service: item.name,
                        price: String(item.priceInr),
                      },
                    })
                  }
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  else
    content = (
      <View style={{ gap: space.sm }}>
        <Txt style={[styles.heading, { paddingHorizontal: space.xl }]}>
          {s.title}
        </Txt>
        <Txt style={[styles.sub, { paddingHorizontal: space.xl }]}>
          {s.subtitle}
        </Txt>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.md }}
        >
          {(s.items as DoctorCarouselItem[]).map((it) => {
            const d = doctors.find((d) => d.id === it.doctorId);
            if (!d) return null;
            return (
              <View
                key={d.id}
                style={{
                  width: 235,
                  borderRadius: 24,
                  backgroundColor: palette.white,
                  overflow: "hidden",
                }}
              >
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: "/doctor/[id]",
                      params: { id: d.id },
                    })
                  }
                >
                  <Image
                    source={{ uri: d.photoUrl }}
                    style={{ height: 150, width: "100%" }}
                  />
                  <View style={{ padding: space.md, gap: space.xxs }}>
                    <Txt style={{ fontWeight: "800" }}>{d.name}</Txt>
                    <Txt style={styles.sub}>
                      {d.specialty} · {d.expYears} yrs
                    </Txt>
                    <Txt style={styles.sub}>
                      ★ {d.rating} · {d.nextSlot}
                    </Txt>
                    <Txt style={{ fontSize: type.micro, color: palette.muted }}>
                      {d.languages.join(" · ")}
                    </Txt>
                  </View>
                </Pressable>
                <View
                  style={[
                    styles.row,
                    {
                      padding: space.md,
                      paddingTop: space.none,
                      justifyContent: "space-between",
                    },
                  ]}
                >
                  <Txt style={{ fontWeight: "900", fontSize: type.lead }}>
                    ₹{d.feeInr}
                  </Txt>
                  <Button title="Book" onPress={() => book(d.id)} />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  return (
    <Animated.View style={revealStyle}>
      <Band section={s}>{content}</Band>
    </Animated.View>
  );
});
