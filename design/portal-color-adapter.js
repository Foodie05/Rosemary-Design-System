/* Browser adapter; generated engine embeds the canonical pure recipe. */
(() => {
  const engine=createColorRecipe(window.RosemaryMaterial);
  const {DEFAULT,generate,normalize}=engine;
  const KEY='rosemary-color-preferences-v1';let selected,active;
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
  selected={...DEFAULT};
  if(typeof localStorage!=='undefined')try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved?.version===1)selected=normalize(saved);}catch{}
  window.RosemaryColors={...engine,apply,choose,reset,paintLocal,current:()=>active||generate(selected),preference:()=>({...selected})};
})();
