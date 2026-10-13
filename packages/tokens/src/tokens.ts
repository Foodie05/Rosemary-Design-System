// Generated from design/tokens.json. Do not edit; run pnpm design:generate.
export const sdkVersion='0.4.0' as const;
export const specVersion='1.2.0' as const;
export const colorRoles=["canvas","surface","raised","ink","muted","border","control","primary","on-primary","primary-soft","sun","on-sun","sky","on-sky","success","success-soft","warning","warning-soft","danger","danger-soft","on-danger","info","info-soft","focus"] as const;
export type RosemaryColorRole=typeof colorRoles[number];
export interface RosemaryColors {
  readonly canvas: string;
  readonly surface: string;
  readonly raised: string;
  readonly ink: string;
  readonly muted: string;
  readonly border: string;
  readonly control: string;
  readonly primary: string;
  readonly onPrimary: string;
  readonly primarySoft: string;
  readonly sun: string;
  readonly onSun: string;
  readonly sky: string;
  readonly onSky: string;
  readonly success: string;
  readonly successSoft: string;
  readonly warning: string;
  readonly warningSoft: string;
  readonly danger: string;
  readonly dangerSoft: string;
  readonly onDanger: string;
  readonly info: string;
  readonly infoSoft: string;
  readonly focus: string;
}
export const defaultThemes: Readonly<Record<'light'|'dark',RosemaryColors>>=Object.freeze({light:Object.freeze({"canvas":"#F8F7FB","surface":"#FFFFFF","raised":"#FFFFFF","ink":"#302B3B","muted":"#706579","border":"#DED8E5","control":"#8D8198","primary":"#614578","onPrimary":"#FFFFFF","primarySoft":"#E8E1F0","sun":"#F3CD6B","onSun":"#513F13","sky":"#DDEBF6","onSky":"#34516C","success":"#2F6952","successSoft":"#EAF4EE","warning":"#815300","warningSoft":"#FBF0D9","danger":"#A53C46","dangerSoft":"#FBECEE","onDanger":"#FFFFFF","info":"#315F9A","infoSoft":"#EAF1FC","focus":"#745291"}),dark:Object.freeze({"canvas":"#1C1922","surface":"#25212D","raised":"#302A39","ink":"#F0EAF6","muted":"#B9AEC6","border":"#43394F","control":"#94859F","primary":"#CDB5EA","onPrimary":"#2D2038","primarySoft":"#3C2F4C","sun":"#E4C16B","onSun":"#3E3010","sky":"#2B4256","onSky":"#D9EBFB","success":"#9DD5B5","successSoft":"#213D30","warning":"#EBC97C","warningSoft":"#44371C","danger":"#F1ADB6","dangerSoft":"#452830","onDanger":"#30171D","info":"#AAC9EF","infoSoft":"#253B57","focus":"#CDB5EA"})});
export const contrastPairs=[["ink","canvas",4.5],["muted","canvas",4.5],["ink","surface",4.5],["muted","surface",4.5],["ink","raised",4.5],["muted","raised",4.5],["on-primary","primary",4.5],["primary","primary-soft",4.5],["ink","primary-soft",4.5],["on-sun","sun",4.5],["on-sky","sky",4.5],["success","success-soft",4.5],["warning","warning-soft",4.5],["danger","danger-soft",4.5],["info","info-soft",4.5],["on-danger","danger",4.5],["control","canvas",3],["control","surface",3],["control","raised",3],["focus","canvas",3],["focus","surface",3],["focus","raised",3]] as const;
export const spacing=[4,8,12,16,24,32,48,64,96] as const;
export const radius={"control":8,"content":12,"dialog":20,"pill":999} as const;
export const typography={"ui":"-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif","editorial":"Songti SC, STSong, Noto Serif CJK SC, Georgia, serif","latinEditorial":"Georgia, Times New Roman, serif","code":"SFMono-Regular, Consolas, Liberation Mono, monospace","webScalePx":{"caption":12,"small":14,"body":16,"lead":20,"heading":28,"title":40,"display":64},"lineHeight":{"body":1.75,"compact":1.5,"heading":1.3}} as const;
export const motion={"instantFeedback":120,"state":180,"transition":260,"exit":160,"layout":240,"confirmation":220,"restoration":480,"page":220,"easing":"cubic-bezier(0.2, 0.7, 0.2, 1)","drawerEnterMs":220,"drawerExitMs":180,"tabsMs":180,"loadingCycleMs":1200,"progressMs":320} as const;
export const metrics={"controlRadius":8,"contentRadius":12,"dialogRadius":20,"touchTarget":44,"buttonSmallHeight":32,"buttonMediumHeight":40,"buttonLargeHeight":48,"drawerEnterMs":220,"drawerExitMs":180,"tabsMs":180,"loadingCycleMs":1200,"progressMs":320} as const;
export const componentTokens={
  "button": {
    "foreground": "on-primary",
    "background": "primary",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "height": {
      "small": 32,
      "medium": 40,
      "large": 48
    },
    "paddingInline": 16
  },
  "link": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "iconButton": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "input": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "minHeight": 44
  },
  "textarea": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "select": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "minHeight": 44
  },
  "search": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "minHeight": 44
  },
  "checkbox": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "radio": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "switch": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "slider": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "date": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "minHeight": 44
  },
  "upload": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "tabs": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "indicatorMs": 180,
    "contentMs": 180
  },
  "breadcrumb": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "pagination": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "menu": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "tooltip": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "popover": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "dialog": {
    "foreground": "ink",
    "background": "raised",
    "focus": "focus",
    "border": "control",
    "radius": "dialog",
    "minTouchTarget": 44,
    "enterMs": 260,
    "exitMs": 160,
    "completion": "animation-finished",
    "interruptible": true
  },
  "drawer": {
    "foreground": "ink",
    "background": "raised",
    "focus": "focus",
    "border": "control",
    "radius": "dialog",
    "minTouchTarget": 44,
    "enterMs": 220,
    "exitMs": 180,
    "completion": "animation-finished",
    "interruptible": true
  },
  "toast": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "alert": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "card": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "list": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "table": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "badge": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "avatar": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "empty": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "skeleton": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "loading": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "sizes": [
      18,
      32,
      48
    ],
    "cycleMs": 1200,
    "appearanceDelayMs": 300,
    "reducedMotion": "static",
    "shape": "two-fold-long-axis"
  },
  "progress": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "transitionMs": 320,
    "reducedMotion": "immediate",
    "valueSemantics": "actual-completed-work"
  },
  "stepper": {
    "foreground": "ink",
    "background": "surface",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  }
} as const;
