import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'theme.dart';
import 'fields.dart';

/// Generated semantic colors feed real native controls; the app owns routing/state.
ThemeData rosemaryThemeData(Brightness brightness) {
  final p = brightness == Brightness.dark
      ? RosemaryTheme.dark
      : RosemaryTheme.light;
  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    extensions: [p],
    colorScheme:
        ColorScheme.fromSeed(
          seedColor: p.accent,
          brightness: brightness,
        ).copyWith(
          primary: p.accent,
          onPrimary: p.onAccent,
          surface: p.surface,
          onSurface: p.ink,
          error: p.danger,
          outline: p.border,
        ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: p.surface,
      border: const OutlineInputBorder(
        borderRadius: BorderRadius.all(Radius.circular(8)),
      ),
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(48, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      ),
    ),
  );
}

class RosemaryIconButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onPressed;
  final bool busy;
  const RosemaryIconButton({
    super.key,
    required this.label,
    required this.icon,
    this.onPressed,
    this.busy = false,
  });
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? Semantics(
          label: label,
          value: busy ? '正在处理' : null,
          child: CupertinoButton(
            minimumSize: const Size(44, 44),
            onPressed: busy ? null : onPressed,
            child: ExcludeSemantics(
              child: busy
                  ? const RosemarySpinner(size: 20)
                  : Icon(icon, size: 20),
            ),
          ),
        )
      : Semantics(
          value: busy ? '正在处理' : null,
          liveRegion: busy,
          child: IconButton(
            tooltip: label,
            onPressed: busy ? null : onPressed,
            constraints: const BoxConstraints(minHeight: 48, minWidth: 48),
            icon: busy
                ? const RosemarySpinner(label: '正在处理', size: 20)
                : Icon(icon),
          ),
        );
}

