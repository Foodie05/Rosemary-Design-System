import { Select } from "../ui/Select";
// Compatibility entry points for retained foundation documentation.
import { useState } from "react";
import { tokenModes } from "../../generated/tokens";
import { MotionRestraint } from "../cases/MotionScenarios";
import { Autosave, UndoDelete } from "../cases/ResilienceScenarios";
const luminance = (hex: string) =>
  [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
export function ColorContrastCheckerDemo() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [color, set] = useState("text");
  const [background, setBackground] = useState("canvas");
  const tokens = tokenModes[mode];
  const value = (name: string) =>
    tokens[`semantic.color.${name}` as keyof typeof tokens].value;
  const a = luminance(value(color)),
    b = luminance(value(background));
  const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  return (
    <div className="r-stack">
      <div className="r-control-row">
        <label>
          主题
          <Select
            value={mode}
            onValueChange={(value) => setMode(value as "light" | "dark")}
            label={"主题"}
            options={[
              { value: "light", label: "light" },
              { value: "dark", label: "dark" },
            ]}
          />
        </label>
        <label>
          文字
          <Select
            value={color}
            onValueChange={(value) => set(value)}
            label={"文字"}
            options={[
              ...[
                "text",
                "text-secondary",
                "text-tertiary",
                "accent",
                "danger",
                "warning",
                "info",
                "on-accent",
              ].map((v) => ({ value: String(v), label: String(v) })),
            ]}
          />
        </label>
        <label>
          背景
          <Select
            value={background}
            onValueChange={(value) => setBackground(value)}
            label={"背景"}
            options={[
              ...[
                "canvas",
                "surface",
                "surface-subtle",
                "accent",
                "danger-subtle",
                "warning-subtle",
                "info-subtle",
              ].map((v) => ({ value: String(v), label: String(v) })),
            ]}
          />
        </label>
      </div>
      <div
        className="r-contrast-sample"
        style={{
          background: value(background),
          color: value(color),
          padding: 24,
          borderRadius: 8,
        }}
      >
        让每一段内容都清晰可读。
        <br />
        <strong>{ratio.toFixed(2)} : 1</strong>
      </div>
      <p role="status">
        普通文本 AA {ratio >= 4.5 ? "通过" : "不通过"} · 大字 / 非文本图形{" "}
        {ratio >= 3 ? "通过" : "不通过"}。比值通过不等于整站 WCAG 合规。
      </p>
    </div>
  );
}
export function MotionPreferenceTesterDemo() {
  return <MotionRestraint good />;
}
export function AutosaveDemo() {
  return <Autosave good />;
}
export function DeleteConfirmationDemo() {
  return <UndoDelete good />;
}
