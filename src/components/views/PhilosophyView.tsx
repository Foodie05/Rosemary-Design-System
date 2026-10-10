import { DocDisclosure } from "../common/DocDisclosure";
const principles = [
  [
    "内容优先",
    "视觉形式服从任务。最清晰的位置留给用户内容，避免让装饰与状态标签争夺层级。",
    "从实际信息组织界面；正文保持可读宽度，降低无意义框架边界。",
    "case-48-whitespace-over-cards",
  ],
  [
    "自然交互",
    "动作、反馈与预期连接起来。即时操作立即回应，长任务说明进度。",
    "按钮按下即时反馈；加载不移动用户焦点；动画服从减少动态效果偏好。",
    "case-18-motion-restraint",
  ],
  [
    "用户掌控",
    "修改可以回头，失败可以修复。不要把等待和恢复的责任全部交给用户。",
    "可逆操作提供撤销和回收站；真正不可逆的动作才使用明确确认。",
    "case-06-undo-vs-instant-loss",
  ],
  [
    "简洁而不简陋",
    "先给结论和关键操作，再按需展开细节。",
    "默认展示最常用操作；筛选状态始终可见；快捷键提供替代路径。",
    "case-11-filter-transparency",
  ],
  [
    "细节体现品质",
    "对齐、状态、字阶和边界，是可靠性的可见部分。",
    "数字等宽右对齐，错误在字段附近展示，离线时保留草稿。",
    "case-04-form-validation",
  ],
  [
    "以人为本",
    "技术服务于人的时间、专注和能力差异。",
    "WCAG 2.2 AA 为目标；键盘、触控和辅助技术共同参与；错误文案给出下一步。",
    "case-13-keyboard-focus",
  ],
];
export function PhilosophyView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          设计的秩序，
          <br />
          是为了人的自由。
        </h1>
        <p>让内容清楚、操作自然、结果可控。用实际行为验证每一条原则。</p>
      </header>
      <div className="r-reading-grid">
        {principles.map(([title, description]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{description}</p>
          </section>
        ))}
      </div>
      <a className="r-text-link" href="#/content?anchor=content-clarity">
        简洁与认知负担规范 →
      </a>
      <DocDisclosure id="philosophy-practice" title="执行规则与对应案例">
        {principles.map(([title, , rule, id]) => (
          <section key={title}>
            <h3>{title}</h3>
            <p>{rule}</p>
            <a href={`#/dodont/${id}`}>用案例验证 →</a>
          </section>
        ))}
      </DocDisclosure>
      <DocDisclosure id="philosophy-priority" title="价值冲突时的优先级">
        <p>
          操作安全与无障碍 → 用户目标 → 原生惯例 → 交互一致性 → 品牌表达 →
          装饰。优先级用于解释取舍；不以单一风格覆盖平台和用户需求。
        </p>
        <a
          href="https://developer.apple.com/design/human-interface-guidelines/"
          target="_blank"
          rel="noreferrer"
        >
          Apple Human Interface Guidelines 来源 ↗
        </a>
      </DocDisclosure>
    </article>
  );
}
