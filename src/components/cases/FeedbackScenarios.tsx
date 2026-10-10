import { useEffect, useState } from "react";
import { Button, DemoMessage, Status } from "../ui/core";
import { ScenarioProps } from "./types";
export function ActionableError({ good }: ScenarioProps) {
  const [ok, set] = useState(false);
  return (
    <div className="r-stack">
      {ok ? (
        <Status>已重新连接</Status>
      ) : (
        <>
          <Status tone="danger">
            {good ? "同步暂不可用" : "E_SOCKET_CONN_RESET"}
          </Status>
          <p>
            {good ? "本地草稿仍然安全。检查连接后可以重试。" : "任务失败 (500)"}
          </p>
          {good && (
            <Button variant="secondary" onClick={() => set(true)}>
              重试连接
            </Button>
          )}
        </>
      )}
    </div>
  );
}
export function LoadingLayout({ good }: ScenarioProps) {
  const [loaded, set] = useState(false);
  return (
    <div className="r-stack">
      <Button size="sm" variant="secondary" onClick={() => set(!loaded)}>
        {loaded ? "模拟加载" : "完成加载"}
      </Button>
      <div className="r-loading-stage">
        {loaded ? (
          <>
            <div className="r-file-row">
              品牌规范 <span>12 KB</span>
            </div>
            <div className="r-file-row">
              交互笔记 <span>8 KB</span>
            </div>
          </>
        ) : good ? (
          <div className="r-skeleton">
            <span />
            <span />
          </div>
        ) : (
          <p>◌ 加载中</p>
        )}
        <p className="r-content-anchor">最近更新 · 本段位置应保持稳定</p>
      </div>
    </div>
  );
}
export function ToastOrder({ good }: ScenarioProps) {
  const [items, set] = useState<number[]>([1]);
  return (
    <div className="r-stack">
      <Button
        onClick={() =>
          set((v) =>
            good
              ? [...v, (v.at(-1) || 0) + 1].slice(-3)
              : [...v, (v.at(-1) || 0) + 1],
          )
        }
      >
        保存一次
      </Button>
      <div
        className={good ? "r-notice-stack" : "r-notice-overlap"}
        role={good ? "status" : undefined}
      >
        {items.map((n, i) => (
          <div
            className="r-toast"
            key={n}
            style={
              good
                ? undefined
                : { position: "absolute", top: i * 9, left: i * 8 }
            }
          >
            <span>✓ 第 {n} 次更改已保存</span>
            {good && (
              <button
                aria-label={`关闭通知${n}`}
                onClick={() => set(items.filter((v) => v !== n))}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
export function DismissBanner({ good }: ScenarioProps) {
  const [open, set] = useState(true);
  return (
    <div className="r-mini-app">
      {open && (
        <div className="r-banner">
          <strong>新版本可用</strong>
          <p>下次启动时可更新。</p>
          {good && (
            <Button size="sm" variant="ghost" onClick={() => set(false)}>
              稍后提醒
            </Button>
          )}
        </div>
      )}
      <h4>今天的笔记</h4>
      <p>保持专注，先完成手上的工作。</p>
    </div>
  );
}
export function DeterminateProgress({ good }: ScenarioProps) {
  const [v, set] = useState(35);
  return (
    <div className="r-stack">
      <h4>导出项目</h4>
      <progress value={good ? v : 99} max={100} aria-label="导出进度" />
      <p>
        {good
          ? `${v}/100 个文件${v === 100 ? " · 完成" : ""}`
          : "99% · 即将完成"}
      </p>
      <Button variant="secondary" onClick={() => set(Math.min(100, v + 15))}>
        模拟完成 15 个文件
      </Button>
      {good && (
        <Button variant="ghost" onClick={() => set(0)}>
          取消任务
        </Button>
      )}
    </div>
  );
}
export function CopyFeedback({ good }: ScenarioProps) {
  const [copied, set] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="r-stack">
      <code>--r-semantic-color-accent</code>
      <Button
        variant="secondary"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText("--r-semantic-color-accent");
            set(true);
          } catch {
            setError("复制失败，请手动选择文字。");
          }
        }}
      >
        {good && copied ? "✓ 已复制" : "复制"}
      </Button>
      {good && (
        <DemoMessage>
          {error || (copied ? "令牌名称已复制到剪贴板" : "")}
        </DemoMessage>
      )}
    </div>
  );
}
export function AccordionBehavior({ good }: ScenarioProps) {
  const [open, set] = useState(0);
  return (
    <div className="r-accordion">
      {["保存规则", "冲突处理", "离线编辑"].map((v, i) => (
        <div key={v}>
          <button
            className="r-accordion-heading"
            aria-expanded={good ? open === i : true}
            onClick={() => set(open === i ? -1 : i)}
          >
            {v} <span>⌄</span>
          </button>
          {(good ? open === i : true) && (
            <p>
              {
                [
                  "停止输入后开始保存，并展示结果。",
                  "保留两个版本，由用户选择。",
                  "先写本地草稿，恢复网络后同步。",
                ][i]
              }
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
