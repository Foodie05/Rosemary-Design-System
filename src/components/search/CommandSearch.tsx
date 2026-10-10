import { NAV_ITEMS } from "../../data/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { DO_DONT_CASES } from "../../data/doDontCases";
import { COMPONENT_SPECS } from "../../data/componentsSpec";
import { DESIGN_TOKENS } from "../../data/tokens";
import { getCaseImplementation } from "../cases/registry";
import { Modal } from "../ui/core";
import { SectionId } from "../../types";
export function CommandSearch({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (s: SectionId, a?: string) => void;
}) {
  const [query, set] = useState("");
  const [active, select] = useState(0);
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isOpen) {
      set("");
      select(0);
      input.current?.focus();
    }
  }, [isOpen]);
  const all = [
    ...NAV_ITEMS.map((v) => ({
      title: `${v.title} · ${v.subtitle}`,
      desc: "设计规范章节",
      href: `#/${v.id}`,
      kind: "规范",
    })),
    ...COMPONENT_SPECS.map((c) => ({
      title: `${c.name} · ${c.nameZh}`,
      desc: c.description,
      href: `#/components/${c.id}`,
      kind: "组件",
    })),
    ...DO_DONT_CASES.map((c) => ({
      title: getCaseImplementation(c.id).title,
      desc: c.summary + " " + c.tags.join(" "),
      href: `#/dodont/${c.id}`,
      kind: "案例",
    })),
    ...DESIGN_TOKENS.map((t) => ({
      title: t.name,
      desc: t.description,
      href: `#/tokens?query=${encodeURIComponent(t.name)}`,
      kind: "令牌",
    })),
  ];
  const results = all
    .filter((v) =>
      `${v.title} ${v.desc}`.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .slice(0, 16);
  useEffect(() => {
    if (isOpen)
      document
        .getElementById(`${id}-${active}`)
        ?.scrollIntoView?.({ block: "nearest" });
  }, [active, query, isOpen, id]);
  return (
    <Modal open={isOpen} onClose={onClose} title="搜索设计系统" kind="search">
      <div className="r-command-search">
        <label className="r-field">
          规范、组件、案例或设计令牌
          <input
            ref={input}
            autoFocus
            type="search"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls={`${id}-results`}
            aria-activedescendant={
              results[active] ? `${id}-${active}` : undefined
            }
            placeholder="试试「按钮」「撤销」「accent」"
            value={query}
            onChange={(e) => {
              set(e.target.value);
              select(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                select(Math.max(0, Math.min(active + 1, results.length - 1)));
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                select(Math.max(active - 1, 0));
              }
              if (e.key === "Enter" && results[active]) {
                e.preventDefault();
                location.hash = results[active].href;
                onClose();
              }
            }}
          />
        </label>
        <p className="r-muted" role="status">
          {results.length
            ? `显示 ${results.length} 条结果 · ↑ ↓ 选择，Enter 打开`
            : "没有匹配结果；尝试更短的关键词。"}
        </p>
        <ul
          className="r-search-results"
          role="listbox"
          aria-label="搜索结果"
          id={`${id}-results`}
        >
          {results.map((v, i) => (
            <li key={v.href} role="presentation">
              <a
                id={`${id}-${i}`}
                role="option"
                aria-selected={i === active}
                tabIndex={-1}
                href={v.href}
                className={i === active ? "is-selected" : ""}
                onClick={onClose}
              >
                <span>
                  <small>{v.kind}</small>
                  <strong>{v.title}</strong>
                </span>
                <span>↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
