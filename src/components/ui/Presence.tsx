import { ReactNode } from "react";
import { usePresence } from "../../hooks/usePresence";
/** Visual exit contains no live controls, announcements or focusable content. */
export function Presence({
  open,
  children,
  className = "",
  collapse = false,
}: {
  open: boolean;
  children: ReactNode;
  className?: string;
  collapse?: boolean;
}) {
  const { present, phase } = usePresence(open, collapse ? "settle" : "exit");
  if (!present) return null;
  return (
    <div
      className={`r-presence ${collapse ? "r-presence-collapse" : ""} ${className}`}
      data-motion-state={phase}
      aria-hidden={!open || undefined}
      inert={!open || undefined}
    >
      <div className="r-presence-content">{children}</div>
    </div>
  );
}
