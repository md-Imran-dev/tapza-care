import { Txt } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export function AuthShell({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: t.colors.background }}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <LinearGradient
          colors={[t.colors.secondary, t.colors.primary]}
          style={{
            paddingTop: insets.top + t.space.huge,
            padding: t.space.xxl,
            gap: t.space.lg,
            paddingBottom: t.space.huge,
          }}
        >
          <View
            style={{
              width: t.metrics.avatar,
              height: t.metrics.avatar,
              borderRadius: t.radius.lg,
              backgroundColor: t.colors.whiteTranslucent,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Txt
              style={{
                fontSize: t.type.hero,
                color: t.colors.white,
                fontWeight: "900",
              }}
            >
              ✚
            </Txt>
          </View>
          <Txt
            style={{
              fontSize: t.type.display,
              fontWeight: "900",
              color: t.colors.white,
            }}
          >
            Tapza Care
          </Txt>
          <Txt style={{ fontSize: t.type.body, color: t.colors.white }}>
            A little care. A healthier family.
          </Txt>
        </LinearGradient>
        <View
          style={{
            padding: t.space.xxl,
            gap: t.space.xl,
            flex: 1,
            paddingBottom: insets.bottom + t.space.xxl,
          }}
        >
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
