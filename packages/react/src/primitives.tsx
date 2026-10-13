import { forwardRef, useId, useState, useEffect, useRef } from "react";
import type {
  CSSProperties,
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SVGAttributes,
  TextareaHTMLAttributes,
} from "react";
import { componentTokens } from "@rosemary-ui/tokens";
import { iconMarkup } from "@rosemary-ui/icons";
import type { IconName } from "@rosemary-ui/icons";
import { useDocumentVisible, useRosemaryStrings } from "./theme.js";
const cx = (name: string, extra?: string) =>
  `rm-${name}${extra ? " " + extra : ""}`;
export interface IconProps extends Omit<
  SVGAttributes<SVGSVGElement>,
  "children"
> {
  name: IconName;
  label?: string;
  size?: number;
}
export function Icon({ name, label, size = 24, ...props }: IconProps) {
  const markup = iconMarkup[name];
  if (!markup) throw new TypeError(`Unknown Rosemary icon ${name}`);
  return (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "small" | "medium" | "large";
  loading?: boolean;
}
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "medium",
      loading = false,
      disabled,
      children,
      className,
      onClick,
      type = "button",
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        type={type}
        className={cx("button", className)}
        data-variant={variant}
        data-size={size}
        disabled={disabled}
        aria-busy={loading || undefined}
        aria-disabled={disabled || loading || undefined}
        onPointerDown={(e) => {
          props.onPointerDown?.(e);
          if (!e.defaultPrevented && e.button === 0 && !disabled)
            e.currentTarget.focus({ preventScroll: true });
        }}
        onClick={(e) => {
          if (loading) {
            e.preventDefault();
            return;
          }
          e.currentTarget.focus({ preventScroll: true });
          onClick?.(e);
        }}
      >
        {loading && <Loading label="" size="small" />}
        {children}
      </button>
    );
  },
);
export const Link = forwardRef<
  HTMLAnchorElement,
  AnchorHTMLAttributes<HTMLAnchorElement>
