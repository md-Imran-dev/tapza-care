// ─── Tapza Care · Strict shared types (mirrors React Native codebase) ───
// Shared contracts for the mock API, configuration and patient screens.
export type ThemeColors = {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  festival: {
    name: string;
    greeting: string;
    bannerImageUrl: string;
  };
};
export type TabDef = {
  id: string;
  label: string;
  icon: string;
  screen: "home" | "bookings" | "prescriptions" | "profile";
};
export type SectionBackground =
  | {
      kind: "color";
      value: string;
    }
  | {
      kind: "gradient";
      value: string;
    }
  | {
      kind: "image";
      value: string;
    };
export type Section = {
  id: string;
  type: string;
  background: SectionBackground;
  title: string;
  subtitle?: string;
  items: unknown[];
};
export type LayoutConfig = {
  version: number;
  theme: ThemeColors;
  tabs: TabDef[];
  sections: Section[];
};
// Section item shapes
export type HeroItem = {
  greeting: string;
  sub: string;
  cta: string;
  image: string;
  stats: {
    value: string;
    label: string;
  }[];
};
export type ChipItem = {
  id: string;
  label: string;
  icon: string;
  count?: string;
};
export type QuickActionItem = {
  id: string;
  label: string;
  icon: string;
  desc: string;
};
export type ServiceItem = {
  id: string;
  name: string;
  priceInr: number;
  mrpInr?: number;
  image: string;
  badge?: string;
  rating?: string;
};
export type DoctorCarouselItem = {
  doctorId: string;
  tag?: string;
};
export type OfferItem = {
  id: string;
  message: string;
  code?: string;
};
export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
  expYears: number;
  rating: number;
  nextSlot: string;
  clinic: string;
};
export type Slot = {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
  label: string;
  period: "morning" | "afternoon" | "evening";
};
export type Medicine = {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: ("morning" | "afternoon" | "night")[];
  withFood?: boolean;
};
export type Prescription = {
  id: string;
  issuedAt: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  diagnosis: string;
  medicines: Medicine[];
};
export type Booking = {
  id: string;
  doctorId: string;
  slotId: string;
  doctorName: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "failed" | "queued";
  tokenNo: number;
};
export type Lang = "en" | "hi" | "te";
