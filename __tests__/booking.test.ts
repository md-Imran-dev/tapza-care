import { test, expect, beforeEach, afterEach, jest } from "@jest/globals";
import { useCare } from "../src/state/app";
import { DOCTORS } from "../src/data/mockData";
import { getSlots, mockServer } from "../src/lib/api";
import { storage } from "../src/lib/storage";
beforeEach(() => {
  useCare.getState().reset();
  useCare.setState({ scope: "9999999999", hydrated: true, doctors: DOCTORS });
  useCare.getState().updateNetwork({ latencyMs: 0 });
});
afterEach(() => mockServer.reset());
async function available() {
  return (await getSlots("d1", "2026-11-20")).find((s) => s.available)!;
}
test("optimistically inserts pending booking and reconciles confirmation", async () => {
  const slot = await available();
  const result = useCare.getState().book("d1", "2026-11-20", slot.id);
  expect(useCare.getState().bookings[0].status).toBe("pending");
  expect(await result).toBe(true);
  expect(useCare.getState().bookings[0].status).toBe("confirmed");
  expect(useCare.getState().bookings[0].slotId).toBe(slot.id);
});
test("409 rolls back only the rejected optimistic booking", async () => {
  const slots = await getSlots("d1", "2026-11-20");
  const [one, two] = slots.filter((s) => s.available);
  await useCare.getState().book("d1", "2026-11-20", one.id);
  const confirmed = useCare.getState().bookings[0];
  useCare.getState().updateNetwork({ failBooking: true });
  expect(await useCare.getState().book("d1", "2026-11-20", two.id)).toBe(false);
  expect(useCare.getState().bookings).toEqual([confirmed]);
});
test("offline queue persists and syncs through the backend on reconnect", async () => {
  const slot = await available();
  useCare.getState().updateNetwork({ offline: true });
  await useCare.getState().book("d1", "2026-11-20", slot.id);
  expect(useCare.getState().bookings[0].status).toBe("queued");
  await new Promise((r) => setTimeout(r, 0));
  const saved = await storage.read<{ bookings: { status: string }[] }>(
    "patient:9999999999",
  );
  expect(saved?.bookings[0].status).toBe("queued");
  useCare.getState().updateNetwork({ offline: false });
  while (useCare.getState().syncing) await new Promise((r) => setTimeout(r, 1));
  expect(useCare.getState().bookings[0].status).toBe("confirmed");
});
test("double confirmation does not create duplicate bookings", async () => {
  const slot = await available();
  const first = useCare.getState().book("d1", "2026-11-20", slot.id);
  expect(await useCare.getState().book("d1", "2026-11-20", slot.id)).toBe(
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
