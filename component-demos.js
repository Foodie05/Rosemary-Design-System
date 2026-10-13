/* Isolated catalog previews. Outside-dismiss listeners are scoped to the mount. */
(() => {
  'use strict';
  const ids = ['button','link','iconButton','input','textarea','select','search','checkbox','radio','switch','slider','date','upload','tabs','breadcrumb','pagination','menu','tooltip','popover','dialog','drawer','toast','alert','card','list','table','badge','avatar','empty','skeleton','loading','progress','stepper'];
  const mounted = new WeakMap();
  let serial = 0;
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = name => window.RosemaryUI?.icon ? window.RosemaryUI.icon(name) : '<span class="cd-icon-fallback" aria-hidden="true">•</span>';
  const fold = extra => window.RosemaryUI?.foldLoader ? window.RosemaryUI.foldLoader(extra || '') : `<span class="fold-loader ${escape(extra || '')}" aria-hidden="true"><i class="fold-pane fold-pane-back"></i><i class="fold-pane fold-pane-front"></i><i class="fold-spine"></i></span>`;
  const button = (label, action, variant = 'secondary', attrs = '') => `<button type="button" class="cd-button cd-${variant}" data-cd-action="cd-${action}" ${attrs}>${label}</button>`;
  const status = (text = '') => `<p class="cd-status" data-cd-status role="status" aria-live="polite" aria-atomic="true">${text}</p>`;
  const hint = text => `<p class="cd-help">${text}</p>`;
  const row = body => `<div class="cd-actions">${body}</div>`;
  const group = (label, body) => `<div class="cd-example"><p class="cd-example-label">${label}</p>${body}</div>`;
  const records = [
    {name:'周末记录', date:'2026-10-12', state:'已保存', kept:true},
    {name:'旅行清单', date:'2026-10-10', state:'草稿', kept:false},
    {name:'家庭相册', date:'2026-10-08', state:'已保存', kept:true},
    {name:'阅读笔记', date:'2026-10-06', state:'已保存', kept:false},
    {name:'购物清单', date:'2026-10-04', state:'草稿', kept:false},
    {name:'工作备忘', date:'2026-10-02', state:'已保存', kept:false}
  ];
  const recordRows = items => `<ul class="cd-records">${items.map(item => `<li><span>${escape(item.name)}</span><small>${escape(item.state || item.date)}</small></li>`).join('')}</ul>`;
  const tableRows = items => items.map(item => `<tr><th scope="row">${escape(item.name)}</th><td><time datetime="${item.date}">${item.date}</time></td><td>${item.state}</td></tr>`).join('');
  const dateTimeField = (p,name,label,value,kind='date') => `<div class="cd-field cd-picker ${kind==='time'?'cd-date-time-field':''}" data-cd-picker="${name}"><label for="${p(name)}">${label}</label><div class="cd-picker-input"><input class="cd-input" type="text" id="${p(name)}" data-cd-field="${name}" value="${value}" placeholder="${kind==='time'?'HH:mm':'YYYY-MM-DD'}" autocomplete="off" spellcheck="false" required aria-describedby="${p('format')} ${p('error')}"><button type="button" class="cd-picker-trigger" data-cd-picker-trigger="${name}" aria-label="选择${label}" aria-haspopup="dialog" aria-expanded="false" aria-controls="${p(name+'-picker')}">${icon(kind==='time'?'clock':'calendar')}</button></div><div class="cd-picker-popup" id="${p(name+'-picker')}" role="dialog" aria-modal="false" aria-labelledby="${p(name+'-picker-title')}" data-cd-picker-popup="${name}" hidden><h4 id="${p(name+'-picker-title')}">选择${label}</h4><div data-cd-picker-body></div></div></div>`;
  const checkLabel = (text, attrs = '') => `<label class="cd-check"><input type="checkbox" ${attrs}><span>${text}</span></label>`;
  const renderers = {
    button: () => `${group('操作层级',row(button('保存更改','save','primary') + button('预览更改','preview') + button('取消更改','reset','quiet') + button('删除示例','delete','danger')))}${group('尺寸与状态',row(button('小尺寸','size-small','secondary','data-cd-size="small"') + button('默认尺寸','size-medium') + button('大尺寸','size-large','secondary','data-cd-size="large"') + button('暂不可用','disabled','secondary','disabled aria-describedby="cd-disabled-reason"')))}<p class="cd-help" data-cd-disabled-reason>暂不可用：尚未选择要处理的记录。</p>${status('所有操作仅影响此预览。保存可体验短暂的加载状态。')}`,
    link: () => `<div class="cd-stack"><p>编辑前可先<a class="cd-link" href="#/components?component=input">查看单行输入规格</a>。</p><a class="cd-link cd-link-standalone" href="#/overview">返回规范总览 ${icon('arrow')}</a><a class="cd-link cd-link-standalone" href="data:text/plain;charset=utf-8,Rosemary%20component%20link%20example" download="rosemary-link-example.txt">${icon('download')} 下载示例文本（TXT）</a>${hint('链接有真实目的地，支持 Enter 和浏览器的新标签页操作。')}</div>`,
    iconButton: () => `${row(`<div class="cd-icon-example">${button(icon('bookmark'),'bookmark','icon','aria-label="收藏记录" aria-pressed="false"')}<span>收藏</span></div><div class="cd-icon-example">${button(icon('pencil'),'edit','icon','aria-label="编辑记录"')}<span>编辑</span></div><div class="cd-icon-example">${button(icon('trash'),'remove','icon-danger','aria-label="删除示例记录"')}<span>删除</span></div><div class="cd-icon-example">${button(icon('download'),'disabled','icon','aria-label="导出记录（无可导出内容）" disabled')}<span>不可用</span></div>`)}${status('收藏按钮可切换；其余操作在此处反馈。')}`,
    input: p => `<form class="cd-stack" data-cd-form novalidate><div class="cd-field"><label for="${p('name')}">收藏夹名称</label><input class="cd-input" id="${p('name')}" data-cd-field="name" value="周末记录" maxlength="32" required aria-describedby="${p('help')} ${p('error')}"><p class="cd-help" id="${p('help')}">1–32 个字符。清空后保存可查看校验。</p><p class="cd-error" id="${p('error')}" data-cd-error></p></div>${row('<button class="cd-button cd-primary" type="submit">保存名称</button>')}<div class="cd-grid">${group('只读',`<label class="cd-field" for="${p('readonly')}">记录编号<input class="cd-input" id="${p('readonly')}" value="RM-1024" readonly></label>`)}${group('禁用',`<label class="cd-field" for="${p('disabled')}">共享空间<input class="cd-input" id="${p('disabled')}" value="未加入共享空间" disabled></label>`)}</div></form>${status()}`,
    textarea: p => `<form class="cd-stack" data-cd-form><div class="cd-field"><label for="${p('notes')}">记录说明</label><textarea class="cd-input" id="${p('notes')}" data-cd-field="notes" rows="4" maxlength="160" aria-describedby="${p('help')} ${p('count')}">记录本周需要完成的事项。</textarea><div class="cd-between"><p class="cd-help" id="${p('help')}">Enter 换行；最多 160 个字符。</p><output class="cd-count" id="${p('count')}" for="${p('notes')}" data-cd-count aria-live="off">12 / 160</output></div></div>${row('<button class="cd-button cd-primary" type="submit">保存说明</button>')}</form>${status('草稿保留在当前预览中。')}`,
    select: p => `<div class="cd-stack"><label class="cd-field" for="${p('category')}">记录分类<select class="cd-input" id="${p('category')}" data-cd-field="category"><option value="">请选择分类</option><optgroup label="个人"><option value="日常">日常</option><option value="旅行">旅行</option><option value="阅读">阅读</option></optgroup><optgroup label="共享"><option value="家庭">家庭</option><option disabled>工作空间（不可用）</option></optgroup></select></label><label class="cd-field" for="${p('disabled')}">共享权限<select class="cd-input" id="${p('disabled')}" disabled><option>先加入共享空间</option></select></label></div>${status('尚未选择分类。选择后立即更新此处。')}`,
    search: p => `<form class="cd-stack" data-cd-form role="search" aria-label="搜索演示记录"><label class="cd-field" for="${p('query')}">在 6 条示例记录中搜索<div class="cd-input-row"><input class="cd-input" type="search" id="${p('query')}" data-cd-field="query" placeholder="例如：清单" aria-controls="${p('results')}"><button class="cd-button cd-primary" type="submit">搜索</button></div></label></form>${row(button('清除搜索','clear','quiet'))}${status('显示全部 6 条记录。')}<div id="${p('results')}" data-cd-results>${recordRows(records)}</div>`,
    checkbox: p => `<fieldset class="cd-fieldset"><legend>选择要导出的内容</legend>${checkLabel('全选',`id="${p('all')}" data-cd-field="all"`)}<div class="cd-indent">${checkLabel('文字记录','data-cd-choice="text" checked')}${checkLabel('图片说明','data-cd-choice="image"')}${checkLabel('收藏标记','data-cd-choice="saved" checked')}${checkLabel('共享附件（无权限）','disabled')}</div></fieldset>${status('已选择 2 / 3 项；全选处于部分选中状态。')}`,
    radio: p => `<fieldset class="cd-fieldset"><legend>回顾频率</legend>${[['weekly','每周一次','每周一显示回顾入口。'],['monthly','每月一次','每月第一天显示回顾入口。'],['manual','仅手动打开','不自动显示回顾入口。']].map(([value,label,help],i) => `<label class="cd-check cd-choice"><input type="radio" name="${p('frequency')}" value="${value}" ${i === 0 ? 'checked' : ''}><span><strong>${label}</strong><small>${help}</small></span></label>`).join('')}<label class="cd-check"><input type="radio" name="${p('frequency')}" disabled value="team"><span>团队计划（未加入）</span></label></fieldset>${status('已选择每周一次，仅用于本地演示。')}`,
    switch: p => `<div class="cd-settings"><div class="cd-setting"><div><label id="${p('label')}">每周提醒</label><p class="cd-help" id="${p('help')}" data-cd-switch-description>已关闭；不会发送系统通知。</p></div><button type="button" class="cd-switch" role="switch" aria-checked="false" aria-labelledby="${p('label')}" aria-describedby="${p('help')}" data-cd-action="cd-toggle"><span></span></button></div><div class="cd-setting"><div><span id="${p('disabled-label')}">跨设备同步</span><p class="cd-help">离线预览中不可用。</p></div><button type="button" class="cd-switch" role="switch" aria-checked="false" aria-labelledby="${p('disabled-label')}" disabled><span></span></button></div></div>${status()}`,
    slider: p => `<div class="cd-stack"><label class="cd-field" for="${p('range')}">提醒提前量 <output for="${p('range')} ${p('number')}" data-cd-value>15 分钟</output><input type="range" class="cd-range" id="${p('range')}" data-cd-field="range" min="5" max="60" step="5" value="15" aria-valuetext="15 分钟"></label><div class="cd-between cd-range-labels"><span>5 分钟</span><span>60 分钟</span></div><label class="cd-field cd-compact-field" for="${p('number')}">直接输入（分钟）<input class="cd-input" type="number" id="${p('number')}" data-cd-field="number" min="5" max="60" step="5" value="15"></label>${hint('方向键每次调整 5 分钟；Home / End 到达范围两端。')}</div>${status()}`,
    date: p => `<form class="cd-stack" data-cd-form novalidate><div class="cd-grid">${dateTimeField(p,'start','开始日期','2026-10-12')}${dateTimeField(p,'end','结束日期','2026-10-14')}</div>${dateTimeField(p,'time','提醒时间','10:00','time')}<p class="cd-help" id="${p('format')}">日期格式 YYYY-MM-DD，时间格式 HH:mm（24 小时）。可直接输入，或打开选择器；方向键移动，Esc 收起。按设备本地时间展示，不进行时区转换。结束日期不能早于开始日期。</p><p class="cd-error" id="${p('error')}" data-cd-error></p>${row('<button class="cd-button cd-primary" type="submit">确认日期</button>')}</form>${status()}`,
    upload: p => `<div class="cd-dropzone" data-cd-dropzone>${icon('upload')}<label class="cd-field" for="${p('files')}">选择演示文件<input type="file" class="cd-file" id="${p('files')}" multiple data-cd-field="files" aria-describedby="${p('help')}"></label><p class="cd-help" id="${p('help')}">也可拖入文件。仅读取名称和大小，不读取内容、不上传；单个文件限 5 MB。</p></div><ul class="cd-file-list" data-cd-files></ul>${status('尚未选择文件。')}`,
    tabs: p => `<div class="cd-tabs" role="tablist" aria-label="示例记录范围" data-cd-tablist>${[['all','全部'],['kept','已收藏'],['draft','草稿']].map(([key,label],i) => `<button type="button" role="tab" id="${p(key)}" data-tab-key="${key}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="${p('panel')}">${label}</button>`).join('')}</div><div class="cd-tab-panel" id="${p('panel')}" role="tabpanel" aria-labelledby="${p('all')}" tabindex="0" data-cd-panel>${recordRows(records.slice(0,3))}</div>${hint('方向键切换标签；Home / End 到首尾。选中标记与内容使用共享动效。')}`,
    breadcrumb: () => `<nav class="cd-breadcrumb" aria-label="示例层级路径"><ol><li><a href="#/overview">规范总览</a></li><li><a href="#/components">组件规范</a></li><li><span aria-current="page">面包屑</span></li></ol></nav><div class="cd-current-location"><strong>面包屑</strong><p>当前位于「组件规范」下。上级是链接，当前项不是重复导航。</p></div>`,
    pagination: () => `<div data-cd-results>${recordRows(records.slice(0,2))}</div><nav class="cd-pagination" aria-label="示例记录分页">${button(icon('arrow-left'),'previous','icon','aria-label="上一页" disabled')}${[1,2,3].map(page => `<button class="cd-page" type="button" data-cd-page="${page}" aria-label="第 ${page} 页" ${page === 1 ? 'aria-current="page"' : ''}>${page}</button>`).join('')}${button(icon('arrow'),'next','icon','aria-label="下一页"')}</nav>${status('第 1 页，显示 1–2 条，共 6 条。')}`,
    menu: p => `<div class="cd-disclosure" data-cd-disclosure><div class="cd-between"><strong data-cd-object-name>周末记录</strong><button type="button" class="cd-button cd-secondary" data-cd-action="cd-disclose" aria-expanded="true" aria-controls="${p('menu')}">更多操作 ${icon('down')}</button></div><div class="cd-menu-panel" id="${p('menu')}" data-cd-popup>${button(`${icon('bookmark')} 收藏记录`,'menu-save','menu')}${button(`${icon('copy')} 复制一份`,'menu-copy','menu')}${button('共享（离线不可用）','menu-disabled','menu','disabled')}${button(`${icon('trash')} 移除示例`,'menu-remove','menu-danger')}</div></div>${hint('展开式操作列表：用 Tab 浏览操作，Esc 关闭。')}${status('操作仅影响这条示例记录。')}`,
    tooltip: p => `<div class="cd-tooltip-stage"><div class="cd-tooltip-anchor" data-cd-tooltip-anchor><div class="cd-actions"><span>通知预览</span>${button(icon('info'),'tooltip','icon',`aria-label="了解通知预览" aria-describedby="${p('tooltip')}"`)}</div><div class="cd-tooltip" id="${p('tooltip')}" role="tooltip" data-cd-tooltip>开启后，提醒中会显示记录摘要。此演示不会发送系统通知。</div></div></div>${hint('悬停或聚焦信息按钮查看；可移入提示阅读，Esc 关闭。')}`,
    popover: p => `<div class="cd-disclosure" data-cd-disclosure><div class="cd-between"><strong data-cd-object-name>周末记录</strong><button type="button" class="cd-button cd-secondary" data-cd-action="cd-disclose" aria-expanded="true" aria-controls="${p('popover')}">${icon('pencil')} 修改名称</button></div><div class="cd-popover" id="${p('popover')}" data-cd-popup><form class="cd-stack" data-cd-form novalidate><label class="cd-field" for="${p('name')}">记录名称<input class="cd-input" id="${p('name')}" data-cd-field="name" value="周末记录" required maxlength="32" aria-describedby="${p('error')}"></label><p class="cd-error" id="${p('error')}" data-cd-error></p>${row('<button class="cd-button cd-primary" type="submit">保存名称</button>' + button('暂时关闭','close-popup','quiet'))}</form></div></div>${status('非模态编辑；关闭后保留当前草稿。')}`,
    dialog: p => modalMarkup(p, false),
    drawer: p => modalMarkup(p, true),
    toast: () => `${row(button('显示保存结果','show-toast','primary'))}<div class="cd-toast-space"><div class="cd-toast" data-cd-toast>${icon('check')}<p role="status" aria-live="polite" data-cd-toast-message>更改已保存（样式示例）</p>${button(icon('close'),'dismiss-toast','icon','aria-label="关闭保存提示"')}</div></div>${hint('点击后显示 6 秒；悬停或聚焦时暂停计时。不会抢焦点或覆盖其他组件。')}`,
    alert: () => `<div class="cd-stack"><div class="cd-alert cd-info">${icon('info')}<div><strong>仅保存在此设备</strong><p>连接网络后可开启跨设备同步。</p></div></div><div class="cd-alert cd-success">${icon('check')}<div><strong>更改已保存</strong><p>本地记录已更新。</p></div></div><div class="cd-alert cd-warning">${icon('warning')}<div><strong>有 2 条记录尚未同步</strong><p>离开页面前请保留本地副本。</p></div></div><div class="cd-alert cd-danger" data-cd-recoverable>${icon('info')}<div><strong data-cd-alert-title>演示连接已中断</strong><p data-cd-alert-copy>本地草稿仍保留。可以重试这次演示连接。</p>${button('重试演示连接','retry-alert','secondary')}</div></div></div>${status()}`,
    card: () => `<div class="cd-grid"><article class="cd-card"><p class="cd-card-meta">个人记录 · 10 月 12 日</p><h4>周末记录</h4><p>安排采购、整理照片，保留本周需要继续处理的事项。</p><footer>4 条内容 · 仅此设备</footer></article><article class="cd-card cd-card-selected"><p class="cd-card-meta">已选择 ${icon('check')}</p><h4>旅行清单</h4><p>出发前的证件、交通与住宿信息，集中在一条记录中。</p><footer>6 条内容 · 草稿</footer></article></div>${hint('独立内容对象的常规与选中样式；此处为非交互展示。')}`,
    list: () => `<ul class="cd-list">${records.slice(0,3).map((item,i) => `<li><button type="button" data-cd-list-index="${i}" aria-pressed="${i === 0}">${icon('file-text')}<span><strong>${item.name}</strong><small>${item.date} · ${item.state}</small></span>${icon('chevron')}</button></li>`).join('')}</ul><div class="cd-list-detail" data-cd-detail><strong>周末记录</strong><p>已选择此记录，可继续查看或整理。</p></div>${status()}`,
    table: () => `<div class="cd-table-scroll" tabindex="0" role="region" aria-label="可横向滚动的演示记录表格"><table class="cd-table"><caption>4 条演示记录 · 点击列头排序</caption><thead><tr><th scope="col" aria-sort="none" data-cd-sort-header="name"><button type="button" data-cd-sort="name">名称 ${icon('down')}</button></th><th scope="col" aria-sort="descending" data-cd-sort-header="date"><button type="button" data-cd-sort="date">日期 ${icon('down')}</button></th><th scope="col">状态</th></tr></thead><tbody data-cd-tbody>${tableRows(records.slice(0,4))}</tbody></table></div>${status('按日期降序排列。')}`,
    badge: () => `${group('类别',row('<span class="cd-badge">日常</span><span class="cd-badge cd-plum">个人记录</span><span class="cd-badge cd-sky">共享内容</span>'))}${group('状态',row(`<span class="cd-badge cd-success">${icon('check')} 已保存</span><span class="cd-badge cd-warning">等待同步</span><span class="cd-badge cd-danger">同步失败</span>`))}${group('数量','<div class="cd-actions"><span>未读记录</span><span class="cd-badge cd-count-badge" aria-label="3 条未读记录">3</span></div>')}${hint('状态同时使用文字，不只依赖颜色；徽标不是按钮。')}`,
    avatar: () => `<div class="cd-avatar-sizes">${[['24','林','林晓 · 小尺寸'],['32','陈','陈宁 · 默认尺寸'],['40','RM','Rosemary · 大尺寸']].map(([size,initial,label]) => `<div class="cd-avatar-example"><span class="cd-avatar cd-avatar-${size}" aria-hidden="true">${initial}</span><span>${label}</span></div>`).join('')}</div><div class="cd-avatar-group-row"><div class="cd-avatar-group" aria-hidden="true"><span class="cd-avatar cd-avatar-32">林</span><span class="cd-avatar cd-avatar-32 cd-avatar-sky">陈</span><span class="cd-avatar cd-avatar-32">+2</span></div><p>林晓、陈宁等 4 位成员</p></div>${hint('无照片时使用姓名缩写；邻近文字始终保留身份信息。')}`,
    empty: () => `<div class="cd-grid"><div class="cd-empty" data-cd-first-empty>${icon('folder')}<h4 data-cd-empty-title>还没有记录</h4><p data-cd-empty-copy>添加第一条记录，开始整理内容。</p>${button('添加示例记录','add-record','primary')}</div><div class="cd-empty" data-cd-filter-empty>${icon('search')}<h4 data-cd-filter-title>没有符合筛选的记录</h4><p data-cd-filter-copy>当前筛选：已共享。清除后查看全部记录。</p>${button('清除筛选','clear-filter')}</div></div>${status()}`,
    skeleton: () => `<div class="cd-skeleton-region" data-cd-skeleton-region aria-busy="true"><div class="cd-skeleton" data-cd-skeleton aria-hidden="true">${[1,2,3].map(() => '<div class="cd-skeleton-row"><span class="cd-skeleton-dot"></span><div><span class="cd-skeleton-line cd-skeleton-title"></span><span class="cd-skeleton-line"></span></div></div>').join('')}</div><div data-cd-skeleton-result hidden>${recordRows(records.slice(0,3))}</div></div>${row(button('显示内容','reveal','primary') + button('重新加载','reload'))}${status('正在加载记录列表。占位保持最终内容的结构。')}`,
    loading: () => `<div class="cd-loading-region" data-cd-loading-region aria-busy="false"><div class="cd-loader-symbol" data-cd-loader>${fold('medium')}</div><div><strong data-cd-loading-title>准备读取记录</strong><p class="cd-help" data-cd-loading-copy>完成量未知时，不显示虚构百分比。</p></div></div>${row(button('开始等待演示','start-loading','primary') + button('完成演示','finish-loading','secondary','disabled') + button('取消','cancel-loading','quiet','disabled'))}${status('本地状态演示，无网络请求。开始后可主动完成或取消。')}`,
    progress: p => `<div class="cd-progress-example" data-cd-progress-region aria-busy="false"><div class="cd-between"><strong>整理 6 条示例记录</strong><span class="cd-count" data-cd-progress-count>已完成 2 / 6 项</span></div><label class="cd-sr-only" for="${p('progress')}">已整理的记录数量</label><progress class="cd-sr-only" id="${p('progress')}" max="6" value="2" data-cd-progress>2 / 6</progress><div class="task-progress-track" data-cd-progress-track aria-hidden="true"><span class="task-progress-fill" data-cd-progress-fill style="--progress-ratio:0.333333"></span></div><div class="cd-unknown-progress" data-cd-progress-unknown hidden>${fold('small')}<span>确认待处理数量…</span></div><ol class="cd-progress-items" data-cd-progress-items>${records.map((item,i) => `<li data-cd-done="${i < 2}"><span aria-hidden="true">${i < 2 ? icon('check') : '·'}</span>${item.name}<small>${i < 2 ? '已完成' : '待处理'}</small></li>`).join('')}</ol></div>${row(button('处理下一项','advance-progress','primary') + button('取消','cancel-progress','quiet') + button('重新开始','restart-progress') + button('确认总量为 6 项','known-progress','primary','hidden'))}${status('每次操作整理一条本地示例，进度按实际完成项计算。')}`,
    stepper: p => `<ol class="cd-steps" aria-label="创建记录步骤">${['填写名称','选择分类','确认创建'].map((label,i) => `<li data-cd-step="${i}" ${i === 0 ? 'aria-current="step"' : ''}><span class="cd-step-marker" aria-hidden="true">${i+1}</span><span>${label}</span></li>`).join('')}</ol><form class="cd-stack" data-cd-form novalidate><div class="cd-step-panel" data-cd-step-panel="0"><label class="cd-field" for="${p('name')}">记录名称<input class="cd-input" id="${p('name')}" data-cd-field="name" value="周末记录" maxlength="32" required aria-describedby="${p('error')}"></label></div><div class="cd-step-panel" data-cd-step-panel="1" hidden><label class="cd-field" for="${p('category')}">记录分类<select class="cd-input" id="${p('category')}" data-cd-field="category"><option>日常</option><option>旅行</option><option>阅读</option></select></label></div><div class="cd-step-panel" data-cd-step-panel="2" hidden><h4>确认记录信息</h4><dl class="cd-review"><div><dt>名称</dt><dd data-cd-review-name>周末记录</dd></div><div><dt>分类</dt><dd data-cd-review-category>日常</dd></div></dl></div><p class="cd-error" id="${p('error')}" data-cd-error></p>${row(button('上一步','back-step','secondary','disabled') + '<button class="cd-button cd-primary" type="submit" data-cd-next-step>下一步</button>' + button('重新演示','restart-step','quiet','hidden'))}</form>${status('第 1 / 3 步。返回修改不会清空已填写内容。')}`
  };

  function modalMarkup(p, drawer) {
    const title = drawer ? '记录详情' : '编辑记录';
    return `<div class="cd-modal-stage ${drawer ? 'cd-drawer-stage' : ''}"><div class="cd-modal-preview ${drawer ? 'cd-drawer-preview' : ''}"><strong>${title}</strong><p class="cd-help">周末记录</p><div class="cd-input-preview">${drawer ? '需要采购物品，整理本周照片。' : '名称与说明可在打开后修改。'}</div>${button(drawer ? '打开详情抽屉' : '打开编辑对话框','open-modal','primary')}</div></div>${status('关闭后保留草稿；关闭或 Esc 后焦点返回入口。')}<dialog class="cd-dialog ${drawer ? 'cd-drawer' : ''}" data-cd-dialog aria-labelledby="${p('title')}" aria-describedby="${p('description')}"><form class="cd-stack" data-cd-form novalidate><div class="cd-between"><h3 id="${p('title')}">${title}</h3>${button(icon('close'),'close-modal','icon','aria-label="关闭并保留草稿"')}</div><p class="cd-help" id="${p('description')}">只编辑这条本地示例，未保存草稿会保留到切换组件前。</p><label class="cd-field" for="${p('name')}">记录名称<input class="cd-input" id="${p('name')}" data-cd-field="name" value="周末记录" maxlength="32" required aria-describedby="${p('error')}"></label><label class="cd-field" for="${p('notes')}">记录说明<textarea class="cd-input" id="${p('notes')}" data-cd-field="notes" rows="${drawer ? 5 : 3}">需要采购物品，整理本周照片。</textarea></label><p class="cd-error" id="${p('error')}" data-cd-error role="status"></p>${row('<button type="submit" class="cd-button cd-primary">保存记录</button>' + button('暂时关闭','close-modal','quiet'))}</form></dialog>`;
  }

  function render(id) {
    if (!ids.includes(id)) throw new RangeError(`Unknown Rosemary component: ${id}`);
    const prefix = `cd-${id}-${++serial}`;
    const p = name => `${prefix}-${name}`;
    let html = renderers[id](p);
    // Keep the disabled-button explanation unique even when several previews exist.
    if (id === 'button') html = html.replace('aria-describedby="cd-disabled-reason"', `aria-describedby="${p('disabled-reason')}"`).replace('data-cd-disabled-reason', `id="${p('disabled-reason')}" data-cd-disabled-reason`);
    const title = window.RosemaryComponentCatalog?.[id]?.title || id;
    return `<section class="cd-demo" data-component-demo="${id}" data-cd-state="ready" aria-label="${escape(title)}交互预览">${html}</section>`;
  }

  function mount(host, id, context = {}) {
    if (!host || !ids.includes(id)) return () => {};
    const root = host.matches?.(`[data-component-demo="${id}"]`) ? host : host.querySelector(`[data-component-demo="${id}"]`);
    if (!root) return () => {};
    mounted.get(root)?.();
    const abort = new AbortController();
    const timers = new Set();
    const disposers = [];
    const motion = context?.motion;
    let disposed = false;
    const $ = selector => root.querySelector(selector);
    const $$ = selector => [...root.querySelectorAll(selector)];
    const field = name => $(`[data-cd-field="${name}"]`);
    const control = name => $(`[data-cd-action="cd-${name}"]`);
    const on = (element, type, callback, options = {}) => element?.addEventListener(type, callback, {...options, signal:abort.signal});
    const later = (callback, delay) => {
      const timer = setTimeout(() => { timers.delete(timer); if (!disposed) callback(); }, delay);
      timers.add(timer);
      return timer;
    };
    const clear = timer => { clearTimeout(timer); timers.delete(timer); };
    const say = text => { const target = $('[data-cd-status]'); if (target) target.textContent = text; };
    const enter = element => { if (motion?.enter && !motion.reduced?.matches) motion.enter(element, {kind:'panel'}); };
    const act = (action, callback) => on(root, 'click', event => {
      const target = event.target.closest?.(`[data-cd-action="cd-${action}"]`);
      if (target && root.contains(target) && !target.disabled && target.getAttribute('aria-disabled') !== 'true') callback(event, target);
    });
    const validName = () => {
      const input = field('name');
      const valid = Boolean(input.value.trim());
      input.setAttribute('aria-invalid', String(!valid));
      const error = $('[data-cd-error]');
      if (error) error.textContent = valid ? '' : '请输入 1–32 个字符的名称。';
      if (!valid) input.focus();
      return valid;
    };
    const submit = callback => on($('[data-cd-form]'), 'submit', event => { event.preventDefault(); callback(event); });
    disposers.push(window.RosemarySelect?.mountWithin(root));

    switch (id) {
      case 'button': {
        let pending;
        const save = control('save');
        const original = save.innerHTML;
        act('save', () => {
          if (save.getAttribute('aria-busy') === 'true') return;
          save.setAttribute('aria-busy','true');
          save.setAttribute('aria-disabled','true');
          save.innerHTML = fold('small is-running') + original;
          root.dataset.cdState = 'loading';
          say('正在保存本地演示更改…');
          pending = later(() => {
            save.removeAttribute('aria-busy'); save.removeAttribute('aria-disabled'); save.innerHTML = original;
            root.dataset.cdState = 'saved'; say('更改已保存，仅用于本地演示。');
          },900);
        });
        act('reset', () => {
          clear(pending); save.removeAttribute('aria-busy'); save.removeAttribute('aria-disabled'); save.innerHTML = original;
          root.dataset.cdState = 'ready'; say('更改已取消，保存任务已停止。');
        });
        act('preview', () => say('预览：本次更改会保存这条示例记录。'));
        act('delete', () => say('示例记录已移除；未删除任何真实数据。'));
        ['small','medium','large'].forEach(size => act(`size-${size}`, () => say(`已激活${{small:'小',medium:'默认',large:'大'}[size]}尺寸按钮。`)));
        break;
      }
      case 'iconButton':
        act('bookmark', (_, target) => { const pressed = target.getAttribute('aria-pressed') !== 'true'; target.setAttribute('aria-pressed',String(pressed)); say(pressed ? '记录已收藏。' : '已取消收藏。'); });
        act('edit', () => say('已选择编辑这条示例记录。'));
        act('remove', () => say('已移除示例记录，未影响真实数据。'));
        break;
      case 'input':
        submit(() => { if (validName()) say(`已保存名称「${field('name').value.trim()}」。`); else say('名称未保存，请修正输入。'); });
        break;
      case 'textarea': {
        const update = () => { $('[data-cd-count]').textContent = `${field('notes').value.length} / 160`; };
        update(); on(field('notes'),'input',update);
        submit(() => say(`说明已保存，共 ${field('notes').value.length} 个字符。`));
        break;
      }
      case 'select':
        on(field('category'),'change',() => say(field('category').value ? `记录分类已设为「${field('category').value}」。` : '尚未选择分类。'));
        break;
      case 'search': {
        const search = () => {
          const query = field('query').value.trim().toLocaleLowerCase();
          const found = records.filter(item => item.name.toLocaleLowerCase().includes(query));
          $('[data-cd-results]').innerHTML = found.length ? recordRows(found) : `<div class="cd-empty cd-empty-compact"><strong>没有找到「${escape(field('query').value.trim())}」</strong><p>试试「记录」或「清单」，也可以清除搜索。</p></div>`;
          root.dataset.cdState = found.length ? 'results' : 'empty';
          say(query ? `找到 ${found.length} 条结果。` : '显示全部 6 条记录。');
          enter($('[data-cd-results]'));
        };
        submit(search);
        on(field('query'),'search',search);
        act('clear',() => { field('query').value = ''; search(); field('query').focus(); });
        break;
      }
      case 'checkbox': {
        const choices = $$('[data-cd-choice]');
        const update = () => { const count = choices.filter(input => input.checked).length; field('all').checked = count === choices.length; field('all').indeterminate = count > 0 && count < choices.length; say(`已选择 ${count} / ${choices.length} 项${field('all').indeterminate ? '；全选处于部分选中状态' : ''}。`); };
        on(field('all'),'change',() => { choices.forEach(input => { input.checked = field('all').checked; }); update(); });
        choices.forEach(input => on(input,'change',update)); update();
        break;
      }
      case 'radio':
        $$('input[type="radio"]').forEach(input => on(input,'change',() => say(`已选择${{weekly:'每周一次',monthly:'每月一次',manual:'仅手动打开'}[input.value]}，仅用于本地演示。`)));
        break;
      case 'switch':
        act('toggle',(_,target) => { const checked = target.getAttribute('aria-checked') !== 'true'; target.setAttribute('aria-checked',String(checked)); $('[data-cd-switch-description]').textContent = checked ? '已开启演示提醒；不会发送系统通知。' : '已关闭；不会发送系统通知。'; say(checked ? '每周提醒已开启。' : '每周提醒已关闭。'); });
        break;
      case 'slider': {
        const update = value => { const normalized = Math.min(60,Math.max(5,Math.round(value / 5) * 5)); field('range').value = String(normalized); field('number').value = String(normalized); field('range').setAttribute('aria-valuetext',`${normalized} 分钟`); $('[data-cd-value]').textContent = `${normalized} 分钟`; };
        on(field('range'),'input',() => update(Number(field('range').value)));
        on(field('number'),'change',() => { if (field('number').value === '' || !Number.isFinite(field('number').valueAsNumber)) { field('number').value = field('range').value; say('请输入 5–60 之间的数字。'); } else { update(field('number').valueAsNumber); say(`提前量已设为 ${field('range').value} 分钟。`); } });
        break;
      }
      case 'date': {
        const pad = number => String(number).padStart(2,'0');
        // UTC is only used as a Gregorian arithmetic container. Field values
        // remain civil date / clock strings and never become zoned instants.
        const civil = (year,month,day) => { const date=new Date(0);date.setUTCHours(0,0,0,0);date.setUTCFullYear(year,month-1,day);return date; };
        const dateValue = date => `${String(date.getUTCFullYear()).padStart(4,'0')}-${pad(date.getUTCMonth()+1)}-${pad(date.getUTCDate())}`;
        const parseDate = value => {
          if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
          const [year,month,day]=value.split('-').map(Number),date=civil(year,month,day);
          return year>=1&&year<=9999&&dateValue(date)===value?date:null;
        };
        const validTime = value => /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
        const today = () => {const now=new Date();return civil(now.getFullYear(),now.getMonth()+1,now.getDate());};
        let picker=null,calendarDay=null,timeDraft=null,yearBlock=0;
        const popup = name => $(`[data-cd-picker-popup="${name}"]`);
        const trigger = name => $(`[data-cd-picker-trigger="${name}"]`);
        const close = (restore=false) => {
          if(!picker)return;
          const name=picker;picker=null;
          popup(name).hidden=true;trigger(name).setAttribute('aria-expanded','false');
          if(restore&&trigger(name).checkVisibility())trigger(name).focus({preventScroll:true});
        };
        const commit = (name,value) => {
          field(name).value=value;
          field(name).dispatchEvent(new Event('input',{bubbles:true}));
          field(name).dispatchEvent(new Event('change',{bubbles:true}));
          say(`${name==='start'?'开始日期':name==='end'?'结束日期':'提醒时间'}已选择 ${value}。`);
          close(true);
        };
        const drawCalendar = (focus=false) => {
          const box=popup(picker),body=box.querySelector('[data-cd-picker-body]');
          const year=calendarDay.getUTCFullYear(),month=calendarDay.getUTCMonth()+1;
          const first=civil(year,month,1),offset=(first.getUTCDay()+6)%7;
          const chosen=field(picker).value,focused=dateValue(calendarDay),currentDay=dateValue(today());
          const monthID=box.id+'-month';
          let rows='';
          for(let week=0;week<6;week++) {
            let cells='';
            for(let weekday=0;weekday<7;weekday++) {
              const date=civil(year,month,week*7+weekday-offset+1),value=dateValue(date);
              const valid=date.getUTCFullYear()>=1&&date.getUTCFullYear()<=9999;
              cells+=valid?`<td role="gridcell" aria-selected="${value===chosen}"><button type="button" class="cd-calendar-day ${date.getUTCMonth()+1!==month?'cd-other-month':''}" data-cd-date="${value}" tabindex="${value===focused?0:-1}" aria-label="${date.getUTCFullYear()}年${date.getUTCMonth()+1}月${date.getUTCDate()}日，星期${['日','一','二','三','四','五','六'][date.getUTCDay()]}" ${value===currentDay?'aria-current="date"':''}>${date.getUTCDate()}</button></td>`:'<td role="gridcell"></td>';
            }
            rows+=`<tr role="row">${cells}</tr>`;
          }
          body.innerHTML=`<div class="cd-calendar-heading"><button type="button" class="cd-button cd-icon cd-quiet" data-cd-month="-1" aria-label="上个月" ${year===1&&month===1?'disabled':''}>${icon('arrow-left')}</button><span id="${monthID}" class="cd-calendar-period" aria-live="polite"><button type="button" class="cd-button cd-quiet" data-cd-period="years" aria-label="选择年份，当前${year}年">${year}年</button> <button type="button" class="cd-button cd-quiet" data-cd-period="months" aria-label="选择月份，当前${month}月">${month}月</button></span><button type="button" class="cd-button cd-icon cd-quiet" data-cd-month="1" aria-label="下个月" ${year===9999&&month===12?'disabled':''}>${icon('arrow')}</button></div><table class="cd-calendar" role="grid" aria-labelledby="${monthID}"><thead><tr role="row">${['一','二','三','四','五','六','日'].map(day=>`<th role="columnheader" scope="col">${day}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><div class="cd-picker-footer"><small>方向键选日期 · PgUp / PgDn 换月</small><button type="button" class="cd-button cd-quiet" data-cd-picker-close>取消</button></div>`;
          if(focus)body.querySelector(`[data-cd-date="${focused}"]`).focus({preventScroll:true});
        };
        const setPeriod = (year,month) => {
          const last=civil(year,month+1,0).getUTCDate();
          calendarDay=civil(year,month,Math.min(calendarDay.getUTCDate(),last));
        };
        const drawPeriod = (view,focus=true) => {
          const body=popup(picker).querySelector('[data-cd-picker-body]'),year=calendarDay.getUTCFullYear(),month=calendarDay.getUTCMonth()+1;
          const years=view==='years';
          if(years&&!yearBlock)yearBlock=Math.floor((year-1)/12)*12+1;
          const items=Array.from({length:12},(_,i)=>years?yearBlock+i:i+1).filter(value=>value<=9999);
          body.innerHTML=`<div class="cd-calendar-heading"><button type="button" class="cd-button cd-quiet" data-cd-period="days">返回日期</button><strong>${years?'选择年份':year+'年 · 选择月份'}</strong></div>${years?`<div class="cd-year-jump"><label for="${popup(picker).id}-year">跳转到年份</label><div><input class="cd-input" id="${popup(picker).id}-year" data-cd-year-input inputmode="numeric" maxlength="4" value="${year}" aria-describedby="${popup(picker).id}-year-help"><button type="button" class="cd-button cd-primary" data-cd-year-jump>前往</button></div><small id="${popup(picker).id}-year-help" data-cd-year-help>输入 1–9999，例如 1900</small></div><div class="cd-calendar-heading"><button type="button" class="cd-button cd-icon cd-quiet" data-cd-year-block="-12" aria-label="前12年" ${yearBlock===1?'disabled':''}>${icon('arrow-left')}</button><span>${yearBlock}–${Math.min(9999,yearBlock+11)}</span><button type="button" class="cd-button cd-icon cd-quiet" data-cd-year-block="12" aria-label="后12年" ${yearBlock+12>9999?'disabled':''}>${icon('arrow')}</button></div>`:''}<div class="cd-period-grid" aria-label="${years?'年份':'月份'}">${items.map(value=>`<button type="button" class="cd-button cd-quiet" data-cd-${years?'year':'month-choice'}="${value}" aria-pressed="${value===(years?year:month)}">${value}${years?'年':'月'}</button>`).join('')}</div><div class="cd-picker-footer"><button type="button" class="cd-button cd-quiet" data-cd-picker-close>取消</button></div>`;
          if(focus)body.querySelector(`[aria-pressed="true"]`)?.focus({preventScroll:true});
        };
        const jumpYear = () => {
          const input=$('[data-cd-year-input]'),value=input.value.trim();
          if(!/^\d{1,4}$/.test(value)||Number(value)<1||Number(value)>9999){input.setAttribute('aria-invalid','true');$('[data-cd-year-help]').textContent='请输入 1–9999 之间的整数年份。';input.focus();return;}
          setPeriod(Number(value),calendarDay.getUTCMonth()+1);yearBlock=0;drawPeriod('months');
        };
        const shiftMonth = amount => {
          const year=calendarDay.getUTCFullYear(),month=calendarDay.getUTCMonth()+1;
          const next=civil(year,month+amount,1);
          if(next.getUTCFullYear()<1||next.getUTCFullYear()>9999)return false;
          const last=civil(next.getUTCFullYear(),next.getUTCMonth()+2,0).getUTCDate();
          calendarDay=civil(next.getUTCFullYear(),next.getUTCMonth()+1,Math.min(calendarDay.getUTCDate(),last));
          return true;
        };
        const drawTime = () => {
          const body=popup('time').querySelector('[data-cd-picker-body]');
          body.innerHTML=`<p class="cd-time-preview" data-cd-time-preview>${timeDraft.map(pad).join(':')}</p><div class="cd-time-columns">${['小时','分钟'].map((label,index)=>`<div><span class="cd-time-label" id="${popup('time').id+'-'+index}">${label}</span><div class="cd-time-list" role="listbox" aria-labelledby="${popup('time').id+'-'+index}" data-cd-time-list="${index}">${Array.from({length:index===0?24:60},(_,value)=>`<button type="button" role="option" data-cd-time-unit="${index}" data-cd-time-value="${value}" aria-selected="${value===timeDraft[index]}" tabindex="${value===timeDraft[index]?0:-1}">${pad(value)}</button>`).join('')}</div></div>`).join('')}</div><div class="cd-picker-footer"><button type="button" class="cd-button cd-quiet" data-cd-picker-close>取消</button><button type="button" class="cd-button cd-primary" data-cd-time-confirm>完成选择</button></div>`;
          body.querySelectorAll('[role="option"][aria-selected="true"]').forEach(option=>option.scrollIntoView({block:'nearest'}));
        };
        const chooseTime = (unit,value,focus=false) => {
          timeDraft[unit]=value;
          const list=$(`[data-cd-time-list="${unit}"]`);
          for(const option of list.querySelectorAll('[role="option"]')) {
            const selected=Number(option.dataset.cdTimeValue)===value;
            option.setAttribute('aria-selected',String(selected));option.tabIndex=selected?0:-1;
            if(selected) {if(focus)option.focus({preventScroll:true});option.scrollIntoView({block:'nearest'});}
          }
          $('[data-cd-time-preview]').textContent=timeDraft.map(pad).join(':');
        };
        const open = name => {
          if(picker===name){close(true);return;}
          close();picker=name;popup(name).hidden=false;trigger(name).setAttribute('aria-expanded','true');
          if(name==='time') {
            timeDraft=(validTime(field(name).value)?field(name).value:'10:00').split(':').map(Number);
            drawTime();popup(name).querySelector('[data-cd-time-list="0"] [aria-selected="true"]').focus({preventScroll:true});
          } else {calendarDay=parseDate(field(name).value)||today();yearBlock=0;drawCalendar(true);}
          popup(name).scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
        };
        on(root,'click',event=> {
          const target=event.target.closest('button');if(!target)return;
          if(target.hasAttribute('data-cd-picker-trigger'))open(target.dataset.cdPickerTrigger);
          else if(picker&&target.hasAttribute('data-cd-picker-close'))close(true);
          else if(picker&&target.hasAttribute('data-cd-period')){yearBlock=0;target.dataset.cdPeriod==='days'?drawCalendar(true):drawPeriod(target.dataset.cdPeriod);}
          else if(picker&&target.hasAttribute('data-cd-year-jump'))jumpYear();
          else if(picker&&target.hasAttribute('data-cd-year-block')){yearBlock=Math.max(1,Math.min(9997,yearBlock+Number(target.dataset.cdYearBlock)));drawPeriod('years',false);popup(picker).querySelector(`[data-cd-year-block="${target.dataset.cdYearBlock}"]`)?.focus({preventScroll:true});}
          else if(picker&&target.hasAttribute('data-cd-year')){setPeriod(Number(target.dataset.cdYear),calendarDay.getUTCMonth()+1);drawPeriod('months');}
          else if(picker&&target.hasAttribute('data-cd-month-choice')){setPeriod(calendarDay.getUTCFullYear(),Number(target.dataset.cdMonthChoice));drawCalendar(true);}
          else if(picker&&target.hasAttribute('data-cd-date'))commit(picker,target.dataset.cdDate);
          else if(picker&&target.hasAttribute('data-cd-month')) {
            const amount=Number(target.dataset.cdMonth);
            if(shiftMonth(amount)){drawCalendar();const next=popup(picker).querySelector(`[data-cd-month="${amount}"]`);(next.disabled?popup(picker).querySelector('[data-cd-date][tabindex="0"]'):next).focus({preventScroll:true});}
          } else if(picker==='time'&&target.hasAttribute('data-cd-time-unit'))chooseTime(Number(target.dataset.cdTimeUnit),Number(target.dataset.cdTimeValue));
          else if(picker==='time'&&target.hasAttribute('data-cd-time-confirm'))commit('time',timeDraft.map(pad).join(':'));
        });
        on(root,'keydown',event=> {
          const target=event.target;
          if(target.matches('[data-cd-year-input]')&&event.key==='Enter'){event.preventDefault();jumpYear();return;}
          if(target.matches('[data-cd-field]')&&event.key==='ArrowDown'){event.preventDefault();open(target.dataset.cdField);return;}
          if(target.matches('[data-cd-date]')) {
            calendarDay=parseDate(target.dataset.cdDate);
            const moves={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7};
            let changed=false;
            if(event.key in moves) {calendarDay.setUTCDate(calendarDay.getUTCDate()+moves[event.key]);changed=true;}
            else if(event.key==='Home'||event.key==='End'){const weekday=(calendarDay.getUTCDay()+6)%7;calendarDay.setUTCDate(calendarDay.getUTCDate()+(event.key==='Home'?-weekday:6-weekday));changed=true;}
            else if(event.key==='PageUp'||event.key==='PageDown')changed=shiftMonth(event.key==='PageUp'?-1:1);
            if(changed){event.preventDefault();if(calendarDay.getUTCFullYear()<1||calendarDay.getUTCFullYear()>9999)calendarDay=parseDate(target.dataset.cdDate);drawCalendar(true);}
          } else if(target.matches('[data-cd-time-unit]')) {
            const unit=Number(target.dataset.cdTimeUnit),maximum=unit===0?23:59;
            if(['ArrowUp','ArrowDown','Home','End'].includes(event.key)) {
              event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?maximum:(timeDraft[unit]+(event.key==='ArrowUp'?-1:1)+maximum+1)%(maximum+1);chooseTime(unit,next,true);
            } else if(event.key==='ArrowLeft'||event.key==='ArrowRight') {event.preventDefault();popup('time').querySelector(`[data-cd-time-list="${event.key==='ArrowLeft'?0:1}"] [aria-selected="true"]`).focus({preventScroll:true});}
          }
        });
        on(document,'keydown',event=>{if(picker&&event.key==='Escape'){event.preventDefault();event.stopPropagation();close(true);}});
        // Month navigation replaces the clicked button. Its original event path
        // still belongs to this picker even though the target is now detached.
        const outside = event => {if(picker){const owner=$(`[data-cd-picker="${picker}"]`);if(!owner.contains(event.target)&&!event.composedPath().includes(owner))close();}};
        on(document,'pointerdown',outside);on(document,'click',outside);on(document,'focusin',outside);
        disposers.push(()=>close());
        submit(() => {
          close();
          const start = field('start'), end = field('end'), time = field('time');
          const invalid = [start,end,time].filter(input => input===time?!validTime(input.value):!parseDate(input.value));
          const reversed = parseDate(start.value)&&parseDate(end.value)&&end.value < start.value;
          [start,end,time].forEach(input => input.setAttribute('aria-invalid',String(invalid.includes(input) || (input === end && Boolean(reversed)))));
          $('[data-cd-error]').textContent = invalid.length ? '请填写完整、有效的日期和时间。' : reversed ? '结束日期不能早于开始日期。' : '';
          if (invalid.length || reversed) { (invalid[0] || end).focus(); say('日期尚未确认，请修正标记的字段。'); }
          else say(`已确认 ${start.value} 至 ${end.value}，本地时间 ${time.value}。`);
        });
        break;
      }
      case 'upload': {
        let files = [], nextKey = 0, dragDepth = 0;
        const draw = () => {
          $('[data-cd-files]').innerHTML = files.map(file => `<li data-cd-file-key="${file.key}"><div><strong>${escape(file.name)}</strong><small>${file.size < 1024 ? `${file.size} B` : `${(file.size / 1024).toFixed(1)} KB`}${file.size > 5 * 1024 * 1024 ? ' · 超过 5 MB，不可使用' : ' · 已选择，未上传'}</small></div><button type="button" class="cd-button cd-icon" data-cd-remove-file="${file.key}" aria-label="移除 ${escape(file.name)}">${icon('close')}</button></li>`).join('');
          say(files.length ? `已选择 ${files.length} 个文件${files.some(file => file.size > 5 * 1024 * 1024) ? '，包含超限文件' : ''}。没有上传。` : '尚未选择文件。');
        };
        const add = list => { files.push(...Array.from(list || [], file => ({key:nextKey++,name:file.name,size:file.size}))); draw(); field('files').value = ''; };
        on(field('files'),'change',() => add(field('files').files));
        const zone = $('[data-cd-dropzone]');
        on(zone,'dragenter',event => { event.preventDefault(); dragDepth++; zone.classList.add('cd-is-dragging'); });
        on(zone,'dragover',event => { event.preventDefault(); if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'; });
        on(zone,'dragleave',() => { dragDepth--; if (dragDepth <= 0) zone.classList.remove('cd-is-dragging'); });
        on(zone,'drop',event => { event.preventDefault(); dragDepth = 0; zone.classList.remove('cd-is-dragging'); add(event.dataTransfer?.files); });
        on(root,'click',event => { const remove = event.target.closest?.('[data-cd-remove-file]'); if (!remove) return; files = files.filter(file => file.key !== Number(remove.dataset.cdRemoveFile)); draw(); field('files').focus(); });
        break;
      }
      case 'tabs': {
        const change = key => { const items = records.slice(0,3).filter(item => key === 'all' || (key === 'kept' ? item.kept : item.state === '草稿')); $('[data-cd-panel]').innerHTML = recordRows(items); root.dataset.cdSelectedTab = key; };
        if (motion?.bindTabs) disposers.push(motion.bindTabs($('[data-cd-tablist]'),{panel:$('[data-cd-panel]'),initialKey:'all',onChange:change}));
        // Static markup is complete without a context. No parallel tab-motion implementation.
        break;
      }
      case 'pagination': {
        let page = 1;
        const show = next => {
          page = Math.max(1,Math.min(3,next));
          $('[data-cd-results]').innerHTML = recordRows(records.slice((page-1)*2,page*2));
          $$('[data-cd-page]').forEach(item => { if (Number(item.dataset.cdPage) === page) item.setAttribute('aria-current','page'); else item.removeAttribute('aria-current'); });
          control('previous').disabled = page === 1; control('next').disabled = page === 3;
          root.dataset.cdPage = String(page); say(`第 ${page} 页，显示 ${page*2-1}–${page*2} 条，共 6 条。`); enter($('[data-cd-results]'));
        };
        act('previous',() => show(page-1)); act('next',() => show(page+1));
        on(root,'click',event => { const target = event.target.closest?.('[data-cd-page]'); if (target) show(Number(target.dataset.cdPage)); });
        break;
      }
      case 'menu':
      case 'popover': {
        const trigger = control('disclose'), popup = $('[data-cd-popup]'), disclosure = $('[data-cd-disclosure]');
        const close = (restore = true) => { popup.hidden = true; trigger.setAttribute('aria-expanded','false'); if (restore) trigger.focus({preventScroll:true}); };
        act('disclose',() => { const open = popup.hidden; popup.hidden = !open; trigger.setAttribute('aria-expanded',String(open)); if (open) { enter(popup); if (id === 'popover') field('name').focus(); } });
        on(root,'keydown',event => { if (event.key === 'Escape' && !popup.hidden) { event.preventDefault(); close(); } });
        on(root,'click',event => { if (!disclosure.contains(event.target) && !popup.hidden) close(false); });
        on(disclosure,'focusout',event => { if (event.relatedTarget && !disclosure.contains(event.relatedTarget)) close(false); });
        if (id === 'menu') {
          ['save','copy','remove'].forEach(action => act(`menu-${action}`,() => { say({save:'周末记录已收藏。',copy:'已创建「周末记录的副本」。',remove:'已从此演示中移除周末记录。'}[action]); if (action === 'remove') $('[data-cd-object-name]').textContent = '周末记录（已移除）'; close(); }));
        } else {
          act('close-popup',() => close());
          submit(() => { if (!validName()) return; $('[data-cd-object-name]').textContent = field('name').value.trim(); say(`名称已保存为「${field('name').value.trim()}」。`); close(); });
        }
        break;
      }
      case 'tooltip': {
        const anchor = $('[data-cd-tooltip-anchor]'), tip = $('[data-cd-tooltip]'), trigger = control('tooltip');
        let pending, hover = false, focused = false, dismissed = false;
        const show = () => { clear(pending); if (!dismissed) { tip.hidden = false; enter(tip); } };
        const hideSoon = () => { clear(pending); pending = later(() => { if (!hover && !focused) { tip.hidden = true; dismissed = false; } },100); };
        on(anchor,'pointerenter',() => { hover = true; dismissed = false; show(); });
        on(anchor,'pointerleave',() => { hover = false; hideSoon(); });
        on(trigger,'focus',() => { focused = true; dismissed = false; show(); });
        on(trigger,'blur',() => { focused = false; hideSoon(); });
        on(root,'keydown',event => { if (event.key === 'Escape') { event.preventDefault(); dismissed = true; tip.hidden = true; clear(pending); } });
        // A click also provides the focus-equivalent on touch devices.
        act('tooltip',() => { dismissed = false; show(); });
        break;
      }
      case 'dialog':
      case 'drawer': {
        const dialog = $('[data-cd-dialog]'), opener = control('open-modal');
        const drawer = id === 'drawer';
        let saved = false;
        let closePending;
        const closeNow = () => {
          clear(closePending); closePending = null;
          delete dialog.dataset.drawerState;
          if (dialog.open) dialog.close();
        };
        const closeModal = () => {
          if (!dialog.open) return;
          if (!drawer || motion?.reduced?.matches) { closeNow(); return; }
          clear(closePending);
          dialog.dataset.drawerState = 'closing';
          closePending = later(() => {
            if (dialog.dataset.drawerState === 'closing') closeNow();
          },190);
        };
        const openModal = () => {
          if (dialog.open) {
            if (drawer && dialog.dataset.drawerState === 'closing') {
              clear(closePending); closePending = null;
              dialog.dataset.drawerState = 'open';
              field('name').focus({preventScroll:true});
            }
            return;
          }
          saved = false;
          if (drawer) dialog.dataset.drawerState = 'closed';
          dialog.showModal();
          if (drawer) {
            dialog.getBoundingClientRect();
            dialog.dataset.drawerState = 'open';
          } else enter(dialog);
          field('name').focus({preventScroll:true});
        };
        act('open-modal',openModal);
        act('close-modal',closeModal);
        on(dialog,'cancel',event => { event.preventDefault(); closeModal(); });
        if (drawer) on(dialog,'click',event => {
          const box=dialog.getBoundingClientRect();
          if(event.target===dialog&&(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom))closeModal();
        });
        on(dialog,'keydown',event => {
          if(event.key!=='Tab')return;
          const targets=[...dialog.querySelectorAll('button,input,select,textarea,a[href],[tabindex]')].filter(element=>!element.disabled&&element.tabIndex>=0&&element.getClientRects().length);
          if(!targets.length){event.preventDefault();dialog.tabIndex=-1;dialog.focus();return;}
          const first=targets[0],last=targets.at(-1);
          if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
          else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
        });
        on(dialog,'close',() => { clear(closePending);closePending=null;delete dialog.dataset.drawerState;if (disposed) return; if (!saved) say('已关闭，未提交的草稿仍保留。'); if (opener.isConnected) opener.focus({preventScroll:true}); });
        submit(() => { if (!validName()) return; saved = true; say(`记录「${field('name').value.trim()}」已保存。`); $('.cd-modal-preview > .cd-help').textContent = field('name').value.trim(); closeModal(); });
        break;
      }
      case 'toast': {
        const toast = $('[data-cd-toast]');
        let pending, hovering = false, focusing = false;
        const dismiss = () => { clear(pending); toast.hidden = true; root.dataset.cdState = 'dismissed'; };
        const schedule = () => { clear(pending); if (!hovering && !focusing && !toast.hidden) pending = later(dismiss,6000); };
        act('show-toast',() => { toast.hidden = false; $('[data-cd-toast-message]').textContent = '更改已保存。'; root.dataset.cdState = 'visible'; enter(toast); schedule(); });
        act('dismiss-toast',() => { dismiss(); control('show-toast').focus(); });
        on(toast,'pointerenter',() => { hovering = true; clear(pending); });
        on(toast,'pointerleave',() => { hovering = false; schedule(); });
        on(toast,'focusin',() => { focusing = true; clear(pending); });
        on(toast,'focusout',event => { focusing = toast.contains(event.relatedTarget); schedule(); });
        break;
      }
      case 'alert':
        act('retry-alert',(_,target) => {
          const panel = $('[data-cd-recoverable]'); panel.classList.remove('cd-danger'); panel.classList.add('cd-success');
          $('[data-cd-alert-title]').textContent = '演示连接已恢复'; $('[data-cd-alert-copy]').textContent = '草稿保持不变。未进行真实网络连接。';
          target.textContent = '已恢复'; target.setAttribute('aria-disabled','true'); say('演示连接已恢复，本地草稿仍保留。');
        });
        break;
      case 'list':
        on(root,'click',event => { const item = event.target.closest?.('[data-cd-list-index]'); if (!item) return; $$('[data-cd-list-index]').forEach(button => button.setAttribute('aria-pressed',String(button === item))); const record = records[Number(item.dataset.cdListIndex)]; $('[data-cd-detail]').innerHTML = `<strong>${record.name}</strong><p>${record.date} · ${record.state}。已选择此记录。</p>`; say(`已选择${record.name}。`); enter($('[data-cd-detail]')); });
        break;
      case 'table': {
        let key = 'date', direction = 'descending';
        on(root,'click',event => {
          const target = event.target.closest?.('[data-cd-sort]'); if (!target) return;
          const next = target.dataset.cdSort; direction = key === next && direction === 'ascending' ? 'descending' : 'ascending'; key = next;
          const sorted = records.slice(0,4).sort((a,b) => a[key].localeCompare(b[key],'zh-CN') * (direction === 'ascending' ? 1 : -1));
          $('[data-cd-tbody]').innerHTML = tableRows(sorted);
          $$('[data-cd-sort-header]').forEach(header => header.setAttribute('aria-sort',header.dataset.cdSortHeader === key ? direction : 'none'));
          say(`按${key === 'name' ? '名称' : '日期'}${direction === 'ascending' ? '升序' : '降序'}排列。`);
          enter($('[data-cd-tbody]'));
        });
        break;
      }
      case 'empty':
        act('add-record',(_,target) => { $('[data-cd-empty-title]').textContent = '第一条记录已添加'; $('[data-cd-empty-copy]').textContent = '「周末记录」现已出现在本地示例中。'; target.textContent = '已添加'; target.setAttribute('aria-disabled','true'); root.dataset.cdState = 'created'; say('已创建一条本地示例记录。'); });
        act('clear-filter',(_,target) => { $('[data-cd-filter-title]').textContent = '已显示全部 6 条记录'; $('[data-cd-filter-copy]').textContent = '已清除「已共享」筛选，没有修改记录内容。'; target.textContent = '筛选已清除'; target.setAttribute('aria-disabled','true'); say('筛选已清除。'); });
        break;
      case 'skeleton': {
        let pending;
        const set = loading => { $('[data-cd-skeleton]').hidden = !loading; $('[data-cd-skeleton-result]').hidden = loading; $('[data-cd-skeleton-region]').setAttribute('aria-busy',String(loading)); root.dataset.cdState = loading ? 'loading' : 'complete'; };
        const finish = () => { clear(pending); set(false); $('[data-cd-skeleton]').classList.remove('cd-is-running'); say('3 条记录已加载。'); enter($('[data-cd-skeleton-result]')); };
        act('reveal',finish);
        act('reload',() => { clear(pending); set(true); $('[data-cd-skeleton]').classList.add('cd-is-running'); say('正在重新加载本地演示记录…'); pending = later(finish,1200); });
        break;
      }
      case 'loading': {
        const set = state => {
          const running = state === 'loading'; root.dataset.cdState = state;
          $('[data-cd-loading-region]').setAttribute('aria-busy',String(running));
          $('[data-cd-loader] .fold-loader').classList.toggle('is-running',running);
          $('[data-cd-loading-title]').textContent = {loading:'正在读取记录…',complete:'记录已读取',cancelled:'读取已取消'}[state];
          $('[data-cd-loading-copy]').textContent = running ? '总量未知。可完成或取消这次本地等待演示。' : state === 'complete' ? '演示已完成，没有继续运行的加载动画。' : '演示已停止，可以重新开始。';
          control('start-loading').disabled = running; control('finish-loading').disabled = !running; control('cancel-loading').disabled = !running;
          say(running ? '本地等待演示已开始。' : state === 'complete' ? '读取演示已完成。' : '读取演示已取消。');
        };
        act('start-loading',() => set('loading')); act('finish-loading',() => { set('complete'); control('start-loading').focus(); }); act('cancel-loading',() => { set('cancelled'); control('start-loading').focus(); });
        break;
      }
      case 'progress': {
        let count = 2, phase = 'known';
        const processed = records.slice(0,2).map(item => item.name.trim());
        const native = $('[data-cd-progress]'), fill = $('[data-cd-progress-fill]');
        const update = () => {
          const unknown = phase === 'unknown', cancelled = phase === 'cancelled', complete = count === records.length;
          root.dataset.cdState = phase; $('[data-cd-progress-region]').setAttribute('aria-busy',String(unknown));
          $('[data-cd-progress-track]').hidden = unknown; $('[data-cd-progress-unknown]').hidden = !unknown;
          $('[data-cd-progress-unknown] .fold-loader').classList.toggle('is-running',unknown);
          if (unknown) native.removeAttribute('value');
          else if (motion?.progress) motion.progress(native,fill,count);
          else { native.value = count; fill.dataset.instant = 'true'; fill.style.setProperty('--progress-ratio',String(count / records.length)); }
          fill.dataset.flowing=String(!unknown&&!cancelled&&!complete&&count>0);
          native.textContent = unknown ? '总量未知' : `${count} / ${records.length}`;
          $('[data-cd-progress-count]').textContent = unknown ? '总量未知' : `${cancelled ? '已取消 · ' : ''}已完成 ${count} / 6 项`;
          $$('[data-cd-progress-items] li').forEach((item,index) => { item.dataset.cdDone = String(index < count); item.querySelector('span').innerHTML = index < count ? icon('check') : '·'; item.querySelector('small').textContent = index < count ? '已完成' : cancelled ? '未处理' : '待处理'; });
          control('advance-progress').disabled = unknown || cancelled || complete;
          control('cancel-progress').disabled = cancelled || complete;
          control('known-progress').hidden = !unknown;
        };
        act('advance-progress',() => { if (phase !== 'known' || count >= records.length) return; processed.push(records[count].name.trim()); count = processed.length; if (count === records.length) phase = 'complete'; update(); say(count === records.length ? '6 条示例记录已全部整理完成。' : `已整理「${processed[count-1]}」，完成 ${count} / 6 项。`); if (count === records.length) control('restart-progress').focus(); });
        act('cancel-progress',() => { phase = 'cancelled'; update(); say(`已取消，保留已完成的 ${count} 项；其余未处理。`); control('restart-progress').focus(); });
        act('restart-progress',() => { count = 0; processed.length = 0; phase = 'unknown'; update(); say('正在确认总量；未知阶段不显示百分比。点击确认总量继续。'); });
        act('known-progress',() => { phase = 'known'; update(); say('总量已确认，共 6 项。每次点击处理下一项。'); control('advance-progress').focus(); });
        break;
      }
      case 'stepper': {
        let step = 0, complete = false;
        const show = () => {
          $$('[data-cd-step]').forEach((item,index) => { if (!complete && index === step) item.setAttribute('aria-current','step'); else item.removeAttribute('aria-current'); item.dataset.cdComplete = String(complete || index < step); item.querySelector('.cd-step-marker').innerHTML = complete || index < step ? icon('check') : String(index+1); });
          $$('[data-cd-step-panel]').forEach((panel,index) => { panel.hidden = index !== step; });
          $('[data-cd-review-name]').textContent = field('name').value.trim(); $('[data-cd-review-category]').textContent = field('category').value;
          control('back-step').disabled = step === 0 || complete; $('[data-cd-next-step]').hidden = complete; control('restart-step').hidden = !complete;
          $('[data-cd-next-step]').textContent = step === 2 ? '创建记录' : '下一步';
          root.dataset.cdStep = String(step + 1); root.dataset.cdState = complete ? 'complete' : 'editing';
          enter($(`[data-cd-step-panel="${step}"]`));
          say(complete ? `记录「${field('name').value.trim()}」已创建，仅保存在此演示中。` : `第 ${step+1} / 3 步。返回修改不会清空已填写内容。`);
        };
        submit(() => { if (complete || (step === 0 && !validName())) return; if (step < 2) step++; else complete = true; show(); const focusTarget = complete ? control('restart-step') : step === 1 ? window.RosemarySelect.control(field('category')) : $('[data-cd-next-step]'); focusTarget.focus(); });
        act('back-step',() => { if (step > 0) step--; show(); (step === 0 ? field('name') : window.RosemarySelect.control(field('category'))).focus(); });
        act('restart-step',() => { step = 0; complete = false; show(); field('name').focus(); });
        break;
      }
      default: break; // Link, breadcrumb, card, badge and avatar are semantic static examples.
    }

    const cleanup = () => {
      if (disposed) return;
      disposed = true;
      abort.abort();
      timers.forEach(timer => clearTimeout(timer)); timers.clear();
      disposers.forEach(dispose => { if (typeof dispose === 'function') dispose(); });
      $$('dialog[open]').forEach(dialog => dialog.close());
      $$('[data-cd-popup], [data-cd-tooltip], [data-cd-toast]').forEach(element => { element.hidden = true; });
      $$('.is-running, .cd-is-running').forEach(element => element.classList.remove('is-running','cd-is-running'));
      motion?.cancelTree?.(root);
      root.getAnimations?.({subtree:true}).forEach(animation => animation.cancel());
      mounted.delete(root);
    };
    mounted.set(root,cleanup);
    return cleanup;
  }

  window.RosemaryComponentDemos = {ids:[...ids],render,mount};
})();
