import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() {
  for (final platform in [TargetPlatform.android, TargetPlatform.iOS]) {
    for (final time in [false, true]) {
      testWidgets('disable, fresh reopen and removal $platform time=$time', (
        t,
      ) async {
        bool enabled = true;
        late StateSetter update;
        int calls = 0;
        final pickerType = platform == TargetPlatform.iOS
            ? CupertinoDatePicker
            : time
            ? TimePickerDialog
            : DatePickerDialog;
        await t.pumpWidget(
          MaterialApp(
            theme: rosemaryThemeData(
              Brightness.light,
            ).copyWith(platform: platform),
            home: Scaffold(
              body: StatefulBuilder(
                builder: (c, set) {
                  update = set;
                  return time
                      ? RosemaryTimePicker(
                          label: '时间',
                          value: const TimeOfDay(hour: 9, minute: 30),
                          onChanged: enabled ? (_) => calls++ : null,
                        )
                      : RosemaryDatePicker(
                          label: '日期',
                          value: DateTime(2026, 10, 10),
                          first: DateTime(2020),
                          last: DateTime(2030),
                          onChanged: enabled ? (_) => calls++ : null,
                        );
                },
              ),
            ),
          ),
        );
        await t.tap(find.byType(OutlinedButton));
        await t.pumpAndSettle();
        expect(find.byType(pickerType), findsOneWidget);
        update(() => enabled = false);
        await t.pumpAndSettle();
        expect(find.byType(pickerType), findsNothing);
        update(() => enabled = true);
        await t.pumpAndSettle();
        expect(calls, 0);
        await t.tap(find.byType(OutlinedButton));
        await t.pumpAndSettle();
        expect(find.byType(pickerType), findsOneWidget);
        await t.pumpWidget(const SizedBox());
        await t.pumpAndSettle();
        expect(t.takeException(), isNull);
      });
    }
  }
}
