import { flushSync } from "react-dom";
import { parseRoute } from "./routing";
import { COMPONENT_SPECS } from "./data/componentsSpec";
import { NAV_ITEMS } from "./data/navigation";
import { DO_DONT_CASES } from "./data/doDontCases";
type Route = ReturnType<typeof parseRoute>;
export type PageMotion =
  "none" | "peer-forward" | "peer-back" | "deeper" | "parent" | "cross";
export const pageKey = (route: Route) => `${route.section}/${route.id || ""}`;
/** Only actual route hierarchy and registered order determine direction. Queries/anchors are not pages. */
export function pageMotionFor(from: Route, to: Route): PageMotion {
  if (pageKey(from) === pageKey(to)) return "none";
  if (from.section === to.section) {
    if (!from.id && to.id) return "deeper";
    if (from.id && !to.id) return "parent";
    const ids = (
      to.section === "components" ? COMPONENT_SPECS : DO_DONT_CASES
    ).map((v) => v.id);
    const a = ids.indexOf(from.id!),
      b = ids.indexOf(to.id!);
    return a < 0 || b < 0 ? "cross" : b > a ? "peer-forward" : "peer-back";
  }
  if (!from.id && !to.id)
    return NAV_ITEMS.findIndex((v) => v.id === to.section) >
      NAV_ITEMS.findIndex((v) => v.id === from.section)
      ? "peer-forward"
      : "peer-back";
  return "cross";
}
let active: ViewTransition | undefined;
let generation = 0;
export function cancelPageMotion() {
  active?.skipTransition();
  active = undefined;
  delete document.documentElement.dataset.routeTransition;
}
const contentReady = () =>
  new Promise<void>((resolve) => {
    const main = document.getElementById("main-content");
    if (!main?.querySelector(".r-loading-message")) return resolve();
    const finish = () => {
      observer.disconnect();
      clearTimeout(timer);
      resolve();
    };
    const observer = new MutationObserver(() => {
      if (!main.querySelector(".r-loading-message")) finish();
    });
    observer.observe(main, { childList: true, subtree: true });
    // A failed/slow chunk must never leave input blocked indefinitely by a snapshot.
    const timer = window.setTimeout(finish, 4000);
  });
export function changePage(motion: PageMotion, update: () => void) {
  cancelPageMotion();
  const serial = ++generation;
  const root = document.documentElement;
  root.dataset.routeMotion = motion;
  if (
    motion === "none" ||
    root.dataset.motion === "reduced" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    typeof document.startViewTransition !== "function"
  ) {
    update();
    return;
  }
  root.dataset.routeTransition = "native";
  try {
    const transition = document.startViewTransition(async () => {
      if (serial !== generation) return;
      flushSync(update);
      await contentReady();
    });
    active = transition;
    const finish = () => {
      if (active === transition) {
        active = undefined;
        delete root.dataset.routeTransition;
      }
    };
    void transition.finished.then(finish, finish);
    // Rapid navigation intentionally skips a previous capture; consume that rejection.
    void transition.ready.catch(() => {});
  } catch {
    delete root.dataset.routeTransition;
    update();
  }
}
