import { DoDontCase } from "../../types";
import { getCaseImplementation } from "../cases/registry";
import { DoDontVisualPreview } from "./DoDontVisualPreview";
export function DoDontCard({ caseData }: { caseData: DoDontCase }) {
  const impl = getCaseImplementation(caseData.id);
  return (
    <article className="r-case-card">
      <div className="r-case-preview" aria-hidden="true">
        <DoDontVisualPreview caseData={caseData} thumbnail />
      </div>
      <div className="r-case-card-body">
        <div className="r-eyebrow">
          <span>{caseData.category}</span>
          <span>{impl.interactive ? "↗ 可交互" : "视觉对照"}</span>
        </div>
        <h2>
          <a href={`#/dodont/${caseData.id}`}>{impl.title}</a>
        </h2>
        <p>{caseData.summary}</p>
        <div className="r-case-card-bottom">
          <span>CASE {String(caseData.number).padStart(2, "0")}</span>
          <span>查看案例 →</span>
        </div>
      </div>
    </article>
  );
}
