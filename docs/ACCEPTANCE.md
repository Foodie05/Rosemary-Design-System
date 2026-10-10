# Rosemary 第二轮验收报告

版本：2.0.0-beta.1。日期：2026-10-10。基于原项目迭代，没有创建远端或发布软件包。

## 范围与结果

| 用户要求 | 已交付 | 实际证据 |
|---|---|---|
| 品牌语言和三个方向 | 三个实质不同方向，每个含首页、文档、控件和 Notes 页面；默认 Organic Precision | 网站 `#/brand`，`BRAND-DECISION.md`，`screenshots/brand-01..03.jpg` |
| 64+ 视觉对照 / 32+ 交互 | 65 个独立双侧场景，56 个真实交互；9 个静态视觉对照 | `catalogue.json` 列出逐项 ID、源码、URL 和交互状态；65 个双侧渲染契约 |
| 分类与案例检索 | 10 专题、动态计数、关键词 / 标签 / 平台 / 交互联合筛选、12 项按需加载、Reset、相关案例 | 浏览器复合筛选和返回恢复记录；目录测试 |
| 55+ 组件 / 30+ Web | 61 项规范、54 个交互参考；56 Beta、5 Candidate | 七个独立组件族和共享核心；61 个注册/渲染契约；每项专属使用规则、平台注释与当前实现范围 |
| Playground | 支持属性来自实际组件注册；内容、主题、宽度、Reset、代码；Button 五变体 / 三尺寸 / 状态 / 图标矩阵 | 目录测试、浏览器 Button 配置验证，所有预览使用 ui 族的同一实现 |
| Tokens 单一来源 | Primitive / Semantic / Component，Dark 按覆盖继承；169 × 2 模式；CSS/TS/Dart/Swift/Kotlin/C# | `tokens/`、构建脚本、确定性检查；浏览器下载 Dark JSON 与生成文件 SHA-256 一致 |
| 键盘与导航 | 原生 showModal、焦点循环/Escape/恢复；Tabs 方向键/Home/End；分栏键盘与 pointer；移动模态导航 | 真实浏览器操作记录；行为测试；独立 URL、标题、历史、延迟页面锚点验证 |
| 响应式与主题 | 浅色/深色；全部 139 个栏目 / 详情 URL 在 320px 浅色与深色主题无页面水平溢出；13 个栏目在 1280px 复测；390px 移动导航 | `browser-checks.json` 逐 URL 宽度；首页明暗截图 |
| 工程质量 | 类型检查、425 项 Web 测试、生产构建通过 | `engineering-checks.json`、`web-check.log`、`test-results.json`；运行 `npm run check` 可再生成 |
| 原生参考 | Flutter ThemeExtension + Button/TextField/Switch；analyze 和 4 项 widget 测试；Swift Tokens + SaveButton 类型检查 | `platforms/` 实际源码，`native-checks.json` 含 SDK 版本、命令、原始输出 |

## 验证覆盖

425 项 Web 测试组成：132 项注册表 / 路由 / 可视化契约、60 项行为、6 项目录 / Playground / 品牌探索、7 项 Tokens、127 项推荐组件与 Do 场景 axe 结构、13 项实际网站栏目的 axe 结构，15 项网站自用规范回归检查、26 项真实导航 / 共享选择控件检查、6 项范围输入检查、8 项说明标签 / 自绘滚动条回归检查及 17 项动效 / 中断 / 生命周期检查、5 项分层查阅 / 完整目录搜索 / 发布地址检查和 3 项原生设计映射检查。

关键行为验证包括表单失焦错误与修正、反例延迟错误、自动保存 Saved/Offline/Failed/Retry、删除撤销、离线编辑队列、上下文保留、批量归档恢复、Snackbar 真正撤销版本、输入与选择、排序、菜单、通知、加载防重提交、普通按钮避免意外提交表单。本轮浏览器复查包括搜索选中项与 active descendant 一致、跨层令牌直达、表格与操作区间距、进度暂停、弹窗居中 / 焦点循环 / Escape 恢复、移动导航和令牌下载核对。其他行为由现有测试覆盖。

