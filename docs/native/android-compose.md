# Android Compose SDK

状态：Prototype。全部 61 项规范组件都有公开 API 和宿主示例，目标为整库 Beta。当前工程版本为 `0.3.0-prototype.2`；人工辅助技术与设备验收尚未完成，因此不宣称 Beta 已获批准。未发布到 pub.dev、Maven 或 Swift Package Registry。

完整组件、API、源码对应表见 [API 清单](api.md) 与 [机器清单](component-coverage.json)。规范行为以网站对应组件页面为准；示例使用内存业务状态，不承担生产持久化、权限或网络服务。

## 接入

`rosemary-compose` 是 Android library，`sample` 是宿主 Activity。包名 `design.rosemary.compose`，min SDK 26，compile/target 36。锁定 Gradle 8.14.3、AGP 8.13.2、Kotlin 2.2.20、Compose BOM 2025.10.00；JDK 21 用于构建。

把 `platforms/android/rosemary-compose` 纳入已有 Gradle 工程并使用 `implementation(project(":rosemary-compose"))`；共享插件版本需与宿主一致。AAR 的 Compose 依赖仍由 Gradle 提供，不能只拷贝 AAR 期待它包含所有运行库。

```kotlin
import design.rosemary.compose.*
RosemaryTheme(reducedMotion = appReduced) {
    RosemaryToastHost(toast) {
        RosemaryButton(label = "保存", onClick = save, busy = busy)
    }
}
```

文本有 `String` 与 `TextFieldValue` 重载。需要保存输入法 composing / selection 时使用 TextFieldValue；不会在每次重组替换原生编辑状态。主题映射全部 Material 3 语义角色，默认不启用 Dynamic Color。触控至少 48dp，文字使用 sp。

```kotlin
if (session != null) {
    RosemaryModal(sessionId = session!!.id, title = "项目设置",
        onClose = { reason ->
            if (reason == RosemaryDismissReason.Confirm) save(draft)
            session = null
        }) { RosemaryTextField(draft, { draft = it }, "名称") }
}
```

每次打开必须生成新 sessionId。兼容 `RosemaryDialog` 保留 OutsideOrBack；新 `RosemaryModal` 区分全部五种原因。文件示例使用 OpenMultipleDocuments Activity Result contract；持久访问需宿主按业务处理权限和异常。真实导航由宿主 NavController/Activity 实现。

```sh
cd platforms/android
./gradlew :rosemary-compose:testDebugUnitTest :rosemary-compose:assembleDebug :sample:assembleDebug
./gradlew :rosemary-compose:connectedDebugAndroidTest :sample:connectedDebugAndroidTest
```

`sample/.../Gallery.kt` 包含全部 61 项。设备 UI 测试与纯 JVM 状态测试分开计数，不能互相替代。

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

执行输出见 [native-checks.json](../native-checks.json)，独立审计见 [审计记录](../NATIVE-BETA-AUDIT-2026-10-10.md)。自动渲染矩阵检查初始布局，不等同于每一种交互、原生 UI 执行或人工读屏验收。macOS SwiftPM 测试不计作 iOS UI 通过。所有失败、未执行和外部阻塞必须保留。

四条人工路径是 Flutter iOS VoiceOver、Flutter Android TalkBack、SwiftUI iOS VoiceOver、Compose Android TalkBack。按 [人工验收表](manual-acceptance.md) 操作并记录真实设备、系统、测试者及结果；没有记录不能批准整库 Beta。
