import 'package:flutter/cupertino.dart';
import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/semantics.dart';
import 'components.dart';
import 'fields.dart';
import 'theme.dart';
import 'grid.dart';

@immutable
class RosemaryAction {
  final String id, label;
  final VoidCallback? onInvoke;
  final bool destructive;
  const RosemaryAction(
    this.id,
    this.label,
    this.onInvoke, {
    this.destructive = false,
  });
}

@immutable
class RosemaryItem {
  final String id, label;
  final String? detail;
  final bool enabled;
  const RosemaryItem(this.id, this.label, {this.detail, this.enabled = true});
}

class RosemaryButtonGroup extends StatelessWidget {
  final List<RosemaryAction> actions;
  const RosemaryButtonGroup({super.key, required this.actions});
  @override
  Widget build(BuildContext context) => Wrap(
    spacing: 8,
    runSpacing: 8,
    children: [
      for (final a in actions)
        OutlinedButton(
          key: ValueKey(a.id),
          onPressed: a.onInvoke,
          child: Text(a.label),
        ),
    ],
  );
}

class RosemarySplitButton extends StatelessWidget {
  final RosemaryAction primary;
  final List<RosemaryAction> actions;
  const RosemarySplitButton({
    super.key,
    required this.primary,
    required this.actions,
  });
  @override
  Widget build(BuildContext context) => Wrap(
    spacing: 8,
    children: [
      FilledButton(onPressed: primary.onInvoke, child: Text(primary.label)),
      RosemaryDropdownMenu(label: '更多操作', actions: actions),
    ],
  );
}

class RosemaryLinkButton extends StatelessWidget {
  final String label;
  final VoidCallback? onNavigate;
  const RosemaryLinkButton({super.key, required this.label, this.onNavigate});
  @override
  Widget build(BuildContext context) =>
      TextButton(onPressed: onNavigate, child: Text(label));
}

class RosemaryFloatingActionButton extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback? onPressed;
  const RosemaryFloatingActionButton({
    super.key,
    required this.label,
    required this.icon,
    this.onPressed,
  });
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? CupertinoButton(
          onPressed: onPressed,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [Icon(icon), const SizedBox(width: 8), Text(label)],
          ),
        )
      : FloatingActionButton.extended(
          onPressed: onPressed,
          icon: Icon(icon),
          label: Text(label),
        );
}

class RosemaryPasswordField extends StatefulWidget {
  final String label;
  final TextEditingController controller;
  final bool enabled;
  final String? error;
  const RosemaryPasswordField({
    super.key,
    required this.label,
    required this.controller,
    this.enabled = true,
    this.error,
  });
  @override
  State<RosemaryPasswordField> createState() => _PasswordState();
}

class _PasswordState extends State<RosemaryPasswordField> {
  bool hidden = true;
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            rosemaryCupertinoField(
              context,
              label: widget.label,
              controller: widget.controller,
              enabled: widget.enabled,
              error: widget.error,
              obscureText: hidden,
            ),
            CupertinoButton(
              onPressed: widget.enabled
                  ? () => setState(() => hidden = !hidden)
                  : null,
              child: Text(hidden ? '显示密码' : '隐藏密码'),
            ),
          ],
        )
      : TextField(
          controller: widget.controller,
          enabled: widget.enabled,
          obscureText: hidden,
          autocorrect: false,
          enableSuggestions: false,
          decoration: InputDecoration(
            labelText: widget.label,
            errorText: widget.error,
            suffixIcon: IconButton(
              tooltip: hidden ? '显示密码' : '隐藏密码',
              onPressed: widget.enabled
                  ? () => setState(() => hidden = !hidden)
                  : null,
              icon: Icon(hidden ? Icons.visibility : Icons.visibility_off),
            ),
          ),
        );
}

class RosemarySearchField extends StatelessWidget {
  final String label;
  final TextEditingController controller;
  final ValueChanged<String> onChanged;
  final bool enabled;
  const RosemarySearchField({
    super.key,
    required this.label,
    required this.controller,
    required this.onChanged,
    this.enabled = true,
  });
  @override
  Widget build(BuildContext context) =>
      Theme.of(context).platform == TargetPlatform.iOS
      ? Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label),
            const SizedBox(height: 8),
            CupertinoSearchTextField(
              controller: controller,
              enabled: enabled,
              placeholder: label,
              onChanged: onChanged,
              onSuffixTap: enabled
                  ? () {
                      controller.clear();
                      onChanged('');
                    }
                  : null,
            ),
          ],
        )
      : TextField(
          controller: controller,
          enabled: enabled,
          onChanged: onChanged,
          decoration: InputDecoration(
            labelText: label,
            prefixIcon: const Icon(Icons.search),
            suffixIcon: IconButton(
              tooltip: '清除搜索',
              onPressed: enabled
                  ? () {
                      controller.clear();
                      onChanged('');
                    }
                  : null,
              icon: const Icon(Icons.close),
            ),
          ),
        );
}

/// Text remains a local draft until it is valid and explicitly submitted.
class RosemaryNumberField extends StatefulWidget {
  final String label;
  final double value, min, max, step;
  final ValueChanged<double>? onChanged;
  const RosemaryNumberField({
    super.key,
    required this.label,
    required this.value,
    this.min = 0,
    this.max = 100,
    this.step = 1,
    this.onChanged,
  }) : assert(min < max),
       assert(step > 0),
       assert(value >= min && value <= max);
  @override
  State<RosemaryNumberField> createState() => _NumberState();
}

class _NumberState extends State<RosemaryNumberField> {
  late final TextEditingController text = TextEditingController(
    text: '${widget.value}',
  );
  final focus = FocusNode();
  String? error;
  @override
  void didUpdateWidget(covariant RosemaryNumberField old) {
    super.didUpdateWidget(old);
    if (old.value != widget.value) {
      text.text = '${widget.value}';
      error = null;
    }
  }

  void commit() {
    if (widget.onChanged == null) return;
    final v = double.tryParse(text.text);
    if (v == null || !v.isFinite || v < widget.min || v > widget.max) {
      setState(() => error = '请输入 ${widget.min} 至 ${widget.max} 的数字');
      return;
    }
    setState(() => error = null);
    widget.onChanged!(v);
  }

