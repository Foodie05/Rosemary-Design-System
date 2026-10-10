# iOS SwiftUI SDK

Prototype，2026-10-10。首批 14 个组件有公开实现；其余 47 项为 Draft。未发布到公共 registry，Beta 未验收。

## 实际接入

```swift
import RosemaryUI
RosemaryButton("保存", busy: busy, action: save)
  .rosemaryTheme()
```
SwiftPM 本地 path 依赖指向 platforms/swiftui。控件使用 Binding；SwiftUI Menu/Picker/Slider/TextField/TextEditor 保留系统语义与输入。iOS Checkbox 为带勾选的选择行，不声称存在通用系统 checkbox 样式。Dialog 由宿主 sheet(isPresented:) 展示；rosemaryAlertDialog 使用系统 alert。ProjectDraft 将 beginSave/complete/cancel 分开。支持系统主题与 accessibilityReduceMotion；后台与关闭原因仍需完整验收。

```sh
cd platforms/swiftui
swift test
cd Sample
xcodegen generate --spec project.yml
xcodebuild -project RosemarySample.xcodeproj -scheme RosemarySample \
  -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build
# 在测试用 Simulator 上用相同 scheme 执行 test。
```
Swift tools 5.9+，iOS 15 / macOS 12 声明；实际用 Swift 6.4 / Xcode 27 生成模拟器应用。macOS 单测不计作 iOS 设备或 VoiceOver 验收。

## 范围与验收

公开组件：Button、Icon Button、Text Field、Text Area、Checkbox、Switch、Slider、Select、Tabs、Dialog、Alert Dialog、Progress、Spinner、Empty State。源码位于 platforms/swiftui；示例包含编辑项目、保存失败、重试、取消与明确清空确认，不含生产网络服务。

实际执行结果见 [native-checks.json](native-checks.json)，Beta 门槛见 [总设计](native-sdk-design.md)。自动测试不能代替 VoiceOver/TalkBack 人工检查；尚未覆盖全部设备、系统版本、长列表、后台恢复、快速反向与关闭原因，不能声明整库 Beta。

## 本机 UI 测试限制

2026-10-10：已生成 2 项 XCUITest 流程测试。Xcode 27 在 iOS 26.5 和 27.0 的独立测试模拟器上都无法连接 com.apple.instruments.deviceservice.lockdown（DTServiceHubClient failed to bless service hub）。测试未执行成功；不能算作 iOS 流程通过。保留测试源码，未绕过系统保护或更改宿主权限。

## 独立审计修复

本轮审计记录见 NATIVE-SDK-AUDIT-2026-10-10.md。修复以独立复現和回归验证为准，不以无发现替代 Beta 验收。
保存模型在 beginSave 捕获提交快照和 saveOperation；complete 必须携带当次 operation。取消/离开使旧操作失效，新编辑不会被旧完成回调写入 savedName。Prototype 内状态模型的 complete 签名增加必要句柄参数，尚未承诺 Stable API。
