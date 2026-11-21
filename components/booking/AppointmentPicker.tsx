import type { Slot } from "@/data/types";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { metrics as uiMetrics } from "@/theme";
import { localDateKey } from "@/utilities/dates";
import { useMemo } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Skeleton } from "../States";
import { Button, styles, Txt } from "../ui";

type Props = {
  date: string;
  slotId: string;
  slots: Slot[];
  loading: boolean;
  error: string | null;
  disabled?: boolean;
  onDate: (date: string) => void;
  onSlot: (id: string) => void;
  onRetry: () => void;
};
export function AppointmentPicker({
  date,
  slotId,
  slots,
  loading,
  error,
  disabled,
  onDate,
  onSlot,
  onRetry,
}: Props) {
  const t = useTheme();
  const { locale } = useTranslation();
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() + i);
        return {
          id: localDateKey(day),
          label: day.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            weekday: "short",
          }),
        };
      }),
    [locale],
  );
  return (
    <View style={{ gap: t.space.md }}>
      <Txt style={styles.heading}>Pick a date</Txt>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: t.space.sm }}
      >
        {dates.map((day) => (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityState={{ selected: day.id === date, disabled }}
            disabled={disabled}
            onPress={() => onDate(day.id)}
            style={{
              minHeight: uiMetrics.avatar,
              justifyContent: "center",
              padding: t.space.md,
              borderRadius: t.radius.md,
              backgroundColor:
                day.id === date ? t.colors.paleGreen : t.colors.background,
              borderWidth: 1,
              borderColor: day.id === date ? t.colors.primary : t.colors.line,
            }}
          >
            <Txt>{day.label}</Txt>
          </Pressable>
        ))}
      </ScrollView>
      <Txt style={styles.heading}>Available times</Txt>
      {loading ? (
        <Skeleton kind="slots" />
      ) : error ? (
        <Button title="Retry available times" onPress={onRetry} />
      ) : slots.some((s) => s.available) ? (
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: t.space.sm }}
        >
          {slots.map((slot) => (
            <Pressable
              key={slot.id}
              accessibilityRole="button"
              accessibilityLabel={slot.label}
              accessibilityState={{
                selected: slot.id === slotId,
                disabled: disabled || !slot.available,
              }}
              disabled={disabled || !slot.available}
              onPress={() => onSlot(slot.id)}
              style={{
                minHeight: uiMetrics.touch,
                padding: t.space.md,
                justifyContent: "center",
                borderRadius: t.radius.md,
                backgroundColor:
                  slot.id === slotId ? t.colors.paleGreen : t.colors.background,
                borderWidth: 1,
                borderColor:
                  slot.id === slotId ? t.colors.primary : t.colors.line,
                opacity: slot.available ? 1 : 0.35,
              }}
            >
              <Txt>{slot.label}</Txt>
            </Pressable>
          ))}
        </View>
      ) : (
        <Txt>No times available. Please choose another date.</Txt>
      )}
    </View>
  );
}
