import { useEffect, useId, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent, ReactNode } from "react";
import {
  addLocalDays,
  addLocalMonths,
  compareLocalDates,
  daysInMonth,
  formatLocalDate,
  localWeekday,
  parseLocalDate,
  parseLocalTime,
} from "@rosemary-ui/tokens";
import type { LocalDate } from "@rosemary-ui/tokens";
import { Button, Icon, IconButton, Input, Progress } from "./primitives.js";
import { useRosemaryTheme, useRosemaryStrings } from "./theme.js";
function usePanel(open: boolean, close: () => void) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, close]);
  const blur = (e: FocusEvent) => {
    if (
      open &&
      e.relatedTarget !== null &&
      !root.current?.contains(e.relatedTarget as Node)
    )
      close();
  };
  return { root, blur };
}
function PickerPanel({
  label,
  children,
  onCancel,
  onConfirm,
  onClear,
  confirmDisabled = false,
}: {
  label: string;
  children: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  onClear?: () => void;
  confirmDisabled?: boolean;
}) {
  const strings = useRosemaryStrings();
  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={label}
      className="rm-picker-panel"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          e.stopPropagation();
          onCancel();
        }
      }}
    >
      {children}
      <footer>
        <Button variant="secondary" onClick={onCancel}>
          {strings.cancel}
        </Button>
        {onClear && (
          <Button variant="ghost" onClick={onClear}>
            {strings.clear}
          </Button>
        )}
        <Button disabled={confirmDisabled} onClick={onConfirm}>
          {strings.confirm}
        </Button>
      </footer>
    </div>
  );
}
function TimeColumns({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const strings = useRosemaryStrings();
  const { direction } = useRosemaryTheme();
  const parsed = parseLocalTime(value) ?? { hour: 0, minute: 0 };
  const refs = useRef<Array<Array<HTMLButtonElement | null>>>([[], []]);
  function choose(column: number, index: number) {
    const hour = column === 0 ? index : parsed.hour,
      minute = column === 1 ? index : parsed.minute;
    onChange(
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
    );
  }
  function key(e: KeyboardEvent, column: number, index: number, count: number) {
    let next: number | undefined;
    if (e.key === "ArrowUp") next = Math.max(0, index - 1);
    if (e.key === "ArrowDown") next = Math.min(count - 1, index + 1);
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = count - 1;
    if (next !== undefined) {
      e.preventDefault();
      choose(column, next);
      refs.current[column]?.[next]?.focus();
    }
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      const target = (e.key === "ArrowRight") !== (direction === "rtl") ? 1 : 0;
      refs.current[target]?.[
        target === 0 ? parsed.hour : parsed.minute
      ]?.focus();
    }
  }
  return (
    <div className="rm-time-lists">
      {[24, 60].map((count, column) => (
        <div
          role="listbox"
          aria-label={column === 0 ? strings.hours : strings.minutes}
          key={column}
        >
          {Array.from({ length: count }, (_, i) => (
            <button
              type="button"
              role="option"
              key={i}
              ref={(element) => {
                refs.current[column]![i] = element;
              }}
              tabIndex={
                (column === 0 ? parsed.hour : parsed.minute) === i ? 0 : -1
              }
              aria-selected={(column === 0 ? parsed.hour : parsed.minute) === i}
              onKeyDown={(e) => key(e, column, i, count)}
              onClick={() => choose(column, i)}
            >
              {String(i).padStart(2, "0")}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
export interface DatePickerProps {
  label: string;
  value: string | null;
  onValueChange: (value: string | null) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  withTime?: boolean;
  time?: string;
  onTimeChange?: (time: string) => void;
  clearable?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}
/** Nonmodal Gregorian editor with direct text input and a separate temporary calendar draft. */
export function DatePicker({
  label,
  value,
  onValueChange,
  min,
  max,
  disabled,
  withTime = false,
  time = "00:00",
  onTimeChange,
  clearable = true,
  open: controlledOpen,
  onOpenChange,
}: DatePickerProps) {
  const strings = useRosemaryStrings();
  const { direction } = useRosemaryTheme();
  const id = useId();
  const selected = value === null ? null : parseLocalDate(value),
    lower = min ? parseLocalDate(min) : null,
    upper = max ? parseLocalDate(max) : null;
  if (
    (value !== null && !selected) ||
    (min && !lower) ||
    (max && !upper) ||
    (lower && upper && compareLocalDates(lower, upper) > 0) ||
    (withTime && !parseLocalTime(time))
  )
    throw new TypeError("Invalid Rosemary date/time or bounds");
  const initial = selected ?? lower ?? { year: 2000, month: 1, day: 1 };
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  function requestOpen(next: boolean) {
    if (controlledOpen === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  }
  const [draft, setDraft] = useState(initial),
    [cursor, setCursor] = useState(initial),
    [view, setView] = useState(initial),
    [viewKind, setViewKind] = useState<"calendar" | "year" | "month">(
      "calendar",
    ),
    [year, setYear] = useState(String(initial.year)),
    [draftTime, setDraftTime] = useState(time),
    [text, setText] = useState(value ?? ""),
    [inputError, setInputError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null),
    trigger = useRef<HTMLButtonElement>(null),
    grid = useRef<HTMLDivElement>(null),
    panelRoot = useRef<HTMLDivElement>(null),
    focusCalendar = useRef(false);
  const { root, blur } = usePanel(open, () => requestOpen(false));
  useEffect(() => {
    setText(value ?? "");
    setInputError(null);
  }, [value]);
  function available(date: LocalDate) {
    return (
      (!lower || compareLocalDates(date, lower) >= 0) &&
      (!upper || compareLocalDates(date, upper) <= 0)
    );
  }
  const yearValid =
    /^\d{1,4}$/.test(year) && Number(year) >= 1 && Number(year) <= 9999;
  function align(date: LocalDate, focus = false) {
    setCursor(date);
    setView(date);
    setYear(String(date.year));
    focusCalendar.current = focus;
  }
  function openPicker() {
    setDraft(initial);
    align(initial, true);
    setDraftTime(time);
    setViewKind("calendar");
    requestOpen(true);
  }
  useEffect(() => {
    if (open && focusCalendar.current && viewKind === "calendar") {
      grid.current
        ?.querySelector<HTMLButtonElement>(
          `[data-date="${formatLocalDate(cursor)}"]`,
        )
        ?.focus();
      focusCalendar.current = false;
    }
  }, [open, cursor, viewKind]);
  function cancel() {
    requestOpen(false);
    trigger.current?.focus();
  }
  function month(delta: number) {
    try {
      const next = addLocalMonths(cursor, delta);
      align(next, true);
    } catch {}
  }
  function calendarKey(e: KeyboardEvent<HTMLButtonElement>, date: LocalDate) {
    let next: LocalDate | undefined;
    try {
      const n =
        e.key === "ArrowLeft"
          ? direction === "rtl"
            ? 1
            : -1
          : e.key === "ArrowRight"
            ? direction === "rtl"
              ? -1
              : 1
            : e.key === "ArrowUp"
              ? -7
              : e.key === "ArrowDown"
                ? 7
                : e.key === "Home"
                  ? -localWeekday(date)
                  : e.key === "End"
                    ? 6 - localWeekday(date)
                    : undefined;
      if (n !== undefined) next = addLocalDays(date, n);
      else if (e.key === "PageUp" || e.key === "PageDown")
        next = addLocalMonths(
          date,
          (e.key === "PageUp" ? -1 : 1) * (e.shiftKey ? 12 : 1),
        );
    } catch {}
    if (next) {
      e.preventDefault();
      align(next, true);
    }
  }
  function inputChange(raw: string) {
    setText(raw);
    setInputError(null);
    if (raw === "") {
      onValueChange(null);
      setText(value ?? "");
      return;
    }
    if (raw.length >= 10) {
      const date = parseLocalDate(raw);
      if (!date || !available(date))
        setInputError(
          `YYYY-MM-DD · 0001–9999${min || max ? ` · ${min ?? "0001-01-01"}–${max ?? "9999-12-31"}` : ""}`,
        );
      else {
        onValueChange(raw);
        setText(value ?? "");
      }
    }
  }
  const blanks = localWeekday({ ...view, day: 1 });
  const cells: Array<LocalDate | null> = [
    ...Array.from({ length: blanks }, () => null),
    ...Array.from({ length: daysInMonth(view.year, view.month) }, (_, i) => ({
      year: view.year,
      month: view.month,
      day: i + 1,
    })),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
  const yearStart = Math.floor((view.year - 1) / 12) * 12 + 1;
  return (
    <div ref={root} onBlur={blur} className="rm-field rm-picker">
      <label htmlFor={id}>{label}</label>
      <div className="rm-picker-field">
        <input
          ref={input}
          id={id}
          className="rm-input"
          type="text"
          inputMode="numeric"
          disabled={disabled}
          value={text}
          placeholder="YYYY-MM-DD"
          aria-describedby={`${id}-format${inputError ? ` ${id}-error` : ""}`}
          aria-invalid={!!inputError || undefined}
          onChange={(e) => inputChange(e.target.value)}
          onBlur={() => {
            if (text && !parseLocalDate(text))
              setInputError("YYYY-MM-DD · 0001–9999");
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              openPicker();
            }
            if (e.key === "Escape") {
              setText(value ?? "");
              setInputError(null);
            }
          }}
        />
        <IconButton
          ref={trigger}
          icon="calendar"
          variant="secondary"
          label={`${label} ${value ?? strings.chooseDate}`}
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={() => (open ? cancel() : openPicker())}
        />
      </div>
      <span id={`${id}-format`} className="rm-help">
        YYYY-MM-DD · 0001–9999{withTime ? ` · ${time}` : ""}
      </span>
      {inputError && (
        <span className="rm-error" id={`${id}-error`}>
          {inputError}
        </span>
      )}
      {open && (
        <div id={`${id}-panel`} ref={panelRoot}>
          <PickerPanel
            label={label}
            onCancel={cancel}
            onClear={
              clearable
                ? () => {
                    onValueChange(null);
                    requestOpen(false);
                    trigger.current?.focus();
                  }
                : undefined
            }
            confirmDisabled={
              !yearValid ||
              !available(draft) ||
              (withTime && !parseLocalTime(draftTime))
            }
            onConfirm={() => {
              onValueChange(formatLocalDate(draft));
              if (withTime) onTimeChange?.(draftTime);
              requestOpen(false);
              trigger.current?.focus();
            }}
          >
            <div className="rm-calendar-header">
              <IconButton
                icon="arrow-left"
                label={strings.previousMonth}
                variant="ghost"
                disabled={view.year === 1 && view.month === 1}
                onClick={() => month(-1)}
              />
              <div>
                <Button
                  variant="ghost"
                  aria-label={strings.year}
                  aria-expanded={viewKind === "year"}
                  onClick={() =>
                    setViewKind(viewKind === "year" ? "calendar" : "year")
                  }
                >
                  {String(view.year).padStart(4, "0")}
                </Button>
                <Button
                  variant="ghost"
                  aria-label={strings.month}
                  aria-expanded={viewKind === "month"}
                  onClick={() =>
                    setViewKind(viewKind === "month" ? "calendar" : "month")
                  }
                >
                  {view.month}
                </Button>
              </div>
              <IconButton
                icon="arrow"
                label={strings.nextMonth}
                variant="ghost"
                disabled={view.year === 9999 && view.month === 12}
                onClick={() => month(1)}
              />
            </div>
            {viewKind === "year" && (
              <div className="rm-year-view">
                <Input
                  label={strings.year}
                  value={year}
                  inputMode="numeric"
                  maxLength={4}
                  error={!yearValid ? strings.invalidYear : undefined}
                  onValueChange={(v) => {
                    setYear(v);
                    if (/^\d{1,4}$/.test(v) && Number(v) > 0) {
                      const date = {
                        year: Number(v),
                        month: view.month,
                        day: Math.min(
                          cursor.day,
                          daysInMonth(Number(v), view.month),
                        ),
                      };
                      setView(date);
                      setCursor(date);
                    }
                  }}
                />
                <div className="rm-year-nav">
                  <Button
                    variant="ghost"
                    disabled={yearStart === 1}
                    onClick={() =>
                      align({
                        ...view,
                        year: Math.max(1, view.year - 12),
                        day: 1,
                      })
                    }
                  >
                    −12
                  </Button>
                  <span>
                    {yearStart}–{Math.min(9999, yearStart + 11)}
                  </span>
                  <Button
                    variant="ghost"
                    disabled={yearStart + 12 > 9999}
                    onClick={() =>
                      align({
                        ...view,
                        year: Math.min(9999, view.year + 12),
                        day: 1,
                      })
                    }
                  >
                    +12
                  </Button>
                </div>
                <div
                  className="rm-months"
                  role="group"
                  aria-label={strings.year}
                >
                  {Array.from(
                    { length: Math.min(12, 10000 - yearStart) },
                    (_, i) => yearStart + i,
                  ).map((y) => (
                    <button
                      type="button"
                      key={y}
                      aria-pressed={view.year === y}
                      onClick={() => {
                        align(
                          {
                            year: y,
                            month: view.month,
                            day: Math.min(
                              cursor.day,
                              daysInMonth(y, view.month),
                            ),
                          },
                          true,
                        );
                        setViewKind("calendar");
                      }}
                    >
                      {String(y).padStart(4, "0")}
                    </button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  disabled={!yearValid}
                  onClick={() => {
                    setViewKind("calendar");
                    focusCalendar.current = true;
                  }}
                >
                  {strings.confirm}
                </Button>
              </div>
            )}
            {viewKind === "month" && (
              <div
                className="rm-months"
                role="group"
                aria-label={strings.month}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <button
                    type="button"
                    key={i}
                    aria-label={strings.monthOption.replace(
                      "{month}",
                      String(i + 1),
                    )}
                    aria-pressed={view.month === i + 1}
                    onClick={() => {
                      align(
                        {
                          year: view.year,
                          month: i + 1,
                          day: Math.min(
                            cursor.day,
                            daysInMonth(view.year, i + 1),
                          ),
                        },
                        true,
                      );
                      setViewKind("calendar");
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
            {viewKind === "calendar" && (
              <div
                ref={grid}
                role="grid"
                aria-label={`${view.year}-${String(view.month).padStart(2, "0")}`}
                className="rm-calendar"
              >
                <div role="row" className="rm-calendar-week">
                  {strings.weekdays.map((day) => (
                    <span role="columnheader" key={day}>
                      {day}
                    </span>
                  ))}
                </div>
                {weeks.map((week, w) => (
                  <div role="row" className="rm-calendar-days" key={w}>
                    {week.map((date, d) => {
                      if (!date) return <span role="gridcell" key={d} />;
                      const key = formatLocalDate(date);
                      return (
                        <button
                          type="button"
                          key={key}
                          role="gridcell"
                          aria-label={key}
                          aria-selected={compareLocalDates(date, draft) === 0}
                          aria-disabled={!available(date) || undefined}
                          data-date={key}
                          tabIndex={
                            compareLocalDates(date, cursor) === 0 ? 0 : -1
                          }
                          onKeyDown={(e) => calendarKey(e, date)}
                          onClick={() => {
                            if (available(date)) {
                              setDraft(date);
                              align(date);
                            }
                          }}
                        >
                          {date.day}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
            {withTime && (
              <div className="rm-time">
                <Input
                  label={strings.time}
                  value={draftTime}
                  maxLength={5}
                  inputMode="numeric"
                  error={
                    !parseLocalTime(draftTime) ? strings.invalidTime : undefined
                  }
                  onValueChange={setDraftTime}
                />
                <TimeColumns value={draftTime} onChange={setDraftTime} />
              </div>
            )}
          </PickerPanel>
        </div>
      )}
    </div>
  );
}
export interface TimePickerProps {
  label: string;
  value: string;
  onValueChange: (time: string) => void;
  disabled?: boolean;
}
export function TimePicker({
  label,
  value,
  onValueChange,
  disabled,
}: TimePickerProps) {
  if (!parseLocalTime(value))
    throw new TypeError("TimePicker value must be HH:mm");
  const strings = useRosemaryStrings();
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState(value),
    [text, setText] = useState(value);
  const trigger = useRef<HTMLButtonElement>(null);
  const { root, blur } = usePanel(open, () => setOpen(false));
  useEffect(() => setText(value), [value]);
  useEffect(() => {
    if (open)
      root.current
        ?.querySelector<HTMLButtonElement>("[role=option][aria-selected=true]")
        ?.focus();
  }, [open]);
  const invalid = !parseLocalTime(text);
  function show() {
    setDraft(value);
    setOpen(true);
  }
  return (
    <div ref={root} onBlur={blur} className="rm-field rm-picker">
      <div className="rm-picker-field">
        <Input
          label={label}
          value={text}
          inputMode="numeric"
          maxLength={5}
          disabled={disabled}
          error={invalid ? strings.invalidTime : undefined}
          onValueChange={(v) => {
            setText(v);
            if (parseLocalTime(v)) {
              onValueChange(v);
              setText(value);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              show();
            }
          }}
        />
        <IconButton
          ref={trigger}
          icon="clock"
          label={`${label} ${value}`}
          variant="secondary"
          disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => (open ? setOpen(false) : show())}
        />
      </div>
      {open && (
        <PickerPanel
          label={label}
          onCancel={() => {
            setOpen(false);
            trigger.current?.focus();
          }}
          onConfirm={() => {
            onValueChange(draft);
            setOpen(false);
            trigger.current?.focus();
          }}
        >
          <TimeColumns value={draft} onChange={setDraft} />
        </PickerPanel>
      )}
    </div>
  );
}
export interface LocalDateRange {
  start: string | null;
  end: string | null;
}
export interface DateRangeProps {
  label: string;
  value: LocalDateRange;
  onValueChange: (range: LocalDateRange) => void;
  startLabel?: string;
  endLabel?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}
export function DateRange({
  label,
  value,
  onValueChange,
  startLabel,
  endLabel,
  min,
  max,
  disabled,
}: DateRangeProps) {
  const strings = useRosemaryStrings();
  const id = useId();
  const [rejected, setRejected] = useState(false);
  const reversed = !!value.start && !!value.end && value.end < value.start;
  function propose(next: LocalDateRange) {
    if (next.start && next.end && next.end < next.start) {
      setRejected(true);
      return;
    }
    setRejected(false);
    onValueChange(next);
  }
  return (
    <fieldset
      className="rm-date-range"
      aria-describedby={reversed || rejected ? `${id}-error` : undefined}
    >
      <legend>{label}</legend>
      <DatePicker
        label={startLabel ?? strings.startDate}
        value={value.start}
        onValueChange={(start) => propose({ ...value, start })}
        min={min}
        max={max}
        disabled={disabled}
      />
      <DatePicker
        label={endLabel ?? strings.endDate}
        value={value.end}
        onValueChange={(end) => propose({ ...value, end })}
        min={min}
        max={max}
        disabled={disabled}
      />
      {(reversed || rejected) && (
        <p id={`${id}-error`} role="alert" className="rm-error">
          {strings.reversedRange}
        </p>
      )}
    </fieldset>
  );
}
export interface UploadRejection {
  file: File;
  reason: "type" | "size" | "count";
}
export type UploadFileState =
  | { status: "selected" | "complete" | "cancelled"; message?: ReactNode }
  | { status: "uploading"; progress?: number; message?: ReactNode }
  | { status: "failed"; error: ReactNode };
export interface UploadProps {
  label: string;
  files: readonly File[];
  onFilesChange: (files: File[]) => void;
  accept?: string;
  maxSize?: number;
  maxCount?: number;
  multiple?: boolean;
  disabled?: boolean;
  onReject?: (rejections: readonly UploadRejection[]) => void;
  /** Keys must use the same stable File objects supplied in files. */
  fileStates?: ReadonlyMap<File, UploadFileState>;
  onRetry?: (file: File) => void;
  onCancel?: (file: File) => void;
}
export function Upload({
  label,
  files,
  onFilesChange,
  accept,
  maxSize = Infinity,
  maxCount = Infinity,
  multiple = true,
  disabled,
  onReject,
  fileStates,
  onRetry,
  onCancel,
}: UploadProps) {
  const strings = useRosemaryStrings();
  const id = useId();
  const ref = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  if (
    Number.isNaN(maxSize) ||
    maxSize < 0 ||
    Number.isNaN(maxCount) ||
    maxCount < 0 ||
    (maxCount !== Infinity && !Number.isInteger(maxCount))
  )
    throw new RangeError(
      "Upload limits must be nonnegative; maxCount must be an integer",
    );
  const statuses = files.map(
    (file) => fileStates?.get(file)?.status ?? "selected",
  );
  const batch =
    statuses.includes("failed") && statuses.includes("complete")
      ? "partial"
      : statuses.includes("uploading")
        ? "uploading"
        : statuses.includes("failed")
          ? "failed"
          : statuses.includes("cancelled")
            ? "cancelled"
            : files.length
              ? "selected"
              : "empty";
  function receive(incoming: File[]) {
    if (disabled) return;
    const rejected: UploadRejection[] = [];
    const accepted: File[] = [];
    const rules =
      accept
        ?.split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean) ?? [];
    for (const file of incoming) {
      const match =
        rules.length === 0 ||
        rules.some((rule) =>
          rule.startsWith(".")
            ? file.name.toLowerCase().endsWith(rule)
            : rule.endsWith("/*")
              ? file.type.toLowerCase().startsWith(rule.slice(0, -1))
              : file.type.toLowerCase() === rule,
        );
      const reason = !match
        ? "type"
        : file.size > maxSize
          ? "size"
          : files.length + accepted.length >=
              Math.min(maxCount, multiple ? Infinity : 1)
            ? "count"
            : undefined;
      if (reason) rejected.push({ file, reason });
      else accepted.push(file);
    }
    if (accepted.length) onFilesChange([...files, ...accepted]);
    if (rejected.length) onReject?.(rejected);
  }
  return (
    <section
      className="rm-upload"
      aria-labelledby={`${id}-label`}
      data-drag={drag}
      data-state={batch}
      onDragOver={(e) => {
        if (!disabled) {
          e.preventDefault();
          setDrag(true);
        }
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        receive(Array.from(e.dataTransfer.files));
      }}
    >
      <h3 id={`${id}-label`}>{label}</h3>
      <input
        ref={ref}
        type="file"
        id={id}
        className="rm-visually-hidden"
        tabIndex={-1}
        aria-label={label}
        disabled={disabled}
        multiple={multiple}
        accept={accept}
        onChange={(e) => {
          receive(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />
      <Button
        variant="secondary"
        disabled={disabled}
        onClick={() => ref.current?.click()}
      >
        <Icon name="upload" size={18} />
        {strings.chooseFiles}
      </Button>
      <p className="rm-help">{strings.dropFiles}</p>
      <ul>
        {files.map((file, i) => {
          const state = fileStates?.get(file) ?? {
            status: "selected" as const,
          };
          const statusText =
            state.status === "uploading"
              ? strings.uploading
              : state.status === "complete"
                ? strings.uploadComplete
                : state.status === "failed"
                  ? strings.uploadFailed
                  : state.status === "cancelled"
                    ? strings.uploadCancelled
                    : strings.uploadSelected;
          const description = `${id}-file-${i}`;
          return (
            <li
              key={`${file.name}-${i}`}
              data-state={state.status}
              aria-describedby={description}
            >
              <Icon
                name={
                  state.status === "failed"
                    ? "warning"
                    : state.status === "complete"
                      ? "check"
                      : "file"
                }
                size={18}
              />
              <div className="rm-upload-file">
                <span>{file.name}</span>
                <small>{file.size} B</small>
                <span
                  id={description}
                  role={state.status === "failed" ? "alert" : "status"}
                  className={state.status === "failed" ? "rm-error" : "rm-help"}
                >
                  {statusText}
                  {state.status === "failed" ? (
                    <>: {state.error}</>
                  ) : state.message ? (
                    <>: {state.message}</>
                  ) : null}
                </span>
                {state.status === "uploading" && (
                  <Progress
                    label={`${strings.uploading} ${file.name}`}
                    value={state.progress}
                  />
                )}
              </div>
              {state.status === "failed" && onRetry && (
                <IconButton
                  icon="refresh"
                  label={`${strings.retryFile} ${file.name}`}
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => onRetry(file)}
                />
              )}
              {state.status === "uploading" && onCancel && (
                <IconButton
                  icon="close"
                  label={`${strings.cancel} ${file.name}`}
                  variant="ghost"
                  disabled={disabled}
                  onClick={() => onCancel(file)}
                />
              )}
              <IconButton
                icon="trash"
                label={`${strings.removeFile} ${file.name}`}
                variant="ghost"
                disabled={disabled}
                onClick={() => onFilesChange(files.filter((_, n) => n !== i))}
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
