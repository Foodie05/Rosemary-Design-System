import { SectionId } from "./types";
import { COMPONENT_SPECS } from "./data/componentsSpec";
import { DO_DONT_CASES } from "./data/doDontCases";
export const sections: SectionId[] = [
  "overview",
  "philosophy",
  "brand",
  "foundations",
  "components",
  "patterns",
  "dodont",
  "platforms",
  "accessibility",
  "tokens",
  "content",
  "ai-guide",
  "governance",
];
export function parseRoute(hash: string) {
  const [path, query = ""] = hash.replace(/^#\/?/, "").split("?");
  let parts: string[];
  let malformed = false;
  try {
    parts = path.replace(/\/+$/, "").split("/").map(decodeURIComponent);
  } catch {
    parts = [];
    malformed = true;
  }
  const [section = "overview", id] = parts;
  const current = (section || "overview") as SectionId;
  const known = sections.includes(current);
  const validChild =
    !id ||
    (current === "components" && COMPONENT_SPECS.some((c) => c.id === id)) ||
    (current === "dodont" && DO_DONT_CASES.some((c) => c.id === id));
  const params = new URLSearchParams(query);
  return {
    section: known ? current : "overview",
    id,
    notFound: malformed || !known || parts.length > 2 || !validChild,
    anchor: params.get("anchor") || undefined,
    query: params.get("query") || "",
    key: hash || "#/overview",
  };
}
export function routeFromLocation({
  hash,
  pathname,
}: {
  hash: string;
  pathname: string;
}) {
  const route = parseRoute(hash);
  if (pathname === "/" || pathname === "/index.html") return route;
  return { ...route, notFound: true, anchor: undefined, key: pathname + hash };
}
export function routeFor(section: SectionId, child?: string) {
  if (!child) return `#/${section}`;
  if (
    (section === "dodont" && child.startsWith("case-")) ||
    (section === "components" && !child.startsWith("comp-"))
  )
    return `#/${section}/${child}`;
  return `#/${section}?anchor=${encodeURIComponent(child)}`;
}
