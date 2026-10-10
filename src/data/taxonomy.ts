export const CASE_CATEGORIES = [
  { id: "Navigation", label: "导航与层级" },
  { id: "Actions", label: "操作与意图" },
  { id: "Forms & Inputs", label: "表单与输入" },
  { id: "Feedback & States", label: "反馈与状态" },
  { id: "Layout & Content", label: "布局与内容" },
  { id: "Data & Visualization", label: "数据与可视化" },
  { id: "Accessibility", label: "无障碍" },
  { id: "Motion & Transitions", label: "动效与过渡" },
  { id: "Platform Behavior", label: "平台行为" },
  { id: "System Resilience", label: "容灾与恢复" },
] as const;
export const COMPONENT_CATEGORIES = [
  { id: "Actions", label: "操作" },
  { id: "Inputs", label: "输入" },
  { id: "Navigation", label: "导航" },
  { id: "Data Display", label: "数据展示" },
  { id: "Feedback", label: "反馈" },
  { id: "Overlays & Menus", label: "浮层与菜单" },
  { id: "Layout & Disclosure", label: "布局与展开" },
] as const;
export const PLATFORMS = [
  "Web",
  "Flutter",
  "iOS",
  "macOS",
  "Android",
  "Windows",
] as const;
