import { useState, useEffect, useRef, useCallback } from "react";

const SYNC_INTERVAL = 60;

export function useAutoFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(SYNC_INTERVAL);
  const [lastSynced, setLastSynced] = useState(null);
  const [syncCount, setSyncCount] = useState(0);

  const countdownRef = useRef(null);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      if (isMountedRef.current) {
        setData(json);
        setLastSynced(new Date());
        setSyncCount((c) => c + 1);
        setSecondsLeft(SYNC_INTERVAL);
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err.message);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    countdownRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          fetchData();
          return SYNC_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      isMountedRef.current = false;
      clearInterval(countdownRef.current);
    };
  }, [fetchData]);

  const refresh = useCallback(() => {
    setSecondsLeft(SYNC_INTERVAL);
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    secondsLeft,
    lastSynced,
    syncCount,
    refresh,
    syncInterval: SYNC_INTERVAL,
  };
}
