import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context=vm.createContext({window:{}});
const scripts=['assets-data.js','icon-library.js','component-catalog.js','ui.js','pages.js','asset-pages.js','component-pages.js','loading-motion-pages.js','reference-pages.js'];
for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const w=context.window;
assert.equal(w.RosemaryPages.pages.length,15);
assert.equal(Object.keys(w.RosemaryIconLibrary.icons).length,71);
assert.equal(Object.keys(w.RosemaryComponentCatalog).length,33);
for(const page of w.RosemaryPages.pages){
  const html=w.RosemaryPages.renderers[page.id]();
  assert.equal(typeof html,'string',page.id);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,page.id+' has one main heading');
  for(const section of w.RosemaryPages.sections[page.id]||[])assert.ok(html.includes(`id="${section.id}"`),page.id+' section '+section.id);
  assert.ok(!html.includes('src="undefined"'),page.id+' logo source exists');
}
const required=['title','use','anatomy','variants','dimensions','states','behavior','keyboard','semantics','motion','good','bad','responsive','maturity','validation','implementation'];
for(const [id,spec] of Object.entries(w.RosemaryComponentCatalog))for(const key of required)assert.ok(typeof spec[key]==='string'&&spec[key].length>0,id+'.'+key);
const iconPaths=Object.values(w.RosemaryIconLibrary.icons).map(i=>i.paths);
assert.equal(new Set(iconPaths).size,71,'Every icon has distinct markup');
const logo=Buffer.from(w.ROSEMARY_LOGO_DATA.split(',')[1],'base64');
const metadata=JSON.parse(fs.readFileSync(path.join(root,'assets/logo-source.json'),'utf8'));
assert.equal(crypto.createHash('sha256').update(logo).digest('hex'),metadata.sha256);
assert.equal(Buffer.compare(logo,fs.readFileSync(path.join(root,'assets/rosemary-logo.png'))),0);
assert.ok(w.ROSEMARY_ICON_ARCHIVE_DATA.startsWith('data:application/zip;base64,'));
assert.ok(w.ROSEMARY_REFERENCE_REVIEW.includes('carbondesignsystem.com'));
const html=fs.readFileSync(path.join(root,'rosemary-design-portal.html'),'utf8');
assert.ok(!/<script[^>]+src=/.test(html),'No external script dependency');
assert.ok(!/<link[^>]+rel="stylesheet"/.test(html),'No external stylesheet dependency');
assert.ok(!/src=["']https?:\/\//.test(html),'No remote image dependency');
function lum(hex){const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
const pairs=[['ink','canvas'],['muted','canvas'],['ink','surface'],['muted','surface'],['on-primary','primary'],['primary','primary-soft'],['on-sun','sun'],['on-sky','sky'],['success','success-soft'],['warning','warning-soft'],['danger','danger-soft'],['info','info-soft'],['on-danger','danger']];
for(const [theme,tokens] of Object.entries(w.ROSEMARY_TOKENS.themes))for(const [fg,bg] of pairs){const a=lum(tokens[fg]),b=lum(tokens[bg]);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${theme} ${fg}/${bg}`);}
console.log(JSON.stringify({pages:15,icons:71,componentSpecifications:33,completeFields:required.length,contrastPairs:26,officialLogo:'unchanged',offlineResources:true},null,2));
