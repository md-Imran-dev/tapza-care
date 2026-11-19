import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../state/auth";
import { Button, Icon, Txt, styles } from "../components/ui";
import { useTheme } from "../theme";
function AuthShell({ children }: { children: React.ReactNode }) {
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
              backgroundColor: t.colors.white + "25",
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
export function Onboarding() {
  const t = useTheme();
  const [busy, setBusy] = useState(false);
  const [storageError, setStorageError] = useState("");
  return (
    <AuthShell>
      <Txt style={styles.title}>
        Your neighbourhood clinic, now in your pocket.
      </Txt>
      <Txt style={styles.sub}>
        Book trusted doctors, keep your prescriptions together and make medicine
        time a little easier.
      </Txt>
      {[
        ["calendar", "Visits without the wait"],
        ["rx", "Prescriptions for your family"],
        ["bell", "Never lose track of a dose"],
      ].map(([icon, label]) => (
        <View key={icon} style={styles.row}>
          <Icon name={icon} color={t.colors.primary} />
          <Txt>{label}</Txt>
        </View>
      ))}
      <Button
        title={busy ? "Getting ready…" : "Get started"}
        disabled={busy}
        onPress={() => {
          setBusy(true);
          void useAuth
            .getState()
            .finishOnboarding()
            .then(() => router.replace("/auth/login"))
            .catch((error: Error) => {
              setBusy(false);
              setStorageError(error.message);
            });
        }}
      />
      {!!storageError && <Txt accessibilityRole="alert">{storageError}</Txt>}
      <Txt style={styles.sub}>
        Designed for Indian families · English, हिंदी, తెలుగు
      </Txt>
    </AuthShell>
  );
}
export function Login() {
  const { busy, error, sendOtp } = useAuth();
  const [phone, setPhone] = useState("");
  const t = useTheme();
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
          accessibilityLabel="Mobile number"
          keyboardType="phone-pad"
          autoComplete="tel"
          maxLength={10}
          value={phone}
          onChangeText={(v) => setPhone(v.replace(/\D/g, ""))}
          placeholder="Enter 10-digit number"
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
export function Otp() {
  const { phone, otpSentAt, busy, error, sendOtp, verify } = useAuth();
  const [code, setCode] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const t = useTheme();
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
        accessibilityLabel="Verification code"
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
          letterSpacing: 8,
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
export function Signup() {
  const session = useAuth((s) => s.session);
  const [name, setName] = useState(session?.name ?? "");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const t = useTheme();
  return (
    <AuthShell>
      <Txt style={styles.title}>What should we call you?</Txt>
      <Txt style={styles.sub}>
        One last step before we take care of the rest.
      </Txt>
      <TextInput
        accessibilityLabel="Full name"
        autoComplete="name"
        value={name}
        onChangeText={setName}
        placeholder="Your full name"
        placeholderTextColor={t.colors.textSecondary}
        style={{
          backgroundColor: t.colors.surface,
          color: t.colors.textPrimary,
          borderWidth: 1,
          borderColor: t.colors.line,
          padding: t.space.lg,
          minHeight: t.metrics.avatar,
          borderRadius: t.radius.lg,
          fontSize: t.type.lead,
        }}
      />
      {!!error && <Txt style={{ color: t.colors.red }}>{error}</Txt>}
      <Button
        title={busy ? "Saving…" : "Start caring for my family"}
        disabled={busy || name.trim().length < 2}
        onPress={() => {
          setBusy(true);
          void useAuth
            .getState()
            .register(name)
            .catch((e: Error) => {
              setError(e.message);
              setBusy(false);
            });
        }}
      />
    </AuthShell>
  );
}
