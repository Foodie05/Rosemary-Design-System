import { DocDisclosure } from "../common/DocDisclosure";
import { TokenBrowser } from "../tokens/TokenBrowser";
import { CodeBlock } from "../common/CodeBlock";
export function TokensView({ query = "" }: { query?: string }) {
  return (
    <article>
      <header className="r-doc-header">
        <h1>
          把设计决策，
          <br />
          写成共同的语言。
        </h1>
        <p>以语义角色连接基础参数、组件与明暗主题。</p>
      </header>
      <div className="r-token-flow">
        <div>
          <span>01</span>
          <strong>Primitive</strong>
          <code>pine、paper、space</code>
        </div>
        <i>→</i>
        <div>
          <span>02</span>
          <strong>Semantic</strong>
          <code>accent、canvas、text</code>
        </div>
        <i>→</i>
        <div>
          <span>03</span>
          <strong>Component</strong>
          <code>button、field、dialog</code>
        </div>
      </div>
      <TokenBrowser key={query} initialQuery={query} />
      <DocDisclosure id="token-generation" title="生成、校验与格式边界">
        <p>
          运行 npm run tokens:build，从 tokens/themes.json
          依序合并基础层与主题覆盖，再解析引用。所有生成产物可重复生成，并检查名称、缺失引用、循环、类型、双主题覆盖和
          20 组文本 / 控件对比度。
        </p>
        <CodeBlock
          code={`npm run tokens:build\nnpm run tokens:check\nnpm test\nnpm run lint\nnpm run build`}
          language="sh"
        />
        <p>
          当前实现支持
          color（sRGB）、dimension（px）、fontFamily、duration（ms）、cubicBezier
          及整值别名。文件采用 DTCG 2025.10 结构；工具尚未实现该规范的全部 JSON
          Pointer、扩展组与复合类型，不声称完整转换器合规。
        </p>
        <a
          href="https://www.designtokens.org/tr/2025.10/format/"
          target="_blank"
          rel="noreferrer"
        >
          DTCG Format 2025.10 来源 ↗
        </a>
      </DocDisclosure>
    </article>
  );
}
