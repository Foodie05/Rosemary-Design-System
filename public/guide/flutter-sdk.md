# Flutter SDK

状态：Prototype。全部 61 项规范组件都有公开 API 和宿主示例，目标为整库 Beta。当前工程版本为 `0.3.0-prototype.2`；人工辅助技术与设备验收尚未完成，因此不宣称 Beta 已获批准。未发布到 pub.dev、Maven 或 Swift Package Registry。

完整组件、API、源码对应表见 [API 清单](api.md) 与 [机器清单](component-coverage.json)。规范行为以网站对应组件页面为准；示例使用内存业务状态，不承担生产持久化、权限或网络服务。

## 接入

Flutter >=3.44 / Dart >=3.12。iOS 示例最低 15，Android 最低 26；原生平台表现通过 Material / Cupertino 适配，库不替换宿主 Navigator。

```yaml
dependencies:
  rosemary_reference:
    path: ../rosemary-design-system/platforms/flutter
```

```dart
import 'package:rosemary_reference/rosemary.dart';
MaterialApp(
  theme: rosemaryThemeData(Brightness.light),
  darkTheme: rosemaryThemeData(Brightness.dark),
  // 不指定 themeMode 即跟随系统；平台由 Flutter 环境决定。
  home: RosemaryMotionScope(reducedMotion: appReduced,
    child: RosemaryToastHost(controller: toast, child: projectEditor)),
);
```

库导出全部 61 项及 `RosemaryOption<T>`、`RosemaryAction`、`RosemaryGridConfiguration`、`RosemaryModalSession`、`RosemaryToastController`。TextEditingController 属于宿主，保留 selection/composing，离开时由宿主 dispose。

```dart
final reason = await showRosemaryModal(context,
  title: '项目设置', sessionId: operationId,
  content: RosemaryTextField(label: '名称', controller: draft),
);
if (reason == RosemaryDismissReason.confirm) save(draft.text);
// 控制器属于宿主；状态对象不可每次 build 重新创建。
toast.show('已保存');
```

旧 `showRosemaryDialog` / `showRosemaryAlertDialog` 签名仍保留；需要区分五种关闭原因时使用 `showRosemaryModal`。文档选择由 Host adapter 负责，示例 Android ACTION_OPEN_DOCUMENT、iOS UIDocumentPicker 已接入；长期 URI / security-scoped 权限仍由业务管理。iOS 表单、按钮、单选、多选、Slider 使用原生平台习惯。

```sh
cd platforms/flutter
flutter pub get
flutter analyze
flutter test
cd example
flutter pub get
flutter analyze
flutter test
flutter build ios --simulator --no-codesign
flutter build apk --debug
flutter test integration_test/gallery_test.dart -d <device-id>
```

`integration_test` 是 Flutter SDK 自带的测试依赖，未增加库运行时依赖。Gallery 的 61 项每项使用公开 API，可直接参考 `example/lib/gallery.dart`。

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
