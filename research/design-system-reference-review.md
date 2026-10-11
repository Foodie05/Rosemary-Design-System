# Rosemary 设计系统参考审阅

**审阅日期：2026-10-11**

**范围说明：** 本审阅针对更新前版本。下方清单用于确定规范要素，不代表 1.1 版仍未完成的任务。当前覆盖和实施状态以门户“覆盖、资源与维护”为准。

## 结论

Rosemary 现有内容已经清楚说明品牌原则、视觉角色、保存与恢复、隐私、文案、可及性和成熟度，也明确声明门户不是生产组件库。下一次更新不应继续增加品牌宣言，而应把现有原则转成可查、可实现、可测试的规范。优先补齐三类内容：统一的组件页模板、完整的反馈与加载决策、跨尺寸与跨平台的导航和响应式规则。

以下建议区分“官方页面已核对的事实”和“建议 Rosemary 采用的做法”。Apple HIG 与 Material 3 的页面主体在本次环境中由客户端渲染，文本抓取只得到页面标题；因此本文只把它们用作已核对的信息架构与后续复核入口，不转述无法直接读取的正文。Carbon 和 Atlassian 页面可直接读取，下面涉及它们的具体要求均来自已核对页面。

## 官方参考核对

### Apple Human Interface Guidelines

已确认下列官方页面存在且标题与主题一致，但本次无法直接读取客户端渲染的正文，不能声称已核对其中的具体条款：

- Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Loading: https://developer.apple.com/design/human-interface-guidelines/loading
- Navigation and search: https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
- Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Writing: https://developer.apple.com/design/human-interface-guidelines/writing

后续实现任何 Apple 平台专属尺寸、手势、导航或系统能力前，应由设计与工程人员在可交互浏览器中复核这些页面。本报告不把 Rosemary 当前数值误称为 Apple 规范。

### Material Design 3

官方站点地图和页面标题已核对。Material 3 为组件统一提供 `overview`、`guidelines`、`specs`、`accessibility` 四类页面，这种文档结构值得 Rosemary 直接借鉴。官方元数据还明确区分短时等待的 loading indicator、实时表达过程状态的 progress indicator，以及由窗口尺寸类别驱动的自适应布局。页面主体同样由客户端渲染，本次未把未读取的正文写成具体要求。

- Foundations: https://m3.material.io/foundations
- Components: https://m3.material.io/components
- Progress indicators: https://m3.material.io/components/progress-indicators/overview
- Loading indicator: https://m3.material.io/components/loading-indicator/overview
- Motion: https://m3.material.io/styles/motion/overview/how-it-works
- Easing and duration: https://m3.material.io/styles/motion/easing-and-duration/applying-easing-and-duration
- Adaptive layout: https://m3.material.io/foundations/layout/layout-overview/adaptive-design
- Breakpoints: https://m3.material.io/foundations/layout/breakpoints/overview
- Content design: https://m3.material.io/foundations/content-design/overview

### Carbon Design System

Carbon 的公开正文已直接核对。它把 foundations、components、patterns、content、accessibility 和 contribution 分开，并为组件提供 usage、style/specification、code、accessibility 等页面。

- Accessibility: https://carbondesignsystem.com/guidelines/accessibility/overview/
- Motion: https://carbondesignsystem.com/guidelines/motion/overview/
- Loading pattern: https://carbondesignsystem.com/patterns/loading-pattern/
- Content: https://carbondesignsystem.com/guidelines/content/overview/
- Button usage: https://carbondesignsystem.com/components/button/usage/
- Button accessibility: https://carbondesignsystem.com/components/button/accessibility/
- Components overview: https://carbondesignsystem.com/components/overview/
- Component checklist: https://carbondesignsystem.com/contributing/component-checklist/
- Contribution overview: https://carbondesignsystem.com/contributing/overview/
- 2x Grid: https://carbondesignsystem.com/guidelines/2x-grid/overview/

