# Rosemary 网站独立设计审计

日期：2026-10-10。审计对象：现有 Web 网站及其教学组件；原生 SDK 本轮开发不在本报告的产品验收范围。

## 结论与证据边界

当前网站**部分符合自身规范，但不能判为全站、全状态严格符合**。已确认的违例集中在 Tabs 面板关联、面包屑教学实现、Tokens 阅读分批与按钮忙碌状态宽度；另有分段控件说明落后于实现。已有工程检查通过不能抵消这些行为和内容契约问题。

审计由独立 agent 进行规范阅读、源码追踪、真实组件 HTML 渲染和测试重跑。该 agent 的 CUA provider 返回 `browsers: []`，使用 `iab` 和父 agent 提供的实际浏览器 ID `2` 均返回 `Browser is not available`，无法创建独立浏览器 tab。因此以下“浏览器协助观察”由父 agent 按独立审计者给出的复现步骤执行，**不属于独立 agent 的直接浏览器操作**。现有截图审阅也不等于本轮新操作。没有改实现，没有切换操作系统设置。

基准生产源码指纹：`68ad3c05cb78bd8afc6e04b45f4bce56cef183bc90f6836e01bbd92b2db136fd`，129 个文件。独立读取源码指纹、`docs/engineering-checks.json`、生产 `/generated/acceptance.json`，三者一致；HTTP 首页返回 200，资产 `/assets/index-RInk-b8x.js`。后续 SDK 和 Web 修复可能改变源码，以下发现描述**发现时基准**，不能自动作为修复后验收。

严重度：P1 为关键任务/可访问性受阻；P2 为明确的规范或行为契约违例；P3 为局部文档不一致。未实际复现的风险单独列出，不算已确认缺陷。

## 已确认发现

### A1 · P2 · Tabs 的未选中项指向不存在的面板

- URL：`http://127.0.0.1:3101/#/components/tabs?anchor=playground`。
- 规范出处：`src/data/componentRules.ts` 的 `tabs` 规则要求方向键、Home / End 与面板关联一致；`src/data/componentsSpec.ts` 的 Tabs 无障碍规范要求符合 tablist/tab 模型；网站无障碍页“稳健”要求只有实现对应模型才使用 ARIA。
- 源码：`src/components/ui/navigation.tsx:28` 为每项生成不同的 `aria-controls`，但 `:60` 只渲染 `panel-selected` 一个节点。
- 独立证据：真实 `Tabs` 的 `renderToStaticMarkup` 输出 3 个 `aria-controls` 引用、仅 1 个对应面板 ID。并非根据截图推测。
- 浏览器协助观察：320px、Light。依次选择概览、活动、设置，失效引用分别为 `[活动, 设置]`、`[概览, 设置]`、`[概览, 活动]`。可见内容切换正常，不证明辅助技术引用完整。
- 复现：打开预览，对每个 tab 的 `aria-controls` 查询对应元素，再切换选择重复查询。
- 影响：未选中 tab 的结构关联无效，参考源码教给调用方一个不完整的 ARIA 契约。应采用所有 tab 都能解析的稳定关联，并验证每次选择与键盘导航；不能仅调整视觉。
- 发现时状态：未修复。修复后必须重新验证所有引用和 roving Tab 顺序。

### A2 · P2 · 面包屑预览仍教导伪路径与按钮结构

- URL：`http://127.0.0.1:3101/#/components/breadcrumb?anchor=playground`。
- 规范出处：`src/data/componentRules.ts` 的 `breadcrumb` 要求真实层级；`src/data/componentsSpec.ts:961–972` 要求祖先链接、当前页纯文本和 `nav` / `ol`。真实网站面包屑的 `src/components/layout/Breadcrumbs.tsx` 已正确采用普通链接和当前页文字。
- 源码：`src/components/ui/navigation.tsx:111–124` 采用 `nav > span > button`；当前项也可点击。点击只裁短本地 `path` 数组，没有目的地、路由或对应的内容页面。
- 独立证据：真实 `BreadcrumbExample` HTML 含工作区、品牌、标识三个按钮，无 `ol`、无链接；当前标识为 `button[aria-current=page]`。
- 浏览器协助观察：320px、Light，点击品牌后仅路径变成工作区/品牌，URL 仍为 `#/components/breadcrumb?anchor=playground`，当前品牌仍为按钮。
- 复现：从工作区/品牌/标识逐级点击父项，观察 URL、页面内容与元素语义。
- 边界：`implementationNotes.ts:38` 诚实说明“路径只在本地示例中维护”，所以不是全站父导航失效；但 Beta 推荐教学组件仍没有落实它自己的结构与路径规则。
- 建议：演示真实指南页面层级，或提供具备真实路由/内容的局部示例。当前项不应执行操作；祖先使用有效链接和有序列表。
- 发现时状态：未修复。

