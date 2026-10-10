import { DocDisclosure } from "../common/DocDisclosure";
import { ColorContrastCheckerDemo } from "../interactive/InteractiveDemos";
export function AccessibilityView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          面向每一个人，
          <br />
          从默认状态开始。
        </h1>
        <p>以 WCAG 2.2 AA 为目标；现有检查不等于合规认证。</p>
      </header>
      <section>
        <div className="r-section-heading">
          <h2>可验证的要求</h2>
        </div>
        <div className="r-a11y-checklist">
          {[
            [
              "可感知",
              "状态有文字与图形；输入标签始终可见；文本普通对比度 ≥4.5:1，大字及非文本边界 ≥3:1。",
            ],
            [
              "可操作",
              "原生按钮、输入和导航可用键盘。Tab 焦点清楚，模态窗口限制焦点并支持 Escape；返回后恢复焦点。",
            ],
            [
              "可理解",
              "错误说明问题及下一步；修改不静默丢失；开关即时生效，提交式复选框保留应用入口。",
            ],
            [
              "稳健",
              "复合控件只有实现对应键盘模型才使用相应 ARIA 角色；Candidate 保留原生语义，避免虚假 tree / menu / grid。",
            ],
            [
              "缩放与触控",
              "320px 页面可重排；内容放大不截断。触控优先 44px，WCAG 2.2 AA 的 24px 最低目标与间距例外需按场景检查。",
            ],
            [
              "动态偏好",
              "实时尊重 prefers-reduced-motion；网站底部也可选择减少动态效果，直接呈现状态。退场立即停止交互和播报；动态状态使用 polite，不抢夺焦点。",
            ],
          ].map(([t, d]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <div className="r-section-heading">
          <h2>语义色对比度检查</h2>
        </div>
        <p>
          输入取自生成令牌。选择前景与背景，检查正确组合；未通过的任意组合应避免用于正文。
        </p>
        <ColorContrastCheckerDemo />
      </section>
      <DocDisclosure title="验证范围与设备待办">
        <p>
          案例 Don’t
          是隔离的教学反例，可能故意隐藏焦点环、截断文字或依赖单一颜色。它们不属于推荐组件的合规声明。生产应用需要在真实设备上验证
          VoiceOver、NVDA、TalkBack、文字缩放、高对比度和输入方式；这些人工设备检查列入
          Backlog。
        </p>
      </DocDisclosure>
      <section>
        <div className="r-section-heading">
          <h2>阅读与实践</h2>
        </div>
        <div className="r-related-links">
          <a href="#/dodont/case-57-dialog-focus-trap">体验 Dialog 焦点 →</a>
          <a href="#/dodont/case-17-typography-scaling">体验文字放大 →</a>
          <a
            href="https://www.w3.org/WAI/WCAG22/quickref/"
            target="_blank"
            rel="noreferrer"
          >
            WCAG 2.2 快速参考 ↗
          </a>
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
            target="_blank"
            rel="noreferrer"
          >
            APG Modal Dialog ↗
          </a>
        </div>
      </section>
    </article>
  );
}
