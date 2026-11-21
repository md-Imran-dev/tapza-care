import { useTheme } from "@/hooks/useTheme";
import {
  metrics as uiMetrics,
  radius as uiRadius,
  space as uiSpace,
} from "@/theme";
import { translateText } from "@/utilities/i18n";
import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, Txt } from "../../../components/ui";
import { useCare } from "../../../store/careStore";
const routeNames = {
  home: "index",
  bookings: "bookings",
  prescriptions: "prescriptions",
  profile: "profile",
} as const;
export default function Layout() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
  const lang = useCare((s) => s.lang);
  const tabs = useCare((s) => s.config.tabs);
  return (
    <Tabs
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: t.colors.tabActive,
        tabBarInactiveTintColor: t.colors.inactive,
        tabBarStyle: {
          height:
            t.metrics.tabHeight + Math.max(0, fontScale - 1) * t.metrics.touch,
          paddingTop: uiSpace.sm,
          paddingBottom: uiSpace.sm,
          marginHorizontal: uiSpace.md,
          marginBottom: Math.max(insets.bottom, t.space.sm),
          marginTop: uiSpace.xs,
          backgroundColor: t.colors.tabBackground,
          borderRadius: uiRadius.doctor,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: t.colors.surface,
          shadowColor: t.colors.textPrimary,
          shadowOffset: {
            width: uiMetrics.none,
            height: uiMetrics.indicatorHeight,
          },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 5,
        },
        tabBarIconStyle: {
          width: t.metrics.icon * fontScale,
          height: t.metrics.icon * fontScale,
        },
        tabBarLabelStyle: {
          fontSize: t.type.caption,
          fontWeight: "500",
          marginTop: uiSpace.labelGap,
        },
        tabBarActiveBackgroundColor: "transparent",
        tabBarItemStyle: {
          minHeight: uiMetrics.touch,
          paddingHorizontal: uiSpace.tiny,
        },
      }}
    >
      {[
        ...tabs.map((t) => t.screen),
        ...(["home", "bookings", "prescriptions", "profile"] as const).filter(
          (s) => !tabs.some((t) => t.screen === s),
        ),
      ].map((screen) => {
        const tab = tabs.find((tb) => tb.screen === screen);
        return (
          <Tabs.Screen
            key={screen}
            name={routeNames[screen]}
            options={{
              href: tab ? undefined : null,
              title: translateText(
                tab?.label === "Rx" ? "Prescriptions" : (tab?.label ?? screen),
                lang,
              ),
              tabBarLabel: ({ color }) => (
                <Txt
                  style={{
                    color: String(color),
                    fontSize: t.type.caption,
                    textAlign: "center",
                    marginTop: t.space.labelGap,
                  }}
                >
                  {translateText(
                    tab?.label === "Rx"
                      ? "Prescriptions"
                      : (tab?.label ?? screen),
                    lang,
                  )}
                </Txt>
              ),
              tabBarIcon: ({ color }) => (
                <Icon
                  name={
                    screen === "profile"
                      ? "profile"
                      : screen === "bookings"
                        ? "calendarOutline"
                        : (tab?.icon ?? "home")
                  }
                  color={String(color)}
                  size={21}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
