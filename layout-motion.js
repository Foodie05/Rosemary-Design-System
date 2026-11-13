/* Automatic size changes use layout dimensions, independent of press scale.
   Native range semantics update immediately; only their painted position eases. */
(() => {
  'use strict';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),buttons=new Map(),ranges=new Map();
  const selector='button,a.button,.page-next>a,[role=button]';
  const duration=180,ease='cubic-bezier(.2,.8,.2,1)';
  const widthOf=node=>parseFloat(getComputedStyle(node).width)||node.offsetWidth;
  let scanQueued=false;
  function stop(state) {state.generation++;state.animation?.cancel();state.animation=null;state.node.removeAttribute('data-motion-width');}
  function animateWidth(state,from,to) {
    if(!state.node.isConnected||!from||!to||Math.abs(from-to)<.5||reduced.matches||!state.node.animate){stop(state);state.width=to;return;}
    stop(state);state.width=to;const generation=state.generation;
    state.node.dataset.motionWidth='running';
    const frame=width=>({width:`${width}px`,minWidth:'0px',maxWidth:'none',flexBasis:`${width}px`,flexGrow:0,flexShrink:0});
    const animation=state.node.animate([frame(from),frame(to)],{duration,easing:ease,fill:'both'});state.animation=animation;
    animation.addEventListener('finish',()=>{if(generation!==state.generation)return;stop(state);state.width=widthOf(state.node);},{once:true});
  }
  const resize=new ResizeObserver(entries=>{
    for(const entry of entries){const state=buttons.get(entry.target);if(!state||state.animation)continue;
      const next=entry.borderBoxSize?.[0]?.inlineSize||widthOf(state.node),previous=state.width;state.width=next;
      if(state.node.getClientRects().length)animateWidth(state,previous,next);
    }
    document.dispatchEvent(new Event('rosemary:layout-motion'));
  });
  function retarget(node) {
    const state=buttons.get(node);if(!state?.animation)return;
    const from=widthOf(node);stop(state);const to=widthOf(node);animateWidth(state,from,to);
  }
  function paintRange(state,direct=false) {
    const input=state.input,min=Number(input.min||0),max=Number(input.max||100),ratio=Math.max(0,Math.min(1,(Number(input.value)-min)/(max-min||1)));
    state.wrapper.dataset.direct=String(direct||reduced.matches);state.wrapper.dataset.disabled=String(input.disabled);
    state.fill.style.width=100*ratio+'%';state.knob.style.left=`calc(8px + (100% - 16px) * ${ratio})`;
  }
  function mountRange(input) {
    if(ranges.has(input))return;
    const wrapper=document.createElement('span');wrapper.className='rm-range-shell';
    const track=document.createElement('span');track.className='rm-range-track';track.setAttribute('aria-hidden','true');
    const fill=document.createElement('span');fill.className='rm-range-fill';track.append(fill);
    const knob=document.createElement('span');knob.className='rm-range-knob';knob.setAttribute('aria-hidden','true');
    const state={input,wrapper,fill,knob,direct:false};ranges.set(input,state);
    input.before(wrapper);wrapper.append(track,knob,input);
    const descriptor=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
    Object.defineProperty(input,'value',{configurable:true,get(){return descriptor.get.call(this);},set(value){const old=descriptor.get.call(this);descriptor.set.call(this,value);if(descriptor.get.call(this)!==old)paintRange(state,state.direct);}});
    paintRange(state,true);
  }
  function scan() {
    scanQueued=false;
    for(const [node,state]of buttons)if(!node.isConnected){stop(state);resize.unobserve(node);buttons.delete(node);}
    for(const [input,state]of ranges)if(!input.isConnected){delete input.value;ranges.delete(input);}
    document.querySelectorAll(selector).forEach(node=>{if(!buttons.has(node)){const state={node,width:widthOf(node),animation:null,generation:0};buttons.set(node,state);resize.observe(node);}});
    document.querySelectorAll('input[type=range]').forEach(mountRange);
  }
  const queueScan=()=>{if(!scanQueued){scanQueued=true;queueMicrotask(scan);}};
  new MutationObserver(records=>{
    for(const record of records){const element=record.target.nodeType===1?record.target:record.target.parentElement;retarget(element?.closest?.(selector));
      if(ranges.has(element))paintRange(ranges.get(element));}
    queueScan();
  }).observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class','style','min','max','step','value','disabled']});
  document.addEventListener('pointerdown',event=>{const state=ranges.get(event.target);if(state)state.direct=true;},{capture:true,passive:true});
  const end=()=>{for(const state of ranges.values())state.direct=false;};
  document.addEventListener('pointerup',end,{capture:true,passive:true});document.addEventListener('pointercancel',end,{capture:true,passive:true});window.addEventListener('blur',end);
  document.addEventListener('input',event=>{const state=ranges.get(event.target);if(state)paintRange(state,state.direct);},{capture:true,passive:true});
  window.addEventListener('resize',()=>{for(const [node,state]of buttons)if(state.animation)retarget(node);},{passive:true});
  reduced.addEventListener('change',()=>{if(reduced.matches)for(const state of buttons.values())stop(state);for(const state of ranges.values())paintRange(state,true);});
  window.addEventListener('pagehide',()=>{for(const state of buttons.values())stop(state);});
  scan();
})();
