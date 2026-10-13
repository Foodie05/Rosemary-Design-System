import {spawn} from 'node:child_process';
import {mkdtemp, readFile, writeFile, mkdir, rm, readdir} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {runLabChecks} from './lab-checks.mjs';
import {runComponentChecks} from './component-browser-checks.mjs';
import {runNavigationChecks} from './navigation-browser-checks.mjs';
import {runDatePickerChecks} from './date-picker-browser-checks.mjs';
import assert from 'node:assert/strict';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseURL = process.argv[2] || 'http://127.0.0.1:5181/';
const chromePath = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const profile = await mkdtemp(path.join(tmpdir(), 'rosemary-browser-check-'));
const shots = path.join(root, 'screenshots');
const downloads = path.join(profile, 'downloads');
await mkdir(shots, {recursive:true});
await mkdir(downloads, {recursive:true});
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-extensions', '--disable-component-update',
  '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1',
  `--user-data-dir=${profile}`, 'about:blank'
], {stdio:['ignore','ignore','pipe']});
let stderr = '';
chrome.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-12000); });
const delay = ms => new Promise(resolve=>setTimeout(resolve,ms));
let socket;
let nextID=0;
const pending=new Map();
const exceptions=[];
const checks=[];
const routes=['overview','philosophy','identity','subbrand','colors','typography','layout','icons','components','cases','loading','motion','patterns','content','accessibility','platforms','sdk','governance'];
function check(name, value) { assert.ok(value,name);checks.push(name); }
function send(method,params={}) {
  return new Promise((resolve,reject)=> {
    const id=++nextID;
    const timeout=setTimeout(()=>{pending.delete(id);reject(new Error(`CDP timeout: ${method}`));},15000);
    pending.set(id,{resolve:value=>{clearTimeout(timeout);resolve(value);},reject:error=>{clearTimeout(timeout);reject(error);}});
    socket.send(JSON.stringify({id,method,params}));
  });
}
async function evaluate(expression) {
  const result=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true,userGesture:true});
  if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result.value;
}
async function until(expression, timeout=6000) {
  const start=Date.now();
  while(Date.now()-start < timeout) {if(await evaluate(expression))return;await delay(40);}
  throw new Error('Condition did not become true: '+expression);
}
async function viewport(width,height,theme='light') {
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<768});
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:theme},{name:'prefers-reduced-motion',value:'no-preference'}]});
  await evaluate(`document.getElementById('theme-select').value='${theme}';document.getElementById('theme-select').dispatchEvent(new Event('change',{bubbles:true}));`);
}
async function route(name) {
  await evaluate(`location.hash=${JSON.stringify('/'+name)}`);
  await until(`document.title.startsWith(RosemaryPages.pages.find(p=>p.id===${JSON.stringify(name.split('?')[0])}).title)`);
  await delay(70);
}
async function click(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
  await delay(40);
}
async function key(key,code,modifiers=0) {
  const codes={Escape:27,Enter:13,ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40,Home:36,End:35,Tab:9};
  const windowsVirtualKeyCode=codes[key] || key.toUpperCase().charCodeAt(0);
  // Enter's default button activation needs the corresponding character event;
  // CDP keyDown without text only exercises keydown listeners on macOS Chrome.
  await send('Input.dispatchKeyEvent',{type:'keyDown',key,code,modifiers,windowsVirtualKeyCode,...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key,code,modifiers,windowsVirtualKeyCode});
  await delay(50);
}
async function screenshot(name, full=true) {
  await until('!document.getElementById("toast-region") || document.getElementById("toast-region").children.length===0',8000);
  await evaluate('window.scrollTo({top:0,behavior:"instant"})');
  await delay(340);
  const metrics=await send('Page.getLayoutMetrics');
  const params={format:'png',captureBeyondViewport:full,fromSurface:true};
  if(full)params.clip={x:0,y:0,width:metrics.cssContentSize.width,height:metrics.cssContentSize.height,scale:1};
  const image=await send('Page.captureScreenshot',params);
  await writeFile(path.join(shots,name),Buffer.from(image.data,'base64'));
}

