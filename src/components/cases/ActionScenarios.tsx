import { useEffect, useState } from "react";
import { Button, DemoMessage } from "../ui/core";
import { ScenarioProps } from "./types";
export function Priority({ good }: ScenarioProps) {
  const [result, set] = useState("");
  return (
    <div className="r-stack">
      <h4>发布设计规范</h4>
      <p>更改将同步到团队工作区。</p>
      <div className="r-control-row">
        <Button onClick={() => set("发布成功")}>发布</Button>
        <Button
          variant={good ? "secondary" : "primary"}
          onClick={() => set("草稿已保存")}
        >
          存为草稿
        </Button>
        <Button
          variant={good ? "ghost" : "primary"}
          onClick={() => set("已取消")}
        >
          取消
        </Button>
      </div>
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function Placement({ good }: ScenarioProps) {
  const [result, set] = useState("");
  return (
    <div className="r-stack">
      <label>
        项目名称
        <input defaultValue="Rosemary Notes" />
      </label>
      <div className={good ? "r-actions-end" : "r-actions-scattered"}>
        <Button variant="secondary" onClick={() => set("已取消")}>
          取消
        </Button>
        <Button onClick={() => set("更改已保存")}>保存更改</Button>
      </div>
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function LoadingWidth({ good, preview }: ScenarioProps) {
  const [busy, set] = useState(!!preview);
  useEffect(() => {
    if (preview || !busy) return;
    const t = setTimeout(() => set(false), 900);
    return () => clearTimeout(t);
  }, [busy]);
  return (
    <div className="r-stack">
      <div className="r-guides">
        <Button
          loading={good && busy}
          disabled={busy}
          onClick={() => set(true)}
          style={good ? { minWidth: 156 } : undefined}
        >
          {busy && !good ? "◌" : "保存所有更改"}
        </Button>
        <span className="r-guide-line" />
      </div>
      <DemoMessage>{busy ? "正在保存…" : "操作区的几何位置"}</DemoMessage>
    </div>
  );
}
export function SplitSafety({ good, preview }: ScenarioProps) {
  const [open, set] = useState(!!preview && !good);
  const [result, save] = useState("");
  return (
    <div className="r-stack">
      <div className="r-button-group">
        <Button
          onClick={() => {
            if (good) save("已导出 PDF");
            else set(!open);
          }}
        >
          导出 PDF
        </Button>
        <Button aria-label="更多格式" onClick={() => set(!open)}>
          ⌄
        </Button>
      </div>
      {open && (
        <div className="r-popover-static">
          <Button
            variant="ghost"
            onClick={() => {
              save("已导出文本");
              set(false);
            }}
          >
            导出文本
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              save("文件已移至回收站");
              set(false);
            }}
          >
            移至回收站
          </Button>
        </div>
      )}
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function FabRestraint({ good }: ScenarioProps) {
  return (
    <div className="r-fab-scene">
      <h4>阅读清单</h4>
      <p>最后一条记录包含交接备注和下一步工作。</p>
      <div className="r-file-row">交接文档 · 等待审核</div>
      <button
        className={good ? "r-fab-scene-small" : "r-fab-scene-large"}
        aria-label="新建"
      >
        ＋
      </button>
    </div>
  );
}
export function DisabledReason({ good }: ScenarioProps) {
  const [agreed, set] = useState(false);
  const [exported, setExported] = useState(false);
  return (
    <div className="r-stack">
      <h4>导出项目</h4>
      <label className="r-choice">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => set(e.target.checked)}
        />
        包含必要的项目元数据
      </label>
      <Button disabled={!agreed} onClick={() => setExported(true)}>
        开始导出
      </Button>
      <DemoMessage>
        {exported ? "导出完成 · 项目元数据已包含（本地模拟）" : ""}
      </DemoMessage>
      {good && !agreed && (
        <small>请先选择包含元数据，导出包才能完整恢复。</small>
      )}
    </div>
  );
}
export function DangerStyling({ good }: ScenarioProps) {
  return (
    <div className="r-stack">
      <h4>项目设置</h4>
      <div className="r-control-row">
        <Button variant={good ? "secondary" : "danger"}>修改名称</Button>
        <Button variant={good ? "secondary" : "danger"}>导出副本</Button>
      </div>
      <hr />
      <p>移除将把项目放入回收站。</p>
      <Button variant="danger">移除项目</Button>
    </div>
  );
}
export function BatchActions({ good }: ScenarioProps) {
  const [selected, set] = useState<string[]>([]);
  const [removed, remove] = useState<string[]>([]);
  const names = ["品牌规范", "交互笔记", "组件说明"];
  return (
    <div className="r-stack">
      {good && selected.length > 0 && (
        <Button
          onClick={() => {
            remove([...removed, ...selected]);
            set([]);
          }}
        >
          归档所选 {selected.length} 项
        </Button>
      )}
      <ul className="r-mini-list">
        {names
          .filter((v) => !removed.includes(v))
          .map((v) => (
            <li key={v}>
              {good ? (
                <label className="r-choice">
                  <input
                    type="checkbox"
                    checked={selected.includes(v)}
                    onChange={(e) =>
                      set(
                        e.target.checked
                          ? [...selected, v]
                          : selected.filter((n) => n !== v),
                      )
                    }
                  />
                  {v}
                </label>
              ) : (
                <>
                  {v}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => remove([...removed, v])}
                  >
                    归档
                  </Button>
                </>
              )}
            </li>
          ))}
      </ul>
      <DemoMessage>已归档 {removed.length} 项</DemoMessage>
    </div>
  );
}
