import { ReactNode, useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "../../context/MotionPreferences";
import { tokenModes } from "../../generated/tokens";
import { useSelectionIndicator } from "../../hooks/useSelectionIndicator";
import { cancelPageMotion } from "../../pageMotion";
export function SelectionGroup({
  value,
  label,
  className = "r-category-strip",
  indicator = false,
  children,
}: {
  value: unknown;
  label: string;
  className?: string;
  indicator?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const indicatorStyle = useSelectionIndicator(ref, value, indicator);
  return (
    <div
      ref={ref}
      className={`${className} r-selection-group`}
      role="group"
      aria-label={label}
    >
      {children}
      {indicator && (
        <span
          aria-hidden="true"
          className="r-tab-indicator"
          style={indicatorStyle}
        />
      )}
    </div>
  );
}
/** Update real content immediately. Animate only its presentation; never retain a second live panel. */
export function usePanelMotion(
  ref: React.RefObject<HTMLElement | null>,
  selection: unknown,
  index = 0,
) {
  const previous = useRef({ selection, index });
  const animation = useRef<Animation | null>(null);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    const element = ref.current,
      changed = previous.current.selection !== selection;
    const direction = index < previous.current.index ? -1 : 1;
    previous.current = { selection, index };
    if (!element) return;
    if (reduced) {
      animation.current?.cancel();
      element.style.animation = "none";
      return;
    }
    if (!changed) return;
    const interrupted = animation.current?.playState === "running";
    const current = getComputedStyle(element);
    const start = interrupted
      ? { opacity: current.opacity, transform: current.transform }
      : {
          opacity: 0,
          transform: `translateX(${direction * tokenModes.light["semantic.space.12"].resolved.value}px)`,
        };
    animation.current?.cancel();
    const duration = tokenModes.light["semantic.motion.settle"].resolved.value;
    if (element.animate)
      animation.current = element.animate(
        [start, { opacity: 1, transform: "none" }],
        {
          duration,
          easing: tokenModes.light["semantic.motion.standard"].value,
        },
      );
    else {
      element.style.animation = "none";
      void element.offsetWidth;
      element.style.animation = `${direction < 0 ? "r-panel-back" : "r-panel-forward"} ${duration}ms ${tokenModes.light["semantic.motion.standard"].value}`;
    }
  }, [selection, index, reduced, ref]);
  useLayoutEffect(() => () => animation.current?.cancel(), []);
}
export function SelectionContent({
  value,
  index = 0,
  children,
  className = "",
}: {
  value: unknown;
  index?: number;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  usePanelMotion(ref, value, index);
  return (
    <div ref={ref} className={`r-selection-content ${className}`}>
      {children}
    </div>
  );
}
export function PageMotionPreference() {
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (reduced) cancelPageMotion();
  }, [reduced]);
  return null;
}
