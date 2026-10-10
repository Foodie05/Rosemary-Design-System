import { useState } from "react";
import { Button, DemoMessage, Modal, Status } from "../ui/core";
import { ScenarioProps } from "./types";
export function KeyboardFocus({ good }: ScenarioProps) {
  const [result, set] = useState("");
  return (
    <div className={`r-stack ${good ? "" : "r-negative-focus"}`}>
      <p>使用 Tab 移动焦点，再按 Enter 保存。</p>
      <label>
        项目名称
        <input defaultValue="品牌规范" />
      </label>
      <div className="r-control-row">
        <Button onClick={() => set("更改已保存")}>保存</Button>
        <Button variant="secondary" onClick={() => set("已取消")}>
          取消
        </Button>
      </div>
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function TouchTargets({ good }: ScenarioProps) {
  const [n, set] = useState(0);
  return (
    <div className="r-stack">
      <div className="r-touch-row">
        {["＋", "☆", "⋯"].map((v, i) => (
          <button
            key={v}
            aria-label={["新建", "收藏", "更多"][i]}
            style={{ width: good ? 44 : 22, height: good ? 44 : 22 }}
            onClick={() => set(n + 1)}
          >
            {v}
          </button>
        ))}
      </div>
      <DemoMessage>
        已操作 {n} 次 · {good ? "44px" : "22px"} 热区
      </DemoMessage>
    </div>
  );
}
export function RedundantStatus({ good }: ScenarioProps) {
  return (
    <div className="r-stack">
      <div className="r-file-row">
        <span>品牌规范</span>
        {good ? <Status>已同步</Status> : <i className="r-dot" />}
      </div>
      <div className="r-file-row">
        <span>交互笔记</span>
        {good ? (
          <Status tone="danger">失败，需重试</Status>
        ) : (
          <i className="r-dot r-dot-danger" />
        )}
      </div>
    </div>
  );
}
export function ThemeContrast({ good }: ScenarioProps) {
  const [dark, set] = useState(true);
  return (
    <div className="r-stack">
      <Button variant="secondary" size="sm" onClick={() => set(!dark)}>
        预览{dark ? "浅" : "深"}色
      </Button>
      <div
        data-theme={dark ? "dark" : "light"}
        className={`r-theme-card ${good ? "" : "r-mechanical-invert"}`}
      >
        <h4>今天的工作</h4>
        <p>内容层级、边界与状态均独立调校。</p>
        <Status>已同步</Status>
      </div>
    </div>
  );
}
export function LiveAnnouncements({ good }: ScenarioProps) {
  const [n, set] = useState(2);
  return (
    <div className="r-stack">
      <Button onClick={() => set(n + 1)}>新增一项同步记录</Button>
      <div className="r-file-row">已同步 {n} 个文件</div>
      {good && (
        <>
          <DemoMessage>同步记录更新，共 {n} 个文件。</DemoMessage>
          <small className="r-tag">aria-live: polite · 不移动焦点</small>
        </>
      )}
    </div>
  );
}
export function DialogFocus({ good }: ScenarioProps) {
  const [open, set] = useState(false);
  return (
    <div className="r-stack">
      <Button onClick={() => set(true)}>打开设置</Button>
      {good ? (
        <Modal open={open} onClose={() => set(false)} title="同步设置">
          <label className="r-field">
            同步名称
            <input autoFocus defaultValue="设计工作区" />
          </label>
          <Button onClick={() => set(false)}>保存并关闭</Button>
        </Modal>
      ) : (
        open && (
          <div className="r-inline-dialog">
            <h4>同步设置</h4>
            <input aria-label="反例同步名称" defaultValue="设计工作区" />
            <Button onClick={() => set(false)}>保存</Button>
          </div>
        )
      )}
      <small>
        {good
          ? "Tab 留在弹窗内；Escape 关闭，焦点回到入口。"
          : "反例是普通浮层：Tab 会继续进入背景内容。"}
      </small>
    </div>
  );
}
export function IconLabels({ good }: ScenarioProps) {
  const [n, set] = useState(0);
  return (
    <div className="r-stack">
      <div className="r-control-row">
        <Button
          variant="secondary"
          aria-label={good ? "搜索笔记" : "反例：未表达功能的图形按钮"}
          onClick={() => set(n + 1)}
        >
          ⌕
        </Button>
        <Button
          variant="secondary"
          aria-label={good ? "添加笔记" : "反例：图形加号"}
          onClick={() => set(n + 1)}
        >
          ＋
        </Button>
      </div>
      <div className="r-reader-output">
        读屏预期：{good ? "“搜索笔记，按钮”" : "“图形按钮”"}
      </div>
      <DemoMessage>已操作 {n} 次</DemoMessage>
    </div>
  );
}
