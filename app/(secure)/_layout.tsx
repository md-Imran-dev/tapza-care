import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useCare } from "../../state/app";
import { useAuth } from "../../state/auth";
import { useTheme } from "../../theme";
export default function SecureLayout() {
  const session = useAuth((s) => s.session);
  const hydrated = useCare((s) => s.hydrated);
  const scope = useCare((s) => s.scope);
  const t = useTheme();
  useEffect(() => {
    if (session?.phone) void useCare.getState().hydrate(session.phone);
    return () => useCare.getState().reset();
  }, [session?.phone]);
  if (!session) return <Redirect href="/auth/login" />;
  if (!session.name) return <Redirect href="/auth/signup" />;
  if (!hydrated || scope !== session.phone)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: t.colors.background,
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color={t.colors.primary} />
      </View>
    );
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="doctor/[id]" options={{ animation: "fade" }} />
      <Stack.Screen
        name="booking"
        options={{
          presentation: "transparentModal",
          animation: "fade",
          contentStyle: { backgroundColor: t.colors.transparent },
        }}
      />
    </Stack>
  );
}
