import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rosemary_ui/rosemary_ui.dart';
import 'main.dart' show paletteFromJson;

const componentIds = [
  'button',
  'link',
  'iconButton',
  'input',
  'textarea',
  'select',
  'search',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'date',
  'upload',
  'tabs',
  'breadcrumb',
  'pagination',
  'menu',
  'tooltip',
  'popover',
  'dialog',
  'drawer',
  'toast',
  'alert',
  'card',
  'list',
  'table',
  'badge',
  'avatar',
  'empty',
  'skeleton',
  'loading',
  'progress',
  'stepper',
];

RosemaryColors rosemaryGalleryHighContrast(RosemaryColors colors) =>
    colors.copyWith(border: colors.ink, control: colors.ink, focus: colors.ink);

class RosemaryGallery extends StatefulWidget {
  final Map<String, dynamic>? vigilo;
  final String initialComponent;
  const RosemaryGallery({
    super.key,
    this.vigilo,
    this.initialComponent = const String.fromEnvironment(
      'ROSEMARY_COMPONENT',
      defaultValue: 'button',
    ),
  });
  @override
  State<RosemaryGallery> createState() => _GalleryState();
}

class _GalleryState extends State<RosemaryGallery> {
  late String selected;
  bool dark = false,
      custom = false,
      rtl = false,
      reduced = false,
      chinese = false,
      highContrast = false;
  @override
  void initState() {
    super.initState();
    selected = widget.initialComponent;
  }

