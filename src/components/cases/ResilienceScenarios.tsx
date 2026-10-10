import { Select } from "../ui/Select";
import { useEffect, useState } from "react";
import { Button, DemoMessage, Modal, Status } from "../ui/core";
import { ScenarioProps } from "./types";
export function UndoDelete({ good, preview }: ScenarioProps) {
  const [deleted, set] = useState(!!preview);
  const [confirm, show] = useState(false);
  return (
    <div className="r-stack">
      {deleted ? (
        <div className="r-empty">
          <h4>文件已移除</h4>
          {good && (
            <Button variant="secondary" onClick={() => set(false)}>
              撤销移除
            </Button>
          )}
        </div>
      ) : (
        <div className="r-file-row">
          <span>品牌规范.pdf</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => (good ? set(true) : show(true))}
          >
            移除
          </Button>
        </div>
      )}
      <Modal open={confirm} onClose={() => show(false)} title="确认移除文件？">
        <p>每次轻量操作都要求确认。</p>
        <Button variant="secondary" onClick={() => show(false)}>
          取消
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            set(true);
            show(false);
          }}
        >
          确认移除
        </Button>
      </Modal>
      <small>
        {good
          ? "保留撤销入口；回收站可长期恢复。"
          : "模拟数据可用外层重置恢复。"}
      </small>
    </div>
  );
}
export function Autosave({ good, preview }: ScenarioProps) {
  const [text, set] = useState("让设计自然发生。");
  const [state, status] = useState(preview ? "Offline" : "Saved");
  const [network, setNetwork] = useState(preview ? "Offline" : "Online");
  useEffect(() => {
    if (state !== "Saving") return;
    const t = setTimeout(
      () =>
        status(
          network === "Offline"
            ? "Offline"
            : network === "Failed"
              ? "Failed"
              : "Saved",
        ),
      650,
    );
    return () => clearTimeout(t);
  }, [state, text, network]);
  return (
    <div className="r-stack">
      <label>
        编辑笔记
        <textarea
          rows={3}
          value={text}
          onChange={(e) => {
            set(e.target.value);
            status(good ? "Saving" : "Unsaved");
          }}
        />
      </label>
      <label>
        模拟连接
        <Select
          value={network}
          onValueChange={(value) => {
            setNetwork(value);
            if (good) status(value === "Online" ? "Saving" : value);
          }}
          label={"模拟连接"}
          options={[
            { value: "Online", label: "Online" },
            { value: "Offline", label: "Offline" },
            { value: "Failed", label: "Failed" },
          ]}
        />
      </label>
      {good ? (
        <>
          <Status
            tone={
              state === "Failed"
                ? "danger"
                : state === "Offline"
                  ? "warning"
                  : state === "Saved"
                    ? "success"
                    : "info"
            }
          >
            {
              (
                {
                  Saved: "已保存",
                  Saving: "正在保存",
                  Offline: "离线 · 草稿保留在内存",
                  Failed: "保存失败 · 请重试",
                } as Record<string, string>
              )[state]
            }
          </Status>
          {state === "Failed" && (
            <Button
              variant="secondary"
              onClick={() => {
                setNetwork("Online");
                status("Saving");
              }}
            >
              重试
            </Button>
          )}
        </>
      ) : (
        <Button
          onClick={() => status(network === "Online" ? "Saved" : "Failed")}
        >
          保存
        </Button>
      )}
      <small>
        {good
          ? "本地状态机模拟；此示例不写服务器或持久存储。"
          : "没有保存状态，无法判断修改是否安全。"}
      </small>
    </div>
  );
}
export function OverlayChoice({ good }: ScenarioProps) {
  const [open, set] = useState(false);
  const [checked, check] = useState(false);
  const controls = (
    <>
      <label className="r-choice">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => check(e.target.checked)}
        />
        仅显示收藏
      </label>
      <Button variant="secondary" onClick={() => set(false)}>
        应用
      </Button>
    </>
  );
  return (
    <div className="r-stack">
      <div className="r-file-row">
        设计文档{" "}
        <Button size="sm" variant="secondary" onClick={() => set(true)}>
          筛选
        </Button>
      </div>
      {good ? (
        open && <div className="r-popover-static">{controls}</div>
      ) : (
        <Modal open={open} onClose={() => set(false)} title="筛选全部文件">
          {controls}
        </Modal>
      )}
      <p>参考数据：品牌规范、交互笔记</p>
      <DemoMessage>{checked ? "已筛选收藏" : "全部文件"}</DemoMessage>
    </div>
  );
}
export function LongTask({ good, preview }: ScenarioProps) {
  const [progress, set] = useState(preview ? 35 : 0);
  const [running, start] = useState(false);
  const [note, edit] = useState("");
  useEffect(() => {
    if (!running || progress === 100) {
      if (progress === 100) start(false);
      return;
    }
    const t = setTimeout(() => set(Math.min(100, progress + 10)), 300);
    return () => clearTimeout(t);
  }, [running, progress]);
  return (
    <div className="r-stack">
      <Button
        onClick={() => {
          set(0);
          start(true);
        }}
        disabled={running}
      >
        开始导出
      </Button>
      {running || progress > 0 ? (
        <>
          <progress
            value={good ? progress : undefined}
            max={100}
            aria-label="导出进度"
          />
          {good && (
            <>
              <p>已导出 {progress}/100 个文件</p>
              <Button variant="ghost" onClick={() => start(false)}>
                取消任务
              </Button>
            </>
          )}
        </>
      ) : null}
      <label>
        继续编辑备注
        <textarea
          value={note}
          onChange={(e) => edit(e.target.value)}
          disabled={!good && running}
        />
      </label>
      <DemoMessage>
        {progress === 100
          ? "导出完成"
          : running
            ? good
              ? "任务在后台运行，可继续编辑"
              : "请等待任务完成"
            : ""}
      </DemoMessage>
    </div>
  );
}
export function OfflineQueue({ good, preview }: ScenarioProps) {
  const [online, connect] = useState(!preview);
  const [text, set] = useState(preview && !good ? "" : "工作草稿");
  const [queue, setQueue] = useState(0);
  const [message, notify] = useState(
    preview ? (good ? "离线 · 修改保留" : "网络错误") : "已同步",
  );
  return (
    <div className="r-stack">
      <label className="r-choice">
        <input
          type="checkbox"
          checked={online}
          onChange={(e) => {
            connect(e.target.checked);
            if (e.target.checked) {
              notify(good ? `已同步 ${queue} 项修改` : "已连接");
              setQueue(0);
            } else {
              notify(good ? "离线 · 可继续编辑" : "网络错误");
              if (!good) set("");
            }
          }}
        />
        网络在线
      </label>
      <label>
        笔记
        <textarea
          value={text}
          disabled={!online && !good}
          onChange={(e) => {
            set(e.target.value);
            if (!online && good) {
              setQueue(queue + 1);
              notify(`离线 · ${queue + 1} 项修改等待同步`);
            } else notify("已同步");
          }}
        />
      </label>
      <Status tone={online ? "success" : "warning"}>{message}</Status>
      <small>内存队列用于教学；持久化、冲突合并需要产品实现。</small>
    </div>
  );
}
