import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
execFileSync(process.execPath,[new URL('scripts/generate-portal-colors.mjs',root).pathname,'--check'],{stdio:'pipe'});
const context=vm.createContext({window:{}});
for(const file of ['vendor/material-color-utilities.js','color-engine.js'])vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),context,{filename:file});
const E=context.window.RosemaryColors;
const required=Object.keys(JSON.parse(fs.readFileSync(new URL('tokens.json',root),'utf8')).themes.light).sort();
const seeds=['#614578','#24675E','#99502D','#167F9A','#F3CD6B','#365CB0','#AD3B72','#000000','#FFFFFF','#808080','#FF0000','#00FF00','#0000FF','#FFFF00','#00FFFF','#FF00FF'];
let random=471;
for(let i=0;i<32;i++){random=(Math.imul(random,1664525)+1013904223)>>>0;seeds.push('#'+(random&0xffffff).toString(16).padStart(6,'0'));}
let checks=0,minText=Infinity,minState=Infinity;
const backgroundBudgets={canvas:8,surface:8,raised:8,'surface-navigation':12,'surface-topbar':10,'topbar-control':10,'surface-inset':8,'field-fill':8,'field-hover':8,'primary-soft':16,sun:18,sky:18,'secondary-container':18,'tertiary-container':18,'success-soft':14,'warning-soft':14,'danger-soft':14,'info-soft':14};
function checkBudgets(generated){for(const c of Object.values(generated.colors))for(const [role,limit] of Object.entries(backgroundBudgets)){
  const actual=context.window.RosemaryMaterial.Hct.fromInt(context.window.RosemaryMaterial.argbFromHex(c[role])).chroma;
  assert.ok(actual<=limit,`${generated.config.seed} ${generated.config.mood} ${role} chroma ${actual} exceeds ${limit}`);
}}
for(let hue=0;hue<360;hue+=5)for(const tone of [20,50,80])for(const mood of ['calm','vivid']){
  const M=context.window.RosemaryMaterial;
  checkBudgets(E.generate({seed:M.hexFromArgb(M.Hct.from(hue,120,tone).toInt()),mood}));
}
for(const seed of seeds)for(const mood of ['calm','vivid']){
  const generated=E.generate({seed,mood});checkBudgets(generated);
  for(const mode of ['light','dark']){
    assert.deepEqual(Object.keys(generated.themes[mode]).sort(),required,'The SDK adapter retains all 24 roles');
    const c=generated.colors[mode];
    for(const color of Object.values(c))assert.match(color,/^#[\dA-F]{6}$/);
    assert.ok(E.luminance(c['surface-navigation'])<E.luminance(c['surface-topbar']),seed+' '+mode+' separates navigation and header');
    assert.ok(E.luminance(c['surface-topbar'])<E.luminance(c.canvas),seed+' '+mode+' keeps navigation below content');
    for(const pair of generated.checks[mode]){
      assert.ok(pair.pass,seed+' '+mood+' '+mode+' '+pair.fg+'/'+pair.bg+' '+pair.ratio);
      if(pair.target===4.5)minText=Math.min(minText,pair.ratio);else minState=Math.min(minState,pair.ratio);
      checks++;
    }
  }
  for(const palette of Object.values(generated.palettes))for(let i=1;i<palette.length;i++)assert.ok(E.luminance(palette[i].hex)>E.luminance(palette[i-1].hex),'Tone luminance rises monotonically');
}
assert.notEqual(E.generate({seed:'#614578',mood:'calm'}).colors.light.primary,E.generate({seed:'#614578',mood:'vivid'}).colors.light.primary,'The two moods generate distinct action colors');
assert.equal(E.generate({seed:'#808080',mood:'calm'}).source.neutralFallback,true);
for(const seed of ['red','#fff','#GG0000','</style>',null])assert.throws(()=>E.generate({seed,mood:'calm'}));
assert.throws(()=>E.generate({seed:'#614578',mood:'unknown'}));
assert.throws(()=>E.extract([]));
assert.equal(E.extract([0xffffffff,0xff888888]).fallbackUsed,true,'A neutral image fallback is disclosed');
const extracted=E.extract([0xffff0000,0xffff0000,0xff00ff00,0xff0000ff]);
assert.ok(extracted.length>0&&extracted.every(x=>/^#[\dA-F]{6}$/.test(x)),'Image quantization returns usable seed candidates');
console.log(`Dynamic colors: ${checks} real contrast checks over ${seeds.length} seeds × two moods × two themes; minima ${minText.toFixed(2)}:1 text / ${minState.toFixed(2)}:1 state. Tone, navigation order, extraction and 24-role adapter checks passed.`);
