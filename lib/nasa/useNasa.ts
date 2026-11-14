"use client";

import { useCallback, useEffect, useState } from "react";

export type LoadState = "loading" | "ok" | "error";

/** Fetch JSON from one of ReliQ's /api/nasa/* routes with loading / error / retry handling. */
export function useNasa<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!url) return;
    const ctrl = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset before a new request
    setState("loading");
    fetch(url, { signal: ctrl.signal })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as T & { error?: string };
        if (!res.ok || body.error) throw new Error(body.error ?? `HTTP ${res.status}`);
        setData(body);
        setError(null);
        setState("ok");
      })
      .catch((err: unknown) => {
        if (ctrl.signal.aborted) return;
        setError(err instanceof Error ? err.message : "NETWORK");
        setState("error");
      });
    return () => ctrl.abort();
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);
  return { data, state, error, retry };
}
