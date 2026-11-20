import { expect, test } from "@jest/globals";
import { CONFIG_DIWALI, CONFIG_NORMAL } from "../data/mockData";
import { deriveTheme } from "../theme";
function luminance(hex: string) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
test.each([CONFIG_NORMAL, CONFIG_DIWALI])("body and tab text retain readable contrast in config $version", (config) => {
  const t = deriveTheme(config.theme);
  for (const background of [t.colors.background, t.colors.surface]) {
    expect(contrast(t.colors.textPrimary, background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(t.colors.textSecondary, background)).toBeGreaterThanOrEqual(4.5);
  }
  expect(contrast(t.colors.ink, t.colors.accent)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(t.colors.tabActive, t.colors.tabBackground)).toBeGreaterThanOrEqual(4.5);
  expect(contrast(t.colors.inactive, t.colors.tabBackground)).toBeGreaterThanOrEqual(4.5);
});
