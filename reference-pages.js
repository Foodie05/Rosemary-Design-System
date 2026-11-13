(() => {
  const {icon,link,button,note,section,table,list,rules,code} = window.RosemaryUI;
  const {sections,renderers,pageShell,jump} = window.RosemaryPages;
  sections.platforms=[jump('shared','统一与差异'),jump('native','平台规则'),jump('responsive','适配与国际化'),jump('error-routes','错误路径交付'),jump('delivery','交付边界')];
  renderers.platforms=()=>pageShell('platforms','平台适配与国际化','各端自有界面统一采用 Rosemary 的品牌、色彩、字体与交互规则，同时按屏幕尺寸、输入方式和系统能力做自然适配。',
    section('shared','哪些必须统一，哪些允许不同',table(['共同规则','按平台调整'],[['固定品牌组合与 Logo 来源','窗口形态、安全区与系统分享面板。'],['Rosemary 颜色、字体与控件视觉','响应式重排、动态字号与无障碍偏好。'],['导航层级、操作顺序与状态含义','返回手势、快捷键与输入方式。'],['隐私、付费、退出与恢复规则','触控、鼠标、键盘与读屏操作细节。']])+rules('一套品牌和组件规则覆盖多端，按空间重排并保留等价操作路径。','每个平台各自套用系统默认主题，导致同一产品的视觉和交互语言分裂。'))+
    section('native','平台实施重点',table(['平台','实施重点','需验证项目'],[['Apple 平台','自有界面遵循 Rosemary 规范；保留系统返回、权限与文件选择。','Dynamic Type、VoiceOver、键盘与减少动态。'],['Web','使用语义 HTML、真实链接、浏览器返回与深链接。','主流浏览器、文字缩放、强制颜色与表单差异。'],['Android','自有界面遵循 Rosemary 规范；保留系统返回与权限流程。','字体缩放、TalkBack、返回手势与多尺寸屏幕。'],['Windows / 桌面','自有界面遵循 Rosemary 规范；保留系统窗口与快捷键。','高对比度、DPI 缩放、多屏与读屏操作。']])+note('规范尺寸与平台单位','如 40px 按钮、44 CSS px 触达目标与 180ms 过渡为 Web 基准值；原生端请按对应系统单位（pt/dp）映射。'+link('sdk','查看各平台 SDK 接入')))+
    section('responsive','屏幕、输入与国际化',list(['窄屏转为单列并折叠次级导航，但当前位置与主操作保持可见。','悬停、拖拽、长按等手势不能成为核心功能的唯一入口，须提供键盘与点击替代。','为长译文与不同日期格式预留空间，使用逻辑方向属性支持 RTL 布局。','方向类图标按语义镜像，Logo、文字、时钟与媒体图标不镜像。','减少透明度或高对比模式下保留清晰边界，不依赖阴影或毛玻璃区分层级。']))+
    section('error-routes','页面、接口与网关共同覆盖错误路径',list(['浏览器页面、深链接与认证回调失败时返回品牌化错误页，不直接显示框架默认页或原始 JSON。','API 仍按契约返回真实 HTTP 状态码与结构化错误码（API直接访问可以是JSON），客户端再将其映射为安全文案。','联调反向代理、网关与托管平台，确保 401/403/404/429/5xx 返回真实状态码（不将缺失资源变成 200）。','原生端用对应错误页或局部持久提示引导恢复，详细诊断只写入访问受控日志。'])+`<p style="margin-top:14px">${link('patterns?section=errors','查看完整错误场景与安全边界')}</p>`)+
    section('delivery','交付记录与验证',`<div class="prose"><p>各平台（Web、iOS、Android、桌面）应分别记录支持的最低系统版本与实测结果，并在真机环境下完成键盘与屏幕阅读器验证。</p></div>`),['Rosemary 规范优先','系统能力可靠','响应式适配']);

  const sources=[
    ['Carbon','组件交付检查','结构、配置、状态、响应式、文档、测试与迁移要求。','https://carbondesignsystem.com/contributing/component-checklist/','已核对正文'],
    ['Carbon','加载模式','骨架、未知进度、确定进度、渐进加载及失败处理。','https://carbondesignsystem.com/patterns/loading-pattern/','已核对正文'],
    ['Carbon','动效','动效用途与可理解的状态变化。','https://carbondesignsystem.com/guidelines/motion/overview/','已核对正文'],
    ['Atlassian','按钮用法','按钮与导航的区别、结构、内容与 Do / Don’t。','https://atlassian.design/components/button/usage','已核对正文'],
    ['Atlassian','可访问性','语义、键盘、重排、对比度与完整流程验证。','https://atlassian.design/foundations/accessibility','已核对正文'],
    ['Atlassian','动效','高频动作、进入／退出和减少动态的处理。','https://atlassian.design/foundations/motion','已核对正文'],
    ['Atlassian','发布阶段','成熟度、弃用、替代方案与迁移。','https://atlassian.design/release-phases','已核对正文'],
    ['Apple HIG','平台设计目录','Accessibility、Motion、Loading、Navigation、Layout、Writing。','https://developer.apple.com/design/human-interface-guidelines/','目录与页面主题已核对；正文未可靠提取'],
    ['Material 3','基础与组件目录','组件按概览、指南、规格和可访问性组织。','https://m3.material.io/components','目录与元数据已核对；正文未可靠提取']
  ];
  sections.governance=[jump('coverage','规范覆盖'),jump('template','条目模板'),jump('resources','下载资源'),jump('checklist','发布检查'),jump('maturity','版本与迁移'),jump('references','参考来源')];
  renderers.governance=()=>pageShell('governance','规范覆盖、资源与维护','查看 Rosemary Forma 各部分的覆盖范围与边界、下载离线设计资产，并在发布前对照清单完成检查。',
    section('coverage','规范要素覆盖矩阵',table(['模块','本门户覆盖','实际边界'],[['品牌','定位、原则、正式 Logo、子品牌流程与图像要求。','矢量母版与专用小尺寸 Logo 尚未提供。'],['视觉基础','色彩与动态取色、排版、间距/层级与 74 枚图标。','具体产品仍需结合实际背景复测对比度。'],['组件','33 类基础组件的结构、变体、状态与交互规格。','复杂业务组件与多端包接入见 SDK 接入页。'],['异步与动效','加载、骨架、进度、动效参数与减少动态降级。','真实设备性能与复杂转场需真机验证。'],['交互与文案','保存同步、删除撤销、错误恢复、权限与写作规范。','业务系统需自行实现可靠存储、鉴权与重试。'],['可访问性与平台','对比度、键盘、缩放基线及多端适配要求。','本门户演示不替代正式 WCAG 或读屏人工审计。']])+note('设计规范与业务落地','设计系统提供通用组件与交互基准；各业务线在正式上线前，根据具体的业务流程与多端环境完成完整测试即可。'))+
    section('template','组件规格写作模板',`<div class="prose"><p>新增或维护组件规范时，统一按以下顺序组织，确保设计师与工程师都能快速找到所需信息：</p></div>`+table(['条目','回答的问题'],[['用途与结构','解决什么问题？什么时候不该用？由哪些部件组成？'],['变体与参数','有哪些尺寸、层级与 Token 变量？'],['状态与交互','正常、错误、加载、长内容下如何表现？键盘与触控如何操作？'],['可访问性与内容','名称、角色、焦点如何管理？标签与报错怎么写？'],['Do / Don’t','推荐做法与反例各自的原因。'],['实施与验证','支持哪些端？哪些已测、哪些待验证？']]))+
    section('resources','下载源文件与规范',`<div class="download-row">${button(`${icon('download')}设计 Token JSON`,'download-tokens','primary')}${button(`${icon('download')}完整文字规范`,'download-guide','secondary')}${button(`${icon('download')}正式 Logo PNG`,'download-logo','secondary')}${button(`${icon('download')}74 枚 SVG 图标`,'download-icons','secondary')}${button('Symbol Sprite','download-sprite','secondary')}${button('参考审阅记录','download-references','quiet')}</div><p class="section-intro" style="margin-top:18px">所有资源均在浏览器本地打包生成：Logo 为官方原始 PNG，图标包仅包含 74 枚功能图标。</p>`+code('设计变量分层\n\n原始值：色值、间距、字号、时长。\n语义层：primary、danger、surface、focus 等角色。\n组件层：按钮高度、输入边界、加载周期等映射。'))+
    section('checklist','发布检查',`<div class="release-checklist">${[
      '主要操作与导航层级清晰，核心任务不依赖猜测。',
      '保存、同步、加载、失败与恢复的界面表达与实际状态一致。',
      '用户可随时拒绝权限、暂停提醒、撤销操作或离开，隐私范围明确。',
      '组件的焦点、只读、禁用、加载、空状态、错误与长内容已全部覆盖。',
      'Logo 使用官方原图；图标语义、尺寸与颜色角色统一。',
      '已验证纯键盘操作、深浅主题、窄屏重排、文字放大与减少动态。',
      '文案平实准确；所有可达错误均有友好引导，不泄露内部诊断信息。',
      '组件已标注维护位置、成熟度、测试证据与迁移说明。'
    ].map((t,i)=>`<label class="check-row"><input type="checkbox" data-release-check="${i}"><span>${t}</span></label>`).join('')}</div><p class="checklist-note" id="checklist-note" aria-live="polite"></p>${button('清空本机勾选','reset-checklist','quiet small')}`)+
    section('maturity','成熟度与版本演进',table(['阶段','进入条件'],[['提案','明确用途与设计理由，完成结构与状态说明，待业务验证。'],['试用','至少在一个真实场景落地，持续收集平台差异与可用性反馈。'],['稳定','经多场景验证，具备明确维护人、多端实现与测试证据。'],['拟弃用','说明原因、替代方案与迁移窗口，不突然移除。'],['已弃用','停止新接入，保留历史说明与迁移指引。']])+`<div class="change-log"><h3>Forma 1.3.0（当前规范）</h3><p>33 类组件拥有独立可视化预览与分栏文档（预览 / 规范 / 实现要求）；统一章节与标签页动效并支持减少动态降级；首页重构为按任务起步的导览结构。对应 SDK 0.5.0 处于发布候选验收阶段（已发布稳定版为 0.4.2，详见 ${link('sdk','SDK 接入')}）。</p><h3>2026-10-15 · 错误体验补充</h3><p>补齐全站 8 类可达错误场景的友好页面、恢复引导与公开文案边界，增加本地交互演示。</p><h3>1.1.0 – 1.1.1 · 基础完善</h3><p>接入正式 Logo 与 74 枚 SVG 图标，确立折面加载、进度与骨架占位规范，并完善对比度检查与平台适配基线。</p></div>`)+
    section('references','参考来源与采用范围',`<p class="section-intro">本规范主要借鉴以下成熟设计系统的文档结构与验证思路，不复制其视觉风格或代码实现。</p><div class="reference-list">${sources.map(([system,title,scope,url,status])=>`<article><div><h3><a href="${url}" target="_blank" rel="noopener noreferrer">${system} · ${title}${icon('external-link')}<span class="sr-only">（新窗口）</span></a></h3><p>${scope}</p><small>${status}</small></div></article>`).join('')}</div>`+note('平台官方文档提示','实施 Apple 或 Material 原生平台特有能力时，请同步核对对应平台最新官方文档。')),
    ['覆盖矩阵','来源可追溯','1.3.0 设计规范']);
})();