  @override
  void dispose() {
    text.dispose();
    focus.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(widget.label),
      const SizedBox(height: 8),
      Row(
        children: [
          IconButton(
            tooltip: '减少 ${widget.label}',
            onPressed: widget.onChanged != null && widget.value > widget.min
                ? () => widget.onChanged!(
                    (widget.value - widget.step).clamp(widget.min, widget.max),
                  )
                : null,
            icon: const Icon(Icons.remove),
          ),
          Expanded(
            child: CallbackShortcuts(
              bindings: {
                const SingleActivator(LogicalKeyboardKey.escape): () {
                  text.text = '${widget.value}';
                  setState(() => error = null);
                },
              },
              child: TextField(
                controller: text,
                focusNode: focus,
                enabled: widget.onChanged != null,
                keyboardType: const TextInputType.numberWithOptions(
                  decimal: true,
                  signed: true,
                ),
                textInputAction: TextInputAction.done,
                onChanged: (_) {
                  if (error != null) setState(() => error = null);
                },
                onSubmitted: (_) => commit(),
                decoration: InputDecoration(
                  labelText: widget.label,
                  errorText: error,
                  border: const OutlineInputBorder(),
                ),
              ),
            ),
          ),
          IconButton(
            tooltip: '增加 ${widget.label}',
            onPressed: widget.onChanged != null && widget.value < widget.max
                ? () => widget.onChanged!(
                    (widget.value + widget.step).clamp(widget.min, widget.max),
                  )
                : null,
            icon: const Icon(Icons.add),
          ),
        ],
      ),
      TextButton(
        onPressed: widget.onChanged == null ? null : commit,
        child: const Text('应用数值'),
      ),
    ],
  );
}

class RosemaryRadio<T> extends StatelessWidget {
  final String label;
  final T? value;
  final List<RosemaryOption<T>> options;
  final ValueChanged<T>? onChanged;
  const RosemaryRadio({
    super.key,
    required this.label,
    required this.value,
    required this.options,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label),
      RadioGroup<T>(
        groupValue: value,
        onChanged: (v) {
          if (v != null) onChanged?.call(v);
        },
        child: Column(
          children: [
            for (final o in options)
              if (Theme.of(context).platform == TargetPlatform.iOS)
                Semantics(
                  checked: o.value == value,
                  inMutuallyExclusiveGroup: true,
                  child: CupertinoButton(
                    onPressed: o.enabled && onChanged != null
                        ? () => onChanged!(o.value)
                        : null,
                    child: Row(
                      children: [
                        Expanded(child: Text(o.label)),
                        if (o.value == value)
                          const ExcludeSemantics(
                            child: Icon(CupertinoIcons.check_mark),
                          ),
                      ],
                    ),
                  ),
                )
              else
                RadioListTile<T>(
                  key: ValueKey(o.value),
                  title: Text(o.label),
                  value: o.value,
                  enabled: o.enabled && onChanged != null,
                ),
          ],
        ),
      ),
    ],
  );
}

/// Editing text and confirmed value remain owned by the caller, including rejected selections.
class RosemaryComboBox<T> extends StatefulWidget {
  final String label;
  final T? value;
  final TextEditingController controller;
  final List<RosemaryOption<T>> options;
  final ValueChanged<T>? onSelected;
  const RosemaryComboBox({
    super.key,
    required this.label,
    required this.value,
    required this.controller,
    required this.options,
    this.onSelected,
  });
  @override
  State<RosemaryComboBox<T>> createState() => _ComboState<T>();
}

class _ComboState<T> extends State<RosemaryComboBox<T>> {
  T? active;
  final scroll = ScrollController();
  List<RosemaryOption<T>> get matches => widget.options
      .where(
        (o) => o.label.toLowerCase().contains(
          widget.controller.text.toLowerCase(),
        ),
      )
      .toList();
  void move(int delta) {
    if (widget.onSelected == null) return;
    final choices = matches.where((o) => o.enabled).toList();
    if (choices.isEmpty) return;
    final index = choices.indexWhere((o) => o.value == active);
    setState(
      () => active =
          choices[index < 0
                  ? (delta > 0 ? 0 : choices.length - 1)
                  : (index + delta) % choices.length]
              .value,
    );
    final position = matches.indexWhere((o) => o.value == active);
    if (scroll.hasClients)
      scroll.jumpTo(
        (position * 64 * MediaQuery.textScalerOf(context).scale(1)).clamp(
          0,
          scroll.position.maxScrollExtent,
        ),
      );
  }

  void select(T? value) {
    if (widget.onSelected != null &&
        widget.options.any((o) => o.value == value && o.enabled)) {
      widget.onSelected!(value as T);
    }
  }

  @override
  void dispose() {
    scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(
    BuildContext context,
  ) => ValueListenableBuilder<TextEditingValue>(
    valueListenable: widget.controller,
    builder: (context, text, _) {
      final choices = matches;
      if (!choices.any((o) => o.enabled && o.value == active)) active = null;
      return CallbackShortcuts(
        bindings: {
          const SingleActivator(LogicalKeyboardKey.arrowDown): () => move(1),
          const SingleActivator(LogicalKeyboardKey.arrowUp): () => move(-1),
          const SingleActivator(LogicalKeyboardKey.enter): () => select(active),
          const SingleActivator(LogicalKeyboardKey.escape): () =>
              setState(() => active = null),
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Theme.of(context).platform == TargetPlatform.iOS
                ? rosemaryCupertinoField(
                    context,
                    label: widget.label,
                    controller: widget.controller,
                    enabled: widget.onSelected != null,
                    onChanged: (_) => setState(() => active = null),
                  )
                : TextField(
                    controller: widget.controller,
                    enabled: widget.onSelected != null,
                    decoration: InputDecoration(labelText: widget.label),
                    onChanged: (_) => setState(() => active = null),
                    onSubmitted: (_) => select(active),
                  ),
            if (choices.isEmpty)
              const Padding(padding: EdgeInsets.all(8), child: Text('没有匹配的选项')),
            ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 240),
              child: ListView.builder(
                controller: scroll,
                shrinkWrap: true,
                itemCount: choices.length,
                itemExtent: 64 * MediaQuery.textScalerOf(context).scale(1),
                itemBuilder: (context, i) {
                  final o = choices[i];
                  return ListTile(
                    key: ValueKey(o.value),
                    title: Text(o.label),
                    selected: o.value == active,
                    trailing: o.value == widget.value
                        ? const Icon(Icons.check, semanticLabel: '已选中')
                        : null,
                    enabled: o.enabled && widget.onSelected != null,
                    onTap: o.enabled && widget.onSelected != null
                        ? () => select(o.value)
                        : null,
                  );
                },
              ),
            ),
          ],
        ),
      );
    },
  );
}

