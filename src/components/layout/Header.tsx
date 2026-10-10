import { useRef } from "react";
import { useSelectionIndicator } from "../../hooks/useSelectionIndicator";
import { Button, IconButton } from "../ui/core";
import { useSitePreferences } from "../../context/SitePreferences";
import { Moon, Sun, Search, Menu, X } from "lucide-react";
import { SectionId } from "../../types";
export function Header({
  currentSection,
  isDark,
  onToggleTheme,
  onOpenSearch,
  isMobileMenuOpen,
  onToggleMobileMenu,
}: {
  currentSection: SectionId;
  onSelectSection?: (s: SectionId) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  isMobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}) {
  const { isMac } = useSitePreferences();
  const nav = useRef<HTMLElement>(null);
  const indicator = useSelectionIndicator(nav, currentSection);
  return (
    <header className="r-header">
      <div className="r-header-inner">
        <a href="#/overview" className="r-wordmark">
          <img src="https://dl.cruty.cn/logo/rosemary_pure.png" alt="" />
          <span>
            Rosemary <em>Design</em>
          </span>
        </a>
        <nav ref={nav} className="r-selection-group" aria-label="主导航">
          {[
            ["overview", "概览"],
            ["brand", "品牌"],
            ["foundations", "基础"],
            ["components", "组件"],
            ["dodont", "案例"],
            ["tokens", "Tokens"],
          ].map(([s, label]) => (
            <a
              key={s}
              href={`#/${s}`}
              aria-current={s === currentSection ? "page" : undefined}
            >
              {label}
            </a>
          ))}
          <span
            aria-hidden="true"
            className="r-tab-indicator"
            style={indicator}
          />
        </nav>
        <div className="r-header-tools">
          <Button
            variant="ghost"
            className="r-header-search"
            onClick={onOpenSearch}
            aria-label="搜索设计规范"
          >
            <Search aria-hidden="true" />
            <span className="r-header-search-label">搜索规范</span>
            <kbd>{isMac ? "⌘ K" : "Ctrl K"}</kbd>
          </Button>
          <IconButton
            onClick={onToggleTheme}
            label={isDark ? "切换浅色主题" : "切换深色主题"}
          >
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </IconButton>
          <a className="r-header-version" href="#/governance">
            v2.0 <span>Beta</span>
          </a>
          <span className="r-mobile-menu-toggle">
            <IconButton
              aria-expanded={isMobileMenuOpen}
              aria-controls="rosemary-mobile-nav"
              label={isMobileMenuOpen ? "关闭导航" : "打开导航"}
              onClick={onToggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X aria-hidden="true" />
              ) : (
                <Menu aria-hidden="true" />
              )}
            </IconButton>
          </span>
        </div>
      </div>
    </header>
  );
}
