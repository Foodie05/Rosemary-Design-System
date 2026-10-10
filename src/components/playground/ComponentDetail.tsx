import { DocDisclosure } from "../common/DocDisclosure";
import { MOTION_RULES } from "../../data/motion";
import presenceSource from "../../hooks/usePresence.ts?raw";
import { useSitePreferences } from "../../context/SitePreferences";
import { COMPONENT_RULES } from "../../data/componentRules";
import { IMPLEMENTATION_NOTES } from "./implementationNotes";
import { COMPONENT_SPECS } from "../../data/componentsSpec";
import { DO_DONT_CASES } from "../../data/doDontCases";
import { tokenModes } from "../../generated/tokens";
import { COMPONENT_IMPLEMENTATIONS, componentSourceFiles } from "./registry";
import { getCaseImplementation } from "../cases/registry";
import { Playground } from "./Playground";
import { CodeBlock } from "../common/CodeBlock";
import scrollbarsSource from "../../hooks/useScrollbars.ts?raw";
export function ComponentDetail({ id }: { id: string }) {
  const { mode } = useSitePreferences();
  const spec = COMPONENT_SPECS.find((c) => c.id === id);
  if (!spec)
    return (
      <div className="r-empty">
        <h1>未找到的组件</h1>
      </div>
    );
  const impl = COMPONENT_IMPLEMENTATIONS[id];
  const related = DO_DONT_CASES.filter((c) =>
    getCaseImplementation(c.id).relatedComponents.includes(id),
  );
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <span className="r-tag">分类：{spec.category}</span>
        <h1>
          {spec.name}
          <span className="r-title-translation">{spec.nameZh}</span>
        </h1>
        <p>{spec.description}</p>
        <div className="r-control-row">
          <span className="r-tag">{spec.status}</span>
          <span>v2.0.0</span>
          <span className="r-muted">
            {impl.interactive ? "Web 交互参考" : "基础构件参考"}
          </span>
        </div>
      </header>
      <nav className="r-section-nav" aria-label="组件章节">
        {[
          "playground",
          "anatomy",
          "usage",
          "accessibility",
          "motion",
          "tokens",
          "platforms",
          "implementation",
        ].map((v) => (
          <a key={v} href={`#/components/${id}?anchor=${v}`}>
            {
              (
                {
                  playground: "交互预览",
                  anatomy: "组成结构",
                  usage: "使用规则",
                  accessibility: "无障碍",
                  motion: "动效",
                  tokens: "设计令牌",
                  platforms: "平台差异",
                  implementation: "实现源码",
                } as Record<string, string>
              )[v]
            }
          </a>
        ))}
      </nav>
      <div id="playground">
        <p className="r-task">
          <strong>当前实现范围</strong> {IMPLEMENTATION_NOTES[id]}
        </p>
        <Playground key={id} spec={spec} />
      </div>
      <DocDisclosure id="anatomy" title="组成、变体与状态">
        <ol className="r-anatomy">
          {spec.anatomy.map((v, i) => (
            <li key={v}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {v}
            </li>
          ))}
        </ol>
        <div className="r-two-col">
          <div>
            <h3>规范变体</h3>
            <ul>
              {spec.variants.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <p className="r-muted">
              Playground 只控制当前实现支持的变体，其余为规范目标。
            </p>
          </div>
          <div>
            <h3>尺寸与状态（规范目标）</h3>
            <ul>
              {spec.sizes.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <p>{spec.states.join(" · ")}</p>
          </div>
        </div>
      </DocDisclosure>
      <section id="usage" className="r-rule-callout">
        <span className="r-eyebrow">02</span>
        <h2>使用规则</h2>
        <div className="r-two-col">
          <div>
            <h3>✓ Do</h3>
            <p>{spec.doAndDonts!.doText}</p>
          </div>
          <div>
            <h3>× Don’t</h3>
            <p>{spec.doAndDonts!.dontText}</p>
          </div>
        </div>
        <div className="r-related-links">
          {related.slice(0, 4).map((c) => (
            <a key={c.id} href={`#/dodont/${c.id}`}>
              {getCaseImplementation(c.id).title} ↗
            </a>
          ))}
        </div>
      </section>
      <section id="accessibility">
        <div className="r-section-heading">
          <span className="r-eyebrow">03</span>
          <h2>键盘、触控与辅助技术</h2>
        </div>
        <ul className="r-prose-list">
          {spec.accessibilityNotes.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
        {[
          "tree-view",
          "data-grid",
          "dropdown-menu",
          "context-menu",
          "combo-box",
        ].includes(id) && (
          <p className="r-status r-tone-warning">
            Candidate：当前采用原生表格 / disclosure / datalist 语义；完整 ARIA
            复合控件键盘模型尚未实现。
          </p>
        )}
        <a href="#/accessibility">共享键盘、触控与无障碍要求 →</a>
      </section>
      <DocDisclosure id="tokens" title="设计令牌">
        <div className="r-token-reference">
          {spec.tokens.map((name) => (
            <a key={name} href={`#/tokens?query=${encodeURIComponent(name)}`}>
              <code>{name}</code>
              <span>
                {tokenModes[mode][name as keyof typeof tokenModes.light]
                  ?.value || "规范参考"}
              </span>
            </a>
          ))}
        </div>
      </DocDisclosure>
      <DocDisclosure id="platforms" title="平台差异与实现范围">
        <p className="r-task">{COMPONENT_RULES[id].platformNote}</p>
        <table className="r-table">
          <thead>
            <tr>
              <th>平台</th>
              <th>实现意图 / 参考（非已发布包）</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(spec.platforms).map(([platform, intent]) => (
              <tr key={platform}>
                <th scope="row">{platform}</th>
                <td>{intent}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="r-muted">
          Web 源码在本项目可用。Flutter、SwiftUI、Compose 首批各 14 个本地
          Prototype 组件已有实现与构建记录，其他 47 项为 Draft；
          原生辅助技术和完整设备验收未完成，WinUI 保留为指南与生成参数。
          <a href="#/platforms?anchor=native-libraries">
            查看 SDK 范围与验收 →
          </a>
        </p>
        <a href="#/platforms">平台实施指南与来源 →</a>
      </DocDisclosure>
      <DocDisclosure id="motion" title="动效与减少动态效果">
        <dl className="r-description">
          <dt>状态反馈</dt>
          <dd>{MOTION_RULES[id].feedback}</dd>
          <dt>进入</dt>
          <dd>{MOTION_RULES[id].enter}</dd>
          <dt>退出</dt>
          <dd>{MOTION_RULES[id].exit}</dd>
          <dt>中断</dt>
          <dd>{MOTION_RULES[id].interrupt}</dd>
          <dt>减少动态效果</dt>
          <dd>{MOTION_RULES[id].reduced}</dd>
        </dl>
        <a href="#/foundations?anchor=foundations-motion">
          查看共享动效规范与可重播演示 →
        </a>
      </DocDisclosure>
      <DocDisclosure id="implementation" title="查看实际源码">
        <p>
          本项目路径：src/components/ui/{impl.source}.tsx。Playground
          与视觉矩阵直接使用该文件导出的实现，没有另写外观替身。下方为同族源码；Button
          等基础构件共用 core.tsx。
        </p>
        <CodeBlock
          title={`${impl.source}.tsx`}
          code={componentSourceFiles[`../ui/${impl.source}.tsx`]}
          language="tsx"
        />
        {id === "slider" && (
          <CodeBlock
            title="共享范围控件 Slider.tsx"
            code={componentSourceFiles["../ui/Slider.tsx"]}
            language="tsx"
          />
        )}
        {id === "select" && (
          <CodeBlock
            title="共享选择控件 Select.tsx"
            code={componentSourceFiles["../ui/Select.tsx"]}
            language="tsx"
          />
        )}
        {id === "scroll-area" && (
          <CodeBlock
            title="全站滚动条 useScrollbars.ts"
            code={scrollbarsSource}
            language="tsx"
          />
        )}
        <details>
          <summary>共享进出场 usePresence.ts</summary>
          <CodeBlock code={presenceSource} title="usePresence.ts" />
        </details>
        <details>
          <summary>共享基础构件 core.tsx</summary>
          <CodeBlock code={componentSourceFiles["../ui/core.tsx"]} />
        </details>
        <p>
          版本状态：{spec.status}。Beta 表示可用 Web
          参考，尚未完成产品级发布验证；Candidate
          表示规范成立、完整行为仍待扩展。
        </p>
      </DocDisclosure>
    </article>
  );
}
