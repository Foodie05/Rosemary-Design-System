import { Presence } from "./Presence";
import { useEffect, useRef, useState } from "react";
import { Button, DemoMessage, Modal, PreviewProps, Status } from "./core";
export function DialogExample({
  kind = "dialog",
  ...p
}: PreviewProps & { kind?: string }) {
  const [open, set] = useState(false);
  const [result, save] = useState("");
  const [name, setName] = useState("设计规范");
  const [draft, setDraft] = useState(name);
  const [removed, setRemoved] = useState(false);
  const close = () => {
    set(false);
    setDraft(name);
  };
  return (
    <div>
      <Button {...p} onClick={() => set(true)}>
        {p.label || "打开对话框"}
      </Button>
      <Modal
        open={open}
        onClose={close}
        title={kind === "alert-dialog" ? "移除项目？" : "项目设置"}
        alert={kind === "alert-dialog"}
        kind={kind}
      >
        <p>
          {kind === "alert-dialog"
            ? "项目会移至本示例的回收站。关闭弹窗后可以撤销。"
            : "修改项目名称，确认后保存。取消会保留原有名称。"}
        </p>
        {kind !== "alert-dialog" && (
          <label className="r-field">
            项目名称
            <input value={draft} onChange={(e) => setDraft(e.target.value)} />
          </label>
        )}
        <div className="r-control-row">
          <Button variant="secondary" onClick={close}>
            取消
          </Button>
          <Button
            variant={kind === "alert-dialog" ? "danger" : "primary"}
            onClick={() => {
              if (kind === "alert-dialog") setRemoved(true);
              else setName(draft);
              save(
                kind === "alert-dialog"
                  ? "已移至回收站"
                  : `设置已保存 · ${draft}`,
              );
              set(false);
            }}
          >
            确认
          </Button>
        </div>
      </Modal>
      <DemoMessage>{result}</DemoMessage>
      {removed && (
        <Button
          variant="secondary"
          onClick={() => {
            setRemoved(false);
            save("项目已恢复");
          }}
        >
          撤销移除
        </Button>
      )}
    </div>
  );
}
export function ToastExample({
  kind = "toast",
  ...p
}: PreviewProps & { kind?: string }) {
  const [items, set] = useState<
    { id: number; revision: number; visible: boolean }[]
  >([]);
  const [revision, setRevision] = useState(0);
  const nextId = useRef(0);
  const [message, setMessage] = useState("");
  return (
    <div>
      {kind === "snackbar" && <p>文档版本 v{revision} · 本地模拟</p>}
      <Button
        {...p}
        onClick={() => {
          const next = revision + 1;
          setRevision(next);
          set((v) =>
            [
              ...v,
              { id: ++nextId.current, revision: next, visible: true },
            ].slice(-3),
          );
          setMessage("");
        }}
      >
        {p.label || "保存并通知"}
      </Button>
      <div className="r-toast-stack" role="status">
        {items.map((item) => (
          <Presence open={item.visible} key={item.id}>
            <div className="r-toast">
              <span>✓ 更改已保存{kind === "snackbar" ? " · 可撤销" : ""}</span>
              <Button
                size="sm"
                variant="ghost"
                disabled={kind === "snackbar" && item.revision !== revision}
                onClick={() => {
                  if (kind === "snackbar") {
                    setRevision(item.revision - 1);
                    setMessage(`已撤销至版本 v${item.revision - 1}`);
                  }
                  set((v) =>
                    v.map((n) =>
                      n.id === item.id ? { ...n, visible: false } : n,
                    ),
                  );
                }}
              >
                {kind === "snackbar" ? "撤销" : "关闭"}
              </Button>
            </div>
          </Presence>
        ))}
      </div>
      <small>最多显示三条；示例由用户关闭，不设阅读时限。</small>
      {kind === "snackbar" && <DemoMessage>{message}</DemoMessage>}
    </div>
  );
}
export function BannerExample(p: PreviewProps) {
  const [open, set] = useState(true);
  return (
    <div>
      <Presence open={open} collapse>
        <div className="r-banner">
          <Status tone="info">新版本可用</Status>
          <p>你的工作已保存，可稍后更新。</p>
          <Button
            disabled={p.disabled}
            variant="ghost"
            onClick={() => set(false)}
          >
            稍后提醒
          </Button>
        </div>
      </Presence>
      {!open && (
        <Button variant="secondary" onClick={() => set(true)}>
          重新显示公告
        </Button>
      )}
    </div>
  );
}
export function ProgressExample(p: PreviewProps) {
  const [value, set] = useState(0);
  const [running, start] = useState(false);
  useEffect(() => {
    if (!running || value >= 100) {
      if (value >= 100) start(false);
      return;
    }
    const timer = setTimeout(() => set(value + 10), 200);
    return () => clearTimeout(timer);
  }, [running, value]);
  return (
    <div className="r-stack r-progress-example" data-running={running}>
      <div className="r-progress-heading">
        <span>导出进度</span>
        <output aria-label="完成百分比" aria-live="off">
          {value}%
        </output>
      </div>
      <progress max={100} value={value} aria-label="导出进度" />
      <div className="r-control-row">
        <Button
          {...p}
          onClick={() => {
            if (value === 100) set(0);
            start(!running);
          }}
        >
          {running
            ? "暂停"
            : value > 0 && value < 100
              ? "继续导出"
              : "开始导出"}
        </Button>
        <Button
          variant="secondary"
          disabled={p.disabled}
          onClick={() => {
            start(false);
            set(0);
          }}
        >
          取消并重置
        </Button>
      </div>
      <DemoMessage>
        {value === 100
          ? "导出完成"
          : running
            ? "正在导出"
            : value > 0
              ? "已暂停，可继续导出"
              : "等待开始"}
      </DemoMessage>
    </div>
  );
}
export function SkeletonExample() {
  return (
    <div className="r-skeleton" aria-busy="true" aria-label="正在加载文件">
      <span />
      <span />
      <span />
      <span className="sr-only">正在加载</span>
    </div>
  );
}
export function SpinnerExample(p: PreviewProps) {
  return (
    <div className="r-control-row" role="status">
      <span className="r-spinner" aria-hidden="true" />
      <span>{p.label || "正在处理，请稍候"}</span>
    </div>
  );
}
