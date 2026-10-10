import { useState } from "react";
import { SelectionGroup, SelectionContent } from "../common/SelectionMotion";
import { useSessionState } from "../../hooks/useSessionState";
import { COMPONENT_SPECS } from "../../data/componentsSpec";
import { COMPONENT_CATEGORIES } from "../../data/taxonomy";
import { COMPONENT_IMPLEMENTATIONS } from "../playground/registry";
import { ComponentDetail } from "../playground/ComponentDetail";
import { Button } from "../ui/core";
export function ComponentsView({ componentId }: { componentId?: string }) {
  const [limit, showMore] = useState(12);
  const [q, search] = useSessionState("components-query", "");
  const [category, set] = useSessionState("components-category", "all");
  if (componentId)
    return <ComponentDetail key={componentId} id={componentId} />;
  const filtered = COMPONENT_SPECS.filter(
    (c) =>
      (category === "all" || c.category === category) &&
      `${c.name} ${c.nameZh} ${c.description}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  return (
    <div>
      <header className="r-doc-header">
        <h1>
          精密的构件，
          <br />
          自然的组合。
        </h1>
        <p>按任务选择组件，查看行为与实际源码。</p>
        <div className="r-inline-metrics">
          <strong>
            {COMPONENT_SPECS.length}
            <span>个规范构件</span>
          </strong>
          <strong>
            {
              Object.values(COMPONENT_IMPLEMENTATIONS).filter(
                (c) => c.interactive,
              ).length
            }
            <span>个交互参考</span>
          </strong>
          <strong>
            7<span>个组件族</span>
          </strong>
        </div>
      </header>
      <div className="r-filter-bar">
        <label className="r-search-field">
          搜索组件
          <input
            type="search"
            value={q}
            onChange={(e) => {
              search(e.target.value);
              showMore(12);
            }}
            placeholder="Button、输入框、Dialog…"
          />
        </label>
        <Button
          variant="ghost"
          onClick={() => {
            search("");
            set("all");
            showMore(12);
          }}
        >
          重置
        </Button>
      </div>
      <SelectionGroup
        value={category}
        label="组件族"
        className="r-category-strip"
      >
        <button
          aria-pressed={category === "all"}
          onClick={() => {
            set("all");
            showMore(12);
          }}
        >
          全部 <span>{COMPONENT_SPECS.length}</span>
        </button>
        {COMPONENT_CATEGORIES.map((v) => (
          <button
            key={v.id}
            aria-pressed={category === v.id}
            onClick={() => {
              set(v.id);
              showMore(12);
            }}
          >
            {v.label}
            <span>
              {COMPONENT_SPECS.filter((c) => c.category === v.id).length}
            </span>
          </button>
        ))}
      </SelectionGroup>
      <div className="r-results-heading">
        <p role="status">{filtered.length} 个组件</p>
        <span>Beta / Candidate · 本地 Web 参考</span>
      </div>
      <SelectionContent value={category} className="r-component-grid">
        {filtered.slice(0, limit).map((c) => (
          <article key={c.id} className="r-component-card">
            <div className="r-component-preview" aria-hidden="true" inert>
              <div className="r-component-preview-inner">
                {(() => {
                  const Preview = COMPONENT_IMPLEMENTATIONS[c.id].Preview;
                  return <Preview />;
                })()}
              </div>
            </div>
            <div className="r-component-card-body">
              <div className="r-eyebrow">
                <span>{c.category}</span>
                <span>{c.status}</span>
              </div>
              <h2>
                <a href={`#/components/${c.id}`}>{c.name}</a>
                <span>{c.nameZh}</span>
              </h2>
              <p>{c.description}</p>
              <div className="r-case-card-bottom">
                <span>
                  {COMPONENT_IMPLEMENTATIONS[c.id].interactive
                    ? "交互参考"
                    : "视觉构件"}
                </span>
                <span>探索 →</span>
              </div>
            </div>
          </article>
        ))}
      </SelectionContent>
      {filtered.length > limit && (
        <div className="r-load-more">
          <Button variant="secondary" onClick={() => showMore(limit + 12)}>
            再显示 12 个组件
          </Button>
        </div>
      )}
      {!filtered.length && (
        <div className="r-empty">
          <h2>没有匹配组件</h2>
          <Button
            variant="secondary"
            onClick={() => {
              search("");
              set("all");
            }}
          >
            清除筛选
          </Button>
        </div>
      )}
    </div>
  );
}
