import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
let resizeCallback,mutationCallback;
const media=new EventTarget();media.matches=false;
const animations=[];
const node={nodeType:1,isConnected:true,natural:100,dataset:{},active:null,offsetWidth:100,closest(){return this;},getClientRects(){return [{}];},removeAttribute(name){if(name==='data-motion-width')delete this.dataset.motionWidth;},animate(frames,options){
  const a=new EventTarget();a.frames=frames;a.options=options;a.cancel=()=>{if(this.active===a)this.active=null;};this.active=a;this.visual=parseFloat(frames[0].width);animations.push(a);return a;
}};
const document={documentElement:{},addEventListener(){},dispatchEvent(){},querySelectorAll(selector){return selector==='input[type=range]'?[]:node.isConnected?[node]:[];}};
const context=vm.createContext({window:{addEventListener(){}},document,matchMedia:()=>media,Event,queueMicrotask:fn=>fn(),getComputedStyle:n=>({width:`${n.active?n.visual:n.natural}px`}),ResizeObserver:class{constructor(callback){resizeCallback=callback;}observe(){}unobserve(){}},MutationObserver:class{constructor(callback){mutationCallback=callback;}observe(){}}});
vm.runInContext(readFileSync(new URL('../layout-motion.js',import.meta.url),'utf8'),context);
node.natural=180;resizeCallback([{target:node,borderBoxSize:[{inlineSize:180}]}]);
assert.equal(animations[0].frames[0].width,'100px');assert.equal(animations[0].frames[1].width,'180px');
assert.equal(animations[0].options.duration,180);assert.notEqual(animations[0].options.easing,'linear');
// A second label arrives midway: continue from the visible width, not the stale
// start width; the first completion must not remove the replacement animation.
node.visual=130;node.natural=260;mutationCallback([{target:node}]);
assert.equal(animations[1].frames[0].width,'130px');assert.equal(animations[1].frames[1].width,'260px');
animations[0].dispatchEvent(new Event('finish'));assert.equal(node.dataset.motionWidth,'running');
animations[1].dispatchEvent(new Event('finish'));assert.equal(node.dataset.motionWidth,undefined);assert.equal(node.active,null);
// Observer frames produced by our own width animation do not restart it.
node.natural=150;resizeCallback([{target:node,borderBoxSize:[{inlineSize:150}]}]);
const count=animations.length;resizeCallback([{target:node,borderBoxSize:[{inlineSize:220}]}]);assert.equal(animations.length,count);
media.matches=true;media.dispatchEvent(new Event('change'));assert.equal(node.active,null);
node.natural=300;resizeCallback([{target:node,borderBoxSize:[{inlineSize:300}]}]);assert.equal(animations.length,count);
node.isConnected=false;mutationCallback([]);assert.equal(node.active,null);
console.log('Layout motion: interrupted width changes, stale completion, observer feedback and reduced motion passed.');
