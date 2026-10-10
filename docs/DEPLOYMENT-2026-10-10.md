# 发布记录 · 2026-10-10

Web 版本为 v2.0.0-beta.1；Flutter、Compose、SwiftUI SDK 均为 Prototype，Beta 验收尚未完成。

## 网站部署

- https://design.cruty.cn
- https://design.rosemaryis.cc

两个站点都已通过宝塔站点接口登记，并由 Apache 提供已编译的静态产物。HTTP 转向 HTTPS；证书引用已有匹配域名的泛域名证书目录，沿用其更新位置。配置经过 Apache 语法校验后平滑重载。

发布包 SHA-256：`2864b988104bfd249d0171cada791b90ecdfe425387f30dcabf43558e69f005f`。

源站 HTTPS 检查与公开 CDN 访问均成功。两个公开域名的首页与主脚本逐字节匹配本地生产构建，主脚本 SHA-256 为 `9ca1f07833870d56ce1cd8dfff454b6f2d9d41bf5bef8cab7f12644c8d6fa69f`。指南 manifest 已配置公共仓库、国际站与 `v2.0.0-beta.1` 源码引用。

真实浏览器检查了两个公开站点的首页、主题与手机布局。截图保存在 evidence/deployed-*.png。完整页面布局复查属于部署前同一源码版本的本地验收：139 个 URL 的 320px 明暗主题与 13 个桌面栏目。

## 源码发布

公共仓库目标：https://github.com/Foodie05/Rosemary-Design-System 。发布使用独立副本，保留原工作区。排除生产配置、证书/私钥、环境文件、构建缓存、日志和本机配置；验收输出中的个人文件路径替换为占位符。保留官方 Gradle wrapper 和公开界面截图。源码包由构建命令再生，不提交临时压缩产物。

独立发布副本经过 npm ci 和 npm run check：429 项 Web 测试、类型、令牌与生产构建通过。敏感内容扫描未发现高置信匹配，并检查了实际暂存文件；扫描不能代替源码审查。README 包含运行、验证、三端接入和已知限制，未擅自增加许可证。

## SDK 审计与推进

独立审计见 NATIVE-SDK-AUDIT-2026-10-10.md。五项缺陷已修复并复核：保存快照与迟到请求隔离、Flutter 长选项窄屏布局、减少动态效果、字段焦点圆角、隐藏 Tab 动画暂停。实际三端检查 11 项全部通过；Flutter 控件 15 项、示例流程 1 项、SwiftPM 状态 5 项、Compose 状态 5 项及 Android UI 4 项通过。

仍待验收：真实 VoiceOver/TalkBack、真实设备与大字/RTL 完整矩阵、生命周期与关闭原因覆盖。iOS UI 流程因本机模拟器服务失败受阻；SwiftPM 状态测试和 iOS 应用构建成功均不替代 UI 执行结果。betaApproved 保持 false。
