import { useState } from "react";
import { Button } from "../ui/core";
import { ScenarioProps } from "./types";
export function MotionRestraint({ good }: ScenarioProps) {
  const [expanded, set] = useState(false);
  const [reduce, setReduce] = useState(false);
  return (
    <div className="r-stack">
      <label className="r-choice">
        <input
          type="checkbox"
          checked={reduce}
          onChange={(e) => setReduce(e.target.checked)}
        />
        模拟减少动态效果
      </label>
      <Button variant="secondary" onClick={() => set(!expanded)}>
        切换详情
      </Button>
      <div
        className={`r-motion-block ${expanded ? "is-expanded" : ""}`}
        style={{
          transitionDuration:
            reduce && good
              ? "0ms"
              : good
                ? "var(--r-semantic-motion-settle)"
                : "900ms",
        }}
      >
        <strong>项目详情</strong>
        <p>布局变化保持可预测。</p>
      </div>
    </div>
  );
}
export function Compositor({ good }: ScenarioProps) {
  const [active, set] = useState(false);
  return (
    <div className="r-stack">
      <Button variant="secondary" onClick={() => set(!active)}>
        移动预览
      </Button>
      <div className="r-animation-track">
        <div
          className="r-animation-marker"
          style={
            good
              ? {
                  transform: `translateX(${active ? 90 : 0}px)`,
                  transition: "transform var(--r-semantic-motion-fast)",
                }
              : { marginLeft: active ? 90 : 0, transition: "margin-left 800ms" }
          }
        >
          R
        </div>
        <span className="r-track-caption">工作区</span>
      </div>
      <code>{good ? "transform: translateX(90px)" : "margin-left: 90px"}</code>
    </div>
  );
}
export function SharedTransition({ good }: ScenarioProps) {
  const [open, set] = useState(false);
  return (
    <div className="r-stack">
      <Button variant="secondary" onClick={() => set(!open)}>
        {open ? "收起" : "打开"}文件
      </Button>
      <div
        className={`r-shared-file ${open ? "is-open" : ""} ${good ? "r-shared-smooth" : ""}`}
      >
        <div className="r-product-glyph">R</div>
        <h4>品牌规范</h4>
        {open && <p>12 个文件 · 最近更新于今天。原有标识保持可追踪。</p>}
      </div>
    </div>
  );
}
export function PressFeedback({ good }: ScenarioProps) {
  const [n, set] = useState(0);
  return (
    <div className="r-stack">
      <button
        className={`r-button r-primary ${good ? "" : "r-no-press"}`}
        onClick={() => set(n + 1)}
      >
        保存笔记
      </button>
      <p>{n ? `已保存 ${n} 次` : "按住按钮观察反馈"}</p>
    </div>
  );
}
export function CalmSkeleton({ good }: ScenarioProps) {
  return (
    <div
      className={`r-skeleton ${good ? "" : "r-skeleton-busy"}`}
      aria-label="加载占位，比较动效强度"
    >
      <span />
      <span />
      <span />
      <small>
        {good
          ? "稳定占位 · 完成后立即显示内容"
          : "反例：更大的位移造成注意力干扰"}
      </small>
    </div>
  );
}
