# 原生 SDK 全量 Beta 验收矩阵 · 2026-10-10

本报告是独立 agent 对 **61 组件 × Flutter / Compose / SwiftUI = 183 个平台实现条目** 的验收准备。它没有提高成熟度，没有修改设计门槛、实现、正式测试、工程凭证，也没有操作服务器。

## 当前事实与基准

本轮只读基准 `nativeFingerprint=e864a980df4be5fb59df4faeec0ea5a9f9e9d5f1ead4e3ad6ff16958488518b5`，65 个原生范围文件。`src/data/nativeLibraries.ts` 与 `public/guide/native-component-plan.json` 一致：61 个 ID，首批 14 项均为 Prototype，其余 47 项均为 Draft，`betaApproved=false`。公开源码逐端确认首批14项（Alert Dialog 是公开函数/extension，不以类型数量代替组件数）；没有发现其余47项的公开原生实现。此基准之后的新实现须另行审计，不把本报告当作其通过凭证。

已读取规划、三端平台文档、此前独立审计、生成计划、native-checks.json、14项源码与测试、sample和工程最低版本。前轮五项缺陷已经独立自动复核关闭，见 `NATIVE-SDK-AUDIT-2026-10-10.md`。最新工程记录11检查通过，Flutter15+sample1、Swift macOS5、Compose单测5及Android emulator控件测试4；这是14项的有限覆盖，不是61项覆盖率，也不含真实人工读屏。iOS UI执行仍明确 blocked。

本轮命令仅用于读源码、枚举公开接口、读取JSON、计算指纹与检查本地SwiftUI SDK可用性；没有重跑新实现测试。因此下文所有“自动专项”“人工专项”均为**待验收要求**，不是已通过结果。

## 全部条目共用的验收基线

**A0：每个组件都执行**（纯展示组件按适用性明确标NA，不能自动省略）。模块与示例实际编译、公开接口可调用；生成token一致；实际渲染/交互断言而非只检查名字存在。明暗、窄屏/宽屏、2×文字及平台最大可访问字号、长中英文/长词、LTR/RTL；正常/hover/focus/press/disabled/busy/error/empty等适用状态；受控值拒绝修改；动作单次执行；名称/角色/值/状态/顺序/热区的语义树；键盘/触控；系统与应用减少动态效果共同生效、反向中断与隐藏/后台暂停。组件identity和列表重排不串状态；需要async时提交快照/操作句柄/迟到结果隔离；临时草稿取消不提交。

**M0：每个组件都需要真实辅助技术复核**。Flutter Android+TalkBack、Flutter iOS+VoiceOver、Compose Android+TalkBack、SwiftUI iOS+VoiceOver，四个宿主路径不能互相代替。非交互组件也验证朗读顺序、装饰内容是否隐藏、状态不纯靠颜色。记录设备/OS/屏幕阅读器版本/源码指纹、步骤、实际读出或录像/音频/观察记录、pass/fail；自动 semantics 或label存在不证明人能完成任务。

**D0：真实设备/宿主条件**。至少实际Android设备与iPhone（SwiftUI/Flutter分别检查），包含大字、横竖/安全区域、软键盘与硬件键盘/指针适用场景、系统返回/手势、背景恢复和系统重建；文件/自动填充/输入法/系统picker必须调用真实系统能力。模拟器可覆盖部分，但不得登记为真机；平台最低版本声明要有兼容编译与运行范围记录。iPad/宽屏侧栏、二维数据和split适配应另有设备覆盖，不能拿iPhone列表包装声称大屏网格功能已验收。

**证据边界**：自动断言能证明特定输入和观测结果；真实读屏能证明该设备/流程的可操作性；编译只证明可编译；单测纯状态模型不能证明样例使用同一契约。失败/blocked/未执行均不计pass。不以三端最低完成度或共同状态字符串覆盖不同平台的结果。

## 61项矩阵

状态按 Flutter / Compose / SwiftUI 顺序；P=Prototype已有实现，D=Draft未有公开实现。每一行均须 A0、M0、D0，以下是额外专项。平台列是当前规划的宿主建议，**不表示已实现**；包含“later/separate design”的条目尤其不能直接批准Beta。

