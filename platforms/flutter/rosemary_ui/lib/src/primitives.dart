import 'dart:ui' show SemanticsValidationResult;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme.dart';
import 'feedback.dart';
import 'generated/rosemary_tokens.dart';
import 'generated/rosemary_icons.dart';

enum RosemaryButtonVariant { primary, secondary, text, danger }

class RosemaryActionSurface extends StatefulWidget {
  final Widget child;
  final VoidCallback? onActivate;
  final FocusNode? focusNode;
  final String? label;
  final Color? background, foreground, border;
  final bool selected, link, button, enabled;
  final double? radius;
  final EdgeInsetsGeometry padding;
  final Key? semanticsKey;
  const RosemaryActionSurface({
    super.key,
    required this.child,
    this.onActivate,
    this.focusNode,
    this.label,
    this.background,
    this.foreground,
    this.border,
    this.selected = false,
    this.link = false,
    this.button = true,
    this.enabled = true,
    this.radius,
    this.padding = const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
    this.semanticsKey,
  });
  @override
  State<RosemaryActionSurface> createState() => _ActionSurfaceState();
}

class _ActionSurfaceState extends State<RosemaryActionSurface> {
  bool focused = false, hovered = false, pressed = false;
  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    final enabled = widget.enabled && widget.onActivate != null;
    return Semantics(
      key: widget.semanticsKey,
      button: widget.button,
      link: widget.link,
      label: widget.label,
      enabled: enabled,
      selected: widget.selected,
      onTap: enabled ? widget.onActivate : null,
      excludeSemantics: widget.label != null,
      child: FocusableActionDetector(
        focusNode: widget.focusNode,
        enabled: enabled,
        onFocusChange: (v) => setState(() => focused = v),
        onShowHoverHighlight: (v) => setState(() => hovered = v),
        shortcuts: {
          const SingleActivator(LogicalKeyboardKey.enter):
              const ActivateIntent(),
          if (!widget.link)
            const SingleActivator(LogicalKeyboardKey.space):
                const ActivateIntent(),
        },
        actions: {
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (_) {
              if (enabled) widget.onActivate!();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: enabled ? widget.onActivate : null,
          onTapDown: enabled ? (_) => setState(() => pressed = true) : null,
          onTapUp: (_) => setState(() => pressed = false),
          onTapCancel: () => setState(() => pressed = false),
          excludeFromSemantics: true,
          child: AnimatedContainer(
            duration: rosemaryDuration(context, 'instantFeedback'),
            constraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            padding: widget.padding,
            decoration: BoxDecoration(
              color: widget.background ?? Colors.transparent,
              borderRadius: BorderRadius.circular(
                widget.radius ?? RosemaryTokens.controlRadius,
              ),
              border: Border.all(
                color: focused ? c.focus : widget.border ?? Colors.transparent,
                width: focused ? 2 : 1,
              ),
            ),
            child: Opacity(
              opacity:
                  (!widget.enabled ||
                      (widget.button && widget.onActivate == null))
                  ? 0.55
                  : pressed
                  ? 0.8
                  : hovered
                  ? 0.92
                  : 1,
              child: DefaultTextStyle.merge(
                style: TextStyle(color: widget.foreground ?? c.ink),
                child: widget.child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class RosemaryButton extends StatelessWidget {
  final String label;
  final String? semanticLabel;
  final VoidCallback? onPressed;
  final bool enabled, busy;
  final RosemaryButtonVariant variant;
  final Widget? leading, trailing;
  final FocusNode? focusNode;
  const RosemaryButton({
    super.key,
    required this.label,
    this.semanticLabel,
    required this.onPressed,
    this.enabled = true,
    this.busy = false,
    this.variant = RosemaryButtonVariant.primary,
    this.leading,
    this.trailing,
    this.focusNode,
  });
  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    final background = switch (variant) {
      RosemaryButtonVariant.primary => c.primary,
      RosemaryButtonVariant.danger => c.danger,
      _ => Colors.transparent,
    };
    final foreground = switch (variant) {
      RosemaryButtonVariant.primary => c.onPrimary,
      RosemaryButtonVariant.danger => c.onDanger,
      _ => c.primary,
    };
    return Semantics(
      value: busy ? rString(context, 'Loading') : null,
      child: RosemaryActionSurface(
        label: semanticLabel,
        onActivate: busy ? null : onPressed,
        enabled: enabled && !busy,
        focusNode: focusNode,
        background: background,
        foreground: foreground,
        border: variant == RosemaryButtonVariant.secondary ? c.control : null,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (busy)
              RosemaryLoading(
                size: 17,
                color: foreground,
                label: rString(context, 'Loading'),
              ),
            if (leading != null && !busy) leading!,
            if (busy || leading != null) const SizedBox(width: 8),
            Flexible(
              child: Text(
                label,
                style: rosemaryTextStyle(context, 'body', color: foreground),
              ),
            ),
            if (trailing != null) ...[const SizedBox(width: 8), trailing!],
          ],
        ),
      ),
    );
  }
}

class RosemaryIconButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final Widget icon;
  final bool enabled, busy, pressed, danger;
  final FocusNode? focusNode;
  const RosemaryIconButton({
    super.key,
    required this.label,
    required this.onPressed,
    required this.icon,
    this.enabled = true,
    this.busy = false,
    this.pressed = false,
    this.danger = false,
    this.focusNode,
  });
  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    return RosemaryActionSurface(
      label: label,
      onActivate: busy ? null : onPressed,
      enabled: enabled && !busy,
      selected: pressed,
      focusNode: focusNode,
      background: pressed ? c.primarySoft : null,
      foreground: danger ? c.danger : c.ink,
      padding: const EdgeInsets.all(10),
      child: ExcludeSemantics(
        child: busy
            ? RosemaryLoading(size: 17, color: danger ? c.danger : c.ink)
            : icon,
      ),
    );
  }
}

class RosemaryLink extends StatelessWidget {
  final String label;
  final VoidCallback onNavigate;
  final bool current;
  const RosemaryLink({
    super.key,
    required this.label,
    required this.onNavigate,
    this.current = false,
  });
  @override
  Widget build(BuildContext context) => RosemaryActionSurface(
    link: true,
    button: false,
    selected: current,
    onActivate: current ? null : onNavigate,
    child: Text(
      label,
      style: TextStyle(
        color: RosemaryThemeData.of(context).primary,
        decoration: TextDecoration.underline,
      ),
    ),
  );
}

class RosemaryIcon extends StatelessWidget {
  final String name;
  final double size;
  final Color? color;
  const RosemaryIcon(this.name, {super.key, this.size = 24, this.color});
  @override
  Widget build(BuildContext context) {
    if (!RosemaryIcons.paths.containsKey(name))
      throw ArgumentError.value(name, 'icon');
    return ExcludeSemantics(
      child: SizedBox.square(
        dimension: size,
        child: CustomPaint(
          painter: _IconPainter(
            name,
            color ??
                DefaultTextStyle.of(context).style.color ??
                RosemaryThemeData.of(context).ink,
          ),
        ),
      ),
    );
  }
}

class _IconPainter extends CustomPainter {
  final String name;
  final Color color;
  _IconPainter(this.name, this.color);
  @override
  void paint(Canvas canvas, Size size) {
    canvas.scale(
      size.width / RosemaryIcons.viewBox,
      size.height / RosemaryIcons.viewBox,
    );
    final paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = RosemaryIcons.strokeWidth
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    for (final shape in RosemaryIcons.paths[name]!) {
      final path = Path();
      for (final command in shape) {
        final v = command.values;
        switch (command.op) {
          case 'M':
            path.moveTo(v[0], v[1]);
          case 'L':
            path.lineTo(v[0], v[1]);
          case 'C':
            path.cubicTo(v[0], v[1], v[2], v[3], v[4], v[5]);
          case 'Z':
            path.close();
          default:
            throw StateError('Unsupported generated icon operation');
        }
      }
      canvas.drawPath(path, paint);
    }
  }

  @override
  bool shouldRepaint(_IconPainter old) =>
      old.name != name || old.color != color;
}

class RosemaryInput extends StatefulWidget {
  final String value, label;
  final ValueChanged<String> onChanged;
  final String placeholder;
  final bool enabled, readOnly, password;
  final String? error;
  final TextInputType? keyboardType;
  final VoidCallback? onCommit;
  final FocusNode? focusNode;
  final int minLines, maxLines;
  const RosemaryInput({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.placeholder = '',
    this.enabled = true,
    this.readOnly = false,
    this.password = false,
    this.error,
    this.keyboardType,
    this.onCommit,
    this.focusNode,
    this.minLines = 1,
    this.maxLines = 1,
  });
  @override
  State<RosemaryInput> createState() => _InputState();
}

class _InputState extends State<RosemaryInput> {
  late final TextEditingController controller;
  late FocusNode node;
  bool focused = false;
  @override
  void initState() {
    super.initState();
    controller = TextEditingController(text: widget.value);
    node = widget.focusNode ?? FocusNode();
    node.addListener(_focus);
  }

  void _focus() {
    if (mounted) setState(() => focused = node.hasFocus);
  }

  @override
  void didUpdateWidget(RosemaryInput old) {
    super.didUpdateWidget(old);
    if (old.focusNode != widget.focusNode) {
      node.removeListener(_focus);
      if (old.focusNode == null) node.dispose();
      node = widget.focusNode ?? FocusNode();
      node.addListener(_focus);
    }
    if (controller.text != widget.value) {
      final selection = controller.selection;
      controller.value = TextEditingValue(
        text: widget.value,
        selection: TextSelection.collapsed(
          offset: selection.extentOffset.clamp(0, widget.value.length),
        ),
      );
    }
  }

  @override
  void dispose() {
    node.removeListener(_focus);
    if (widget.focusNode == null) node.dispose();
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RosemaryText(widget.label, role: 'small'),
        const SizedBox(height: 4),
        Semantics(
          textField: true,
          label: widget.label,
          validationResult: widget.error == null
              ? SemanticsValidationResult.none
              : SemanticsValidationResult.invalid,
          child: Container(
            constraints: const BoxConstraints(minHeight: 44),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: c.surface,
              borderRadius: BorderRadius.circular(RosemaryTokens.controlRadius),
              border: Border.all(
                color: widget.error != null
                    ? c.danger
                    : focused
                    ? c.focus
                    : c.control,
                width: focused ? 2 : 1,
              ),
            ),
            child: Stack(
              children: [
                if (controller.text.isEmpty && !focused)
                  IgnorePointer(
                    child: Text(
                      widget.placeholder,
                      style: rosemaryTextStyle(context, 'body', color: c.muted),
                    ),
                  ),
                EditableText(
                  controller: controller,
                  focusNode: node,
                  style: rosemaryTextStyle(context, 'body'),
                  cursorColor: c.primary,
                  backgroundCursorColor: c.surface,
                  readOnly: widget.readOnly || !widget.enabled,
                  showCursor: widget.enabled,
                  obscureText: widget.password,
                  keyboardType: widget.keyboardType,
                  minLines: widget.minLines,
                  maxLines: widget.maxLines,
                  selectionControls: materialTextSelectionControls,
                  onChanged: (value) {
                    widget.onChanged(value);
                    WidgetsBinding.instance.addPostFrameCallback((_) {
                      if (mounted && controller.text != widget.value)
                        controller.value = TextEditingValue(
                          text: widget.value,
                          selection: TextSelection.collapsed(
                            offset: widget.value.length,
                          ),
                        );
                    });
                  },
                  onSubmitted: (_) => widget.onCommit?.call(),
                ),
              ],
            ),
          ),
        ),
        if (widget.error != null)
          Semantics(
            liveRegion: true,
            child: RosemaryText(widget.error!, role: 'small', color: c.danger),
          ),
      ],
    );
  }
}

