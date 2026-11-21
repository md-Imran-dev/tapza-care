import { DoctorPhoto } from "@/components/doctors/DoctorPhoto";
import { TransitionScreen } from "@/components/motion/TransitionScreen";
import { useSlots } from "@/hooks/useSlots";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { space, type, metrics as uiMetrics, radius as uiRadius } from "@/theme";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeIn,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DoctorChooser } from "../../components/doctors/DoctorChooser";
import { EmptyState, Skeleton } from "../../components/States";
import { Button, Icon, styles, Txt } from "../../components/ui";
import { DOCTORS } from "../../data/mockData";
import { useCare } from "../../store/careStore";
export default function Booking() {
  const palette = useTheme().colors;
  const { locale } = useTranslation();
  const {
    doctorId,
    date: initialDate,
    slotId: initialSlot,
  } = useLocalSearchParams<{
    doctorId: string;
    date?: string;
    slotId?: string;
  }>();
  const prescriptions = useCare((s) => s.prescriptions);
  const loadedDoctors = useCare((s) => s.doctors);
  const doctors = loadedDoctors.length ? loadedDoctors : DOCTORS;
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(
    () => doctors.find((doctor) => doctor.id === doctorId)?.id ?? doctors[0].id,
  );
  const d =
    doctors.find((doctor) => doctor.id === selectedDoctorId) ?? doctors[0];
  const t = useCare((s) => s.config.theme);
  const book = useCare((s) => s.book);
  const offline = useCare((s) => s.offline);
  const inset = useSafeAreaInsets();
  const dates = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
          iso: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
          day: date.toLocaleDateString(locale, { weekday: "short" }),
          date: date.getDate(),
          month: date.toLocaleDateString(locale, { month: "short" }),
        };
      }),
    [locale],
  );
  const [date, setDate] = useState(
    dates.some((d) => d.iso === initialDate) ? initialDate! : dates[0].iso,
  );
  const [slot, setSlot] = useState(initialSlot ?? "");
  const {
    data: slotsData,
    loading,
    error: slotsError,
    retry,
  } = useSlots(d.id, date, false, !!selectedDoctorId);
  const slots = (slotsData ?? []).filter(
    (s) => s.doctorId === d.id && s.startsAt.startsWith(date),
  );
  const validSlot = slots.some(
    (s) => s.id === slot && s.available && s.startsAt.startsWith(date),
  );
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const y = useSharedValue(0);
  const close = () => router.back();
  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      y.value = Math.max(0, e.translationY);
    })
    .onEnd(() => {
      if (y.value > 110) runOnJS(close)();
      else y.value = withSpring(0);
    });
  const a = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <TransitionScreen>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: palette.overlay,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close booking"
          onPress={close}
          style={{ flex: 1 }}
        />
        <Animated.View
          style={[
            {
              height: "90%",
              borderTopLeftRadius: uiRadius.banner,
              borderTopRightRadius: uiRadius.banner,
              backgroundColor: palette.white,
              paddingBottom: Math.max(space.xl, inset.bottom),
            },
            a,
          ]}
        >
          <GestureDetector gesture={gesture}>
            <View style={{ padding: space.md, alignItems: "center" }}>
              <View
                style={{
                  height: uiMetrics.dragHandleHeight,
                  width: uiMetrics.compactTouch,
                  backgroundColor: palette.line,
                  borderRadius: uiRadius.xs,
                }}
              />
            </View>
          </GestureDetector>
          {status === "success" ? (
            <Animated.View
              entering={ZoomIn.springify()}
              style={{
                padding: space.hero,
                gap: space.lg,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: palette.paleGreen,
                  padding: space.hero,
                  borderRadius: uiRadius.success,
                }}
              >
                <Icon name="check" color={palette.green} size={48} />
              </View>
              <Txt style={styles.title}>
                {offline ? "Saved offline" : "Booking confirmed! 🎉"}
              </Txt>
              <Txt style={[styles.sub, { textAlign: "center" }]}>
                {offline
                  ? "Your visit will sync when you go online."
                  : `Your visit with ${d.name} is booked.\n${date} · ${slots.find((s) => s.id === slot)?.label ?? slot}`}
              </Txt>
              <Button
                title="View my bookings"
                onPress={() => router.replace("/bookings")}
              />
            </Animated.View>
          ) : (
            <>
              <DoctorChooser
                doctors={doctors}
                prescriptions={prescriptions}
                selectedId={selectedDoctorId}
                disabled={status === "pending"}
                onSelect={(id) => {
                  if (id === selectedDoctorId) return;
                  setSelectedDoctorId(id);
                  setSlot("");
                  setStatus("idle");
                }}
              />
              {selectedDoctorId ? (
                <>
                  <View
                    style={[
                      styles.row,
                      { paddingHorizontal: space.xl, paddingBottom: space.lg },
                    ]}
                  >
                    <DoctorPhoto
                      doctor={d}
                      shared={doctorId === d.id}
                      style={{
                        height: uiMetrics.bookingAvatar,
                        width: uiMetrics.bookingAvatar,
                        borderRadius: uiRadius.lg,
                      }}
                    />
                    <View style={{ flex: 1, gap: space.tiny }}>
                      <Txt localize={false} style={styles.heading}>
                        {d.name}
                      </Txt>
                      <Txt style={styles.sub}>
                        {d.specialty} · ★ {d.rating}
                      </Txt>
                      <Txt
                        style={{ fontSize: type.micro, color: palette.muted }}
                      >
                        {d.clinic}
                      </Txt>
                    </View>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Close booking"
                      onPress={close}
                      style={{
                        padding: space.md,
                        minHeight: uiMetrics.compactTouch,
                      }}
                    >
                      <Icon name="close" />
                    </Pressable>
                  </View>
                  <ScrollView
                    contentContainerStyle={{
                      padding: space.xl,
                      paddingTop: space.none,
                      gap: space.md,
                    }}
                  >
                    {offline && (
                      <Txt style={styles.sub}>
                        Offline · Showing saved slots. Availability is confirmed
                        when you reconnect.
                      </Txt>
                    )}
                    <Txt
                      style={{
                        fontWeight: "800",
                        fontSize: type.caption,
                        color: palette.muted,
                      }}
                    >
                      PICK A DATE
                    </Txt>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: space.sm }}
                    >
                      {dates.map((dt) => (
                        <Pressable
                          accessibilityRole="button"
                          key={dt.iso}
                          disabled={status === "pending"}
                          onPress={() => {
                            setDate(dt.iso);
                            setSlot("");
                          }}
                          style={{
                            minWidth: uiMetrics.dateTileWidth,
                            minHeight: uiMetrics.dateTileHeight,
                            backgroundColor:
                              date === dt.iso ? t.primary : t.background,
                            borderRadius: uiRadius.date,
                            padding: space.md,
                            alignItems: "center",
                            gap: space.xxs,
                          }}
                        >
                          <Txt
                            style={{
                              color:
                                date === dt.iso ? palette.white : palette.muted,
                              fontSize: type.micro,
                            }}
                          >
                            {dt.day}
                          </Txt>
                          <Txt
                            style={{
                              color:
                                date === dt.iso ? palette.white : t.textPrimary,
                              fontSize: type.heading,
                              fontWeight: "800",
                            }}
                          >
                            {dt.date}
                          </Txt>
                          <Txt
                            style={{
                              color:
                                date === dt.iso ? palette.white : palette.muted,
                              fontSize: type.micro,
                            }}
                          >
                            {dt.month}
                          </Txt>
                        </Pressable>
                      ))}
                    </ScrollView>
                    {loading ? (
                      <Skeleton kind="slots" />
                    ) : slotsError ? (
                      <EmptyState
                        title="Slots couldn’t load"
                        message="Check your connection and try again."
                        action="Retry slots"
                        onAction={retry}
                      />
                    ) : !slots.some((s) => s.available) ? (
                      <EmptyState
                        title="No slots available"
                        message="Try another date or check back later."
                        action="Try tomorrow"
                        onAction={() => {
                          setDate(dates[1].iso);
                          setSlot("");
                        }}
                      />
                    ) : (
                      (["morning", "afternoon", "evening"] as const).map(
                        (p) => (
                          <View key={p} style={{ gap: space.sm }}>
                            <Txt
                              style={{
                                fontWeight: "800",
                                fontSize: type.caption,
                                color: palette.muted,
                              }}
                            >
                              {p === "morning"
                                ? "🌅 Morning"
                                : p === "afternoon"
                                  ? "☀️ Afternoon"
                                  : "🌙 Evening"}
                            </Txt>
                            <View
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                gap: space.sm,
                              }}
                            >
                              {slots
                                .filter((s) => s.period === p)
                                .map((s) => (
                                  <Pressable
                                    accessibilityRole="button"
                                    disabled={
                                      !s.available || status === "pending"
                                    }
                                    key={s.id}
                                    onPress={() => {
                                      setSlot(s.id);
                                      setStatus("idle");
                                    }}
                                    style={{
                                      minWidth: uiMetrics.slotWidth,
                                      minHeight: uiMetrics.compactTouch,
                                      padding: space.md,
                                      borderRadius: uiRadius.time,
                                      borderWidth: 1,
                                      borderColor:
                                        slot === s.id
                                          ? t.primary
                                          : palette.line,
                                      backgroundColor:
                                        slot === s.id
                                          ? t.primary
                                          : t.background,
                                      opacity: s.available ? 1 : 0.35,
                                    }}
                                  >
                                    <Txt
                                      style={{
                                        fontSize: type.caption,
                                        fontWeight: "700",
                                        color:
                                          slot === s.id
                                            ? palette.white
                                            : palette.ink,
                                      }}
                                    >
                                      {s.label}
                                    </Txt>
                                  </Pressable>
                                ))}
                            </View>
                          </View>
                        ),
                      )
                    )}
                    {status === "error" && (
                      <Animated.View entering={FadeIn}>
                        <Txt style={{ color: palette.red, fontWeight: "700" }}>
                          Slot just taken (409). Pick another time to retry.
                        </Txt>
                      </Animated.View>
                    )}
                  </ScrollView>
                  <View
                    style={{
                      paddingHorizontal: space.xl,
                      gap: space.md,
                      paddingTop: space.sm,
                      borderTopWidth: 1,
                      borderTopColor: palette.line,
                    }}
                  >
                    <Txt style={{ fontWeight: "800" }}>
                      ₹{d.feeInr} · Pay at clinic
                    </Txt>
                    {status === "pending" ? (
                      <ActivityIndicator color={t.primary} />
                    ) : null}
                    <Button
                      title={
                        status === "pending"
                          ? "Confirming…"
                          : slot
                            ? "Confirm booking · " +
                              (slots.find((s) => s.id === slot)?.label ?? slot)
                            : "Select a slot to continue"
                      }
                      disabled={
                        !validSlot ||
                        loading ||
                        !!slotsError ||
                        status === "pending"
                      }
                      onPress={async () => {
                        if (
                          !validSlot ||
                          loading ||
                          slotsError ||
                          status === "pending"
                        )
                          return;
                        setStatus("pending");
                        const ok = await book(d.id, date, slot);
                        setStatus(ok ? "success" : "error");
                        if (!ok) {
                          setSlot("");
                          retry();
                        }
                      }}
                    />
                    <Txt
                      style={[
                        styles.sub,
                        { textAlign: "center", fontSize: type.micro },
                      ]}
                    >
                      Free reschedule · Care for your whole family
                    </Txt>
                  </View>
                </>
              ) : (
                <Txt style={{ padding: space.xl }}>
                  Select a doctor to see dates and available times.
                </Txt>
              )}
            </>
          )}
        </Animated.View>
      </View>
    </TransitionScreen>
  );
}
