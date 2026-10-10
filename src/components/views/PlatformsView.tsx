import {
  NATIVE_LIBRARIES,
  NATIVE_FIRST_WAVE,
} from "../../data/nativeLibraries";
import { DocDisclosure } from "../common/DocDisclosure";
import { SelectionGroup, SelectionContent } from "../common/SelectionMotion";
import swiftSource from "../../../platforms/swiftui/RosemarySaveButton.swift?raw";
import { useState } from "react";
import { PLATFORM_MATRIX } from "../../data/platformMatrix";
import { CodeBlock } from "../common/CodeBlock";
import flutterSource from "../../../platforms/flutter/lib/rosemary.dart?raw";
const refs = [
  ["Web / WCAG", "https://www.w3.org/WAI/WCAG22/quickref/"],
  [
    "Flutter ThemeExtension",
    "https://api.flutter.dev/flutter/material/ThemeExtension-class.html",
  ],
  [
    "Flutter FilledButton",
    "https://api.flutter.dev/flutter/material/FilledButton-class.html",
  ],
  [
    "Apple HIG",
    "https://developer.apple.com/design/human-interface-guidelines/",
  ],
  [
    "SwiftUI Button",
    "https://developer.apple.com/documentation/swiftui/button",
  ],
  [
    "Compose Button",
    "https://developer.android.com/develop/ui/compose/components/button",
  ],
  [
    "WinUI Button",
    "https://learn.microsoft.com/en-us/windows/apps/develop/ui/controls/buttons",
  ],
];
const examples = {
  web: {
    language: "tsx",
    code: `import { Button } from './src/components/ui/core';\nimport './src/generated/tokens.css';\n\n<Button onClick={() => saveDocument()}>保存更改</Button>\n// saveDocument is the product's application handler.\n// Reference source is in this repository; there is no @rosemary npm package.`,
  },
  apple: {
    language: "swift",
    code: `import SwiftUI\n\n// Add generated/RosemaryTokens.swift to the same Xcode target.\nstruct RosemarySaveButton: View {\n  @Environment(\\.colorScheme) private var scheme\n  let save: () -> Void\n  var body: some View {\n    Button("保存更改", action: save)\n      .buttonStyle(.borderedProminent)\n      .tint(scheme == .dark\n        ? RosemaryDarkTokens.semantic_color_accent\n        : RosemaryLightTokens.semantic_color_accent)\n      .accessibilityHint("保存当前文档")\n  }\n}\n// Local SwiftPM tests + iOS Simulator app build passed; VoiceOver acceptance pending.`,
  },
  android: {
    language: "kotlin",
    code: `package design.rosemary.reference\nimport androidx.compose.runtime.Composable\nimport androidx.compose.material3.Button\nimport androidx.compose.material3.ButtonDefaults\nimport androidx.compose.material3.Text\nimport design.rosemary.tokens.RosemaryLightTokens\nimport design.rosemary.tokens.RosemaryDarkTokens\n\n@Composable\nfun RosemarySaveButton(dark: Boolean, save: () -> Unit) {\n  Button(onClick = save, colors = ButtonDefaults.buttonColors(\n    containerColor = if (dark) RosemaryDarkTokens.semantic_color_accent\n      else RosemaryLightTokens.semantic_color_accent,\n    contentColor = if (dark) RosemaryDarkTokens.semantic_color_on_accent\n      else RosemaryLightTokens.semantic_color_on_accent\n  )) { Text("保存更改") }\n}\n// Local Compose AAR + sample APK build passed; TalkBack acceptance pending.`,
  },
  windows: {
    language: "xml",
    code: `<!-- Add to a WinUI Page; wire Save_Click in the product code-behind. -->\n<Button Content="保存更改" Click="Save_Click"\n  AutomationProperties.Name="保存更改"\n  AccessKey="S" MinHeight="44" />\n<!-- Bind generated RosemaryLightTokens / RosemaryDarkTokens colors\n     through the app's resource dictionary. WinUI build pending. -->`,
  },
};
export function PlatformsView() {
  const [selected, set] = useState<keyof typeof examples | "flutter">(
    "flutter",
  );
  return (
    <article className="r-detail">
      <header className="r-doc-header">
        <h1>
          意图一致，
          <br />
          行为属于平台。
        </h1>
        <p>
          Web、Flutter、iOS、macOS、Android 与 Windows
          共用语义规范。导航、权限、文字缩放、窗口与辅助技术采用宿主平台的行为。
        </p>
      </header>
      <section id="native-libraries">
        <h2>原生组件库 SDK</h2>
        <p>
          Prototype · 三端首批 {NATIVE_FIRST_WAVE.length}{" "}
          项已实现，含本地示例与构建测试。其余 47 项为 Draft；Beta
          仍须完成辅助技术与设备验收。
        </p>
        <div className="r-reading-grid">
          {NATIVE_LIBRARIES.map((platform) => (
            <div key={platform.id}>
              <h3>{platform.title}</h3>
              <p>{platform.approach}</p>
              <a href={`/guide/${platform.document}.md`}>API 与验收记录 →</a>
              <p>
                <a
                  href={`/sdk/rosemary-${platform.id}-prototype.tar.gz`}
                  download
                >
                  下载本地 SDK 源码 ↓
                </a>
              </p>
            </div>
          ))}
        </div>
        <div className="r-related-links">
          <a href="/guide/native-sdk-design.md">总架构与验收门槛 →</a>
          <a href="/guide/native-component-plan.json">61 项组件映射 →</a>
        </div>
      </section>
      <DocDisclosure id="matrix" title="平台行为适配矩阵">
        <div className="r-table-scroll">
          <table className="r-table" style={{ minWidth: 850 }}>
            <thead>
              <tr>
                <th>领域</th>
                <th>Web</th>
                <th>Flutter</th>
                <th>Apple</th>
                <th>Android</th>
                <th>Windows</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_MATRIX.map((r) => (
                <tr key={r.domain}>
                  <th scope="row">{r.domain}</th>
                  <td>{r.web}</td>
                  <td>{r.flutter}</td>
                  <td>{r.apple}</td>
                  <td>{r.android}</td>
                  <td>{r.windows}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DocDisclosure>
      <section>
        <h2>当前实现范围</h2>
        <p>
          Flutter、Compose、SwiftUI 首批各 14 个本地组件已实现；
          构建记录可查，当前为 Prototype，尚未发布。
        </p>
      </section>
      <DocDisclosure id="native-reference" title="参考源码与平台下载">
        <SelectionGroup
          value={selected}
          label="代码平台"
          className="r-category-strip"
        >
          {(["web", "flutter", "apple", "android", "windows"] as const).map(
            (v) => (
              <button
                key={v}
                aria-pressed={selected === v}
                onClick={() => set(v)}
              >
                {v}
              </button>
            ),
          )}
        </SelectionGroup>
        <p style={{ marginTop: 24 }}>
          Web 可在本项目直接运行。三端原生 SDK 首批 14 项已实现并附本地示例，
          构建与自动测试记录见平台文档。当前是 Prototype；辅助技术人工检查、
          完整设备矩阵和其余 47 项实现仍待完成。WinUI
          目前只有生成参数与参考源码。
        </p>
        <SelectionContent
          value={selected}
          index={["web", "flutter", "apple", "android", "windows"].indexOf(
            selected,
          )}
        >
          <CodeBlock
            key={selected}
            title={
              selected === "flutter"
                ? "platforms/flutter/lib/rosemary.dart"
                : "原生平台实施参考"
            }
            language={
              selected === "flutter" ? "dart" : examples[selected].language
            }
            code={
              selected === "flutter"
                ? flutterSource
                : selected === "apple"
                  ? swiftSource
                  : examples[selected].code
            }
          />
        </SelectionContent>
        <div className="r-related-links">
          <a href="/generated/rosemary_tokens.dart" download>
            Flutter Tokens ↓
          </a>
          <a href="/generated/RosemaryTokens.swift" download>
            SwiftUI Tokens ↓
          </a>
          <a href="/generated/RosemaryTokens.kt" download>
            Compose Tokens ↓
          </a>
          <a href="/generated/RosemaryTokens.cs" download>
            WinUI Tokens ↓
          </a>
        </div>
      </DocDisclosure>
      <section className="r-rule-callout">
        <h2>适配优先级</h2>
        <p>
          首先选平台原生语义控件，再应用 Rosemary
          颜色、排版与必要几何。不要移除系统返回、文字缩放或辅助技术。系统对话框和权限界面保留原生结构；网页示例不模拟硬件实现完成。
        </p>
      </section>
      <section>
        <div className="r-section-heading">
          <h2>核对来源</h2>
        </div>
        <div className="r-related-links">
          {refs.map(([title, url]) => (
            <a key={url} href={url} target="_blank" rel="noreferrer">
              {title} ↗
            </a>
          ))}
        </div>
      </section>
    </article>
  );
}
