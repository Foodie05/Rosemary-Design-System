import { DocDisclosure } from "../common/DocDisclosure";
import { MOTION_CATALOGUE } from "../../data/motion";
import { MotionSamples } from "../interactive/MotionSamples";
import { useSitePreferences } from "../../context/SitePreferences";
import { tokenModes } from "../../generated/tokens";
import { ColorContrastCheckerDemo } from "../interactive/InteractiveDemos";
export function FoundationsView() {
  const { mode } = useSitePreferences();
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          建立秩序，
          <br />
          留出呼吸的空间。
        </h1>
        <p>用共享令牌定义颜色、排版、空间与动效。</p>
      </header>
      <section id="foundations-color">
        <div className="r-section-heading">
          <h2>色彩：先定义角色</h2>
        </div>
        <div className="r-foundation-colors">
          {[
            "accent",
            "canvas",
            "surface",
            "text",
            "danger",
            "warning",
            "info",
            "chart-two",
            "chart-three",
          ].map((v) => (
            <a
              key={v}
              href={`#/tokens?query=${encodeURIComponent("semantic.color." + v)}`}
            >
              <span
                style={{
                  background:
                    tokenModes[mode][
                      `semantic.color.${v}` as keyof typeof tokenModes.light
                    ].value,
                }}
              />
              <strong>{v}</strong>
              <code>
                {
                  tokenModes[mode][
                    `semantic.color.${v}` as keyof typeof tokenModes.light
                  ].value
                }
              </code>
            </a>
          ))}
        </div>
        <p>
          Light 与 Dark 分别调校 Surface、Text、Border、Focus 与
          Feedback。辅助色用于产品和图表，不替代状态语义。
        </p>
        <DocDisclosure id="foundations-contrast" title="检查颜色对比度">
          <ColorContrastCheckerDemo />
        </DocDisclosure>
      </section>
      <section id="foundations-typography">
        <div className="r-section-heading">
          <h2>Typography：人文标题，理性正文</h2>
        </div>
        <div className="r-type-scale">
          <div>
            <span>DISPLAY · 72 · 小屏自适应</span>
            <strong>
              Organic <em>precision.</em>
            </strong>
          </div>
          <div>
            <span>TITLE · 32</span>
            <h2>让设计，自然发生。</h2>
          </div>
          <div>
            <span>BODY · 16</span>
            <p>
              正文使用系统无衬线字体，行高 1.7。衬线标题采用 Source Serif 4 与
              Noto Serif SC，缺失时回退到 Georgia /
              宋体。两者承担不同的信息层级。
            </p>
          </div>
          <div>
            <span>CODE · 12</span>
            <code>
              --r-semantic-color-accent: var(--r-primitive-color-pine)
            </code>
          </div>
        </div>
        <p>
          长文行宽建议 65–75
          字符；标题平衡折行。重要说明使用正文或小正文，不以极小字承载规范。桌面、移动与系统字体缩放下保持内容完整。
        </p>
      </section>
      <section id="foundations-spacing">
        <div className="r-section-heading">
          <h2>空间：四像素网格，自然的节奏</h2>
        </div>
        <div className="r-spacing-scale">
          {[4, 8, 12, 16, 24, 32, 48, 64, 96].map((v) => (
            <div key={v}>
              <code>{v}</code>
              <span style={{ width: v }} />
            </div>
          ))}
        </div>
        <p>
          控件内部 8–16，组件之间 16–24，内容章节
          48–64。首页允许更大留白；紧凑数据视图提供密度选项，保留文字和目标尺寸。
        </p>
      </section>
      <section id="foundations-shape">
        <div className="r-section-heading">
          <h2>几何：精确的柔和</h2>
        </div>
        <div className="r-shape-scale">
          {[
            ["4", "small"],
            ["8", "control"],
            ["16", "panel"],
            ["48", "organic"],
          ].map(([v, k]) => (
            <div key={k}>
              <span style={{ borderRadius: `${v}px` }} />
              <strong>{k}</strong>
              <code>{v}px</code>
            </div>
          ))}
        </div>
        <p>
          品牌图形的叶形转角仅用于表达性场景。表单、表格和文档用稳定边界，不强行让每个控件变成有机造型。层级优先由空间与明度表达，浮层再使用阴影。
        </p>
      </section>
      <section id="foundations-clarity">
        <h2>阅读：先给结论，再展开细节</h2>
        <p>默认只展示关键规则；错误、风险和当前状态保持可见。</p>
        <a href="#/content?anchor=content-clarity">简洁与认知负担规范 →</a>
      </section>
      <section id="foundations-motion">
        <div className="r-section-heading">
          <h2>Motion：先解释，再退场</h2>
        </div>
        <p>反馈即时，变化有意义；动画可中断，并尊重减少动态效果。</p>
        <DocDisclosure id="motion-timing" title="时长、幅度与使用条件">
          <p>
            按压 80ms，悬停 120ms，状态变化 150ms，浮层进入 180ms / 退出
            120ms，展开 240ms，面板 280ms。页面先 80ms 退出再 180ms
            进入；同级按顺序关联，深入 / 返回反向。Tabs 内容 240ms /
            12px。拖动和业务状态立即生效。
          </p>
        </DocDisclosure>
        <DocDisclosure id="motion-examples" title="体验切换、展开与浮层">
          <MotionSamples />
        </DocDisclosure>
        <DocDisclosure id="motion-sources" title="动效来源与适用边界">
          {" "}
          <p>
            规范参考：
            <a href="https://developer.apple.com/design/human-interface-guidelines/motion">
              Apple HIG Motion
            </a>
            、
            <a href="https://developer.apple.com/videos/play/wwdc2023/10158/">
              Apple 动画连续性
            </a>
            、
            <a href="https://m3.material.io/styles/motion/overview/how-it-works">
              Material Motion
            </a>
            、
            <a href="https://v10.carbondesignsystem.com/guidelines/motion/overview/">
              Carbon Motion
            </a>
            。具体参数为 Rosemary 自身规范；WCAG 2.3.3（AAA）作为额外目标，当前
            Web 参考未声明合规认证。
          </p>
        </DocDisclosure>
        <details>
          <summary>查看全部 61 个组件的动效规则</summary>
          <div className="r-table-scroll">
            <table className="r-table r-motion-table">
              <caption>组件动效、进出场、中断及减少动态效果</caption>
              <thead>
                <tr>
                  <th scope="col">组件</th>
                  <th scope="col">反馈与进入</th>
                  <th scope="col">退出与中断</th>
                  <th scope="col">减少动态效果</th>
                </tr>
              </thead>
              <tbody>
                {MOTION_CATALOGUE.map((rule) => (
                  <tr key={rule.id}>
                    <th scope="row">
                      <a href={`#/components/${rule.id}`}>{rule.name}</a>
                    </th>
                    <td>
                      {rule.feedback}
                      <br />
                      {rule.enter}
                    </td>
                    <td>
                      {rule.exit}
                      <br />
                      {rule.interrupt}
                    </td>
                    <td>{rule.reduced}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
        <a className="r-text-link" href="#/dodont/case-18-motion-restraint">
          比较两种动效 →
        </a>
      </section>
    </article>
  );
}
