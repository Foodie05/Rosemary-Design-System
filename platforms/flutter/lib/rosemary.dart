// Local Prototype SDK. Not published; see NATIVE-SDK-DESIGN.md for Beta gates.
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'src/fields.dart';
import 'rosemary_tokens.dart';
import 'src/theme.dart';
import 'src/components.dart';
export 'src/theme.dart';
export 'src/components.dart';
export 'src/extended.dart';
export 'src/session.dart';
export 'src/tree.dart';
export 'src/toast_host.dart';
export 'src/grid.dart' show RosemaryGridConfiguration;

class RosemaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool loading;
  const RosemaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.loading = false,
  });
  @override
  Widget build(BuildContext context) {
    final palette = RosemaryTheme.of(context);
    if (Theme.of(context).platform == TargetPlatform.iOS)
      return Semantics(
        liveRegion: loading,
        value: loading ? '正在处理' : null,
        child: CupertinoButton(
          color: palette.accent,
          borderRadius: BorderRadius.circular(8),
          minimumSize: const Size(88, 44),
          onPressed: loading ? null : onPressed,
          child: Stack(
            alignment: Alignment.center,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Text(label, style: TextStyle(color: palette.onAccent)),
              ),
              if (loading)
                const Positioned(
                  left: 0,
                  child: ExcludeSemantics(child: RosemarySpinner(size: 16)),
                ),
            ],
          ),
        ),
      );

    return Semantics(
      liveRegion: loading,
      value: loading ? '正在处理' : null,
      child: FilledButton(
        onPressed: loading ? null : onPressed,
        style: FilledButton.styleFrom(
          backgroundColor: palette.accent,
          foregroundColor: palette.onAccent,
          minimumSize: const Size(88, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(
              RosemaryLightTokens.component_button_radius,
            ),
          ),
        ),
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Reserve the same geometry in idle and busy states; keep the action name.
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: Text(label),
            ),
            if (loading)
              const Positioned(
                left: 0,
                child: ExcludeSemantics(
                  child: RosemarySpinner(label: '正在处理', size: 16),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class RosemaryTextField extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final String? errorText;
  final bool enabled;
  const RosemaryTextField({
    super.key,
    required this.label,
    required this.controller,
    this.errorText,
    this.enabled = true,
  });
  @override
  Widget build(BuildContext context) {
    final palette = RosemaryTheme.of(context);
    if (Theme.of(context).platform == TargetPlatform.iOS)
      return rosemaryCupertinoField(
        context,
        label: label,
        controller: controller,
        enabled: enabled,
        error: errorText,
      );

    return TextField(
      controller: controller,
      enabled: enabled,
      style: TextStyle(color: palette.ink),
      decoration: InputDecoration(
        labelText: label,
        errorText: errorText,
        filled: true,
        fillColor: palette.surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(
            RosemaryLightTokens.component_field_radius,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(
            RosemaryLightTokens.component_field_radius,
          ),
          borderSide: BorderSide(color: palette.accent, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(
            RosemaryLightTokens.component_field_radius,
          ),
          borderSide: BorderSide(color: palette.danger),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(
            RosemaryLightTokens.component_field_radius,
          ),
          borderSide: BorderSide(color: palette.danger, width: 2),
        ),
      ),
    );
  }
}

class RosemarySwitch extends StatelessWidget {
  final String label;
  final bool value;
  final ValueChanged<bool>? onChanged;
  const RosemarySwitch({
    super.key,
    required this.label,
    required this.value,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => SwitchListTile.adaptive(
    title: Text(label),
    value: value,
    onChanged: onChanged,
  );
}
