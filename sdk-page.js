(() => {
  const {section,table,note,list,code,icon} = window.RosemaryUI;
  const {pages,sections,renderers,pageShell,jump} = window.RosemaryPages;
  const repo = 'https://github.com/Foodie05/Rosemary-Design-System';
  const source = path => `${repo}/blob/v0.5.0/${path}`;
  const asset = name => `${repo}/releases/download/v0.5.0/${name}`;
  const downloads = {
    React: [['Tokens 包','rosemary-ui-tokens-0.5.0.tgz'],['Icons 包','rosemary-ui-icons-0.5.0.tgz'],['React 包','rosemary-ui-react-0.5.0.tgz']],
    'Android Compose': [['Maven 仓库','rosemary-compose-0.5.0-maven.zip'],['AAR','rosemary-compose-0.5.0.aar'],['源码 JAR','rosemary-compose-0.5.0-sources.jar'],['样例 APK','rosemary-compose-sample-0.5.0.apk']],
    SwiftUI: [['SDK 源码','RosemaryUI-0.5.0-source.tar.gz'],['模拟器样例','RosemarySample-0.5.0-simulator.zip']],
    Flutter: [['SDK 源码','rosemary-ui-0.5.0-source.tar.gz'], ...[['Android','android.apk'],['Web','web.zip'],['macOS','macos.zip'],['iOS 模拟器','ios-simulator.zip'],['Windows','windows.zip'],['Linux','linux.tar.gz']].map(([label,name]) => [label,`rosemary-flutter-0.5.0-${name}`])]
  };
  const external = (url,label) => `<a class="text-link" href="${url}">${label}${icon('arrow')}</a>`;
  pages.splice(pages.findIndex(p=>p.id==='governance'),0,{id:'sdk',title:'SDK 接入',icon:'book',group:'实施与验证',description:'React、Compose、SwiftUI 与 Flutter 的安装、主题、API 和验收边界。',keywords:'SDK 安装 React Android Compose SwiftUI iOS Flutter 0.5.0 API MIT 发布 迁移'});
  sections.sdk = [jump('versions','版本与范围'),jump('install','安装入口'),jump('theme','主题与偏好'),jump('state','状态与数据'),jump('verification','验收与许可')];
  const implementations = [
    ['React','React 18.3.1 / 19.2.8','三个 tgz：tokens、icons、react','npm install ./rosemary-ui-tokens-0.5.0.tgz ./rosemary-ui-icons-0.5.0.tgz ./rosemary-ui-react-0.5.0.tgz',
      "import { RosemaryProvider, Button } from '@rosemary-ui/react';\nimport '@rosemary-ui/react/css';\n<RosemaryProvider mode=\"system\" language=\"zh\"\n  onDiagnostics={reportContrast}>\n  <Button onClick={saveRecord}>保存</Button>\n</RosemaryProvider>",'packages/react/README.md'],
    ['Android Compose','Android API 26；JDK 17','本地 Maven ZIP；consumer compileSDK 36','// 解压同版 Maven ZIP 后加入本地仓库\nmaven { url = uri("../vendor/rosemary-maven") }\nimplementation("design.rosemary:rosemary-compose:0.5.0")',
      'RosemaryTheme(mode = RosemaryThemeMode.System,\n  language = RosemaryLanguage.Chinese,\n  onContrastDiagnostics = { reportContrast(it) }) {\n  RosemaryInput(name, { name = it }, label = "名称")\n}','platforms/android/API.md'],
    ['SwiftUI','iOS 17；Swift tools 5.9 / Swift 5 模式','根 Package.swift；RosemaryUI product/module','.package(url: "https://github.com/Foodie05/Rosemary-Design-System.git",\n  exact: "0.5.0")',
      'import RosemaryUI\nRosemaryInput("名称", text: $name)\n  .rosemaryTheme(.system)\n  .environment(\\.locale, Locale(identifier: "zh-Hans"))','platforms/swiftui/README.md'],
    ['Flutter','Flutter 3.44.8 / Dart 3.12.2','源码 / Git 子目录；六目标验收分别记录','dependencies:\n  rosemary_ui:\n    git:\n      url: https://github.com/Foodie05/Rosemary-Design-System.git\n      ref: v0.5.0\n      path: platforms/flutter/rosemary_ui',
      "import 'package:rosemary_ui/rosemary_ui.dart';\nRosemaryTheme(mode: RosemaryThemeMode.system,\n  locale: const Locale('zh'),\n  onContrastDiagnostics: reportContrast,\n  child: RosemaryButton(label: '保存', onPressed: saveRecord),\n)",'platforms/flutter/API.md']
  ];
  renderers.sdk = () => pageShell('sdk','把 Rosemary 接入产品','选择对应平台的固定版本包，用公开 API 传入应用自身的主题、状态与请求。',
    section('versions','规范 1.3.0 · SDK 0.5.0',`<div class="sdk-version-pair"><div><span class="type-caption">设计规范</span><h3>Forma 1.3.0</h3><p>包含品牌、45 个颜色角色、74 枚图标与组件契约。</p></div><div><span class="type-caption">组件代码</span><h3>SDK 0.5.0</h3><p>四种端实现共用 33 个基础组件 ID。</p></div></div>`+note('当前稳定发布版：SDK 0.5.0','请以 GitHub Release <code>v0.5.0</code> 的产物与 SHA256 为准，通过固定版本的 Git 或本地包接入（不发布到 npm / Maven / pub.dev）。')+`<div class="sdk-links">${external(`${repo}/releases/tag/v0.5.0`,'0.5.0 Release')}${external(`${repo}/actions`,'查看 CI')}${external(`${repo}/blob/main/docs/sdk/0.5.0-migration.md`,'0.5.0 迁移')+external(`${repo}/blob/main/docs/standards/forma-1.3.md`,'Forma 1.3 标准')}</div>`)+
    section('install','安装已发布版 0.5.0',`<p>从 GitHub Release 下载对应平台产物并校验 SHA256；SDK 大体积产物不包含在门户离线包中。</p><div class="sdk-platform-grid">${implementations.map(([title,min,entry,install,example,api])=>`<article class="sdk-platform"><h3>${title}</h3><p class="sdk-requirement">${min}</p><p>${entry}</p>${code(install)}${code(example)}${external(source(api),'公开 API 与状态说明')}<div class="sdk-links">${downloads[title].map(([label,name]) => external(asset(name),label)).join('')}</div></article>`).join('')}</div><p class="field-help">SwiftUI 可通过本地 path 直接依赖根包；模拟器 zip 为未签名的 .app，不可用于真机。Flutter 六目标构建与代表性交互证据分别记录；构建不代表最低系统或人工读屏验收。</p>`)+
    section('theme','主题继承与系统偏好（0.5.0）',table(['配置项','约定'],[
      ['浅 / 深 / 系统','根组件支持显式指定 light / dark / system，未指定时自动继承父级主题。'],
      ['45 个颜色角色','0.5.0 完整覆盖新版 45 色与浅/深双模式；0.4.2 沿用旧版 24 色结构。'],
      ['对比度诊断','0.5.0 会检查每套模式下的 56 组前景/背景对比度并返回诊断，不静默篡改颜色。'],
      ['多语言与 RTL','内置状态文案支持覆盖，业务文案由应用提供；布局采用逻辑方向，品牌折面不镜像。'],
      ['减少动态与高对比','自动响应系统偏好；React 支持系统强制颜色模式，原生端按对应平台信号处理。']
    ])+code("// React 局部继承\n<RosemaryProvider mode=\"system\" language=\"en\" direction=\"rtl\"\n  reducedMotion={requestReducedMotion}>\n  <RosemaryProvider colors={{primary: '#24675E', onPrimary: '#FFFFFF'}}\n    onDiagnostics={reportContrast}>\n    <Button onClick={saveRecord}>Save</Button>\n  </RosemaryProvider>\n</RosemaryProvider>")+`<p>完整多端主题与诊断示例见 ${external(source('docs/sdk/getting-started.md'),'接入指南')}，24 色 JSON 示例见 ${external(source('design/themes/vigilo.json'),'Vigilo 主题')}。</p>`)+
    section('state','状态托管与数据边界',list(['33 个基础组件覆盖输入、选择、导航、浮层、展示与反馈，具体参数与泛型请核对各端 API 文档。','组件库不持有业务数据：加载、空状态、错误与请求重试均由宿主应用状态驱动。','日期统一使用本地公历（YYYY-MM-DD）与时间（HH:mm），取消时丢弃未提交草稿。','文件选择调用系统能力，上传进度与失败重试由应用管理；未知进度不伪造百分比。','模态弹窗严格管理关闭原因与焦点归还，普通提示不阻塞用户操作。'])+`<p class="sdk-component-ids">button / link / iconButton / input / textarea / select / search / checkbox / radio / switch / slider / date / upload / tabs / breadcrumb / pagination / menu / tooltip / popover / dialog / drawer / toast / alert / card / list / table / badge / avatar / empty / skeleton / loading / progress / stepper</p>`)+
    section('verification','测试证据与许可说明',note('以实际测试证据为准','Release 记录了源码 commit、CI 运行与 SHA256。编译通过或自动测试不等于真机与人工读屏（VoiceOver / NVDA / TalkBack）验证，上线前请核对对应端记录。')+`<div class="sdk-links">${external(source('docs/sdk/release-checklist.md'),'发布验收清单')}${external(source('docs/sdk/implementation-status.md'),'实施状态')}${external(source('platforms/swiftui/VERIFICATION.md'),'SwiftUI 证据')}</div><p>SDK 代码、文档、Token 与功能图标采用 MIT 许可；Rosemary 名称与官方 Logo 另受品牌资产规则约束。${external(source('LICENSE'),'MIT License')} · ${external(source('BRAND-ASSETS.md'),'品牌资产规则')}</p>`),['33 个基础组件','四种实现','版本固定 0.5.0']);
})();