class RosemaryTextarea extends StatelessWidget {
  final String value, label, placeholder;
  final ValueChanged<String> onChanged;
  final bool enabled, readOnly;
  final String? error;
  final int minLines;
  const RosemaryTextarea({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.placeholder = '',
    this.enabled = true,
    this.readOnly = false,
    this.error,
    this.minLines = 4,
  });
  @override
  Widget build(BuildContext context) => RosemaryInput(
    value: value,
    onChanged: onChanged,
    label: label,
    placeholder: placeholder,
    enabled: enabled,
    readOnly: readOnly,
    error: error,
    minLines: minLines,
    maxLines: 1000,
  );
}

class RosemarySearch extends StatelessWidget {
  final String query, label;
  final ValueChanged<String> onQueryChanged;
  final VoidCallback onSubmit;
  final VoidCallback? onClear;
  final bool busy;
  const RosemarySearch({
    super.key,
    required this.query,
    required this.onQueryChanged,
    required this.onSubmit,
    this.label = 'Search',
    this.onClear,
    this.busy = false,
  });
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      RosemaryInput(
        value: query,
        onChanged: onQueryChanged,
        label: label,
        onCommit: busy ? null : onSubmit,
        keyboardType: TextInputType.text,
      ),
      Wrap(
        spacing: 8,
        children: [
          RosemaryButton(
            label: rString(context, 'Search'),
            onPressed: onSubmit,
            busy: busy,
          ),
          RosemaryButton(
            label: rString(context, 'Clear'),
            variant: RosemaryButtonVariant.text,
            onPressed: query.isEmpty
                ? null
                : () => onClear != null ? onClear!() : onQueryChanged(''),
          ),
        ],
      ),
    ],
  );
}
