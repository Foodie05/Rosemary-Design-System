(() => {
  const {sections,renderers,pageShell} = window.RosemaryPages;
  sections.components = [];
  renderers.components = () => pageShell(
    'components',
    '组件规范',
    '浏览 33 类基础组件的视觉样式、交互状态与开发接入说明。',
    window.RosemaryComponentView.shell(),
    ['33 类基础组件','多端状态完备','交互与无障碍规范']
  );
})();
