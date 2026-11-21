import { afterEach, beforeEach, expect, test } from "@jest/globals";
import { CONFIG_NORMAL, DOCTORS } from "../data/mockData";
import { getServiceSlots, mockServer, postBooking } from "../services/apiService";
import { localDateKey } from "../utilities/dates";
import { CLINIC_LOCATION, findService, type ServiceReservation } from "../utilities/serviceCatalog";
import { mmkv } from "../store/storage";
import { useCare } from "../store/careStore";
const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
const date = localDateKey(tomorrow);
const home = findService(CONFIG_NORMAL, "s4")!;
const request: ServiceReservation = { serviceId: home.id, serviceName: home.name, priceInr: 0, fulfillment: "home", address: "Flat 10, Demo Street, Hyderabad 500081" };
beforeEach(() => {
  useCare.getState().reset();
  useCare.persist.setOptions({ name: "care:9999999999" });
  useCare.setState({ scope: "9999999999", hydrated: true, doctors: DOCTORS });
  useCare.getState().updateNetwork({ latencyMs: 0 });
});
afterEach(() => mockServer.reset());
async function available(id = "s4") { return (await getServiceSlots(id, date)).find((s) => s.available)!; }

test("home collection confirms as a service, retains free price/address, and is idempotent", async () => {
  const slot = await available();
  expect(await useCare.getState().book("service:s4", date, slot.id, request)).toBe(true);
  const booking = useCare.getState().bookings[0];
  expect(booking.service).toEqual(request);
  expect(booking.doctorId).toBe("service:s4");
  expect(booking.doctorName).toBe("Clinic services team");
  expect((await postBooking("service:s4", slot.id, booking.id, request)).id).toBe(booking.id);
  await expect(postBooking("service:s4", slot.id, "different-request", request)).rejects.toMatchObject({ response: { status: 409 } });
});
test("rejects missing address, changed price and mismatched service slots", async () => {
  const slot = await available();
  expect(await useCare.getState().book("service:s4", date, slot.id, { ...request, address: "" })).toBe(false);
  await expect(postBooking("service:s4", slot.id, "bad-price", { ...request, priceInr: 99 })).rejects.toMatchObject({ response: { status: 400 } });
  await expect(postBooking("d1", slot.id, "bad-resource", request)).rejects.toMatchObject({ response: { status: 400 } });
  expect(useCare.getState().bookings).toHaveLength(0);
});
test("offline service preserves its details through persistence and replay", async () => {
  const slot = await available();
  useCare.getState().updateNetwork({ offline: true });
  expect(await useCare.getState().book("service:s4", date, slot.id, request)).toBe(true);
  expect(useCare.getState().bookings[0].status).toBe("queued");
  await new Promise((r) => setTimeout(r, 0));
  const saved = JSON.parse(mmkv.getString("care:9999999999")!).state;
  expect(saved?.bookings[0].service).toEqual(request);
  useCare.getState().updateNetwork({ offline: false });
  while (useCare.getState().syncing) await new Promise((r) => setTimeout(r, 1));
  expect(useCare.getState().bookings[0]).toMatchObject({ status: "confirmed", service: request });
});
test("paid clinic service uses clinic location and rolls back a rejected confirmation", async () => {
  const item = findService(CONFIG_NORMAL, "s1")!;
  const clinic: ServiceReservation = { serviceId: item.id, serviceName: item.name, priceInr: item.priceInr, fulfillment: "clinic", address: CLINIC_LOCATION };
  const slot = await available("s1");
  useCare.getState().updateNetwork({ failBooking: true });
  expect(await useCare.getState().book("service:s1", date, slot.id, clinic)).toBe(false);
  expect(useCare.getState().bookings).toHaveLength(0);
  useCare.getState().updateNetwork({ failBooking: false });
  expect(await useCare.getState().book("service:s1", date, slot.id, clinic)).toBe(true);
  expect(useCare.getState().bookings[0].service).toEqual(clinic);
});

test("a changed service marks queued replay failed instead of retrying forever", async () => {
  const slot = await available();
  useCare.getState().updateNetwork({ offline: true });
  await useCare.getState().book("service:s4", date, slot.id, request);
  mockServer.setFestival(true);
  useCare.getState().updateNetwork({ offline: false });
  while (useCare.getState().syncing) await new Promise((r) => setTimeout(r, 1));
  expect(useCare.getState().bookings[0].status).toBe("failed");
  expect(useCare.getState().bookings[0].service).toEqual(request);
});

test("confirmed service retry remains idempotent after the catalog changes", async () => {
  const slot = await available();
  const first = await postBooking("service:s4", slot.id, "stable-service-request", request);
  mockServer.setFestival(true);
  expect(await postBooking("service:s4", slot.id, "stable-service-request", request)).toEqual(first);
});
