import { SectionId } from "./types";
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
  const [section = "overview", id] = path.split("/");
  const params = new URLSearchParams(query);
  return {
    section: (sections.includes(section as SectionId)
      ? section
      : "overview") as SectionId,
    id,
    anchor: params.get("anchor") || undefined,
    query: params.get("query") || "",
    key: hash || "#/overview",
  };
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
