import { useCare } from "@/state/app";
import { useTheme } from "@/theme";
import { ActivityIndicator, Modal, View } from "react-native";
import { Card, Txt } from "./ui";

export function LanguageLoader() {
  const busy = useCare((s) => s.languageChanging);
  const t = useTheme();
  return (
    <Modal
      visible={busy}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: t.space.xxl,
          backgroundColor: t.colors.overlay,
        }}
      >
        <Card
          accessibilityViewIsModal
          style={{ alignItems: "center", gap: t.space.lg }}
        >
          <ActivityIndicator size="large" color={t.colors.primary} />
          <Txt accessibilityRole="alert" accessibilityLiveRegion="polite">
            Changing language…
          </Txt>
        </Card>
      </View>
    </Modal>
  );
}
