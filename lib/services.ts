import { z } from "zod";
import type { LayoutConfig, ServiceItem } from "../data/types";

export const CLINIC_LOCATION = "Tapza Clinic · Madhapur, Hyderabad";
export function findService(
  config: LayoutConfig,
  id: string,
): ServiceItem | undefined {
  return config.sections
    .filter((s) => s.type === "service_grid")
    .flatMap((s) => s.items as ServiceItem[])
    .find((item) => item.id === id);
}
export const serviceReservationSchema = z
  .object({
    serviceId: z.string().min(1),
    serviceName: z.string().min(1),
    priceInr: z.number().nonnegative(),
    fulfillment: z.enum(["home", "clinic"]),
    address: z
      .string()
      .trim()
      .min(10, "Enter a complete address (at least 10 characters).")
      .max(300),
  })
  .refine(
    (value) =>
      value.fulfillment !== "home" || /\b[1-9]\d{5}\b/.test(value.address),
    {
      message: "Include a valid six-digit PIN code in your collection address.",
      path: ["address"],
    },
  );
export type ServiceReservation = z.infer<typeof serviceReservationSchema>;
