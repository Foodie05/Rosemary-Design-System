# 原生 SDK 独立审计 · 2026-10-10

最新结论：修复前独立发现的 1 项 P1、4 项 P2 均已由父 agent 修复，并通过本 agent 的独立自动复验。修复记录在末节，原始发现与基准保留。三端首批 14 项继续处于 Prototype；现在可以推进 Beta 待办，但人工读屏、iOS UI、完整设备/交互条件没有通过证据，不能宣布 Beta 验收完成。

## 范围与基准

审计者为独立 `native_sdk_audit` agent；仅新增本报告，没有修改实现、测试或工程验收证据，没有操作服务器。

基准 `nativeFingerprint`：`18a2d7b1d098cbc2495248f0fd0ceb4db918f732e8791b284e649467bfdb8f24`，63 个纳入原生范围的文件。以下行号指修复前该基准；后续复核应另记版本，保留原始发现。

已读：`docs/NATIVE-SDK-DESIGN.md`、`docs/native/{flutter-sdk,android-compose,ios-swiftui}.md`；三端生成 tokens、Theme、14 项公开组件、ProjectDraft、sample、现有 tests；Flutter pubspec、Android Gradle 配置、SwiftPM 与示例工程定义。逐项检查受控状态、busy、取消/确认、主题角色、文本输入、选择、热区、布局、大字/RTL、动效、生命周期与 Beta 条件。

基准关键文件 SHA-256：

| 文件 | SHA-256 |
|---|---|
| `platforms/flutter/lib/rosemary.dart` | `04ae6b6304385e6e58a8dd47bec69e7034b58cd110f5ec9ed5437ec0b243543e` |
| `platforms/flutter/lib/src/components.dart` | `bf3e994a4c5a46b40c76a98d96e3dd7bc4e62068ae5aa7fccdd9115e817a9b4b` |
| `platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/ProjectDraft.kt` | `751065f910d3dbf12973a97d7f99a6e153d04822e6348b6c4af916262952b01f` |
| `platforms/swiftui/Sources/RosemaryUI/ProjectDraft.swift` | `37eadeff7201240a7368890fe7e8ac6fd855bf35682ed9844e4207de53fee09d` |

## 已确认的问题

### N1 · P1 · 保存完成会提交未发送的新草稿，取消未使旧请求失效

位置：`platforms/swiftui/Sources/RosemaryUI/ProjectDraft.swift:16`、`:20`、`:30`；`platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/ProjectDraft.kt:5`、`:6`、`:7`。

两端 `beginSave` 仅置 busy，未保存提交快照或请求身份。`complete(success: true)` 直接读完成时的可变 `name`。Swift 独立编译并运行状态模型、Compose 从此次单测生成 class 独立运行 Java 驱动，均复现：

```text
edit("Submitted A") → beginSave() → edit("Unsubmitted B") → complete(true)
实际 savedName = Unsubmitted B
预期本次成功 savedName = Submitted A，同时保留未提交的草稿 B
```

另独立复现 `beginSave → cancel` 后 busy 仍为 true，旧 `complete(true)` 可以更新取消后的对象。实际取消异步请求后若没有回调，模型会永久 busy；重开会话也没有请求标识防止旧回调影响新会话。

影响：SDK 的公开状态模型给出错误的“已保存”状态。SwiftUI sample 的字段绑定 `draft.name`（`Sample/Sources/RosemarySampleApp.swift:27`），保存 Task 在 `:43`，busy 时字段、修改名称及清空入口仍能改变草稿。Compose sample 同样 busy 时可编辑字段/切页/清空（`sample/.../MainActivity.kt:24`、`:28`、`:35`、`:37`），但没有使用该公开模型，因此既有模型单测不覆盖 sample 的竞争。

建议：提交时捕获不可变快照和 operation/session ID；完成必须携带对应句柄；成功更新 saved 快照但不覆盖之后的编辑；取消使旧操作失效并复原 busy。增加 A 提交期间改 B、取消后晚到成功、取消后重试再收到旧失败、重复完成、视图离开等回归。宿主真正发出的 payload 也须来自同一快照。

