# SDK 0.4.0 接入

Rosemary Forma **1.2.0** 是设计规范版本；Rosemary SDK **0.4.0** 是组件代码版本。当前实现共用 `design/contracts.json` 的 33 个基础组件 ID 和 `design/tokens.json` 的 24 个语义颜色角色。版本号不表示跨版本源码兼容。

安装目标为 `0.4.0`，Git tag 为 `v0.4.0`。以 [0.4.0 Release](https://github.com/Foodie05/Rosemary-Design-System/releases/tag/v0.4.0) 的实际资产及 SHA256 为准；[CI](https://github.com/Foodie05/Rosemary-Design-System/actions) 与各端验证记录说明实际支持范围。通过 Git / 本地包消费，不发布到 npm、Maven Central 或 pub.dev。

## 选择实现

| 实现 | 消费入口 | 声明的最低要求 | 实际验证入口 |
| --- | --- | --- | --- |
| React | `@rosemary-ui/react` + tokens/icons 三个 tgz | React 18.3.1 / 19.2.8；Web 最近两个稳定大版本另需实机覆盖 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/packages/react/README.md)、[状态映射](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/packages/react/STATE-MAPPING.md)、[消费者](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/examples/react-gallery/README.md) |
| Android Compose | `design.rosemary:rosemary-compose:0.4.0`，本地 Maven ZIP | Android API 26；JDK 17；consumer compileSDK 36 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/platforms/android/API.md)、[构建/消费者](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/platforms/android/README.md) |
| SwiftUI | 根 `Package.swift` 的 `RosemaryUI` product/module | iOS 17；Swift tools 5.9；Swift 5 模式；macOS 14 用于宿主模型测试 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/platforms/swiftui/README.md)、[验证](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/platforms/swiftui/VERIFICATION.md) |
| Flutter | 源码包的 `rosemary_ui` path dependency | Flutter 3.44.8 / Dart 3.12.2；consumer Android 26 / iOS 17 / macOS 12 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/platforms/flutter/API.md)、[六目标消费者与证据](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/platforms/flutter/README.md) |

声明的 deployment target 不等于实际最低系统运行过。Flutter Windows/Linux 不在此宣称未测的 OS 下限；Web 与六目标的编译、运行和读屏证据分别记录。

## 安装已核验的产物

将实际 Release 资产下载到本地后，先核对同版 SHA256 清单。资产名称与构建脚本对应：

| 实现 | 0.4.0 资产 |
| --- | --- |
| React | `rosemary-ui-tokens-0.4.0.tgz`、`rosemary-ui-icons-0.4.0.tgz`、`rosemary-ui-react-0.4.0.tgz` |
| Compose | `rosemary-compose-0.4.0-maven.zip`、`rosemary-compose-0.4.0.aar`、`rosemary-compose-0.4.0-sources.jar`、`rosemary-compose-sample-0.4.0.apk` |
| SwiftUI | `RosemaryUI-0.4.0-source.tar.gz`、`RosemarySample-0.4.0-simulator.zip` |
| Flutter package | `rosemary-ui-0.4.0-source.tar.gz` |
| Flutter consumer | `rosemary-flutter-0.4.0-android.apk`、`rosemary-flutter-0.4.0-web.zip`、`rosemary-flutter-0.4.0-macos.zip`、`rosemary-flutter-0.4.0-ios-simulator.zip`、`rosemary-flutter-0.4.0-windows.zip`、`rosemary-flutter-0.4.0-linux.tar.gz` |

以 Release 实际资产及对应 SHA256 为准；CI evidence 记录相应 commit、工具链、实际测试与解包消费结果。React 同时安装三个包，应用自己提供 React 和 ReactDOM：

```sh
npm install ./rosemary-ui-tokens-0.4.0.tgz ./rosemary-ui-icons-0.4.0.tgz ./rosemary-ui-react-0.4.0.tgz react@19.2.8 react-dom@19.2.8
```

```tsx
import { RosemaryProvider, Input, Button } from '@rosemary-ui/react';
import '@rosemary-ui/react/css';
// name / setName / saveRecord 由应用持有。
<RosemaryProvider mode="system" language="zh" onDiagnostics={reportContrast}>
  <Input label="名称" value={name} onValueChange={setName} />
  <Button onClick={() => saveRecord(name)}>保存</Button>
</RosemaryProvider>
```

Compose 解压同版 Maven ZIP，仓库路径指向包含 `design/rosemary/rosemary-compose/0.4.0/` 的目录：

