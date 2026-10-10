import { Component, type ReactNode } from "react";
import { Button } from "../ui/core";
export class DocBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="r-empty" role="alert">
        <h1>这页暂时无法显示</h1>
        <p>内容加载遇到问题。可以重新加载当前页面，或返回概览继续浏览。</p>
        <div className="r-control-row">
          <Button onClick={() => location.reload()}>重新加载</Button>
          <a className="r-button r-secondary" href="#/overview">
            返回概览
          </a>
        </div>
      </section>
    );
  }
}
