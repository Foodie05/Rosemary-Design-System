import Material from './material-runtime.js';
import {createColorRecipe} from './color-recipe.js';
import {colorRoles,defaultThemes} from './tokens.js';
import type {RosemaryColors} from './tokens.js';
import {validateTheme} from './theme.js';
export type ColorMood='calm'|'vivid';
export interface ColorRecipeOptions {seed:string;mood:ColorMood}
export interface RosemaryColorScheme {readonly light:RosemaryColors;readonly dark:RosemaryColors}
export interface RosemaryColorRecipe {readonly schema:'rosemary.dynamic-colors.v2';readonly specVersion:'1.3.0';readonly config:ColorRecipeOptions;readonly colors:Readonly<Record<'light'|'dark',Readonly<Record<string,string>>>>;readonly themes:Readonly<Record<'light'|'dark',Readonly<Record<string,string>>>>;readonly checks:Readonly<Record<'light'|'dark',readonly {fg:string;bg:string;target:number;ratio:number;pass:boolean}[]>>}
const engine=createColorRecipe(Material);
const camel=(value:string)=>value.replace(/-([a-z])/g,(_,v:string)=>v.toUpperCase());
/** Same canonical HCT recipe as the offline studio. No DOM, storage or network access. */
export function generateColorRecipe(config:ColorRecipeOptions={seed:'#614578',mood:'calm'}):RosemaryColorRecipe {return engine.generate(config) as unknown as RosemaryColorRecipe;}
/** Imports the studio export, including both modes and every semantic surface role. */
export function importColorScheme(input:unknown):RosemaryColorScheme {
 if(!input||typeof input!=='object')throw new TypeError('Expected paired color recipe');
 const document=input as Record<string,unknown>,modes=(document.colors??document.themes??document) as Record<string,unknown>;
 const result={} as Record<'light'|'dark',RosemaryColors>;
 for(const mode of ['light','dark'] as const){const source=modes?.[mode];if(!source||typeof source!=='object'||Array.isArray(source))throw new TypeError('Missing '+mode+' palette');
  const raw=source as Record<string,string>;const keys=Object.keys(raw),camelKeys=colorRoles.map(camel);
  const kebab=keys.every(k=>colorRoles.includes(k as typeof colorRoles[number]));
  if(keys.length!==colorRoles.length||(!kebab&&!keys.every(k=>camelKeys.includes(k))))throw new TypeError('Expected all '+colorRoles.length+' color roles');
  const colors=Object.fromEntries(colorRoles.map(role=>[camel(role),raw[kebab?role:camel(role)]])) as unknown as RosemaryColors;
  validateTheme(colors);result[mode]=Object.freeze(colors);
 }
 return Object.freeze(result);
}
export function createColorScheme(config:ColorRecipeOptions):RosemaryColorScheme {return importColorScheme(generateColorRecipe(config));}
/** Explicit migration of a 0.4.x core palette; extended surfaces start from the new defaults. */
export function migrateLegacyTheme(legacy:Partial<RosemaryColors>,mode:'light'|'dark'):RosemaryColors {
 const result={...defaultThemes[mode],...legacy};validateTheme(result);return Object.freeze(result);
}
