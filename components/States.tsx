import { View } from "react-native";
import { useTheme } from "../theme";
import { Button, Card, Icon, Txt, styles } from "./ui";
export function EmptyState({
  title,
  message,
  action,
  onAction,
}: {
  title: string;
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  const t = useTheme();
  return (
    <Card style={{ alignItems: "center", padding: t.space.xxl }}>
      <Icon name="calendar" color={t.colors.primary} size={t.type.hero} />
      <Txt style={[styles.heading, { textAlign: "center" }]}>{title}</Txt>
      <Txt style={[styles.sub, { textAlign: "center" }]}>{message}</Txt>
      {!!action && onAction && <Button title={action} onPress={onAction} />}
    </Card>
  );
}
export function Skeleton({
  kind = "cards",
}: {
  kind?: "home" | "slots" | "cards" | "doctors";
}) {
  const t = useTheme();
  const block = (height: number, key: string) => (
    <View
      key={key}
      accessibilityLabel="Loading content"
      style={{
        height,
        borderRadius: t.radius.lg,
        backgroundColor: t.colors.line,
      }}
    />
  );
  return (
    <View style={{ gap: t.space.md, padding: t.space.xl }}>
      {kind === "home" ? (
        <>
          {block(t.metrics.hero, "hero")}
          <View style={styles.row}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={{
                  height: t.metrics.touch,
                  flex: 1,
                  borderRadius: t.radius.pill,
                  backgroundColor: t.colors.line,
                }}
              />
            ))}
          </View>
          <View style={styles.row}>{[1, 2, 3, 4].map((i) => <View key={i} style={{ flex: 1, height: t.metrics.button + t.space.xl, borderRadius: t.radius.panel, backgroundColor: t.colors.line }} />)}</View>
          <View style={styles.row}>{[1, 2].map((i) => <View key={i} style={{ flex: 1, gap: t.space.sm }}>{block(t.metrics.serviceImage, `image-${i}`)}{block(t.type.body, `name-${i}`)}{block(t.metrics.button, `book-${i}`)}</View>)}</View>
        </>
      ) : kind === "doctors" ? (
        ["first", "second"].map((key) => <View key={key} style={[styles.row, { padding: t.space.md, borderRadius: t.radius.doctor, backgroundColor: t.colors.surface }]}>
          <View style={{ width: t.metrics.avatar, height: t.metrics.doctorImage, backgroundColor: t.colors.line, borderRadius: t.radius.lg }} />
          <View style={{ flex: 1, gap: t.space.md }}>{block(t.type.heading, "name")}{block(t.type.body, "specialty")}{block(t.type.caption, "time")}{block(t.metrics.touch, "actions")}</View>
        </View>)
      ) : kind === "slots" ? (
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: t.space.sm }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <View
              key={i}
              style={{
                height: t.metrics.touch,
                width: "30%",
                borderRadius: t.radius.md,
                backgroundColor: t.colors.line,
              }}
            />
          ))}
        </View>
      ) : (
        <>
          {[1, 2].map((i) => <Card key={i}>{block(t.type.caption, `date-${i}`)}{block(t.type.heading, `doctor-${i}`)}{block(t.type.body, `clinic-${i}`)}{block(t.metrics.touch, `diagnosis-${i}`)}</Card>)}
        </>
      )}
    </View>
  );
}
