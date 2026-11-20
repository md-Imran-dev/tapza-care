import { Header } from "@/components/Header";
import { DoctorList } from "@/components/doctors/DoctorList";
import { TransitionScreen } from "@/components/motion/TransitionScreen";
import { useTheme } from "@/theme";
import { View } from "react-native";

export default function Doctors() {
  const t = useTheme();
  return (
    <TransitionScreen>
      <View style={{ flex: 1, backgroundColor: t.colors.background }}>
        <Header />
        <DoctorList />
      </View>
    </TransitionScreen>
  );
}
