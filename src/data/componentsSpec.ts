import type { ComponentSpec } from "../types";
import { COMPONENT_RULES } from "./componentRules";

// Authored specifications. Implementation maturity is explicitly Beta / Candidate.
const AUTHORED_SPECS: ComponentSpec[] = [
  {
    id: "button",
    name: "Button",
    nameZh: "按钮",
    category: "Actions",
    subcategory: "Primary Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "触发即时业务动作、提交表单或状态变更的核心交互元素。区分 Primary、Secondary、Tertiary、Ghost 与 Danger 五种语义权重。",
    anatomy: [
      "Container (超椭圆圆角矩形)",
      "Leading Icon (可选前置图标)",
      "Label (单行文字)",
      "Trailing Icon (可选后置图标)",
      "Loading Spinner",
    ],
    variants: [
      "Primary (主操作/Rosemary绿)",
      "Secondary (边框浅色)",
      "Tertiary (文字动作)",
      "Ghost (无边框幽灵)",
      "Danger (危险删除)",
    ],
    sizes: [
      "Small (32px / 12px)",
      "Medium (44px / 14px)",
      "Large (48px / 16px)",
    ],
    states: [
      "Default",
      "Hover",
      "Focus (2px 环)",
      "Active (按下沉降)",
      "Disabled",
      "Loading",
    ],
    accessibilityNotes: [
      "使用真实 <button> 元素",
      'Loading 态下提供 aria-busy="true"',
      "文本对比度满足 WCAG AA 4.5:1",
    ],
    tokens: [
      "component.button.background",
      "component.button.foreground",
      "component.button.radius",
      "semantic.motion.fast",
    ],

    doAndDonts: {
      doText:
        "每个操作组优先保留一个 Primary 按钮，次要操作使用次要或幽灵样式。",
      dontText: "并排摆放 3 个深色填色按钮争抢用户注意力。",
    },
    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "icon-button",
    name: "Icon Button",
    nameZh: "图标按钮",
    category: "Actions",
    subcategory: "Compact Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于工具栏、表格操作列或标题栏中的紧凑型纯图标按钮，必须配备独立 aria-label 与 Tooltip。",
    anatomy: [
      "Container (正方形圆角)",
      "Central Icon (20px 居中图标)",
      "Focus Ring",
    ],
    variants: ["Standard", "Filled", "Ghost"],
    sizes: ["Small (32×32px)", "Medium (44×44px)", "Large (48×48px)"],
    states: ["Default", "Hover", "Focus-visible", "Pressed", "Disabled"],
    accessibilityNotes: [
      "必须强制包含 aria-label 描述功能意图",
      "移动端热区通过 padding 扩展至 44px",
    ],
    tokens: [
      "component.button.background",
      "component.button.foreground",
      "component.button.radius",
      "semantic.motion.fast",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "button-group",
    name: "Button Group",
    nameZh: "按钮组",
    category: "Actions",
    subcategory: "Composite Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "将相关联的操作在视觉上线性格栅合并，首尾外圆角包裹，内部共享 1px 发丝中线。",
    anatomy: [
      "Group Wrapper",
      "First Button (左圆角)",
      "Middle Buttons (直角)",
      "Last Button (右圆角)",
    ],
    variants: ["Outlined", "Filled"],
    sizes: ["Small (32px)", "Medium (44px)"],
    states: ["Default", "Hover", "Active", "Disabled"],
    accessibilityNotes: ['使用 role="group" 配合 aria-label 标明关联操作组'],
    tokens: [
      "component.button.background",
      "component.button.foreground",
      "component.button.radius",
      "semantic.motion.fast",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "split-button",
    name: "Split Button",
    nameZh: "拆分按钮",
    category: "Actions",
    subcategory: "Composite Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "左侧执行默认主操作，右侧下拉展开更多派生动作。两部分具备独立的触碰悬停高亮。",
    anatomy: [
      "Primary Action Segment",
      "Vertical 1px Hairline",
      "Dropdown Arrow Segment",
      "Menu Popover",
    ],
    variants: ["Primary Green", "Secondary Bordered"],
    sizes: ["Medium (44px)"],
    states: ["Default", "Primary Hover", "Dropdown Hover", "Open"],
    accessibilityNotes: [
      "更多选项入口提供独立名称、aria-expanded 和 aria-controls；当前浮层为按钮列表，未声明 ARIA menu",
    ],
    tokens: [
      "component.button.background",
      "component.button.foreground",
      "component.button.radius",
      "semantic.motion.fast",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "link-button",
    name: "Link Button",
    nameZh: "链接按钮",
    category: "Actions",
    subcategory: "Text Actions",
    status: "Beta",
    version: "2.0.0",
    description:
      "外观类似超链接但触发业务 JavaScript 动作的内联文字按钮，无边框与背景。",
    anatomy: [
      "Text Label",
      "Optional Inline Icon",
      "Subtle Underline on Hover",
    ],
    variants: ["Default (墨绿)", "Muted (中性灰)", "Danger (红色)"],
    sizes: ["Small (13px)", "Medium (15px)"],
    states: ["Default", "Hover (下划线)", "Focus-visible", "Disabled"],
    accessibilityNotes: [
      "如果用于页面跳转请使用真实 <a> 标签；若执行动作使用 <button>",
    ],
    tokens: [
      "component.button.background",
      "component.button.foreground",
      "component.button.radius",
      "semantic.motion.fast",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "floating-action-button",
    name: "Floating Action Button",
    nameZh: "浮动操作按钮 (FAB)",
    category: "Actions",
    subcategory: "Mobile Specific",
    status: "Beta",
    version: "2.0.0",
    description:
      "在移动设备屏幕右下角悬浮的主要操作按钮，仅限全屏长列表最核心的创建行为。",
    anatomy: ["Circular Container", "Icon", "Subtle Elevation Shadow"],
    variants: ["Standard Circular (56×56px)", "Extended with Label"],
    sizes: ["Standard (56px)", "Small (40px)"],
    states: ["Default", "Pressed", "Hidden on Scroll"],
    accessibilityNotes: ["桌面端禁用，避免遮挡表格底部行；触碰热区 56px"],
    tokens: [
      "component.button.background",
      "component.button.foreground",
      "component.button.radius",
      "semantic.motion.fast",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "text-field",
    name: "Text Field",
    nameZh: "文本输入框",
    category: "Inputs",
    subcategory: "Text Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "录入单行文本的核心控件，包含持久化 Label、微提示 Helper 与即时内联校验。",
    anatomy: [
      "Label (上置标签)",
      "Field Box (圆角边框)",
      "Prefix Icon",
      "Input Text",
      "Clear Button",
      "Helper/Error Text",
    ],
    variants: ["Default", "Filled Subtle", "Search Prefix"],
    sizes: ["Medium (44px)", "Large (48px)"],
    states: [
      "Default",
      "Hover",
      "Focused (2px 绿高亮环)",
      "Error (红框)",
      "Disabled",
    ],
    accessibilityNotes: [
      "label 与 input 必须通过 id/htmlFor 严格绑定",
      "错误文本通过 aria-describedby 关联",
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    doAndDonts: {
      doText: "字段上方常驻显式 Label，失焦时内联提示修正建议。",
      dontText: "仅使用占位符代替标签，导致用户输入后记不起字段含义。",
    },
    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "text-area",
    name: "Text Area",
    nameZh: "多行文本域",
    category: "Inputs",
    subcategory: "Text Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于长篇备注、日志或 Markdown 编辑的多行文本录入框，支持弹性自动撑高。",
    anatomy: [
      "Label",
      "Scrollable Text Area",
      "Character Counter",
      "Resize Handle",
    ],
    variants: ["Default", "Auto-grow"],
    sizes: ["Min-height 96px"],
    states: ["Default", "Hover", "Focus-visible", "Error", "Disabled"],
    accessibilityNotes: ["字数限制时实时更新并在超限前预警"],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "password-field",
    name: "Password Field",
    nameZh: "密码输入框",
    category: "Inputs",
    subcategory: "Text Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "录入保密凭证的专用输入框，内置等宽圆点掩码与一键切换明文小眼睛图标。",
    anatomy: [
      "Label",
      "Masked Input Box",
      "Visibility Toggle Button",
      "Strength Meter",
    ],
    variants: ["Default", "With Strength Bar"],
    sizes: ["Medium (44px)"],
    states: ["Masked", "Revealed", "Focused", "Error"],
    accessibilityNotes: ["切换小眼睛时需播报“密码已显示 / 密码已隐藏”"],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "search-field",
    name: "Search Field",
    nameZh: "搜索框",
    category: "Inputs",
    subcategory: "Text Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "前置搜索放大镜、右侧支持一键清空叉号的即时查询框，配合防抖检索。",
    anatomy: [
      "Search Icon",
      "Input Text",
      "Clear Button (Esc/✕)",
      "Shortcut Kbd Indicator",
    ],
    variants: ["Default", "Header Compact"],
    sizes: ["Small (32px)", "Medium (44px)"],
    states: ["Empty", "Filled", "Focused", "Loading Debounce"],
    accessibilityNotes: ['使用 role="searchbox" 与 aria-label="搜索"'],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "number-field",
    name: "Number Field",
    nameZh: "数字微调框",
    category: "Inputs",
    subcategory: "Numeric Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于精确数值、端口号或并发数的录入。定义步长与业务范围，越界时给出清楚的说明；原生步进按钮由浏览器提供。",
    anatomy: [
      "Input Box (Tabular Nums)",
      "Stepper Up/Down Buttons",
      "Unit Suffix (如 px / ms)",
    ],
    variants: ["Standard Stepper", "Compact"],
    sizes: ["Medium (44px)"],
    states: ["Default", "Hover", "Focused", "Min/Max Clamped"],
    accessibilityNotes: [
      '使用 input type="number" 或带有 aria-valuenow 的微调结构',
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "checkbox",
    name: "Checkbox",
    nameZh: "复选框",
    category: "Inputs",
    subcategory: "Selection Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于在表单中独立勾选多项或同意条款，支持选中、未选与半选 (Indeterminate) 状态。",
    anatomy: [
      "Square Box (4px 圆角)",
      "Checkmark / Dash Icon",
      "Accompanying Label Text",
    ],
    variants: ["Default", "Indeterminate"],
    sizes: ["Standard (18×18px)"],
    states: [
      "Unchecked",
      "Checked (Rosemary绿填充)",
      "Indeterminate",
      "Focus-visible",
      "Disabled",
    ],
    accessibilityNotes: [
      '使用真实 <input type="checkbox">，通过 label 包裹扩展热区',
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "radio",
    name: "Radio Button",
    nameZh: "单选框",
    category: "Inputs",
    subcategory: "Selection Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "在 2 至 5 个互斥选项中挑选唯一项的圆形控件，所有选项必须平铺可见。",
    anatomy: ["Outer Circle", "Inner Center Dot", "Label Text"],
    variants: ["Vertical List", "Horizontal Inline"],
    sizes: ["Standard (18×18px)"],
    states: ["Unselected", "Selected", "Focus-visible", "Disabled"],
    accessibilityNotes: [
      "同组单选框必须共享相同的 name 属性，支持方向键在组内流转",
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "switch",
    name: "Switch",
    nameZh: "开关",
    category: "Inputs",
    subcategory: "Selection Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于即时生效的二元状态（开启/关闭）切换，例如深色模式、自动同步或实时通知。",
    anatomy: ["Track (超椭圆胶囊轨道)", "Thumb (圆形白色滑动块)", "Label Text"],
    variants: ["Standard (44×24px)", "Compact (36×20px)"],
    sizes: ["Standard", "Compact"],
    states: ["Off", "On (Rosemary绿)", "Hover", "Focus-visible", "Disabled"],
    accessibilityNotes: [
      '具有 role="switch" 与 aria-checked 属性，动作即时生效无需再次弹窗确认',
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "slider",
    name: "Slider",
    nameZh: "滑块",
    category: "Inputs",
    subcategory: "Range Controls",
    status: "Beta",
    version: "2.0.0",
    description:
      "在连续区间内选择数值。共享 Slider 统一主题轨道、已选范围与滑块，数值持续显示在字段旁；键盘和触控采用原生范围输入行为。",
    anatomy: [
      "Track",
      "Active Progress Fill",
      "Thumb (物理圆钮)",
      "Persistent Value Output",
    ],
    variants: ["Single Thumb", "Range Slider (双滑块)"],
    sizes: ["Medium"],
    states: ["Default", "Dragging (数值更新)", "Focus-visible", "Disabled"],
    accessibilityNotes: [
      "保留原生 range 的最小值、最大值与当前值语义；方向键、Home / End 和步进遵循浏览器原生行为",
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "select",
    name: "Select",
    nameZh: "下拉单选框",
    category: "Inputs",
    subcategory: "Dropdown Selection",
    status: "Beta",
    version: "2.0.0",
    description:
      "在一组选项中选择一个值。桌面与手机网页均使用共享浮层列表，当前值在收起状态下持续可见。",
    anatomy: [
      "Trigger Box",
      "Selected Value",
      "Chevron Arrow",
      "Floating Options Menu",
    ],
    variants: ["Standard", "Outlined"],
    sizes: ["Medium (44px)"],
    states: ["Closed", "Open", "Focused", "Disabled"],
    accessibilityNotes: [
      "方向键、Home / End 高亮选项；文字输入定位；Enter / Space 确认；Escape 放弃未确认选择，Tab 正常离开",
    ],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "共享 Select 使用非编辑型 combobox / listbox 语义，浮层遵循 Rosemary Web 视觉规范。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "combo-box",
    name: "Combo Box",
    nameZh: "可搜索组合下拉框",
    category: "Inputs",
    subcategory: "Dropdown Selection",
    status: "Candidate",
    version: "2.0.0",
    description:
      "设计目标：集输入过滤与下拉点选于一身的高阶控件，适用于几十至上百项的大型数据集挑选。",
    anatomy: [
      "Searchable Text Input",
      "Dropdown Toggle Button",
      "Filtered Options List",
      "Empty Match Hint",
    ],
    variants: ["Single Select", "Multi-tag Select"],
    sizes: ["Medium (44px)"],
    states: ["Typing Filter", "Dropdown Open", "Item Highlighted"],
    accessibilityNotes: ['aria-autocomplete="list" 与 aria-expanded 状态联动'],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "date-picker",
    name: "Date Picker",
    nameZh: "日期选择器",
    category: "Inputs",
    subcategory: "Temporal Inputs",
    status: "Beta",
    version: "2.0.0",
    description: "支持键盘输入 YYYY-MM-DD 与点选日历网格的双重时间录入组件。",
    anatomy: [
      "Date Input Box",
      "Calendar Icon",
      "Calendar Popover (月份导航与天数格)",
    ],
    variants: ["Single Date", "Date Range (起止时间段)"],
    sizes: ["Medium (44px)"],
    states: ["Closed", "Calendar Open", "Date Selected"],
    accessibilityNotes: ["日历网格支持通过键盘方向键在日期格之间导航"],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "time-picker",
    name: "Time Picker",
    nameZh: "时间选择器",
    category: "Inputs",
    subcategory: "Temporal Inputs",
    status: "Beta",
    version: "2.0.0",
    description: "录入时、分、秒的时间控件，支持 24 小时制与 12 小时制。",
    anatomy: ["Time Input Box", "Clock Icon", "Hour/Minute Scroller Columns"],
    variants: ["24-Hour", "12-Hour with AM/PM"],
    sizes: ["Medium (44px)"],
    states: ["Default", "Picker Open"],
    accessibilityNotes: ["Tab 键在时与分之间切换，上下方向键增减数字"],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "file-upload",
    name: "File Upload",
    nameZh: "文件上传拖放区",
    category: "Inputs",
    subcategory: "Media Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "支持点击浏览与拖拽放置的文件上传区域，具备本地即时格式与大小校验。",
    anatomy: [
      "Drop Area Box",
      "Upload Icon",
      "Format Guidance Copy",
      "Selected Files List",
      "Upload Progress",
    ],
    variants: ["Dropzone Box", "Compact Button Trigger"],
    sizes: ["Standard Area"],
    states: [
      "Idle",
      "Dragover (高亮边框)",
      "Validating",
      "Uploading",
      "Error (格式不符)",
    ],
    accessibilityNotes: ["键盘用户可通过 Enter/Space 激活原生文件浏览窗口"],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "color-picker",
    name: "Color Picker",
    nameZh: "颜色选择器",
    category: "Inputs",
    subcategory: "Specialized Inputs",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于定制主题或数据系列颜色的色块选择器，附带 HEX 与 RGB 校验。",
    anatomy: [
      "Color Swatch Trigger",
      "HEX Input Text",
      "Color Gradient Palette Popover",
    ],
    variants: ["Preset Swatches Only", "Full Hue/Saturation Palette"],
    sizes: ["Medium (36px)"],
    states: ["Closed", "Open"],
    accessibilityNotes: ["必须显示当前颜色的 HEX 文本，防止色盲用户无法阅读"],
    tokens: [
      "component.field.background",
      "component.field.border",
      "component.field.radius",
      "semantic.color.danger",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "tabs",
    name: "Tabs",
    nameZh: "选项卡",
    category: "Navigation",
    subcategory: "View Switchers",
    status: "Beta",
    version: "2.0.0",
    description:
      "在同一上下文视图中切换不同数据维度的导航栏，超宽时支持平滑水平滑动。",
    anatomy: [
      "Tabs Track",
      "Tab Item",
      "Active Underline Indicator",
      "Badge Count",
    ],
    variants: ["Underline Line", "Segmented Capsule"],
    sizes: ["Small (32px)", "Medium (44px)"],
    states: ["Active", "Inactive", "Hover", "Disabled"],
    accessibilityNotes: [
      '遵循 WAI-ARIA Tabs 模式：role="tablist", role="tab", aria-selected',
    ],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "segmented-control",
    name: "Segmented Control",
    nameZh: "分段控制器",
    category: "Navigation",
    subcategory: "View Switchers",
    status: "Beta",
    version: "2.0.0",
    description:
      "在线性单行容器中紧凑切换 2 至 5 个互斥视图或筛选模式的高频组件。选中填充平滑切换。",
    anatomy: [
      "Background Track",
      "Selected Surface (选中填充)",
      "Segment Items (单行文字/图标)",
    ],
    variants: ["Default (表面灰底)", "Compact (用于工具栏)"],
    sizes: ["Small (32px)", "Medium (38px)"],
    states: ["Selected", "Unselected", "Hover", "Focus-visible"],
    accessibilityNotes: [
      '使用 role="tablist" 与 role="tab"，aria-selected 标识当前选中',
    ],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "breadcrumb",
    name: "Breadcrumb",
    nameZh: "面包屑导航",
    category: "Navigation",
    subcategory: "Hierarchy Wayfinding",
    status: "Beta",
    version: "2.0.0",
    description:
      "展示当前页面在信息架构中的物理层级，允许一键安全回退至任意前序节点。",
    anatomy: [
      "Ancestor Links",
      "Divider Symbol (/ 或 >)",
      "Current Page Text (墨色纯文本)",
    ],
    variants: ["Slash Separator", "Chevron Separator"],
    sizes: ["Standard (13px)"],
    states: ["Link Hover", "Current Page Active"],
    accessibilityNotes: [
      '使用 <nav aria-label="Breadcrumb"> 与 <ol> 结构化列表',
    ],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "sidebar",
    name: "Sidebar",
    nameZh: "侧边栏",
    category: "Navigation",
    subcategory: "Primary Scaffolds",
    status: "Beta",
    version: "2.0.0",
    description:
      "桌面端应用主导航脚手架，支持多级分组、折叠为 56px 图标导轨与移动端抽屉化。",
    anatomy: [
      "Brand Header",
      "Menu Groups",
      "Nav Item (Icon + Text + Badge)",
      "Footer Profile / Version",
    ],
    variants: ["Expanded (260px)", "Collapsed Mini Rail (56px)"],
    sizes: ["Desktop Baseline"],
    states: ["Expanded", "Collapsed", "Item Active", "Item Hover"],
    accessibilityNotes: ['当前激活项声明 aria-current="page"'],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "top-navigation",
    name: "Top Navigation",
    nameZh: "顶栏导航",
    category: "Navigation",
    subcategory: "Primary Scaffolds",
    status: "Beta",
    version: "2.0.0",
    description:
      "严格执行“单行三区契约”的全局顶栏：左侧品牌单标、中间4-5个单行链接、右侧唯一主要操作与搜索。",
    anatomy: [
      "Brand Zone",
      "Nav Links Zone",
      "Primary Action & Utilities Zone",
    ],
    variants: ["Sticky Blurred", "Fixed Solid"],
    sizes: ["Height 64px"],
    states: ["Default", "Scrolled with Hairline Border"],
    accessibilityNotes: ['使用 <header role="banner">，链接单行不折叠'],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "bottom-navigation",
    name: "Bottom Navigation",
    nameZh: "底部导航栏 (移动端)",
    category: "Navigation",
    subcategory: "Mobile Scaffolds",
    status: "Beta",
    version: "2.0.0",
    description:
      "移动端底部的核心导航栏，承载 3 至 5 个高频一级功能，避让系统安全区 (Safe Area)。",
    anatomy: [
      "Tab Bar Container",
      "Icon + Label Pairs",
      "Active Color Tint",
      "Safe Area Padding",
    ],
    variants: ["Fixed Bottom"],
    sizes: ["Height 56px + Safe Area Bottom"],
    states: ["Active", "Inactive", "Haptic Touch"],
    accessibilityNotes: ["触控高度符合 44px 热区标准"],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "pagination",
    name: "Pagination",
    nameZh: "分页器",
    category: "Navigation",
    subcategory: "Data Pagination",
    status: "Beta",
    version: "2.0.0",
    description:
      "多页数据导航器，支持直接键入跳转页码、总记录数回显与每页行数调整。",
    anatomy: [
      "Prev/Next Buttons",
      "Page Numbers List",
      "Jump to Page Input",
      "Page Size Select",
    ],
    variants: ["Full Featured", "Simple Prev/Next"],
    sizes: ["Medium"],
    states: ["Current Page Active", "Disabled Boundaries"],
    accessibilityNotes: ['当前激活页码包含 aria-current="page"'],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "stepper",
    name: "Stepper",
    nameZh: "分步向导条",
    category: "Navigation",
    subcategory: "Process Navigation",
    status: "Beta",
    version: "2.0.0",
    description:
      "复杂配置向导的步骤进度条，展示已完成、进行中与后续步骤，支持点击回溯。",
    anatomy: [
      "Step Node (Number/Icon)",
      "Connecting Line",
      "Step Title",
      "Step Status (Completed/Current)",
    ],
    variants: ["Horizontal Stepper", "Vertical Timeline Stepper"],
    sizes: ["Standard"],
    states: ["Completed", "Current", "Upcoming"],
    accessibilityNotes: ['声明 aria-current="step"'],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "command-palette",
    name: "Command Palette",
    nameZh: "命令面板 (⌘K)",
    category: "Navigation",
    subcategory: "Global Modal Search",
    status: "Beta",
    version: "2.0.0",
    description:
      "通过快捷键唤出的命令浮窗；本项目全站支持关键词检索页面、案例与令牌，组件示例支持执行本地命令。",
    anatomy: [
      "Search Input Bar",
      "Group Headers",
      "Result Items (Icon + Title + Kbd)",
      "Esc Badge",
    ],
    variants: ["Global Modal"],
    sizes: ["Max-w-2xl"],
    states: ["Open", "Keyboard Highlighting", "Closed"],
    accessibilityNotes: ["打开时焦点捕获，上下箭头循环选定，Escape 退出"],
    tokens: [
      "semantic.color.accent",
      "semantic.color.text-secondary",
      "semantic.space.16",
      "semantic.radius.control",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "table",
    name: "Table",
    nameZh: "基础表格",
    category: "Data Display",
    subcategory: "Tabular Data",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于展示多属性二维数据的网格，数值等宽右对齐，表头支持吸顶与列排序。",
    anatomy: [
      "Sticky Header",
      "Table Rows (Zebra optional)",
      "Sort Indicator",
      "Cell Data",
    ],
    variants: ["Comfortable (48px)", "Compact (32px)", "Bordered"],
    sizes: ["Comfortable", "Compact"],
    states: ["Row Hover", "Sorted Column", "Loading Skeleton", "Empty"],
    accessibilityNotes: [
      '使用标准 <table>, <thead>, <tbody>, <th> 配合 scope="col"',
    ],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "data-grid",
    name: "Data Grid",
    nameZh: "高阶数据表格网格",
    category: "Data Display",
    subcategory: "Tabular Data",
    status: "Candidate",
    version: "2.0.0",
    description:
      "设计目标：支持虚拟滚动、列宽拖拽、多列筛选与冻结首列的专业数据分析网格。",
    anatomy: [
      "Virtual Scroll Viewport",
      "Frozen Columns",
      "Filter Popover",
      "Selection Checkboxes",
    ],
    variants: ["Virtual Scroll Engine"],
    sizes: ["Custom Viewport Height"],
    states: ["Loading", "Cell Editing", "Multi-row Selected"],
    accessibilityNotes: [
      "遵循 WAI-ARIA DataGrid 键盘导航网格标准 (箭头键在单元格流转)",
    ],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "list",
    name: "List",
    nameZh: "列表",
    category: "Data Display",
    subcategory: "Linear Items",
    status: "Beta",
    version: "2.0.0",
    description:
      "单维排列的行状信息展示，每行包含头像/图标、主标题、描述与右侧辅助动作。",
    anatomy: [
      "Leading Avatar/Icon",
      "Content Block (Title + Subtitle)",
      "Trailing Meta & Action",
    ],
    variants: ["Clean Hairline Divided", "Inset Grouped (iOS风格)"],
    sizes: ["Single-line (48px)", "Two-line (64px)"],
    states: ["Default", "Hover", "Selected", "Disabled"],
    accessibilityNotes: ["使用 <ul> 与 <li> 元素结构"],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "description-list",
    name: "Description List",
    nameZh: "键值描述列表",
    category: "Data Display",
    subcategory: "Linear Items",
    status: "Beta",
    version: "2.0.0",
    description: "用于展示详情信息（如服务器规格、订单详情）的键值对清单。",
    anatomy: [
      "Key / Term (<dt>)",
      "Value / Detail (<dd>)",
      "Optional Hairline Divider",
    ],
    variants: ["Horizontal 2-Column", "Vertical Stacked"],
    sizes: ["Standard"],
    states: ["Default"],
    accessibilityNotes: ["使用 HTML5 语义化 <dl>, <dt>, <dd> 标签"],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "tree-view",
    name: "Tree View",
    nameZh: "树形视图",
    category: "Data Display",
    subcategory: "Hierarchical Display",
    status: "Candidate",
    version: "2.0.0",
    description:
      "设计目标：展示文件目录或组织架构的多层级缩进折叠树，支持键盘左右键展开/收起。",
    anatomy: [
      "Expand Chevron Icon",
      "Node Icon (Folder/File)",
      "Node Label",
      "Children Container",
    ],
    variants: ["File Browser Tree", "Category Tree"],
    sizes: ["Item Height 32px"],
    states: ["Collapsed", "Expanded", "Node Selected", "Hover"],
    accessibilityNotes: ['使用 role="tree", role="treeitem", aria-expanded'],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "badge",
    name: "Badge",
    nameZh: "徽标 / 状态标记",
    category: "Data Display",
    subcategory: "Badges & Indicators",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于展示通知数目或系统关键状态的紧凑徽记，必须包含文字或清晰图标。",
    anatomy: ["Container", "Status Dot / Icon", "Text / Count Label"],
    variants: ["Dot Badge", "Numeric Pill (数字徽记)", "Status Badge (带文字)"],
    sizes: ["Small (18px)", "Medium (22px)"],
    states: ["Success", "Warning", "Danger", "Neutral"],
    accessibilityNotes: ["非纯色传达：红色伴随叹号，绿色伴随对勾"],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "tag",
    name: "Tag",
    nameZh: "静态分类标签",
    category: "Data Display",
    subcategory: "Badges & Indicators",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于给文章或项目打上领域分类的纯文本标签，按信息密度采用柔和转角、细边框或文字呈现。",
    anatomy: ["Label Text", "Optional Remove Icon [✕]"],
    variants: ["Subtle Bordered", "Text Only with Prefix #"],
    sizes: ["Small (22px)"],
    states: ["Default", "Hover", "Removable"],
    accessibilityNotes: ['可移除标签需为删除按钮提供 aria-label="移除标签"'],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "avatar",
    name: "Avatar",
    nameZh: "用户头像",
    category: "Data Display",
    subcategory: "Media Presentation",
    status: "Beta",
    version: "2.0.0",
    description:
      "展示用户或组织身份的圆形图片，图片缺失时优雅降级为文字首字母或备用几何矢量图。",
    anatomy: [
      "Circular Mask",
      "User Image",
      "Fallback Initial Initials",
      "Status Indicator Dot",
    ],
    variants: ["Circle", "Continuous Squircle (超椭圆)"],
    sizes: ["Small (24px)", "Medium (36px)", "Large (48px)", "Hero (80px)"],
    states: ["Image Loaded", "Fallback Initials", "Offline/Online Dot"],
    accessibilityNotes: ['提供 alt="[用户名]的头像"'],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "dialog",
    name: "Dialog",
    nameZh: "对话框 / 模态弹窗",
    category: "Feedback",
    subcategory: "Modal Overlays",
    status: "Beta",
    version: "2.0.0",
    description:
      "中断当前用户工作流以获取关键决策或处理关键危险警告的居中覆盖层。必须节制使用。",
    anatomy: [
      "Backdrop (半透明深色遮罩)",
      "Container (圆角卡片)",
      "Header (标题与关闭按钮)",
      "Body (说明正文)",
      "Footer (取消与主确认操作)",
    ],
    variants: ["Confirmation", "Destructive Warning", "Form Dialog"],
    sizes: ["Small (400px)", "Medium (540px)", "Large (680px)"],
    states: ["Entering", "Active", "Exiting"],
    accessibilityNotes: [
      "具备 Focus Trap 焦点锁定，Escape 退出，关闭后焦点恢复至触发源",
    ],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    doAndDonts: {
      doText:
        "仅用于危险删除或不可逆关键确认；普通配置使用侧滑抽屉或内联面板。",
      dontText: "每个微小操作（如修改备注）都弹全屏居中弹窗打断上下文。",
    },
    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "alert-dialog",
    name: "Alert Dialog",
    nameZh: "警示确认弹窗",
    category: "Feedback",
    subcategory: "Modal Overlays",
    status: "Beta",
    version: "2.0.0",
    description:
      "针对高危删除（如删库、注销账号）的严格阻断弹窗，支持键入名称确认或防误触延迟解锁。",
    anatomy: [
      "Danger Icon",
      "Title",
      "Consequence Explanation",
      "Input Confirmation Field",
      "Danger CTA",
    ],
    variants: ["Destructive Hard Confirmation"],
    sizes: ["Small (440px)"],
    states: ["Locked (前1.5秒禁用)", "Name Input Matching", "Confirmed"],
    accessibilityNotes: ['使用 role="alertdialog" 与 aria-describedby'],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "sheet",
    name: "Sheet / Drawer",
    nameZh: "侧滑抽屉 / 底部半屏面板",
    category: "Feedback",
    subcategory: "Modal Overlays",
    status: "Beta",
    version: "2.0.0",
    description:
      "从屏幕右侧（桌面端）或底部（移动端）平滑滑出的次级面板，用于复杂表单与筛选。",
    anatomy: [
      "Backdrop",
      "Drawer Sheet Container",
      "Header with Close Button",
      "Scrollable Body",
      "Sticky Footer Actions",
    ],
    variants: [
      "Right Slide (桌面 400-560px)",
      "Bottom Sheet (移动端可拖拽阻尼)",
    ],
    sizes: ["Standard (480px)"],
    states: ["Opening", "Active", "Closing"],
    accessibilityNotes: ["滑出时锁定背景滚动，点击蒙层或按 Escape 关闭"],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "toast",
    name: "Toast",
    nameZh: "轻提示",
    category: "Feedback",
    subcategory: "Transient Feedback",
    status: "Beta",
    version: "2.0.0",
    description:
      "非侵入式的轻量操作反馈悬浮条，自动在屏幕右上方或底部浮现，3-5 秒后静默淡出。",
    anatomy: [
      "Surface Container",
      "Status Icon",
      "Message Text",
      "Action Button (如“撤销”)",
      "Close Button",
    ],
    variants: ["Success", "Warning", "Error", "Info"],
    sizes: ["Standard (360px)"],
    states: ["Slide-in", "Active (悬停暂停计时)", "Slide-out"],
    accessibilityNotes: ['声明 role="status" 与 aria-live="polite"'],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "snackbar",
    name: "Snackbar",
    nameZh: "底部操作浮条",
    category: "Feedback",
    subcategory: "Transient Feedback",
    status: "Beta",
    version: "2.0.0",
    description:
      "附带单个可交互操作（如“撤销”或“重试”）的底部通知条，常用于数据恢复。",
    anatomy: ["Dark Surface Bar", "Action Text", "Action Button"],
    variants: ["Bottom Floating", "Bottom Full-bleed"],
    sizes: ["Standard"],
    states: ["Active", "Dismissed"],
    accessibilityNotes: ["必须留足 5 秒以上便于用户从容点击撤销"],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "banner",
    name: "Banner",
    nameZh: "通告横幅",
    category: "Feedback",
    subcategory: "Persistent Notifications",
    status: "Beta",
    version: "2.0.0",
    description:
      "常驻在页面顶部或表格顶部的通告栏，用于全系统维护、认证过期或离线状态提示。",
    anatomy: [
      "Banner Surface",
      "Leading Icon",
      "Title & Detail Text",
      "Outlined Action Buttons",
      "Dismiss [✕]",
    ],
    variants: ["Neutral Info", "Warning Amber", "Critical Red"],
    sizes: ["Full-width"],
    states: ["Visible", "Dismissed"],
    accessibilityNotes: ["不可频繁弹出打扰，关闭后支持本地免打扰记忆"],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "progress",
    name: "Progress Indicator",
    nameZh: "进度指示器",
    category: "Feedback",
    subcategory: "Progress Indicators",
    status: "Beta",
    version: "2.0.0",
    description: "展示任务执行百分比或不确定流光的线性进度条，速率平稳不造假。",
    anatomy: ["Track", "Progress Fill Bar", "Percentage Value Text"],
    variants: ["Determinate (确定百分比)", "Indeterminate (往返流光)"],
    sizes: ["Small (4px 高)", "Medium (8px 高)"],
    states: ["Progressing", "Completed"],
    accessibilityNotes: ['声明 role="progressbar" 与 aria-valuenow'],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "skeleton",
    name: "Skeleton",
    nameZh: "骨架屏",
    category: "Feedback",
    subcategory: "Progress Indicators",
    status: "Beta",
    version: "2.0.0",
    description:
      "在异步数据拉取时与最终组件几何严格 1:1 对齐的预占位灰色块，防止布局跳跃。",
    anatomy: ["Placeholder Block", "Gentle Shimmer Gradient (1.8s 呼吸)"],
    variants: ["Text Line", "Circular Avatar", "Card Rectangle"],
    sizes: ["Dynamic based on target component"],
    states: ["Shimmering", "Transition to Content"],
    accessibilityNotes: [
      '容器标记 aria-busy="true"，加载后恢复 aria-busy="false"',
    ],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "spinner",
    name: "Spinner",
    nameZh: "环形加载菊花",
    category: "Feedback",
    subcategory: "Progress Indicators",
    status: "Beta",
    version: "2.0.0",
    description: "用于按钮内部或局部微模块拉取的环形圆弧旋转器，克制使用。",
    anatomy: [
      "Circular Track",
      "Rotating Arc (1/4 缺角)",
      "Rosemary Green Tint",
    ],
    variants: ["Inline Button Spinner", "Center View Spinner"],
    sizes: ["Small (16×16px)", "Medium (24×24px)"],
    states: ["Rotating (60fps)"],
    accessibilityNotes: ["仅用于局部微加载，页面大框架优先使用骨架屏"],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "tooltip",
    name: "Tooltip",
    nameZh: "文字提示气泡",
    category: "Overlays & Menus",
    subcategory: "Contextual Popups",
    status: "Beta",
    version: "2.0.0",
    description:
      "鼠标悬停或键盘聚焦时短暂展示功能说明或快捷键的小型深墨色气泡。",
    anatomy: [
      "Tooltip Bubble",
      "Arrow Pointer",
      "Text & Shortcut Label (如 ⌘S)",
    ],
    variants: ["Dark Surface", "Light Surface"],
    sizes: ["Compact (单行)"],
    states: ["Hidden", "Visible after 300ms Delay"],
    accessibilityNotes: [
      '具备 role="tooltip" 与 aria-describedby；悬停或聚焦 300ms 后显示，Escape 可关闭。触控操作通过按钮可访问名称和可见反馈提供必要信息',
    ],
    tokens: [
      "component.dialog.background",
      "component.dialog.radius",
      "semantic.color.border",
      "semantic.color.overlay",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "popover",
    name: "Popover",
    nameZh: "弹出卡片层",
    category: "Overlays & Menus",
    subcategory: "Contextual Popups",
    status: "Beta",
    version: "2.0.0",
    description:
      "紧贴触发元素弹出的轻量浮动卡片，可承载筛选器、日期选择或快捷操作。",
    anatomy: [
      "Anchor Element",
      "Floating Card Surface",
      "Arrow",
      "Dismiss Click-outside",
    ],
    variants: ["Top", "Bottom", "Left", "Right"],
    sizes: ["Custom content width"],
    states: ["Open", "Closed"],
    accessibilityNotes: ["按 Escape 键退出，点击卡片外部区域自动关闭"],
    tokens: [
      "component.dialog.background",
      "component.dialog.radius",
      "semantic.color.border",
      "semantic.color.overlay",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "dropdown-menu",
    name: "Dropdown Menu",
    nameZh: "下拉菜单",
    category: "Overlays & Menus",
    subcategory: "Contextual Menus",
    status: "Candidate",
    version: "2.0.0",
    description:
      "设计目标：点击“更多”或图标触发的垂向操作清单，支持图标、快捷键标注与分割线。",
    anatomy: [
      "Menu Trigger Button",
      "Menu List Surface",
      "Menu Item (Icon + Label + Shortcut)",
      "Divider",
    ],
    variants: ["Standard", "With Submenus"],
    sizes: ["Standard"],
    states: ["Open", "Item Hover", "Disabled Item"],
    accessibilityNotes: ["遵循 WAI-ARIA Menu 规范，上下箭头遍历，Enter 确认"],
    tokens: [
      "component.dialog.background",
      "component.dialog.radius",
      "semantic.color.border",
      "semantic.color.overlay",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "context-menu",
    name: "Context Menu",
    nameZh: "右键上下文菜单",
    category: "Overlays & Menus",
    subcategory: "Contextual Menus",
    status: "Candidate",
    version: "2.0.0",
    description:
      "设计目标：在表格行、文件或特定画布区域鼠标右键（或长按）唤出的就近上下文菜单。",
    anatomy: [
      "Pointer Origin Position",
      "Menu Surface",
      "Actions List",
      "Viewport Collision Adjustment",
    ],
    variants: ["Desktop Native-like"],
    sizes: ["Compact"],
    states: ["Open at cursor", "Closed on click"],
    accessibilityNotes: ["防止超出视口边缘，贴底时自动翻转向上展开"],
    tokens: [
      "component.dialog.background",
      "component.dialog.radius",
      "semantic.color.border",
      "semantic.color.overlay",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "drawer",
    name: "Drawer",
    nameZh: "边缘抽屉",
    category: "Overlays & Menus",
    subcategory: "Sliding Panels",
    status: "Beta",
    version: "2.0.0",
    description:
      "从视口边缘滑出的大尺寸辅助工作台，用于属性检查器 (Inspector) 或配置面板。",
    anatomy: [
      "Backdrop",
      "Drawer Container (全高)",
      "Panel Header",
      "Panel Content",
    ],
    variants: ["Right Drawer", "Left Drawer"],
    sizes: ["400px", "560px"],
    states: ["Sliding in", "Open", "Sliding out"],
    accessibilityNotes: ["背景遮罩锁定，支持拖拽把手拉动"],
    tokens: [
      "component.dialog.background",
      "component.dialog.radius",
      "semantic.color.border",
      "semantic.color.overlay",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "card",
    name: "Card",
    nameZh: "卡片容器",
    category: "Layout & Disclosure",
    subcategory: "Structural Containers",
    status: "Beta",
    version: "2.0.0",
    description:
      "聚合相关联信息的标准视觉容器，单层级深度，外框由 1px 发丝边界与超椭圆圆角构成。",
    anatomy: [
      "Card Container",
      "Card Header (Title + Action)",
      "Card Body",
      "Card Footer",
    ],
    variants: [
      "Outlined (标准发丝线)",
      "Filled Subtle (浅灰填充)",
      "Interactive Hover (可点击卡片)",
    ],
    sizes: ["Fluid Width"],
    states: ["Default", "Hover (微加深边界)", "Selected"],
    accessibilityNotes: [
      "当卡片可点击时整卡具备键盘焦点，内部子按钮避免事件冒泡",
    ],
    tokens: [
      "semantic.color.surface",
      "semantic.color.border",
      "semantic.space.24",
      "semantic.radius.panel",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "accordion",
    name: "Accordion",
    nameZh: "手风琴折叠面板",
    category: "Layout & Disclosure",
    subcategory: "Disclosure Containers",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于收纳常见问题 (FAQ) 或深层复杂配置的垂向折叠组件，支持高度平滑展开。",
    anatomy: [
      "Accordion Item Header",
      "Expand Chevron",
      "Collapsible Body Content",
    ],
    variants: ["Single Expand (互斥单开)", "Multi Expand (允许多开)"],
    sizes: ["Standard"],
    states: ["Collapsed", "Expanding (平滑高度)", "Expanded"],
    accessibilityNotes: [
      "header 按钮使用 aria-expanded 与 aria-controls 绑定内容面板",
    ],
    tokens: [
      "semantic.color.surface",
      "semantic.color.border",
      "semantic.space.24",
      "semantic.radius.panel",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "divider",
    name: "Divider",
    nameZh: "分割线",
    category: "Layout & Disclosure",
    subcategory: "Structural Separators",
    status: "Beta",
    version: "2.0.0",
    description:
      "划分内容模块的 1px 发丝微弱分割线，禁止使用粗暴沉重的黑粗线。",
    anatomy: ["Line (1px)", "Optional Middle Text (如“或”)"],
    variants: ["Horizontal", "Vertical", "With Middle Label"],
    sizes: ["1px"],
    states: ["Default"],
    accessibilityNotes: [
      '无语义装饰线使用 role="separator" 与 aria-hidden="true"',
    ],
    tokens: [
      "semantic.color.surface",
      "semantic.color.border",
      "semantic.space.24",
      "semantic.radius.panel",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "empty-state",
    name: "Empty State",
    nameZh: "空状态组件",
    category: "Layout & Disclosure",
    subcategory: "Status Views",
    status: "Beta",
    version: "2.0.0",
    description:
      "当数据为空、首次使用或搜索无结果时呈现的引导界面，包含安静插画、解释与首要动作。",
    anatomy: [
      "Illustration / Icon",
      "Title",
      "Explanatory Description",
      "Primary CTA Button",
    ],
    variants: [
      "No Data (初次开始)",
      "Search Empty (搜索无结果)",
      "Error Fallback",
    ],
    sizes: ["Full Viewport", "Card Inline Compact"],
    states: ["Default"],
    accessibilityNotes: ["文案温和谦逊，给出明确下一步指引"],
    tokens: [
      "semantic.color.surface",
      "semantic.color.border",
      "semantic.space.24",
      "semantic.radius.panel",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "scroll-area",
    name: "Scroll Area",
    nameZh: "自定义滚动区域",
    category: "Layout & Disclosure",
    subcategory: "Scroll Management",
    status: "Beta",
    version: "2.0.0",
    description:
      "全站采用透明轨道与 4px 自绘滑块，默认低存在感；滚动、悬停、拖动和键盘聚焦时增强反馈。保留原生滚动、触控与内容区域的键盘操作；高对比模式或不支持增强能力时回退原生滚动条。",
    anatomy: [
      "Scroll Viewport",
      "Vertical Thumb (4px 滑块、12px 操作区域)",
      "Horizontal Thumb",
    ],
    variants: ["Quiet Overlay", "Native Fallback"],
    sizes: ["Container Bound"],
    states: [
      "Idle (淡色滑块)",
      "Scrolling / Hover",
      "Dragging / Focus-visible",
    ],
    accessibilityNotes: ["支持键盘 PageUp/PageDown 与方向键正常滚动"],
    tokens: [
      "semantic.color.surface",
      "semantic.color.border",
      "semantic.space.24",
      "semantic.radius.panel",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "resizable-panels",
    name: "Resizable Panels",
    nameZh: "可拖拽调整面板",
    category: "Layout & Disclosure",
    subcategory: "Layout Management",
    status: "Beta",
    version: "2.0.0",
    description:
      "IDE 或复杂监控控制台中允许用户手动拖动分割条调整左右两栏宽度的分栏系统。",
    anatomy: ["Left Panel", "Resize Handle Bar (带有拖拽把手)", "Right Panel"],
    variants: ["Horizontal Split", "Vertical Split"],
    sizes: ["Min-width 200px limit"],
    states: ["Idle", "Dragging Active"],
    accessibilityNotes: ["分隔把手支持通过键盘左右箭头键微调宽度"],
    tokens: [
      "semantic.color.surface",
      "semantic.color.border",
      "semantic.space.24",
      "semantic.radius.panel",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "metric-card",
    name: "Metric Card",
    nameZh: "核心指标卡片",
    category: "Data Display",
    subcategory: "Dashboard Widgets",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于监控控制台的 KPI 指标展示卡，包含标题、等宽大数字、趋势箭头与微型火花线。",
    anatomy: [
      "KPI Title",
      "Big Tabular Number",
      "Trend Badge (上升/下降)",
      "Micro Sparkline",
    ],
    variants: ["Single Metric", "Metric with Comparison"],
    sizes: ["Standard Grid Cell"],
    states: ["Normal", "Warning Threshold", "Critical Threshold"],
    accessibilityNotes: ["趋势箭头必须伴随文字“较昨日上升 12%”"],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "prober-status",
    name: "Prober Status Indicator",
    nameZh: "服务探针状态指示器",
    category: "Feedback",
    subcategory: "Telemetry Widgets",
    status: "Beta",
    version: "2.0.0",
    description:
      "专用于服务巡检探针的高可靠性状态组件，图文双编码标识节点健康度。",
    anatomy: [
      "Status Glyphs (Check/Warning/Cross)",
      "Status Label",
      "Latency Ping",
      "Last Probed Timestamp",
    ],
    variants: ["Pill Inline", "Card Block"],
    sizes: ["Compact", "Detailed"],
    states: ["Healthy (绿色对勾)", "Degraded (黄色叹号)", "Down (红色叉号)"],
    accessibilityNotes: [
      "色盲安全，每个状态都有独特的几何图形与文字，严禁纯单色圆点",
    ],
    tokens: [
      "semantic.color.success",
      "semantic.color.danger",
      "semantic.color.warning",
      "component.dialog.background",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
  {
    id: "file-row",
    name: "File Browser Row",
    nameZh: "文件管理器行",
    category: "Data Display",
    subcategory: "File Management",
    status: "Beta",
    version: "2.0.0",
    description:
      "用于多端同步与文件管理列表的精致行组件，展示文件类型图标、文件名、大小与同步勾选。",
    anatomy: [
      "Type Icon (PDF/Dart/JSON)",
      "File Name",
      "File Size (Tabular Nums)",
      "Sync Status Icon",
      "Action Menu",
    ],
    variants: ["List View", "Grid Thumbnail"],
    sizes: ["Row Height 44px"],
    states: ["Synced", "Syncing (微转轮)", "Local Only", "Hover"],
    accessibilityNotes: ["支持空格键快速选中，双击触发打开"],
    tokens: [
      "semantic.color.text",
      "semantic.color.surface",
      "semantic.space.12",
      "semantic.color.chart-one",
    ],

    platforms: {
      web: "本项目 src/components/ui 内的 React / 原生 HTML 参考源码。",
      flutter:
        "优先采用 Material / Cupertino 原生控件；tokens Dart 产物提供同名语义参数。本地 SDK 按组件清单标注 Prototype / Draft，成熟度见原生 SDK 验收。",
      apple:
        "使用 SwiftUI 原生控件、Dynamic Type 与平台导航。生成的 Color / CGFloat 令牌为参考产物。",
      android:
        "使用 Compose / Material 原生控件与返回机制。Color / Dp 产物为参考，不包含组件包。",
      windows:
        "使用 WinUI 原生控件、焦点与标题栏。C# Color / double 产物为参考。",
    },
  },
];

export const COMPONENT_SPECS: ComponentSpec[] = AUTHORED_SPECS.map((spec) => ({
  ...spec,
  doAndDonts: COMPONENT_RULES[spec.id],
}));