浏览器范围为本机 Codex In-app Browser。320px 记录测量的是页面 `scrollWidth <= viewport width`，不等同于所有布局、读屏或触控均已完整验收。案例目录缩略图显示真实 Scene 的静态状态，不计为额外交互实现。

## 网站自用规范修正

这轮覆盖网站外壳、文档排印、目录、Playground 与共享 Web 组件。修正依据是网站现有 Foundations 和设计原则，并非重新制定标准。

- 排印：正文使用系统无衬线字体，16px / 1.7；Web 字阶通过 rem 与语义角色表达。导航和操作说明使用 14px，常规元数据最低 12px。SVG 装饰图中的图形标注和明确的阅读反例不计作正文。
- 几何与交互：Medium Button 的源令牌由 40px 修正为规范声明的 44px，图标控件采用 44px 热区、20px 图形和 1.75 描边，相关 Medium 尺寸文档同步为 44px；选择行使用 44px 热区，颜色选择器使用 48px 宽度。网站结构的布局间距对齐四像素网格并引用空间令牌；教学反例与品牌探索保留各自用途。
- 表格组合：表格单独滚动，批量操作在其后独立布局，实测间距 24px。全归档后显示恢复说明，恢复按钮真实工作。
- 进度与浮层：进度条使用主题语义颜色、8px 圆角轨道、独立百分比与准确的暂停 / 继续反馈。Dialog 显式定义 fixed / inset / auto margin，避免 CSS reset 移除原生居中；桌面和小屏实测居中。Popover、拆分按钮与右键浮层使用原生顶层显示，避免被预览边框裁切；按钮触发时保持 8px 间距，右键触发时跟随指针并限制在视口内。
- 用户掌控：网站提供跟随系统 / 浅色 / 深色，并监听系统主题变化。Tokens、Foundations、组件参数与 Playground 默认跟随网站。Playground 配置和首页草稿保留在当前会话；筛选浮层确认才生效，取消放弃草稿。
- 上下文与恢复：令牌深链接自动包含对应层级，搜索方向键选择与辅助技术关联一致。浮层支持 Escape、外部关闭及焦点恢复；文档加载失败有重试 / 返回入口，代码复制失败保留手动复制路径。
- 文档真实性：组件目录直接展示实际参考组件，缩略预览隔离交互；正文页统一文档布局。候选组件的能力边界保留在规范说明中，避免把实现术语塞进预览操作流程。下拉操作示例明确报告“已选择操作”，不声称已执行未实现的业务动作。

上一轮自用规范修正增加 15 项回归检查，当时 360 项自动检查通过；139 个页面在浅色与深色各完成一次 320px 溢出复查。记录测量值与范围，不据此声称每个状态或所有真实设备已完成视觉和辅助技术验收。

新增截图：`screenshots/data-grid-spaced-light.jpg`、`screenshots/progress-refined-light.jpg`、`screenshots/dialog-centered-light.jpg`、`screenshots/dialog-centered-mobile.jpg`、`screenshots/popover-mobile.jpg`。首页和三个品牌方向截图同步更新。

## 真实导航、共享选择与滚动控件

