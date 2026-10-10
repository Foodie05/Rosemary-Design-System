import { revealAnchor } from "./components/common/DocDisclosure";
import { changePage, pageMotionFor, pageKey, PageMotion } from "./pageMotion";
import { PageMotionPreference } from "./components/common/SelectionMotion";
import { Breadcrumbs } from "./components/layout/Breadcrumbs";
import { useScrollbars } from "./hooks/useScrollbars";
import {
  MotionPreferences,
  MotionPreferenceControl,
} from "./context/MotionPreferences";
import { Select } from "./components/ui/Select";
import {
  SitePreferences,
  ThemePreference,
  platformIsMac,
} from "./context/SitePreferences";
import { DocBoundary } from "./components/common/DocBoundary";
import { NotFoundPage } from "./components/common/NotFoundPage";
import {
  lazy,
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ComponentType,
} from "react";
import { COMPONENT_SPECS } from "./data/componentsSpec";
import { getCaseImplementation } from "./components/cases/registry";
import { DO_DONT_CASES } from "./data/doDontCases";
import { SectionId } from "./types";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { CommandSearch } from "./components/search/CommandSearch";
import { OverviewView } from "./components/views/OverviewView";
import { routeFromLocation, routeFor } from "./routing";
type DocViewProps = {
  initialCaseId?: string;
  componentId?: string;
  query?: string;
};
const modules = import.meta.glob<Record<string, ComponentType<DocViewProps>>>([
  "./components/views/*.tsx",
  "!./components/views/OverviewView.tsx",
]);
const load = (name: string) =>
  lazy<ComponentType<DocViewProps>>(() =>
    modules[`./components/views/${name}.tsx`]().then(
      (module: Record<string, ComponentType<DocViewProps>>) => ({
        default: module[name],
      }),
    ),
  );
