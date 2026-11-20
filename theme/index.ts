import { useMemo } from "react";
import type { ThemeColors } from "../data/types";
import { useCare } from "../state/app";
// Design foundations are centralized here; screens only consume tokens.
export const space = {
  none: 0,
  hair: 1,
  tiny: 2,
  xxs: 4,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  hero: 28,
  section: 32,
  huge: 40,
};
export const type = {
  micro: 11,
  caption: 12,
  small: 13,
  body: 14,
  label: 15,
  lead: 16,
  heading: 18,
  title: 24,
  display: 30,
  hero: 34,
};
export const radius = { sm: 8, md: 12, lg: 18, card: 22, hero: 28, pill: 99 };
export function deriveTheme(theme: ThemeColors) {
  const festive = theme.festival?.name === "diwali";
  return {
    colors: {
      ...theme,
      white: "#FFFFFF",
      ink: theme.textPrimary,
      muted: theme.textSecondary,
      line: festive ? "#E7D4BE" : "#DDE8E3",
      green: "#166534",
      paleGreen: festive ? "#FFF0D5" : "#E6F4EF",
      peach: "#FFF1E6",
      orange: "#9A3412",
      blue: "#E8EEFF",
      indigo: "#3730A3",
      purple: "#F3E8FF",
      violet: "#6B21A8",
      amber: "#854D0E",
      red: "#991B1B",
      overlay: "rgba(5,20,18,0.78)",
      heroFade: "rgba(5,20,18,0.42)",
      inactive: festive ? "#80614D" : "#536F65",
      transparent: "transparent",
    },
    space,
    type,
    radius,
    metrics: {
      touch: 48,
      button: 52,
      icon: 22,
      avatar: 56,
      hero: 300,
      doctorImage: 150,
      serviceImage: 115,
      cardWidth: 235,
      tabHeight: 88,
    },
    motion: { reveal: 400, parallax: 0.12 },
  };
}
export function useTheme() {
  const theme = useCare((s) => s.config.theme);
  return useMemo(() => deriveTheme(theme), [theme]);
}
