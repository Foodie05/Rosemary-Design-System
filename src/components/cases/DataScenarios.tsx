import { Select } from "../ui/Select";
import { useState } from "react";
import { Button, DemoMessage } from "../ui/core";
import { ScenarioProps } from "./types";
export function Density({ good }: ScenarioProps) {
  const [compact, set] = useState(false);
  return (
    <div className="r-stack">
      {good && (
        <label className="r-choice">
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => set(e.target.checked)}
          />
          紧凑密度
        </label>
      )}
      <table className={`r-table ${compact ? "r-table-compact" : ""}`}>
        <thead>
          <tr>
            <th>文件</th>
            <th>大小</th>
            <th>同步</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["品牌", 184, "完成"],
            ["交互", 92, "完成"],
            ["组件", 276, "等待"],
          ].map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => (
                <td
                  key={j}
                  style={
                    j === 1
                      ? {
                          textAlign: good ? "right" : "left",
                          fontVariantNumeric: good ? "tabular-nums" : "normal",
                        }
                      : undefined
                  }
                >
                  {good && j === 1 ? `${v} KB` : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function ChartEncoding({ good }: ScenarioProps) {
  return (
    <div className="r-chart">
      <svg
        viewBox="0 0 240 120"
        role="img"
        aria-label={
          good
            ? "同步成功率：项目 A 实线，项目 B 虚线"
            : "反例：两条相似颜色且无图例的曲线"
        }
      >
        <path className="r-chart-grid" d="M20 20H230 M20 60H230 M20 100H230" />
        <path
          fill="none"
          stroke="var(--r-semantic-color-chart-one)"
          strokeWidth="3"
          d="M20 90L60 70L100 77L140 40L180 48L225 20"
        />
        <path
          fill="none"
          stroke={
            good
              ? "var(--r-semantic-color-chart-three)"
              : "var(--r-semantic-color-chart-one)"
          }
          strokeDasharray={good ? "6 5" : undefined}
          strokeWidth="3"
          d="M20 100L60 83L100 90L140 65L180 60L225 47"
        />
      </svg>
      {good && (
        <div className="r-control-row">
          <span>━ 项目 A</span>
          <span>┄ 项目 B</span>
        </div>
      )}
    </div>
  );
}
export function StickyHeader({ good }: ScenarioProps) {
  return (
    <div
      className="r-scroll-table"
      tabIndex={0}
      role="region"
      aria-label="滚动查看表头"
    >
      <table className="r-table">
        <thead style={good ? { position: "sticky", top: 0 } : undefined}>
          <tr>
            <th>文件</th>
            <th>大小 (KB)</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 15 }, (_, i) => (
            <tr key={i}>
              <td>笔记 {i + 1}</td>
              <td className="r-numeric">{18 + i * 7}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function EmptyFiltered({ good }: ScenarioProps) {
  const [filter, set] = useState(true);
  return (
    <div className="r-stack">
      {good && <span className="r-tag">状态：待审核</span>}
      <div className="r-empty">
        <h4>
          {filter
            ? good
              ? "当前筛选没有结果"
              : "暂无文件"
            : "已同步 · 品牌规范"}
        </h4>
        {good && filter && (
          <>
            <p>工作区有 12 个文件；当前没有待审核项。</p>
            <Button variant="secondary" onClick={() => set(false)}>
              清除筛选
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
export function LocaleNumbers({ good }: ScenarioProps) {
  const [locale, set] = useState("zh-CN");
  return (
    <div className="r-stack">
      {good && (
        <label>
          区域
          <Select
            value={locale}
            onValueChange={(value) => set(value)}
            label={"区域"}
            options={[
              { value: "zh-CN", label: "zh-CN" },
              { value: "en-US", label: "en-US" },
              { value: "de-DE", label: "de-DE" },
            ]}
          />
        </label>
      )}
      <dl className="r-description">
        <dt>年度请求</dt>
        <dd className="r-numeric">
          {good ? new Intl.NumberFormat(locale).format(1284092) : "1284092"}
        </dd>
        <dt>平均响应</dt>
        <dd>
          {good
            ? `${new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(1234.56)} ms`
            : "1234.560000"}
        </dd>
      </dl>
    </div>
  );
}
export function PageJump({ good }: ScenarioProps) {
  const [page, set] = useState(1);
  return (
    <div className="r-stack">
      <p>第 {page}/100 页 · 文件记录</p>
      {good && (
        <label>
          跳转到
          <input
            type="number"
            min="1"
            max="100"
            value={page}
            onChange={(e) => set(Math.max(1, Math.min(100, +e.target.value)))}
          />
        </label>
      )}
      <div className="r-control-row">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => set(page - 1)}
        >
          上一页
        </Button>
        <Button disabled={page === 100} onClick={() => set(page + 1)}>
          下一页
        </Button>
      </div>
      <DemoMessage>
        第 {(page - 1) * 10 + 1}–{page * 10} 条
      </DemoMessage>
    </div>
  );
}
