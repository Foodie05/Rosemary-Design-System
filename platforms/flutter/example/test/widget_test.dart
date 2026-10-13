import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:rosemary_ui/rosemary_ui.dart';
import 'package:rosemary_gallery/gallery.dart';

void main() {
  testWidgets(
    'installed consumer mounts each foundation component in both themes',
    (tester) async {
      for (final colors in [RosemaryTokens.light, RosemaryTokens.dark]) {
        for (final id in componentIds) {
          await tester.pumpWidget(
            MaterialApp(
              home: RosemaryTheme(
                colors: colors,
                reduceMotion: true,
                child: Scaffold(
                  body: SingleChildScrollView(
                    child: Demo(key: ValueKey('$id-${colors.canvas}'), id: id),
                  ),
                ),
              ),
            ),
          );
          await tester.pump();
          await tester.pump(const Duration(milliseconds: 100));
          expect(
            tester.takeException(),
            isNull,
            reason: '$id theme ${colors.canvas}',
          );
        }
      }
      await tester.pumpWidget(const SizedBox.shrink());
    },
  );
}
