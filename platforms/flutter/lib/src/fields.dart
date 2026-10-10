import 'package:flutter/cupertino.dart';
import 'theme.dart';

/// The controller retains host-owned selection and IME composing ranges.
Widget rosemaryCupertinoField(
  BuildContext context, {
  required String label,
  required TextEditingController controller,
  FocusNode? focusNode,
  bool enabled = true,
  String? error,
  int minLines = 1,
  int? maxLines = 1,
  ValueChanged<String>? onChanged,
  bool obscureText = false,
}) {
  final p = RosemaryTheme.of(context);
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label),
      const SizedBox(height: 8),
      Semantics(
        label: label,
        child: CupertinoTextField(
          controller: controller,
          focusNode: focusNode,
          enabled: enabled,
          minLines: minLines,
          maxLines: maxLines,
          onChanged: onChanged,
          obscureText: obscureText,
          autocorrect: !obscureText,
          enableSuggestions: !obscureText,
          placeholder: label,
          padding: const EdgeInsets.all(12),
          style: TextStyle(color: p.ink),
          decoration: BoxDecoration(
            color: p.surface,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: error == null ? p.border : p.danger),
          ),
        ),
      ),
      if (error != null)
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Semantics(
            liveRegion: true,
            child: Text(error, style: TextStyle(color: p.danger)),
          ),
        ),
    ],
  );
}
