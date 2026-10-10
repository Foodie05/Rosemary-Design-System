# Rosemary Design System

第二轮迭代，v2.0.0-beta.2。基于已有 React 网站重构；品牌语言采用 **Organic Precision**：编辑式标题、纸色与松绿、叶形曲线和精密网格。保留原 Rosemary 标志。

当前包含三个品牌方向 × 四类实际视觉场景、65 个双侧可视化案例（56 个交互模拟）、61 项组件规范（54 个交互参考）、169 个令牌 × 两个主题。案例和组件有独立 hash URL、统一筛选、可操作 Playground 和实际运行的源码。

## 运行

建议使用 Node.js 22.12+；本轮使用 npm lockfile 安装。无需 Gemini 或其他 API key。

```sh
npm ci
npm run dev -- --port 3100
```

生产预览：

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 3101 --strictPort
```

打开 `http://127.0.0.1:3101/#/overview`。例如 `#/components/button`、`#/dodont/case-04-form-validation`、`#/tokens?query=semantic.color.accent` 可以刷新或分享。静态部署只需提供 `dist/`，hash 路由无需服务器重写。

## 验证与产物

```sh
npm run check          # Tokens 当前性/确定性、类型、440 项测试、生产构建
npm run check:native   # 已安装 Flutter / Xcode / Android SDK 和 JDK 时执行，保存实际结果
npm run evidence       # 汇总已保存的测试、浏览器与原生证据；不替代测试
```

`npm test` 写入 `docs/test-results.json`，注册表契约测试写入 `docs/catalogue.json`。浏览器记录为本轮人工操作验收结果，不宣称运行上述命令就会重新执行浏览器。

三端源码位于 `platforms/flutter/`、`platforms/android/`、`platforms/swiftui/`。首批各 14 个公开控件为 Prototype，含本地工程、示例和自动测试；实际命令与结果见 `docs/native-checks.json`。WinUI 仍无编译工程。`npm run native:package` 生成不含构建缓存/本机配置的本地源码包。

## 结构

| 路径 | 内容 |
|---|---|
| `src/data/` | 分类、组件规范、专属规则、案例内容和平台注释 |
| `src/components/cases/` | 十个专题实现族与无兜底注册表、双侧详情模板 |
| `src/components/ui/` | 共享原生核心与七个组件族 |
| `src/components/playground/` | 实际组件注册、支持范围、配置与状态矩阵 |
| `src/components/brand/` | 三种探索场景与品牌曲线资产 |
| `src/components/views/` | 既有栏目升级后的页面；文档按需载入 |
| `tokens/` | Primitive → Semantic → Component、Dark 覆盖和主题清单 |
| `scripts/` | 令牌生成/校验、原生检查、证据汇总 |
| `public/generated/` | 可下载 CSS、DTCG 子集、Dart/Swift/Kotlin/C# 和验收记录 |
| `tests/` | 行为、注册表、目录、Tokens、推荐场景与网站结构的 axe 检查 |

令牌文件为唯一参数来源；生成文件不手工修改。DTCG 支持范围、单位映射与边界见 [验收报告](docs/ACCEPTANCE.md)。平台示例是源码参考，非已发布组件包。

## 文档与诚实状态

- [基线审查和文件处置](docs/ITERATION-2.md)
- [品牌方向决策](docs/BRAND-DECISION.md)
- [动效规范与实施边界](docs/MOTION.md)
- [独立设计审计](docs/DESIGN-AUDIT-2026-10-10.md)
- [验收报告](docs/ACCEPTANCE.md)
- [Backlog](docs/BACKLOG.md)

56 项 Beta、5 项 Candidate，没有未经验证的 Stable 声明。WCAG 2.2 AA 是目标：自动结构检查、令牌对比度和浏览器键盘验证已有证据；实际读屏器、所有颜色组合、多浏览器和真实设备仍需继续验证。

Google Fonts 异步加载，网络不可用时使用令牌内的系统字体回退；现有标志来自原项目远程资产。教学动作均为本地模拟，不联网发送表单、上传文件或操作真实系统设置。

## AI 接入与发布地址

