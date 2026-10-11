# Rosemary 设计规范门户 1.1

在原有 B + C 视觉方向上，改为直接、可执行的规范说明，并补充正式品牌资产、组件规格和动效。

## 打开

`rosemary-design-portal.html` 是自包含版本，可直接在浏览器打开，不需要安装依赖或启动服务。`index.html` 是多文件源码入口，需要同目录中的 CSS、JavaScript 和资产。

门户不请求外部字体、图片或脚本。参考来源链接只有在用户主动点击时才会打开外部网站。

## 本版内容

15 个章节：规范总览、品牌原则、Logo、色彩、排版、布局、图标、组件、加载、动效、交互流程、文案、可访问性、平台适配、覆盖与维护。

- 正式 Logo：原始 PNG，1000 × 1000，颜色、比例和像素内容未修改。
- 71 枚原创 SVG：可检索、分类、预览尺寸、复制和下载。
- 33 类组件规格：用途、结构、变体、尺寸、状态、键盘、语义、响应式、动效、Do / Don’t 和验证要求。
- 可操作的按钮、表单、选择、标签、分页、排序、Tooltip、Popover、Dialog、Drawer 与文件元信息演示。
- 折面加载、确定进度、失败继续、骨架、选中定位、完成确认和列表插入演示。
- 深浅主题、系统偏好、减少动态、本地搜索、设计变量与资源下载。

“规格覆盖”不等于已经发布生产组件库。复杂原生组件、真实业务状态和辅助技术仍需要在目标产品中验证。

## 源码结构

- `tokens.json`：语义色、字号、间距、圆角、组件与动效变量。
- `styles.css`：原有门户布局与基础样式。
- `specifications.css`：新增规范、图标库、组件与动效样式。
- `icon-library.js`、`icons/`：71 枚图标的语义元数据与独立 SVG。
- `component-catalog.js`：33 类组件的结构化规格。
- `ui.js`：共享模板、SVG 渲染、正式 Logo 与加载图形。
- `pages.js`：核心章节及页面元数据。
- `asset-pages.js`：Logo 与图标章节。
- `component-pages.js`：组件演示、结构与 Do / Don’t。
- `loading-motion-pages.js`：加载和动效规范及实验。
- `reference-pages.js`：平台、覆盖矩阵、资源与参考来源。
- `app.js`：路由、搜索、主题、基础演示和本机偏好。
- `interaction-lab.js`：图标、规格检索、加载、动效及新增控件。
- `brand-guide.md`：独立可阅读的文字规范。
- `assets/`：正式 Logo 原图及来源记录。
- `research/design-system-reference-review.md`：参考来源与核对范围。
- `build.py`：验证资产，生成 CSS、下载资源、自包含 HTML 与源码包。

## 构建

需要 Python 3 和 Node.js，不需要 npm 依赖。

```bash
python3 -I build.py
```

构建会验证正式 Logo 的 SHA256、71 个 SVG 的结构、33 个组件规格数量与深浅主题角色一致性。旧四片页形探索标记已从门户和发布资源中移除；工作目录的 archive 中仅保留历史文件，不作为正式资产发布。

## 验证

```bash
node tests/static-check.mjs
```

浏览器检查使用 Node.js 22+ 的 WebSocket 和本机 Google Chrome，创建独立临时配置，不读取日常账户或历史。先启动本地预览，再运行：

```bash
node tests/browser-check.mjs http://127.0.0.1:5181/
```

`CHROME_BIN` 可指定 Chrome 可执行文件。测试输出为 `browser-test-report.json`，截图在 `screenshots/`。具体已执行结果见 `verification.md`；自动检查不等于正式可访问性审计。

## 隐私与演示边界

主题和发布检查清单可保存到当前浏览器。对话框内容只存在页面内存中，刷新后清除。文件演示仅读取浏览器提供的文件名和大小，不读取内容、不上传。切换章节会停止该章节的异步演示。

加载和进度是明确标注的本地模拟，没有账户、云同步、后台任务或分析追踪。正式 Logo 不经滤镜重着色；功能动画仅借鉴折面结构，不对原图做变形。

## 参考

已核对 Carbon 的组件清单、加载、动效等正文，以及 Atlassian 的按钮、可访问性、动效和发布阶段。Apple HIG 与 Material 3 的目录／主题已核对，但本环境未可靠提取其客户端正文；不把 Rosemary 参数冒充官方条款。
