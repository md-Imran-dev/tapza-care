import { useApiCache } from "./apiCacheStore";
import { useSlotStore } from "./slotStore";
import { AxiosError } from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CONFIG_NORMAL, DOCTORS } from "../data/mockData";
import type {
  Booking,
  Doctor,
  Lang,
  LayoutConfig,
  Prescription,
} from "../data/types";
import {
  defaultNetwork,
  getConfig,
  getDoctors,
  getPrescriptions,
  mockServer,
  postBooking,
  type Network,
} from "../services/apiService";
import { parseConfig } from "../utilities/config";
import {
  findService,
  serviceReservationSchema,
  type ServiceReservation,
} from "../utilities/serviceCatalog";
import { storage, persistenceStorage } from "./storage";
type LoadStatus = "idle" | "loading" | "ready" | "error" | "cached";
type State = {
  config: LayoutConfig;
  festival: boolean;
  lang: Lang;
  languageChanging: boolean;
  languageError: string | null;
  doses: Record<string, boolean>;
  bookings: Booking[];
  doctors: Doctor[];
  prescriptions: Prescription[];
  offline: boolean;
  fail: boolean;
  slow: boolean;
  network: Network;
  configStatus: LoadStatus;
  dataStatus: LoadStatus;
  message: string | null;
  scope: string | null;
  hydrated: boolean;
  syncing: boolean;
  hydrate: (phone: string) => Promise<void>;
  loadConfig: () => Promise<void>;
  loadData: () => Promise<void>;
  toggleTheme: () => Promise<void>;
  setLang: (lang: Lang) => Promise<void>;
  toggleDose: (key: string) => void;
  setNetwork: (key: "offline" | "fail" | "slow", value: boolean) => void;
  updateNetwork: (patch: Partial<Network>) => void;
  patch: (text: string) => boolean;
  book: (
    doctorId: string,
    date: string,
    slotId: string,
    service?: ServiceReservation,
  ) => Promise<boolean>;
  syncQueue: () => Promise<void>;
  reset: () => void;
};
let generation = 0;
let configRequest = 0;
let dataRequest = 0;
const seed = {
  config: CONFIG_NORMAL,
  festival: false,
  lang: "en" as Lang,
  languageChanging: false,
  languageError: null,
  doses: {},
  bookings: [],
  doctors: [],
  prescriptions: [],
  offline: false,
  fail: false,
  slow: false,
  network: { ...defaultNetwork },
  configStatus: "idle" as LoadStatus,
  dataStatus: "idle" as LoadStatus,
  message: null,
  scope: null,
  hydrated: false,
  syncing: false,
};
export const useCare = create<State>()(persist((set, get) => {
  return {
    ...seed,
    hydrate: async (phone) => {
      const current = ++generation;
      useCare.persist.setOptions({ name: "care:inactive" });
      set({ ...seed, scope: phone });
      try {
        if (current !== generation) return;
        await useApiCache.persist.rehydrate();
        if (current !== generation) return;
        const cached = await storage.read<LayoutConfig>("config");
        if (current !== generation) return;
        if (cached) {
          try { set({ config: parseConfig(cached) }); } catch { /* Keep the valid default config. */ }
        }
        useCare.persist.setOptions({ name: `care:${phone}` });
        await useCare.persist.rehydrate();
        if (current !== generation) return;
        set({ hydrated: true, festival: get().config.theme.festival.name === "diwali" });
        mockServer.setFestival(get().festival);
        await Promise.all([get().loadConfig(), get().loadData()]);
        if (current === generation) await get().syncQueue();
      } catch {
        if (current === generation)
          set({
            hydrated: true,
            message:
              "Saved data could not be restored. You can still use the app.",
          });
      }
    },
    loadConfig: async () => {
      const request = ++configRequest;
      const current = generation;
      set({ configStatus: "loading" });
      try {
        const config = parseConfig(await getConfig());
        if (request !== configRequest || current !== generation) return;
        set({ config, configStatus: "ready", message: null });
        await storage.write("config", config);
      } catch {
        if (request === configRequest && current === generation)
          set({
            configStatus: "cached",
            message:
              "Could not refresh the home. Showing the last available layout.",
          });
      }
    },
    loadData: async () => {
      const request = ++dataRequest;
      const current = generation;
      set({ dataStatus: "loading" });
      try {
        const [doctors, prescriptions] = await Promise.all([
          useApiCache.getState().request("doctors", getDoctors),
          useApiCache.getState().request("prescriptions", getPrescriptions),
        ]);
        if (request === dataRequest && current === generation)
          set({ doctors, prescriptions, dataStatus: "ready" });
      } catch {
        if (request === dataRequest && current === generation)
          set({ dataStatus: "error" });
      }
    },
    toggleTheme: async () => {
      const festival = !get().festival;
      set({ festival });
      mockServer.setFestival(festival);
      await get().loadConfig();
    },
    setLang: async (lang) => {
      if (
        !["en", "hi", "te"].includes(lang) ||
        get().languageChanging ||
        get().lang === lang
      )
        return;
      const current = generation;
      const scope = get().scope;
      set({ languageChanging: true, languageError: null });
      try {
        // Keep feedback visible for a short local save; no network request is needed.
        await Promise.all([
          storage.write(`language:${scope ?? "local"}`, lang),
          new Promise((resolve) => setTimeout(resolve, 250)),
        ]);
        if (current === generation) {
          set({ lang });
        }
      } catch {
        if (current === generation)
          set({ languageError: "Could not change language. Please retry." });
      } finally {
        if (current === generation) set({ languageChanging: false });
      }
    },
    toggleDose: (key) => {
      set((s) => ({ doses: { ...s.doses, [key]: !s.doses[key] } }));
    },
    setNetwork: (key, value) => {
      get().updateNetwork(
        key === "offline"
          ? { offline: value }
          : key === "fail"
            ? { failBooking: value }
            : { latencyMs: value ? 2600 : 500 },
      );
    },
    updateNetwork: (patch) => {
      const n = { ...get().network, ...patch };
      mockServer.setNetwork(n);
      set({
        network: n,
        offline: n.offline,
        fail: n.failBooking,
        slow: n.latencyMs > 1000,
      });
      if (patch.offline === false) void get().syncQueue();
    },
    patch: (text) => {
      try {
        const config = parseConfig(JSON.parse(text));
        mockServer.patch(config);
        set({ config, configStatus: "ready" });
        void storage.write("config", config);
        return true;
      } catch {
        return false;
      }
    },
    book: async (doctorId, date, slotId, service) => {
      const current = generation;
      const s = get();
      const existing = s.bookings.find(
        (b) =>
          b.slotId === slotId &&
          ["pending", "confirmed", "queued"].includes(b.status),
      );
      if (existing) return false;
      const doc =
        s.doctors.find((d) => d.id === doctorId) ??
        DOCTORS.find((d) => d.id === doctorId);
      if (service) {
        const parsed = serviceReservationSchema.safeParse(service);
        const item = findService(s.config, service.serviceId);
        if (
          !parsed.success ||
          !item ||
          doctorId !== `service:${item.id}` ||
          service.serviceName !== item.name ||
          service.priceInr !== item.priceInr ||
          service.fulfillment !== (item.fulfillment ?? "clinic")
        )
          return false;
        service = parsed.data;
      } else if (!doc) return false;
      if (!slotId.startsWith(`${doctorId}|${date}|`)) return false;
      const index = Number(slotId.split("|")[2]);
      const times = [
        "09:00 AM",
        "09:45 AM",
        "10:30 AM",
        "12:00 PM",
        "01:15 PM",
        "04:30 PM",
        "06:30 PM",
        "07:15 PM",
        "08:30 PM",
      ];
      const id = `visit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const pending: Booking = {
        id,
        doctorId,
        doctorName: service ? "Clinic services team" : doc!.name,
        ...(service ? { service } : {}),
        date,
        slotId,
        time: times[index] ?? slotId,
        status: s.offline ? "queued" : "pending",
        tokenNo: 0,
      };
      set({ bookings: [pending, ...s.bookings] });
      if (s.offline) return true;
      try {
        const result = await postBooking(doctorId, slotId, id, service);
        if (current !== generation) return false;
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? result : b)),
        }));
          return true;
      } catch (error) {
        if (current !== generation) return false;
        const offline =
          error instanceof AxiosError && error.code === "ERR_NETWORK";
        set((s) => ({
          bookings: offline
            ? s.bookings.map((b) =>
                b.id === id ? { ...b, status: "queued" } : b,
              )
            : s.bookings.filter((b) => b.id !== id),
        }));
          return offline;
      }
    },
    syncQueue: async () => {
      if (get().syncing || get().offline) return;
      const current = generation;
      set({ syncing: true });
      try {
        for (const booking of get().bookings.filter(
          (b) => b.status === "queued",
        )) {
          if (get().offline || current !== generation) break;
          try {
            const result = await postBooking(
              booking.doctorId,
              booking.slotId,
              booking.id,
              booking.service,
            );
            if (current !== generation) return;
            set((s) => ({
              bookings: s.bookings.map((b) =>
                b.id === booking.id ? result : b,
              ),
            }));
          } catch (error) {
            if (current !== generation) return;
            if (
              error instanceof AxiosError &&
              [400, 409].includes(error.response?.status ?? 0)
            )
              set((s) => ({
                bookings: s.bookings.map((b) =>
                  b.id === booking.id ? { ...b, status: "failed" } : b,
                ),
              }));
            else break;
          }
        }
      } finally {
        if (current === generation) set({ syncing: false });
      }
    },
    reset: () => {
      generation++;
      useSlotStore.getState().reset();
      useCare.persist.setOptions({ name: "care:inactive" });
      mockServer.reset();
      set({ ...seed });
    },
  };
}, {
  name: "care:inactive",
  storage: createJSONStorage(() => persistenceStorage(() => {
    const message = "Changes could not be saved. Please check device storage.";
    if (useCare.getState().message !== message) useCare.setState({ message: message });
  })),
  skipHydration: true,
  partialize: (s) => ({ config: s.config, scope: s.scope, doses: s.doses, bookings: s.bookings, lang: s.lang }),
  merge: (saved, current) => {
    const value = saved as Partial<State> | undefined;
    if (!value || value.scope !== current.scope) return current;
    try {
      const config = parseConfig(value.config);
      return { ...current, config, festival: config.theme.festival.name === "diwali",
        doses: value.doses ?? {},
        bookings: (value.bookings ?? []).map((b) => b.status === "pending" ? { ...b, status: "queued" as const } : b),
        lang: ["en", "hi", "te"].includes(value.lang ?? "") ? value.lang! : current.lang,
      };
    } catch { return current; }
  },
}));
