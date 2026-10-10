import { useEffect, useState } from "react";
export function useSessionState<T>(key: string, initial: T) {
  const [state, set] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(`rosemary_${key}`);
      if (saved) {
        const value = JSON.parse(saved);
        if (
          typeof value === typeof initial &&
          (typeof value !== "number" || Number.isFinite(value))
        )
          return value;
      }
    } catch {}
    return initial;
  });
  useEffect(() => {
    try {
      sessionStorage.setItem(`rosemary_${key}`, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, set] as const;
}
