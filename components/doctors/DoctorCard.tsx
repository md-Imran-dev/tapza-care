import type { Doctor } from "@/data/types";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import {
  metrics as uiMetrics,
  radius as uiRadius,
  space as uiSpace,
} from "@/theme";
import { router } from "expo-router";
import { memo } from "react";
import { Pressable, StyleSheet, useWindowDimensions, View } from "react-native";
import { Icon, Txt } from "../ui";
import { DoctorPhoto } from "./DoctorPhoto";

export const DoctorCard = memo(function DoctorCard({
  doctor,
}: {
  doctor: Doctor;
}) {
  const t = useTheme();
  const { translate } = useTranslation();
  const { width, fontScale } = useWindowDimensions();
  const compact = width < 360 || fontScale > 1.3;
  return (
    <View
      style={[
        card.container,
        { backgroundColor: t.colors.surface, borderColor: t.colors.line },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={translate(`Open ${doctor.name}`)}
        onPress={() =>
          router.push({ pathname: "/doctor/[id]", params: { id: doctor.id } })
        }
        style={{
          width: compact
            ? t.metrics.doctorCardCompact
            : t.metrics.doctorCardWide,
        }}
      >
        <DoctorPhoto
          doctor={doctor}
          accessibilityLabel={translate(`Portrait of ${doctor.name}`)}
          resizeMode="cover"
          style={{
            width: "100%",
            flex: 1,
            minHeight: uiMetrics.doctorPortrait,
            borderRadius: t.radius.lg,
          }}
        />
      </Pressable>
      <View style={card.content}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={translate(`View details for ${doctor.name}`)}
          onPress={() =>
            router.push({ pathname: "/doctor/[id]", params: { id: doctor.id } })
          }
          style={{ minHeight: t.metrics.touch, gap: t.space.xxs }}
        >
          <Txt style={{ fontWeight: "800", fontSize: t.type.heading }}>
            {doctor.name}
          </Txt>
          <Txt style={{ color: t.colors.textSecondary }}>
            {doctor.specialty}
          </Txt>
          <Txt
            style={{ fontSize: t.type.caption, color: t.colors.textSecondary }}
          >
            {doctor.expYears} years experience
          </Txt>
          <Txt
            style={{ color: t.colors.textSecondary, fontSize: t.type.caption }}
          >
            Next available · {doctor.nextSlot}
          </Txt>
        </Pressable>
        <View style={card.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={translate(`Book now with ${doctor.name}`)}
            onPress={() =>
              router.push({
                pathname: "/booking",
                params: { doctorId: doctor.id },
              })
            }
            style={({ pressed }) => [
              card.book,
              { borderColor: t.colors.line, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Icon name="calendar" size={18} color={t.colors.violet} />
            <Txt
              style={{
                color: t.colors.violet,
                fontWeight: "700",
                flexShrink: 1,
              }}
            >
              Book Now
            </Txt>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={translate("Contact clinic")}
            onPress={() => router.push("/contact")}
            style={({ pressed }) => [
              card.contact,
              { backgroundColor: t.colors.violet, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Icon name="phone" size={20} color={t.colors.white} />
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const card = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: uiSpace.inset,
    gap: uiSpace.md,
    borderRadius: uiRadius.doctor,
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    minWidth: uiMetrics.none,
    paddingVertical: uiSpace.md,
    gap: uiSpace.lg,
    justifyContent: "space-between",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: uiSpace.sm,
  },
  book: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: uiSpace.xs,
    borderWidth: 1,
    borderRadius: uiRadius.hero,
    paddingHorizontal: uiSpace.md,
    paddingVertical: uiSpace.inset,
    minHeight: uiMetrics.touch,
    flexShrink: 1,
  },
  contact: {
    minWidth: uiMetrics.touch,
    minHeight: uiMetrics.touch,
    borderRadius: uiRadius.avatar,
    alignItems: "center",
    justifyContent: "center",
  },
});
