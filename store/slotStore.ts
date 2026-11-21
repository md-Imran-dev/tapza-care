import type { Slot } from "@/data/types";
import { getServiceSlots, getSlots } from "@/services/apiService";
import { create } from "zustand";
import { useApiCache } from "./apiCacheStore";

type SlotResult = {
  data: Slot[] | null;
  loading: boolean;
  error: string | null;
};
type SlotState = {
  results: Record<string, SlotResult>;
  load: (id: string, date: string, service?: boolean) => Promise<void>;
  reset: () => void;
};
export const slotKey = (id: string, date: string, service = false) =>
  `${service ? "service" : "doctor"}:${id}:${date}`;
const requests = new Map<string, number>();
let generation = 0;
export const useSlotStore = create<SlotState>((set) => ({
  results: {},
  load: async (id, date, service = false) => {
    const key = slotKey(id, date, service);
    const request = (requests.get(key) ?? 0) + 1;
    const current = generation;
    requests.set(key, request);
    set((s) => ({
      results: {
        ...s.results,
        [key]: { data: null, loading: true, error: null },
      },
    }));
    try {
      const data = await useApiCache
        .getState()
        .request(`${service ? "service-slots" : "slots"}:${id}:${date}`, () =>
          service ? getServiceSlots(id, date) : getSlots(id, date),
        );
      if (current === generation && requests.get(key) === request)
        set((s) => ({
          results: {
            ...s.results,
            [key]: { data, loading: false, error: null },
          },
        }));
    } catch (error) {
      if (current === generation && requests.get(key) === request)
        set((s) => ({
          results: {
            ...s.results,
            [key]: {
              data: null,
              loading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Could not load available times.",
            },
          },
        }));
    }
  },
  reset: () => {
    generation++;
    requests.clear();
    set({ results: {} });
  },
}));
