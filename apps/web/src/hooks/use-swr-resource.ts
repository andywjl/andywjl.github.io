import { useCallback, useEffect, useMemo, useState } from "react";

type CacheEntry<T> = {
  data?: T;
  error?: Error;
  updatedAt: number;
  promise?: Promise<void>;
};

const cache = new Map<string, CacheEntry<unknown>>();

function getEntry<T>(key: string): CacheEntry<T> | undefined {
  return cache.get(key) as CacheEntry<T> | undefined;
}

function setEntry<T>(key: string, entry: CacheEntry<T>) {
  cache.set(key, entry as CacheEntry<unknown>);
}

export type SWRResourceResult<T> = {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  isValidating: boolean;
  mutate: () => Promise<void>;
};

export function useSWRResource<T>(
  key: string | null,
  fetcher: () => Promise<T>,
): SWRResourceResult<T> {
  const [version, setVersion] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const trigger = useCallback(() => setVersion((v) => v + 1), []);

  const mutate = useCallback(async () => {
    if (!key) return;
    const entry = getEntry<T>(key);
    if (entry?.promise) {
      await entry.promise;
      return;
    }

    setIsValidating(true);
    const promise = fetcher()
      .then((data) => {
        setEntry<T>(key, {
          data,
          error: undefined,
          updatedAt: Date.now(),
        });
      })
      .catch((error: unknown) => {
        setEntry<T>(key, {
          data: undefined,
          error: error instanceof Error ? error : new Error(String(error)),
          updatedAt: Date.now(),
        });
      })
      .finally(() => {
        const finalEntry = getEntry<T>(key);
        if (finalEntry) {
          delete finalEntry.promise;
          setEntry<T>(key, finalEntry);
        }
        setIsValidating(false);
        trigger();
      });

    setEntry<T>(key, {
      ...(entry ?? { updatedAt: 0 }),
      promise,
    });
    await promise;
  }, [fetcher, key, trigger]);

  useEffect(() => {
    if (!key) return;
    const entry = getEntry<T>(key);
    if (!entry || (!entry.data && !entry.error)) {
      void mutate();
    }
  }, [key, mutate, version]);

  const snapshot = useMemo(() => {
    if (!key) {
      return {
        data: undefined,
        error: undefined,
      };
    }
    const entry = getEntry<T>(key);
    return {
      data: entry?.data,
      error: entry?.error,
    };
  }, [key, version]);

  return {
    data: snapshot.data,
    error: snapshot.error,
    isLoading: !snapshot.data && !snapshot.error,
    isValidating,
    mutate,
  };
}
