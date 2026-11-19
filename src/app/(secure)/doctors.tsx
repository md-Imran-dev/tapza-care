import { Image, TextInput, FlatList, View } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useCare } from "../../state/app";
import { Header } from "../../components/Header";
import { Button, Card, styles, Txt } from "../../components/ui";
import { EmptyState, Skeleton } from "../../components/States";
import { useTheme } from "../../theme";
export default function Doctors() {
  const [query, setQuery] = useState("");
  const doctors = useCare((s) => s.doctors);
  const status = useCare((s) => s.dataStatus);
  const t = useTheme();
  const filtered = doctors.filter((d) =>
    (d.name + d.specialty).toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.background }}>
      <Header />
      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.page}
        ItemSeparatorComponent={() => <View style={{ height: t.space.lg }} />}
        refreshing={status === "loading"}
        onRefresh={() => void useCare.getState().loadData()}
        ListHeaderComponent={
          <View style={{ gap: t.space.lg, marginBottom: t.space.lg }}>
            <Button title="‹ Back" secondary onPress={() => router.back()} />
            <Txt style={styles.title}>Doctors near you</Txt>
            <Txt style={styles.sub}>Trusted care · Hyderabad & Vijayawada</Txt>
            <TextInput
              accessibilityLabel="Search doctors"
              placeholder="Search name or specialty"
              placeholderTextColor={t.colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              style={{
                backgroundColor: t.colors.surface,
                color: t.colors.textPrimary,
                borderRadius: t.radius.lg,
                padding: t.space.lg,
                minHeight: t.metrics.button,
                borderWidth: 1,
                borderColor: t.colors.line,
                fontSize: t.type.body,
              }}
            />
            {status === "loading" && <Skeleton />}
            {status === "error" && (
              <EmptyState
                title="Doctors couldn’t refresh"
                message="Check your connection and retry."
                action="Retry"
                onAction={() => void useCare.getState().loadData()}
              />
            )}
          </View>
        }
        ListEmptyComponent={
          status === "ready" ? (
            <EmptyState
              title="No doctors found"
              message={
                query
                  ? "Try another name or specialty."
                  : "Please check back soon for availability."
              }
            />
          ) : undefined
        }
        renderItem={({ item: d }) => (
          <Card>
            <Image
              accessibilityLabel={d.name}
              source={{ uri: d.photoUrl }}
              style={{
                height: t.metrics.doctorImage,
                borderRadius: t.radius.lg,
                width: "100%",
              }}
            />
            <Txt style={styles.heading}>{d.name}</Txt>
            <Txt style={styles.sub}>
              {d.specialty} · ★ {d.rating} · {d.expYears} years
            </Txt>
            <Txt style={styles.sub}>
              {d.languages.join(" · ")} · ₹{d.feeInr}
            </Txt>
            <Button
              title="View doctor & book"
              onPress={() =>
                router.push({ pathname: "/doctor/[id]", params: { id: d.id } })
              }
            />
          </Card>
        )}
      />
    </View>
  );
}
