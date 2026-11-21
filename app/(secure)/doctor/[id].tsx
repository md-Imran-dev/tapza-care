import { DoctorDetails } from "@/components/doctors/DoctorDetails";
import { TransitionScreen } from "@/components/motion/TransitionScreen";
import { Txt } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useCare } from "@/store/careStore";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Doctor() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const doctor = useCare((s) => s.doctors.find((d) => d.id === id));
  const t = useTheme();
  return (
    <TransitionScreen>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: t.colors.background }}>
        <ScrollView
          contentContainerStyle={{ padding: t.space.md, gap: t.space.md }}
        >
          {doctor ? (
            <DoctorDetails
              key={doctor.id}
              doctor={doctor}
              onBook={(date, slotId) =>
                router.push({
                  pathname: "/booking",
                  params: { doctorId: doctor.id, date, slotId },
                })
              }
            />
          ) : (
            <Txt>Doctor not found.</Txt>
          )}
        </ScrollView>
      </SafeAreaView>
    </TransitionScreen>
  );
}
