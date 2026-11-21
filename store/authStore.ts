import { requestOtp, verifyOtp } from "../services/authServices";
import { Platform } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storage, persistenceStorage } from "./storage";
import { readSession, saveSession, type Session } from "../utilities/session";
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
export const useAuth = create<Auth>()(persist((set, get) => ({
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
      await useAuth.persist.rehydrate();
      const session = await readSession();
      set({ session, hydrated: true });
    } catch {
      set({
        hydrated: true,
        error: "Session could not be restored. Please sign in.",
      });
    }
  },
  finishOnboarding: async () => {
    set({ onboarded: true });
  },
  sendOtp: async (phone) => {
    if (!/^[6-9]\d{9}$/.test(phone)) {
      set({ error: "Enter a valid 10-digit Indian mobile number." });
      return false;
    }
    if (get().busy) return false;
    set({ busy: true, error: null });
    try {
      const otpSentAt = await requestOtp(phone);
      set({ phone, otpSentAt, busy: false });
      return true;
    } catch (error) {
      set({ busy: false, error: error instanceof Error ? error.message : "Could not send code. Please retry." });
      return false;
    }
  },
  verify: async (otp) => {
    if (get().busy) return false;
    set({ busy: true, error: null });
    try {
      const token = await verifyOtp(get().phone, otp, get().otpSentAt);
      const name = (await storage.read<string>(`name:${get().phone}`)) ?? "";
      const session = { token, phone: get().phone, name };
      await saveSession(session);
      set({ session, busy: false, name });
      return true;
    } catch (error) {
      set({ busy: false, error: error instanceof Error ? error.message : "Could not save your session. Please retry." });
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
      const { cancelReminders } = await import("../utilities/reminders");
      await cancelReminders().catch(() => {});
    }
    await saveSession(null);
    set({ session: null, phone: "", name: "", error: null, otpSentAt: 0 });
  },
}), {
  name: "auth-preferences",
  storage: createJSONStorage(() => persistenceStorage(() => {
    const message = "Preferences could not be saved. Please check device storage.";
    if (useAuth.getState().error !== message) useAuth.setState({ error: message });
  })),
  skipHydration: true,
  partialize: (s) => ({ onboarded: s.onboarded }),
}));
