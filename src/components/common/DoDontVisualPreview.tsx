import { DoDontCase } from "../../types";
import { getCaseImplementation } from "../cases/registry";
export function DoDontVisualPreview({
  caseData,
  thumbnail = false,
}: {
  caseData: DoDontCase;
  thumbnail?: boolean;
}) {
  const { Scene } = getCaseImplementation(caseData.id);
  return (
    <div
      className={thumbnail ? "r-comparison r-thumbnail" : "r-comparison"}
      inert={thumbnail ? true : undefined}
    >
      <div className="r-comparison-side">
        <div className="r-comparison-label">
          <span className="r-do-label">✓ Do</span>
          <span>推荐实现</span>
        </div>
        <div className="r-scenario" data-example="recommended">
          <Scene good preview={thumbnail} />
        </div>
      </div>
      <div className="r-comparison-side">
        <div className="r-comparison-label">
          <span className="r-dont-label">× Don’t</span>
          <span>常见偏差</span>
        </div>
        <div className="r-scenario" data-example="counterexample">
          <Scene good={false} preview={thumbnail} />
        </div>
      </div>
    </div>
  );
}
