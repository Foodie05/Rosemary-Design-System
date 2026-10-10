import { Select } from "../ui/Select";
import { useState } from "react";
import { Button, DemoMessage, Modal } from "../ui/core";
import { ScenarioProps } from "./types";
export function PermissionTiming({ good }: ScenarioProps) {
  const [requested, set] = useState(!good);
  return (
    <div className="r-stack">
      <h4>导出工作区</h4>
      <p>选择目录，保存设计文件。</p>
      <Button onClick={() => set(true)}>选择导出目录</Button>
      {requested && (
        <div className="r-permission">
          <strong>允许访问文件夹？</strong>
          <p>
            {good
              ? "为了将导出文件保存到你选择的位置。"
              : "应用需要相机、定位和存储权限。"}
          </p>
          <Button variant="secondary" size="sm" onClick={() => set(false)}>
            稍后
          </Button>
          <small>仅模拟界面，不请求系统权限。</small>
        </div>
      )}
    </div>
  );
}
export function NativeConventions({ good }: ScenarioProps) {
  const [p, set] = useState("iOS");
  return (
    <div className="r-stack">
      <label>
        目标平台
        <Select
          value={p}
          onValueChange={(value) => set(value)}
          label={"目标平台"}
          options={[
            { value: "iOS", label: "iOS" },
            { value: "Android", label: "Android" },
            { value: "Web", label: "Web" },
            { value: "Windows", label: "Windows" },
          ]}
        />
      </label>
      <div className="r-platform-window">
        <div className="r-mini-top">
          {good
            ? p === "iOS"
              ? "‹ 工作区"
              : p === "Android"
                ? "← 工作区"
                : p === "Windows"
                  ? "文件窗口　— □ ×"
                  : "浏览器　← →"
            : "←　●　□"}
          <span>笔记</span>
        </div>
        <p>文件内容</p>
        <div className="r-native-footer">
          {good ? `${p} 原生导航约定` : "通用自制导航栏"}
        </div>
      </div>
      <small>Web 模拟只比较结构；实际手势需要原生设备验证。</small>
    </div>
  );
}
export function WindowDrag({ good }: ScenarioProps) {
  return (
    <div className="r-platform-window">
      <div className="r-window-titlebar">
        <span>● ● ●</span>
        {good ? (
          <>
            <span className="r-drag-space">可拖动窗口区域</span>
            <span>⌕</span>
          </>
        ) : (
          <>
            <button>工作区</button>
            <button>收藏</button>
            <button>设置</button>
            <button>搜索</button>
          </>
        )}
      </div>
      <p>桌面软件内容区</p>
      <small>{good ? "交互控件排除在拖拽区之外" : "标题栏被控件占满"}</small>
    </div>
  );
}
export function Haptics({ good }: ScenarioProps) {
  const [n, set] = useState(0);
  const [on, toggle] = useState(false);
  return (
    <div className="r-stack">
      <label className="r-choice">
        <input
          type="checkbox"
          role="switch"
          checked={on}
          onChange={(e) => {
            toggle(e.target.checked);
            set(n + 1);
          }}
        />
        自动同步
      </label>
      <div className="r-haptic-timeline">
        {Array.from({ length: good ? n : n + 12 }, (_, i) => (
          <i key={i} style={{ height: good ? 14 : 20 + (i % 3) * 9 }} />
        ))}
      </div>
      <Button
        variant="secondary"
        onClick={() => {
          if (!good) set(n + 4);
        }}
      >
        模拟滚动
      </Button>
      <DemoMessage>
        {good ? `${n} 次边界反馈` : `${n + 12} 次持续反馈`}
      </DemoMessage>
      <small>振动由图形模拟，无硬件调用。</small>
    </div>
  );
}
export function ContextMenu({ good, preview }: ScenarioProps) {
  const [open, set] = useState(!!preview);
  const [result, save] = useState("");
  return (
    <div
      className="r-context-region"
      onContextMenu={(e) => {
        e.preventDefault();
        set(true);
      }}
    >
      <div className="r-file-row">
        品牌规范.pdf{" "}
        <Button variant="ghost" size="sm" onClick={() => set(true)}>
          更多
        </Button>
      </div>
      {open &&
        (good ? (
          <div className="r-popover-static">
            {["打开", "复制链接", "关闭"].map((v) => (
              <Button
                key={v}
                variant="ghost"
                onClick={() => {
                  save(v);
                  set(false);
                }}
              >
                {v}
                {v === "复制链接" && <kbd>⌘ C</kbd>}
              </Button>
            ))}
          </div>
        ) : (
          <div className="r-menu-obstruction">
            <h4>文件操作</h4>
            <Button
              onClick={() => {
                save("已打开");
                set(false);
              }}
            >
              打开
            </Button>
            <Button variant="secondary" onClick={() => set(false)}>
              关闭
            </Button>
          </div>
        ))}
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
