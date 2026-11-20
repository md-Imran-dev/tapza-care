import { useLocalSearchParams } from "expo-router";
import { Page } from "@/components/Page";
import { ServiceBookingForm } from "@/components/services/ServiceBookingForm";
import { Txt } from "@/components/ui";
import { findService } from "@/lib/services";
import { useCare } from "@/state/app";

export default function ServiceBooking() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const config = useCare((s) => s.config);
  const service = findService(config, id);
  return <Page>{service ? <ServiceBookingForm key={`${service.id}:${service.name}:${service.priceInr}:${service.fulfillment}`} service={service} /> : <Txt>This service is no longer available. Please return to Home and choose another service.</Txt>}</Page>;
}
