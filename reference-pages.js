(() => {
  const {icon,button,note,section,table,list,rules,code} = window.RosemaryUI;
  const {sections,renderers,pageShell,jump} = window.RosemaryPages;
  sections.platforms=[jump('shared','统一与差异'),jump('native','平台规则'),jump('responsive','适配与国际化'),jump('delivery','交付边界')];
  renderers.platforms=()=>pageShell('platforms','平台适配与国际化','跨平台统一的是术语、数据后果、信息层级与恢复逻辑，不是强行使用同一套像素或手势。原生控件能可靠完成任务时，优先使用平台实现。',
    section('shared','哪些必须统一，哪些允许不同',table(['共同规则','按平台调整'],[['Logo 来源与品牌归属','系统导航、菜单、窗口和分享入口。'],['颜色和字体的语义角色','原生文本样式、动态字号和用户强调色。'],['保存、同步、删除和共享的含义','返回手势、快捷键、控件度量和触感。'],['隐私、付费、退出与恢复规则','触屏、鼠标、键盘和辅助技术的操作细节。'],['同一功能的术语与关键状态','屏幕尺寸、密度、横竖屏和窗口多任务。']])+rules('用同一种名称说明同一种操作，但采用目标平台熟悉的入口。','把 Web 侧栏、macOS 菜单或 iOS 手势机械复制到所有设备。'))+
    section('native','平台实施要求',table(['平台','优先事项','需要验证'],[['Apple 平台','遵守原生导航、返回、窗口、菜单、分享与文本样式。自绘只用于确有产品价值的部分。','Dynamic Type、VoiceOver、键盘、减少动态和平台权限流程。具体规则查阅对应平台当前 HIG。'],['Web','使用语义 HTML、真实链接、浏览器返回与深链接；支持响应式与键盘。','Chrome、Safari、Firefox 等目标浏览器，文字缩放、强制颜色、表单和下载差异。'],['Android','遵循系统返回、触控、权限与无障碍习惯，参考 Material 的平台建议。','字体缩放、TalkBack、返回导航、输入法与设备尺寸。'],['Windows / 桌面','遵循窗口、菜单、快捷键、键盘操作及文件选择惯例。','高对比、缩放、多显示器、读屏与精细指针操作。']])+note('门户数值是自定义界面起点','例如 40px 按钮、44 CSS px 触达目标和 180ms 过渡是 Rosemary 的 Web 设计建议，不是可直接换算或冒充 Apple 官方尺寸的标准。'))+
    section('responsive','屏幕、输入与语言适配',list(['窄屏将双栏改为单列，侧栏可折叠，次要操作可进入菜单；当前位置、主要任务和恢复路径仍然可见。','触控、鼠标与键盘提供等价路径。悬停、拖拽、长按和滑动不能成为必要功能的唯一入口。','允许长标签、无空格文本、较长译文和不同日期格式；使用逻辑方向属性处理 RTL 布局。','返回／前进等方向图标按语义考虑镜像；Logo、文字、时钟和媒体符号不应整体机械镜像。','异步状态说明采用用户理解的单位和地区格式。跨地区预约必须明确时区与夏令时影响。','减少透明度或强制颜色环境下保留清楚的表面与边界，不依赖模糊或阴影独立传达层级。']))+
    section('delivery','按平台记录交付与测试',`<div class="prose"><p>每个平台实现应记录支持版本、已验证设备和输入方式、已知差异、可访问性验证结果及负责维护的位置。设计稿、Web 演示和原生代码是不同的交付物，不将其中一种的完成视为其他平台也已通过。</p><p>本门户提供 Web 演示和共享规范。原生应用、真实设备、真实用户与屏幕阅读器人工验证仍需在具体产品中完成。</p></div>`),['语义统一','原生行为优先','不强求像素一致']);

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
  renderers.governance=()=>pageShell('governance','规范覆盖、资源与维护','这一版按照成熟设计系统的基础、组件、模式、内容、可访问性和维护结构补齐规范。覆盖矩阵说明已有要求及对应位置，同时区分设计规格、交互演示和生产实现。',
    section('coverage','规范要素覆盖矩阵',table(['要素','本门户内容','边界'],[['品牌','定位、原则、正式 Logo、资产来源、产品家族、图像要求。','正式矢量母版与专用小尺寸 Logo 尚未提供。'],['视觉基础','色彩／主题／对比，字体／字号／行高，间距／密度／层级／圆角，图标。','目标产品组合仍需对比度与实际渲染验证。'],['组件','33 类基础组件规格，统一结构、变体、尺寸、状态、键盘、语义与 Do / Don’t。','不是 33 个生产级组件包；复杂原生或自定义实现需单独交付。'],['异步反馈','折面加载、按钮加载、骨架、确定进度、长任务、空／错误／取消／部分完成。','演示不连接后台，不冒充实际数据处理。'],['动效','语义参数、选中定位、完成确认、列表变化、快速触发、停止与减少动态。','真实设备性能与更复杂转场仍需验证。'],['交互流程','保存／同步、删除／撤销、权限／通知、共享、支付和退出。','业务系统需实现可靠存储、鉴权、队列和恢复。'],['内容','标签、标题、帮助、错误、成功、空状态、权限、通知与本地化。','真实文案需与功能和条款一致。'],['可访问性','名称／角色／状态、键盘／焦点、对比／触达、重排／动态偏好及检查方法。','不等于 WCAG 认证或人工读屏审计。'],['平台适配','Web、Apple、Android、Windows 的共通语义、原生优先与国际化。','当前交付为 Web 门户，并未实现所有平台库。'],['工程与维护','Token、源码、成熟度、测试证据、变更与弃用要求。','稳定性由实际采用和验证决定，不由版本号单独决定。']])+note('“要素齐备”和“所有能力实现完毕”是两件事','规范必须覆盖应考虑的要素。具体产品上线前，还要为目标平台、业务状态和可访问性完成实现与验证。这里不把演示数量当作生产成熟度。'))+
    section('template','每个组件采用同一规格模板',`<div class="prose"><p>条目首先说明用途和替代方案，再定义结构、变体和尺寸，然后覆盖相关状态、输入方式、焦点、响应式、内容和动效。推荐与错误示例必须解释原因，而不是只展示配色差异。最后记录实现状态、测试证据、版本和迁移影响。</p></div>`+table(['条目','需要回答的问题'],[['用途与结构','解决什么问题？什么时候不用？哪些部件必需，哪些可选？'],['变体与参数','有哪些尺寸、密度、层级和组合？使用哪些 Token？'],['状态与交互','正常、错误、异步、长内容如何变化？指针、键盘、触控如何操作？'],['可访问性与内容','名称、角色、状态和焦点如何表达？标签、错误和帮助怎样写？'],['Do / Don’t','什么情况下应这样做？为什么另一种做法会造成问题？'],['实施与验证','支持哪些平台？什么已演示、已测试、尚未验证？如何升级或回退？']]))+
    section('resources','下载源文件与规范',`<div class="download-row">${button(`${icon('download')}设计 Token JSON`,'download-tokens','primary')}${button(`${icon('download')}完整文字规范`,'download-guide','secondary')}${button(`${icon('download')}正式 Logo PNG`,'download-logo','secondary')}${button(`${icon('download')}71 枚 SVG 图标`,'download-icons','secondary')}${button('Symbol Sprite','download-sprite','secondary')}${button('参考审阅记录','download-references','quiet')}</div><p class="section-intro" style="margin-top:18px">资源由浏览器本地生成。Logo 是提供的原始 PNG，SVG 包只包含功能图标，不包含伪造的品牌矢量母版。规范参考记录注明了正文核对范围与不可读取的部分。</p>`+code('设计变量分层\n\n原始值：色值、间距、字号、时长。\n语义层：primary、danger、surface、focus 等角色。\n组件层：按钮高度、输入边界、加载周期等映射。\n\n同技术栈可复用代码；跨平台优先统一语义和后果。'))+
    section('checklist','发布检查',`<div class="release-checklist">${[
      '功能目标明确，主要操作与导航层级能被直接理解。',
      '保存、同步、加载、失败、取消和恢复的表达与实现一致。',
      '用户可拒绝、暂停、撤销或离开，权限与共享范围明确。',
      '组件的焦点、只读、禁用、加载、空、错误和长内容状态已覆盖。',
      'Logo 使用原始资产，图标语义、尺寸和颜色角色保持一致。',
      '键盘、深浅主题、窄屏、文字放大和减少动态均已验证。',
      '文案直接准确，相关说明形成完整段落，没有无法兑现的承诺。',
      '组件有维护位置、成熟度、测试证据、变更与迁移说明。'
    ].map((t,i)=>`<label class="check-row"><input type="checkbox" data-release-check="${i}"><span>${t}</span></label>`).join('')}</div><p class="checklist-note" id="checklist-note" aria-live="polite"></p>${button('清空本机勾选','reset-checklist','quiet small')}`)+
    section('maturity','成熟度、变更与弃用',table(['阶段','进入条件与要求'],[['提案','明确用途和设计理由，结构与状态已有说明，尚未经过真实产品验证。'],['试用','至少一个真实场景采用，记录问题、平台差异和可访问性反馈。'],['稳定','多个差异场景验证，具备维护责任、实现、文档和相应测试证据。'],['拟弃用','说明原因、替代方案、影响范围和迁移期限，不突然移除。'],['已弃用','停止新采用，保留必要历史说明和迁移入口。']])+`<div class="change-log"><h3>1.1.1 修订</h3><p>加载与反馈入口改用专用折面线性图标；进度填充增加 320ms 平滑过渡，保留即时数值和减少动态降级；对照示例增加重播入口。</p><h3>1.1 本次更新</h3><p>规范正文改为直接说明；接入正式 Logo；扩展到 71 枚 SVG 图标；新增 33 类组件规格、可视化 Do / Don’t、折面加载、进度和骨架；补充动效实验、平台适配、覆盖矩阵及参考来源。</p><h3>实施状态</h3><p>门户与演示属于设计提案。自动测试结果见交付中的验证文件。当前没有真实账户、云同步或文件上传；仅主题和检查清单使用本机存储，演示记录留在页面内存。</p></div>`)+
    section('references','参考来源与采用范围',`<p class="section-intro">本次重点借鉴规范的组织与验证方式，不复制其他品牌的视觉风格或组件代码。以下区分已核对正文的来源与只核对目录／元数据的来源。</p><div class="reference-list">${sources.map(([system,title,scope,url,status])=>`<article><div><h3><a href="${url}" target="_blank" rel="noopener noreferrer">${system} · ${title}${icon('external-link')}<span class="sr-only">（新窗口）</span></a></h3><p>${scope}</p><small>${status}</small></div></article>`).join('')}</div>`+note('Apple 与 Material 的读取限制','这些页面在本环境中采用客户端渲染，正文未能可靠提取。因此不把 Rosemary 的具体时长、尺寸或交互建议冒充为其最新官方条款。实施平台专属能力时，应继续核对相应官方文档。')),
    ['覆盖矩阵','来源可追溯','1.1 设计提案']);
})();
