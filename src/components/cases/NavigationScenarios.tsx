import { useState } from "react";
import { Button, DemoMessage } from "../ui/core";
import { ScenarioProps } from "./types";
export function Hierarchy({ good }: ScenarioProps) {
  const [path, set] = useState(["工作区"]);
  return (
    <div className="r-mini-app">
      <div className="r-mini-top">
        {good ? (
          <nav aria-label="模拟路径">
            {path.map((v, i) => (
              <button key={i} onClick={() => set(path.slice(0, i + 1))}>
                {v}
                {i < path.length - 1 ? " / " : ""}
              </button>
            ))}
          </nav>
        ) : (
          <strong>{path.at(-1)}</strong>
        )}
      </div>
      <h4>
        {path.length === 1 ? "项目" : path.length === 2 ? "文件夹" : "品牌标识"}
      </h4>
      {path.length < 3 ? (
        <Button
          variant="secondary"
          onClick={() =>
            set([...path, path.length === 1 ? "品牌项目" : "标识详情"])
          }
        >
          打开{path.length === 1 ? "品牌项目" : "标识详情"} →
        </Button>
      ) : (
        <p>3 个标识文件 · 已同步</p>
      )}
      {good && path.length > 1 && (
        <Button variant="ghost" onClick={() => set(path.slice(0, -1))}>
          ← 返回上一级
        </Button>
      )}
    </div>
  );
}
export function SearchFallback({ good }: ScenarioProps) {
  const [q, set] = useState("rosemari");
  const match = "rosemary".includes(q.toLowerCase());
  return (
    <div className="r-stack">
      <label>
        搜索文档
        <input type="search" value={q} onChange={(e) => set(e.target.value)} />
      </label>
      {match ? (
        <div className="r-file-row">Rosemary · 品牌规范</div>
      ) : good ? (
        <div className="r-empty">
          <strong>没有匹配结果</strong>
          <p>试试「rosemary」或清除关键词。</p>
          <Button variant="secondary" onClick={() => set("rosemary")}>
            搜索 rosemary
          </Button>
        </div>
      ) : (
        <p>0 条结果</p>
      )}
    </div>
  );
}
export function TransparentFilters({ good }: ScenarioProps) {
  const [on, set] = useState(true);
  return (
    <div className="r-stack">
      <div className="r-mini-top">
        文件{" "}
        <Button variant="ghost" size="sm" onClick={() => set(!on)}>
          筛选 {good && on ? "(1)" : ""}
        </Button>
      </div>
      {good && on && (
        <span className="r-tag">
          状态：已归档{" "}
          <button aria-label="清除已归档筛选" onClick={() => set(false)}>
            ×
          </button>
        </span>
      )}
      <ul className="r-mini-list">
        {(on
          ? ["归档 · 调研笔记"]
          : ["品牌规范", "组件说明", "归档 · 调研笔记"]
        ).map((v) => (
          <li key={v}>{v}</li>
        ))}
      </ul>
      {good && on && (
        <Button variant="ghost" onClick={() => set(false)}>
          清除全部筛选
        </Button>
      )}
    </div>
  );
}
export function ContextPreservation({ good, preview }: ScenarioProps) {
  const [q, set] = useState(preview && !good ? "" : "品牌");
  const [detail, open] = useState(false);
  return (
    <div className="r-stack">
      {detail ? (
        <>
          <Button
            variant="ghost"
            onClick={() => {
              open(false);
              if (!good) set("");
            }}
          >
            ← 返回列表
          </Button>
          <h4>品牌规范</h4>
          <p>更新于今天 · 12 个文件</p>
        </>
      ) : (
        <>
          <label>
            筛选文件
            <input value={q} onChange={(e) => set(e.target.value)} />
          </label>
          <Button variant="secondary" onClick={() => open(true)}>
            品牌规范 →
          </Button>
          <p>{q ? "筛选已激活" : "全部 120 个项目"}</p>
        </>
      )}
    </div>
  );
}
export function OverflowTabs({ good }: ScenarioProps) {
  const [v, set] = useState("概览");
  return (
    <div className="r-stack">
      <div className={good ? "r-tabs-scroll" : "r-tabs-wrap"}>
        {[
          "概览",
          "活动记录",
          "文件管理",
          "成员权限",
          "同步历史",
          "项目设置",
        ].map((t) => (
          <Button
            key={t}
            size="sm"
            variant={v === t ? "primary" : "ghost"}
            onClick={() => set(t)}
          >
            {t}
          </Button>
        ))}
      </div>
      <p>{v} · 工作区内容</p>
    </div>
  );
}
export function SidebarCollapse({ good, preview }: ScenarioProps) {
  const [collapsed, set] = useState(!!preview);
  const [v, select] = useState("文件");
  return (
    <div className="r-mini-app">
      <Button variant="ghost" size="sm" onClick={() => set(!collapsed)}>
        {collapsed ? "展开" : "收起"}侧栏
      </Button>
      <div className="r-mini-columns">
        {(!collapsed || good) && (
          <nav className="r-mini-rail" aria-label="模拟侧栏">
            {["文件", "收藏", "设置"].map((t, i) => (
              <Button
                variant={t === v ? "secondary" : "ghost"}
                key={t}
                title={t}
                aria-label={t}
                size="sm"
                onClick={() => select(t)}
              >
                {collapsed ? ["▤", "☆", "⚙"][i] : t}
              </Button>
            ))}
          </nav>
        )}
        <div>
          <h4>{v}</h4>
          <p>最近的工作记录</p>
        </div>
      </div>
    </div>
  );
}
export function Steps({ good }: ScenarioProps) {
  const [step, set] = useState(0);
  const [data, save] = useState("");
  return (
    <div className="r-stack">
      {good ? (
        <ol className="r-stepper">
          {["资料", "偏好", "完成"].map((v, i) => (
            <li key={v}>
              <Button
                size="sm"
                variant={i === step ? "primary" : "ghost"}
                disabled={i > step}
                onClick={() => set(i)}
              >
                {i + 1} {v}
              </Button>
            </li>
          ))}
        </ol>
      ) : (
        <h4>设置</h4>
      )}
      {step < 2 ? (
        <label>
          {step === 0 ? "项目名称" : "同步偏好"}
          <input value={data} onChange={(e) => save(e.target.value)} />
        </label>
      ) : (
        <p>设置完成 · {data || "未填写"}</p>
      )}
      <Button disabled={step === 2} onClick={() => set(step + 1)}>
        {good ? `继续 · ${step + 1}/3` : "下一步"}
      </Button>
    </div>
  );
}
export function CommandScope({ good }: ScenarioProps) {
  const [q, set] = useState("");
  const [result, save] = useState("");
  return (
    <div className="r-stack">
      <label>
        搜索命令
        <input
          value={q}
          onChange={(e) => set(e.target.value)}
          placeholder="新建、设置…"
        />
      </label>
      {["新建笔记", "打开设置", "搜索文件"]
        .filter((v) => v.includes(q))
        .map((v, i) => (
          <div key={v}>
            {good && (
              <small className="r-muted">{i === 0 ? "创建" : "导航"}</small>
            )}
            <Button variant="ghost" onClick={() => save(`已执行：${v}`)}>
              {v}
              {good && <kbd>{["⌘ N", "⌘ ,", "⌘ F"][i]}</kbd>}
            </Button>
          </div>
        ))}
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