Future<DateTime?> _cupertinoDate(
  BuildContext context,
  String label,
  DateTime initial,
  DateTime? first,
  DateTime? last,
  CupertinoDatePickerMode mode,
  ValueChanged<Route<dynamic>> presented,
) {
  var draft = initial;
  return showCupertinoModalPopup<DateTime>(
    context: context,
    builder: (c) {
      presented(ModalRoute.of(c)!);
      return CupertinoPopupSurface(
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Wrap(
                spacing: 24,
                children: [
                  CupertinoButton(
                    onPressed: () => Navigator.of(c).pop(),
                    child: const Text('取消'),
                  ),
                  CupertinoButton(
                    onPressed: () => Navigator.of(c).pop(draft),
                    child: const Text('确认'),
                  ),
                ],
              ),
              Semantics(
                label: label,
                child: SizedBox(
                  height: 216,
                  child: CupertinoDatePicker(
                    mode: mode,
                    initialDateTime: initial,
                    minimumDate: first,
                    maximumDate: last,
                    onDateTimeChanged: (v) => draft = v,
                  ),
                ),
              ),
            ],
          ),
        ),
      );
    },
  );
}

class RosemaryDatePicker extends StatefulWidget {
  final String label;
  final DateTime value, first, last;
  final ValueChanged<DateTime>? onChanged;
  const RosemaryDatePicker({
    super.key,
    required this.label,
    required this.value,
    required this.first,
    required this.last,
    this.onChanged,
  });
  @override
  State<RosemaryDatePicker> createState() => _DateState();
}

mixin _PickerLifecycle<W extends StatefulWidget> on State<W> {
  bool pending = false;
  Route<dynamic>? presentation;
  bool get pickerEnabled;
  void track(Route<dynamic> route) {
    presentation = route;
    if (!mounted || !pickerEnabled) closePresentation();
  }

  void closePresentation() {
    final route = presentation;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (route?.isActive == true) route!.navigator?.removeRoute(route);
    });
  }

  @override
  void didUpdateWidget(covariant W oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (!pickerEnabled) closePresentation();
  }

  @override
  void dispose() {
    closePresentation();
    super.dispose();
  }
}

class _DateState extends State<RosemaryDatePicker>
    with _PickerLifecycle<RosemaryDatePicker> {
  @override
  bool get pickerEnabled => widget.onChanged != null;
  Future<void> open() async {
    if (pending || !pickerEnabled) return;
    setState(() => pending = true);
    final next = Theme.of(context).platform == TargetPlatform.iOS
        ? await _cupertinoDate(
            context,
            widget.label,
            widget.value,
            widget.first,
            widget.last,
            CupertinoDatePickerMode.date,
            track,
          )
        : await showDatePicker(
            context: context,
            initialDate: widget.value,
            firstDate: widget.first,
            lastDate: widget.last,
            builder: (c, child) {
              track(ModalRoute.of(c)!);
              return child!;
            },
          );
    presentation = null;
    if (!mounted) return;
    setState(() => pending = false);
    if (next != null &&
        !next.isBefore(DateUtils.dateOnly(widget.first)) &&
        !next.isAfter(DateUtils.dateOnly(widget.last)))
      widget.onChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) => OutlinedButton(
    onPressed: pickerEnabled && !pending ? open : null,
    child: Text(
      '${widget.label} ${widget.value.year}-${widget.value.month}-${widget.value.day}',
    ),
  );
}

class RosemaryTimePicker extends StatefulWidget {
  final String label;
  final TimeOfDay value;
  final ValueChanged<TimeOfDay>? onChanged;
  const RosemaryTimePicker({
    super.key,
    required this.label,
    required this.value,
    this.onChanged,
  });
  @override
  State<RosemaryTimePicker> createState() => _TimeState();
}

class _TimeState extends State<RosemaryTimePicker>
    with _PickerLifecycle<RosemaryTimePicker> {
  @override
  bool get pickerEnabled => widget.onChanged != null;
  Future<void> open() async {
    if (pending || !pickerEnabled) return;
    setState(() => pending = true);
    TimeOfDay? next;
    if (Theme.of(context).platform == TargetPlatform.iOS) {
      final d = await _cupertinoDate(
        context,
        widget.label,
        DateTime(2026, 1, 1, widget.value.hour, widget.value.minute),
        null,
        null,
        CupertinoDatePickerMode.time,
        track,
      );
      if (d != null) next = TimeOfDay.fromDateTime(d);
    } else {
      next = await showTimePicker(
        context: context,
        initialTime: widget.value,
        builder: (c, child) {
          track(ModalRoute.of(c)!);
          return child!;
        },
      );
    }
    presentation = null;
    if (!mounted) return;
    setState(() => pending = false);
    if (next != null) widget.onChanged?.call(next);
  }

  @override
  Widget build(BuildContext context) => OutlinedButton(
    onPressed: pickerEnabled && !pending ? open : null,
    child: Text('${widget.label} ${widget.value.format(context)}'),
  );
}

/// The host opens its document picker and owns access/security-scoped file handles.
class RosemaryFileUpload extends StatelessWidget {
  final String label;
  final List<RosemaryItem> files;
  final VoidCallback? onChoose;
  final ValueChanged<String>? onRemove;
  final String? error;
  final bool busy;
  const RosemaryFileUpload({
    super.key,
    required this.label,
    required this.files,
    this.onChoose,
    this.onRemove,
    this.error,
    this.busy = false,
  });
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label),
      OutlinedButton(
        onPressed: busy ? null : onChoose,
        child: Text(busy ? '正在选择' : '选择文件'),
      ),
      for (final f in files)
        ListTile(
          key: ValueKey(f.id),
          title: Text(f.label),
          subtitle: f.detail == null ? null : Text(f.detail!),
          trailing: IconButton(
            tooltip: '移除 ${f.label}',
            onPressed: busy || onRemove == null ? null : () => onRemove!(f.id),
            icon: const Icon(Icons.close),
          ),
        ),
      if (error != null)
        Text(error!, style: TextStyle(color: RosemaryTheme.of(context).danger)),
    ],
  );
}

class RosemaryColorPicker extends StatelessWidget {
  final String label;
  final Color value;
  final Map<String, Color> colors;
  final ValueChanged<Color>? onChanged;
  const RosemaryColorPicker({
    super.key,
    required this.label,
    required this.value,
    required this.colors,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label),
      Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          for (final e in colors.entries)
            Semantics(
              selected: e.value == value,
              child: OutlinedButton(
                onPressed: onChanged == null ? null : () => onChanged!(e.value),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DecoratedBox(
                      decoration: BoxDecoration(
                        color: e.value,
                        border: Border.all(
                          color: RosemaryTheme.of(context).border,
                        ),
                      ),
                      child: const SizedBox(width: 20, height: 20),
                    ),
                    const SizedBox(width: 8),
                    Flexible(child: Text(e.key)),
                    if (e.value == value) const Icon(Icons.check),
                  ],
                ),
              ),
            ),
        ],
      ),
    ],
  );
}

