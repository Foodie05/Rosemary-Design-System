import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() {
  testWidgets('numeric draft rejects invalid and commits valid input', (
    t,
  ) async {
    double value = 5;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (context, setState) => RosemaryNumberField(
              label: '数量',
              value: value,
              onChanged: (v) => setState(() => value = v),
            ),
          ),
        ),
      ),
    );
    await t.enterText(find.byType(TextField), '101');
    await t.tap(find.text('应用数值'));
    await t.pump();
    expect(value, 5);
    expect(find.text('请输入 0.0 至 100.0 的数字'), findsOneWidget);
    await t.enterText(find.byType(TextField), '25');
    await t.tap(find.text('应用数值'));
    await t.pump();
    expect(value, 25);
    expect(t.takeException(), isNull);
  });
  testWidgets('command keyboard skips disabled and closes before invoking', (
    t,
  ) async {
    final events = <String>[];
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryCommandPalette(
            onClose: () => events.add('close'),
            actions: [
              RosemaryAction('save', '保存', () => events.add('save')),
              const RosemaryAction('disabled', '禁用', null),
              RosemaryAction('archive', '归档', () => events.add('archive')),
            ],
          ),
        ),
      ),
    );
    await t.pump();
    await t.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pump();
    expect(events, ['close', 'archive']);
    expect(t.takeException(), isNull);
  });
  testWidgets('modal reasons, focus loop and restoration', (t) async {
    final trigger = FocusNode();
    addTearDown(trigger.dispose);
    final nav = GlobalKey<NavigatorState>();
    RosemaryDismissReason? result;
    final events = <RosemaryDismissReason>[];
    await t.pumpWidget(
      MaterialApp(
        navigatorKey: nav,
        home: Builder(
          builder: (context) => Scaffold(
            body: TextButton(
              focusNode: trigger,
              onPressed: () async {
                result = await showRosemaryModal(
                  context,
                  title: '项目设置',
                  sessionId: DateTime.now().toIso8601String(),
                  onClose: events.add,
                  content: const TextField(
                    decoration: InputDecoration(labelText: '草稿'),
                  ),
                );
              },
              child: const Text('打开'),
            ),
          ),
        ),
      ),
    );
    for (final reason in RosemaryDismissReason.values) {
      result = null;
      trigger.requestFocus();
      await t.tap(find.text('打开'));
      await t.pumpAndSettle();
      if (reason == RosemaryDismissReason.cancel) {
        for (var i = 0; i < 9; i++) {
          await t.sendKeyEvent(LogicalKeyboardKey.tab);
          await t.pump();
          expect(
            FocusManager.instance.primaryFocus?.context
                ?.findAncestorWidgetOfExactType<RosemaryDialog>(),
            isNotNull,
          );
        }
        await t.tap(find.text('取消'));
      }
      if (reason == RosemaryDismissReason.confirm) await t.tap(find.text('确认'));
      if (reason == RosemaryDismissReason.outside)
        await t.tapAt(const Offset(8, 8));
      if (reason == RosemaryDismissReason.back)
        await t.sendKeyEvent(LogicalKeyboardKey.escape);
      if (reason == RosemaryDismissReason.programmatic) nav.currentState!.pop();
      await t.pumpAndSettle();
      expect(result, reason);
      expect(trigger.hasFocus, isTrue);
      expect(events.last, reason);
      expect(t.takeException(), isNull);
    }
    expect(events.length, 5);
  });
  testWidgets('toast pauses, preserves remaining time and rejects old timer', (
    t,
  ) async {
    int now = 0;
    final controller = RosemaryToastController(nowMillis: () => now);
    addTearDown(controller.dispose);
    await t.pumpWidget(
      MaterialApp(
        home: RosemaryToastHost(
          controller: controller,
          child: const Scaffold(body: Text('页面')),
        ),
      ),
    );
    controller.show('第一条', duration: const Duration(seconds: 1));
    await t.pump();
    now = 200;
    controller.pause('reader');
    expect(controller.remainingMillis, 800);
    await t.pump(const Duration(seconds: 2));
    expect(controller.message, '第一条');
    controller.resume('reader');
    controller.show('第二条', duration: const Duration(seconds: 2));
    await t.pump(const Duration(milliseconds: 900));
    expect(controller.message, '第二条');
    await t.pump(const Duration(milliseconds: 1100));
    expect(controller.message, isNull);
    controller.show('后台消息', duration: const Duration(seconds: 1));
    await t.pump();
    t.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
    await t.pump(const Duration(seconds: 2));
    expect(controller.message, '后台消息');
    t.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
    await t.pump(const Duration(seconds: 1));
    expect(controller.message, isNull);
    await t.pumpWidget(const SizedBox.shrink());
  });
}
