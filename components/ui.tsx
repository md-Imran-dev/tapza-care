import * as Haptics from "expo-haptics";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type TextProps,
  type ViewProps,
} from "react-native";
import { space, type, useTheme } from "../theme";
export function Txt({ style, ...props }: TextProps) {
  const { colors: theme } = useTheme();
  return (
    <Text
      {...props}
      style={[{ fontSize: type.body, color: theme.textPrimary }, style]}
    />
  );
}
export function Card({ style, ...props }: ViewProps) {
  const t = useTheme();
  return (
    <View
      {...props}
      style={[
        styles.card,
        { backgroundColor: t.colors.surface, borderColor: t.colors.line },
        style,
      ]}
    />
  );
}
const icons: Record<string, [string, string]> = {
  home: ["house", "home"],
  calendar: ["calendar.badge.plus", "calendar_add_on"],
  rx: ["doc.text", "description"],
  user: ["person.2", "group"],
  bell: ["bell", "notifications"],
  stethoscope: ["stethoscope", "stethoscope"],
  flask: ["testtube.2", "science"],
  pill: ["pills", "pill"],
  syringe: ["syringe", "vaccines"],
  scan: ["viewfinder", "document_scanner"],
  smile: ["face.smiling", "sentiment_satisfied"],
  sparkles: ["sparkles", "auto_awesome"],
  candy: ["heart", "favorite"],
  close: ["xmark", "close"],
  back: ["chevron.left", "chevron_left"],
  next: ["chevron.right", "chevron_right"],
  check: ["checkmark", "check"],
  search: ["magnifyingglass", "search"],
  location: ["mappin", "location_on"],
  settings: ["slider.horizontal.3", "tune"],
};
export function Icon({
  name,
  color,
  size = 22,
}: {
  name: string;
  color?: string;
  size?: number;
}) {
  const t = useTheme();
  const [ios, other] = icons[name] ?? icons.rx;
  return (
    <SymbolView
      name={
        { ios, android: other, web: other } as React.ComponentProps<
          typeof SymbolView
        >["name"]
      }
      tintColor={color ?? t.colors.textSecondary}
      size={size}
    />
  );
}
export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  const { colors: t } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={() => {
        void Haptics.selectionAsync().catch(() => {});
        onPress();
      }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: secondary ? t.background : t.primary,
          opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
        },
      ]}
    >
      <Txt
        style={{
          color: secondary ? t.primary : t.surface,
          fontWeight: "800",
          textAlign: "center",
        }}
      >
        {title}
      </Txt>
    </Pressable>
  );
}
export const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: space.lg,
    borderWidth: 1,

    gap: space.sm,
  },
  button: {
    minHeight: 52,
    borderRadius: 28,
    padding: space.md,
    justifyContent: "center",
  },
  title: { fontSize: type.title, fontWeight: "800", letterSpacing: -0.6 },
  heading: { fontSize: type.lead, fontWeight: "800", letterSpacing: -0.4 },
  sub: { fontSize: type.caption, lineHeight: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  page: { padding: space.xl, gap: space.lg, paddingBottom: space.section },
});
