import { Page } from "@/components/Page";
import { router } from "expo-router";
import { Button, Card, styles, Txt } from "../../components/ui";
import { useAuth } from "../../state/auth";
export default function Family() {
  const name = useAuth((s) => s.session?.name);
  return (
    <Page>
      <Txt style={styles.title}>Your family</Txt>
      <Txt style={styles.sub}>A little care for everyone you love</Txt>
      {[
        `👩 ${name} · You`,
        "👵 Amma · Mother",
        "👨 Ramu · Husband",
        "👦 Aarav · Son, 7 years",
        "👴 Nanna · Father",
      ].map((m) => (
        <Card key={m}>
          <Txt style={styles.heading}>{m}</Txt>
          <Txt style={styles.sub}>Tapza Clinic · Madhapur</Txt>
          <Button
            title="Book a visit"
            secondary
            onPress={() => router.push("/doctors")}
          />
        </Card>
      ))}
    </Page>
  );
}
