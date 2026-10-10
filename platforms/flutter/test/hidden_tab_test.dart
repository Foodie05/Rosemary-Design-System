import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() {
  testWidgets('Hidden tab must pause spinner', (t) async {
    await t.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: RosemaryTabs(
            labels: const ['A', 'B'],
            panels: const [Text('Visible'), RosemarySpinner()],
            value: 0,
            onChanged: (_) {},
          ),
        ),
      ),
    );
    await t.pump(const Duration(milliseconds: 400));
    print('AUDIT_HIDDEN_SPINNER: running=${t.hasRunningAnimations}');
    expect(t.hasRunningAnimations, isFalse);
  });
}
