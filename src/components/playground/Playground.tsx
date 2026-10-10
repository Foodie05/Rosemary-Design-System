import { Slider } from "../ui/Slider";
import { Select } from "../ui/Select";
import { useSessionState } from "../../hooks/useSessionState";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { ComponentSpec } from "../../types";
import { Button, PreviewProps, Variant, Size } from "../ui/core";
import { COMPONENT_IMPLEMENTATIONS } from "./registry";
import { CodeBlock } from "../common/CodeBlock";
export function Playground({ spec }: { spec: ComponentSpec }) {
  const impl = COMPONENT_IMPLEMENTATIONS[spec.id];
  const [variant, setVariant] = useSessionState<Variant>(
    `playground-${spec.id}-variant`,
    "primary",
  );
  const [size, setSize] = useSessionState<Size>(
    `playground-${spec.id}-size`,
    "md",
  );
  const [state, setState] = useSessionState(
    `playground-${spec.id}-state`,
    "default",
  );
  const [label, setLabel] = useSessionState(`playground-${spec.id}-label`, "");
  const [theme, setTheme] = useSessionState(
    `playground-${spec.id}-theme`,
    "site",
  );
  const [width, setWidth] = useSessionState(`playground-${spec.id}-width`, 640);
  const [reset, setReset] = useState(0);
  const [stateView, showState] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const [actualWidth, setActualWidth] = useState(width);
  useEffect(() => {
    if (!stage.current || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) =>
      setActualWidth(
        Math.round(
          entries[0].borderBoxSize?.[0]?.inlineSize ||
            entries[0].contentRect.width,
        ),
      ),
    );
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);
  const Preview = impl.Preview;
  const p: PreviewProps = {
    variant,
    size,
    disabled: state === "disabled",
    loading: state === "loading",
    error: state === "error",
    label: label || undefined,
  };
  const restart = () => {
    setVariant("primary");
    setSize("md");
    setState("default");
    setLabel("");
    setTheme("site");
    setWidth(640);
    setReset(reset + 1);
  };
  const has = (v: (typeof impl.controls)[number]) => impl.controls.includes(v);
  const code =
    spec.id === "button"
      ? `import { Button } from './components/ui/core';\n\n<Button variant="${variant}" size="${size}"${p.disabled ? " disabled" : ""}${p.loading ? " loading" : ""}\n  onClick={() => console.log('saved')}\n>${label || "保存更改"}</Button>`
      : `import { COMPONENT_IMPLEMENTATIONS } from './components/playground/registry';\n\nconst Preview = COMPONENT_IMPLEMENTATIONS['${spec.id}'].Preview;\n<Preview${Object.entries(
          p,
        )
          .filter(
            ([k, v]) => impl.controls.includes(k as any) && v !== undefined,
          )
          .map(([k, v]) => ` ${k}={${JSON.stringify(v)}}`)
          .join("")} />`;
  return (
    <section className="r-playground">
      <div className="r-section-heading">
        <div>
          <span className="r-eyebrow">LIVE REFERENCE</span>
          <h2>Playground</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={restart}>
          重置配置与交互
        </Button>
      </div>
      <div className="r-playground-controls">
        {has("variant") && (
          <label>
            Variant
            <Select
              value={variant}
              onValueChange={(value) => setVariant(value as Variant)}
              label={"Variant"}
              options={[
                ...["primary", "secondary", "tertiary", "ghost", "danger"].map(
                  (v) => ({ value: String(v), label: String(v) }),
                ),
              ]}
            />
          </label>
        )}
        {has("size") && (
          <label>
            Size
            <Select
              value={size}
              onValueChange={(value) => setSize(value as Size)}
              label={"Size"}
              options={[
                ...["sm", "md", "lg"].map((v) => ({
                  value: String(v),
                  label: String(v),
                })),
              ]}
            />
          </label>
        )}
        {impl.controls.some((v) =>
          ["disabled", "loading", "error"].includes(v),
        ) && (
          <label>
            State
            <Select
              value={state}
              onValueChange={(value) => setState(value)}
              label={"State"}
              options={[
                { value: "default", label: "Default" },
                ...[
                  has("disabled") && {
                    value: "disabled",
                    label: "Disabled",
                  },
                ].filter((option): option is { value: string; label: string } =>
                  Boolean(option),
                ),
                ...[
                  has("loading") && {
                    value: "loading",
                    label: "Loading",
                  },
                ].filter((option): option is { value: string; label: string } =>
                  Boolean(option),
                ),
                ...[
                  has("error") && {
                    value: "error",
                    label: "Error",
                  },
                ].filter((option): option is { value: string; label: string } =>
                  Boolean(option),
                ),
              ]}
            />
          </label>
        )}
        {has("label") && (
          <label>
            内容
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="使用组件默认内容"
            />
          </label>
        )}
        <label>
          Theme
          <Select
            value={theme}
            onValueChange={(value) => setTheme(value)}
            label={"Theme"}
            options={[
              { value: "site", label: "跟随网站" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </label>
        <label>
          宽度上限 · {width}px
          <Slider
            aria-label="预览宽度"
            min="240"
            max="880"
            value={width}
            onChange={(e) => setWidth(+e.target.value)}
          />
        </label>
      </div>
      <div className="r-preview-outer">
        <div
          className="r-playground-stage"
          ref={stage}
          data-theme={theme === "site" ? undefined : theme}
          style={{
            width: Math.max(240, Math.min(880, width)),
            maxWidth: "100%",
          }}
        >
          <div className="r-stage-ruler">
            <span>组件预览：{spec.name}</span>
            <span>{actualWidth} PX · 实际宽度</span>
          </div>
          <div className="r-live-preview" key={reset}>
            <Preview {...p} />
          </div>
        </div>
      </div>
      <div className="r-preview-meta">
        <span>
          {impl.interactive ? "可操作的 Web 参考" : "静态基础构件预览"}
        </span>
        <span>状态控制仅显示实现支持的属性</span>
      </div>
      <details className="r-code-disclosure">
        <summary>查看 / 复制当前配置代码</summary>
        <CodeBlock code={code} />
      </details>
      <Button
        size="sm"
        variant="tertiary"
        onClick={() => showState(!stateView)}
        aria-expanded={stateView}
      >
        查看变体与状态矩阵 {stateView ? "−" : "＋"}
      </Button>
      {stateView && (
        <div
          className="r-state-matrix"
          data-theme={theme === "site" ? undefined : theme}
        >
          {(has("variant")
            ? ["primary", "secondary", "tertiary", "ghost", "danger"]
            : ["default"]
          ).map((v) => (
            <div key={v}>
              <span>{v}</span>
              <Preview
                variant={v === "default" ? "primary" : (v as Variant)}
                label={label || undefined}
              />
            </div>
          ))}
          {has("disabled") && (
            <div>
              <span>Disabled</span>
              <Preview disabled label={label || undefined} />
            </div>
          )}
          {has("loading") && (
            <div>
              <span>Loading</span>
              <Preview loading label={label || undefined} />
            </div>
          )}
          {has("error") && (
            <div>
              <span>Error</span>
              <Preview error label={label || undefined} />
            </div>
          )}
          {has("size") &&
            (["sm", "md", "lg"] as const).map((v) => (
              <div key={v}>
                <span>Size {v}</span>
                <Preview size={v} label={label || undefined} />
              </div>
            ))}
          {spec.id === "button" && (
            <>
              <div>
                <span>Leading icon</span>
                <Button>
                  <Plus size={16} aria-hidden="true" />
                  新建笔记
                </Button>
              </div>
              <div>
                <span>Trailing icon</span>
                <Button variant="secondary">
                  继续
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}
