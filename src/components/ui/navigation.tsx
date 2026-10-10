import { usePanelMotion, SelectionContent } from "../common/SelectionMotion";
import { useSelectionIndicator } from "../../hooks/useSelectionIndicator";
import { Select } from "./Select";
import { useId, useState, useRef } from "react";
import { Button, DemoMessage, PreviewProps, Modal } from "./core";
export function Tabs({
  labels = ["概览", "活动", "设置"],
  disabled = false,
}: {
  labels?: string[];
  disabled?: boolean;
}) {
  const [selected, set] = useState(0);
  const id = useId();
  const tablist = useRef<HTMLDivElement>(null);
  const indicator = useSelectionIndicator(tablist, selected);
  const panel = useRef<HTMLDivElement>(null);
  usePanelMotion(panel, selected, selected);
  return (
    <div className="r-tabs">
      <div ref={tablist} role="tablist" aria-label="项目视图">
        {labels.map((v, i) => (
          <button
            key={v}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={i === selected}
            aria-controls={`${id}-panel`}
            tabIndex={i === selected ? 0 : -1}
            disabled={disabled}
            onClick={() => set(i)}
            onKeyDown={(e) => {
              let next = i;
              if (e.key === "ArrowRight") next = (i + 1) % labels.length;
              else if (e.key === "ArrowLeft")
                next = (i + labels.length - 1) % labels.length;
              else if (e.key === "Home") next = 0;
              else if (e.key === "End") next = labels.length - 1;
              else return;
              e.preventDefault();
              set(next);
              (
                e.currentTarget.parentElement?.children[next] as HTMLElement
              )?.focus();
            }}
          >
            {v}
          </button>
        ))}
        <span
          className="r-tab-indicator"
          style={indicator}
          aria-hidden="true"
        />
      </div>
      <div
        ref={panel}
        className="r-panel-content"
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
        tabIndex={0}
      >
        {selected === 0
          ? "项目概要 · 设计系统 2.0"
          : selected === 1
            ? "今天更新了 3 个文件"
            : "设置 · 允许团队评论"}
      </div>
    </div>
  );
}
export function TabsExample(p: PreviewProps) {
  return <Tabs disabled={p.disabled} />;
}
export function SegmentedExample(p: PreviewProps) {
  const [value, set] = useState("列表");
  return (
    <div>
      <div
        className="r-segmented"
        role="group"
        aria-label={p.label || "显示方式"}
      >
        {["列表", "网格", "时间线"].map((v) => (
          <Button
            size={p.size}
            key={v}
            disabled={p.disabled}
            variant={v === value ? "primary" : "ghost"}
            aria-pressed={v === value}
            onClick={() => set(v)}
          >
            {v}
          </Button>
        ))}
      </div>
      <SelectionContent
        value={value}
        index={["列表", "网格", "时间线"].indexOf(value)}
      >
        <DemoMessage>当前显示：{value}</DemoMessage>
      </SelectionContent>
    </div>
  );
}
export function BreadcrumbExample(p: PreviewProps) {
  return (
    <nav aria-label="面包屑" className="r-breadcrumb">
      <ol>
        <li>
          <a
            href="#/overview"
            aria-disabled={p.disabled || undefined}
            tabIndex={p.disabled ? -1 : undefined}
            onClick={(e) => {
              if (p.disabled) e.preventDefault();
            }}
          >
            Rosemary Design
          </a>
        </li>
        <li>
          <span aria-hidden="true">›</span>
          <a
            href="#/components"
            aria-disabled={p.disabled || undefined}
            tabIndex={p.disabled ? -1 : undefined}
            onClick={(e) => {
              if (p.disabled) e.preventDefault();
            }}
          >
            组件库
          </a>
        </li>
        <li>
          <span aria-hidden="true">›</span>
          <span aria-current="page">Breadcrumb</span>
        </li>
      </ol>
    </nav>
  );
}
export function NavExample({
  kind = "sidebar",
  ...p
}: PreviewProps & { kind?: string }) {
  const [value, set] = useState("工作区");
  return (
    <div className={`r-nav-example r-nav-${kind}`}>
      <nav aria-label="软件导航">
        {["工作区", "收藏", "设置"].map((v) => (
          <Button
            key={v}
            disabled={p.disabled}
            size={p.size}
            aria-current={v === value ? "page" : undefined}
            variant={v === value ? "primary" : "ghost"}
            onClick={() => set(v)}
          >
            {v}
          </Button>
        ))}
      </nav>
      <SelectionContent
        value={value}
        index={["工作区", "收藏", "设置"].indexOf(value)}
      >
        <p>{value} · 内容视图</p>
      </SelectionContent>
    </div>
  );
}
export function PaginationExample(p: PreviewProps) {
  const [value, set] = useState(1);
  const [size, resize] = useState(10);
  return (
    <div className="r-stack">
      <nav aria-label="结果分页" className="r-control-row">
        <Button
          variant="secondary"
          disabled={p.disabled || value === 1}
          onClick={() => set(value - 1)}
        >
          上一页
        </Button>
        <label>
          页码
          <input
            aria-label="页码"
            type="number"
            min={1}
            max={10}
            value={value}
            disabled={p.disabled}
            onChange={(e) => set(Math.max(1, Math.min(10, +e.target.value)))}
          />
        </label>
        <Button
          variant="secondary"
          disabled={p.disabled || value === 10}
          onClick={() => set(value + 1)}
        >
          下一页
        </Button>
      </nav>
      <label>
        每页条数{" "}
        <Select
          disabled={p.disabled}
          value={size}
          onValueChange={(value) => {
            resize(+value);
            set(1);
          }}
          label={"每页条数" + " "}
          options={[
            ...[10, 20, 50].map((n) => ({
              value: String(n),
              label: String(n),
            })),
          ]}
        />
      </label>
      <DemoMessage>
        第 {value}/10 页 · 每页 {size} 条
      </DemoMessage>
    </div>
  );
}
export function StepperExample(p: PreviewProps) {
  const [step, set] = useState(0);
  return (
    <div className="r-stack">
      <ol className="r-stepper">
        {["资料", "偏好", "完成"].map((v, i) => (
          <li key={v}>
            <Button
              variant={i === step ? "primary" : "secondary"}
              disabled={p.disabled || i > step}
              onClick={() => set(i)}
              aria-current={step === i ? "step" : undefined}
            >
              {i + 1}. {v}
            </Button>
          </li>
        ))}
      </ol>
      <p>步骤 {step + 1} / 3</p>
      <Button disabled={p.disabled || step === 2} onClick={() => set(step + 1)}>
        继续
      </Button>
    </div>
  );
}
export function CommandPaletteExample(p: PreviewProps) {
  const [open, set] = useState(false);
  const [query, search] = useState("");
  const [message, setMessage] = useState("等待命令");
  return (
    <div>
      <Button {...p} onClick={() => set(true)}>
        {p.label || "打开命令面板"}
      </Button>
      <Modal open={open} onClose={() => set(false)} title="运行命令">
        <label className="r-field">
          搜索命令
          <input
            autoFocus
            value={query}
            onChange={(e) => search(e.target.value)}
          />
        </label>
        <div className="r-stack">
          {["新建笔记", "打开设置", "切换工作区"]
            .filter((v) => v.includes(query))
            .map((v) => (
              <Button
                key={v}
                variant="ghost"
                onClick={() => {
                  setMessage(`已执行：${v}`);
                  set(false);
                }}
              >
                {v}
              </Button>
            ))}
        </div>
      </Modal>
      <DemoMessage>{message}</DemoMessage>
    </div>
  );
}
