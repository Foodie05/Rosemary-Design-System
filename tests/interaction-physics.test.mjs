import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';
const context=vm.createContext({window:{}});
vm.runInContext(readFileSync(new URL('../motion-physics.js',import.meta.url),'utf8'),context);
const P=context.window.RosemaryPhysics,C=JSON.parse(readFileSync(new URL('../design/interaction-motion.json',import.meta.url),'utf8'));
test('release has a bounded overshoot, a smaller opposite swing, and settles',()=>{
  const s=P.state(C.release,C.press.scale,0,1),samples=Array.from({length:421},(_,i)=>P.sample(s,i/1000));
  assert.ok(Math.max(...samples.map(v=>v.position))>1.002);
  assert.ok(Math.max(...samples.map(v=>v.position))<1.01);
  assert.ok(samples.slice(180,300).some(v=>v.position<1));
  assert.ok(Math.abs(samples.at(-1).position-1)<.0005);
  assert.ok(Math.abs(samples.at(-1).velocity)<.01);
});
test('critical press is monotonic; rapid reversals preserve position and velocity',()=>{
  const s=P.state(C.press,1,0,C.press.scale),samples=Array.from({length:161},(_,i)=>P.sample(s,i/1000));
  samples.forEach((v,i)=>{assert.ok(v.position>=C.press.scale);if(i)assert.ok(v.position<=samples[i-1].position);});
  const at=P.sample(s,.045),release=P.state(C.release,at.position,at.velocity,1),start=P.sample(release,0);
  assert.ok(Math.abs(start.position-at.position)<1e-12);assert.ok(Math.abs(start.velocity-at.velocity)<1e-12);
  const reverseAt=P.sample(release,.07),press=P.state(C.press,reverseAt.position,reverseAt.velocity,C.press.scale);
  assert.ok(Math.abs(P.sample(press,0).velocity-reverseAt.velocity)<1e-12);
});
test('damping dissipates mechanical energy rather than starting new full bounces',()=>{
  const s=P.state(C.release,C.press.scale,0,1);let last=Infinity;
  for(let i=0;i<421;i++) {const v=P.sample(s,i/1000),energy=.5*C.release.mass*v.velocity**2+.5*C.release.stiffness*(v.position-1)**2;assert.ok(energy<=last+1e-10);last=energy;}
});
test('sampled curves end at the exact rest state and reject invalid physics',()=>{
  const s=P.state(C.release,.974,0,1),frames=P.frames(s,C.release.durationMs);
  assert.equal(frames.at(-1).scale,1);assert.equal(frames.at(-1).offset,1);
  assert.match(P.cssEasing(C.travel),/^linear\(0,/);assert.ok(P.cssEasing(C.travel).endsWith(',1)'));
  assert.throws(()=>P.state({stiffness:-1},0));
});
