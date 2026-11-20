import { Redirect, Stack, useSegments } from "expo-router";
import { useAuth } from "../../state/auth";
export default function AuthLayout() {
  const session = useAuth((s) => s.session);
  const onboarded = useAuth((s) => s.onboarded);
  const segments = useSegments();
  if (session?.name) return <Redirect href="/" />;
  if (session && !session.name && segments.at(-1) !== "signup")
    return <Redirect href="/auth/signup" />;
  if (!onboarded && segments.at(-1) !== "onboarding")
    return <Redirect href="/auth/onboarding" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
