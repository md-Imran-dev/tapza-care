import { Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useCare } from "../../../state/app";
import { Page } from "../../../screens/Patient";
import { Button, Card, styles, Txt } from "../../../components/ui";
export default function Doctor() {
  const { id } = useLocalSearchParams<{
    id: string;
  }>();
  const d = useCare((s) => s.doctors.find((x) => x.id === id));
  return (
    <Page>
      <Button title="‹ Back" secondary onPress={() => router.back()} />
      {d ? (
        <>
          <Image
            source={{ uri: d.photoUrl }}
            style={{ height: 300, borderRadius: 28, width: "100%" }}
          />
          <Txt style={styles.title}>{d.name}</Txt>
          <Txt>{d.specialty}</Txt>
          <Card>
            <Txt style={styles.heading}>
              ★ {d.rating} · {d.expYears} years of care
            </Txt>
            <Txt style={styles.sub}>{d.clinic}</Txt>
            <Txt style={styles.sub}>Speaks {d.languages.join(", ")}</Txt>
            <Txt style={styles.sub}>Next available · {d.nextSlot}</Txt>
          </Card>
          <Txt style={styles.heading}>₹{d.feeInr} · Pay at clinic</Txt>
          <Button
            title="Book a visit"
            onPress={() =>
              router.push({ pathname: "/booking", params: { doctorId: d.id } })
            }
          />
        </>
      ) : (
        <Txt>Doctor not found.</Txt>
      )}
    </Page>
  );
}
