import { RefObject, useLayoutEffect, useState } from "react";
/** One continuous indicator, measured from the real selected control. */
export function useSelectionIndicator(
  root: RefObject<HTMLElement | null>,
  value: unknown,
  enabled = true,
) {
  const [position, setPosition] = useState({ left: 0, top: 0, width: 0 });
  useLayoutEffect(() => {
    if (!enabled) return;
    const measure = () => {
      const element = root.current?.querySelector<HTMLElement>(
        '[aria-selected="true"], [aria-pressed="true"], [aria-current="page"]',
      );
      if (element)
        setPosition({
          left: element.offsetLeft,
          top: element.offsetTop + element.offsetHeight - 2,
          width: element.offsetWidth,
        });
      else setPosition({ left: 0, top: 0, width: 0 });
    };
    measure();
    if (typeof ResizeObserver === "undefined" || !root.current) return;
    const observer = new ResizeObserver(measure);
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [root, value, enabled]);
  return {
    top: position.top,
    bottom: "auto",
    width: position.width,
    transform: `translateX(${position.left}px)`,
  };
}
