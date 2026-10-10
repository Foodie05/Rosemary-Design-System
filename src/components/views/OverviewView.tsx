import { useSessionState } from "../../hooks/useSessionState";
import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { SectionId } from "../../types";
import { PrecisionGlyph } from "../brand/PrecisionGlyph";
import { DocDisclosure } from "../common/DocDisclosure";
export function OverviewView(_props: {
  onNavigate: (section: SectionId, child?: string) => void;
}) {
  const [auto, toggle] = useState(true);
  const [note, setNote] = useSessionState(
    "overview-note",
    "让一个想法，自然生长。",
  );
  return (
    <div className="r-home r-home-compact">
      <section className="r-hero" id="intro">
        <div className="r-hero-copy">
          <div className="r-eyebrow">
            <span className="r-dot" /> ROSEMARY DESIGN SYSTEM{" "}
            <span className="r-version">v2.0 Beta</span>
          </div>
          <h1>
            Organic
            <br />
            <em>precision.</em>
          </h1>
          <h2>有机的生命感，精密的秩序感。</h2>
          <p>为独立软件提供清晰、自然的界面规范。</p>
          <div className="r-hero-actions">
            <a className="r-button r-primary r-lg" href="#/components">
              开始构建 <ArrowRight aria-hidden="true" />
            </a>
            <a className="r-text-link" href="#/philosophy">
              设计原则 <ArrowUpRight aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="r-hero-art" aria-hidden="true">
          <div className="r-art-index">
            <span>Rosemary 视觉语言</span>
            <span>001</span>
          </div>
          <PrecisionGlyph />
        </div>
      </section>
      <section className="r-reading-grid" aria-label="按任务进入指南">
        {[
          ["dodont", "比较体验", "通过案例理解设计取舍。"],
          ["tokens", "查看参数", "共用颜色、排版与动效令牌。"],
          ["ai-guide", "接入 AI 项目", "让 AI 查阅同一份指南。"],
        ].map(([url, title, text]) => (
          <div className="r-guide-entry" key={url}>
            <h2>
              <a href={`#/${url}`}>
                {title} <ArrowUpRight aria-hidden="true" />
              </a>
            </h2>
            <p>{text}</p>
          </div>
        ))}
      </section>
      <DocDisclosure id="home-demo" title="体验控件与笔记">
        <div className="r-stack r-home-demo">
          <label className="r-choice">
            <input
              type="checkbox"
              role="switch"
              className="r-switch"
              checked={auto}
              onChange={(e) => toggle(e.target.checked)}
            />
            自动同步
          </label>
          <p role="status">{auto ? "已开启 · 本地演示" : "已关闭"}</p>
          <label htmlFor="home-note">编辑示例笔记</label>
          <textarea
            id="home-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />
          <small>当前会话保留草稿。</small>
        </div>
      </DocDisclosure>
    </div>
  );
}
