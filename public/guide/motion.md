# Rosemary 动效规范

版本：2.0.0-beta.1。实施日期：2026-10-10。网站外壳、文档、Playground 与共享 Web 组件均消费同一套语义参数。

## 设计原则

1. **及时响应**：输入、拖动、业务结果、确认、取消、焦点和可访问状态立即更新。动效不能成为等待条件。
2. **有意义才移动**：解释选择、空间关系和出现/消失；文字、导航、表格内容保持稳定。静态也是明确的设计决定。
3. **连续且可中断**：反向操作从当前视觉状态衔接，取消旧退场定时器；不排队，不强制看完整段动画。
4. **克制且一致**：小幅度、减速收尾；不弹跳、呼吸、滚数、滚动触发的内容飞入或视差。页面切换按真实层级关联，历史返回保持相反方向。
5. **用户掌控**：实时尊重系统减少动态效果；页脚可独立选择“减少动态效果”，不会覆盖系统的减少偏好。

## 参数

参数唯一来源是 `tokens/primitives.tokens.json` 与 `tokens/semantic.tokens.json`；Light / Dark 同名、同值。生成 CSS、TypeScript 和各平台令牌，不手工维护重复常量。

| 语义角色 | 时间 | 用途 |
|---|---:|---|
| instant | 0ms | 输入、拖动、焦点、状态语义 |
| press | 80ms | 独立实体按钮按压，缩放最多至 0.98 |
| hover | 120ms | 字段、按钮、选项、导航的颜色反馈 |
| fast | 150ms | 选择指示器、Switch、真实进度衔接 |
| enter | 180ms | Dialog、Select、Popover、通知进入 |
| exit | 120ms | 浮层和通知退出 |
| settle | 240ms | Accordion、Tree、源码章节和占位展开 |
| panel | 280ms | Sheet、Drawer、移动导航沿所属边缘进入 |
| expressive | 360ms | 叙事变化的上限参数；当前网站未加入装饰性叙事动画 |
| tooltip-delay | 300ms | 防止无意悬停；减少动态效果仍保留此等待 |
| loading-delay | 150ms | 产品异步加载反馈的防闪烁预算；当前按钮和教学加载立即呈现真实状态，不延迟业务 |
| spin | 1000ms | 等待中的匀速转轮；页面隐藏暂停，减少动态效果下静止 |

标准曲线 `cubic-bezier(.2,0,0,1)`；进入 `.16,1,.3,1`；退出 `.4,0,1,1`。保留既有 `fast`、`settle`、`ease` 名称兼容。浮层位移 4px，Dialog 8px，边缘面板 24px。焦点轮廓不做淡入。

## 逐组件与网站应用

`src/data/motion.ts` 为全部 61 个实际组件定义状态反馈、进入、退出、中断与减少动态效果五项规则。组件详情页新增“动效”章节；基础规范页提供真实共享组件的重播示例及 61 项完整规则表。`docs/motion-catalogue.json` 随测试从同一注册表导出。