### A3 · P2 · Tokens 目录未采用规定的分批阅读

- URL：`http://127.0.0.1:3101/#/tokens`。
- 规范出处：`docs/CONTENT.md:9`：“目录先显示一批结果，搜索覆盖完整清单”；`:38` 明确默认十二项目录是 Rosemary 自身编辑预算，而非 Apple / WCAG 数值要求。当前规范未写 Tokens 例外。
- 源码：`src/components/tokens/TokenBrowser.tsx:158` 直接 `filtered.map`；初始层级为 semantic，没有结果批次或加载更多。
- 独立证据：生成令牌总数 169，semantic 数量 69；真实 `TokenBrowser` HTML 默认渲染 69 张卡片、无加载更多，状态显示“69 个令牌 · light”。
- 浏览器协助观察：320px、Light，默认实际卡片数为 69。
- 复现：首次打开 Tokens 默认列表，再切换 all；页面把整批 69 / 169 个参数铺成完整卡片。
- 影响：组件和案例目录已分批，但参数目录仍形成很长的卡片流。无水平溢出与正文降字数不能替代这条阅读规范。
- 建议：分批展示并保留完整检索、全量计数、下载和直接查询。若确实需要连续参数表，先给出明确、可解释的紧凑表格例外；不要把例外隐含在实现里。
- 发现时状态：未修复。

### A4 · P3 · 分段控件实现说明保留已删除的指示器

- URL：`http://127.0.0.1:3101/#/components/segmented-control`，默认可见“当前实现范围”。
- 规范出处：`docs/MOTION.md:39` 与 `componentRules.ts` 要求分段选择采用填充/边框，不叠加底部指示线；`docs/CONTENT.md:29` 要求文案对应真实状态与能力。
- 源码：`src/components/playground/implementationNotes.ts:37` 仍写“共享指示器连续滑动”；实际 `SegmentedExample` 没有线形共享指示器，只有选中填充和内容过渡。
- 复现：对照当前实现范围文字、预览和实际源码。
- 影响：小范围文档漂移，可能让 AI 或 SDK 实现者重新添加刚删除的重复强调。
- 建议：说明单一选中填充与内容过渡；让实现说明和规范保持同一状态。
- 发现时状态：未修复。

### A5 · P2 · Button 加载状态使控件变宽 28px

- URL：`http://127.0.0.1:3101/#/components/button?anchor=playground`。
- 规范出处：`src/data/componentRules.ts:9` 要求“提交时保持宽度并阻止重复请求”；Philosophy 的内容优先、自然交互、细节原则要求状态变化保持清晰位置与连续反馈。
- 源码：`src/components/ui/core.tsx` 只在 loading 时向标签前插入 LoaderCircle；`src/index.css:293` 的 r-button-content 是 inline-flex、gap 8px，未保留正常态宽度或预留加载空间。全局图标规则使该图形实宽 20px。
- 浏览器协助观察：根 agent 在当前生产预览先测默认“保存更改”按钮宽度 **90px**，通过真实 State 下拉选择 Loading 后测得 **118px**，扩大 **28px**。不是以 jsdom 宽度或源码估算冒充测量。
- 复现：打开 Button 预览，保持默认 label/size，记录按钮宽度；State 选择 Loading，再记录同一按钮宽度。
- 影响：加载状态禁用与动作名称保留正确，但宽度改变违反明确的稳定布局要求，产品集成后可能挤动同行控件。
- 建议：实现正常/忙碌状态的稳定几何，同时保留动作文字、busy 语义与实际加载图形；验证短/长标签、不同尺寸和首次即 busy 的状态。
- 发现时状态：未修复。根 agent 将修复共享实现，本报告不在未经复审时关闭该项。

