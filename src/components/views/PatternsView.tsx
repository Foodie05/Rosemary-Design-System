import { DocDisclosure } from "../common/DocDisclosure";
import { DoDontVisualPreview } from "../common/DoDontVisualPreview";
import { DO_DONT_CASES } from "../../data/doDontCases";
const patterns = [
  [
    "pat-autosave",
    "自动保存：状态透明",
    "case-07-autosave-states",
    "在停止输入后开始保存，显示 Saving → Saved / Offline / Failed。用户可以继续编辑，失败有重试入口。模拟器为内存状态机；生产应用必须先持久化草稿，再同步。",
  ],
  [
    "pat-undo",
    "可逆操作：撤销优先",
    "case-06-undo-vs-instant-loss",
    "轻量删除移至回收站，并提供撤销。通知可以暂时显示，但恢复入口不能只依赖短倒计时。真正永久删除才需要二次确认。",
  ],
  [
    "pat-destructive",
    "危险操作：明确范围",
    "case-33-destructive-styling",
    "说明受影响的对象与不可逆后果，保留取消入口。确认时不依赖危险色；用实际对象名称减少误操作，不对日常操作反复弹窗。",
  ],
  [
    "pat-offline",
    "离线：保留工作现场",
    "case-21-offline-resilience",
    "先写本地队列，再进行远程同步。恢复网络后依次处理；冲突保留双版本，交给用户选择。不要把“本地保存”误写成“云端已保存”。",
  ],
  [
    "pat-task",
    "长任务：可取消，可继续",
    "case-20-long-running-tasks",
    "使用真实阶段和完成数量；预计剩余时间只能基于可靠采样。支持后台执行与取消，取消后的文件状态必须明确。",
  ],
];
export function PatternsView() {
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          每一次变化，
          <br />
          都有清晰的下一步。
        </h1>
        <p>
          把状态可见性、用户掌控和错误恢复转化为实际行为。下方模拟与案例页使用同一实现。
        </p>
      </header>
      {patterns.map(([id, title, caseId, rule]) => (
        <section id={id} key={id}>
          <div className="r-section-heading">
            <h2>{title}</h2>
            <a className="r-text-link" href={`#/dodont/${caseId}`}>
              打开案例与 Reset →
            </a>
          </div>
          <p>{rule.split("。")[0]}。</p>
          <DocDisclosure title={`${title.split("：")[0]}：完整规则与对照体验`}>
            <p>{rule}</p>
            <DoDontVisualPreview
              caseData={DO_DONT_CASES.find((c) => c.id === caseId)!}
            />
          </DocDisclosure>
        </section>
      ))}
    </article>
  );
}