class RosemarySegmentedControl<T> extends StatelessWidget {
  final T value;
  final List<RosemaryOption<T>> options;
  final ValueChanged<T>? onChanged;
  const RosemarySegmentedControl({
    super.key,
    required this.value,
    required this.options,
    this.onChanged,
  });
  @override
  Widget build(BuildContext context) => Wrap(
    spacing: 8,
    runSpacing: 8,
    children: [
      for (final o in options)
        ChoiceChip(
          label: Text(o.label),
          selected: o.value == value,
          onSelected: o.enabled && onChanged != null
              ? (_) => onChanged!(o.value)
              : null,
        ),
    ],
  );
}

class RosemaryBreadcrumb extends StatelessWidget {
  final List<RosemaryAction> ancestors;
  final String current;
  const RosemaryBreadcrumb({
    super.key,
    required this.ancestors,
    required this.current,
  });
  @override
  Widget build(BuildContext context) => Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    children: [
      for (final a in ancestors) ...[
        TextButton(onPressed: a.onInvoke, child: Text(a.label)),
        const ExcludeSemantics(child: Icon(Icons.chevron_right, size: 16)),
      ],
      Semantics(namesRoute: true, child: Text(current)),
    ],
  );
}

class RosemarySidebar extends StatelessWidget {
  final List<RosemaryItem> items;
  final String value;
  final ValueChanged<String> onChanged;
  const RosemarySidebar({
    super.key,
    required this.items,
    required this.value,
    required this.onChanged,
  });
  @override
  Widget build(BuildContext context) => ListView(
    shrinkWrap: true,
    children: [
      for (final i in items)
        ListTile(
          key: ValueKey(i.id),
          selected: i.id == value,
          enabled: i.enabled,
          title: Text(i.label),
          onTap: i.enabled ? () => onChanged(i.id) : null,
        ),
    ],
  );
}

class RosemaryTopNavigation extends StatelessWidget
    implements PreferredSizeWidget {
  final String title;
  final VoidCallback? onBack;
  final List<RosemaryAction> actions;
  const RosemaryTopNavigation({
    super.key,
    required this.title,
    this.onBack,
    this.actions = const [],
  });
  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
  @override
  Widget build(BuildContext context) => AppBar(
    title: Text(title),
    leading: onBack == null ? null : BackButton(onPressed: onBack),
    actions: [
      for (final a in actions)
        TextButton(onPressed: a.onInvoke, child: Text(a.label)),
    ],
  );
}

class RosemaryBottomNavigation extends StatelessWidget {
  final List<RosemaryItem> items;
  final int value;
  final ValueChanged<int> onChanged;
  const RosemaryBottomNavigation({
    super.key,
    required this.items,
    required this.value,
    required this.onChanged,
  }) : assert(items.length >= 2);
  @override
  Widget build(BuildContext context) => NavigationBar(
    selectedIndex: value,
    onDestinationSelected: (i) {
      if (items[i].enabled) onChanged(i);
    },
    destinations: [
      for (final i in items)
        NavigationDestination(
          enabled: i.enabled,
          icon: const Icon(Icons.circle_outlined),
          selectedIcon: const Icon(Icons.check_circle),
          label: i.label,
        ),
    ],
  );
}

class RosemaryPagination extends StatelessWidget {
  final int page, count;
  final ValueChanged<int> onChanged;
  const RosemaryPagination({
    super.key,
    required this.page,
    required this.count,
    required this.onChanged,
  }) : assert(count > 0),
       assert(page >= 0 && page < count);
  @override
  Widget build(BuildContext context) => Wrap(
    crossAxisAlignment: WrapCrossAlignment.center,
    spacing: 16,
    children: [
      OutlinedButton(
        onPressed: page > 0 ? () => onChanged(page - 1) : null,
        child: const Text('上一页'),
      ),
      Semantics(liveRegion: true, child: Text('${page + 1} / $count')),
      OutlinedButton(
        onPressed: page < count - 1 ? () => onChanged(page + 1) : null,
        child: const Text('下一页'),
      ),
    ],
  );
}

class RosemaryStepper extends StatelessWidget {
  final List<String> labels;
  final int value;
  final ValueChanged<int> onChanged;
  final Widget content;
  const RosemaryStepper({
    super.key,
    required this.labels,
    required this.value,
    required this.onChanged,
    required this.content,
  });
  @override
  Widget build(BuildContext context) => Stepper(
    currentStep: value,
    controlsBuilder: (context, d) => Wrap(
      spacing: 8,
      children: [
        TextButton(onPressed: d.onStepContinue, child: const Text('继续')),
        TextButton(onPressed: d.onStepCancel, child: const Text('返回')),
      ],
    ),
    onStepTapped: onChanged,
    onStepContinue: value < labels.length - 1
        ? () => onChanged(value + 1)
        : null,
    onStepCancel: value > 0 ? () => onChanged(value - 1) : null,
    steps: [
      for (var i = 0; i < labels.length; i++)
        Step(
          title: Text(labels[i]),
          content: i == value ? content : const SizedBox.shrink(),
          isActive: i == value,
          state: i < value ? StepState.complete : StepState.indexed,
        ),
    ],
  );
}

class RosemaryCommandPalette extends StatefulWidget {
  final List<RosemaryAction> actions;
  final VoidCallback? onClose;
  const RosemaryCommandPalette({
    super.key,
    required this.actions,
    this.onClose,
  });
  @override
  State<RosemaryCommandPalette> createState() => _CommandsState();
}

class _CommandsState extends State<RosemaryCommandPalette> {
  String query = '';
  String? active;
  final scroll = ScrollController();
  List<RosemaryAction> get filtered => widget.actions
      .where((a) => a.label.toLowerCase().contains(query.toLowerCase()))
      .toList();
  List<RosemaryAction> get enabled =>
      filtered.where((a) => a.onInvoke != null).toList();
  void close() {
    if (widget.onClose != null)
      widget.onClose!();
    else if (Navigator.canPop(context))
      Navigator.pop(context);
  }

  void move(int delta) {
    final choices = enabled;
    if (choices.isEmpty) return;
    var i = choices.indexWhere((a) => a.id == active);
    i = i < 0
        ? (delta > 0 ? 0 : choices.length - 1)
        : (i + delta) % choices.length;
    setState(() => active = choices[i].id);
    reveal();
  }

  void reveal() {
    final index = filtered.indexWhere((a) => a.id == active);
    if (index < 0 || !scroll.hasClients) return;
    scroll.jumpTo(
      (index * 64 * MediaQuery.textScalerOf(context).scale(1)).clamp(
        0,
        scroll.position.maxScrollExtent,
      ),
    );
  }