- 所有非首页栏目使用来自实际路由和目录的面包屑。组件 / 案例详情链接回真实目录，当前页仅为文字；无效详情仍有上级入口。分隔符对辅助技术隐藏，重复返回入口与装饰性路径已删除。分类、状态和预览名称明确作为元数据展示。
- 原有 18 处原生下拉全部迁移到共享 `Select`，保留原选项值和状态保存行为。桌面及手机使用同一主题列表，44px 选项、8px 锚点间距、16px 视口边距；支持键盘高亮 / 输入定位 / 确认 / 取消、外部关闭及焦点恢复。现代浏览器使用原生顶层，缺少该能力时挂载到最近的对话框或页面根部；回退位置与主题保留由测试覆盖。
- 六处范围输入迁移到共享 `Slider`：44px 操作区域、8px 轨道、20px 滑块与当前值填充。保留原生 range 语义、步进、键盘、点击与触控行为；含数值 output 的字段额外明确输入名称，避免标签关联到 output 后滑块无名称。
- 全站页面、侧栏、代码区、表格和浮层使用自绘滚动条：透明轨道、4px 淡色滑块和 12px 操作区域；默认透明度 0.28，滚动 / 悬停增强至 0.55，拖动 / 键盘聚焦采用清晰的主题强调色。原元素仍负责内容滚动；支持轨道定位、拖动、滚轮、方向键与 Home / End。高对比模式或缺少 ResizeObserver 时回退原生滚动条。源码展示同步包含 `useScrollbars.ts`。
- 浏览器验证：父级导航和历史返回、无效详情；明暗下拉、小屏边界与底部向上展开；239 选项长列表 End 定位和内部滚动；对话框内列表首次 Escape 只关闭列表、再次 Escape 关闭对话框并恢复入口；范围输入方向键 / Home / End / 禁用；滚动区域 End / Home。当时 390 项检查通过，139 个页面重新完成浅色 / 深色 320px 溢出复查。

本轮截图：`breadcrumb-tokens-dark.jpg`、`breadcrumb-component-dark.jpg`、`select-unified-light.jpg`、`select-unified-dark.jpg`、`select-mobile-light.jpg`、`select-in-dialog-mobile.jpg`、`select-long-mobile-dark.jpg`、`slider-unified-light.jpg`、`slider-unified-dark.jpg`、`slider-mobile-light.jpg`、`scroll-area-unified-light.jpg`，均位于 `docs/screenshots/`。真实手机触控、读屏、多浏览器及系统高对比度仍未完成验收。

## 说明标签与低存在感滚动条复查

- 修复共享 Tooltip 把鼠标点击产生的焦点当作键盘焦点的问题：移开鼠标后关闭，并取消未到期的显示定时器。键盘焦点仍保留说明；Escape 在显示前后均能取消，离开后再次进入可重新显示。
- 6 项回归检查覆盖鼠标点击后离开、延迟取消、键盘焦点与 Escape、滚动几何，以及原视口与自绘滑块的键盘、轨道点击、拖动、滚轮同步和卸载恢复。396 项测试、类型、令牌确定性与生产构建通过。
- 实际浏览器验证侧栏 End / Home、代码区 End、内容区域原生 End 与自绘滑块 Home、手机长列表 End 与滚动位置同步；320px 对话框打开时隐藏背景滚动条，列表与对话框的两级 Escape 保持正常。鼠标拖动由回归测试覆盖，没有声称完成浏览器拖动实测。
- 全部 139 个 URL 再次完成浅色 / 深色 320px 溢出复查；13 个栏目在 1280px 深色复查，均无页面水平溢出。控制台警告 / 错误为空。上一轮导航和选择控件的人工记录与源码指纹保留为历史证据。
- 新截图：`scrollbars-quiet-dark.jpg`、`scrollbars-quiet-light.jpg`、`scrollbars-quiet-mobile-list.jpg`。全部位于 `docs/screenshots/`。

## 统一动效与网站自用（2026-10-10）

