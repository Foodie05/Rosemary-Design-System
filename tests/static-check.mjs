import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const context=vm.createContext({window:{}});
const scripts=['assets-data.js','icon-library.js','component-catalog.js','ui.js','component-demos.js','component-viewer.js','pages.js','overview-page.js','asset-pages.js','component-pages.js','loading-motion-pages.js','reference-pages.js','subbrand-page.js','case-studies-page.js','sdk-page.js'];
for(const file of scripts)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),context,{filename:file});
const w=context.window;
assert.equal(w.ROSEMARY_TOKENS.version,'1.2.0');
assert.equal(w.RosemaryPages.pages.length,18);
assert.equal(Object.keys(w.RosemaryIconLibrary.icons).length,71);
assert.equal(Object.keys(w.RosemaryComponentCatalog).length,33);
assert.deepEqual([...w.RosemaryComponentDemos.ids].sort(),Object.keys(w.RosemaryComponentCatalog).sort());
for(const id of w.RosemaryComponentDemos.ids){
  const preview=w.RosemaryComponentDemos.render(id);
  assert.equal((preview.match(/data-component-demo=/g)||[]).length,1,id+' has exactly one isolated preview');
  assert.ok(preview.includes('data-component-demo="'+id+'"'),id+' owns its preview');
  assert.ok(preview.length>250,id+' has a meaningful visual example');
}
const home=w.RosemaryPages.renderers.overview();
assert.ok(!home.includes('hero-art')&&!home.includes('一页日常'),'No irrelevant hero illustration');
assert.ok(home.includes('#/components')&&home.includes('#/cases'),'Forma overview links to components and typical cases');
const sdkPage=w.RosemaryPages.renderers.sdk();
assert.ok(sdkPage.includes('Forma 1.2.0')&&sdkPage.includes('SDK 0.4.0'),'SDK and specification versions stay distinct');
assert.ok(sdkPage.includes('/releases/tag/v0.4.0')&&sdkPage.includes('SHA256'),'SDK installation links to a fixed Release and checksums');
for(const name of ['rosemary-ui-react-0.4.0.tgz','rosemary-compose-0.4.0-maven.zip','rosemary-compose-0.4.0-sources.jar','RosemaryUI-0.4.0-source.tar.gz','RosemarySample-0.4.0-simulator.zip','rosemary-ui-0.4.0-source.tar.gz','rosemary-flutter-0.4.0-windows.zip'])assert.ok(sdkPage.includes('/releases/download/v0.4.0/'+name),'SDK asset link is version-fixed '+name);
for(const target of ['packages/react/README.md','platforms/android/API.md','platforms/swiftui/README.md','platforms/flutter/API.md'])assert.ok(sdkPage.includes(target),'SDK page exposes actual platform API entry '+target);
assert.ok(sdkPage.includes('onDiagnostics')&&sdkPage.includes('onContrastDiagnostics'),'Theme examples expose contrast diagnostics');
const componentPage=w.RosemaryPages.renderers.components();
assert.equal((componentPage.match(/data-component-demo=/g)||[]).length,1,'Component page renders only the selected preview');
assert.ok(!componentPage.includes('collection-form')&&!componentPage.includes('sample-table-body'),'Legacy mixed gallery is removed');
const datePreview=w.RosemaryComponentDemos.render('date');
assert.ok(!/type=["'](?:date|time|datetime-local)["']/.test(datePreview),'Date/time preview uses no native picker inputs');
assert.equal((datePreview.match(/data-cd-picker-popup=/g)||[]).length,3,'Start, end and time have custom picker surfaces');
assert.ok(datePreview.includes('YYYY-MM-DD')&&datePreview.includes('HH:mm'),'Direct entry formats are explicit');
assert.ok(w.RosemaryComponentCatalog.date.variants.includes('定制选择器'),'Date specification matches the custom implementation');

for(const page of w.RosemaryPages.pages){
  assert.ok(w.RosemaryIconLibrary.icons[page.icon],page.id+' navigation icon exists');
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
assert.ok(html.includes('sections.sdk')&&html.includes('/releases/download/v0.4.0/')&&html.includes('RosemaryUI-0.4.0-source.tar.gz'),'Generated offline HTML contains the SDK route and fixed installation assets');
assert.ok(html.includes('高对比')&&html.includes('onContrastDiagnostics'),'Generated SDK guide retains theme and diagnostic content');
const notFound=fs.readFileSync(path.join(root,'404.html'),'utf8');
assert.ok(notFound.includes('<title>页面未找到 · Rosemary Forma</title>'));
assert.ok(notFound.includes('href="/#/overview"'),'404 page returns to the canonical overview route');
assert.ok(!/(?:src|href)=["']https?:\/\//.test(notFound),'404 page has no remote dependency');
assert.ok(notFound.includes('M15 16h15v15H15V16'),'404 page reuses the Forma product-mark geometry');
function lum(hex){const c=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
const pairs=[['ink','canvas'],['muted','canvas'],['ink','surface'],['muted','surface'],['on-primary','primary'],['primary','primary-soft'],['on-sun','sun'],['on-sky','sky'],['success','success-soft'],['warning','warning-soft'],['danger','danger-soft'],['info','info-soft'],['on-danger','danger']];
for(const [theme,tokens] of Object.entries(w.ROSEMARY_TOKENS.themes))for(const [fg,bg] of pairs){const a=lum(tokens[fg]),b=lum(tokens[bg]);assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05)>=4.5,`${theme} ${fg}/${bg}`);}
console.log(JSON.stringify({pages:18,icons:71,componentSpecifications:33,isolatedVisualPreviews:33,completeFields:required.length,contrastPairs:26,officialLogo:'unchanged',offlineResources:true},null,2));