const views: Partial<Record<SectionId, ReturnType<typeof load>>> = {
  brand: load("BrandView"),
  foundations: load("FoundationsView"),
  components: load("ComponentsView"),
  dodont: load("DoDontGalleryView"),
  patterns: load("PatternsView"),
  platforms: load("PlatformsView"),
  accessibility: load("AccessibilityView"),
  tokens: load("TokensView"),
  content: load("ContentView"),
  "ai-guide": load("AIAgentGuideView"),
  governance: load("GovernanceView"),
  philosophy: load("PhilosophyView"),
};
const titles: Record<SectionId, string> = {
  overview: "概览",
  philosophy: "设计哲学",
  brand: "品牌语言",
  foundations: "设计基础",
  components: "组件库",
  dodont: "案例指南",
  patterns: "交互模式",
  platforms: "跨平台",
  accessibility: "无障碍",
  tokens: "设计令牌",
  content: "内容与文案",
  "ai-guide": "AI 编程指南",
  governance: "规范治理",
};
export default function App() {
  useScrollbars();
  const [route, setRoute] = useState(() => routeFromLocation(location));
  const currentRoute = useRef(route);
  const [pageMotion, setPageMotion] = useState<{
    kind: PageMotion;
    native: boolean;
  }>({ kind: "none", native: false });
  const [theme, setTheme] = useState<ThemePreference>(() => {
    try {
      const saved = localStorage.getItem("rosemary_theme");
      return saved === "light" || saved === "dark" ? saved : "system";
    } catch {
      return "system";
    }
  });
  const [systemDark, setSystemDark] = useState(
    () => matchMedia("(prefers-color-scheme: dark)").matches,
  );
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  useEffect(() => {
    const media = matchMedia("(prefers-color-scheme: dark)");
    const update = () => setSystemDark(media.matches);
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);
  const [search, openSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const previous = useRef(route.key);
  const positions = useRef<Record<string, number>>({});
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    try {
      localStorage.setItem("rosemary_theme", theme);
    } catch {}
  }, [isDark, theme]);
  useEffect(() => {
    const handle = () => {
      positions.current[previous.current] = window.scrollY;
      const next = routeFromLocation(location);
      previous.current = next.key;
      const motion = pageMotionFor(currentRoute.current, next);
      currentRoute.current = next;
      changePage(motion, () => {
        setPageMotion({
          kind: motion,
          native: document.documentElement.dataset.routeTransition === "native",
        });
        setRoute(next);
        setMenu(false);
        openSearch(false);
      });
    };
    window.addEventListener("hashchange", handle);
    return () => window.removeEventListener("hashchange", handle);
  }, []);
  useLayoutEffect(() => {
    const item = route.id
      ? route.section === "components"
        ? COMPONENT_SPECS.find((c) => c.id === route.id)?.name
        : route.section === "dodont" &&
            DO_DONT_CASES.some((c) => c.id === route.id)
          ? getCaseImplementation(route.id)?.title
          : undefined
      : undefined;
    document.title = route.notFound
      ? "404 · 页面未找到 — Rosemary Design"
      : `${item ? item + " · " : ""}${titles[route.section]} — Rosemary Design`;
    let observer: MutationObserver | undefined;
    const attempt = () => {
      if (main.current?.querySelector(".r-loading-message")) return false;
      if (route.notFound) {
        window.scrollTo(0, 0);
        document
          .getElementById("not-found-content")
          ?.focus({ preventScroll: true });
      } else if (route.anchor) {
        const target = document.getElementById(route.anchor);
        if (!target) return false;
        revealAnchor(target);
        target.scrollIntoView({
          behavior:
            document.documentElement.dataset.motion === "reduced" ||
            matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "instant"
              : "smooth",
        });
      } else {
        window.scrollTo(0, positions.current[route.key] || 0);
        main.current?.focus({ preventScroll: true });
      }
      return true;
    };
    if (!attempt()) {
      observer = new MutationObserver(() => {
        if (attempt()) observer?.disconnect();
      });
      if (main.current)
        observer.observe(main.current, { childList: true, subtree: true });
    }
    return () => {
      observer?.disconnect();
    };
  }, [route.key]);
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (
        !currentRoute.current.notFound &&
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        openSearch((v) => !v);
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  const navigate = (section: SectionId, child?: string) => {
    location.hash = routeFor(section, child);
  };
  const home = route.section === "overview";
  const View = views[route.section];
  return (
    <MotionPreferences>
      <PageMotionPreference />
      <SitePreferences.Provider
        value={{ mode: isDark ? "dark" : "light", isMac: platformIsMac() }}
      >
        {route.notFound ? (
          <div
            key={pageKey(route)}
            className="r-route-content"
            data-route-motion={pageMotion.kind}
            data-native={pageMotion.native || undefined}
          >
            <NotFoundPage />
          </div>
        ) : (
          <div className="r-app">
            <a
              href="#main-content"
              className="r-skip-link"
              onClick={(e) => {
                e.preventDefault();
                main.current?.focus();
              }}
            >
              跳到主要内容
            </a>
            <Header
              currentSection={route.section}
              isDark={isDark}
              onToggleTheme={() => setTheme(isDark ? "light" : "dark")}
              onOpenSearch={() => openSearch(true)}
              isMobileMenuOpen={menu}
              onToggleMobileMenu={() => setMenu(!menu)}
            />
            <div className={home ? "r-home-frame" : "r-doc-frame"}>
              <div className={home ? "r-home-sidebar" : ""}>
                <Sidebar
                  currentSection={route.section}
                  isOpenMobile={menu}
                  onCloseMobile={() => setMenu(false)}
                />
              </div>
              <main
                id="main-content"
                ref={main}
                tabIndex={-1}
                className={home ? "r-home-main" : "r-document-main"}
              >
                <div
                  key={pageKey(route)}
                  className="r-route-content"
                  data-route-motion={pageMotion.kind}
                  data-native={pageMotion.native || undefined}
                >
                  <Breadcrumbs route={route} />
                  <DocBoundary key={route.key}>
                    <Suspense
                      fallback={
                        <p className="r-loading-message" role="status">
                          正在加载规范…
                        </p>
                      }
                    >
                      {home ? (
                        <OverviewView onNavigate={navigate} />
                      ) : (
                        View && (
                          <View
                            {...(route.section === "dodont"
                              ? { initialCaseId: route.id }
                              : route.section === "components"
                                ? { componentId: route.id }
                                : route.section === "tokens"
                                  ? { query: route.query }
                                  : {})}
                          />
                        )
                      )}
                    </Suspense>
                  </DocBoundary>
                </div>
                <footer className="r-footer">
                  <div className="r-footer-identity">
                    <a href="#/overview" className="r-footer-wordmark">
                      Rosemary <em>Design</em>
                    </a>
                    <p>以审慎的思考，创造自然的体验。</p>
                  </div>
                  <div className="r-footer-utilities">
                    <nav className="r-footer-links" aria-label="页脚链接">
                      <a href="#/governance">v2.0 Beta · 验证记录</a>
                      <a href="#/accessibility">无障碍目标</a>
                      <a href="#/ai-guide">Agent 指南</a>
                    </nav>
                    <div className="r-footer-preferences">
                      <label className="r-field r-theme-preference">
                        <span className="r-field-label">网站主题</span>
                        <Select
                          value={theme}
                          onValueChange={(value) =>
                            setTheme(value as ThemePreference)
                          }
                          label={"网站主题"}
                          options={[
                            { value: "system", label: "跟随系统" },
                            { value: "light", label: "浅色" },
                            { value: "dark", label: "深色" },
                          ]}
                        />
                      </label>
                      <MotionPreferenceControl />
                    </div>
                  </div>
                  <span>© 2026 Rosemary Island LLC</span>
                </footer>
              </main>
            </div>
            <CommandSearch isOpen={search} onClose={() => openSearch(false)} />
          </div>
        )}
      </SitePreferences.Provider>
    </MotionPreferences>
  );
}