- 61 个组件均定义状态反馈、进入、退出、中断与减少动态效果规则；静态组件明确保持静态。基础规范页提供真实共享组件重播，组件详情页显示同源规则，网站导航、筛选、代码语言与主题控件采用相同参数。参数见 `MOTION.md`，注册表导出为 `motion-catalogue.json`。
- 同级页面依据真实导航顺序关联，详情深入 / 返回具有相反方向；跨层页面淡入。原生视觉快照先 80ms 退出，再 180ms 进入，避免双套正文重叠。没有原生能力时使用 240ms 单正文入场。初次访问、条件搜索与章节锚点不产生页面切换。Tabs 指示器与 240ms / 12px 内容过渡连续衔接；快速反向取消上一段，始终只有一个可操作内容面板。
- 复选框保留原生 input 语义，勾选与取消均以 150ms 改变标记；实际浏览器分别捕获 16 / 15 个过渡中状态，checked 即时生效。Slider 悬停 1.1 / 按压 1.18 的滑块变化与淡色强调环，松开、取消与窗口失焦均恢复；实际按住和拖动从 0 到 73 验证，输入直接跟随。滚动条 4px 闲置 / 6px 悬停 / 8px 拖动，在先前本轮动效浏览器实测中记录了真实按住与拖动，记录明确保留当时源码指纹。
- Sheet 初始焦点进入任务字段；没有悬停关闭按钮时，约一秒内 12 次实际捕获均无说明标签。说明只在真实悬停或键盘导航焦点后显示。修复原生延迟 close 事件的竞态：关闭后 25ms 重新打开仍保持开启，旧事件不会覆盖新状态。
- 全站页脚“动态效果”设置实时尊重系统，保存 system / reduce，不能覆盖系统的减少偏好。网站减少模式实测 13 个栏目和全部 61 个非空组件预览：没有非零动画 / 过渡，Tabs 内容即时变化、opacity 1 / transform none。测试覆盖系统媒体变化与订阅清理；未切换操作系统设置。
- 下拉浮层沿真实锚点方向移动，并限制动画过程中的 16px 视口边距。最终 320px 长列表包含 239 项，End 定位末项、scrollTop 11622，实际边界 left 144 / right 304 / top 16 / bottom 336，无水平滚动条；对话框内两次 Escape 逐层关闭并恢复入口焦点。
- 最终源码的 `npm run check` 全部通过：417 项测试、类型、令牌确定性与生产构建。139 个页面分别完成 Light / Dark 320px 全站水平溢出复查；13 个栏目在 Dark 1280px 复查。工程与浏览器记录使用同一最终源码指纹。一次构建替换旧资源造成的动态模块加载错误已通过重新加载恢复，原始记录单列保存；最终 QA 无新增警告 / 错误。
- `motion-page-peers.mp4`（26 帧）、`motion-dialog-opening.mp4`（22 帧）和 `motion-dialog-reverse.mp4`（24 帧）由最终构建的真实截图按记录时间差编码，逐帧原图、时间和源码指纹均保留。新截图包括 `sheet-no-spurious-tooltip-dark.jpg`、`checkbox-motion-dark.jpg`、`tabs-motion-dark.jpg`、`slider-press-3.jpg`、`motion-foundations-desktop-dark.jpg`、`motion-foundations-mobile-light.jpg` 与手机列表截图。静态截图不被用作全过程动效证明。

上述记录来自 Codex IAB；Safari / Firefox、真实手机触控、读屏、Forced Colors 和低性能设备尚待验收，不声称覆盖所有状态 / 设备。Flutter analyze / 4 项测试与 Swift 类型检查在本轮 169 个令牌生成后通过，之后仅修改 Web 源码。

## 无障碍声明的边界

WCAG 2.2 AA 为目标，**不是合规认证**。141 项 axe 检查覆盖 DOM 结构与语义；jsdom 无布局，`color-contrast` 规则明确禁用。另行计算的 20 组语义色对比度通过，但不代表所有叠层与组合均通过。

模态居中、焦点循环与 Escape 在真实浏览器验证。全局减少动态效果媒体规则移除动画和过渡；本轮没有切换系统 Reduced Motion / Forced Colors。真实 VoiceOver / NVDA / TalkBack、多浏览器、文本缩放和设备测试列入 Backlog。教学反例不计入推荐实现的无障碍通过数量。

## Tokens 与平台边界

采用 DTCG 兼容支持子集：显式 `$type/$value`、sRGB color 对象、dimension、fontFamily 数组、duration、cubicBezier、完整值别名。检查名称、缺失/循环引用、引用类型、值形状、主题覆盖、必要对比度及生成当前性。`rosemary.tokens.json` 是多主题分发容器；单主题导出为 `light.tokens.json` / `dark.tokens.json`。

Web 保留 CSS alias 与 TypeScript TokenName；Dart/Swift/Kotlin/C# 输出语义值。Kotlin 区分 dp 与 sp，Flutter 使用 ThemeExtension。转换器不支持所有 DTCG 复合类型或平台单位，没有冒充完整标准验证器；阴影由局部 CSS 基于语义颜色派生。Compose/WinUI 生成不代表已编译验证。

