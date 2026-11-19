import { useLocalSearchParams } from "expo-router";
import { Prescriptions } from "../../../screens/Patient";
export default function Screen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <Prescriptions initialId={id} />;
}
