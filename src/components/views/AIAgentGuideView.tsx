import { publication } from "../../data/publication";
import { DocDisclosure } from "../common/DocDisclosure";
import { CodeBlock } from "../common/CodeBlock";
const integration = `# Rosemary design reference
Repository: ${publication.repositoryUrl || "<ROSEMARY_REPOSITORY_URL>"}
Documentation: ${publication.websiteUrl || "<ROSEMARY_WEBSITE_URL>"}
Source ref: ${publication.sourceRef || "<ROSEMARY_SOURCE_REF>"}

Before UI work, obtain the configured repository at the pinned ref.
Read docs/AI-INTEGRATION.md and guide/manifest.json on the documentation site.
Follow its task-specific reading paths. Consult the actual component spec,
implementation, tokens, motion and accessibility rules before changing UI.
Record the ref and consulted files/sections in the delivery evidence.
If a source cannot be read, report the missing reference; do not invent rules
or import an unpublished package.`;
export function AIAgentGuideView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          让 AI 先查规范，
          <br />
          再写代码。
        </h1>
        <p>把这份设计指南接入项目，让实现依据可追溯的规范与源码。</p>
      </header>
      <section id="guide-access">
        <h2>指南入口</h2>
        <dl className="r-description r-publication-slots">
          <dt>GitHub 仓库</dt>
          <dd>
            {publication.repositoryUrl ? (
              <a href={publication.repositoryUrl}>打开仓库 ↗</a>
            ) : (
              "待配置 · repositoryUrl"
            )}
          </dd>
          <dt>文档网站</dt>
          <dd>
            {publication.websiteUrl ? (
              <a href={publication.websiteUrl}>打开网站 ↗</a>
            ) : (
              "待配置 · websiteUrl"
            )}
          </dd>
          <dt>固定版本</dt>
          <dd>{publication.sourceRef || "待配置 · sourceRef"}</dd>
        </dl>
        <p className="r-muted">
          发布时填写 publication.json；占位地址不会伪装成可用链接。
        </p>
        <div className="r-related-links">
          <a href="/guide/ai-integration.md">阅读完整接入指南 →</a>
          <a href="/guide/manifest.json">机器可读索引 →</a>
        </div>
      </section>
      <section id="guide-reading">
        <h2>按任务查阅</h2>
        <ol className="r-prose-list">
          <li>
            <a href="#/philosophy">设计原则</a>与
            <a href="#/content?anchor=content-clarity">简洁规范</a>
            ：确认目标和信息层级。
          </li>
          <li>
            <a href="#/components">组件规范</a>
            与实际源码：核对状态、接口和支持范围。
          </li>
          <li>
            <a href="#/tokens">令牌</a>、
            <a href="#/foundations?anchor=foundations-motion">动效</a>和
            <a href="#/accessibility">无障碍</a>：落实视觉与行为。
          </li>
          <li>
            <a href="#/platforms?anchor=native-libraries">平台设计</a>与
            <a href="#/governance">验收记录</a>：确认平台差异和证据。
          </li>
        </ol>
      </section>
      <DocDisclosure
        id="project-integration"
        title="接入项目：AGENTS.md / 项目规则"
      >
        <p>
          在项目规则中引用指南入口与固定版本。下面是查阅入口配置，具体要求以读到的规范为准。
        </p>
        <CodeBlock
          title="指南引用配置"
          code={integration}
          language="markdown"
        />
        <a href="/guide/agents-reference.md" download>
          下载项目规则模板 ↓
        </a>
      </DocDisclosure>
      <DocDisclosure id="guide-verification" title="交付时记录什么">
        <p>
          列出实际读取的版本、文件或章节、采用的组件、检查结果和未验证项。网页用于阅读，仓库规范与源码用于实现；无法访问时先说明缺口。
        </p>
        <a href="/guide/ai-integration.md">完整查阅与验证流程 →</a>
      </DocDisclosure>
    </article>
  );
}
