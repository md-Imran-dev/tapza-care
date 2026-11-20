import { metrics as uiMetrics , useTheme } from "@/theme";
import { BookingSuccess } from "../booking/BookingSuccess";
import type { ServiceItem } from "@/data/types";
import { useResource } from "@/hooks/useResource";
import { useTranslation } from "@/hooks/useTranslation";
import { getServiceSlots } from "@/lib/api";
import { localDateKey } from "@/lib/dates";
import { CLINIC_LOCATION, serviceReservationSchema } from "@/lib/services";
import { useCare } from "@/state/app";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { TextInput, View } from "react-native";
import { AppointmentPicker } from "../booking/AppointmentPicker";
import { Button, Card, styles, Txt } from "../ui";

export function ServiceBookingForm({ service, onPendingChange }: { service: ServiceItem; onPendingChange?: (pending: boolean) => void }) {
  const t = useTheme();
  const { translate } = useTranslation();
  const network = useCare((s) => s.network);
  const offline = useCare((s) => s.offline);
  const book = useCare((s) => s.book);
  const [date, setDate] = useState(localDateKey);
  const [slotId, setSlotId] = useState("");
  const [address, setAddress] = useState("");
  const [pending, setPending] = useState(false);
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);
  const submitting = useRef(false);
  const home = service.fulfillment === "home";
  const { data, loading, error, retry } = useResource(
    () => getServiceSlots(service.id, date),
    [service.id, date, network],
  );
  const slots = (data ?? []).filter(
    (s) =>
      s.doctorId === `service:${service.id}` && s.startsAt.startsWith(date),
  );
  const selected = slots.find((s) => s.id === slotId && s.available);
  const request = serviceReservationSchema.safeParse({
    serviceId: service.id,
    serviceName: service.name,
    priceInr: service.priceInr,
    fulfillment: home ? "home" : "clinic",
    address: home ? address : CLINIC_LOCATION,
  });
  async function confirm() {
    if (submitting.current || !request.success || !selected || loading || error)
      return;
    if (new Date(selected.startsAt).getTime() <= Date.now()) {
      setNotice("This time has passed. Please choose another time.");
      setSlotId("");
      retry();
      return;
    }
    submitting.current = true;
    setPending(true);
    onPendingChange?.(true);
    setNotice("");
    try {
      const ok = await book(
        `service:${service.id}`,
        date,
        slotId,
        request.data,
      );
      if (ok) setSuccess(true);
      else {
        setNotice(
          "We couldn’t confirm this service. Availability or service details may have changed. Select a new time or reopen the service.",
        );
        setSlotId("");
        retry();
      }
    } catch {
      setNotice("Could not save your booking. Please try again.");
    } finally {
      submitting.current = false;
      setPending(false);
      onPendingChange?.(false);
    }
  }
  if (success)
    return (
      <BookingSuccess title={offline ? "Service saved offline" : "Service booking confirmed"}>
        <Txt>{service.name}</Txt>
        <Txt>
          {date} · {selected?.label ?? slotId}
        </Txt>
        <Txt>{home ? address.trim() : CLINIC_LOCATION}</Txt>
        <Txt>
          {service.priceInr === 0
            ? "FREE · ₹0"
            : `₹${service.priceInr} · Pay at visit`}
        </Txt>
        <Txt style={styles.sub}>
          Demo only · No technician is dispatched or payment collected.
        </Txt>
        <Button
          title="View my bookings"
          onPress={() => router.replace("/bookings")}
        />
      </BookingSuccess>
    );
  return (
    <View style={{ gap: t.space.lg }}>
      <Card>
        <Txt style={styles.heading}>
          {home ? "Collection at your address" : "Clinic service appointment"}
        </Txt>
        <Txt>
          {service.priceInr === 0
            ? "FREE · ₹0"
            : `₹${service.priceInr} · Pay at visit`}
        </Txt>
        <Txt style={styles.sub}>Demo booking · No real service or payment.</Txt>
      </Card>
      <Card>
        <Txt style={styles.heading}>
          {home ? "Collection address" : "Visit location"}
        </Txt>
        {home ? (
          <>
            <TextInput
              accessibilityLabel={translate("Collection address")}
              placeholder={translate(
                "House/flat, street, area, city and PIN code",
              )}
              placeholderTextColor={t.colors.textSecondary}
              value={address}
              onChangeText={setAddress}
              editable={!pending}
              multiline
              maxLength={300}
              textAlignVertical="top"
              style={{
                minHeight: uiMetrics.addressHeight,
                padding: t.space.md,
                borderWidth: 1,
                borderColor: t.colors.line,
                borderRadius: t.radius.md,
                color: t.colors.textPrimary,
                backgroundColor: t.colors.background,
                fontSize: t.type.body,
              }}
            />
            <Txt style={styles.sub}>
              Enter your complete collection address and six-digit PIN code
              before confirming.
            </Txt>
            {!!address.trim() && !request.success && (
              <Txt accessibilityRole="alert" style={{ color: t.colors.red }}>
                {request.error.issues[0].message}
              </Txt>
            )}
          </>
        ) : (
          <Txt>{CLINIC_LOCATION}</Txt>
        )}
      </Card>
      {offline && (
        <Txt>
          Offline · Saved availability only. We’ll confirm your request when you
          reconnect.
        </Txt>
      )}
      <Card>
        <AppointmentPicker
          date={date}
          slotId={slotId}
          slots={slots}
          loading={loading}
          error={error}
          disabled={pending}
          onDate={(value) => {
            setDate(value);
            setSlotId("");
            setNotice("");
          }}
          onSlot={setSlotId}
          onRetry={retry}
        />
      </Card>
      {!!notice && (
        <Txt accessibilityRole="alert" style={{ color: t.colors.red }}>
          {notice}
        </Txt>
      )}
      <Button
        title={
          pending
            ? "Confirming…"
            : home
              ? "Confirm home collection"
              : "Confirm service visit"
        }
        disabled={
          pending || loading || !!error || !selected || !request.success
        }
        onPress={() => void confirm()}
      />
    </View>
  );
}
