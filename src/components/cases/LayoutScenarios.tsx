import { Slider } from "../ui/Slider";
import { useState } from "react";
import { Button } from "../ui/core";
import { ScenarioProps } from "./types";
export function EmptyGuidance({ good }: ScenarioProps) {
  const [created, set] = useState(false);
  return (
    <div className="r-empty">
      {created ? (
        <>
          <h4>第一篇笔记</h4>
          <p>你的工作区已准备好。</p>
        </>
      ) : (
        <>
          <span className="r-empty-mark">◇</span>
          <h4>{good ? "给想法一个位置" : "暂无数据"}</h4>
          {good && (
            <>
              <p>创建笔记，或从文件导入。</p>
              <Button onClick={() => set(true)}>新建笔记</Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
export function TypeScaling({ good }: ScenarioProps) {
  const [scale, set] = useState(100);
  return (
    <div className="r-stack">
      <label>
        文字大小 {scale}%
        <Slider
          aria-label="文字大小"
          min="100"
          max="200"
          value={scale}
          onChange={(e) => set(+e.target.value)}
        />
      </label>
      <div
        style={{
          fontSize: `${scale}%`,
          height: good ? "auto" : 68,
          overflow: good ? "visible" : "hidden",
        }}
        className="r-type-sample"
      >
        <strong>设计，为真实的人。</strong>
        <p>界面尊重用户选择的文字大小。内容完整可读，操作可以继续。</p>
      </div>
    </div>
  );
}
export function ReadingMeasure({ good }: ScenarioProps) {
  return (
    <div className={good ? "r-reading-good" : "r-reading-bad"}>
      <h4>让阅读有自然的节奏</h4>
      <p>
        内容优先意味着，让每一行文字拥有适当的长度。阅读时，目光可以轻松找到下一行；章节之间保持明确的间隔，使复杂信息也有清晰的入口。
      </p>
      <p>正文不需要填满每一寸屏幕。</p>
    </div>
  );
}
export function Whitespace({ good }: ScenarioProps) {
  return (
    <div className={good ? "r-editorial-sample" : "r-nested-sample"}>
      <h4>工作区概览</h4>
      <div>
        <p>最近活动</p>
        <div>
          <strong>品牌规范已更新</strong>
          <div>
            <p>Lin · 今天 14:26</p>
          </div>
        </div>
      </div>
      <div>
        <p>下一步</p>
        <strong>审核交互规范</strong>
      </div>
    </div>
  );
}
export function BalancedTitle({ good }: ScenarioProps) {
  return (
    <div className="r-title-comparison">
      <h4
        style={{
          textWrap: good ? "balance" : "initial",
          maxWidth: good ? "16ch" : "14ch",
        }}
      >
        让技术拥有秩序，让体验自然发生。
      </h4>
      <span className="r-rule-line" />
      <p>Rosemary · Organic Precision</p>
    </div>
  );
}
export function ResponsiveBalance({ good }: ScenarioProps) {
  const [w, set] = useState(420);
  return (
    <div className="r-stack">
      <label>
        容器宽度 {w}px
        <Slider
          aria-label="容器宽度"
          min="240"
          max="600"
          value={w}
          onChange={(e) => set(+e.target.value)}
        />
      </label>
      <div
        className="r-responsive-stage"
        style={{ width: w, maxWidth: "100%" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: good && w < 360 ? "1fr" : "1fr 1fr",
            alignItems: good ? "stretch" : "start",
            gap: 12,
          }}
        >
          <div className="r-sample-panel">
            <h4>笔记</h4>
            <p>收纳每日灵感与想法。</p>
          </div>
          <div className="r-sample-panel">
            <h4>项目</h4>
            <p>把想法整理成可以执行的计划，并保留每一次推进的记录。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
