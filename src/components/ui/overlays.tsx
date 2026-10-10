import { useDisclosure } from "../../hooks/useDisclosure";
import { useState } from "react";
import { Button, DemoMessage, PreviewProps, Tooltip } from "./core";
import { DialogExample } from "./feedback";
export function TooltipExample(p: PreviewProps) {
  const [saved, save] = useState(false);
  return (
    <div className="r-stack">
      <Tooltip text="保存当前示例的更改">
        <Button {...p} onClick={() => save(true)}>
          {p.label || "保存"}
        </Button>
      </Tooltip>
      <DemoMessage>
        {saved ? "更改已保存（本次示例）" : "更改尚未保存"}
      </DemoMessage>
    </div>
  );
}
export function PopoverExample(p: PreviewProps) {
  const { open, present, set, close, root, id } = useDisclosure();
  const [filter, update] = useState(false);
  const [draft, setDraft] = useState(false);
  return (
    <div className="r-pop-anchor" ref={root}>
      <Button
        {...p}
        data-disclosure-trigger
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          setDraft(filter);
          set(!open);
        }}
      >
        {p.label || "筛选文件"}
      </Button>
      {present && (
        <div
          className="r-popover"
          id={id}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          <label className="r-choice">
            <input
              type="checkbox"
              checked={draft}
              onChange={(e) => setDraft(e.target.checked)}
            />
            仅看已收藏
          </label>
          <Button
            variant="secondary"
            onClick={() => {
              update(draft);
              close();
            }}
          >
            应用并关闭
          </Button>
        </div>
      )}
      <DemoMessage>{filter ? "筛选：仅看已收藏" : "显示全部文件"}</DemoMessage>
    </div>
  );
}
export function DropdownExample(p: PreviewProps) {
  const { open, present, set, close, root, id } = useDisclosure();
  const [result, save] = useState("");
  return (
    <div className="r-pop-anchor" ref={root}>
      <Button
        {...p}
        data-disclosure-trigger
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => set(!open)}
      >
        {p.label || "更多操作"} ⌄
      </Button>
      {present && (
        <div
          className="r-popover"
          id={id}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              set(false);
              (e.currentTarget.previousElementSibling as HTMLElement)?.focus();
            }
          }}
        >
          {["复制链接", "重命名", "移至回收站"].map((v) => (
            <Button
              key={v}
              variant="ghost"
              onClick={() => {
                save(`已选择操作：${v}`);
                close();
              }}
            >
              {v}
            </Button>
          ))}
        </div>
      )}
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function ContextExample(p: PreviewProps) {
  const { open, present, set, openAt, close, root, id } = useDisclosure();
  const [result, save] = useState("");
  return (
    <div
      className="r-context-region"
      ref={root}
      onContextMenu={(e) => {
        if (!p.disabled) {
          e.preventDefault();
          openAt(e.clientX, e.clientY);
        }
      }}
    >
      <Button
        {...p}
        data-disclosure-trigger
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => set(!open)}
        onKeyDown={(e) => {
          if (e.key === "F10" && e.shiftKey) {
            e.preventDefault();
            set(true);
          }
        }}
      >
        {p.label || "文件操作（也可右键）"}
      </Button>
      {present && (
        <div
          className="r-popover"
          id={id}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
          }}
        >
          {["打开", "复制", "关闭菜单"].map((v) => (
            <Button
              variant="ghost"
              key={v}
              onClick={() => {
                save(v);
                close();
              }}
            >
              {v}
            </Button>
          ))}
        </div>
      )}
      <DemoMessage>{result}</DemoMessage>
    </div>
  );
}
export function DrawerExample(p: PreviewProps) {
  return <DialogExample {...p} kind="drawer" />;
}
