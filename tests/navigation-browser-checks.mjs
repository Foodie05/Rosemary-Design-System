export async function runNavigationChecks({route,click,key,evaluate,until,delay,check,send,screenshot,viewport}) {
  const resizeMeasurements=[];
  const ids=await evaluate('Object.keys(RosemaryComponentCatalog)');
  for(const width of [1440,375]) {
    for(const theme of ['light','dark']) {
      await viewport(width,width===375?812:1000,theme);
      for(const id of ids) {
        await route(`components?component=${id}`);
        await until(`document.querySelector('[data-component-demo="${id}"]')!==null`);
        const result=await evaluate(`(() => {
          const roots=[...document.querySelectorAll('[data-component-demo]')];
          const root=roots[0];
          const allIds=[...document.querySelectorAll('[id]')].map(n=>n.id);
          const visibleButtons=[...document.querySelectorAll('button')].filter(n=>n.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}));
          const unnamed=visibleButtons.filter(n=>!(n.getAttribute('aria-label')||n.getAttribute('aria-labelledby')||n.innerText.trim()||n.title));
          const inputs=[...root.querySelectorAll('input:not([type=hidden]),select,textarea')].filter(n=>n.checkVisibility());
          const unlabeled=inputs.filter(n=>!(n.labels?.length||n.getAttribute('aria-label')||n.getAttribute('aria-labelledby')));
          return {roots:roots.length,id:root?.dataset.componentDemo,selected:document.getElementById('component-spec-select').value,visible:root?.checkVisibility(),previewSelected:document.getElementById('component-tab-preview').getAttribute('aria-selected'),visual:!!root?.querySelector('button,input,select,textarea,a,svg,progress,.cd-card,.cd-badge,.cd-avatar,.cd-skeleton'),overflow:document.documentElement.scrollWidth>innerWidth+1,duplicates:allIds.filter((x,i)=>allIds.indexOf(x)!==i),unnamed:unnamed.map(n=>n.outerHTML),unlabeled:unlabeled.map(n=>n.outerHTML),tabs:[...document.querySelectorAll('[role=tablist]')].map(n=>({shared:n.dataset.motionTabs,selected:n.querySelectorAll('[role=tab][aria-selected=true]').length}))};
        })()`);
        const valid=result.roots===1&&result.id===id&&result.selected===id&&result.visible&&result.previewSelected==='true'&&result.visual&&!result.overflow&&!result.duplicates.length&&!result.unnamed.length&&!result.unlabeled.length&&result.tabs.every(t=>t.shared==='shared'&&t.selected===1);
        if(!valid)console.log('Isolated preview diagnostics:',id,width,theme,JSON.stringify(result));
        check(`Isolated ${id} preview at ${width}px ${theme}: visual, labeled, one owner, no overflow`,valid);
      }
    }
  }
  await viewport(1440,1000,'light');
  await route('overview');
  check('Overview contains useful destinations without unrelated artwork',await evaluate(`!document.querySelector('.hero-art,.entry-drawing,.manifesto-mark')&&document.querySelectorAll('.overview-component-links a').length===6`));
  const chromeBefore=await evaluate(`({top:document.querySelector('.topbar').getBoundingClientRect().top,side:document.querySelector('.sidebar').getBoundingClientRect().left})`);
  await route('colors');
  const pageMotion=await evaluate(`document.querySelector('main').firstElementChild.getAnimations().map(a=>({duration:a.effect.getTiming().duration,frames:a.effect.getKeyframes(),state:a.playState}))`);
  check('Chapter changes play a nonblocking 220ms content transition',pageMotion.some(a=>a.duration===220&&a.state==='running'&&a.frames.some(frame=>frame.transform?.includes('6px'))));
  check('Navigation and topbar stay fixed during page transition',await evaluate(`document.querySelector('.topbar').getBoundingClientRect().top===${chromeBefore.top}&&document.querySelector('.sidebar').getBoundingClientRect().left===${chromeBefore.side}`));
  await evaluate(`location.hash='/typography';location.hash='/layout';location.hash='/components?component=table'`);
  await until(`document.querySelector('[data-component-demo="table"]')!==null`);
  await delay(260);
  check('Rapid navigation displays only the final route with no queued page animation',await evaluate(`RosemaryComponentView.current()==='table'&&document.querySelectorAll('[data-component-demo]').length===1&&!document.querySelector('main').firstElementChild.getAnimations().some(a=>a.playState==='running')`));

  await route('components?component=input');
  await evaluate(`document.querySelector('[data-component-demo="input"] [data-cd-field="name"]').value='保留的输入';document.querySelector('[data-component-demo="input"] [data-cd-field="name"]').dispatchEvent(new Event('input',{bubbles:true}))`);
  await click('#component-tab-usage');
  check('Documentation tabs hide preview without displaying other components',await evaluate(`document.getElementById('component-panel-preview').hidden&&!document.getElementById('component-panel-usage').hidden&&document.querySelectorAll('[data-component-demo]').length===1&&document.querySelector('[data-component-demo]').dataset.componentDemo==='input'`));
  const docTiming=await evaluate(`({indicator:getComputedStyle(document.querySelector('#component-doc-tabs .rm-tab-indicator')).transitionDuration,panel:document.getElementById('component-panel-usage').getAnimations().map(a=>a.effect.getTiming().duration)})`);
  check('Documentation tabs use the shared 180ms marker and content timing',docTiming.indicator.split(',').every(n=>n.trim()==='0.18s')&&docTiming.panel.includes(180));
  await evaluate(`document.getElementById('component-tab-usage').focus()`);
  await key('ArrowRight','ArrowRight');
  check('Documentation tabs retain native keyboard focus and panel association',await evaluate(`document.activeElement.id==='component-tab-implementation'&&!document.getElementById('component-panel-implementation').hidden&&document.getElementById('component-panel-implementation').getAttribute('aria-labelledby')==='component-tab-implementation'`));
  await click('#component-tab-preview');
  check('Returning to preview preserves the current control state',await evaluate(`document.querySelector('[data-component-demo="input"] [data-cd-field="name"]').value==='保留的输入'`));
  await evaluate(`RosemarySelect.control(document.getElementById('component-spec-select')).focus();document.getElementById('component-spec-select').value='switch';document.getElementById('component-spec-select').dispatchEvent(new Event('change',{bubbles:true}))`);
  await until(`document.querySelector('[data-component-demo="switch"]')!==null`);
  check('Changing controls preserves selector focus and resets to the selected preview',await evaluate(`document.activeElement===RosemarySelect.control(document.getElementById('component-spec-select'))&&document.getElementById('component-tab-preview').getAttribute('aria-selected')==='true'&&!document.querySelector('[data-component-demo="input"]')`));
  await evaluate('history.back()');
  await until(`document.querySelector('[data-component-demo="input"]')!==null`);
  check('Browser history restores the correct component destination',await evaluate(`document.getElementById('component-spec-select').value==='input'`));

  await route('components?component=tabs');
  await click('[data-component-demo="tabs"] [data-tab-key="kept"]');
  const demoTiming=await evaluate(`({indicator:getComputedStyle(document.querySelector('[data-component-demo="tabs"] .rm-tab-indicator')).transitionDuration,panel:document.querySelector('[data-component-demo="tabs"] [data-cd-panel]').getAnimations().map(a=>a.effect.getTiming().duration)})`);
  check('Tabs component and documentation share the same motion implementation',demoTiming.indicator===docTiming.indicator&&demoTiming.panel.includes(180));
  await route('motion');
  await click('#motion-tab-plans');
  const motionTiming=await evaluate(`({indicator:getComputedStyle(document.querySelector('#motion-tabs .rm-tab-indicator')).transitionDuration,panel:document.getElementById('motion-tab-panel').getAnimations().map(a=>a.effect.getTiming().duration)})`);
  check('Motion guide uses the same tab timings as the live component',motionTiming.indicator===docTiming.indicator&&motionTiming.panel.includes(180));
  await evaluate(`document.getElementById('motion-tab-saved').click();document.getElementById('motion-tab-notes').click();document.getElementById('motion-tab-plans').click()`);
  await delay(230);
  const marker=await evaluate(`(() => {const tab=document.getElementById('motion-tab-plans').getBoundingClientRect(),marker=document.querySelector('#motion-tabs .rm-tab-indicator').getBoundingClientRect();return {deltaX:Math.abs(tab.left-marker.left),deltaY:Math.abs(tab.top-marker.top),width:Math.abs(tab.width-marker.width),panel:document.getElementById('motion-tab-panel').getAttribute('aria-labelledby')};})()`);
  check('Rapid tab changes settle at the latest selection without stale content',marker.deltaX<1&&marker.deltaY<1&&marker.width<1&&marker.panel==='motion-tab-plans');

  // Resize the existing page, not a newly routed/rebuilt component. Non-first
  // selections exercise both marker translation and responsive tab widths.
  const resizeCases=[
    {name:'documentation usage',route:'components?component=tabs',select:'#component-tab-usage',lists:['#component-doc-tabs']},
    {name:'documentation implementation',route:'components?component=tabs',select:'#component-tab-implementation',lists:['#component-doc-tabs']},
    {name:'nested component kept',route:'components?component=tabs',select:'[data-component-demo="tabs"] [data-tab-key="kept"]',lists:['#component-doc-tabs','[data-component-demo="tabs"] [data-cd-tablist]']},
    {name:'motion guide plans',route:'motion',select:'#motion-tab-plans',lists:['#motion-tabs']}
  ];
  for(const theme of ['light','dark'])for(const scenario of resizeCases) {
    await viewport(1440,1000,theme);
    await route(scenario.route);
    if(scenario.name==='nested component kept')await click('#component-tab-preview');
    await click(scenario.select);
    await delay(240);
    await evaluate(`window.__resizeRegression={page:document.querySelector('main').firstElementChild,demo:document.querySelector('[data-component-demo]'),hash:location.hash,lists:${JSON.stringify(scenario.lists)}.map(selector=>{const list=document.querySelector(selector),tab=list.querySelector('[role="tab"][aria-selected="true"]');return {selector,list,tab,marker:list.querySelector('.rm-tab-indicator'),panel:document.getElementById(tab.getAttribute('aria-controls')),key:tab.dataset.tabKey};})}`);
    const samples=[];
    for(const width of [1440,375,1440]) {
      // Only the viewport changes: no route, theme event, tab click or refresh.
      await send('Emulation.setDeviceMetricsOverride',{width,height:width===375?812:1000,deviceScaleFactor:1,mobile:width<768});
      await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
      await delay(80);
      const result=await evaluate(`(() => {const saved=window.__resizeRegression;return {samePage:saved.page===document.querySelector('main').firstElementChild&&saved.demo===document.querySelector('[data-component-demo]')&&saved.hash===location.hash,lists:saved.lists.map(saved=>{const list=document.querySelector(saved.selector),tab=list.querySelector('[role="tab"][aria-selected="true"]'),marker=list.querySelector('.rm-tab-indicator'),a=tab.getBoundingClientRect(),b=marker.getBoundingClientRect();return {selector:saved.selector,sameNodes:list===saved.list&&tab===saved.tab&&marker===saved.marker&&document.getElementById(tab.getAttribute('aria-controls'))===saved.panel,selected:tab.dataset.tabKey,panelVisible:saved.panel.checkVisibility(),labelledBy:saved.panel.getAttribute('aria-labelledby')===tab.id,tabWidth:a.width,markerWidth:b.width,deltaX:Math.abs(a.left-b.left),deltaY:Math.abs(a.top-b.top),deltaWidth:Math.abs(a.width-b.width),deltaHeight:Math.abs(a.height-b.height)};})};})()`);
      const label=`In-place resize ${scenario.name} ${theme} ${width}px (step ${samples.length+1})`;
      check(`${label}: preserves page, component, tab, marker and panel DOM`,result.samePage&&result.lists.every(item=>item.sameNodes));
      for(const item of result.lists) {
        if(!item.panelVisible||!item.labelledBy||[item.deltaX,item.deltaY,item.deltaWidth,item.deltaHeight].some(delta=>delta>=1))console.log('Resize diagnostics:',label,JSON.stringify(item));
        check(`${label} ${item.selector}: selected marker position and size match the visible panel`,item.panelVisible&&item.labelledBy&&[item.deltaX,item.deltaY,item.deltaWidth,item.deltaHeight].every(delta=>delta<1));
        resizeMeasurements.push({scenario:scenario.name,theme,viewportWidth:width,step:samples.length+1,...item});
      }
      samples.push(result);
    }
    for(let index=0;index<scenario.lists.length;index++) {
      const wide=samples[0].lists[index].tabWidth,narrow=samples[1].lists[index].tabWidth,restored=samples[2].lists[index].tabWidth;
      check(`In-place resize ${scenario.name} ${theme} ${scenario.lists[index]}: actually changes tab width and restores it`,Math.abs(wide-narrow)>1&&Math.abs(wide-restored)<1);
    }
    await evaluate('delete window.__resizeRegression');
  }

  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await route('components?component=tabs');
  await click('[data-component-demo="tabs"] [data-tab-key="draft"]');
  check('Reduced motion disables both chapter and tab transitions without changing behavior',await evaluate(`!document.querySelector('main').firstElementChild.getAnimations().length&&getComputedStyle(document.querySelector('[data-component-demo="tabs"] .rm-tab-indicator')).transitionDuration==='0s'&&!document.querySelector('[data-component-demo="tabs"] [data-cd-panel]').getAnimations().length&&document.querySelector('[data-component-demo="tabs"] [data-tab-key="draft"]').getAttribute('aria-selected')==='true'`));
  await click('#component-tab-usage');
  check('Reduced-motion documentation panel changes are immediate',await evaluate(`!document.getElementById('component-panel-usage').hidden&&!document.getElementById('component-panel-usage').getAnimations().length`));
  await viewport(1440,1000,'light');
  await route('components?component=button');await screenshot('components-desktop.png');
  await route('components?component=tabs');await screenshot('component-tabs-desktop.png');
  await route('components?component=dialog');await screenshot('component-dialog-desktop.png');
  await route('components?component=progress');await screenshot('component-progress-desktop.png');
  await route('overview');await screenshot('home-desktop.png');
  return {resizeMeasurements};
}
