import { EmptyState, Skeleton } from "@/components/States";
import { styles, Txt } from "@/components/ui";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/hooks/useTranslation";
import { useCare } from "@/store/careStore";
import { useMemo, useState } from "react";
import { FlatList, TextInput, View } from "react-native";
import { DoctorCard } from "./DoctorCard";
export function DoctorList() {
  const [query, setQuery] = useState("");
  const doctors = useCare((s) => s.doctors);
  const status = useCare((s) => s.dataStatus);
  const t = useTheme();
  const { translate } = useTranslation();
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return doctors.filter((d) =>
      (d.name + " " + d.specialty).toLowerCase().includes(search),
    );
  }, [doctors, query]);
  return (
    <FlatList
      data={filtered}
      keyboardShouldPersistTaps="handled"
      initialNumToRender={6}
      maxToRenderPerBatch={6}
      windowSize={5}
      keyExtractor={(d) => d.id}
      contentContainerStyle={styles.page}
      ItemSeparatorComponent={() => <View style={{ height: t.space.lg }} />}
      refreshing={status === "loading"}
      onRefresh={() => void useCare.getState().loadData()}
      ListHeaderComponent={
        <View style={{ gap: t.space.lg, marginBottom: t.space.lg }}>
          <Txt style={styles.title}>Doctors near you</Txt>
          <Txt style={styles.sub}>Trusted care · Hyderabad & Vijayawada</Txt>
          <TextInput
            accessibilityLabel={translate("Search doctors")}
            placeholder={translate("Search name or specialty")}
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
          {status === "loading" && <Skeleton kind="doctors" />}
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
      renderItem={({ item }) => <DoctorCard doctor={item} />}
    />
  );
}
