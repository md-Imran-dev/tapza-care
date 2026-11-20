import { router } from "expo-router";
import { memo } from "react";
import { Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import type { Doctor } from "@/data/types";
import { useTheme } from "@/theme";
import { Icon, Txt } from "../ui";

export const DoctorCard = memo(function DoctorCard({ doctor }: { doctor: Doctor }) {
  const t = useTheme();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360 || fontScale > 1.3;
  return (
    <View style={[card.container, { backgroundColor: t.colors.surface, borderColor: t.colors.line }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Open ${doctor.name}`}
        onPress={() => router.push({ pathname: "/doctor/[id]", params: { id: doctor.id } })}
        style={{ width: compact ? 76 : 112 }}
      >
      <Image
        accessibilityLabel={`Portrait of ${doctor.name}`}
        source={{ uri: doctor.photoUrl }}
        resizeMode="cover"
        style={{ width: "100%", flex: 1, minHeight: 180, borderRadius: t.radius.lg }}
      />
      </Pressable>
      <View style={card.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View details for ${doctor.name}`}
          onPress={() => router.push({ pathname: "/doctor/[id]", params: { id: doctor.id } })}
          style={{ minHeight: t.metrics.touch, gap: t.space.xxs }}
        >
          <Txt style={{ fontWeight: "800", fontSize: t.type.heading }}>{doctor.name}</Txt>
          <Txt style={{ color: t.colors.textSecondary }}>{doctor.specialty}</Txt>
          <Txt style={{ fontSize: t.type.caption, color: t.colors.textSecondary }}>{doctor.expYears} years experience</Txt>
        </Pressable>
        <View style={card.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Book now with ${doctor.name}`}
            onPress={() => router.push({ pathname: "/booking", params: { doctorId: doctor.id } })}
            style={({ pressed }) => [card.book, { borderColor: t.colors.line, opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name="calendar" size={18} color={t.colors.violet} />
            <Txt style={{ color: t.colors.violet, fontWeight: "700", flexShrink: 1 }}>Book Now</Txt>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Contact clinic"
            onPress={() => router.push("/contact")}
            style={({ pressed }) => [card.contact, { backgroundColor: t.colors.violet, opacity: pressed ? 0.7 : 1 }]}
          >
            <Icon name="phone" size={20} color={t.colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const card = StyleSheet.create({
  container: { flexDirection: "row", padding: 10, gap: 12, borderRadius: 26, borderWidth: 1, overflow: "hidden" },
  content: { flex: 1, minWidth: 0, paddingVertical: 12, gap: 16, justifyContent: "space-between" },
  actions: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 },
  book: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderWidth: 1, borderRadius: 28, paddingHorizontal: 12, paddingVertical: 10, minHeight: 48, flexShrink: 1 },
  contact: { minWidth: 48, minHeight: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
});
