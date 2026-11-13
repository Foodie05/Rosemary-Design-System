(() => {
  'use strict';
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  // Two origins, on the top and bottom horizontal edges. Four fronts follow
  // the rounded outline and meet on the left/right halves, never starting there.
  function edges(width,height,corners,stroke=1.5,originX=.5) {
    const inset=Math.min(stroke/2,width/2,height/2),w=Math.max(0,width-2*inset),h=Math.max(0,height-2*inset);
    const radii=corners.map(([x,y])=>[Math.max(0,x),Math.max(0,y)]);
    const factor=Math.min(1,width/Math.max(1,radii[0][0]+radii[1][0]),width/Math.max(1,radii[3][0]+radii[2][0]),height/Math.max(1,radii[0][1]+radii[3][1]),height/Math.max(1,radii[1][1]+radii[2][1]));
    const [tl,tr,br,bl]=radii.map(([x,y])=>[Math.max(0,x*factor-inset),Math.max(0,y*factor-inset)]);
    const top=clamp(clamp(originX,0,1)*width-inset,tl[0],w-tr[0]),bottom=clamp(clamp(originX,0,1)*width-inset,bl[0],w-br[0]);
    const arc=(r,x,y,sweep=1)=>r[0]&&r[1]?`A ${r[0]} ${r[1]} 0 0 ${sweep} ${x} ${y}`:`L ${x} ${y}`;
    return {inset,w,h,top,bottom,paths:[
      {origin:'top',side:'right',d:`M ${top} 0 H ${w-tr[0]} ${arc(tr,w,tr[1])} V ${h-br[1]} ${arc(br,w-br[0],h)} H ${bottom}`},
      {origin:'bottom',side:'right',d:`M ${bottom} ${h} H ${w-br[0]} ${arc(br,w,h-br[1],0)} V ${tr[1]} ${arc(tr,w-tr[0],0,0)} H ${top}`},
      {origin:'top',side:'left',d:`M ${top} 0 H ${tl[0]} ${arc(tl,0,tl[1],0)} V ${h-bl[1]} ${arc(bl,bl[0],h,0)} H ${bottom}`},
      {origin:'bottom',side:'left',d:`M ${bottom} ${h} H ${bl[0]} ${arc(bl,0,h-bl[1])} V ${tl[1]} ${arc(tl,tl[0],0)} H ${top}`}
    ]};
  }
  function reveal(length,progress) {
    const shown=Math.min(length,length*.5+.02)*clamp(progress,0,1);
    return {shown,dasharray:`${shown} ${length}`,dashoffset:0};
  }
  window.RosemaryFieldFocusGeometry={edges,reveal};
  if(typeof document==='undefined')return;

  const selector='textarea,input:not([type]),input:is([type=text],[type=email],[type=password],[type=search],[type=url],[type=tel],[type=number])';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),forced=matchMedia('(forced-colors: active)');
  const ns='http://www.w3.org/2000/svg',rings=new Set();
  document.documentElement.dataset.fieldFocus='ready';
  let current=null,pointer=null;
  const eligible=field=>field?.matches?.(selector)&&!field.disabled;
  const hostFor=field=>field.closest('.search-dialog-top,.cs-search-field,.cs-query-form,.cd-inline-search-body')||field;
  const svgNode=(name,attributes={})=>{const node=document.createElementNS(ns,name);for(const [key,value] of Object.entries(attributes))node.setAttribute(key,value);return node;};
  const radius=(value,w,h)=>{const [x,y=x]=value.split(/\s+/);const length=(v,size)=>parseFloat(v)*(v.endsWith('%')?size/100:1)||0;return [length(x,w),length(y,h)];};
  function remove(ring) {
    cancelAnimationFrame(ring.frame);clearTimeout(ring.timer);ring.resize?.disconnect();
    for(const animation of ring.animations)animation.cancel();
    ring.svg.remove();rings.delete(ring);if(current===ring)current=null;
  }
  function update(ring) {
    if(!ring.field.isConnected||!ring.host.isConnected||ring.field.closest('[inert]')||!ring.host.getClientRects().length){remove(ring);return false;}
    const box=ring.host.getBoundingClientRect(),style=getComputedStyle(ring.host);
    // A dialog may itself be translating/scaling during entry. A fixed zero-size
    // probe shares that containing block, so the ring stays on the field edge.
    ring.svg.style.left='0px';ring.svg.style.top='0px';ring.svg.style.width='1px';ring.svg.style.height='1px';
    const probe=ring.svg.getBoundingClientRect(),sx=probe.width||1,sy=probe.height||1;
    const width=box.width/sx,height=box.height/sy,left=(box.left-probe.left)/sx,top=(box.top-probe.top)/sy;
    ring.svg.style.left=`${left}px`;ring.svg.style.top=`${top}px`;ring.svg.style.width=`${width}px`;ring.svg.style.height=`${height}px`;
    ring.svg.style.color=getComputedStyle(ring.field).getPropertyValue(ring.field.getAttribute('aria-invalid')==='true'?'--danger':'--focus').trim()||getComputedStyle(ring.field).getPropertyValue('--primary').trim();
    const shape=[width,height,...['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].map(key=>style[key])].join('|');
    if(shape!==ring.shape) {
      const resized=Boolean(ring.shape);
      ring.shape=shape;ring.svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
      const geometry=edges(width,height,['borderTopLeftRadius','borderTopRightRadius','borderBottomRightRadius','borderBottomLeftRadius'].map(key=>radius(style[key],width,height)),1.5,ring.originX);
      ring.group.setAttribute('transform',`translate(${geometry.inset} ${geometry.inset})`);
      geometry.paths.forEach((edge,i)=>{ring.paths[i].setAttribute('d',edge.d);});
      if(resized)complete(ring);
    }
    ring.box=box;ring.width=width;ring.height=height;return true;
  }
  function complete(ring) {
    for(const animation of ring.animations)animation.cancel();ring.animations=[];
    for(const path of ring.paths){path.style.strokeDasharray=reveal(path.getTotalLength(),1).dasharray;path.style.strokeDashoffset='0';}
  }
  function open(field) {
    if(!eligible(field)||forced.matches)return;
    if(current?.field===field)return;
    if(current)close(current);
    const host=hostFor(field),svg=svgNode('svg',{'class':'rm-field-focus','aria-hidden':'true','focusable':'false'}),group=svgNode('g');
    const paths=Array.from({length:4},()=>svgNode('path'));
    paths.forEach(path=>group.append(path));svg.append(group);
    (field.closest('dialog[open]')||document.body).append(svg);
    const box=host.getBoundingClientRect(),hit=pointer?.field===field&&performance.now()-pointer.time<500?pointer:null;
    const originX=hit?clamp((hit.x-box.left)/box.width,0,1):.5;
    pointer=null;
    const ring={field,host,svg,group,paths,originX,animations:[],started:performance.now()};rings.add(ring);current=ring;
    if(!update(ring))return;
    if(reduced.matches||!svg.animate)complete(ring);
    else paths.forEach(path=>{
      const length=path.getTotalLength(),start=reveal(length,0),end=reveal(length,1);
      path.style.strokeDasharray=end.dasharray;path.style.strokeDashoffset='0';
      ring.animations.push(path.animate([{strokeDasharray:start.dasharray,strokeDashoffset:String(start.dashoffset)},{strokeDasharray:end.dasharray,strokeDashoffset:'0'}],{duration:220,easing:'cubic-bezier(.2,.7,.2,1)'}));
    });
    ring.resize=new ResizeObserver(()=>update(ring));ring.resize.observe(host);
    // Follow only the short entry transition; scrolling/resizing has event-based
    // updates afterwards. No perpetual layout polling while a user is typing.
    const follow=()=>{if(current!==ring)return;if(update(ring)&&performance.now()-ring.started<300)ring.frame=requestAnimationFrame(follow);};
    ring.frame=requestAnimationFrame(follow);
  }
  function close(ring) {
    if(!ring||ring.closing)return;
    ring.closing=true;if(current===ring)current=null;
    cancelAnimationFrame(ring.frame);ring.resize?.disconnect();
    if(reduced.matches||!ring.svg.animate){remove(ring);return;}
    // Preserve the in-flight reveal during fade; do not replay it backwards.
    const fade=ring.svg.animate([{opacity:1},{opacity:0}],{duration:90,easing:'ease-out',fill:'forwards'});
    ring.animations.push(fade);fade.addEventListener('finish',()=>remove(ring),{once:true});ring.timer=setTimeout(()=>remove(ring),140);
  }
  document.addEventListener('pointerdown',event=>{
    const field=eligible(event.target)?event.target:event.target.closest?.('label')?.control;
    pointer=eligible(field)?{field,x:event.clientX,y:event.clientY,time:performance.now()}:null;
  },{capture:true,passive:true});
  document.addEventListener('keydown',()=>{pointer=null;},{capture:true});
  document.addEventListener('focusin',event=>open(event.target),{capture:true});
  document.addEventListener('focusout',event=>{if(current?.field===event.target)close(current);},{capture:true});
  const reposition=()=>{for(const ring of [...rings])if(!ring.closing)update(ring);};
  document.addEventListener('rosemary:layout-motion',reposition);
  document.addEventListener('rosemary:validation-change',()=>{for(const ring of rings)ring.svg.style.color=getComputedStyle(ring.field).getPropertyValue(ring.field.getAttribute('aria-invalid')==='true'?'--danger':'--focus').trim();});
  window.addEventListener('resize',reposition,{passive:true});document.addEventListener('scroll',reposition,{capture:true,passive:true});
  window.visualViewport?.addEventListener('resize',reposition,{passive:true});window.visualViewport?.addEventListener('scroll',reposition,{passive:true});
  new MutationObserver(()=>{for(const ring of [...rings])if(!ring.field.isConnected||!ring.field.closest('body')||ring.field.closest('dialog:not([open]),[hidden],[inert]'))remove(ring);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['open','hidden','inert']});
  new MutationObserver(reposition).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme','style']});
  reduced.addEventListener('change',()=>{if(reduced.matches)for(const ring of [...rings])ring.closing?remove(ring):complete(ring);});
  forced.addEventListener('change',()=>{for(const ring of [...rings])remove(ring);if(!forced.matches)open(document.activeElement);});
  window.addEventListener('pagehide',()=>{for(const ring of [...rings])remove(ring);});
  if(eligible(document.activeElement))open(document.activeElement);
})();
