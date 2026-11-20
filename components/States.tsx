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
  kind?: "home" | "slots" | "cards";
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
          {block(t.metrics.serviceImage, "actions")}
          {block(t.metrics.doctorImage, "services")}
        </>
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
          {block(t.metrics.doctorImage, "1")}
          {block(t.metrics.doctorImage, "2")}
        </>
      )}
    </View>
  );
}
