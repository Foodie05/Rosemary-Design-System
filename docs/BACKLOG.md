# 第二轮之后的待办

状态：2026-10-10 / v2.0.0-beta.1。以下未完成能力不作为本轮已交付或 Stable 声明。

| 优先级 | 项目 | 当前边界 | 下一轮验收 |
|---|---|---|---|
| P1 | 真实辅助技术 | axe 检查 DOM 结构，浏览器检查主要键盘路径；未运行 VoiceOver、NVDA、TalkBack | 三套读屏器完成导航、表单、错误、模态、Tabs、表格与 live region 路径，记录读法和修复 |
| P1 | 多引擎和系统偏好 | 浏览器实测为 Codex IAB；网站减少动态效果设置、13 个栏目 / 61 个组件预览和系统媒体变化回归测试通过，未切换操作系统偏好 | Safari / Firefox / Chromium，系统 Reduced Motion、Forced Colors、200%/400% 缩放与文本缩放人工验收 |
| P1 | Candidate 复合控件 | Data Grid 是原生可选择 table；Tree 是 details；Combo Box 是 datalist；Dropdown / Context Menu 是 disclosure | 决定是否保持原生方案；如改 ARIA 复合控件，完成方向键、Home/End、typeahead、焦点与读屏验证后再升级状态 |
| P1 | Flutter 产品集成 | 首批 14 项 Prototype，15 项控件测试、示例工作流和 iOS/Android 构建通过 | iOS / Android 实机、语义树、大字体、系统键盘、输入法、禁用/忙碌和真实产品集成 |
| P1 | SwiftUI 产品集成 | 首批 14 项 Prototype，SwiftPM 5 项状态测试及 iOS Simulator app 构建通过；XCUITest 执行被 Xcode 服务阻塞 | Xcode 工程、Dynamic Type、VoiceOver、macOS 键盘和 iOS 安全区验收 |
| P1 | Compose / WinUI 构建 | Compose 首批 14 项 Prototype，AAR/APK、5 项状态测试和 4 项 Android UI 测试通过；WinUI 仍仅生成参数 | Android Gradle / Windows SDK 编译，主题和系统返回/焦点/辅助技术验收 |
| P2 | 产品级数据持久化 | 所有教学业务数据保存在内存；网站主题 localStorage，目录筛选 sessionStorage | 把保存/重试/离线/冲突接入产品服务，幂等、持久队列、版本合并和重启恢复另行测试 |
| P2 | 规范目标变体 | 页面逐项标明当前支持范围；未把所有规范变体伪装为可控实现 | Checkbox 混合态、Text Area 自增高、虚拟表格、Tree 方向键、图片 Avatar、移动 sheet 手势等分别补齐 |
| P2 | 稳定组件发布 | 56 Beta、5 Candidate，源码在本仓库；没有公开 npm / pub / NuGet 包 | 明确 API、版本兼容、主题契约、产品集成与变更治理后才发布 Stable |
| P2 | 品牌与字体资产 | 默认采用 Organic Precision，保留原标志；产品图标是家族方向示例 | 品牌负责人审阅长期身份决策；授权、自托管字体/标志及离线资产包，检查回退排版 |
| P2 | Tokens 支持面 | DTCG 支持 color(sRGB)、dimension、fontFamily、duration、cubicBezier 与完整值别名；非通用转换器 | 扩展 typography / shadow 复合类型、广色域/透明度与平台精确映射，增加相应校验 |
| P2 | 持续视觉/性能验收 | 320px 全部详情页溢出记录及主要页明暗截图；无 CI 截图差异或实机性能基准 | 自动视觉基线、断点组合、主题组合、Lighthouse / Web Vitals 真实数据，避免把开发机速度当产品承诺 |

Do / Don’t 的反例刻意保留行为缺陷，且被标明为教学反例；不将反例计入推荐实现的无障碍通过声明。