  void invoke(String? id) {
    final a = widget.actions
        .where((a) => a.id == id && a.onInvoke != null)
        .firstOrNull;
    if (a == null) return;
    close();
    a.onInvoke!();
  }

  @override
  void dispose() {
    scroll.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final matches = filtered;
    final valid = enabled;
    if (!valid.any((a) => a.id == active)) active = valid.firstOrNull?.id;
    return CallbackShortcuts(
      bindings: {
        const SingleActivator(LogicalKeyboardKey.arrowDown): () => move(1),
        const SingleActivator(LogicalKeyboardKey.arrowUp): () => move(-1),
        const SingleActivator(LogicalKeyboardKey.escape): close,
        const SingleActivator(LogicalKeyboardKey.enter): () => invoke(active),
        const SingleActivator(LogicalKeyboardKey.home): () {
          setState(() => active = enabled.firstOrNull?.id);
          reveal();
        },
        const SingleActivator(LogicalKeyboardKey.end): () {
          setState(() => active = enabled.lastOrNull?.id);
          reveal();
        },
      },
      child: SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              autofocus: true,
              decoration: const InputDecoration(labelText: '搜索命令'),
              onSubmitted: (_) => invoke(active),
              onChanged: (q) => setState(() {
                query = q;
                active = null;
              }),
            ),
            if (matches.isEmpty)
              const Padding(
                padding: EdgeInsets.all(24),
                child: Text('没有匹配的命令'),
              ),
            Flexible(
              child: ListView.builder(
                controller: scroll,
                shrinkWrap: true,
                itemCount: matches.length,
                itemExtent: 64 * MediaQuery.textScalerOf(context).scale(1),
                itemBuilder: (context, i) {
                  final a = matches[i];
                  return ListTile(
                    key: ValueKey(a.id),
                    title: Text(a.label),
                    selected: a.id == active,
                    enabled: a.onInvoke != null,
                    onTap: a.onInvoke == null ? null : () => invoke(a.id),
                  );
                },
              ),
            ),
            TextButton(onPressed: close, child: const Text('关闭命令面板')),
          ],
        ),
      ),
    );
  }
}

class RosemaryList extends StatelessWidget {
  final List<RosemaryItem> items;
  final ValueChanged<String>? onActivate;
  final String? selected;
  const RosemaryList({
    super.key,
    required this.items,
    this.onActivate,
    this.selected,
  });
  @override
  Widget build(BuildContext context) => ListView.builder(
    shrinkWrap: true,
    itemCount: items.length,
    itemBuilder: (context, i) {
      final item = items[i];
      return ListTile(
        key: ValueKey(item.id),
        title: Text(item.label),
        subtitle: item.detail == null ? null : Text(item.detail!),
        selected: item.id == selected,
        enabled: item.enabled,
        onTap: onActivate == null || !item.enabled
            ? null
            : () => onActivate!(item.id),
      );
    },
  );
}

class RosemaryDescriptionList extends StatelessWidget {
  final Map<String, String> values;
  const RosemaryDescriptionList({super.key, required this.values});
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (final e in values.entries)
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Semantics(
            container: true,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(e.key, style: Theme.of(context).textTheme.labelLarge),
                Text(e.value),
              ],
            ),
          ),
        ),
    ],
  );
}

@immutable
class RosemaryRecord {
  final String id;
  final Map<String, String> cells;
  const RosemaryRecord(this.id, this.cells);
}

@immutable
class RosemaryColumn {
  final String id, label;
  final bool editable;
  const RosemaryColumn(this.id, this.label, {this.editable = false});
}

class RosemaryTable extends StatelessWidget {
  final List<RosemaryColumn> columns;
  final List<RosemaryRecord> rows;
  final String? sortColumn;
  final bool ascending;
  final void Function(String, bool)? onSort;
  const RosemaryTable({
    super.key,
    required this.columns,
    required this.rows,
    this.sortColumn,
    this.ascending = true,
    this.onSort,
  });
  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, c) => c.maxWidth < 600
        ? Column(
            children: [
              if (onSort != null)
                Wrap(
                  children: [
                    for (final col in columns)
                      TextButton(
                        onPressed: () => onSort!(
                          col.id,
                          sortColumn == col.id ? !ascending : true,
                        ),
                        child: Text('按${col.label}排序'),
                      ),
                  ],
                ),
              for (final row in rows)
                RosemaryCard(
                  key: ValueKey(row.id),
                  child: RosemaryDescriptionList(
                    values: {
                      for (final col in columns)
                        col.label: row.cells[col.id] ?? '',
                    },
                  ),
                ),
            ],
          )
        : SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              sortColumnIndex: columns.indexWhere((c) => c.id == sortColumn) < 0
                  ? null
                  : columns.indexWhere((c) => c.id == sortColumn),
              sortAscending: ascending,
              columns: [
                for (final col in columns)
                  DataColumn(
                    label: Text(col.label),
                    onSort: onSort == null
                        ? null
                        : (_, asc) => onSort!(col.id, asc),
                  ),
              ],
              rows: [
                for (final row in rows)
                  DataRow(
                    key: ValueKey(row.id),
                    cells: [
                      for (final col in columns)
                        DataCell(Text(row.cells[col.id] ?? '')),
                    ],
                  ),
              ],
            ),
          ),
  );
}

/// Editable records use native fields, with per-cell labels and stable row identity.
class RosemaryDataGrid extends StatefulWidget {
  final List<RosemaryColumn> columns;
  final List<RosemaryRecord> rows;
  final Set<String> selected;
  final ValueChanged<Set<String>> onSelectionChanged;
  final void Function(String, String, String) onCellCommit;
  final RosemaryGridConfiguration? configuration;
  final double height;
  const RosemaryDataGrid({
    super.key,
    required this.columns,
    required this.rows,
    required this.selected,
    required this.onSelectionChanged,
    required this.onCellCommit,
    this.configuration,
    this.height = 400,
  });
  @override
  State<RosemaryDataGrid> createState() => _DataGridState();
}

class _DataGridState extends State<RosemaryDataGrid> {
  final owned = RosemaryGridConfiguration();
  @override
  void dispose() {
    owned.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => RosemaryVirtualDataGrid(
    columns: widget.columns,
    rows: widget.rows,
    selected: widget.selected,
    onSelectionChanged: widget.onSelectionChanged,
    onCellCommit: widget.onCellCommit,
    configuration: widget.configuration ?? owned,
    height: widget.height,
  );
}

@immutable
class RosemaryTreeNode {
  final String id, label;
  final List<RosemaryTreeNode> children;
  const RosemaryTreeNode(this.id, this.label, {this.children = const []});
}

class RosemaryBadge extends StatelessWidget {
  final String label;
  const RosemaryBadge({super.key, required this.label});
  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    child: DecoratedBox(
      decoration: BoxDecoration(
        color: RosemaryTheme.of(context).accent.withValues(alpha: .12),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Text(label),
      ),
    ),
  );
}

