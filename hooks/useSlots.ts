import { useCare } from "@/store/careStore";
import { slotKey, useSlotStore } from "@/store/slotStore";
import { useCallback, useEffect } from "react";

const empty = { data: null, loading: true, error: null };
export function useSlots(
  id: string,
  date: string,
  service = false,
  enabled = true,
) {
  const network = useCare((s) => s.network);
  const result = useSlotStore(
    (s) => s.results[slotKey(id, date, service)] ?? empty,
  );
  const load = useSlotStore((s) => s.load);
  const retry = useCallback(() => {
    if (enabled) void load(id, date, service);
  }, [id, date, service, enabled, load]);
  useEffect(() => {
    retry();
  }, [retry, network]);
  return enabled
    ? { ...result, retry }
    : { data: [], loading: false, error: null, retry };
}
