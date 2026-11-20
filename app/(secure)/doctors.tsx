import { View } from "react-native";
import { Header } from "@/components/Header";
import { DoctorList } from "@/components/doctors/DoctorList";
import { useTheme } from "@/theme";

export default function Doctors() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <Header />
      <DoctorList />
    </View>
  );
}
