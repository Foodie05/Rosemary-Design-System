import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'extended.dart' show RosemaryColumn, RosemaryRecord;

/// View configuration is persistable by the host; record data and selection stay controlled.
class RosemaryGridConfiguration extends ChangeNotifier {
  final Map<String, double> widths;
  final Map<String, String> filters;
  String? row, column;
  RosemaryGridConfiguration({
    Map<String, double>? widths,
    Map<String, String>? filters,
  }) : widths = {...?widths},
       filters = {...?filters};
  double width(String id) => (widths[id] ?? 180).clamp(96, 480);
  void resize(String id, double value) {
    widths[id] = value.clamp(96, 480);
    notifyListeners();
  }

  void filter(String id, String value) {
    filters[id] = value;
    notifyListeners();
  }

  List<RosemaryRecord> visible(List<RosemaryRecord> rows) => rows
      .where(
        (r) => filters.entries.every(
          (f) => (r.cells[f.key] ?? '').toLowerCase().contains(
            f.value.toLowerCase(),
          ),
        ),
      )
      .toList();
}

class RosemaryVirtualDataGrid extends StatefulWidget {
  final List<RosemaryColumn> columns;
  final List<RosemaryRecord> rows;
  final Set<String> selected;
  final ValueChanged<Set<String>> onSelectionChanged;
  final void Function(String, String, String) onCellCommit;
  final RosemaryGridConfiguration configuration;
  final double height;
  const RosemaryVirtualDataGrid({
    super.key,
    required this.columns,
    required this.rows,
    required this.selected,
    required this.onSelectionChanged,
    required this.onCellCommit,
    required this.configuration,
    this.height = 400,
  });
  @override
  State<RosemaryVirtualDataGrid> createState() => _GridState();
}

class _GridState extends State<RosemaryVirtualDataGrid> {
  final left = ScrollController(),
      right = ScrollController(),
      horizontal = ScrollController();
  final nodes = <String, FocusNode>{};
  bool syncing = false, editing = false;
  final filterNodes = <String, FocusNode>{};
  @override
  void initState() {
    super.initState();
    left.addListener(() => sync(left, right));
    right.addListener(() => sync(right, left));
  }

  void sync(ScrollController from, ScrollController to) {
    if (syncing || !from.hasClients || !to.hasClients) return;
    syncing = true;
    to.jumpTo(
      from.offset.clamp(
        to.position.minScrollExtent,
        to.position.maxScrollExtent,
      ),
    );
    syncing = false;
  }

  @override
  void dispose() {
    left.dispose();
    right.dispose();
    horizontal.dispose();
    for (final n in [...nodes.values, ...filterNodes.values]) {
      n.dispose();
    }
    super.dispose();
  }

  String keyOf(String row, String col) => '$row\u0000$col';
  double get rowHeight =>
      math.max(64, MediaQuery.textScalerOf(context).scale(24) * 2 + 16);
  void toggle(String id) {
    final next = Set<String>.of(widget.selected);
    next.contains(id) ? next.remove(id) : next.add(id);
    widget.onSelectionChanged(next);
  }