已核对的关键点包括：组件规范要覆盖颜色、字体、结构、尺寸、全部配置、交互状态、响应式、溢出、重排、展开和滚动；稳定组件还需要代码、长文档、类型、迁移办法、单元测试、视觉回归、自动可及性检查和 JAWS、VoiceOver、NVDA 人工测试。Carbon 的按钮页展示了“用途—变体—结构—尺寸—组合—内容—状态—交互—键盘—可及性状态”的完整深度。

Carbon 的加载模式明确区分骨架、无确定进度的加载指示器、进度条、渐进加载和“加载更多”。骨架只用于容器型或数据型内容，不应用于按钮、输入、菜单、通知或模态框本体；等待超过很短时间时应考虑可表达进度的方式；屏幕阅读器应获知加载、忙碌、卡住和失败。

### Atlassian Design System

Atlassian 的公开正文已直接核对。它将 foundations、components、tokens、tools 和 release phases 分开；组件页包含 examples、code、usage、changelog，并在 usage 中写明 parts、accessibility、best practices、Do/Don’t 和 content guidelines。

- Accessibility: https://atlassian.design/foundations/accessibility
- Content: https://atlassian.design/foundations/content
- Motion: https://atlassian.design/foundations/motion
- Components: https://atlassian.design/components
- Button examples: https://atlassian.design/components/button/examples
- Button usage: https://atlassian.design/components/button/usage
- Spinner usage: https://atlassian.design/components/spinner/usage
- Progress bar examples: https://atlassian.design/components/progress-bar/examples
- Progress indicator usage: https://atlassian.design/components/progress-indicator/usage
- Navigation system: https://atlassian.design/components/navigation-system/examples
- Responsive primitives: https://atlassian.design/components/primitives/responsive/examples
- Release phases: https://atlassian.design/release-phases

已核对的关键点包括：组件内置可及性不能代替端到端审阅；普通文字对比度采用 4.5:1，较大文字与图形采用 3:1；界面必须支持语义 HTML、键盘、重排、文字替代和减少动态。按钮应把动作与导航分开，一个区域只保留一个主操作；尽量不用禁用按钮来隐藏下一步，改用验证和明确说明；按钮标签使用简短、具体的动作词。Spinner 只在预期等待超过一秒时出现，一个页面同时只显示一个，并提供准确的辅助技术标签。Motion 页面要求动效服务于理解，频繁交互保持短促，退出快于进入，减少动态时当前做法为关闭动效并即时完成状态变化。Release phases 明确区分 Early Access、Beta、General Availability、Intent to Deprecate 和 Deprecated，并要求弃用期和替代迁移路径。

## Rosemary 必补的覆盖清单

### 1. Foundations

- [ ] 建立基础目录：原则、色彩、字体、图标、插画、间距、栅格、布局、圆角、边框、层级、动效、声音与触觉、内容、可及性、国际化、平台适配。
- [ ] 把 Token 分成原始值、语义角色和组件 Token；记录浅色、深色、高对比、平台映射和回退值。
- [ ] 为每个色彩角色列出允许组合、禁止组合、文本与非文本对比度、悬停、按下、焦点、禁用和高对比表现。
- [ ] 为字体补齐字号缩放、最大行宽、截断与换行、中英文混排、数字、动态字号和放大后的重排规则。
- [ ] 为布局定义内容宽度、栏数、间距、断点或窗口尺寸类别、密度、侧栏行为、RTL 和超长内容；不要只给一组桌面像素值。
- [ ] 明确 Web、iOS、Android、Windows 的共通语义与各自采用系统控件、导航和反馈的边界。

### 2. 每个组件必须使用同一规格模板

