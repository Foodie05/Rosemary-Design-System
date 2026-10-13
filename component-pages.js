(() => {
  const {sections,renderers,pageShell} = window.RosemaryPages;
  sections.components = [];
  renderers.components = () => pageShell(
    'components',
    '组件规范',
    '选择一个控件，查看它的交互示例、状态和实现要求。预览默认显示；切换控件后，只保留当前控件的内容。',
    window.RosemaryComponentView.shell(),
    ['33 个控件均有可视化','独立预览','统一 Tab 动效']
  );
})();
