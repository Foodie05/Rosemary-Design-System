# iOS SwiftUI SDK

状态：Prototype。全部 61 项规范组件都有公开 API 和宿主示例，目标为整库 Beta。当前工程版本为 `0.3.0-prototype.2`；人工辅助技术与设备验收尚未完成，因此不宣称 Beta 已获批准。未发布到 pub.dev、Maven 或 Swift Package Registry。

完整组件、API、源码对应表见 [API 清单](api.md) 与 [机器清单](component-coverage.json)。规范行为以网站对应组件页面为准；示例使用内存业务状态，不承担生产持久化、权限或网络服务。

## 接入

Swift tools 5.9+，iOS 15+。从 GitHub checkout 中把 `platforms/swiftui` 作为本地 Swift Package 加入 Xcode，再依赖 `RosemaryUI`。仓库根部不冒充 Swift Package；未来独立包地址尚未发布。macOS 12 的可编译兼容层并非本轮完整 macOS Beta 验收范围。

```swift
import RosemaryUI
RosemaryToastHost(state: toast) {
    RosemaryButton("保存", busy: busy, action: save)
}.rosemaryTheme().rosemaryMotion(reduced: appReduced)
```

SwiftUI Binding 保留宿主状态，默认跟随系统主题、Dynamic Type 和布局方向。长 Select 使用搜索选择 sheet；iOS Checkbox 为带勾选的选择行。Data Grid 使用 UICollectionView 虚拟布局与冻结列，Tree 使用 UITableView；命令和可编辑 Combo Box 使用原生键盘响应器，文本菜单和输入法归 UIKit。

```swift
@State private var session: RosemaryModalSession?
// 每次打开：session = RosemaryModalSession()
projectEditor.rosemaryModal(session: $session, title: "项目设置",
    onClose: { id, reason in
        // 回调附带原会话 ID。异步业务结果也必须验证自己的 operation ID。
        if reason == .confirm { save(draft) }
    }) { RosemaryTextField("名称", value: $draft) }
```

`rosemaryAlertDialog` 使用系统警告；普通 Sheet 由原生 SwiftUI 展示。文件选择 `fileImporter` 的 Result 包含取消/失败；宿主负责 security-scoped URL 生命周期、权限与上传。文件和图片读取不内置网络业务。

```sh
cd platforms/swiftui
swift test
cd Sample
xcodegen generate --spec project.yml
xcodebuild -project RosemarySample.xcodeproj -scheme RosemarySample \
  -destination 'generic/platform=iOS Simulator' CODE_SIGNING_ALLOWED=NO build-for-testing
xcodebuild -project RosemarySample.xcodeproj -scheme RosemarySample \
  -destination 'id=<simulator-id>' CODE_SIGNING_ALLOWED=NO test
```

Gallery 使用全部 61 项；XCUITest 含工作流、61 项预览、明暗/大字/RTL、数字输入。当前 Xcode 27 的测试宿主要求 iOS17，组件库和应用仍为 iOS15。历史执行曾因 DTServiceHub 无法连接而阻塞，最终记录以本次 native-checks.json 的实际状态为准；编译不计作执行成功。

## 共同使用契约

- `value` / Binding / controller 由宿主持有；选项使用稳定且唯一的 ID。输入草稿、确认选择、业务保存是三个不同动作。宿主拒绝选择时不自动改写文本或值。
- Number Field 支持直接输入、范围验证和步进。Combo Box 支持方向键高亮、禁用跳过、Enter 确认、Escape 放弃高亮；文本编辑不代表确认选择。
- Select 的长列表提供搜索、草稿、确认和取消；禁用或移除控件使原浮层失效。旧菜单动作在提交时重新验证，不能执行已删除或已禁用的动作。
- Data Grid 使用虚拟行、冻结列、多列过滤、列宽配置、独立行选择和单元格编辑。Tree View 使用稳定节点 ID，方向键、Home/End、文字定位与展开状态；删除/收起后恢复合法焦点。宿主拥有记录、选择、过滤及列宽，可序列化到自己的存储。
- 浮层每次使用新会话 ID；结果区分 confirm / cancel / outside / back / programmatic，业务只在 confirm 时保存。旧会话迟到关闭不得影响新会话。
- 通知使用一个状态对象和一个 Host。指针、键盘焦点、读屏及后台暂停超时，恢复后使用剩余时间；需要恢复操作的错误使用持久 Snackbar/Banner，不能仅依赖短暂 Toast。
- 系统减少动态效果与应用偏好合并。默认跟随系统主题、字号和方向；隐藏/后台等待动画暂停，拖动直接跟随。禁止强制关闭系统偏好。
- 导航回调、系统文档选择、图片下载/失败兜底、上传、异步取消和生产存储由宿主提供。Context Menu 同时有可见“更多操作”入口。产品专属 Metric/Prober/File Row 提供文字趋势、健康状态、时间、文件元数据和独立打开动作。

## 检查与状态

执行输出见 [native-checks.json](native-checks.json)，独立审计见 [审计记录](native-beta-audit.md)。自动渲染矩阵检查初始布局，不等同于每一种交互、原生 UI 执行或人工读屏验收。macOS SwiftPM 测试不计作 iOS UI 通过。所有失败、未执行和外部阻塞必须保留。

四条人工路径是 Flutter iOS VoiceOver、Flutter Android TalkBack、SwiftUI iOS VoiceOver、Compose Android TalkBack。按 [人工验收表](manual-acceptance.md) 操作并记录真实设备、系统、测试者及结果；没有记录不能批准整库 Beta。
