import { metrics as uiMetrics , useTheme } from "@/theme";
import { Page } from "@/components/Page";
import { Button, Card, styles, Txt } from "@/components/ui";
import { useCare } from "@/state/app";
import { useState } from "react";
import { Switch, TextInput, View } from "react-native";
export default function Admin() {
  const config = useCare((s) => s.config);
  const network = useCare((s) => s.network);
  const update = useCare((s) => s.updateNetwork);
  const patch = useCare((s) => s.patch);
  const t = useTheme();
  const [text, setText] = useState(JSON.stringify(config, null, 2));
  const [message, setMessage] = useState("");
  return (
    <Page>
      <Txt style={styles.title}>Demo lab</Txt>
      <Txt style={styles.sub}>
        Test slow networks, server failures and empty states.
      </Txt>
      <Card>
        <Txt style={styles.heading}>Network delay</Txt>
        <View style={styles.row}>
          {[200, 1000, 3000].map((ms) => (
            <Button
              key={ms}
              title={`${ms}ms`}
              secondary={network.latencyMs !== ms}
              onPress={() => update({ latencyMs: ms })}
            />
          ))}
        </View>
        {(
          [
            "offline",
            "failConfig",
            "failBooking",
            "failSlots",
            "emptySlots",
            "emptyDoctors",
            "emptyPrescriptions",
          ] as const
        ).map((key, i) => (
          <View
            key={key}
            style={[
              styles.row,
              { justifyContent: "space-between", minHeight: t.metrics.touch },
            ]}
          >
            <Txt style={{ flex: 1 }}>
              {
                [
                  "Offline mode",
                  "Fail config fetch",
                  "Booking conflict (409)",
                  "Fail slot fetch",
                  "No available slots",
                  "Empty doctor list",
                  "Empty prescription list",
                ][i]
              }
            </Txt>
            <Switch
              accessibilityLabel={key}
              value={network[key]}
              onValueChange={(value) => update({ [key]: value })}
              trackColor={{ true: t.colors.primary }}
            />
          </View>
        ))}
        <Button
          title="Refresh home & lists"
          onPress={() => {
            void Promise.all([
              useCare.getState().loadConfig(),
              useCare.getState().loadData(),
            ]);
          }}
        />
      </Card>
      <Txt style={styles.heading}>Live configuration</Txt>
      <TextInput
        accessibilityLabel="Layout config JSON"
        multiline
        value={text}
        onChangeText={setText}
        autoCapitalize="none"
        autoCorrect={false}
        style={{
          minHeight: uiMetrics.configEditorHeight,
          borderRadius: t.radius.lg,
          padding: t.space.lg,
          backgroundColor: t.colors.secondary,
          color: t.colors.white,
          fontFamily: "monospace",
          fontSize: t.type.caption,
          textAlignVertical: "top",
        }}
      />
      {!!message && <Txt accessibilityRole="alert">{message}</Txt>}
      <Button
        title="Apply configuration"
        onPress={() => {
          if (patch(text)) setMessage("Applied. Your home has updated.");
          else
            setMessage(
              "Invalid config. Check theme colours, tabs and section item fields.",
            );
        }}
      />
    </Page>
  );
}