```kotlin
// settings.gradle.kts 的 dependencyResolutionManagement.repositories
maven { url = uri("../vendor/rosemary-maven") }
// app/build.gradle.kts
implementation("design.rosemary:rosemary-compose:0.4.0")
```

```kotlin
RosemaryTheme(mode = RosemaryThemeMode.System, language = RosemaryLanguage.Chinese,
  onContrastDiagnostics = { reportContrast(it) }) {
  RosemaryInput(name, { name = it }, label = "名称")
}
```

SwiftUI 将 `RosemaryUI-0.4.0-source.tar.gz` 解压为含根 Package.swift 的目录，消费根包；不要把 sample 的源文件复制为库：

```swift
// Package.swift dependencies / target dependencies
.package(path: "../vendor/RosemaryUI"),
.product(name: "RosemaryUI", package: "RosemaryUI")
```

```swift
import RosemaryUI
RosemaryInput("名称", text: $name)
    .rosemaryTheme(.system)
    .environment(\.locale, Locale(identifier: "zh-Hans"))
```

根包也能通过 Git 远程消费，固定到 `v0.4.0` 对应的语义版本：

```swift
.package(url: "https://github.com/Foodie05/Rosemary-Design-System.git", exact: "0.4.0")
```

模拟器 zip 是 unsigned `.app`，不用于真机 IPA 安装。

Flutter 将 `rosemary-ui-0.4.0-source.tar.gz` 解压到 vendor，path 指向带 pubspec.yaml 的 `rosemary_ui` 根：

```yaml
dependencies:
  rosemary_ui:
    path: ../vendor/rosemary_ui
```

```dart
import 'package:rosemary_ui/rosemary_ui.dart';
RosemaryTheme(
  mode: RosemaryThemeMode.system,
  locale: const Locale('zh'),
  onContrastDiagnostics: reportContrast,
  child: RosemaryButton(label: '保存', onPressed: saveRecord),
)
```

也可使用下列版本固定的 Git 子目录。六目标消费者的构建、运行和人工读屏覆盖分别记录于 Flutter 验证文档。

```yaml
dependencies:
  rosemary_ui:
    git:
      url: https://github.com/Foodie05/Rosemary-Design-System.git
      ref: v0.4.0
      path: platforms/flutter/rosemary_ui
```

## 主题、语言与系统偏好

24 个角色：`canvas`, `surface`, `raised`, `ink`, `muted`, `border`, `control`, `primary`, `on-primary`, `primary-soft`, `sun`, `on-sun`, `sky`, `on-sky`, `success`, `success-soft`, `warning`, `warning-soft`, `danger`, `danger-soft`, `on-danger`, `info`, `info-soft`, `focus`。JSON/CSS 用连字符；各 typed API 用 camelCase，如 `onPrimary`、`primarySoft`。`border` 是结构线，控件识别使用 `control`，焦点使用 `focus`。

完整自定义主题为每个 mode 提供全部 24 role；局部主题继承父主题，再覆盖成对语义色。完整 [Vigilo 示例](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/design/themes/vigilo.json) 包含 light/dark。主题校验明确拒绝结构或颜色错误；22 个前景/背景对在每个 mode 诊断，不静默改色。透明、宽色域或不能解析的原生 Color 受各端 API 明确约束。

```tsx
<RosemaryProvider mode="system" language="en" direction="rtl" reducedMotion={requestReducedMotion}
  onDiagnostics={reportContrast}>
  <RosemaryProvider colors={{primary: '#24675E', onPrimary: '#FFFFFF'}}>
    <Button onClick={saveRecord}>Save</Button>
  </RosemaryProvider>
</RosemaryProvider>
```

```kotlin
RosemaryTheme(mode = RosemaryThemeMode.System, language = RosemaryLanguage.English,
  direction = LayoutDirection.Rtl, reduceMotion = requestReducedMotion) {
  val localColors = RosemaryTheme.colors.copy(primary = Color(0xFF24675E), onPrimary = Color.White)
  RosemaryTheme(colors = localColors, onContrastDiagnostics = { reportContrast(it) }) { ProductContent() }
}
```

