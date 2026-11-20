import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { storage } from "../lib/storage";
type Session = { token: string; phone: string; name: string };
async function readSession(): Promise<Session | null> {
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
async function saveSession(value: Session | null) {
  if (Platform.OS === "web") {
    if (value) sessionStorage.setItem("tapza.session", JSON.stringify(value));
    else sessionStorage.removeItem("tapza.session");
  } else if (value)
    await SecureStore.setItemAsync("tapza.session", JSON.stringify(value));
  else await SecureStore.deleteItemAsync("tapza.session");
}
type Auth = {
  hydrated: boolean;
  session: Session | null;
  onboarded: boolean;
  phone: string;
  name: string;
  otpSentAt: number;
  busy: boolean;
  error: string | null;
  hydrate: () => Promise<void>;
  finishOnboarding: () => Promise<void>;
  sendOtp: (phone: string) => Promise<boolean>;
  verify: (otp: string) => Promise<boolean>;
  register: (name: string) => Promise<void>;
  logout: () => Promise<void>;
};
export const useAuth = create<Auth>((set, get) => ({
  hydrated: false,
  session: null,
  onboarded: false,
  phone: "",
  name: "",
  otpSentAt: 0,
  busy: false,
  error: null,
  hydrate: async () => {
    try {
      const [session, onboarded] = await Promise.all([
        readSession(),
        storage.read<boolean>("onboarded"),
      ]);
      set({ session, onboarded: !!onboarded, hydrated: true });
    } catch {
      set({
        hydrated: true,
        error: "Session could not be restored. Please sign in.",
      });
    }
  },
  finishOnboarding: async () => {
    await storage.write("onboarded", true);
    set({ onboarded: true });
  },
  sendOtp: async (phone) => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      set({ error: "Enter a valid 10-digit Indian mobile number." });
      return false;
    }
    if (get().busy) return false;
    set({ busy: true, error: null });
    await new Promise((r) => setTimeout(r, 500));
    set({ phone, otpSentAt: Date.now(), busy: false });
    return true;
  },
  verify: async (otp) => {
    if (get().busy) return false;
    set({ busy: true, error: null });
    await new Promise((r) => setTimeout(r, 500));
    if (
      !get().phone ||
      Date.now() - get().otpSentAt > 300000 ||
      otp !== "123456"
    ) {
      set({
        busy: false,
        error: "Incorrect or expired code. Use demo code 123456 or resend.",
      });
      return false;
    }
    try {
      const name = (await storage.read<string>(`name:${get().phone}`)) ?? "";
      const session = { token: `mock-${Date.now()}`, phone: get().phone, name };
      await saveSession(session);
      set({ session, busy: false, name });
      return true;
    } catch {
      set({ busy: false, error: "Could not save your session. Please retry." });
      return false;
    }
  },
  register: async (name) => {
    if (name.trim().length < 2) throw new Error("Please enter your full name.");
    const session = get().session;
    if (!session) throw new Error("Sign in first.");
    await storage.write(`name:${session.phone}`, name.trim());
    const next = { ...session, name: name.trim() };
    await saveSession(next);
    set({ session: next, name: next.name });
  },
  logout: async () => {
    if (Platform.OS !== "web") {
      const { cancelReminders } = await import("../lib/reminders");
      await cancelReminders().catch(() => {});
    }
    await saveSession(null);
    set({ session: null, phone: "", name: "", error: null, otpSentAt: 0 });
  },
}));
