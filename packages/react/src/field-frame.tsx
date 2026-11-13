import { useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { rosemaryInteraction as motion } from "@rosemary-ui/tokens";
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
// Two origins, on the top and bottom horizontal edges. Four fronts follow
// the rounded outline and meet on the left/right halves, never starting there.
function edges(
  width: number,
  height: number,
  corners: number[][],
  stroke = 1.5,
  originX = 0.5,
) {
  const inset = Math.min(stroke / 2, width / 2, height / 2),
    w = Math.max(0, width - 2 * inset),
    h = Math.max(0, height - 2 * inset);
  const radii = corners.map(([x, y]) => [Math.max(0, x), Math.max(0, y)]);
  const factor = Math.min(
    1,
    width / Math.max(1, radii[0][0] + radii[1][0]),
    width / Math.max(1, radii[3][0] + radii[2][0]),
    height / Math.max(1, radii[0][1] + radii[3][1]),
    height / Math.max(1, radii[1][1] + radii[2][1]),
  );
  const [tl, tr, br, bl] = radii.map(([x, y]) => [
    Math.max(0, x * factor - inset),
    Math.max(0, y * factor - inset),
  ]);
  const top = clamp(clamp(originX, 0, 1) * width - inset, tl[0], w - tr[0]),
    bottom = clamp(clamp(originX, 0, 1) * width - inset, bl[0], w - br[0]);
  const arc = (r: number[], x: number, y: number, sweep = 1) =>
    r[0] && r[1] ? `A ${r[0]} ${r[1]} 0 0 ${sweep} ${x} ${y}` : `L ${x} ${y}`;
  return {
    inset,
    w,
    h,
    top,
    bottom,
    paths: [
      {
        origin: "top",
        side: "right",
        d: `M ${top} 0 H ${w - tr[0]} ${arc(tr, w, tr[1])} V ${h - br[1]} ${arc(br, w - br[0], h)} H ${bottom}`,
      },
      {
        origin: "bottom",
        side: "right",
        d: `M ${bottom} ${h} H ${w - br[0]} ${arc(br, w, h - br[1], 0)} V ${tr[1]} ${arc(tr, w - tr[0], 0, 0)} H ${top}`,
      },
      {
        origin: "top",
        side: "left",
        d: `M ${top} 0 H ${tl[0]} ${arc(tl, 0, tl[1], 0)} V ${h - bl[1]} ${arc(bl, bl[0], h, 0)} H ${bottom}`,
      },
      {
        origin: "bottom",
        side: "left",
        d: `M ${bottom} ${h} H ${bl[0]} ${arc(bl, 0, h - bl[1])} V ${tl[1]} ${arc(tl, tl[0], 0)} H ${top}`,
      },
    ],
  };
}
function reveal(length: number, progress: number) {
  const shown = Math.min(length, length * 0.5 + 0.02) * clamp(progress, 0, 1);
  return { shown, dasharray: `${shown} ${length}`, dashoffset: 0 };
}

export function FieldFrame({
  children,
  invalid = false,
}: {
  children: ReactNode;
  invalid?: boolean;
}) {
  const host = useRef<HTMLDivElement>(null),
    pointer = useRef<number | null>(null);
  const [shape, setShape] = useState({
      width: 0,
      height: 0,
      corners: [
        [8, 8],
        [8, 8],
        [8, 8],
        [8, 8],
      ],
      x: 0.5,
    }),
    [focused, setFocused] = useState(false);
  const [draw, setDraw] = useState(false);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const update = () => {
      const input = node.querySelector<HTMLElement>("input,textarea");
      if (!input) return;
      const css = getComputedStyle(input);
      const corner = (value: string) => {
        const parts = value.trim().split(/\s+/);
        return [input.offsetWidth, input.offsetHeight].map((extent, i) => {
          const part = parts[i] ?? parts[0];
          const n = parseFloat(part);
          return Number.isFinite(n)
            ? part.endsWith("%")
              ? (n * extent) / 100
              : n
            : 0;
        });
      };
      setShape((s) => ({
        ...s,
        width: input.offsetWidth,
        height: input.offsetHeight,
        corners: [
          css.borderTopLeftRadius,
          css.borderTopRightRadius,
          css.borderBottomRightRadius,
          css.borderBottomLeftRadius,
        ].map(corner),
      }));
    };
    update();
    const observer =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    observer?.observe(node);
    const input = node.querySelector("input,textarea");
    const attributes =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(update)
        : null;
    if (input)
      attributes?.observe(input, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
    return () => {
      observer?.disconnect();
      attributes?.disconnect();
    };
  }, []);
  const focusRun = useRef(false);
  const animations = useRef<Animation[]>([]);
  useEffect(() => {
    const stop = () => {
      for (const animation of animations.current) animation.cancel();
      animations.current = [];
    };
    if (!focused) {
      stop();
      focusRun.current = false;
      setDraw(false);
      return;
    }
    if (invalid) {
      stop();
      setDraw(true);
      return;
    }
    if (focusRun.current || !shape.width || !shape.height) return;
    focusRun.current = true;
    const node = host.current;
    const reduced =
      node?.closest('[data-rm-reduced-motion="true"]') ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setDraw(true);
    if (!reduced && !invalid && node) {
      for (const path of node.querySelectorAll<SVGPathElement>(
        ".rm-field-outline path",
      )) {
        if (typeof path.animate !== "function") continue;
        const animation = path.animate(
          [{ strokeDasharray: "0 1" }, { strokeDasharray: "0.501 1" }],
          {
            duration: motion.fieldEnterMs,
            easing: "cubic-bezier(.2,.7,.2,1)",
            fill: "both",
          },
        );
        animations.current.push(animation);
        animation.finished.then(() => animation.cancel()).catch(() => {});
      }
    }
  }, [focused, invalid, shape.width, shape.height]);
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (
        media?.matches ||
        host.current?.closest('[data-rm-reduced-motion="true"]')
      ) {
        for (const animation of animations.current) animation.cancel();
        animations.current = [];
      }
    };
    media?.addEventListener("change", stop);
    const observer = new MutationObserver(stop);
    const theme = host.current?.closest(".rm-theme");
    if (theme)
      observer.observe(theme, {
        attributes: true,
        attributeFilter: ["data-rm-reduced-motion"],
      });
    return () => {
      observer.disconnect();
      media?.removeEventListener("change", stop);
      for (const animation of animations.current) animation.cancel();
    };
  }, []);
  const g = edges(
    shape.width,
    shape.height,
    shape.corners,
    motion.fieldWidth,
    shape.x,
  );
  return (
    <div
      ref={host}
      className="rm-field-frame"
      data-focused={focused || undefined}
      data-invalid={invalid || undefined}
      onPointerDownCapture={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        pointer.current = clamp((e.clientX - b.left) / b.width, 0, 1);
      }}
      onFocusCapture={(e) => {
        const el = e.target as HTMLInputElement;
        if (el.disabled) return;
        setShape((s) => ({ ...s, x: pointer.current ?? 0.5 }));
        pointer.current = null;
        setFocused(true);
      }}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          pointer.current = null;
          setFocused(false);
        }
      }}
    >
      {children}
      <svg
        className="rm-field-outline"
        aria-hidden="true"
        viewBox={`0 0 ${shape.width} ${shape.height}`}
        data-draw={draw || invalid || undefined}
      >
        <g transform={`translate(${g.inset} ${g.inset})`}>
          {g.paths.map((path, i) => (
            <path key={i} d={path.d} pathLength="1" />
          ))}
        </g>
      </svg>
    </div>
  );
}
