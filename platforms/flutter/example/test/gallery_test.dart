import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';
import '../lib/gallery.dart';

void main() {
  for (final platform in [TargetPlatform.android, TargetPlatform.iOS]) {
    for (final dark in [false, true]) {
      for (final rtl in [false, true]) {
        testWidgets(
          '61 previews at 320px 2x type platform=$platform dark=$dark rtl=$rtl',
          (tester) async {
            tester.view.physicalSize = const Size(320, 900);
            tester.view.devicePixelRatio = 1;
            addTearDown(tester.view.resetPhysicalSize);
            addTearDown(tester.view.resetDevicePixelRatio);
            for (final id in rosemaryGalleryIds) {
              await tester.pumpWidget(
                MaterialApp(
                  theme: rosemaryThemeData(
                    dark ? Brightness.dark : Brightness.light,
                  ).copyWith(platform: platform),
                  home: MediaQuery(
                    data: const MediaQueryData(
                      size: Size(320, 900),
                      textScaler: TextScaler.linear(2),
                      disableAnimations: true,
                    ),
                    child: Directionality(
                      textDirection: rtl
                          ? TextDirection.rtl
                          : TextDirection.ltr,
                      child: RosemaryGallery(key: ValueKey(id), initialId: id),
                    ),
                  ),
                ),
              );
              await tester.pump();
              expect(
                tester.takeException(),
                isNull,
                reason: '$id dark=$dark rtl=$rtl',
              );
              expect(find.text('组件预览 · $id'), findsOneWidget);
            }
            await tester.pumpWidget(const SizedBox.shrink());
          },
        );
      }
    }
  }
  testWidgets('checkbox number pagination and tree change actual host state', (
    tester,
  ) async {
    Future<void> mount(String id) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: rosemaryThemeData(Brightness.light),
          home: RosemaryGallery(key: ValueKey(id), initialId: id),
        ),
      );
      await tester.pump();
    }

    await mount('checkbox');
    await tester.tap(find.text('通知我'));
    await tester.pump();
    expect(
      tester.widget<RosemaryCheckbox>(find.byType(RosemaryCheckbox)).value,
      isTrue,
    );
    await mount('number-field');
    await tester.tap(find.byTooltip('增加 数量'));
    await tester.pump();
    expect(find.text('51.0'), findsOneWidget);
    await mount('pagination');
    await tester.tap(find.text('下一页'));
    await tester.pump();
    expect(find.text('2 / 3'), findsOneWidget);
    await mount('tree-view');
    await tester.tap(find.byTooltip('展开 项目'));
    await tester.pump();
    expect(find.text('笔记 · 第 2 级'), findsOneWidget);
  });
}
