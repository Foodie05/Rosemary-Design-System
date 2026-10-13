import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:rosemary_gallery/main.dart';
import 'package:rosemary_ui/rosemary_ui.dart';

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets(
    'installed sample native editing date cancellation and stopped progress',
    (tester) async {
      await tester.pumpWidget(const GalleryApp());
      await tester.pumpAndSettle();
      final selector = find.byKey(const ValueKey('gallery-selector'));
      await tester.tap(
        find.descendant(of: selector, matching: find.text('button')),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.text('input'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(EditableText), 'Rosemary');
      await tester.pumpAndSettle();
      expect(find.text('Rosemary'), findsOneWidget);
      await tester.tap(
        find.descendant(of: selector, matching: find.text('input')),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.text('date'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Choose'));
      await tester.pumpAndSettle();
      await tester.enterText(find.byType(EditableText).first, '0001-01-01');
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
