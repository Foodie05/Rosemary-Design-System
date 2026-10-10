import { ArrowRight } from "lucide-react";
import { PrecisionGlyph } from "../brand/PrecisionGlyph.tsx";

/** Shared by the application and the HTML error document. Recovery works without JavaScript. */
export function NotFoundPage() {
  return (
    <div className="r-not-found">
      <a
        className="r-skip-link"
        href="#not-found-content"
        onClick={(event) => {
          event.preventDefault();
          const content = document.getElementById("not-found-content");
          content?.focus();
          content?.scrollIntoView({ behavior: "instant" });
        }}
      >
        跳到主要内容
      </a>
      <header className="r-not-found-header">
        <a
          className="r-not-found-wordmark"
          href="/#/overview"
          aria-label="Rosemary Design 首页"
        >
          Rosemary <em>Design</em>
        </a>
      </header>
      <main id="not-found-content" tabIndex={-1} className="r-not-found-main">
        <div className="r-not-found-copy">
          <p className="r-not-found-code">
            404 <span>PAGE NOT FOUND</span>
          </p>
          <h1>页面未找到。</h1>
          <p className="r-not-found-description">
            请检查地址，或返回首页继续查阅。
          </p>
          <nav className="r-not-found-actions" aria-label="恢复导航">
            <a className="r-button r-primary" href="/#/overview">
              返回首页 <ArrowRight aria-hidden="true" />
            </a>
          </nav>
        </div>
        <div className="r-not-found-art" aria-hidden="true">
          <PrecisionGlyph />
        </div>
      </main>
      <footer className="r-not-found-footer">© 2026 Rosemary Island LLC</footer>
    </div>
  );
}
