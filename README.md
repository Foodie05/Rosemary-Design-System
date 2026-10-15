# Rosemary Design System

本仓库同时维护 **Rosemary Forma 1.2.0 设计规范**与 **Rosemary SDK 0.4.2 组件代码**。安装固定到 `v0.4.2`，以 GitHub Release 的实际资产及 SHA256 为准；不发布公共 registry。

SDK 入口：[接入指南](docs/sdk/getting-started.md)、[迁移](docs/sdk/migration.md)、[验收清单](docs/sdk/release-checklist.md)、[实际 CI](https://github.com/Foodie05/Rosemary-Design-System/actions) 与 [Releases](https://github.com/Foodie05/Rosemary-Design-System/releases/tag/v0.4.2)。

| 实现 | API 与 consumer |
| --- | --- |
| React | [packages/react](https://github.com/Foodie05/Rosemary-Design-System/tree/v0.4.2/packages/react) · 同版 tokens/icons/react tgz |
| Compose | [platforms/android](https://github.com/Foodie05/Rosemary-Design-System/tree/v0.4.2/platforms/android) · 本地 Maven ZIP / APK |
| SwiftUI | [platforms/swiftui](https://github.com/Foodie05/Rosemary-Design-System/tree/v0.4.2/platforms/swiftui) · 根 Package.swift / RosemaryUI |
| Flutter | [platforms/flutter](https://github.com/Foodie05/Rosemary-Design-System/tree/v0.4.2/platforms/flutter) · rosemary_ui / 六目标 consumer |

SDK 共用当前 33 个组件契约和 24 个语义色角色。各端的最低系统、构建、运行和辅助技术覆盖分别记录；组件存在、编译通过或截图可读不等于全部验收。代码与品牌资产许可证分开。

## Rosemary Forma 1.2.0 门户

Rosemary Forma 是 Rosemary 的设计系统门户。它以留白充足的介绍首页连接设计原则、组件、典型案例与实施资源，正文继续使用逐控件独立浏览结构和统一的章节、Tab 动效。

## 打开

`rosemary-design-portal.html` 是自包含版本，可直接在浏览器打开，不需要安装依赖或启动服务。`index.html` 是多文件源码入口，需要同目录中的 CSS、JavaScript 和资产。`404.html` 是服务器错误文档，保留 Rosemary Forma 品牌、返回首页入口和系统深浅主题。

门户不请求外部字体、图片或脚本。参考来源链接只有在用户主动点击时才会打开外部网站。

## 本版内容

18 个章节：规范总览、品牌原则、Logo、子品牌设计流程、色彩、排版、布局、图标、组件、典型案例、加载、动效、交互流程、文案、可访问性、平台适配、SDK 接入、覆盖与维护。

- 正式 Logo：原始 PNG，1000 × 1000，颜色、比例和像素内容未修改。
- 74 枚原创 SVG：可检索、分类、预览尺寸、复制和下载。
- 33 个独立可视化：选择控件后只显示其自身预览；“预览与状态”“使用规范”“交互与实现”三组内容通过 Tab 切换。
- 控件预览包含相应的真实交互、变体和状态。切换控件会清理旧监听、定时器、动画及打开的对话框。
- 主题采用 system/light/dark 图标分段，窄屏点击单按钮按所选模式循环；语言下拉仅展示实际支持的简体中文。
- 组件目录、图标筛选与尺寸、颜色对比和组件示例统一使用 Rosemary 定制分组下拉；方向键、首尾、键入定位、确认、取消、外部收起和表单值同步。隐藏的 select 仅持有值，不弹出系统菜单。
- 日期与时间使用统一的定制月历和小时／分钟双列，支持键盘、直接输入、确认／取消与区间校验；按本地日期、24 小时时间保留原值，不转换时区。窄屏选择面板随字段展开；点击年／月进入专门视图，可直接输入 1–9999 年快速跳转。
- 章节内容采用 220ms 的短距离淡入；文档 Tab、标签页组件和动效演示共用 180ms 定位条与内容淡入。
- 移动导航滑入／滑出，快速开关可中断，退出完成后收起并恢复焦点。组件示例中的右侧记录抽屉以 220ms 进入、180ms 退出；关闭、Escape、保存与点击遮罩均在退场后收起，快速重开可中断退出。
- 两片加载折面使用同一品牌色与透明度节奏，从官方标志的竖直交叠位置出发，绕各自长边轴前后翻转并交换层级；完成、停止与减少动态都回到同一静态位置。确定进度保持统一品牌色填充，全高等宽高光只在真实填充内扫过，完成、取消、失败及减少动态时静止。
- 复选框、单选框和开关保留真实输入节点及双向动效；复选框勾线按旋转后的视觉包围盒居中，不改变控件尺寸。
- 子品牌提供建立流程、三套深浅主题与完整／紧凑品牌模式。宣传与规范页的完整组合由官方 Logo、上方小写 rosemary 和下方较大产品名组成，不附加分隔线或子标；任务页优先使用统一圆角实底外框的子标徽记与短名称，窄屏不强塞完整组合。典型案例一次展示一个完整页面，覆盖音乐、登录注册、用户管理与搜索，采用无文字的内联 SVG 插画。
- 原生滚动容器使用透明轨道和约 6px 可见宽度的低对比圆角滑块，悬停与按下时增强；深浅主题及强制颜色模式分别使用语义色和系统色。
- 所有平台自有页面、导航和控件严格统一 Rosemary 规范，系统权限、文件访问、窗口及辅助技术保留可靠平台能力。
- 深浅主题、系统偏好、减少动态、本地搜索、设计变量与资源下载。

门户规格覆盖与 SDK 实现状态分别维护；复杂原生组件、真实业务状态和辅助技术仍需要在目标产品中验证。SDK 栏目的发布状态以实际 CI 和 GitHub Release 为准。

## 源码结构

- `tokens.json`：语义色、字号、间距、圆角、组件与动效变量。
- `styles.css`：原有门户布局与基础样式。
- `specifications.css`：新增规范、图标库、组件与动效样式。
- `icon-library.js`、`packages/icons/svg/`：74 枚图标的语义元数据与独立 SVG。
- `component-catalog.js`：33 类组件的结构化规格。
- `component-demos.js/css`：每个控件的独立可视化与局部交互。
- `component-viewer.js`、`component-pages.js`：控件选择、深链接、文档 Tab 与示例生命周期。
- `motion.js`：章节进入、Tab 定位与内容淡入、进度的共享实现。
- `navigation.css`：统一 Tab、控件浏览器和简化首页的样式。
- `custom-select.js/css`：共享定制下拉与隐藏表单值桥接。
- `subbrand-page.js/css`：子品牌流程、主题及品牌组合。
- `case-studies-page.js/css`：四个完整案例及局部交互。
- `sdk-page.js/css`：SDK 接入、主题、各端 API 与发布边界。
- `docs/sdk/`：接入、历史迁移与发布验收小型文档。
- `ui.js`：共享模板、SVG 渲染、正式 Logo 与加载图形。
- `pages.js`：核心章节及页面元数据。
- `overview-page.js`、`forma-home.css`：Rosemary Forma 介绍首页、精选入口与响应式展示。
- `asset-pages.js`：Logo 与图标章节。
- `loading-motion-pages.js`：加载和动效规范及实验。
- `reference-pages.js`：平台、覆盖矩阵、资源与参考来源。
- `app.js`：路由、搜索、主题、基础演示和本机偏好。
- `interaction-lab.js`：图标、加载和动效章节的交互。
- `brand-guide.md`：独立可阅读的文字规范。
- `assets/`：正式 Logo 原图及来源记录。
- `research/design-system-reference-review.md`：参考来源与核对范围。
- `build.py`：验证资产，生成 CSS、下载资源、自包含 HTML 与源码包。

## 构建

需要 Python 3 和 Node.js，不需要 npm 依赖。

```bash
python3 -I build.py
```

构建会验证正式 Logo 的 SHA256、74 个 SVG 的结构、33 个组件规格数量与深浅主题角色一致性。旧四片页形探索标记已从门户和发布资源中移除；工作目录的 archive 中仅保留历史文件，不作为正式资产发布。

## 验证

```bash
node tests/static-check.mjs
```

浏览器检查使用 Node.js 22+ 的 WebSocket 和本机 Google Chrome，创建独立临时配置，不读取日常账户或历史。先启动本地预览，再运行：

```bash
node tests/browser-check.mjs http://127.0.0.1:5181/
```

`CHROME_BIN` 可指定 Chrome 可执行文件。测试输出为 `browser-test-report.json`，截图在 `screenshots/`。本轮没有新增测试文件。关键实际操作与截图的记录见 `local-review-report.json`；具体已执行结果见 `verification.md`；自动检查不等于正式可访问性审计。

浏览器回归也保留同一页面和组件的 DOM，直接按 1440 → 375 → 1440 改变视口，验证文档 Tab、嵌套标签页与动效示例的定位条位置、尺寸和状态。报告中的 `resizeMeasurements` 保存两种主题下的 30 条实测记录。

`tests/date-picker-browser-checks.mjs` 由同一浏览器命令执行，先检查两主题、桌面／窄屏的日历和时间面板，再验证真实键盘选中、月末与闰日、直接输入、范围校验、取消、外部收起、焦点、文档 Tab 状态保留和组件清理。8 张展开截图以 `date-calendar-`、`date-time-` 命名。

## 隐私与演示边界

主题和发布检查清单可保存到当前浏览器。对话框内容只存在页面内存中，刷新后清除。文件演示仅读取浏览器提供的文件名和大小，不读取内容、不上传。切换章节会停止该章节的异步演示。

加载和进度是明确标注的本地模拟，没有账户、云同步、后台任务或分析追踪。正式 Logo 不经滤镜重着色；功能动画仅借鉴折面结构，不对原图做变形。

## 许可证

源代码采用 [MIT License](LICENSE)。Rosemary 名称、官方 Logo、产品徽记与其他品牌资产不随 MIT License 授权，使用边界见 [BRAND-ASSETS.md](BRAND-ASSETS.md)。

## 参考

已核对 Carbon 的组件清单、加载、动效等正文，以及 Atlassian 的按钮、可访问性、动效和发布阶段。Apple HIG 与 Material 3 的目录／主题已核对，但本环境未可靠提取其客户端正文；不把 Rosemary 参数冒充官方条款。