### N2 · P2 · Flutter Select 长标签在普通窄屏就发生横向溢出

位置：`platforms/flutter/lib/src/components.dart:238`—`:244`。

触发控件采用 Row + 无宽度约束的 Text。独立复制 SDK 至临时目录，在 320×900、DPR 1、左右各 24px padding、普通字号下构建：

```dart
RosemarySelect(value: 'a', label: '分类',
  options: const [RosemaryOption('a', '团队的完整归档分类标签必须在窄屏大字模式下完整可读')],
  onChanged: (_) {})
```

实际 `tester.takeException()`：`A RenderFlex overflowed by 159 pixels on the right.` 不是推测的大字风险；现有大字 RTL 测试只覆盖短选项“个人”，没有暴露此问题。

建议：为选中文本提供有效约束与 Flexible/Expanded，允许换行增高；保留箭头空间和完整可访问值。补明暗、320px、长词/中文、2×文字、RTL 的实际布局回归，以及展开后的长选项和边缘定位检查。

### N3 · P2 · Flutter Tabs 的点击路径忽略应用减少动态效果偏好

位置：`platforms/flutter/lib/src/components.dart:277`—`:280`、`:294`—`:299`、`:312`—`:320`。

仅外部受控更新 `didUpdateWidget` 明确读取 `MediaQuery.disableAnimationsOf`；用户点击时 TabBar 先调用内部 controller 的默认动画，宿主更新 value 后 index 已经相等，零时长分支不执行。

独立临时 widget test 在 `MediaQueryData(disableAnimations: true)`、宿主立即接受选择下点击 B 并 pump，得到：

```text
animation=0.0, target=1, indexIsChanging=true
```

预期应用减少动态效果时本次选择不继续平移动画。Flutter 官方明确手动覆盖 MediaQuery 不会替开发者禁用 AnimationController；不能用系统底层自动缩短来宣称本库的应用偏好已处理。

建议：控制器初始化、用户点击、外部更新和减少偏好运行中变更统一使用同一 motion policy；保留受控拒绝行为及快速反向后的最新目标。补 reduced tap、外部更新、偏好切换和连续点击测试。

### N4 · P2 · Flutter Text Field 聚焦和错误时圆角从 8 跳到 4

位置：`platforms/flutter/lib/rosemary.dart:67`—`:73`。

正常 border 使用生成的 component_field_radius（8），focusedBorder 和 errorBorder 没有指定圆角，回退到 OutlineInputBorder 默认 4。独立临时 widget test 读取实际 InputDecoration：

```text
normal=BorderRadius.circular(8.0)
focus=BorderRadius.circular(4.0)
```

影响：焦点/错误改变组件轮廓，违背共享令牌和稳定反馈；现有 tests 只验证按钮颜色，未覆盖字段状态外观。

建议：normal/focus/error/disabled 边框统一读取同一生成 radius，只改变规定的颜色和描边；补这些状态的参数回归。

### N5 · P2 · Flutter 隐藏 tab 的 spinner 继续运转

位置：`platforms/flutter/lib/src/components.dart:326`。

保持面板 state 的 IndexedStack 同时保留隐藏子节点的动画，组件没有以 TickerMode 停用非当前面板。独立临时 `test/hidden_tab_test.dart` 使用 A 面板纯 Text、B 面板 RosemarySpinner、value=0，pump 400ms 后实际 `tester.hasRunningAnimations == true`。唯一持续动画在不可见的 B 面板。

影响：隐藏面板的等待动画继续使用帧调度，违背“后台等待动画暂停”的动效意图；将来更多保留状态面板会放大开销。未据此宣称已测量耗电或应用后台行为。

建议：按当前 index 对面板包 TickerMode，保留 state；离开当前页面/应用后台另按宿主 lifecycle 暂停。补切换离开 spinner→动画停用、切回→正常恢复及 reduced-motion 回归。

## 独立执行证据

以下命令由审计 agent 独立执行；build cache 是工具正常缓存，不表示设备复核。

