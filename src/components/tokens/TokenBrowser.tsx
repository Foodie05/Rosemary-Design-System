import { SelectionGroup, SelectionContent } from "../common/SelectionMotion";
import { Select } from "../ui/Select";
import { useSitePreferences } from "../../context/SitePreferences";
import { useState, useEffect } from "react";
import { tokenModes, tokenNames } from "../../generated/tokens";
import { Button } from "../ui/core";
export function TokenBrowser({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, set] = useState(initialQuery);
  const [layer, setLayer] = useState(initialQuery ? "all" : "semantic");
  const { mode: siteMode } = useSitePreferences();
  const [theme, setTheme] = useState<"site" | "light" | "dark">("site");
  const mode = theme === "site" ? siteMode : theme;
  const [type, setType] = useState("all");
  const [copy, setCopy] = useState("");
  const [manualReference, setManualReference] = useState("");
  const [batch, setBatch] = useState({ key: "", size: 12 });
  const filterKey = `${q}\0${layer}\0${type}`;
  const visibleCount = batch.key === filterKey ? batch.size : 12;
  useEffect(() => setBatch({ key: filterKey, size: 12 }), [filterKey]);
  const [output, setOutput] = useState("rosemary.css");
  const filtered = tokenNames.filter((name) => {
    const t = tokenModes[mode][name];
    return (
      (layer === "all" || t.layer === layer) &&
      (type === "all" || t.type === type) &&
      `${name} ${t.value} ${t.reference || ""}`
        .toLowerCase()
        .includes(q.toLowerCase())
    );
  });
  const outputs = [
    ["rosemary.css", "Web CSS"],
    ["light.tokens.json", "DTCG Light"],
    ["dark.tokens.json", "DTCG Dark"],
    ["rosemary_tokens.dart", "Flutter / Dart"],
    ["RosemaryTokens.swift", "SwiftUI"],
    ["RosemaryTokens.kt", "Compose"],
    ["RosemaryTokens.cs", "WinUI / C#"],
    ["validation.json", "校验报告"],
  ];
  return (
    <div>
      <div className="r-filter-bar">
        <label className="r-search-field">
          搜索令牌
          <input
            type="search"
            value={q}
            onChange={(e) => set(e.target.value)}
            placeholder="名称、值或引用路径…"
          />
        </label>
        <label>
          主题
          <Select
            value={theme}
            onValueChange={(value) =>
              setTheme(value as "site" | "light" | "dark")
            }
            label={"主题"}
            options={[
              { value: "site", label: "跟随网站" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ]}
          />
        </label>
        <label>
          类型
          <Select
            value={type}
            onValueChange={(value) => setType(value)}
            label={"类型"}
            options={[
              { value: "all", label: "全部类型" },
              ...[
                "color",
                "dimension",
                "fontFamily",
                "duration",
                "cubicBezier",
              ].map((v) => ({ value: String(v), label: String(v) })),
            ]}
          />
        </label>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            set("");
            setLayer("all");
            setType("all");
          }}
        >
          清除筛选
        </Button>
      </div>
      <SelectionGroup
        value={layer}
        label="令牌层级"
        className="r-category-strip"
      >
        {["all", "primitive", "semantic", "component"].map((v) => (
          <button
            key={v}
            aria-pressed={layer === v}
            onClick={() => setLayer(v)}
          >
            {v}
            <span>
              {
                tokenNames.filter(
                  (n) => v === "all" || tokenModes.light[n].layer === v,
                ).length
              }
            </span>
          </button>
        ))}
      </SelectionGroup>
      <div className="r-token-download">
        <div>
          <strong>同一份源，多个平台产物。</strong>
          <p>
            文件均由构建生成。三端本地 SDK 的构建记录见跨平台指南；WinUI
            构建待完成。
          </p>
        </div>
        <label className="sr-only" htmlFor="token-output">
          下载平台
        </label>
        <Select
          id="token-output"
          value={output}
          onValueChange={(value) => setOutput(value)}
          label={"下载平台"}
          options={[
            ...outputs.map(([f, l]) => ({
              value: String(f),
              label: String(l),
            })),
          ]}
        />
        <a
          href={`/generated/${output}`}
          download
          className="r-button r-secondary"
        >
          下载产物 ↓
        </a>
      </div>
      <div className="r-results-heading">
        <p role="status">
          {filtered.length} 个令牌 · 显示{" "}
          {Math.min(filtered.length, visibleCount)} 个 · {mode}
        </p>
        <span>DTCG 2025.10 / supported subset</span>
      </div>
      <SelectionContent
        value={layer}
        index={["all", "primitive", "semantic", "component"].indexOf(layer)}
        className="r-token-grid"
      >
        {filtered.slice(0, visibleCount).map((name) => {
          const t = tokenModes[mode][name];
          const varName = `--r-${name.replaceAll(".", "-")}`;
          return (
            <article key={name} className="r-token-card">
              <div className="r-token-swatch" data-theme={mode}>
                {t.type === "color" ? (
                  <div style={{ background: t.value }} />
                ) : t.type === "fontFamily" ? (
                  <span style={{ fontFamily: t.value }}>Aa 设计</span>
                ) : t.type === "dimension" ? (
                  <div
                    className="r-token-measure"
                    style={{
                      width: Math.min(
                        (t.resolved as { value: number }).value,
                        140,
                      ),
                    }}
                  />
                ) : (
                  <code>{t.value}</code>
                )}
              </div>
              <div>
                <div className="r-eyebrow">
                  <span>层级：{t.layer}</span>
                  <span>类型：{t.type}</span>
                </div>
                <h3>{name}</h3>
                <p>
                  <code>{t.value}</code>
                </p>
                {t.reference && (
                  <p className="r-token-alias">↳ {t.reference}</p>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`var(${varName})`);
                      setCopy(name);
                      setManualReference("");
                    } catch {
                      setCopy("failed");
                      setManualReference(`var(${varName})`);
                    }
                  }}
                >
                  {copy === name ? "✓ 已复制" : "复制 CSS 引用"}
                </Button>
              </div>
            </article>
          );
        })}
      </SelectionContent>
      {visibleCount < filtered.length && (
        <Button
          variant="secondary"
          onClick={() => setBatch({ key: filterKey, size: visibleCount + 12 })}
        >
          再显示 12 个令牌
        </Button>
      )}
      {!filtered.length && (
        <div className="r-empty">
          <h2>没有匹配的令牌</h2>
          <Button
            variant="secondary"
            onClick={() => {
              set("");
              setLayer("all");
              setType("all");
            }}
          >
            清除筛选
          </Button>
        </div>
      )}
      {copy && (
        <p role="status">
          {copy === "failed" ? (
            <>
              自动复制未完成，可以手动选择并复制：<code>{manualReference}</code>
            </>
          ) : (
            `已复制 ${copy} 的 CSS 引用。`
          )}
        </p>
      )}
    </div>
  );
}
