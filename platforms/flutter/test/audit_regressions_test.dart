import 'package:flutter/material.dart';
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
}
