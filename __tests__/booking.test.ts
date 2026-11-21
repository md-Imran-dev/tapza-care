import { afterEach, beforeEach, expect, test } from "@jest/globals";
import { localDateKey } from "../utilities/dates";
import { DOCTORS } from "../data/mockData";
import { getSlots, mockServer } from "../services/apiService";
import { mmkv } from "../store/storage";
import { useSlotStore } from "../store/slotStore";
import { useCare } from "../store/careStore";
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const date = localDateKey(tomorrow);
beforeEach(() => {
  useCare.getState().reset();
  useCare.persist.setOptions({ name: "care:9999999999" });
  useCare.setState({ scope: "9999999999", hydrated: true, doctors: DOCTORS });
  useCare.getState().updateNetwork({ latencyMs: 0 });
});
afterEach(() => mockServer.reset());
async function available() {
  return (await getSlots("d1", date)).find((s) => s.available)!;
}
test("optimistically inserts pending booking and reconciles confirmation", async () => {
  const slot = await available();
  const result = useCare.getState().book("d1", date, slot.id);
  expect(useCare.getState().bookings[0].status).toBe("pending");
  expect(await result).toBe(true);
  expect(useCare.getState().bookings[0].status).toBe("confirmed");
  expect(useCare.getState().bookings[0].slotId).toBe(slot.id);
});
test("409 rolls back only the rejected optimistic booking", async () => {
  const slots = await getSlots("d1", date);
  const [one, two] = slots.filter((s) => s.available);
  await useCare.getState().book("d1", date, one.id);
  const confirmed = useCare.getState().bookings[0];
  useCare.getState().updateNetwork({ failBooking: true });
  expect(await useCare.getState().book("d1", date, two.id)).toBe(false);
  expect(useCare.getState().bookings).toEqual([confirmed]);
});
test("offline queue persists and syncs through the backend on reconnect", async () => {
  const slot = await available();
  useCare.getState().updateNetwork({ offline: true });
  await useCare.getState().book("d1", date, slot.id);
  expect(useCare.getState().bookings[0].status).toBe("queued");
  await new Promise((r) => setTimeout(r, 0));
  const saved = JSON.parse(mmkv.getString("care:9999999999")!).state;
  expect(saved?.bookings[0].status).toBe("queued");
  useCare.getState().updateNetwork({ offline: false });
  while (useCare.getState().syncing) await new Promise((r) => setTimeout(r, 1));
  expect(useCare.getState().bookings[0].status).toBe("confirmed");
});
test("double confirmation does not create duplicate bookings", async () => {
  const slot = await available();
  const first = useCare.getState().book("d1", date, slot.id);
  expect(await useCare.getState().book("d1", date, slot.id)).toBe(
    false,
  );
  await first;
  expect(useCare.getState().bookings).toHaveLength(1);
});
test("config failure preserves last good layout", async () => {
  const previous = useCare.getState().config;
  useCare.getState().updateNetwork({ failConfig: true });
  await useCare.getState().loadConfig();
  expect(useCare.getState().config).toBe(previous);
  expect(useCare.getState().configStatus).toBe("cached");
});

test("previously loaded slots remain bookable from cache while offline", async () => {
  await useSlotStore.getState().load("d1", date);
  const slots = useSlotStore.getState().results[`doctor:d1:${date}`].data!;
  useCare.getState().updateNetwork({ offline: true });
  await useSlotStore.getState().load("d1", date);
  const cached = useSlotStore.getState().results[`doctor:d1:${date}`].data!;
  expect(cached).toEqual(slots);
  const slot = cached.find((s) => s.available)!;
  expect(await useCare.getState().book("d1", date, slot.id)).toBe(true);
  expect(useCare.getState().bookings[0].status).toBe("queued");
});
