import { useEffect } from "react";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../state/auth";
import { deriveTheme } from "../theme";
import { CONFIG_NORMAL } from "../data/mockData";
import "react-native-reanimated";
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
    </GestureHandlerRootView>
  );
}
