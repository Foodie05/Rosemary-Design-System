import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';
import 'package:rosemary_reference/rosemary_tokens.dart';

void main() {
  test('ThemeExtension covers copy and interpolation in both modes', () {
    expect(
      RosemaryTheme.light.accent,
      RosemaryLightTokens.semantic_color_accent,
    );
    expect(RosemaryTheme.dark.accent, RosemaryDarkTokens.semantic_color_accent);
    final copy = RosemaryTheme.light.copyWith(accent: Colors.blue);
    expect(copy.accent, Colors.blue);
    expect(copy.ink, RosemaryTheme.light.ink);
    expect(
      RosemaryTheme.light.lerp(RosemaryTheme.dark, 1).surface,
      RosemaryTheme.dark.surface,
    );
    expect(RosemaryTheme.dark.lerp(null, .5), RosemaryTheme.dark);
  });

  for (final mode in [Brightness.light, Brightness.dark]) {
    testWidgets('Core native controls operate in $mode', (tester) async {
      final controller = TextEditingController();
      addTearDown(controller.dispose);
      var saved = 0;
      bool? changed;
      final palette = mode == Brightness.dark
          ? RosemaryTheme.dark
          : RosemaryTheme.light;
      await tester.pumpWidget(
        MaterialApp(
          theme: ThemeData(brightness: mode, extensions: [palette]),
          home: Scaffold(
            body: Column(
              children: [
                RosemaryButton(label: '保存', onPressed: () => saved++),
                RosemaryTextField(label: '项目名称', controller: controller),
                RosemarySwitch(
                  label: '自动同步',
                  value: false,
                  onChanged: (value) => changed = value,
                ),
              ],
            ),
          ),
        ),
      );
      await tester.tap(find.text('保存'));
      expect(saved, 1);
      await tester.enterText(find.byType(TextField), 'Rosemary Notes');
      expect(controller.text, 'Rosemary Notes');
      await tester.tap(find.byType(Switch));
      expect(changed, true);
      final button = tester.widget<FilledButton>(find.byType(FilledButton));
      expect(button.style!.backgroundColor!.resolve({}), palette.accent);
      expect(button.style!.foregroundColor!.resolve({}), palette.onAccent);
    });
  }

  testWidgets('Loading prevents duplicate button submission', (tester) async {
    var submitted = false;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryButton(
            label: '保存',
            loading: true,
            onPressed: () => submitted = true,
          ),
        ),
      ),
    );
    expect(
      tester.widget<FilledButton>(find.byType(FilledButton)).onPressed,
      isNull,
    );
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    expect(submitted, false);
  });
}
