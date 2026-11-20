import { Page } from "@/components/Page";
import { EmptyState } from "@/components/States";
import { Button, Card, Icon, styles, Txt } from "@/components/ui";
import { useCare } from "@/state/app";
import { useTheme } from "@/theme";
import { router } from "expo-router";
import { View } from "react-native";
export default function Bookings() {
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
