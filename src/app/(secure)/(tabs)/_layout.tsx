import { Tabs } from "expo-router";
import { Icon } from "../../../components/ui";
import { useCare } from "../../../state/app";
import { useTheme } from "../../../theme";
const routeNames = {
  home: "index",
  bookings: "bookings",
  prescriptions: "prescriptions",
  profile: "profile",
} as const;
export default function Layout() {
  const t = useTheme();
  const lang = useCare((s) => s.lang);
  const tabs = useCare((s) => s.config.tabs);
  const labels =
    lang === "hi"
      ? ["होम", "बुकिंग", "पर्चा", "प्रोफ़ाइल"]
      : lang === "te"
        ? ["హోమ్", "బుకింగ్‌లు", "మందుల చీటీ", "ప్రొఫైల్"]
        : null;
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.inactive,
        tabBarStyle: {
          minHeight: t.metrics.tabHeight,
          paddingTop: t.space.sm,
          paddingBottom: t.space.lg,
          backgroundColor: t.colors.surface,
          borderTopColor: t.colors.line,
        },
        tabBarLabelStyle: { fontSize: t.type.micro, fontWeight: "800" },
        tabBarActiveBackgroundColor: t.colors.primary + "0C",
        tabBarItemStyle: {
          borderRadius: t.radius.lg,
          marginHorizontal: t.space.xxs,
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
              title:
                labels?.[
                  ["home", "bookings", "prescriptions", "profile"].indexOf(
                    screen,
                  )
                ] ??
                tab?.label ??
                screen,
              tabBarIcon: ({ color }) => (
                <Icon
                  name={tab?.icon ?? "home"}
                  color={String(color)}
                  size={t.metrics.icon}
                />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
