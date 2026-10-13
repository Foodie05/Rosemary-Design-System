import { cloneElement, useEffect, useId, useRef, useState } from "react";
import type {
  CSSProperties,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import { motion } from "@rosemary-ui/tokens";
import { Button, IconButton } from "./primitives.js";
import { useRosemaryTheme, useRosemaryStrings } from "./theme.js";
export type DismissReason = "cancel" | "outside" | "escape" | "programmatic";
export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean, reason: DismissReason) => void;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  closeLabel?: string;
  closeOnOutside?: boolean;
  modal?: boolean;
  onAnimationComplete?: (open: boolean) => void;
  className?: string;
  returnFocusRef?: { readonly current: HTMLElement | null };
}
function focusConnected(element: HTMLElement | null) {
  if (
    element?.isConnected &&
    !element.closest("[inert]") &&
    !element.hasAttribute("disabled")
  )
    element.focus();
}
function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  closeLabel,
  closeOnOutside = false,
  modal = true,
  onAnimationComplete,
  className,
  returnFocusRef,
  drawer = false,
}: DialogProps & { drawer?: boolean }) {
  const { direction, reducedMotion } = useRosemaryTheme();
  const strings = useRosemaryStrings();
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  const restore = useRef<HTMLElement | null>(null);
  const shownModal = useRef<boolean | null>(null);
  const complete = useRef(onAnimationComplete);
  complete.current = onAnimationComplete;
  const snapshot = useRef<{
    transform: string;
    opacity: string;
    backdrop: string;
  } | null>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let current = true;
    const animations: Animation[] = [];
    if (open && !element.open) {
      restore.current =
        returnFocusRef?.current ??
        (document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null);
      modal ? element.showModal() : element.show();
      shownModal.current = modal;
    } else if (open && shownModal.current !== modal) {
      const active =
        document.activeElement instanceof HTMLElement &&
        element.contains(document.activeElement)
          ? document.activeElement
          : null;
      element.close();
      modal ? element.showModal() : element.show();
      shownModal.current = modal;
      focusConnected(active);
    }
    if (!open && !element.open) return;
    const finish = () => {
      if (!current) return;
      if (!open && element.open) {
        element.close();
        shownModal.current = null;
        focusConnected(restore.current);
      }
      complete.current?.(open);
    };
    if (
      element.open &&
      !reducedMotion &&
      typeof element.animate === "function"
    ) {
      const sign = direction === "rtl" ? -1 : 1;
      const previous = snapshot.current;
      snapshot.current = null;
      const start = previous ?? {
        transform: open
          ? drawer
            ? `translateX(${sign * 100}%)`
            : "translateY(8px) scale(.98)"
          : "translateX(0)",
        opacity: open ? "0" : "1",
        backdrop: open ? "transparent" : "rgba(27,20,40,.325)",
      };
      animations.push(
        element.animate(
          [
            { transform: start.transform, opacity: start.opacity },
            {
              transform: open
                ? "translateX(0)"
                : drawer
                  ? `translateX(${sign * 100}%)`
                  : "translateY(8px) scale(.98)",
              opacity: open ? 1 : 0,
            },
          ],
          {
            duration: drawer
              ? open
                ? motion.drawerEnterMs
                : motion.drawerExitMs
              : open
                ? motion.transition
                : motion.exit,
            easing: motion.easing,
            fill: "both",
          },
        ),
      );
      if (modal) {
        try {
          animations.push(
            element.animate(
              [
                { backgroundColor: start.backdrop },
                {
                  backgroundColor: open ? "rgba(27,20,40,.325)" : "transparent",
                },
              ],
              {
                duration: drawer
                  ? open
                    ? motion.drawerEnterMs
                    : motion.drawerExitMs
                  : open
                    ? motion.transition
                    : motion.exit,
                easing: motion.easing,
                fill: "both",
                pseudoElement: "::backdrop",
              },
            ),
          );
        } catch {
          /* The panel animation remains authoritative when pseudo-element WAAPI is unsupported. */
        }
      }
      Promise.all(animations.map((animation) => animation.finished)).then(
        finish,
        () => {},
      );
    } else {
      snapshot.current = null;
      finish();
    }
    return () => {
      current = false;
      if (animations.length) {
        const computed = getComputedStyle(element);
        snapshot.current = {
          transform: computed.transform,
          opacity: computed.opacity,
          backdrop: getComputedStyle(element, "::backdrop").backgroundColor,
        };
        animations.forEach((animation) => animation.cancel());
      }
    };
  }, [open, drawer, reducedMotion, direction, modal]);
  useEffect(() => {
    const element = ref.current;
    return () => {
      if (element?.open) element.close();
      focusConnected(restore.current);
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={["rm-dialog", drawer ? "rm-drawer" : "", className]
        .filter(Boolean)
        .join(" ")}
      aria-modal={modal || undefined}
      aria-labelledby={`${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      onKeyDownCapture={(e) => {
        if (
          !modal ||
          e.key !== "Tab" ||
          (e.target as HTMLElement).closest("dialog") !== e.currentTarget
        )
          return;
        const candidates = Array.from(
          e.currentTarget.querySelectorAll<HTMLElement>(
            "button, a[href], input, textarea, select, [tabindex]",
          ),
        ).filter(
          (element) =>
            element.tabIndex >= 0 &&
            !element.hasAttribute("disabled") &&
            !element.closest("[hidden], [inert]") &&
            getComputedStyle(element).display !== "none" &&
            getComputedStyle(element).visibility !== "hidden",
        );
        const first = candidates[0],
          last = candidates[candidates.length - 1];
        if (!first) {
          e.preventDefault();
          e.currentTarget.focus();
          return;
        }
        if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === e.currentTarget)
        ) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onOpenChange(false, "escape");
      }}
      onClick={(e) => {
        if (closeOnOutside && e.target === e.currentTarget) {
          const b = e.currentTarget.getBoundingClientRect();
          if (
            e.clientX < b.left ||
            e.clientX > b.right ||
            e.clientY < b.top ||
            e.clientY > b.bottom
          )
            onOpenChange(false, "outside");
        }
      }}
    >
      <header>
        <h2 id={`${id}-title`}>{title}</h2>
        <IconButton
          variant="ghost"
          icon="close"
          label={closeLabel ?? strings.close}
          onClick={() => onOpenChange(false, "cancel")}
        />
      </header>
      {description && (
        <p id={`${id}-description`} className="rm-help">
          {description}
        </p>
      )}
      <div className="rm-dialog-body">{children}</div>
      {footer && <footer>{footer}</footer>}
    </dialog>
  );
}
export function Dialog(props: DialogProps) {
  return <Modal {...props} />;
}
export function Drawer(props: DialogProps) {
  return <Modal {...props} drawer />;
}
export interface PopoverProps {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}
/** Rendered inside the provider and any active modal's top layer, so the popup inherits theme and focus scope. */
export function Popover({ label, open, onOpenChange, children }: PopoverProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) panel.current?.focus();
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) onOpenChange(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open, onOpenChange]);
  return (
    <div ref={root} className="rm-popover">
      <Button
        ref={trigger}
        variant="secondary"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => onOpenChange(!open)}
      >
        {label}
      </Button>
      {open && (
        <div
          ref={panel}
          tabIndex={-1}
          id={id}
          role="region"
          aria-label={label}
          className="rm-popover-panel"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.preventDefault();
              onOpenChange(false);
              trigger.current?.focus();
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
export interface TooltipProps {
  content: ReactNode;
  children: ReactElement<HTMLAttributes<HTMLElement>>;
  delay?: number;
}
export function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const stop = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <span
      className="rm-tooltip-wrap"
      onPointerEnter={() => {
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setVisible(true), delay);
      }}
      onPointerLeave={stop}
      onFocus={() => {
        clearTimeout(timer.current);
        setVisible(true);
      }}
      onBlur={stop}
      onKeyDown={(e) => {
        if (e.key === "Escape") stop();
      }}
    >
      {cloneElement(children, {
        "aria-describedby": [children.props["aria-describedby"], id]
          .filter(Boolean)
          .join(" "),
      })}
      <span role="tooltip" id={id} className="rm-tooltip" hidden={!visible}>
        {content}
      </span>
    </span>
  );
}