>(function Link({ className, ...props }, ref) {
  return <a {...props} ref={ref} className={cx("link", className)} />;
});
export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: IconName;
  label: string;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ icon, label, ...props }, ref) {
    return (
      <Button
        {...props}
        ref={ref}
        className={cx("icon-button", props.className)}
        aria-label={label}
      >
        <Icon name={icon} />
      </Button>
    );
  },
);
export interface FieldProps {
  label: string;
  description?: ReactNode;
  error?: ReactNode;
}
function Field({
  id,
  label,
  description,
  error,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="rm-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {description && (
        <div className="rm-help" id={`${id}-help`}>
          {description}
        </div>
      )}
      {error && (
        <div className="rm-error" id={`${id}-error`}>
          {error}
        </div>
      )}
    </div>
  );
}
export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">,
    FieldProps {
  value: string;
  onValueChange: (value: string) => void;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, description, error, value, onValueChange, className, ...props },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? auto;
  return (
    <Field id={fieldId} label={label} description={description} error={error}>
      <input
        {...props}
        ref={ref}
        id={fieldId}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={cx("input", className)}
        aria-invalid={!!error || undefined}
        aria-describedby={
          [
            description ? `${fieldId}-help` : "",
            error ? `${fieldId}-error` : "",
            props["aria-describedby"],
          ]
            .filter(Boolean)
            .join(" ") || undefined
        }
      />
    </Field>
  );
});
export interface TextareaProps
  extends
    Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">,
    FieldProps {
  value: string;
  onValueChange: (value: string) => void;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      id,
      label,
      description,
      error,
      value,
      onValueChange,
      className,
      ...props
    },
    ref,
  ) {
    const auto = useId();
    const fieldId = id ?? auto;
    return (
      <Field id={fieldId} label={label} description={description} error={error}>
        <textarea
          {...props}
          ref={ref}
          id={fieldId}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className={cx("input", className)}
          aria-invalid={!!error || undefined}
          aria-describedby={
            [
              description ? `${fieldId}-help` : "",
              error ? `${fieldId}-error` : "",
              props["aria-describedby"],
            ]
              .filter(Boolean)
              .join(" ") || undefined
          }
        />
      </Field>
    );
  },
);
export interface SearchProps extends Omit<InputProps, "type"> {
  onSearch?: (value: string) => void;
}
export function Search({ onSearch, ...props }: SearchProps) {
  const strings = useRosemaryStrings();
  return (
    <form
      className="rm-search"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (!props.disabled) onSearch?.(props.value);
      }}
    >
      <Input {...props} type="search" />
      <Button type="submit" variant="secondary" disabled={props.disabled}>
        <Icon name="search" />
        {strings.search}
      </Button>
    </form>
  );
}
export interface CheckProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "checked" | "onChange"
> {
  label: ReactNode;
  checked: boolean | "mixed";
  onCheckedChange: (checked: boolean) => void;
}
export const Checkbox = forwardRef<HTMLInputElement, CheckProps>(
  function Checkbox(
    { label, checked, onCheckedChange, className, ...props },
    ref,
  ) {
    const local = useRef<HTMLInputElement | null>(null);
    useEffect(() => {
      if (local.current) local.current.indeterminate = checked === "mixed";
    }, [checked]);
    return (
      <label className={cx("check", className)}>
        <input
          {...props}
          ref={(element) => {
            local.current = element;
            if (typeof ref === "function") ref(element);
            else if (ref) ref.current = element;
          }}
          type="checkbox"
          checked={checked === true}
          aria-checked={checked === "mixed" ? "mixed" : checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
        />
        <span className="rm-check-visual" aria-hidden="true">
          {checked === "mixed" ? (
            <span className="rm-check-mixed" />
          ) : (
            checked && <Icon name="check" size={16} />
          )}
        </span>
        <span>{label}</span>
      </label>
    );
  },
);
export interface Choice {
  value: string;
  label: ReactNode;
  disabled?: boolean;
}
export interface RadioProps {
  label: string;
  value: string;
  options: readonly Choice[];
  onValueChange: (value: string) => void;
  disabled?: boolean;
  name?: string;
}
export function Radio({
  label,
  value,
  options,
  onValueChange,
  disabled,
  name,
}: RadioProps) {
  const id = useId();
  return (
    <fieldset className="rm-radio" disabled={disabled}>
      <legend>{label}</legend>
      {options.map((option) => (
        <label className="rm-check" key={option.value}>
          <input
            type="radio"
            name={name ?? id}
            checked={value === option.value}
            disabled={option.disabled}
            onChange={() => onValueChange(option.value)}
          />
          <span className="rm-radio-visual" aria-hidden="true" />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}
export interface SwitchProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onChange" | "onClick" | "role"
> {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}
export function Switch({
  label,
  checked,
  onCheckedChange,
  className,
  ...props
}: SwitchProps) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cx("switch", className)}
      onClick={() => onCheckedChange(!checked)}
    >
      <span aria-hidden="true" />
    </button>
  );
}
export interface SliderProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  valueText?: string;
}
export function Slider({
  label,
  value,
  onValueChange,
  valueText,
  id,
  ...props
}: SliderProps) {
  const auto = useId();
  return (
    <label className="rm-slider" htmlFor={id ?? auto}>
      <span>
        {label} <output>{valueText ?? value}</output>
      </span>
      <input
        {...props}
        id={id ?? auto}
        type="range"
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        aria-valuetext={valueText}
      />
    </label>
  );
}
export interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
  idlePresentation?: "static" | "hidden";
  delay?: number;
  label?: string;
  size?: "small" | "medium" | "large";
  active?: boolean;
}
export function Loading({
  label,
  size = "medium",
  active = true,
  idlePresentation = "static",
  delay = componentTokens.loading.appearanceDelayMs,
  className,
  ...props
}: LoadingProps) {
  const visible = useDocumentVisible();
  const strings = useRosemaryStrings();
  const resolvedLabel = label ?? strings.loading;
  if (!Number.isFinite(delay) || delay < 0)
    throw new RangeError("Loading delay must be a finite nonnegative number");
  const [shown, setShown] = useState(active && delay === 0);
  useEffect(() => {
    if (!active) {
      setShown(false);
      return;
    }
    if (delay === 0) {
      setShown(true);
      return;
    }
    const timer = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(timer);
  }, [active, delay]);
  return (
    <span
      {...props}
      className={cx("loading", className)}
      role={active && shown && resolvedLabel ? "status" : undefined}
      aria-label={active && shown ? resolvedLabel || undefined : undefined}
      data-size={size}
      data-visible={shown || (!active && idlePresentation === "static")}
      aria-busy={active || undefined}
      data-active={active && visible && shown}
    >
      <span className="rm-fold-back" />
      <span className="rm-fold-front" />
    </span>
  );
}
export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value?: number;
  max?: number;
  flowing?: boolean;
}
export function Progress({
  label,
  value,
  max = 100,
  flowing = true,
  className,
  ...props
}: ProgressProps) {
  const visible = useDocumentVisible();
  if (
    !Number.isFinite(max) ||
    max <= 0 ||
    (value !== undefined &&
      (!Number.isFinite(value) || value < 0 || value > max))
  )
    throw new RangeError("Progress requires 0 <= value <= max and max > 0");
  return (
    <div
      {...props}
      className={cx("progress", className)}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <span
        style={
          {
            "--rm-progress-ratio": value === undefined ? 1 : value / max,
            transform: `scaleX(${value === undefined ? 1 : value / max})`,
          } as CSSProperties
        }
        data-flowing={
          flowing && visible && (value === undefined || value < max)
        }
        data-indeterminate={value === undefined && visible}
      />
    </div>
  );
}
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  lines?: number;
  active?: boolean;
}
export function Skeleton({
  label,
  lines = 3,
  active = true,
  className,
  ...props
}: SkeletonProps) {
  const strings = useRosemaryStrings();
  if (!Number.isInteger(lines) || lines < 1 || lines > 100)
    throw new RangeError("Skeleton lines must be an integer from 1 to 100");
  return (
    <div
      {...props}
      className={cx("skeleton", className)}
      role="status"
      aria-label={label ?? strings.loadingContent}
      data-active={active}
    >
      {Array.from({ length: Math.max(1, Math.floor(lines)) }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ width: i === 0 ? "58%" : i === lines - 1 ? "65%" : "90%" }}
        />
      ))}
    </div>
  );
}
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "primary" | "success" | "warning" | "danger" | "info";
}
export function Badge({ tone = "primary", className, ...props }: BadgeProps) {
  return (
    <span {...props} data-tone={tone} className={cx("badge", className)} />
  );
}
export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  name: string;
  src?: string;
  size?: number;
}
export function Avatar({
  name,
  src,
  size = 40,
  className,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [src]);
  return (
    <span
      {...props}
      className={cx("avatar", className)}
      aria-busy={(src && !failed && !loaded) || undefined}
      data-state={!src || failed ? "fallback" : loaded ? "image" : "loading"}
      role="img"
      aria-label={name}
      style={{ width: size, height: size, ...props.style }}
    >
      {src && !failed ? (
        <img
          src={src}
          alt=""
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">
          {Array.from(name.trim()).slice(0, 2).join("")}
        </span>
      )}
    </span>
  );
}
export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <article {...props} className={cx("card", className)} />;
}
export interface ListItem {
  id: string;
  content: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}