AI 应先读取 [接入指南](docs/AI-INTEGRATION.md)，再按任务查组件规范、源码、参数和验收范围；项目规则引用模板为 [AGENTS.template.md](docs/AGENTS.template.md)。不以提示词替代规范。

根部 `publication.json` 预留 `repositoryUrl`、`websiteUrl`、`sourceRef`，当前已配置公共仓库、国际站及版本标签；修改地址或发布新版本时同步更新这些字段并重新构建。未配置时网页显示占位文本，不制造虚假链接。`npm run guide:build` 生成 `/guide/manifest.json`、完整 Markdown 与目录；静态站点可直接访问这些文件。

- [简洁与认知负担规范](docs/CONTENT.md)
- [原生库总设计](docs/NATIVE-SDK-DESIGN.md)
- [Flutter SDK](docs/native/flutter-sdk.md)、[Android Compose](docs/native/android-compose.md)、[iOS SwiftUI](docs/native/ios-swiftui.md)

三端组件库首批 14 项已进入 Prototype，其他 47 项保持 Draft。Flutter 15 项控件测试、示例工作流及 iOS/Android 示例构建通过；Compose AAR/APK、5 项状态单测和 4 项 Android 模拟器 UI 测试通过；SwiftPM 5 项状态测试和 iOS 模拟器应用构建通过。iOS UI 流程执行被本机 Xcode 模拟器服务阻塞；VoiceOver/TalkBack 与完整设备矩阵未验收，不能称为 Beta。

## 在线文档与接入

- 国际站：[design.rosemaryis.cc](https://design.rosemaryis.cc)
- 国内站：[design.cruty.cn](https://design.cruty.cn)
- 版本：Web v2.0.0-beta.2；三端 SDK Prototype，首批各 14 项。

AI 接入从 `/guide/manifest.json` 和 `/guide/ai-integration.md` 开始，按清单读取相关规范和实际源码。两个网站提供相同构建；源码标签用于固定审阅版本，不代表原生 Beta 验收已完成。

原生 SDK 为本地依赖：Flutter 示例使用 path dependency；Compose 工程生成 AAR 并有独立 sample；SwiftUI 为 Swift Package，并带 Xcode 示例。工具链及完整接入命令见三份原生文档。`check:native` 在任一缺失或失败检查时返回失败，不会把没有安装的工具标为通过。Android UI 测试可指定 `NATIVE_ANDROID_DEVICE`，iOS 流程可指定 `NATIVE_IOS_DEVICE`；需要预先准备、启动对应设备。

## 开发与贡献

先复现问题，再查共享规范、令牌和实际组件实现。参数改动从 tokens/ 修改，不手工改生成文件；提交时运行 `npm run check`。原生改动还应运行对应平台检查，说明系统、工具链、复现方式和未验证范围。请勿提交生产密钥、服务器配置、本机路径配置或构建缓存。

独立 SDK 审计见 [NATIVE-SDK-AUDIT-2026-10-10.md](docs/NATIVE-SDK-AUDIT-2026-10-10.md)。审计中确认的五项缺陷已有修复和回归：提交快照/迟到回调、窄屏长选项、减少动态效果、焦点圆角及隐藏面板动画。人工辅助技术、设备覆盖和 iOS 流程执行仍是 Beta 门槛。

## 版权与许可

© 2026 Rosemary Island LLC。当前未指定开放源代码许可证；公共可见不自动授予再分发或商业使用许可。品牌、字体和第三方依赖各自遵循其授权。新增许可证须由权利人确定。

## 404 恢复页面

不存在的栏目、组件、案例与多余路径统一显示 Rosemary 404，只提供返回首页。页面共用品牌排版、主题、参数与控件反馈；恢复链接指向根路径，不会停留在错误的深层地址。

Vite 构建生成独立的 `dist/404.html`，其中说明和返回链接不依赖应用 JavaScript；`404.html` 由共享组件生成，不手工维护。Apache 站点需设置 `ErrorDocument 404 /404.html`，保留真正的 HTTP 404 状态，不能用首页重写掩盖错误。该规则已用于两个在线站点。其他静态托管平台需配置对应的错误文档入口；hash 路由由应用处理，其 HTTP 请求本身仍访问根文档。
