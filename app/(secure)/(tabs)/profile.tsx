import { Page } from "@/components/Page";
import { Button, Card, styles, Txt } from "@/components/ui";
import { useCare } from "@/state/app";
import { useAuth } from "@/state/auth";
import { useTheme } from "@/theme";
import { router } from "expo-router";
import { Alert, View } from "react-native";
export default function Profile() {
  const config = useCare((s) => s.config);
  const festival = useCare((s) => s.festival);
  const session = useAuth((s) => s.session);
  const t = useTheme();
  return (
    <Page>
      <Txt style={styles.title}>Your family, our care</Txt>
      <Card>
        <View style={styles.row}>
          <View
            style={{
              backgroundColor: t.colors.primary,
              borderRadius: t.radius.lg,
              padding: t.space.lg,
            }}
          >
            <Txt
              style={{
                fontSize: t.type.title,
                color: t.colors.white,
                fontWeight: "800",
              }}
            >
              {session?.name.charAt(0).toUpperCase()}
            </Txt>
          </View>
          <View style={{ flex: 1 }}>
            <Txt style={styles.heading}>{session?.name}</Txt>
            <Txt style={styles.sub}>+91 {session?.phone} · Hyderabad</Txt>
          </View>
        </View>
        <Button
          title="Manage family members"
          secondary
          onPress={() => router.push("/family")}
        />
      </Card>
      <Card>
        <Txt style={styles.heading}>Make yourself at home</Txt>
        <Txt style={styles.sub}>Home configuration v{config.version}</Txt>
        <Button
          title={
            festival
              ? "🪔 Diwali · Switch to normal"
              : "☀️ Normal day · Switch to Diwali"
          }
          onPress={() => void useCare.getState().toggleTheme()}
        />
        <Button
          title="Medicine reminders"
          secondary
          onPress={() => router.push("/reminders")}
        />
      </Card>
      <Button
        title="Demo lab & live config editor"
        secondary
        onPress={() => router.push("/admin")}
      />
      <Button
        title="Sign out"
        secondary
        onPress={() => {
          void useAuth
            .getState()
            .logout()
            .catch(() => Alert.alert("Could not sign out", "Please retry."));
        }}
      />
      <Txt style={styles.sub}>
        Tapza Care · Assessment demo · No real bookings or messages
      </Txt>
    </Page>
  );
}
