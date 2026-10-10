import {
  createContext,
  ReactNode,
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
  useSyncExternalStore,
} from "react";
import { Select } from "../components/ui/Select";
export type MotionPreference = "system" | "reduce";
const subscribe = (notify: () => void) => {
  if (typeof matchMedia === "undefined") return () => {};
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener?.("change", notify);
  return () => media.removeEventListener?.("change", notify);
};
const snapshot = () =>
  typeof matchMedia !== "undefined" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;
export const useSystemReducedMotion = () =>
  useSyncExternalStore(subscribe, snapshot, () => false);
const MotionContext = createContext<{
  reduced: boolean;
  preference: MotionPreference;
  setPreference: (value: MotionPreference) => void;
} | null>(null);
export function MotionPreferences({ children }: { children: ReactNode }) {
  const system = useSystemReducedMotion();
  const [preference, setPreference] = useState<MotionPreference>(() => {
    try {
      return localStorage.getItem("rosemary_motion") === "reduce"
        ? "reduce"
        : "system";
    } catch {
      return "system";
    }
  });
  const reduced = preference === "reduce" || system;
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "full";
    try {
      localStorage.setItem("rosemary_motion", preference);
    } catch {}
  }, [preference, reduced]);
  useEffect(() => {
    const update = () =>
      (document.documentElement.dataset.pageHidden = String(document.hidden));
    document.addEventListener("visibilitychange", update);
    update();
    return () => {
      document.removeEventListener("visibilitychange", update);
      delete document.documentElement.dataset.pageHidden;
    };
  }, []);
  return (
    <MotionContext.Provider value={{ reduced, preference, setPreference }}>
      {children}
    </MotionContext.Provider>
  );
}
export function useReducedMotion() {
  const context = useContext(MotionContext);
  const system = useSystemReducedMotion();
  return context?.reduced ?? system;
}
export function MotionPreferenceControl() {
  const context = useContext(MotionContext);
  if (!context) return null;
  return (
    <label className="r-field r-theme-preference">
      <span className="r-field-label">动态效果</span>
      <Select
        label="动态效果"
        value={context.preference}
        onValueChange={(value) =>
          context.setPreference(value as MotionPreference)
        }
        options={[
          { value: "system", label: "跟随系统" },
          { value: "reduce", label: "减少动态效果" },
        ]}
      />
    </label>
  );
}