  Future<void> edit(RosemaryRecord row, RosemaryColumn column) async {
    if (!column.editable || editing) return;
    editing = true;
    final draft = TextEditingController(text: row.cells[column.id] ?? '');
    final route = DialogRoute<bool>(
      context: context,
      builder: (c) => AlertDialog(
        title: Text('编辑 ${column.label}'),
        content: TextField(
          controller: draft,
          autofocus: true,
          decoration: InputDecoration(labelText: column.label),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(c).pop(false),
            child: const Text('取消'),
          ),
          TextButton(
            onPressed: () => Navigator.of(c).pop(true),
            child: const Text('保存'),
          ),
        ],
      ),
    );
    final result = await Navigator.of(context).push(route);
    await route.completed;
    if (mounted &&
        result == true &&
        widget.rows.any((r) => r.id == row.id) &&
        widget.columns.any((c) => c.id == column.id && c.editable))
      widget.onCellCommit(row.id, column.id, draft.text);
    editing = false;
    draft.dispose();
    if (mounted) nodes[keyOf(row.id, column.id)]?.requestFocus();
  }

  void focusCell(List<RosemaryRecord> rows, int r, int c) {
    if (rows.isEmpty) return;
    r = r.clamp(0, rows.length - 1);
    c = c.clamp(0, widget.columns.length - 1);
    final row = rows[r], column = widget.columns[c];
    widget.configuration.row = row.id;
    widget.configuration.column = column.id;
    if (right.hasClients) {
      final top = r * rowHeight, bottom = top + rowHeight;
      if (top < right.offset)
        right.jumpTo(top);
      else if (bottom > right.offset + right.position.viewportDimension)
        right.jumpTo(
          (bottom - right.position.viewportDimension).clamp(
            0,
            right.position.maxScrollExtent,
          ),
        );
    }
    if (c > 0 && horizontal.hasClients) {
      double x = 0;
      for (var i = 1; i < c; i++) {
        x += widget.configuration.width(widget.columns[i].id);
      }
      final end = x + widget.configuration.width(column.id);
      if (x < horizontal.offset)
        horizontal.jumpTo(x);
      else if (end > horizontal.offset + horizontal.position.viewportDimension)
        horizontal.jumpTo(
          (end - horizontal.position.viewportDimension).clamp(
            0,
            horizontal.position.maxScrollExtent,
          ),
        );
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) nodes[keyOf(row.id, column.id)]?.requestFocus();
    });
    setState(() {});
  }

  KeyEventResult keys(KeyEvent event, List<RosemaryRecord> rows) {
    if (event is! KeyDownEvent ||
        editing ||
        filterNodes.values.any((n) => n.hasFocus))
      return KeyEventResult.ignored;
    final cfg = widget.configuration;
    int r = math.max(0, rows.indexWhere((row) => row.id == cfg.row)),
        c = math.max(
          0,
          widget.columns.indexWhere((col) => col.id == cfg.column),
        );
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.arrowDown)
      r++;
    else if (key == LogicalKeyboardKey.arrowUp)
      r--;
    else if (key == LogicalKeyboardKey.arrowRight)
      c++;
    else if (key == LogicalKeyboardKey.arrowLeft)
      c--;
    else if (key == LogicalKeyboardKey.home) {
      c = 0;
      if (HardwareKeyboard.instance.isControlPressed) r = 0;
    } else if (key == LogicalKeyboardKey.end) {
      c = widget.columns.length - 1;
      if (HardwareKeyboard.instance.isControlPressed) r = rows.length - 1;
    } else if (key == LogicalKeyboardKey.space && rows.isNotEmpty) {
      toggle(rows[r].id);
      return KeyEventResult.handled;
    } else if (key == LogicalKeyboardKey.enter && rows.isNotEmpty) {
      edit(rows[r], widget.columns[c]);
      return KeyEventResult.handled;
    } else {
      return KeyEventResult.ignored;
    }
    focusCell(rows, r, c);
    return KeyEventResult.handled;
  }

  Widget cell(
    RosemaryRecord row,
    RosemaryColumn column,
    bool frozen,
  ) => SizedBox(
    height: rowHeight,
    child: Row(
      children: [
        if (frozen)
          Semantics(
            label: "选择 ${row.cells[column.id] ?? row.id}",
            child: Checkbox(
              value: widget.selected.contains(row.id),
              onChanged: (_) => toggle(row.id),
            ),
          ),
        Expanded(
          child: Semantics(
            selected:
                widget.configuration.row == row.id &&
                widget.configuration.column == column.id,
            child: OutlinedButton(
              focusNode: nodes.putIfAbsent(
                keyOf(row.id, column.id),
                () => FocusNode(),
              ),
              onFocusChange: (v) {
                if (v) {
                  widget.configuration.row = row.id;
                  widget.configuration.column = column.id;
                }
              },
              onPressed: () {
                widget.configuration.row = row.id;
                widget.configuration.column = column.id;
                if (column.editable)
                  edit(row, column);
                else
                  toggle(row.id);
              },
              child: Text(
                '${frozen ? (widget.selected.contains(row.id) ? '✓ ' : '○ ') : ''}${column.label}: ${row.cells[column.id] ?? ''}',
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ),
        ),
      ],
    ),
  );
  Widget header(RosemaryColumn col) => SizedBox(
    height: rowHeight,
    child: Row(
      children: [
        Expanded(
          child: Text(col.label, maxLines: 2, overflow: TextOverflow.ellipsis),
        ),
        Semantics(
          label: '调整 ${col.label} 列宽',
          value: '${widget.configuration.width(col.id).round()}',
          increasedValue:
              '${(widget.configuration.width(col.id) + 16).clamp(96, 480).round()}',
          decreasedValue:
              '${(widget.configuration.width(col.id) - 16).clamp(96, 480).round()}',
          onIncrease: () => widget.configuration.resize(
            col.id,
            widget.configuration.width(col.id) + 16,
          ),
          onDecrease: () => widget.configuration.resize(
            col.id,
            widget.configuration.width(col.id) - 16,
          ),
          child: GestureDetector(
            onHorizontalDragUpdate: (d) => widget.configuration.resize(
              col.id,
              widget.configuration.width(col.id) + d.delta.dx,
            ),
            child: const SizedBox(
              width: 48,
              height: 48,
              child: Icon(Icons.drag_indicator),
            ),
          ),
        ),
      ],
    ),
  );
  Widget viewport(List<RosemaryRecord> rows, double available) {
    final first = widget.columns.first;
    final frozen = math.min(
      widget.configuration.width(first.id),
      available * .45,
    );
    final rest = widget.columns
        .skip(1)
        .fold<double>(0, (s, c) => s + widget.configuration.width(c.id));
    final frozenLane = SizedBox(
      width: frozen,
      child: Column(
        children: [
          header(first),
          Expanded(
            child: ListView.builder(
              controller: left,
              itemExtent: rowHeight,
              itemCount: rows.length,
              itemBuilder: (c, i) => cell(rows[i], first, true),
            ),
          ),
        ],
      ),
    );
    final movingLane = SizedBox(
      width: math.max(rest, available - frozen),
      child: Column(
        children: [
          Row(
            children: [
              for (final col in widget.columns.skip(1))
                SizedBox(
                  width: widget.configuration.width(col.id),
                  child: header(col),
                ),
            ],
          ),
          Expanded(
            child: ListView.builder(
              controller: right,
              itemExtent: rowHeight,
              itemCount: rows.length,
              itemBuilder: (c, i) => Row(
                children: [
                  for (final col in widget.columns.skip(1))
                    SizedBox(
                      width: widget.configuration.width(col.id),
                      child: cell(rows[i], col, false),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
    return SizedBox(
      height: widget.height,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          frozenLane,
          Expanded(
            child: Scrollbar(
              controller: horizontal,
              child: SingleChildScrollView(
                controller: horizontal,
                scrollDirection: Axis.horizontal,
                child: movingLane,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    assert(widget.columns.isNotEmpty);
    assert(widget.rows.map((r) => r.id).toSet().length == widget.rows.length);
    return ListenableBuilder(
      listenable: widget.configuration,
      builder: (context, _) {
        final rows = widget.configuration.visible(widget.rows);
        if (widget.configuration.row != null &&
            (!rows.any((r) => r.id == widget.configuration.row) ||
                !widget.columns.any(
                  (c) => c.id == widget.configuration.column,
                ))) {
          final restore = nodes.values.any((n) => n.hasFocus);
          widget.configuration.row = rows.firstOrNull?.id;
          widget.configuration.column = widget.columns.firstOrNull?.id;
          if (restore && rows.isNotEmpty && widget.columns.isNotEmpty)
            WidgetsBinding.instance.addPostFrameCallback((_) {
              if (mounted) focusCell(rows, 0, 0);
            });
        }

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final col in widget.columns)
                  SizedBox(
                    width: 180,
                    child: _GridFilter(
                      key: ValueKey('filter-${col.id}'),
                      value: widget.configuration.filters[col.id] ?? '',
                      label: '筛选 ${col.label}',
                      focus: filterNodes.putIfAbsent(col.id, () => FocusNode()),
                      onChanged: (v) => widget.configuration.filter(col.id, v),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Text('${rows.length} 条记录 · ${widget.selected.length} 项已选择'),
            Focus(
              onKeyEvent: (_, event) => keys(event, rows),
              child: LayoutBuilder(
                builder: (context, c) => viewport(rows, c.maxWidth),
              ),
            ),
          ],
        );
      },
    );
  }
}

class _GridFilter extends StatefulWidget {
  final String value, label;
  final FocusNode focus;
  final ValueChanged<String> onChanged;
  const _GridFilter({
    super.key,
    required this.value,
    required this.label,
    required this.focus,
    required this.onChanged,
  });
  @override
  State<_GridFilter> createState() => _GridFilterState();
}

class _GridFilterState extends State<_GridFilter> {
  late final text = TextEditingController(text: widget.value);
  @override
  void didUpdateWidget(covariant _GridFilter old) {
    super.didUpdateWidget(old);
    if (text.text != widget.value)
      text.value = TextEditingValue(
        text: widget.value,
        selection: TextSelection.collapsed(offset: widget.value.length),
      );
  }

  @override
  void dispose() {
    text.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => TextField(
    controller: text,
    focusNode: widget.focus,
    onChanged: widget.onChanged,
    decoration: InputDecoration(labelText: widget.label),
  );
}
