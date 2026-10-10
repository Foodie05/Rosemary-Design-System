import { SelectionGroup, usePanelMotion } from "./SelectionMotion";
import { Button } from "../ui/core";
import { useEffect, useRef, useState } from "react";
interface CodeSnippet {
  language: string;
  code: string;
  label?: string;
}
export function CodeBlock({
  snippets,
  code,
  language = "tsx",
  title,
}: {
  snippets?: CodeSnippet[];
  code?: string;
  language?: string;
  title?: string;
}) {
  const [tab, set] = useState(0);
  const [copied, copy] = useState("");
  const text = snippets?.[tab]?.code || code || "";
  const codeRef = useRef<HTMLElement>(null);
  const panel = useRef<HTMLPreElement>(null);
  usePanelMotion(panel, tab, tab);
  useEffect(() => copy(""), [text]);
  return (
    <div className="r-code-block" data-theme="dark">
      <div className="r-code-toolbar">
        <span>{title || snippets?.[tab]?.language || language}</span>
        {snippets && (
          <SelectionGroup
            value={tab}
            label="代码语言"
            className="r-code-tabs"
            indicator
          >
            {snippets.map((s, i) => (
              <Button
                variant="ghost"
                size="sm"
                key={i}
                aria-pressed={tab === i}
                onClick={() => set(i)}
              >
                {s.label || s.language}
              </Button>
            ))}
          </SelectionGroup>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(text);
              copy("已复制");
            } catch {
              const selection = window.getSelection();
              const range = document.createRange();
              if (codeRef.current) {
                range.selectNodeContents(codeRef.current);
                selection?.removeAllRanges();
                selection?.addRange(range);
              }
              copy("自动复制未完成；代码已选中，请使用系统复制快捷键。");
            }
          }}
        >
          复制代码
        </Button>
      </div>
      <pre ref={panel} tabIndex={0} aria-label={title || "代码参考"}>
        <code ref={codeRef}>{text}</code>
      </pre>
      {copied && (
        <p className="r-copy-status" role="status">
          {copied}
        </p>
      )}
    </div>
  );
}
