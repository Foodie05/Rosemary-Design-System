import { useEffect, useState } from "react";
import { useReducedMotion } from "../context/MotionPreferences";
import { tokenModes } from "../generated/tokens";
export const motionMilliseconds = (
  role: "enter" | "exit" | "settle" | "panel" | "tooltip-delay",
) => tokenModes.light[`semantic.motion.${role}`].resolved.value;
/** Move toward the anchor without crossing the popup's 16px viewport boundary. */
export function popupMotionOffset(
  top: number,
  height: number,
  viewport: number,
  above: boolean,
) {
  const distance =
    tokenModes.light["semantic.motion.distance-small"].resolved.value;
  return Math.max(
    16 - top,
    Math.min(above ? distance : -distance, viewport - 16 - top - height),
  );
}
/** Retain visual exits only; callers immediately make departing content inert and hidden to AT. */
export function usePresence(open: boolean, role: "exit" | "settle" = "exit") {
  const reduced = useReducedMotion();
  const [retained, retain] = useState(open);
  useEffect(() => {
    if (open) {
      retain(true);
      return;
    }
    if (reduced) {
      retain(false);
      return;
    }
    if (!retained) return;
    const timer = setTimeout(() => retain(false), motionMilliseconds(role));
    return () => clearTimeout(timer);
  }, [open, reduced, role, retained]);
  return {
    present: open || (!reduced && retained),
    phase: open ? "open" : "exiting",
  } as const;
}
