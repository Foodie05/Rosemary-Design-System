(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map();
  const bindings = new Set();
  const token = (key, fallback) => window.ROSEMARY_TOKENS?.motionMs?.[key] ?? fallback;
  const easing = () => window.ROSEMARY_TOKENS?.motionEasing || 'cubic-bezier(.2,.7,.2,1)';

  function cancel(element) {
    const animation = active.get(element);
    if (animation) { active.delete(element); animation.cancel(); }
  }
  function cancelTree(root) {
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
      const x = item.left - box.left - tablist.clientLeft + tablist.scrollLeft;
      if (!animate) marker.dataset.instant = 'true';
      marker.style.setProperty('--tab-x',`${x}px`);
      marker.style.setProperty('--tab-y',`${item.top-box.top-tablist.clientTop+tablist.scrollTop}px`);
      marker.style.setProperty('--tab-width',`${item.width}px`);
      marker.style.setProperty('--tab-height',`${item.height}px`);
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
  reduced.addEventListener('change',()=>{
    if (reduced.matches) for (const element of [...active.keys()]) cancel(element);
  });
  window.RosemaryMotion = {reduced,enter,bindTabs,bindRadioGroup:(group,options={})=>bindTabs(group,{...options,selectionRole:'radio'}),progress,cancel,cancelTree};
})();
