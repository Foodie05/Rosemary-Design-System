import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {test} from 'node:test';
const context=vm.createContext({window:{}});
vm.runInContext(readFileSync(new URL('../field-focus.js',import.meta.url),'utf8'),context);
const {edges,reveal}=context.window.RosemaryFieldFocusGeometry;
const corners=[[12,12],[8,8],[8,8],[12,12]];
test('two fronts meet halfway along each side without a side-edge origin',()=>{
  for(const origin of [0,.01,.25,.5,.99,1]) {
    const g=edges(400,120,corners,1.5,origin);
    const starts=g.paths.map(p=>p.d.match(/^M ([\d.e+-]+) ([\d.e+-]+)/).slice(1).map(Number));
    assert.deepEqual(starts[0],starts[2]);assert.deepEqual(starts[1],starts[3]);
    assert.equal(starts[0][1],0);assert.equal(starts[1][1],g.h);
    assert.equal(starts[0][0],g.top);assert.equal(starts[1][0],g.bottom);
    assert.ok(g.top>=11.25&&g.top<=g.w-7.25);
    assert.ok(g.bottom>=11.25&&g.bottom<=g.w-7.25);
    for(const length of [30,200,800]) {
      let previous=0;
      for(let step=0;step<=100;step++) {const v=reveal(length,step/100);assert.ok(v.shown>=previous);previous=v.shown;assert.equal(v.dashoffset,0);}
      assert.ok(previous*2>=length);assert.ok(previous*2-length<.05);
    }
  }
});
test('out-of-field label clicks clamp to the top/bottom straight segments',()=>{
  assert.equal(edges(400,120,corners,1.5,-1).top,11.25);
  assert.equal(edges(400,120,corners,1.5,2).top,391.25);
  assert.equal(reveal(100,-1).shown,0);assert.equal(reveal(100,2).shown,50.02);
});
test('stroke remains inside the field and corner shapes stay finite',()=>{
  for(const [w,h] of [[400,120],[32,32],[800,48]])for(const radii of [corners,[[999,999],[999,999],[999,999],[999,999]],[[0,0],[0,0],[0,0],[0,0]],[[20,8],[12,30],[6,8],[3,16]]]) {
    const g=edges(w,h,radii);assert.equal(g.inset,.75);assert.equal(g.w,w-1.5);assert.equal(g.h,h-1.5);
    g.paths.forEach(p=>assert.ok(!/NaN|Infinity|undefined/.test(p.d)));
  }
});
