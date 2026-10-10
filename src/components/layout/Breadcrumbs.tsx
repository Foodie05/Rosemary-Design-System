import { NAV_ITEMS } from "../../data/navigation";
import { COMPONENT_SPECS } from "../../data/componentsSpec";
import { DO_DONT_CASES } from "../../data/doDontCases";
import { getCaseImplementation } from "../cases/registry";
import { parseRoute } from "../../routing";
export function Breadcrumbs({
  route,
}: {
  route: ReturnType<typeof parseRoute>;
}) {
  if (route.section === "overview") return null;
  const section = NAV_ITEMS.find((item) => item.section === route.section)!;
  const child = route.id && ["components", "dodont"].includes(route.section);
  const title = !child
    ? section.title
    : route.section === "components"
      ? COMPONENT_SPECS.find((spec) => spec.id === route.id)?.name ||
        "未找到的组件"
      : DO_DONT_CASES.some((item) => item.id === route.id)
        ? getCaseImplementation(route.id!).title
        : "未找到的案例";
  return (
    <nav aria-label="页面面包屑" className="r-page-breadcrumb">
      <ol role="list">
        <li>
          <a href="#/overview">Rosemary Design</a>
        </li>
        {child && (
          <li>
            <span aria-hidden="true" className="r-breadcrumb-separator">
              ›
            </span>
            <a href={`#/${route.section}`}>{section.title}</a>
          </li>
        )}
        <li>
          <span aria-hidden="true" className="r-breadcrumb-separator">
            ›
          </span>
          <span aria-current="page">{title}</span>
        </li>
      </ol>
    </nav>
  );
}
