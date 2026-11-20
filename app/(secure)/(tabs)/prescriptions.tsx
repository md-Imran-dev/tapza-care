import { Page } from "@/components/Page";
import { PrescriptionContent } from "@/components/prescriptions/PrescriptionContent";
import { Txt, styles } from "@/components/ui";
import { useState } from "react";
export default function Prescriptions() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <Page>
      <Txt style={styles.title}>Your prescriptions</Txt>
      <Txt style={styles.sub}>Care continues after your clinic visit</Txt>
      <PrescriptionContent open={open} onSelect={setOpen} />
    </Page>
  );
}