class RosemaryTag extends StatelessWidget {
  final String label;
  final bool selected;
  final ValueChanged<bool>? onChanged;
  final VoidCallback? onRemove;
  const RosemaryTag({
    super.key,
    required this.label,
    this.selected = false,
    this.onChanged,
    this.onRemove,
  });
  @override
  Widget build(BuildContext context) => InputChip(
    label: Text(label),
    selected: selected,
    onSelected: onChanged,
    onDeleted: onRemove,
    deleteButtonTooltipMessage: '移除 $label',
  );
}

class RosemaryAvatar extends StatelessWidget {
  final String label, initials;
  final ImageProvider? image;
  const RosemaryAvatar({
    super.key,
    required this.label,
    required this.initials,
    this.image,
  });
  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    image: true,
    child: ExcludeSemantics(
      child: CircleAvatar(
        foregroundImage: image,
        onForegroundImageError: image == null ? null : (_, __) {},
        child: Text(initials),
      ),
    ),
  );
}

class RosemarySheet extends StatelessWidget {
  final String title;
  final Widget child;
  final VoidCallback onClose;
  const RosemarySheet({
    super.key,
    required this.title,
    required this.child,
    required this.onClose,
  });
  @override
  Widget build(BuildContext context) => SafeArea(
    child: SingleChildScrollView(
      child: Padding(
        padding: EdgeInsets.fromLTRB(
          24,
          24,
          24,
          24 + MediaQuery.viewInsetsOf(context).bottom,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Semantics(
                    header: true,
                    child: Text(
                      title,
                      style: Theme.of(context).textTheme.titleLarge,
                    ),
                  ),
                ),
                IconButton(
                  tooltip: '关闭 $title',
                  onPressed: onClose,
                  icon: const Icon(Icons.close),
                ),
              ],
            ),
            const SizedBox(height: 24),
            child,
          ],
        ),
      ),
    ),
  );
}

class RosemaryToast extends StatelessWidget {
  final String message;
  const RosemaryToast({super.key, required this.message});
  @override
  Widget build(BuildContext context) => Semantics(
    liveRegion: true,
    child: Material(
      color: RosemaryTheme.of(context).surface,
      borderRadius: BorderRadius.circular(8),
      child: Padding(padding: const EdgeInsets.all(16), child: Text(message)),
    ),
  );
}

class RosemarySnackbar extends StatelessWidget {
  final String message;
  final RosemaryAction action;
  final VoidCallback onDismiss;
  const RosemarySnackbar({
    super.key,
    required this.message,
    required this.action,
    required this.onDismiss,
  });
  @override
  Widget build(BuildContext context) => Semantics(
    liveRegion: true,
    child: Wrap(
      crossAxisAlignment: WrapCrossAlignment.center,
      spacing: 16,
      children: [
        Text(message),
        TextButton(onPressed: action.onInvoke, child: Text(action.label)),
        IconButton(
          tooltip: '关闭通知',
          onPressed: onDismiss,
          icon: const Icon(Icons.close),
        ),
      ],
    ),
  );
}

class RosemaryBanner extends StatelessWidget {
  final String title, message;
  final List<RosemaryAction> actions;
  const RosemaryBanner({
    super.key,
    required this.title,
    required this.message,
    this.actions = const [],
  });
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Semantics(header: true, child: Text(title)),
      Text(message),
      RosemaryButtonGroup(actions: actions),
    ],
  );
}

class RosemarySkeleton extends StatelessWidget {
  final String label;
  final int lines;
  const RosemarySkeleton({super.key, this.label = '正在加载内容', this.lines = 3});
  @override
  Widget build(BuildContext context) => Semantics(
    label: label,
    child: ExcludeSemantics(
      child: Column(
        children: [
          for (var i = 0; i < lines; i++)
            Container(
              margin: const EdgeInsets.symmetric(vertical: 4),
              height: 16,
              color: RosemaryTheme.of(context).border.withValues(alpha: .25),
            ),
        ],
      ),
    ),
  );
}

class RosemaryTooltip extends StatelessWidget {
  final String message;
  final Widget child;
  const RosemaryTooltip({
    super.key,
    required this.message,
    required this.child,
  });
  @override
  Widget build(BuildContext context) => Tooltip(message: message, child: child);
}

class RosemaryPopover extends StatelessWidget {
  final String label;
  final Widget content;
  const RosemaryPopover({
    super.key,
    required this.label,
    required this.content,
  });
  @override
  Widget build(BuildContext context) {
    if (MediaQuery.sizeOf(context).width < 600)
      return OutlinedButton(
        onPressed: () => showModalBottomSheet<void>(
          context: context,
          isScrollControlled: true,
          useSafeArea: true,
          builder: (c) => RosemarySheet(
            title: label,
            onClose: () => Navigator.pop(c),
            child: content,
          ),
        ),
        child: Text(label),
      );
    return MenuAnchor(
      menuChildren: [
        Builder(
          builder: (c) => SizedBox(
            width: 360,
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxHeight: 400),
              child: RosemarySheet(
                title: label,
                onClose: () => MenuController.maybeOf(c)?.close(),
                child: content,
              ),
            ),
          ),
        ),
      ],
      builder: (c, controller, _) => OutlinedButton(
        onPressed: () =>
            controller.isOpen ? controller.close() : controller.open(),
        child: Text(label),
      ),
    );
  }
}

class RosemaryDropdownMenu extends StatefulWidget {
  final String label;
  final List<RosemaryAction> actions;
  const RosemaryDropdownMenu({
    super.key,
    required this.label,
    required this.actions,
  });
  @override
  State<RosemaryDropdownMenu> createState() => _DropdownState();
}

class _DropdownState extends State<RosemaryDropdownMenu> {
  void invoke(String id) {
    if (!mounted) return;
    widget.actions.where((a) => a.id == id).firstOrNull?.onInvoke?.call();
  }

  @override
  Widget build(BuildContext context) => PopupMenuButton<String>(
    tooltip: widget.label,
    onSelected: invoke,
    itemBuilder: (_) => [
      for (final a in widget.actions)
        PopupMenuItem(
          value: a.id,
          enabled: a.onInvoke != null,
          child: Text(
            a.label,
            style: a.destructive
                ? TextStyle(color: RosemaryTheme.of(context).danger)
                : null,
          ),
        ),
    ],
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Text(widget.label),
    ),
  );
}

