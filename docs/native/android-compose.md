# Android Compose SDK

Prototype，2026-10-10。首批 14 个组件有公开实现；其余 47 项为 Draft。未发布到公共 registry，Beta 未验收。

## 实际接入

```kotlin
import design.rosemary.compose.*
RosemaryTheme {
  RosemaryButton(label = "保存", onClick = save, busy = busy)
}
```
实现命名空间 design.rosemary.compose；rosemary-compose 为 AAR 库，sample 为原生 Activity。TextField 使用 value/onValueChange；宿主保留 IME 文本状态。Checkbox 使用 ToggleableState，语义选择行有单一热区。Select<T> 使用原生 DropdownMenu，禁用项不能提交，外部/返回关闭不调用 onValueChange；Dialog 区分显式 Cancel 与 OutsideOrBack，后者尚未细分。ProjectDraft 提供空值验证、失败保留与取消状态模型。

```sh
cd platforms/android
# JAVA_HOME 指向 JDK 21；ANDROID_HOME 指向已有 SDK。
./gradlew :rosemary-compose:testDebugUnitTest :rosemary-compose:assembleDebug :sample:assembleDebug
./gradlew :rosemary-compose:connectedDebugAndroidTest
```
锁定 Gradle 8.14.3 / AGP 8.13.2 / Kotlin 2.2.20 / Compose BOM 2025.10.00；compile/target SDK 36、min SDK 26。使用已有 Android SDK；未自动接受新的许可证。动态颜色不覆盖 Rosemary 主题。生成 tokens 参与真实 Compose 编译。

## 范围与验收

公开组件：Button、Icon Button、Text Field、Text Area、Checkbox、Switch、Slider、Select、Tabs、Dialog、Alert Dialog、Progress、Spinner、Empty State。源码位于 platforms/android；示例包含编辑项目、保存失败、重试、取消与明确清空确认，不含生产网络服务。

实际执行结果见 [native-checks.json](../native-checks.json)，Beta 门槛见 [总设计](../NATIVE-SDK-DESIGN.md)。自动测试不能代替 VoiceOver/TalkBack 人工检查；尚未覆盖全部设备、系统版本、长列表、后台恢复、快速反向与关闭原因，不能声明整库 Beta。

## 独立审计修复

本轮审计记录见 NATIVE-SDK-AUDIT-2026-10-10.md。修复以独立复現和回归验证为准，不以无发现替代 Beta 验收。
保存模型在 beginSave 捕获提交快照和 saveOperation；complete 必须携带当次 operation。取消/离开使旧操作失效，新编辑不会被旧完成回调写入 savedName。Prototype 内状态模型的 complete 签名增加必要句柄参数，尚未承诺 Stable API。
