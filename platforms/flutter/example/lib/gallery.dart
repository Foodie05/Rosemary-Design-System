import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rosemary_reference/rosemary.dart';

const rosemaryGalleryIds = <String>[
  'button',
  'icon-button',
  'button-group',
  'split-button',
  'link-button',
  'floating-action-button',
  'text-field',
  'text-area',
  'password-field',
  'search-field',
  'number-field',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'select',
  'combo-box',
  'date-picker',
  'time-picker',
  'file-upload',
  'color-picker',
  'tabs',
  'segmented-control',
  'breadcrumb',
  'sidebar',
  'top-navigation',
  'bottom-navigation',
  'pagination',
  'stepper',
  'command-palette',
  'table',
  'data-grid',
  'list',
  'description-list',
  'tree-view',
  'badge',
  'tag',
  'avatar',
  'dialog',
  'alert-dialog',
  'sheet',
  'toast',
  'snackbar',
  'banner',
  'progress',
  'skeleton',
  'spinner',
  'tooltip',
  'popover',
  'dropdown-menu',
  'context-menu',
  'drawer',
  'card',
  'accordion',
  'divider',
  'empty-state',
  'scroll-area',
  'resizable-panels',
  'metric-card',
  'prober-status',
  'file-row',
];

/// Executable catalogue, one component at a time so focus/scroll testing has a stable scope.
class RosemaryGallery extends StatefulWidget {
  final String initialId;
  const RosemaryGallery({super.key, this.initialId = 'button'});
  @override
  State<RosemaryGallery> createState() => _GalleryState();
}

class _GalleryState extends State<RosemaryGallery> {
  late String id = widget.initialId;
  final text = TextEditingController(text: 'Rosemary Notes');
  final scroll = ScrollController();
  bool checked = false, expanded = false;
  double number = 50, ratio = .5;
  int index = 0;
  String selected = 'a', status = '等待操作';
  final toast = RosemaryToastController();
  List<RosemaryItem> files = [];
  bool picking = false;
  Future<void> pickFiles() async {
    if (picking) return;
    setState(() => picking = true);
    try {
      final result = await const MethodChannel(
        'design.rosemary/documents',
      ).invokeListMethod<dynamic>('choose');
      if (mounted)
        setState(
          () => files = [
            ...files,
            for (final f in result ?? [])
              RosemaryItem(f['id'] as String, f['name'] as String),
          ],
        );
    } on PlatformException catch (e) {
      if (mounted) setState(() => status = e.message ?? '文件选择失败');
    } finally {
      if (mounted) setState(() => picking = false);
    }
  }

  Set<String> selection = {}, treeOpen = {};
  DateTime date = DateTime(2026, 10, 10);
  TimeOfDay time = const TimeOfDay(hour: 9, minute: 30);
  List<RosemaryRecord> rows = [
    const RosemaryRecord('row-a', {'name': '项目 A', 'size': '184 KB'}),
    const RosemaryRecord('row-b', {'name': '项目 B', 'size': '92 KB'}),
  ];
  final items = const [
    RosemaryItem('a', '设计规范', detail: '本地文档'),
    RosemaryItem('b', '交互笔记', detail: '团队文档'),
    RosemaryItem('disabled', '归档', enabled: false),
  ];
  final options = const [
    RosemaryOption('a', '设计规范'),
    RosemaryOption('b', '交互笔记'),
    RosemaryOption('disabled', '归档', enabled: false),
  ];
  List<RosemaryAction> get actions => [
    RosemaryAction('save', '保存', () => setState(() => status = '已保存')),
    const RosemaryAction('disabled', '禁用操作', null),
    RosemaryAction('reset', '重置', () => setState(() => status = '已重置')),
  ];
  @override
  void dispose() {
    toast.dispose();
    text.dispose();
    scroll.dispose();
    super.dispose();
  }

