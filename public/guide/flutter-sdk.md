# Flutter SDK

Prototype，2026-10-10。首批 14 个组件有公开实现；其余 47 项为 Draft。未发布到公共 registry，Beta 未验收。

## 实际接入

```dart
import 'package:rosemary_reference/rosemary.dart';
MaterialApp(theme: rosemaryThemeData(Brightness.light),
  darkTheme: rosemaryThemeData(Brightness.dark),
  home: RosemaryButton(label: '保存', loading: busy, onPressed: save));
```
本地 path 依赖指向 platforms/flutter。原有 Button/TextField/Switch 签名保持兼容。Select<T> 接受 RosemaryOption<T>，受控 value 与 onChanged；Dialog 返回 confirm/cancel，原生外部/返回关闭当前返回 null（尚未细分原因）。Tabs 保留面板 state，并由宿主确认 index。Spinner 遵循 MediaQuery.disableAnimations，busy 保留按钮几何和动作名称。

```sh
cd platforms/flutter
flutter pub get
flutter analyze
flutter test
cd example
flutter pub get
flutter test
flutter build ios --simulator --no-codesign
flutter build apk --debug
```
Dart >=3.12 / Flutter >=3.44；示例 iOS 15+、Android 26+。实际验证 Flutter 3.44.8 / Dart 3.12.2。当前使用 Material 主题与 adaptive Switch/Slider/Dialog，iOS 表单尚需 Cupertino 策略验收。

## 范围与验收

公开组件：Button、Icon Button、Text Field、Text Area、Checkbox、Switch、Slider、Select、Tabs、Dialog、Alert Dialog、Progress、Spinner、Empty State。源码位于 platforms/flutter；示例包含编辑项目、保存失败、重试、取消与明确清空确认，不含生产网络服务。

实际执行结果见 [native-checks.json](native-checks.json)，Beta 门槛见 [总设计](native-sdk-design.md)。自动测试不能代替 VoiceOver/TalkBack 人工检查；尚未覆盖全部设备、系统版本、长列表、后台恢复、快速反向与关闭原因，不能声明整库 Beta。

## 独立审计修复

本轮审计记录见 NATIVE-SDK-AUDIT-2026-10-10.md。修复以独立复現和回归验证为准，不以无发现替代 Beta 验收。
