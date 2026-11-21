import type { Doctor } from "@/data/types";
import { useSlots } from "@/hooks/useSlots";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { metrics as uiMetrics } from "@/theme";
import { localDateKey } from "@/utilities/dates";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Skeleton } from "../States";
import { Button, Card, styles, Txt } from "../ui";
import { DoctorPhoto } from "./DoctorPhoto";

export function DoctorDetails({
  doctor,
  onBook,
}: {
  doctor: Doctor;
  onBook: (date: string, slotId: string) => void;
}) {
  const t = useTheme();
  const { locale } = useTranslation();
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return { key: localDateKey(date), date };
      }),
    [],
  );
  const [date, setDate] = useState(dates[0].key);
  const [slot, setSlot] = useState("");
  const { data, loading, error, retry } = useSlots(doctor.id, date);
  // Ignore retained results from a previous date while the next request starts.
  const slots = (data ?? []).filter((s) => s.startsAt.startsWith(date));
  const selected = slots.find((s) => s.id === slot && s.available);
  const selectedDate = dates.find((d) => d.key === date)!.date;
  return (
    <View style={{ gap: t.space.md }}>
      <View
        style={{
          backgroundColor: t.colors.paleGreen,
          borderRadius: t.radius.hero,
          overflow: "hidden",
        }}
      >
        <View style={{ minHeight: uiMetrics.hero }}>
          <DoctorPhoto
            doctor={doctor}
            accessibilityLabel={`Portrait of ${doctor.name}`}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "62%",
              height: "100%",
            }}
            resizeMode="cover"
          />
          <View
            style={{
              padding: t.space.xl,
              gap: t.space.sm,
              minHeight: uiMetrics.hero,
              width: "55%",
              justifyContent: "flex-end",
            }}
          >
            <Txt style={{ color: t.colors.primary, fontWeight: "800" }}>
              ★ {doctor.rating} · Doctor rating
            </Txt>
            <Txt accessibilityRole="header" style={styles.title}>
              {doctor.name}
            </Txt>
            <Txt style={styles.heading}>{doctor.specialty}</Txt>
          </View>
        </View>
        <Card style={{ margin: t.space.md }}>
          <Txt style={styles.sub}>{doctor.clinic}</Txt>
          <View
            style={[
              styles.row,
              { justifyContent: "space-between", alignItems: "flex-start" },
            ]}
          >
            <View style={{ flex: 1, gap: t.space.xs }}>
              <Txt style={styles.heading}>{doctor.expYears} years</Txt>
              <Txt style={styles.sub}>Experience</Txt>
            </View>
            <View style={{ flex: 1, gap: t.space.xs }}>
              <Txt style={styles.heading}>₹{doctor.feeInr}</Txt>
              <Txt style={styles.sub}>Pay at clinic</Txt>
            </View>
          </View>
          <Txt style={styles.sub}>Speaks {doctor.languages.join(", ")}</Txt>
        </Card>
      </View>
      <Card style={{ gap: t.space.lg }}>
        <View style={[styles.row, { justifyContent: "space-between" }]}>
          <Txt style={styles.heading}>Select date</Txt>
          <Txt style={styles.sub}>
            {selectedDate.toLocaleDateString(locale, {
              month: "long",
              year: "numeric",
            })}
          </Txt>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: t.space.sm }}
        >
          {dates.map((item) => (
            <Pressable
              key={item.key}
              accessibilityRole="button"
              accessibilityLabel={item.date.toDateString()}
              accessibilityState={{ selected: date === item.key }}
              onPress={() => {
                setDate(item.key);
                setSlot("");
              }}
              style={{
                minWidth: uiMetrics.dateTileWidthLarge,
                minHeight: uiMetrics.detailDateHeight,
                justifyContent: "center",
                alignItems: "center",
                gap: t.space.xs,
                padding: t.space.md,
                borderRadius: t.radius.lg,
                backgroundColor:
                  date === item.key ? t.colors.paleGreen : t.colors.background,
                borderWidth: 1,
                borderColor:
                  date === item.key ? t.colors.primary : t.colors.line,
              }}
            >
              <Txt style={styles.heading}>{item.date.getDate()}</Txt>
              <Txt style={styles.sub}>
                {item.date.toLocaleDateString(locale, { weekday: "short" })}
              </Txt>
            </Pressable>
          ))}
        </ScrollView>
        <Txt style={styles.heading}>Select time</Txt>
        {loading ? (
          <Skeleton kind="slots" />
        ) : error ? (
          <Button title="Retry available times" secondary onPress={retry} />
        ) : slots.some((s) => s.available) ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: t.space.sm }}
          >
            {slots.map((s) => (
              <Pressable
                key={s.id}
                accessibilityRole="button"
                accessibilityState={{
                  selected: slot === s.id,
                  disabled: !s.available,
                }}
                disabled={!s.available}
                onPress={() => setSlot(s.id)}
                style={{
                  alignItems: "center",
                  minWidth: uiMetrics.timeTileWidth,
                  minHeight: uiMetrics.timeTileHeight,
                  justifyContent: "center",
                  padding: t.space.md,
                  borderRadius: t.radius.md,
                  borderWidth: 1,
                  borderColor: slot === s.id ? t.colors.primary : t.colors.line,
                  backgroundColor:
                    slot === s.id ? t.colors.paleGreen : t.colors.background,
                  opacity: s.available ? 1 : 0.4,
                }}
              >
                <View
                  style={{
                    height: slot === s.id ? 18 : 10,
                    width: uiMetrics.tickWidth,
                    backgroundColor: t.colors.primary,
                    marginBottom: t.space.sm,
                  }}
                />
                <Txt style={styles.sub}>{s.label}</Txt>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Txt>No times available. Please choose another date.</Txt>
        )}
        <Button
          title="Book session"
          disabled={loading || !!error || !selected}
          onPress={() => {
            if (selected) onBook(date, selected.id);
          }}
        />
      </Card>
    </View>
  );
}