class RosemaryTextArea extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final FocusNode? focusNode;
  final String? errorText;
  final bool enabled;
  final ValueChanged<String>? onChanged;
  const RosemaryTextArea({
    super.key,
    required this.label,
    required this.controller,
    this.focusNode,
    this.errorText,
    this.enabled = true,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? rosemaryCupertinoField(
          context,
          label: label,
          controller: controller,
          focusNode: focusNode,
          enabled: enabled,
          error: errorText,
          minLines: 3,
          maxLines: null,
          onChanged: onChanged,
        )
      : TextField(
          controller: controller,
          focusNode: focusNode,
          enabled: enabled,
          minLines: 3,
          maxLines: null,
          onChanged: onChanged,
          decoration: InputDecoration(
            labelText: label,
            errorText: errorText,
            floatingLabelBehavior: FloatingLabelBehavior.always,
          ),
        );
}

class RosemaryCheckbox extends StatelessWidget {
  final String label;
  final bool? value;
  final bool tristate;
  final ValueChanged<bool?>? onChanged;
  const RosemaryCheckbox({
    super.key,
    required this.label,
    required this.value,
    this.tristate = false,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? Semantics(
          checked: value,
          mixed: tristate && value == null,
          selected: value == true,
          child: CupertinoButton(
            minimumSize: const Size(44, 44),
            onPressed: onChanged == null
                ? null
                : () => onChanged!(
                    tristate
                        ? (value == false
                              ? true
                              : value == true
                              ? null
                              : false)
                        : !(value ?? false),
                  ),
            child: Row(
              children: [
                ExcludeSemantics(
                  child: Icon(
                    value == true
                        ? CupertinoIcons.check_mark_circled_solid
                        : value == null
                        ? CupertinoIcons.minus_circle
                        : CupertinoIcons.circle,
                    size: 20,
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(child: Text(label)),
              ],
            ),
          ),
        )
      : CheckboxListTile(
          title: Text(label),
          value: value,
          tristate: tristate,
          onChanged: onChanged,
          contentPadding: EdgeInsets.zero,
          controlAffinity: ListTileControlAffinity.leading,
        );
}

class RosemarySlider extends StatelessWidget {
  final String label;
  final double value, min, max;
  final int? divisions;
  final ValueChanged<double>? onChanged, onChangeEnd;
  const RosemarySlider({
    super.key,
    required this.label,
    required this.value,
    this.min = 0,
    this.max = 100,
    this.divisions,
    this.onChanged,
    this.onChangeEnd,
  }) : assert(min < max),
       assert(value >= min && value <= max);
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label),
      Slider.adaptive(
        value: value,
        min: min,
        max: max,
        divisions: divisions,
        label: value.toStringAsFixed(0),
        semanticFormatterCallback: (v) => '$label ${v.toStringAsFixed(0)}',
        onChanged: onChanged,
        onChangeEnd: onChangeEnd,
      ),
    ],
  );
}

@immutable
class RosemaryOption<T> {
  final T value;
  final String label;
  final bool enabled;
  const RosemaryOption(this.value, this.label, {this.enabled = true});
}

class RosemarySelect<T> extends StatefulWidget {
  final T? value;
  final String label;
  final List<RosemaryOption<T>> options;
  final ValueChanged<T>? onChanged;
  const RosemarySelect({
    super.key,
    required this.value,
    required this.label,
    required this.options,
    this.onChanged,
  });
  @override
  State<RosemarySelect<T>> createState() => _RosemarySelectState<T>();
}

class _RosemarySelectState<T> extends State<RosemarySelect<T>> {
  final focus = FocusNode();
  ValueNotifier<List<RosemaryOption<T>>>? liveOptions;
  void refreshOptions({bool removed = false}) {
    final source = liveOptions;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (source != null && identical(liveOptions, source))
        source.value = removed || widget.onChanged == null
            ? []
            : List.of(widget.options);
    });
  }

  @override
  void didUpdateWidget(covariant RosemarySelect<T> old) {
    super.didUpdateWidget(old);
    refreshOptions();
  }

  @override
  void dispose() {
    refreshOptions(removed: true);
    focus.dispose();
    super.dispose();
  }

  Future<void> openSheet() async {
    if (liveOptions != null) return;
    final source = ValueNotifier<List<RosemaryOption<T>>>(
      List.of(widget.options),
    );
    liveOptions = source;
    final initial = widget.value;
    final child = _SelectSheet<T>(
      label: widget.label,
      options: source,
      initial: initial,
    );
    final T? result = Theme.of(context).platform == TargetPlatform.iOS
        ? await showCupertinoModalPopup<T>(
            context: context,
            builder: (_) => child,
          )
        : await showModalBottomSheet<T>(
            context: context,
            isScrollControlled: true,
            useSafeArea: true,
            builder: (_) => child,
          );
    source.dispose();
    liveOptions = null;
    if (!mounted) return;
    if (result != null &&
        widget.onChanged != null &&
        widget.options.any((o) => o.value == result && o.enabled))
      widget.onChanged!(result);
    if (focus.context != null) focus.requestFocus();
  }

  @override
  Widget build(BuildContext context) {
    final options = widget.options,
        value = widget.value,
        label = widget.label,
        onChanged = widget.onChanged;
    assert(
      options.map((o) => o.value).toSet().length == options.length,
      'Option values must be unique',
    );
    final selected = options.where((o) => o.value == value).firstOrNull;
    final enabled = onChanged != null && options.any((o) => o.enabled);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        const SizedBox(height: 8),
        if (options.length > 8 ||
            Theme.of(context).platform == TargetPlatform.iOS)
          OutlinedButton(
            focusNode: focus,
            onPressed: enabled ? openSheet : null,
            style: OutlinedButton.styleFrom(minimumSize: const Size(160, 48)),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Flexible(child: Text(selected?.label ?? '请选择')),
                const SizedBox(width: 12),
                const Icon(Icons.expand_more),
              ],
            ),
          )
        else
          MenuAnchor(
            childFocusNode: focus,
            menuChildren: options
                .map(
                  (o) => MenuItemButton(
                    onPressed: o.enabled && enabled
                        ? () => onChanged(o.value)
                        : null,
                    leadingIcon: o.value == value
                        ? const Icon(Icons.check)
                        : null,
                    child: Text(o.label),
                  ),
                )
                .toList(),
            builder: (context, controller, child) => CallbackShortcuts(
              bindings: {
                const SingleActivator(LogicalKeyboardKey.escape):
                    controller.close,
              },
              child: Semantics(
                label: label,
                child: OutlinedButton(
                  focusNode: focus,
                  onPressed: enabled
                      ? () => controller.isOpen
                            ? controller.close()
                            : controller.open()
                      : null,
                  style: OutlinedButton.styleFrom(
                    minimumSize: const Size(160, 48),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(child: Text(selected?.label ?? '请选择')),
                      const SizedBox(width: 12),
                      const Icon(Icons.expand_more),
                    ],
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _SelectSheet<T> extends StatefulWidget {
  final String label;
  final ValueListenable<List<RosemaryOption<T>>> options;
  final T? initial;
  const _SelectSheet({
    required this.label,
    required this.options,
    this.initial,
  });
  @override
  State<_SelectSheet<T>> createState() => _SelectSheetState<T>();
}

class _SelectSheetState<T> extends State<_SelectSheet<T>> {
  late T? draft = widget.initial;
  String query = '';
  @override
  Widget build(
    BuildContext context,
  ) => ValueListenableBuilder<List<RosemaryOption<T>>>(
    valueListenable: widget.options,
    builder: (context, options, _) {
      final ios = Theme.of(context).platform == TargetPlatform.iOS;
      final filtered = options
          .where((o) => o.label.toLowerCase().contains(query.toLowerCase()))
          .toList();
      final valid = options.any((o) => o.value == draft && o.enabled);
      Widget action(String title, VoidCallback? fn) => ios
          ? CupertinoButton(onPressed: fn, child: Text(title))
          : TextButton(onPressed: fn, child: Text(title));
      return Material(
        color: Theme.of(context).colorScheme.surface,
        child: SafeArea(
          child: Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.viewInsetsOf(context).bottom,
            ),
            child: SizedBox(
              height: MediaQuery.sizeOf(context).height * .75,
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text(
                      widget.label,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: ios
                        ? CupertinoSearchTextField(
                            onChanged: (q) => setState(() => query = q),
                          )
                        : TextField(
                            decoration: const InputDecoration(
                              labelText: '搜索选项',
                            ),
                            onChanged: (q) => setState(() => query = q),
                          ),
                  ),
                  Expanded(
                    child: RadioGroup<T>(
                      groupValue: draft,
                      onChanged: (v) => setState(() => draft = v),
                      child: filtered.isEmpty
                          ? const Center(child: Text('没有匹配的选项'))
                          : ListView.builder(
                              itemCount: filtered.length,
                              itemBuilder: (context, i) {
                                final o = filtered[i];
                                return Semantics(
                                  selected: o.value == draft,
                                  child: ios
                                      ? CupertinoButton(
                                          onPressed: o.enabled
                                              ? () => setState(
                                                  () => draft = o.value,
                                                )
                                              : null,
                                          child: Row(
                                            children: [
                                              Expanded(child: Text(o.label)),
                                              if (o.value == draft)
                                                const Icon(
                                                  CupertinoIcons.check_mark,
                                                ),
                                            ],
                                          ),
                                        )
                                      : RadioListTile<T>(
                                          title: Text(o.label),
                                          value: o.value,
                                          enabled: o.enabled,
                                        ),
                                );
                              },
                            ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8),
                    child: Wrap(
                      spacing: 16,
                      children: [
                        action('取消', () => Navigator.pop(context)),
                        action(
                          '确认',
                          valid ? () => Navigator.pop(context, draft) : null,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      );
    },
  );
}

/// Native tab semantics with host-controlled selection and mounted panel state.
class RosemaryTabs extends StatefulWidget {
  final List<String> labels;
  final List<Widget> panels;
  final int value;
  final ValueChanged<int> onChanged;
  const RosemaryTabs({
    super.key,
    required this.labels,
    required this.panels,
    required this.value,
    required this.onChanged,
  }) : assert(labels.length == panels.length),
       assert(labels.length > 0),
       assert(value >= 0 && value < labels.length);
  @override
  State<RosemaryTabs> createState() => _RosemaryTabsState();
}

class _RosemaryTabsState extends State<RosemaryTabs>
    with TickerProviderStateMixin {
  late TabController controller;
  Duration motionDuration = const Duration(milliseconds: 240);
  void initialize() => controller = TabController(
    length: widget.labels.length,
    initialIndex: widget.value,
    vsync: this,
    animationDuration: motionDuration,
  );
  @override
  void initState() {
    super.initState();
    initialize();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final next = MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : const Duration(milliseconds: 240);
    if (motionDuration != next) {
      motionDuration = next;
      controller.dispose();
      initialize();
    }
  }

  @override
  void didUpdateWidget(RosemaryTabs old) {
    super.didUpdateWidget(old);
    if (old.labels.length != widget.labels.length) {
      controller.dispose();
      initialize();
    } else if (controller.index != widget.value) {
      final reduced = MediaQuery.disableAnimationsOf(context);
      controller.animateTo(
        widget.value,
        duration: reduced ? Duration.zero : const Duration(milliseconds: 240),
      );
    }
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Column(
    children: [
      TabBar(
        controller: controller,
        onTap: (index) {
          widget.onChanged(index);
          WidgetsBinding.instance.addPostFrameCallback((_) {
            if (mounted && controller.index != widget.value) {
              controller.animateTo(widget.value, duration: Duration.zero);
            }
          });
        },
        tabs: widget.labels.map((s) => Tab(text: s)).toList(),
      ),
      const SizedBox(height: 16),
      // Host owns selection. A tap cannot silently change the displayed controlled panel.
      IndexedStack(
        index: widget.value,
        children: [
          for (var i = 0; i < widget.panels.length; i++)
            TickerMode(enabled: i == widget.value, child: widget.panels[i]),
        ],
      ),
    ],
  );
}

enum RosemaryDialogResult { confirm, cancel }

class RosemaryDialog extends StatelessWidget {
  final String title;
  final Widget content;
  final VoidCallback? onConfirm;
  final VoidCallback onCancel;
  final String confirmLabel, cancelLabel;
  const RosemaryDialog({
    super.key,
    required this.title,
    required this.content,
    required this.onCancel,
    this.onConfirm,
    this.confirmLabel = '确认',
    this.cancelLabel = '取消',
  });
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? CupertinoAlertDialog(
          title: Text(title),
          content: content,
          actions: [
            CupertinoDialogAction(
              onPressed: onCancel,
              child: Text(cancelLabel),
            ),
            CupertinoDialogAction(
              onPressed: onConfirm,
              isDefaultAction: true,
              child: Text(confirmLabel),
            ),
          ],
        )
      : AlertDialog(
          title: Text(title),
          content: content,
          actions: [
            TextButton(onPressed: onCancel, child: Text(cancelLabel)),
            TextButton(onPressed: onConfirm, child: Text(confirmLabel)),
          ],
        );
}

Future<RosemaryDialogResult?> showRosemaryDialog(
  BuildContext context, {
  required String title,
  required Widget content,
  bool canConfirm = true,
  String confirmLabel = '确认',
  bool barrierDismissible = true,
}) => showAdaptiveDialog<RosemaryDialogResult>(
  context: context,
  barrierDismissible: barrierDismissible,
  builder: (dialogContext) => RosemaryDialog(
    title: title,
    content: content,
    confirmLabel: confirmLabel,
    onCancel: () =>
        Navigator.of(dialogContext).pop(RosemaryDialogResult.cancel),
    onConfirm: canConfirm
        ? () => Navigator.of(dialogContext).pop(RosemaryDialogResult.confirm)
        : null,
  ),
);
Future<RosemaryDialogResult?> showRosemaryAlertDialog(
  BuildContext context, {
  required String title,
  required String message,
  required String confirmLabel,
}) => showRosemaryDialog(
  context,
  title: title,
  content: Text(message),
  confirmLabel: confirmLabel,
  barrierDismissible: false,
);

class RosemaryProgress extends StatelessWidget {
  final String label;
  final double value;
  const RosemaryProgress({super.key, required this.label, required this.value})
    : assert(value >= 0 && value <= 1);
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text('$label ${(value * 100).round()}%'),
      const SizedBox(height: 8),
      LinearProgressIndicator(
        value: value,
        minHeight: 8,
        borderRadius: BorderRadius.circular(8),
        semanticsLabel: label,
        semanticsValue: '${(value * 100).round()}%',
      ),
    ],
  );
}

class RosemarySpinner extends StatefulWidget {
  final String label;
  final double size;
  const RosemarySpinner({super.key, this.label = '正在加载', this.size = 24});
  @override
  State<RosemarySpinner> createState() => _SpinnerState();
}

class _SpinnerState extends State<RosemarySpinner> with WidgetsBindingObserver {
  bool active = true;
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    final state = WidgetsBinding.instance.lifecycleState;
    active = state == null || state == AppLifecycleState.resumed;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (mounted) setState(() => active = state == AppLifecycleState.resumed);
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    width: widget.size,
    height: widget.size,
    child:
        MediaQuery.disableAnimationsOf(context) ||
            !active ||
            !TickerMode.valuesOf(context).enabled
        ? Semantics(
            label: widget.label,
            child: const Icon(Icons.hourglass_empty),
          )
        : Theme.of(context).platform == TargetPlatform.iOS
        ? Semantics(
            label: widget.label,
            child: CupertinoActivityIndicator(
              radius: widget.size / 2,
              color: DefaultTextStyle.of(context).style.color,
            ),
          )
        : CircularProgressIndicator(
            strokeWidth: 2,
            semanticsLabel: widget.label,
            color: DefaultTextStyle.of(context).style.color,
          ),
  );
}

class RosemaryEmptyState extends StatelessWidget {
  final String title, message;
  final Widget? action;
  const RosemaryEmptyState({
    super.key,
    required this.title,
    required this.message,
    this.action,
  });
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(24),
    child: Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Semantics(
          header: true,
          child: Text(title, style: Theme.of(context).textTheme.titleMedium),
        ),
        const SizedBox(height: 8),
        Text(message),
        if (action != null) ...[const SizedBox(height: 16), action!],
      ],
    ),
  );
}
