import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {transformSync} from 'esbuild';
import {execFileSync} from 'node:child_process';
const root=new URL('../',import.meta.url);
const schema=JSON.parse(readFileSync(new URL('design/input-validation.json',root),'utf8'));
const portal=vm.createContext({window:{ROSEMARY_INPUT_VALIDATION:schema}});
vm.runInContext(readFileSync(new URL('input-validation.js',root),'utf8'),portal);
const ts=vm.createContext({module:{exports:{}}});
vm.runInContext(transformSync(readFileSync(new URL('packages/tokens/src/password.ts',root),'utf8'),{loader:'ts',format:'cjs'}).code,ts);
const {checkRosemaryPassword}=ts.module.exports;
test('all generated SDK policies match the canonical source',()=>{execFileSync(process.execPath,[new URL('scripts/generate-password-policy.mjs',root).pathname,'--check']);});
test('Web/React and portal password acceptance agree on every ASCII character and Unicode rejection',()=>{
  const yes=['abc12345','abcdefg!','1234567!','A'.repeat(31)+'1'];
  const no=['','AbCdEfGh','abcdefgh','12345678','!!!!!!!!','A1!','A'.repeat(32)+'1','Abc12345中','Abc12345😀',' Abc12345','Abc12345 '];
  for(let n=0;n<=127;n++)(n>=33&&n<=126?yes:no).push('Ab12345'+String.fromCharCode(n));
  for(const [values,expected]of [[yes,true],[no,false]])for(const value of values){
    const actual=checkRosemaryPassword(value);assert.equal(actual.valid,expected);
    const rules=portal.window.RosemaryValidation.password(value);assert.equal(actual.length,rules[0].pass);assert.equal(actual.characters,rules[1].pass);assert.equal(actual.categories,rules[2].pass);
  }
});
