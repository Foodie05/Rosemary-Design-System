import { Slider } from "../ui/Slider";
import { useId, useState } from "react";
import { Button, DemoMessage, Status } from "../ui/core";
import { ScenarioProps } from "./types";
export function Validation({ good, preview }: ScenarioProps) {
  const id = useId();
  const [email, set] = useState(preview ? "lin" : "");
  const [touched, touch] = useState(!!preview);
  const [submitted, submit] = useState(!!preview);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const error = !valid && (good ? touched : submitted);
  return (
    <form
      noValidate
      className="r-stack"
      onSubmit={(e) => {
        e.preventDefault();
        submit(true);
        touch(true);
      }}
    >
      <h4>邀请团队成员</h4>
      <label htmlFor={id}>邮箱地址</label>
      <input
        id={id}
        type="email"
        value={email}
        onChange={(e) => {
          set(e.target.value);
          submit(false);
        }}
        onBlur={() => touch(true)}
        aria-invalid={good && error}
        aria-describedby={good && error ? id + "-error" : undefined}
        placeholder="name@example.com"
      />
      {error && (
        <p
          id={id + "-error"}
          className="r-error"
          role={good ? "status" : undefined}
        >
          {good
            ? "请输入完整邮箱，例如 lin@example.com"
            : "提交失败，请检查表单。"}
        </p>
      )}
      <Button type="submit">发送邀请</Button>
      <DemoMessage>
        {submitted && valid ? "邀请已发送（本地模拟）" : ""}
      </DemoMessage>
    </form>
  );
}
export function PersistentLabels({ good }: ScenarioProps) {
  const [v, set] = useState("Lin");
  return (
    <div className="r-stack">
      {good && (
        <label htmlFor={good ? "label-do" : "label-dont"}>显示名称</label>
      )}
      <input
        id={good ? "label-do" : "label-dont"}
        aria-label={good ? "显示名称" : "反例：仅有占位提示的字段"}
        placeholder="显示名称"
        value={v}
        onChange={(e) => set(e.target.value)}
      />
      {good && <small>团队成员将看到这个名称。</small>}
    </div>
  );
}
export function PasswordReveal({ good }: ScenarioProps) {
  const [show, set] = useState(false);
  const [v, save] = useState("rosemary");
  return (
    <label className="r-field">
      密码
      <div className="r-input-row">
        <input
          type={show ? "text" : "password"}
          value={v}
          onChange={(e) => save(e.target.value)}
        />
        {good && (
          <Button
            variant="secondary"
            aria-pressed={show}
            onClick={() => set(!show)}
          >
            {show ? "隐藏" : "显示"}
          </Button>
        )}
      </div>
      <small>使用大小写字母和数字。</small>
    </label>
  );
}
export function LiveSlider({ good }: ScenarioProps) {
  const [v, set] = useState(40);
  return (
    <label className="r-field">
      音量{good && <output>{v}%</output>}
      <Slider
        min="0"
        max="100"
        value={v}
        onChange={(e) => set(+e.target.value)}
        aria-label="音量"
      />
      <div className="r-volume-bars" aria-hidden="true">
        {[20, 40, 60, 80, 100].map((n) => (
          <span key={n} style={{ opacity: v >= n ? 1 : 0.2, height: n / 2 }} />
        ))}
      </div>
    </label>
  );
}
export function TagInput({ good }: ScenarioProps) {
  const [tags, set] = useState(["设计"]);
  const [q, save] = useState("开发,研究");
  return (
    <div className="r-stack">
      <label>
        项目标签
        <input
          value={q}
          onChange={(e) => save(e.target.value)}
          onKeyDown={(e) => {
            if (good && e.key === "Enter") {
              e.preventDefault();
              if (q.trim()) set([...new Set([...tags, q.trim()])]);
              save("");
            }
          }}
        />
      </label>
      {good ? (
        <>
          <div className="r-control-row">
            {tags.map((v) => (
              <span key={v} className="r-tag">
                {v}
                <button
                  aria-label={`移除${v}`}
                  onClick={() => set(tags.filter((t) => t !== v))}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <small>输入标签，按 Enter 添加。</small>
        </>
      ) : (
        <small>用逗号分隔</small>
      )}
    </div>
  );
}
export function UploadValidation({ good, preview }: ScenarioProps) {
  const [result, set] = useState("尚未选择文件");
  const [hover, setHover] = useState(false);
  const check = (f: File | { name: string; size: number; type: string }) =>
    set(
      good
        ? f.type !== "image/png"
          ? "请使用 PNG 文件，已保留当前选择。"
          : f.size > 2097152
            ? "超过 2 MB，请压缩后重试。"
            : `已读取 ${f.name}`
        : "Error 500",
    );
  return (
    <div
      className={`r-upload ${hover && good ? "r-upload-hover" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        if (e.dataTransfer.files[0]) check(e.dataTransfer.files[0]);
      }}
    >
      <label>
        品牌图形
        <input
          type="file"
          accept={good ? "image/png" : undefined}
          onChange={(e) => {
            if (e.target.files?.[0]) check(e.target.files[0]);
          }}
        />
      </label>
      {good && <small>拖入 PNG 文件 · 最大 2 MB · 本地模拟</small>}
      <Button
        size="sm"
        variant="secondary"
        onClick={() =>
          check({ name: "example.pdf", size: 500, type: "application/pdf" })
        }
      >
        模拟不支持的文件
      </Button>
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function SwitchSemantics({ good }: ScenarioProps) {
  const [checked, set] = useState(false);
  const [applied, apply] = useState(false);
  return (
    <div className="r-stack">
      <label className="r-choice">
        <input
          role="switch"
          className="r-switch"
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            set(e.target.checked);
            if (good) apply(e.target.checked);
          }}
        />
        自动同步
      </label>
      <Status tone={applied ? "success" : "info"}>
        同步{applied ? "已开启" : "已关闭"}
      </Status>
      {!good && <Button onClick={() => apply(checked)}>保存设置</Button>}
    </div>
  );
}
export function DateKeyboard({ good }: ScenarioProps) {
  const [value, set] = useState("2026-10-09");
  const [month, next] = useState(10);
  return (
    <div className="r-stack">
      {good ? (
        <label>
          截止日期
          <input
            type="date"
            value={value}
            onChange={(e) => set(e.target.value)}
          />
        </label>
      ) : (
        <>
          <div className="r-control-row">
            <Button size="sm" variant="ghost" onClick={() => next(month - 1)}>
              ‹
            </Button>
            <strong>2026 年 {month} 月</strong>
            <Button size="sm" variant="ghost" onClick={() => next(month + 1)}>
              ›
            </Button>
          </div>
          <div className="r-calendar">
            {Array.from({ length: 28 }, (_, i) => (
              <button key={i} onClick={() => set(`2026-${month}-${i + 1}`)}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
      <DemoMessage>{value}</DemoMessage>
    </div>
  );
}
