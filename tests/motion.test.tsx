import { popupMotionOffset } from "../src/hooks/usePresence";
import { changePage, cancelPageMotion, pageMotionFor } from "../src/pageMotion";
import { parseRoute } from "../src/routing";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import {
  MotionPreferences,
  MotionPreferenceControl,
  useReducedMotion,
} from "../src/context/MotionPreferences";
import { Presence } from "../src/components/ui/Presence";
import { Select } from "../src/components/ui/Select";
import { Modal } from "../src/components/ui/core";
import { Tabs } from "../src/components/ui/navigation";
import { writeFileSync } from "node:fs";
import { MOTION_CATALOGUE, MOTION_RULES } from "../src/data/motion";
import { COMPONENT_SPECS } from "../src/data/componentsSpec";
import { tokenModes } from "../src/generated/tokens";
import { chooseSelect } from "./select-helpers";
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  localStorage.clear();
  cancelPageMotion();
  delete document.documentElement.dataset.routeMotion;
  vi.restoreAllMocks();
  delete document.documentElement.dataset.motion;
});
const system = (matches = false) => {
  const listeners = new Set<() => void>();
  const media = {
    matches,
    addEventListener: (_: string, fn: () => void) => listeners.add(fn),
    removeEventListener: (_: string, fn: () => void) => listeners.delete(fn),
  };
  vi.stubGlobal("matchMedia", () => media);
  return {
    media,
    listeners,
    change: (value: boolean) =>
      act(() => {
        media.matches = value;
        listeners.forEach((fn) => fn());
      }),
  };
};
function State() {
  return <output>{useReducedMotion() ? "reduced" : "full"}</output>;
}
describe("Motion meaning, interruption and site preference", () => {
  it("keeps popup movement inside its viewport margin in both directions", () => {
    expect(popupMotionOffset(16, 320, 720, false)).toBe(0);
    expect(popupMotionOffset(384, 320, 720, true)).toBe(0);
    expect(popupMotionOffset(40, 320, 720, false)).toBe(-4);
    expect(popupMotionOffset(40, 320, 720, true)).toBe(4);
  });
  it("registers a complete policy for every actual component, including static cases", () => {
    expect(Object.keys(MOTION_RULES).sort()).toEqual(
      COMPONENT_SPECS.map((s) => s.id).sort(),
    );
    for (const rule of Object.values(MOTION_RULES))
      for (const field of Object.values(rule))
        expect(field.trim().length).toBeGreaterThan(0);
    expect(MOTION_RULES.divider.enter).toBe("静态");
  });
  it("keeps existing token names and defines distinct motion roles in both themes", () => {
    for (const mode of ["light", "dark"] as const) {
      expect(tokenModes[mode]["semantic.motion.fast"].resolved.value).toBe(150);
      expect(tokenModes[mode]["semantic.motion.enter"].resolved.value).toBe(
        180,
      );
      expect(tokenModes[mode]["semantic.motion.exit"].resolved.value).toBe(120);
      expect(tokenModes[mode]["semantic.motion.panel"].resolved.value).toBe(
        280,
      );
    }
  });
  it("system preference changes live and subscriptions clean up", () => {
    const m = system();
    const view = render(
      <MotionPreferences>
        <State />
      </MotionPreferences>,
    );
    expect(screen.getByText("full")).toBeDefined();
    m.change(true);
    expect(screen.getByText("reduced")).toBeDefined();
    expect(document.documentElement.dataset.motion).toBe("reduced");
    m.change(false);
    expect(screen.getByText("full")).toBeDefined();
    view.unmount();
    expect(m.listeners.size).toBe(0);
  });
  it("manual reduce persists, applies to children, and returning to system respects the system", () => {
    const m = system();
    render(
      <MotionPreferences>
        <MotionPreferenceControl />
        <State />
      </MotionPreferences>,
    );
    chooseSelect(
      screen.getByRole("combobox", { name: "动态效果" }),
      "减少动态效果",
    );
    expect(screen.getByText("reduced")).toBeDefined();
    expect(localStorage.getItem("rosemary_motion")).toBe("reduce");
    m.change(true);
    chooseSelect(
      screen.getByRole("combobox", { name: "动态效果" }),
      "跟随系统",
    );
    expect(screen.getByText("reduced")).toBeDefined();
    m.change(false);
    expect(screen.getByText("full")).toBeDefined();
  });
  it("loads a saved reduce preference without overwriting existing theme storage", () => {
    system();
    localStorage.setItem("rosemary_motion", "reduce");
    localStorage.setItem("rosemary_theme", "dark");
    render(
      <MotionPreferences>
        <State />
      </MotionPreferences>,
    );
    expect(screen.getByText("reduced")).toBeDefined();
    expect(localStorage.getItem("rosemary_theme")).toBe("dark");
  });
  it("exiting content immediately loses interactivity; reopen cancels stale teardown", () => {
    vi.useFakeTimers();
    system();
    const view = render(
      <Presence open>
        <button>通知操作</button>
      </Presence>,
    );
    view.rerender(
      <Presence open={false}>
        <button>通知操作</button>
      </Presence>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    expect(document.querySelector("[inert][aria-hidden=true]")).not.toBeNull();
    act(() => vi.advanceTimersByTime(60));
    view.rerender(
      <Presence open>
        <button>通知操作</button>
      </Presence>,
    );
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole("button")).toBeDefined();
    view.rerender(
      <Presence open={false}>
        <button>通知操作</button>
      </Presence>,
    );
    act(() => vi.advanceTimersByTime(120));
    expect(document.querySelector(".r-presence")).toBeNull();
  });
  it("switching to reduced motion during an exit removes the retained visual immediately", () => {
    vi.useFakeTimers();
    const m = system();
    const view = render(
      <Presence open>
        <button>操作</button>
      </Presence>,
    );
    view.rerender(
      <Presence open={false}>
        <button>操作</button>
      </Presence>,
    );
    m.change(true);
    expect(document.querySelector(".r-presence")).toBeNull();
  });
  it("Select commit remains immediate and a rapid reopen survives the previous exit", () => {
    vi.useFakeTimers();
    system();
    const change = vi.fn();
    render(
      <Select
        label="地区"
        value="a"
        onValueChange={change}
        options={[
          { value: "a", label: "上海" },
          { value: "b", label: "北京" },
        ]}
      />,
    );
    chooseSelect(screen.getByRole("combobox"), "北京");
    expect(change).toHaveBeenCalledWith("b");
    expect(screen.queryByRole("listbox")).toBeNull();
    fireEvent.click(screen.getByRole("combobox"));
    act(() => vi.advanceTimersByTime(150));
    expect(screen.getByRole("listbox")).toBeDefined();
    fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });
  it("dialog close releases native modality and semantics without waiting for the visual exit", () => {
    const close = vi.fn();
    const view = render(
      <Modal open onClose={close} title="项目">
        <button>确认</button>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    view.rerender(
      <Modal open={false} onClose={close} title="项目">
        <button>确认</button>
      </Modal>,
    );
    expect(dialog.hasAttribute("open")).toBe(false);
    expect(dialog.hasAttribute("inert")).toBe(true);
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("ignores a queued native close event after the controlled dialog has reopened", () => {
    const close = vi.fn();
    const view = render(
      <Modal open onClose={close} title="项目">
        <input aria-label="名称" />
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    view.rerender(
      <Modal open={false} onClose={close} title="项目">
        <input aria-label="名称" />
      </Modal>,
    );
    view.rerender(
      <Modal open onClose={close} title="项目">
        <input aria-label="名称" />
      </Modal>,
    );
    fireEvent(dialog, new Event("close"));
    expect(close).not.toHaveBeenCalled();
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.activeElement).toBe(
      screen.getByRole("textbox", { name: "名称" }),
    );
  });
  it("rapid tab navigation targets the latest tab and measures a single shared indicator", () => {
    render(<Tabs />);
    const tabs = screen.getAllByRole("tab");
    tabs.forEach((tab, i) =>
      Object.defineProperties(tab, {
        offsetLeft: { value: i * 100 },
        offsetWidth: { value: 80 },
      }),
    );
    fireEvent.keyDown(tabs[0], { key: "End" });
    fireEvent.keyDown(tabs[2], { key: "Home" });
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" });
    expect(screen.getByRole("tabpanel").textContent).toContain("今天更新");
    expect(document.querySelectorAll(".r-tab-indicator").length).toBe(1);
    expect(
      (document.querySelector(".r-tab-indicator") as HTMLElement).style
        .transform,
    ).toBe("translateX(100px)");
  });
});

afterAll(() => {
  writeFileSync(
    "docs/motion-catalogue.json",
    JSON.stringify({ components: MOTION_CATALOGUE }, null, 2) + "\n",
  );
});

describe("Real page hierarchy and interruption", () => {
  const path = (a: string, b: string) =>
    pageMotionFor(parseRoute(a), parseRoute(b));
  it("distinguishes peers, drilling into a detail, returning and unrelated detail routes", () => {
    expect(path("#/brand", "#/foundations")).toBe("peer-forward");
    expect(path("#/foundations", "#/brand")).toBe("peer-back");
    expect(path("#/components", "#/components/button")).toBe("deeper");
    expect(path("#/components/button", "#/components")).toBe("parent");
    expect(path("#/components/button", "#/components/icon-button")).toBe(
      "peer-forward",
    );
    expect(path("#/components/button", "#/dodont/case-01-nav-hierarchy")).toBe(
      "cross",
    );
    expect(path("#/components/missing", "#/components/button")).toBe("cross");
  });
  it("does not animate filter queries or chapter anchors as fictitious pages", () => {
    expect(path("#/tokens?query=a", "#/tokens?query=b")).toBe("none");
    expect(
      path(
        "#/components/button?anchor=usage",
        "#/components/button?anchor=motion",
      ),
    ).toBe("none");
  });
  it("fallback and reduced preference update immediately without native snapshots", () => {
    system();
    const update = vi.fn();
    document.documentElement.dataset.motion = "reduced";
    changePage("deeper", update);
    expect(update).toHaveBeenCalledTimes(1);
    delete document.documentElement.dataset.motion;
    changePage("peer-back", update);
    expect(update).toHaveBeenCalledTimes(2);
    expect(document.documentElement.dataset.routeTransition).toBeUndefined();
  });
  it("a rapid second route skips the previous snapshot and prevents stale callbacks overwriting it", async () => {
    system();
    const callbacks: (() => Promise<void>)[] = [],
      skips = [vi.fn(), vi.fn()];
    const original = Object.getOwnPropertyDescriptor(
      document,
      "startViewTransition",
    );
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: (callback: () => Promise<void>) => {
        callbacks.push(callback);
        return {
          skipTransition: skips[callbacks.length - 1],
          ready: Promise.resolve(),
          finished: new Promise(() => {}),
        };
      },
    });
    try {
      const first = vi.fn(),
        second = vi.fn();
      changePage("peer-forward", first);
      changePage("peer-back", second);
      expect(skips[0]).toHaveBeenCalledTimes(1);
      await callbacks[0]();
      await callbacks[1]();
      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
      cancelPageMotion();
      expect(skips[1]).toHaveBeenCalledTimes(1);
    } finally {
      if (original)
        Object.defineProperty(document, "startViewTransition", original);
      else
        delete (document as unknown as { startViewTransition?: unknown })
          .startViewTransition;
    }
  });
});

describe("Live tab panel motion", () => {
  it("rapid tab changes cancel presentation without retaining stale content or delaying selection", () => {
    system();
    const animations: {
      cancel: ReturnType<typeof vi.fn>;
      playState: string;
    }[] = [];
    const animate = vi.fn(() => {
      const result = { cancel: vi.fn(), playState: "running" };
      animations.push(result);
      return result;
    });
    const original = Object.getOwnPropertyDescriptor(
      HTMLElement.prototype,
      "animate",
    );
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: animate,
    });
    try {
      render(<Tabs />);
      fireEvent.keyDown(screen.getByRole("tab", { name: "概览" }), {
        key: "ArrowRight",
      });
      fireEvent.keyDown(screen.getByRole("tab", { name: "活动" }), {
        key: "ArrowRight",
      });
      expect(screen.getAllByRole("tabpanel")).toHaveLength(1);
      expect(screen.getByRole("tabpanel").textContent).toContain(
        "允许团队评论",
      );
      expect(animations[0].cancel).toHaveBeenCalled();
      expect(animate).toHaveBeenCalledTimes(2);
    } finally {
      if (original)
        Object.defineProperty(HTMLElement.prototype, "animate", original);
      else
        delete (HTMLElement.prototype as unknown as { animate?: unknown })
          .animate;
    }
  });
});