  void choose(String value) => setState(() => selected = value);
  Widget sample(BuildContext context) {
    final cols = const [
      RosemaryColumn('name', '项目名称', editable: true),
      RosemaryColumn('size', '大小'),
    ];
    switch (id) {
      case 'button':
        return RosemaryButton(label: '保存', onPressed: actions.first.onInvoke);
      case 'icon-button':
        return RosemaryIconButton(
          label: '保存项目',
          icon: Icons.save_outlined,
          onPressed: actions.first.onInvoke,
        );
      case 'button-group':
        return RosemaryButtonGroup(actions: actions);
      case 'split-button':
        return RosemarySplitButton(primary: actions.first, actions: actions);
      case 'link-button':
        return RosemaryLinkButton(
          label: '打开本地详情',
          onNavigate: () => Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => Scaffold(
                appBar: AppBar(title: const Text('文档详情')),
                body: const Text('真实本地导航'),
              ),
            ),
          ),
        );
      case 'floating-action-button':
        return RosemaryFloatingActionButton(
          label: '新建',
          icon: Icons.add,
          onPressed: () => setState(() => status = '已创建本地项目'),
        );
      case 'text-field':
        return RosemaryTextField(label: '项目名称', controller: text);
      case 'text-area':
        return RosemaryTextArea(label: '项目笔记', controller: text);
      case 'password-field':
        return RosemaryPasswordField(label: '密码', controller: text);
      case 'search-field':
        return RosemarySearchField(
          label: '搜索',
          controller: text,
          onChanged: (q) => setState(() => status = '搜索：$q'),
        );
      case 'number-field':
        return RosemaryNumberField(
          label: '数量',
          value: number,
          onChanged: (v) => setState(() => number = v),
        );
      case 'checkbox':
        return RosemaryCheckbox(
          label: '通知我',
          value: checked,
          onChanged: (v) => setState(() => checked = v!),
        );
      case 'radio':
        return RosemaryRadio<String>(
          label: '分类',
          value: selected,
          options: options,
          onChanged: choose,
        );
      case 'switch':
        return RosemarySwitch(
          label: '自动同步',
          value: checked,
          onChanged: (v) => setState(() => checked = v),
        );
      case 'slider':
        return RosemarySlider(
          label: '强度',
          value: number,
          onChanged: (v) => setState(() => number = v),
        );
      case 'select':
        return RosemarySelect<String>(
          label: '分类',
          value: selected,
          options: options,
          onChanged: choose,
        );
      case 'combo-box':
        return RosemaryComboBox<String>(
          label: '搜索分类',
          value: selected,
          controller: text,
          options: options,
          onSelected: (v) {
            choose(v);
            text.text = options.firstWhere((o) => o.value == v).label;
          },
        );
      case 'date-picker':
        return RosemaryDatePicker(
          label: '日期',
          value: date,
          first: DateTime(2020),
          last: DateTime(2030),
          onChanged: (v) => setState(() => date = v),
        );
      case 'time-picker':
        return RosemaryTimePicker(
          label: '时间',
          value: time,
          onChanged: (v) => setState(() => time = v),
        );
      case 'file-upload':
        return RosemaryFileUpload(
          label: '项目文件',
          files: files,
          busy: picking,
          onChoose: pickFiles,
          onRemove: (id) =>
              setState(() => files = files.where((f) => f.id != id).toList()),
        );
      case 'color-picker':
        return RosemaryColorPicker(
          label: '品牌色',
          value: checked ? Colors.green : Colors.blue,
          colors: const {'松绿': Colors.green, '蓝色': Colors.blue},
          onChanged: (v) => setState(() => checked = v == Colors.green),
        );
      case 'tabs':
        return RosemaryTabs(
          labels: const ['编辑', '状态'],
          panels: [
            TextField(controller: text),
            Text(status),
          ],
          value: index % 2,
          onChanged: (v) => setState(() => index = v),
        );
      case 'segmented-control':
        return RosemarySegmentedControl(
          value: selected,
          options: options,
          onChanged: choose,
        );
      case 'breadcrumb':
        return RosemaryBreadcrumb(
          ancestors: [
            RosemaryAction('home', '组件预览', () => setState(() => id = 'button')),
          ],
          current: '项目详情',
        );
      case 'sidebar':
        return SizedBox(
          height: 300,
          child: RosemarySidebar(
            items: items,
            value: selected,
            onChanged: choose,
          ),
        );
      case 'top-navigation':
        return RosemaryTopNavigation(title: '项目', actions: actions);
      case 'bottom-navigation':
        return RosemaryBottomNavigation(
          items: items,
          value: index % 3,
          onChanged: (v) => setState(() => index = v),
        );
      case 'pagination':
        return RosemaryPagination(
          page: index % 3,
          count: 3,
          onChanged: (v) => setState(() => index = v),
        );
      case 'stepper':
        return RosemaryStepper(
          labels: const ['项目', '成员', '确认'],
          value: index % 3,
          onChanged: (v) => setState(() => index = v),
          content: TextField(controller: text),
        );
      case 'command-palette':
        return OutlinedButton(
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            isScrollControlled: true,
            builder: (_) => RosemaryCommandPalette(actions: actions),
          ),
          child: const Text('搜索命令'),
        );
      case 'table':
        return RosemaryTable(
          columns: cols,
          rows: rows,
          onSort: (col, asc) => setState(() => rows = rows.reversed.toList()),
        );
      case 'data-grid':
        return RosemaryDataGrid(
          columns: cols,
          rows: rows,
          selected: selection,
          onSelectionChanged: (v) => setState(() => selection = v),
          onCellCommit: (row, col, value) => setState(
            () => rows = rows
                .map(
                  (r) => r.id == row
                      ? RosemaryRecord(r.id, {...r.cells, col: value})
                      : r,
                )
                .toList(),
          ),
        );
      case 'list':
        return RosemaryList(
          items: items,
          selected: selected,
          onActivate: choose,
        );
      case 'description-list':
        return const RosemaryDescriptionList(
          values: {'项目': 'Rosemary', '版本': '本地预览'},
        );
      case 'tree-view':
        return RosemaryTreeView(
          nodes: const [
            RosemaryTreeNode(
              'root',
              '项目',
              children: [RosemaryTreeNode('child', '笔记')],
            ),
          ],
          expanded: treeOpen,
          selected: selected,
          onExpandedChanged: (v) => setState(() => treeOpen = v),
          onSelected: choose,
        );
      case 'badge':
        return const RosemaryBadge(label: 'Beta 待验收');
      case 'tag':
        return RosemaryTag(
          label: '团队',
          selected: checked,
          onChanged: (v) => setState(() => checked = v),
          onRemove: () => setState(() => status = '标签已移除'),
        );
      case 'avatar':
        return const RosemaryAvatar(label: 'Rosemary 团队', initials: 'RI');
      case 'dialog':
        return OutlinedButton(
          onPressed: () async {
            final r = await showRosemaryModal(
              context,
              title: '项目设置',
              content: TextField(controller: text),
              sessionId: 'gallery-${DateTime.now().microsecondsSinceEpoch}',
            );
            if (mounted) setState(() => status = r.name);
          },
          child: const Text('打开对话框'),
        );
      case 'alert-dialog':
        return OutlinedButton(
          onPressed: () => showRosemaryAlertDialog(
            context,
            title: '清空草稿？',
            message: '确认后清空。',
            confirmLabel: '清空',
          ),
          child: const Text('打开确认'),
        );
      case 'sheet':
        return OutlinedButton(
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            builder: (c) => RosemarySheet(
              title: '详情',
              onClose: () => Navigator.of(c).pop(),
              child: TextField(controller: text),
            ),
          ),
          child: const Text('打开详情'),
        );
      case 'toast':
        return RosemaryButton(
          label: '显示通知',
          onPressed: () => toast.show('草稿已保存'),
        );
      case 'snackbar':
        return RosemarySnackbar(
          message: '项目已移除',
          action: RosemaryAction(
            'undo',
            '撤销',
            () => setState(() => status = '已恢复'),
          ),
          onDismiss: () => setState(() => status = '通知已关闭'),
        );
      case 'banner':
        return RosemaryBanner(title: '离线', message: '草稿已保留。', actions: actions);
      case 'progress':
        return RosemaryProgress(label: '导出', value: number / 100);
      case 'skeleton':
        return const RosemarySkeleton();
      case 'spinner':
        return const RosemarySpinner();
      case 'tooltip':
        return const RosemaryTooltip(
          message: '保存当前草稿',
          child: Icon(Icons.save),
        );
      case 'popover':
        return RosemaryPopover(label: '项目详情', content: Text(status));
      case 'dropdown-menu':
        return RosemaryDropdownMenu(label: '操作', actions: actions);
      case 'context-menu':
        return RosemaryContextMenu(
          actions: actions,
          child: const Text('长按或右键查看操作'),
        );
      case 'drawer':
        return OutlinedButton(
          onPressed: () => showModalBottomSheet<void>(
            context: context,
            builder: (_) => RosemaryDrawer(
              title: '项目导航',
              items: items,
              value: selected,
              onChanged: choose,
            ),
          ),
          child: const Text('打开导航'),
        );
      case 'card':
        return const RosemaryCard(child: Text('项目说明'));
      case 'accordion':
        return RosemaryAccordion(
          label: '更多设置',
          expanded: expanded,
          onChanged: (v) => setState(() => expanded = v),
          child: TextField(controller: text),
        );
      case 'divider':
        return const Column(
          children: [Text('项目'), RosemaryDivider(), Text('成员')],
        );
      case 'empty-state':
        return RosemaryEmptyState(
          title: '暂无项目',
          message: '创建一个项目开始。',
          action: RosemaryButton(
            label: '新建',
            onPressed: actions.first.onInvoke,
          ),
        );
      case 'scroll-area':
        return SizedBox(
          height: 240,
          child: RosemaryScrollArea(
            controller: scroll,
            child: Column(
              children: [
                for (var i = 0; i < 30; i++) ListTile(title: Text('项目 $i')),
              ],
            ),
          ),
        );
      case 'resizable-panels':
        return RosemaryResizablePanels(
          fraction: ratio,
          onChanged: (v) => setState(() => ratio = v),
          leading: const Text('项目列表'),
          trailing: const Text('项目详情'),
        );
      case 'metric-card':
        return const RosemaryMetricCard(
          label: '项目数量',
          value: '24',
          detail: '比上周增加 3',
          series: [18, 19, 17, 22, 21, 24],
          trend: '一周增加 3 个项目',
        );
      case 'prober-status':
        return RosemaryProberStatus(
          label: '同步服务',
          state: '离线 · 草稿已保留',
          health: RosemaryHealth.offline,
          checkedAt: DateTime(2026, 10, 10, 12),
          recovery: actions.first,
        );
      case 'file-row':
        return RosemaryFileRow(
          file: items.first,
          metadata: const RosemaryFileMetadata(
            kind: "文档",
            size: "184 KB",
            sync: "已同步",
          ),
          onOpen: () => Navigator.of(context).push(
            MaterialPageRoute<void>(
              builder: (_) => const Scaffold(
                body: SafeArea(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: Text("设计规范 · 文件详情"),
                  ),
                ),
              ),
            ),
          ),
          selected: checked,
          onSelected: (v) => setState(() => checked = v),
          actions: actions,
        );
      default:
        throw StateError('Missing gallery implementation: $id');
    }
  }

  @override
  Widget build(BuildContext context) => RosemaryToastHost(
    controller: toast,
    child: Scaffold(
      appBar: AppBar(title: Text('组件预览 · $id')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            RosemarySelect(
              value: id,
              label: '组件',
              options: [
                for (final id in rosemaryGalleryIds) RosemaryOption(id, id),
              ],
              onChanged: (v) => setState(() {
                id = v;
                index = 0;
              }),
            ),
            const SizedBox(height: 24),
            sample(context),
            const SizedBox(height: 24),
            Semantics(liveRegion: true, child: Text(status)),
          ],
        ),
      ),
    ),
  );
}
