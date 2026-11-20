import type { Doctor, Prescription } from "@/data/types";
import { metrics as uiMetrics, useTheme } from "@/theme";
import { memo, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Txt } from "../ui";
import { DoctorPicker } from "./DoctorPicker";

type Props = {
  doctors: Doctor[];
  prescriptions: Prescription[];
  selectedId: string | null;
  disabled?: boolean;
  onSelect: (id: string) => void;
};

export const DoctorChooser = memo(function DoctorChooser({
  doctors,
  prescriptions,
  selectedId,
  disabled = false,
  onSelect,
}: Props) {
  const t = useTheme();
  const [category, setCategory] = useState<"all" | "consulted" | null>(() =>
    selectedId ? "all" : null,
  );
  // Prescription history is evidence of a consultation; a future booking is not.
  const consulted = useMemo(
    () =>
      doctors.filter((doctor) =>
        prescriptions.some(
          (rx) =>
            rx.doctorName === doctor.name &&
            rx.specialty === doctor.specialty &&
            rx.clinicName === doctor.clinic,
        ),
      ),
    [doctors, prescriptions],
  );
  return (
    <View style={{ gap: t.space.md }}>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: t.space.sm,
          paddingHorizontal: t.space.xl,
        }}
      >
        {(
          [
            { id: "all", label: "Choose a doctor" },
            { id: "consulted", label: "Previously consulted" },
          ] as const
        ).map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityState={{ selected: category === item.id, disabled }}
            disabled={disabled}
            onPress={() => {
              if (category === item.id) return;
              setCategory(item.id);
            }}
            style={{
              flexGrow: 1,
              minHeight: uiMetrics.touch,
              padding: t.space.md,
              borderRadius: t.radius.lg,
              borderWidth: 1,
              borderColor:
                category === item.id ? t.colors.primary : t.colors.line,
              backgroundColor:
                category === item.id ? t.colors.paleGreen : t.colors.background,
              justifyContent: "center",
            }}
          >
            <Txt style={{ textAlign: "center", fontWeight: "700" }}>
              {item.label}
            </Txt>
          </Pressable>
        ))}
      </View>
      {category && (
        <DoctorPicker
          doctors={category === "all" ? doctors : consulted}
          title={
            category === "all"
              ? "Choose your doctor"
              : "Previously consulted doctors"
          }
          emptyMessage={
            category === "consulted"
              ? "No previously consulted doctors found in your prescription history."
              : "No doctors available right now."
          }
          selectedId={selectedId}
          disabled={disabled}
          onSelect={onSelect}
        />
      )}
    </View>
  );
});
