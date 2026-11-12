import fs from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const css=fs.readFileSync(new URL('surfaces.css',root),'utf8');
const declarations=body=>Object.fromEntries([...body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)].map(x=>[x[1],x[2].trim()]));
const blocks=[...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
const defaults=declarations(blocks.find(x=>x[1].trim().endsWith(':root'))[2]);
const dark=declarations(blocks.find(x=>x[1].trim()==='[data-theme=dark]')[2]);
const local=declarations(blocks.find(x=>x[1].trim()==='.cs-app')[2]);
const themes=JSON.parse(fs.readFileSync(new URL('tokens.json',root),'utf8')).themes;
const palettes=Object.entries(themes).map(([mode,colors])=>({name:'forma-'+mode,mode,colors,local:false}));
for(const block of fs.readFileSync(new URL('case-studies-page.css',root),'utf8').matchAll(/([^{}]+)\{([^{}]*)\}/g)){
  const brand=block[1].match(/\.cs-theme-([\w-]+)/)?.[1];
  if(!brand||!block[2].includes('--ink:'))continue;
  const mode=block[1].includes('data-theme="dark"')?'dark':'light';
  palettes.push({name:brand+'-'+mode,mode,colors:{...themes[mode],...declarations(block[2])},local:true});
}
function value(expression,vars){
  const variable=expression.match(/^var\(--([\w-]+)\)$/);
  if(variable){assert.ok(vars[variable[1]],'Unknown alias '+variable[1]);return value(vars[variable[1]],vars);}
  if(/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(expression)){
    const hex=expression.slice(1);return (hex.length===3?[...hex].map(x=>x+x):hex.match(/../g)).map(x=>parseInt(x,16)/255);
  }
  if(/^\d+(?:\.\d+)?%$/.test(expression))return parseFloat(expression)/100;
  const mix=expression.match(/^color-mix\(in srgb,\s*(var\(--[\w-]+\)|#[\da-f]+)\s+(var\(--[\w-]+\)|[\d.]+%),\s*(var\(--[\w-]+\)|#[\da-f]+)\)$/i);
  assert.ok(mix,'Unsupported surface expression: '+expression);
  const a=value(mix[1],vars),ratio=value(mix[2],vars),b=value(mix[3],vars);
  return a.map((x,i)=>x*ratio+b[i]*(1-ratio));
}
const luminance=rgb=>rgb.map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
let checks=0,min=Infinity;
for(const p of palettes){
  const vars={...defaults,...(p.mode==='dark'?dark:{}),...(p.local?local:{}),...p.colors};
  const resolve=key=>value('var(--'+key+')',vars);
  assert.ok(luminance(resolve('surface-navigation'))<luminance(resolve('canvas')),p.name+': navigation must be darker than content');checks++;
  for(const text of ['ink','navigation-muted']){
    const ratio=contrast(resolve(text),resolve('surface-navigation'));
    assert.ok(ratio>=4.5,p.name+': navigation text '+text+' = '+ratio);checks++;
  }
  for(const [line,fill] of [['field-line','field-fill'],['field-line-hover','field-hover']]){
    for(const background of [fill,'canvas','surface','surface-inset']){
      const ratio=contrast(resolve(line),resolve(background));min=Math.min(min,ratio);
      assert.ok(ratio>=3,p.name+': '+line+' / '+background+' = '+ratio);checks++;
    }
    for(const text of ['ink','muted']){
      const ratio=contrast(resolve(text),resolve(fill));
      assert.ok(ratio>=4.5,p.name+': '+text+' / '+fill+' = '+ratio);checks++;
    }
  }
}
assert.equal(palettes.length,8,'Forma plus three product palettes in both themes');
console.log(`Control surfaces: ${checks} contrast/navigation checks across ${palettes.length} palettes; minimum baseline contrast ${min.toFixed(3)}:1.`);
