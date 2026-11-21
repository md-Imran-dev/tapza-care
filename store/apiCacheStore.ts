import { AxiosError } from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "./storage";

type CacheState = {
  cache: Record<string, unknown>;
  request: <T>(key: string, fetcher: () => Promise<T>) => Promise<T>;
};
export const useApiCache = create<CacheState>()(
  persist(
    (set, get) => ({
      cache: {},
      request: async <T>(key: string, fetcher: () => Promise<T>) => {
        try {
          const result = await fetcher();
          set((s) => ({ cache: { ...s.cache, [key]: result } }));
          return result;
        } catch (error) {
          if (error instanceof AxiosError && error.code === "ERR_NETWORK") {
            const cached = get().cache[key];
            if (cached !== null && cached !== undefined) return cached as T;
          }
          throw error;
        }
      },
    }),
    {
      name: "api-cache",
      storage: createJSONStorage(() => zustandStorage),
      partialize: (s) => ({ cache: s.cache }),
      skipHydration: true,
    },
  ),
);
