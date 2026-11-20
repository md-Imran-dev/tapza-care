import { Page } from "@/components/Page";
import { router } from "expo-router";
import { Button, Card, styles, Txt } from "../../components/ui";
export default function Contact() {
  return (
    <Page>
      <Txt style={styles.title}>Your neighbourhood clinic</Txt>
      <Card>
        <Txt style={styles.heading}>Tapza Clinic · Madhapur</Txt>
        <Txt style={styles.sub}>Hyderabad · Open today till 9 PM</Txt>
        <Txt>
          WhatsApp communication is shown as a preview in this demo. No messages
          are sent.
        </Txt>
        <Button
          title="Book a clinic visit"
          onPress={() => router.push("/doctors")}
        />
      </Card>
    </Page>
  );
}
