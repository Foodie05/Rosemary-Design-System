import { DocDisclosure } from "../common/DocDisclosure";
const rules = [
  ["结论在前", "先说明用途、当前状态和下一步。"],
  ["按需展开", "默认显示关键规则，细节放在有名称的章节。"],
  ["一段一件事", "用日常词语和短句，删除重复介绍。"],
  ["选择有主次", "每组操作突出一个主要动作。"],
  ["重要信息常显", "错误、风险、选中条件和实现边界不折叠。"],
  ["完整内容可达", "章节可直接访问、键盘展开；正文可重排。"],
];
export function ContentView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          让每一句话，
          <br />
          都有用处。
        </h1>
        <p>清楚说明，减少重复；让用户按需要阅读。</p>
      </header>
      <section id="content-clarity">
        <h2>简洁与认知负担</h2>
        <div className="r-reading-grid">
          {rules.map(([title, text]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <a href="/guide/content.md">完整规范与验收方法 →</a>
      </section>
      <DocDisclosure id="content-review" title="页面与文案的验收规则">
        <ul className="r-prose-list">
          <li>首页只回答是什么、从哪里开始；不重复整本指南。</li>
          <li>
            页面导语以一至两句说明用途；每段优先不超过三句。长规范先给摘要，再分章节。
          </li>
          <li>目录按任务分类，先显示一批结果；搜索仍覆盖完整目录。</li>
          <li>不得用缩小字体、截断重要内容、隐藏错误或清除功能来制造简洁。</li>
          <li>
            展开标签说明内容；深链接自动展开目标，键盘和浏览器查找可以到达完整内容。
          </li>
          <li>
            以真实任务检查：能否找到入口、识别当前状态、读到必要风险，并完成下一步。字数预算是
            Rosemary 编辑准则，不是 Apple 或 WCAG 的合规阈值。
          </li>
        </ul>
      </DocDisclosure>
      <DocDisclosure id="content-examples" title="微文案对照">
        <div className="r-table-scroll">
          <table className="r-table">
            <caption>状态和恢复动作必须真实</caption>
            <thead>
              <tr>
                <th scope="col">场景</th>
                <th scope="col">推荐</th>
                <th scope="col">避免</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["网络中断", "未能连接服务器。可以重试。", "Error 500！"],
                [
                  "权限申请",
                  "允许使用麦克风来录制语音？",
                  "为了更好的服务，请授权。",
                ],
                ["可恢复删除", "移入回收站，可撤销。", "狠心丢弃"],
                ["空状态", "还没有监控项。添加服务器开始监控。", "空空如也～"],
              ].map(([scene, good, bad]) => (
                <tr key={scene}>
                  <th scope="row">{scene}</th>
                  <td>{good}</td>
                  <td>{bad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          只有确实持久化成功，才说“草稿已保存”。必要的恢复范围与期限必须明确。
        </p>
      </DocDisclosure>
      <DocDisclosure id="content-typography" title="排印、来源与适用边界">
        <p>
          正文保持
          16px、可读行距与合理行宽。中英文混排留空格，状态同时使用文字。文本缩放时允许容器增高与换行。
        </p>
        <div className="r-related-links">
          <a href="https://developer.apple.com/design/human-interface-guidelines/disclosure-controls">
            Apple：按需展示细节 ↗
          </a>
          <a href="https://www.w3.org/WAI/WCAG2/supplemental/objectives/o3-clear-content/">
            W3C：清晰可理解内容 ↗
          </a>
          <a href="https://www.w3.org/WAI/tips/writing/">
            WAI：简洁与有意义的标题 ↗
          </a>
        </div>
        <p>
          W3C 认知建议是 WCAG 的补充指南；这里的编辑预算由 Rosemary
          制定，不是合规认证。
        </p>
      </DocDisclosure>
    </article>
  );
}
