import { DoDontCase } from "../types";

export const DO_DONT_CASES: DoDontCase[] = [
  // ==========================================
  // 1. NAVIGATION (8 Cases)
  // ==========================================
  {
    id: "case-01-nav-hierarchy",
    number: 1,
    category: "Navigation",
    tags: ["Breadcrumb", "Hierarchy", "Wayfinding", "Desktop"],
    title: "清晰可预测的结构化面包屑 vs 隐藏返回入口的深层黑盒",
    summary:
      "页面导航必须提供清晰的路径感知与一键返回上一级途径，禁止嵌套无头链接或隐藏当前物理位置。",
    why: "用户在进行多任务切换或查阅深层配置时，一旦丧失面包屑或当前层级线索，会产生严重的认知焦虑，导致盲目回退并遗失未保存草稿。",
    doText:
      "使用结构明确的面包屑导航，当前位置以墨色纯文本展示；始终保留返回上一级的明确返回按钮。",
    dontText:
      "深达4级的导航仍不提供面包屑，仅在角落藏一个无文字图标；关闭后直接跳转回站点首页。",
    impact: "High",
    applicablePlatforms: ["Web", "iOS", "Android", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.text", "primitive.space.2"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-10-search-fallbacks",
    number: 2,
    category: "Navigation",
    tags: ["Search", "Fuzzy Matching", "Fallback", "Empty Results"],
    title: "智能容错与建议的搜索体验 vs 粗暴返回空白的死胡同",
    summary:
      "搜索无匹配时，提供模糊匹配建议、清除筛选入口或推荐关键词，帮助用户调整检索意图。",
    why: "用户经常因微小的拼写误差（如少打一个字母或全半角空格）搜不到结果，若直接呈现死胡同，会导致关键资源被误判为不存在。",
    doText:
      "“未找到关于‘rosemari’的内容。您是不是要找：‘rosemary’？[清除此筛选] 或浏览所有分类。”",
    dontText:
      "直接提示“404 Not Found”或者界面变为空白，连原本输入的搜索词都被一并清空。",
    impact: "Medium",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.text", "semantic.radius.control"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-11-filter-transparency",
    number: 3,
    category: "Navigation",
    tags: ["Filters", "Transparency", "Reset", "State"],
    title: "一眼可见且支持一键重置的激活筛选条件 vs 隐藏在抽屉深处的隐形滤网",
    summary:
      "生效中的筛选条件必须在列表上方清晰呈现激活标签，并提供便捷的单项移除与“全部清除”按钮。",
    why: "用户忘记自己两天前勾选了“仅查看已归档”，重新打开列表以为数据丢失，造成严重的恐慌与支持工单。",
    doText:
      "列表顶部以优雅文本显示：“已筛选：状态=处理中 · 标签=核心 [清除全部]”，数目统计同步更新。",
    dontText:
      "筛选生效中但在主界面没有任何视觉指示，仅在二级设置弹窗里的某个暗色开关默默开启。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.text-secondary", "primitive.space.2"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-19-context-preservation",
    number: 4,
    category: "Navigation",
    tags: ["Scroll Restore", "State Preservation", "Tab Persistence"],
    title: "保留上下文的页面切换与滚动位置恢复 vs 每次返回都刷新的重置灾难",
    summary:
      "从详情页返回列表页时，必须恢复先前的滚动位置、激活的选项卡和展开状态。",
    why: "用户在翻阅几百条长列表时，点进第48条详情查看后按返回键，若页面直接滚回最顶部第1条，用户将不得不重新翻找。",
    doText:
      "使用客户端路由状态保留或记忆滚动游标，返回列表时丝滑恢复到离开前的视口位置。",
    dontText:
      "返回操作触发整个页面完全重新加载并重置所有筛选器，抹掉所有前序操作。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android"],
    tokensInvolved: ["semantic.motion.settle"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-25-tabs-overflow",
    number: 5,
    category: "Navigation",
    tags: ["Tabs", "Overflow", "Horizontal Scroll", "Responsive"],
    title: "支持平滑水平滚动与下拉清单的选项卡 vs 强制折行挤爆界面的多行标签",
    summary:
      "当选项卡数量过多或屏幕较窄时，必须保持单行水平滚动或提供“更多”下拉收纳，严禁多行折叠堆叠。",
    why: "折行多行的 Tabs 会在用户点击第二行时突然与第一行上下跳位，严重颠覆物理锚点与视线焦点。",
    doText:
      "Tabs 保持优雅单行，超宽时右侧渐隐并提供平滑左右滑动或更多下拉菜单。",
    dontText:
      "Tabs 强行排成 3 行，点击任意一个都会导致整个页面头部高度剧烈拉伸跳动。",
    impact: "Medium",
    applicablePlatforms: ["Web", "Flutter", "iOS", "macOS", "Windows"],
    tokensInvolved: ["primitive.space.2", "semantic.radius.control"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-26-sidebar-collapse",
    number: 6,
    category: "Navigation",
    tags: ["Sidebar", "Collapse", "Drawer", "Mini Rail"],
    title:
      "具有工具提示的迷你图标侧栏 (Mini Rail) vs 粗暴隐藏导致无从导航的完全消失",
    summary:
      "桌面端侧边栏收起时，应转变为展示高精度图标与悬停 Tooltip 的紧凑导轨，保持一级入口可触达。",
    why: "若折叠侧栏仅仅是将其完全 display:none，用户在宽屏大显示器上必须频繁展开关闭才能切菜单。",
    doText:
      "收起时平滑过渡为 56px 迷你图标轨，悬停每个图标时弹出右侧浮动说明气泡。",
    dontText:
      "点击折叠后左侧一片空白，用户只能盲目在左上角寻找汉堡菜单重新点开。",
    impact: "Medium",
    applicablePlatforms: ["Web", "macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.motion.fast"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-27-stepper-progress",
    number: 7,
    category: "Navigation",
    tags: ["Stepper", "Multi-step", "Progress", "Wizard"],
    title:
      "步骤明确且支持已完成节点回溯的分步向导 vs 无法预知还剩多少步的黑盒流程",
    summary:
      "复杂多步骤配置（如服务器部署向导）必须清晰标出当前第几步、总步数及已完成状态，并允许点击前序步骤修改。",
    why: "用户不知道流程还剩多少步时会产生强烈的弃用心理，且一旦前一步填错无法点击返回将导致满盘皆输。",
    doText:
      "顶部展示“1. 基础配置 (已完成) → 2. 网络安全 (当前) → 3. 部署确认”，前序步骤可点击修正。",
    dontText:
      "只有一个“下一步”按钮，点到第7步依然看不见尽头，且禁止按上一步修改。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.accent", "semantic.space.4"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-28-command-palette-scoping",
    number: 8,
    category: "Navigation",
    tags: ["Command Palette", "Cmd+K", "Shortcuts", "Fuzzy"],
    title: "分类清晰且包含快捷键标注的全局命令台 vs 杂乱无章的平铺搜索框",
    summary:
      "Command Palette (⌘K) 必须按操作类型分组（导航、文档、设置、高频操作），并标注对应的物理快捷键。",
    why: "混杂上百条结果的无结构清单不仅降低检索效率，还会使用户失去对键盘盲操的信心。",
    doText:
      "分组展示“最近打开”、“常用命令”、“页面跳转”，右侧灰度对齐快捷键提示符号。",
    dontText: "搜索框直接吐出 50 个毫无分类的英文内部函数名列表。",
    impact: "Medium",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.radius.panel", "semantic.color.surface"],

    status: "Beta",
    visualType: "component",
  },

  // ==========================================
  // 2. ACTIONS (8 Cases)
  // ==========================================
  {
    id: "case-02-action-priority",
    number: 9,
    category: "Actions",
    tags: ["Buttons", "Visual Hierarchy", "Primary Action", "CTA"],
    title: "单一主要操作（Primary Action）vs 多个高饱和度按钮竞逐注意力",
    summary:
      "每个视口或卡片仅允许一个核心 Primary CTA，次要与辅助操作使用边框或幽灵文字外观。",
    why: "界面中如果出现两个或三个完全相同视觉权重的深色实心按钮，用户会陷入决策瘫痪，无法在500毫秒内识别主流程。",
    doText:
      "将核心提交设为 Rosemary 深绿实心按钮，次要操作（如“保存草稿”、“导出”）设为边框轮廓或浅灰背景。",
    dontText:
      "“保存”、“立即发布”、“删除项目”全部使用同样醒目的深色填色按钮并排排列。",
    impact: "Critical",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.accent", "semantic.radius.control"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-03-button-placement",
    number: 10,
    category: "Actions",
    tags: ["Button Layout", "Reading Gravity", "Modal Footer", "Order"],
    title: "符合阅读动线的操作排布顺序 vs 颠倒主次反直觉布局",
    summary:
      "桌面与移动端应依据人机工效学排列操作顺序：前进/确认在视线动线终点，取消在起点。",
    why: "违背操作系统标准的按钮排布（如反向放置“确认”与“取消”）会导致肌肉记忆误触，甚至误删关键数据。",
    doText:
      "Web/桌面端弹窗右下角：“取消”在左，“确认/提交”在最右（阅读终点）；危险删除予以明显间隔。",
    dontText:
      "将破坏性的“删除”按钮直接紧挨在常规“保存”旁边，且没有任何间距或视觉区分。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.space.4", "semantic.radius.control"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-29-loading-button-width",
    number: 11,
    category: "Actions",
    tags: ["Button", "Loading State", "Layout Shift", "CLS"],
    title: "保持按钮几何宽度稳定的 Spinner 状态 vs 文字被吃掉导致按钮变形跳缩",
    summary:
      "按钮进入 Loading 态时，必须锁定原有宽度并将文字平滑淡隐为中央微型转轮，禁止突变跳变。",
    why: "按钮若在点击瞬间从 120px 突然塌缩为 32px 的小圆点，会引发强烈的布局跳变并将相邻控件往左拉扯。",
    doText:
      "按钮保留固定 min-width，文字渐隐并在原处同心呈现 Rosemary Spinner。",
    dontText: "点击后按钮宽度瞬间缩小 80%，导致整个表单底部工具栏剧烈晃动。",
    impact: "High",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.motion.instant"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-30-split-button-safety",
    number: 12,
    category: "Actions",
    tags: ["Split Button", "Dropdown", "High Risk", "Affordance"],
    title: "主次操作分明的拆分按钮 (Split Button) vs 误触发危险下拉的混淆盲区",
    summary:
      "拆分按钮的主点击区与下拉触发角标必须拥有清晰的 1px 分割线和独立悬停反馈。",
    why: "若分割线模糊或热区粘连，用户打算点击“保存”却误点了下拉菜单里的“强制覆盖”。",
    doText: "左侧“发布项目”与右侧小箭头拥有各自的 hover 加深反馈，边界清晰。",
    dontText:
      "整个按钮合为一个热区，点中右侧 2 毫米也是执行主动作，下拉根本无法稳定唤醒。",
    impact: "Medium",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.accent-hover"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-31-fab-restraint",
    number: 13,
    category: "Actions",
    tags: ["Floating Action Button", "FAB", "Mobile", "Occlusion"],
    title: "克制使用的浮动操作按钮 vs 遮挡页面底部关键文本与操作的悬浮巨物",
    summary:
      "仅在长列表单核心场景（如“新建记录”）使用浮动按钮，滚动时必须注意避让底部内容，桌面端禁用。",
    why: "在桌面网页或表单底部肆意悬浮大圆球，往往会永久遮挡表格最后一行的操作按钮或总计数据。",
    doText:
      "仅移动端使用，滚动时可轻度收缩，页面触底时上移或淡隐，不遮挡最后一行。",
    dontText: "在桌面宽屏中央也悬浮一个巨大 FAB，把表格数据遮盖得严严实实。",
    impact: "High",
    applicablePlatforms: ["Android", "iOS", "Flutter"],
    tokensInvolved: ["semantic.space.4", "semantic.radius.round"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-32-disabled-button-tooltip",
    number: 14,
    category: "Actions",
    tags: ["Disabled State", "Tooltip", "Guidance", "Affordance"],
    title: "解释为何不可点击的禁用按钮 vs 令人摸不着头脑的哑火灰色按键",
    summary:
      "当主要按钮因前序条件未满足而禁用时，悬停应提示明确原因（如“请先勾选用户协议”），或保持可用并在点击时高亮未满足项。",
    why: "用户看着一个灰色的保存按钮毫无反应，根本不知道自己少填了哪一项，产生强烈的挫败感。",
    doText:
      "按钮灰色时，鼠标悬停即浮现 Tooltip：“需先完成邮箱验证码录入后方可提交”。",
    dontText: "按钮直接彻底禁用且 pointer-events: none，没有任何解释与指引。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.color.text-tertiary"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-33-destructive-styling",
    number: 15,
    category: "Actions",
    tags: ["Destructive", "Danger Button", "Red Restraint", "Safety"],
    title: "克制警示的危险操作按键 vs 满屏刺眼大红引发的恐慌与脱敏",
    summary:
      "只有真正导致数据损毁的操作使用红色。常规“取消”或“返回”坚决使用中性灰，避免红白漫天。",
    why: "如果把“取消”、“重置”、“关闭”全画成大红色，用户会对红色产生视觉脱敏，真正危险时反而不起警示作用。",
    doText: "“删除数据库”使用危险暗红，“关闭弹窗”与“返回”使用安静中性边框。",
    dontText: "取消也是大红，返回也是大红，整个页面充满火警般的焦虑感。",
    impact: "Critical",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.danger"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-34-multi-select-batch",
    number: 16,
    category: "Actions",
    tags: ["Batch Actions", "Multi-select", "Bulk Edit", "Floating Bar"],
    title: "弹出浮动批量操作栏 (Bulk Bar) vs 强迫用户逐条点击50次操作",
    summary:
      "在长列表中勾选多项时，顶部或底部平滑升起批量操作浮条，展示已选数目并提供一键归档/删除。",
    why: "管理几十个监控项时，若必须点进每一个详情页才能操作，效率极其低下。",
    doText:
      "勾选2项后，底部升起浮条：“已选择 2 项 · [批量导出] [批量归档] [取消全选]”。",
    dontText:
      "允许勾选复选框，但界面上根本没有任何批量操作按钮，勾了也是白勾。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.accent", "semantic.radius.control"],

    status: "Beta",
    visualType: "flow",
  },

  // ==========================================
  // 3. FORMS & INPUTS (8 Cases)
  // ==========================================
  {
    id: "case-04-form-validation",
    number: 17,
    category: "Forms & Inputs",
    tags: ["Validation", "Inline Error", "Blur", "Form UX"],
    title: "即时失焦内联校验 vs 提交后一揽子报错",
    summary:
      "在用户离开输入框（blur）时进行字段级校验，提供具有指导性的修正提示，提交前高亮第一处未填项。",
    why: "用户填写完长表单点击提交后，如果页面仅弹出一个模棱两可的错误弹窗并将之前输入清空，用户体验将极其挫败。",
    doText:
      "在输入框下方立即展示红色细体提示（如：“密码需包含至少一个数字”），并保持输入内容完整保留。",
    dontText:
      "用户正在键入第一个字符时就疯狂报错闪烁；或者提交失败后仅提示“表单校验失败”而不标出哪一项。",
    impact: "Critical",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android", "Windows"],
    tokensInvolved: ["semantic.color.danger", "semantic.color.border"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-35-persistent-labels",
    number: 18,
    category: "Forms & Inputs",
    tags: ["Labels", "Placeholder", "Floating Label", "Cognitive Load"],
    title: "始终可见的字段标签 (Labels) vs 用占位符冒充标签导致输入后失忆",
    summary:
      "每个输入框上方必须有固定的文本标签；禁止仅靠 placeholder 充当标签。",
    why: "当用户输入文本后，placeholder 会彻底消失，用户回头检查表单时根本记不起这个输入框是填手机号还是税号。",
    doText:
      "输入框上方常驻“法定代表人纳税人识别号”，placeholder 仅作为示例格式提示。",
    dontText:
      "输入框上方一片空白，只有灰色的 placeholder，一旦打字就看不见是什么字段。",
    impact: "Critical",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android", "Windows"],
    tokensInvolved: ["semantic.color.text", "semantic.size.caption"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-36-password-reveal",
    number: 19,
    category: "Forms & Inputs",
    tags: ["Password", "Eye Icon", "Masking", "Visibility"],
    title: "提供显式明文/密文切换小眼睛 vs 盲打输错反复重来的死结",
    summary:
      "密码输入框右侧必须提供一键切换可见性图标按钮，并支持清晰的无障碍语音状态说明。",
    why: "长达 16 位的复杂安全密码在移动端极易按错，如果无法看一眼确认，用户将被迫反复重置密码。",
    doText:
      "点击右侧小眼睛图标即可无缝切换为明文检查，默认再次提交时自动恢复掩码。",
    dontText: "完全不给查看密码入口，输错三次直接把账号锁定 24 小时。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android", "Windows"],
    tokensInvolved: ["semantic.color.text-tertiary"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-37-slider-live-value",
    number: 20,
    category: "Forms & Inputs",
    tags: ["Slider", "Live Value", "Tooltip", "Precision"],
    title: "拖拽时伴随精确数值气泡的滑块 vs 盲猜不知道拖到多少的黑盒滑块",
    summary:
      "滑块 (Slider) 在拖拽时必须在拇指上方呈现实时数值气泡，或在右侧附带可直接输入的数字框。",
    why: "滑块很难通过手指定位到精确数值（如刚好 85%），若没有数值回显，用户只能反复微调。",
    doText: "滑块拖动时上方弹出 “85 MB/s” 胶囊，右侧同时提供微调输入框。",
    dontText: "只有一根光秃秃的滑动条，没有任何数字刻度与数值反馈。",
    impact: "Medium",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.radius.round", "semantic.font.code"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-38-tag-input-affordance",
    number: 21,
    category: "Forms & Inputs",
    tags: ["Tags", "Tokenized Input", "Backspace", "Chips"],
    title: "结构化回车分词标签输入 vs 纯逗号分隔一长串的排版灾难",
    summary:
      "多标签录入时，按回车或逗号应立即固化为带独立删除叉号的圆角标签块，支持退格键顺次回退。",
    why: "纯文本一长串逗号极易发生全半角混淆，且无法单独删除中间的某一个标签。",
    doText:
      "输入“backend”按回车，瞬间渲染为精致的微标，点击右侧 [x] 或按退格即可移除。",
    dontText:
      "只能在文本框里输入一长串 `tag1,tag2,,tag3`，一旦逗号打错后端直接抛异常。",
    impact: "Medium",
    applicablePlatforms: ["Web", "macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.radius.small", "semantic.color.surface-subtle"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-39-file-dropzone",
    number: 22,
    category: "Forms & Inputs",
    tags: ["File Upload", "Drag & Drop", "Validation", "Feedback"],
    title:
      "具有拖拽进入高亮与格式大小实时校验的文件区 vs 抛出冷冰冰 500 的上传框",
    summary:
      "上传区域在拖入文件时应有明显的边框脉冲高亮，并在本地立即校验文件后缀与大小上限。",
    why: "如果文件超过 50MB 却允许用户花费半小时上传后才由服务端报错拒绝，会浪费大量带宽与等待时间。",
    doText:
      "拖入时边框变为深绿虚线；一旦拖入 .exe 立即红字提示：“仅支持 PDF 与 PNG 格式”。",
    dontText: "拖入没有任何反应，点击上传按钮后默默转圈 10 分钟抛出网络超时。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.accent", "semantic.radius.panel"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-40-switch-vs-checkbox",
    number: 23,
    category: "Forms & Inputs",
    tags: ["Switch", "Checkbox", "Instant vs Batch", "Semantics"],
    title:
      "区分“即时生效开关 (Switch)”与“表单待提交复选 (Checkbox)” vs 语义混淆",
    summary:
      "Switch 用于立刻改变系统运行模式（如“开启夜间模式”）；Checkbox 用于在表单中勾选若干项最后点“保存”。",
    why: "如果在一个需点击“提交”的表单里放一个 Switch，用户会误以为一拨动就已经在后台生效。",
    doText:
      "即时生效的独立设置使用 Switch；多步骤表单内的条款勾选用 Checkbox。",
    dontText: "在注册表单的“同意用户协议”处放一个 Switch 开关，语义极其别扭。",
    impact: "Medium",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.radius.round"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-41-date-picker-keyboard",
    number: 24,
    category: "Forms & Inputs",
    tags: ["Date Picker", "Keyboard Input", "Format Helper", "Calendar"],
    title: "支持直接键盘键入 YYYY-MM-DD 的日期选择器 vs 强迫点按30次翻页日历",
    summary:
      "日期选择器不仅支持日历浮窗点选，还必须允许高阶键盘用户直接在输入框按格式敲字。",
    why: "录入出生日期（如1980年）时，如果不支持键盘直接输入，用户必须在日历上往前点按 500 次翻页按钮。",
    doText: "用户可直接键入 “2026-10-09”，日历浮窗自动同心跳至该月份作为辅助。",
    dontText: "输入框设置 readonly，强制必须点开日历小格子一页一页手动翻找。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.font.code", "semantic.radius.control"],

    status: "Beta",
    visualType: "component",
  },

  // ==========================================
  // 4. FEEDBACK & STATES (7 Cases)
  // ==========================================
  {
    id: "case-05-actionable-errors",
    number: 25,
    category: "Feedback & States",
    tags: ["Error Handling", "Actionable Copy", "Recovery", "Support"],
    title: "具有可执行修复建议的人性化错误 vs 晦涩生硬的代码崩溃栈",
    summary:
      "错误信息必须说明发生了什么、为什么发生以及下一步应该怎么做，禁止直接输出原始错误代码。",
    why: "如 `Error: 0x8004100E at line 42` 这类冷冰冰的代码对用户毫无意义，不仅无法帮助他们解决问题，还会损害品牌信任。",
    doText:
      "“未能连接至同步服务器：请检查网络连接，或在5分钟后重试。[重新连接]”",
    dontText:
      "“ERR_CONNECTION_REFUSED: fetch failure at socket::bind” 伴随一个关闭按钮。",
    impact: "Critical",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.danger", "semantic.size.body"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-08-skeleton-vs-layout-shift",
    number: 26,
    category: "Feedback & States",
    tags: ["Skeleton", "CLS", "Layout Stability", "Loading"],
    title: "结构对称的占位骨架屏 vs 导致页面跳跃的突变加载",
    summary:
      "异步数据加载期间，使用与最终呈现几何尺寸一致的低对比度骨架屏，防止 CLS (Cumulative Layout Shift)。",
    why: "页面内容一旦在数据返回后发生剧烈的几何跳跃，用户原本打算点击的位置会被突然推开，极易导致严重误触。",
    doText:
      "骨架屏形状与最终卡片、文本行数完全对齐，柔和灰阶微光，布局平稳无抖动。",
    dontText:
      "屏幕正中央放一个巨大旋转菊花，数据到达瞬间几十个卡片强行插入，把整个页面往下弹开 300px。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android"],
    tokensInvolved: [
      "semantic.color.surface-subtle",
      "semantic.radius.control",
    ],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-42-toast-stacking",
    number: 27,
    category: "Feedback & States",
    tags: ["Toast", "Notifications", "Stacking", "Hover Pause"],
    title: "有序堆叠且悬停暂停计时的 Toast vs 遮盖整个屏幕的弹窗雨",
    summary:
      "Toast 产生过多时应当折叠最多显示 3 条，鼠标悬停时必须暂停 5 秒倒计时，避免还没看清就消失。",
    why: "并发产生 10 条通知时，瞬间从上到下铺满半个屏幕，用户无法阅读内容也无法点击下方按钮。",
    doText: "新通知轻柔推挤，最多常驻 3 条；鼠标移入即冻结消失计时器。",
    dontText: "一股脑弹出 12 个黑色方块像瀑布一样直插到底，完全遮蔽工作区。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.radius.control", "semantic.motion.fast"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-43-banner-dismiss",
    number: 28,
    category: "Feedback & States",
    tags: ["Banner", "Announcement", "Dismissible", "Header"],
    title:
      "可关闭且支持“不再提醒”的顶部公告横幅 vs 永久霸占首屏视口的吸顶广告条",
    summary:
      "系统通告或维护公告横幅必须提供清晰的右侧关闭按钮，并支持本地持久化记录免受重复打扰。",
    why: "用户已经阅读过版本更新通告，但每次刷新页面都死死占领顶部 60px，严重压缩工作视口。",
    doText: "公告栏右侧带有 [知道了] 和 [不再提醒]，点击后平滑向上收起。",
    dontText: "没有任何关闭按钮，死死钉在顶栏，强制占用 15% 的垂直高度。",
    impact: "Medium",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.surface-subtle", "primitive.space.2"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-44-progress-determinism",
    number: 29,
    category: "Feedback & States",
    tags: ["Progress Bar", "Indeterminate", "Linear", "Feedback"],
    title: "可预估剩余进度的确定性进度条 vs 永远在 99% 卡死不动的假进度",
    summary:
      "能计算大小的任务必须显示真实百分比与速率；无法计算的任务采用往返流光指示，绝不伪造虚假进度。",
    why: "很多软件为了让用户觉得快，在前1秒把进度条直接拉到 99% 然后卡死 3 分钟，造成极度焦虑与被欺骗感。",
    doText:
      "展示“正在下载核心依赖 42% (2.4 MB/s · 剩余 18 秒)”，数据真实透明。",
    dontText: "瞬间窜到 99% 然后卡着纹丝不动，用户以为程序已经崩溃。",
    impact: "High",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.accent", "semantic.radius.round"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-45-copy-feedback",
    number: 30,
    category: "Feedback & States",
    tags: ["Copy Button", "State Transition", "Micro-interaction", "Checkmark"],
    title: "平滑转变为勾选状态的代码复制反馈 vs 没有任何提示的静默点击",
    summary:
      "点击“复制代码”或“复制 Token”后，按钮图标必须在原位变为绿色对勾并提示“已复制”，2秒后恢复。",
    why: "若没有任何界面反馈，用户会因不确定是否成功而狂点四五次，并反复切换到记事本测试粘贴。",
    doText: "图标平滑过渡为对勾，文案变为“已复制”，给予确凿的正反馈。",
    dontText: "点了之后界面完全没有任何变化，甚至没有控制台日志。",
    impact: "Medium",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.success", "semantic.motion.instant"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-46-accordion-expansion",
    number: 31,
    category: "Feedback & States",
    tags: ["Accordion", "Disclosure", "Smooth Height", "Spring"],
    title: "平滑展开且限制单选互斥的手风琴 vs 瞬间炸开导致页面狂闪的折叠面板",
    summary:
      "折叠面板在展开时采用平滑高度阻尼动画，并允许根据配置自动折叠前一个面板，避免内容无节制拉长。",
    why: "面板内容一旦瞬间展开 800px，页面产生强烈闪烁，用户当前阅读焦点直接被挤出屏幕外。",
    doText: "高度在 200ms 内平滑过渡展开，箭头图标同心顺时针旋转 90 度。",
    dontText: "瞬间生硬闪现，连带把整个页面的滚动条拉扯到底部。",
    impact: "Medium",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.motion.fast", "semantic.motion.ease"],

    status: "Beta",
    visualType: "component",
  },

  // ==========================================
  // 5. LAYOUT & CONTENT (6 Cases)
  // ==========================================
  {
    id: "case-09-actionable-empty-states",
    number: 32,
    category: "Layout & Content",
    tags: ["Empty State", "Onboarding", "Guidance", "Call to Action"],
    title: "具有引导与创建入口的空状态 vs 荒凉冷漠的死胡同页面",
    summary:
      "空状态是引导用户开始第一步的最佳教育契机，必须配备简明说明与首要行动按钮。",
    why: "面对一个完全白屏或仅写着“暂无数据”的界面，新用户会陷入困惑，不知道是系统加载故障还是自己尚未开始。",
    doText:
      "展示精致安静的空状态插画/图标，配文字：“尚未创建任何项目。从模板快速开始，或导入既有文档。[新建第一个项目]”。",
    dontText:
      "一个纯灰色方框，居中显示“0 个结果”，没有任何创建引导或下一步建议。",
    impact: "High",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.text-secondary", "semantic.color.accent"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-17-typography-scaling",
    number: 33,
    category: "Layout & Content",
    tags: ["Dynamic Type", "Text Scale", "Accessibility", "Truncation"],
    title: "支持 Dynamic Type 与大字号缩放 vs 固定绝对像素导致内容截断",
    summary:
      "界面布局必须兼容用户系统设定的 200% 字体缩放，容器高度自适应，禁止粗暴的 overflow: hidden 截断文字。",
    why: "视力障碍用户依赖大字号浏览，若容器高度硬编码为 fixed height，字号放大后下半截文字将完全消失。",
    doText:
      "使用 min-h 与 flex-wrap 弹性流式排布，文本提供合理的换行余量与平衡折行。",
    dontText:
      "卡片高度写死 `height: 48px; overflow: hidden;`，字号稍微调大后文字直接被拦腰斩断。",
    impact: "High",
    applicablePlatforms: ["Web", "iOS", "Android", "Flutter"],
    tokensInvolved: ["semantic.size.body", "semantic.space.4"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-47-reading-measure",
    number: 34,
    category: "Layout & Content",
    tags: ["Optimal Reading Measure", "Max Width", "Line Length", "Typography"],
    title:
      "黄金 65–75 字符阅读行宽约束 (Max-w-prose) vs 全屏通栏铺满导致眼球疲劳",
    summary:
      "文章正文与长说明文本必须限制在 `max-w-2xl` 或 `65–75ch`（约 680–720px），绝不全屏 100% 拉满。",
    why: "当一行文字横跨 1920px 屏幕时，眼球在换行时极难定位到下一行的起点，阅读速度与舒适度断崖式下跌。",
    doText: "正文包裹在限制行宽的版心中，两侧保持舒缓的留白呼吸感。",
    dontText: "文字从屏幕最左边 0px 一直横排到最右边 1920px，读两行就头晕。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.space.8", "semantic.size.body"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-48-whitespace-over-cards",
    number: 35,
    category: "Layout & Content",
    tags: ["Whitespace", "Visual Clutter", "Anti-slop", "Borders"],
    title: "以克制留白与发丝线划分层级 vs 俄罗斯套娃式的“卡片套卡片”",
    summary:
      "禁止在圆角边框卡片内部再塞入三个带边框阴影的小卡片。依靠间距与 1px 细线形成自然层级。",
    why: "多层嵌套的卡片会浪费大量内边距空间，使界面充斥沉重的边框噪音，破坏整体清爽感。",
    doText: "外层单一表面承载，内部各行之间使用 1px 微弱发丝分割线优雅分隔。",
    dontText: "外卡套内卡，内卡套微卡，三层深灰边框层层嵌套像监狱铁笼。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.border", "semantic.space.4"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-49-no-orphan-words",
    number: 36,
    category: "Layout & Content",
    tags: ["Text Wrap", "Balance", "Typography", "Headlines"],
    title: "大标题平衡折行 (text-wrap: balance) vs 末尾孤零零落单的寡字",
    summary:
      "多行标题必须应用 `text-wrap: balance`，避免最后一行仅孤立遗留一个字符或词语。",
    why: "标题末尾单个字落入第二行在视觉心理学上极不平衡，破坏标题的整齐气势。",
    doText: "标题各行字符数均衡自适应折半，排版韵律工整雅致。",
    dontText: "第一行写满 25 个字，第二行只剩一个孤零零的“的”字或“器”字。",
    impact: "Medium",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.size.title"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-50-responsive-2col-balance",
    number: 37,
    category: "Layout & Content",
    tags: ["Responsive", "Grid", "Flex", "Alignment"],
    title: "两栏并排等高拉伸与智能对齐 vs 高度参差不齐的缺角断崖",
    summary:
      "桌面端并排呈现的两栏信息卡片，容器外框应使用 `items-stretch` 保持底部绝对等高对齐。",
    why: "如果左卡片高 400px，右卡片高 220px 且悬空在半截，整个网格下方会出现难看的视觉缺口。",
    doText: "两栏底部对齐，较短的一方通过内部弹性空间自动撑满高度，规整如一。",
    dontText: "左右卡片高矮不一，底部高低落差极大，看起来像残缺半成品。",
    impact: "Medium",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.space.4"],

    status: "Beta",
    visualType: "layout",
  },

  // ==========================================
  // 6. DATA & VISUALIZATION (6 Cases)
  // ==========================================
  {
    id: "case-23-data-grid-density",
    number: 38,
    category: "Data & Visualization",
    tags: ["Table", "Density", "Tabular Nums", "Alignment"],
    title: "可调节信息密度与等宽对齐数据表格 vs 拥挤混乱无对齐的字符杂烩",
    summary:
      "表格数值列使用等宽数字 (`tabular-nums`) 右对齐，文本左对齐，并支持“舒适 / 紧凑”两种密度切换。",
    why: "财务与监控表格中如果数值左对齐且使用变宽字体，用户无法通过垂直视线快速比对金额大小或小数点位置。",
    doText:
      "金额和指标使用 `font-mono tabular-nums text-right`，表头与数据精准对齐，行高支持自选。",
    dontText:
      "所有列一律居中对齐，金额数字与汉字混排，行距过于紧密导致上下行粘连。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.font.body", "semantic.color.border"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-51-chart-color-blind",
    number: 39,
    category: "Data & Visualization",
    tags: ["Charts", "Color Blind Safe", "Patterns", "Legends"],
    title: "具备纹理虚实双重区分的图表折线 vs 纯靠相似红绿难以辨识的混淆曲线",
    summary:
      "折线图或面积图多数据序列对比时，必须通过虚线、实线、数据节点形状双重区分，禁止仅靠颜色。",
    why: "色弱或打印为黑白纸质报表时，3条相同粗细的纯色线条将完全无法辨认哪条代表活跃用户。",
    doText: "序列 A 为实线圆点，序列 B 为虚线方块，图例同时标注文明样式。",
    dontText: "画了五条完全一样的纯色细线，红绿青蓝混在一起根本看不清。",
    impact: "Critical",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.info", "semantic.color.accent"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-52-table-sticky-header",
    number: 40,
    category: "Data & Visualization",
    tags: ["Table", "Sticky Header", "Z-Index", "Scroll"],
    title: "滚动时锁定表头的吸顶表格 vs 翻到第10行就忘记列名含义的盲游表格",
    summary:
      "长数据表格必须实现 `position: sticky; top: 0;` 表头吸顶，并伴随微弱的底部发丝阴影增强层次。",
    why: "当表格滚过两屏后，用户看着一堆数字不知道这是代表“CPU 使用率”还是“内存空闲率”。",
    doText: "表头柔和固定在视口顶部，即使滚动 500 行依然清晰知道每列属性。",
    dontText: "表头随着滚动直接飞出屏幕，整张表格变成无头数字矩阵。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.surface", "primitive.space.2"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-53-empty-table-filtered",
    number: 41,
    category: "Data & Visualization",
    tags: ["Table", "Filter Empty", "Reset", "Clear Filters"],
    title:
      "提示是因筛选器过滤导致无数据的引导 vs 误导用户以为数据被删库的空白表格",
    summary:
      "筛选后结果为空时，必须明确告知“在当前筛选条件下无匹配”，并提供 [清除所有筛选] 一键恢复入口。",
    why: "如果不提示是因为筛选导致，用户会误以为整张表格数据被意外清空，产生极大的心理恐慌。",
    doText: "表格居中提示：“没有符合当前筛选的项目 · [清除筛选]”。",
    dontText: "直接展示空表格框架，用户以为数据库被误删。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.text-secondary"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-54-number-formatting-locale",
    number: 42,
    category: "Data & Visualization",
    tags: ["Numbers", "Locale", "Formatting", "Thousands Separator"],
    title: "根据本地化规范格式化千分位与单位 vs 裸露难以阅读的 10 位长数字串",
    summary:
      "大额数值与指标必须格式化千分位（如 `12,450,890.00`）并在右上角清晰注明计量单位（如 `MB/s` 或 `¥`）。",
    why: "人脑无法在不数零的情况下快速识别 `100000000` 是一个亿还是十个亿。",
    doText: "使用国际化 Intl.NumberFormat 渲染为 `100,000,000`，字号清晰。",
    dontText: "直接输出原始未格式化浮点数 `12499.8943242345`。",
    impact: "Medium",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.font.code"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-55-pagination-jump",
    number: 43,
    category: "Data & Visualization",
    tags: ["Pagination", "Direct Jump", "Page Size", "Controls"],
    title:
      "支持跳转指定页码与每页行数调整的分页器 vs 只能点“下一页”翻100次的无尽折磨",
    summary:
      "超过 10 页的数据集必须提供直达页码输入框、总记录数统计及 [10/20/50条每页] 规格切换。",
    why: "若想去第 84 页，只能连点 83 次“下一页”，不仅产生巨量无谓网络请求，还极其耗费精力。",
    doText: "展示“共 1,240 条记录 · 前往 [ 84 ] 页 · 每页 [ 20 ] 条”。",
    dontText: "只有一个 `<` 和 `>`，没有任何页码输入或总条数回显。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.radius.control", "semantic.size.caption"],

    status: "Beta",
    visualType: "component",
  },

  // ==========================================
  // 7. ACCESSIBILITY (7 Cases)
  // ==========================================
  {
    id: "case-13-keyboard-focus",
    number: 44,
    category: "Accessibility",
    tags: ["Keyboard Focus", "Focus Ring", "WCAG AA", "Focus Visible"],
    title: "高对比度清晰可见的键盘焦点环 vs 粗暴 outline: none 的无障碍盲区",
    summary:
      "必须为所有交互控件实现 `focus-visible` 2px 清晰轮廓环，且不得破坏键盘 Tab 顺序。",
    why: "很多前端为了所谓的“视觉干净”直接全局设定 `outline: none`，导致依赖键盘导航的残障人士或高阶工程师完全看不到当前焦点所在。",
    doText:
      "键盘 Tab 聚焦时，控件外围呈现 2px Rosemary 深绿轮廓，鼠标点击时不额外闪烁。",
    dontText:
      "全局 `*:focus { outline: none !important; }`，用户连续按 Tab 键不知道当前游标在何处。",
    impact: "Critical",
    applicablePlatforms: ["Web", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.accent", "semantic.radius.control"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-14-touch-targets",
    number: 45,
    category: "Accessibility",
    tags: ["Touch Target", "44px", "Mobile Ergonomics", "Padding"],
    title: "符合人机工效的 44×44px 移动触控热区 vs 细小密集的误触陷阱",
    summary:
      "移动端交互控件物理可见区域可以紧凑，但点击响应热区必须通过 padding 达到至少 44×44px。",
    why: "成年人手指腹部触控面积通常为 9-11mm，在移动设备上排布小于 32px 的密集图标会导致高达 40% 的误触率。",
    doText:
      "图标本身为 20×20px，但外层包裹 padding 扩展热区至 44px，相邻按钮间距保留安全间隙。",
    dontText:
      "在移动网页端将 14px 的文本链接并排堆积在表格某一个单元格内，必须放大数倍才能点中。",
    impact: "High",
    applicablePlatforms: ["Web", "iOS", "Android", "Flutter"],
    tokensInvolved: ["primitive.space.2", "semantic.space.4"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-15-color-blind-safe",
    number: 46,
    category: "Accessibility",
    tags: ["Color Blindness", "Dual Coding", "Status Indicators", "Inclusion"],
    title: "图文双重编码（颜色+形状/文本）vs 仅依赖红绿色彩传达状态",
    summary:
      "任何具有语义的状态指示，必须同时辅以文本标签或明确的几何图标，严禁仅用绿/红圆点表达。",
    why: "全球约有 8% 的男性和 0.5% 的女性患有红绿色盲（红绿色弱），仅凭红绿颜色无法分辨“运行中”与“已故障”。",
    doText:
      "在绿色徽记旁标注“正常运行”，在红色警示旁标注明确的感叹号图标与“已断开连接”。",
    dontText:
      "表格最后一列只有一排红色和绿色的无文本圆点，无 title，无 aria-label。",
    impact: "Critical",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.danger", "semantic.color.success"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-16-theme-contrast",
    number: 47,
    category: "Accessibility",
    tags: ["Theme Contrast", "Dark Mode", "Luminance", "Halation"],
    title: "深浅主题独立调校的表面对比 vs 机械色彩反转导致的白边与灰糊",
    summary:
      "深色模式并非简单的 CSS filter: invert，而需要重新标定深墨炭色层级与文字对比度。",
    why: "纯黑背景 (#000000) 配纯白文字会产生强烈的发光眩晕（Halation effect），缺乏层次感且极其疲劳。",
    doText:
      "深色背景选用沉稳的炭墨灰 (#121614)，卡片采用微亮一层 (#181E1B)，文字选用柔和珍珠白 (#EAEFEC)。",
    dontText:
      "浅色背景全白转为纯黑 #000000，原本的深绿色直接变成刺眼的霓虹亮绿，边框变为生硬刺眼的白线。",
    impact: "High",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.canvas", "semantic.color.surface"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-56-screen-reader-announcements",
    number: 48,
    category: "Accessibility",
    tags: ["Aria-live", "Screen Reader", "Polite", "VoiceOver"],
    title: '以 aria-live="polite" 播报动态更新 vs 粗暴打断用户阅读或完全静默',
    summary:
      '异步数据刷新或 Toast 弹出时，使用 `aria-live="polite"` 允许读屏软件在当前语句结束后平缓朗读。',
    why: "使用 `assertive` 会直接切断视障用户正在听取的段落，造成严重的信息丢失与惊吓。",
    doText: '在 Toast 容器上声明 `role="status"` 和 `aria-live="polite"`。',
    dontText: '所有微小更新都设为 `aria-live="assertive"` 疯狂打断语音流。',
    impact: "Critical",
    applicablePlatforms: ["Web", "iOS", "Android", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.surface"],

    status: "Beta",
    visualType: "code",
  },
  {
    id: "case-57-dialog-focus-trap",
    number: 49,
    category: "Accessibility",
    tags: ["Dialog", "Focus Trap", "Escape Key", "Restoration"],
    title:
      "严格的模态弹窗焦点捕获与 Escape 还原 vs Tab 键跑到蒙层下方的幽灵焦点",
    summary:
      "打开 Dialog 时，Tab 键焦点必须被循环锁在弹窗内部，按 Escape 键退出，关闭后焦点恢复至原本的触发按钮。",
    why: "视障用户按 Tab 键如果一路跳到被蒙层遮挡的底层网页链接，将彻底迷失操作方向，甚至误触底层操作。",
    doText: "弹窗具有 Focus Trap，关闭后游标精准回到刚刚点击的“删除”按钮上。",
    dontText: "焦点穿透到背景页面，按 Tab 键直接在灰掉的网页底部狂跳。",
    impact: "Critical",
    applicablePlatforms: ["Web", "macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.radius.panel"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-58-icon-only-accessible-labels",
    number: 50,
    category: "Accessibility",
    tags: ["Aria-label", "Icon Button", "Accessibility", "Screen Reader"],
    title:
      "为所有纯图标按钮补足具体语义 aria-label vs 读屏器只读出“未命名按钮”",
    summary:
      '只有图标的按钮（如垃圾桶、放大镜）必须提供明确的 `aria-label="删除项目"`，严禁空标签。',
    why: "视障用户使用 VoiceOver 听到的全是“按钮，按钮，按钮”，根本不知道点击哪一个是保存哪一个是退出。",
    doText: '<button aria-label="搜索文档"><SearchIcon /></button>',
    dontText: "<button><SearchIcon /></button> 无任何文字标识。",
    impact: "Critical",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["primitive.space.2"],

    status: "Beta",
    visualType: "code",
  },

  // ==========================================
  // 8. MOTION & TRANSITIONS (5 Cases)
  // ==========================================
  {
    id: "case-18-motion-restraint",
    number: 51,
    category: "Motion & Transitions",
    tags: ["Motion", "Reduced Motion", "Vestibular", "Easing"],
    title:
      "克制微动效（<200ms）并尊重 Reduced Motion vs 炫技喧宾夺主的冗长动画",
    summary:
      "界面过渡动画仅用于交代空间关系与物理连续性，且必须检测 `prefers-reduced-motion`。",
    why: "展开详情只需要解释状态变化。900ms 的等待会拖慢阅读；用户选择减少动态效果后，示例推荐侧移除过渡，反例侧仍保留长过渡。网站的系统级减少动态效果策略优先于两侧示例。",
    doText: "详情展开使用 150ms 过渡；勾选模拟减少动态效果后，直接呈现新状态。",
    dontText: "同一详情展开使用 900ms 过渡，而且忽略示例中的减少动态效果开关。",
    impact: "High",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.motion.fast", "semantic.motion.ease"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-59-compositor-only-animations",
    number: 52,
    category: "Motion & Transitions",
    tags: ["Compositor", "Performance", "Transform", "Opacity"],
    title:
      "仅对 GPU 硬件加速属性 (transform/opacity) 动效 vs 动画触发布局重排 (reflow)",
    summary:
      "位移反馈优先使用 transform，避免不必要的布局计算。若任务确实需要尺寸变化，应测量布局成本，而非把所有尺寸动效一律禁止。",
    why: "transform 位移通常可避免布局计算；margin-left 会参与布局。实际合成和帧率取决于浏览器及场景，本小样不宣称已经测得 CPU 或 GPU 性能差异。",
    doText: "点击移动预览，用 transform: translateX 在轨道内移动标记。",
    dontText:
      "同样的标记通过 margin-left 及较长过渡移动，增加不必要的布局依赖。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android"],
    tokensInvolved: ["semantic.motion.ease"],

    status: "Beta",
    visualType: "code",
  },
  {
    id: "case-60-shared-element-transition",
    number: 53,
    category: "Motion & Transitions",
    tags: ["Shared Element", "Continuity", "Context", "Smooth Transition"],
    title: "平滑空间连续性的共享元素卡片放大 vs 突兀生硬的撕裂式白屏跳切",
    summary:
      "展开文件时保留标识、标题和位置关系；动效辅助理解，不应成为读懂详情的前提。",
    why: "保留原有文件标识能减少重新辨认。推荐侧使用克制的尺寸与表面过渡，反例侧直接改变布局；这里不模拟原生 Hero 动画或测量辨认耗时。",
    doText: "打开文件后仍可看见同一图标和标题，容器通过共享过渡展开说明。",
    dontText: "同一容器直接切换展开布局，缺少状态变化的过渡线索。",
    impact: "Medium",
    applicablePlatforms: ["Flutter", "iOS", "Android", "Web"],
    tokensInvolved: ["semantic.motion.settle"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-61-instant-button-press",
    number: 54,
    category: "Motion & Transitions",
    tags: ["Feedback", "Instant Latency", "Pressed State", "Haptics"],
    title: "按下瞬间立即可感知的按下沉降 feedback vs 延迟半秒才反应的迟钝按钮",
    summary:
      "按下时立即提供视觉反馈，点击后展示保存结果。反馈可以是颜色或微小形变；减少动态效果时保留颜色与结果文本。",
    why: "如果按下后毫无即时物理反馈，用户会误以为没点中而下意识用力猛点第二次。",
    doText:
      "按下瞬间立即触发 `:active { transform: scale(0.98); }`，指尖感应直接。",
    dontText: "按钮移除按下态视觉变化；尽管点击计数更新，按住时缺少即时确认。",
    impact: "High",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.motion.instant"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-62-skeleton-shimmer-calm",
    number: 55,
    category: "Motion & Transitions",
    tags: ["Skeleton", "Shimmer", "Calm Motion", "Breathing"],
    title: "低对比度温和呼吸的骨架屏流光 vs 高速闪烁刺目的跑马灯",
    summary:
      "加载占位优先使用低强度明度变化，避免反复位移；减少动态效果时使用静态轮廓。",
    why: "加载反馈需要传达正在等待，无需持续吸引视线。反例的更大位移增加干扰；本页不制作危险频闪来展示差异。",
    doText: "从浅灰到微白平滑循环，节奏沉稳如呼吸。",
    dontText: "骨架整体带有更明显的反复位移，等待状态额外争夺注意力。",
    impact: "Medium",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android"],
    tokensInvolved: ["semantic.color.surface-subtle"],

    status: "Beta",
    visualType: "component",
  },

  // ==========================================
  // 9. PLATFORM BEHAVIOR (5 Cases)
  // ==========================================
  {
    id: "case-22-permission-timing",
    number: 56,
    category: "Platform Behavior",
    tags: ["Permissions", "Just-in-Time", "Contextual Prompt", "Trust"],
    title: "在触发具体功能时说明理由并申请权限 vs 刚启动应用时暴力权限弹窗轰炸",
    summary:
      "只有在用户实际点击“扫描二维码”或“导出到本地文件”时，才在上下文内先展示由 Rosemary 控制的前置意图说明，再拉起系统原生授权。",
    why: "用户刚打开 App 还没看到任何界面，就连续弹出摄像头、麦克风、通讯录三连授权，90% 的用户会选择直接拒绝或卸载。",
    doText:
      "当用户点击“拍摄头像”时，先显示：“Rosemary 需要访问您的相机以拍摄个人头像。[继续使用相机]”。",
    dontText: "首次打开欢迎页面时，瞬间同时弹出 4 个原生系统权限确认框。",
    impact: "High",
    applicablePlatforms: [
      "iOS",
      "Android",
      "Flutter",
      "Web",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.radius.panel", "semantic.color.accent"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-24-platform-conventions",
    number: 57,
    category: "Platform Behavior",
    tags: ["Platform Conventions", "Gestures", "Back Behavior", "HIG"],
    title: "尊重原生平台手势与物理习惯 vs 强行在全部平台套用单一假原生控件",
    summary:
      "Rosemary 跨平台设计共享视觉基因与设计令牌，但在返回手势、菜单栏和导航物理行为上坚决尊重平台习惯。",
    why: "在 iOS 上强行禁止滑动返回手势、或在 Android 上把底栏硬搬到顶部并违背系统返回按键，会让熟悉本系统设备的用户感到极其反感。",
    doText:
      "iOS 支持全屏右滑返回边缘手势；Android 接入系统 Predictive Back 动画；macOS 接入系统顶部菜单栏。",
    dontText:
      "使用自定义画笔在 iOS 上强行绘制 Android 原生三键导航栏，破坏操作预期。",
    impact: "Critical",
    applicablePlatforms: ["Flutter", "iOS", "Android", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.accent", "semantic.radius.control"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-63-window-drag-region",
    number: 58,
    category: "Platform Behavior",
    tags: ["Desktop", "Window Titlebar", "macOS Traffic Lights", "Draggable"],
    title: "桌面端预留合规窗口拖拽区与避让红绿灯 vs 控件铺满导致无法移动窗口",
    summary:
      "macOS 与 Windows 桌面端自定义标题栏时，左侧必须预留 80px 避让红绿灯，并留出清晰的 `-webkit-app-region: drag` 拖拽空间。",
    why: "如果把输入框或按钮直接铺满标题栏，用户想拖拽移动窗口时会误点各种按钮而无法抓取窗口。",
    doText: "标题栏顶部拥有明确的无交互拖拽带，红绿灯区域周围 16px 留白。",
    dontText: "把搜索框直接顶到窗口最左上角，把系统红绿灯按钮完全遮挡或吞噬。",
    impact: "Critical",
    applicablePlatforms: ["macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.space.4"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-64-haptics-discipline",
    number: 59,
    category: "Platform Behavior",
    tags: ["Haptics", "Vibration", "Physical Feedback", "Restraint"],
    title:
      "在关键边界与开关触发适度轻触感 vs 每一个微小滚动都疯狂震动的电量杀手",
    summary:
      "触觉反馈 (Haptics) 仅在开关翻转、滑块撞击最值边缘、操作成功/失败时刻触发一次轻微顿挫。",
    why: "肆意泛滥的马达震动不仅会迅速耗尽设备电池，还会给手部神经带来持续疲惫与厌烦。",
    doText:
      "Switch 开关拨动完成时触发一次 Light Impact；滑块到达 100% 触发一次 Selection Feedback。",
    dontText: "手指在屏幕上每滑过 1 个像素马达就嗡嗡震动一次。",
    impact: "Medium",
    applicablePlatforms: ["iOS", "Android", "Flutter"],
    tokensInvolved: ["semantic.motion.instant"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-65-context-menu-native-feel",
    number: 60,
    category: "Platform Behavior",
    tags: ["Context Menu", "Right Click", "Long Press", "Native"],
    title: "桌面端右键呼出精准对齐鼠标位置的上下文菜单 vs 强行弹全屏居中弹窗",
    summary:
      "在表格行或文件项上右键（或移动端长按）时，应在光标就近位置唤出紧凑的 Context Menu，并具备自适应视口防越界。",
    why: "右键点击一条数据却在屏幕正中间弹出一个巨大的全屏蒙层，完全破坏了局部上下文操作的连贯性。",
    doText: "菜单紧贴鼠标右下方升起，若贴近屏幕底边则自动向上翻转展开。",
    dontText: "右键无论点哪里，都必须跳转新页面或弹出居中模态遮罩。",
    impact: "High",
    applicablePlatforms: ["Web", "macOS", "Windows", "Flutter"],
    tokensInvolved: ["semantic.radius.control", "semantic.color.surface"],

    status: "Beta",
    visualType: "component",
  },

  // ==========================================
  // 10. SYSTEM RESILIENCE (5 Cases)
  // ==========================================
  {
    id: "case-06-undo-vs-instant-loss",
    number: 61,
    category: "System Resilience",
    tags: ["Undo", "Destructive", "Trash", "Safety Net"],
    title: "轻量快速操作搭配“撤销”机制 vs 每次都弹窗确认或完全不可逆",
    summary:
      "对于低风险可恢复操作（如归档、移入回收站），优先采用即时执行并在底部弹出“撤销 (Undo)”悬浮条；仅对彻底删除实施二次确认。",
    why: "无处不在的“您确定要执行吗？”弹窗会导致用户产生警觉疲劳，从而不加思考地点击“确定”，真正危险时反而起不到保护作用。",
    doText:
      "删除笔记后立即移入回收站，屏幕底部浮现：“已移入废纸篓 · 5秒内 [撤销]”。",
    dontText:
      "毫无防备地直接 `DELETE /api/item`，或者连勾选一个待办事项都要弹窗询问两次。",
    impact: "Critical",
    applicablePlatforms: [
      "Web",
      "Flutter",
      "iOS",
      "Android",
      "macOS",
      "Windows",
    ],
    tokensInvolved: ["semantic.color.surface", "semantic.motion.fast"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-07-autosave-states",
    number: 62,
    category: "System Resilience",
    tags: ["Autosave", "Drafts", "Persistence", "Silent Save"],
    title: "静默自然的状态指示 vs 隐藏失败风险的静默黑盒",
    summary:
      "自动保存必须有明确而安静的状态流转：正在保存... → 已保存到云端 12:40 → 保存失败（可重试）。",
    why: "如果用户不知道系统是否保存了内容，会反复按下 Ctrl+S 或不敢离开页面；一旦后台网络故障而前端未报警，会导致数小时成果丢失。",
    doText:
      "顶部工具栏以低调文字显示“已保存 10:28”；断网时以温和琥珀色提示“离线暂存中，已保留本地草稿”。",
    dontText:
      "完全没有保存状态展示；在网络失败时直接静默丢弃更改，用户刷新后内容全无。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.text-secondary", "semantic.color.warning"],

    status: "Beta",
    visualType: "component",
  },
  {
    id: "case-12-overlay-selection",
    number: 63,
    category: "System Resilience",
    tags: ["Overlays", "Dialog vs Sheet vs Popover", "Modality"],
    title:
      "依据交互上下文精准选择 Dialog、Sheet 与 Popover vs 滥用全局居中模态弹窗",
    summary:
      "轻量瞬态操作使用 Popover，多字段复杂表单使用右侧 Sheet（侧滑抽屉），仅极高专注度/中断式决策使用居中 Dialog。",
    why: "若每一个微小选择（如选择标签颜色）都弹出一个巨大的全屏居中蒙层遮盖全局，用户的上下文记忆会被严重打断。",
    doText:
      "筛选面板在桌面端以 Popover 下拉展示，在移动端以底部半屏 Bottom Sheet 承载；危险确认使用居中 Dialog。",
    dontText:
      "点击列表某一行的“修改备注”，突然跳出全屏深黑背景模态弹窗，把原本参照的表格全部挡死。",
    impact: "High",
    applicablePlatforms: ["Web", "iOS", "Android", "macOS", "Windows"],
    tokensInvolved: ["semantic.radius.panel", "semantic.motion.settle"],

    status: "Beta",
    visualType: "layout",
  },
  {
    id: "case-20-long-running-tasks",
    number: 64,
    category: "System Resilience",
    tags: [
      "Long-running Tasks",
      "Background Process",
      "Cancellation",
      "Progress",
    ],
    title: "具有明确进度与可取消机制的后台任务 vs 假死无响应的黑盒界面",
    summary:
      "耗时超过 2 秒的操作必须展示确定性进度条或分阶段步骤提示，并允许用户转入后台运行或取消。",
    why: "没有任何进度指示的长时间加载会让用户误以为程序已崩溃冻结，促使他们强行杀死进程或重复点击提交造成数据脏写。",
    doText: "展示“正在导出数据 45/100 · 剩余约 12 秒 [转入后台继续] [取消]”。",
    dontText:
      "界面锁死成全灰状态，只有一个转圈圈图标，鼠标显示等待，卡顿3分钟无任何反馈。",
    impact: "Critical",
    applicablePlatforms: ["Web", "Flutter", "macOS", "Windows"],
    tokensInvolved: ["semantic.color.info", "semantic.radius.round"],

    status: "Beta",
    visualType: "flow",
  },
  {
    id: "case-21-offline-resilience",
    number: 65,
    category: "System Resilience",
    tags: ["Offline", "Local Queue", "Sync", "Network Recovery"],
    title: "温和离线感知与平滑队列重试 vs 断网瞬间突发崩溃报错",
    summary:
      "网络异常时，将写入操作暂存本地离线队列，顶部浮动微弱通知条，网络恢复时自动静默回填同步。",
    why: "移动设备在电梯或地铁中经常出现瞬时网络丢包，如果每次微小请求失败都弹全屏错误打断用户，将使软件不可用。",
    doText:
      "“离线模式：您的修改已保存在本地，将在网络恢复后自动同步 [立即检查连接]”。",
    dontText:
      "网络稍有抖动立即弹大红框拦截屏幕，阻止用户输入，甚至将未提交内容全部清空。",
    impact: "High",
    applicablePlatforms: ["Web", "Flutter", "iOS", "Android"],
    tokensInvolved: ["semantic.color.warning", "semantic.radius.control"],

    status: "Beta",
    visualType: "flow",
  },
];
