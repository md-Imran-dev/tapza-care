import { DoctorCard } from "@/components/doctors/DoctorCard";
import { Button, Icon, styles, Txt } from "@/components/ui";
import type {
  ChipItem,
  DoctorCarouselItem,
  HeroItem,
  OfferItem,
  QuickActionItem,
  Section,
  ServiceItem,
} from "@/data/types";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/store/authStore";
import { useCare } from "@/store/careStore";
import {
  space,
  type,
  lineHeight as uiLineHeight,
  metrics as uiMetrics,
  radius as uiRadius,
} from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { memo, useEffect } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";
function Band({
  section,
  children,
}: {
  section: Section;
  children: React.ReactNode;
}) {
  const theme = useTheme();
  const b = section.background;
  const backgroundValue = b.value;
  const style: ViewStyle = { paddingVertical: space.xl };
  if (b.kind === "gradient") {
    const colors = backgroundValue.match(/#[a-fA-F0-9]{3,8}/g) ?? [
      theme.colors.secondary,
      theme.colors.primary,
    ];
    return (
      <View style={style}>
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          style={{ position: "absolute", inset: 0 }}
        />
        {children}
      </View>
    );
  }
  if (b.kind === "image")
    return (
      <ImageBackground source={{ uri: backgroundValue }} style={style}>
        {children}
      </ImageBackground>
    );
  return (
    <View style={[style, { backgroundColor: backgroundValue }]}>
      {children}
    </View>
  );
}
export const SectionRenderer = memo(function SectionRenderer({
  section: s,
  visible = true,
  scroll,
}: {
  section: Section;
  visible?: boolean;
  scroll: SharedValue<number>;
}) {
  const { width } = useWindowDimensions();
  const doctorCardWidth = Math.min(400, Math.max(0, width - space.xl * 2));
  const palette = useTheme().colors;
  const config = useCare((state) => state.config);
  const doctors = useCare((state) => state.doctors);
  const name = useAuth((state) => state.session?.name ?? "there");
  // Content stays readable even before a platform reports its first viewability event.
  const offset = useSharedValue(1);
  useEffect(() => {
    if (visible) {
      offset.value = 0;
      offset.value = withTiming(1, { duration: 400 });
    }
  }, [visible, offset]);
  const revealStyle = useAnimatedStyle(() => ({
    opacity: offset.value,
    transform: [{ translateY: (1 - offset.value) * 24 }],
  }));
  const imageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: Math.min(scroll.value * 0.12, 45) },
      { scale: 1.12 },
    ],
  }));

  if (
    ![
      "hero_banner",
      "category_chips",
      "quick_actions",
      "service_grid",
      "doctor_carousel",
      "offer_strip",
    ].includes(s.type)
  )
    return null;
  let content: React.ReactNode;
  if (s.type === "hero_banner") {
    const h = s.items[0] as HeroItem;
    content = (
      <View
        style={{
          marginHorizontal: space.xl,
          borderRadius: uiRadius.hero,
          overflow: "hidden",
          minHeight: uiMetrics.heroMinHeight,
        }}
      >
        <Animated.Image
          source={{ uri: h.image }}
          style={[
            { position: "absolute", width: "100%", height: "100%" },
            imageStyle,
          ]}
        />
        <LinearGradient
          colors={[palette.overlay, palette.heroFade]}
          style={{ padding: space.xl, gap: space.md }}
        >
          <Txt
            style={{
              alignSelf: "flex-start",
              color: palette.white,
              backgroundColor: palette.whiteTranslucent,
              borderRadius: uiRadius.lg,
              paddingHorizontal: space.md,
              paddingVertical: space.xs,
              fontSize: type.micro,
              fontWeight: "700",
            }}
          >
            🟢{" "}
            {config.theme.festival.name === "diwali"
              ? "Festival hours 7AM–11PM"
              : "Open today till 9 PM"}
          </Txt>
          <Txt
            style={{
              fontSize: type.title,
              lineHeight: uiLineHeight.title,
              fontWeight: "900",
              color: palette.white,
              maxWidth: uiMetrics.heroTextWidth,
            }}
          >
            {h.greeting.replace("Lakshmi garu", name)}
          </Txt>
          <Txt
            style={{
              fontSize: type.small,
              lineHeight: uiLineHeight.body,
              color: palette.onDarkSecondary,
            }}
          >
            {h.sub}
          </Txt>
          <View style={[styles.row, { flexWrap: "wrap" }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/booking")}
              style={{
                backgroundColor: palette.white,
                borderRadius: uiRadius.banner,
                padding: space.lg,
                minHeight: uiMetrics.touch,
                flexBasis: "45%",
                flexGrow: 1,
                flexShrink: 1,
                maxWidth: "100%",
              }}
            >
              <Txt style={{ fontWeight: "800", textAlign: "center" }}>
                {h.cta}
              </Txt>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/contact")}
              style={{
                borderWidth: 1,
                borderColor: palette.onDarkBorder,
                borderRadius: uiRadius.banner,
                padding: space.lg,
                minHeight: uiMetrics.touch,
                flexBasis: "45%",
                flexGrow: 1,
                flexShrink: 1,
                maxWidth: "100%",
              }}
            >
              <Txt
                style={{
                  color: palette.white,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                WhatsApp us
              </Txt>
            </Pressable>
          </View>
          <View style={styles.row}>
            {h.stats.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1,
                  borderRadius: uiRadius.stat,
                  padding: space.md,
                  backgroundColor: palette.glass,
                  alignItems: "center",
                  gap: space.xxs,
                }}
              >
                <Txt
                  style={{
                    color: palette.white,
                    fontWeight: "900",
                    fontSize: type.label,
                  }}
                >
                  {stat.value}
                </Txt>
                <Txt
                  style={{ color: palette.onDarkMuted, fontSize: type.micro }}
                >
                  {stat.label}
                </Txt>
              </View>
            ))}
          </View>
        </LinearGradient>
      </View>
    );
  } else if (s.type === "category_chips")
    content = (
      <View style={{ gap: space.md }}>
        <Txt style={[styles.heading, { marginHorizontal: space.xl }]}>
          {s.title}
        </Txt>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.sm }}
        >
          {(s.items as ChipItem[]).map((c) => (
            <Pressable
              accessibilityRole="button"
              onPress={() =>
                router.push({
                  pathname: "/doctors",
                  params: { category: c.label },
                })
              }
              key={c.id}
              style={[
                styles.row,
                {
                  backgroundColor: palette.white,
                  borderRadius: uiRadius.banner,
                  padding: space.sm,
                  paddingRight: space.lg,
                  minHeight: uiMetrics.chipHeight,
                  borderWidth: 1,
                  borderColor: palette.line,
                },
              ]}
            >
              <View
                style={{
                  backgroundColor: palette.paleGreen,
                  borderRadius: uiRadius.avatar,
                  padding: space.sm,
                }}
              >
                <Icon name={c.icon} color={config.theme.primary} size={20} />
              </View>
              <View>
                <Txt style={{ fontWeight: "800" }}>{c.label}</Txt>
                <Txt style={styles.sub}>{c.count}</Txt>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    );
  else if (s.type === "offer_strip") {
    const o = s.items[0] as OfferItem;
    content = (
      <View style={[styles.row, { paddingHorizontal: space.xl }]}>
        <Icon name="sparkles" color={config.theme.accent} />
        <Txt
          style={{
            flex: 1,
            color: palette.white,
            fontSize: type.caption,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          {o.message}
        </Txt>
        <Txt
          style={{
            color: palette.white,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: palette.onDarkOutline,
            padding: space.xxs,
            borderRadius: uiRadius.badge,
            fontSize: type.micro,
            fontWeight: "800",
          }}
        >
          {o.code}
        </Txt>
      </View>
    );
  } else if (s.type === "quick_actions")
    content = (
      <View style={{ paddingHorizontal: space.xl, gap: space.md }}>
        <Txt style={styles.heading}>{s.title}</Txt>
        <View style={{ flexDirection: "row", gap: space.sm }}>
          {(s.items as QuickActionItem[]).map((q, i) => (
            <Pressable
              accessibilityRole="button"
              key={q.id}
              onPress={() =>
                router.push(
                  (
                    [
                      "/booking",
                      "/prescriptions",
                      "/reminders",
                      "/family",
                    ] as const
                  )[i],
                )
              }
              style={{
                flex: 1,
                backgroundColor: [
                  palette.paleGreen,
                  palette.peach,
                  palette.blue,
                  palette.purple,
                ][i],
                borderRadius: uiRadius.panel,
                paddingVertical: space.md,
                alignItems: "center",
                gap: space.xs,
                borderWidth: 1,
                borderColor: palette.line,
              }}
            >
              <View
                style={{
                  backgroundColor: palette.white,
                  padding: space.md,
                  borderRadius: uiRadius.hero,
                }}
              >
                <Icon
                  name={["calendar", "rx", "bell", "user"][i]}
                  color={
                    [
                      config.theme.primary,
                      palette.orange,
                      palette.indigo,
                      palette.violet,
                    ][i]
                  }
                />
              </View>
              <Txt
                style={{
                  fontSize: type.micro,
                  fontWeight: "800",
                  textAlign: "center",
                  maxWidth: "100%",
                }}
              >
                {q.label}
              </Txt>
              <Txt
                style={{
                  fontSize: type.micro,
                  color: palette.muted,
                  textAlign: "center",
                }}
              >
                {q.desc}
              </Txt>
            </Pressable>
          ))}
        </View>
      </View>
    );
  else if (s.type === "service_grid")
    content = (
      <View style={{ paddingHorizontal: space.xl, gap: space.sm }}>
        <Txt style={styles.heading}>{s.title}</Txt>
        <Txt style={styles.sub}>{s.subtitle}</Txt>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: space.md }}>
          {(s.items as ServiceItem[]).map((item) => (
            <View
              key={item.id}
              style={{
                width: "48%",
                flexGrow: 1,
                backgroundColor: palette.white,
                borderRadius: uiRadius.panel,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: palette.line,
              }}
            >
              <View>
                <Image
                  source={{ uri: item.image }}
                  style={{ height: uiMetrics.serviceImage, width: "100%" }}
                />
                {!!item.badge && (
                  <Txt
                    style={{
                      position: "absolute",
                      top: 8,
                      left: 8,
                      backgroundColor: config.theme.accent,
                      color: palette.ink,
                      borderRadius: uiRadius.tile,
                      paddingHorizontal: space.sm,
                      paddingVertical: space.xxs,
                      fontSize: type.micro,
                      fontWeight: "800",
                    }}
                  >
                    {item.badge}
                  </Txt>
                )}
              </View>
              <View style={{ padding: space.md, gap: space.xs }}>
                <Txt
                  style={{
                    fontWeight: "800",
                    fontSize: type.small,
                    minHeight: uiMetrics.serviceNameHeight,
                  }}
                >
                  {item.name}
                </Txt>
                <Txt style={{ fontSize: type.micro, color: palette.orange }}>
                  ★ {item.rating}
                </Txt>
                <Txt
                  style={{
                    color: config.theme.primary,
                    fontWeight: "900",
                    fontSize: type.lead,
                  }}
                >
                  {item.priceInr === 0 ? "FREE" : `₹${item.priceInr}`}
                </Txt>
                <Button
                  title="ADD +"
                  onPress={() =>
                    router.push({
                      pathname: "/service/[id]",
                      params: { id: item.id },
                    })
                  }
                />
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  else
    content = (
      <View style={{ gap: space.sm }}>
        <Txt style={[styles.heading, { paddingHorizontal: space.xl }]}>
          {s.title}
        </Txt>
        <Txt style={[styles.sub, { paddingHorizontal: space.xl }]}>
          {s.subtitle}
        </Txt>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: space.xl, gap: space.md }}
        >
          {(s.items as DoctorCarouselItem[]).map((it) => {
            const d = doctors.find((d) => d.id === it.doctorId);
            if (!d) return null;
            return (
              <View key={d.id} style={{ width: doctorCardWidth }}>
                <DoctorCard doctor={d} />
              </View>
            );
          })}
        </ScrollView>
      </View>
    );
  return (
    <Animated.View style={revealStyle}>
      <Band section={s}>{content}</Band>
    </Animated.View>
  );
});
