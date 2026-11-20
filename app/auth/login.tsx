import { AuthShell } from "@/components/auth/AuthShell";
import { Button, Txt, styles } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/state/auth";
import { useTheme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
export default function Login() {
  const { busy, error, sendOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const t = useTheme();
  const { translate } = useTranslation();
  return (
    <AuthShell>
      <Txt style={styles.title}>Welcome to better care</Txt>
      <Txt style={styles.sub}>
        Sign in with your mobile number to keep your family’s care together.
      </Txt>
      <Txt style={{ fontWeight: "700" }}>Mobile number</Txt>
      <View
        style={[
          styles.row,
          {
            backgroundColor: t.colors.surface,
            borderWidth: 1,
            borderColor: t.colors.line,
            borderRadius: t.radius.lg,
            paddingHorizontal: t.space.lg,
          },
        ]}
      >
        <Txt>🇮🇳 +91</Txt>
        <TextInput
          accessibilityLabel={translate("Mobile number")}
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={10}
          value={phone}
          onChangeText={(v) => setPhone(v.replace(/\D/g, ""))}
          placeholder={translate("Enter 10-digit number")}
          placeholderTextColor={t.colors.textSecondary}
          style={{
            flex: 1,
            minHeight: t.metrics.avatar,
            fontSize: t.type.lead,
            color: t.colors.textPrimary,
          }}
        />
      </View>
      {!!error && (
        <Txt accessibilityRole="alert" style={{ color: t.colors.red }}>
          {error}
        </Txt>
      )}
      <Button
        title={busy ? "Sending code…" : "Continue with OTP"}
        disabled={busy}
        onPress={() => {
          void sendOtp(phone).then((ok) => {
            if (ok) router.push("/auth/otp");
          });
        }}
      />
      <Txt style={styles.sub}>
        Assessment demo: no SMS is sent. Use verification code 123456. Sign-in
        is required to continue.
      </Txt>
    </AuthShell>
  );
}
