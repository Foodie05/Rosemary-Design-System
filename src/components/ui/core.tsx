import React, { useEffect, useId, useRef, useState } from "react";
import { LoaderCircle, X } from "lucide-react";
import { usePresence, motionMilliseconds } from "../../hooks/usePresence";
export type Variant = "primary" | "secondary" | "tertiary" | "ghost" | "danger";
export type Size = "sm" | "md" | "lg";
export interface PreviewProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  label?: string;
}
export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  disabled,
  error: _error,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  error?: boolean;
}) {
  return (
    <button
      {...props}
      type={props.type || "button"}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`r-button r-${variant} r-${size} ${className}`}
    >
      <span className="r-button-content">
        {loading && (
          <LoaderCircle
            aria-hidden="true"
            size={16}
            className="r-spin r-button-spinner"
          />
        )}
        {children}
      </span>
    </button>
  );
}
export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="r-field">
      <span className="r-field-label">{label}</span>
      {children}
      {(error || hint) && (
        <small className={error ? "r-error" : "r-muted"}>{error || hint}</small>
      )}
    </div>
  );
}
export function Status({
  children,
  tone = "success",
}: {
  children: React.ReactNode;
  tone?: "success" | "danger" | "warning" | "info";
}) {
  return (
    <span className={`r-status r-tone-${tone}`}>
      <span aria-hidden="true">
        {tone === "success"
          ? "✓"
          : tone === "danger"
            ? "!"
            : tone === "warning"
              ? "△"
              : "i"}
      </span>
      {children}
    </span>
  );
}
export function Modal({
  open,
  onClose,
  title,
  children,
  alert = false,
  kind = "dialog",
  id: dialogId,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  alert?: boolean;
  kind?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const id = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      returnTo.current = document.activeElement as HTMLElement;
      dialog.showModal();
      // Place initial focus on the editable task or a content action, never an incidental close tooltip.
      const target =
        dialog.querySelector<HTMLElement>(
          '[data-autofocus], input:not(:disabled):not([type="hidden"]), textarea:not(:disabled)',
        ) ||
        dialog.querySelector<HTMLElement>(
          'button:not(:disabled):not([aria-label="关闭对话框"]), [role="combobox"]:not(:disabled)',
        );
      target?.focus({ preventScroll: true });
    } else if (!open && dialog.open) {
      dialog.close();
      returnTo.current?.focus({ preventScroll: true });
    }
  }, [open]);
  useEffect(
    () => () => {
      if (ref.current?.open) ref.current.close();
      returnTo.current?.focus();
    },
    [],
  );
  return (
    <dialog
      id={dialogId}
      ref={ref}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
      data-motion-state={open ? "open" : "exiting"}
      className={`r-modal r-modal-${kind}`}
      role={alert ? "alertdialog" : undefined}
      aria-labelledby={id}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={(event) => {
        // Native close events are queued; an older one must not close a reopened dialog.
        if (event.currentTarget.open) return;
        if (open) onClose();
        returnTo.current?.focus({ preventScroll: true });
      }}
      onKeyDown={(e) => {
        if (e.key === "Tab") {
          const nodes = [
            ...e.currentTarget.querySelectorAll<HTMLElement>(
              'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]',
            ),
          ].filter(
            (el) =>
              el.getAttribute("tabindex") !== "-1" &&
              el.getClientRects().length,
          );
          const first = nodes[0],
            last = nodes[nodes.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <div className="r-modal-heading">
        <h2 id={id}>{title}</h2>
        <IconButton label="关闭对话框" onClick={onClose}>
          <X aria-hidden="true" />
        </IconButton>
      </div>
      {children}
    </dialog>
  );
}
export function Reset({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      重置
    </Button>
  );
}
export function DemoMessage({ children }: { children: React.ReactNode }) {
  return (
    <p className="r-demo-message" role="status">
      {children}
    </p>
  );
}

/** Supplemental help: delay, keyboard dismissal and hover persistence share one behavior. */
export function Tooltip({
  text,
  children,
  placement = "above",
}: {
  text: string;
  children: React.ReactElement<{ "aria-describedby"?: string }>;
  placement?: "above" | "below";
}) {
  const id = useId();
  const [visible, show] = useState(false);
  const { present, phase } = usePresence(visible);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const keyboardIntent = useRef(false);
  const active = useRef({
    hover: false,
    focus: false,
    dismissed: false,
    pointer: false,
  });
  const cancel = () => {
    if (active.current.hover || active.current.focus) return;
    active.current.dismissed = false;
    clearTimeout(timer.current);
    show(false);
  };
  const reveal = () => {
    if (active.current.dismissed) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(
      () => show(true),
      motionMilliseconds("tooltip-delay"),
    );
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    const pointer = () => {
      keyboardIntent.current = false;
      active.current.focus = false;
      cancel();
    };
    const dismiss = (e: KeyboardEvent) => {
      keyboardIntent.current =
        e.key === "Tab" ||
        [
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(e.key);
      if (
        e.key === "Escape" &&
        (active.current.hover || active.current.focus)
      ) {
        active.current.dismissed = true;
        clearTimeout(timer.current);
        show(false);
      }
    };
    document.addEventListener("keydown", dismiss, true);
    document.addEventListener("pointerdown", pointer, true);
    return () => {
      document.removeEventListener("keydown", dismiss, true);
      document.removeEventListener("pointerdown", pointer, true);
    };
  }, []);
  return (
    <span
      className="r-tooltip-anchor"
      onPointerEnter={(e) => {
        if (e.pointerType === "touch") return;
        active.current.hover = true;
        reveal();
      }}
      onPointerDown={() => {
        active.current.pointer = true;
        active.current.focus = false;
        cancel();
      }}
      onPointerLeave={() => {
        active.current.hover = false;
        active.current.pointer = false;
        cancel();
      }}
      onFocus={() => {
        active.current.focus =
          keyboardIntent.current && !active.current.pointer;
        if (active.current.focus) reveal();
      }}
      onBlur={() => {
        active.current.focus = false;
        active.current.pointer = false;
        cancel();
      }}
    >
      {React.cloneElement(children, {
        "aria-describedby": [
          children.props["aria-describedby"],
          visible ? id : undefined,
        ]
          .filter(Boolean)
          .join(" "),
      })}
      <span
        className={`r-tooltip r-tooltip-${placement}`}
        role="tooltip"
        id={id}
        hidden={!present}
        aria-hidden={!visible || undefined}
        data-motion-state={phase}
        inert={!visible || undefined}
      >
        {text}
      </span>
    </span>
  );
}
export function IconButton({
  label,
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <Tooltip text={label} placement="below">
      <Button
        variant="ghost"
        {...props}
        aria-label={label}
        className={`r-icon-control ${className}`}
      >
        {children}
      </Button>
    </Tooltip>
  );
}
