import { SelectionGroup, SelectionContent } from "../common/SelectionMotion";
import { Select } from "../ui/Select";
import { useState } from "react";
import { useSessionState } from "../../hooks/useSessionState";
import { DO_DONT_CASES } from "../../data/doDontCases";
import { CASE_CATEGORIES, PLATFORMS } from "../../data/taxonomy";
import { DoDontCard } from "../common/DoDontCard";
import { getCaseImplementation } from "../cases/registry";
import { CaseDetail } from "../cases/CaseDetail";
import { Button } from "../ui/core";
export function DoDontGalleryView({
  initialCaseId,
}: {
  initialCaseId?: string;
}) {
  const [q, search] = useSessionState("cases-query", "");
  const [category, setCategory] = useSessionState("cases-category", "all");
  const [platform, setPlatform] = useSessionState("cases-platform", "all");
  const [tag, setTag] = useSessionState("cases-tag", "all");
  const [interactive, setInteractive] = useSessionState(
    "cases-interactive",
    false,
  );
  const [limit, setLimit] = useSessionState("cases-limit", 12);
  if (initialCaseId)
    return <CaseDetail key={initialCaseId} id={initialCaseId} />;
  const tags = [...new Set(DO_DONT_CASES.flatMap((c) => c.tags))].sort();
  const filtered = DO_DONT_CASES.filter((c) => {
    const impl = getCaseImplementation(c.id);
    return (
      (category === "all" || c.category === category) &&
      (platform === "all" ||
        c.applicablePlatforms.some((p) => p === platform)) &&
      (tag === "all" || c.tags.includes(tag)) &&
      (!interactive || impl.interactive) &&
      `${impl.title} ${c.title} ${c.summary} ${c.tags.join(" ")} ${c.id}`
        .toLowerCase()
        .includes(q.trim().toLowerCase())
    );
  });
  const reset = () => {
    search("");
    setCategory("all");
    setPlatform("all");
    setTag("all");
    setInteractive(false);
    setLimit(12);
  };
  return (
    <div>
      <header className="r-doc-header r-gallery-header">
        <h1>把原则，放进真实界面。</h1>
        <p>比较、操作，再理解设计取舍。</p>
        <div className="r-inline-metrics">
          <strong>
            {DO_DONT_CASES.length}
            <span>组视觉对照</span>
          </strong>
          <strong>
            {
              DO_DONT_CASES.filter(
                (c) => getCaseImplementation(c.id).interactive,
              ).length
            }
            <span>组交互模拟</span>
          </strong>
          <strong>
            10<span>个专题</span>
          </strong>
        </div>
      </header>
      <div className="r-filter-bar">
        <label className="r-search-field">
          搜索案例
          <input
            type="search"
            placeholder="搜索：撤销、校验、导航…"
            value={q}
            onChange={(e) => {
              search(e.target.value);
              setLimit(12);
            }}
          />
        </label>
        <label>
          平台
          <Select
            value={platform}
            onValueChange={(value) => {
              setPlatform(value);
              setLimit(12);
            }}
            label={"平台"}
            options={[
              { value: "all", label: "全部平台" },
              ...PLATFORMS.map((v) => ({ value: String(v), label: String(v) })),
            ]}
          />
        </label>
        <label>
          标签
          <Select
            value={tag}
            onValueChange={(value) => {
              setTag(value);
              setLimit(12);
            }}
            label={"标签"}
            options={[
              { value: "all", label: "全部标签" },
              ...tags.map((v) => ({ value: String(v), label: String(v) })),
            ]}
          />
        </label>
        <label className="r-choice">
          <input
            type="checkbox"
            checked={interactive}
            onChange={(e) => {
              setInteractive(e.target.checked);
              setLimit(12);
            }}
          />
          仅交互案例
        </label>
        <Button variant="ghost" size="sm" onClick={reset}>
          重置筛选
        </Button>
      </div>
      <SelectionGroup
        value={category}
        label="案例专题"
        className="r-category-strip"
      >
        <button
          aria-pressed={category === "all"}
          onClick={() => {
            setCategory("all");
            setLimit(12);
          }}
        >
          全部 <span>{DO_DONT_CASES.length}</span>
        </button>
        {CASE_CATEGORIES.map((v) => (
          <button
            key={v.id}
            aria-pressed={v.id === category}
            onClick={() => {
              setCategory(v.id);
              setLimit(12);
            }}
          >
            {v.label}
            <span>
              {DO_DONT_CASES.filter((c) => c.category === v.id).length}
            </span>
          </button>
        ))}
      </SelectionGroup>
      <div className="r-results-heading">
        <p role="status">找到 {filtered.length} 组案例</p>
        <span>先看差异，再理解原因</span>
      </div>
      <SelectionContent value={category} className="r-case-grid">
        {filtered.slice(0, limit).map((c) => (
          <DoDontCard key={c.id} caseData={c} />
        ))}
      </SelectionContent>
      {filtered.length > limit && (
        <div className="r-load-more">
          <Button variant="secondary" onClick={() => setLimit(limit + 12)}>
            加载更多 · 已显示 {limit}/{filtered.length}
          </Button>
        </div>
      )}
      {!filtered.length && (
        <div className="r-empty">
          <h2>没有匹配的案例</h2>
          <p>尝试更短的关键词，或清除平台和标签筛选。</p>
          <Button variant="secondary" onClick={reset}>
            显示全部案例
          </Button>
        </div>
      )}
    </div>
  );
}
