import { useState } from "react";
import { Button, DemoMessage, PreviewProps, Status } from "./core";
const rows = [
  { name: "视觉规范", size: 184, owner: "Lin" },
  { name: "交互笔记", size: 92, owner: "Yan" },
  { name: "组件说明", size: 276, owner: "Lin" },
];
export function TableExample(p: PreviewProps) {
  const [sort, set] = useState(false);
  return (
    <div className="r-table-scroll">
      <table className="r-table">
        <caption>{p.label || "文件清单"}</caption>
        <thead>
          <tr>
            <th scope="col">名称</th>
            <th scope="col">负责人</th>
            <th scope="col" aria-sort={sort ? "descending" : "ascending"}>
              <button disabled={p.disabled} onClick={() => set(!sort)}>
                大小 (KB) {sort ? "↓" : "↑"}
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...rows]
            .sort((a, b) => (sort ? b.size - a.size : a.size - b.size))
            .map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>{row.owner}</td>
                <td className="r-numeric">{row.size}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
export function DataGridExample(p: PreviewProps) {
  const [selection, set] = useState<string[]>([]);
  const [archived, archive] = useState<string[]>([]);
  return (
    <div className="r-data-table">
      <div className="r-table-scroll">
        <table className="r-table">
          <caption>文件清单</caption>
          <thead>
            <tr>
              <th scope="col">选择</th>
              <th scope="col">文件</th>
              <th scope="col">大小</th>
            </tr>
          </thead>
          <tbody>
            {archived.length === rows.length && (
              <tr>
                <td colSpan={3}>所有文件已归档，可通过下方“恢复全部”撤销。</td>
              </tr>
            )}
            {rows
              .filter((row) => !archived.includes(row.name))
              .map((row) => (
                <tr key={row.name}>
                  <td>
                    <label className="r-table-selection">
                      <input
                        type="checkbox"
                        disabled={p.disabled}
                        checked={selection.includes(row.name)}
                        aria-label={`选择${row.name}`}
                        onChange={(e) =>
                          set(
                            e.target.checked
                              ? [...selection, row.name]
                              : selection.filter((v) => v !== row.name),
                          )
                        }
                      />
                    </label>
                  </td>
                  <th scope="row">{row.name}</th>
                  <td>{row.size} KB</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="r-table-actions" role="group" aria-label="批量文件操作">
        <Button
          disabled={p.disabled || !selection.length}
          onClick={() => {
            archive([...archived, ...selection]);
            set([]);
          }}
        >
          归档所选
        </Button>
        {archived.length > 0 && (
          <Button
            variant="secondary"
            disabled={p.disabled}
            onClick={() => archive([])}
          >
            恢复全部
          </Button>
        )}
      </div>
      <DemoMessage>
        已选择 {selection.length} 项
        {archived.length > 0 ? ` · 已归档 ${archived.length} 项` : ""}
      </DemoMessage>
    </div>
  );
}
export function ListExample(p: PreviewProps) {
  const [value, set] = useState("");
  return (
    <div>
      <ul className="r-list">
        {rows.map((row) => (
          <li key={row.name}>
            <Button
              disabled={p.disabled}
              variant="ghost"
              onClick={() => set(row.name)}
            >
              {row.name}
              <span>{row.size} KB</span>
            </Button>
          </li>
        ))}
      </ul>
      <DemoMessage>
        {value ? `正在查看 ${value}` : "选择文件查看详情"}
      </DemoMessage>
    </div>
  );
}
export function DescriptionExample() {
  return (
    <dl className="r-description">
      <dt>项目</dt>
      <dd>Rosemary Design</dd>
      <dt>更新时间</dt>
      <dd>2026-10-09</dd>
      <dt>同步状态</dt>
      <dd>
        <Status>已同步</Status>
      </dd>
    </dl>
  );
}
export function TreeExample(p: PreviewProps) {
  return (
    <div className="r-tree">
      <details open>
        <summary>设计系统</summary>
        <details>
          <summary>令牌</summary>
          <p>semantic.tokens.json</p>
        </details>
        <details>
          <summary>组件</summary>
          <p>Button.tsx · Input.tsx</p>
        </details>
      </details>
    </div>
  );
}
export function BadgeExample() {
  return (
    <div className="r-control-row">
      <Status>已同步</Status>
      <Status tone="warning">待审核</Status>
      <Status tone="danger">需重试</Status>
    </div>
  );
}
export function TagExample(p: PreviewProps) {
  const [tags, set] = useState(["设计", "开发", "研究"]);
  return (
    <div className="r-control-row">
      {tags.map((v) => (
        <span key={v} className="r-tag">
          {v}
          <button
            disabled={p.disabled}
            aria-label={`移除${v}标签`}
            onClick={() => set(tags.filter((t) => t !== v))}
          >
            ×
          </button>
        </span>
      ))}
      {!tags.length && (
        <Button variant="ghost" onClick={() => set(["设计", "开发", "研究"])}>
          恢复标签
        </Button>
      )}
    </div>
  );
}
export function AvatarExample() {
  return (
    <div className="r-control-row">
      <span className="r-avatar" role="img" aria-label="Lin 的头像">
        L
      </span>
      <span
        className="r-avatar r-avatar-soft"
        role="img"
        aria-label="Rosemary 团队头像"
      >
        R
      </span>
      <span>Lin · Rosemary 团队</span>
    </div>
  );
}
export function MetricExample() {
  return (
    <div className="r-metric">
      <span>本周同步</span>
      <strong>1,284</strong>
      <span>比上周增加 12.4% · 示例数据</span>
      <svg
        viewBox="0 0 240 64"
        role="img"
        aria-label="本周每天同步数量逐渐增加的趋势"
      >
        <path
          d="M0 52 L40 40 L80 44 L120 28 L160 32 L200 18 L240 8"
          fill="none"
          stroke="var(--r-semantic-color-chart-one)"
          strokeWidth="3"
        />
      </svg>
    </div>
  );
}
export function ProberExample(p: PreviewProps) {
  const [state, set] = useState(0);
  return (
    <div className="r-stack">
      <div role="status">
        <Status
          tone={state === 0 ? "success" : state === 1 ? "info" : "danger"}
        >
          {["全部服务可用", "正在检查连接", "同步服务暂不可用"][state]}
        </Status>
      </div>
      <Button
        variant="secondary"
        disabled={p.disabled}
        onClick={() => set((state + 1) % 3)}
      >
        模拟状态变化
      </Button>
    </div>
  );
}
export function FileRowExample(p: PreviewProps) {
  const [removed, set] = useState(false);
  return (
    <div className="r-file-row">
      <span>{removed ? "文件已移至回收站" : "semantic.tokens.json"}</span>
      <Button
        variant="ghost"
        disabled={p.disabled}
        onClick={() => set(!removed)}
      >
        {removed ? "撤销" : "移除"}
      </Button>
    </div>
  );
}
