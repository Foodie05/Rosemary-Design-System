import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_ui/rosemary_ui.dart';

Widget host(Widget child) => MaterialApp(
  home: RosemaryTheme(reduceMotion: true, child: Scaffold(body: child)),
);
void main() {
  WidgetController.hitTestWarningShouldBeFatal = true;
  testWidgets(
    'two-route Back refusal keeps route; repeated Escape can close controlled dialog',
    (tester) async {
      final navigator = GlobalKey<NavigatorState>();
      bool open = true;
      var calls = 0;
      await tester.pumpWidget(
        MaterialApp(
          navigatorKey: navigator,
          home: const Text('Background route'),
        ),
      );
      navigator.currentState!.push(
        MaterialPageRoute<void>(
          builder: (context) => RosemaryTheme(
            reduceMotion: true,
            child: StatefulBuilder(
              builder: (context, setState) => Scaffold(
                body: Column(
                  children: [
                    const Text('Foreground route'),
                    RosemaryDialog(
                      open: open,
                      title: 'Refusal review',
                      onDismiss: (_) {
                        calls++;
                        if (calls >= 3) setState(() => open = false);
                      },
                      child: RosemaryButton(
                        label: 'Continue editing',
                        onPressed: () {},
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(calls, 1);
      expect(find.text('Foreground route'), findsOneWidget);
      expect(find.text('Refusal review'), findsOneWidget);
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(calls, 2);
      await tester.tap(find.text('Continue editing'));
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.escape);
      await tester.pumpAndSettle();
      expect(calls, 3);
      expect(find.text('Refusal review'), findsNothing);
      expect(find.text('Foreground route'), findsOneWidget);
      await tester.binding.handlePopRoute();
      await tester.pumpAndSettle();
      expect(find.text('Background route'), findsOneWidget);
    },
  );
  testWidgets(
    'Select End scrolls at screen edge and options mutation normalizes active ID',
    (tester) async {
      tester.view.reset();
      tester.view.physicalSize = const Size(320, 640);
      tester.view.devicePixelRatio = 1;
      addTearDown(tester.view.resetPhysicalSize);
      addTearDown(tester.view.resetDevicePixelRatio);
      var options = [
        for (var i = 0; i < 30; i++) RosemaryOption('$i', 'Item $i'),
      ];
      String? chosen;
      late StateSetter update;
      await tester.pumpWidget(
        host(
          Align(
            alignment: Alignment.bottomRight,
            child: StatefulBuilder(
              builder: (context, setState) {
                update = setState;
                return SizedBox(
                  width: 120,
                  child: RosemarySelect(
                    value: '0',
                    onChanged: (v) => chosen = v,
                    options: options,
                    label: 'Edge',
                  ),
                );
              },
            ),
          ),
        ),
      );
      await tester.tap(find.text('Item 0'));
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.end);
      await tester.pumpAndSettle();
      final last = find.text('Item 29');
      expect(last.hitTestable(), findsOneWidget);
      final rect = tester.getRect(last);
      expect(rect.bottom, lessThanOrEqualTo(640));
      expect(rect.right, lessThanOrEqualTo(320));
      expect(rect.left, greaterThanOrEqualTo(0));
      update(
        () => options = [
          const RosemaryOption('0', 'Item 0', enabled: false),
          const RosemaryOption('next', 'Replacement'),
        ],
      );
      await tester.pumpAndSettle();
      await tester.sendKeyEvent(LogicalKeyboardKey.enter);
      await tester.pumpAndSettle();
      expect(chosen, 'next');
      expect(tester.takeException(), isNull);
    },
  );
  testWidgets(
    'nonmodal ISO field commits directly; outside and Tab discard picker draft',
    (tester) async {
      var date = RosemaryLocalDate(2026, 1, 1);
      var commits = 0;
      await tester.pumpWidget(
        host(
          SingleChildScrollView(
            child: StatefulBuilder(
              builder: (context, setState) => Column(
                children: [
                  RosemaryDate(
                    value: date,
                    onChanged: (v) => setState(() {
                      date = v;
                      commits++;
                    }),
                    label: 'Date',
                  ),
                  RosemaryButton(label: 'Background action', onPressed: () {}),
                ],
              ),
            ),
          ),
        ),
      );
      await tester.enterText(find.byType(EditableText), '0001-01-01');
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();
      expect(date, RosemaryLocalDate(1, 1, 1));
      expect(commits, 1);
      expect(find.byType(RosemaryCalendar), findsNothing);
      await tester.tap(find.text('Choose'));
      await tester.pumpAndSettle();
      await tester.ensureVisible(find.text('Background action'));
      await tester.tap(find.text('Background action'));
      await tester.pumpAndSettle();
      expect(find.byType(RosemaryCalendar), findsNothing);
      await tester.ensureVisible(find.text('Choose'));
      await tester.tap(find.text('Choose'));
      await tester.pumpAndSettle();
      for (
        var i = 0;
        i < 10 && find.byType(RosemaryCalendar).evaluate().isNotEmpty;
        i++
      ) {
        await tester.sendKeyEvent(LogicalKeyboardKey.tab);
        await tester.pumpAndSettle();
      }
      expect(find.byType(RosemaryCalendar), findsNothing);
      expect(commits, 1);
    },
  );
  testWidgets(
    'time has two roving columns, Home End and arrows, cancel retains host',
    (tester) async {
      var time = RosemaryLocalTime(23, 59);
      var commits = 0;
      await tester.pumpWidget(
        host(
          StatefulBuilder(
            builder: (context, setState) => RosemaryDate(
              time: time,
              onTimeChanged: (v) => setState(() {
                time = v;
                commits++;
              }),
              mode: RosemaryDateMode.time,
              label: 'Time',
            ),
          ),
        ),
      );
      await tester.tap(find.text('Choose'));
      await tester.pumpAndSettle();
      final hour = find.byWidgetPredicate(
        (w) => w is Focus && w.focusNode?.debugLabel == 'Rosemary hours',
      );
      final minute = find.byWidgetPredicate(
        (w) => w is Focus && w.focusNode?.debugLabel == 'Rosemary minutes',
      );
      tester.widget<Focus>(hour).focusNode!.requestFocus();
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.home);
      await tester.pump();
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowRight);
      await tester.pump();
      expect(tester.widget<Focus>(minute).focusNode!.hasFocus, isTrue);
      await tester.sendKeyEvent(LogicalKeyboardKey.end);
      await tester.pump();
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        '00:59',
      );
      await tester.sendKeyEvent(LogicalKeyboardKey.home);
      await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
      await tester.pump();
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        '00:01',
      );
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();
      expect(time, RosemaryLocalTime(23, 59));
      expect(commits, 0);
    },
  );
  testWidgets(
    'disabled upload blocks all actions; OS high contrast uses explicit full palette at 200 percent',
    (tester) async {
      var calls = 0;
      RosemaryThemeData? theme;
      final high = RosemaryTokens.light.copyWith(
        border: RosemaryTokens.light.ink,
        control: RosemaryTokens.light.ink,
        focus: RosemaryTokens.light.ink,
      );
      await tester.pumpWidget(
        MaterialApp(
          home: MediaQuery(
            data: const MediaQueryData(
              highContrast: true,
              textScaler: TextScaler.linear(2),
            ),
            child: RosemaryTheme(
              highContrastColors: high,
              reduceMotion: true,
              child: Builder(
                builder: (context) {
                  theme = RosemaryThemeData.of(context);
                  return Scaffold(
                    body: SingleChildScrollView(
                      child: RosemaryUpload(
                        label: 'Files',
                        enabled: false,
                        files: const [
                          RosemaryFile(
                            id: '1',
                            name: 'File',
                            canRetry: true,
                            canCancel: true,
                            state: RosemaryFileState.error,
                          ),
                        ],
                        onFilesSelected: (_) => calls++,
                        onRemoved: (_) => calls++,
                        onRetry: (_) => calls++,
                        onCancel: (_) => calls++,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();
      for (final label in ['Choose files', 'Remove File', 'Retry', 'Cancel']) {
        await tester.ensureVisible(find.text(label));
        await tester.tap(find.text(label));
      }
      expect(calls, 0);
      expect(theme?.colors, high);
      expect(rosemaryValidateTheme(high).every((d) => d.passes), isTrue);
      expect(tester.takeException(), isNull);
    },
  );
  testWidgets(
    'pending native file selection cannot submit after host disables; refused ISO returns host value',
    (tester) async {
      final pending = Completer<List<XFile>>();
      bool enabled = true;
      var selected = 0;
      late StateSetter update;
      await tester.pumpWidget(
        host(
          StatefulBuilder(
            builder: (context, setState) {
              update = setState;
              return RosemaryUpload(
                label: 'Upload',
                files: const [],
                enabled: enabled,
                chooseFiles: () => pending.future,
                onFilesSelected: (_) => selected++,
              );
            },
          ),
        ),
      );
      await tester.tap(find.text('Choose files'));
      await tester.pump();
      update(() => enabled = false);
      await tester.pump();
      pending.complete([XFile('/host-choice.txt')]);
      await tester.pumpAndSettle();
      expect(selected, 0);
      var proposals = 0;
      await tester.pumpWidget(
        host(
          RosemaryDate(
            value: RosemaryLocalDate(2026, 1, 1),
            onChanged: (_) => proposals++,
            label: 'Refused',
          ),
        ),
      );
      await tester.enterText(find.byType(EditableText), '9999-12-31');
      await tester.testTextInput.receiveAction(TextInputAction.done);
      await tester.pumpAndSettle();
      expect(proposals, 1);
      expect(
        tester.widget<EditableText>(find.byType(EditableText)).controller.text,
        '2026-01-01',
      );
    },
  );
  testWidgets(
    'short running loader never flashes; sustained task appears after shared delay',
    (tester) async {
      var state = RosemaryLoadingState.running;
      late StateSetter update;
      await tester.pumpWidget(
        host(
          StatefulBuilder(
            builder: (context, setState) {
              update = setState;
              return RosemaryLoading(state: state);
            },
          ),
        ),
      );
      final paint = find.descendant(
        of: find.byType(RosemaryLoading),
        matching: find.byType(CustomPaint),
      );
      expect(paint, findsNothing);
      await tester.pump(const Duration(milliseconds: 200));
      update(() => state = RosemaryLoadingState.completed);
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 400));
      expect(paint, findsNothing);
      await tester.pumpWidget(
        host(const RosemaryLoading(key: ValueKey('sustained'))),
      );
      await tester.pump(const Duration(milliseconds: 299));
      expect(paint, findsNothing);
      await tester.pump(const Duration(milliseconds: 1));
      expect(paint, findsOneWidget);
      expect(tester.hasRunningAnimations, isFalse);
    },
  );
}
