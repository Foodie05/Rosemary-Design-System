import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';
const specification=JSON.parse(readFileSync(new URL('../design/input-validation.json',import.meta.url),'utf8'));
const context=vm.createContext({window:{ROSEMARY_INPUT_VALIDATION:specification}});
vm.runInContext(readFileSync(new URL('../input-validation.js',import.meta.url),'utf8'),context);
const V=context.window.RosemaryValidation,accepted=value=>V.password(value).every(r=>r.pass);
test('all pairs of allowed categories pass; letter case is one category',()=>{
  for(const value of ['abc12345','abcdefg!','1234567!','A'.repeat(31)+'1'])assert.ok(accepted(value));
  for(const value of ['abcdefgh','AbCdEfGh','12345678','!!!!!!!!','ab12345','A'.repeat(32)+'1'])assert.equal(accepted(value),false);
});
test('ASCII punctuation is accepted, whitespace, emoji, Unicode and controls are rejected',()=>{
  for(let n=33;n<=126;n++)assert.ok(accepted('Ab12345'+String.fromCharCode(n)),'ASCII '+n);
  for(const invalid of [...Array.from({length:33},(_,n)=>String.fromCharCode(n)),String.fromCharCode(127),'中','é','😀','！','Ａ','\u200b','\ufeff'])assert.equal(accepted('Ab12345'+invalid),false);
  assert.equal(accepted(' Ab12345'),false);assert.equal(accepted('Ab12345 '),false);
});
test('initial, first editing and focus do not produce errors; first blur checks',()=>{
  let state=V.transition(null,'initial','','password');assert.equal(state.status,'neutral');
  state=V.transition(state,'focus','','password');state=V.transition(state,'input','abc','password');assert.equal(state.status,'neutral');assert.equal(state.armed,false);
  state=V.transition(state,'blur','abc','password');assert.equal(state.status,'invalid');assert.equal(state.armed,true);
  state=V.transition(state,'focus','abc','password');state=V.transition(state,'input','abc12345','password');assert.equal(state.status,'valid');
});
test('clearing removes both successful and failed results and starts a new blur cycle',()=>{
  for(const value of ['abc','abc12345']){
    let state=V.transition(null,'blur',value,'password');assert.equal(state.armed,true);
    state=V.transition(state,'input','','password');assert.equal(state.status,'neutral');assert.equal(state.armed,false);
    state=V.transition(state,'input','new','password');assert.equal(state.status,'neutral');
    state=V.transition(state,'blur','','password');assert.equal(state.status,'neutral');
  }
});
test('nickname, email and date requirements stay specific to their field',()=>{
  assert.ok(V.evaluate('name','知夏😀').every(r=>r.pass));assert.ok(V.evaluate('name','   ').some(r=>!r.pass));
  assert.ok(V.evaluate('email','a@example.test').every(r=>r.pass));assert.ok(!V.evaluate('email','a@').every(r=>r.pass));
  assert.ok(V.evaluate('date','2024-02-29').every(r=>r.pass));assert.ok(!V.evaluate('date','2025-02-29').every(r=>r.pass));
  assert.ok(V.evaluate('date','2026-10-12',{after:'2026-10-14'}).some(r=>r.pass===false));
  const state=V.transition(null,'blur','2026-10-12','date',{after:''});assert.equal(state.status,'neutral');assert.equal(state.results.at(-1).pass,null);
  assert.equal(V.transition(null,'blur','2026-10-12','date',{after:'bad'}).status,'neutral');
  assert.ok(V.evaluate('textLimit','a'.repeat(160),{max:160}).every(r=>r.pass));assert.ok(!V.evaluate('textLimit','a'.repeat(161),{max:160}).every(r=>r.pass));
  assert.ok(V.evaluate('integer','35',{min:5,max:60,step:5}).every(r=>r.pass));assert.ok(!V.evaluate('integer','37',{min:5,max:60,step:5}).every(r=>r.pass));
  assert.ok(V.evaluate('hex','#614578').every(r=>r.pass));assert.ok(!V.evaluate('hex','614578').every(r=>r.pass));
});
