import { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
/** Native disclosure: details remain searchable in the source and reachable by deep links. */
export function DocDisclosure({
  id,
  title,
  children,
  className = "",
}: {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <details id={id} className={`r-doc-disclosure ${className}`}>
      <summary>
        <h2>{title}</h2>
        <ChevronDown aria-hidden="true" />
      </summary>
      <div className="r-doc-disclosure-body">{children}</div>
    </details>
  );
}
export function revealAnchor(target: HTMLElement) {
  let detail: HTMLDetailsElement | null = target.closest("details");
  while (detail) {
    detail.open = true;
    detail = detail.parentElement?.closest("details") || null;
  }
}
