# Rosemary 第二轮迭代检查清单

审查日期：2026-10-09。该目录不是 Git checkout；修改基于现有项目，无远端操作。

## 第一阶段：已核实的基线

- `doDontCases.ts` 实际有 65 条，34 条声明交互；与任务描述的 24 条基线不同。
- `componentsSpec.ts` 实际有 61 条，53 条声明交互；页面写死 58，分类计数和发布状态未从注册表推导。
- `DoDontVisualPreview.tsx` 1127 行：多个分支只是两段彩色文字，反例带夸张色彩；不能全部计为正式可视化。
- `DoDontCard.tsx` 用 switch 选择演示，button-placement 重用 action-priority；有默认兜底掩盖缺失。
- `DoDontGalleryView.tsx` 手工维护类别计数，一次渲染全部长文；initialCaseId 未被使用，缺平台和标签筛选。
- `App.tsx` 使用内存 section，刷新/前进后退丢失位置；搜索组件结果不打开对应详情。
- `InteractiveComponentsCatalog.tsx` 899 行：Dialog 只是普通 div；Resizable Panels 不可调整；部分按钮无行为。
- `ComponentsView.tsx` 只有按钮有控制项；其他控件忽略 props；代码引用不存在的 @rosemary/ui-web、RosemaryUI。
- `tokens.ts` 手写展示数组；CSS 与演示硬编码颜色；CSS 导出将 var(--name) 当声明名，DTCG 导出只是数组。
- 主题没有统一状态映射；字号多在 10–12px；无 reduced-motion 全局策略。
- 首页/品牌探索只有文字卡片，没有三个方向的四种实际场景。
- 全站 ⌘K 未实际打开搜索，移动侧栏不管理焦点；Stable/WCAG 合规文案缺测试依据。
- 基线 `npm run lint` 通过。

## 可执行文件处置

| 文件 / 目录 | 处置 | 验收动作 |
|---|---|---|
| data/doDontCases.ts | 保留原始问题/解释，扩展渲染注册与规则关联 | 65 个无兜底视觉对照、32+ 双侧模拟、引用完整 |
| common/DoDontCard / VisualPreview | 替换为缩略图卡片与场景注册 | 目录不渲染全量演示、详情真实小样 |
| views/DoDontGalleryView | 重构目录与详情路由 | 分类/搜索/标签/平台/交互联合筛选、Reset |
| data/componentsSpec.ts | 保留专业内容，修正状态、令牌和平台声明 | 61 个完整规范，未验证实现标 Beta/Candidate |
| views/ComponentsView | 重构为目录，拆出详情和 Playground | URL、配置、代码、视觉变体矩阵 |
| components-gallery/InteractiveComponentsCatalog | 以分族实现替换 | 30+ 实际行为、native dialog、键盘支持 |
| interactive/InteractiveDemos | 保留有用旧规范引用，重点案例替换 | 表单/撤销/保存/离线/导航真实双侧 |
| tokens / scripts / generated | 新增分层 DTCG 子集与确定性生成 | 名称/引用/循环/覆盖/对比度检查，CSS+TS+平台输出 |
| data/tokens / tokens/TokenBrowser | 改为使用生成产物 | 下载与构建输出一致，双主题浏览 |
| OverviewView / BrandView | 重设计 | 三个方案 × 首页/文档/控件/软件场景；记录默认决策 |
| layout / App / CommandSearch | 重构 | hash URL、历史、标题/焦点、键盘搜索、移动导航 |
| index.css | 重建语义样式，迁移旧内容 | 首页与文档不同节奏，light/dark、320px、reduced motion |
| 其他文档页 | 保留结构、迁移样式、清除虚构发布/包声明 | 有效链接、平台指南来源、诚实状态 |

## 验收记录（实施后填写）

- [x] 品牌方向探索与选择说明
- [x] 65 个正式视觉案例与至少 32 个互动案例
- [x] 61 个组件规范与至少 30 个真实 Web 实现
- [x] 明暗主题、路由、搜索、历史、移动布局
- [x] Tokens 引用/主题/对比度/确定性检查
- [x] 类型检查、构建、关键行为测试
- [x] 浏览器交互与视觉检查，缺口写入 Backlog

实施结果及边界见 [ACCEPTANCE.md](ACCEPTANCE.md)；浏览器实际记录、测试 JSON、原生检查命令均保存在 docs 中。