五项 Candidate：Data Grid、Tree View、Combo Box、Dropdown Menu、Context Menu。当前原生 table/details/datalist/disclosure 行为可以操作，但没有声称完成 ARIA 复合控件键盘模型。所有其他组件仍为 Beta，详细支持范围在每个组件页开头。

## 可审查产物

- `public/generated/acceptance.json`：网站治理页可下载的汇总记录，包含源码指纹和边界。
- `docs/catalogue.json`：逐案例 / 逐组件实现清单。
- `docs/test-results.json` 与 `docs/web-check.log`：实际自动测试、类型与构建结果。
- `docs/browser-checks.json`：逐页窄屏、人工关键路径及下载核对。
- `docs/native-checks.json`：实际 Flutter / Swift 命令输出。
- `docs/screenshots/`：首页明暗、三个品牌方向的实际浏览器截图。
- `docs/BACKLOG.md`：未验证的平台、复合控件、产品集成、发布与辅助技术工作。

`npm run evidence` 只汇总上述已经保存的证据，不执行浏览器；若源码指纹与工程或浏览器记录不同、动效清单缺少组件或录像缺失则拒绝生成。完整验证顺序见 README。


## 简洁阅读、AI 查阅与原生设计（2026-10-10）

- 简洁规范写入 `CONTENT.md`，依据 Apple HIG 的渐进披露、布局建议及 W3C WAI 的清晰内容建议。短导语、默认十二项目录等为 Rosemary 自己的编辑预算，未当作 Apple/WCAG 的数值要求。错误、风险、当前条件和实现边界保持可见。
- 首页保留用途和任务入口；各栏目删除重复导语；全部 61 项组件与 65 项案例的源码、平台细节等按需展开。使用原生 details/summary，原章节 ID 保留，直接访问与历史返回自动展开目标及祖先。实际浏览器验证 Enter 开关、源码复制及章节恢复；并非删掉专业内容。
- 固定 1280×720、默认未展开时的实际正文 innerText：首页 1,634 → 298 字符（约减少 82%），Button 6,147 → 717（约减少 88%）。该指标只反映默认阅读量，不替代任务可用性或无障碍验收。七页原始测量保存在 `browser-checks.json` 的 clarity 中。
- 组件目录实际浏览器验证默认 12 → 加载 24；完整检索仍找到较后面的 File Browser Row，重置返回 12。全站 139 个真实 URL 再次完成 320px Light/Dark 复查，13 个栏目完成 1280px Dark 复查；额外展开五项组件平台说明和三项案例源码，均无整页水平溢出。
- 搜索图标原先被小屏规则 `.r-header-search span` 连同内容容器隐藏。现在只隐藏文字标签；明暗主题在 320/768/1024/1280 下 SVG 实测 20px、控件至少 44px。Enter 打开搜索，Escape 返回搜索入口。未新增控制台错误/警告。
- AI 页改为真实查阅流程，根部 `publication.json` 预留 repositoryUrl、websiteUrl 和 sourceRef，当前为空且不伪装成有效链接。`AI-INTEGRATION.md` 与 `AGENTS.template.md` 要求读取指南、实际实现和证据，记录固定版本；无法读取时不假装成功。构建生成 `/guide/manifest.json` 与八份 Markdown，HTTP 200、text/markdown，逐份内容与源文件一致。
- 三端设计文件为 `NATIVE-SDK-DESIGN.md`、`native/flutter-sdk.md`、`native/android-compose.md`、`native/ios-swiftui.md`。包括模块、拟定 API、受控状态、平台导航/输入/辅助技术、取消与恢复、分批和发布门槛。机器清单来自同一注册表，完整映射 61 项，三批为 14/22/25；全部 Draft。新库尚未实现/发布，既有 Flutter/Swift 参考验证不被当作完整库验证。
- 当前 `npm run check`：425 项测试、类型、令牌确定性、指南生成和生产构建通过。构建提示主分块略超过 500kB（约 509kB，gzip 154kB），未通过提高阈值隐藏；后续可按真实性能数据拆分。工程和当前浏览器记录使用同一 129 文件源码指纹。
- 截图保存在 `docs/evidence/`：简化后的桌面/手机首页、AI 页、1024px 图标修复、展开源码、三端设计。上一轮动效视频、测量和下载保留原始源码指纹作为历史记录，没有改标成当前阅读迭代的新实测。

