import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() {
  testWidgets(
    'disabled file, long color names, compact table sorting, controlled combo',
    (tester) async {
      tester.view.physicalSize = const Size(320, 900);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      final query = TextEditingController(text: '团');
      addTearDown(query.dispose);
      int files = 0, sorts = 0;
      String? chosen;
      await tester.pumpWidget(
        MaterialApp(
          theme: rosemaryThemeData(Brightness.light),
          home: Scaffold(
            body: SingleChildScrollView(
              child: Column(
                children: [
                  RosemaryFileRow(
                    file: const RosemaryItem('x', '禁用文件', enabled: false),
                    onSelected: (_) => files++,
                  ),
                  RosemaryColorPicker(
                    label: '颜色',
                    value: Colors.green,
                    colors: const {'这是一段必须在窄屏完整折行的品牌颜色名称': Colors.green},
                    onChanged: (_) {},
                  ),
                  RosemaryTable(
                    columns: const [RosemaryColumn('name', '名称')],
                    rows: const [
                      RosemaryRecord('x', {'name': 'A'}),
                    ],
                    onSort: (_, __) => sorts++,
                  ),
                  RosemaryComboBox<String>(
                    label: '分类',
                    value: 'a',
                    controller: query,
                    options: const [
                      RosemaryOption('a', '个人'),
                      RosemaryOption('b', '团队'),
                    ],
                    onSelected: (v) => chosen = v,
                  ),
                ],
              ),
            ),
          ),
        ),
      );
      expect(tester.takeException(), isNull);
      await tester.tap(find.text('禁用文件'));
      expect(files, 0);
      await tester.tap(find.text('按名称排序'));
      expect(sorts, 1);
      await tester.tap(find.text('团队'));
      expect(chosen, 'b');
      expect(query.text, '团');
    },
  );
  testWidgets(
    'virtual grid filters two columns, does not eagerly build 1000 rows, navigates and cancels edits',
    (tester) async {
      final cfg = RosemaryGridConfiguration();
      addTearDown(cfg.dispose);
      final rows = List.generate(
        1000,
        (i) => RosemaryRecord('r$i', {
          'name': '项目 $i',
          'kind': i.isEven ? 'A' : 'B',
        }),
      );
      String? commit;
      await tester.pumpWidget(
        MaterialApp(
          theme: rosemaryThemeData(Brightness.light),
          home: Scaffold(
            body: RosemaryDataGrid(
              columns: const [
                RosemaryColumn('name', '名称', editable: true),
                RosemaryColumn('kind', '分类'),
              ],
              rows: rows,
              selected: const {},
              configuration: cfg,
              onSelectionChanged: (_) {},
              onCellCommit: (r, c, v) => commit = '$r:$c:$v',
            ),
          ),
        ),
      );
      expect(find.text('○ 名称: 项目 999'), findsNothing);
      cfg.filter('name', '项目 99');
      cfg.filter('kind', 'A');
      await tester.pump();
      expect(find.text('5 条记录 · 0 项已选择'), findsOneWidget);
      await tester.tap(find.text('○ 名称: 项目 990'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(TextField).last, '未保存');
      await tester.tap(find.text('取消'));
      await tester.pumpAndSettle();
      expect(commit, isNull);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.pump();
      expect(cfg.column, 'kind');
      cfg.resize('kind', 999);
      expect(cfg.width('kind'), 480);
      cfg.resize('kind', 0);
      expect(cfg.width('kind'), 96);
      expect(tester.takeException(), isNull);
    },
  );
  test('modal sessions reject late/duplicate closes', () {
    final events = <RosemaryDismissReason>[];
    final s = RosemaryModalSession('new', events.add);
    expect(s.close('old', RosemaryDismissReason.confirm), isFalse);
    expect(s.close('new', RosemaryDismissReason.cancel), isTrue);
    expect(s.close('new', RosemaryDismissReason.confirm), isFalse);
    expect(events, [RosemaryDismissReason.cancel]);
  });
}
