import { LanguageLoader } from "@/components/LanguageLoader";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { setDynamicFeatureFlag } from "react-native-reanimated";
import { CONFIG_NORMAL } from "../data/mockData";
import { useAuth } from "../state/auth";
import { deriveTheme } from "../theme";
// Keep shared photos aligned with synchronously animated ancestor transforms.
setDynamicFeatureFlag("TRACK_SYNCHRONOUS_PROPS_IN_LAYOUT_ANIMATIONS", true);

export default function Layout() {
  const hydrated = useAuth((s) => s.hydrated);
  useEffect(() => {
    void useAuth.getState().hydrate();
  }, []);
  const t = deriveTheme(CONFIG_NORMAL.theme);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      {hydrated ? (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(secure)" />
        </Stack>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: t.colors.secondary,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color={t.colors.white} />
        </View>
      )}
      <LanguageLoader />
    </GestureHandlerRootView>
  );
}
