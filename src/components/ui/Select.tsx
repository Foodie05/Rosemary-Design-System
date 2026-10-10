import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import { popupMotionOffset, usePresence } from "../../hooks/usePresence";

export type SelectOption = { value: string; label: string; disabled?: boolean };
export interface SelectProps {
  value: string | number;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}
/** Controlled single choice; highlighted options are only committed on confirmation. */
export function Select({
  value,
  onValueChange,
  options,
  label,
  id,
  name,
  disabled,
  ...aria
}: SelectProps) {
  const generated = useId();
  const triggerId = id || generated;
  const listId = `${triggerId}-list`;
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  const { present, phase } = usePresence(open);
  const [active, setActive] = useState(-1);
  const [fallback, setFallback] = useState<HTMLElement | null>(null);
  const [popupTheme, setPopupTheme] = useState<string | undefined>();
  const prefix = useRef({ text: "", time: 0 });
  const selected = options.findIndex((o) => o.value === String(value));
  const enabled = options
    .map((o, i) => (o.disabled ? -1 : i))
    .filter((i) => i >= 0);
  const unavailable = disabled || !enabled.length;
  const close = (restore = false) => {
    setOpen(false);
    prefix.current.text = "";
    if (restore) trigger.current?.focus({ preventScroll: true });
  };
  const show = (index?: number) => {
    if (unavailable) return;
    setActive(index ?? (enabled.includes(selected) ? selected : enabled[0]));
    const scope = trigger.current?.closest<HTMLElement>("[data-theme]");
    setPopupTheme(scope?.tagName === "HTML" ? undefined : scope?.dataset.theme);
    setOpen(true);
  };
  const commit = (index: number) => {
    if (!options[index] || options[index].disabled) return;
    onValueChange(options[index].value);
    close(true);
  };
  const previousValue = useRef(value);
  useEffect(() => {
    if (previousValue.current !== value || unavailable) close();
    previousValue.current = value;
  }, [value, unavailable]);
  useLayoutEffect(() => {
    if (!open || !popup.current || !trigger.current) return;
    const panel = popup.current;
    const native = typeof panel.showPopover === "function";
    if (!native && !fallback) {
      setFallback(
        trigger.current.closest<HTMLElement>("dialog[open]") || document.body,
      );
      return;
    }
    const anchor = trigger.current.getBoundingClientRect();
    const width = document.documentElement.clientWidth || innerWidth;
    Object.assign(panel.style, {
      position: "fixed",
      inset: "auto",
      margin: "0",
      width: `${Math.min(Math.max(anchor.width, 160), width - 32)}px`,
      maxHeight: `${Math.min(320, innerHeight - 32)}px`,
    });
    if (native) {
      panel.setAttribute("popover", "manual");
      panel.showPopover();
    }
    const bounds = panel.getBoundingClientRect();
    let top = anchor.bottom + 8;
    panel.dataset.side = "below";
    if (top + bounds.height > innerHeight - 16) {
      top = anchor.top - bounds.height - 8;
      panel.dataset.side = "above";
    }
    top = Math.max(16, Math.min(top, innerHeight - bounds.height - 16));
    panel.style.setProperty(
      "--r-popup-offset",
      `${popupMotionOffset(top, bounds.height, innerHeight, panel.dataset.side === "above")}px`,
    );
    Object.assign(panel.style, {
      left: `${Math.max(16, Math.min(anchor.left, width - bounds.width - 16))}px`,
      top: `${top}px`,
    });
    return () => {
      if (native && panel.matches(":popover-open")) panel.hidePopover();
    };
  }, [open, fallback]);
  useLayoutEffect(() => {
    if (!open || active < 0 || !popup.current) return;
    const panel = popup.current;
    const option = panel.querySelector<HTMLElement>(
      `[data-option-index="${active}"]`,
    );
    if (!option) return;
    if (option.offsetTop < panel.scrollTop) panel.scrollTop = option.offsetTop;
    else if (
      option.offsetTop + option.offsetHeight >
      panel.scrollTop + panel.clientHeight
    )
      panel.scrollTop =
        option.offsetTop + option.offsetHeight - panel.clientHeight;
  }, [open, active, fallback]);
  useEffect(() => {
    if (!open) return;
    const inside = (target: EventTarget | null) =>
      target instanceof Node &&
      (trigger.current?.contains(target) || popup.current?.contains(target));
    const outside = (event: Event) => {
      if (!inside(event.target)) close();
    };
    const scroll = (event: Event) => {
      if (
        !(event.target instanceof Node) ||
        !popup.current?.contains(event.target)
      )
        close();
    };
    const resize = () => close();
    document.addEventListener("pointerdown", outside);
    document.addEventListener("focusin", outside);
    window.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("focusin", outside);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const panel = present && (
    <span
      ref={popup}
      id={listId}
      role="listbox"
      aria-label={open ? label : undefined}
      className="r-select-list"
      data-theme={popupTheme}
      data-motion-state={phase}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
    >
      {options.map((option, i) => (
        <span
          key={option.value}
          id={`${listId}-${i}`}
          role="option"
          aria-selected={i === selected}
          aria-disabled={option.disabled || undefined}
          data-option-index={i}
          data-active={i === active || undefined}
          className="r-select-option"
          onPointerMove={() => {
            if (!option.disabled) setActive(i);
          }}
          onPointerDown={(event) => event.preventDefault()}
          onClick={(event) => {
            event.preventDefault();
            commit(i);
          }}
        >
          <span>{option.label}</span>
          <span className="r-select-check">
            {i === selected && <Check aria-hidden="true" />}
          </span>
        </span>
      ))}
    </span>
  );
  return (
    <span className="r-select">
      <button
        ref={trigger}
        id={triggerId}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        aria-activedescendant={
          open && active >= 0 ? `${listId}-${active}` : undefined
        }
        aria-describedby={aria["aria-describedby"]}
        disabled={unavailable}
        className="r-select-trigger"
        onClick={() => (open ? close() : show())}
        onKeyDown={(event) => {
          if (unavailable) return;
          const key = event.key;
          if (key === "Tab") {
            close();
            return;
          }
          if (key === "Escape" && open) {
            event.preventDefault();
            event.stopPropagation();
            close(true);
            return;
          }
          if (key === "Enter" || key === " ") {
            event.preventDefault();
            if (open) commit(active);
            else show();
          } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
            event.preventDefault();
            if (!open)
              show(
                key === "Home"
                  ? enabled[0]
                  : key === "End"
                    ? enabled.at(-1)
                    : undefined,
              );
            else if (key === "Home") setActive(enabled[0]);
            else if (key === "End") setActive(enabled.at(-1)!);
            else
              setActive(
                enabled[
                  Math.max(
                    0,
                    Math.min(
                      enabled.length - 1,
                      enabled.indexOf(active) + (key === "ArrowDown" ? 1 : -1),
                    ),
                  )
                ],
              );
          } else if (
            key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
          ) {
            event.preventDefault();
            const now = Date.now();
            const text =
              (now - prefix.current.time < 700 ? prefix.current.text : "") +
              key.toLocaleLowerCase();
            prefix.current = { text, time: now };
            const match = enabled.find((i) =>
              options[i].label.toLocaleLowerCase().startsWith(text),
            );
            if (!open) show(match);
            else if (match !== undefined) setActive(match);
          }
        }}
      >
        <span>{options[selected]?.label || "请选择"}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {name && (
        <input
          type="hidden"
          name={name}
          value={String(value)}
          disabled={unavailable}
        />
      )}
      {fallback && panel ? createPortal(panel, fallback) : panel}
    </span>
  );
}