| 命令与目录 | 实际结果 |
|---|---|
| `flutter analyze && flutter test`，`platforms/flutter` | analyze 无问题；11 个测试通过 |
| `flutter test --reporter expanded`，`platforms/flutter/example` | 1 个测试通过；仅失败→重试，不含编辑、无效提交或取消路径 |
| `DEVELOPER_DIR=<Xcode developer directory> swift test`，`platforms/swiftui` | macOS arm64，3 个状态模型测试通过；不计 iOS UI/读屏 |
| JDK 21、已有 Android SDK、Gradle 8.14.3 `:rosemary-compose:testDebugUnitTest --offline` | BUILD SUCCESSFUL，单测重新执行；3 项通过；另有 jvmTarget DSL 过时警告 |
| 临时复制 Flutter lib/pubspec，`flutter pub get --offline && flutter test test/audit_test.dart --reporter expanded` | 新增 3 项边界断言均失败，分别复现 N2/N3/N4 |
| 临时 Flutter `flutter test test/hidden_tab_test.dart --reporter expanded` | 新增隐藏面板断言失败，复现 N5；running=true |
| `xcrun swiftc ProjectDraft.swift <temp>/main.swift` 后执行 | 复现 N1，保存的是 B |
| JDK 21 javac/java 读取刚生成的 Compose ProjectDraft class | 复现 N1，保存 B；cancel 后 busy=true |

复现源码临时目录：`<temporary-audit>`；`test/audit_test.dart`、`test/hidden_tab_test.dart`、`main.swift`、`DraftAudit.java`。这些临时复现没有加入库或修改正式测试。

未独立执行新的 emulator instrumentation、SwiftUI XCUITest、native app 打包或设备交互；`docs/native-checks.json` 里的前轮 11 检查和 Android 4 项设备测试是已读的父 agent 工程证据，不能计为本审计独立执行。

## 仍未满足的 Beta 验收条件

1. 先修复 N1—N5，并独立复验。现有自动测试通过不能覆盖已复现的缺陷。
2. VoiceOver/TalkBack 必须实际人工逐控件操作，记录 OS、设备、流程与读屏结果。此次没有操作设备或读屏，单纯 semantics/assert 标签不代替该门槛。
3. 完整关闭原因与焦点恢复尚未实现：Flutter outside/back 返回 null，Compose 合并 OutsideOrBack，SwiftUI Dialog 只提供 onConfirm/onCancel、宿主 sheet 的交互关闭无统一事件（`RosemaryComponents.swift:220`、`Sample/...:67`）。这是文档已经承认的接口缺口，需与快速关闭/重开和旧事件隔离一并验收。
4. iOS UI 执行尚无成功证据。现有记录明确 Xcode lockdown service 在 iOS 26.5/27.0 阻塞；此环境限制不是“测试通过”。修复环境后才能验收 sample、长标题、Dynamic Type、键盘、选择和关闭。
5. 三端的长列表搜索选择、后台暂停/恢复、持久草稿/系统重建、RTL/长标题设备矩阵尚未完成。SwiftUI Tabs 固定 segmented Picker（`:213`）与 Dialog 的 HStack（`:240`）没有大字/长标题替代布局；这是需要设备验证的风险，未在此次宣称已复现裁切。
6. Compose TextField/TextArea 公开 API 只有 String，宿主不能完整读写 selection/composition；native 内部常规 IME 并不因此必然坏，但“宿主保留 IME 文本状态”的文档承诺需要 TextFieldState/TextFieldValue 策略和实际中日韩 IME、选区、恢复测试支撑。SwiftUI TextArea 没有 error 参数，同批输入错误行为仍须补齐验证。
7. Flutter iOS 当前依赖 Material 主题和有限 adaptive 控件，Cupertino 表单策略尚未验收；平台原生语义取舍应明确，而非从 Web 直接复制。

当前可以继续修复、增加工作流回归及设备矩阵；在上述门槛通过之前，三端阶段保持 Prototype，Beta approved 保持 false。

## 官方依据

