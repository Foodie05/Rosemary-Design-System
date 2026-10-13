import { colorRoles, defaultThemes, contrastPairs } from './tokens.js';
import type { RosemaryColors, RosemaryColorRole } from './tokens.js';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ContrastDiagnostic = Readonly<{ kind: 'contrast'; foreground: RosemaryColorRole; background: RosemaryColorRole; ratio: number; target: number }>;
const camel = (role: string) => role.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()) as keyof RosemaryColors;
export function contrastRatio(foreground: string, background: string): number {
  function luminance(hex: string): number {
    if (!/^#[\da-f]{6}$/i.test(hex)) throw new TypeError(`Expected opaque sRGB #RRGGBB: ${hex}`);
    const c = [1,3,5].map(i => parseInt(hex.slice(i,i+2),16)/255).map(v => v <= .04045 ? v / 12.92 : ((v + .055)/1.055)**2.4);
    return c[0]!*.2126+c[1]!*.7152+c[2]!*.0722;
  }
  const a=luminance(foreground), b=luminance(background);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
/** Throws on malformed structure/color; reports contrast failures without changing colors. */
export function validateTheme(colors: RosemaryColors): ContrastDiagnostic[] {
  if (!colors || typeof colors !== 'object' || Array.isArray(colors)) throw new TypeError('Theme must be an object');
  const keys=colorRoles.map(camel);
  if (Object.keys(colors).length!==keys.length || Object.keys(colors).some(k=>!keys.includes(k as keyof RosemaryColors))) throw new TypeError('Theme must contain exactly all 24 color roles');
  for (const key of keys) if (typeof colors[key] !== 'string' || !/^#[\da-f]{6}$/i.test(colors[key])) throw new TypeError(`Invalid theme color ${key}`);
  return contrastPairs.flatMap(([foreground,background,target])=> {
    const ratio=contrastRatio(colors[camel(foreground)],colors[camel(background)]);
    return ratio+1e-12<target?[{kind:'contrast' as const,foreground,background,ratio,target}]:[];
  });
}
/** Inherit a complete parent palette before applying partial component-tree overrides. */
export function createTheme(parent: RosemaryColors, overrides: Partial<RosemaryColors> = {}): RosemaryColors {
  validateTheme(parent);
  if (!overrides || typeof overrides !== 'object' || Array.isArray(overrides)) throw new TypeError('Overrides must be an object');
  const result={...parent,...overrides};
  validateTheme(result);
  return Object.freeze(result);
}
export function resolveTheme(options: { mode: ThemeMode; systemDark?: boolean; overrides?: Partial<RosemaryColors>; parent?: RosemaryColors }): RosemaryColors {
  const {mode,systemDark=false,overrides={},parent}=options;
  if (!['light','dark','system'].includes(mode)) throw new TypeError(`Unknown theme mode ${mode}`);
  return createTheme(parent??defaultThemes[mode==='system'?(systemDark?'dark':'light'):mode],overrides);
}
export function themeCssVariables(colors: RosemaryColors): Record<string,string> {
  validateTheme(colors);
  return Object.fromEntries(colorRoles.map(role=>[`--rm-${role}`,colors[camel(role)]]));
}
