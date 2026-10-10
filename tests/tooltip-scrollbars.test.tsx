import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Button, Tooltip } from "../src/components/ui/core";
import {
  installScrollbars,
  scrollbarGeometry,
} from "../src/hooks/useScrollbars";

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
const tooltip = () => {
  vi.useFakeTimers();
  render(
    <Tooltip text="说明">
      <Button>操作</Button>
    </Tooltip>,
  );
  return screen.getByRole("button").parentElement!;
};
const wait = () => act(() => vi.advanceTimersByTime(300));
describe("Tooltip input modality and cancellation", () => {
  it("mouse click focus does not pin a hover tooltip after leaving", () => {
    const anchor = tooltip();
    fireEvent.pointerEnter(anchor);
    wait();
    fireEvent.pointerDown(anchor);
    fireEvent.focus(screen.getByRole("button"));
    expect(screen.getByRole("tooltip")).toBeDefined();
    fireEvent.pointerLeave(anchor);
    expect(screen.queryByRole("tooltip")).toBeNull();
    wait();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
  it("leaving before the delay cancels the pending reveal", () => {
    const anchor = tooltip();
    fireEvent.pointerEnter(anchor);
    act(() => vi.advanceTimersByTime(200));
    fireEvent.pointerLeave(anchor);
    wait();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
  it("keyboard focus remains visible after pointer leaves, then closes on blur", () => {
    const anchor = tooltip();
    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.focus(screen.getByRole("button"));
    wait();
    fireEvent.pointerEnter(anchor);
    fireEvent.pointerLeave(anchor);
    expect(screen.getByRole("tooltip")).toBeDefined();
    fireEvent.blur(screen.getByRole("button"));
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
  it("Escape cancels a pending reveal until genuine reentry", () => {
    const anchor = tooltip();
    fireEvent.pointerEnter(anchor);
    fireEvent.keyDown(document, { key: "Escape" });
    wait();
    expect(screen.queryByRole("tooltip")).toBeNull();
    fireEvent.pointerLeave(anchor);
    fireEvent.pointerEnter(anchor);
    wait();
    expect(screen.getByRole("tooltip")).toBeDefined();
  });
  it("programmatic initial focus does not reveal an untouched control", () => {
    tooltip();
    fireEvent.focus(screen.getByRole("button"));
    wait();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });
  it("pointer activation elsewhere cannot turn subsequent automatic focus into keyboard help", () => {
    tooltip();
    fireEvent.pointerDown(document.body);
    fireEvent.focus(screen.getByRole("button"));
    wait();
    expect(screen.queryByRole("tooltip")).toBeNull();
    fireEvent.blur(screen.getByRole("button"));
    fireEvent.keyDown(document, { key: "Tab" });
    fireEvent.focus(screen.getByRole("button"));
    wait();
    expect(screen.getByRole("tooltip")).toBeDefined();
  });
});

describe("Drawn scrollbar preserves the original viewport", () => {
  it("bounds the thumb and scroll offset for short and very long content", () => {
    expect(scrollbarGeometry(200, 400, 100)).toEqual({
      maximum: 200,
      length: 100,
      travel: 100,
      position: 50,
    });
    expect(scrollbarGeometry(200, 20000, 30000).position).toBe(168);
    expect(scrollbarGeometry(200, 100, -10).position).toBe(0);
  });
  it("keyboard and wheel update the original viewport, and teardown restores UA chrome", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    vi.stubGlobal("requestAnimationFrame", (fn: FrameRequestCallback) =>
      setTimeout(() => fn(0), 16),
    );
    vi.stubGlobal("cancelAnimationFrame", clearTimeout);
    render(
      <div
        id="scroll-test"
        aria-label="文件"
        style={{ overflowY: "auto", overflowX: "auto" }}
      >
        内容
      </div>,
    );
    const viewport = document.getElementById("scroll-test")!;
    Object.defineProperties(viewport, {
      clientHeight: { value: 200 },
      scrollHeight: { value: 600 },
      clientWidth: { value: 300 },
      scrollWidth: { value: 300 },
    });
    viewport.getBoundingClientRect = () =>
      ({
        top: 0,
        left: 0,
        right: 300,
        bottom: 200,
        width: 300,
        height: 200,
      }) as DOMRect;
    viewport.getClientRects = () =>
      [viewport.getBoundingClientRect()] as unknown as DOMRectList;
    viewport.scrollTo = vi.fn((options: ScrollToOptions) => {
      viewport.scrollTop = options.top || 0;
    }) as HTMLElement["scrollTo"];
    const dispose = installScrollbars();
    act(() => vi.advanceTimersByTime(40));
    const bar = screen.getByRole("scrollbar", { name: "文件纵向滚动位置" });
    expect(viewport.hasAttribute("data-r-scroll-viewport")).toBe(true);
    expect(bar.getAttribute("aria-controls")).toBe("scroll-test");
    fireEvent.keyDown(bar, { key: "End" });
    act(() => vi.advanceTimersByTime(20));
    expect(viewport.scrollTop).toBe(400);
    expect(bar.getAttribute("aria-valuenow")).toBe("400");
    fireEvent.keyDown(bar, { key: "Home" });
    fireEvent.wheel(bar, { deltaY: 80 });
    expect(viewport.scrollTop).toBe(80);
    vi.stubGlobal("PointerEvent", MouseEvent);
    bar.setPointerCapture = vi.fn();
    Object.defineProperty(bar, "clientHeight", { value: 192 });
    bar.getBoundingClientRect = () =>
      ({ top: 4, left: 288, width: 12, height: 192 }) as DOMRect;
    fireEvent.pointerDown(bar, { button: 0, clientY: 100 });
    expect(viewport.scrollTop).toBeCloseTo(200);
    fireEvent.pointerMove(bar, { clientY: 200 });
    expect(viewport.scrollTop).toBe(400);
    fireEvent.pointerUp(bar);
    fireEvent.pointerMove(bar, { clientY: 4 });
    expect(viewport.scrollTop).toBe(400);
    dispose();
    expect(screen.queryByRole("scrollbar")).toBeNull();
    expect(viewport.hasAttribute("data-r-scroll-viewport")).toBe(false);
    expect(viewport.id).toBe("scroll-test");
  });
});