| # / 组件 ID | 当前 F/C/S | 平台映射建议：Flutter；Compose；SwiftUI | 自动专项（待执行） | 人工专项（待执行） |
|---|---|---|---|---|
| 01 `button` (Button) | P/P/P | FilledButton / CupertinoButton；Material 3 Button；Button / ButtonStyle | enabled/busy分别阻止重复动作，异步快照/错误重试，busy几何和名称不变 | 读出动作/忙碌/禁用；长标题折行后可点击 |
| 02 `icon-button` (Icon Button) | P/P/P | IconButton / CupertinoButton；IconButton；Button + accessibilityLabel | tooltip/hint与图标分开，名称不丢，44/48热区，busy禁用 | 无视觉图标也能辨认动作；触摸、键盘和指针帮助 |
| 03 `button-group` (Button Group) | D/D/D | Row / Wrap of actions；Row / FlowRow of actions；HStack of Buttons | 稳定顺序/身份，长标签Wrap，大字不重叠，独立禁用 | 组内遍历有顺序，每个动作只有一个热区 |
| 04 `split-button` (Split Button) | D/D/D | Button + MenuAnchor；Button + DropdownMenu；Button + Menu | 主动作与菜单动作分别回调；菜单取消不执行主动作 | 两独立目标能辨认，打开菜单/返回焦点正确 |
| 05 `link-button` (Link Button) | D/D/D | Link action with route callback；TextButton with navigation callback；NavigationLink / Link | 真实RouteID/URL、禁用、不重复push；深链接与返回 | 读出导航意图；系统外链跳转后可回到应用 |
| 06 `floating-action-button` (Floating Action Button) | D/D/D | FloatingActionButton; iOS toolbar action；FloatingActionButton；Toolbar primary action | 主要动作真实执行；避让safe-area/IME/底栏；禁用与busy | 单手触摸及读屏可达；iOS采用真实toolbar主要动作 |
| 07 `text-field` (Text Field) | P/P/P | TextField / CupertinoTextField；TextField + TextFieldState adapter；TextField + Binding | 受控文字/selection/composition；错误关联；焦点圆角稳定；自动填充策略 | 中日韩IME、复制粘贴、选区、键盘关闭、错误读出 |
| 08 `text-area` (Text Area) | P/P/P | Multiline TextField；Multiline TextField；TextEditor | 多行回车、受控全文/选区；错误与标签；动态高度/内外滚动 | 大段输入、语音输入、光标滚入视野、读屏逐段 |
| 09 `password-field` (Password Field) | D/D/D | Obscured TextField；Secure text field；SecureField | obscure默认、显隐不丢选区、日志/语义不泄露明文、禁用 | 密码自动填充、secure键盘、显隐按钮名称、读屏隐私 |
| 10 `search-field` (Search Field) | D/D/D | SearchBar / CupertinoSearchTextField；SearchBar；searchable / TextField | 输入/清空/提交分别回调；请求句柄防旧结果；空和错误恢复 | IME搜索键；清空后焦点保留；结果状态正确播报 |
| 11 `number-field` (Number Field) | D/D/D | TextField + step actions；TextField + step actions；TextField + Stepper | 本地化解析、部分输入草稿、min/max/step/精度、空值与取消 | 小数/负号键盘，增减动作可读，地区格式不误导 |
| 12 `checkbox` (Checkbox) | P/P/P | Checkbox; iOS checkmark choice row；TriStateCheckbox；Checkmark choice Button / List selection | 受控true/false/mixed、disabled、单一选择热区 | 读出已选/未选/混合；iOS选择行而非伪系统checkbox |
| 13 `radio` (Radio Button) | D/D/D | RadioGroup; iOS single-choice list；RadioButton + selectableGroup；Picker single selection | group单选、未知/无选择值、禁用项跳过、键盘循环 | 组名和当前选择；iOS单选Picker/List正常 |
| 14 `switch` (Switch) | P/P/P | Switch.adaptive；Switch；Toggle | 受控拒绝修改保持原值、禁用、值语义 | 状态读出及单一热区；触摸/系统读屏切换 |
| 15 `slider` (Slider) | P/P/P | Slider / CupertinoSlider；Slider；Slider | 范围/步进、受控拒绝、drag-end与取消；小数值formatter | 读屏增减、按键步进、大字/RTL；拖动与点击反馈 |
| 16 `select` (Select) | P/P/P | MenuAnchor / adaptive picker sheet；ExposedDropdownMenuBox / selection sheet；Picker / Menu; long-list sheet | 未知值占位不改值；禁用/空；短Menu/长搜索sheet；选择草稿取消 | 上下文名称/当前值/选中项；外部关闭与长列表搜索 |
| 17 `combo-box` (Combo Box) | D/D/D | Autocomplete；TextField + suggestions；TextField + suggestions | IME输入+过滤、稳定选项ID、清空/无匹配、选中/未提交分离；单选/多tag | 组合输入提示/结果数/高亮可辨；取消不意外提交 |
| 18 `date-picker` (Date Picker) | D/D/D | showDatePicker / CupertinoDatePicker；DatePickerDialog；DatePicker | 日期无隐式时区偏移，min/max、无效/禁用日期、取消保留值 | 不同地区日历/日期顺序、系统日期Picker、读屏日期 |
| 19 `time-picker` (Time Picker) | D/D/D | showTimePicker / CupertinoDatePicker；TimePickerDialog；DatePicker hourAndMinute | 时间与日期分离、24/12h、区间/步进、DST策略、取消 | 地区12/24h、AM/PM、系统Picker读屏/硬件键盘 |
| 20 `file-upload` (File Upload) | D/D/D | Host document picker adapter；Activity Result document picker；fileImporter | native picker真实接入；取消/格式/大小/多选；权限/失败/重试；任务句柄 | 真实Files/Android provider、权限拒绝/云文件未下载/后台返回 |
| 21 `color-picker` (Color Picker) | D/D/D | Accessible color choices；Accessible color choices；ColorPicker | 受控颜色、alpha、值格式、无效值/取消；色名和数值独立 | 读屏能按名字/数值选择，色觉缺陷无需辨色操作 |
| 22 `tabs` (Tabs) | P/P/P | TabBar / adaptive section selector；PrimaryTabRow；Section selector + one content panel | value受控/拒绝、稳定panel状态、隐藏Ticker停用、reduced/反向 | tab名/选中/关联内容；长标签替代布局；切页焦点 |
| 23 `segmented-control` (Segmented Control) | D/D/D | SegmentedButton / CupertinoSegmentedControl；SingleChoiceSegmentedButtonRow；Picker segmented style | 单选/禁用/未知值，填充状态和受控一致，长标签变换布局 | 当前选择读出；Dynamic Type下完整标签可选 |
| 24 `breadcrumb` (Breadcrumb) | D/D/D | Wide-layout path links；Wide-layout path links；Wide-layout NavigationLink path | 路径各级真实可达、当前项不可点；长路径折叠有效 | 宽屏路径与系统返回一致；紧凑布局无伪父级 |
| 25 `sidebar` (Sidebar) | D/D/D | NavigationRail / split layout；NavigationRail / permanent drawer；NavigationSplitView | 受控destination ID、窄/宽折叠、路线恢复、重复点击不重复push | 横竖/大屏导航、读屏当前项、系统返回/手势 |
| 26 `top-navigation` (Top Navigation) | D/D/D | AppBar / CupertinoNavigationBar；TopAppBar；NavigationStack toolbar | title/action/back真实回调；safe-area/IME；真实back-stack | 导航标题/返回目的地、大字标题不压住操作 |
| 27 `bottom-navigation` (Bottom Navigation) | D/D/D | NavigationBar / CupertinoTabBar；NavigationBar；TabView | 受控destination、各tab独立状态/栈；safe-area；深链接 | 真实平台tab/底栏，选中项读出与系统back一致 |
| 28 `pagination` (Pagination) | D/D/D | Page action group；Page action group；Page action group | 边界/total=0/current越界、受控跳转、加载锁定；页变通知 | 前后页/当前页/页总数读出，回到合法内容焦点 |
| 29 `stepper` (Stepper) | D/D/D | Step selection + controlled content；Step selection + controlled content；Step selection + controlled content | 受控step、校验阻止下一步、前后草稿保留、提交/取消分离 | 当前第几步/错误/下一步读出；大字及返回 |
| 30 `command-palette` (Command Palette) | D/D/D | Shortcuts / Actions + search overlay；Keyboard commands + search overlay；Search sheet; macOS commands later | 真实命令集/路由、检索、禁用/组标题、键盘选中/执行/取消 | 输入焦点/结果播报、Escape/返回恢复、触屏与硬件快捷键 |
| 31 `table` (Table) | D/D/D | DataTable; compact list on narrow widths；Lazy layout / compact list；List; wide table adapter later | 稳定row/column IDs、排序、数字对齐、空/加载；紧凑列表保留列名 | 每个值有表头上下文；横滚/排序/选行不丢焦点 |
| 32 `data-grid` (Data Grid) | D/D/D | Virtual data surface: separate design；Virtual data surface: separate design；Virtual data surface: separate design | 虚拟窗口、冻结列、列宽约束、多列过滤、row选择、cell编辑/提交/取消；焦点身份保持 | 读屏可达离屏cell/表头、二维键盘导航、虚拟滚动/冻结交界、编辑IME |
| 33 `list` (List) | D/D/D | ListView + stable item keys；LazyColumn + stable keys；List + stable identity | 稳定key、插删/重排后选择焦点不串项；虚拟滚动；row与辅助动作分开 | 读屏连续遍历懒加载，单行多动作不会互相抢焦点 |
| 34 `description-list` (Description List) | D/D/D | Label-value layout；Label-value layout；LabeledContent | label/value关联、长值折行、未知/空值、复制独立动作 | 读屏同组读出含义和值，大字多列转单列 |
| 35 `tree-view` (Tree View) | D/D/D | Hierarchical disclosure + focus model；Hierarchical lazy list + focus model；OutlineGroup / DisclosureGroup | 稳定node ID、parent/child、受控expanded/selected；箭头展开/祖先收起焦点归位 | 层级/子项数/展开态读出；懒加载树连续遍历 |
| 36 `badge` (Badge) | D/D/D | Badge / semantic status；Badge；Text status badge | 数量/99+阈值、空/非数状态、语义不重复宿主名称 | 颜色之外的数量/状态，更新不过度播报 |
| 37 `tag` (Tag) | D/D/D | Chip / input choice；FilterChip / InputChip；Label / choice Button | 静态/可选/可移除各角色；单独删除动作；移除后的邻近焦点 | 正文/选择/删除可辨，RTL/大字折行保持顺序 |
| 38 `avatar` (Avatar) | D/D/D | Image + fallback semantics；Image + fallback semantics；Image + fallback semantics | 真实图像/载入失败/initials fallback；装饰 vs 人物名称语义 | 人物可辨；装饰头像不重复播报；对比度 |
| 39 `dialog` (Dialog) | P/P/P | showAdaptiveDialog；AlertDialog / Dialog；sheet for form; native alert for message | 五关闭原因、会话ID、确认禁用/校验、焦点恢复、快速关/重开 | 模态隔离、返回/滑动关闭、IME、长表单、读屏焦点落点 |
| 40 `alert-dialog` (Alert Dialog) | P/P/P | Adaptive alert；AlertDialog；alert / confirmationDialog | 取消不执行危险动作、单次确认；原因/焦点恢复；危险文案可配置 | 原生明确确认、动作角色和取消路径读出 |
| 41 `sheet` (Sheet / Drawer) | D/D/D | showModalBottomSheet / adaptive sheet；ModalBottomSheet；sheet + presentationDetents | 受控open/草稿、detents/drag关闭原因、session隔离/焦点恢复 | 系统sheet手势、键盘safe-area、模态读屏/返回 |
| 42 `toast` (Toast) | D/D/D | Nonmodal status overlay；Nonmodal status overlay；Nonmodal status overlay | 非模态、队列/去重、定时取消/替换、reduced；可读时长 | 不抢焦点；状态播报可听完；不承载唯一恢复动作 |
| 43 `snackbar` (Snackbar) | D/D/D | ScaffoldMessenger + stable recovery；SnackbarHost + stable recovery；Status with persistent Undo action | 可恢复操作有稳定ID；超时/Undo/新消息替换不串任务 | 读屏能发现并执行Undo；必要动作有持久备份 |
| 44 `banner` (Banner) | D/D/D | MaterialBanner / inline notice；Inline notice；Inline notice | 内联通知状态/级别、close/真实修复动作、禁用/繁忙 | 标题/风险/恢复动作可达；不是仅靠颜色表达 |
| 45 `progress` (Progress Indicator) | P/P/P | LinearProgressIndicator；LinearProgressIndicator；Determinate ProgressView | 有限0..1/精度formatter、进度语义、reduced、完成/失败 | 读出任务和百分比，更新频率不过度打断 |
| 46 `skeleton` (Skeleton) | D/D/D | Static placeholder；Static placeholder；redacted placeholder | 占位不进入可操作语义、不遮真实错误、稳定布局/reduced | 加载状态可理解，读屏不遍历虚假内容 |
| 47 `spinner` (Spinner) | P/P/P | CircularProgressIndicator / CupertinoActivityIndicator；CircularProgressIndicator；Indeterminate ProgressView | 系统+应用reduced、后台/隐藏Ticker停用、busy名称保留 | 持续等待读出一次；不会只靠旋转说明加载 |
| 48 `tooltip` (Tooltip) | D/D/D | Tooltip for pointer; keyboard help；TooltipBox for pointer/keyboard；help on pointer platforms; accessible hint | 指针移出/Escape/blur关闭；hover与键盘focus区分；边界定位 | 触摸长按/键盘help可达，不遮必要操作，不凭初始focus无端出现 |
| 49 `popover` (Popover) | D/D/D | MenuAnchor / adaptive overlay；Popup / adaptive sheet；popover / adaptive sheet | 锚点+viewport/IME定位、flip/滚动、native顶层；会话/取消/焦点 | 手机adaptive sheet，键盘和读屏模态策略一致 |
| 50 `dropdown-menu` (Dropdown Menu) | D/D/D | MenuAnchor；DropdownMenu；Menu | 真实actions、disabled、组/checked、按键/typeahead、取消不执行 | 菜单项角色/勾选/禁用读出，返回触发控件 |
| 51 `context-menu` (Context Menu) | D/D/D | Context actions / MenuAnchor；Context actions；contextMenu | long press/secondary click、独立显式备用入口、动作真实执行 | 触屏与读屏custom actions可用，不需发现隐蔽手势 |
| 52 `drawer` (Drawer) | D/D/D | Wide side panel / narrow sheet；ModalNavigationDrawer / side panel；NavigationSplitView / sheet | 窄modal/宽persistent切换、受控open、返回/外部关闭、焦点恢复 | 导航抽屉/内容抽屉角色明确，系统返回不跳错页 |
| 53 `card` (Card) | D/D/D | Card / quiet grouped surface；Card；Grouped content surface | 展示card不自造点击；可点击card/子动作不嵌套冲突；长内容 | 读屏分组与独立操作；大字内容可读 |
| 54 `accordion` (Accordion) | D/D/D | ExpansionTile / native disclosure；Expandable content + semantics；DisclosureGroup | 受控expanded、展开state保留、隐藏focus/ticker停用、反向中断 | 展开/收起/内容顺序；当前焦点所在内容收起后落标题 |
| 55 `divider` (Divider) | D/D/D | Divider；HorizontalDivider / VerticalDivider；Divider | 方向/厚度token、布局不吞空隙；装饰无焦点 | 通常不被读屏当作操作；高对比下分组仍可辨 |
| 56 `empty-state` (Empty State) | P/P/P | Text + optional real action；Text + optional real action；ContentUnavailableView / compatible content | 真实空/失败/过滤无结果分类；可选真实恢复动作；标题语义 | 状态与下一步简单明白；大字可操作 |
| 57 `scroll-area` (Scroll Area) | D/D/D | ScrollView + Scrollbar with controller；Native scroll state + platform indicators；ScrollView; system indicators | host scroll-state、scroll-to边界、嵌套手势、恢复offset、列表identity | 平台滚动指示/读屏滚动动作；触摸/键盘/trackpad |
| 58 `resizable-panels` (Resizable Panels) | D/D/D | Wide-layout split adapter；Wide-layout split adapter；Wide split adapter; macOS later | 受控ratio/min/max、drag直接跟随、keyboard调整、restore；窄屏alternative | 读屏调节分隔条、数值/方向；触摸与鼠标热区，大字不挤压 |
| 59 `metric-card` (Metric Card) | D/D/D | Value + meaning; no animated counts；Value + meaning；Value + meaning | value/unit/comparison/趋势/阈值文字一致、NaN/无数据；sparkline数据摘要 | 趋势的方向/量/基准读出，图表不依赖颜色或动画计数 |
| 60 `prober-status` (Prober Status Indicator) | D/D/D | Semantic status + optional recovery；Semantic status + optional recovery；Semantic status + optional recovery | healthy/degraded/down/unknown、glyph+文字、latency/timestamp与过期态；retry真实 | 状态、最近检测和恢复可理解；更新频率不连续打断 |
| 61 `file-row` (File Browser Row) | D/D/D | Selectable row + host actions；Selectable lazy row + host actions；List row + swipeActions / contextMenu | stablefile ID、选择与打开分别回调、同步态/大小/菜单；异步删除/重排焦点 | 文件名/大小/同步读出；长文件名、读屏备用动作/键盘Space |