当前局限：本机一个 IAB 引擎；未验收 Safari/Firefox、真实触控、读屏或文本缩放。折叠内容的浏览器原生 Find 本轮尚未验证，稳定章节直达和网站查阅入口已验证。原生工程、设备验证和发布属于后续实施阶段。


## 单一选中形态（2026-10-10）

品牌方向卡片已有强调边框与填充，不再叠加底部横线；分类、平台选择、按钮组与分段选择同样遵循这一规则。共享 SelectionGroup 默认不创建线形指示器；仅代码语言切换显式使用一个指示器，并删除重复文字下划线。普通 Tabs 与顶部导航继续使用线形指示器。Tab 使用规则与 MOTION.md 已同步，内容过渡、选中语义和焦点反馈保留。

实际浏览器确认品牌卡片 0 条底线、分段选择 0 条底线、普通 Tabs 1 条指示线；Enter 切换品牌后 aria-pressed 与实际单个面板对应，活动标签显示实际内容。425 项测试、类型、令牌和生产构建通过；139 个页面在 320px Light/Dark、13 个栏目在 1280px Dark 重测，无整页水平溢出，控制台无新增错误/警告。截图：docs/evidence/brand-tabs-single-emphasis-dark.jpg。上一轮简洁阅读测量和截图保留其源指纹，未作为这次的新测量改标。


## 焦点绘制、页脚间距与对齐（2026-10-10）

复现首页展开笔记后左侧焦点轮廓裁切：字段左边界和 details 边界相同，::details-content 的 overflow:clip / overflow-clip-margin:0px 截断外侧轮廓。共享折叠动画保留 8px 绘制边界；支持该能力的 presence 折叠容器也采用相同余量。实际桌面/320px 聚焦截图四边完整；收起稳定后 content-visibility:hidden、opacity:0，无残留内容。

页脚字段采用 r-field 的上下布局，标签至控件实测 8px。品牌、链接/偏好设置、版权分行；桌面链接组与两个选择框底部坐标完全一致（815.4609375），窄屏字段堆叠。实际 Select 键盘打开/Escape 关闭。全站版权改为 © 2026 Rosemary Island LLC。

425 项测试、类型、令牌和构建通过。当前源码 139 个 URL 在320px Light/Dark及13个1280px Dark栏目无整页水平溢出；无新增控制台错误/警告。截图位于 docs/evidence/home-focus-and-footer-{light,dark}.jpg、home-focus-mobile-light.jpg、footer-aligned-desktop-{light,dark}.jpg、footer-fields-mobile-light.jpg。不同历史迭代测量保留原指纹，本记录不是全状态/多引擎认证。


## 独立设计审计与三端 SDK Prototype（2026-10-10）

独立 agent 的发现、基准与复核见 [DESIGN-AUDIT-2026-10-10.md](DESIGN-AUDIT-2026-10-10.md)。A1–A5 已按所列范围修正：Tabs 所有 aria-controls 指向存在的共享面板；Breadcrumb 教学采用真实祖先链接和当前文字；Tokens 默认 12 项、追加到 24，全文检索和清空恢复不丢失全量范围；分段说明不再描述不存在的线形滑动；Button 对 ReactNode 统一保留忙碌空间。图标按钮和手机搜索入口保留既有固定热区，不继承文字按钮的额外内边距。

独立 agent 重跑 6 文件 / 58 项相关测试。根 agent 重新加载最新构建后实际复验 Button 默认/忙碌均为 138px，Tabs 三种选择无失效引用，Breadcrumb 上级实际跳转至组件库，Tokens 12→24→搜索 1→清空 12。320px 页头搜索、主题、导航图标均为 20px，控件均为 44px。源码检查、协助浏览器观察和未覆盖范围在审计报告中分列，不作为全部状态的合规认证。

