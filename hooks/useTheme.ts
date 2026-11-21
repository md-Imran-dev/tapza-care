import { useCare } from "@/store/careStore";
import { deriveTheme } from "@/theme";
import { useMemo } from "react";

export function useTheme() {
  const theme = useCare((s) => s.config.theme);
  return useMemo(() => deriveTheme(theme), [theme]);
}
