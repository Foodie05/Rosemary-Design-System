import { SelectionGroup, SelectionContent } from "../common/SelectionMotion";
import { useState } from "react";
import { BRAND_STUDIES as options } from "../../data/brandExplorations";
export function BrandStudies() {
  const [index, set] = useState(2);
  const o = options[index];
  return (
    <section id="visual-explorations" className="r-brand-studies">
      <div className="r-section-heading">
        <div>
          <span className="r-eyebrow">三个品牌方向</span>
          <h2>先探索，再建立规则。</h2>
        </div>
      </div>
      <SelectionGroup value={index} label="品牌方向" className="r-study-tabs">
        {options.map((v, i) => (
          <button key={v.id} aria-pressed={i === index} onClick={() => set(i)}>
            <span>{v.name}</span>
            <strong>{v.zh}</strong>
            {i === 2 && <small>默认采用</small>}
          </button>
        ))}
      </SelectionGroup>
      <SelectionContent
        value={index}
        index={index}
        className={`r-study-board r-study-${o.id}`}
      >
        <div className="r-study-home">
          <span>Rosemary Design</span>
          <h3>
            {o.id === "instrument" ? "SYSTEM_02" : "Thoughtfully"}
            <br />
            <em>{o.id === "instrument" ? "READY." : "natural."}</em>
          </h3>
          <p>自然的体验，源自审慎的思考。</p>
          <div className="r-study-shape" />
          <span className="r-study-button">开始构建 →</span>
        </div>
        <div className="r-study-doc">
          <span>文档预览</span>
          <h3>
            设计应当
            <br />
            尊重人的节奏。
          </h3>
          <p>
            让内容拥有合适的空间。让关键操作清晰可见。让错误之后仍然有路可走。
          </p>
          <hr />
          <strong>01 — 内容优先</strong>
          <div className="r-study-lines">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="r-study-controls">
          <span>控件预览</span>
          <h3>Intent, made visible.</h3>
          <div>
            <span className="r-study-button">保存更改</span>
            <span className="r-study-button r-study-secondary">取消</span>
          </div>
          <div className="r-study-input">
            项目名称 <span>Rosemary Notes</span>
          </div>
          <div className="r-study-state">
            ✓ 已同步 <span>△ 等待审核</span>
          </div>
        </div>
        <div className="r-study-app">
          <div className="r-study-toolbar">
            Rosemary Notes <span>⌕ · ＋</span>
          </div>
          <div>
            <nav>
              ▤ 工作区
              <br />☆ 收藏
              <br />◷ 最近
            </nav>
            <article>
              <span>DESIGN JOURNAL</span>
              <h3>
                让一个想法
                <br />
                自然生长。
              </h3>
              <div className="r-study-lines">
                <i />
                <i />
                <i />
              </div>
              <span>✓ 草稿已保存</span>
            </article>
          </div>
        </div>
      </SelectionContent>
      <div className="r-study-decision">
        <div>
          <h3>{o.zh}</h3>
          <p>{o.desc}</p>
        </div>
        <dl>
          {["品牌识别", "内容阅读", "跨产品适用", "实现成本"].map(
            (label, i) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{o.scores[i]}</dd>
              </div>
            ),
          )}
        </dl>
      </div>
      <p className="r-brand-decision-note">
        <strong>长期品牌选择：</strong>默认采用 03，把衬线字、松绿 /
        纸色关系、精密网格与叶形曲线作为家族识别。原因是它同时支持品牌展示、长文和高密度工具。保留现有
        Rosemary
        标志；新图形是视觉语言辅助资产，不替换商标。字体在系统回退下仍需保持层级。
      </p>
    </section>
  );
}
