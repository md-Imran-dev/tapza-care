import { metrics as uiMetrics , radius as uiRadius , useTheme } from "@/theme";
import type { Doctor } from "@/data/types";
import { useTranslation } from "@/hooks/useTranslation";
import { memo } from "react";
import { FlatList, Image, Pressable, View } from "react-native";
import { Txt, styles } from "../ui";

export const DoctorPicker = memo(function DoctorPicker({
  doctors,
  selectedId,
  disabled = false,
  title = "Choose your doctor",
  emptyMessage = "No doctors available right now.",
  onSelect,
}: {
  doctors: Doctor[];
  selectedId: string | null;
  disabled?: boolean;
  title?: string;
  emptyMessage?: string;
  onSelect: (id: string) => void;
}) {
  const t = useTheme();
  const { translate } = useTranslation();
  return (
    <View style={{ gap: t.space.sm, paddingBottom: t.space.md }}>
      <Txt style={[styles.heading, { paddingHorizontal: t.space.xl }]}>
        {title}
      </Txt>
      <FlatList
        horizontal
        data={doctors}
        ListEmptyComponent={<Txt>{emptyMessage}</Txt>}
        keyExtractor={(doctor) => doctor.id}
        showsHorizontalScrollIndicator={false}
        initialNumToRender={4}
        contentContainerStyle={{
          paddingHorizontal: t.space.xl,
          gap: t.space.sm,
        }}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={translate(`Select ${item.name}`)}
            accessibilityState={{ selected: selectedId === item.id, disabled }}
            disabled={disabled}
            onPress={() => onSelect(item.id)}
            style={{
              width: uiMetrics.pickerCardWidth,
              padding: t.space.md,
              borderRadius: t.radius.lg,
              borderWidth: 1,
              borderColor:
                selectedId === item.id ? t.colors.primary : t.colors.line,
              backgroundColor:
                selectedId === item.id
                  ? t.colors.paleGreen
                  : t.colors.background,
              gap: t.space.xs,
            }}
          >
            <Image
              source={{ uri: item.photoUrl }}
              style={{ width: uiMetrics.compactTouch, height: uiMetrics.compactTouch, borderRadius: uiRadius.input }}
            />
            <Txt localize={false} style={{ fontWeight: "800" }}>{item.name}</Txt>
            <Txt style={styles.sub}>
              {item.specialty} · ★ {item.rating}
            </Txt>
          </Pressable>
        )}
      />
    </View>
  );
});
