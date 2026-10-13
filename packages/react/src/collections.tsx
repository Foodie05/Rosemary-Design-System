import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, ReactNode, RefObject } from "react";
import { Button, Icon, IconButton } from "./primitives.js";
import type { Choice } from "./primitives.js";
import { useRosemaryTheme, useRosemaryStrings } from "./theme.js";
/** Keep popup geometry inside the current visual viewport, including scroll and zoom. */
function useOptionsPosition(
  open: boolean,
  trigger: RefObject<HTMLElement | null>,
  panel: RefObject<HTMLDivElement | null>,
) {
  const [style, setStyle] = useState<CSSProperties>({ visibility: "hidden" });
  useEffect(() => {
    if (!open) {
      setStyle({ visibility: "hidden" });
      return;
    }
    const measure = () => {
      const anchor = trigger.current,
        element = panel.current;
      if (!anchor || !element) return;
      const viewport = window.visualViewport;
      const left = viewport?.offsetLeft ?? 0,
        top = viewport?.offsetTop ?? 0,
        width = viewport?.width ?? window.innerWidth,
        height = viewport?.height ?? window.innerHeight;
      const rect = anchor.getBoundingClientRect(),
        gap = 6,
        margin = 8;
      const below = top + height - margin - rect.bottom - gap,
        above = rect.top - top - margin - gap;
      const flip = below < Math.min(element.scrollHeight, 300) && above > below;
      const maxHeight = Math.max(32, Math.min(300, flip ? above : below));
      const popupWidth = Math.min(
        Math.max(180, rect.width),
        width - margin * 2,
      );
      const popupHeight = Math.min(element.scrollHeight, maxHeight);
      setStyle({
        visibility: "visible",
        position: "fixed",
        insetInline: "auto",
        left: Math.max(
          left + margin,
          Math.min(rect.left, left + width - margin - popupWidth),
        ),
        top: flip
          ? Math.max(top + margin, rect.top - gap - popupHeight)
          : rect.bottom + gap,
        width: popupWidth,
        maxHeight,
      });
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    if (trigger.current) observer?.observe(trigger.current);
    if (panel.current) observer?.observe(panel.current);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    window.visualViewport?.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("scroll", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
      window.visualViewport?.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("scroll", measure);
    };
  }, [open, trigger, panel]);
  return style;
}
function moveIndex(current: number, count: number, key: string, rtl = false) {
  if (key === "Home") return 0;
  if (key === "End") return count - 1;
  if (key === "ArrowDown" || key === (rtl ? "ArrowLeft" : "ArrowRight"))
    return (current + 1) % count;
  if (key === "ArrowUp" || key === (rtl ? "ArrowRight" : "ArrowLeft"))
    return (current - 1 + count) % count;
  return current;
}
export interface SelectProps {
  label: string;
  value: string;
  options: readonly Choice[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  error?: ReactNode;
}
export function Select({
  label,
  value,
  options,
  onValueChange,
  disabled,
  placeholder,
  error,
}: SelectProps) {
  const strings = useRosemaryStrings();
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const popupStyle = useOptionsPosition(open, trigger, list);
  const enabled = options.filter((o) => !o.disabled);
  const selected = options.find((o) => o.value === value);
  useEffect(() => {
    if (open) {
      const index = Math.max(
        0,
        enabled.findIndex((o) => o.value === value),
      );
      setActive(index);
      list.current?.focus();
    }
  }, [open, popupStyle.visibility]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  useEffect(() => {
    if (open && enabled[active])
      document
        .getElementById(`${id}-${enabled[active].value}`)
        ?.scrollIntoView?.({ block: "nearest", inline: "nearest" });
  }, [open, active, id, enabled]);
  function close() {
    setOpen(false);
    trigger.current?.focus();
  }
  function keyboard(e: KeyboardEvent<HTMLDivElement>) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      setActive(moveIndex(active, enabled.length, e.key));
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const option = enabled[active];
      if (option) onValueChange(option.value);
      close();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
    if (e.key === "Tab") setOpen(false);
    if (e.key.length === 1 && e.key !== " ") {
      const after = enabled
        .map((o, i) => ({ o, i }))
        .filter(
          ({ o }) =>
            typeof o.label === "string" &&
            o.label.toLocaleLowerCase().startsWith(e.key.toLocaleLowerCase()),
        );
      const next = after.find((x) => x.i > active) ?? after[0];
      if (next) setActive(next.i);
    }
  }
  return (
    <div ref={root} className="rm-field rm-select">
      <span id={`${id}-label`}>{label}</span>
      <button
        ref={trigger}
        type="button"
        className="rm-input rm-select-trigger"
        disabled={disabled}
        role="combobox"
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        aria-expanded={open}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => setOpen(!open)}
        onKeyDown={(e) => {
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {selected?.label ?? placeholder ?? strings.chooseOption}
        <Icon name="down" size={18} />
      </button>
      {open && (
        <div
          id={`${id}-list`}
          ref={list}
          role="listbox"
          tabIndex={-1}
          className="rm-options"
          style={popupStyle}
          aria-labelledby={`${id}-label`}
          aria-activedescendant={
            enabled[active] ? `${id}-${enabled[active]?.value}` : undefined
          }
          onKeyDown={keyboard}
          onBlur={(e) => {
            if (!root.current?.contains(e.relatedTarget as Node))
              setOpen(false);
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              id={`${id}-${option.value}`}
              role="option"
              aria-selected={value === option.value}
              aria-disabled={option.disabled || undefined}
              data-active={enabled[active]?.value === option.value}
              className="rm-option"
              onPointerMove={() => {
                const i = enabled.findIndex((o) => o.value === option.value);
                if (i >= 0) setActive(i);
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (!option.disabled) {
                  onValueChange(option.value);
                  close();
                }
              }}
            >
              {option.label}
              {value === option.value && <Icon name="check" size={16} />}
            </div>
          ))}
        </div>
      )}
      {error && (
        <div id={`${id}-error`} className="rm-error">
          {error}
        </div>
      )}
    </div>
  );
}
export interface TabItem extends Choice {
  content: ReactNode;
}
export interface TabsProps {
  label: string;
  value: string;
  items: readonly TabItem[];
  onValueChange: (value: string) => void;
  activation?: "automatic" | "manual";
}
export function Tabs({
  label,
  value,
  items,
  onValueChange,
  activation = "automatic",
}: TabsProps) {
  const id = useId();
  const { direction } = useRosemaryTheme();
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const list = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);
  useEffect(() => {
    const measure = () => {
      const button =
        refs.current[items.findIndex((item) => item.value === value)];
      if (button)
        setIndicator({ left: button.offsetLeft, width: button.offsetWidth });
    };
    measure();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    if (list.current) observer?.observe(list.current);
    refs.current.forEach((tab) => {
      if (tab) observer?.observe(tab);
    });
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    document.fonts?.addEventListener("loadingdone", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      document.fonts?.removeEventListener("loadingdone", measure);
    };
  }, [value, items, direction]);
  const enabled = items.filter((i) => !i.disabled);
  function key(e: KeyboardEvent<HTMLButtonElement>, item: TabItem) {
    if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const next =
        enabled[
          moveIndex(
            enabled.indexOf(item),
            enabled.length,
            e.key,
            direction === "rtl",
          )
        ];
      if (next) {
        refs.current[items.indexOf(next)]?.focus();
        if (activation === "automatic") onValueChange(next.value);
      }
    }
  }
  return (
    <div className="rm-tabs">
      <div
        ref={list}
        role="tablist"
        aria-label={label}
        data-measured={!!indicator}
      >
        {indicator && (
          <span
            className="rm-tab-indicator"
            aria-hidden="true"
            style={{
              width: indicator.width,
              transform: `translateX(${indicator.left}px)`,
            }}
          />
        )}
        {items.map((item, i) => (
          <button
            ref={(el) => {
              refs.current[i] = el;
            }}
            key={item.value}
            type="button"
            role="tab"
            id={`${id}-tab-${item.value}`}
            aria-controls={`${id}-panel-${item.value}`}
            aria-selected={value === item.value}
            tabIndex={value === item.value ? 0 : -1}
            disabled={item.disabled}
            onKeyDown={(e) => key(e, item)}
            onClick={() => onValueChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${item.value}`}
          aria-labelledby={`${id}-tab-${item.value}`}
          tabIndex={0}
          hidden={value !== item.value}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}
export function Breadcrumb({
  items,
  label,
}: {
  items: readonly BreadcrumbItem[];
  label?: string;
}) {
  const strings = useRosemaryStrings();
  return (
    <nav
      aria-label={label ?? strings.currentLocation}
      className="rm-breadcrumb"
    >
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            {item.href && i !== items.length - 1 ? (
              <a href={item.href}>{item.label}</a>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
            {i < items.length - 1 && <Icon name="chevron" size={16} />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
export interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
  disabled?: boolean;
}
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label,
  disabled,
}: PaginationProps) {
  const strings = useRosemaryStrings();
  const { direction } = useRosemaryTheme();
  if (
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > pageCount
  )
    throw new RangeError("Pagination requires 1 <= integer page <= pageCount");
  const visible = Array.from(
    new Set([
      1,
      pageCount,
      ...Array.from({ length: 5 }, (_, i) => page + i - 2).filter(
        (n) => n >= 1 && n <= pageCount,
      ),
    ]),
  ).sort((a, b) => a - b);
  return (
    <nav className="rm-pagination" aria-label={label ?? strings.pagination}>
      <IconButton
        icon={direction === "rtl" ? "arrow" : "arrow-left"}
        label={strings.previousPage}
        variant="secondary"
        disabled={disabled || page === 1}
        onClick={() => onPageChange(page - 1)}
      />
      {visible.map((n, i) => (
        <span key={n}>
          {i > 0 && n - visible[i - 1]! > 1 && (
            <span aria-hidden="true">…</span>
          )}
          <Button
            variant={n === page ? "primary" : "ghost"}
            aria-label={strings.page.replace("{page}", String(n))}
            aria-current={n === page ? "page" : undefined}
            disabled={disabled}
            onClick={() => onPageChange(n)}
          >
            {n}
          </Button>
        </span>
      ))}
      <IconButton
        icon={direction === "rtl" ? "arrow-left" : "arrow"}
        label={strings.nextPage}
        variant="secondary"
        disabled={disabled || page === pageCount}
        onClick={() => onPageChange(page + 1)}
      />
    </nav>
  );
}
export interface MenuItem {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  onSelect: () => void;
  danger?: boolean;
}
export interface MenuProps {
  label: string;
  items: readonly MenuItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function Menu({ label, items, open, onOpenChange }: MenuProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const popupStyle = useOptionsPosition(open, trigger, list);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(0);
  const enabled = items.filter((i) => !i.disabled);
  useEffect(() => {
    if (open) {
      setActive(0);
      refs.current[items.indexOf(enabled[0]!)]?.focus();
    }
  }, [open, popupStyle.visibility]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, onOpenChange]);
  function key(e: KeyboardEvent) {
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
      e.preventDefault();
      const n = moveIndex(active, enabled.length, e.key);
      setActive(n);
      refs.current[items.indexOf(enabled[n]!)]?.focus();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onOpenChange(false);
      trigger.current?.focus();
    }
    if (e.key === "Tab") onOpenChange(false);
  }
  return (
    <div ref={root} className="rm-menu">
      <Button
        ref={trigger}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onOpenChange(true);
          }
        }}
      >
        {label}
        <Icon name="down" size={16} />
      </Button>
      {open && (
        <div
          role="menu"
          id={id}
          aria-label={label}
          className="rm-options"
          ref={list}
          style={popupStyle}
          onKeyDown={key}
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              role="menuitem"
              type="button"
              disabled={item.disabled}
              tabIndex={enabled[active]?.id === item.id ? 0 : -1}
              data-danger={item.danger}
              className="rm-option"
              onClick={() => {
                item.onSelect();
                onOpenChange(false);
                trigger.current?.focus();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
export interface TableColumn<T> {
  id: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  sortable?: boolean;
}
export interface TableSort {
  column: string;
  direction: "ascending" | "descending";
}
export interface TableProps<T> {
  caption: string;
  columns: readonly TableColumn<T>[];
  rows: readonly T[];
  rowKey: (row: T) => string;
  sort?: TableSort;
  onSortChange?: (sort: TableSort) => void;
  empty?: ReactNode;
}
/** Receives already sorted data; sorting never mutates consumer records. */
export function Table<T>({
  caption,
  columns,
  rows,
  rowKey,
  sort,
  onSortChange,
  empty,
}: TableProps<T>) {
  const strings = useRosemaryStrings();
  return (
    <div className="rm-table-wrap">
      <table className="rm-table">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                scope="col"
                key={column.id}
                aria-sort={
                  column.sortable
                    ? sort?.column === column.id
                      ? sort.direction
                      : "none"
                    : undefined
                }
              >
                {column.sortable && onSortChange ? (
                  <button
                    type="button"
                    onClick={() =>
                      onSortChange({
                        column: column.id,
                        direction:
                          sort?.column === column.id &&
                          sort.direction === "ascending"
                            ? "descending"
                            : "ascending",
                      })
                    }
                  >
                    {column.header}
                    <Icon name="down" size={14} />
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td key={column.id}>{column.render(row)}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>{empty ?? strings.emptyRecords}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export type StepState =
  "upcoming" | "current" | "complete" | "error" | "unavailable";
export interface StepItem {
  state?: StepState;
  id: string;
  title: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}
export function Stepper({
  items,
  current,
  onStepChange,
  label,
}: {
  items: readonly StepItem[];
  current: string;
  onStepChange?: (id: string) => void;
  label?: string;
}) {
  const strings = useRosemaryStrings();
  const index = items.findIndex((item) => item.id === current);
  if (index < 0) throw new TypeError("Stepper current must identify an item");
  return (
    <nav aria-label={label ?? strings.steps}>
      <ol className="rm-stepper">
        {items.map((item, i) => {
          const state =
            item.state ??
            (item.id === current
              ? "current"
              : i < index
                ? "complete"
                : "upcoming");
          return (
            <li
              key={item.id}
              aria-current={item.id === current ? "step" : undefined}
              data-complete={state === "complete"}
              data-state={state}
            >
              <span className="rm-step-number" aria-hidden="true">
                {state === "error" ? (
                  <Icon name="warning" size={16} />
                ) : state === "complete" ? (
                  <Icon name="check" size={16} />
                ) : (
                  i + 1
                )}
              </span>
              <div>
                {onStepChange ? (
                  <button
                    type="button"
                    disabled={item.disabled || state === "unavailable"}
                    onClick={() => onStepChange(item.id)}
                  >
                    {item.title}
                  </button>
                ) : (
                  <span>{item.title}</span>
                )}
                {(state === "error" || state === "unavailable") && (
                  <span className={state === "error" ? "rm-error" : "rm-help"}>
                    {state === "error"
                      ? strings.stepError
                      : strings.stepUnavailable}
                  </span>
                )}
                {item.description && (
                  <div className="rm-help">{item.description}</div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
