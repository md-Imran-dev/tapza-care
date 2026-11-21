import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, styles, Txt } from "../ui";

export function BookingSheet({
  title,
  children,
  disabled = false,
  onClose,
}: {
  title: string;
  children: ReactNode;
  disabled?: boolean;
  onClose: () => void;
}) {
  const t = useTheme();
  const inset = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const { translate } = useTranslation();
  const offset = useSharedValue(0);
  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onUpdate((event) => {
      offset.value = Math.max(0, event.translationY);
    })
    .onEnd(() => {
      if (offset.value > t.motion.dismissDistance) runOnJS(onClose)();
      else
        offset.value = reducedMotion ? 0 : withSpring(0, t.motion.sheetSpring);
    });
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{
        flex: 1,
        backgroundColor: t.colors.overlay,
        justifyContent: "flex-end",
      }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={translate("Close booking")}
        disabled={disabled}
        onPress={onClose}
        style={{ flex: 1 }}
      />
      <Animated.View
        style={[
          {
            height: "90%",
            borderTopLeftRadius: t.radius.banner,
            borderTopRightRadius: t.radius.banner,
            backgroundColor: t.colors.surface,
            paddingBottom: Math.max(inset.bottom, t.space.lg),
          },
          animatedStyle,
        ]}
      >
        <GestureDetector gesture={gesture}>
          <View style={{ padding: t.space.md, gap: t.space.sm }}>
            <View
              style={{
                alignSelf: "center",
                width: t.metrics.dragHandleWidth,
                height: t.metrics.dragHandleHeight,
                borderRadius: t.radius.xs,
                backgroundColor: t.colors.line,
              }}
            />
            <View style={styles.row}>
              <Txt
                accessibilityRole="header"
                style={[styles.heading, { flex: 1 }]}
              >
                {title}
              </Txt>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={translate("Close booking")}
                disabled={disabled}
                onPress={onClose}
                style={{
                  minWidth: t.metrics.touch,
                  minHeight: t.metrics.touch,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon name="close" />
              </Pressable>
            </View>
          </View>
        </GestureDetector>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: t.space.xl, gap: t.space.lg }}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
