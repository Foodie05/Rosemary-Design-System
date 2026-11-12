import test from 'node:test';
import assert from 'node:assert/strict';
import {colorRecipe as canonical} from '../scripts/color-recipe.mjs';
import {generateColorRecipe,createColorScheme,importColorScheme,defaultThemes,validateTheme,themeCssVariables,migrateLegacyTheme} from '../packages/tokens/dist/index.js';
const camel=s=>s.replace(/-([a-z])/g,(_,v)=>v.toUpperCase());
test('standalone SDK HCT runtime is byte-for-byte equivalent to the offline canonical recipe',()=>{
 for(const seed of ['#614578','#00FF00','#FF00FF','#00FFFF','#FFFFFF','#000000','#123456'])for(const mood of ['calm','vivid']){
  const raw=generateColorRecipe({seed,mood}),expected=canonical.generate({seed,mood});
  assert.deepEqual(raw,expected);
  const paired=createColorScheme({seed,mood});
  for(const mode of ['light','dark']){
   assert.equal(Object.keys(paired[mode]).length,45);
   for(const role of canonical.roles)assert.equal(paired[mode][camel(role)],expected.colors[mode][role]);
   assert.deepEqual(validateTheme(paired[mode]),[]);
   assert.equal(Object.keys(themeCssVariables(paired[mode])).length,45);
  }
 }
});
test('recipe caching cannot be corrupted and imports reject partial, mixed or malformed modes',()=>{
 const recipe=generateColorRecipe();assert.ok(Object.isFrozen(recipe.colors.light));
 assert.throws(()=>{recipe.colors.light.canvas='#FF00FF'},TypeError);
 assert.deepEqual(importColorScheme(JSON.parse(JSON.stringify(recipe))),createColorScheme(recipe.config));
 assert.throws(()=>importColorScheme({light:defaultThemes.light}),/Missing dark/);
 const broken=JSON.parse(JSON.stringify(recipe));delete broken.colors.dark['surface-navigation'];assert.throws(()=>importColorScheme(broken),/45/);
 const malformed=JSON.parse(JSON.stringify(recipe));malformed.colors.dark['navigation-active']='transparent';assert.throws(()=>importColorScheme(malformed),/Invalid/);
 assert.throws(()=>generateColorRecipe({seed:'#fff',mood:'vivid'}));
});
test('legacy migration is explicit and keeps new complete surfaces',()=>{
 const migrated=migrateLegacyTheme({primary:'#24675E'},'light');
 assert.equal(migrated.primary,'#24675E');assert.equal(migrated.surfaceNavigation,defaultThemes.light.surfaceNavigation);
 assert.throws(()=>migrateLegacyTheme({nonsense:'#FFFFFF'},'light'));
});
