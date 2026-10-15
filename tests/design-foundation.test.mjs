import assert from 'node:assert/strict';
import {test} from 'node:test';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {colorRoles,resolveAliases,contrast,validateContrast} from '../scripts/design-engine.mjs';
import {normalizePath,normalizeSvgElements} from '../scripts/icon-geometry.mjs';
import {defaultThemes,createTheme,resolveTheme,validateTheme,themeCssVariables,parseLocalDate,formatLocalDate,parseLocalTime,formatLocalTime,addLocalDays,addLocalMonths,localWeekday} from '../packages/tokens/dist/index.js';
import {iconNames,iconGeometry,getIconSvg} from '../packages/icons/dist/index.js';
const tokens=JSON.parse(fs.readFileSync(new URL('../design/tokens.json',import.meta.url),'utf8'));
test('color aliases resolve, cycles and missing role references fail',()=> {
  const value={...tokens.themes.light,raised:'{surface}'};
  assert.equal(resolveAliases(value).raised,'#FFFFFF');
  assert.throws(()=>resolveAliases({...value,raised:'{surface}',surface:'{raised}'}),/Circular/);
  assert.throws(()=>resolveAliases({...value,raised:'{unknown}'}),/Missing/);
  assert.throws(()=>resolveAliases({...value,primary:'rgba(0,0,0,.1)'}),/opaque/);
  const {focus,...missing}=value;assert.throws(()=>resolveAliases(missing),/24/);
});
test('theme creation rejects malformed input and diagnoses actual contrast without recoloring',()=> {
  assert.equal(contrast('#000000','#ffffff'),21);
  assert.equal(validateTheme(defaultThemes.light).length,0);
  assert.equal(validateTheme(defaultThemes.dark).length,0);
  const white=createTheme(defaultThemes.light,{primary:'#FFFFFF'});
  const issues=validateTheme(white);
  assert.equal(white.primary,'#FFFFFF');
  assert.ok(issues.some(x=>x.foreground==='on-primary'&&x.background==='primary'&&x.ratio===1&&x.target===4.5));
  assert.throws(()=>createTheme(defaultThemes.light,{primary:'transparent'}),/Invalid/);
  assert.throws(()=>createTheme(defaultThemes.light,{unexpected:'#FFFFFF'}),/24/);
  assert.throws(()=>validateTheme({primary:'#FFFFFF'}),/24/);
  const dark=resolveTheme({mode:'system',systemDark:true});
  assert.equal(dark.canvas,defaultThemes.dark.canvas);
  const inherited=createTheme(createTheme(dark,{primary:'#CDB5EA'}),{surface:'#25212D'});
  assert.equal(inherited.primary,'#CDB5EA');assert.equal(Object.keys(themeCssVariables(inherited)).length,24);
});
test('every source semantic pair satisfies its applicable target',()=> {
  for(const colors of Object.values(tokens.themes))assert.deepEqual(validateContrast(resolveAliases(colors)),[]);
});
test('date-only values survive Gregorian extremes, leap years and local editing',()=> {
  for(const text of ['0001-01-01','0099-12-31','1900-02-28','2000-02-29','9999-12-31'])assert.equal(formatLocalDate(parseLocalDate(text)),text);
  for(const text of ['0000-01-01','1900-02-29','2026-02-29','2026-13-01','2026-1-01'])assert.equal(parseLocalDate(text),null);
  assert.equal(formatLocalDate(addLocalMonths(parseLocalDate('2024-01-31'),1)),'2024-02-29');
  assert.equal(formatLocalDate(addLocalDays(parseLocalDate('2024-02-28'),2)),'2024-03-01');
  assert.throws(()=>addLocalDays(parseLocalDate('9999-12-31'),1),/outside/);
  assert.throws(()=>addLocalMonths(parseLocalDate('0001-01-01'),-1),/outside/);
  assert.equal(localWeekday(parseLocalDate('0001-01-01')),0);
  assert.equal(localWeekday(parseLocalDate('2026-10-13')),1);
  assert.equal(formatLocalTime(parseLocalTime('23:59')),'23:59');
  assert.equal(parseLocalTime('24:00'),null);assert.equal(parseLocalTime('1:05'),null);
});
test('normalization preserves relative endpoints, smooth tangent and arc endpoint',()=> {
  const normalized=normalizePath('M1 2 h3 v4 c1 0 2 1 3 1 s2 0 3 -1 z');
  assert.deepEqual(normalized[1],{op:'L',values:[4,2]});
  assert.deepEqual(normalized[2],{op:'L',values:[4,6]});
  assert.deepEqual(normalized[4],{op:'C',values:[8,7,9,7,10,6]});
  const arc=normalizePath('M10 0 A10 10 0 0 1 0 10');
  assert.deepEqual(arc.at(-1).values.slice(4),[0,10]);
  assert.ok(Math.abs(arc[1].values[1]-5.522847)<.000002);
  assert.equal(normalizeSvgElements('<circle cx="12" cy="12" r="3"/>')[0].filter(x=>x.op==='C').length,4);
  assert.throws(()=>normalizePath('M0 0 Q1 2 3 4'),/Unsupported/);
  assert.throws(()=>normalizeSvgElements('<script/>'),/Unrecognized/);
});
test('all shared renderer paths have finite, complete commands and SVG semantics',()=> {
  const source=JSON.parse(fs.readFileSync(new URL('../design/icons.json',import.meta.url),'utf8'));
  assert.deepEqual(iconNames,Object.keys(source));assert.equal(new Set(iconNames).size,iconNames.length);
  for(const name of ['sun','moon','theme-system','globe'])assert.ok(iconNames.includes(name));
  for(const name of iconNames) {
    assert.match(getIconSvg(name),/viewBox="0 0 24 24"/);
    for(const path of iconGeometry[name]) {
      assert.equal(path[0].op,'M');
      for(const command of path){assert.equal(command.values.length,{M:2,L:2,C:6,Z:0}[command.op]);assert.ok(command.values.every(Number.isFinite));}
    }
  }
  assert.throws(()=>getIconSvg('not-an-icon'),/Unknown/);
});
test('checked-in generated files are deterministic and current',()=> {
  const result=execFileSync(process.execPath,['scripts/generate-design.mjs','--check'],{cwd:new URL('..',import.meta.url),encoding:'utf8'});
  assert.match(result,/shared outputs/);
});
