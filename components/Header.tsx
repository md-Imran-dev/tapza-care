import { useTheme } from "@/hooks/useTheme";
import { space, type, metrics as uiMetrics, radius as uiRadius } from "@/theme";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCare } from "../store/careStore";
import { Icon, styles, Txt } from "./ui";
export function Header({ scroll }: { scroll?: SharedValue<number> }) {
  const palette = useTheme().colors;
  const t = useCare((s) => s.config.theme);
  const lang = useCare((s) => s.lang);
  const languageChanging = useCare((s) => s.languageChanging);
  const languageError = useCare((s) => s.languageError);
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
        paddingTop: insets.top + space.md,
        paddingHorizontal: space.xl,
        paddingBottom: space.md,
      }}
    >
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <View style={[styles.row, { flex: 1 }]}>
          <View
            style={{
              height: uiMetrics.compactTouch,
              width: uiMetrics.compactTouch,
              borderRadius: uiRadius.tile,
              backgroundColor: palette.whiteTranslucent,
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
            <Txt style={{ fontSize: type.micro, color: palette.onDarkMuted }}>
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
              accessibilityLabel={
                l === "en" ? "English" : l === "hi" ? "हिन्दी" : "తెలుగు"
              }
              key={l}
              disabled={languageChanging}
              accessibilityState={{
                selected: l === lang,
                disabled: languageChanging,
              }}
              onPress={() => void setLang(l)}
              style={{
                minWidth: uiMetrics.compactTouch,
                minHeight: uiMetrics.compactTouch,
                borderRadius: uiRadius.avatar,
                backgroundColor: l === lang ? palette.white : palette.whiteTint,
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
      {!!languageError && (
        <Txt accessibilityRole="alert" style={{ color: palette.white }}>
          {languageError}
        </Txt>
      )}
      {!!scroll && (
        <Animated.View style={[{ overflow: "hidden" }, a]}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push("/doctors")}
            style={[
              styles.row,
              {
                backgroundColor: palette.white,
                borderRadius: uiRadius.panel,
                minHeight: uiMetrics.touch,
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