- [ ] **目的与边界**：解决什么问题；什么时候使用；什么时候换成别的组件。
- [ ] **结构**：标出所有部件、必选/可选、插槽、标签关系和点击区域。
- [ ] **变体与尺寸**：视觉层级、尺寸、密度、图标位置、单独/组合用法。
- [ ] **状态**：默认、悬停、按下、焦点、选中、禁用、只读、加载、成功、警告、错误；异步组件再补空、部分数据、离线、超时、权限不足、重试和恢复。
- [ ] **行为**：鼠标、触控、键盘、屏幕阅读器、焦点进入/退出、关闭方式、滚动、溢出、重排和响应式变化。
- [ ] **内容**：标签公式、长度、标点、错误写法、本地化扩展和缺省文案。
- [ ] **Do/Don’t**：每条必须说明原因，并配同一场景的正确与错误对照，不能只展示装饰差异。
- [ ] **可及性**：名称、角色、状态、ARIA/原生语义、焦点顺序、键盘表、对比度、目标尺寸、缩放和减少动态。
- [ ] **交付信息**：设计 Token、实现/API、示例、测试状态、成熟度、版本、变更记录、弃用与迁移。

优先完成的组件清单：按钮、链接、图标按钮、文本输入、多行输入、选择器、复选框、单选框、开关、搜索、表单与验证、菜单、标签页、面包屑、分页、顶栏、侧栏、对话框、抽屉、提示、通知、工具提示、卡片、列表、表格、空状态、错误状态、骨架、Spinner、进度条和分步进度。

### 3. 组件 Do/Don’t 的最低要求

- **按钮**：用按钮执行当前界面的动作，用链接导航；一个区域只放一个主按钮；标签优先“动词＋对象”；不可逆动作使用危险语义。不要把多个操作都做成主按钮，不要用颜色替代后果说明，不要用无法获得焦点的禁用状态隐藏修复路径。
- **表单**：标签持续可见，帮助文本与错误就近关联，提交后把焦点带到错误摘要或首个错误，并保留输入。不要只用占位符作标签，不要在失焦前过度报错，不要因一次失败清空内容。
- **对话框**：只用于需要立即决定或明确阻断的任务，标题说明对象，按钮说明动作，焦点进入后受控并可安全退出。不要用模态框承载普通阅读，不要叠加对话框，不要用含糊的“确定”。
- **通知与错误**：说明发生了什么、影响什么、下一步是什么；区分就地错误、页面级问题和跨页面系统状态。不要让短暂 toast 承担必须记住或必须操作的信息。
- **导航**：持续显示当前位置、层级和返回路径；响应式变化后保留当前目的地、滚动位置和输入；键盘焦点顺序与视觉顺序一致。不要让相同图标在不同区域表示不同目的地，不要把核心入口只藏在手势或悬停里。
- **空状态**：区分首次使用、筛选无结果、权限不足、离线和真实空数据，并只提供与原因匹配的下一步。不要用同一幅插画和同一句文案覆盖所有空状态。

### 4. 反馈与加载

建立一张决策表，而不是只给 Spinner 示例：

1. 小于约一秒且不会造成误解时，不闪现加载器；控件可立即反馈按下状态。
2. 短时、进度未知、局部操作使用就近 Spinner 或内联状态，并保留上下文。
3. 已知进度或明显超过短时等待时使用进度条，显示已完成量、当前阶段或剩余步骤；不要伪造百分比。
4. 首屏容器和数据结构可使用骨架，占位尺寸应接近最终内容，避免布局跳动；动作控件、菜单、通知和模态框本体不做骨架。
5. 多数据源页面采用渐进加载：先稳定结构和关键文字，再加载非关键图像、视口外内容和次要数据。
6. 长任务允许离开当前页面，持续提供状态、取消条件、失败影响和完成通知；不能靠无限 Spinner 阻塞整个产品。
7. 所有异步流程定义成功、空、部分完成、离线、超时、取消、权限不足、重试和恢复；辅助技术能获知 busy、进度、完成和失败，但避免频繁播报。

建议加入三个 Rosemary 专属但克制的模式：

- **保存状态轨道**：在内容标题附近使用固定位置的短文本，依次显示“正在保存”“已保存在此设备”“等待同步”“正在同步”“已同步”“同步失败”。宽度预留，避免文字切换引发布局移动；失败状态保留“重试”和查看影响范围的入口。
- **结构化书页骨架**：仅对文章、列表、卡片等内容区显示与真实排版相同的标题线、正文块和媒体框，不模拟可点击控件。默认采用低对比静态占位；只有未启用减少动态时才允许轻微、低频的亮度变化。
- **可离开的长任务卡**：导入、导出或批量处理改为持久任务卡，显示阶段、确定或不确定进度、可否关闭页面、取消后果和失败项。完成后把结果保留在可返回的位置，而不是只显示一次 toast。

