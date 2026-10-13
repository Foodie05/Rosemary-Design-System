import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'theme.dart';
import 'primitives.dart';
import 'overlays.dart';
import 'generated/rosemary_tokens.dart';

class RosemaryOption {
  final String id, label;
  final bool enabled;
  const RosemaryOption(this.id, this.label, {this.enabled = true});
}

class RosemaryCheckbox extends StatelessWidget {
  final bool? value;
  final ValueChanged<bool> onChanged;
  final String label;
  final bool enabled;
  final String? error;
  const RosemaryCheckbox({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.enabled = true,
    this.error,
  });
  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    return Semantics(
      checked: value == true,
      mixed: value == null,
      enabled: enabled,
      child: RosemaryActionSurface(
        button: false,
        enabled: enabled,
        onActivate: () => onChanged(value != true),
        padding: EdgeInsets.zero,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: rosemaryDuration(context, 'instantFeedback'),
              width: 22,
              height: 22,
              decoration: BoxDecoration(
                color: value == false ? c.surface : c.primary,
                border: Border.all(color: c.control),
                borderRadius: BorderRadius.circular(4),
              ),
              child: ExcludeSemantics(
                child: value == false
                    ? null
                    : RosemaryIcon(
                        value == null ? 'minus' : 'check',
                        size: 20,
                        color: c.onPrimary,
                      ),
              ),
            ),
            const SizedBox(width: 10),
            Flexible(child: RosemaryText(label)),
            if (error != null) RosemaryText(error!, color: c.danger),
          ],
        ),
      ),
    );
  }
}

class RosemaryRadio extends StatelessWidget {
  final String? value;
  final ValueChanged<String> onChanged;
  final String label;
  final List<RosemaryOption> options;
  final bool enabled;
  final String? error;
  const RosemaryRadio({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    required this.options,
    this.enabled = true,
    this.error,
  });
  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    return Semantics(
      explicitChildNodes: true,
      label: label,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RosemaryText(label),
          for (final option in options)
            Semantics(
              checked: value == option.id,
              inMutuallyExclusiveGroup: true,
              enabled: enabled && option.enabled,
              child: RosemaryActionSurface(
                button: false,
                enabled: enabled && option.enabled,
                onActivate: () => onChanged(option.id),
                padding: EdgeInsets.zero,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 22,
                      height: 22,
                      padding: const EdgeInsets.all(5),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: c.control),
                      ),
                      child: AnimatedContainer(
                        duration: rosemaryDuration(context, 'instantFeedback'),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: value == option.id
                              ? c.primary
                              : Colors.transparent,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Flexible(child: RosemaryText(option.label)),
                  ],
                ),
              ),
            ),
          if (error != null) RosemaryText(error!, color: c.danger),
        ],
      ),
    );
  }
}

class RosemarySwitch extends StatelessWidget {
  final bool value;
  final ValueChanged<bool> onChanged;
  final String label;
  final bool enabled, busy;
  final String? error;
  const RosemarySwitch({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.enabled = true,
    this.busy = false,
    this.error,
  });
  @override
  Widget build(BuildContext context) {
    final c = RosemaryThemeData.of(context);
    return Semantics(
      toggled: value,
      enabled: enabled && !busy,
      value: busy ? rString(context, 'Loading') : null,
      child: RosemaryActionSurface(
        button: false,
        enabled: enabled && !busy,
        onActivate: () => onChanged(!value),
        padding: EdgeInsets.zero,
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            AnimatedContainer(
              duration: rosemaryDuration(context, 'state'),
              width: 44,
              height: 28,
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: value ? c.primary : c.control,
                borderRadius: BorderRadius.circular(99),
              ),
              child: AnimatedAlign(
                duration: rosemaryDuration(context, 'state'),
                alignment: value
                    ? AlignmentDirectional.centerEnd
                    : AlignmentDirectional.centerStart,
                child: Container(
                  width: 22,
                  height: 22,
                  decoration: BoxDecoration(
                    color: value ? c.onPrimary : c.surface,
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 10),
            Flexible(child: RosemaryText(label)),
            if (error != null) RosemaryText(error!, color: c.danger),
          ],
        ),
      ),
    );
  }
}