## 尚未证实的风险

**Tooltip 视口边界与裁切**：`core.tsx:310–320` 是就地 span，CSS `index.css:598–619` 为绝对定位、固定方向和 max-width 240px，没有 Select / Popover 那样的视口测量、翻转与钳制。`docs/MOTION.md:41` 将浮层边界描述为 16px。

父 agent 按审计步骤在 320px Light 输入长图标说明“搜索当前工作区中的全部设计文档”，通过键盘 Tab 聚焦演示图标。实际 tooltip 为 left 42、right 246、top 620.046875、bottom 656.4453125，**该路径没有观察到越界或裁切**。不能据源码风险直接判定此页面存在可见缺陷。待继续检查触发器贴近顶部/左右边缘、粘性页头、滚动容器、200% 文字缩放、长未断行文字和对话框内说明。证据截图由协助观察者保存为 `docs/evidence/audit-tooltip-long-320-light.jpg`。

## 复核已有修正

以下结论仅针对所列证据，不外推到所有控件和引擎。

- 首页 note 焦点：独立查看 `home-focus-mobile-dark.jpg`，四侧外轮廓可见，没有用户原截图的左缘裁切。源码 details / Presence 的 clip margin 为 8px，超过该字段 2px 轮廓 + 2px offset。真正聚焦与关闭过程来自 `browser-checks.json.focusSpacing` 的父 agent 观察。
- 页脚：独立查看 `footer-aligned-desktop-light.jpg`、`footer-fields-mobile-light.jpg`；桌面链接与选择框在同一操作行，标签独立并有间距，320px 字段上下排列。版权可见为 `© 2026 Rosemary Island LLC`。记录的标签间距为 8px，桌面三组控件底部为 815.4609375；这些尺寸是协助测量，未由独立 agent 再操作测量。
- 单一选中强调：源码中 Brand / 分类的 SelectionGroup 默认 `indicator=false`，线形 Tabs 保留一个指示器。报告未用一次截图断言所有分段、分类、键盘状态均已正确。
- 导航真实性：网站共享 Breadcrumbs 使用 NAV_ITEMS、注册表、真实 `href` 和当前文字；组件/案例无效详情标题和上级链接存在。A2 专指仍然不一致的教学预览。
- 简洁与重要信息：首页有一个用途句、主要入口、按任务入口与命名折叠；组件预览、实现范围、使用规则、无障碍要求默认可见；平台源码/历史按需展开。没有发现用小字、删除完整规范或隐藏支持边界替代渐进披露的源码证据。A3 是其中未贯彻的目录例外。
- 状态真实性：Candidate、Beta 源码参考、原生 Draft 与未发布范围在页面标明；规范没有声称 WCAG 认证或原生设备验收完成。后续 SDK 升级需再次核对状态文字和实际证据。

## 覆盖与执行证据

独立读取的主要规范/实现：`docs/CONTENT.md`、`docs/MOTION.md`、`componentRules.ts`、`componentsSpec.ts`、`motion.ts`、Philosophy / Brand / Accessibility / Governance / Platforms / Overview、App / Breadcrumbs / Header、Select / Slider / core / navigation / inputs / feedback / overlays / layout / data、DocDisclosure / CodeBlock / SelectionMotion、useDisclosure / usePresence / useScrollbars / useSelectionIndicator、TokenBrowser、组件与案例详情模板、相关测试及生产验收 JSON。

独立运行：

```sh
npx vitest run tests/navigation-select.test.tsx tests/tooltip-scrollbars.test.tsx tests/guide-reading.test.tsx tests/site-accessibility.test.tsx --reporter=default
```

结果：4 个测试文件、52 项测试通过，0 项失败（2026-10-10 10:32 本地时间）。覆盖既有真实路径、共享 Select、tooltip 输入方式/消失、滚动条、章节直达、目录和十三栏目 AA DOM 结构。没有改 `test-results.json` 或实现。

