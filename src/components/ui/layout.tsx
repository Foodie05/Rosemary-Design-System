import { Slider } from "./Slider";
import { useState } from "react";
import { Button, PreviewProps, Status } from "./core";
export function CardExample(p: PreviewProps) {
  const [saved, set] = useState(false);
  return (
    <article className="r-card-example">
      <Status>进行中</Status>
      <h3>{p.label || "品牌规范"}</h3>
      <p>每一个细节，都服务于真实内容。</p>
      <Button
        {...p}
        variant="secondary"
        onClick={() => set(!saved)}
        aria-pressed={saved}
      >
        {saved ? "已收藏" : "收藏项目"}
      </Button>
    </article>
  );
}
export function AccordionExample(p: PreviewProps) {
  return (
    <div className="r-accordion">
      {["如何开始？", "如何选择组件？", "如何提交反馈？"].map((v, i) => (
        <details key={v} name="reference-accordion" open={i === 0}>
          <summary>{v}</summary>
          <p>
            {
              [
                "先确认用户目标，再选择交互模式。",
                "先检查平台原生控件，再决定是否需要自定义。",
                "带上操作路径、预期结果与实际行为。",
              ][i]
            }
          </p>
        </details>
      ))}
    </div>
  );
}
export function DividerExample() {
  return (
    <div className="r-stack">
      <p>设计意图</p>
      <hr />
      <p>实现约束</p>
    </div>
  );
}
export function EmptyStateExample(p: PreviewProps) {
  const [created, set] = useState(false);
  return (
    <div className="r-empty">
      {created ? (
        <>
          <Status>已创建第一篇笔记</Status>
          <Button variant="ghost" onClick={() => set(false)}>
            恢复空状态
          </Button>
        </>
      ) : (
        <>
          <span className="r-empty-mark" aria-hidden="true">
            ＋
          </span>
          <h3>{p.label || "把第一个想法留下来"}</h3>
          <p>这里将收纳你的笔记与灵感。</p>
          <Button {...p} onClick={() => set(true)}>
            新建笔记
          </Button>
        </>
      )}
    </div>
  );
}
export function ScrollExample() {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="最近活动，可滚动"
      className="r-scroll-area"
    >
      <ol>
        {Array.from({ length: 12 }, (_, i) => (
          <li key={i}>活动 {i + 1} · 更新设计文件</li>
        ))}
      </ol>
    </div>
  );
}
export function ResizableExample(p: PreviewProps) {
  const [width, set] = useState(35);
  return (
    <div className="r-resize-example">
      <label>
        侧栏宽度 <output>{width}%</output>
        <Slider
          aria-label="侧栏宽度"
          min={20}
          max={60}
          value={width}
          disabled={p.disabled}
          onChange={(e) => set(+e.target.value)}
        />
      </label>
      <div className="r-resizable">
        <div style={{ flexBasis: `${width}%` }}>文件目录</div>
        <button
          role="separator"
          aria-label="调整侧栏宽度"
          aria-orientation="vertical"
          aria-valuemin={20}
          aria-valuemax={60}
          aria-valuenow={width}
          disabled={p.disabled}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              set(
                Math.min(
                  60,
                  Math.max(20, width + (e.key === "ArrowRight" ? 2 : -2)),
                ),
              );
            }
          }}
          onPointerDown={(e) => {
            if (p.disabled) return;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) {
              const rect =
                e.currentTarget.parentElement!.getBoundingClientRect();
              set(
                Math.min(
                  60,
                  Math.max(
                    20,
                    Math.round(((e.clientX - rect.left) / rect.width) * 100),
                  ),
                ),
              );
            }
          }}
        >
          ⋮
        </button>
        <div>内容编辑区</div>
      </div>
    </div>
  );
}
