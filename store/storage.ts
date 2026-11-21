import { Platform } from "react-native";
import { createMMKV } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";

export const mmkv = createMMKV({ id: "tapza-storage" });
const isServer = () => Platform.OS === "web" && typeof window === "undefined";

export const zustandStorage: StateStorage = {
  getItem: (name) =>
    isServer() || name === "care:inactive"
      ? null
      : (mmkv.getString(name) ?? null),
  setItem: (name, value) => {
    if (!isServer() && name !== "care:inactive") mmkv.set(name, value);
  },
  removeItem: (name) => {
    if (!isServer()) mmkv.remove(name);
  },
};

// Small JSON helpers for saved names and language preferences. Store snapshots use persist.
export const storage = {
  async read<T>(key: string): Promise<T | null> {
    const value = zustandStorage.getItem(`tapza:${key}`);
    if (!value || typeof value !== "string") return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  async write(key: string, value: unknown) {
    zustandStorage.setItem(`tapza:${key}`, JSON.stringify(value));
  },
  async remove(key: string) {
    zustandStorage.removeItem(`tapza:${key}`);
  },
};

// Keep in-memory changes usable while the owning store reports a failed save.
export function persistenceStorage(onError: () => void): StateStorage {
  return {
    ...zustandStorage,
    setItem: (name, value) => {
      try {
        zustandStorage.setItem(name, value);
      } catch {
        onError();
      }
    },
  };
}
