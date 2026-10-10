import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { popupMotionOffset, usePresence } from "./usePresence";
/** Nonmodal floating content stays associated with its invoker, never with status text. */
export function useDisclosure() {
  const [open, change] = useState(false);
  const { present, phase } = usePresence(open);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const trigger = () =>
    root.current?.querySelector<HTMLButtonElement>("[data-disclosure-trigger]");
  const set = (value: boolean) => {
    setPoint(null);
    change(value);
  };
  const openAt = (x: number, y: number) => {
    setPoint({ x, y });
    change(true);
  };
  const close = () => {
    change(false);
    trigger()?.focus({ preventScroll: true });
  };
  useLayoutEffect(() => {
    const panel = root.current?.querySelector<HTMLElement>(".r-popover");
    if (panel) {
      panel.dataset.motionState = phase;
      panel.inert = !open;
      if (!open) panel.setAttribute("aria-hidden", "true");
      else panel.removeAttribute("aria-hidden");
    }
    if (!open) return;
    const popup = root.current?.querySelector<HTMLElement>(".r-popover");
    const invoker = trigger();
    if (!popup || !invoker) return;
    const anchor = invoker.getBoundingClientRect();
    const native = typeof popup.showPopover === "function";
    if (native) {
      popup.setAttribute("popover", "auto");
      Object.assign(popup.style, {
        position: "fixed",
        inset: "auto",
        margin: "0",
        maxWidth: "calc(100% - 32px)",
        maxHeight: "calc(100dvh - 32px)",
        overflowY: "auto",
      });
      popup.showPopover();
      const bounds = popup.getBoundingClientRect();
      const width = document.documentElement.clientWidth || innerWidth;
      const x = Math.max(
        16,
        Math.min(point?.x ?? anchor.left, width - bounds.width - 16),
      );
      let y = point?.y ?? anchor.bottom + 8;
      const above = !point && y + bounds.height > innerHeight - 16;
      if (above) y = anchor.top - bounds.height - 8;
      y = Math.max(16, Math.min(y, innerHeight - bounds.height - 16));
      popup.style.setProperty(
        "--r-popup-offset",
        `${popupMotionOffset(y, bounds.height, innerHeight, above)}px`,
      );
      Object.assign(popup.style, { left: `${x}px`, top: `${y}px` });
    } else {
      const base = root.current!.getBoundingClientRect();
      Object.assign(popup.style, {
        left: `${anchor.left - base.left}px`,
        top: `${anchor.bottom - base.top + 8}px`,
      });
    }
    popup
      .querySelector<HTMLElement>("input, button")
      ?.focus({ preventScroll: true });
    return () => {
      if (native && popup.matches(":popover-open")) popup.hidePopover();
    };
  }, [open, point]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: Event) => {
      if (!root.current?.contains(e.target as Node)) change(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    const scroll = (e: Event) => {
      if (
        !(e.target instanceof Node) ||
        !root.current?.querySelector(".r-popover")?.contains(e.target)
      )
        change(false);
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    document.addEventListener("keydown", escape);
    window.addEventListener("scroll", scroll, true);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      document.removeEventListener("keydown", escape);
      window.removeEventListener("scroll", scroll, true);
    };
  }, [open]);
  return { open, present, set, openAt, close, root, id };
}
