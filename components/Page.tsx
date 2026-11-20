import { Header } from "@/components/Header";
import { styles } from "@/components/ui";
import { useTheme } from "@/theme";
import { ScrollView, View } from "react-native";
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