- Button、输入、选择行、上传区域使用短颜色过渡；文字/导航/行操作不缩放。
- 线形 Tabs 使用一个实测宽度和位置的共享指示器；卡片、分段与分类选择用边框/填充表达选中，不叠加底部指示线。代码语言仅保留一个线形指示器，不叠加文字下划线。内容立即切换，以 240ms / 12px 沿选项顺序过渡。快速反向取消前段并从当前视觉位置继续；网站分类、平台、品牌与代码语言共用内容过渡。
- Dialog 立即执行原生 `showModal` / `close`、焦点恢复和语义隐藏；CSS 顶层离散过渡承担视觉退场。Sheet / Drawer 不宣称支持尚未实现的手势释放动画。
- 说明标签只由真实悬停或键盘导航焦点触发；程序自动聚焦、鼠标点击后的焦点与 Escape 后的焦点恢复不启动说明计时。Modal 初始焦点优先任务字段或内容操作。Select、Popover、说明标签及通知共享可中断的视觉保留生命周期；退场立即 `inert` 和 `aria-hidden`，不可继续操作或播报。确认值、撤销和关闭不等动效结束。原生 close 事件延后送达时，已重开的对话框忽略旧事件。浮层运动朝向锚点并限于 16px 视口边界内。
- 原生 details 保持展开语义；支持高度插值的引擎使用 240ms 展开。不支持时直接完成原生展开，不妨碍操作。
- Progress 只衔接真实百分比；暂停和重置停止过渡。Skeleton 默认静态；静态目录预览中的 Spinner 不持续旋转。
- 页面、侧栏、预览框和主题字段共用反馈参数；代码章节使用相同展开规则。页面正文使用浏览器 View Transition 视觉快照：先 80ms 退出，再 180ms 进入，避免两套正文重叠；同级为 16px、深入/返回为相反的 24px，跨层为 8px 淡入。URL、当前页、焦点与滚动位置不等待动画结束。原生能力缺失时保留 240ms 单正文入场，首次访问、搜索条件和章节锚点不做页面切换。快速导航跳过上一段且阻止旧回调覆盖最新路由。浮层内滚动条使用浮层坐标，跟随其移动，忽略整数舍入造成的 1px 假溢出。
- Slider、可调整分栏、文字输入和原生滚动直接跟随操作，无尾随。Slider 滑块悬停缩放至 1.1、按压/拖动至 1.18，配合 4px / 6px 淡强调环；松开、指针取消、窗口失焦均恢复。滚动条闲置宽 4px、悬停 6px、拖动 8px，12px 操作区域保持不变。复选框保留真实 input checked，勾选与取消的标记均以 150ms 缩放/明度过渡；减少模式立即呈现。日期/时间/颜色选择器和 datalist 的系统弹层由浏览器/系统负责。

## 减少动态效果与生命周期

`MotionPreferences` 实时监听系统，保存 `rosemary_motion`（system / reduce）。既有主题、URL、筛选与会话键保持兼容。网站减少模式取消过渡、位移、缩放、旋转及平滑滚动，保留状态文字、标记、真实百分比、键盘操作与焦点恢复。减少模式变更时正在退场的视觉节点立即移除。

CSS 支持不足时保留可操作的即时呈现。原生顶层退场依赖 `@starting-style`、`display/overlay` 离散过渡；details 高度插值使用能力查询。共享 Select 的顶层/对话框内 portal 回退仍保留主题。无新增依赖。

## 来源与 Rosemary 决策

以下来源用于目的、连续性、克制、用户掌控及平台行为；上表的具体时长、幅度和组件分配是 **Rosemary 自身决定**，不是 Apple 官方数值要求。

- [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion)
- [Apple WWDC23 — Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/)
- [Material 3 — Motion](https://m3.material.io/styles/motion/overview/how-it-works)
- [Carbon — Motion overview](https://v10.carbondesignsystem.com/guidelines/motion/overview/)
- [WCAG 2.2 — Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html)：额外采纳 AAA 2.3.3 的可关闭原则；网站整体目标仍是 AA，不据此宣称认证。

默认实现采用可预测的 CSS 曲线，不给所有控件套用弹簧。连续拖动直接跟随指针。未来原生手势若采用物理弹簧，需要单独验证速度继承、边界与减少动态效果。

## 验证和边界

`npm run check` 检查全部注册表覆盖、双主题参数兼容、系统偏好订阅清理、保存设置、退场语义、快速反向、中断与即时确认。实际浏览器检查记录在 `docs/browser-checks.json`；截图与实际逐帧录制放在 `docs/screenshots/`。记录范围与源码指纹，不能用计算样式或静态截图冒充所有过程已验收。

本轮使用 Codex In-app Browser。Safari / Firefox、系统实际偏好切换、真实手机触控、读屏、Forced Colors 和低性能设备尚待验证；测试覆盖系统媒体查询变化，不代表已切换真实操作系统设置。工程支持的回退不等于已完成多引擎实测。
