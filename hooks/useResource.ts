import { useCallback, useEffect, useState } from "react";
export function useResource<T>(
  fetcher: () => Promise<T>,
  deps: readonly unknown[] = [],
) {
  const [state, setState] = useState<{
    data: T | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let live = true;
    Promise.resolve()
      .then(() => {
        if (live) setState((s) => ({ ...s, loading: true, error: null }));
        return fetcher();
      })
      .then((data) => {
        if (live) setState({ data, loading: false, error: null });
      })
      .catch((e: Error) => {
        if (live) setState((s) => ({ ...s, loading: false, error: e.message }));
      });
    return () => {
      live = false;
    };
    // The caller supplies the reactive request arguments; fetcher identity is intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
}
