import { useEffect } from "react";

type Axis = "vertical" | "horizontal";
/** Thumb geometry is proportional, with a usable minimum and bounded position. */
export function scrollbarGeometry(
  viewport: number,
  content: number,
  offset: number,
) {
  const maximum = Math.max(0, content - viewport);
  const length = Math.min(
    viewport,
    Math.max(32, (viewport * viewport) / content),
  );
  const travel = Math.max(0, viewport - length);
  return {
    maximum,
    length,
    travel,
    position: maximum
      ? (Math.max(0, Math.min(maximum, offset)) / maximum) * travel
      : 0,
  };
}

/** Overlay only the scrollbar chrome; the original element still owns scrolling. */
export function installScrollbars() {
  if (typeof ResizeObserver === "undefined") return () => {};
  const root = document.documentElement;
  const entries = new Map<
    HTMLElement,
    { bars: Map<Axis, HTMLElement>; idAdded: boolean; activeUntil: number }
  >();
  let sequence = 0,
    frame = 0,
    expiry = 0,
    dragging: HTMLElement | null = null;
  let dirty = true;
  let candidates: HTMLElement[] = [];
  const forced = matchMedia("(forced-colors: active)");
  const invalidate = () => {
    dirty = true;
    schedule();
  };
  const resize = new ResizeObserver(invalidate);
  const owned = (node: Node) =>
    node instanceof Element && !!node.closest(".r-scrollbar");
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  const remove = (element: HTMLElement) => {
    const entry = entries.get(element);
    if (!entry) return;
    entry.bars.forEach((bar) => bar.remove());
    if (entry.idAdded) element.removeAttribute("id");
    element.removeAttribute("data-r-scroll-viewport");
    resize.unobserve(element);
    entries.delete(element);
  };
  const read = (element: HTMLElement, axis: Axis) =>
    scrollbarGeometry(
      axis === "vertical" ? element.clientHeight : element.clientWidth,
      axis === "vertical" ? element.scrollHeight : element.scrollWidth,
      axis === "vertical" ? element.scrollTop : Math.abs(element.scrollLeft),
    );
  const setOffset = (element: HTMLElement, axis: Axis, value: number) => {
    const next = Math.max(0, Math.min(read(element, axis).maximum, value));
    // Explicit instant scrolling avoids a page's smooth-scroll CSS delaying a drag.
    const target = element === root ? window : element;
    target.scrollTo({
      [axis === "vertical" ? "top" : "left"]:
        axis === "horizontal" && getComputedStyle(element).direction === "rtl"
          ? -next
          : next,
      behavior: "instant",
    });
    schedule();
  };
  const makeBar = (element: HTMLElement, axis: Axis) => {
    const bar = document.createElement("div");
    bar.className = `r-scrollbar r-scrollbar-${axis}`;
    bar.tabIndex = 0;
    bar.setAttribute("role", "scrollbar");
    bar.setAttribute("aria-controls", element.id);
    bar.setAttribute("aria-orientation", axis);
    bar.setAttribute("aria-valuemin", "0");
    const title =
      element === root
        ? "页面"
        : element.getAttribute("aria-label") ||
          (element.classList.contains("r-sidebar") ? "文档导航" : "内容区域");
    bar.setAttribute(
      "aria-label",
      `${title}${axis === "vertical" ? "纵向" : "横向"}滚动位置`,
    );
    const thumb = document.createElement("span");
    thumb.className = "r-scrollbar-thumb";
    bar.append(thumb);
    bar.addEventListener("keydown", (e) => {
      const g = read(element, axis),
        current =
          axis === "vertical"
            ? element.scrollTop
            : Math.abs(element.scrollLeft);
      const delta: Record<string, number> = {
        ArrowDown: 40,
        ArrowUp: -40,
        ArrowRight: 40,
        ArrowLeft: -40,
        PageDown: element.clientHeight * 0.9,
        PageUp: -element.clientHeight * 0.9,
      };
      if (e.key === "Home" || e.key === "End" || e.key in delta) {
        e.preventDefault();
        setOffset(
          element,
          axis,
          e.key === "Home"
            ? 0
            : e.key === "End"
              ? g.maximum
              : current + delta[e.key],
        );
      }
    });
    let grab = 0;
    const coordinate = (e: PointerEvent) =>
      axis === "vertical" ? e.clientY : e.clientX;
    const trackGeometry = () => {
      const extent = axis === "vertical" ? bar.clientHeight : bar.clientWidth;
      return scrollbarGeometry(extent, extent + read(element, axis).maximum, 0);
    };
    const move = (e: PointerEvent) => {
      const bounds = bar.getBoundingClientRect(),
        g = trackGeometry();
      const position =
        coordinate(e) - (axis === "vertical" ? bounds.top : bounds.left) - grab;
      const offset =
        axis === "horizontal" && getComputedStyle(element).direction === "rtl"
          ? g.travel - position
          : position;
      setOffset(element, axis, (offset / (g.travel || 1)) * g.maximum);
    };
    bar.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      e.preventDefault();
      const g = trackGeometry(),
        bounds = thumb.getBoundingClientRect();
      grab =
        e.target === thumb
          ? coordinate(e) - (axis === "vertical" ? bounds.top : bounds.left)
          : g.length / 2;
      dragging = bar;
      bar.dataset.dragging = "true";
      bar.setPointerCapture(e.pointerId);
      move(e);
    });
    bar.addEventListener("pointermove", (e) => {
      if (dragging === bar) move(e);
    });
    const end = () => {
      if (dragging === bar) dragging = null;
      delete bar.dataset.dragging;
      schedule();
    };
    bar.addEventListener("pointerup", end);
    bar.addEventListener("pointercancel", end);
    bar.addEventListener("lostpointercapture", end);
    // Wheel events over the overlay must reach the same original scrolling region.
    bar.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        const unit =
          e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? element.clientHeight : 1;
        setOffset(
          element,
          axis,
          (axis === "vertical"
            ? element.scrollTop
            : Math.abs(element.scrollLeft)) +
            (axis === "vertical" ? e.deltaY : e.deltaX || e.deltaY) * unit,
        );
      },
      { passive: false },
    );
    return bar;
  };
  function update() {
    frame = 0;
    if (forced.matches) {
      [...entries.keys()].forEach(remove);
      return;
    }
    if (dirty)
      candidates = [
        root,
        ...document.querySelectorAll<HTMLElement>("body *"),
      ].filter((element) => {
        if (
          owned(element) ||
          (element.closest("[inert]") &&
            !element.closest('[data-motion-state="exiting"]'))
        )
          return false;
        const css = getComputedStyle(element);
        return (
          element === root || /auto|scroll/.test(css.overflowX + css.overflowY)
        );
      });
    dirty = false;
    for (const element of entries.keys())
      if (!candidates.includes(element) || !element.isConnected)
        remove(element);
    const dialog = document.querySelector("dialog[open]");
    for (const element of candidates) {
      const y = read(element, "vertical"),
        x = read(element, "horizontal");
      if (!y.maximum && !x.maximum) {
        remove(element);
        continue;
      }
      let entry = entries.get(element);
      if (!entry) {
        const idAdded = !element.id;
        if (idAdded) element.id = `r-scroll-viewport-${++sequence}`;
        entry = { bars: new Map(), idAdded, activeUntil: 0 };
        entries.set(element, entry);
        element.dataset.rScrollViewport = "";
        resize.observe(element);
        // Hiding UA chrome changes client size: remeasure on the next frame.
        schedule();
      }
      const bounds =
        element === root
          ? { left: 0, top: 0, right: innerWidth, bottom: innerHeight }
          : element.getBoundingClientRect();
      let left = Math.max(0, bounds.left),
        top = Math.max(0, bounds.top),
        right = Math.min(innerWidth, bounds.right),
        bottom = Math.min(innerHeight, bounds.bottom);
      for (
        let parent = element.parentElement;
        parent && parent !== document.body;
        parent = parent.parentElement
      ) {
        const css = getComputedStyle(parent),
          rect = parent.getBoundingClientRect();
        if (/auto|scroll|hidden|clip/.test(css.overflowY)) {
          top = Math.max(top, rect.top);
          bottom = Math.min(bottom, rect.bottom);
        }
        if (/auto|scroll|hidden|clip/.test(css.overflowX)) {
          left = Math.max(left, rect.left);
          right = Math.min(right, rect.right);
        }
      }
      const host =
        element.closest<HTMLElement>("dialog, [popover]") || document.body;
      for (const [axis, g] of [
        ["vertical", y],
        ["horizontal", x],
      ] as const) {
        let bar = entry.bars.get(axis);
        // Fractional layout can round scrollWidth up by one pixel without meaningful overflow.
        if (g.maximum <= 1) {
          bar?.remove();
          entry.bars.delete(axis);
          continue;
        }
        if (!bar) {
          bar = makeBar(element, axis);
          entry.bars.set(axis, bar);
        }
        if (bar.parentElement !== host) host.append(bar);
        // A listbox must contain options only; its combobox already provides keyboard scrolling.
        if (host.getAttribute("role") === "listbox") {
          bar.setAttribute("aria-hidden", "true");
          bar.tabIndex = -1;
        } else {
          bar.removeAttribute("aria-hidden");
          bar.tabIndex = 0;
        }
        const blocked =
          dialog &&
          !dialog.contains(element) &&
          !host.matches("[popover]:popover-open");
        const visible = element === root || element.getClientRects().length > 0;
        bar.hidden =
          !visible || !!blocked || right - left < 16 || bottom - top < 16;
        const theme =
          element.closest<HTMLElement>("[data-theme]")?.dataset.theme;
        if (theme) bar.dataset.theme = theme;
        else delete bar.dataset.theme;
        bar.dataset.active = String(entry.activeUntil > performance.now());
        bar.setAttribute("aria-valuemax", String(Math.round(g.maximum)));
        bar.setAttribute(
          "aria-valuenow",
          String(
            Math.round(
              axis === "vertical"
                ? element.scrollTop
                : Math.abs(element.scrollLeft),
            ),
          ),
        );
        const extent =
          axis === "vertical" ? bottom - top - 8 : right - left - 8;
        const scaled = scrollbarGeometry(
          extent,
          extent + g.maximum,
          axis === "vertical"
            ? element.scrollTop
            : Math.abs(element.scrollLeft),
        );
        Object.assign(bar.style, {
          position: host === document.body ? "fixed" : "absolute",
          left: `${axis === "vertical" ? right - 12 : left + 4}px`,
          top: `${axis === "vertical" ? top + 4 : bottom - 12}px`,
          width: `${axis === "vertical" ? 12 : extent}px`,
          height: `${axis === "vertical" ? extent : 12}px`,
        });
        if (host !== document.body) {
          const hostBounds = host.getBoundingClientRect();
          bar.style.left = `${(axis === "vertical" ? right - 12 : left + 4) - hostBounds.left - host.clientLeft + host.scrollLeft}px`;
          bar.style.top = `${(axis === "vertical" ? top + 4 : bottom - 12) - hostBounds.top - host.clientTop + host.scrollTop}px`;
        }
        if (element.closest("[inert]")) {
          bar.setAttribute("aria-hidden", "true");
          bar.tabIndex = -1;
          bar.style.pointerEvents = "none";
        } else bar.style.pointerEvents = "";
        const thumb = bar.firstElementChild as HTMLElement;
        Object.assign(
          thumb.style,
          axis === "vertical"
            ? {
                height: `${scaled.length}px`,
                transform: `translateY(${scaled.position}px)`,
              }
            : {
                width: `${scaled.length}px`,
                transform: `translateX(${getComputedStyle(element).direction === "rtl" ? scaled.travel - scaled.position : scaled.position}px)`,
              },
        );
      }
    }
  }
  const mutation = new MutationObserver((records) => {
    if (
      records.some(
        (record) =>
          !owned(record.target) &&
          (record.type !== "childList" ||
            [...record.addedNodes, ...record.removedNodes].some(
              (node) => !owned(node),
            )),
      )
    )
      invalidate();
  });
  mutation.observe(document.body, {
    subtree: true,
    childList: true,
    characterData: true,
    attributes: true,
    attributeFilter: ["open", "class", "style", "hidden", "data-theme"],
  });
  const onScroll = (e: Event) => {
    const element = e.target === document ? root : (e.target as HTMLElement);
    const entry = entries.get(element);
    if (entry) entry.activeUntil = performance.now() + 700;
    clearTimeout(expiry);
    expiry = window.setTimeout(schedule, 750);
    schedule();
  };
  document.addEventListener("scroll", onScroll, true);
  document.addEventListener("load", invalidate, true);
  window.addEventListener("resize", invalidate);
  forced.addEventListener?.("change", invalidate);
  schedule();
  return () => {
    cancelAnimationFrame(frame);
    clearTimeout(expiry);
    mutation.disconnect();
    resize.disconnect();
    document.removeEventListener("scroll", onScroll, true);
    document.removeEventListener("load", invalidate, true);
    window.removeEventListener("resize", invalidate);
    forced.removeEventListener?.("change", invalidate);
    [...entries.keys()].forEach(remove);
  };
}
export function useScrollbars() {
  useEffect(installScrollbars, []);
}
