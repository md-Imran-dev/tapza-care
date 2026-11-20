import { AuthShell } from "@/components/auth/AuthShell";
import { Button, Txt, styles } from "@/components/ui";
import { useAuth } from "@/state/auth";
import { useTheme } from "@/theme";
import { useState } from "react";
import { TextInput } from "react-native";
export default function Signup() {
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
