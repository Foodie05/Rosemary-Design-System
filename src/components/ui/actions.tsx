import { SelectionGroup, SelectionContent } from "../common/SelectionMotion";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useState } from "react";
import { Plus, ChevronDown, Search } from "lucide-react";
import { Button, DemoMessage, PreviewProps, Tooltip } from "./core";
export function ButtonExample(p: PreviewProps) {
  const [n, set] = useState(0);
  return (
    <div>
      <Button {...p} onClick={() => set(n + 1)}>
        {p.label || "保存更改"}
      </Button>
      <DemoMessage>
        {n ? `已保存 ${n} 次` : "点击保存，观察即时反馈"}
      </DemoMessage>
    </div>
  );
}
export function IconButtonExample(p: PreviewProps) {
  const [open, set] = useState(false);
  return (
    <div>
      <Tooltip text={p.label || "搜索文档"}>
        <Button
          {...p}
          className="r-icon-control"
          aria-label={p.label || "搜索文档"}
          onClick={() => set(!open)}
        >
          <Search aria-hidden="true" />
        </Button>
      </Tooltip>
      {open && (
        <label className="r-field">
          搜索文档
          <input autoFocus type="search" placeholder="输入关键词" />
        </label>
      )}
    </div>
  );
}
export function ButtonGroupExample(p: PreviewProps) {
  const [value, set] = useState("周");
  return (
    <div>
      <SelectionGroup value={value} label="时间范围" className="r-button-group">
        {["日", "周", "月"].map((v) => (
          <Button
            key={v}
            size={p.size}
            disabled={p.disabled}
            aria-pressed={v === value}
            variant={value === v ? "primary" : "secondary"}
            onClick={() => set(v)}
          >
            {v}
          </Button>
        ))}
      </SelectionGroup>
      <SelectionContent value={value} index={["日", "周", "月"].indexOf(value)}>
        <DemoMessage>当前范围：{value}</DemoMessage>
      </SelectionContent>
    </div>
  );
}
export function SplitButtonExample(p: PreviewProps) {
  const { open, present, set, close, root, id } = useDisclosure();
  const [message, save] = useState("选择导出格式");
  return (
    <div className="r-pop-anchor" ref={root}>
      <div className="r-button-group">
        <Button {...p} onClick={() => save("已导出 PDF")}>
          {p.label || "导出 PDF"}
        </Button>
        <Button
          {...p}
          data-disclosure-trigger
          className="r-split-trigger"
          aria-controls={open ? id : undefined}
          aria-label="更多导出选项"
          aria-expanded={open}
          onClick={() => set(!open)}
        >
          <ChevronDown size={16} />
        </Button>
      </div>
      {present && (
        <div className="r-popover" id={id}>
          <Button
            variant="ghost"
            onClick={() => {
              save("已导出 Markdown");
              close();
            }}
          >
            导出 Markdown
          </Button>
          <Button variant="ghost" onClick={close}>
            取消
          </Button>
        </div>
      )}
      <DemoMessage>{message}</DemoMessage>
    </div>
  );
}
export function LinkButtonExample(p: PreviewProps) {
  const [expanded, set] = useState(false);
  return (
    <div>
      <Button
        {...p}
        variant="tertiary"
        onClick={() => set(!expanded)}
        aria-expanded={expanded}
      >
        {p.label || "查看使用说明"}
      </Button>
      {expanded && <p>这是页面内的业务动作；跳转页面使用 a 元素。</p>}
    </div>
  );
}
export function FabExample(p: PreviewProps) {
  const [n, set] = useState(0);
  return (
    <div>
      <Tooltip text={p.label || "新建笔记"}>
        <Button
          {...p}
          className="r-fab"
          aria-label={p.label || "新建笔记"}
          onClick={() => set(n + 1)}
        >
          <Plus aria-hidden="true" />
        </Button>
      </Tooltip>
      <DemoMessage>已创建 {n} 篇笔记</DemoMessage>
    </div>
  );
}