class RosemarySlider extends StatelessWidget {
  final double value, min, max, step;
  final String label;
  final ValueChanged<double> onChanged;
  final ValueChanged<double>? onCommit;
  final bool enabled;
  const RosemarySlider({
    super.key,
    required this.value,
    required this.onChanged,
    required this.label,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.onCommit,
    this.enabled = true,
  });
  @override
  Widget build(BuildContext context) {
    if (![value, min, max, step].every((v) => v.isFinite) ||
        max <= min ||
        step <= 0)
      throw ArgumentError(
        'Slider requires finite increasing range and positive step',
      );
    final c = RosemaryThemeData.of(context),
        rtl = Directionality.of(context) == TextDirection.rtl;
    double normalized(double v) =>
        (min + ((v.clamp(min, max) - min) / step).round() * step).clamp(
          min,
          max,
        );
    void update(double v, {bool commit = false}) {
      if (!enabled) return;
      final next = normalized(v);
      onChanged(next);
      if (commit) onCommit?.call(next);
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RosemaryText('$label: $value'),
        Semantics(
          slider: true,
          label: label,
          value: '$value',
          increasedValue: '${normalized(value + step)}',
          decreasedValue: '${normalized(value - step)}',
          onIncrease: enabled ? () => update(value + step, commit: true) : null,
          onDecrease: enabled ? () => update(value - step, commit: true) : null,
          child: Focus(
            onKeyEvent: (node, event) {
              if (event is! KeyDownEvent || !enabled)
                return KeyEventResult.ignored;
              final key = event.logicalKey;
              double? target;
              if (key == LogicalKeyboardKey.home) target = min;
              if (key == LogicalKeyboardKey.end) target = max;
              if (key == LogicalKeyboardKey.arrowUp) target = value + step;
              if (key == LogicalKeyboardKey.arrowDown) target = value - step;
              if (key == LogicalKeyboardKey.arrowRight)
                target = value + (rtl ? -step : step);
              if (key == LogicalKeyboardKey.arrowLeft)
                target = value + (rtl ? step : -step);
              if (target == null) return KeyEventResult.ignored;
              update(target, commit: true);
              return KeyEventResult.handled;
            },
            child: Row(
              children: [
                RosemaryButton(
                  label: '−',
                  onPressed: enabled
                      ? () => update(value - step, commit: true)
                      : null,
                  variant: RosemaryButtonVariant.secondary,
                ),
                Expanded(
                  child: LayoutBuilder(
                    builder: (context, bounds) {
                      void fromX(double x, {bool commit = false}) {
                        final fraction = (x / bounds.maxWidth).clamp(0.0, 1.0);
                        update(
                          min + (rtl ? 1 - fraction : fraction) * (max - min),
                          commit: commit,
                        );
                      }

                      return GestureDetector(
                        behavior: HitTestBehavior.opaque,
                        onTapDown: enabled
                            ? (d) => fromX(d.localPosition.dx, commit: true)
                            : null,
                        onHorizontalDragUpdate: enabled
                            ? (d) => fromX(d.localPosition.dx)
                            : null,
                        onHorizontalDragEnd: enabled
                            ? (_) => onCommit?.call(normalized(value))
                            : null,
                        child: Container(
                          height: 44,
                          margin: const EdgeInsets.symmetric(horizontal: 12),
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              Container(
                                height: 4,
                                decoration: BoxDecoration(
                                  color: c.control,
                                  borderRadius: BorderRadius.circular(99),
                                ),
                              ),
                              Align(
                                alignment: Alignment(
                                  (rtl ? 1 : -1) +
                                      (rtl ? -2 : 2) *
                                          ((value - min) / (max - min)).clamp(
                                            0.0,
                                            1.0,
                                          ),
                                  0,
                                ),
                                child: Container(
                                  width: 22,
                                  height: 22,
                                  decoration: BoxDecoration(
                                    color: c.primary,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
                RosemaryButton(
                  label: '+',
                  onPressed: enabled
                      ? () => update(value + step, commit: true)
                      : null,
                  variant: RosemaryButtonVariant.secondary,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

class RosemarySelect extends StatefulWidget {
  final String? value;
  final ValueChanged<String> onChanged;
  final List<RosemaryOption> options;
  final String label;
  final bool enabled;
  final String? error;
  final ValueChanged<bool>? onOpenChanged;
  const RosemarySelect({
    super.key,
    required this.value,
    required this.onChanged,
    required this.options,
    required this.label,
    this.enabled = true,
    this.error,
    this.onOpenChanged,
  });
  @override
  State<RosemarySelect> createState() => _SelectState();
}

class _SelectState extends State<RosemarySelect> {
  final trigger = FocusNode(), menu = FocusNode();
  final anchor = GlobalKey();
  final optionKeys = <String, GlobalKey>{};
  OverlayEntry? entry;
  int active = 0;
  String prefix = '';
  DateTime last = DateTime.fromMillisecondsSinceEpoch(0);
  List<int> get enabledIndices => [
    for (var i = 0; i < widget.options.length; i++)
      if (widget.options[i].enabled) i,
  ];
  void _close() {
    if (entry == null) return;
    entry!.remove();
    entry!.dispose();
    entry = null;
    if (mounted) {
      setState(() {});
      trigger.requestFocus();
      widget.onOpenChanged?.call(false);
    }
  }

  void _open() {
    if (entry != null || !widget.enabled || enabledIndices.isEmpty) return;
    active = widget.options.indexWhere(
      (o) => o.id == widget.value && o.enabled,
    );
    if (active < 0) active = enabledIndices.first;
    entry = OverlayEntry(
      builder: (overlayContext) =>
          RosemaryOverlaySnapshot.capture(
            context,
            Overlay.of(context).context,
          ).wrap(
            Stack(
              children: [
                Positioned.fill(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: _close,
                    child: const SizedBox.expand(),
                  ),
                ),
                RosemaryAnchoredOverlay(
                  anchor: anchor,
                  child: Focus(
                    focusNode: menu,
                    autofocus: true,
                    onKeyEvent: _key,
                    child: Material(
                      type: MaterialType.transparency,
                      child: Container(
                        constraints: BoxConstraints(
                          maxWidth: MediaQuery.sizeOf(context).width - 24,
                          maxHeight: MediaQuery.sizeOf(context).height * .55,
                        ),
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: RosemaryThemeData.of(context).surface,
                          borderRadius: BorderRadius.circular(
                            RosemaryTokens.controlRadius,
                          ),
                          border: Border.all(
                            color: RosemaryThemeData.of(context).control,
                          ),
                        ),
                        child: SingleChildScrollView(
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              for (var i = 0; i < widget.options.length; i++)
                                RosemaryActionSurface(
                                  key: optionKeys.putIfAbsent(
                                    widget.options[i].id,
                                    () => GlobalKey(),
                                  ),
                                  selected: i == active,
                                  enabled: widget.options[i].enabled,
                                  background: i == active
                                      ? RosemaryThemeData.of(
                                          context,
                                        ).primarySoft
                                      : null,
                                  onActivate: () {
                                    widget.onChanged(widget.options[i].id);
                                    _close();
                                  },
                                  child: Text(widget.options[i].label),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
    );
    Overlay.of(context).insert(entry!);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted && entry != null) menu.requestFocus();
    });
    setState(() {});
    widget.onOpenChanged?.call(true);
  }

  KeyEventResult _key(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final indices = enabledIndices;
    if (indices.isEmpty) {
      _close();
      return KeyEventResult.handled;
    }
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.escape || key == LogicalKeyboardKey.tab) {
      _close();
      return key == LogicalKeyboardKey.tab
          ? KeyEventResult.ignored
          : KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.enter || key == LogicalKeyboardKey.space) {
      if (!indices.contains(active)) active = indices.first;
      widget.onChanged(widget.options[active].id);
      _close();
      return KeyEventResult.handled;
    }
    if (key == LogicalKeyboardKey.home)
      active = indices.first;
    else if (key == LogicalKeyboardKey.end)
      active = indices.last;
    else if (key == LogicalKeyboardKey.arrowDown ||
        key == LogicalKeyboardKey.arrowUp) {
      final position = indices.indexOf(active);
      active =
          indices[(position + (key == LogicalKeyboardKey.arrowDown ? 1 : -1)) %
              indices.length];
    } else if (event.character != null && event.character!.length == 1) {
      final now = DateTime.now();
      prefix = now.difference(last).inMilliseconds < 700
          ? prefix + event.character!.toLowerCase()
          : event.character!.toLowerCase();
      last = now;
      final match = indices.where(
        (i) => widget.options[i].label.toLowerCase().startsWith(prefix),
      );
      if (match.isNotEmpty) active = match.first;
    } else {
      return KeyEventResult.ignored;
    }
    entry?.markNeedsBuild();
    _showActive();
    return KeyEventResult.handled;
  }

  void _showActive() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted ||
          entry == null ||
          active < 0 ||
          active >= widget.options.length)
        return;
      final item = optionKeys[widget.options[active].id]?.currentContext;
      if (item != null) Scrollable.ensureVisible(item, alignment: .5);
    });
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (entry != null)
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) entry?.markNeedsBuild();
      });
  }

  @override
  void didUpdateWidget(RosemarySelect old) {
    super.didUpdateWidget(old);
    final oldId = active >= 0 && active < old.options.length
        ? old.options[active].id
        : null;
    active = widget.options.indexWhere((o) => o.id == oldId && o.enabled);
    if (active < 0 && enabledIndices.isNotEmpty) active = enabledIndices.first;
    if (enabledIndices.isEmpty && entry != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _close();
      });
    }
    if (!widget.enabled && entry != null)
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _close();
      });
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        entry?.markNeedsBuild();
        _showActive();
      }
    });
  }

  @override
  void dispose() {
    entry?.remove();
    entry?.dispose();
    trigger.dispose();
    menu.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final selected = widget.options
        .where((o) => o.id == widget.value)
        .firstOrNull;
    return KeyedSubtree(
      key: anchor,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          RosemaryText(widget.label, role: 'small'),
          Semantics(
            expanded: entry != null,
            value: selected?.label ?? rString(context, 'Choose'),
            child: RosemaryButton(
              label: selected?.label ?? rString(context, 'Choose'),
              onPressed: entry == null ? _open : _close,
              enabled: widget.enabled,
              focusNode: trigger,
              variant: RosemaryButtonVariant.secondary,
            ),
          ),
          if (widget.error != null)
            RosemaryText(
              widget.error!,
              color: RosemaryThemeData.of(context).danger,
            ),
        ],
      ),
    );
  }
}
