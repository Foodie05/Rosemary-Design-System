import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'extended.dart' show RosemaryTreeNode;

class RosemaryTreeView extends StatefulWidget {
  final List<RosemaryTreeNode> nodes;
  final Set<String> expanded;
  final String? selected;
  final ValueChanged<Set<String>> onExpandedChanged;
  final ValueChanged<String> onSelected;
  final double height;
  const RosemaryTreeView({
    super.key,
    required this.nodes,
    required this.expanded,
    required this.onExpandedChanged,
    required this.onSelected,
    this.selected,
    this.height = 400,
  });
  @override
  State<RosemaryTreeView> createState() => _TreeState();
}

class _TreeState extends State<RosemaryTreeView> {
  final scroll = ScrollController(), focus = <String, FocusNode>{};
  String? active;
  String prefix = '';
  DateTime typed = DateTime.fromMillisecondsSinceEpoch(0);
  final parents = <String, String?>{}, depths = <String, int>{};
  List<RosemaryTreeNode> visible() {
    final result = <RosemaryTreeNode>[], ids = <String>{};
    parents.clear();
    depths.clear();
    void visit(RosemaryTreeNode n, String? parent, int depth, bool shown) {
      if (!ids.add(n.id))
        throw ArgumentError('Tree IDs must be unique: ${n.id}');
      parents[n.id] = parent;
      depths[n.id] = depth;
      if (shown) result.add(n);
      for (final c in n.children) {
        visit(c, n.id, depth + 1, shown && widget.expanded.contains(n.id));
      }
    }

    for (final n in widget.nodes) {
      visit(n, null, 0, true);
    }
    return result;
  }

  @override
  void dispose() {
    scroll.dispose();
    for (final n in focus.values) {
      n.dispose();
    }
    super.dispose();
  }

  void expand(String id, bool value) {
    final next = Set<String>.of(widget.expanded);
    value ? next.add(id) : next.remove(id);
    widget.onExpandedChanged(next);
  }

  void move(List<RosemaryTreeNode> nodes, int index) {
    if (nodes.isEmpty) return;
    index = index.clamp(0, nodes.length - 1);
    active = nodes[index].id;
    final height = 64 * MediaQuery.textScalerOf(context).scale(1);
    if (scroll.hasClients) {
      scroll.jumpTo((index * height).clamp(0, scroll.position.maxScrollExtent));
    }
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) focus[active]?.requestFocus();
    });
  }

  KeyEventResult keys(KeyEvent event, List<RosemaryTreeNode> nodes) {
    if (event is! KeyDownEvent || nodes.isEmpty) return KeyEventResult.ignored;
    final i = nodes
            .indexWhere((n) => n.id == active)
            .clamp(0, nodes.length - 1),
        n =
            nodes[nodes
                .indexWhere((n) => n.id == active)
                .clamp(0, nodes.length - 1)];
    final key = event.logicalKey;
    if (key == LogicalKeyboardKey.arrowDown)
      move(nodes, i + 1);
    else if (key == LogicalKeyboardKey.arrowUp)
      move(nodes, i - 1);
    else if (key == LogicalKeyboardKey.home)
      move(nodes, 0);
    else if (key == LogicalKeyboardKey.end)
      move(nodes, nodes.length - 1);
    else if (key == LogicalKeyboardKey.arrowRight) {
      if (n.children.isNotEmpty) {
        if (!widget.expanded.contains(n.id))
          expand(n.id, true);
        else
          move(nodes, i + 1);
      }
    } else if (key == LogicalKeyboardKey.arrowLeft) {
      if (widget.expanded.contains(n.id))
        expand(n.id, false);
      else if (parents[n.id] != null)
        move(nodes, nodes.indexWhere((v) => v.id == parents[n.id]));
    } else if (key == LogicalKeyboardKey.enter ||
        key == LogicalKeyboardKey.space)
      widget.onSelected(n.id);
    else if (event.character?.isNotEmpty == true &&
        !HardwareKeyboard.instance.isControlPressed &&
        !HardwareKeyboard.instance.isMetaPressed) {
      final now = DateTime.now();
      prefix = now.difference(typed).inMilliseconds > 700 ? '' : prefix;
      typed = now;
      prefix += event.character!.toLowerCase();
      final next = nodes.indexWhere(
        (v) => v.label.toLowerCase().startsWith(prefix),
      );
      if (next >= 0) move(nodes, next);
    } else {
      return KeyEventResult.ignored;
    }
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final nodes = visible();
    if (active != null && !nodes.any((n) => n.id == active)) {
      active = parents[active] ?? nodes.firstOrNull?.id;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) focus[active]?.requestFocus();
      });
    }
    return Focus(
      onKeyEvent: (_, e) => keys(e, nodes),
      child: SizedBox(
        height: widget.height,
        child: ListView.builder(
          controller: scroll,
          itemCount: nodes.length,
          itemExtent: 64 * MediaQuery.textScalerOf(context).scale(1),
          itemBuilder: (context, i) {
            final n = nodes[i], depth = depths[n.id] ?? 0;
            return Padding(
              padding: EdgeInsetsDirectional.only(
                start: (depth * 16).clamp(0, 80).toDouble(),
              ),
              child: Row(
                children: [
                  if (n.children.isNotEmpty)
                    Focus(
                      canRequestFocus: false,
                      onFocusChange: (v) {
                        if (v) active = n.id;
                      },
                      child: IconButton(
                        tooltip:
                            '${widget.expanded.contains(n.id) ? '收起' : '展开'} ${n.label}',
                        onPressed: () =>
                            expand(n.id, !widget.expanded.contains(n.id)),
                        icon: Icon(
                          widget.expanded.contains(n.id)
                              ? Icons.expand_less
                              : Icons.expand_more,
                        ),
                      ),
                    ),
                  Expanded(
                    child: Semantics(
                      selected: n.id == widget.selected,
                      expanded: n.children.isEmpty
                          ? null
                          : widget.expanded.contains(n.id),
                      child: TextButton(
                        focusNode: focus.putIfAbsent(n.id, () => FocusNode()),
                        onFocusChange: (focused) {
                          if (focused) active = n.id;
                        },
                        onPressed: () => widget.onSelected(n.id),
                        child: Text(
                          '${n.label} · 第 ${depth + 1} 级',
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}
