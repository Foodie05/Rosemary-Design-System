import 'package:flutter/material.dart';
import 'gallery.dart';
import 'package:rosemary_reference/rosemary.dart';

void main() => runApp(const RosemaryExample());

class RosemaryExample extends StatelessWidget {
  const RosemaryExample({super.key});
  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Rosemary SDK',
    theme: rosemaryThemeData(Brightness.light),
    darkTheme: rosemaryThemeData(Brightness.dark),
    home: const ProjectEditor(),
  );
}

class ProjectEditor extends StatefulWidget {
  const ProjectEditor({super.key});
  @override
  State<ProjectEditor> createState() => _ProjectEditorState();
}

class _ProjectEditorState extends State<ProjectEditor> {
  final name = TextEditingController(text: 'Rosemary Notes');
  final notes = TextEditingController();
  bool sync = true, consent = false, saving = false, failNext = true;
  double progress = 0;
  String category = 'personal', status = '更改保存在本地草稿中';
  String? error;
  int tab = 0;
  @override
  void dispose() {
    name.dispose();
    notes.dispose();
    super.dispose();
  }

  Future<void> save() async {
    if (saving) return;
    if (name.text.trim().isEmpty) {
      setState(() => error = '请输入项目名称');
      return;
    }
    setState(() {
      saving = true;
      error = null;
      progress = .5;
      status = '正在保存';
    });
    await Future<void>.delayed(const Duration(milliseconds: 600));
    if (!mounted) return;
    setState(() {
      saving = false;
      progress = failNext ? .5 : 1;
      status = failNext ? '保存失败，草稿已保留，请重试' : '已保存';
      failNext = false;
    });
  }

  Future<void> edit() async {
    final draft = TextEditingController(text: name.text);
    final result = await showRosemaryDialog(
      context,
      title: '修改项目名称',
      content: RosemaryTextField(label: '项目名称', controller: draft),
    );
    if (result == RosemaryDialogResult.confirm && mounted) {
      setState(() {
        name.text = draft.text;
        status = '名称已更新到草稿';
      });
    }
    // Let the route finish its exit transition before disposing its controller.
    await Future<void>.delayed(const Duration(milliseconds: 350));
    draft.dispose();
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text('Rosemary SDK · 本地预览'),
      actions: [
        IconButton(
          tooltip: '全部组件',
          icon: const Icon(Icons.widgets_outlined),
          onPressed: () => Navigator.of(context).push(
            MaterialPageRoute<void>(builder: (_) => const RosemaryGallery()),
          ),
        ),
        RosemaryIconButton(
          label: '修改名称',
          icon: Icons.edit_outlined,
          onPressed: saving ? null : edit,
        ),
      ],
    ),
    body: SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: RosemaryTabs(
          labels: const ['编辑', '状态'],
          value: tab,
          onChanged: (v) => setState(() => tab = v),
          panels: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                RosemaryTextField(
                  label: '项目名称',
                  controller: name,
                  enabled: !saving,
                  errorText: error,
                ),
                const SizedBox(height: 16),
                RosemaryTextArea(
                  label: '项目笔记',
                  controller: notes,
                  enabled: !saving,
                ),
                const SizedBox(height: 16),
                RosemarySelect<String>(
                  value: category,
                  label: '分类',
                  options: const [
                    RosemaryOption('personal', '个人'),
                    RosemaryOption('team', '团队'),
                    RosemaryOption('locked', '归档', enabled: false),
                  ],
                  onChanged: saving
                      ? null
                      : (v) => setState(() => category = v),
                ),
                RosemarySwitch(
                  label: '自动同步',
                  value: sync,
                  onChanged: saving ? null : (v) => setState(() => sync = v),
                ),
                RosemaryCheckbox(
                  label: '保存前通知我',
                  value: consent,
                  onChanged: saving
                      ? null
                      : (v) => setState(() => consent = v!),
                ),
                RosemarySlider(
                  label: '备份进度预览',
                  value: progress * 100,
                  onChanged: saving
                      ? null
                      : (v) => setState(() => progress = v / 100),
                ),
                RosemaryProgress(label: '保存进度', value: progress),
                const SizedBox(height: 16),
                RosemaryButton(
                  label: failNext ? '保存项目' : '重试保存',
                  loading: saving,
                  onPressed: save,
                ),
                const SizedBox(height: 16),
                Semantics(liveRegion: true, child: Text(status)),
              ],
            ),
            RosemaryEmptyState(
              title: '暂时没有记录',
              message: '保存后的项目会显示在这里。',
              action: RosemaryButton(
                label: '清空草稿',
                onPressed: saving
                    ? null
                    : () async {
                        final r = await showRosemaryAlertDialog(
                          context,
                          title: '清空草稿？',
                          message: '项目名称和笔记将被清空。',
                          confirmLabel: '清空草稿',
                        );
                        if (r == RosemaryDialogResult.confirm && mounted)
                          setState(() {
                            name.clear();
                            notes.clear();
                          });
                      },
              ),
            ),
          ],
        ),
      ),
    ),
  );
}
