(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  const bindings = new Set();
  const poses = new Map();
  const physics = () => window.RosemaryPhysics;
  const physicalRecipe = () => window.ROSEMARY_MOTION_PHYSICS;
  const token = (key, fallback) => window.ROSEMARY_TOKENS?.motionMs?.[key] ?? fallback;
  const easing = () => window.ROSEMARY_TOKENS?.motionEasing || 'cubic-bezier(.2,.7,.2,1)';

  function cancel(element) {
    cancelPose(element);
    const animation = active.get(element);
    if (animation) { active.delete(element); animation.cancel(); }
  }
  function cancelTree(root) {
    for (const element of poses.keys()) if(element===root||root.contains(element))cancelPose(element);
    for (const element of active.keys()) {
      if (element === root || root.contains(element)) cancel(element);
    }
  }
  function enter(element, {kind='panel'} = {}) {
    if (!element || !element.isConnected || element.hidden) return null;
    const previous = active.get(element);
    const currentOpacity = previous ? Number(getComputedStyle(element).opacity) : null;
    cancel(element);
    element.dataset.motionKind = kind;
    if (reduced.matches || !element.animate) return null;
    if (element.matches('.cd-menu-panel,.cd-popover,.cd-picker-popup,.cd-tooltip,.cd-dialog,.cd-toast')) return surface(element,{kind:element.matches('.cd-drawer')?'drawer':'popover'});
    const duration = kind === 'page' ? token('page',220) : token('state',180);
    const frames = kind === 'page'
      ? [{opacity:currentOpacity ?? .35,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}]
      : [{opacity:currentOpacity ?? .4},{opacity:1}];
    const animation = element.animate(frames,{duration,easing:easing(),fill:'none'});
    active.set(element,animation);
    const release = () => { if (active.get(element) === animation) active.delete(element); };
    animation.addEventListener('finish',release,{once:true});
    animation.addEventListener('cancel',release,{once:true});
    return animation;
  }

  // Snapshot before cancellation so a rapid reversal starts at the visible frame.
  function surface(element, {open=true, kind='popover', onFinish} = {}) {
    if (!element?.isConnected) return null;
    if(kind==='popover'&&element.matches?.('.rm-select-list,.menu-popover,.cd-menu-panel,.cd-popover,.cd-picker-popup'))kind='disclosure';
    element.dataset.motionKind=kind;
    const previous = active.get(element);
    const current = previous ? getComputedStyle(element) : null;
    const from = current ? {opacity:current.opacity,transform:current.transform,...(kind==='disclosure'?{clipPath:current.clipPath}: {})} : null;
    cancel(element);
    if (reduced.matches || !element.animate) { onFinish?.(); return null; }
    const disclosure=kind==='disclosure';
    const offset = kind === 'drawer' ? 'translateX(100%)' : `translateY(${element.dataset.placement === 'above' ? '-4px' : '4px'})`;
    const rest = disclosure ? {opacity:1,transform:'none',clipPath:element.dataset.placement==='above'?'inset(-40px -40px 0px -40px)':'inset(0px -40px -40px -40px)'} : {opacity:1,transform:'translate(0)'};
    const edge = disclosure ? {opacity:1,transform:'none',clipPath:element.dataset.placement==='above'?'inset(100% -40px 0px -40px)':'inset(0px -40px 100% -40px)'} : {opacity:0,transform:offset};
    const recipe=physicalRecipe()?.disclosure;
    const duration=disclosure?(open?recipe?.durationMs||240:recipe?.exitMs||180):(open?token('enter',220):token('exit',140));
    let curve=easing();
    if(disclosure&&recipe&&physics()){
      const springCurve=physics().cssEasing({...recipe,durationMs:duration});
      if(typeof CSS!=='undefined'&&CSS.supports('animation-timing-function',springCurve))curve=springCurve;
    }
    const animation = element.animate([from || (open ? edge : rest),open ? rest : edge],{duration,easing:curve,fill:'both'});
    active.set(element,animation);
    animation.addEventListener('finish',()=>{
      if (active.get(element)!==animation) return;
      active.delete(element);onFinish?.();animation.cancel();
    },{once:true});
    animation.addEventListener('cancel',()=>{if(active.get(element)===animation)active.delete(element);},{once:true});
    return animation;
  }

  function bindTabs(tablist, {onChange, panel, initialKey, selectionRole='tab'} = {}) {
    if (!tablist) return () => {};
    const abort = new AbortController();
    const selector = `[role="${selectionRole}"][data-tab-key]`;
    const selectedAttribute = selectionRole === 'radio' ? 'aria-checked' : 'aria-selected';
    const tabs = [...tablist.querySelectorAll(selector)];
    let disposed = false;
    let current = null;
    let resetFrame = 0;
    let resizeObserver;
    tablist.classList.add('rm-tabs');
    if (selectionRole === 'tab') tablist.dataset.motionTabs = 'shared';
    else tablist.dataset.motionSelection = 'shared';
    const marker = document.createElement('span');
    marker.className = 'rm-tab-indicator';
    marker.setAttribute('aria-hidden','true');
    tablist.prepend(marker);
    const enabled = () => tabs.filter(tab => !tab.disabled && tab.getAttribute('aria-disabled') !== 'true');
    const resolvePanel = tab => typeof panel === 'function' ? panel(tab.dataset.tabKey,tab)
      : panel || document.getElementById(tab.getAttribute('aria-controls'));

    function positionMarker(animate=false) {
      if (disposed || !current || !tablist.clientWidth) return;
      const box = tablist.getBoundingClientRect();
      const item = current.getBoundingClientRect();
      const layout=current.offsetParent===tablist;
      const x = layout?current.offsetLeft:item.left - box.left - tablist.clientLeft + tablist.scrollLeft;
      if (!animate) marker.dataset.instant = 'true';
      marker.style.setProperty('--tab-x',`${x}px`);
      marker.style.setProperty('--tab-y',`${layout?current.offsetTop:item.top-box.top-tablist.clientTop+tablist.scrollTop}px`);
      marker.style.setProperty('--tab-width',`${layout?current.offsetWidth:item.width}px`);
      marker.style.setProperty('--tab-height',`${layout?current.offsetHeight:item.height}px`);
      if (!animate) {
        marker.getBoundingClientRect();
        cancelAnimationFrame(resetFrame);
        resetFrame = requestAnimationFrame(() => { if (!disposed) delete marker.dataset.instant; });
      }
    }

    function activate(tab, {focus=false,animate=true,initial=false} = {}) {
      if (disposed || !tab || !enabled().includes(tab)) return;
      const changed = current !== tab;
      current = tab;
      for (const item of tabs) {
        const selected = item === tab;
        item.setAttribute(selectedAttribute,String(selected));
        item.tabIndex = selected ? 0 : -1;
      }
      let target = resolvePanel(tab);
      const controlled = new Set(tabs.map(resolvePanel).filter(Boolean));
      if (controlled.size > 1) for (const item of controlled) {
        item.hidden = item !== target;
        if(item!==target)cancelTree(item);
      }
      if (target) {
        target.hidden = false;
        if (tab.id) target.setAttribute('aria-labelledby',tab.id);
      }
      if (changed || initial) onChange?.(tab.dataset.tabKey,tab,{initial});
      // Callbacks can replace panel contents or the panel itself. Animate the
      // current connected surface after the callback, keeping the tablist intact.
      target = resolvePanel(tab);
      if(target){target.hidden=false;if(tab.id)target.setAttribute('aria-labelledby',tab.id);}
      positionMarker(animate && changed);
      if (animate && changed && target) enter(target,{kind:'panel'});
      if (focus) {
        tab.focus({preventScroll:true});
        const listBox = tablist.getBoundingClientRect();
        const tabBox = tab.getBoundingClientRect();
        if (tabBox.left < listBox.left || tabBox.right > listBox.right) {
          tab.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
        }
      }
    }

    tablist.addEventListener('click',event => {
      const tab = event.target.closest(selector);
      if (tabs.includes(tab)) activate(tab);
    },{signal:abort.signal});
    tablist.addEventListener('keydown',event => {
      const items = enabled();
      const index = items.indexOf(event.target);
      if (index < 0) return;
      const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
      const rtl = getComputedStyle(tablist).direction === 'rtl';
      let next;
      if (event.key === (vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight')) next=(index+1)%items.length;
      if (event.key === (vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft')) next=(index+items.length-1)%items.length;
      if (event.key === 'Home') next=0;
      if (event.key === 'End') next=items.length-1;
      if (next !== undefined) { event.preventDefault(); activate(items[next],{focus:true}); }
    },{signal:abort.signal});

    const first = enabled().find(tab=>tab.dataset.tabKey===initialKey) || enabled().find(tab=>tab.getAttribute(selectedAttribute)==='true') || enabled()[0];
    activate(first,{animate:false,initial:true});
    const refresh = () => positionMarker(false);
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver(refresh);
      resizeObserver.observe(tablist);
      for(const tab of tabs)resizeObserver.observe(tab);
    }
    window.addEventListener('resize',refresh,{signal:abort.signal});
    window.visualViewport?.addEventListener('resize',refresh,{signal:abort.signal});
    tablist.addEventListener('rosemary:refresh-tabs',refresh,{signal:abort.signal});
    reduced.addEventListener('change',refresh,{signal:abort.signal});
    const cleanup = () => {
      if (disposed) return;
      disposed=true;abort.abort();resizeObserver?.disconnect();cancelAnimationFrame(resetFrame);
      for (const tab of tabs) { const target=resolvePanel(tab);if(target)cancelTree(target); }
      marker.remove();bindings.delete(cleanup);
    };
    cleanup.select = (key,options={}) => activate(tabs.find(tab=>tab.dataset.tabKey===key),options);
    cleanup.refresh = refresh;
    cleanup.current = () => current?.dataset.tabKey;
    bindings.add(cleanup);
    return cleanup;
  }

  function progress(nativeProgress,visualFill,value) {
    if (!nativeProgress || !visualFill) return;
    const maximum = nativeProgress.max > 0 ? nativeProgress.max : 1;
    const next = Math.max(0,Math.min(maximum,Number(value)||0));
    nativeProgress.value=next;
    const reset=next===0;
    visualFill.dataset.instant=String(reset);
    visualFill.dataset.flowing=String(next>0&&next<maximum);
    visualFill.style.setProperty('--progress-ratio',String(next/maximum));
    if (reset) {
      visualFill.getBoundingClientRect();
      requestAnimationFrame(()=>{if(visualFill.isConnected)visualFill.dataset.instant='false';});
    }
  }
  function cancelPose(element) {
    const pose=poses.get(element);
    if(!pose)return;
    poses.delete(element);pose.animation.cancel();element.removeAttribute('data-motion-press');
  }
  function poseSample(element) {
    const pose=poses.get(element);
    if(!pose)return {position:Number.parseFloat(getComputedStyle(element).scale)||1,velocity:0};
    const elapsed=(performance.now()-pose.started)/1000;
    return elapsed>=pose.duration/1000?{position:pose.state.target,velocity:0}:physics().sample(pose.state,elapsed);
  }
  function animatePose(element,{down=false,selection=false,cancelled=false}={}) {
    const recipe=physicalRecipe(),P=physics();
    if(!element?.isConnected||!recipe||!P||reduced.matches||!element.animate){if(element)cancelPose(element);return;}
    const previous=poses.get(element),sample=poseSample(element),base=previous?.base??sample.position;
    const parameters=down?recipe.press:cancelled?{...recipe.press,durationMs:180}:recipe.release;
    const target=down?base*(selection?recipe.selection.scale:recipe.press.scale):base;
    const state=P.state(parameters,sample.position,sample.velocity,target);
    cancelPose(element);
    element.dataset.motionPress=down?'held':'release';
    const animation=element.animate(P.frames(state,parameters.durationMs),{duration:parameters.durationMs,easing:'linear',fill:'both'});
    const pose={animation,state,base,duration:parameters.durationMs,started:performance.now()};
    poses.set(element,pose);
    animation.addEventListener('finish',()=>{if(!down&&poses.get(element)===pose)cancelPose(element);},{once:true});
    animation.addEventListener('cancel',()=>{if(poses.get(element)===pose){poses.delete(element);element.removeAttribute('data-motion-press');}},{once:true});
  }
  // Popup anchoring uses the rest frame, not the transient pressed visual scale.
  function anchorRect(element) {
    const r=element.getBoundingClientRect(),pose=poses.get(element);
    if(!pose)return r;
    const scale=(Number.parseFloat(getComputedStyle(element).scale)||1)/pose.base;
    const width=r.width/scale,height=r.height/scale,left=r.left+(r.width-width)/2,top=r.top+(r.height-height)/2;
    return {x:left,y:top,left,top,right:left+width,bottom:top+height,width,height};
  }
  function bindPressFeedback(root) {
    const abort=new AbortController(),pointers=new Map(),keys=new Map(),released=new WeakMap();
    const on=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal:abort.signal});
    const candidate=target=>{
      if(!target?.closest)return null;
      let control=target.closest('button,input[type=button],input[type=submit],input[type=reset],input[type=checkbox],input[type=radio],a.button,.page-next>a,.nav-link,[role=button],[role=switch]');
      if(!control){const label=target.closest('label');if(label?.control?.matches('input[type=checkbox],input[type=radio]'))control=label.control;}
      if(control?.matches('.rm-select-trigger'))return null; // one connected disclosure, not an independently bouncing button
      if(!control||control.disabled||control.getAttribute('aria-disabled')==='true'||control.closest('[inert]'))return null;
      const selection=control.matches('input[type=checkbox],input[type=radio]');
      const sibling=selection?control.nextElementSibling:null;
      const node=sibling?.matches('.cs-checkbox-visual,.cs-radio-visual,.rm-check-visual,.rm-radio-visual')?sibling:control;
      return {control,node,selection};
    };
    const release=(item,cancelled=false)=>{if(!item)return;animatePose(item.node,{selection:item.selection,cancelled});released.set(item.control,performance.now());};
    on(root,'pointerdown',event=>{
      if(event.button!==0||event.isPrimary===false)return;
      const item=candidate(event.target);if(!item)return;
      const label=item.selection?item.control.closest('label'):null;item.box=anchorRect(label||item.control);item.inside=true;pointers.set(event.pointerId,item);animatePose(item.node,{down:true,selection:item.selection});
    },{capture:true,passive:true});
    on(root,'pointermove',event=>{
      const item=pointers.get(event.pointerId);if(!item)return;
      const b=item.box,inside=event.clientX>=b.left&&event.clientX<=b.right&&event.clientY>=b.top&&event.clientY<=b.bottom;
      if(inside!==item.inside){item.inside=inside;inside?animatePose(item.node,{down:true,selection:item.selection}):release(item,true);}
    },{capture:true,passive:true});
    on(root,'pointerup',event=>{const item=pointers.get(event.pointerId);pointers.delete(event.pointerId);release(item,!item?.inside);},{capture:true,passive:true});
    on(root,'pointercancel',event=>{const item=pointers.get(event.pointerId);pointers.delete(event.pointerId);release(item,true);},{capture:true,passive:true});
    on(root,'keydown',event=>{
      if(event.repeat||![' ','Enter'].includes(event.key))return;
      const item=candidate(event.target);if(!item)return;keys.set(event.key,item);animatePose(item.node,{down:true,selection:item.selection});
    },{capture:true});
    on(root,'keyup',event=>{const item=keys.get(event.key);if(item){keys.delete(event.key);release(item);}},{capture:true});
    // Assistive or programmatic activation has no pointer sequence; keep it brief.
    on(root,'click',event=>{
      const item=candidate(event.target);if(!item||[...keys.values()].some(key=>key.control===item.control)||performance.now()-(released.get(item.control)??-Infinity)<120)return;
      if(event.detail>0&&item.selection)return; // a label click can forward one native click to its control
      const recipe=physicalRecipe(),P=physics();if(!recipe||!P||reduced.matches)return;
      const position=item.selection?recipe.selection.scale:recipe.press.scale;
      cancelPose(item.node);
      const state=P.state(recipe.release,position,0,1),animation=item.node.animate(P.frames(state,recipe.release.durationMs),{duration:recipe.release.durationMs,easing:'linear',fill:'both'});
      const pose={state,animation,base:1,duration:recipe.release.durationMs,started:performance.now()};poses.set(item.node,pose);item.node.dataset.motionPress='release';
      animation.addEventListener('finish',()=>{if(poses.get(item.node)===pose)cancelPose(item.node);},{once:true});
    },{capture:true});
    const reset=()=>{pointers.clear();keys.clear();for(const node of [...poses.keys()])cancelPose(node);};
    on(window,'blur',reset);on(window,'pagehide',reset);on(root,'visibilitychange',()=>{if(document.hidden)reset();});
    const observer=new MutationObserver(()=>{for(const node of poses.keys())if(!node.isConnected)cancelPose(node);for(const [id,item]of pointers)if(!item.control.isConnected)pointers.delete(id);for(const [key,item]of keys)if(!item.control.isConnected)keys.delete(key);});
    observer.observe(document.documentElement,{childList:true,subtree:true});
    return ()=>{reset();abort.abort();observer.disconnect();};
  }
  if(typeof document!=='undefined')bindPressFeedback(document);
  reduced.addEventListener('change',()=>{
    if (reduced.matches) {for(const node of [...poses.keys()])cancelPose(node);for (const animation of [...active.values()]) animation.finish();}
  });
  window.RosemaryMotion = {reduced,enter,surface,bindTabs,bindRadioGroup:(group,options={})=>bindTabs(group,{...options,selectionRole:'radio'}),progress,cancel,cancelTree,anchorRect};
})();
