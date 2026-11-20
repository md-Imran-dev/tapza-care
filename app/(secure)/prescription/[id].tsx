import { Page } from "@/components/Page";
import { PrescriptionContent } from "@/components/prescriptions/PrescriptionContent";
import { Txt, styles } from "@/components/ui";
import { router, useLocalSearchParams } from "expo-router";
export default function PrescriptionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Page>
      <Txt style={styles.title}>Your prescriptions</Txt>
      <Txt style={styles.sub}>Care continues after your clinic visit</Txt>
      <PrescriptionContent
        open={id}
        onSelect={(id) =>
          router.push({ pathname: "/prescription/[id]", params: { id } })
        }
      />
    </Page>
  );
}
