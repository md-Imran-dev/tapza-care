import { create as createClient, AxiosError, type AxiosAdapter } from "axios";
import {
  CONFIG_DIWALI,
  CONFIG_NORMAL,
  DOCTORS,
  PRESCRIPTIONS,
  slotSeed,
} from "../data/mockData";
import type {
  Booking,
  Doctor,
  LayoutConfig,
  Prescription,
  Slot,
} from "../data/types";
export type Network = {
  latencyMs: number;
  offline: boolean;
  failConfig: boolean;
  failBooking: boolean;
  failSlots: boolean;
  emptySlots: boolean;
  emptyDoctors: boolean;
  emptyPrescriptions: boolean;
};
export const defaultNetwork: Network = {
  latencyMs: 500,
  offline: false,
  failConfig: false,
  failBooking: false,
  failSlots: false,
  emptySlots: false,
  emptyDoctors: false,
  emptyPrescriptions: false,
};
let network = { ...defaultNetwork };
let festival = false;
let override: LayoutConfig | null = null;
const reservations = new Map<string, Booking>();
export const mockServer = {
  setNetwork: (n: Network) => {
    network = { ...n };
  },
  setFestival: (value: boolean) => {
    festival = value;
    override = null;
  },
  patch: (config: LayoutConfig) => {
    override = config;
  },
  reset: () => {
    network = { ...defaultNetwork };
    festival = false;
    override = null;
    reservations.clear();
  },
};
function slotsFor(doctorId: string, date: string): Slot[] {
  return slotSeed(doctorId, date).map((s, i) => {
    const [time, meridian] = s.label.split(" ");
    let [hour, minute] = time.split(":").map(Number);
    hour = (hour % 12) + (meridian === "PM" ? 12 : 0);
    const startsAt = `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+05:30`;
    return {
      id: `${doctorId}|${date}|${i}`,
      doctorId,
      startsAt,
      endsAt: new Date(new Date(startsAt).getTime() + 30 * 60000).toISOString(),
      available: s.available,
      label: s.label,
      period: s.period,
    };
  });
}
const adapter: AxiosAdapter = async (config) => {
  await new Promise((r) => setTimeout(r, network.latencyMs));
  const response = {
    data: null as unknown,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
  const fail = (status: number, message: string): never => {
    throw new AxiosError(
      message,
      status === 0 ? "ERR_NETWORK" : "ERR_BAD_RESPONSE",
      config,
      undefined,
      { ...response, status, statusText: message, data: { message } },
    );
  };
  if (network.offline) fail(0, "You are offline");
  const url = new URL(config.url ?? "/", "https://mock.tapza.local");
  const method = config.method?.toUpperCase() ?? "GET";
  if (url.pathname === "/config") {
    if (network.failConfig) fail(500, "Configuration unavailable");
    response.data = override ?? (festival ? CONFIG_DIWALI : CONFIG_NORMAL);
  } else if (url.pathname === "/doctors")
    response.data = network.emptyDoctors ? [] : DOCTORS;
  else if (url.pathname === "/prescriptions")
    response.data = network.emptyPrescriptions ? [] : PRESCRIPTIONS;
  else if (url.pathname === "/slots") {
    if (network.failSlots) fail(503, "Slots could not load");
    const id = config.params?.doctorId ?? url.searchParams.get("doctorId");
    const date = config.params?.date ?? url.searchParams.get("date");
    if (
      !DOCTORS.some((d) => d.id === id) ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")
    )
      fail(400, "Invalid doctor or date");
    response.data = network.emptySlots
      ? []
      : slotsFor(id, date).map((s) => ({
          ...s,
          available: s.available && !reservations.has(s.id),
        }));
  } else if (url.pathname === "/bookings" && method === "POST") {
    const input =
      typeof config.data === "string" ? JSON.parse(config.data) : config.data;
    const { doctorId, slotId } = input;
    const [slotDoctor, date] = String(slotId).split("|");
    const doctor = DOCTORS.find((d) => d.id === doctorId);
    const slot = slotsFor(doctorId, date ?? "").find((s) => s.id === slotId);
    if (!doctor || slotDoctor !== doctorId || !slot)
      fail(400, "Invalid appointment");
    const previous = reservations.get(slotId);
    if (previous) {
      if (input.requestId && previous.id === input.requestId) {
        response.status = 201;
        response.data = previous;
        return response;
      }
      fail(409, "Slot just taken. Pick another time.");
    }
    if (network.failBooking || !slot!.available)
      fail(409, "Slot just taken. Pick another time.");
    const booking: Booking = {
      id: input.requestId ?? `visit-${Date.now()}`,
      doctorId,
      slotId,
      doctorName: doctor!.name,
      date,
      time: slot!.label,
      status: "confirmed",
      tokenNo: 13 + reservations.size,
    };
    reservations.set(slotId, booking);
    response.status = 201;
    response.data = booking;
  } else fail(404, "Endpoint not found");
  // Simulate JSON transport, so consumers cannot mutate the server fixture.
  response.data = JSON.parse(JSON.stringify(response.data));
  return response;
};
export const api = createClient({
  adapter,
  baseURL: "https://mock.tapza.local",
});
export const getConfig = () =>
  api.get<LayoutConfig>("/config").then((r) => r.data);
export const getDoctors = () =>
  api.get<Doctor[]>("/doctors").then((r) => r.data);
export const getPrescriptions = () =>
  api.get<Prescription[]>("/prescriptions").then((r) => r.data);
export const getSlots = (doctorId: string, date: string) =>
  api.get<Slot[]>("/slots", { params: { doctorId, date } }).then((r) => r.data);
export const postBooking = (
  doctorId: string,
  slotId: string,
  requestId: string,
) =>
  api
    .post<Booking>("/bookings", { doctorId, slotId, requestId })
    .then((r) => r.data);
