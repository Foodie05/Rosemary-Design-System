import { PlatformMatrixRow } from "../types";

export const PLATFORM_MATRIX: PlatformMatrixRow[] = [
  {
    domain: "导航结构 (Navigation)",
    web: "顶部顶栏 (Header) + 侧边栏 (Sidebar) + 响应式面包屑",
    flutter:
      "LayoutBuilder 按宽度选择：宽屏侧边 NavigationRail，窄屏底部 NavigationBar",
    apple:
      "iOS 底部 TabView (3-5项)；macOS 原生 NavigationSplitView (Sidebar + Detail)",
    android: "Navigation Bar (底部固定) 或 Navigation Rail (折叠屏/平板侧边)",
    windows: "NavigationView (左侧汉堡可折叠侧边栏，支持 Acrylic 亚克力背景)",
    rosemaryPrinciple:
      "统一信息架构与扁平层级；但桌面端优先侧边栏，移动端优先底部导航栏。",
  },
  {
    domain: "返回与退出 (Back Behavior)",
    web: "Hash URL 与浏览器历史，真实面包屑和取消入口",
    flutter: "PopScope / Navigator.maybePop()，自适应物理返回与手势",
    apple:
      "iOS 保留系统边缘返回手势 (Interactive Pop Gesture)；导航栏左上角返回按钮",
    android: "系统级 Predictive Back 预测性返回动画 + 返回手势事件捕获",
    windows: "窗口标题栏可选返回箭头按钮，或 Alt+Left 快捷键",
    rosemaryPrinciple:
      "绝对禁止劫持或破坏原生系统手势；未保存状态必须在返回中断点拦截并提示暂存。",
  },
  {
    domain: "弹窗与遮罩 (Dialog / Sheet)",
    web: "桌面端居中 Dialog 配合背景模糊蒙层；复杂配置使用右侧滑出 Drawer",
    flutter:
      "showAdaptiveDialog；sheet 由平台策略选择 Material / Cupertino 适配",
    apple:
      "iOS 优先使用原尺寸 Bottom Sheet (可拖拽阻尼高度)，破坏操作使用 ActionSheet",
    android: "Material 3 ModalBottomSheet 或 AlertDialog，遵从触觉反馈",
    windows: "ContentDialog 紧贴当前激活窗口中央，轻量操作使用 Flyout",
    rosemaryPrinciple:
      "严禁滥用居中全局阻断式弹窗；根据任务复杂度和屏幕宽度平滑升降级。",
  },
  {
    domain: "系统菜单与命令 (Menus & Commands)",
    web: "网页端快捷键命令面板 (Command Palette Cmd+K) + 下拉 Popover Menu",
    flutter: "MenuAnchor + Shortcuts/Actions 键盘映射",
    apple:
      "macOS 顶部系统菜单栏 (应用菜单 commands / CommandGroup；MenuBarExtra 仅用于状态栏附加功能)；iOS 长按 ContextMenu",
    android: "三点更多菜单 (Overflow Menu) + 浮动长按菜单",
    windows: "CommandBar (顶部或底部应用栏) + 右键上下文 Fluent ContextMenu",
    rosemaryPrinciple:
      "命令语义、图标与快捷键描述保持一致；但接入各宿主操作系统的顶层菜单基础设施。",
  },
  {
    domain: "键盘快捷键 (Keyboard Shortcuts)",
    web: "监听 keydown，支持 Mac Meta (⌘) 与 Windows/Linux Ctrl 智能适配",
    flutter: "Shortcuts + Intent + Actions 统一分发架构",
    apple: "macOS 标准 ⌘+S, ⌘+Z, ⌘+W, ⌘+N；按键提示采用 ⌘ 符号而不是文本",
    android: "外接键盘支持 Alt / Ctrl 组合快捷键",
    windows: "Ctrl+S, Ctrl+Z, F5 刷新，Alt 访问键 (Access Keys)",
    rosemaryPrinciple:
      "核心常用动作（保存、撤销、搜索、新建）必须支持零鼠标键盘盲操。",
  },
  {
    domain: "触控与触觉反馈 (Haptics & Touch)",
    web: "即时视觉反馈；宿主触觉需另行适配，当前网页未实现振动",
    flutter: "HapticFeedback.lightImpact() / selectionClick()",
    apple:
      "UIImpactFeedbackGenerator(style: .medium) / UINotificationFeedbackGenerator",
    android: "HapticFeedbackConstants.CLOCK_TICK / VIRTUAL_KEY 触感震动",
    windows: "笔触 (Pen haptics) 与高精度触控板手势",
    rosemaryPrinciple:
      "触觉只在平台支持的有意义操作中使用，遵循系统设置，避免泛滥反馈。",
  },
  {
    domain: "字体与缩放 (Typography & Scaling)",
    web: "基于 rem/em 相对单位，支持浏览器全局页面 100%-200% 缩放无重叠",
    flutter: "MediaQuery.textScalerOf(context)，适配系统字体缩放",
    apple: "全面支持 Dynamic Type，配合 UIFontMetrics 动态自适应行高",
    android:
      "支持 sp 尺寸单位与 Android 14+ 非线性字体缩放 (Non-linear font scaling)",
    windows: "XAML TextScaleFactor 自适应布局",
    rosemaryPrinciple:
      "保证大字号下文字容器自适应折行，杜绝硬编码固定容器像素高度导致拦腰截断。",
  },
  {
    domain: "明暗模式 (Light / Dark Theme)",
    web: "prefers-color-scheme 响应 + 显式切换按钮 + localStorage 持久化",
    flutter: "ThemeMode.system / light / dark 配合自定义 ThemeExtension",
    apple:
      "根据 UITraitCollection / Environment(\\.colorScheme) 动态切换 Asset Catalog 颜色",
    android: "DayNight 主题 / Dynamic Color (Material You) 协调融合",
    windows:
      "ElementTheme.Default / Light / Dark，协调 Mica 或 Acrylic 背景材质",
    rosemaryPrinciple:
      "共享 Rosemary 墨色与深灰绿语义色调，严禁生硬暴力反色反转。",
  },
  {
    domain: "无障碍技术 (Accessibility)",
    web: "原生 HTML5 语义元素 + WAI-ARIA 属性 + 2px focus-visible 焦点环",
    flutter: "Semantics Widget 树 + excludeFromSemantics 装饰过滤",
    apple:
      "VoiceOver (.accessibilityElement / .accessibilityLabel / .accessibilityHint)",
    android: "TalkBack (contentDescription / Modifier.semantics)",
    windows: "Narrator (AutomationProperties.Name / AutomationPeer)",
    rosemaryPrinciple:
      "以 WCAG 2.2 AA 为全局底线，每个可操作元素必须具备独立且明确的读屏发音。",
  },
];
