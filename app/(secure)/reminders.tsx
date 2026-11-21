import { Page } from "@/components/Page";
import { PrescriptionContent } from "@/components/prescriptions/PrescriptionContent";
import { Button, Txt, styles } from "@/components/ui";
import { useCare } from "@/store/careStore";
import { enableReminders } from "@/utilities/reminders";
import { router } from "expo-router";
import { useState } from "react";
export default function Reminders() {
  const [notice, setNotice] = useState("");
  const [scheduling, setScheduling] = useState(false);
  const prescriptions = useCare((s) => s.prescriptions);
  const lang = useCare((s) => s.lang);
  return (
    <Page>
      <Txt style={styles.title}>Medicine reminders</Txt>
      <Txt style={styles.sub}>Care continues after your clinic visit</Txt>
      {
        <>
          <Button
            title={scheduling ? "Scheduling…" : "Enable medicine reminders"}
            disabled={scheduling}
            onPress={() => {
              setScheduling(true);
              void enableReminders(prescriptions, lang)
                .then((count) =>
                  setNotice(
                    count
                      ? `Next ${count} dose reminders scheduled within the prescription durations.`
                      : "No upcoming doses in these prescriptions.",
                  ),
                )
                .catch((e: Error) => setNotice(e.message))
                .finally(() => setScheduling(false));
            }}
          />
          {!!notice && <Txt accessibilityRole="alert">{notice}</Txt>}
        </>
      }
      <PrescriptionContent
        open={null}
        onSelect={(id) =>
          router.push({ pathname: "/prescription/[id]", params: { id } })
        }
      />
    </Page>
  );
}