- [Flutter MediaQueryData.disableAnimations](https://api.flutter.dev/flutter/widgets/MediaQueryData/disableAnimations.html)：应用 MediaQuery 覆盖不会自动修改 AnimationController；直接支持 N3 的验证边界。
- [Flutter AnimationBehavior](https://api.flutter.dev/flutter/animation/AnimationBehavior.html)：系统 AccessibilityFeatures 与动画行为另有关系，不可混同应用局部偏好。
- [Android state-based text fields](https://developer.android.com/develop/ui/compose/text/migrate-state-based)：状态型输入管理文本、选区和组合状态；用于设计 IME 验收，不据此断言所有 String 输入立即失效。
- [Apple Get started with Dynamic Type](https://developer.apple.com/videos/play/wwdc2024/10074/)：真实文字缩放检查是原生布局验收的一部分，不用短标题测试覆盖长标题风险。

以上官方来源只用于校准平台能力与验证要求；缺陷 N1/N2/N4 来自本次实际源码和独立运行证据，不依靠来源推测。

## 修复后独立复核

复核基准 `nativeFingerprint`：`e864a980df4be5fb59df4faeec0ea5a9f9e9d5f1ead4e3ad6ff16958488518b5`，65 文件。原始发现的代码由父 agent 修改，本 agent 未改实现、正式 tests 或 native-checks.json。

| 发现 | 修复后的独立观测 | 结论 |
|---|---|---|
| N1 快照/旧请求 | Swift 用独立 swiftc 驱动、Compose 用刚编译 class 的 Java 驱动：提交 A→编辑 B→成功，仅 savedName=A，草稿仍 B；cancel 释放 busy；旧失败/重复完成无效，新句柄成功 | 关闭，限同一模型实例及明确操作句柄的已测契约 |
| N2 长选项布局 | 新临时 SDK 副本重跑普通 320px 长标签，异常 null；额外 2×文字/RTL/dark 长标签也无异常 | 关闭，限这些自动布局状态 |
| N3 reduced Tabs | reduced tap 实际 animation=1.0、target=1、changing=false；额外在动画途中切 reduced 偏好以及 A→B 快速反向均落到最终选中项 | 关闭，限这些动画路径 |
| N4 字段圆角 | 独立读取实际 decoration normal=8、focus=8；源码同时明确 error/focusedError 使用生成 radius | 关闭 |
| N5 隐藏 spinner | 同一 A纯Text/Bspinner,value=0 场景，pump400ms实际 running=false；源码加入按当前 index 的 TickerMode | 关闭，未测应用进入后台耗电 |

独立再次执行：

- `platforms/flutter`: `flutter test --reporter expanded`，15 项通过；`flutter analyze` 无问题。
- `platforms/flutter/example`: `flutter analyze && flutter test --reporter expanded`，无问题、1 项通过。
- `platforms/swiftui`: 同一 Xcode/Swift 环境 `swift test`，5 项通过，仍是 macOS 单测。
- `platforms/android`: 同一 JDK/SDK/Gradle 环境 `:rosemary-compose:testDebugUnitTest --offline`，5 项通过，XML 标记 failures=0/errors=0；没有在此次追加设备 UI 执行。
- 新临时副本 `flutter test --reporter expanded`，6 项额外边界断言通过（原 4 个 Flutter 缺陷复验 + reduced 偏好变化/快速反向 + 2×RTL长选项）。

复核临时目录：`<temporary-audit>`；包含 `test/audit_test.dart`、`test/hidden_tab_test.dart`、`test/reversal_test.dart`、`main.swift`、`DraftAudit.java`。

复验中发现的 Flutter example 泛型推断工程错误（onChanged可为null后被推为Object?）已通知父 agent；其显式声明 RosemarySelect<String>，上述 analyze/sample test 随后通过，因此没有留下该工程阻断。

此复核关闭已确认五项缺陷，仍不改变本报告列出的人工/设备/完整关闭原因、长列表、IME、Cupertino、生命周期与 iOS UI 证据缺口。没有把未执行内容标成通过。