三端各实现首批 14 个组件，共用生成主题参数，保留原生平台交互与受控状态；源码、独立项目、实际示例和本地下载包已建立。示例覆盖编辑、取消、保存、失败保留、重试及清空确认。其余 47 项仍为 Draft。具体 API、命令和缺口见 native/ 三份文档与 NATIVE-SDK-DESIGN.md。

实际原生执行结果见 native-checks.json：Flutter analyze、11 项控件测试、1 项示例流程测试、iOS Simulator app 和 Android APK 构建通过；SwiftPM 3 项状态测试和 SwiftUI iOS Simulator app 构建通过；Compose AAR、示例 APK、3 项状态单测与 Android 15 模拟器的 4 项 UI 测试通过。SwiftPM 状态测试不等于 iOS UI 测试。XCUITest 已编译，但 iOS 26.5 和 27.0 两次执行均因 DTServiceHubClient / lockdown 服务失败受阻，未计入成功项。未绕过系统保护。

三库当前为 Prototype，betaApproved=false。Beta 尚需真实 VoiceOver/TalkBack、设备覆盖、键盘/系统返回、完整关闭原因、长列表、大字/RTL、生命周期和快速反向验收；Flutter iOS 自适应表单和 SwiftUI 长标题大字布局也保留为明确缺口。没有公共 registry 发布，不能将本地编译成功称为 Beta 验收。

当前 npm run check 通过 428 项 Web 测试、类型、令牌确定性、指南导出和生产构建；主分块约 512.82kB / gzip 153.95kB，仍保留超过 500kB 的构建提示。最新源码 176 文件，指纹 7ecc6c58917dedef38eace523b01578241747db69775921435ed556ebb8035e7；原生记录另以 63 文件的原生范围指纹约束，避免无关网页文案变更伪造原生重验。验收生成会拒绝过期的工程、浏览器或原生范围记录。

当前 139 个实际 URL 完成 320px Light / Dark 布局复查，13 个栏目完成 1280px Dark 复查，均无整页水平溢出。浏览器记录与工程指纹一致；构建期间旧 tab 的一次失效动态资源错误已通过重载恢复，单列历史记录，当前复验无新增错误/警告。旧动效和阅读测量仍保留其历史指纹。

截图：evidence/audit-button-fixed-light.jpg、audit-tokens-batched-light.jpg、audit-breadcrumb-real-light.jpg、sdk-prototype-platforms-light.jpg。生产指南的 Markdown/JSON 内容由独立 agent HTTP 检查；三份源码包有真实文件、SHA-256 和 Prototype 清单。根 agent 已关闭自己的临时浏览器并恢复视口，停止自己启动的 Android QA 模拟器；用户已有设备未关闭。


## SDK 独立审计修复与公开发布（2026-10-10）

本节为前述 Prototype 基线之后的最新结果。独立 SDK 审计 N1–N5 在自动验证与源码覆盖范围内已关闭，详见 NATIVE-SDK-AUDIT-2026-10-10.md。Flutter 15 项控件测试、1 项示例流程、SwiftPM 5 项状态测试、Compose 5 项状态测试和 Android UI 4 项通过；完整 11 项原生检查通过。iOS UI 执行仍受模拟器服务阻塞，三端仍为 Prototype、betaApproved=false。

最新 Web 检查为 429 项，源码指纹 e95d4a4aa62b05695dc227e5ab335230eac679762a218c9e0b4fe5fb204b3c5d（178 文件）；原生范围指纹 e864a980df4be5fb59df4faeec0ea5a9f9e9d5f1ead4e3ad6ff16958488518b5（65 文件）。139 个 URL 的 320px 明暗主题及 13 个桌面栏目完成当前版本布局复查，无整页水平溢出。历史测量保留原来的版本指纹。

仓库地址、国际文档地址和源码标签已写入 publication.json。两个站点已添加到宝塔并部署编译产物，Apache/HTTPS、公开 CDN 与构建文件一致性已验证。独立发布副本安装与工程检查通过；具体发布包校验值和边界见 DEPLOYMENT-2026-10-10.md。