## 平台落地必须解决的适配问题

### Flutter

既有包最低 Flutter3.44/Dart3.12、示例Android26/iOS15。新增47项须导出真实公开实现，并在样例中可操作，避免调用控件永远展示静态文本。Material/Cupertino策略按目标平台解释；Slider/Switch/Dialog有限adaptive不覆盖所有表单。用controller保留文字/选区/IME；selection/autocomplete要区分输入草稿和已提交值。列表/树/grid使用稳定key与真实虚拟内容；每个节点/cell有意义语义，不把Web ARIA名称当Flutter role。原生文件选择若用注入宿主adapter，必须有真实Android/iOS接入示例和系统结果测试；只传VoidCallback而样例不打开系统Picker不是File Upload完成。

本轮首批修复为controlled Tabs建立motion policy并对隐藏panel停Ticker。新增Accordion/Drawer/Sheet等也需要同样的状态保留、隐藏焦点/动画与快速反向契约，不能把已有14测试当47组件的回归。

### Android Compose

当前min26/compile36、BOM2025.10.00、Kotlin2.2.20、AGP8.13.2；必须用锁定依赖实际编译新API。TextFieldState/TextFieldValue策略要允许宿主保存选区/组合输入，String便利重载可保留；不声称String常规输入必坏，也不据此省略IME实测。

交互组应共享原生选择语义，custom组件有明确角色/值/动作；复杂集合提供真实collectionInfo/collectionItemInfo与稳定键；需要时用customActions暴露长按/拖拽等动作的可访问替代。不要把数字符号当菜单图形却不校验其可读语义。Dialog/Sheet/Drawer区分用户取消、外部、返回和程序关闭；原生API若合并回调，host adapter负责可实现的原因模型并准确注明可观测能力，不能凭猜测给事件贴原因。

系统文件接入使用已有Activity宿主真实document picker，并检查取消、Uri访问、后台回来和持久授权范围；native返回/手势要走实际back-stack，别给导航组件假onClick演示。Android emulator四控件测试不代替新的61控件设备矩阵。

### SwiftUI / iOS

SwiftPM仍声明iOS15/macOS12。本机Xcode27 SwiftUI公开swiftinterface直接确认：NavigationStack、NavigationSplitView、LabeledContent与presentationDetents要求iOS16/macOS13；ContentUnavailableView要求iOS17/macOS14；Table在iOS要求16（macOS12）。因此计划里的新系统能力要有availability分支与**真实兼容行为**，或明确另作最低版本决策；此报告不授权默默抬最低版本。当前iOS15声明不得由只在iOS27编译的新样例掩盖。局部声明支持更高OS的API时，也不能把低版本缺失的那个条目计作整个SDK全版本Beta。

核验依据文件：`[Xcode developer directory]/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk/System/Library/Frameworks/SwiftUI.framework/Modules/SwiftUI.swiftmodule/arm64-apple-ios-simulator.swiftinterface`，NavigationStack约19182行、NavigationSplitView26969、LabeledContent5016、presentationDetents28178、ContentUnavailableView22637。

Tabs与Segmented Control不必使用同一种视觉。大字长标签超出segmented适用范围时有可操作替代布局，受控值和内容关联仍成立。iOS多选使用选择行/List selection，不宣称通用系统checkbox。导航回退/标题/工具栏采用真正导航栈；触控Context Menu有显式可访问备用操作；Tooltip在触摸设备不能只依赖hover。Toast/Snackbar应避免自造系统toast强行抢焦点，Undo不能是瞬时唯一入口。fileImporter要用系统URL访问范围，不能拿文件名假上传。

Swift package macOS单测只验证模型；新SwiftUI UI、Dynamic Type、VoiceOver和sheet交互需要成功iOS执行。此前Xcode lockdown服务阻塞需要真实解决，blocked持续不得转pass；本报告未尝试修复宿主服务或绕过系统保护。

## 高风险条目的明确功能契约

