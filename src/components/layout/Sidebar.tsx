import { SectionId } from "../../types";
import { Modal } from "../ui/core";
import { NAV_GROUPS as groups } from "../../data/navigation";
export function Sidebar({
  currentSection,
  isOpenMobile,
  onCloseMobile,
}: {
  currentSection: SectionId;
  onSelectSection?: (s: SectionId, c?: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}) {
  const content = (
    <>
      <div className="r-sidebar-title">
        <span className="r-eyebrow">DESIGN SYSTEM</span>
        <span>Organic Precision</span>
      </div>
      <nav aria-label="文档导航">
        {groups.map((group) => (
          <div className="r-sidebar-group" key={group.title}>
            <h2>{group.title}</h2>
            {group.links.map(([s, zh, en]) => (
              <a
                key={s}
                href={`#/${s}`}
                aria-current={s === currentSection ? "page" : undefined}
                onClick={onCloseMobile}
              >
                <span>{zh}</span>
                <small>{en}</small>
              </a>
            ))}
          </div>
        ))}
      </nav>
      <div className="r-sidebar-bottom">
        <span className="r-dot" /> 持续生长的设计语言
        <br />
        <a href="#/governance">查看版本与验证状态 ↗</a>
      </div>
    </>
  );
  return (
    <>
      <aside id="site-sidebar" className="r-sidebar">
        {content}
      </aside>
      <Modal
        id="rosemary-mobile-nav"
        open={isOpenMobile}
        onClose={onCloseMobile}
        title="文档导航"
        kind="navigation"
      >
        {content}
      </Modal>
    </>
  );
}
