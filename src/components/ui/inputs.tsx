import { Slider } from "./Slider";
import { Select } from "./Select";
import { useSitePreferences } from "../../context/SitePreferences";
import { tokenModes } from "../../generated/tokens";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button, PreviewProps, DemoMessage, Tooltip, Modal } from "./core";
export function TextInput({
  kind = "text",
  ...p
}: PreviewProps & { kind?: string }) {
  const id = useId();
  const { mode } = useSitePreferences();
  const [value, set] = useState(
    kind === "color" ? tokenModes[mode]["semantic.color.accent"].value : "",
  );
  const [show, reveal] = useState(false);
  const [submitted, submit] = useState(false);
  const rangeError =
    kind === "number" &&
    value !== "" &&
    (!Number.isInteger(Number(value)) ||
      Number(value) < 0 ||
      Number(value) > 99);
  const error =
    p.error ||
    rangeError ||
    (submitted &&
      ["text", "textarea", "password"].includes(kind) &&
      value.length < 3);
  const type = kind === "password" ? (show ? "text" : "password") : kind;
  return (
    <form
      className="r-input-example"
      onSubmit={(e) => {
        e.preventDefault();
        submit(true);
      }}
    >
      <label htmlFor={id}>
        {p.label ||
          {
            password: "密码",
            search: "搜索笔记",
            number: "数量",
            date: "日期",
            time: "时间",
            color: "标签颜色",
          }[kind] ||
          "项目名称"}
      </label>
      <div className="r-input-row">
        {kind === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => {
              set(e.target.value);
              submit(false);
            }}
            disabled={p.disabled}
            aria-invalid={error}
            aria-describedby={id + "-help"}
            rows={3}
            placeholder="记录你的想法"
          />
        ) : (
          <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => {
              set(e.target.value);
              submit(false);
            }}
            disabled={p.disabled}
            aria-invalid={error}
            aria-describedby={id + "-help"}
            min={kind === "number" ? 0 : undefined}
            max={kind === "number" ? 99 : undefined}
            className={`r-input r-${p.size || "md"}`}
            placeholder={kind === "search" ? "输入关键词" : "输入内容"}
          />
        )}
        {kind === "password" && (
          <Tooltip text={show ? "隐藏密码" : "显示密码"}>
            <Button
              disabled={p.disabled}
              variant="secondary"
              aria-label={show ? "隐藏密码" : "显示密码"}
              aria-pressed={show}
              onClick={() => reveal(!show)}
              type="button"
            >
              {show ? (
                <EyeOff aria-hidden="true" />
              ) : (
                <Eye aria-hidden="true" />
              )}
            </Button>
          </Tooltip>
        )}
      </div>
      <small id={id + "-help"} className={error ? "r-error" : "r-muted"}>
        {kind === "number"
          ? "请输入 0–99 之间的整数"
          : error
            ? "请填写至少 3 个字符"
            : kind === "password"
              ? "密码至少需要 3 个字符（示例规则）"
              : "填写项目内容，完成后可以验证"}
      </small>
      {["text", "textarea", "password"].includes(kind) && (
        <Button
          disabled={p.disabled}
          size="sm"
          type="submit"
          variant="secondary"
        >
          验证
        </Button>
      )}
      <DemoMessage>
        {submitted && !error
          ? "已提交"
          : kind === "search"
            ? `搜索结果：${["设计规范", "交互笔记", "组件说明"].filter((v) => v.includes(value)).join("、") || "无匹配；尝试「设计」"}`
            : value
              ? `当前值：${kind === "password" ? "•".repeat(value.length) : value}`
              : "等待输入"}
      </DemoMessage>
    </form>
  );
}
export function CheckboxExample(p: PreviewProps) {
  const [checked, set] = useState(false);
  return (
    <div>
      <label className="r-choice">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => set(e.target.checked)}
          disabled={p.disabled}
        />
        {p.label || "包含历史版本"}
      </label>
      <DemoMessage>
        {checked ? "下次提交将包含历史版本" : "下次提交将只包含当前版本"}
      </DemoMessage>
    </div>
  );
}
export function RadioExample(p: PreviewProps) {
  const [value, set] = useState("自动");
  const name = useId();
  return (
    <fieldset className="r-radio-group" disabled={p.disabled}>
      <legend>{p.label || "同步方式"}</legend>
      {["自动", "手动", "仅 Wi-Fi"].map((v) => (
        <label key={v} className="r-choice">
          <input
            name={name}
            type="radio"
            value={v}
            checked={value === v}
            onChange={() => set(v)}
          />
          {v}
        </label>
      ))}
    </fieldset>
  );
}
export function SwitchExample(p: PreviewProps) {
  const [value, set] = useState(false);
  return (
    <div>
      <label className="r-choice">
        <input
          type="checkbox"
          role="switch"
          className="r-switch"
          checked={value}
          disabled={p.disabled}
          onChange={(e) => set(e.target.checked)}
        />
        {p.label || "自动同步"}
      </label>
      <DemoMessage>{value ? "已开启，立即生效" : "已关闭"}</DemoMessage>
    </div>
  );
}
export function SliderExample(p: PreviewProps) {
  const [value, set] = useState(50);
  return (
    <label className="r-field">
      {p.label || "缩放比例"}
      <output>{value}%</output>
      <Slider
        aria-label={p.label || "缩放比例"}
        min="0"
        max="100"
        value={value}
        disabled={p.disabled}
        onChange={(e) => set(+e.target.value)}
        aria-valuetext={`${value}%`}
      />
    </label>
  );
}
export function SelectExample(p: PreviewProps) {
  const [value, set] = useState("上海");
  const [open, setOpen] = useState(false);
  const options = ["上海", "北京", "广州"].map((value) => ({
    value,
    label: value,
  }));
  return (
    <div className="r-stack">
      <label className="r-field">
        {p.label || "地区"}
        <Select
          value={value}
          disabled={p.disabled}
          onValueChange={set}
          label={p.label || "地区"}
          options={options}
        />
      </label>
      <DemoMessage>已选择：{value}</DemoMessage>
      <Button
        variant="secondary"
        disabled={p.disabled}
        onClick={() => setOpen(true)}
      >
        在对话框中选择
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="选择地区">
        <p>选择后立即应用。可以用 Escape 关闭列表，再关闭对话框。</p>
        <label className="r-field">
          对话框内地区
          <Select
            value={value}
            onValueChange={set}
            label="对话框内地区"
            options={options}
            disabled={p.disabled}
          />
        </label>
        <div className="r-control-row">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            关闭
          </Button>
        </div>
      </Modal>
    </div>
  );
}
export function ComboBoxExample(p: PreviewProps) {
  const id = useId();
  const [value, set] = useState("");
  return (
    <label className="r-field">
      {p.label || "选择或输入标签"}
      <input
        list={id}
        value={value}
        disabled={p.disabled}
        onChange={(e) => set(e.target.value)}
      />
      <datalist id={id}>
        <option value="设计" />
        <option value="开发" />
        <option value="研究" />
      </datalist>
      <small>使用原生 datalist；弹层行为由浏览器决定。</small>
    </label>
  );
}
export function FileUploadExample(p: PreviewProps) {
  const [message, set] = useState("支持 PNG / JPEG，最大 2 MB");
  const [dragging, setDragging] = useState(false);
  const check = (file?: File) => {
    if (file)
      set(
        !["image/png", "image/jpeg"].includes(file.type)
          ? "格式不支持，请选择 PNG 或 JPEG"
          : file.size > 2097152
            ? "文件过大，请控制在 2 MB 内"
            : `已选择 ${file.name} · ${Math.ceil(file.size / 1024)} KB（本地示例，不上传）`,
      );
  };
  return (
    <div
      className="r-upload"
      data-dragging={dragging || undefined}
      onDragOver={(e) => {
        e.preventDefault();
        if (!p.disabled) setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node))
          setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (!p.disabled) check(e.dataTransfer.files[0]);
      }}
    >
      <label>
        {p.label || "上传品牌图形"}
        <input
          type="file"
          accept="image/png,image/jpeg"
          disabled={p.disabled}
          onChange={(e) => check(e.target.files?.[0])}
        />
      </label>
      <DemoMessage>{message}</DemoMessage>
    </div>
  );
}
