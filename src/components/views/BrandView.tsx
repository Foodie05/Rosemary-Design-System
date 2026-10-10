import { DocDisclosure } from "../common/DocDisclosure";
import { BrandStudies } from "../brand/BrandStudies";
import { PrecisionGlyph } from "../brand/PrecisionGlyph";
export function BrandView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          有生命感，
          <br />
          也有自己的秩序。
        </h1>
        <p>柔和曲线与清晰坐标，组成同一种视觉语言。</p>
      </header>
      <BrandStudies />
      <DocDisclosure id="brand-identity" title="字体、颜色、几何与图标规则">
        <div className="r-brand-rules">
          <div>
            <span className="r-eyebrow">THE SIGNATURE</span>
            <h2>
              不是一种装饰，
              <br />
              是一套可以迁移的规则。
            </h2>
            <PrecisionGlyph />
          </div>
          <div className="r-brand-rule-list">
            {[
              [
                "Typography",
                "标题使用编辑式衬线，正文使用系统无衬线。正文 16px / 1.7；文档标题 40–52px；首页英文展示 72–100px。中英文标题平衡折行，正文宽度 65–75 字符。",
              ],
              [
                "Color",
                "Pine 为主要意图，Sage 为辅助生命感，Paper 为阅读底色。Clay、Lilac 作为产品辅助与图表系列；成功、危险、警告、信息角色独立调校两个主题。",
              ],
              [
                "Geometry",
                "基础网格 4px，控件转角 8px，面板 16px。品牌曲线由对角线和双向贝塞尔轮廓构成，比例约 1:1.618。叶形仅用于标识、空状态和品牌资产，表单保持规则边界。",
              ],
              [
                "Composition",
                "首页允许不对称双栏与大型图形；文档使用连续章节、细线分隔和少量关键提示面。产品界面把最高对比度留给用户内容。",
              ],
              [
                "Motion",
                "悬停 120ms，选择 150ms，展开 240ms；浮层进入 180ms、退出 120ms。只对需要解释的变化动效；减少动态效果下直接呈现状态，保留文字与操作。",
              ],
              [
                "Iconography",
                "20px 画布、1.75px 线宽、圆端点，保持光学重量。产品图标延续现有 Rosemary 分割标志结构，辅助色与内部符号区分产品；语义图标提供文字替代。",
              ],
            ].map(([title, rule], i) => (
              <div key={title}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{rule}</p>
              </div>
            ))}
          </div>
        </div>
      </DocDisclosure>
      <section id="logo-usage">
        <div className="r-section-heading">
          <h2>标志与字标</h2>
        </div>
        <div className="r-logo-specimen">
          <img
            src="https://dl.cruty.cn/logo/rosemary_pure.png"
            alt="现有 Rosemary 品牌标志"
          />
          <span>Rosemary</span>
          <small>
            保护空间 ≥ 标志宽度的 ¼<br />
            保持原有比例，不重绘、不拉伸
          </small>
        </div>
      </section>
      <section id="app-icons">
        <div className="r-section-heading">
          <h2>同一个家族，各自的性格。</h2>
        </div>
        <div className="r-product-icons">
          {[
            ["R", "Design", "pine"],
            ["N", "Notes", "clay"],
            ["P", "Prober", "lilac"],
          ].map(([letter, name, color]) => (
            <div key={name}>
              <span className={`r-family-icon r-family-${color}`}>
                {letter}
              </span>
              <strong>Rosemary {name}</strong>
              <small>家族方向示例，尚非发布图标</small>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