class RosemaryContextMenu extends StatefulWidget {
  final List<RosemaryAction> actions;
  final Widget child;
  const RosemaryContextMenu({
    super.key,
    required this.actions,
    required this.child,
  });
  @override
  State<RosemaryContextMenu> createState() => _ContextMenuState();
}

class _ContextMenuState extends State<RosemaryContextMenu> {
  void invoke(String id) {
    if (mounted)
      widget.actions.where((a) => a.id == id).firstOrNull?.onInvoke?.call();
  }

  Future<void> open(Offset point) async {
    if (widget.actions.isEmpty) return;
    final overlay =
        Navigator.of(context).overlay!.context.findRenderObject()! as RenderBox;
    final local = overlay.globalToLocal(point);
    final id = await showMenu<String>(
      context: context,
      position: RelativeRect.fromRect(
        Rect.fromLTWH(local.dx, local.dy, 0, 0),
        Offset.zero & overlay.size,
      ),
      items: [
        for (final a in widget.actions)
          PopupMenuItem(
            value: a.id,
            enabled: a.onInvoke != null,
            child: Text(a.label),
          ),
      ],
    );
    if (id != null) invoke(id);
  }

  @override
  Widget build(BuildContext context) => Column(
    mainAxisSize: MainAxisSize.min,
    children: [
      GestureDetector(
        onLongPressStart: (d) => open(d.globalPosition),
        onSecondaryTapDown: (d) => open(d.globalPosition),
        child: Semantics(
          customSemanticsActions: {
            for (final a in widget.actions.where((a) => a.onInvoke != null))
              CustomSemanticsAction(label: a.label): () => invoke(a.id),
          },
          child: widget.child,
        ),
      ),
      RosemaryDropdownMenu(label: '更多操作', actions: widget.actions),
    ],
  );
}

class RosemaryDrawer extends StatelessWidget {
  final String title;
  final List<RosemaryItem> items;
  final String value;
  final ValueChanged<String> onChanged;
  const RosemaryDrawer({
    super.key,
    required this.title,
    required this.items,
    required this.value,
    required this.onChanged,
  });
  @override
  Widget build(BuildContext context) => Drawer(
    child: SafeArea(
      child: Column(
        children: [
          Text(title, style: Theme.of(context).textTheme.titleLarge),
          Expanded(
            child: RosemarySidebar(
              items: items,
              value: value,
              onChanged: (id) {
                Navigator.of(context).pop();
                onChanged(id);
              },
            ),
          ),
        ],
      ),
    ),
  );
}

class RosemaryCard extends StatelessWidget {
  final Widget child;
  const RosemaryCard({super.key, required this.child});
  @override
  Widget build(BuildContext context) => Card(
    elevation: 0,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(8),
      side: BorderSide(color: RosemaryTheme.of(context).border),
    ),
    child: Padding(padding: const EdgeInsets.all(16), child: child),
  );
}

class RosemaryAccordion extends StatelessWidget {
  final String label;
  final bool expanded;
  final ValueChanged<bool> onChanged;
  final Widget child;
  const RosemaryAccordion({
    super.key,
    required this.label,
    required this.expanded,
    required this.onChanged,
    required this.child,
  });
  @override
  Widget build(BuildContext context) => Column(
    children: [
      Semantics(
        expanded: expanded,
        child: ListTile(
          title: Text(label),
          trailing: Icon(expanded ? Icons.expand_less : Icons.expand_more),
          onTap: () => onChanged(!expanded),
        ),
      ),
      AnimatedSize(
        duration: MediaQuery.disableAnimationsOf(context)
            ? Duration.zero
            : const Duration(milliseconds: 240),
        curve: Curves.easeOutCubic,
        child: ExcludeFocus(
          excluding: !expanded,
          child: TickerMode(
            enabled: expanded,
            child: Offstage(offstage: !expanded, child: child),
          ),
        ),
      ),
    ],
  );
}

class RosemaryDivider extends StatelessWidget {
  const RosemaryDivider({super.key});
  @override
  Widget build(BuildContext context) => const Divider(height: 32);
}

class RosemaryScrollArea extends StatelessWidget {
  final ScrollController controller;
  final Widget child;
  const RosemaryScrollArea({
    super.key,
    required this.controller,
    required this.child,
  });
  @override
  Widget build(BuildContext context) {
    final view = SingleChildScrollView(controller: controller, child: child);
    return Theme.of(context).platform == TargetPlatform.iOS
        ? CupertinoScrollbar(controller: controller, child: view)
        : Scrollbar(controller: controller, child: view);
  }
}

class RosemaryResizablePanels extends StatelessWidget {
  final double fraction;
  final ValueChanged<double> onChanged;
  final Widget leading, trailing;
  const RosemaryResizablePanels({
    super.key,
    required this.fraction,
    required this.onChanged,
    required this.leading,
    required this.trailing,
  }) : assert(fraction >= .2 && fraction <= .8);
  @override
  Widget build(BuildContext context) => LayoutBuilder(
    builder: (context, c) {
      if (c.maxWidth < 600)
        return Column(
          children: [leading, const SizedBox(height: 24), trailing],
        );
      final width = c.maxWidth - 48;
      return Row(
        children: [
          SizedBox(width: width * fraction, child: leading),
          Semantics(
            label: '调整分栏',
            value: '${(fraction * 100).round()}%',
            increasedValue:
                '${((fraction + .05).clamp(.2, .8) * 100).round()}%',
            decreasedValue:
                '${((fraction - .05).clamp(.2, .8) * 100).round()}%',
            onIncrease: () => onChanged((fraction + .05).clamp(.2, .8)),
            onDecrease: () => onChanged((fraction - .05).clamp(.2, .8)),
            child: _SplitHandle(
              onDelta: (delta) => onChanged(
                (fraction +
                        delta /
                            width *
                            (Directionality.of(context) == TextDirection.rtl
                                ? -1
                                : 1))
                    .clamp(.2, .8),
              ),
              onStep: (delta) => onChanged((fraction + delta).clamp(.2, .8)),
            ),
          ),
          Expanded(child: trailing),
        ],
      );
    },
  );
}

class _SplitHandle extends StatefulWidget {
  final ValueChanged<double> onDelta, onStep;
  const _SplitHandle({required this.onDelta, required this.onStep});
  @override
  State<_SplitHandle> createState() => _SplitHandleState();
}

