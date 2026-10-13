import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:rosemary_gallery/main.dart' as gallery;
import 'package:rosemary_ui/rosemary_ui.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets(
    'installed sample native editing date cancellation and stopped progress',
    (tester) async {
      await gallery.main();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 400));
      final vigilo = await gallery.loadVigiloTheme();
      final selector = find.byKey(const ValueKey('gallery-selector'));
      await tester.tap(
        find.descendant(of: selector, matching: find.text('button')),
      );
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 300));
      await tester.ensureVisible(find.text('input'));
      await tester.tap(find.text('input'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(EditableText), 'Rosemary');
      await tester.pumpAndSettle();
      expect(find.text('Rosemary'), findsOneWidget);
      FocusManager.instance.primaryFocus?.unfocus();
      await tester.pumpAndSettle();
      await tester.tap(find.text('Vigilo'));
      await tester.pumpAndSettle();
      expect(
        RosemaryThemeData.of(
          tester.element(find.byType(EditableText)),
        ).colors.toMap(),
        gallery
            .paletteFromJson(vigilo['light'] as Map<String, dynamic>)
            .toMap(),
      );
      await tester.tap(find.text('Dark'));
      await tester.pumpAndSettle();
      expect(
        RosemaryThemeData.of(
          tester.element(find.byType(EditableText)),
        ).colors.toMap(),
        gallery.paletteFromJson(vigilo['dark'] as Map<String, dynamic>).toMap(),
      );
      await tester.tap(
        find.descendant(of: selector, matching: find.text('input')),
      );
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('date'));
      await tester.tap(find.text('date'));
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('Choose'));
      await tester.tap(find.text('Choose'));
      await tester.pumpAndSettle();
      final nextDay = find.descendant(
        of: find.byType(RosemaryCalendar),
        matching: find.text('14'),
      );
      await tester.ensureVisible(nextDay);
      await tester.tap(nextDay);
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('Cancel'));
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
      expect(find.text('2026-10-13'), findsOneWidget);
      await tester.tap(
        find.descendant(of: selector, matching: find.text('date')),
      );
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('progress'));
      await tester.tap(find.text('progress'));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 400));
      await tester.ensureVisible(find.text('Cancel'));
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
      expect(tester.hasRunningAnimations, isFalse);
      expect(find.text('Uploading: 35%'), findsOneWidget);
      expect(find.byType(RosemaryProgress), findsNWidgets(2));
    },
  );
}