try {
  let port;
  for(let i=0;i<100;i++) {
    try {port=Number((await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]);break;}catch{}
    if(chrome.exitCode!==null)throw new Error('Chrome exited: '+stderr);
    await delay(100);
  }
  assert.ok(port,'Chrome debugging endpoint');
  const target=await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(baseURL)}`,{method:'PUT'})).json();
  socket=new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  socket.addEventListener('message',event=>{
    const data=JSON.parse(event.data);
    if(data.id){const p=pending.get(data.id);if(!p)return;pending.delete(data.id);data.error?p.reject(new Error(data.error.message)):p.resolve(data.result);}
    if(data.method==='Runtime.exceptionThrown')exceptions.push(data.params.exceptionDetails.exception?.description || data.params.exceptionDetails.text);
  });
  await send('Runtime.enable');await send('Page.enable');
  await send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
  await until('Boolean(window.RosemaryPages && document.querySelector("main h1"))');
  check('Portal exposes 18 complete pages',await evaluate('RosemaryPages.pages.length===18'));
  await runDatePickerChecks({route,click,key,evaluate,delay,check,send,screenshot,viewport});
  for(const width of [1440,375]) {
    for(const theme of ['light','dark']) {
      await viewport(width,width===375?812:1000,theme);
      for(const name of routes) {
        await route(name);
        const result=await evaluate(`(() => {
          const ids=[...document.querySelectorAll('[id]')].map(n=>n.id);
          const visibleButtons=[...document.querySelectorAll('button')].filter(n=>n.checkVisibility({checkOpacity:true,checkVisibilityCSS:true}) && !n.closest('details:not([open])'));
          const unnamed=visibleButtons.filter(n=>!(n.getAttribute('aria-label')||n.getAttribute('aria-labelledby')||n.innerText.trim()||n.title));
          return {overflow:document.documentElement.scrollWidth>innerWidth+1,h1:document.querySelectorAll('main h1').length,duplicates:ids.filter((x,i)=>ids.indexOf(x)!==i),unnamed:unnamed.length,unnamedElements:unnamed.map(n=>n.outerHTML),theme:document.documentElement.dataset.theme,content:document.querySelector('main').innerText.length};
        })()`);
        check(`${name} ${width}px ${theme}: no page overflow`,!result.overflow);
        if (result.h1!==1 || result.duplicates.length || result.unnamed || result.content<=150) console.log('Structure diagnostics:',JSON.stringify(result));
        check(`${name} ${width}px ${theme}: structure and accessible button names`,result.h1===1 && !result.duplicates.length && result.unnamed===0 && result.content>150);
        check(`${name} ${width}px ${theme}: correct theme`,result.theme===theme);
      }
    }
  }
  await viewport(1440,1000,'light');
  await route('overview');await screenshot('home-desktop.png');
  await route('colors');await screenshot('colors-desktop.png');
  const sampledStyles=await evaluate(`({body:getComputedStyle(document.body).backgroundColor,primary:getComputedStyle(document.querySelector('.button')).backgroundColor,foreground:getComputedStyle(document.body).color})`);
  check('Computed light canvas matches the semantic token',sampledStyles.body==='rgb(248, 247, 251)');
  await evaluate(`document.getElementById('contrast-fg').value='on-primary';document.getElementById('contrast-bg').value='primary';document.getElementById('contrast-bg').dispatchEvent(new Event('change',{bubbles:true}))`);
  check('Contrast checker evaluates a passing color pair',await evaluate(`document.getElementById('contrast-result').textContent.includes('达到普通')&&!document.getElementById('contrast-result').textContent.includes('未达到')`));
  await evaluate(`document.getElementById('contrast-fg').value='on-primary';document.getElementById('contrast-bg').value='surface';document.getElementById('contrast-bg').dispatchEvent(new Event('change',{bubbles:true}))`);
  check('Contrast checker identifies a failing color pair',await evaluate(`document.getElementById('contrast-result').textContent.includes('未达到')`));
  await key('k','KeyK',2);
  check('Keyboard shortcut opens local search',await evaluate(`document.getElementById('search-dialog').open&&document.activeElement.id==='site-search'`));
  await send('Input.insertText',{text:'撤销'});await delay(50);
  check('Search finds relevant content',await evaluate(`document.querySelector('.search-result').textContent.includes('交互')||document.querySelector('.search-result').textContent.includes('恢复')`));
  await key('Enter','Enter');await delay(100);
  check('Search result navigates and closes dialog',await evaluate(`location.hash.includes('patterns')&&!document.getElementById('search-dialog').open`));
  const {resizeMeasurements}=await runNavigationChecks({route,click,key,evaluate,until,delay,check,send,screenshot,viewport});
  await runComponentChecks({route,click,key,evaluate,until,delay,check,send,screenshot});
  await route('patterns?section=undo');await click('[data-action="remove-item"]');
  check('Removal exposes a persistent undo action',await evaluate(`document.getElementById('undo-item').hidden&&!document.getElementById('undo-banner').hidden&&document.activeElement.dataset.action==='undo-remove'`));
  await click('[data-action="undo-remove"]');check('Undo restores content and focus',await evaluate(`!document.getElementById('undo-item').hidden&&document.activeElement.dataset.action==='remove-item'`));
  await click('[data-action="sync-failure"]');await delay(850);
  check('Failure state preserves the local-save distinction',await evaluate(`document.getElementById('sync-status').textContent.includes('本地内容仍在')`));
  await click('[data-action="sync-success"]');
  await evaluate(`location.hash='/patterns?section=save'`);await delay(850);
  check('Same-page navigation does not interrupt pending demo feedback',await evaluate(`document.getElementById('sync-status').textContent.includes('已同步')&&document.querySelector('[data-action="sync-success"]').getAttribute('aria-disabled')!=='true'`));
  await route('accessibility');
  await evaluate(`document.getElementById('text-size').value='32';document.getElementById('text-size').dispatchEvent(new Event('input',{bubbles:true}))`);
  check('Text size demo reflows at 200%',await evaluate(`getComputedStyle(document.getElementById('access-content')).fontSize==='32px'&&document.documentElement.scrollWidth<=innerWidth`));
  await click('[data-action="open-example"]');
  check('Dialog initially focuses the input',await evaluate(`document.activeElement.id==='example-text'&&document.getElementById('example-dialog').open`));
  await send('Input.insertText',{text:'这是浏览器验证中的一段临时记录。'});
  await key('Escape','Escape');
  check('Escape preserves the draft and returns focus',await evaluate(`!document.getElementById('example-dialog').open&&document.getElementById('example-text').value.includes('临时记录')&&document.activeElement.dataset.action==='open-example'`));
  await click('[data-action="open-example"]');await click('#example-submit');
  check('Submitted demo entry is visible and treated as text',await evaluate(`document.querySelector('.demo-entry').textContent.includes('临时记录')&&!document.getElementById('example-dialog').open`));
  await click('[data-action="clear-entries"]');

  await runLabChecks({route,click,key,evaluate,until,delay,check,send,screenshot});
  await route('governance');await click('[data-release-check="0"]');
  check('Checklist stores only the local boolean selection',await evaluate(`JSON.parse(localStorage.getItem('rosemary-design-checks-v1'))[0]===true`));
  await click('[data-action="reset-checklist"]');
  for(const action of ['download-tokens','download-guide','download-logo','download-icons','download-sprite','download-references']){await click(`[data-action="${action}"]`);await delay(180);}
  const downloaded=await readdir(downloads);
  check('All six resource types are generated', ['rosemary-forma-tokens-v1.2.0.json','rosemary-forma-guide-v1.2.0.md','rosemary-logo.png','rosemary-icons-71.zip','rosemary-icons-sprite.svg','rosemary-reference-review.md'].every(n=>downloaded.includes(n)));
  const sourceLogo=await readFile(path.join(root,'assets/rosemary-logo.png'));
  const downloadedLogo=await readFile(path.join(downloads,'rosemary-logo.png'));
  check('Downloaded official logo is byte-for-byte identical',createHash('sha256').update(sourceLogo).digest('hex')===createHash('sha256').update(downloadedLogo).digest('hex'));
  const downloadedTokens=JSON.parse(await readFile(path.join(downloads,'rosemary-forma-tokens-v1.2.0.json'),'utf8'));
  check('Downloaded tokens preserve both themes',downloadedTokens.themes.light.primary==='#614578'&&downloadedTokens.themes.dark.primary==='#CDB5EA');
  await viewport(1440,1000,'dark');await route('overview');await screenshot('home-dark.png');
  await viewport(375,812,'light');await route('overview');await screenshot('home-mobile.png');
  await click('[data-action="open-nav"]');
  check('Mobile navigation opens with active chapter focus',await evaluate(`document.getElementById('nav-dialog').open&&document.activeElement.getAttribute('aria-current')==='page'`));
  await click('#mobile-nav [data-page-link="components"]');
  await until('!document.getElementById("nav-dialog").open');
  check('Mobile chapter choice navigates, closes drawer and focuses the new heading',await evaluate(`!document.getElementById('nav-dialog').open&&location.hash.includes('components')&&document.activeElement===document.querySelector('main h1')`));
  await screenshot('components-mobile.png');
  const offline=path.join(profile,'portal-offline.html');await writeFile(offline,await readFile(path.join(root,'rosemary-design-portal.html')));
  await send('Page.navigate',{url:pathToFileURL(offline).href});
  await until(`Boolean(window.RosemaryPages&&document.querySelector('main h1'))`);
  check('Self-contained HTML also opens from a local file URL',await evaluate(`location.protocol==='file:'&&RosemaryPages.pages.length===18`));
  await route('icons');
  check('Offline icon and embedded-logo resources work without a server',await evaluate(`document.querySelectorAll('[data-icon-id]').length===71&&document.querySelector('.official-logo').src.startsWith('data:image/png')`));
  check('No uncaught browser runtime exceptions',exceptions.length===0);
  const report={passed:checks.length,layoutCombinations:routes.length*4,componentPreviewCombinations:33*4,resizeMeasurements,checks,sampledStyles,runtimeExceptions:exceptions,screenshots:(await readdir(shots)).filter(name=>name!=='failure.png')};
  await writeFile(path.join(root,'browser-test-report.json'),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify({passed:checks.length,layoutCombinations:routes.length*4,componentPreviewCombinations:33*4,screenshots:report.screenshots,runtimeExceptions:exceptions},null,2));
} catch(error) {
  console.error(error.stack || error);
  console.error('Chrome log excerpt:',stderr.slice(-2500));
  if(socket?.readyState===WebSocket.OPEN) {
    try {await screenshot('failure.png',false);}catch{}
  }
  process.exitCode=1;
} finally {
  if(socket?.readyState===WebSocket.OPEN)socket.close();
  chrome.kill('SIGTERM');
  await Promise.race([new Promise(resolve=>chrome.once('exit',resolve)),delay(2500)]);
  await rm(profile,{recursive:true,force:true});
}
