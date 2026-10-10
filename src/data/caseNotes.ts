import type { DoDontCategory } from "../types";
const notes: Record<DoDontCategory, string> = {
  Navigation:
    "Web 的页面层使用浏览器历史和可直接访问的链接；本页小样在内存中模拟路径。iOS 保留系统返回手势，Android 保留返回栈；桌面允许键盘导航。不同视图是否保留筛选、选中与滚动，应在产品中明确记录。",
  Actions:
    "确认操作的位置需服从平台习惯和阅读方向。桌面支持 Enter / Space 及菜单快捷键；触控优先 44px 目标。Android FAB 仅用于核心创建任务，桌面不应机械照搬悬浮定位。",
  "Forms & Inputs":
    "使用浏览器或系统原生输入、自动填充、键盘和选择器。标签与错误必须关联；移动软键盘不遮住修复位置。日期、数字和密码显示的区域与安全策略由平台决定。",
  "Feedback & States":
    "桌面和 Web 使用可读状态与温和 live region；移动端尊重系统通知与辅助技术。可操作的通知不应短暂消失。此处任务和通知是本地模拟，后台执行与持久化需产品接入。",
  "Layout & Content":
    "Web 根据容器重排，正文按用户缩放保持完整。Apple 使用 Dynamic Type，Android 使用 sp，Windows 跟随文字缩放。高密度桌面工具可以收紧布局，但不能让正文或触控入口不可用。",
  "Data & Visualization":
    "数据格式跟随区域设置，数字明确单位。桌面表格允许精密列操作；触控需保留可见动作和滚动范围。图表同时使用图例、线型与文字，表格是辅助技术可访问的数据替代。",
  Accessibility:
    "Web 优先原生 HTML 语义；Apple / Android / Windows 使用各自辅助技术接口。焦点、朗读顺序、缩放与触控需在设备实测；本页读屏说明是预期行为，不等于已完成设备认证。",
  "Motion & Transitions":
    "网站通过 prefers-reduced-motion 停止位置、旋转与脉冲动画；Apple、Android、Windows 读取对应系统偏好。减少动态效果时仍保留文字、选择和任务状态。小样中的开关用于对比，不改变系统设置。",
  "Platform Behavior":
    "本页只在 Web 比较平台界面结构和事件，不控制原生窗口、不弹系统权限，也不调用触觉硬件。落地产品必须采用目标平台 API 并进行真实设备验证。",
  "System Resilience":
    "本页使用内存状态机。Web 产品可采用 IndexedDB 队列；Flutter / 原生产品采用各自本地存储与后台任务机制。持久化、幂等写入、冲突合并及进程重启恢复需要产品实现与测试。",
};
const exceptions: Record<number, string> = {
  4: "本例验证邮箱，Do 在 blur / 提交时显示字段错误，Don’t 只在提交时给笼统反馈。复杂表单不应逐字触发错误；提交失败时定位第一项错误，并保留输入。",
  6: "这里比较可恢复移除与反复确认。真正不可逆的数据销毁仍需符合平台规范的明确确认；本例没有操作真实文件或回收站。",
  7: "Saved、Saving、Offline、Failed 和 Retry 均是模拟状态；“已保存”表示模拟完成，刷新后草稿不会保留。真实产品需区分本地草稿与服务器确认。",
  17: "本例可调文字到 200%；产品还需验证浏览器缩放及系统大字。不能依靠固定高度截断关键字段，也不能要求用户关闭系统缩放。",
  22: "只有用户主动使用需要权限的功能时才解释用途。系统权限弹层不能自绘仿冒；拒绝后保留正常的替代路径，不反复索取。",
  24: "原生返回、手势、安全区及桌面窗口框架由宿主实现。这里只是结构对照；这些行为不能由截图或一个 Web 按钮证明。",
  57: "Web Do 使用原生 showModal、Escape 和焦点恢复；Don’t 是普通浮层，故意没有模态边界。原生平台使用系统模态机制，保持辅助技术与取消习惯。",
  63: "桌面原生实现需把交互控件排除在 drag region 外，并保留系统窗口按钮。本 Web 对照没有真实窗口拖动能力。",
  64: "触觉时间线只计数模拟事件；不会振动设备。应使用原生 API、遵守设备和系统偏好，并保留非触觉反馈。",
  65: "保留可见更多入口以服务键盘与触控用户。此参考是普通按钮披露层，完整 ARIA menu 方向键模型及移动长按仍为 Candidate。",
};
export function casePlatformNote(category: DoDontCategory, id: string) {
  return [
    notes[category],
    exceptions[Number(id.match(/^case-(\d+)-/)?.[1])],
  ].filter(Boolean);
}
