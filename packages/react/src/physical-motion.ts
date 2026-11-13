import { useEffect, useRef } from "react";
import { rosemaryInteraction as m } from "@rosemary-ui/tokens";
function reduced(node: HTMLElement) {
  return (
    !!node.closest('[data-rm-reduced-motion="true"]') ||
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );
}
function physical(node: HTMLElement) {
  let x = 1,
    v = 0,
    target = 1,
    last = 0,
    frame = 0;
  const reset = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    x = 1;
    v = 0;
    target = 1;
    node.style.scale = "";
  };
  const tick = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.032);
    last = now;
    const k = target === 1 ? m.releaseStiffness : m.pressStiffness,
      z = target === 1 ? m.releaseDamping : m.pressDamping,
      w = Math.sqrt(k),
      y = x - target;
    let next: number, velocity: number;
    if (z >= 1) {
      const b = v + w * y,
        e = Math.exp(-w * dt);
      next = (y + b * dt) * e;
      velocity = (v - w * b * dt) * e;
    } else {
      const wd = w * Math.sqrt(1 - z * z),
        b = (v + z * w * y) / wd,
        e = Math.exp(-z * w * dt),
        co = Math.cos(wd * dt),
        si = Math.sin(wd * dt);
      next = e * (y * co + b * si);
      velocity = e * (-z * w * (y * co + b * si) + wd * (-y * si + b * co));
    }
    x = target + next;
    v = velocity;
    node.style.scale = String(x);
    if (Math.abs(next) < 0.0001 && Math.abs(velocity) < 0.001) {
      x = target;
      v = 0;
      frame = 0;
      node.style.scale = target === 1 ? "" : String(target);
    } else frame = window.requestAnimationFrame(tick);
  };
  return {
    reset,
    drive: (held: boolean) => {
      if (
        !node.isConnected ||
        node.matches(':disabled,[aria-disabled="true"],[aria-busy="true"]') ||
        reduced(node)
      ) {
        reset();
        return;
      }
      target = held ? m.pressScale : 1;
      if (frame) return;
      last = performance.now();
      frame = window.requestAnimationFrame(tick);
    },
  };
}
/** Reuse the same solver for internal native buttons (tabs, calendar days, rows). */
export function usePhysicalActions(root: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const controllers = new Map<HTMLElement, ReturnType<typeof physical>>();
    const target = (event: Event) => {
      const node = (event.target as Element)?.closest<HTMLElement>(
        "button:not(.rm-button):not(.rm-select-trigger)",
      );
      if (!node || node.closest(".rm-theme") !== host) return;
      let controller = controllers.get(node);
      if (!controller) {
        controller = physical(node);
        controllers.set(node, controller);
      }
      return controller;
    };
    const down = (event: Event) => {
      if ((event as PointerEvent).button !== 0 || event.defaultPrevented)
        return;
      target(event)?.drive(true);
    };
    const release = () => {
      for (const c of controllers.values()) c.drive(false);
    };
    const key = (event: Event) => {
      const e = event as KeyboardEvent;
      if ((e.key === " " || e.key === "Enter") && !e.defaultPrevented)
        target(e)?.drive(true);
    };
    const reset = () => {
      for (const c of controllers.values()) c.reset();
    };
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    host.addEventListener("pointerdown", down);
    host.addEventListener("keydown", key);
    host.addEventListener("focusout", release);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("keyup", release);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    media?.addEventListener("change", reset);
    const observer =
      typeof MutationObserver === "undefined"
        ? undefined
        : new MutationObserver(() => {
            for (const [node, c] of controllers)
              if (
                !node.isConnected ||
                node.matches(
                  ':disabled,[aria-disabled="true"],[aria-busy="true"]',
                )
              ) {
                c.reset();
                controllers.delete(node);
              }
          });
    observer?.observe(host, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: [
        "disabled",
        "aria-disabled",
        "aria-busy",
        "data-rm-reduced-motion",
      ],
    });
    return () => {
      reset();
      observer?.disconnect();
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("keydown", key);
      host.removeEventListener("focusout", release);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("keyup", release);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      media?.removeEventListener("change", reset);
    };
  }, [root]);
}
export function usePhysicalButton(disabled?: boolean) {
  const ref = useRef<HTMLButtonElement | null>(null),
    content = useRef<HTMLSpanElement | null>(null),
    controller = useRef<ReturnType<typeof physical>>();
  useEffect(() => {
    const node = ref.current,
      inner = content.current;
    if (!node || !inner) return;
    const c = physical(node);
    controller.current = c;
    const computed = getComputedStyle(node),
      extra =
        parseFloat(computed.paddingLeft) +
        parseFloat(computed.paddingRight) +
        parseFloat(computed.borderLeftWidth) +
        parseFloat(computed.borderRightWidth);
    let previous = node.offsetWidth,
      animation: Animation | undefined;
    const intrinsic = Math.abs(previous - inner.offsetWidth - extra) < 2;
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(() => {
            const natural = inner.offsetWidth + extra,
              scale = parseFloat(getComputedStyle(node).scale) || 1,
              current = node.getBoundingClientRect().width / scale;
            if (
              intrinsic &&
              Math.abs(natural - previous) > 0.5 &&
              !reduced(node) &&
              node.animate
            ) {
              const from = animation ? current : previous;
              animation?.cancel();
              animation = node.animate(
                [{ width: `${from}px` }, { width: `${natural}px` }],
                { duration: m.layoutMs, easing: "cubic-bezier(.2,.8,.2,1)" },
              );
            }
            previous = natural;
          });
    observer?.observe(inner);
    const reset = () => {
      c.reset();
      animation?.cancel();
    };
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    document.addEventListener("visibilitychange", reset);
    window.addEventListener("blur", reset);
    media?.addEventListener("change", reset);
    const release = () => c.drive(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      reset();
      controller.current = undefined;
      observer?.disconnect();
      document.removeEventListener("visibilitychange", reset);
      window.removeEventListener("blur", reset);
      media?.removeEventListener("change", reset);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);
  useEffect(() => {
    if (disabled) controller.current?.reset();
  }, [disabled]);
  return {
    ref,
    content,
    press: () => controller.current?.drive(true),
    release: () => controller.current?.drive(false),
  };
}
