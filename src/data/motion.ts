import { COMPONENT_SPECS } from "./componentsSpec";
export type MotionRule = {
  feedback: string;
  enter: string;
  exit: string;
  interrupt: string;
  reduced: string;
};
const groups: [string[], MotionRule][] = [
  [
    [
      "button",
      "icon-button",
      "button-group",
      "split-button",
      "link-button",
      "floating-action-button",
    ],
    {
      feedback:
        "颜色 120ms；独立实体按钮按压 80ms，最多缩小至 0.98；文字、导航与行操作保持位置稳定。",
      enter: "静态",
      exit: "静态",
      interrupt: "状态立即生效；连续按压从当前状态衔接。",
      reduced: "取消缩放，保留明确颜色与可访问名称。",
    },
  ],
  [
    [
      "text-field",
      "text-area",
      "password-field",
      "search-field",
      "number-field",
    ],
    {
      feedback:
        "边框、底色 120ms；焦点轮廓立即出现；文字、光标与数值立即更新。",
      enter: "静态",
      exit: "静态",
      interrupt: "不延迟输入、验证、搜索或密码显示。",
      reduced: "边框与错误文字立即更新，无位移。",
    },
  ],
  [
    ["checkbox", "radio", "switch"],
    {
      feedback:
        "原生选中立即生效；复选勾选标记缩放/明度或开关位置 150ms，取消也平滑恢复。",
      enter: "静态",
      exit: "静态",
      interrupt: "可随时反向切换，不排队播放。",
      reduced: "标记和开关直接到达真实状态。",
    },
  ],
  [
    ["slider", "resizable-panels"],
    {
      feedback:
        "指针、键盘、数值与布局直接跟随，无尾随与回弹；滑块悬停有淡强调环，按压 80ms 明确加强。",
      enter: "静态",
      exit: "静态",
      interrupt: "释放立即停止；范围限制持续有效。",
      reduced: "保持同样的精确操作。",
    },
  ],
  [
    ["select", "popover", "dropdown-menu", "context-menu"],
    {
      feedback: "高亮颜色 120ms，选择立即生效。",
      enter: "180ms 淡入，最多 4px；沿实际锚点方向。",
      exit: "120ms 淡出；立即 inert、停止辅助技术访问。",
      interrupt: "再次打开取消旧退场；Escape、外部点击即时响应。",
      reduced: "直接显示/关闭，保留选中、高亮和焦点恢复。",
    },
  ],
  [
    ["combo-box", "date-picker", "time-picker", "color-picker"],
    {
      feedback: "字段使用 120ms 颜色反馈；原生选择器保留系统动效。",
      enter: "原生选择器由平台控制",
      exit: "原生选择器由平台控制",
      interrupt: "保持浏览器输入、确认与取消行为。",
      reduced: "网页字段取消过渡；原生选择器遵循系统能力。",
    },
  ],
  [
    ["file-upload"],
    {
      feedback: "拖入区域边界与底色 120ms；校验结果立即显示。",
      enter: "静态",
      exit: "静态",
      interrupt: "离开/放下立即结束拖入状态；不伪造上传进度。",
      reduced: "直接显示边界和文字结果。",
    },
  ],
  [
    ["tabs", "segmented-control"],
    {
      feedback: "共享指示器位置/宽度 150ms；Tabs 内容 240ms / 12px 方向过渡。",
      enter: "沿实际选项顺序短距离进入，不保留第二份可操作内容",
      exit: "内容立即替换",
      interrupt: "连续切换只前往最新选项，键盘焦点立即更新。",
      reduced: "指示器与内容立即更新。",
    },
  ],
  [
    [
      "breadcrumb",
      "sidebar",
      "top-navigation",
      "bottom-navigation",
      "pagination",
      "stepper",
    ],
    {
      feedback:
        "当前位置与控件颜色 120ms；同级内容沿实际顺序短距离过渡；页面先 80ms 退出，再 180ms 进入。",
      enter:
        "网站页面总计 260ms 关联切换；详情 / 返回按真实层级反向；移动导航采用面板规范",
      exit: "静态",
      interrupt:
        "导航、历史返回、焦点和状态立即生效；快速导航跳过上一段，章节定位不制造页面过渡。",
      reduced: "页面与状态立即更新；无快照 / 位移，章节跳转不平滑滚动。",
    },
  ],
  [
    ["dialog", "alert-dialog", "command-palette"],
    {
      feedback: "字段与结果继承共享状态反馈。",
      enter: "180ms 淡入，最多 8px；遮罩同步。",
      exit: "120ms 淡出；立即关闭原生模态与恢复焦点。",
      interrupt: "重开从当前状态衔接；确认不等待退场。",
      reduced: "直接显示/关闭；状态、焦点与结果保留。",
    },
  ],
  [
    ["sheet", "drawer"],
    {
      feedback: "内部控件继承共享反馈。",
      enter: "280ms 沿所属边缘进入，24px 位移，无回弹。",
      exit: "120ms 原方向退出",
      interrupt: "关闭/重开可中断；当前参考不包含手势释放动画。",
      reduced: "直接显示/关闭，保留模态和焦点行为。",
    },
  ],
  [
    ["toast", "snackbar", "banner"],
    {
      feedback: "通知只在真实操作后出现，撤销立即生效。",
      enter: "180ms 淡入；Banner 占位 240ms 展开。",
      exit: "通知 120ms 淡出，Banner 240ms 收起；立即停止交互与播报。",
      interrupt: "重新显示取消退场；通知没有强制阅读时限。",
      reduced: "直接显示/移除，文字和撤销操作保留。",
    },
  ],
  [
    ["progress", "skeleton", "spinner"],
    {
      feedback:
        "真实进度用 150ms 衔接；暂停/重置即时。Skeleton 默认静态；Spinner 仅表示等待，1000ms 匀速旋转。",
      enter: "静态，不重复播放成功动画",
      exit: "完成立即替换",
      interrupt: "隐藏页面暂停旋转；暂停任务不伪造进度。",
      reduced: "停止旋转，保留静态加载标记、文字及真实百分比。",
    },
  ],
  [
    ["tooltip"],
    {
      feedback: "悬停/键盘焦点等待 300ms；触控使用控件名称与可见结果。",
      enter: "180ms 淡入，无位移",
      exit: "120ms 淡出；鼠标离开/失焦即时取消计时和语义可见性。",
      interrupt: "Escape 可取消待显示及已显示说明；重新进入恢复。",
      reduced: "保留 300ms 防误触等待，直接显示/隐藏说明。",
    },
  ],
  [
    ["accordion", "tree-view"],
    {
      feedback:
        "原生 details 的内容高度 240ms、明度 150ms；不改变原生展开语义。",
      enter: "沿父级展开；不逐行错峰",
      exit: "同方向收起",
      interrupt: "快速反向从当前高度继续；不支持插值的引擎保留原生即时展开。",
      reduced: "直接展开/收起，层级关系保留。",
    },
  ],
  [
    ["scroll-area"],
    {
      feedback: "滑块透明度 120ms；位置、滚轮、拖动直接跟随。",
      enter: "静态",
      exit: "静态",
      interrupt: "不添加自定义惯性，不改变内容滚动。",
      reduced: "滑块反馈立即变化，正常滚动保留。",
    },
  ],
  [
    ["table", "data-grid", "list", "file-row"],
    {
      feedback: "选中、行操作和底色 120ms；数据更新立即生效。",
      enter: "静态，不批量飞入",
      exit: "数据立即更新",
      interrupt: "筛选排序不等待动画；不移动阅读中的整张表格。",
      reduced: "直接更新，保留选择和操作结果。",
    },
  ],
  [
    [
      "description-list",
      "badge",
      "tag",
      "avatar",
      "card",
      "divider",
      "empty-state",
      "metric-card",
      "prober-status",
    ],
    {
      feedback: "静态信息保持稳定；状态色 150ms，真实操作继承按钮反馈。",
      enter: "静态",
      exit: "静态",
      interrupt: "不自动滚数、不呼吸、不将静态卡片伪装成可点击。",
      reduced: "状态文字、标记与操作即时有效。",
    },
  ],
];
export const MOTION_RULES: Record<string, MotionRule> = Object.fromEntries(
  groups.flatMap(([ids, rule]) => ids.map((id) => [id, rule])),
);
export const MOTION_CATALOGUE = COMPONENT_SPECS.map((spec) => ({
  id: spec.id,
  name: spec.name,
  ...MOTION_RULES[spec.id],
}));
