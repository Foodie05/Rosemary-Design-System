import { SliderExample } from "../src/components/ui/inputs";
import { ResizableExample } from "../src/components/ui/layout";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Slider } from "../src/components/ui/Slider";
import { useState } from "react";
describe("Shared Slider preserves range behavior", () => {
  it("names range inputs explicitly when the field also contains an output", () => {
    render(
      <>
        <SliderExample />
        <ResizableExample />
      </>,
    );
    expect(screen.getByRole("slider", { name: "缩放比例" })).toBeDefined();
    expect(screen.getByRole("slider", { name: "侧栏宽度" })).toBeDefined();
  });
  it("maps arbitrary ranges and clamped values to the visible fill", () => {
    const { rerender } = render(
      <Slider
        aria-label="宽度"
        min={20}
        max={60}
        value={35}
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("slider").style.getPropertyValue("--r-range-fill"),
    ).toBe("37.5%");
    rerender(
      <Slider
        aria-label="宽度"
        min={20}
        max={60}
        value={90}
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("slider").style.getPropertyValue("--r-range-fill"),
    ).toBe("100%");
    rerender(
      <Slider
        aria-label="宽度"
        min={20}
        max={60}
        value={0}
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByRole("slider").style.getPropertyValue("--r-range-fill"),
    ).toBe("0%");
  });
  it("updates controlled output and forwards native min, max, step, name and value text", () => {
    function Example() {
      const [value, set] = useState(30);
      return (
        <form aria-label="设置">
          <label>
            音量
            <Slider
              value={value}
              min={0}
              max={100}
              step={5}
              name="volume"
              aria-valuetext={`${value}%`}
              onChange={(e) => set(+e.target.value)}
            />
          </label>
          <output>{value}%</output>
        </form>
      );
    }
    render(<Example />);
    const slider = screen.getByRole("slider") as HTMLInputElement;
    fireEvent.change(slider, { target: { value: 65 } });
    expect(screen.getByRole("status").textContent).toBe("65%");
    expect(slider.getAttribute("aria-valuetext")).toBe("65%");
    expect(slider.min).toBe("0");
    expect(slider.max).toBe("100");
    expect(slider.step).toBe("5");
    expect(
      new FormData(screen.getByRole("form") as HTMLFormElement).get("volume"),
    ).toBe("65");
    expect(slider.style.getPropertyValue("--r-range-fill")).toBe("65%");
  });
  it("uses a disabled native range and excludes it from submission", () => {
    const change = vi.fn();
    render(
      <form aria-label="设置">
        <Slider
          disabled
          value={50}
          name="volume"
          aria-label="音量"
          onChange={change}
        />
      </form>,
    );
    expect((screen.getByRole("slider") as HTMLInputElement).disabled).toBe(
      true,
    );
    expect(
      new FormData(screen.getByRole("form") as HTMLFormElement).has("volume"),
    ).toBe(false);
  });
  it("press feedback follows the pointer and clears on outside release, cancel and window blur", () => {
    const down = vi.fn();
    render(
      <Slider
        value={50}
        aria-label="音量"
        onChange={() => {}}
        onPointerDown={down}
      />,
    );
    const slider = screen.getByRole("slider");
    fireEvent.pointerDown(slider, { button: 0 });
    expect(slider.getAttribute("data-pressed")).toBe("true");
    expect(down).toHaveBeenCalledTimes(1);
    fireEvent.pointerUp(window);
    expect(slider.hasAttribute("data-pressed")).toBe(false);
    fireEvent.pointerDown(slider, { button: 0 });
    fireEvent.pointerCancel(window);
    expect(slider.hasAttribute("data-pressed")).toBe(false);
    fireEvent.pointerDown(slider, { button: 0 });
    fireEvent.blur(window);
    expect(slider.hasAttribute("data-pressed")).toBe(false);
  });
  it("disabled sliders never enter the pressed visual state", () => {
    render(
      <Slider disabled value={50} aria-label="音量" onChange={() => {}} />,
    );
    fireEvent.pointerDown(screen.getByRole("slider"), { button: 0 });
    expect(screen.getByRole("slider").hasAttribute("data-pressed")).toBe(false);
  });
});
