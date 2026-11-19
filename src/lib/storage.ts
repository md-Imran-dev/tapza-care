import AsyncStorage from "@react-native-async-storage/async-storage";
export const storage = {
  async read<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(`tapza:${key}`);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  },
  write: (key: string, value: unknown) =>
    AsyncStorage.setItem(`tapza:${key}`, JSON.stringify(value)),
  remove: (key: string) => AsyncStorage.removeItem(`tapza:${key}`),
};
