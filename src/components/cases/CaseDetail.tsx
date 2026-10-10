import { DocDisclosure } from "../common/DocDisclosure";
import { casePlatformNote } from "../../data/caseNotes";
import { useState } from "react";
import { DO_DONT_CASES } from "../../data/doDontCases";
import { getCaseImplementation, caseSourceFiles } from "./registry";
import { DoDontVisualPreview } from "../common/DoDontVisualPreview";
import { CodeBlock } from "../common/CodeBlock";
import { Button } from "../ui/core";
export function CaseDetail({ id }: { id: string }) {
  const c = DO_DONT_CASES.find((c) => c.id === id);
  const [reset, set] = useState(0);
  if (!c)
    return (
      <div className="r-empty">
        <h1>未找到的案例</h1>
      </div>
    );
  const impl = getCaseImplementation(c.id);
  const related = DO_DONT_CASES.filter(
    (v) => v.category === c.category && v.id !== c.id,
  ).slice(0, 3);
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <div className="r-eyebrow">
          案例 {String(c.number).padStart(2, "0")} · 分类：{c.category}
        </div>
        <h1>{impl.title}</h1>
        <p>{c.summary}</p>
        <div className="r-control-row">
          <span className="r-tag">
            {impl.interactive ? "交互模拟" : "视觉对照"}
          </span>
          <span className="r-tag">Beta · 教学参考</span>
          {c.applicablePlatforms.map((v) => (
            <span className="r-muted" key={v}>
              {v}
            </span>
          ))}
        </div>
      </header>
      <nav className="r-section-nav" aria-label="案例章节">
        {[
          "overview",
          "try-it",
          "why",
          "rules",
          "platform-notes",
          "implementation",
        ].map((v) => (
          <a href={`#/dodont/${id}?anchor=${v}`} key={v}>
            {
              (
                {
                  overview: "设计问题",
                  "try-it": "对照体验",
                  why: "设计依据",
                  rules: "相关规范",
                  "platform-notes": "平台差异",
                  implementation: "实现源码",
                } as Record<string, string>
              )[v]
            }
          </a>
        ))}
      </nav>
      <DocDisclosure id="overview" title="完整设计问题">
        <p>{c.title}</p>
      </DocDisclosure>
      <section id="try-it">
        <div className="r-section-heading">
          <div>
            <span className="r-eyebrow">02</span>
            <h2>在两种界面中亲自试一试</h2>
          </div>
          <Button variant="secondary" size="sm" onClick={() => set(reset + 1)}>
            重置两侧演示
          </Button>
        </div>
        <p className="r-task">
          <strong>观察任务</strong> {impl.task}
        </p>
        <DoDontVisualPreview key={reset} caseData={c} />
        <div className="r-two-col r-explanation">
          <div>
            <h3>✓ Do</h3>
            <p>{c.doText}</p>
          </div>
          <div>
            <h3>× Don’t</h3>
            <p>{c.dontText}</p>
          </div>
        </div>
      </section>
      <DocDisclosure id="why" title="设计依据">
        <p>{c.why}</p>
      </DocDisclosure>
      <section id="rules">
        <div className="r-section-heading">
          <span className="r-eyebrow">04</span>
          <h2>相关规范与构件</h2>
        </div>

        <div className="r-related-links">
          {impl.relatedComponents.map((id) => (
            <a href={`#/components/${id}`} key={id}>
              {id.replaceAll("-", " ")} ↗
            </a>
          ))}
          <a href="#/patterns">交互规范 ↗</a>
          <a href="#/accessibility">无障碍要求 ↗</a>
        </div>
      </section>
      <DocDisclosure id="platform-notes" title="平台差异">
        {casePlatformNote(c.category, c.id).map((note) => (
          <p key={note}>{note}</p>
        ))}
        <a href="#/platforms">查看跨平台实施指南 →</a>
      </DocDisclosure>
      <DocDisclosure id="implementation" title="查看实际源码">
        <p>
          路径：src/components/cases/{impl.source}
          Scenarios.tsx。每一侧独立管理状态，good
          属性选择行为；外层通过重新挂载执行重置。示例数据保存在内存中，持久化由产品实现。
        </p>
        <CodeBlock
          title={`${impl.source}Scenarios.tsx`}
          code={caseSourceFiles[`./${impl.source}Scenarios.tsx`]}
          language="tsx"
        />
      </DocDisclosure>
      <section>
        <div className="r-section-heading">
          <h2>继续学习</h2>
        </div>
        <div className="r-related-links">
          {related.map((v) => (
            <a key={v.id} href={`#/dodont/${v.id}`}>
              {getCaseImplementation(v.id).title} →
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
