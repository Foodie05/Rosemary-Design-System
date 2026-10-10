import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() {
  testWidgets('Long selected label at narrow width', (t) async {
    t.view.physicalSize = const Size(320, 900);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.resetPhysicalSize);
    addTearDown(t.view.resetDevicePixelRatio);
    await t.pumpWidget(
      MaterialApp(
        theme: rosemaryThemeData(Brightness.light),
        home: Scaffold(
          body: Padding(
            padding: const EdgeInsets.all(24),
            child: RosemarySelect(
              value: 'a',
              label: '分类',
              options: const [RosemaryOption('a', '团队的完整归档分类标签必须在窄屏大字模式下完整可读')],
              onChanged: (_) {},
            ),
          ),
        ),
      ),
    );
    final error = t.takeException();
    print('AUDIT_LONG_SELECT: $error');
    expect(error, isNull);
  });
  testWidgets('Reduced tab tap has zero transition', (t) async {
    int value = 0;
    await t.pumpWidget(
      MaterialApp(
        home: MediaQuery(
          data: const MediaQueryData(disableAnimations: true),
          child: Scaffold(
            body: StatefulBuilder(
              builder: (context, set) => RosemaryTabs(
                labels: const ['A', 'B'],
                panels: const [Text('a'), Text('b')],
                value: value,
                onChanged: (v) => set(() => value = v),
              ),
            ),
          ),
        ),
      ),
    );
    await t.tap(find.text('B'));
    await t.pump();
    final c = t.widget<TabBar>(find.byType(TabBar)).controller!;
    print(
      'AUDIT_REDUCED_TAB: animation=${c.animation!.value}, target=${c.index}, changing=${c.indexIsChanging}',
    );
    expect(c.indexIsChanging, isFalse);
  });
  testWidgets('Field focus preserves corner radius', (t) async {
    final c = TextEditingController();
    addTearDown(c.dispose);
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryTextField(label: '名称', controller: c),
        ),
      ),
    );
    final d = t.widget<TextField>(find.byType(TextField)).decoration!;
    print(
      'AUDIT_FIELD_RADIUS: normal=${(d.border! as OutlineInputBorder).borderRadius}, focus=${(d.focusedBorder! as OutlineInputBorder).borderRadius}',
    );
    expect(
      (d.focusedBorder! as OutlineInputBorder).borderRadius,
      (d.border! as OutlineInputBorder).borderRadius,
    );
  });

  testWidgets('host grid filter is reflected in field', (t) async {
    final cfg = RosemaryGridConfiguration();
    await t.pumpWidget(
      _auditApp(
        RosemaryDataGrid(
          columns: const [RosemaryColumn('name', '名称')],
          rows: const [
            RosemaryRecord('r', {'name': 'Rosemary'}),
          ],
          selected: const {},
          onSelectionChanged: (_) {},
          onCellCommit: (_, __, ___) {},
          configuration: cfg,
        ),
      ),
    );
    cfg.filter('name', 'missing');
    await t.pump();
    expect(find.text('0 条记录 · 0 项已选择'), findsOneWidget);
    final actual = t
        .widget<TextField>(find.byType(TextField).first)
        .controller!
        .text;
    expect(actual, 'missing');
    await t.enterText(find.byType(TextField).first, '');
    await t.pumpAndSettle();
    expect(find.text('1 条记录 · 0 项已选择'), findsOneWidget);
    await t.pumpWidget(const SizedBox());
    cfg.dispose();
  });
  testWidgets('touch selection exists for fully editable grid', (t) async {
    Set<String>? requested;
    await t.pumpWidget(
      _auditApp(
        RosemaryDataGrid(
          columns: const [RosemaryColumn('name', '名称', editable: true)],
          rows: const [
            RosemaryRecord('r', {'name': 'Rosemary'}),
          ],
          selected: const {},
          onSelectionChanged: (next) {
            requested = next;
          },
          onCellCommit: (_, __, ___) {},
        ),
      ),
    );
    expect(find.byType(Checkbox), findsOneWidget);
    await t.tap(find.byType(Checkbox));
    await t.pumpAndSettle();

    expect(requested, {'r'});
    expect(find.text('编辑 名称'), findsNothing);
  });
  testWidgets('search select fits IME at narrow width', (t) async {
    t.view.physicalSize = const Size(320, 568);
    t.view.devicePixelRatio = 1;
    addTearDown(t.view.resetPhysicalSize);
    addTearDown(t.view.resetDevicePixelRatio);
    await t.pumpWidget(
      _auditApp(
        RosemarySelect<int>(
          value: 0,
          label: '选项',
          options: List.generate(10, (i) => RosemaryOption(i, '条目 $i')),
          onChanged: (_) {},
        ),
      ),
    );
    await t.tap(find.text('条目 0'));
    await t.pumpAndSettle();
    t.view.viewInsets = FakeViewPadding(bottom: 300);
    addTearDown(t.view.resetViewInsets);
    await t.pumpAndSettle();
    final e = t.takeException();
    expect(e, isNull);
  });

  testWidgets('focused tree expansion control targets its own node', (t) async {
    Set<String>? changed;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryTreeView(
            nodes: const [
              RosemaryTreeNode(
                'a',
                'A',
                children: [RosemaryTreeNode('ac', 'AC')],
              ),
              RosemaryTreeNode(
                'b',
                'B',
                children: [RosemaryTreeNode('bc', 'BC')],
              ),
            ],
            expanded: const {},
            onExpandedChanged: (v) {
              changed = v;
            },
            onSelected: (_) {},
          ),
        ),
      ),
    );
    bool reachedB = false;
    for (var i = 1; i < 7; i++) {
      await t.sendKeyEvent(LogicalKeyboardKey.tab);
      await t.pump();
      final path = <String>[];
      FocusManager.instance.primaryFocus?.context?.visitAncestorElements((e) {
        path.add(
          e.widget is IconButton
              ? 'IconButton:${(e.widget as IconButton).tooltip}'
              : e.widget is TextButton
              ? 'TextButton:${(e.widget as TextButton).child}'
              : e.widget.runtimeType.toString(),
        );
        return path.length < 40;
      });

      if (path.any((s) => s == 'IconButton:展开 B')) {
        reachedB = true;
        await t.sendKeyEvent(LogicalKeyboardKey.arrowRight);
        await t.pump();
        expect(changed, contains('b'));
        break;
      }
    }
    expect(
      reachedB,
      isTrue,
      reason: 'The keyboard test must actually focus the B expansion control',
    );
  });

  testWidgets('removed active row reconciles focus', (t) async {
    final cfg = RosemaryGridConfiguration();
    List<RosemaryRecord> rows = const [
      RosemaryRecord('a', {'name': 'A'}),
      RosemaryRecord('b', {'name': 'B'}),
    ];
    late StateSetter set;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, s) {
              set = s;
              return RosemaryDataGrid(
                columns: const [RosemaryColumn('name', '名称')],
                rows: rows,
                selected: const {},
                onSelectionChanged: (_) {},
                onCellCommit: (_, __, ___) {},
                configuration: cfg,
              );
            },
          ),
        ),
      ),
    );
    final previous = t
        .widget<OutlinedButton>(find.widgetWithText(OutlinedButton, '○ 名称: B'))
        .focusNode!;
    previous.requestFocus();
    await t.pump();
    expect(previous.hasPrimaryFocus, isTrue);
    expect(cfg.row, 'b');
    set(
      () => rows = const [
        RosemaryRecord('a', {'name': 'A'}),
      ],
    );
    await t.pumpAndSettle();

    expect(cfg.row, 'a');
    final node = t
        .widget<OutlinedButton>(find.widgetWithText(OutlinedButton, '○ 名称: A'))
        .focusNode!;
    expect(node.hasPrimaryFocus, isTrue);
  });
  testWidgets('search select updates open options', (t) async {
    var options = List.generate(10, (i) => RosemaryOption(i, '条目 $i'));
    late StateSetter set;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, s) {
              set = s;
              return RosemarySelect<int>(
                value: 0,
                label: '选项',
                options: options,
                onChanged: (_) {},
              );
            },
          ),
        ),
      ),
    );
    await t.tap(find.text('条目 0'));
    await t.pumpAndSettle();
    set(
      () => options = List.generate(
        10,
        (i) => RosemaryOption(i, '新条目 $i', enabled: i != 1),
      ),
    );
    await t.pumpAndSettle();

    expect(find.text('新条目 1'), findsOneWidget);
    expect(find.text('条目 1'), findsNothing);
  });

  testWidgets('Disabling open date picker prevents old callback', (t) async {
    bool enabled = true;
    int calls = 0;
    late StateSetter host;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, set) {
              host = set;
              return RosemaryDatePicker(
                label: '日期',
                value: DateTime(2026, 10, 10),
                first: DateTime(2020),
                last: DateTime(2030),
                onChanged: enabled
                    ? (_) {
                        calls++;
                      }
                    : null,
              );
            },
          ),
        ),
      ),
    );
    await t.tap(find.text('日期 2026-10-10'));
    await t.pumpAndSettle();
    host(() => enabled = false);
    await t.pump();
    await t.tap(find.text('OK'));
    await t.pumpAndSettle();

    expect(calls, 0);
  });

  testWidgets('select disable, cancellation, close and fresh reopen', (
    t,
  ) async {
    var options = List.generate(10, (i) => RosemaryOption(i, '条目 $i'));
    bool enabled = true;
    late StateSetter set;
    final commits = <int>[];
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, s) {
              set = s;
              return RosemarySelect<int>(
                value: 0,
                label: '选项',
                options: options,
                onChanged: enabled
                    ? (i) {
                        commits.add(i);
                      }
                    : null,
              );
            },
          ),
        ),
      ),
    );
    await t.tap(find.text('条目 0'));
    await t.pumpAndSettle();
    set(() => options[1] = const RosemaryOption(1, '改名条目 1', enabled: false));
    await t.pumpAndSettle();
    expect(find.text('改名条目 1'), findsOneWidget);
    expect(t.takeException(), isNull);
    set(() => enabled = false);
    await t.pumpAndSettle();
    expect(
      t.widget<TextButton>(find.widgetWithText(TextButton, '确认')).onPressed,
      isNull,
    );
    await t.tap(find.text('取消'));
    await t.pumpAndSettle();
    expect(commits, isEmpty);
    expect(t.takeException(), isNull);
    set(() => enabled = true);
    await t.pumpAndSettle();
    await t.tap(find.text('条目 0'));
    await t.pumpAndSettle();
    await t.tap(find.text('条目 2'));
    await t.pump();
    await t.tap(find.text('确认'));
    await t.pumpAndSettle();
    expect(commits, [2]);
    expect(t.takeException(), isNull);
  });
  testWidgets('removed select does not submit open sheet', (t) async {
    bool shown = true;
    late StateSetter set;
    int commits = 0;
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StatefulBuilder(
            builder: (c, s) {
              set = s;
              return shown
                  ? RosemarySelect<int>(
                      value: 0,
                      label: '选项',
                      options: List.generate(
                        10,
                        (i) => RosemaryOption(i, '条目 $i'),
                      ),
                      onChanged: (_) {
                        commits++;
                      },
                    )
                  : const Text('已离开');
            },
          ),
        ),
      ),
    );
    await t.tap(find.text('条目 0'));
    await t.pumpAndSettle();
    set(() => shown = false);
    await t.pumpAndSettle();
    expect(t.takeException(), isNull);
    expect(
      t.widget<TextButton>(find.widgetWithText(TextButton, '确认')).onPressed,
      isNull,
    );
    await t.tap(find.text('取消'));
    await t.pumpAndSettle();
    expect(commits, 0);
    expect(t.takeException(), isNull);
  });
}

Widget _auditApp(Widget child) => MaterialApp(home: Scaffold(body: child));
