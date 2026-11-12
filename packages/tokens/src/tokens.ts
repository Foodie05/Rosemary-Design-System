// Generated from design/tokens.json. Do not edit; run pnpm design:generate.
export const sdkVersion='0.5.0' as const;
export const specVersion='1.3.0' as const;
export const colorRoles=["canvas","surface","raised","ink","muted","border","control","primary","on-primary","primary-soft","sun","on-sun","sky","on-sky","success","success-soft","warning","warning-soft","danger","danger-soft","on-danger","info","info-soft","focus","surface-navigation","on-navigation","navigation-muted","navigation-active","on-navigation-active","surface-topbar","on-topbar","on-topbar-muted","topbar-control","surface-group","surface-inset","surface-floating","field-fill","field-hover","field-line","field-line-hover","edge-soft","secondary-container","on-secondary-container","tertiary-container","on-tertiary-container"] as const;
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
  readonly surfaceNavigation: string;
  readonly onNavigation: string;
  readonly navigationMuted: string;
  readonly navigationActive: string;
  readonly onNavigationActive: string;
  readonly surfaceTopbar: string;
  readonly onTopbar: string;
  readonly onTopbarMuted: string;
  readonly topbarControl: string;
  readonly surfaceGroup: string;
  readonly surfaceInset: string;
  readonly surfaceFloating: string;
  readonly fieldFill: string;
  readonly fieldHover: string;
  readonly fieldLine: string;
  readonly fieldLineHover: string;
  readonly edgeSoft: string;
  readonly secondaryContainer: string;
  readonly onSecondaryContainer: string;
  readonly tertiaryContainer: string;
  readonly onTertiaryContainer: string;
}
export const defaultThemes: Readonly<Record<'light'|'dark',RosemaryColors>>=Object.freeze({light:Object.freeze({"canvas":"#FEF7FC","surface":"#FFFFFF","raised":"#FFFFFF","ink":"#1D1B1E","muted":"#494649","border":"#D0CACF","control":"#6D696D","primary":"#6A4E81","onPrimary":"#FFFFFF","primarySoft":"#F6EAF9","sun":"#FFEADE","onSun":"#4B270C","sky":"#FFE8F6","onSky":"#3F2A3A","success":"#235D37","successSoft":"#EEF6EB","warning":"#654900","warningSoft":"#FFF2E0","danger":"#972C25","dangerSoft":"#FFF0EE","onDanger":"#FFFFFF","info":"#1B577E","infoSoft":"#EFF4FC","focus":"#563B6D","surfaceNavigation":"#EFE5F0","onNavigation":"#342E37","navigationMuted":"#4B454D","navigationActive":"#785D8E","onNavigationActive":"#FFFFFF","surfaceTopbar":"#FDF0F7","onTopbar":"#352E33","onTopbarMuted":"#4C454A","topbarControl":"#EEE2E9","surfaceGroup":"#FFFFFF","surfaceInset":"#F6EFF3","surfaceFloating":"#FFFFFF","fieldFill":"#F3ECF1","fieldHover":"#EDE6EB","fieldLine":"#6D696D","fieldLineHover":"#5C585C","edgeSoft":"#D9D3D7","secondaryContainer":"#FFE8F6","onSecondaryContainer":"#3F2A3A","tertiaryContainer":"#FFEADE","onTertiaryContainer":"#4B270C"}),dark:Object.freeze({"canvas":"#211F22","surface":"#2E2B2F","raised":"#3B383C","ink":"#F6EFF3","muted":"#C5BFC4","border":"#5A565A","control":"#AFAAAE","primary":"#DCB9F5","onPrimary":"#3A2050","primarySoft":"#403944","sun":"#4A372B","onSun":"#FFDCC7","sky":"#463742","onSky":"#FAD9F0","success":"#97D5A5","successSoft":"#2F3730","warning":"#F3C666","warningSoft":"#3B3428","danger":"#FFB4AB","dangerSoft":"#403130","onDanger":"#540003","info":"#98CCF9","infoSoft":"#30353B","focus":"#EED3FF","surfaceNavigation":"#18141B","onNavigation":"#EFE5F0","navigationMuted":"#C7BEC9","navigationActive":"#785D8E","onNavigationActive":"#FFFFFF","surfaceTopbar":"#201A1E","onTopbar":"#F1E5EB","onTopbarMuted":"#C9BEC4","topbarControl":"#352E33","surfaceGroup":"#2E2B2F","surfaceInset":"#322F33","surfaceFloating":"#3B383C","fieldFill":"#373437","fieldHover":"#3E3A3E","fieldLine":"#AFAAAE","fieldLineHover":"#C5BFC4","edgeSoft":"#575458","secondaryContainer":"#463742","onSecondaryContainer":"#FAD9F0","tertiaryContainer":"#4A372B","onTertiaryContainer":"#FFDCC7"})});
export const contrastPairs=[["ink","canvas",4.5],["muted","canvas",4.5],["ink","surface",4.5],["muted","surface",4.5],["ink","raised",4.5],["muted","raised",4.5],["primary","primary-soft",4.5],["ink","primary-soft",4.5],["on-primary","primary",4.5],["on-sun","sun",4.5],["on-sky","sky",4.5],["success","success-soft",4.5],["warning","warning-soft",4.5],["danger","danger-soft",4.5],["on-danger","danger",4.5],["info","info-soft",4.5],["on-navigation","surface-navigation",4.5],["on-navigation-active","navigation-active",4.5],["navigation-muted","surface-navigation",4.5],["on-topbar","surface-topbar",4.5],["on-topbar-muted","surface-topbar",4.5],["navigation-muted","surface-topbar",4.5],["ink","surface-group",4.5],["muted","surface-group",4.5],["ink","surface-inset",4.5],["muted","surface-inset",4.5],["ink","surface-floating",4.5],["muted","surface-floating",4.5],["on-topbar","topbar-control",4.5],["on-topbar-muted","topbar-control",4.5],["primary","canvas",4.5],["primary","surface",4.5],["primary","raised",4.5],["ink","field-fill",4.5],["muted","field-fill",4.5],["ink","field-hover",4.5],["muted","field-hover",4.5],["on-secondary-container","secondary-container",4.5],["on-tertiary-container","tertiary-container",4.5],["navigation-active","surface-navigation",3],["control","canvas",3],["control","surface",3],["control","raised",3],["field-line","field-fill",3],["field-line","canvas",3],["field-line","surface-inset",3],["field-line-hover","field-hover",3],["focus","canvas",3],["focus","raised",3],["focus","surface-group",3],["focus","surface-inset",3],["focus","surface-floating",3],["focus","field-fill",3],["focus","surface",3],["focus","surface-navigation",3],["focus","surface-topbar",3]] as const;
export const spacing=[4,8,12,16,24,32,48,64,96] as const;
export const radius={"control":8,"content":12,"dialog":20,"pill":999} as const;
export const typography={"ui":"-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif","editorial":"Songti SC, STSong, Noto Serif CJK SC, Georgia, serif","latinEditorial":"Georgia, Times New Roman, serif","code":"SFMono-Regular, Consolas, Liberation Mono, monospace","webScalePx":{"caption":12,"small":14,"body":16,"lead":20,"heading":28,"title":40,"display":64},"lineHeight":{"body":1.75,"compact":1.5,"heading":1.3},"weights":{"regular":400,"medium":500,"semibold":600}} as const;
export const motion={"instantFeedback":120,"state":180,"transition":260,"exit":160,"layout":240,"confirmation":220,"restoration":480,"page":220,"easing":"cubic-bezier(0.2, 0.7, 0.2, 1)","drawerEnterMs":220,"drawerExitMs":180,"tabsMs":180,"loadingCycleMs":1200,"progressMs":320,"progressFlowMs":1800,"skeletonCycleMs":1500} as const;
export const metrics={"contentMax":1480,"gridGap":24,"compactGridGap":16,"shellHeight":76,"headerIconSize":20,"controlRadius":8,"contentRadius":12,"dialogRadius":20,"touchTarget":44,"buttonSmallHeight":32,"buttonMediumHeight":40,"buttonLargeHeight":48,"drawerEnterMs":220,"drawerExitMs":180,"tabsMs":180,"loadingCycleMs":1200,"progressMs":320} as const;
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
    "paddingInline": 16,
    "darkFillInset": 1
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
    "background": "field-fill",
    "focus": "focus",
    "border": "field-line",
    "radius": "control",
    "minTouchTarget": 44,
    "minHeight": 44
  },
  "textarea": {
    "foreground": "ink",
    "background": "field-fill",
    "focus": "focus",
    "border": "field-line",
    "radius": "control",
    "minTouchTarget": 44
  },
  "select": {
    "foreground": "ink",
    "background": "field-fill",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44,
    "minHeight": 44
  },
  "search": {
    "foreground": "ink",
    "background": "field-fill",
    "focus": "focus",
    "border": "field-line",
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
    "background": "field-fill",
    "focus": "focus",
    "border": "field-line",
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
    "background": "surface-floating",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "tooltip": {
    "foreground": "ink",
    "background": "surface-floating",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "popover": {
    "foreground": "ink",
    "background": "surface-floating",
    "focus": "focus",
    "border": "control",
    "radius": "control",
    "minTouchTarget": 44
  },
  "dialog": {
    "foreground": "ink",
    "background": "surface-floating",
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
    "background": "surface-floating",
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
    "background": "surface-floating",
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
    "background": "surface-group",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "list": {
    "foreground": "ink",
    "background": "surface-group",
    "focus": "focus",
    "border": "border",
    "radius": "content",
    "minTouchTarget": 44
  },
  "table": {
    "foreground": "ink",
    "background": "surface-group",
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
    "background": "surface-group",
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
      17,
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
