import { Tabs } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../../../components/ui";
import { useCare } from "../../../state/app";
const routeNames = {
  home: "index",
  bookings: "bookings",
  prescriptions: "prescriptions",
  profile: "profile",
} as const;
export default function Layout() {
  const insets = useSafeAreaInsets();
  const { fontScale } = useWindowDimensions();
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
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarLabelPosition: "below-icon",
        tabBarActiveTintColor: "#7A73AD",
        tabBarInactiveTintColor: "#7C8586",
        tabBarStyle: {
          height: 64 + Math.max(0, fontScale - 1) * 20,
          paddingTop: 8,
          paddingBottom: 8,
          marginHorizontal: 12,
          marginBottom: Math.max(insets.bottom, 8),
          marginTop: 6,
          backgroundColor: "#F2F6F5",
          borderRadius: 26,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "#FFFFFF",
          shadowColor: "#293F3A",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 5,
        },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "500", marginTop: 3 },
        tabBarActiveBackgroundColor: "transparent",
        tabBarItemStyle: {
          minHeight: 48,
          paddingHorizontal: 2,
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
                  name={screen === "profile" ? "profile" : screen === "bookings" ? "calendarOutline" : tab?.icon ?? "home"}
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
