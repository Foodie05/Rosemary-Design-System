/* Rosemary color recipes. HCT gamut mapping is provided by Material Color Utilities.
   Rosemary owns role assignments, mood recipes and container/content pairings. */
(() => {
  'use strict';
  const M=window.RosemaryMaterial;
  const DEFAULT={seed:'#614578',mood:'calm'};
  const KEY='rosemary-color-preferences-v1';
  const roles=['canvas','surface','raised','ink','muted','border','control','primary','on-primary','primary-soft','sun','on-sun','sky','on-sky','success','success-soft','warning','warning-soft','danger','danger-soft','on-danger','info','info-soft','focus'];
  const tones=[0,10,20,30,40,50,60,70,80,90,95,98,100];
  const cache=new Map();let selected,active;
  function normalize(input=DEFAULT){
    if(!/^#[\da-f]{6}$/i.test(input.seed)||!['calm','vivid'].includes(input.mood))throw new TypeError('使用完整的六位 HEX 色值，并选择沉静或鲜亮。');
    return {seed:input.seed.toUpperCase(),mood:input.mood};
  }
  function luminance(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);}
  function contrast(a,b){const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
  function inspect(c){
    const text=[['ink','canvas'],['muted','canvas'],['ink','surface'],['muted','surface'],['ink','raised'],['muted','raised'],['primary','primary-soft'],['ink','primary-soft'],['on-primary','primary'],['on-sun','sun'],['on-sky','sky'],['success','success-soft'],['warning','warning-soft'],['danger','danger-soft'],['on-danger','danger'],['info','info-soft'],['on-navigation','surface-navigation'],['navigation-muted','surface-navigation'],['on-topbar','surface-topbar'],['on-topbar-muted','surface-topbar'],['navigation-muted','surface-topbar'],['ink','field-fill'],['muted','field-fill'],['ink','field-hover'],['muted','field-hover'],['on-secondary-container','secondary-container'],['on-tertiary-container','tertiary-container']];
    const state=[['control','canvas'],['control','surface'],['control','raised'],['field-line','field-fill'],['field-line','canvas'],['field-line','surface-inset'],['field-line-hover','field-hover'],['focus','canvas'],['focus','surface'],['focus','surface-navigation'],['focus','surface-topbar']];
    return [...text.map(([fg,bg])=>({fg,bg,target:4.5})),...state.map(([fg,bg])=>({fg,bg,target:3}))].map(x=>({...x,ratio:contrast(c[x.fg],c[x.bg]),pass:contrast(c[x.fg],c[x.bg])>=x.target}));
  }
  function generate(input=DEFAULT){
    const config=normalize(input),key=config.seed+config.mood;
    if(cache.has(key))return cache.get(key);
    const source=M.Hct.fromInt(M.argbFromHex(config.seed)),vivid=config.mood==='vivid';
    const hue=source.chroma<4?306:source.hue;
    const palette=(h,c)=>M.TonalPalette.fromHueAndChroma((h+360)%360,c);
    const p=palette(hue,vivid?Math.max(56,Math.min(76,source.chroma)):Math.max(32,Math.min(44,source.chroma)));
    const s=palette(hue+24,vivid?30:18),t=palette(hue+100,vivid?44:26);
    const n=palette(hue,vivid?14:8),nav=palette(hue,vivid?32:20),head=palette(hue+20,vivid?20:12);
    const feedback={success:palette(155,36),warning:palette(85,40),danger:palette(25,60),info:palette(245,36)};
    const tone=(pal,value)=>M.hexFromArgb(pal.tone(value)).toUpperCase();
    function mode(dark){
      const at=(pal,light,night)=>tone(pal,dark?night:light);
      const c={canvas:at(n,98,12),surface:at(n,100,18),raised:at(n,100,24),ink:at(n,10,95),muted:at(n,30,78),border:at(n,82,37),control:at(n,45,70),primary:at(p,38,80),'on-primary':at(p,100,18),'primary-soft':at(p,92,28),sun:at(t,92,27),'on-sun':at(t,20,90),sky:at(s,92,27),'on-sky':at(s,20,90),focus:at(p,30,88),
        'surface-navigation':at(nav,vivid?86:90,7),'on-navigation':at(nav,20,92),'navigation-muted':at(nav,30,78),'surface-topbar':at(head,vivid?94:96,10),'on-topbar':at(head,20,92),'on-topbar-muted':at(head,30,78),'topbar-control':at(head,91,20),
        'surface-group':at(n,100,18),'surface-inset':at(n,95,20),'surface-floating':at(n,100,24),'field-fill':at(n,94,22),'field-hover':at(n,92,25),'field-line':at(n,45,70),'field-line-hover':at(n,38,78),'edge-soft':at(n,85,36),
        'secondary-container':at(s,90,27),'on-secondary-container':at(s,20,90),'tertiary-container':at(t,92,27),'on-tertiary-container':at(t,20,90)};
      for(const [name,pal] of Object.entries(feedback)){c[name]=at(pal,name==='warning'?33:35,name==='warning'?82:80);c[name+'-soft']=at(pal,95,22);}
      c['on-danger']=at(feedback.danger,100,15);
      return c;
    }
    const colors={light:mode(false),dark:mode(true)};
    const result={schema:'rosemary.dynamic-colors.v1',config,source:{hue:source.hue,chroma:source.chroma,tone:source.tone,neutralFallback:source.chroma<4},themes:Object.fromEntries(Object.entries(colors).map(([mode,c])=>[mode,Object.fromEntries(roles.map(role=>[role,c[role]]))])),colors,
      palettes:Object.fromEntries([['primary',p],['secondary',s],['tertiary',t],['surface',n],['navigation',nav]].map(([name,pal])=>[name,tones.map(value=>({tone:value,hex:tone(pal,value)}))])),checks:{light:inspect(colors.light),dark:inspect(colors.dark)}};
    if([...result.checks.light,...result.checks.dark].some(x=>!x.pass))throw new Error('生成颜色未通过对比度检查。');
    if(cache.size>48)cache.delete(cache.keys().next().value);
    cache.set(key,result);return result;
  }
  function write(node,colors){for(const [role,color] of Object.entries(colors))node.style.setProperty('--'+role,color);}
  function paintLocal(root=document){
    const mode=document.documentElement.dataset.theme==='dark'?'dark':'light';
    const seeds={lilt:'#99502D',epass:'#614578',vigilo:'#24675E'};
    for(const node of root.querySelectorAll('.cs-app')){
      const name=Object.keys(seeds).find(k=>node.classList.contains('cs-theme-'+k));if(!name)continue;
      const key=seeds[name]+selected.mood+mode;
      if(node.dataset.colorRecipe===key)continue;
      write(node,generate({seed:seeds[name],mood:selected.mood}).colors[mode]);node.dataset.colorRecipe=key;
    }
  }
  function apply(mode){
    if(typeof document==='undefined')return;
    active=generate(selected||DEFAULT);
    write(document.documentElement,active.colors[mode||document.documentElement.dataset.theme||'light']);
    document.documentElement.dataset.colorMood=active.config.mood;
    paintLocal();window.RosemarySelect?.refreshAppearance?.();
    document.dispatchEvent(new CustomEvent('rosemary:colors-change'));
  }
  function choose(config,{persist=true}={}){
    const next=normalize(config);generate(next);selected=next;let saved=true;
    if(persist)try{localStorage.setItem(KEY,JSON.stringify({version:1,...next}));}catch{saved=false;}
    apply();return saved;
  }
  function reset(){selected={...DEFAULT};try{localStorage.removeItem(KEY);}catch{}apply();}
  function extract(pixels){
    if(!pixels.length)throw new Error('图片中没有可用的不透明颜色。');
    const population=M.QuantizerCelebi.quantize(pixels,64),fallback=M.argbFromHex(DEFAULT.seed);
    const values=M.Score.score(population,{desired:5,fallbackColorARGB:fallback});
    const result=values.map(value=>M.hexFromArgb(value).toUpperCase());
    result.fallbackUsed=values.length===1&&values[0]===fallback&&!population.has(fallback);
    return result;
  }
  selected={...DEFAULT};
  if(typeof localStorage!=='undefined')try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===1)selected=normalize(saved);}catch{}
  window.RosemaryColors={DEFAULT,roles,generate,inspect,contrast,luminance,extract,apply,choose,reset,paintLocal,current:()=>active||generate(selected),preference:()=>({...selected})};
})();
