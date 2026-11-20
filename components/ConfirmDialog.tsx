import { Modal, ScrollView, View } from "react-native";
import { useTheme } from "@/theme";
import { Button, Card, styles, Txt } from "./ui";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({
  visible, title, message, confirmLabel, busy = false, onCancel, onConfirm,
}: Props) {
  const t = useTheme();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => { if (!busy) onCancel(); }}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: t.space.xxl, backgroundColor: t.colors.overlay }}>
        <ScrollView style={{ flexGrow: 0 }} contentContainerStyle={{ alignItems: "center" }}>
          <Card testID="confirm-dialog" accessibilityViewIsModal onAccessibilityEscape={() => { if (!busy) onCancel(); }} style={{ width: "100%", maxWidth: 420, gap: t.space.lg }}>
            <Txt accessibilityRole="header" style={styles.heading}>{title}</Txt>
            <Txt>{message}</Txt>
            <Button title={busy ? "Please wait…" : confirmLabel} disabled={busy} onPress={onConfirm} />
            <Button title="Cancel" secondary disabled={busy} onPress={onCancel} />
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
}
