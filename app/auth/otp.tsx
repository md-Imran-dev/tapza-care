import { tracking as uiTracking , useTheme } from "@/theme";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button, Txt, styles } from "@/components/ui";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/state/auth";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
export default function Otp() {
  const { phone, otpSentAt, busy, error, sendOtp, verify } = useAuth();
  const [code, setCode] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const t = useTheme();
  const { translate } = useTranslation();
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const remaining = Math.max(0, 30 - Math.floor((now - otpSentAt) / 1000));
  return (
    <AuthShell>
      <Button
        title="‹ Change mobile number"
        secondary
        onPress={() => router.back()}
      />
      <Txt style={styles.title}>Verify your number</Txt>
      <Txt style={styles.sub}>Enter the six-digit code for +91 {phone}.</Txt>
      <TextInput
        accessibilityLabel={translate("Verification code")}
        keyboardType="number-pad"
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        maxLength={6}
        value={code}
        onChangeText={(v) => setCode(v.replace(/\D/g, ""))}
        placeholder="• • • • • •"
        placeholderTextColor={t.colors.textSecondary}
        style={{
          minHeight: t.metrics.avatar,
          borderRadius: t.radius.lg,
          borderWidth: 1,
          borderColor: t.colors.line,
          backgroundColor: t.colors.surface,
          color: t.colors.textPrimary,
          padding: t.space.lg,
          fontSize: t.type.title,
          letterSpacing: uiTracking.otp,
          textAlign: "center",
        }}
      />
      {!!error && (
        <Txt accessibilityRole="alert" style={{ color: t.colors.red }}>
          {error}
        </Txt>
      )}
      <Button
        title={busy ? "Verifying…" : "Verify & continue"}
        disabled={busy || code.length !== 6 || !phone}
        onPress={() => {
          void verify(code);
        }}
      />
      <Button
        title={remaining ? `Resend code in ${remaining}s` : "Resend code"}
        secondary
        disabled={busy || remaining > 0 || !phone}
        onPress={() => {
          void sendOtp(phone);
        }}
      />
      <Txt style={styles.sub}>
        Demo verification code: 123456 · Valid for 5 minutes
      </Txt>
    </AuthShell>
  );
}
