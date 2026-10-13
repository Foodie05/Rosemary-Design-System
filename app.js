(() => {
  'use strict';
  const {icon, mark, brandMark, escape, foldLoader} = window.RosemaryUI;
  const {pages, sections, renderers} = window.RosemaryPages;
  const tokens = window.ROSEMARY_TOKENS;
  const main = document.getElementById('main-content');
  const searchDialog = document.getElementById('search-dialog');
  const navDialog = document.getElementById('nav-dialog');
  const exampleDialog = document.getElementById('example-dialog');
  const searchInput = document.getElementById('site-search');
  const searchResults = document.getElementById('search-results');
  const exampleText = document.getElementById('example-text');
  const themeSelect = document.getElementById('theme-select');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const reducedMotion = window.RosemaryMotion.reduced;
  const state = {page: '', entries: [], removed: false, checks: []};
  let toastTimer;
  let syncTimer;
  let lastExampleOpener;
  let searchOpener;
  let navOpener;
  let selectsCleanup;
  let navAnimation,navGeneration=0,navOpening=false;
  function transitionNav(open,opener) {
    if(open){navOpener=opener||navOpener;if(!navDialog.open)navDialog.showModal();}
    else if(!navDialog.open)return;
    navOpening=open;
    const generation=++navGeneration;
    const current=navAnimation?getComputedStyle(navDialog).transform:open?'translateX(-100%)':'translateX(0)';
    navAnimation?.cancel();
    navDialog.dataset.opening=String(open);
    const finish=()=>{if(generation!==navGeneration)return;navAnimation=null;if(!open){navDialog.close();if(!navOpener)moveFocus(main.querySelector('h1'));}};
    if(open)navDialog.querySelector('[aria-current="page"]')?.focus({preventScroll:true});
    if(reducedMotion.matches){finish();return;}
    navAnimation=navDialog.animate([{transform:current},{transform:open?'translateX(0)':'translateX(-100%)'}],{duration:open?220:180,easing:tokens.motionEasing,fill:'both'});
    navAnimation.onfinish=()=>{const animation=navAnimation;finish();animation?.cancel();};
    if(open)navDialog.querySelector('[aria-current="page"]')?.focus({preventScroll:true});
  }
  navDialog.addEventListener('cancel',event=>{event.preventDefault();transitionNav(false);});
  navDialog.addEventListener('click',event=>{if(event.target===navDialog){const r=navDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)transitionNav(false);}});
  reducedMotion.addEventListener('change',()=>{if(reducedMotion.matches&&navAnimation)transitionNav(navOpening);});
  window.addEventListener('resize',()=>{if(innerWidth>=800&&navDialog.open)transitionNav(false);});

  function readPreference(key, fallback) {
    try { const value = localStorage.getItem(key); return value === null ? fallback : value; }
    catch { return fallback; }
  }
  function writePreference(key, value) {
    try { localStorage.setItem(key, value); return true; }
    catch { return false; }
  }
  function restoreChecks() {
    try {
      const value = JSON.parse(readPreference('rosemary-design-checks-v1', '[]'));
      state.checks = Array.from({length:8}, (_, i) => Array.isArray(value) && value[i] === true);
    } catch { state.checks = Array(8).fill(false); }
  }
  restoreChecks();
  function notify(text, kind = 'check') {
    clearTimeout(toastTimer);
    const region = document.getElementById('toast-region');
    const item = document.createElement('div');
    item.className = 'toast';
    item.innerHTML = icon(kind);
    const message = document.createElement('span');
    message.textContent = text;
    item.append(message);
    region.replaceChildren(item);
    toastTimer = setTimeout(() => region.replaceChildren(), 6500);
  }
  function activeTheme() { return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'; }
  let preference = readPreference('rosemary-design-theme-v1', 'system');
  if (!['system','light','dark'].includes(preference)) preference = 'system';
  themeSelect.value = preference;
  function applyTheme() {
    const theme = preference === 'system' ? (systemTheme.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('[data-token-value]').forEach(el => {
      el.textContent = tokens.themes[theme][el.dataset.tokenValue];
    });
    updateContrast();
  }
  themeSelect.addEventListener('change', () => {
    preference = themeSelect.value;
    writePreference('rosemary-design-theme-v1', preference);
    applyTheme();
  });
  systemTheme.addEventListener('change', applyTheme);

  const groups = [...new Set(pages.map(p=>p.group))];
  function navMarkup() {
    return groups.map(group => `<div class="nav-group"><p class="nav-group-label">${group}</p>${pages.filter(p=>p.group===group).map(p=>`<a class="nav-link" href="#/${p.id}" data-page-link="${p.id}">${icon(p.icon)}<span>${p.title}</span></a>`).join('')}</div>`).join('');
  }
  document.getElementById('desktop-nav').innerHTML = navMarkup();
  document.getElementById('mobile-nav').innerHTML = navMarkup();
  document.querySelectorAll('.brand-symbol').forEach(el => { if (!el.innerHTML) el.innerHTML = mark(); });
  const shellBrand = document.querySelector('[data-shell-brand]');
  if (shellBrand) shellBrand.innerHTML = brandMark('forma',{size:32,label:true,className:'shell-brand'});
  document.querySelectorAll('.search-icon').forEach(el => { el.innerHTML = icon('search'); });
  document.querySelector('.mobile-menu').innerHTML = icon('menu');
  document.querySelector('.dialog-symbol').innerHTML = icon('pencil');
  document.getElementById('brand-favicon').href = window.ROSEMARY_LOGO_DATA;
  const onMac = /Mac|iPhone|iPad/.test(navigator.platform);
  document.getElementById('search-shortcut').textContent = onMac ? '⌘ K' : 'Ctrl K';

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, '');
    const [slug, query = ''] = raw.split('?');
    return {slug: slug || 'overview', section: new URLSearchParams(query).get('section')};
  }
  function moveFocus(target) {
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.tabIndex = -1;
    target.focus({preventScroll:true});
  }
  function renderRoute(initial = false) {
    const route = parseRoute();
    const page = pages.find(p=>p.id === route.slug);
    const changed = state.page !== route.slug;
    if (changed) {
      selectsCleanup?.();selectsCleanup=null;
      window.RosemaryCases?.destroy();
      window.RosemaryMotion.cancelTree(main);
      window.RosemaryComponentView.destroy();
      clearTimeout(syncTimer);
      window.RosemaryLabs.destroy();
    }
    if (!page) {
      state.page = 'not-found';
      main.innerHTML = `<article class="page"><header class="page-header"><div class="page-kicker">${icon('book')}尚未收录</div><h1 class="page-title" tabindex="-1">未找到该章节</h1><p class="page-description">可以回到首页，或搜索你想了解的规范。</p></header><div class="button-row"><a href="#/overview" class="button primary">回到首页</a><button class="button secondary" data-action="open-search">搜索规范</button></div></article>`;
      document.title = '尚未收录 · Rosemary Forma';
      document.getElementById('current-page-name').textContent = '尚未收录';
      document.querySelectorAll('[data-page-link]').forEach(a=>a.removeAttribute('aria-current'));
      if (!initial) { window.scrollTo({top:0,behavior:'instant'});moveFocus(main.querySelector('h1'));window.RosemaryMotion.enter(main.firstElementChild,{kind:'page'}); }
      return;
    }
    if (changed) {
      state.page = page.id;
      main.innerHTML = renderers[page.id]();
      document.title = `${page.title} · Rosemary Forma`;
      document.getElementById('current-page-name').textContent = page.title;
      document.querySelectorAll('[data-page-link]').forEach(a => {
        if (a.dataset.pageLink === page.id) a.setAttribute('aria-current','page');
        else a.removeAttribute('aria-current');
      });
      initializePage();
    }
    if(page.id==='components')window.RosemaryComponentView.sync();
    if (navDialog.open) { if(changed)navOpener=null;transitionNav(false); }
    if (route.section) {
      requestAnimationFrame(() => {
        const latest=parseRoute();
        if(latest.slug!==page.id || latest.section!==route.section)return;
        const target=document.getElementById(route.section);
        if (target && main.contains(target)) {
          target.scrollIntoView({block:'start',behavior:initial || reducedMotion.matches ? 'instant' : 'smooth'});
          if (!initial) moveFocus(target.querySelector('h2') || target);
        }
      });
    } else if (changed && !initial) {
      window.scrollTo({top:0,behavior:'instant'});
      moveFocus(main.querySelector('h1'));
    }
    if(changed && !initial)window.RosemaryMotion.enter(main.firstElementChild,{kind:'page'});
  }
  function initializePage() {
    applyTheme();
    restoreEntries();
    updateUndo();
    updateChecklist();
    updateMotionPreference();
    window.RosemaryLabs.init(state.page);
    if(state.page==='components')window.RosemaryComponentView.init();
    if(state.page==='cases')window.RosemaryCases?.init();
    selectsCleanup=window.RosemarySelect.mountWithin(main);
  }
  window.addEventListener('hashchange', () => renderRoute());
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#/"]');
    if (anchor && navDialog.open) { navOpener=null;transitionNav(false); }
    if (anchor && anchor.getAttribute('href') === location.hash) {
      event.preventDefault();
      renderRoute();
    }
  });

  const searchIndex = [...pages.map(p=>({title:p.title,summary:p.description,terms:p.keywords,route:p.id,icon:p.icon})),
    ...Object.entries(sections).flatMap(([id,items])=>items.map(s=>({title:s.name,summary:pages.find(p=>p.id===id).title,terms:s.name,route:`${id}?section=${s.id}`,icon:pages.find(p=>p.id===id).icon}))),
    ...Object.values(window.RosemaryComponentCatalog).map(item=>({title:item.title+'规格',summary:item.use,terms:item.id+' '+item.title+' '+item.anatomy,route:`components?component=${item.id}`,icon:'grid'}))];
  function updateSearch() {
    const query = searchInput.value.trim().toLowerCase();
    const words = query.split(/\s+/).filter(Boolean);
    const score = r => r.title.toLowerCase()===query ? 3 : r.title.toLowerCase().startsWith(query) ? 2 : r.title.toLowerCase().includes(query) ? 1 : 0;
    const results = query ? searchIndex.filter(r => words.every(w => `${r.title} ${r.summary} ${r.terms}`.toLowerCase().includes(w))).sort((a,b)=>score(b)-score(a)).slice(0,10) : searchIndex.filter(r=>['philosophy','colors','components','patterns','governance'].includes(r.route));
    searchResults.innerHTML = results.length ? results.map(r => `<button type="button" class="search-result" data-search-route="${r.route}">${icon(r.icon)}<span><strong>${r.title}</strong><small>${r.summary}</small></span></button>`).join('') : `<div class="no-results">没有找到“${escape(searchInput.value.trim())}”。<br>可以试试更短的词，例如“保存”或“按钮”。</div>`;
  }
  function openSearch(opener = document.activeElement) {
    if (document.querySelector('dialog[open]') && !searchDialog.open) return;
    searchOpener = opener;
    updateSearch();
    if (!searchDialog.open) searchDialog.showModal();
    searchInput.focus();
  }
  searchInput.addEventListener('input', updateSearch);
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); searchResults.querySelector('button')?.focus(); }
    if (event.key === 'Enter') { event.preventDefault(); searchResults.querySelector('button')?.click(); }
  });
  searchResults.addEventListener('keydown', event => {
    const buttons = [...searchResults.querySelectorAll('button')];
    const index = buttons.indexOf(document.activeElement);
    if (index < 0) return;
    if (event.key === 'ArrowDown') { event.preventDefault(); buttons[Math.min(index+1, buttons.length-1)].focus(); }
    if (event.key === 'ArrowUp') { event.preventDefault(); if (index === 0) searchInput.focus(); else buttons[index-1].focus(); }
  });
  searchResults.addEventListener('click', event => {
    const result = event.target.closest('[data-search-route]');
    if (!result) return;
    const route = '#/' + result.dataset.searchRoute;
    searchOpener=null;
    searchDialog.close();
    if (location.hash === route) renderRoute();
    else location.hash = route;
  });
  searchDialog.addEventListener('close', () => { if (searchOpener?.isConnected) searchOpener.focus({preventScroll:true}); });
  navDialog.addEventListener('close', () => { if (navOpener?.isConnected) navOpener.focus({preventScroll:true}); });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (searchDialog.open) searchDialog.close(); else openSearch();
    }
  });

  function luminance(hex) {
    const rgb = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
    return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
  }
  function contrast(a,b) {
    const x=luminance(a), y=luminance(b);
    return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
  }
  function updateContrast() {
    const fg=document.getElementById('contrast-fg'), bg=document.getElementById('contrast-bg');
    if (!fg || !bg) return;
    const palette=tokens.themes[activeTheme()];
    const foreground=palette[fg.value], background=palette[bg.value];
    const preview=document.getElementById('contrast-preview');
    preview.style.color=foreground;
    preview.style.background=background;
    const ratio=contrast(foreground,background);
    document.getElementById('contrast-result').textContent = `当前色对为 ${ratio.toFixed(2)}:1。${ratio>=4.5 ? '达到普通文字 4.5:1 的检查基线。' : '未达到普通文字 4.5:1 的检查基线，请调整色对。'}`;
  }
  window.RosemaryContrast = contrast;
  function updateMotionPreference() {
    const label=document.getElementById('motion-preference');
    if (label) label.textContent=reducedMotion.matches ? '当前系统已开启减少动态效果：演示保留结果，不播放位移动画。' : '当前未开启减少动态效果；系统偏好改变后会自动响应。';
  }
  reducedMotion.addEventListener('change',updateMotionPreference);
  function updateUndo() {
    const item=document.getElementById('undo-item'), banner=document.getElementById('undo-banner');
    if (!item || !banner) return;
    item.hidden=state.removed;
    banner.hidden=!state.removed;
  }
  function restoreEntries() {
    const target=document.getElementById('demo-entries');
    if (!target) return;
    target.replaceChildren();
    if (!state.entries.length) return;
    const heading=document.createElement('h3');
    heading.textContent='已添加的演示记录';
    heading.style.fontSize='14px';
    target.append(heading);
    state.entries.forEach(text => { const entry=document.createElement('p');entry.className='demo-entry';entry.textContent=text;target.append(entry); });
    const clear=document.createElement('button');
    clear.type='button';clear.className='button quiet small';clear.dataset.action='clear-entries';clear.textContent='清空演示记录';target.append(clear);
  }
  function openExample(opener) {
    lastExampleOpener=opener;
    document.getElementById('example-submit').disabled=!exampleText.value.trim();
    exampleDialog.showModal();exampleText.focus();
  }
  exampleText.addEventListener('input',()=> { document.getElementById('example-submit').disabled=!exampleText.value.trim(); });
  exampleDialog.addEventListener('close',()=> {
    if (lastExampleOpener?.isConnected) lastExampleOpener.focus({preventScroll:true});
    if (exampleText.value.trim()) notify('草稿保留在本页内存中，重新打开可以继续；刷新后清除。');
  });
  document.getElementById('example-form').addEventListener('submit',event=> {
    event.preventDefault();const text=exampleText.value.trim();if (!text) return;
    state.entries.unshift(text);exampleText.value='';document.getElementById('example-submit').disabled=true;
    exampleDialog.close();restoreEntries();
    notify('已添加演示记录，内容仅保留在页面内存中，刷新后清除。');
  });
  window.addEventListener('beforeunload',event=> { if (exampleText.value.trim() || state.entries.length) {event.preventDefault();event.returnValue='';} });

  function updateChecklist() {
    document.querySelectorAll('[data-release-check]').forEach(input=> { input.checked=state.checks[Number(input.dataset.releaseCheck)]===true; });
    const note=document.getElementById('checklist-note');
    if (note) note.textContent=`本机已勾选 ${state.checks.filter(Boolean).length} / 8 项。勾选仅是个人工作记录，不代表已经完成产品认证或审计。`;
  }
  function downloadFile(name, content, mime) {
    const url=URL.createObjectURL(new Blob([content],{type:mime}));
    const anchor=document.createElement('a');anchor.href=url;anchor.download=name;document.body.append(anchor);anchor.click();anchor.remove();
    setTimeout(()=>URL.revokeObjectURL(url),15000);
  }
  async function copyToken(key) {
    const value=tokens.themes[activeTheme()][key];
    if (!value) return;
    try { if (!navigator.clipboard) throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(value);notify(`已复制 ${key}：${value}`); }
    catch { notify(`无法自动复制。当前 ${key} 色值：${value}，可从色块下方手动复制。`,'info'); }
  }
  function setSync(kind) {
    const line=document.getElementById('sync-status');if (!line) return;
    clearTimeout(syncTimer);
    document.querySelectorAll('[data-action^="sync-"]').forEach(b=>{b.removeAttribute('aria-disabled');});
    line.classList.remove('error');
    if (kind==='reset') {line.innerHTML=`${icon('check')}示例状态：已保存到此设备，等待同步。`;return;}
    line.innerHTML=foldLoader('small is-running')+'演示中：正在同步…';
    document.querySelectorAll('[data-action="sync-success"],[data-action="sync-failure"]').forEach(b=>{b.setAttribute('aria-disabled','true');});
    syncTimer=setTimeout(()=> {
      if (!line.isConnected) return;
      if (kind==='success') line.innerHTML=`${icon('check')}示例状态：已同步。没有发起真实网络请求。`;
      else {line.classList.add('error');line.innerHTML=`${icon('info')}示例状态：未能同步。本地内容仍在，可稍后重试。`;}
      document.querySelectorAll('[data-action^="sync-"]').forEach(b=>{b.removeAttribute('aria-disabled');});
    },700);
  }

  document.addEventListener('click',event=> {
    const tokenButton=event.target.closest('[data-copy-token]');
    if (tokenButton) { copyToken(tokenButton.dataset.copyToken);return; }
    const trigger=event.target.closest('[data-action]');
    if (!trigger || trigger.disabled || trigger.getAttribute('aria-disabled')==='true') return;
    const action=trigger.dataset.action;
    if (action==='open-search') openSearch(trigger);
    else if (action==='close-search') searchDialog.close();
    else if (action==='open-nav') transitionNav(true,trigger);
    else if (action==='close-nav') transitionNav(false);
    else if (action==='open-example') openExample(trigger);
    else if (action==='close-example') exampleDialog.close();
    else if (action==='demo-saved') notify('这是按钮反馈演示，没有修改真实内容。');
    else if (action==='demo-preview') notify('次要按钮适合预览、返回等辅助动作。','info');
    else if (action==='demo-later') notify('你可以稍后继续；普通退出不需要情绪化挽留。','info');
    else if (action==='clear-entries') {state.entries=[];restoreEntries();moveFocus(document.getElementById('resize')?.querySelector('h2'));notify('演示记录已清空。');}
    else if (action==='sync-success') setSync('success');
    else if (action==='sync-failure') setSync('failure');
    else if (action==='sync-reset') setSync('reset');
    else if (action==='remove-item') {state.removed=true;updateUndo();document.querySelector('[data-action="undo-remove"]').focus();notify('已从演示列表移除。撤销入口会保持可见。');}
    else if (action==='undo-remove') {state.removed=false;updateUndo();const restored=document.getElementById('undo-item');restored.classList.remove('restored');requestAnimationFrame(()=>restored.classList.add('restored'));document.querySelector('[data-action="remove-item"]').focus();notify('已恢复这条示例。');}
    else if (action==='download-tokens') downloadFile('rosemary-forma-tokens-v1.2.0.json',JSON.stringify(tokens,null,2),'application/json;charset=utf-8');
    else if (action==='download-guide') downloadFile('rosemary-forma-guide-v1.2.0.md',window.ROSEMARY_GUIDE,'text/markdown;charset=utf-8');
    else if (action==='reset-checklist') {state.checks=Array(8).fill(false);writePreference('rosemary-design-checks-v1',JSON.stringify(state.checks));updateChecklist();}
  });
  document.addEventListener('change',event=> {
    if (event.target.id==='contrast-fg'||event.target.id==='contrast-bg') updateContrast();
    if (event.target.matches('[data-release-check]')) {
      state.checks[Number(event.target.dataset.releaseCheck)]=event.target.checked;
      const persisted=writePreference('rosemary-design-checks-v1',JSON.stringify(state.checks));
      updateChecklist();
      if(!persisted)notify('当前环境不允许本机存储，勾选仅保留到本页关闭。','info');
    }
  });
  document.addEventListener('input',event=> {
    if(event.target.id==='text-size') {
      const size=Math.min(32,Math.max(16,Number(event.target.value)));
      document.getElementById('access-content').style.setProperty('--demo-font',size+'px');
      document.getElementById('text-size-value').value=size+'px';
    }
  });
  window.RosemaryPortal = {notify, downloadFile};
  window.RosemarySelect.mountWithin(document.querySelector('.topbar-actions'));
  renderRoute(true);
})();
