import { z } from "zod";
const color = z
  .string()
  .regex(/^#(?:[\da-f]{3}|[\da-f]{6}|[\da-f]{8})$/i, "Use a hex colour");
const theme = z.object({
  primary: color,
  secondary: color,
  background: color,
  surface: color,
  textPrimary: color,
  textSecondary: color,
  accent: color,
  festival: z
    .object({
      name: z.string(),
      greeting: z.string(),
      bannerImageUrl: z.string(),
    })
    .default({ name: "normal", greeting: "Namaste 🙏", bannerImageUrl: "" }),
});
const section = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string().default(""),
  subtitle: z.string().optional(),
  background: z.object({
    kind: z.enum(["color", "gradient", "image"]),
    value: z.string(),
  }),
  items: z.array(z.unknown()),
});
export const configSchema = z.object({
  version: z.number().int().nonnegative(),
  theme,
  tabs: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        icon: z.string(),
        screen: z.enum(["home", "bookings", "prescriptions", "profile"]),
      }),
    )
    .min(1),
  sections: z.array(section),
});
export const sectionTypes = new Set([
  "hero_banner",
  "category_chips",
  "quick_actions",
  "service_grid",
  "doctor_carousel",
  "offer_strip",
]);
const stats = z.array(z.object({ value: z.string(), label: z.string() }));
const itemSchemas: Record<string, z.ZodType> = {
  hero_banner: z.object({
    greeting: z.string(),
    sub: z.string(),
    cta: z.string(),
    image: z.string(),
    stats,
  }),
  category_chips: z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string(),
    count: z.string().optional(),
  }),
  quick_actions: z.object({
    id: z.string(),
    label: z.string(),
    icon: z.string(),
    desc: z.string(),
  }),
  service_grid: z.object({
    id: z.string(),
    name: z.string(),
    priceInr: z.number().nonnegative(),
    mrpInr: z.number().optional(),
    image: z.string(),
    badge: z.string().optional(),
    rating: z.string().optional(),
  }),
  doctor_carousel: z.object({
    doctorId: z.string(),
    tag: z.string().optional(),
  }),
  offer_strip: z.object({
    id: z.string(),
    message: z.string(),
    code: z.string().optional(),
  }),
};
export function parseConfig(value: unknown) {
  const parsed = configSchema.parse(value);
  const ids = new Set<string>();
  for (const s of parsed.sections) {
    if (ids.has(s.id)) throw new Error("Duplicate section id");
    ids.add(s.id);
    const schema = itemSchemas[s.type];
    if (schema) s.items.forEach((item) => schema.parse(item));
    if (s.background.kind === "color") color.parse(s.background.value);
    if (
      s.background.kind === "gradient" &&
      (s.background.value.match(/#[\da-f]{3,8}/gi)?.length ?? 0) < 2
    )
      throw new Error("Gradient needs at least two hex colours");
  }
  const tabs = parsed.tabs.map((t) => t.screen);
  if (new Set(tabs).size !== tabs.length) throw new Error("Duplicate tabs");
  return parsed;
}