- **Data Grid**：规划三端现在均写“Virtual data surface: separate design”。需要先定稳定row/column/cell IDs、过滤/排序/多选/编辑草稿、冻结与可变列宽、虚拟窗口焦点模型；行卡片列表如果没有这些行为，不能以适配之名当作Data Grid Beta。手机可采用紧凑细节/编辑页面，但数据动作与取消恢复必须完整，宽屏仍需真实二维实现。
- **Tree**：不只是把List缩进；需parent关系、展开/选中受控、按键/读屏层级、懒加载、折叠焦点、稳定身份。隐藏节点不能保留可操作焦点或继续等待动画。
- **Combo Box / Select**：搜索输入、临时高亮、已提交值分别建模；长列表搜索、disabled、empty、IME、取消/确认、多tag变体及异步结果隔离真实可用。普通Select改名Autocomplete不是实现。
- **Table / Resizable Panels**：目前Swift映射含“wide table adapter later / macOS later”；如果保留该延后，当前条目只能维持有限scope阶段，不能无证据计全量Beta。宽/窄转换既保持完整数据可读也保持真实操作；分栏有键盘和辅助技术调节，不只pointer拖动。
- **Command Palette / Context Menu / File Row**：快捷键或长按必须有触控/辅助技术替代，不仅可视演示。命令、打开文件、选择、删除/恢复、同步状态应连真实host callback/result，不使用空lambda装成功。
- **File Upload / Date / Time / Password**：宿主系统行为本身是契约的一部分；假picker、本地静态日期、不实际访问file、密码语义明文/无IME策略都会阻断对应条目Beta。

## 证据矩阵建议（只定义格式，未写任何pass）

每条结果至少记录 `componentId + platform + hostOS + sourceFingerprint + scenarioId + evidenceType + command/device + observedResult + status + limitation`。实现阶段、自动检查与人工审定分开：例如 `implemented=true`、`automated=passed`、`manual=not_run`、`betaApproved=false`，不能只留一个Beta枚举。

结果状态可用 passed/failed/blocked/not_run/not_applicable；NA必须说明这个组件为何无该行为，不能拿NA免除整个宿主辅助技术。61个条目×3库需各有对应公开API和样例；Flutter再分Android/iOS host，人工矩阵实际为61×4路径，静态展示条目仍需遍历验证。

建议真实工作流将组件组合验证而非逐个demo：

1. 项目表单：输入/密码/数字/日期时间/文件/颜色/选择 → 校验 → 保存失败 → 重试 → 关闭/返回 → 恢复。
2. 文件管理：Tree/导航/搜索/命令 → Table/Grid/List/选择 → context动作 → 删除确认 → Undo → 插删/过滤/后台回来；目标/焦点身份稳定。
3. 控制台：指标/探针/进度/加载/错误/空状态 → 重试 → 状态更新；通知不抢焦点，图文含义一致。
4. 布局与浮层：窄/宽侧栏/分栏/底栏 → Sheet/Dialog/Popover/Menu/Tooltip → IME/系统返回/快速反向/关闭再开；关闭原因与合法焦点恢复可追踪。

自动可用Flutter widget/integration、Compose unit/UI instrumentation、Swift状态单测+成功执行XCUITest；适用的语义/热区与截图检查也纳入。上述工具并不替代人工VoiceOver/TalkBack、真实IME/文件提供者/系统导航和真机手势体验。

## 当前未验收清单

- 47新增组件×3端尚无公开实现证据；本报告不据此将它们标Prototype或Beta。
- 首批14仍有完整关闭原因/焦点恢复、长列表、Cupertino、大字长标题、后台/恢复和设备矩阵缺口。
- 四宿主路径人工辅助技术未执行。
- iOS UI执行blocked；macOS单测不补此缺口。
- 表中的全部61项专项要求尚待按新增实现执行及独立复验。

可立即推进设计/实现/自动回归；每个平台逐条积累通过证据。只有实际满足现有门槛后才能改该条目的Beta状态，不以赶齐61个名称降低规范。

## 官方依据

