import { afterEach, beforeEach, expect, jest, test } from "@jest/globals";
import { defaultNetwork, mockServer } from "../services/apiService";
import { CONFIG_NORMAL } from "../data/mockData";
import { useCare } from "../store/careStore";
import { mmkv, storage } from "../store/storage";
import { useAuth } from "../store/authStore";

beforeEach(async () => {
  useCare.getState().reset();
  mmkv.clearAll();
});
afterEach(() => { jest.restoreAllMocks(); useCare.getState().reset(); });

test("patient snapshots survive reset, stay isolated and exclude transient request state", async () => {
  useCare.persist.setOptions({ name: "care:111" });
  useCare.setState({ scope: "111", config: CONFIG_NORMAL, lang: "te", doses: { breakfast: true }, languageChanging: true, syncing: true });
  const saved = JSON.parse(mmkv.getString("care:111")!);
  expect(saved.state.syncing).toBeUndefined();
  expect(saved.state.languageChanging).toBeUndefined();
  useCare.getState().reset();
  useCare.persist.setOptions({ name: "care:222" });
  useCare.setState({ scope: "222" });
  await useCare.persist.rehydrate();
  expect(useCare.getState().doses).toEqual({});
  useCare.getState().reset();
  useCare.setState({ scope: "111" });
  useCare.persist.setOptions({ name: "care:111" });
  await useCare.persist.rehydrate();
  expect(useCare.getState()).toMatchObject({ lang: "te", doses: { breakfast: true }, syncing: false, languageChanging: false });
});

test("auth persistence does not copy session credentials into MMKV", () => {
  useAuth.setState({ onboarded: true, session: { phone: "111", token: "secret", name: "Demo" } });
  const saved = JSON.parse(mmkv.getString("auth-preferences")!);
  expect(saved.state).toEqual({ onboarded: true });
});


test("normal patient hydration restores MMKV data after switching accounts", async () => {
  mockServer.setNetwork({ ...defaultNetwork, latencyMs: 0 });
  await useCare.getState().hydrate("111");
  await useCare.getState().setLang("hi");
  useCare.getState().toggleDose("breakfast");
  useCare.getState().reset();
  mockServer.setNetwork({ ...defaultNetwork, latencyMs: 0 });
  await useCare.getState().hydrate("222");
  expect(useCare.getState().doses).toEqual({});
  await useCare.getState().hydrate("111");
  expect(useCare.getState()).toMatchObject({ lang: "hi", doses: { breakfast: true }, hydrated: true });
});


test("failed MMKV writes keep in-memory changes and expose a save error", () => {
  useCare.persist.setOptions({ name: "care:111" });
  useCare.setState({ scope: "111" });
  jest.spyOn(mmkv, "set").mockImplementation(() => { throw new Error("Storage full"); });
  expect(() => useCare.getState().toggleDose("breakfast")).not.toThrow();
  expect(useCare.getState().doses.breakfast).toBe(true);
  expect(useCare.getState().message).toBe("Changes could not be saved. Please check device storage.");
});