export function List({
  items,
  label,
}: {
  items: readonly ListItem[];
  label?: string;
}) {
  return (
    <ul className="rm-list" aria-label={label}>
      {items.map((item) => (
        <li key={item.id}>
          <div>
            {item.content}
            {item.description && (
              <div className="rm-help">{item.description}</div>
            )}
          </div>
          {item.action}
        </li>
      ))}
    </ul>
  );
}
export interface EmptyProps {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: IconName;
}
export function Empty({
  title,
  description,
  action,
  icon = "folder",
}: EmptyProps) {
  return (
    <div className="rm-empty">
      <Icon name={icon} size={40} />
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
export type FeedbackTone = "success" | "warning" | "danger" | "info";
export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  tone?: FeedbackTone;
  onDismiss?: () => void;
  dismissLabel?: string;
}
export function Alert({
  title,
  tone = "info",
  onDismiss,
  dismissLabel,
  children,
  className,
  ...props
}: AlertProps) {
  const strings = useRosemaryStrings();
  return (
    <div
      {...props}
      role={tone === "danger" ? "alert" : "status"}
      className={cx("alert", className)}
      data-tone={tone}
    >
      <Icon
        name={
          tone === "success" ? "check" : tone === "info" ? "info" : "warning"
        }
      />
      <div>
        {title && <strong>{title}</strong>}
        {children}
      </div>
      {onDismiss && (
        <IconButton
          icon="close"
          label={dismissLabel ?? strings.closeNotice}
          variant="ghost"
          onClick={onDismiss}
        />
      )}
    </div>
  );
}
export interface ToastProps extends AlertProps {
  open: boolean;
}
/** Lifetime is controlled by the application: the SDK never guesses task duration or dismissal timing. */
export function Toast({ open, ...props }: ToastProps) {
  return open ? (
    <Alert {...props} className={cx("toast", props.className)} />
  ) : null;
}
