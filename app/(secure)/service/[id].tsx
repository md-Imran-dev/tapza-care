import { BookingSheet } from "@/components/booking/BookingSheet";
import { ServiceBookingForm } from "@/components/services/ServiceBookingForm";
import { Txt } from "@/components/ui";
import { findService } from "@/lib/services";
import { useCare } from "@/state/app";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function ServiceBooking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pending, setPending] = useState(false);
  const config = useCare((s) => s.config);
  const service = findService(config, id);
  return (
    <BookingSheet
      title={service?.name ?? "Clinic services"}
      disabled={pending}
      onClose={() => router.back()}
    >
      {service ? (
        <ServiceBookingForm
          key={`${service.id}:${service.name}:${service.priceInr}:${service.fulfillment}`}
          service={service}
          onPendingChange={setPending}
        />
      ) : (
        <Txt>
          This service is no longer available. Please return to Home and choose
          another service.
        </Txt>
      )}
    </BookingSheet>
  );
}