另以 `tsx` + React `renderToStaticMarkup` 独立渲染 BreadcrumbExample、Tabs、TokenBrowser，得到了 A1–A3 的真实结构/数量证据；读生产 HTML 与验收 JSON 返回 200；读取工程结果为 425 通过、0 失败。**425 是读取既有工程记录，52 是本审计独立重跑，不能混写。**

这些 axe 测试明确关闭 color-contrast，且运行在 jsdom。通过结果不证明实际对比度、裁切、触控、焦点视觉或读屏行为；本次新增失效 ARIA 引用也说明原有检查有缺口。

浏览器协助观察范围：320px Light 的 Tabs 三种选择、Breadcrumb 父项点击、Tokens 默认数量、长说明键盘触发，以及 Button 的实际 State 选择与正常/加载宽度对照（该项协助报告未指定视口/主题，不补写假定值）；另外审阅了上述已保存的 320px Dark 首页焦点、1280px Light / 320px Light 页脚截图与实测。独立 agent 没有创建成功的 tab，无自身 tab 或 viewport 可恢复；父 agent 的操作恢复由父 agent 负责。

未验证范围：全 139 个页面的全部展开/聚焦/悬停/错误/忙碌组合，全部 61 组件全部状态，深层页面返回后的真实辅助技术焦点，实际浏览器 Find 对闭合 details 的行为，字体 200% / 400% 放大，真实触屏、VoiceOver / NVDA / TalkBack、Safari / Firefox、Forced Colors、低性能设备、操作系统减少动态效果切换、原生 SDK 新阶段。现有遍历无水平溢出记录保留为历史工程证据，不能升级为这些范围已经验收。

## 修复后复审

父 agent 已收到 A1–A5 与 Tooltip 风险。修复后的源码指纹、测试和实际观察须追加在本节；在追加前，本报告的发现仍是基准状态，未声明关闭。报告完成时，工作区指纹已因并行 SDK 工作变为 `6b5127a47c8ccec20afae8ff3e91b8470110135d5e9801d11b10d897c181b4f9`、131 个文件；这不替换上述生产发现基准，也不代表并行改动已经审计。

### 独立源码与公共分发复核 · 同日 11:01–11:08

按根 agent 的后续指派，仅复核 A1–A5 修复与公共网站的 Prototype 状态，不扩展为三端 SDK 代码审计。仍只有源码/自动测试/HTTP 的独立操作能力，没有成功连接 CUA 浏览器。

| 项目 | 独立复核结果 | 仍需区分的边界 |
|---|---|---|
| A1 Tabs | 所有 tab 现在指向存在的稳定共享 panel ID，panel 的 aria-labelledby 随选中项更新。新增回归检查初始与 End 键之后的所有引用。 | 尚未作实际读屏器复核；不得据此声称全面 APG/辅助技术验收。 |
| A2 Breadcrumb | 实现改成 nav / ol / li、首页与组件库的真实 href、当前 Breadcrumb 非交互文字；实现范围说明同步改为真实页面跳转。 | 真实浏览器父级跳转和历史返回待根 agent 协助复验。 |
| A3 Tokens | 默认 slice 到 12；加载更多到 24；查询/层级/类型更改重置批次，过滤仍在全量 tokenNames 上进行；状态保留全量和当前展示数量。 | 明暗、窄屏和加载更多后的可见布局不能由 jsdom 代替。 |
| A4 分段文案 | 旧“共享指示器连续滑动”改为选中填充与即时内容更新，和实现一致。 | 此文案漂移已由独立源码对照解决。 |
| A5 Button | 第一版只对 string 预留空间，独立真实 HTML 渲染证明 span / fragment 分支仍不覆盖，已反馈根 agent。最终版对任意 ReactNode 使用相同内容容器、绝对定位 spinner 和固定预留空间，保留文字/disabled/aria-busy；原 API 没有改签名。 | 源码稳定几何方案成立；实际宽度、不同标签和窄屏视觉仍待协助观察，不以 class/CSS 检查宣称实际尺寸通过。 |

第二轮独立运行：

```sh
npx vitest run tests/design-audit-regressions.test.tsx tests/navigation-select.test.tsx tests/tooltip-scrollbars.test.tsx tests/guide-reading.test.tsx tests/site-accessibility.test.tsx tests/native-design.test.ts --reporter=default
```

