# SDK 0.4.1 发布验收清单

规范版本为 1.2.0，SDK tag 为 `v0.4.1`。本文件说明门槛，不把未勾选项写成通过。动态 CI 和各端报告是结果来源，最终发布记录需固定 commit、运行链接与资产 SHA256。

## 源码和契约

- [ ] 当前 33 个组件的公开 API、Binding/回调、状态约束与可访问语义有文档；`design/contracts.json` 的 stateKeys 可经内建状态或明确的宿主组合达到。
- [ ] light/dark 的 24 个角色、71 枚图标与排版/尺寸/动效来自共享生成源；无不存在的内置图标引用。
- [ ] 自定义完整主题和局部继承均消费实际颜色；结构/颜色错误明确失败，22 对对比诊断按每个 mode 保留，不静默改色。
- [ ] CN/EN 状态字符串覆盖、RTL、文字缩放、系统/宿主减少动态及高对比有明确边界。
- [ ] 宿主控制数据和提交；取消草稿不提交；Upload 不网络传输；日期/时间不隐式跨时区。
- [ ] 历史 prototype 的额外组件和 breaking API 单列；不声称 61 项已作为当前 33 项实现交付。

## 各端门槛与证据

| 实现 | 必须保留的证据 | 当前未覆盖不能省略 |
| --- | --- | --- |
| React | 独立 tarball 安装、React 18/19 consumer、SSR/类型、真实交互回归、Web CI 与产物关联 | WebKit 不等于实际 Safari；四浏览器最近两大版本、真实触控与人工 NVDA/VoiceOver |
| Compose | AAR/POM/module/sources、本地 Maven consumer、单元/设备交互、API 26 CI、APK 与 SHA256 | 已跑高版本不能代替最低 API；人工 TalkBack、大字/RTL/键盘及真机权限 |
| SwiftUI | 根 SwiftPM 编译/模型、真正 root-package sample、稳定 Xcode 26.3 build/test、simapp/source、xcresult、环境与 HEAD | 本机 Xcode 27 beta 附加兼容不替代稳定 CI；iOS 17 runtime、本机受限 UI host、人工 VoiceOver |
| Flutter | package analyze/test、六目标真实 consumer runner、各平台构建/运行与源码及安装产物、SHA256 | Android/iOS/macOS/Windows/Linux/Web 分别报告；编译不等于运行；OS 下限和读屏不能推断 |

稳定 CI 入口：[GitHub Actions](https://github.com/Foodie05/Rosemary-Design-System/actions)。实现明细：[实施状态](https://github.com/Foodie05/Rosemary-Design-System/blob/main/docs/sdk/implementation-status.md)。各端证据：[React](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.1/packages/react/README.md)、[Compose](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.1/platforms/android/README.md)、[SwiftUI](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.1/platforms/swiftui/VERIFICATION.md)、[Flutter](https://github.com/Foodie05/Rosemary-Design-System/blob/v0.4.1/platforms/flutter/README.md)。

## 产物与发布

- [ ] CI 记录环境、构建开始时间、git HEAD/dirty、GitHub run/SHA、源码输入与产物哈希。旧本地 working-tree 包不冒充后续 commit 构建。
- [ ] Source archive 可独立消费；样例确实依赖 SDK。simapp 只标为模拟器应用，不称 device IPA。
- [ ] React 的三个 tgz、Compose Maven ZIP/APK、Swift source/simapp、Flutter source/各目标产物名与脚本一致。清单中的文件都存在，SHA256 检查通过。
- [ ] SDK 代码、tokens、图标和文档包含 MIT；名称、官方 PNG、产品徽记和字标另附品牌资产规则，不暗示商标授权。
- [ ] 最终验收通过后才创建 tag/release；不发布 npm、Maven Central 或 pub.dev。安装方式固定到实际版本，下载链接只指向存在的资产。
- [ ] 门户保留规范版本 1.2.0；SDK 栏目、迁移与接入文档同步最终状态。离线 HTML 无外部依赖，源码 ZIP 包含所引用的小文档；SDK 大产物经 GitHub Release 提供，不嵌入门户 ZIP。

当前已执行结果与限制须在最终 release notes 单独列出。未测的人工读屏或最低系统保留为未测，不用测试数或截图数量代替。
