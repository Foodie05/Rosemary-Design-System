(() => {
  'use strict';
  const {icon, escape} = window.RosemaryUI;
  const {sections, renderers, pageShell, jump} = window.RosemaryPages;
  const cases = [
    {id:'music',title:'歌曲播放',brand:'lilt',theme:'lilt',icon:'play',summary:'把内容、队列和播放控制放在清晰的三个层级。',rules:[['色彩与品牌','暖陶色强调播放动作；官方 Logo 保留原始绿色。'],['控制与状态','播放、收藏和当前曲目都有文字与图形状态；进度可用键盘调整。'],['动态与边界','只模拟进度，不输出声音。减少动态时取消封面动效，控制仍可使用。']]},
    {id:'account',title:'登录与注册',brand:'epass',theme:'epass',icon:'lock',summary:'先说明用途，再让用户完成当前这一件事。',rules:[['表单层级','登录与注册分开呈现，标签持续可见，必填条件放在输入旁。'],['错误与恢复','验证定位到具体字段，保留输入，先修正再提交。'],['隐私与边界','仅在页面内验证格式，不存储密码、不创建账户、不连接身份服务。']]},
    {id:'users',title:'用户管理',brand:'vigilo',theme:'vigilo',icon:'users',summary:'以列表完成筛选，以详情确认每次权限变更。',rules:[['信息密度','姓名、角色、状态与操作各有固定位置；窄屏以同一组信息重排。'],['权限与反馈','打开详情后调整角色或停用成员，用文字说明当前本地状态。'],['可逆与边界','停用可恢复，演示成员保存在内存，离开本章后恢复初始数据。']]},
    {id:'search',title:'搜索界面',brand:'folio',theme:'epass',icon:'search',summary:'让查询、范围、结果和没有结果时的下一步都容易找到。',rules:[['查询与范围','搜索输入和分类共同决定结果，结果数量即时更新。'],['结果与空态','每项提供标题、类型与摘要；无结果时给出可直接尝试的操作。'],['语义与边界','内容全部为本地示例；结果预览不跳转到不存在的外部页面。']]}
  ];
  const tracks = [
    {title:'沿着海岸走',artist:'林间来信',album:'慢一点的风景',duration:228,color:'warm'},
    {title:'玻璃窗上的雨',artist:'午后电台',album:'慢一点的风景',duration:196,color:'blue'},
    {title:'一小片晴天',artist:'山谷回声',album:'慢一点的风景',duration:245,color:'green'},
    {title:'灯亮起来之前',artist:'林间来信',album:'慢一点的风景',duration:211,color:'purple'}
  ];
  const initialUsers = [
    {id:1,name:'许知夏',initial:'夏',email:'zhixia@example.test',role:'管理员',team:'设计',active:true,color:'purple'},
    {id:2,name:'陈亦舟',initial:'舟',email:'yizhou@example.test',role:'编辑者',team:'产品',active:true,color:'green'},
    {id:3,name:'林可心',initial:'心',email:'kexin@example.test',role:'编辑者',team:'设计',active:true,color:'warm'},
    {id:4,name:'周予安',initial:'安',email:'yuan@example.test',role:'查看者',team:'研发',active:false,color:'blue'},
    {id:5,name:'宋清和',initial:'和',email:'qinghe@example.test',role:'查看者',team:'产品',active:true,color:'green'}
  ];
  const documents = [
    {id:1,title:'从一枚按钮开始',category:'设计笔记',description:'主动作、次动作与安静的反馈。记录一次表单界面的设计取舍。',date:'10 月 12 日',body:'让主要动作对应用户当下的目标。次要操作保留可见入口；提交失败时保留输入，并把错误放在相关字段附近。'},
    {id:2,title:'慢一点的风景',category:'音乐灵感',description:'沿着海岸走，把城市里的声音收进一张播放列表。',date:'10 月 10 日',body:'这份音乐灵感清单包含沿着海岸走、玻璃窗上的雨与一小片晴天。音乐标题与作者均为演示内容。'},
    {id:3,title:'给每一种状态一个名字',category:'设计笔记',description:'用明确的状态文案说明保存、同步、失败和恢复。',date:'10 月 08 日',body:'说明事实、后果和下一步。把“保存到此设备”和“已同步”区分开，让用户理解数据实际所在的位置。'},
    {id:4,title:'秋日散步清单',category:'生活记录',description:'一条沿河的小路、一家常去的书店，和暂时不安排的下午。',date:'10 月 06 日',body:'带上水和一件薄外套。路线从河边开始，经过书店；可以随时结束，也可以把行程留给另一天。'},
    {id:5,title:'雨天里的声音',category:'音乐灵感',description:'雨落在窗沿，远处驶过的电车，还有安静的钢琴。',date:'10 月 04 日',body:'把喜欢的环境声音记下来，按自己的节奏收听。本地演示不会播放音频，也不会请求麦克风权限。'},
    {id:6,title:'我的书桌整理记录',category:'生活记录',description:'让常用物品容易拿到，把桌面留给正在做的事。',date:'10 月 01 日',body:'留下每天使用的物品，其余放到可找到的位置。整理的目的在于方便使用，可以按自己的习惯继续调整。'}
  ];
  let host = null, abort = null, timer = null, state, caseTabs = null;
  let detailTabs = [];
  let filterTabs = null, categoryTabs = null;
  const time = seconds => `${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
  const action = (label, name, variant='secondary', extra='') => `<button type="button" class="button ${variant}" data-case-action="${name}" ${extra}>${label}</button>`;
  const smallIcon = (name, label, extra='') => `<button type="button" class="cs-icon-button" aria-label="${label}" ${extra}>${icon(name)}</button>`;
  const fullBrand = name => window.RosemaryUI.brandLockup(name,{size:48,className:'cs-brand'});
  const compactBrand = (name,label=true) => window.RosemaryUI.brandMark(name,{size:32,label,className:'cs-brand-mark'});
  function art(scene, color='warm') {
    const colors={warm:['#F8E6D5','#99502D','#D2B567'],blue:['#DDEBF6','#34516C','#8CB5C5'],green:['#DDEFE7','#24675E','#A4BF94'],purple:['#E8E1F0','#78618B','#B5A0C9']};
    const [fill,line,accent]=colors[color];
    const content = scene==='music'
      ? `<circle cx="120" cy="110" r="76" fill="${fill}" stroke="none"/><path d="M70 112V99a50 50 0 0 1 100 0v13"/><rect x="62" y="106" width="23" height="48" rx="10" fill="${accent}"/><rect x="155" y="106" width="23" height="48" rx="10" fill="${accent}"/><path d="M85 108v39m70-39v39"/><path d="M108 111v36m12-45v54m12-45v36"/><path d="M73 184h94"/>`
      : scene==='account'
        ? `<circle cx="120" cy="110" r="76" fill="${fill}" stroke="none"/><rect x="75" y="58" width="90" height="111" rx="14"/><path d="M94 58V45h52v13M93 169v14h54v-14"/><circle cx="120" cy="111" r="24" fill="${accent}"/><path d="m109 111 8 8 15-17"/><path d="M68 184h104"/>`
        : `<circle cx="120" cy="110" r="76" fill="${fill}" stroke="none"/><circle cx="105" cy="96" r="35" fill="var(--surface)"/><circle cx="105" cy="96" r="25" stroke="${accent}"/><path d="M89 96a16 16 0 0 1 16-16"/><path d="m130 121 10 10"/><rect x="0" y="0" width="18" height="52" rx="9" transform="translate(135 126) rotate(-45)" fill="${accent}"/><path d="M65 184h110"/>`;
    return `<svg class="cs-illustration" viewBox="0 0 240 220" fill="none" stroke="${line}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${content}</svg>`;
  }
  function appHeader(name, context,{entry=false}={}) {
    const identity=entry?`<span class="cs-entry-brand-full">${fullBrand(name)}</span><span class="cs-entry-brand-compact">${compactBrand(name)}</span>`:compactBrand(name);
    return `<header class="cs-app-header">${identity}<div class="cs-app-context"><span>${escape(context)}</span><span class="cs-demo-pill">本地演示</span></div></header>`;
  }
  function music() {
    const track=tracks[state.track];
    return `${appHeader('lilt','个人音乐库')}<div class="cs-music-layout"><aside class="cs-music-side"><p class="cs-eyebrow">我的空间</p><div class="cs-side-current">${icon('music')}慢一点的风景</div><p class="cs-side-note">一张给闲暇时光的<br>演示播放列表。</p><div class="cs-side-bottom">${icon('heart')}<span>已收藏 <b id="cs-favorite-count" aria-live="polite">${state.favorites.size}</b> 首</span></div></aside><div class="cs-music-main"><div class="cs-album-header"><div class="cs-album-art">${art('music')}</div><div class="cs-album-copy"><p class="cs-eyebrow">精选歌单 · 4 首演示曲目</p><h2>慢一点的风景</h2><p>沿着海岸、穿过雨天，<br>把时间留给喜欢的声音。</p><div class="cs-album-meta">Rosemary 编辑室 · 14 分 40 秒</div></div></div><div class="cs-track-heading"><h3>播放队列</h3><span>选择曲目，点击播放模拟进度</span></div><ol class="cs-track-list">${tracks.map((t,i)=>`<li class="cs-track${i===state.track?' is-current':''}" data-track-row="${i}"><button type="button" class="cs-track-select" data-case-track="${i}" aria-label="选择${t.title}"${i===state.track?' aria-current="true"':''}><span class="cs-track-number">${String(i+1).padStart(2,'0')}</span><span class="cs-track-title"><strong>${t.title}</strong><small>${t.artist}</small></span></button><span class="cs-track-duration">${time(t.duration)}</span>${smallIcon('heart',`${state.favorites.has(i)?'取消收藏':'收藏'}${t.title}`,`data-case-favorite="${i}" aria-pressed="${state.favorites.has(i)}"`)}</li>`).join('')}</ol></div></div><footer class="cs-player"><div class="cs-player-track"><div class="cs-mini-cover" data-color="${track.color}">${icon('music')}</div><span><strong id="cs-playing-title">${track.title}</strong><small id="cs-playing-artist">${track.artist}</small></span></div><div class="cs-player-center"><div class="cs-player-buttons">${smallIcon('arrow-left','上一首','data-case-action="previous"')}<button type="button" class="cs-play-button" data-case-action="play" aria-label="${state.playing?'暂停进度演示':'开始进度演示'}" aria-pressed="${state.playing}">${state.playing?'<span class="cs-pause-symbol" aria-hidden="true"></span>':icon('play')}</button>${smallIcon('arrow','下一首','data-case-action="next"')}</div><div class="cs-progress"><span id="cs-current-time">${time(state.progress)}</span><label class="sr-only" for="cs-seek">歌曲进度（模拟）</label><input id="cs-seek" type="range" min="0" max="${track.duration}" value="${state.progress}" aria-valuetext="${time(state.progress)}，总时长${time(track.duration)}"><span id="cs-duration">${time(track.duration)}</span></div></div><p class="cs-playback-note" id="cs-playback-note">${state.playing?'正在模拟进度 · 无音频输出':'已暂停 · 无音频输出'}</p></footer>`;
  }
  function account() {
    const register=state.authMode==='register';
    return `${appHeader('epass','账号入口',{entry:true})}<div class="cs-account-layout"><aside class="cs-account-story"><div><p class="cs-eyebrow">一个入口，安心开始</p><h2>让日常的小事，<br>更容易一点。</h2><p>清楚的选择，安静的界面。<br>从你想做的第一件事开始。</p></div><div class="cs-account-art">${art('account','purple')}</div><p class="cs-story-foot">${icon('shield')}这个示例只在当前页面验证输入。</p></aside><div class="cs-account-main"><div class="cs-auth-tabs" role="tablist" aria-label="账号表单"><button type="button" role="tab" id="cs-login-tab" data-case-auth="login" data-tab-key="login" aria-selected="${!register}" aria-controls="cs-auth-panel" tabindex="${register?-1:0}">登录</button><button type="button" role="tab" id="cs-register-tab" data-case-auth="register" data-tab-key="register" aria-selected="${register}" aria-controls="cs-auth-panel" tabindex="${register?0:-1}">注册</button></div><section class="cs-auth-panel" id="cs-auth-panel" role="tabpanel" aria-labelledby="${register?'cs-register-tab':'cs-login-tab'}">${accountContent()}</section></div></div>`;
  }
  function accountContent() {
    const register=state.authMode==='register';
    return `<h2>${register?'创建你的账户':'欢迎回来'}</h2><p class="cs-auth-intro">${register?'填写信息，体验注册表单的验证流程。':'填写演示信息，体验登录表单的验证流程。'}</p><form id="cs-auth-form" novalidate>${register?authField('name','称呼','text','例如：知夏','用于表单演示，不会被保存。'):''}${authField('email','邮箱','email','name@example.test','可使用任意有效邮箱格式。')}${authField('password','密码','password','输入至少 8 个字符','至少 8 个字符，同时包含字母和数字。')}<label class="cs-check"><input type="checkbox" name="acknowledge"><span class="cs-checkbox-visual" aria-hidden="true"></span><span>我了解这是本地演示，${register?'不会创建真实账户':'不会验证真实账号'}。</span></label><p class="cs-field-error" id="cs-error-acknowledge"></p><button type="submit" class="button primary cs-full">${register?'验证注册信息':'验证登录信息'}${icon('arrow')}</button><div class="cs-auth-message" id="cs-auth-message" role="status"></div></form><p class="cs-auth-foot">${icon('lock')}输入仅保留在当前表单中，离开案例即清空。</p>`;
  }
  function authField(name,label,type,placeholder,help) { return `<div class="cs-field"><label for="cs-auth-${name}">${label}<span>必填</span></label><div class="cs-input-wrap"><input id="cs-auth-${name}" name="${name}" type="${type}" placeholder="${placeholder}" autocomplete="off" aria-describedby="cs-help-${name} cs-error-${name}"${name==='password'?' minlength="8"':''}>${name==='password'?smallIcon('eye-off','显示密码','data-case-action="password" aria-pressed="false"'):''}</div><p class="cs-field-help" id="cs-help-${name}">${help}</p><p class="cs-field-error" id="cs-error-${name}"></p></div>`; }
  function filteredUsers() { const q=state.userQuery.toLowerCase();return state.users.filter(u=>(state.userFilter==='all'||(state.userFilter==='active'?u.active:!u.active))&&`${u.name} ${u.email} ${u.team} ${u.role}`.toLowerCase().includes(q)); }
  function userRows() {
    const users=filteredUsers();
    return users.length ? `<table class="cs-user-table"><thead><tr><th scope="col">成员</th><th scope="col">角色 / 团队</th><th scope="col">状态</th><th scope="col"><span class="sr-only">操作</span></th></tr></thead><tbody>${users.map(u=>`<tr${state.userId===u.id?' class="is-selected"':''}><td><div class="cs-person"><span class="cs-avatar" data-color="${u.color}">${u.initial}</span><span><strong>${u.name}</strong><small>${u.email}</small></span></div></td><td><strong class="cs-role">${u.role}</strong><small class="cs-team">${u.team}</small></td><td><span class="cs-status ${u.active?'active':'inactive'}">${icon(u.active?'check':'lock')}${u.active?'可访问':'已停用'}</span></td><td><button type="button" class="button quiet small" data-case-user="${u.id}" aria-label="查看${u.name}详情">详情${icon('chevron')}</button></td></tr>`).join('')}</tbody></table>` : `<div class="cs-table-empty">${icon('search')}<h3>没有符合条件的成员</h3><p>换一个姓名，或清除筛选查看全部成员。</p>${action('清除筛选','reset-users','secondary')}</div>`;
  }
  function userDetail() {
    const u=state.users.find(u=>u.id===state.userId);
    if(!u)return `<div class="cs-detail-placeholder">${icon('users')}<h3>成员详情</h3><p>选择列表中的“详情”，<br>查看权限并体验本地变更。</p></div>`;
    return `<div class="cs-detail-head"><h3>成员详情</h3>${smallIcon('close','关闭成员详情','data-case-action="close-user"')}</div><div class="cs-detail-person"><span class="cs-avatar large" data-color="${u.color}">${u.initial}</span><h4>${u.name}</h4><p>${u.email}</p></div><dl class="cs-member-facts"><div><dt>所在团队</dt><dd>${u.team}</dd></div><div><dt>当前状态</dt><dd id="cs-member-status">${u.active?'可访问':'已停用'}</dd></div></dl><fieldset class="cs-role-picker"><legend>访问角色</legend><p>只修改当前演示成员的本地权限。</p>${['管理员','编辑者','查看者'].map(role=>`<label><input type="radio" name="cs-role" value="${role}"${u.role===role?' checked':''}><span class="cs-radio-visual" aria-hidden="true"></span><span><strong>${role}</strong><small>${role==='管理员'?'管理成员与全部内容':role==='编辑者'?'创建和编辑内容':'仅查看已共享内容'}</small></span></label>`).join('')}</fieldset>${action(u.active?'停用此成员':'恢复此成员','toggle-user','secondary')}<p class="cs-detail-foot">停用后可以恢复。变更不影响真实人员。</p>`;
  }
  function users() {
    return `${appHeader('vigilo','青禾工作室 · 演示空间')}<div class="cs-users-main"><header class="cs-work-heading"><div><p class="cs-eyebrow">工作空间 / 成员</p><h2>让协作各就其位</h2><p>查看团队成员，分配合适的访问权限。</p></div><span class="cs-total"><strong>${state.users.length}</strong> 位演示成员</span></header><div class="cs-users-summary"><span>${icon('users')}全部成员 <b>${state.users.length}</b></span><span>${icon('shield-check')}可访问 <b id="cs-active-count">${state.users.filter(u=>u.active).length}</b></span><span>${icon('lock')}管理员 <b id="cs-admin-count">${state.users.filter(u=>u.role==='管理员').length}</b></span></div><div class="cs-users-workspace"><div class="cs-member-list"><div class="cs-user-toolbar"><div class="cs-filter-buttons" role="tablist" aria-label="成员状态筛选">${[['all','全部'],['active','可访问'],['inactive','已停用']].map(([id,label])=>`<button type="button" role="tab" id="cs-filter-${id}" data-case-filter="${id}" data-tab-key="${id}" aria-controls="cs-user-rows" aria-selected="${state.userFilter===id}" tabindex="${state.userFilter===id?0:-1}">${label}</button>`).join('')}</div><label class="cs-search-field">${icon('search')}<span class="sr-only">搜索成员姓名、邮箱、团队或角色</span><input id="cs-user-search" type="search" placeholder="搜索姓名、邮箱、团队" value="${escape(state.userQuery)}"></label></div><p class="cs-result-count" id="cs-user-count" role="status">${filteredUsers().length} 位成员</p><div id="cs-user-rows" role="tabpanel" aria-labelledby="cs-filter-${state.userFilter}">${userRows()}</div></div><aside class="cs-user-detail" id="cs-user-detail" aria-label="成员详情">${userDetail()}</aside></div><p class="cs-work-foot">${icon('info')}成员、邮箱与权限均为演示数据，变更只保留到离开本章。</p><div class="cs-inline-message" id="cs-user-message" role="status"></div></div>`;
  }
  function results() { const words=state.searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);return documents.filter(d=>(state.searchCategory==='全部'||d.category===state.searchCategory)&&words.every(w=>`${d.title} ${d.description} ${d.body} ${d.category}`.toLowerCase().includes(w))); }
  function searchResults() {
    const found=results();
    if(!found.length)return `<div class="cs-search-empty"><div>${art('search','purple')}</div><h3>没有找到${state.searchQuery?`“${escape(state.searchQuery)}”`:'符合分类的内容'}</h3><p>试试更短的关键词，或在全部分类中查找。</p><div class="button-row">${action('清除搜索','reset-search','secondary')}${action('试试“设计”','try-design','quiet')}</div></div>`;
    return `<div class="cs-search-result-list">${found.map(d=>`<article class="cs-search-result"><span class="cs-result-symbol">${icon(d.category==='设计笔记'?'pencil':d.category==='音乐灵感'?'music':'book')}</span><div><div class="cs-result-meta"><span>${d.category}</span><span>${d.date}</span></div><h3><button type="button" data-case-document="${d.id}" aria-expanded="${state.documentId===d.id}" aria-controls="cs-document-${d.id}">${d.title}</button></h3><p>${d.description}</p>${state.documentId===d.id?`<div class="cs-document-preview" id="cs-document-${d.id}"><strong>内容预览</strong><p>${d.body}</p><small>演示内容 · 仅供浏览</small></div>`:`<div id="cs-document-${d.id}" hidden></div>`}</div><button type="button" class="cs-icon-button" data-case-document="${d.id}" aria-label="${state.documentId===d.id?'收起':'预览'}${d.title}" aria-expanded="${state.documentId===d.id}" aria-controls="cs-document-${d.id}">${icon(state.documentId===d.id?'chevron':'arrow')}</button></article>`).join('')}</div>`;
  }
  function search() {
    return `${appHeader('folio','个人内容库')}<div class="cs-search-main"><header class="cs-search-heading"><p class="cs-eyebrow">留住灵感，也找得到</p><h2>你的内容，随时可寻。</h2><p>从设计笔记、音乐灵感和生活记录中找回想法。</p></header><form class="cs-query-form" id="cs-query-form" role="search"><label for="cs-query" class="sr-only">搜索本地演示内容</label>${icon('search')}<input type="search" id="cs-query" placeholder="搜索标题、内容或关键词" value="${escape(state.searchQuery)}"><button type="submit" class="button primary">搜索</button></form><div class="cs-suggestions"><p>试试这些关键词：</p><div class="cs-suggestion-options">${['设计','雨天','散步'].map(word=>`<button type="button" data-case-query="${word}">${word}</button>`).join('')}</div></div><div class="cs-search-categories" role="tablist" aria-label="内容分类">${['全部','设计笔记','音乐灵感','生活记录'].map((c,i)=>`<button type="button" role="tab" id="cs-category-${i}" data-case-category="${c}" data-tab-key="${c}" aria-controls="cs-search-results" aria-selected="${state.searchCategory===c}" tabindex="${state.searchCategory===c?0:-1}">${c}</button>`).join('')}</div><div class="cs-search-results-heading"><h3>${state.searchQuery?'搜索结果':'全部内容'}</h3><span id="cs-search-count" role="status">${results().length} 条演示内容</span></div><div id="cs-search-results" role="tabpanel" aria-labelledby="cs-category-0">${searchResults()}</div><p class="cs-search-foot">${icon('info')}folio 为演示子品牌，搜索只查询本页内置内容。</p></div>`;
  }
  function panel() {
    const current=cases.find(c=>c.id===state.selected);
    const content={music,account,users,search}[current.id]();
    return `<div class="cs-case-intro"><div><span class="cs-eyebrow">${String(cases.indexOf(current)+1).padStart(2,'0')} / ${current.brand} · 演示产品</span><h2 id="cs-selected-title">${current.title}</h2></div><p>${current.summary}</p></div><div class="cs-app cs-theme-${current.theme}" data-case-app="${current.id}">${content}</div><aside class="cs-design-notes" aria-label="${current.title}的规范应用">${current.rules.map(([title,text],i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><h3>${title}</h3><p>${text}</p></div>`).join('')}</aside>`;
  }
  sections.cases=[jump('case-gallery','页面案例'),jump('case-connections','关联规范')];
  renderers.cases=() => {
    reset();
    return pageShell('cases','把规范放进真实的页面','四个完整的产品场景，把品牌、层级、表单、反馈和交互放在一起。切换案例，直接体验 Rosemary 规范如何支持一项具体任务。',`<section id="case-gallery" class="cs-gallery"><div class="cs-case-tabs" role="tablist" aria-label="典型案例">${cases.map((c,i)=>`<button type="button" role="tab" id="cs-tab-${c.id}" data-case-tab="${c.id}" data-tab-key="${c.id}" aria-selected="${i===0}" aria-controls="cs-case-panel" tabindex="${i===0?0:-1}">${icon(c.icon)}${c.title}</button>`).join('')}</div><section id="cs-case-panel" role="tabpanel" aria-labelledby="cs-tab-music">${panel()}</section></section><section class="cs-connections section" id="case-connections"><h2>从页面回到规范</h2><p>每个案例使用同一套基础规则。需要实现某项细节时，可回到对应条目检查完整状态和交付要求。</p><div>${[['identity','品牌资产与子品牌','leaf'],['colors','主题与语义颜色','palette'],['components','组件结构与状态','grid'],['accessibility','键盘与可访问性','accessible']].map(([id,title,symbol])=>`<a href="#/${id}">${icon(symbol)}<span>${title}</span>${icon('arrow')}</a>`).join('')}</div></section>`,['四个完整页面','本地交互演示','不连接真实服务']);
  };
  function reset() { state={selected:'music',track:0,playing:false,progress:0,favorites:new Set(),authMode:'login',users:initialUsers.map(u=>({...u})),userQuery:'',userFilter:'all',userId:null,searchQuery:'',searchCategory:'全部',documentId:null}; }
  function stopTimer() { clearInterval(timer);timer=null; }
  function updatePlayer() {
    if(!host?.isConnected||state.selected!=='music')return;
    const track=tracks[state.track], seek=host.querySelector('#cs-seek');
    seek.value=state.progress;seek.setAttribute('aria-valuetext',`${time(state.progress)}，总时长${time(track.duration)}`);
    host.querySelector('#cs-current-time').textContent=time(state.progress);
    const play=host.querySelector('[data-case-action="play"]');
    play.setAttribute('aria-pressed',String(state.playing));play.setAttribute('aria-label',state.playing?'暂停进度演示':'开始进度演示');play.innerHTML=state.playing?'<span class="cs-pause-symbol" aria-hidden="true"></span>':icon('play');
    host.querySelector('#cs-playback-note').textContent=state.playing?'正在模拟进度 · 无音频输出':'已暂停 · 无音频输出';
    host.querySelector('.cs-app').classList.toggle('is-playing',state.playing);
  }
  function startTimer() {
    stopTimer();
    if(state.playing)timer=setInterval(()=>{if(!host?.isConnected){destroy();return;}if(document.hidden)return;state.progress=Math.min(state.progress+1,tracks[state.track].duration);if(state.progress===tracks[state.track].duration){state.playing=false;stopTimer();}updatePlayer();},1000);
  }
  function cleanupDetailTabs() {
    detailTabs.forEach(cleanup=>cleanup());detailTabs=[];filterTabs=null;categoryTabs=null;
  }
  function mountDetailTabs() {
    if(state.selected==='account')detailTabs.push(window.RosemaryMotion.bindTabs(host.querySelector('.cs-auth-tabs'),{
      initialKey:state.authMode,
      onChange(key,tab,{initial}) {if(initial)return;state.authMode=key;host.querySelector('#cs-auth-panel').innerHTML=accountContent();}
    }));
    if(state.selected==='users') {
      filterTabs=window.RosemaryMotion.bindTabs(host.querySelector('.cs-filter-buttons'),{
        initialKey:state.userFilter,
        onChange(key,tab,{initial}) {if(initial)return;state.userFilter=key;updateUsers();}
      });detailTabs.push(filterTabs);
    }
    if(state.selected==='search') {
      categoryTabs=window.RosemaryMotion.bindTabs(host.querySelector('.cs-search-categories'),{
        initialKey:state.searchCategory,
        onChange(key,tab,{initial}) {if(initial)return;state.searchCategory=key;state.documentId=null;updateSearch();}
      });detailTabs.push(categoryTabs);
    }
  }
  function repaint() {
    cleanupDetailTabs();window.RosemaryMotion.cancelTree(host.querySelector('#cs-case-panel'));
    host.querySelector('#cs-case-panel').innerHTML=panel();mountDetailTabs();
    if(state.selected==='music'){updatePlayer();startTimer();}
  }
  function selectCase(id) {
    if(!cases.some(c=>c.id===id)||id===state.selected)return;
    stopTimer();state.playing=false;state.selected=id;repaint();
  }
  function updateUsers(message='') {
    host.querySelector('#cs-user-rows').innerHTML=userRows();host.querySelector('#cs-user-count').textContent=`${filteredUsers().length} 位成员`;
    host.querySelector('#cs-active-count').textContent=state.users.filter(u=>u.active).length;host.querySelector('#cs-admin-count').textContent=state.users.filter(u=>u.role==='管理员').length;
    host.querySelector('#cs-user-message').textContent=message;
  }
  function updateSearch() {
    host.querySelector('#cs-search-results').innerHTML=searchResults();host.querySelector('#cs-search-count').textContent=`${results().length} 条演示内容`;
    host.querySelector('.cs-search-results-heading h3').textContent=state.searchQuery?'搜索结果':'全部内容';
  }
  function validate(form) {
    const data=new FormData(form), errors={};
    if(state.authMode==='register'&&!String(data.get('name')||'').trim())errors.name='请输入称呼。';
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(data.get('email')||'')))errors.email='请输入有效邮箱，例如 name@example.test。';
    const password=String(data.get('password')||'');if(password.length<8||!/[A-Za-z]/.test(password)||!/[0-9]/.test(password))errors.password='密码需至少 8 个字符，同时包含字母和数字。';
    if(!data.get('acknowledge'))errors.acknowledge='请先确认你了解此演示的范围。';
    ['name','email','password','acknowledge'].forEach(name=>{const field=form.elements.namedItem(name), error=form.querySelector(`#cs-error-${name}`);if(!field)return;field.setAttribute('aria-invalid',String(Boolean(errors[name])));if(name==='acknowledge')field.setAttribute('aria-describedby','cs-error-acknowledge');error.textContent=errors[name]||'';});
    const message=host.querySelector('#cs-auth-message');message.classList.toggle('success',!Object.keys(errors).length);message.textContent=Object.keys(errors).length?'请修正标出的信息后再次验证。':`格式验证通过。${state.authMode==='register'?'未创建账户':'未登录账号'}，输入未发送或保存。`;
    if(Object.keys(errors).length)form.elements.namedItem(Object.keys(errors)[0]).focus();
  }
  function handleClick(event) {
    const target=event.target.closest('button');if(!target||!host.contains(target))return;
    if(target.dataset.caseTrack!==undefined){state.track=Number(target.dataset.caseTrack);state.progress=0;repaint();host.querySelector(`[data-case-track="${state.track}"]`).focus();return;}
    if(target.dataset.caseFavorite!==undefined){const id=Number(target.dataset.caseFavorite);state.favorites.has(id)?state.favorites.delete(id):state.favorites.add(id);target.setAttribute('aria-pressed',String(state.favorites.has(id)));target.setAttribute('aria-label',`${state.favorites.has(id)?'取消收藏':'收藏'}${tracks[id].title}`);host.querySelector('#cs-favorite-count').textContent=state.favorites.size;return;}
    if(target.dataset.caseUser){state.userId=Number(target.dataset.caseUser);updateUsers();host.querySelector('#cs-user-detail').innerHTML=userDetail();host.querySelector('.cs-detail-head button').focus({preventScroll:true});return;}
    if(target.dataset.caseQuery){state.searchQuery=target.dataset.caseQuery;host.querySelector('#cs-query').value=state.searchQuery;state.documentId=null;updateSearch();return;}
    if(target.dataset.caseDocument){const id=Number(target.dataset.caseDocument);state.documentId=state.documentId===id?null:id;updateSearch();host.querySelector(`[data-case-document="${id}"]`).focus({preventScroll:true});return;}
    switch(target.dataset.caseAction){
      case 'play': if(state.progress===tracks[state.track].duration)state.progress=0;state.playing=!state.playing;updatePlayer();startTimer();break;
      case 'previous':case 'next':state.track=(state.track+(target.dataset.caseAction==='next'?1:tracks.length-1))%tracks.length;state.progress=0;repaint();host.querySelector(`[data-case-action="${target.dataset.caseAction}"]`).focus({preventScroll:true});break;
      case 'password':{const input=host.querySelector('#cs-auth-password'), visible=input.type==='password';input.type=visible?'text':'password';target.setAttribute('aria-pressed',String(visible));target.setAttribute('aria-label',visible?'隐藏密码':'显示密码');target.innerHTML=icon(visible?'eye':'eye-off');window.RosemaryMotion.enter(target.querySelector('.icon'));break;}
      case 'close-user':{const id=state.userId;state.userId=null;host.querySelector('#cs-user-detail').innerHTML=userDetail();updateUsers();host.querySelector(`[data-case-user="${id}"]`)?.focus({preventScroll:true});break;}
      case 'toggle-user':{const user=state.users.find(u=>u.id===state.userId);user.active=!user.active;host.querySelector('#cs-member-status').textContent=user.active?'可访问':'已停用';target.textContent=user.active?'停用此成员':'恢复此成员';window.RosemaryMotion.enter(host.querySelector('#cs-member-status'));updateUsers(`${user.name}已在本地演示中${user.active?'恢复访问':'停用'}。`);host.querySelector('[data-case-action="toggle-user"]').focus({preventScroll:true});break;}
      case 'reset-users':state.userQuery='';state.userFilter='all';host.querySelector('#cs-user-search').value='';filterTabs.select('all');updateUsers();host.querySelector('#cs-user-search').focus();break;
      case 'reset-search':case 'try-design':state.searchQuery=target.dataset.caseAction==='try-design'?'设计':'';state.searchCategory='全部';state.documentId=null;host.querySelector('#cs-query').value=state.searchQuery;categoryTabs.select('全部');updateSearch();host.querySelector('#cs-query').focus();break;
    }
  }
  function init() {
    destroy();host=document.querySelector('.page[data-page="cases"]');if(!host)return;if(!state)reset();abort=new AbortController();const opts={signal:abort.signal};
    host.addEventListener('click',handleClick,opts);
    caseTabs=window.RosemaryMotion.bindTabs(host.querySelector('.cs-case-tabs'),{initialKey:state.selected,onChange(key,tab,{initial}) {if(!initial)selectCase(key);}});mountDetailTabs();
    host.addEventListener('input',event=>{if(event.target.id==='cs-seek'){state.progress=Number(event.target.value);updatePlayer();}if(event.target.id==='cs-user-search'){state.userQuery=event.target.value;updateUsers();}if(event.target.id==='cs-query'){state.searchQuery=event.target.value;state.documentId=null;updateSearch();}},opts);
    host.addEventListener('change',event=>{if(event.target.name==='cs-role'){const user=state.users.find(u=>u.id===state.userId);user.role=event.target.value;updateUsers(`${user.name}的本地演示角色已改为${user.role}。`);}},opts);
    host.addEventListener('submit',event=>{if(event.target.id==='cs-auth-form'){event.preventDefault();validate(event.target);}if(event.target.id==='cs-query-form'){event.preventDefault();state.searchQuery=host.querySelector('#cs-query').value;state.documentId=null;updateSearch();}},opts);
  }
  function destroy() {stopTimer();cleanupDetailTabs();caseTabs?.();caseTabs=null;if(host)window.RosemaryMotion.cancelTree(host);abort?.abort();abort=null;host=null;if(state)state.playing=false;}
  window.RosemaryCases={init,destroy};
})();
