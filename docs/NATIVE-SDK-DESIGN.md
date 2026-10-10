# Rosemary 原生组件库设计

状态：Prototype，2026-10-10。Flutter、Android Compose、iOS SwiftUI 的首批 14 个公开组件已实现，并建立本地工程、示例与自动测试；其他 47 项保持 Draft。Beta 验收未完成，没有发布到外部仓库。

## 目标与边界

共享设计意图、语义参数、状态与恢复契约；各平台使用自己的导航、输入、弹层、读屏和文字缩放。网页的样式和 DOM 不作为原生实现。Flutter 包服务跨平台 Dart 应用；Compose 库服务 Android 原生；SwiftUI 库服务 Apple 原生，首期聚焦 iOS。

实际工程位于 platforms/flutter、platforms/android、platforms/swiftui；公开 API 与接入命令见三份平台文档。Flutter 保留 rosemary_reference 本地包名以兼容已有调用，版本 0.3.0-prototype.1。Android 锁定 Kotlin 2.2.20 / AGP 8.13.2 / Compose BOM 2025.10.00；SwiftPM 支持 iOS 15 / macOS 12。尚未发布到 pub.dev、Maven 或 Swift Package Registry；最低版本声明不等于所有系统版本已经设备验收。

## 分层结构

| 层 | 职责 | 不承担 |
|---|---|---|
| 生成 Tokens | 从同一源生成 Dart/Swift/Kotlin；保留名称与主题角色 | 网络、业务状态或导航 |
| Theme / Policy | 语义色、字阶、间距、状态反馈、平台热区和动效策略 | 修改系统偏好或覆盖大字设置 |
| Components | 受控值、回调、焦点、键盘/触控、可访问名称 | 自动持久化、隐式业务提交 |
| Patterns / Host adapters | 表单、恢复提示、弹层适配；与宿主导航/文件选择接口连接 | 自造系统返回栈、权限弹窗 |
| Gallery / Tests | 状态矩阵、主题、大字、辅助技术与真实产品示例 | 用示例内存状态冒充生产服务 |

依赖方向：Tokens → Theme → Components → Patterns；示例依赖公开 API。主题解析不得反向依赖业务组件。生成参数不手工修改；平台适配值在有名称的 policy 中解释。

## 共同契约

- 输入和选择由宿主持有状态。change 表示用户修改，不等于保存成功；commit 与 cancel 明确区分，焦点丢失不擅自提交选择草稿。
- 普通按钮执行传入 action；enabled 与 busy 独立描述状态，busy 防止重复操作，并保留可访问名称和状态反馈。异步任务、取消与失败由宿主负责。
- 表单错误靠近字段并给出恢复方法，label 始终可见；保留 IME、系统文本菜单、自动填充和大字折行。密码不在日志或可访问描述中泄露。
- 列表采用稳定身份；选择、展开、滚动与过滤状态由宿主保留。虚拟内容的辅助技术顺序必须真实；不以统一外观破坏系统角色。
- 浮层关闭原因区分 confirm / cancel / outside / back / programmatic；视觉退场不延迟结果。关闭后恢复合法焦点；旧关闭事件不能覆盖新会话。不可恢复操作使用原生明确确认。
- iOS 不存在通用原生 checkbox 外观：多选使用带勾选的选择行/List selection，并通过 VoiceOver 表达选择状态，不宣称 iOS ToggleStyle.checkbox 可用。
- Select 短列表使用宿主 Menu/Picker；长列表提供搜索型选择页面或 sheet。含确认按钮的表单选择保留草稿，取消不修改受控值。
- 动效语义共用；平台导航与手势过渡采用宿主行为。拖动直接跟随，后台等待动画暂停；系统减少动态效果与应用减少偏好合并，应用不得强制恢复运动。
- 简洁规范同样适用：默认显示状态、必要风险和主要动作，完整配置按任务展开；错误不折叠。

## 单位与平台策略