class _SplitHandleState extends State<_SplitHandle> {
  bool hovered = false, focused = false, pressed = false;
  @override
  Widget build(BuildContext context) => MouseRegion(
    cursor: SystemMouseCursors.resizeLeftRight,
    onEnter: (_) => setState(() => hovered = true),
    onExit: (_) => setState(() => hovered = false),
    child: Focus(
      onFocusChange: (v) => setState(() => focused = v),
      onKeyEvent: (n, e) {
        if (e is! KeyDownEvent) return KeyEventResult.ignored;
        final sign = Directionality.of(context) == TextDirection.rtl
            ? -1.0
            : 1.0;
        if (e.logicalKey == LogicalKeyboardKey.arrowLeft ||
            e.logicalKey == LogicalKeyboardKey.arrowRight) {
          widget.onStep(
            (e.logicalKey == LogicalKeyboardKey.arrowRight ? .05 : -.05) * sign,
          );
          return KeyEventResult.handled;
        }
        return KeyEventResult.ignored;
      },
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onHorizontalDragStart: (_) => setState(() => pressed = true),
        onHorizontalDragEnd: (_) => setState(() => pressed = false),
        onHorizontalDragCancel: () => setState(() => pressed = false),
        onHorizontalDragUpdate: (d) => widget.onDelta(d.delta.dx),
        child: AnimatedContainer(
          width: 48,
          constraints: const BoxConstraints(minHeight: 48),
          duration: MediaQuery.disableAnimationsOf(context)
              ? Duration.zero
              : const Duration(milliseconds: 120),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(8),
            color: RosemaryTheme.of(context).accent.withValues(
              alpha: pressed
                  ? .18
                  : (hovered || focused)
                  ? .1
                  : 0,
            ),
            border: focused
                ? Border.all(color: RosemaryTheme.of(context).accent)
                : null,
          ),
          child: const Icon(Icons.drag_indicator, size: 20),
        ),
      ),
    ),
  );
}

class RosemaryMetricCard extends StatelessWidget {
  final String label, value, detail;
  final List<double> series;
  final String? trend;
  const RosemaryMetricCard({
    super.key,
    required this.label,
    required this.value,
    this.detail = '',
    this.series = const [],
    this.trend,
  });
  @override
  Widget build(BuildContext context) {
    final points = series.where((v) => v.isFinite).toList();
    final description =
        trend ??
        (points.length < 2
            ? ''
            : points.last > points.first
            ? '趋势上升'
            : points.last < points.first
            ? '趋势下降'
            : '趋势稳定');
    return RosemaryCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label),
          Text(value, style: Theme.of(context).textTheme.headlineMedium),
          if (description.isNotEmpty) Text(description),
          if (points.length > 1)
            ExcludeSemantics(
              child: SizedBox(
                height: 48,
                width: double.infinity,
                child: CustomPaint(
                  painter: _TrendPainter(
                    points,
                    RosemaryTheme.of(context).accent,
                  ),
                ),
              ),
            ),
          if (detail.isNotEmpty) Text(detail),
        ],
      ),
    );
  }
}

class _TrendPainter extends CustomPainter {
  final List<double> points;
  final Color color;
  _TrendPainter(this.points, this.color);
  @override
  void paint(Canvas canvas, Size size) {
    if (points.length < 2 || size.width <= 0) return;
    final low = points.reduce(math.min),
        high = points.reduce(math.max),
        span = high - low;
    final path = Path();
    for (var i = 0; i < points.length; i++) {
      final x = 2 + (size.width - 4) * i / (points.length - 1),
          y = span == 0
              ? size.height / 2
              : 2 + (size.height - 4) * (1 - (points[i] - low) / span);
      i == 0 ? path.moveTo(x, y) : path.lineTo(x, y);
    }
    canvas.drawPath(
      path,
      Paint()
        ..color = color
        ..strokeWidth = 1.75
        ..style = PaintingStyle.stroke,
    );
  }

  @override
  bool shouldRepaint(covariant _TrendPainter old) =>
      old.color != color || !listEquals(old.points, points);
}

enum RosemaryHealth { unknown, healthy, degraded, offline }

class RosemaryProberStatus extends StatelessWidget {
  final String label, state;
  final RosemaryAction? recovery;
  final RosemaryHealth health;
  final Duration? latency;
  final DateTime? checkedAt;
  const RosemaryProberStatus({
    super.key,
    required this.label,
    required this.state,
    this.recovery,
    this.health = RosemaryHealth.unknown,
    this.latency,
    this.checkedAt,
  });
  @override
  Widget build(BuildContext context) => Semantics(
    liveRegion: true,
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label),
        Wrap(
          spacing: 8,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            ExcludeSemantics(
              child: Icon(switch (health) {
                RosemaryHealth.healthy => Icons.check_circle_outline,
                RosemaryHealth.degraded => Icons.warning_amber,
                RosemaryHealth.offline => Icons.cloud_off_outlined,
                RosemaryHealth.unknown => Icons.help_outline,
              }, size: 20),
            ),
            Text(state),
          ],
        ),
        if (latency != null) Text('响应时间 ${latency!.inMilliseconds} ms'),
        if (checkedAt != null)
          Text('检查时间 ${checkedAt!.toLocal().toIso8601String()}'),
        if (recovery != null)
          TextButton(
            onPressed: recovery!.onInvoke,
            child: Text(recovery!.label),
          ),
      ],
    ),
  );
}

@immutable
class RosemaryFileMetadata {
  final String kind, size, sync;
  const RosemaryFileMetadata({this.kind = '', this.size = '', this.sync = ''});
  String get description =>
      [kind, size, sync].where((s) => s.isNotEmpty).join(' · ');
}

class RosemaryFileRow extends StatelessWidget {
  final RosemaryItem file;
  final bool selected;
  final ValueChanged<bool>? onSelected;
  final List<RosemaryAction> actions;
  final VoidCallback? onOpen;
  final RosemaryFileMetadata? metadata;
  const RosemaryFileRow({
    super.key,
    required this.file,
    this.selected = false,
    this.onSelected,
    this.actions = const [],
    this.onOpen,
    this.metadata,
  });
  @override
  Widget build(BuildContext context) => RosemaryContextMenu(
    actions: file.enabled ? actions : const [],
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        CheckboxListTile(
          value: selected,
          onChanged: !file.enabled || onSelected == null
              ? null
              : (v) => onSelected!(v ?? false),
          title: Text(file.label),
          subtitle: file.detail == null ? null : Text(file.detail!),
        ),
        if (metadata != null && metadata!.description.isNotEmpty)
          Padding(
            padding: const EdgeInsetsDirectional.only(start: 16),
            child: Text(metadata!.description),
          ),
        if (onOpen != null)
          TextButton(
            onPressed: file.enabled ? onOpen : null,
            child: Text('打开 ${file.label}'),
          ),
      ],
    ),
  );
}
