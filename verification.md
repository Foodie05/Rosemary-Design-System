# Rosemary Forma 1.2.0 · 验证记录

日期：2026-10-13。范围：本地 Web 门户、自包含 HTML 与源码包。本轮未部署、未提交或推送 GitHub，也没有新增测试文件。

## 本轮结果

- 选择控件、案例 Tab、加载／进度、日期、右抽屉与勾线校准的既有针对性检查中，排除被本轮品牌视觉替换的旧断言后，当前保留 **64 条适用结果**。其中加载长边翻转、右抽屉进退与复选框勾线校准来自 `/tmp/rosemary-corrections-smoke.mjs` 的 21 条 Chrome 烟雾，0 个运行时异常。
- 最终品牌层级、首页卡片布局、站点壳层、产品名大小写和原生滚动条使用 `/tmp/rosemary-shell-final.mjs` 做有限 Chrome 烟雾，**13 条通过**，0 个运行时异常。此前 16 条 Forma 集成烟雾已被新版品牌规则取代，不计入当前总数。
- `local-review-report.json` 汇总当前 **77 条针对性操作**。`node tests/static-check.mjs` 在最终源码上通过：17 页面、71 图标、33 规格及独立可视化、26 组对比度、24 个主题角色、离线资源和原始 Logo 哈希；相关 JavaScript 的 `node --check` 全部通过。

`browser-test-report.json` 中的 645 项完整矩阵来自本轮加载、抽屉、勾线和 Rosemary Forma 改版之前，仅作为历史基线，不能当作最终修订的全量回归结论。本轮按要求没有机械重跑该矩阵；当前结论以 77 条仍适用的针对性操作、最终静态检查、代表截图和交付包一致性为准。

## 实际验收证据

1. 站点静态标题、description、动态页面标题、侧栏、面包屑、搜索、移动导航、页脚和下载文件名统一为 Rosemary Forma。首页仍使用 `overview` 路由，有且只有一个 h1，提供组件与典型案例入口。1440px 浅色和 375px 深色均无横向溢出；首页完整组合只含官方原图与 rosemary／Forma 两行字标，不含分隔线或独立产品徽记；普通产品名统一写作“Rosemary Forma”。
2. 子品牌规范同时展示完整组合、产品徽记 + 短名称和仅产品徽记三种层级。五枚产品徽记统一使用 64 单位画布、56 单位圆角浅实底与外框，并用不同实形／负形核心建立识别；Vigilo 用成员卡核心，不再使用眼睛或菱形。
3. 1024px 首页的组件卡已有无文字 SVG 插画，实测 313.875 × 147.125px；“典型案例”标题保持单行。375px 深色首页插画宽 291px且无横向溢出。侧栏使用 Forma 产品徽记与短名称，不重复首页完整组合；移动端隐藏桌面侧栏。
4. 典型案例在 650px 将账号入口从完整 epass 组合切换为子标志 + 短名称；420px 的任务页隐藏短名称和次要上下文，只保留子标志与“本地演示”。650／420px 均无横向溢出。既有案例 Tab、密码可见性、筛选、真实单选／复选输入和插画结构保留。
5. 两片加载折面使用同一浅主题品牌色 `rgb(97, 69, 120)`，没有多色渐变；前片 0／540／840ms 透明度为 1／0.78／0.92，后片为 0.4／0.67／0.51。idle 与 0ms、完成和减少动态的前后片位置、尺寸、透明度及层级一致。240／840ms 产生 `matrix3d` 长边轴翻转，两片仍可见，层级实际交换；没有整体 `rotateZ` 倾斜或宽轨道公转。
6. 右侧“记录详情”抽屉在进入 35ms 与退出 60ms 都有真实中间帧；进入 220ms、退出 180ms，遮罩同步淡入／退。关闭按钮、Escape、保存和点击遮罩都等退场后关闭；快速重开可中断退出。焦点返回触发按钮，草稿保留，切组件立即清理，减少动态直接切换。
7. 共享复选框保持 18 × 18px，只把勾线 `translateY(-1px)`；案例勾线的 `top` 为 1px。两处最终近裁截图显示勾线视觉居中，输入节点和双向选择动效保留。
8. 确定进度在真实 3／6 时保持 `value=3`、`max=6`、`--progress-ratio=0.5` 与统一品牌色底。高光和填充均为 8px 高，扫光全高、上下等宽并限制在真实完成区域；完成、取消、失败与减少动态时停止。
9. 日期烟雾实际输入 1900，进入该年份的月份视图，选择二月后未提前改值，再选择 28 日提交 `1900-02-28` 并把焦点返回开始日期按钮。更广的 44 条日期／时间检查属于改版前既有回归，包含闰日、月末、范围、取消、焦点和组件清理。
10. 根页面与侧栏滚动容器在浅色、深色 Chromium 中均实测为 8px 原生槽，1px 透明边框留下约 6px 可见圆角滑块，轨道透明，悬停／按下增强；强制颜色模式回到系统色。governance 深色页脚实测显示“Rosemary Forma”，R／F 均为大写。自定义下拉、移动侧栏、Tab 定位条、组件生命周期、主题及离线边界沿用此前有限验收。平台章节、品牌原则、布局、字体及下载文字规范继续要求 Rosemary Forma 自有页面、导航与控件采用同一套规范；系统权限、文件访问、窗口和辅助技术保留可靠平台能力。

## 代表截图

- 首页：`screenshots/forma-home-1024-light-final.png`、`screenshots/forma-home-375-dark-final.png`
- 品牌与壳层：`screenshots/subbrand-product-marks-final.png`、`screenshots/governance-forma-name-dark-final.png`
- 本轮三项：`screenshots/loading-long-edge-idle.png`、`screenshots/loading-long-edge-turn.png`、`screenshots/loading-long-edge-complete.png`、`screenshots/drawer-motion-final.png`、`screenshots/checkbox-centered-final.png`、`screenshots/case-checkbox-centered-final.png`
- 进度与日期：`screenshots/progress-full-height-final.png`、`screenshots/date-picker-smoke-final.png`

## 交付核验

最终文档和报告写入后重新执行 `python3 -I build.py` 与 `node tests/static-check.mjs`。源码 ZIP 的所有条目通过 CRC；`404.html`、`forma-home.css`、首页、品牌 helper、最新案例样式、文档、报告和截图均在包内并与工作目录逐字节一致。`index.html` 保持多文件源码入口，`rosemary-design-portal.html`、预览目录的 `index.html` 与 5181 实际响应逐字节一致。

## 验证边界

本轮验证为 Chrome 本地 Web 与离线页面。尚未覆盖 Safari、Firefox、真实移动设备及人工读屏，不等于生产跨平台组件库或 WCAG 认证。音乐进度、账户格式、权限和搜索均为明确标注的本地示例。