- [Flutter assistive technologies](https://docs.flutter.dev/ui/accessibility/assistive-technologies) 与 [accessibility testing](https://docs.flutter.dev/ui/accessibility/accessibility-testing)：实际TalkBack/VoiceOver检查与自动guideline是不同证据。
- [Android Compose semantics](https://developer.android.com/develop/ui/compose/accessibility/semantics) 与 [traversal order](https://developer.android.com/develop/ui/compose/accessibility/traversal)：角色/集合/替代动作与真实遍历语义；不把DOM角色直接搬到原生。
- [Apple fileImporter](https://developer.apple.com/documentation/swiftui/view/fileimporter(isPresented:allowedContentTypes:onCompletion:))：系统文件结果和security-scoped访问是接入的一部分。
- [Apple NavigationSplitView](https://developer.apple.com/documentation/swiftui/navigationsplitview)：窄布局会适配为栈；实际availability以本机SDK接口及目标工程为准。

矩阵的组件范围来自Rosemary自己的61项规范；平台来源只校准实现方法与验证边界，不代表官方批准本SDK。


## 新增 47 项首次独立实现审计

审计日期：2026-10-10。本节保留前文没有扩展实现时的历史基准；下面审查的是后续新增的真实源码，不将名称覆盖率当作 Beta。实现并行更新中，本文行号对应以下不可变临时快照，不能当作后续修复版本的行号。

快照：`[local-audit-snapshot]`。三份扩展源码 SHA-256：

| 源码 | SHA-256 |
|---|---|
| Flutter `lib/src/extended.dart` | `60b8aeabe7d39ca577d547fd4c7f2a8ddfb98481bb0f5887b012db32eb0f89fc` |
| Compose `RosemaryExtended.kt` | `34161bcfb76ab45d35b2ff5deb117beb4d7eac66d06cabca2bbe7c59ecbba3ac` |
| SwiftUI `RosemaryExtended.swift` | `d885b79374dd76650728d233f3c4193adbfb152d57f632f85f1cdb402400207e` |

本节 `F` 指 `platforms/flutter/lib/src/extended.dart`，`A` 指 `platforms/android/rosemary-compose/src/main/java/design/rosemary/compose/RosemaryExtended.kt`，`S` 指 `platforms/swiftui/Sources/RosemaryUI/RosemaryExtended.swift`；`Spec` 指 `src/data/componentsSpec.ts`；`Native` 指 `docs/NATIVE-SDK-DESIGN.md`。

### 验证范围与真实结果

所有编译和复现均在上述临时副本，不修改共享实现、正式测试、阶段或 `native-checks.json`。

- Flutter 离线依赖解析与 `flutter analyze` 通过。
- Compose 离线 `:rosemary-compose:testDebugUnitTest` 通过，含扩展源码编译和 5 个既有状态测试。工具链提示 Tooltip positioning API 弃用，这不是本轮阻断。
- SwiftPM macOS `swift test` 通过，含扩展源码编译与 5 个既有状态测试。
- 以本机 iOS simulator SDK、`arm64-apple-ios15.0-simulator` 编译完整 `RosemaryUI` 模块通过；这证明该目标的 API 可编译，不证明最低系统设备/UI 行为。
- 独立 Flutter `extended_boundary_test.dart` 有 5 个失败断言，其中 4 个是下面的必须修复缺陷，1 个是 Accordion 内部未受控子状态观察，明确不计为独立阻断。
- 独立 Flutter `date_disable_test.dart` 的确认后禁用断言失败：旧回调触发 1 次。
- 独立 Java `DateAudit.java` 精确重放 Compose 的 formatter，在洛杉矶时区把 2026-10-10 UTC 日历选择显示为 2026年10月9日。
- 无连接的 Android 设备；未执行新增 47 项 Compose instrumentation、SwiftUI XCUITest、真机、TalkBack 或 VoiceOver。不得把以上编译/单测替代人工门槛。

### 已复现的必须修复缺陷

| 编号 | 优先级、位置 | 复现与影响 | 当前规范依据及建议 |
|---|---|---|---|
| E01 | P2，F:752 / A:93 | Flutter 320px 宽度、有 `onSort` 的 Table 变为描述卡片，实际可交互部件为 0；Compose 窄分支源码也丢弃排序。宽屏可排序，手机失去同一业务能力。SwiftUI 在卡片之前保留排序动作。 | Spec:1232-1245 的列排序；Native:7/17 的平台适配与交互职责。保留独立排序控件或等效菜单，不能仅展示排序结果。 |
| E02 | P2，F:259-287 | 输入“团”并请求选择“团队”，宿主不接受该请求，Autocomplete 自己已把文字变为“团队”；接口无受控 query/selection 或 disabled。 | Native:25 的宿主状态所有权。建立受控查询、受控已选值及禁用契约；请求未接受时不能显示已确认值。 |
| E03 | P2，F:1406-1427 | `RosemaryItem(enabled:false)` 的 FileRow 点击后仍请求 `onSelected(true)`。Compose 与 SwiftUI 的选择控件已传递 enabled。 | Native:66 的禁用自动检查，Item 公共 enabled 参数。禁用整行选择和各项实际动作，不能只改颜色。 |
| E04 | P2，F:413-428 | 320px、左右各 24px、普通字号，颜色名“很长的颜色名称需要完整呈现在可用区域而不溢出任何边框”触发 189px RenderFlex overflow。 | Native:27、40 的大字/折行/适配。给色名可用宽度并折行或明确截断，测试 RTL 和文字缩放。 |
| E05 | P2，F:303-313 | 打开日期弹窗后宿主把 `onChanged` 改成 null，点 OK 仍执行旧回调 1 次。`context.mounted` 不能证明旧回调仍合法。TimePicker:330-338 是同类捕获模式；Compose A:59/64 的打开态确认同样没有 enabled 限制，后两者本节未设备执行。 | Native:17/25/66 的受控、禁用与旧事件隔离。确认使用当前合法性、当前回调及会话身份；禁用期间不能提交先前捕获回调。 |
| E06 | P2，A:58 | Material3 的 `selectedDateMillis` 是 UTC 日首；当前 `DateFormat` 使用本地时区。洛杉矶下选 2026-10-10 却显示前一天，用户看到与提交不同的日期。 | Native:17/25 的真实输入值；[DatePickerState 官方定义](https://developer.android.com/reference/kotlin/androidx/compose/material3/DatePickerState)。以日历日期为单位，使用明确 UTC 格式化/转换策略，并覆盖正负时区。 |

### 源码可直接确认的功能缺口

这些要求来自现有组件规范或已接受的共同契约，属于“全部 61 项进入 Beta”需要补齐的能力。原生适配可以改变表现形式；不要求原生照搬 HTML/ARIA 属性或所有 Web 尺寸。下述是首次基准，实施者已开始并行修复，尚待新版本复验。

| 范围与位置 | 必须能力与当前差距 | 现有依据、可接受适配 |
|---|---|---|
| DataGrid F:801-844、A:95-99、S:526-563 | 当前是逐记录卡片与字段保存，没有专业矩阵的冻结首列、列宽、组合筛选、二维键盘焦点模型；Compose 逐条 eager Column 也不提供虚拟长记录。 | Spec:1267-1290 明确列宽/冻结/筛选/虚拟滚动/单元格键盘；Native:54 先定义完整平台输入/辅助技术模型。宽屏提供真实可编辑矩阵，窄屏可用 records adapter，但保留过滤、编辑、选择及稳定记录身份。 |
| Tree F:859-907、A:100-102、S:565-596 | 递归按钮/行有展开与选择，但无左右键展开、父子焦点移动及明确层级辅助技术模型。 | Spec:1383-1404，Native:17/28。采用原生层级/集合语义及实际键盘模型；不要求设置 DOM role。 |
| CommandPalette F:624-674、A:89、S:414-439 | 有搜索和可点击结果，缺高亮、上下箭头循环确认及完整 Escape/modal 焦点宿主契约。Flutter 点击命令直接 Navigator.pop，需要明确运行在所属弹层，避免普通页面用法误退路由。 | Spec:1204-1205，Native:29。可以组件与可运行宿主 adapter 分工，但最终公开工作流必须具备这些功能。 |
| NumberField F:173-219、A:46-49、S:139 起 | 只有按钮/Stepper，没有直接数字录入；精确端口号与大跨度值无法按预期输入。 | Spec:447-455 描述端口号录入及 Input Box。原生 Stepper 可保留，但提供数字文本输入、单位及合法范围说明。 |
| Toast F:1024、A:107、S:665 | 只是普通文本表面，缺真正悬浮宿主、退出时序、可访问状态差异及计时暂停。 | Spec:1667/1677，Native:18/32。timer/overlay 可放 host adapter；有动作或读屏时采用平台可访问持续时长，不能用硬计时缩短阅读。Snackbar 长期展示符合“至少 5 秒”，不因没有自动关闭独立报错。 |
| Popover F:1121-1130、A:112 | 所有宽度都直接打开 Sheet，没有宽屏的触发点锚定关系。SwiftUI 原生 popover 能平台适配。 | Spec:1927-1937；Native:7/44。紧凑设备采用 sheet 合理，宽屏需可定位的宿主浮层。 |
| Accordion F:1260-1281、A:117 | 直接 if 插入/移除内容，缺正常偏好下平滑高度变化；Flutter 缺明确 expanded 语义。 | Spec:2128/2136/2138，Native:32。展开高度平滑并尊重减少动态效果，暴露平台展开状态。未受控内部子状态保存见下方建议，不能与这条强制要求混为一谈。 |
| ResizablePanels F:1306 起、A:120-122、S:840 起 | 未见真实硬件键盘箭头调整的焦点模型；可访问 setProgress/adjustable 动作不等于硬件方向键。 | Spec:2294 的键盘微调，Native:17/32。键盘微调与拖动直接跟随需分别验证。 |
| MetricCard F:1355、A:124、S:888 | title/value/detail 不能完整覆盖趋势箭头、文字比较、sparkline 与阈值状态。 | Spec:2323-2333。增加真实趋势/阈值数据与可访问总结；sparkline 可非交互但必须有替代文字。 |
| ProberStatus F:1379、A:125、S:905 | 任意 label/state 文本与恢复按钮，不含约定健康/降级/离线的不同几何符号、延迟与最后巡检时间。 | Spec:2362-2373 的图文双编码。由类型化状态或明确 formatter 提供一致图形/文字，不以颜色单独表达。 |
| FileRow F:1406、A:126、S:923 | Item label/detail/选择/菜单尚不覆盖文件类型、同步状态及可打开行为。 | Spec:2403-2414。提供类型/大小/同步数据与打开动作，保留平台触控/键盘/双击适配；删除仍交宿主确认。 |

### 需要验证的源码推断与建议

- **R01，较高可信源码推断：** A:122 的 `pointerInput(width,direction,fraction)` 把拖动过程中更新的受控 fraction 作为 key。宿主接受首个更新后重组会取消并重启 pointer coroutine，持续拖动可能中断。[官方 pointerInput 文档](https://developer.android.com/reference/kotlin/androidx/compose/ui/input/pointer/pointerInput.modifier) 明确该生命周期。建议稳定 key、`rememberUpdatedState` 与拖动累计量；须在真实 Compose UI 测试复现，不能把当前源码推断写成设备通过/失败。
- **R02，建议而非独立阻断：** Flutter Accordion 收起后卸载子 widget，未配置外部 controller 的 TextField 草稿丢失。独立观察已复现；现有 Native 契约要求宿主持有输入状态，尚未明确要求保存所有内部子状态，因此本项是保活策略/文档建议。受控宿主草稿仍需实际验证。
- 首次基准 SwiftUI 部分 error 使用 `.red`，而其他字段走 Rosemary 语义色；应检查这些是否有明确平台 policy。没有适配说明时建议映射生成 danger。这里只作为主题一致性复查，未以截图证明实际对比度失败。
- 前文矩阵中的队列去重、所有组件保活、全平台完全相同尺寸等属于审计建议或验证方案，不能无来源扩大为现有强制规范。发布阻断应引用当前规范或已经接受的产品能力。

### 首次基准结论

新实现证明三端拥有更广的公开入口并可以编译；上述实际禁用/受控/日期/布局缺陷与明确能力缺口尚不支持把全部 61 项标为 Beta。修复后的每份源码需新快照复验；仍须人工辅助技术、真实设备、真实 IME/文件选择、系统返回及焦点恢复验收。阶段和工程凭证保持由实施流程更新，本报告不修改它们。


## 新网格、Tree、数字输入与长选择复审

本轮日期：2026-10-10。独立副本路径：`[local-audit-snapshot]`。初次完整源码 hash 清单为副本的 `fingerprints.json`；首次 Flutter 编译发现漏导入后，重新复制了实施者已修复的整份 Flutter lib，行为复验对应 `flutter-recheck-fingerprints.json`。以下实际行为和行号均对应后一次 Flutter 副本；Compose/SwiftUI 对应首次完整副本。源码继续并行修改，本节不是对后续未取样代码的结论。

| 副本内源码 | SHA-256 |
|---|---|
| `flutter/lib/src/grid.dart` | `f23d4979ce2db996591c1e4f51f6a4428fd7baf014b859a18819e69ec08e7c8b` |
| `flutter/lib/src/tree.dart` | `b51291f753794c5ae75b4929ceb9fa100c4185d756c8708713f45c4fe41b4efd` |
| `flutter/lib/src/components.dart` | `ab39d98e3886b7c94be5c96b3f30ab1bfa09e8d18aac6ac16306afbbe438c4a5` |
| `flutter/lib/src/extended.dart` | `6cd4f7e2ce7f8ce5e8741af34aa4588aa5907b5a08225f604204c77458e9f362` |
| `android/rosemary-compose/src/main/java/design/rosemary/compose/VirtualGrid.kt` | `9bad4ce08e8bc8cf099386d3c359dd9d17fc4c22ea34ba208a768917103d675f` |
| `android/rosemary-compose/src/main/java/design/rosemary/compose/SearchSelect.kt` | `5effd4cca756dcb95926d9d64a652524e0649ad512620da4fce77821277d9298` |
| `swiftui/Sources/RosemaryUI/NativeGrid.swift` | `2c29e1b642715d10fdaa2c28eedcc6542157cfb093fe3891a26709e326a7783d` |

### 构建与专项证据

- 初次 Flutter 载入失败：`extended.dart:247` 使用 `LogicalKeyboardKey.escape` 而未显式导入 services。已反馈；实施者补导入后再次复制源码，所有复现都能加载，故该 P1 **在本次编译范围内关闭**。
- 修正副本 Flutter `flutter test test`：18 个既有测试通过；其中包括 1000 记录虚拟化/组合筛选/编辑取消。`flutter analyze` 在该次副本有 RadioListTile 的两条弃用 info，返回非零；实施者稍后将其改为 RadioGroup，后续版本尚未在本节取样。不能把本节 analyze 写为通过，也不把弃用 info 写成构建无法加载。
- Compose 独立 `:rosemary-compose:testDebugUnitTest`：源码编译与 5 个状态测试通过；尚未包含随后新写的 Tree.kt。
- SwiftPM macOS 5 个状态测试通过；完整 RosemaryUI 模块以 iOS 15 arm64 simulator 目标编译通过，包含新的 UIKit 原生网格。
- 独立专项脚本仅写入临时副本根目录，没有修改任何正式测试。`audit_boundary_test.dart` 的有效 Grid 过滤显示、可编辑行触控选择两项失败；其早期 Tree 定位脚本没正确确认焦点，**该早期断言不作为证据**。改用 `audit_focus_test.dart` 实际遍历、检查完整焦点祖先后，确认焦点确在“展开 B”，方向键仍展开 A。
- `audit_update_test.dart`：删除活跃记录后的配置/焦点协调、打开选择面板后的 options 更新两项失败。
- 长选择面板在 320×568、DPR 1、底部 300px IME 遮挡的普通字号用例未发现 RenderFlex 溢出。这是一项具体通过，不代表所有文字缩放与 iOS 键盘通过。
- 前次 E05 的 Flutter 日期旧回调脚本独立重跑：禁用后旧窗口确认 `callbacks=0`，该具体 Flutter 复现已关闭；不据此关闭 Compose 同类问题或日期时区问题。

### 当前优先修复项

| 编号 | 优先级与路径/行号 | 可复现问题及现有规范依据 | 修复方向 |
|---|---|---|---|
| N01 | P2，Flutter `lib/src/grid.dart:393-400` | 宿主 `configuration.filter('name','missing')` 后记录数变 0，筛选字段仍是空串。TextFormField 的 initialValue 只用于初始化。用户看不到实际过滤原因，也无法直接清除宿主恢复的条件。依据 Native:25/28 的宿主输入/过滤状态；Spec:1275 的多列筛选。 | 字段 controller/受控值随 configuration 的真实值同步，保留正在输入的 selection/composing；替换 configuration 同样应更新。 |
| N02 | P2，Flutter `lib/src/grid.dart:244-250`；同根因 Compose `VirtualGrid.kt:68`、SwiftUI `NativeGrid.swift:199-204` | 全列 editable 的合法网格中，每个 cell 点击都打开编辑，没有独立的触控行选择入口。独立 Flutter 点击唯一行的冻结首列，selection 请求为 0、编辑器数量为 1；只有硬件 Space 能多选。SwiftUI 虽有 VoiceOver custom action，普通触控仍没有选择动作。依据 Spec:1280/1284 的 Selection Checkboxes 与 Multi-row Selected、Native:63 的触控验证。 | 行选择与编辑分别提供可操作入口，可使用冻结列独立勾选热区、显式多选模式或其他真实原生选择适配；不可要求手机连接硬件键盘。 |
| N03 | P2，Flutter `lib/src/tree.dart:155-176` | Tab 经 A 展开按钮、A 标题到 B 展开按钮，焦点祖先确认为 `IconButton:展开 B`；此时 ArrowRight 请求 `{a}`。active 只由标题 FocusNode 更新，chevron 焦点没有同步，导致操作错误行。依据 Spec:1391/1401 的左右展开/层级状态、Native:17 的焦点/键盘职责。 | 整行统一焦点模型，或展开按钮同步 active；Enter/Space、上下/左右、读屏动作也应以同一真实节点为目标。 |
| N04 | P2，Flutter `lib/src/grid.dart:61-70、374-382` | 已聚焦 row b 后宿主删 b（仅剩 a），pump 两帧后 `configuration.row` 仍 b，合法 a 未被重新设为活动行。独立复现确认不会自行协调；配置指向不存在记录。依据 Native:28 的稳定身份和真实虚拟内容、66 的焦点/列表身份检查。 | 数据/筛选/列更新时，按稳定 ID 保留仍合法的活动单元格，失效时移到合法相邻项或明确空状态，并恢复真实焦点而非只改字符串；不要任意清空宿主选中集合。 |
| N05 | P2，Flutter `lib/src/components.dart:191-210、307-314` | 打开长列表后宿主改变名称并禁用条目1，面板仍显示“条目 1”且可点选，不显示“新条目 1”。options 被捕获为独立 sheet child，没有更新桥接。最终提交处会重新校验，可防止该条目提交，但展开状态依旧误导、显示可用。依据 Native:25/31 的宿主选择/禁用/草稿契约、66 的禁用检查。 | sheet 监听当前 options/回调可用性，数据替换时保留合法草稿并取消非法草稿；禁用期间关闭或禁用实际动作。不能只在点击确认之后静默丢弃。 |

上述五项是实际 Flutter 复现；所列 Compose/SwiftUI 相同根因只读源码确认，尚未冒充这些平台的 UI 运行证据。

### 原生网格额外源码风险

- **SwiftUI 触控滚动风险，待真实 UI 验证：** `NativeGrid.swift:66` 给每个 cell 添加 UIPanGestureRecognizer；普通正文没有 resize，却到 recognizer 已识别后才在 `drag:74` 返回。没有 shouldBegin、方向限制或同时识别策略，可能与 UICollectionView 的原生 pan 争抢。建议只在真正可调整的表头横向手势开始时接管；正文/竖向应失败或允许原生滚动。依据 Native:43 的平台滚动与 Spec:1267 的虚拟网格。[Apple gestureRecognizerShouldBegin](https://developer.apple.com/documentation/uikit/uigesturerecognizerdelegate/gesturerecognizershouldbegin(_:))、[同时识别手势](https://developer.apple.com/documentation/uikit/allowing-the-simultaneous-recognition-of-multiple-gestures) 支持该推断；本节没有记录设备滚动失败。
- **SwiftUI RTL 源码适配缺口：** `NativeGrid.swift:25` 始终把首列固定在 bounds.minX，其自定义 layout 未实现 RTL 或启用翻转。UIKit 不自动翻转任意 custom layout：[flipsHorizontallyInOppositeLayoutDirection](https://developer.apple.com/documentation/uikit/uicollectionviewlayout/flipshorizontallyinoppositelayoutdirection) 默认 false。需以 leading 和实际视觉方向定义冻结/箭头/拖宽；Native:63 已明确 RTL 是 Beta 验收条件。本节尚未在设备展示截图。
- **SwiftUI 自定义表面主题缺口：** `NativeGrid.swift:65、104、187-189` 使用 separator/systemBackground/secondarySystemBackground，未读取 Rosemary 语义角色；它是自定义网格而非系统日期/权限弹窗。需由 Theme/policy 映射品牌表面、边框和活动状态，符合 Native 的 Theme 分层与双主题角色契约。自动 UIKit 编译不证明实际主题继承。
- **新 Compose Tree 焦点复查：** 首次只读新 Tree.kt 时展开 TextButton 尚未更新 active，已反馈同类 N03 风险；随后再次读取 `Tree.kt:40` 已存在 `.onFocusChanged{if(it.isFocused)active=n.id}`，因此不继续把该源码根因列为未修复。此次尚未独立编译这份后续 Tree 版本或 instrumented 复现，首次 UI 验收仍应覆盖 chevron 与标题之间的 Tab 流转。

本节新增的数字字段已经有真实文本录入/提交与范围限制，长列表也已具备搜索/确认/取消入口；它们不再因“没有入口”继续列为旧缺口。此次没有将区域化数值解析、全部内部子状态保活等建议扩大为无来源强制门槛。真实 IME、VoiceOver/TalkBack、系统返回、实际设备触控及全部文字缩放仍未人工验收。


### 本轮修复后的独立关闭记录

后续独立副本：`[local-audit-snapshot]`。首次副本 manifest 为 `fingerprints.json`；Select 跨 route 通知修复后再次复制 Flutter lib，最终行为验证 manifest 为 `flutter-final-fingerprints.json`。前文 N01-N05 的初始失效仍保留作历史记录，不继续描述为当前已复核代码的未修复问题。

| 本轮最终复核源码 | SHA-256 |
|---|---|
| `flutter/lib/src/components.dart` | `a299130720c61813287995b02349e78ade9ffe8bf70c3835a244989bfedd327a` |
| `flutter/lib/src/grid.dart` | `6737e6cd90f10594d68249c9c6a18adc0db9c6db57dc122299036fd188b341ba` |
| `flutter/lib/src/tree.dart` | `1c04c35f5252bfb9d008085bbb32e251f96609c0d5a5db3467e650429e1a3a0c` |
| `android/rosemary-compose/src/main/java/design/rosemary/compose/VirtualGrid.kt` | `e5b67cd521f169d2605049dcd9fb07a153507dae7767c4f1c2878890f6f4b3fd` |
| `android/rosemary-compose/src/main/java/design/rosemary/compose/Tree.kt` | `0f68a4275dfc774b95918abe65f0b6883d44140586d5977e90a5c125fc331220` |
| `swiftui/Sources/RosemaryUI/NativeGrid.swift` | `ea377cd00ac523cae4ef0b5fd429f7e72cfe5e8e9fc91cef0f7cba5bd1e76413` |

- **N01 关闭：** 宿主过滤“missing”显示在实际字段中；用户清空后恢复 1 条记录。验证显示与过滤逻辑，不只对照内部 map。
- **N02 在 Flutter 自动范围内关闭：** 全部列 editable 时仍有独立 Checkbox 触控入口；点击后请求精确记录集合 `{'r'}`，不会打开编辑器。Compose/SwiftUI 新源码也增加选择入口，但未用这些平台的 UI 自动化或读屏确认。
- **N03 关闭：** 实际 Tab 到 B 的展开按钮，并验证其祖先 IconButton 目标，ArrowRight 仅请求展开 B。测试若没有真正到达该目标会失败，避免空分支假通过。
- **N04 关闭：** 删除前显式验证 b 单元格 FocusNode 拥有主焦点；删除后等待实际帧完成，配置和 a 的真实 FocusNode 均协调到合法记录。最初仅对配置字符串的断言已增强，未把无键盘焦点的点击混称为焦点恢复。
- **N05 关闭：** 第一次 liveOptions 修复在 `didUpdateWidget` 同步通知 sheet 兄弟树，曾独立触发 P1 `setState() or markNeedsBuild() called during build`（manifest 为首次 h8asywh0 的 `fingerprints.json`）。实施者改为帧后/当前 source 身份检查，最终复验没有异常。覆盖替换 options、同一 List 原地改名/禁用、打开期间禁用、取消后重开并确认新项、触发组件卸载后旧 sheet 禁止提交。合理等待桥接帧，不要求构建期间同步刷新。
- **SwiftUI 网格原源码风险已按源码复核：** 新的 shouldBegin 拒绝正文/非横向/非调整区 pan，主题使用 Rosemary surface/canvas/border/ink/accent，布局手动处理 RTL 与初始滚动位置。本次 iOS 15 simulator 目标完整模块编译通过；这关闭了先前缺少策略的源码根因，触控流畅度/RTL视觉/读屏仍需仪器和人工验证。
- **Compose 新 Tree：** 已包含 chevron onFocusChanged，连同当前新网格/Tree 在独立副本编译通过，5 个状态单测通过；不称这些状态单测验证了真实 Tree 键盘或 TalkBack。

经实施者明确授权，9 个临时专项回归整理到 `platforms/flutter/test/audit_regressions_test.dart`，保留原有 3 项，共 **12 项通过**；该文件 scoped analyze 无问题。新增只涉及测试与本报告，没有修改 SDK 实现、发布阶段或 `native-checks.json`。新的完整 lib+test analyze 在所取样副本仍有 `fields.dart:2` 的 unnecessary_import info，已反馈，不宣称完整 analyze 通过。

该关闭记录只覆盖上述自动/源码范围；Command/Toast/完整宿主工作流等工程能力及四宿主辅助技术、真实设备与 IME 门槛继续待验收，全部 61 项的 Beta 尚未获审计确认。

## 全量 SDK 工程边界复审：菜单、键盘与浮层复用

2026-10-10 新固定副本：`[local-audit-snapshot]`。全量 SHA-256 清单为该副本 `fingerprints.json`。以下失败对应此副本；源码继续并行修改，修复须另取样复验。测试位于副本 Flutter 根目录，没有修改 SDK 实现或正式凭证。

### 可复现缺陷

| 编号 | 优先级与固定副本路径 | 复现、影响与契约 |
|---|---|---|
| B01 | P1，Flutter `lib/src/extended.dart:1483-1516` | ContextMenu 打开后，宿主把同 ID 动作替换为 null 回调，再点击旧列表项，原回调仍执行一次。await showMenu 后访问旧 StatelessWidget actions，违反 Native 共同契约的真实禁用与无无效回调门槛。需核对当前动作、挂载身份与回调可用性，不能仅在打开时判断。 |
| B02 | P1，Flutter `lib/src/extended.dart:1463-1464` | DropdownMenu 打开后宿主删掉动作，点击旧项抛 `Bad state: No element`。onSelected 对最新 actions 直接 firstWhere。合法数据更新不应崩溃；核对当前 ID，找不到则安全丢弃或关闭。 |
| B03 | P2，Flutter `lib/src/extended.dart:397-446` | 聚焦 ComboBox 输入，ArrowDown+Enter 不产生选择请求；没有独立高亮、方向键、确认模型。自有 Spec:679-697 已列 Item Highlighted、Filtered Options List；Native 完整键盘输入模型门槛要求验证实际硬件键盘。Compose `RosemaryExtended.kt:60` 与 SwiftUI `RosemaryExtended.swift:205-232` 也只搜索加按钮，属于源码同类缺口，尚未冒充这些平台 UI 运行。 |
| B04 | P2，Flutter `lib/src/extended.dart:907-919`，Compose `Commands.kt:16`，SwiftUI `NativeCommands.swift:140-141` | A/B 两命令，初始高亮 A，Down 两次 Enter 实际执行 B。自有 Spec:1205 明确上下箭头循环选定；三端都 clamp 到边缘。实际 Flutter 自动失败，另两端按源码确认。修复需跳过禁用项并循环有效项。 |
| B05 | P2，Flutter `lib/src/toast_host.dart:126-137` | A 提示聚焦后 2 秒不消失，宿主同身份替换为 B controller，焦点未变但 B 2 秒后消失。didUpdateWidget 未转移 focus/pointer/accessibility-focus 暂停原因。当前 SDK 明确实现聚焦暂停，切换桥接应保持该行为并清理旧桥接。Spec:1677 的悬停暂停、Native 生命周期与焦点检查亦需覆盖。 |
| B06 | P2，Flutter `lib/src/extended.dart:954-960` | 40 条命令按 End，仅 active 改末项，不滚动；末项文字尚未构建，用户看不到接下来 Enter 执行的命令。键盘高亮应实际可见。Home 同类；普通方向键已有滚动但边界快捷键没有。 |
| B07 | P2，Flutter `lib/src/extended.dart:1501` | 真正整条 Navigator RTL，800px 视口点击 (30,30)，ContextMenu 文字在 x673..758。RelativeRect 的 right/bottom 误填全局 x/y，RTL 用右侧约束时跑到相反边。Native RTL 验收与菜单真实触发点关系失败；应把点转换到实际 overlay 坐标并正确计算四边距离。 |
| B08 | P1，Flutter `lib/src/session.dart:42-43` | First 确认的 onClose 立即打开 Second，旧 close 随后的 Navigator.pop 误关新会话。独立结果 First Future 未完成、Second 为 programmatic，First 仍留屏且 session 已完成无法再关闭。违反 Native:29 的旧关闭事件不能覆盖新会话。关闭须准确针对捕获 route，结果回调顺序和退场后的焦点恢复均不能影响新会话。 |

`beta_edges_test.dart` 的 B01-B04 四项有效断言均失败；`toast_lifecycle_test.dart` 的 B05 失败；`keyboard_position_test.dart` 的 B06/B07 失败；`modal_reuse_test.dart` 的 B08 失败。B07 初次只包局部 Directionality 的脚本没有令 Navigator 采用 RTL，其初次通过不作为 RTL 验收；改为 MaterialApp builder 包整个 Navigator 后得到上列有效复现。没有把测试脚本编写过程的错误当成 SDK 缺陷。

### 需要设备复验的源码风险

- **P1 高可信源码风险，Compose `Modal.kt:18-20`：** session 的回调闭包通过跨会话 rememberUpdatedState 读取 currentClose。宿主从 A/callbackA 换到 B/callbackB，旧 DisposableEffect(sessionA) 卸载会调用 sessionA.close(A,Programmatic)，旧 session 闭包却读取 callbackB，把 A 的结果发送给 B 宿主。检查 classA 的 ID 不能保护 B。需捕获对应 presentation 的回调身份或在回调携带 captured ID；应以实际组合生命周期回归确认，当前没有把源码推断写成设备失败。
- Compose `RosemaryExtended.kt:124` 的 Drawer 用 LaunchedEffect(open) 同步内部 DrawerState。用户手势关闭后 onClose 请求若被宿主拒绝，open 仍 true，effect key 未变化，内部 Closed 不会回到受控 Open；快速重新打开也应核对旧 Closed 回调。当前是源码风险，尚未独立 instrumented 复现，不写成真实设备失败。
- SwiftUI `ToastHost.swift:95-117` 仅 onAppear/onDisappear attach/detach；同 View 身份替换 ObservedObject 时没有专门 identity 监听。新 state 默认 detached，可能一直不启动计时，旧状态也未及时 detach。需在 SwiftUI UI 生命周期中证实；状态单测不能验证 View 身份效果。

本次副本的既有 Flutter `analyze lib test` 无问题、31 个仓库测试通过；SwiftPM macOS 的 9 个状态测试通过。新增边界复现仍独立失败，说明既有测试通过不足以覆盖上述缺陷。没有运行共享的 check-native 或重写它的收据，亦未将 macOS SwiftPM 成功称作 iOS UI 通过。

### 公开 API、注册与凭证交付清单

当次读取的设计总文档、三端平台文档、`src/data/nativeLibraries.ts:336-344`、`scripts/package-native.mjs:43`、`scripts/check-native.mjs:137-155` 仍记录首批14 Prototype／47 Draft，包版本仍为 prototype；这保持保守阶段，不能在未完成验收时直接改成 Beta。全量推进完成后需同步真实61项 API、公开导出、接入样例、生成注册表与源码包 manifest，避免把61个名称当成61项验收通过。

`check-native.mjs` 当前无论新执行结果仍会附加旧 Xcode lockdown 的 blockedChecks 文案；如果随后成功运行 iOS workflow，这段历史阻塞应以实际本次结果替代或保留为明确历史，否则一个凭证同时包含 passed 与 obsolete blocked。不要为消除历史文字删除仍真实存在的人工验收限制。

实际设备、VoiceOver/TalkBack 人工检查、真实 IME 与系统返回仍须独立证据。上述 Flutter widget 复现、源码推断、模块编译与状态测试不等于人工读屏通过，全部61项仍未获得本审计的 Beta 确认。

### 八项工程边界修复的独立复验

实施者授权把本轮八项复现整理为永久 `platforms/flutter/test/audit_beta_edges_test.dart`，没有 skip 或放宽业务断言。后续固定副本为 `[local-audit-snapshot]`，完整源码清单见该副本 `fingerprints.json`。本节关闭范围限于明确通过的自动复现。

| 复验源码 | SHA-256 |
|---|---|
| Flutter `lib/src/extended.dart` | `97092e1f52c96666668f1f154d02e9e45ba0b945b5e0d40c8719c3235e49f5f0` |
| Flutter `lib/src/session.dart` | `06fe909185fe87087c5136462c37e14af3ad9cee9d4e5c8b988dff78b173b366` |
| Flutter `lib/src/toast_host.dart` | `e5f47fc9021792f96f11f0b616a295a366946d757343dc4ce39a0d80e89632ad` |

- **B01/B02 关闭：** 打开后禁用动作不执行，删除动作不抛异常；B01 增强验证同 ID 回调替换只执行新回调，触发组件卸载后旧菜单不再执行。
- **B04 关闭：** A/B 命令 Down 两次、Enter 精确执行 A，证实有效项循环。
- **B05 关闭：** Toast 替换 controller 后真实关闭控件的焦点保持暂停，新 B 不提前过期；旧 A 重新 attach 后能过期，证明旧 focus 暂停原因已清理。
- **B06/B07 关闭：** Command End 的末项实际进入视口；RTL Navigator 下点击 (30,30) 菜单文字位于 x45..130，保留触发点关系。
- **B08 关闭：** First Future 为 confirm、Second 未被误关。增强实际焦点断言：初始 Home 输入拥有主焦点，Second 自动焦点在旧退场后仍保留，Second 取消后 Home 恢复主焦点，First 结果不变。
- **B03 在该固定副本仍失败：** Combo ArrowDown+Enter 请求仍为 null，实施者正在补模型；该失败测试永久保留，等待新的模型快照复验，不把未完成中间态反复列作新缺陷。

第一次及增强后的八项专项结果为 **7 通过、1 个 Combo 失败**；该测试文件 scoped analyze 无问题。当前 SwiftUI 完整源码以 iOS 15 arm64 simulator 目标独立 typecheck 通过，包含新的 ModalAnchor、Command viewDidLoad 刷新；这只证明 API 下限编译，不证明焦点或 UI 运行。

Compose Modal 的回调 State 已按 sessionId 隔离，关闭先前跨会话 currentClose 共享的源码根因，仍需真实组合生命周期验收。Drawer 最新 settled 监听降低动画期间误回调风险，但受控拒绝仍待验证：若宿主保持 open=true，LaunchedEffect(open) 不重跑，内部 Closed 没有显式协调为 Open。SwiftUI Toast 最新代码加入 attached identity 与暂停状态转移，关闭原先没有身份监听的源码缺口；同 View 身份替换的 UI 生命周期仍未独立运行。上述源码复核不计作设备或人工读屏验收。

### Combo 模型完成后的关闭补记

随后再复制完整 Flutter lib 到同一独立副本，保留原 manifest，并另存 `flutter-combo-fingerprints.json`。新的 `flutter/lib/src/extended.dart` SHA-256 为 `caf8fc30f64a37de3af3d0e664f0bdaedc71fa10acb6b599dd6b5f7c27189300`。`analyze lib test` 无问题，八项永久专项回归 **全部通过**，关闭 B03 的原 ArrowDown+Enter 失效复现。

同一个 Combo 测试增强验证：方向键跳过禁用项，Enter 每次仅发一条真实请求；宿主不更新 value 时没有勾选图标、controller 文字不被擅自修改；Escape 清掉未确认高亮后 Enter 不提交；onSelected 变 null 后不再请求。增强用例独立通过，最终永久测试文件 analyze 无问题。

该修复副本 Compose 模块编译成功，9 个状态单测通过；存在 rememberPlainTooltipPositionProvider 的弃用 warning，不将 warning 写成构建失败。状态单测仍未检验受控 Drawer 拒绝或 Compose Modal 实际组合卸载行为。SwiftUI 的 iOS 15 typecheck 与 Flutter 八项通过只覆盖各自范围，不据此宣称全部61项的人工、设备或 Beta 门槛已完成。


## 冻结源码后的工程交付记录

2026-10-10 最终收据 `docs/native-checks.json`：sourceUnchanged=true、nativeUnchanged=true、engineeringPassed=true；原生源码 SHA-256 `a059b8bc92cf2f291664a4f3567602aa9422a76fec3a82a69ef021d969e2b733`。183 项公开 API 与三端 61 项宿主预览一致。Flutter 43 项库回归、10 项示例测试、Android/iOS 各 9 项真实引擎集成通过；Compose 9 项状态单测、14 项库设备交互与 1 项预览矩阵测试通过；Swift 9 项状态单测及 iOS 应用/UI 测试编译通过。

Compose 受控 Drawer 拒绝关闭已有实际设备回归，宿主保持 open=true 后恢复打开；Modal 按 sessionId 隔离关闭回调。独立最终只读复核未发现新的高优先级问题。以上是工程交付与已运行回归范围，初始渲染矩阵不替代全部交互或平台覆盖。

SwiftUI UI 执行仍被本机 Xcode 设备服务阻断；Flutter iOS VoiceOver、Flutter Android TalkBack、SwiftUI iOS VoiceOver、Compose Android TalkBack 人工路径未执行。betaApproved=false，版本保持 0.3.0-prototype.2，不能批准全库 Beta。