结果：6 个测试文件、58 项通过、0 项失败。11:01 的第一次执行后 Button 非字符串分支继续修改，因此 11:05:45 对最后源码再次执行同一相关测试，58 项再次通过。这是针对实际新改动的重跑；没有写测试结果 JSON 或 SDK 检查记录。

测试名称虽然含“Independent design audit regressions”，测试文件由根 agent 编写；独立性来自本审计 agent 对源码、断言范围和实际执行结果的复核，不能把名称当作外部认证。该文件覆盖 A1–A3；A4 是文案对照，A5 仍须浏览器尺寸验证。

公共状态复核：网站现在明确首批三端各 14 项为 **Prototype**、其余 47 项 **Draft**，Beta 仍须辅助技术和设备验收，未对外发布。Platforms / Governance / 组件平台说明 / AI 接入流程 / README 的旧“三控件、四测试、Compose 未建立工程”文字已更新；componentsSpec 中 61 处“适配源码为 Beta 参考”旧措辞现为 0。独立读取 `native-checks.json` 记录为 Prototype、betaApproved=false、首批 14；11 类检查标记 exitCode 0。这里只审阅公共阶段与机器记录是否一致，没有独立执行这些原生检查或验证全部 14 个 SDK 接口。

复核中另外确认并反馈两处公共文档问题：旧平台能力段落与新 Prototype 数量矛盾；平铺导出的平台 Markdown 仍使用仓库层级链接，导致 `/native-checks.json` 和 `/NATIVE-SDK-DESIGN.md` 返回 200 的 HTML 页面壳。根 agent 已修展示文案，并在导出时重写链接、复制检查 JSON。

独立 HTTP 复验：三份 `/guide/flutter-sdk.md`、`android-compose.md`、`ios-swiftui.md` 实际为 `text/markdown`，链接变成同层 `native-checks.json` / `native-sdk-design.md`；前者返回 `application/json` 并可解析得到 Prototype / false / 14，后者返回真实总设计 Markdown，未用“HTTP 200”代替内容验证。原仓库文档的相对引用仍保持原路径。

上述公共分发复核时工作区指纹为 `36bad38548d1ac38495247c2fcc52d309a04bb41a2a8725f24e54e00d8733bc0`、176 个文件。A1–A5 的后续实际 UI 观察必须另列来源；当前仍保留最初发现，不把源码修正外推为全站所有状态已经验收。

### 根 agent 协助的修复后浏览器观察

根 agent 在**重新加载最新构建后**执行以下实际操作，并将结果发给独立审计 agent。此前旧 tab 仍出现的 90→118px 不能作为新源码的复验结果。本段只归档协助观察，不冒充独立审计 agent 的直接浏览器操作。

- **A1 Tabs**：三项逐个实际切换，所有 `aria-controls` 都能找到目标；面板 `aria-labelledby` 逐项指向当前 tab。
- **A2 Breadcrumb**：预览有 `ol`；祖先链接为 `#/overview`、`#/components`；当前项为 `SPAN`。实际点击“组件库”成功跳转对应页面。
- **A3 Tokens**：默认 12 张；点击“再显示”变 24；查询 `semantic.color.chart-two` 得到 1；清空查询恢复 12。
- **A5 Button**：实际默认/加载宽度均为 **138px**；spinner 的实际 position 为 `absolute`，内容预留 padding 为 24px。原默认标签 90→118px 的宽度跳变在该复验路径已消除。
- 当前重载实测截图：`docs/evidence/audit-button-fixed-light.jpg`、`docs/evidence/audit-tokens-batched-light.jpg`，由根 agent 保存。本段未补写未提供的视口数值。

结合独立源码/58 项相关测试与上述协助操作，A1–A5 **在明确列出的复验范围内已解决**；A4 为独立文案对照，其他项有实际协助观察。所有修复前证据继续保留作为发现历史。Button 长标签/不同尺寸/混合 children 的实际视觉、浏览器历史返回、真实读屏器、所有页面与控件的全部状态组合不因这些有限路径自动通过。根 agent 另行执行的 320px Light / Dark 整页溢出复查也只证明所测布局范围，不能提升为全状态或全面设计合规。
