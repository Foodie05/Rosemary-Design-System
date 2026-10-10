import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_example/main.dart';

void main() {
  testWidgets('Validation, failure and retry preserve the edited draft', (
    tester,
  ) async {
    await tester.pumpWidget(const RosemaryExample());
    await tester.ensureVisible(find.text('保存项目'));
    await tester.tap(find.text('保存项目'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 700));
    expect(find.text('保存失败，草稿已保留，请重试'), findsOneWidget);
    await tester.tap(find.text('重试保存'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 700));
    expect(find.text('已保存'), findsOneWidget);
    expect(find.text('Rosemary Notes'), findsOneWidget);
  });
}