```swift
// 宿主构造完整主题并处理诊断；原生 Color 在指定 appearance 下解析。
let custom = try RosemaryTheme.light.overriding(["primary": Color(red: 0.14, green: 0.40, blue: 0.37), "on-primary": .white])
let failures = try custom.contrastDiagnostics(colorScheme: .light)
ProductContent().rosemaryTheme(custom)
    .environment(\.locale, Locale(identifier: "en"))
    .environment(\.layoutDirection, .rightToLeft)
    .rosemaryReduceMotion(requestReducedMotion)
// 局部继承：在可抛出的宿主构造函数内先创建内容，颜色在实际环境中解析。
let localContent = try ProductContent().rosemaryTheme(overrides: [
    "primary": Color(red: 0.14, green: 0.40, blue: 0.37), "onPrimary": .white
])
VStack {
    ProductContent()
    localContent
}.rosemaryTheme(.system)
 .rosemaryStrings(RosemaryStrings(["Loading": "正在读取"]))

// 完整主题：从宿主资源读取两个包含全部 24 role 的 [String: String] 字典。
let lightTheme = try RosemaryTheme(hex: lightRoles)
let darkTheme = try RosemaryTheme(hex: darkRoles)
let lightDiagnostics = try lightTheme.contrastDiagnostics(colorScheme: .light)
let darkDiagnostics = try darkTheme.contrastDiagnostics(colorScheme: .dark)
```

```dart
RosemaryTheme(
  mode: RosemaryThemeMode.system, locale: const Locale('en'),
  direction: TextDirection.rtl, reduceMotion: requestReducedMotion,
  child: Builder(builder: (context) => RosemaryTheme(
    colors: RosemaryThemeData.of(context).colors.copyWith(
      primary: const Color(0xFF24675E), onPrimary: const Color(0xFFFFFFFF)),
    onContrastDiagnostics: reportContrast, child: productContent,
  )),
)
```

系统 Reduce Motion 优先于应用的 false；只关闭非必要动效，保留状态反馈。中英默认字符串覆盖 SDK 状态；业务标签、错误与国际化资源由宿主持有。RTL 使用逻辑 start/end，品牌折面几何不镜像。SwiftUI Dynamic Type、Compose sp、Flutter text scaling 和 Web 缩放仍需在真实页面复核。

### 高对比按平台处理

React 在系统 `forced-colors` 模式保留控件边界与真实进度，颜色由系统强制色控制。SwiftUI 读取 `colorSchemeContrast` 增强控件描边；完整高对比颜色由宿主构造 `RosemaryTheme` 并调用实际颜色诊断。

Compose 可显式传入 `highContrast` 和完整 `highContrastColors`；API 36 起观察系统高对比文本变化，较旧 Android 的系统信号需由宿主接入。Flutter 读取 `MediaQuery.highContrast` 并使用宿主提供的完整 `highContrastColors`；未提供时保留原 palette，不推定已有高对比配色。这些入口不代表所有平台都自动生成高对比主题，实际颜色与辅助技术覆盖需分别核验。

## 数据、状态与可访问性

33 个 ID：button / link / iconButton / input / textarea / select / search / checkbox / radio / switch / slider / date / upload / tabs / breadcrumb / pagination / menu / tooltip / popover / dialog / drawer / toast / alert / card / list / table / badge / avatar / empty / skeleton / loading / progress / stepper。语言中的公开命名与 generic 参数不同，请用各端 API 表。

宿主持有值和展开状态、请求、提交、文件权限和传输。搜索/列表/卡片 loading、empty、error 由真实业务状态组合 Loading/Empty/Alert；取消草稿不回调提交。日期为无时区 Gregorian local date（1–9999，YYYY-MM-DD），时间为 HH:mm；不得从跨时区 timestamp 偷换日期。上传只选择文件并发出回调。已完成工作才进入确定进度；未知量不报伪百分比。模态提交、取消、Escape、外部关闭与焦点恢复按各端 API 约定处理。

CI、自动语义断言和截图各自说明证据范围。WebKit 引擎测试不等于真实 Safari；自动语义检查不等于 VoiceOver/NVDA/TalkBack 测试。最低系统、触控真机、读屏、键盘遍历和极大文字仍保留未测项，见 [验收清单](release-checklist.md) 与 [实施状态](https://github.com/Foodie05/Rosemary-Design-System/blob/main/docs/sdk/implementation-status.md)。

SDK 代码、文档、tokens 与 71 枚功能图标使用 MIT；Rosemary 名称、官方 PNG、五产品徽记与字标遵循 [BRAND-ASSETS.md](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.0/BRAND-ASSETS.md)，并非 MIT 商标授权。官方 Logo 不改色、裁切、描摹或动画。
