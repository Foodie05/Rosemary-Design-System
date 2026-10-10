/** What each live reference really supports; the spec's remaining variants are design targets. */
export const IMPLEMENTATION_NOTES: Record<string, string> = {
  button:
    "五种语义变体、三种尺寸、禁用、加载和点击反馈；原生 button。图标布局在状态矩阵中演示。",
  "icon-button":
    "具名图标按钮，点击打开搜索字段；尺寸、语义变体和禁用可调。包含延迟显示、Escape 关闭的 Tooltip。",
  "button-group":
    "日 / 周 / 月互斥选择，aria-pressed 和结果反馈；按钮组共享边界。",
  "split-button":
    "默认导出和更多格式是两个独立入口；格式选择给出本地反馈。当前弹层为按钮列表。",
  "link-button": "文字外观的页面内业务动作，展开使用说明；页面跳转需使用 a。",
  "floating-action-button":
    "具名新建按钮和创建计数；页面定位与安全区由应用布局决定。",
  "text-field": "持久标签、原生输入、提交验证、帮助关联、错误和禁用配置。",
  "text-area": "原生多行输入、提交验证与垂直调整；未实现按内容自动增长。",
  "password-field":
    "原生密码输入、显示 / 隐藏切换、aria-pressed 和验证；反馈不泄露明文。",
  "search-field":
    "原生搜索输入和三个本地记录的即时过滤；浏览器提供原生清除行为，无网络防抖。",
  "number-field": "原生 number 输入、0–99 约束；产品须在提交时处理业务范围。",
  checkbox: "原生二元复选框和选择结果；半选状态是规范目标，未在此参考实现。",
  radio: "具名原生互斥组，浏览器处理方向键和选中状态。",
  switch: "即时生效的二元开关与明确结果；遵循原生键盘行为。",
  slider:
    "共享 Slider 保留原生 range、0–100 数值、实时 output 和键盘调整；未实现浮动数值气泡。",
  select:
    "共享 Rosemary 单选列表，桌面与手机使用相同外观；方向键高亮、输入定位，Enter / Space 确认，Escape 放弃未确认选择。",
  "combo-box":
    "原生 datalist 的建议输入参考；大型列表过滤和完整自定义 ARIA 模型待实现。",
  "date-picker": "原生 date 输入；日期格式、日历弹层与区域显示由浏览器提供。",
  "time-picker": "原生 time 输入；12 / 24 小时显示由浏览器及系统区域决定。",
  "file-upload": "点击或拖入文件，本地类型 / 2 MB 校验；不上传到服务器。",
  "color-picker":
    "原生 color 控件与当前颜色回显；没有独立 RGB / HEX 自定义校验器。",
  tabs: "自动激活 Tabs；Tab、左右方向键、Home / End、aria-controls 与对应面板。",
  "segmented-control":
    "三种视图模式、aria-pressed 和结果反馈；选中填充平滑切换，内容立即更新并短距离过渡。",
  breadcrumb:
    "真实首页与组件库链接、nav / ol 结构；当前页为不可点击文字，父项直接跳转网站页面。",
  sidebar: "三个主入口与内容切换；折叠与移动抽屉见案例和网站导航实现。",
  "top-navigation":
    "顶部导航的三个入口和内容切换；具体品牌 / 搜索位置由应用决定。",
  "bottom-navigation": "三个高频入口和内容切换；应用应额外处理设备 safe-area。",
  pagination: "前后页、直接页码、每页条数；改变条数时回到第一页。",
  stepper: "三步状态、当前步骤和前序回溯；不能跳过未完成步骤。",
  "command-palette":
    "原生模态命令框、关键词过滤、执行反馈；全站 Cmd/Ctrl+K 搜索另由 CommandSearch 实现。",
  table:
    "真实 table 表头、文件大小排序和 aria-sort；大量数据和粘性表头见关联案例。",
  "data-grid":
    "原生表格、多选和批量归档；虚拟化、拖列、冻结及完整 grid 键盘模型待实现。",
  list: "可选择的文件列表和当前项反馈；真实打开行为由产品提供。",
  "description-list": "原生 dl / dt / dd 键值结构与文字同步状态。",
  "tree-view":
    "原生 disclosure 展开目录；不是完整 ARIA tree，方向键模型尚未实现。",
  badge: "状态 / 数字徽标的静态参考；使用文字与图形共同说明状态。",
  tag: "分类标签可以移除，并能通过重置恢复；可交互删除具备名称。",
  avatar: "文字身份占位参考；远程图片加载和失败回退尚未接入。",
  dialog: "原生 showModal、Tab 焦点循环、Escape、焦点恢复、编辑与确认反馈。",
  "alert-dialog":
    "具名原生 alertdialog 与明确移除确认；这里是可恢复回收站模拟，没有输入名称解锁。",
  sheet:
    "原生模态侧滑面板，具备焦点限制、Escape 与编辑确认；移动底部手势适配待完成。",
  toast: "最多三条保存反馈，可手动关闭；不自动消失，不限制阅读时间。",
  snackbar:
    "保存会更新本地文档版本；撤销恢复上一版本。较早操作在后续保存被撤销后才能恢复，通知不设阅读时限。",
  banner: "公告可以稍后处理，并能恢复显示；不操作系统更新。",
  progress: "真实定时进度、暂停 / 继续、取消重置和完成反馈；本地任务模拟。",
  skeleton: "静态结构占位、aria-busy 说明；产品应匹配实际内容的最终几何。",
  spinner: "有文字的加载状态；系统减少动态效果时保留文字并停止旋转。",
  tooltip:
    "悬停 / 键盘焦点 300ms 后显示说明，Escape 关闭；保存动作有可见反馈。触控设备验证仍待完成。",
  popover:
    "披露按钮展开关联信息；浮层距离触发器 8px，空间不足时调整位置。确认应用筛选，Escape 放弃草稿并恢复焦点。",
  "dropdown-menu":
    "可展开的操作按钮列表与反馈；完整 menu / menuitem 方向键模型待实现。",
  "context-menu":
    "右键在指针附近打开，键盘 / 按钮入口贴合触发器；浮层避开视口边缘，关闭恢复焦点。完整菜单方向键模型及长按待实现。",
  drawer: "原生模态属性抽屉；焦点限制、Escape 和关闭后恢复。",
  card: "内容、状态和收藏动作组合；容器本身没有虚假点击语义。",
  accordion: "原生 details / summary，支持互斥展开与浏览器键盘操作。",
  divider: "原生 hr 划分段落，不为纯装饰增加操作。",
  "empty-state": "创建第一篇笔记的本地模拟，并可恢复空状态。",
  "scroll-area":
    "可聚焦滚动 region，保留原生键盘、滚轮与触控滚动；全站采用透明轨道、4px 淡色自绘滑块，支持拖动及滚动条键盘操作；高对比模式回退原生。",
  "resizable-panels":
    "Pointer 拖动、范围输入及左右键调整；20–60% 限制和 separator 数值语义。",
  "metric-card": "有数值、趋势和 SVG 火花线的静态指标；不表示实时接入的数据。",
  "prober-status": "可切换健康、检查中和失败状态；图文编码，没有真实网络探针。",
  "file-row": "文件移除和恢复的本地模拟；双击预览与持久化同步尚未实现。",
};
