import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
// State-machine checks without browser timing: rapid reversals, reduced motion,
// removal and completion must not leave an obsolete close callback queued.
const preference={matches:false,addEventListener(type,fn){this.changed=fn;}};
const context=vm.createContext({window:{},matchMedia:()=>preference,getComputedStyle:()=>({opacity:'.42',transform:'matrix(1, 0, 0, 1, 0, 2)'}),Map,Set});
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
