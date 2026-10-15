# 从历史 prototype 迁移到 SDK 0.4.2

Rosemary Forma 规范保持 1.2.0；SDK 0.4.2 是当前组件代码修复版本。历史 `v0.3.0-prototype.2` tag 保留用于比较，不承诺源码兼容。安装固定到 `v0.4.2`，以对应 Release 的实际资产与 SHA256 为准。

## 从 0.4.0 更新

0.4.2 新增 `moon`、`theme-system`、`globe` 共享图标（74 枚）及门户响应式主题/语言导航。四 SDK 统一版本，现有组件调用保持兼容；规范仍为 1.2.0。旧 0.4.0 与 0.4.1 tag、资产和验证记录保留。见 [本轮记录](0.4.2-theme-navigation-review.md)。

0.4.1 修复选择器展开提示、字段状态与已确认的原生呈现问题，保持现有调用兼容；SwiftUI Skeleton 另提供可选的 `isRunning` 参数以停止非必要动效。四端代码与 tokens/icons 需同版更新；设计规范仍为 1.2.0。旧 0.4.0 tag、资产及验收记录保留。实际修复和验证边界见 [一致性审查记录](0.4.1-consistency-review.md)。

## 确认范围

0.4.0 实现当前契约的 33 个基础组件：button、link、iconButton、input、textarea、select、search、checkbox、radio、switch、slider、date、upload、tabs、breadcrumb、pagination、menu、tooltip、popover、dialog、drawer、toast、alert、card、list、table、badge、avatar、empty、skeleton、loading、progress、stepper。

历史 prototype 的 61 项探索包含基础组件、组合模式和额外组件。ButtonGroup、SplitButton、FloatingActionButton、ColorPicker、Sidebar、TopNavigation、BottomNavigation、DescriptionList、DataGrid、Accordion、ResizablePanels、MetricCard、ProberStatus、FileRow 等额外入口不在本次 33 项交付范围内。应由产品组合当前基础 API 或保留自身实现，不把它们算作漏掉的 0.4.0 导出，也不要自动把旧类型替换成名称近似的新组件。

## 主题和 Token

旧七色主题与 Material / 系统主题包装不足以表达新契约。完整自定义主题为 light/dark 各提供全部 24 个角色；局部主题继承父级，再成对覆盖。JSON/CSS 采用连字符，typed API 使用 camelCase。

| 历史角色 | 当前角色 | 迁移要求 |
| --- | --- | --- |
| `surface_subtle` | `raised` | 按实际层级使用，不统一加阴影 |
| `text` | `ink` | 正文显式使用语义前景 |
| `text_secondary` | `muted` | 必要辅助内容保持可读对比 |
| `border_control` | `control` | `border` 只用于结构分隔 |
| `accent` / `on_accent` | `primary` / `on-primary` | 背景与前景成对覆盖 |
| `accent_subtle` | `primary-soft` | 不以弱底色替代必要控件边界 |
| `*_subtle` 状态底色 | `*Soft` / `*-soft` | 使用各端实际 typed 名称 |

旧 chart、disabled、overlay 或更细文字层级不作一对一保证。审查产品自己的组合，使用实际背景和状态建立映射。新增 `on-danger`、`sun/on-sun`、`sky/on-sky` 等角色不能以同一个 accent 填满。

结构缺失、无效或不支持的颜色必须处理错误；22 对对比诊断按每个 mode 记录。诊断不自动改色。原生 Color 需要在指定 appearance 下解析，不将动态、透明或不可解析颜色默认为合格。完整 [Vigilo JSON](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/design/themes/vigilo.json) 作为样例资源，由 consumer 加载。

## 公共 API 变化

| 实现 | 变化 | 迁移入口 |
| --- | --- | --- |
| React | 以受控值 / open 状态及回调接业务数据；样式通过独立 CSS 入口；tokens/icons/react 同版安装 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/packages/react/README.md)、[状态映射](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/packages/react/STATE-MAPPING.md) |
| Compose | `dark` Boolean / Material 包装迁移至 `RosemaryThemeMode` 与完整语义色；旧 TextField/TextArea overload 改为 Input/Textarea 的 String 值与回调 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/platforms/android/API.md)、[迁移说明](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/platforms/android/README.md) |
| SwiftUI | 根包 product/module `RosemaryUI`；iOS deployment 15 → 17；旧 `RosemaryTextField(value:)` 改用 `RosemaryInput(text:)`；Button `busy` 改为 `isLoading`；动效偏好改为 `rosemaryReduceMotion` | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/platforms/swiftui/README.md) |
| Flutter | 旧 `rosemary_reference` / `rosemary.dart` 改为 `rosemary_ui` / `rosemary_ui.dart`；旧 ThemeExtension 改为 `RosemaryTheme` provider 与 `RosemaryThemeData`，TextField 改用受控 Input，Button.loading 改为 busy；不要按其他端同名组件推测 Dart 参数 | [API](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.2/platforms/flutter/API.md) |

SwiftUI 根包 macOS 14 用于宿主编译和模型检查，不等于本次交付了一套已验收 macOS 原生应用。Flutter 六目标 consumer 的最低系统、编译和运行证据分别记录，不从模板推断全部平台支持。

## 日期、浮层和反馈

- 不再以系统 DatePicker、时间戳或毫秒值直接承载品牌日期 API。使用 Gregorian 本地日期 1–9999 / `YYYY-MM-DD` 和 `HH:mm`；SwiftUI 的 `RosemaryLocalDate` 不转换到 Date/UTC。宿主在需要 timestamp 的业务边界明确指定时区。
- 日期和时间在草稿中编辑，确认才提交，取消保留已提交值。默认周一开始的日历视图与底层 weekday 表示分别定义，不改变日期算术。
- 模态必须通过真正的 Dialog/Drawer presentation API 接入；普通 Card 外观不承担焦点限制、退出完成和恢复。应用使用关闭原因区分保存、取消、Escape 与外部关闭。
- 旧 Spinner 改为 Rosemary 双折面 Loading。停止、完成和减少动态回同一静态品牌位置；按钮 busy 的前景跟随按钮语义色。
- Progress 使用实际已完成量；未知总量采用不确定模式，不以 100% 填充代表等待。完成、失败、取消、停止和减少动态时停止非必要运动。
- Upload 由宿主提供文件列表和传输状态，连接 remove/retry/cancel。SDK 仅调用 OS 文件选择，不代管网络或长期文件访问权限。

先用 [接入指南](getting-started.md) 建立真实 consumer，再按 [验收清单](release-checklist.md) 检查完整任务。自动测试和截图不代替最低系统、触控与人工读屏验收。
