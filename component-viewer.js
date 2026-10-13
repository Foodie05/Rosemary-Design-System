(() => {
  'use strict';
  const {escape,icon,rules} = window.RosemaryUI;
  const catalog = window.RosemaryComponentCatalog;
  const groups = [
    ['操作',['button','link','iconButton']],
    ['输入与选择',['input','textarea','select','search','checkbox','radio','switch','slider','date','upload']],
    ['导航',['tabs','breadcrumb','pagination','menu','stepper']],
    ['浮层与反馈',['tooltip','popover','dialog','drawer','toast','alert','empty','skeleton','loading','progress']],
    ['内容与数据',['card','list','table','badge','avatar']]
  ];
  const ids=groups.flatMap(([,items])=>items);
  const legacySections={buttons:'button',fields:'input',navigation:'tabs',overlays:'dialog',data:'table',upload:'upload',feedback:'empty',states:'button'};
  let host=null,currentId='',abort=null,demoCleanup=null,tabsCleanup=null;

  function resolve() {
    if(typeof location==='undefined')return {id:'button',missing:false};
    const query=new URLSearchParams(location.hash.split('?')[1]||'');
    const requested=query.get('component');
    if(requested && ids.includes(requested))return {id:requested,missing:false};
    if(requested)return {id:'button',missing:true};
    return {id:legacySections[query.get('section')]||'button',missing:false};
  }
  function fields(item,keys) {
    return `<dl class="component-spec-dl">${keys.map(([label,key])=>`<div><dt>${label}</dt><dd>${escape(item[key])}</dd></div>`).join('')}</dl>`;
  }
  function detail(id) {
    const item=catalog[id];
    return `<header class="component-detail-heading"><div><span class="component-detail-label">当前控件</span><h2 id="component-title">${escape(item.title)}</h2></div><p>${escape(item.use)}</p></header>
      <div class="component-doc-tabs" role="tablist" aria-label="${escape(item.title)}的文档内容" id="component-doc-tabs">
        <button type="button" role="tab" id="component-tab-preview" data-tab-key="preview" aria-selected="true" aria-controls="component-panel-preview" tabindex="0">预览与状态</button>
        <button type="button" role="tab" id="component-tab-usage" data-tab-key="usage" aria-selected="false" aria-controls="component-panel-usage" tabindex="-1">使用规范</button>
        <button type="button" role="tab" id="component-tab-implementation" data-tab-key="implementation" aria-selected="false" aria-controls="component-panel-implementation" tabindex="-1">交互与实现</button>
      </div>
      <section class="component-document-panel" id="component-panel-preview" role="tabpanel" aria-labelledby="component-tab-preview" tabindex="0">
        <div id="component-demo-host">${window.RosemaryComponentDemos.render(id)}</div>
        <div class="component-preview-notes"><p>只展示<strong>${escape(item.title)}</strong>的示例与状态。触发按钮、标签等仅用于演示当前控件，不是其他组件的独立展示。</p><p>演示不连接真实账户；切换控件会重置本地示例。</p></div>
      </section>
      <section class="component-document-panel" id="component-panel-usage" role="tabpanel" aria-labelledby="component-tab-usage" tabindex="0" hidden>
        ${fields(item,[['结构','anatomy'],['变体','variants'],['尺寸','dimensions'],['状态','states']])}
        ${rules(escape(item.good),escape(item.bad))}
      </section>
      <section class="component-document-panel" id="component-panel-implementation" role="tabpanel" aria-labelledby="component-tab-implementation" tabindex="0" hidden>
        ${fields(item,[['操作行为','behavior'],['键盘','keyboard'],['可访问性','semantics'],['响应与边界','responsive'],['动效','motion'],['验证要求','validation']])}
        <p class="component-implementation-note">${escape(item.maturity)} ${escape(item.validation)}</p>
      </section>`;
  }
  function shell() {
    const {id,missing}=resolve();
    return `<section class="component-workspace" id="reference" aria-labelledby="component-picker-label">
      <div class="component-picker-bar"><div class="component-picker-field"><label class="field-label" id="component-picker-label" for="component-spec-select">选择控件</label><select class="field-select" id="component-spec-select">${groups.map(([label,items])=>`<optgroup label="${label}">${items.map(key=>`<option value="${key}"${key===id?' selected':''}>${escape(catalog[key].title)}</option>`).join('')}</optgroup>`).join('')}</select></div><div class="component-step-controls"><button type="button" class="icon-button" data-component-step="-1" aria-label="上一个控件">${icon('arrow-left')}</button><span id="component-position">${ids.indexOf(id)+1} / ${ids.length}</span><button type="button" class="icon-button" data-component-step="1" aria-label="下一个控件">${icon('arrow')}</button></div><p class="component-picker-help">每次只查看一个控件。<br>预览、规范和实现要求同步切换。</p></div>
      <p class="component-selection-status sr-only" id="component-selection-status" role="status">${missing?'未找到指定控件，已显示按钮。':''}</p>
      <div class="component-detail" id="component-detail" data-selected-component="${id}">${detail(id)}</div>
    </section>`;
  }
  function cleanupDetail() {
    demoCleanup?.();demoCleanup=null;
    tabsCleanup?.();tabsCleanup=null;
    const content=document.getElementById('component-detail');
    if(content)window.RosemaryMotion.cancelTree(content);
  }
  function mountDetail() {
    const demo=document.getElementById('component-demo-host');
    demoCleanup=window.RosemaryComponentDemos.mount(demo,currentId,{motion:window.RosemaryMotion});
    tabsCleanup=window.RosemaryMotion.bindTabs(document.getElementById('component-doc-tabs'),{
      initialKey:'preview',
      onChange(key){
        if(key==='preview')requestAnimationFrame(()=>{
          for(const root of demo.querySelectorAll('[data-motion-tabs="shared"]'))root.dispatchEvent(new Event('rosemary:refresh-tabs'));
        });
      }
    });
  }
  function updatePicker() {
    const index=ids.indexOf(currentId);
    const focused=document.activeElement;
    document.title=`组件规范 · ${catalog[currentId].title} · Rosemary Forma`;
    document.getElementById('component-spec-select').value=currentId;
    window.RosemarySelect?.refresh(document.getElementById('component-spec-select'));
    document.getElementById('component-position').textContent=`${index+1} / ${ids.length}`;
    host.querySelector('[data-component-step="-1"]').disabled=index===0;
    host.querySelector('[data-component-step="1"]').disabled=index===ids.length-1;
    if(focused?.disabled && host.contains(focused))window.RosemarySelect.control(document.getElementById('component-spec-select')).focus({preventScroll:true});
  }
  function navigate(id) {
    if(!ids.includes(id)||id===currentId)return;
    location.hash=`/components?component=${encodeURIComponent(id)}`;
  }
  function sync({initial=false}={}) {
    if(!host?.isConnected)return;
    const resolved=resolve();
    const detailHost=document.getElementById('component-detail');
    const status=document.getElementById('component-selection-status');
    status.classList.toggle('sr-only',!resolved.missing);
    const message=resolved.missing?'未找到指定控件，已显示按钮。':`已选择${catalog[resolved.id].title}，只显示该控件的示例与规范。`;
    if(status.textContent!==message)status.textContent=message;
    if(currentId===resolved.id){updatePicker();return;}
    const focusFromPicker=document.activeElement===window.RosemarySelect.control(document.getElementById('component-spec-select')) || document.activeElement?.matches('[data-component-step]');
    cleanupDetail();
    currentId=resolved.id;
    if(detailHost.dataset.selectedComponent!==currentId || !initial){detailHost.innerHTML=detail(currentId);detailHost.dataset.selectedComponent=currentId;}
    mountDetail();updatePicker();
    if(!initial)window.RosemaryMotion.enter(detailHost,{kind:'panel'});
    if(!initial && !focusFromPicker){
      const heading=document.getElementById('component-title');
      heading.tabIndex=-1;heading.focus({preventScroll:true});
      detailHost.scrollIntoView({block:'start',behavior:'instant'});
    }
  }
  function init() {
    destroy();host=document.getElementById('reference');if(!host)return;
    abort=new AbortController();
    document.getElementById('component-spec-select').addEventListener('change',event=>navigate(event.target.value),{signal:abort.signal});
    host.addEventListener('click',event=>{const control=event.target.closest('[data-component-step]');if(control&&!control.disabled)navigate(ids[ids.indexOf(currentId)+Number(control.dataset.componentStep)]);},{signal:abort.signal});
    sync({initial:true});
  }
  function destroy() {
    cleanupDetail();abort?.abort();abort=null;host=null;currentId='';
  }
  window.RosemaryComponentView={shell,init,sync,destroy,current:()=>currentId};
})();
