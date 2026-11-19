import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";
import { Header } from "../components/Header";
import { Button, Card, Icon, styles, Txt } from "../components/ui";
import { EmptyState, Skeleton } from "../components/States";
import { STR } from "../data/mockData";
import { useCare } from "../state/app";
import { useAuth } from "../state/auth";
import { useTheme } from "../theme";
import { enableReminders } from "../lib/reminders";
import { localDateKey } from "../lib/dates";
export function Page({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <Header />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.page}
      >
        {children}
      </ScrollView>
    </View>
  );
}
export function Bookings() {
  const bookings = useCare((s) => s.bookings);
  const syncing = useCare((s) => s.syncing);
  const t = useTheme();
  return (
    <Page>
      <Txt style={styles.title}>Your bookings</Txt>
      <Txt style={styles.sub}>Your family’s care, all in one place</Txt>
      {!!syncing && <Txt>Syncing saved visits…</Txt>}
      {bookings.length === 0 && (
        <EmptyState
          title="No visits yet"
          message="Your next step to feeling better starts here."
          action="Find a doctor"
          onAction={() => router.push("/doctors")}
        />
      )}
      {bookings.map((b) => (
        <Card key={b.id}>
          <View style={[styles.row, { justifyContent: "space-between" }]}>
            <Icon name="calendar" />
            <Txt
              style={{
                fontSize: t.type.caption,
                fontWeight: "800",
                color:
                  b.status === "failed"
                    ? t.colors.red
                    : b.status === "confirmed"
                      ? t.colors.green
                      : t.colors.amber,
              }}
            >
              {b.status.toUpperCase()}
            </Txt>
          </View>
          <Txt style={styles.heading}>{b.doctorName}</Txt>
          <Txt style={styles.sub}>
            📅 {b.date} · {b.time}
          </Txt>
          <View
            style={{
              backgroundColor: t.colors.paleGreen,
              padding: t.space.md,
              borderRadius: t.radius.md,
            }}
          >
            <Txt style={{ fontWeight: "800" }}>
              {b.tokenNo
                ? `Token #${b.tokenNo}`
                : "Token assigned after confirmation"}
            </Txt>
          </View>
          {b.status === "queued" && (
            <Txt style={styles.sub}>
              Saved offline. We’ll retry when you reconnect.
            </Txt>
          )}
          {b.status === "failed" && (
            <>
              <Txt style={{ color: t.colors.red }}>
                This slot was taken while your booking was offline.
              </Txt>
              <Button
                title="Pick another slot"
                onPress={() =>
                  router.push({
                    pathname: "/booking",
                    params: { doctorId: b.doctorId },
                  })
                }
              />
            </>
          )}
        </Card>
      ))}
      <Button title="+ Book a visit" onPress={() => router.push("/doctors")} />
    </Page>
  );
}
export function Prescriptions({
  reminders = false,
  initialId,
}: {
  reminders?: boolean;
  initialId?: string;
}) {
  const [open, setOpen] = useState<string | null>(initialId ?? null);
  const doses = useCare((s) => s.doses);
  const prescriptions = useCare((s) => s.prescriptions);
  const dataStatus = useCare((s) => s.dataStatus);
  const toggle = useCare((s) => s.toggleDose);
  const lang = useCare((s) => s.lang);
  const [notice, setNotice] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const t = useTheme();
  const rx = prescriptions.find((r) => r.id === open);
  return (
    <Page>
      <Txt style={styles.title}>
        {reminders ? "Medicine reminders" : "Your prescriptions"}
      </Txt>
      <Txt style={styles.sub}>Care continues after your clinic visit</Txt>
      {!!reminders && (
        <>
          <Button
            title={scheduling ? "Scheduling…" : "Enable medicine reminders"}
            disabled={scheduling}
            onPress={() => {
              setScheduling(true);
              void enableReminders(prescriptions, lang)
                .then((count) =>
                  setNotice(
                    count
                      ? `Next ${count} dose reminders scheduled within the prescription durations.`
                      : "No upcoming doses in these prescriptions.",
                  ),
                )
                .catch((e: Error) => setNotice(e.message))
                .finally(() => setScheduling(false));
            }}
          />
          {!!notice && <Txt accessibilityRole="alert">{notice}</Txt>}
        </>
      )}
      {dataStatus === "loading" ? (
        <Skeleton />
      ) : dataStatus === "error" ? (
        <EmptyState
          title="Prescriptions couldn’t refresh"
          message="Check your connection. Saved doses are safe."
          action="Retry"
          onAction={() => void useCare.getState().loadData()}
        />
      ) : null}
      {rx ? (
        <>
          <Button
            title="‹ All prescriptions"
            secondary
            onPress={() => setOpen(null)}
          />
          <Card>
            <Txt style={styles.heading}>{rx.doctorName}</Txt>
            <Txt style={styles.sub}>
              {rx.clinicName} · {rx.issuedAt}
            </Txt>
            <Txt
              style={{
                backgroundColor: t.colors.paleGreen,
                padding: t.space.md,
                borderRadius: t.radius.md,
              }}
            >
              {rx.diagnosis}
            </Txt>
            {(["morning", "afternoon", "night"] as const).map((period) => (
              <View
                key={period}
                style={{ gap: t.space.sm, marginTop: t.space.md }}
              >
                <Txt
                  style={{ fontWeight: "800", color: t.colors.textSecondary }}
                >
                  {period === "morning"
                    ? "🌅"
                    : period === "afternoon"
                      ? "☀️"
                      : "🌙"}{" "}
                  {STR[period][lang]}
                </Txt>
                {rx.medicines
                  .filter((m) => m.timing.includes(period))
                  .map((m) => {
                    const key = `${localDateKey()}-${rx.id}-${m.id}-${period}`;
                    const done = doses[key];
                    return (
                      <View
                        key={key}
                        style={{
                          borderWidth: 1,
                          borderColor: done ? t.colors.green : t.colors.line,
                          borderRadius: t.radius.lg,
                          padding: t.space.md,
                          gap: t.space.sm,
                          backgroundColor: done
                            ? t.colors.paleGreen
                            : t.colors.surface,
                        }}
                      >
                        <Txt
                          style={{
                            fontWeight: "800",
                            textDecorationLine: done ? "line-through" : "none",
                          }}
                        >
                          💊 {m.name}
                        </Txt>
                        <Txt style={styles.sub}>
                          {m.dose} · {m.days} days
                          {m.withFood === undefined
                            ? ""
                            : m.withFood
                              ? " · After food"
                              : " · Before food"}
                        </Txt>
                        <Button
                          title={
                            done ? "✓ " + STR.taken[lang] : STR.takeDose[lang]
                          }
                          secondary={done}
                          onPress={() => toggle(key)}
                        />
                      </View>
                    );
                  })}
              </View>
            ))}
            <Txt
              style={[
                styles.sub,
                { textAlign: "center", marginTop: t.space.md },
              ]}
            >
              Today · {localDateKey()} · 8 AM / 1 PM / 9 PM
            </Txt>
          </Card>
        </>
      ) : prescriptions.length ? (
        prescriptions.map((r) => (
          <Pressable
            key={r.id}
            onPress={() => setOpen(r.id)}
            accessibilityRole="button"
          >
            <Card>
              <View style={[styles.row, { justifyContent: "space-between" }]}>
                <Txt
                  style={{
                    color: t.colors.green,
                    fontWeight: "700",
                    fontSize: t.type.caption,
                  }}
                >
                  {r.issuedAt}
                </Txt>
                <Icon name="next" />
              </View>
              <Txt style={styles.heading}>{r.doctorName}</Txt>
              <Txt style={styles.sub}>{r.specialty}</Txt>
              <Txt style={styles.sub}>{r.clinicName}</Txt>
              <Txt
                style={{
                  fontSize: t.type.caption,
                  backgroundColor: t.colors.paleGreen,
                  borderRadius: t.radius.md,
                  padding: t.space.md,
                }}
              >
                💊 {r.medicines.length} medicines · {r.diagnosis}
              </Txt>
            </Card>
          </Pressable>
        ))
      ) : dataStatus === "ready" ? (
        <EmptyState
          title="No prescriptions yet"
          message="After your clinic visit, your medicines and schedule will appear here."
        />
      ) : null}
    </Page>
  );
}
export function Profile() {
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
export function Admin() {
  const config = useCare((s) => s.config);
  const network = useCare((s) => s.network);
  const update = useCare((s) => s.updateNetwork);
  const patch = useCare((s) => s.patch);
  const t = useTheme();
  const [text, setText] = useState(JSON.stringify(config, null, 2));
  const [message, setMessage] = useState("");
  return (
    <Page>
      <Button
        title="‹ Back to profile"
        secondary
        onPress={() => router.back()}
      />
      <Txt style={styles.title}>Demo lab</Txt>
      <Txt style={styles.sub}>
        Test slow networks, server failures and empty states.
      </Txt>
      <Card>
        <Txt style={styles.heading}>Network delay</Txt>
        <View style={styles.row}>
          {[200, 1000, 3000].map((ms) => (
            <Button
              key={ms}
              title={`${ms}ms`}
              secondary={network.latencyMs !== ms}
              onPress={() => update({ latencyMs: ms })}
            />
          ))}
        </View>
        {(
          [
            "offline",
            "failConfig",
            "failBooking",
            "failSlots",
            "emptySlots",
            "emptyDoctors",
            "emptyPrescriptions",
          ] as const
        ).map((key, i) => (
          <View
            key={key}
            style={[
              styles.row,
              { justifyContent: "space-between", minHeight: t.metrics.touch },
            ]}
          >
            <Txt style={{ flex: 1 }}>
              {
                [
                  "Offline mode",
                  "Fail config fetch",
                  "Booking conflict (409)",
                  "Fail slot fetch",
                  "No available slots",
                  "Empty doctor list",
                  "Empty prescription list",
                ][i]
              }
            </Txt>
            <Switch
              accessibilityLabel={key}
              value={network[key]}
              onValueChange={(value) => update({ [key]: value })}
              trackColor={{ true: t.colors.primary }}
            />
          </View>
        ))}
        <Button
          title="Refresh home & lists"
          onPress={() => {
            void Promise.all([
              useCare.getState().loadConfig(),
              useCare.getState().loadData(),
            ]);
          }}
        />
      </Card>
      <Txt style={styles.heading}>Live configuration</Txt>
      <TextInput
        accessibilityLabel="Layout config JSON"
        multiline
        value={text}
        onChangeText={setText}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          minHeight: 320,
          borderRadius: t.radius.lg,
          padding: t.space.lg,
          backgroundColor: t.colors.secondary,
          color: t.colors.white,
          fontFamily: "monospace",
          fontSize: t.type.caption,
          textAlignVertical: "top",
        }}
      />
      {!!message && <Txt accessibilityRole="alert">{message}</Txt>}
      <Button
        title="Apply configuration"
        onPress={() => {
          if (patch(text)) setMessage("Applied. Your home has updated.");
          else
            setMessage(
              "Invalid config. Check theme colours, tabs and section item fields.",
            );
        }}
      />
    </Page>
  );
}
