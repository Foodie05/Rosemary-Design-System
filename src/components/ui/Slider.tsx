import { CSSProperties, InputHTMLAttributes, useState, useEffect } from "react";
export type SliderProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value"
> & { value: number | string };
/** Native range semantics with Rosemary track, fill and thumb presentation. */
export function Slider({
  value,
  min = 0,
  max = 100,
  className = "",
  style,
  disabled,
  ...props
}: SliderProps) {
  const [pressed, setPressed] = useState(false);
  useEffect(() => {
    if (!pressed) return;
    const release = () => setPressed(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    window.addEventListener("blur", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      window.removeEventListener("blur", release);
    };
  }, [pressed]);
  const low = Number(min),
    high = Number(max);
  const fill =
    high > low && Number.isFinite(Number(value))
      ? Math.min(100, Math.max(0, ((Number(value) - low) / (high - low)) * 100))
      : 0;
  return (
    <input
      {...props}
      onPointerDown={(e) => {
        if (!disabled && e.button === 0) setPressed(true);
        props.onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        setPressed(false);
        props.onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        setPressed(false);
        props.onPointerCancel?.(e);
      }}
      data-pressed={(pressed && !disabled) || undefined}
      type="range"
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      className={`r-slider ${className}`}
      style={{ ...style, "--r-range-fill": `${fill}%` } as CSSProperties}
    />
  );
}
