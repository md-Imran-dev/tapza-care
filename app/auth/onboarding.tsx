import { AuthShell } from "@/components/auth/AuthShell";
import { Button, Icon, Txt, styles } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/store/authStore";
import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
export default function Onboarding() {
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
