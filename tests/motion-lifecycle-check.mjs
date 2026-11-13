import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
// State-machine checks without browser timing: rapid reversals, reduced motion,
// removal and completion must not leave an obsolete close callback queued.
const preference={matches:false,addEventListener(type,fn){this.changed=fn;}};
const context=vm.createContext({window:{},matchMedia:()=>preference,getComputedStyle:()=>({opacity:'.42',transform:'matrix(1, 0, 0, 1, 0, 2)',clipPath:'inset(-10px -40px 30px -40px)'}),Map,Set});
vm.runInContext(fs.readFileSync(new URL('../motion.js',import.meta.url),'utf8'),context);
const motion=context.window.RosemaryMotion;
function element(){
  const animations=[];
  return {isConnected:true,dataset:{},animations,animate(frames,options){
    const listeners={};
    const animation={frames,options,addEventListener(type,fn){listeners[type]=fn;},cancel(){listeners.cancel?.();},finish(){listeners.finish?.();}};
    animations.push(animation);return animation;
  }};
}
const popup=element();let closed=0;
motion.surface(popup);
motion.surface(popup,{open:false,onFinish:()=>closed++});
const interrupted=popup.animations.at(-1);
motion.surface(popup);
interrupted.finish();
assert.equal(closed,0,'An obsolete exit cannot hide a reopened popup');
assert.equal(popup.animations.at(-1).frames[0].opacity,'.42','A reversal starts from the visible frame');
popup.animations.at(-1).finish();
motion.surface(popup,{open:false,onFinish:()=>closed++});
preference.matches=true;preference.changed();
assert.equal(closed,1,'Enabling reduced motion completes pending exit cleanup');
const count=popup.animations.length;
motion.surface(popup,{onFinish:()=>closed++});
assert.equal(popup.animations.length,count,'Reduced motion creates no animation');
assert.equal(closed,2,'Reduced motion still applies the final state');
preference.matches=false;
motion.surface(popup,{open:false,onFinish:()=>closed++});
motion.cancelTree({contains:node=>node===popup});
popup.animations.at(-1).finish();
assert.equal(closed,2,'Unmounting cancels callbacks attached to removed content');
console.log('Motion lifecycle: interruption, reversal, completion, reduced motion and disposal passed.');

const disclosure=element();let disclosureClosed=0;
motion.surface(disclosure,{kind:'disclosure'});
assert.equal(disclosure.animations.at(-1).frames[0].transform,'none','A disclosure has a fixed origin rather than floating translation');
assert.ok(disclosure.animations.at(-1).frames[0].clipPath.includes('100%'),'Opening progressively reveals the panel from its edge');
motion.surface(disclosure,{kind:'disclosure',open:false,onFinish:()=>disclosureClosed++});
const oldDisclosureExit=disclosure.animations.at(-1);
motion.surface(disclosure,{kind:'disclosure'});
assert.equal(disclosure.animations.at(-1).frames[0].clipPath,'inset(-10px -40px 30px -40px)','An interrupted shutter resumes at its visible clip');
oldDisclosureExit.finish();assert.equal(disclosureClosed,0,'An old shutter close cannot hide reopened options');
motion.cancelTree({contains:node=>node===disclosure});
console.log('Disclosure lifecycle: anchored reveal, continuous reversal and obsolete-close cancellation passed.');

// A pressed tab has a transformed visual rect; the persistent marker uses layout metrics.
const markerValues={};
const marker={dataset:{},style:{setProperty:(key,value)=>markerValues[key]=value},setAttribute(){},getBoundingClientRect(){return {};},remove(){}};
const list={classList:{add(){}},dataset:{},clientWidth:200,clientLeft:0,clientTop:0,scrollLeft:0,scrollTop:0,prepend(){},addEventListener(){},getBoundingClientRect(){return {left:0,top:0};}};
const attributes=new Map([['aria-selected','true']]);
const tab={dataset:{tabKey:'one'},disabled:false,offsetParent:list,offsetLeft:4,offsetTop:4,offsetWidth:44,offsetHeight:44,getAttribute:key=>attributes.get(key),setAttribute:(key,value)=>attributes.set(key,value),getBoundingClientRect(){return {left:5,top:5,width:42,height:42};}};
list.querySelectorAll=()=>[tab];
context.document={createElement:()=>marker,getElementById:()=>null};
context.AbortController=AbortController;context.requestAnimationFrame=()=>1;context.cancelAnimationFrame=()=>{};
context.window.addEventListener=()=>{};
const disposeTabs=motion.bindTabs(list,{initialKey:'one'});
assert.equal(markerValues['--tab-x'],'4px');assert.equal(markerValues['--tab-width'],'44px');assert.equal(markerValues['--tab-height'],'44px');
disposeTabs();
console.log('Pressed-tab geometry: persistent selection uses the unscaled layout frame.');
