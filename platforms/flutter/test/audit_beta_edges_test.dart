import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

// Independent audit regressions: exercise user actions and host updates.
void main() {
  testWidgets('context menu rejects action disabled after opening', (t) async {
    late StateSetter set;
    int calls = 0;
    int latestCalls = 0;
    bool present = true;
    var actions = [
      RosemaryAction('delete', '删除', () {
        calls++;
      }),
    ];
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, s) {
              set = s;
              if (!present) return const Text('Removed');
              return RosemaryContextMenu(
                actions: actions,
                child: const SizedBox(
                  width: 150,
                  height: 100,
                  child: Text('文件'),
                ),
              );
            },
          ),
        ),
      ),
    );
    await t.longPress(find.text('文件'));
    await t.pumpAndSettle();
    set(() => actions = const [RosemaryAction('delete', '删除', null)]);
    await t.pumpAndSettle();
    await t.tap(find.text('删除'));
    await t.pumpAndSettle();
    print('CONTEXT_DISABLED_CALLS=$calls');
    expect(calls, 0);
    expect(t.takeException(), isNull);
    set(() => actions = [RosemaryAction('delete', '删除', () => calls++)]);
    await t.pumpAndSettle();
    await t.longPress(find.text('文件'));
    await t.pumpAndSettle();
    set(() => actions = [RosemaryAction('delete', '删除', () => latestCalls++)]);
    await t.pumpAndSettle();
    await t.tap(find.text('删除'));
    await t.pumpAndSettle();
    expect(calls, 0);
    expect(latestCalls, 1);
    await t.longPress(find.text('文件'));
    await t.pumpAndSettle();
    set(() => present = false);
    await t.pumpAndSettle();
    await t.tap(find.text('删除'));
    await t.pumpAndSettle();
    expect(latestCalls, 1);
    expect(t.takeException(), isNull);
  });
  testWidgets('dropdown menu handles action removed after opening', (t) async {
    late StateSetter set;
    int calls = 0;
    var actions = [
      RosemaryAction('delete', '删除', () {
        calls++;
      }),
    ];
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, s) {
              set = s;
              return RosemaryDropdownMenu(label: '操作', actions: actions);
            },
          ),
        ),
      ),
    );
    await t.tap(find.text('操作'));
    await t.pumpAndSettle();
    set(() => actions = []);
    await t.pumpAndSettle();
    await t.tap(find.text('删除'));
    await t.pumpAndSettle();
    expect(calls, 0);
    expect(t.takeException(), isNull);
  });
  testWidgets('combo keyboard selects enabled suggestion', (t) async {
    final controller = TextEditingController();
    addTearDown(controller.dispose);
    String? request;
    int requests = 0;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryComboBox<String>(
            label: '成员',
            value: null,
            controller: controller,
            options: const [
              RosemaryOption('one', '第一项'),
              RosemaryOption('disabled', '不可选', enabled: false),
              RosemaryOption('two', '第二项'),
            ],
            onSelected: (v) {
              request = v;
              requests++;
            },
          ),
        ),
      ),
    );
    await t.tap(find.byType(TextField));
    await t.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pumpAndSettle();
    print('COMBO_KEYBOARD_REQUEST=$request');
    expect(request, 'one');
    expect(requests, 1);
    expect(controller.text, isEmpty);
    expect(find.byIcon(Icons.check), findsNothing);
    request = null;
    await t.sendKeyEvent(LogicalKeyboardKey.escape);
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pumpAndSettle();
    expect(request, isNull);
    expect(requests, 1);
    await t.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await t.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pumpAndSettle();
    expect(request, 'two');
    expect(requests, 2);
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryComboBox<String>(
            label: '成员',
            value: null,
            controller: controller,
            options: const [
              RosemaryOption('one', '第一项'),
              RosemaryOption('two', '第二项'),
            ],
            onSelected: null,
          ),
        ),
      ),
    );
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pumpAndSettle();
    expect(requests, 2);
  });
  testWidgets('command keyboard wraps at end', (t) async {
    String? request;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryCommandPalette(
            onClose: () {},
            actions: [
              RosemaryAction('a', 'A', () {
                request = 'a';
              }),
              RosemaryAction('b', 'B', () {
                request = 'b';
              }),
            ],
          ),
        ),
      ),
    );
    await t.pump();
    await t.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await t.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pumpAndSettle();
    print('COMMAND_WRAP_RESULT=$request');
    expect(request, 'a');
  });

  testWidgets('toast controller replacement preserves focus pause', (t) async {
    int now = 0;
    final a = RosemaryToastController(nowMillis: () => now);
    final b = RosemaryToastController(nowMillis: () => now);
    late StateSetter update;
    var current = a;
    await t.pumpWidget(
      MaterialApp(
        home: StatefulBuilder(
          builder: (context, set) {
            update = set;
            return RosemaryToastHost(
              controller: current,
              child: const Scaffold(body: Text('页面')),
            );
          },
        ),
      ),
    );
    a.show('A', duration: const Duration(seconds: 1));
    await t.pump();
    final closeFocus = Focus.of(t.element(find.byIcon(Icons.close)));
    closeFocus.requestFocus();
    await t.pump();
    expect(closeFocus.hasPrimaryFocus, isTrue);
    now = 2000;
    await t.pump(const Duration(seconds: 2));
    expect(a.message, 'A');
    b.show('B', duration: const Duration(seconds: 1));
    update(() => current = b);
    await t.pump();
    now = 4000;
    await t.pump(const Duration(seconds: 2));
    print('TOAST_SWAP_FOCUS_B=${b.message}');
    expect(b.message, 'B');
    await t.pumpWidget(const SizedBox());
    a.resume('detached');
    now = 6000;
    await t.pump(const Duration(seconds: 2));
    expect(a.message, isNull);
    a.dispose();
    b.dispose();
  });

  testWidgets('command End reveals selected command', (t) async {
    String? invoked;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryCommandPalette(
            onClose: () {},
            actions: List.generate(
              40,
              (i) => RosemaryAction('a$i', 'Command $i', () {
                invoked = 'a$i';
              }),
            ),
          ),
        ),
      ),
    );
    await t.pump();
    await t.sendKeyEvent(LogicalKeyboardKey.end);
    await t.pumpAndSettle();
    expect(find.text('Command 39'), findsOneWidget);
    expect(
      t.getRect(find.text('Command 39')).bottom,
      lessThanOrEqualTo(t.view.physicalSize.height / t.view.devicePixelRatio),
    );
    await t.sendKeyEvent(LogicalKeyboardKey.home);
    await t.pumpAndSettle();
    expect(find.text('Command 0'), findsOneWidget);
    expect(t.getRect(find.text('Command 0')).top, greaterThanOrEqualTo(0));
    expect(
      t.getRect(find.text('Command 0')).bottom,
      lessThanOrEqualTo(t.view.physicalSize.height / t.view.devicePixelRatio),
    );
    await t.sendKeyEvent(LogicalKeyboardKey.end);
    await t.pumpAndSettle();
    await t.sendKeyEvent(LogicalKeyboardKey.enter);
    await t.pumpAndSettle();
    expect(invoked, 'a39');
  });
  testWidgets('RTL context menu stays near pointer', (t) async {
    await t.pumpWidget(
      MaterialApp(
        builder: (context, child) =>
            Directionality(textDirection: TextDirection.rtl, child: child!),
        home: Scaffold(
          body: Align(
            alignment: Alignment.topLeft,
            child: RosemaryContextMenu(
              actions: [RosemaryAction('x', 'Action', () {})],
              child: const SizedBox(
                width: 100,
                height: 100,
                child: Text('File'),
              ),
            ),
          ),
        ),
      ),
    );
    await t.longPressAt(const Offset(30, 30));
    await t.pumpAndSettle();
    final rect = t.getRect(find.text('Action'));
    print('RTL_MENU_RECT=$rect');
    expect(rect.left, lessThan(150));
  });

  testWidgets(
    'closing first modal cannot pop next modal opened by result callback',
    (t) async {
      late BuildContext host;
      RosemaryDismissReason? firstResult, secondResult;
      final homeFocus = FocusNode();
      final secondFocus = FocusNode();
      addTearDown(homeFocus.dispose);
      addTearDown(secondFocus.dispose);
      await t.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (c) {
              host = c;
              return Scaffold(
                body: TextField(focusNode: homeFocus, autofocus: true),
              );
            },
          ),
        ),
      );
      await t.pumpAndSettle();
      expect(homeFocus.hasPrimaryFocus, isTrue);
      showRosemaryModal(
        host,
        title: 'First',
        content: const Text('First body'),
        sessionId: 'first',
        onClose: (r) {
          showRosemaryModal(
            host,
            title: 'Second',
            content: TextField(focusNode: secondFocus, autofocus: true),
            sessionId: 'second',
          ).then((r) => secondResult = r);
        },
      ).then((r) => firstResult = r);
      await t.pumpAndSettle();
      await t.tap(find.text('确认'));
      await t.pumpAndSettle();
      print('FIRST_RESULT=$firstResult SECOND_RESULT=$secondResult');
      expect(firstResult, RosemaryDismissReason.confirm);
      expect(secondResult, isNull);
      expect(find.text('Second'), findsOneWidget);
      expect(find.text('First'), findsNothing);
      expect(secondFocus.hasPrimaryFocus, isTrue);
      expect(homeFocus.hasFocus, isFalse);
      await t.tap(find.text('取消'));
      await t.pumpAndSettle();
      expect(secondResult, RosemaryDismissReason.cancel);
      expect(firstResult, RosemaryDismissReason.confirm);
      expect(homeFocus.hasPrimaryFocus, isTrue);
    },
  );
}
