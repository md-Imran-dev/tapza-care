import { EmptyState, Skeleton } from "@/components/States";
import { Button, Card, Icon, styles, Txt } from "@/components/ui";
import { STR } from "@/data/mockData";
import { localDateKey } from "@/lib/dates";
import { useCare } from "@/state/app";
import { useTheme } from "@/theme";
import { Pressable, View } from "react-native";
export function PrescriptionContent({
  open,
  onSelect,
}: {
  open: string | null;
  onSelect: (id: string | null) => void;
}) {
  const doses = useCare((s) => s.doses);
  const prescriptions = useCare((s) => s.prescriptions);
  const dataStatus = useCare((s) => s.dataStatus);
  const toggle = useCare((s) => s.toggleDose);
  const lang = useCare((s) => s.lang);
  const t = useTheme();
  const rx = prescriptions.find((r) => r.id === open);
  return (
    <>
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
            onPress={() => onSelect(null)}
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
            onPress={() => onSelect(r.id)}
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
    </>
  );
}
