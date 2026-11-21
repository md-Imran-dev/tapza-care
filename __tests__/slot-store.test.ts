import { afterEach, expect, jest, test } from "@jest/globals";
import { useSlotStore } from "../store/slotStore";
import { useApiCache } from "../store/apiCacheStore";
import * as api from "../services/apiService";
import type { Slot } from "../data/types";

afterEach(() => { jest.restoreAllMocks(); useSlotStore.getState().reset(); useApiCache.setState({ cache: {} }); });

test("a failed slot request exposes an error and a retry replaces it", async () => {
  const request = jest.spyOn(api, "getSlots").mockRejectedValueOnce(new Error("Unavailable")).mockResolvedValueOnce([]);
  await useSlotStore.getState().load("d1", "2026-11-21");
  expect(useSlotStore.getState().results["doctor:d1:2026-11-21"]).toMatchObject({ loading: false, error: "Unavailable" });
  await useSlotStore.getState().load("d1", "2026-11-21");
  expect(request).toHaveBeenCalledTimes(2);
  expect(useSlotStore.getState().results["doctor:d1:2026-11-21"]).toEqual({ data: [], loading: false, error: null });
});

test("a request finishing after logout/reset cannot repopulate slot state", async () => {
  let resolve!: (slots: Slot[]) => void;
  jest.spyOn(api, "getSlots").mockReturnValue(new Promise<Slot[]>((done) => { resolve = done; }));
  const pending = useSlotStore.getState().load("d1", "2026-11-21");
  useSlotStore.getState().reset();
  resolve([]);
  await pending;
  expect(useSlotStore.getState().results).toEqual({});
});
