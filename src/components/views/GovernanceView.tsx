import { DocDisclosure } from "../common/DocDisclosure";
import { COMPONENT_SPECS } from "../../data/componentsSpec";
import { DO_DONT_CASES } from "../../data/doDontCases";
import { COMPONENT_IMPLEMENTATIONS } from "../playground/registry";
import { getCaseImplementation } from "../cases/registry";
export function GovernanceView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          诚实地发布，
          <br />
          持续地生长。
        </h1>
        <p>能力由源码与验证决定；未验证的实现不标为 Stable。</p>
      </header>
      <section>
        <div className="r-section-heading">
          <h2>当前能力</h2>
        </div>
        <table className="r-table">
          <thead>
            <tr>
              <th>模块</th>
              <th>当前数量</th>
              <th>证据 / 边界</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>案例</th>
              <td>
                {DO_DONT_CASES.length} 个对照 /{" "}
                {
                  DO_DONT_CASES.filter(
                    (c) => getCaseImplementation(c.id).interactive,
                  ).length
                }{" "}
                个交互场景
              </td>
              <td>
                每项注册实际 Scene，包含独立 URL 和双侧
                Reset；教学模拟使用内存数据。
              </td>
            </tr>
            <tr>
              <th>组件</th>
              <td>
                {COMPONENT_SPECS.length} 项 /{" "}
                {
                  Object.values(COMPONENT_IMPLEMENTATIONS).filter(
                    (c) => c.interactive,
                  ).length
                }{" "}
                个交互参考
              </td>
              <td>
                分族源码、共享 Playground、完整规范。
                {
                  COMPONENT_SPECS.filter((c) => c.status === "Candidate").length
                }{" "}
                项 Candidate，其余 Beta。
              </td>
            </tr>
            <tr>
              <th>Tokens</th>
              <td>169 × 2 主题</td>
              <td>
                分层引用、确定性生成，20 组色彩对比度检查。DTCG
                支持子集，非完整转换器。
              </td>
            </tr>
            <tr>
              <th>原生平台</th>
              <td>4 类产物</td>
              <td>
                Dart、Swift、Kotlin、C# 参数生成。Flutter、Compose、SwiftUI
                各 61 项为本地 Prototype，已建立构建和自动测试；
                辅助技术与完整设备验收、WinUI 构建待完成。
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <DocDisclosure id="governance-status" title="状态定义与升级条件">
        <div className="r-a11y-checklist">
          {[
            [
              "Candidate",
              "规范和预览成立，但完整行为或 ARIA 键盘模型尚未完成。",
            ],
            [
              "Beta",
              "本项目可运行的 Web 参考。尚未完成产品集成、广泛兼容与正式包发布。",
            ],
            [
              "Stable",
              "需通过 API、键盘、辅助技术、主题、响应式与产品集成验证；本轮不发布 Stable 组件。",
            ],
            ["Draft", "没有充分可视化或实现支持的内容，不计入正式案例数量。"],
          ].map(([t, d]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </DocDisclosure>
      <section className="r-rule-callout">
        <h2>变更流程</h2>
        <p>
          提出真实用户问题 → 比较备选方案 → 修改令牌或实现 → 关联案例与规范 →
          运行检查 → 在浏览器验证关键路径 → 记录版本和边界。破坏性 API
          或长期品牌变化需要单独记录决策。
        </p>
      </section>
      <DocDisclosure id="governance-history" title="迭代记录与验收下载">
        <ul className="r-prose-list">
          <li>
            三个方向、四种场景的品牌探索；采用 Organic Precision
            并保留原品牌标志。
          </li>
          <li>
            首页、设计哲学、品牌、基础、案例、组件与 Tokens 页重新组织视觉节奏。
          </li>
          <li>
            真实双侧交互与独立详情，分类和计数来自数据；搜索支持直接打开目标。
          </li>
          <li>原生 Dialog、Tabs 键盘模型、可调整分栏；Web 组件按族拆分。</li>
          <li>明暗语义令牌、DTCG 子集与可重复平台输出；删除虚构软件包导入。</li>
          <li>
            工程检查和关键行为测试；WCAG、原生设备和产品发布缺口保留为 Backlog。
          </li>
        </ul>
        <a className="r-text-link" href="/generated/acceptance.json" download>
          下载本轮验收记录 ↓
        </a>
      </DocDisclosure>
    </article>
  );
}
