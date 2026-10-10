import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() {
  Widget app(Widget child, {bool reduced = false}) => MaterialApp(
      theme: rosemaryThemeData(Brightness.dark),
      home: MediaQuery(
          data: MediaQueryData(disableAnimations: reduced),
          child: Scaffold(body: child)));
  testWidgets(
      'Busy geometry is stable, action name stays and reduced motion stops spinning',
      (t) async {
    await t.pumpWidget(app(RosemaryButton(label: '保存', onPressed: () {})));
    final size = t.getSize(find.byType(FilledButton));
    await t.pumpWidget(app(
        RosemaryButton(label: '保存', loading: true, onPressed: () {}),
        reduced: true));
    expect(t.getSize(find.byType(FilledButton)), size);
    expect(find.byType(CircularProgressIndicator), findsNothing);
    expect(find.text('保存'), findsOneWidget);
  });
  testWidgets(
      'Select cancellation does not commit, disabled items cannot commit',
      (t) async {
    final changes = <String>[];
    await t.pumpWidget(app(RosemarySelect(
        value: 'missing',
        label: '分类',
        options: const [
          RosemaryOption('a', '个人'),
          RosemaryOption('b', '团队', enabled: false)
        ],
        onChanged: changes.add)));
    expect(find.text('请选择'), findsOneWidget);
    await t.tap(find.text('请选择'));
    await t.pumpAndSettle();
    await t.sendKeyEvent(LogicalKeyboardKey.escape);
    await t.pumpAndSettle();
    expect(changes, isEmpty);
    await t.tap(find.text('请选择'));
    await t.pumpAndSettle();
    expect(
        t
            .widget<MenuItemButton>(find.widgetWithText(MenuItemButton, '团队'))
            .onPressed,
        isNull);
    await t.tap(find.text('个人'));
    await t.pumpAndSettle();
    expect(changes, ['a']);
  });
  testWidgets('Empty select is disabled and checkbox remains controlled',
      (t) async {
    bool? changed;
    await t.pumpWidget(app(Column(children: [
      RosemarySelect<String>(
          value: null, label: '分类', options: const [], onChanged: (_) {}),
      RosemaryCheckbox(label: '同步', value: false, onChanged: (v) => changed = v)
    ])));
    expect(t.widget<OutlinedButton>(find.byType(OutlinedButton)).onPressed,
        isNull);
    await t.tap(find.text('同步'));
    await t.pump();
    expect(changed, true);
    expect(t.widget<Checkbox>(find.byType(Checkbox)).value, false);
  });
  testWidgets('Native dialog cancel and confirmation are distinct', (t) async {
    RosemaryDialogResult? result;
    await t.pumpWidget(app(Builder(
        builder: (c) => RosemaryButton(
            label: '打开',
            onPressed: () async {
              result = await showRosemaryDialog(c,
                  title: '编辑', content: const Text('草稿'));
            }))));
    await t.tap(find.text('打开'));
    await t.pumpAndSettle();
    await t.tap(find.text('取消'));
    await t.pumpAndSettle();
    expect(result, RosemaryDialogResult.cancel);
    await t.tap(find.text('打开'));
    await t.pumpAndSettle();
    await t.tap(find.text('确认'));
    await t.pumpAndSettle();
    expect(result, RosemaryDialogResult.confirm);
  });
  testWidgets(
      'Tabs reject a tap when host does not commit and retain their panels',
      (t) async {
    int? requested;
    await t.pumpWidget(app(RosemaryTabs(
        labels: const ['概览', '设置'],
        panels: const [Text('Panel A'), Text('Panel B')],
        value: 0,
        onChanged: (v) => requested = v)));
    await t.tap(find.text('设置'));
    await t.pumpAndSettle();
    expect(requested, 1);
    expect(find.text('Panel A'), findsOneWidget);
    expect(find.text('Panel B'), findsNothing);
    expect(t.widget<TabBar>(find.byType(TabBar)).controller!.index, 0);
  });
  for (final brightness in [Brightness.light, Brightness.dark]) {
    testWidgets('Large type and RTL remain usable in $brightness', (t) async {
      t.view.physicalSize = const Size(320, 900);
      t.view.devicePixelRatio = 1;
      addTearDown(t.view.resetPhysicalSize);
      addTearDown(t.view.resetDevicePixelRatio);
      final controller = TextEditingController(text: 'Draft');
      addTearDown(controller.dispose);
      await t.pumpWidget(MaterialApp(
          theme: rosemaryThemeData(brightness),
          home: MediaQuery(
              data: const MediaQueryData(
                  textScaler: TextScaler.linear(2), disableAnimations: true),
              child: Directionality(
                  textDirection: TextDirection.rtl,
                  child: Scaffold(
                      body: SingleChildScrollView(
                          child: Column(children: [
                    RosemaryButton(label: '保存更改', onPressed: () {}),
                    RosemaryIconButton(
                        label: '编辑项目', icon: Icons.edit, onPressed: () {}),
                    RosemaryTextField(label: '项目名称', controller: controller),
                    RosemaryTextArea(label: '项目笔记', controller: controller),
                    RosemaryCheckbox(
                        label: '通知我保存结果', value: true, onChanged: (_) {}),
                    RosemarySwitch(
                        label: '自动同步', value: true, onChanged: (_) {}),
                    RosemarySelect(
                        value: 'a',
                        label: '分类',
                        options: const [RosemaryOption('a', '个人')],
                        onChanged: (_) {}),
                    RosemarySlider(label: '进度', value: 50, onChanged: (_) {}),
                    RosemaryProgress(label: '保存进度', value: .5),
                    const RosemarySpinner(),
                    const RosemaryEmptyState(
                        title: '暂无记录', message: '保存项目后会显示记录。'),
                  ])))))));
      await t.pump();
      expect(t.takeException(), isNull);
      final semantics = t.ensureSemantics();
      await expectLater(t, meetsGuideline(androidTapTargetGuideline));
      await expectLater(t, meetsGuideline(labeledTapTargetGuideline));
      semantics.dispose();
    });
  }
}
