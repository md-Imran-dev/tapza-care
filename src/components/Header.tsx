import { space, type, useTheme } from "../theme";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { useCare } from "../state/app";
import { Icon, styles, Txt } from "./ui";
export function Header({ scroll }: { scroll?: SharedValue<number> }) {
  const palette = useTheme().colors;
  const t = useCare((s) => s.config.theme);
  const lang = useCare((s) => s.lang);
  const setLang = useCare((s) => s.setLang);
  const insets = useSafeAreaInsets();
  const a = useAnimatedStyle(() => ({
    height: interpolate(scroll?.value ?? 0, [0, 110], [64, 0], "clamp"),
    opacity: interpolate(scroll?.value ?? 0, [0, 95], [1, 0], "clamp"),
  }));
  return (
    <View
      style={{
        backgroundColor: t.secondary,
        paddingTop: insets.top + 12,
        paddingHorizontal: space.xl,
        paddingBottom: space.md,
      }}
    >
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={[styles.row, { flex: 1 }]}>
          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 16,
              backgroundColor: palette.white + "25",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Txt
              style={{
                fontSize: type.display,
                fontWeight: "900",
                color: palette.white,
              }}
            >
              ✚
            </Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt style={{ fontSize: type.micro, color: palette.white + "BB" }}>
              ⌖ Madhapur, Hyderabad
            </Txt>
            <Txt
              style={{
                fontWeight: "800",
                fontSize: type.lead,
                color: palette.white,
              }}
            >
              {t.festival.greeting}
            </Txt>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          {(["en", "hi", "te"] as const).map((l) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Language ${l}`}
              key={l}
              onPress={() => setLang(l)}
              style={{
                minWidth: 44,
                minHeight: 44,
                borderRadius: 24,
                backgroundColor:
                  l === lang ? palette.white : palette.white + "20",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: space.tiny,
              }}
            >
              <Txt
                style={{
                  color: l === lang ? t.secondary : palette.white,
                  fontWeight: "800",
                  fontSize: type.micro,
                }}
              >
                {l === "en" ? "EN" : l === "hi" ? "हिं" : "తె"}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>
      {!!scroll && (
        <Animated.View style={[{ overflow: "hidden" }, a]}>
          <Pressable
            onPress={() => router.push("/doctors")}
            style={[
              styles.row,
              {
                backgroundColor: palette.white,
                borderRadius: 20,
                minHeight: 48,
                marginTop: space.md,
                paddingHorizontal: space.md,
              },
            ]}
          >
            <Icon name="search" size={18} />
            <Txt
              style={{ color: palette.muted, fontSize: type.caption, flex: 1 }}
            >
              Search doctors, labs, medicines…
            </Txt>
            <Txt
              style={{
                fontSize: type.micro,
                fontWeight: "800",
                color: t.primary,
              }}
            >
              {lang.toUpperCase()}
            </Txt>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );
}
