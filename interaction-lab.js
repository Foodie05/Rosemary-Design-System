(() => {
  'use strict';
  const {icon,foldLoader,svgSource,escape,rules} = window.RosemaryUI;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const timers = new Set();
  const animations = new Set();
  const gallery = {query:'',category:'all',size:24,selected:'book'};
  const dataRows = [
    {name:'家庭日程',date:'2026-10-10',status:'已同步'},
    {name:'周末照片',date:'2026-10-12',status:'仅此设备'},
    {name:'旅行清单',date:'2026-10-11',status:'等待同步'}
  ];
  let sort = {key:'name',direction:1};
  let demoPage = 1;
  let files = [];
  let foldState = 'idle';
  let foldGeneration = 0;
  let progress = {state:'idle',done:0};
  let listInsertions = 0;
  let resizeObserver;
  let drawerOpener;
  let currentPage='';
  const byId = id => document.getElementById(id);
  const portal = () => window.RosemaryPortal;
  const later = (fn,ms) => {const timer=setTimeout(()=>{timers.delete(timer);fn();},ms);timers.add(timer);return timer;};
  function stopTimers(){timers.forEach(clearTimeout);timers.clear();}
  function animate(element,keyframes,options){
    if(reduced.matches || !element.animate)return;
    const animation=element.animate(keyframes,options);animations.add(animation);
    const remove=()=>animations.delete(animation);animation.addEventListener('finish',remove,{once:true});animation.addEventListener('cancel',remove,{once:true});
  }
  function status(id,text){const el=byId(id);if(el)el.textContent=text;}
  function downloadDataURL(name,url){
    if(!url){portal()?.notify('资源尚未生成，请先运行构建。','info');return;}
    const [header,data]=url.split(',');const mime=/data:([^;]+)/.exec(header)?.[1] || 'application/octet-stream';
    const bytes=Uint8Array.from(atob(data),c=>c.charCodeAt(0));portal().downloadFile(name,bytes,mime);
  }
  async function copyText(text){
    try{if(!navigator.clipboard)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(text);portal().notify('SVG 已复制。');}
    catch{portal().notify('当前环境无法自动复制。可以从下方代码区域选择复制，或下载 SVG。','info');}
  }
  function renderGallery(){
    const target=byId('icon-catalog');if(!target)return;
    const items=Object.entries(window.RosemaryIconLibrary.icons).filter(([id,item])=>
      (gallery.category==='all'||item.category===gallery.category)&&
      `${id} ${item.label} ${item.category} ${item.usage}`.toLowerCase().includes(gallery.query.toLowerCase().trim()));
    target.style.setProperty('--catalog-icon-size',gallery.size+'px');
    target.innerHTML=items.length ? items.map(([id,item])=>`<button type="button" class="icon-cell" data-icon-id="${id}" aria-pressed="${gallery.selected===id}" aria-label="选择${escape(item.label)}图标">${icon(id)}<span class="icon-label">${escape(item.label)}</span></button>`).join('') : '<p class="no-results">没有符合条件的图标。请调整名称或分类。</p>';
    status('icon-result-count',`显示 ${items.length} / ${Object.keys(window.RosemaryIconLibrary.icons).length} 枚图标。`);
    renderIconInspector();
  }
  function renderIconInspector(){
    const target=byId('icon-selected-preview');if(!target)return;
    const item=window.RosemaryIconLibrary.icons[gallery.selected];
    target.innerHTML=icon(gallery.selected);
    status('icon-selected-name',`${item.label} · ${gallery.selected}`);
    status('icon-selected-usage',item.usage);
    status('icon-selected-source',svgSource(gallery.selected));
  }
  function renderSpec(id){
    const item=window.RosemaryComponentCatalog[id];const target=byId('component-spec-content');if(!item||!target)return;
    byId('component-spec-select').value=id;
    const fields=[['结构','anatomy'],['变体','variants'],['尺寸','dimensions'],['状态','states'],['行为','behavior'],['键盘','keyboard'],['语义与可访问性','semantics'],['响应与边界','responsive'],['动效','motion'],['验证要求','validation']];
    target.innerHTML=`<header class="spec-heading"><h3>${escape(item.title)}</h3><p>${escape(item.use)}</p><div class="spec-meta"><span>${escape(item.implementation)}</span><span>${escape(item.maturity)}</span></div></header><dl class="component-spec-dl">${fields.map(([label,key])=>`<div><dt>${label}</dt><dd>${escape(item[key])}</dd></div>`).join('')}</dl>${rules(escape(item.good),escape(item.bad))}`;
  }
  function updatePagination(){
    const target=byId('pagination-results');if(!target)return;
    const names=['周末记录','家庭日程','照片清单','阅读笔记','旅行安排','收纳计划'];
    target.innerHTML=names.slice((demoPage-1)*2,demoPage*2).map((name,i)=>`<div>${name}<small>示例 ${(demoPage-1)*2+i+1} / 6</small></div>`).join('');
    document.querySelectorAll('[data-demo-page]').forEach(button=>{if(Number(button.dataset.demoPage)===demoPage)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');});
    document.querySelector('[data-page-step="-1"]').disabled=demoPage===1;
    document.querySelector('[data-page-step="1"]').disabled=demoPage===3;
  }
  function renderTable(){
    const target=byId('sample-table-body');if(!target)return;
    const rows=[...dataRows].sort((a,b)=>a[sort.key].localeCompare(b[sort.key],'zh-CN')*sort.direction);
    target.innerHTML=rows.map(row=>`<tr><th scope="row">${row.name}</th><td>${row.date}</td><td><span class="sample-badge">${row.status}</span></td></tr>`).join('');
    document.querySelectorAll('[data-sort-header]').forEach(header=>header.setAttribute('aria-sort',header.dataset.sortHeader===sort.key?(sort.direction===1?'ascending':'descending'):'none'));
  }
  function renderFiles(){
    const target=byId('file-demo-list');if(!target)return;target.replaceChildren();
    files.forEach((file,index)=>{
      const row=document.createElement('li');const label=document.createElement('span');label.textContent=file.name;
      const size=document.createElement('small');size.textContent=file.size<1024?`${file.size} B`:`${(file.size/1024).toFixed(1)} KB`;
      const remove=document.createElement('button');remove.type='button';remove.dataset.removeFile=String(index);remove.setAttribute('aria-label',`移除 ${file.name}`);remove.innerHTML=icon('close');
      row.append(label,size,remove);target.append(row);
    });
  }
  function showTooltip(trigger){const tip=byId(trigger.dataset.tooltipTrigger);if(tip)tip.hidden=false;}
  function hideTooltips(){document.querySelectorAll('.sample-tooltip').forEach(tip=>tip.hidden=true);}

  function renderFold(){
    const stage=byId('fold-demo-stage');if(!stage)return;
    stage.dataset.state=foldState;
    const active=foldState==='running';
    byId('fold-demo-busy').setAttribute('aria-busy',String(active));
    const cancelFocused=document.activeElement===byId('fold-cancel');
    byId('fold-start').setAttribute('aria-disabled',String(active));byId('fold-cancel').disabled=!active;
    if(cancelFocused&&!active)byId('fold-start').focus({preventScroll:true});
    byId('fold-start').textContent=active?'演示中…':foldState==='idle'?'开始演示':'重新演示';
    status('fold-demo-title',({idle:'折面加载',running:'正在加载演示记录',success:'演示已完成',cancelled:'演示已取消'})[foldState]);
    if(!active)stage.querySelector('.fold-loader').classList.remove('is-running');
  }
  function startFold(){
    if(foldState==='running')return;
    const generation=++foldGeneration;foldState='running';renderFold();status('fold-demo-status','演示进行中。没有发起真实网络请求。');
    later(()=>{if(generation===foldGeneration&&foldState==='running')byId('fold-demo-stage')?.querySelector('.fold-loader').classList.add('is-running');},300);
    later(()=>{if(generation!==foldGeneration||foldState!=='running')return;foldState='success';renderFold();status('fold-demo-status','演示完成。真实操作应在任务确认完成时立即结束加载。');},2500);
  }
  function renderProgress(){
    const bar=byId('task-progress');if(!bar)return;
    bar.value=progress.done;
    const fill=byId('task-progress-fill');
    if(fill){
      const reset=progress.done===0;
      fill.dataset.instant=String(reset);
      fill.style.setProperty('--progress-ratio',String(Math.min(1,Math.max(0,progress.done/bar.max))));
      if(reset){
        fill.getBoundingClientRect();
        requestAnimationFrame(()=>{if(fill.isConnected)fill.dataset.instant='false';});
      }
    }
    status('task-progress-count',`已完成 ${progress.done} / 6 项`);
    const labels={idle:'未开始',running:'进行中',failed:'失败',cancelled:'已取消',complete:'已完成'};
    status('progress-phase',labels[progress.state]);
    const previousFocus=document.activeElement;
    byId('progress-start').setAttribute('aria-disabled',String(progress.state==='running'));
    byId('progress-start').textContent=progress.state==='complete'?'重新演示':progress.done>0?'继续剩余项目':'开始演示';
    byId('progress-fail').disabled=progress.state!=='running';byId('progress-cancel').disabled=progress.state!=='running';
    if(previousFocus?.disabled&&['progress-fail','progress-cancel'].includes(previousFocus.id))byId('progress-start').focus({preventScroll:true});
    status('task-progress-caption',progress.state==='failed'?'已完成项保留；可重试剩余项目。':'进度由已完成的演示步骤计算。');
  }
  let progressGeneration=0;
  function startProgress(){
    if(progress.state==='running')return;
    if(progress.state==='complete')progress.done=0;
    progress.state='running';renderProgress();status('progress-status','开始模拟处理，不读取或传输用户数据。');
    const generation=++progressGeneration;
    const tick=()=>{
      if(generation!==progressGeneration||progress.state!=='running')return;
      progress.done++;
      if(progress.done>=6){progress.state='complete';renderProgress();status('progress-status','6 个演示项目处理完成。实际业务的完成量必须由真实结果提供。');return;}
      renderProgress();later(tick,600);
    };
    later(tick,600);
  }
  let progressSampleGeneration=0;
  function replayProgressSample(){
    const fill=byId('progress-example-fill');if(!fill)return;
    const generation=++progressSampleGeneration;
    fill.style.transition='none';fill.style.width='0%';fill.getBoundingClientRect();fill.style.removeProperty('transition');
    status('progress-example-label','已处理 0 / 6 项');status('progress-example-next','演示从 0% 更新到 50%。');
    const update=()=>{
      if(generation!==progressSampleGeneration||!fill.isConnected)return;
      fill.style.width='50%';status('progress-example-label','已处理 3 / 6 项');status('progress-example-next','正在处理第 4 项，可取消。');
      status('progress-example-status',reduced.matches?'已直接更新到 50%，当前减少动态偏好已生效。':'此处演示约 320ms 的进度过渡，不表示真实任务进度。');
    };
    if(reduced.matches)update();else later(update,100);
  }
  function stopProgress(reason){
    if(progress.state!=='running')return;
    progressGeneration++;progress.state=reason;renderProgress();
    status('progress-status',reason==='failed'?`模拟失败。已完成 ${progress.done} 项，可继续剩余项目。`:`演示已取消，保留已完成的 ${progress.done} 项。`);
  }
  function startSkeleton(){
    const control=byId('skeleton-start');if(!control||control.disabled||control.getAttribute('aria-disabled')==='true')return;
    const placeholder=byId('skeleton-placeholder'),result=byId('skeleton-result');
    placeholder.hidden=false;result.hidden=true;placeholder.classList.add('is-running');byId('skeleton-demo-region').setAttribute('aria-busy','true');control.setAttribute('aria-disabled','true');
    status('skeleton-status','正在加载演示内容。');
    later(()=>{placeholder.classList.remove('is-running');placeholder.hidden=true;result.hidden=false;byId('skeleton-demo-region').setAttribute('aria-busy','false');control.removeAttribute('aria-disabled');control.textContent='重新演示';status('skeleton-status','演示内容已显示，加载前后使用相近的结构。');},1500);
  }

  function updateMotionMarker(){
    const tabs=byId('motion-tabs');if(!tabs)return;
    const selected=tabs.querySelector('[aria-selected="true"]');if(!selected)return;
    const indicator=tabs.querySelector('.motion-tab-indicator');
    indicator.style.setProperty('--marker-x',selected.offsetLeft+'px');indicator.style.setProperty('--marker-width',selected.offsetWidth+'px');
  }
  function chooseMotionTab(button,focus=false){
    const tabs=byId('motion-tabs');if(!tabs)return;
    tabs.querySelectorAll('[data-motion-tab]').forEach(tab=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;});
    const titles={notes:'记录',plans:'计划',saved:'收藏'};
    const copy={notes:'显示已添加的演示记录。内容范围即时更新，选中标记说明当前视图。',plans:'显示计划视图的说明。动画只移动定位标记，不改变页面整体位置。',saved:'显示收藏视图的说明。快速重复切换时保持最新选择，不播放过期过渡。'};
    const panel=byId('motion-tab-panel');panel.innerHTML=`<h3>${titles[button.dataset.motionTab]}</h3><p>${copy[button.dataset.motionTab]}</p>`;panel.setAttribute('aria-labelledby',button.id);updateMotionMarker();if(focus)button.focus();
  }
  function confirmAction(){
    const control=byId('confirm-button');if(!control||control.disabled||control.getAttribute('aria-disabled')==='true')return;
    const symbol=control.querySelector('.confirm-symbol');control.setAttribute('aria-disabled','true');control.setAttribute('aria-busy','true');control.classList.remove('is-confirmed');symbol.style.display='inline-flex';symbol.innerHTML=foldLoader('small is-running');status('confirm-button-label','处理中…');status('confirm-status','正在执行短时演示，不保存真实数据。');
    later(()=>{symbol.innerHTML=icon('check');control.classList.add('is-confirmed');control.removeAttribute('aria-disabled');control.removeAttribute('aria-busy');status('confirm-button-label','演示已完成');status('confirm-status','完成符号只绘制一次。可再次点击重复演示。');},650);
  }
  function insertMotionRow(){
    const list=byId('motion-record-list');if(!list||listInsertions>=5)return;
    const existing=[...list.children];const before=new Map(existing.map(row=>[row,row.getBoundingClientRect().top]));
    existing.forEach(row=>row.getAnimations?.().forEach(animation=>animation.cancel()));
    const row=document.createElement('li');row.innerHTML='<span class="record-dot"></span><span></span><small>新增示例</small>';row.children[1].textContent=`新增演示记录 ${++listInsertions}`;list.prepend(row);
    if(!reduced.matches){
      existing.forEach(item=>{const delta=before.get(item)-item.getBoundingClientRect().top;animate(item,[{transform:`translateY(${delta}px)`},{transform:'translateY(0)'}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'});});
      animate(row,[{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    byId('insert-motion-row').disabled=listInsertions>=5;
    status('motion-list-status',`已添加 ${listInsertions} 条演示记录。焦点保留在操作按钮上。${listInsertions>=5?'可重置后继续。':''}`);
  }
  function resetMotionRows(){
    const list=byId('motion-record-list');if(!list)return;listInsertions=0;
    list.innerHTML='<li><span class="record-dot"></span><span>整理周末照片</span><small>示例记录</small></li><li><span class="record-dot"></span><span>确认家庭日程</span><small>示例记录</small></li>';
    byId('insert-motion-row').disabled=false;status('motion-list-status','列表已重置。');
  }
  function openDrawer(opener){
    drawerOpener=opener;const dialog=byId('demo-drawer');if(!dialog)return;
    dialog.showModal();dialog.querySelector('[data-lab-action="close-demo-drawer"]').focus();
    animate(dialog,[{opacity:.5,transform:'translateX(16px)'},{opacity:1,transform:'translateX(0)'}],{duration:240,easing:'cubic-bezier(.2,.7,.2,1)'});
  }

  function locationChanged(){
    if(currentPage!=='components')return;
    const query=new URLSearchParams(location.hash.split('?')[1]||'');const id=query.get('component');
    if(id&&window.RosemaryComponentCatalog[id])renderSpec(id);
  }
  function init(page){
    currentPage=page;
    if(page==='icons'){
      byId('icon-query').value=gallery.query;byId('icon-category').value=gallery.category;byId('icon-size').value=String(gallery.size);renderGallery();
    }
    if(page==='components'){
      renderSpec('button');locationChanged();demoPage=1;updatePagination();renderTable();files=[];renderFiles();
    }
    if(page==='loading'){
      foldState='idle';renderFold();progress={state:'idle',done:0};renderProgress();
    }
    if(page==='motion'){
      listInsertions=0;requestAnimationFrame(updateMotionMarker);resizeObserver=new ResizeObserver(updateMotionMarker);resizeObserver.observe(byId('motion-tabs'));
    }
  }
  function destroy(){
    stopTimers();progressGeneration++;progressSampleGeneration++;foldGeneration++;animations.forEach(animation=>animation.cancel());animations.clear();resizeObserver?.disconnect();resizeObserver=undefined;hideTooltips();currentPage='';
  }
  document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('portal-motion-paused',document.hidden));
  reduced.addEventListener('change',()=>{if(reduced.matches){animations.forEach(animation=>animation.cancel());animations.clear();}updateMotionMarker();});
  document.addEventListener('click',event=>{
    const iconButton=event.target.closest('[data-icon-id]');if(iconButton){gallery.selected=iconButton.dataset.iconId;document.querySelectorAll('[data-icon-id]').forEach(button=>button.setAttribute('aria-pressed',String(button===iconButton)));renderIconInspector();return;}
    const pageButton=event.target.closest('[data-demo-page]');if(pageButton){demoPage=Number(pageButton.dataset.demoPage);updatePagination();return;}
    const step=event.target.closest('[data-page-step]');if(step&&!step.disabled){demoPage=Math.min(3,Math.max(1,demoPage+Number(step.dataset.pageStep)));updatePagination();return;}
    const sortButton=event.target.closest('[data-table-sort]');if(sortButton){const key=sortButton.dataset.tableSort;sort={key,direction:sort.key===key?-sort.direction:1};renderTable();return;}
    const remove=event.target.closest('[data-remove-file]');if(remove){const index=Number(remove.dataset.removeFile);files.splice(index,1);renderFiles();byId('sample-files').focus();return;}
    const motionTab=event.target.closest('[data-motion-tab]');if(motionTab){chooseMotionTab(motionTab);return;}
    const actionButton=event.target.closest('[data-lab-action],[data-action]');if(!actionButton||actionButton.disabled||actionButton.getAttribute('aria-disabled')==='true')return;
    const action=actionButton.dataset.labAction||actionButton.dataset.action;
    if(action==='copy-selected-icon')copyText(svgSource(gallery.selected));
    else if(action==='download-selected-icon')portal().downloadFile(`rosemary-${gallery.selected}.svg`,svgSource(gallery.selected),'image/svg+xml;charset=utf-8');
    else if(action==='download-icons')downloadDataURL('rosemary-icons-71.zip',window.ROSEMARY_ICON_ARCHIVE_DATA);
    else if(action==='download-sprite')portal().downloadFile('rosemary-icons-sprite.svg',window.ROSEMARY_ICON_SPRITE,'image/svg+xml;charset=utf-8');
    else if(action==='download-logo')downloadDataURL('rosemary-logo.png',window.ROSEMARY_LOGO_DATA);
    else if(action==='download-references')portal().downloadFile('rosemary-reference-review.md',window.ROSEMARY_REFERENCE_REVIEW,'text/markdown;charset=utf-8');
    else if(action==='start-fold')startFold();
    else if(action==='cancel-fold'){foldGeneration++;foldState='cancelled';renderFold();status('fold-demo-status','演示已取消，没有真实任务或数据受到影响。');}
    else if(action==='start-progress')startProgress();
    else if(action==='replay-progress-sample')replayProgressSample();
    else if(action==='fail-progress')stopProgress('failed');
    else if(action==='cancel-progress')stopProgress('cancelled');
    else if(action==='start-skeleton')startSkeleton();
    else if(action==='confirm-action')confirmAction();
    else if(action==='insert-motion-row')insertMotionRow();
    else if(action==='reset-motion-rows')resetMotionRows();
    else if(action==='apply-filter'){actionButton.closest('details').open=false;portal().notify('筛选选项已用于本页演示，不影响真实记录。');}
    else if(action==='open-demo-drawer')openDrawer(actionButton);
    else if(action==='close-demo-drawer')byId('demo-drawer').close();
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='icon-query'){gallery.query=event.target.value;renderGallery();}
    if(event.target.id==='sample-range')status('sample-range-value',event.target.value+' 分钟');
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='icon-category'){gallery.category=event.target.value;renderGallery();}
    if(event.target.id==='icon-size'){gallery.size=Number(event.target.value);renderGallery();}
    if(event.target.id==='component-spec-select')renderSpec(event.target.value);
    if(event.target.id==='sample-files'){files=[...event.target.files];renderFiles();}
  });
  document.addEventListener('pointerover',event=>{const trigger=event.target.closest('[data-tooltip-trigger]');if(trigger)showTooltip(trigger);});
  document.addEventListener('pointerout',event=>{const anchor=event.target.closest('.tooltip-anchor');if(anchor&&!anchor.contains(event.relatedTarget))hideTooltips();});
  document.addEventListener('focusin',event=>{if(event.target.matches('[data-tooltip-trigger]'))showTooltip(event.target);});
  document.addEventListener('focusout',event=>{const anchor=event.target.closest('.tooltip-anchor');if(anchor&&!anchor.contains(event.relatedTarget))hideTooltips();});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')hideTooltips();
    if(event.target.matches('[data-motion-tab]')){
      const tabs=[...event.target.parentElement.querySelectorAll('[data-motion-tab]')];const index=tabs.indexOf(event.target);let next;
      if(event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();chooseMotionTab(tabs[next],true);}
    }
  });
  document.addEventListener('dragover',event=>{const target=event.target.closest('#file-dropzone');if(target){event.preventDefault();target.classList.add('is-dragging');}});
  document.addEventListener('dragleave',event=>{const target=event.target.closest('#file-dropzone');if(target&&!target.contains(event.relatedTarget))target.classList.remove('is-dragging');});
  document.addEventListener('drop',event=>{const target=event.target.closest('#file-dropzone');if(target){event.preventDefault();target.classList.remove('is-dragging');files=[...event.dataTransfer.files];renderFiles();}});
  document.addEventListener('DOMContentLoaded',()=>byId('demo-drawer')?.addEventListener('close',()=>{if(drawerOpener?.isConnected)drawerOpener.focus({preventScroll:true});}));
  window.RosemaryLabs={init,destroy,locationChanged};
})();
