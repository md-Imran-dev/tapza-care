import { useTheme } from "@/theme";
import type { ReactNode } from "react";
import { View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Icon, styles, Txt } from "../ui";

export function BookingSuccess({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const t = useTheme();
  return (
    <Animated.View
      entering={FadeIn.duration(t.motion.successFade)}
      style={{ gap: t.space.lg, paddingVertical: t.space.xl }}
    >
      <Animated.View
        entering={ZoomIn.duration(t.motion.successZoom)}
        style={{
          alignSelf: "center",
          padding: t.space.xl,
          borderRadius: t.radius.pill,
          backgroundColor: t.colors.paleGreen,
        }}
      >
        <Icon
          name="check"
          color={t.colors.green}
          size={t.metrics.successIcon}
        />
      </Animated.View>
      <Txt
        accessibilityRole="alert"
        style={[styles.title, { textAlign: "center" }]}
      >
        {title}
      </Txt>
      <View style={{ gap: t.space.md }}>{children}</View>
    </Animated.View>
  );
}