| 范围 | Rosemary 设计决定 |
|---|---|
| Android / Flutter Android | 至少 48dp 可操作区域；视觉尺寸可以更小，但热区不与相邻操作冲突 |
| iOS / Flutter iOS | 至少 44pt 目标，遵循平台推荐；大字允许增高，不能用固定 44 高度截断文字 |
| 字体 | Kotlin sp / SwiftUI 语义 Text style / Flutter 系统 TextScaler；不把 Web px 直接当所有平台字号 |
| 主题 | 跟随系统为默认；双主题语义角色独立验证；Android Dynamic Color 作为显式可选策略，不默认改写 Rosemary 品牌主题 |
| 滚动 | 原生 ScrollView/Lazy 布局，保留平台滚动指示和辅助技术；不照搬网页自绘滚动条 |
| 系统 UI | 返回、权限、日期/文件选择和键盘菜单优先宿主；产品交互风格不能接管操作系统设置 |

这些目标由平台指南和 Rosemary 使用场景共同决定，不是全平台尺寸换算公式。

## 组件清单与实施顺序

机器清单来自 src/data/nativeLibraries.ts，构建生成 guide/native-component-plan.json，包含现有 61 个规范组件在三个平台的映射与批次。首批为 Prototype，其余为 Draft；Web 的 Beta/Candidate 不自动继承。

1. 第 1 批（14 项）：Button、Icon Button、Text Field、Text Area、Checkbox、Switch、Slider、Select、Tabs、Dialog、Alert Dialog、Progress、Spinner、Empty State。以“编辑项目 → 验证 → 保存/失败 → 关闭/恢复”完成一条真实工作流。
2. 第 2 批（22 项）：其他常用输入、分段选择、列表与描述、状态标签、Sheet、通知、Card、Accordion 和 Divider。纳入宿主导航、持久草稿与真实产品恢复路径。
3. 第 3 批（25 项）：桌面/大屏组合、菜单、命令、表格、Tree、Data Grid、分栏与产品专属构件。Data Grid/Tree/Combo Box 先定义完整平台输入和辅助技术模型，再实现。

每个平台独立进入下一批，不用最低完成度冒充“三端全部完成”。暂不承诺时间；现有基础参考可以复用，但需要迁移测试。

## 发布门槛

| 阶段 | 退出条件 |
|---|---|
| Draft → Prototype | 模块编译、公开接口实现、状态矩阵和生成参数一致；无无效回调 |
| Prototype → Beta | 第 1 批真实工作流；明暗、大字、RTL、键盘/触控、系统返回、取消与快速反向测试；至少 iOS VoiceOver / Android TalkBack 人工检查 |
| Beta → Stable | API/版本兼容、真实产品集成、设备覆盖与性能、平台 CI、许可证和发布恢复流程；无已知阻断缺口 |

自动检查包括受控值、禁用/busy、主题继承、语义树、焦点、反向中断、草稿取消、列表身份和深链接恢复。设备检查需录制结果并列出 SDK/OS/机型；统计与截图不代替真实辅助技术验收。

## 三个平台设计

- [Flutter SDK](native/flutter-sdk.md)
- [Android Compose](native/android-compose.md)
- [iOS SwiftUI](native/ios-swiftui.md)

## 官方依据

- [Flutter accessibility](https://docs.flutter.dev/ui/accessibility) 与 [adaptive design](https://docs.flutter.dev/ui/adaptive-responsive)
- [Android Compose accessibility defaults](https://developer.android.com/develop/ui/compose/accessibility/api-defaults) 与 [predictive back](https://developer.android.com/develop/ui/compose/system/predictive-back)
- [Apple HIG accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) 与 [SwiftUI](https://developer.apple.com/documentation/swiftui)

模块划分、14/22/25 批次与接口命名是 Rosemary 方案；官方来源支持平台习惯和无障碍要求，不代表官方认可本库。

## 当前推进与未完成门槛

首批 14 个组件有三端公开实现，主题读取同一生成源；保存示例包含失败、重试、取消和确认。构建与测试的实际输出保存在 docs/native-checks.json。平台源码包可本地下载，均为 Prototype，不是对外 Beta 发行。

进入 Beta 前仍须完成：真实 VoiceOver/TalkBack 人工测试、系统返回/焦点恢复的完整关闭原因模型、Flutter iOS 自适应表单、SwiftUI 大字长标题布局、长列表搜索选择、后台/恢复与设备矩阵。当前以状态/工作流自动测试推进，不把编译通过等同于这些门槛通过。

独立审计修复：提交快照与操作句柄隔离迟到完成；示例忙碌时禁止修改提交内容；Flutter 长选择标签换行、焦点/错误圆角保持生成值、Tabs 尊重减少动态效果并暂停隐藏面板 ticker。审计报告记录基准与复核，Beta 人工验收仍待完成。
