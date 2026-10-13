(() => {
  const {section,table,note,list,code,icon} = window.RosemaryUI;
  const {pages,sections,renderers,pageShell,jump} = window.RosemaryPages;
  const repo = 'https://github.com/Foodie05/Rosemary-Design-System';
  const source = path => `${repo}/blob/v0.4.0/${path}`;
  const asset = name => `${repo}/releases/download/v0.4.0/${name}`;
  const downloads = {
    React: [['Tokens 包','rosemary-ui-tokens-0.4.0.tgz'],['Icons 包','rosemary-ui-icons-0.4.0.tgz'],['React 包','rosemary-ui-react-0.4.0.tgz']],
    'Android Compose': [['Maven 仓库','rosemary-compose-0.4.0-maven.zip'],['AAR','rosemary-compose-0.4.0.aar'],['源码 JAR','rosemary-compose-0.4.0-sources.jar'],['样例 APK','rosemary-compose-sample-0.4.0.apk']],
    SwiftUI: [['SDK 源码','RosemaryUI-0.4.0-source.tar.gz'],['模拟器样例','RosemarySample-0.4.0-simulator.zip']],
    Flutter: [['SDK 源码','rosemary-ui-0.4.0-source.tar.gz'], ...[['Android','android.apk'],['Web','web.zip'],['macOS','macos.zip'],['iOS 模拟器','ios-simulator.zip'],['Windows','windows.zip'],['Linux','linux.tar.gz']].map(([label,name]) => [label,`rosemary-flutter-0.4.0-${name}`])]
  };
  const external = (url,label) => `<a class="text-link" href="${url}">${label}${icon('arrow')}</a>`;
  pages.splice(pages.findIndex(p=>p.id==='governance'),0,{id:'sdk',title:'SDK 接入',icon:'book',group:'实施与验证',description:'React、Compose、SwiftUI 与 Flutter 的安装、主题、API 和验收边界。',keywords:'SDK 安装 React Android Compose SwiftUI iOS Flutter 0.4.0 API MIT 发布 迁移'});
  sections.sdk = [jump('versions','版本与范围'),jump('install','安装入口'),jump('theme','主题与偏好'),jump('state','状态与数据'),jump('verification','验收与许可')];
  const implementations = [
    ['React','React 18.3.1 / 19.2.8','三个 tgz：tokens、icons、react','npm install ./rosemary-ui-tokens-0.4.0.tgz ./rosemary-ui-icons-0.4.0.tgz ./rosemary-ui-react-0.4.0.tgz',
      "import { RosemaryProvider, Button } from '@rosemary-ui/react';\nimport '@rosemary-ui/react/css';\n<RosemaryProvider mode=\"system\" language=\"zh\"\n  onDiagnostics={reportContrast}>\n  <Button onClick={saveRecord}>保存</Button>\n</RosemaryProvider>",'packages/react/README.md'],
    ['Android Compose','Android API 26；JDK 17','本地 Maven ZIP；consumer compileSDK 36','// 解压同版 Maven ZIP 后加入本地仓库\nmaven { url = uri("../vendor/rosemary-maven") }\nimplementation("design.rosemary:rosemary-compose:0.4.0")',
      'RosemaryTheme(mode = RosemaryThemeMode.System,\n  language = RosemaryLanguage.Chinese,\n  onContrastDiagnostics = { reportContrast(it) }) {\n  RosemaryInput(name, { name = it }, label = "名称")\n}','platforms/android/API.md'],
    ['SwiftUI','iOS 17；Swift tools 5.9 / Swift 5 模式','根 Package.swift；RosemaryUI product/module','.package(url: "https://github.com/Foodie05/Rosemary-Design-System.git",\n  exact: "0.4.0")',
      'import RosemaryUI\nRosemaryInput("名称", text: $name)\n  .rosemaryTheme(.system)\n  .environment(\\.locale, Locale(identifier: "zh-Hans"))','platforms/swiftui/README.md'],
    ['Flutter','Flutter 3.44.8 / Dart 3.12.2','源码 / Git 子目录；六目标验收分别记录','dependencies:\n  rosemary_ui:\n    git:\n      url: https://github.com/Foodie05/Rosemary-Design-System.git\n      ref: v0.4.0\n      path: platforms/flutter/rosemary_ui',
      "import 'package:rosemary_ui/rosemary_ui.dart';\nRosemaryTheme(mode: RosemaryThemeMode.system,\n  locale: const Locale('zh'),\n  onContrastDiagnostics: reportContrast,\n  child: RosemaryButton(label: '保存', onPressed: saveRecord),\n)",'platforms/flutter/API.md']
  ];
  renderers.sdk = () => pageShell('sdk','把 Rosemary 接入产品','从同版产物开始，用公开 API 连接应用自己的值、草稿与请求。设计规范和代码版本分别维护；实际支持范围以消费者测试与发布记录为准。',
    section('versions','规范 1.2.0 · SDK 0.4.0',`<div class="sdk-version-pair"><div><span class="type-caption">设计规范</span><h3>Forma 1.2.0</h3><p>品牌、24 个颜色角色、71 枚图标和组件契约。</p></div><div><span class="type-caption">组件代码</span><h3>SDK 0.4.0</h3><p>四种实现，共用当前 33 个基础组件 ID。</p></div></div>`+note('0.4.0 安装','以 <code>v0.4.0</code> GitHub Release 的实际资产及 SHA256 为准。SDK 通过版本固定的 Git / 本地包消费，不发布到 npm、Maven Central 或 pub.dev。')+`<div class="sdk-links">${external(`${repo}/releases/tag/v0.4.0`,'0.4.0 Release')}${external(`${repo}/actions`,'查看 CI')}${external(source('docs/sdk/migration.md'),'迁移说明')}</div>`)+
    section('install','选择目标实现',`<p>先从 GitHub Release 下载同版资产并核对 SHA256，安装目标固定为 0.4.0。SDK 大产物不包含在门户离线包中。</p><div class="sdk-platform-grid">${implementations.map(([title,min,entry,install,example,api])=>`<article class="sdk-platform"><h3>${title}</h3><p class="sdk-requirement">${min}</p><p>${entry}</p>${code(install)}${code(example)}${external(source(api),'公开 API 与状态说明')}<div class="sdk-links">${downloads[title].map(([label,name]) => external(asset(name),label)).join('')}</div></article>`).join('')}</div><p class="field-help">SwiftUI 源码包也可通过本地 path 消费根包；模拟器 zip 是 unsigned .app，不是真机 IPA。Flutter consumer Android 26、iOS 17、macOS 12；Windows/Linux 的运行下限不能从编译结果推断。</p>`)+
    section('theme','继承主题，响应用户偏好',table(['设置','接入约定'],[
      ['浅 / 深 / 系统','显式 light / dark / system 选择根主题；局部未显式指定 mode 时继承父主题。'],
      ['24 个语义角色','完整主题覆盖所有角色和 light/dark；局部覆盖成对颜色。控件边界用 control，结构分隔用 border，焦点用 focus。'],
      ['对比度','结构与颜色错误明确报错。每种模式检查 22 对实际前景 / 背景，返回诊断，不静默改色。'],
      ['中文 / 英文','SDK 状态文案可覆盖；业务标签、错误与翻译由应用提供。'],
      ['RTL / 字号','采用逻辑 start/end，尊重平台文字缩放；品牌折面不镜像。'],
      ['减少动态','响应系统与宿主偏好；停止非必要循环和位移，保留状态信息。'],
      ['高对比','React 响应系统 forced colors；原生按各端系统信号、显式完整 palette 与平台边界处理，具体见接入指南。']
    ])+code("// React 局部继承\n<RosemaryProvider mode=\"system\" language=\"en\" direction=\"rtl\"\n  reducedMotion={requestReducedMotion}>\n  <RosemaryProvider colors={{primary: '#24675E', onPrimary: '#FFFFFF'}}\n    onDiagnostics={reportContrast}>\n    <Button onClick={saveRecord}>Save</Button>\n  </RosemaryProvider>\n</RosemaryProvider>")+`<p>各端完整主题、局部覆盖、语言、RTL 与诊断示例见 ${external(source('docs/sdk/getting-started.md'),'接入指南')}。${external(source('design/themes/vigilo.json'),'Vigilo light/dark JSON')} 提供完整 24-role 示例；业务品牌不内置在组件库中。</p>`)+
    section('state','应用持有数据与提交',list(['33 个基础组件覆盖输入、选择、导航、浮层、数据展示与反馈。各语言的名字与泛型不同，使用各端 API 文档核对 Binding、回调、约束和状态。','应用持有值、展开状态、列表与请求。搜索 / 列表 / 卡片的 loading、empty、error 用真实状态组合 Loading、Empty、Alert。','日期使用 Gregorian 本地日期 1–9999 / YYYY-MM-DD，时间 HH:mm；取消草稿不提交。不要把跨时区 timestamp 当作本地日期。','文件选择由 OS 处理；文件名、进度、失败、重试和取消由宿主状态驱动，SDK 不上传。未知进度不报告伪百分比。','模态遵循关闭原因、键盘与焦点恢复契约；非模态浮层保持可离开，不把普通提示变成阻断任务的对话框。'])+`<p class="sdk-component-ids">button / link / iconButton / input / textarea / select / search / checkbox / radio / switch / slider / date / upload / tabs / breadcrumb / pagination / menu / tooltip / popover / dialog / drawer / toast / alert / card / list / table / badge / avatar / empty / skeleton / loading / progress / stepper</p>`)+
    section('verification','阅读证据，再判断支持范围',note('按证据判断支持范围','Release 记录固定源码 commit、CI 运行和产物 SHA256。deployment target 不等于最低系统实际运行过；编译、自动交互、截图和读屏是不同证据。')+list(['WebKit 引擎回归不等于真实 Safari；Web 四浏览器最近两个稳定大版本需分别核验。','SwiftUI 使用稳定 Xcode 26.3 / macOS 15 CI 的实际交互记录；本机 Xcode 27 beta 构建、安装与截图仅是附加证据。iOS 17 runtime 与人工 VoiceOver 覆盖需单独核验。','Compose API 26 和 Flutter 六目标须读对应 CI 的 commit、环境和产物记录；不将某一平台结果推广到其他平台。','自动可访问语义断言不等于人工 VoiceOver / NVDA / TalkBack，触控、键盘遍历与极大文字分别记录。'])+`<div class="sdk-links">${external(source('docs/sdk/release-checklist.md'),'发布验收清单')}${external(source('docs/sdk/implementation-status.md'),'实施状态')}${external(source('platforms/swiftui/VERIFICATION.md'),'SwiftUI 证据')}</div><p>SDK 代码、文档、tokens 与功能图标采用 MIT。Rosemary 名称、官方 Logo、产品徽记与字标另受品牌资产规则约束；MIT 不授予商标使用权。${external(source('LICENSE'),'MIT License')} · ${external(source('BRAND-ASSETS.md'),'品牌资产规则')}</p>`),['33 个基础组件','四种实现','版本固定 0.4.0']);
})();