### 5. Motion 与减少动态

- [ ] 建立语义动效 Token，而不是页面各自写毫秒值：反馈、状态切换、进入、退出、位置变化、强调。
- [ ] 每个 Token 记录用途、属性、时长、缓动、距离、可否中断、连续触发处理和 reduced-motion 替代。
- [ ] 高频动作最短且不阻塞；退出通常比进入快；大范围变化可以更久，但必须帮助用户理解空间关系。
- [ ] 只动画合成友好的属性；避免造成布局反复计算、输入延迟或低性能设备掉帧。
- [ ] 页面上同一时刻只设一个主要运动焦点；相关元素可协同，但不要多组动画争夺注意力。
- [ ] 不使用闪烁、快速振荡、大面积扫动、持续漂浮、自动视差或无法暂停的装饰循环。
- [ ] reduced-motion 不能只把时长改短：移除位移、缩放、视差和自动滚动，改用即时切换或短淡化；加载状态仍须以静态文字、进度或可理解的低运动指示表达。
- [ ] 验收时分别测试正常、减少动态、低性能设备和快速重复操作。

建议新增两种 Rosemary 过渡：

- **导航定位标记**：章节切换时只移动侧栏选中标记或下划线，内容直接更新或短淡化；不让整页横向飞入。减少动态时标记即时切换。
- **局部恢复高亮**：撤销、重试或离线恢复成功后，只对实际恢复的行或段落显示一次边框/背景淡化，并同步给出文字状态。不要用弹跳、撒花或全屏动画。

### 6. Navigation、响应式与平台

- [ ] 定义全局、产品级、章节级、上下文和临时导航，说明各自容纳多少目的地及层级上限。
- [ ] 为顶栏、侧栏、标签页、面包屑、返回、搜索、分页和分步流程分别写选择规则，不按外观互换。
- [ ] 为窄、中、宽尺寸给出结构变化：侧栏何时折叠、次要操作如何迁移、表格如何重排、双栏何时变成单栏；不要只做等比例缩小。
- [ ] 保留深链接、浏览器返回、焦点恢复、滚动恢复和刷新后的当前状态。
- [ ] 明确触控、指针、键盘和屏幕阅读器下的等价操作；悬停、拖放、长按和滑动必须有可见替代。
- [ ] 原生产品优先采用目标平台导航和系统控件；跨平台统一术语、数据后果和恢复逻辑，不强求像素一致。

### 7. Content 与治理

- [ ] 内容规范至少覆盖术语、按钮标签、标题、帮助、错误、成功、空状态、权限、通知、日期时间、数字、本地化和替代文本。
- [ ] 每个组件记录负责人、成熟度、最后复核日期、支持平台、已知限制和可及性测试状态。
- [ ] 把现有“提案/试用/稳定”映射为明确入口条件与退出条件；补充“拟弃用/已弃用”，并强制提供替代方案和迁移期限。
- [ ] 稳定组件必须同时具备设计规格、实现、文档、示例、自动测试、视觉回归、键盘测试和至少一种屏幕阅读器人工验证；复杂组件覆盖多种状态。
- [ ] 新模式先在至少两个不同场景试用，记录用户问题、采用范围和反例，再决定是否升级为系统标准。
- [ ] 所有 breaking change 提供变更说明、影响范围、迁移步骤和回退办法；历史文档保留版本入口。

## 建议的更新顺序

1. 先建立组件页模板和异步状态矩阵，避免继续产生只有静态理想态的示例。
2. 以按钮、文本输入、表单、对话框、通知、骨架、Spinner、进度条和导航为第一批完整组件。
3. 再补响应式导航、平台差异、内容规范和动效 Token。
4. 最后接入成熟度、测试证据、变更记录和弃用流程，使门户从品牌提案逐步成为可执行的设计系统参考。
