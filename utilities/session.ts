import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
export type Session = { token: string; phone: string; name: string };
export async function readSession(): Promise<Session | null> {
  const raw =
    Platform.OS === "web"
      ? typeof sessionStorage !== "undefined"
        ? sessionStorage.getItem("tapza.session")
        : null
      : await SecureStore.getItemAsync("tapza.session");
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    return typeof s.token === "string" &&
      typeof s.phone === "string" &&
      typeof s.name === "string"
      ? s
      : null;
  } catch {
    return null;
  }
}
export async function saveSession(value: Session | null) {
  if (Platform.OS === "web") {
    if (value) sessionStorage.setItem("tapza.session", JSON.stringify(value));
    else sessionStorage.removeItem("tapza.session");
  } else if (value)
    await SecureStore.setItemAsync("tapza.session", JSON.stringify(value));
  else await SecureStore.deleteItemAsync("tapza.session");
}