  @override
  Widget build(BuildContext context) => RosemaryTheme(
    mode: dark ? RosemaryThemeMode.dark : RosemaryThemeMode.light,
    locale: Locale(chinese ? 'zh' : 'en'),
    direction: rtl ? TextDirection.rtl : TextDirection.ltr,
    reduceMotion: reduced,
    child: MediaQuery(
      data: MediaQuery.of(context).copyWith(
        highContrast: highContrast || MediaQuery.highContrastOf(context),
      ),
      child: Builder(
        builder: (context) => RosemaryTheme(
          highContrastColors: rosemaryGalleryHighContrast(
            custom && widget.vigilo != null
                ? paletteFromJson(
                    widget.vigilo![dark ? 'dark' : 'light']
                        as Map<String, dynamic>,
                  )
                : (dark ? RosemaryTokens.dark : RosemaryTokens.light),
          ),
          colors: custom && widget.vigilo != null
              ? paletteFromJson(
                  widget.vigilo![dark ? 'dark' : 'light']
                      as Map<String, dynamic>,
                )
              : null,
          child: Builder(
            builder: (context) => AnnotatedRegion<SystemUiOverlayStyle>(
              value:
                  (dark
                          ? SystemUiOverlayStyle.light
                          : SystemUiOverlayStyle.dark)
                      .copyWith(
                        statusBarColor: Colors.transparent,
                        systemNavigationBarColor: RosemaryThemeData.of(
                          context,
                        ).canvas,
                      ),
              child: Scaffold(
                backgroundColor: RosemaryThemeData.of(context).canvas,
                body: SafeArea(
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        const RosemaryText(
                          'Rosemary · Flutter SDK 0.4.0',
                          role: 'heading',
                        ),
                        Wrap(
                          spacing: 12,
                          children: [
                            RosemarySwitch(
                              value: chinese,
                              onChanged: (v) => setState(() => chinese = v),
                              label: '中文',
                            ),
                            RosemarySwitch(
                              value: dark,
                              onChanged: (v) => setState(() => dark = v),
                              label: 'Dark',
                            ),
                            RosemarySwitch(
                              value: custom,
                              onChanged: widget.vigilo == null
                                  ? (_) {}
                                  : (v) => setState(() => custom = v),
                              label: 'Vigilo',
                              enabled: widget.vigilo != null,
                            ),
                            RosemarySwitch(
                              value: rtl,
                              onChanged: (v) => setState(() => rtl = v),
                              label: 'RTL',
                            ),
                            RosemarySwitch(
                              value: reduced,
                              onChanged: (v) => setState(() => reduced = v),
                              label: 'Reduce motion',
                            ),
                            RosemarySwitch(
                              value: highContrast,
                              onChanged: (v) =>
                                  setState(() => highContrast = v),
                              label: 'High contrast',
                            ),
                          ],
                        ),
                        RosemarySelect(
                          key: const ValueKey('gallery-selector'),
                          value: selected,
                          onChanged: (v) => setState(() => selected = v),
                          options: [
                            for (final id in componentIds)
                              RosemaryOption(id, id),
                          ],
                          label: 'Component',
                        ),
                        const SizedBox(height: 20),
                        Demo(key: ValueKey(selected), id: selected),
                        const SizedBox(height: 24),
                        const RosemaryText(
                          'Installed rosemary_ui consumer · local state only',
                          role: 'caption',
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

class Demo extends StatefulWidget {
  final String id;
  const Demo({super.key, required this.id});
  @override
  State<Demo> createState() => _DemoState();
}

class _DemoState extends State<Demo> {
  String text = '', option = 'a';
  bool checked = false, open = false;
  double progress = 35;
  int page = 1;
  RosemaryLocalDate date = RosemaryLocalDate(2026, 10, 13);
  RosemaryLocalTime time = RosemaryLocalTime(13, 25);
  List<RosemaryFile> files = [];
  bool toast = true;
  RosemaryLoadingState loading = RosemaryLoadingState.running;
  RosemaryProgressState progressState = RosemaryProgressState.running;
  final options = [
    const RosemaryOption('a', 'Overview'),
    const RosemaryOption('b', 'Activity'),
    const RosemaryOption('c', 'Unavailable', enabled: false),
  ];
  @override
  Widget build(BuildContext context) {
    void update(VoidCallback change) => setState(change);
    return switch (widget.id) {
      'button' => Wrap(
        spacing: 8,
        runSpacing: 8,
        children: [
          RosemaryButton(
            label: 'Save changes',
            onPressed: () => update(() => text = 'Saved'),
          ),
          RosemaryButton(
            label: 'Secondary',
            onPressed: () {},
            variant: RosemaryButtonVariant.secondary,
          ),
          RosemaryButton(
            label: 'Delete',
            onPressed: () {},
            variant: RosemaryButtonVariant.danger,
          ),
          RosemaryButton(label: 'Saving', onPressed: () {}, busy: true),
          RosemaryText(text),
        ],
      ),
      'link' => RosemaryLink(
        label: 'Read design guide',
        onNavigate: () => update(() => text = 'Guide opened'),
      ),
      'iconButton' => RosemaryIconButton(
        label: 'Favorite',
        icon: const RosemaryIcon('heart'),
        pressed: checked,
        onPressed: () => update(() => checked = !checked),
      ),
      'input' => RosemaryInput(
        value: text,
        onChanged: (v) => update(() => text = v),
        label: 'Project name',
        error: text.isEmpty ? 'Enter a name' : null,
      ),
      'textarea' => RosemaryTextarea(
        value: text,
        onChanged: (v) => update(() => text = v),
        label: 'Description',
      ),
      'select' => RosemarySelect(
        value: option,
        onChanged: (v) => update(() => option = v),
        options: options,
        label: 'Section',
      ),
      'search' => Column(
        children: [
          RosemarySearch(
            query: text,
            onQueryChanged: (v) => update(() => text = v),
            onSubmit: () => update(() => option = text),
            label: 'Search projects',
          ),
          RosemaryText('Query submitted: $option'),
        ],
      ),
      'checkbox' => RosemaryCheckbox(
        value: checked,
        onChanged: (v) => update(() => checked = v),
        label: 'Include archived',
      ),
      'radio' => RosemaryRadio(
        value: option,
        onChanged: (v) => update(() => option = v),
        label: 'Section',
        options: options,
      ),
      'switch' => RosemarySwitch(
        value: checked,
        onChanged: (v) => update(() => checked = v),
        label: 'Private project',
      ),
      'slider' => RosemarySlider(
        value: progress,
        onChanged: (v) => update(() => progress = v),
        label: 'Volume',
      ),
      'date' => RosemaryDate(
        value: date,
        onChanged: (v) => update(() => date = v),
        time: time,
        onTimeChanged: (v) => update(() => time = v),
        mode: RosemaryDateMode.dateTime,
        label: 'Appointment',
      ),
      'upload' => RosemaryUpload(
        label: 'Documents',
        files: files,
        onFilesSelected: (chosen) => update(
          () => files = [
            ...files,
            ...chosen.map(
              (file) => RosemaryFile(
                id: file.path,
                name: file.name,
                status: 'Selected locally',
              ),
            ),
          ],
        ),
        onRemoved: (id) =>
            update(() => files = files.where((file) => file.id != id).toList()),
        onRetry: (id) => update(() => text = 'Retry requested for $id'),
        onCancel: (id) => update(() => text = 'Cancelled $id'),
      ),
      'tabs' => RosemaryTabs(
        value: option,
        onChanged: (v) => update(() => option = v),
        options: options,
        panelBuilder: (id) => RosemaryText('Selected section: $id'),
      ),
      'breadcrumb' => RosemaryBreadcrumb(
        items: const [
          RosemaryOption('home', 'Home'),
          RosemaryOption('projects', 'Projects'),
          RosemaryOption('current', 'Rosemary'),
        ],
        onNavigate: (id) => update(() => text = id),
      ),
      'pagination' => RosemaryPagination(
        page: page,
        count: 12,
        onChanged: (v) => update(() => page = v),
      ),
      'menu' => RosemaryMenu(
        open: open,
        onOpenChanged: (v) => update(() => open = v),
        trigger: RosemaryButton(
          label: 'Actions',
          onPressed: () => update(() => open = !open),
        ),
        items: const [
          RosemaryOption('edit', 'Edit'),
          RosemaryOption('duplicate', 'Duplicate'),
        ],
        onActivate: (id) => update(() => text = id),
      ),
      'tooltip' => RosemaryTooltip(
        message: 'Visible to collaborators',
        child: RosemaryButton(label: 'Collaborators', onPressed: () {}),
      ),
      'popover' => RosemaryPopover(
        open: open,
        onDismiss: (_) => update(() => open = false),
        trigger: RosemaryButton(
          label: 'Filter',
          onPressed: () => update(() => open = !open),
        ),
        child: Column(
          children: [
            RosemaryCheckbox(
              value: checked,
              onChanged: (v) => update(() => checked = v),
              label: 'Only my projects',
            ),
            RosemaryButton(
              label: 'Close',
              onPressed: () => update(() => open = false),
            ),
          ],
        ),
      ),
      'dialog' => Column(
        children: [
          RosemaryButton(
            label: 'Open dialog',
            onPressed: () => update(() => open = true),
          ),
          RosemaryDialog(
            open: open,
            title: 'Create project',
            onDismiss: (_) => update(() => open = false),
            child: Column(
              children: [
                RosemaryInput(
                  value: text,
                  onChanged: (v) => update(() => text = v),
                  label: 'Project name',
                ),
                Wrap(
                  children: [
                    RosemaryButton(
                      label: 'Cancel',
                      onPressed: () => update(() => open = false),
                      variant: RosemaryButtonVariant.secondary,
                    ),
                    RosemaryButton(
                      label: 'Create',
                      onPressed: text.isEmpty
                          ? null
                          : () => update(() => open = false),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
      'drawer' => Column(
        children: [
          RosemaryButton(
            label: 'Open drawer',
            onPressed: () => update(() => open = true),
          ),
          RosemaryDrawer(
            open: open,
            title: 'Project settings',
            onDismiss: (_) => update(() => open = false),
            child: Column(
              children: [
                RosemaryInput(
                  value: text,
                  onChanged: (v) => update(() => text = v),
                  label: 'Project name',
                ),
                RosemarySwitch(
                  value: checked,
                  onChanged: (v) => update(() => checked = v),
                  label: 'Private',
                ),
                RosemaryButton(
                  label: 'Close',
                  onPressed: () => update(() => open = false),
                ),
              ],
            ),
          ),
        ],
      ),
      'toast' => Column(
        children: [
          RosemaryButton(
            label: 'Show toast',
            onPressed: () => update(() => toast = true),
          ),
          if (toast)
            RosemaryToast(
              message: 'Project saved',
              onDismiss: () => update(() => toast = false),
              actionLabel: 'Undo',
              onAction: () => update(() => toast = false),
            ),
        ],
      ),
      'alert' => Column(
        children: [
          for (final tone in RosemaryTone.values)
            RosemaryAlert(
              '${tone.name}: changes stay in this example',
              tone: tone,
            ),
        ],
      ),
      'card' => RosemaryCard(
        selected: checked,
        onActivate: () => update(() => checked = !checked),
        child: const Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            RosemaryText('A useful project card', role: 'lead'),
            RosemaryText('Select this card to change its state.'),
          ],
        ),
      ),
      'list' => RosemaryList(
        items: const [
          RosemaryListItem('a', 'Rosemary', description: 'Design system'),
          RosemaryListItem('b', 'Studio', description: 'Brand assets'),
        ],
        selected: checked ? {'a'} : {},
        onSelectionChanged: (ids) => update(() => checked = ids.contains('a')),
      ),
      'table' => RosemaryTable(
        label: 'Projects',
        columns: const [
          RosemaryTableColumn('name', 'Name', sortable: true),
          RosemaryTableColumn('status', 'Status'),
        ],
        rows: const [
          RosemaryTableRow('a', ['Rosemary', 'Active']),
          RosemaryTableRow('b', ['Studio', 'Draft']),
        ],
        sortColumn: 'name',
        ascending: checked,
        onSortChanged: (id, v) => update(() => checked = v),
      ),
      'badge' => const Wrap(
        spacing: 8,
        children: [
          RosemaryBadge('Draft'),
          RosemaryBadge('Active', tone: RosemaryTone.success),
          RosemaryBadge('3 errors', tone: RosemaryTone.danger),
        ],
      ),
      'avatar' => const Wrap(
        spacing: 8,
        children: [
          RosemaryAvatar(label: 'Ada Lovelace'),
          RosemaryAvatar(label: 'Lin Chen', size: 32),
        ],
      ),
      'empty' => RosemaryEmpty(
        title: 'No projects yet',
        description: 'Create a project to start organizing your work.',
        action: RosemaryButton(
          label: 'Create project',
          onPressed: () => update(() => text = 'Created'),
        ),
      ),
      'skeleton' => const Column(
        children: [
          RosemarySkeleton(width: 180),
          SizedBox(height: 12),
          RosemarySkeleton(width: 280),
          SizedBox(height: 12),
          RosemarySkeleton(width: 240),
        ],
      ),
      'loading' => Column(
        children: [
          RosemaryLoading(
            label: 'Importing documents',
            state: loading,
            onCancel: () =>
                update(() => loading = RosemaryLoadingState.cancelled),
          ),
          RosemaryButton(
            label: 'Restart',
            onPressed: () =>
                update(() => loading = RosemaryLoadingState.running),
            variant: RosemaryButtonVariant.text,
          ),
        ],
      ),
      'progress' => Column(
        children: [
          RosemaryProgress(
            value: progress,
            label: 'Uploading',
            state: progressState,
            onCancel: () =>
                update(() => progressState = RosemaryProgressState.cancelled),
            onRetry: () =>
                update(() => progressState = RosemaryProgressState.running),
          ),
          RosemarySlider(
            value: progress,
            onChanged: (v) => update(() => progress = v),
            label: 'Actual progress',
          ),
          RosemaryProgress(
            value: null,
            label: 'Connecting',
            state: progressState,
          ),
        ],
      ),
      'stepper' => RosemaryStepper(
        steps: const [
          RosemaryStep('a', 'Details'),
          RosemaryStep('b', 'Review'),
          RosemaryStep(
            'c',
            'Complete',
            state: RosemaryStepState.unavailable,
            enabled: false,
          ),
        ],
        value: option,
        onChanged: (v) => update(() => option = v),
      ),
      _ => throw ArgumentError.value(widget.id, 'component'),
    };
  }
}
