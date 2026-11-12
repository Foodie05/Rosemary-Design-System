// Generated from design/tokens.json. Do not edit; run pnpm design:generate.
import SwiftUI
public struct RosemaryMotion { public let durations: [String:Double]; public let easing: String }
public struct RosemaryTypeRole { public let family: String; public let fontSize: CGFloat; public let lineHeight: CGFloat; public let weight: Int }
public struct RosemaryTypography { public let families: [String:String]; public let roles: [String:RosemaryTypeRole]; public let lineHeights: [String:CGFloat]; public let weights: [String:Int] }
public struct RosemaryComponentToken { public let foreground: String; public let background: String; public let focus: String; public let border: String; public let radiusRole: String; public let radius: CGFloat; public let dimensions: [String:CGFloat]; public let behavior: [String:String]; public let flags: [String:Bool]; public let sizes: [CGFloat] }
public struct RosemaryContrastPair { public let foreground: String; public let background: String; public let target: Double }
public struct RosemaryColors {
  public let canvas: Color
  public let surface: Color
  public let raised: Color
  public let ink: Color
  public let muted: Color
  public let border: Color
  public let control: Color
  public let primary: Color
  public let onPrimary: Color
  public let primarySoft: Color
  public let sun: Color
  public let onSun: Color
  public let sky: Color
  public let onSky: Color
  public let success: Color
  public let successSoft: Color
  public let warning: Color
  public let warningSoft: Color
  public let danger: Color
  public let dangerSoft: Color
  public let onDanger: Color
  public let info: Color
  public let infoSoft: Color
  public let focus: Color
  public let surfaceNavigation: Color
  public let onNavigation: Color
  public let navigationMuted: Color
  public let navigationActive: Color
  public let onNavigationActive: Color
  public let surfaceTopbar: Color
  public let onTopbar: Color
  public let onTopbarMuted: Color
  public let topbarControl: Color
  public let surfaceGroup: Color
  public let surfaceInset: Color
  public let surfaceFloating: Color
  public let fieldFill: Color
  public let fieldHover: Color
  public let fieldLine: Color
  public let fieldLineHover: Color
  public let edgeSoft: Color
  public let secondaryContainer: Color
  public let onSecondaryContainer: Color
  public let tertiaryContainer: Color
  public let onTertiaryContainer: Color
  public init(
    canvas: Color,
    surface: Color,
    raised: Color,
    ink: Color,
    muted: Color,
    border: Color,
    control: Color,
    primary: Color,
    onPrimary: Color,
    primarySoft: Color,
    sun: Color,
    onSun: Color,
    sky: Color,
    onSky: Color,
    success: Color,
    successSoft: Color,
    warning: Color,
    warningSoft: Color,
    danger: Color,
    dangerSoft: Color,
    onDanger: Color,
    info: Color,
    infoSoft: Color,
    focus: Color,
    surfaceNavigation: Color,
    onNavigation: Color,
    navigationMuted: Color,
    navigationActive: Color,
    onNavigationActive: Color,
    surfaceTopbar: Color,
    onTopbar: Color,
    onTopbarMuted: Color,
    topbarControl: Color,
    surfaceGroup: Color,
    surfaceInset: Color,
    surfaceFloating: Color,
    fieldFill: Color,
    fieldHover: Color,
    fieldLine: Color,
    fieldLineHover: Color,
    edgeSoft: Color,
    secondaryContainer: Color,
    onSecondaryContainer: Color,
    tertiaryContainer: Color,
    onTertiaryContainer: Color
  ) {
    self.canvas = canvas
    self.surface = surface
    self.raised = raised
    self.ink = ink
    self.muted = muted
    self.border = border
    self.control = control
    self.primary = primary
    self.onPrimary = onPrimary
    self.primarySoft = primarySoft
    self.sun = sun
    self.onSun = onSun
    self.sky = sky
    self.onSky = onSky
    self.success = success
    self.successSoft = successSoft
    self.warning = warning
    self.warningSoft = warningSoft
    self.danger = danger
    self.dangerSoft = dangerSoft
    self.onDanger = onDanger
    self.info = info
    self.infoSoft = infoSoft
    self.focus = focus
    self.surfaceNavigation = surfaceNavigation
    self.onNavigation = onNavigation
    self.navigationMuted = navigationMuted
    self.navigationActive = navigationActive
    self.onNavigationActive = onNavigationActive
    self.surfaceTopbar = surfaceTopbar
    self.onTopbar = onTopbar
    self.onTopbarMuted = onTopbarMuted
    self.topbarControl = topbarControl
    self.surfaceGroup = surfaceGroup
    self.surfaceInset = surfaceInset
    self.surfaceFloating = surfaceFloating
    self.fieldFill = fieldFill
    self.fieldHover = fieldHover
    self.fieldLine = fieldLine
    self.fieldLineHover = fieldLineHover
    self.edgeSoft = edgeSoft
    self.secondaryContainer = secondaryContainer
    self.onSecondaryContainer = onSecondaryContainer
    self.tertiaryContainer = tertiaryContainer
    self.onTertiaryContainer = onTertiaryContainer
  }
  public func toMap() -> [String:Color] { ["canvas": canvas, "surface": surface, "raised": raised, "ink": ink, "muted": muted, "border": border, "control": control, "primary": primary, "on-primary": onPrimary, "primary-soft": primarySoft, "sun": sun, "on-sun": onSun, "sky": sky, "on-sky": onSky, "success": success, "success-soft": successSoft, "warning": warning, "warning-soft": warningSoft, "danger": danger, "danger-soft": dangerSoft, "on-danger": onDanger, "info": info, "info-soft": infoSoft, "focus": focus, "surface-navigation": surfaceNavigation, "on-navigation": onNavigation, "navigation-muted": navigationMuted, "navigation-active": navigationActive, "on-navigation-active": onNavigationActive, "surface-topbar": surfaceTopbar, "on-topbar": onTopbar, "on-topbar-muted": onTopbarMuted, "topbar-control": topbarControl, "surface-group": surfaceGroup, "surface-inset": surfaceInset, "surface-floating": surfaceFloating, "field-fill": fieldFill, "field-hover": fieldHover, "field-line": fieldLine, "field-line-hover": fieldLineHover, "edge-soft": edgeSoft, "secondary-container": secondaryContainer, "on-secondary-container": onSecondaryContainer, "tertiary-container": tertiaryContainer, "on-tertiary-container": onTertiaryContainer] }
}
public enum RosemaryTokens {
  public static let sdkVersion = "0.5.0"
  public static let specVersion = "1.3.0"
  public static let light = RosemaryColors(
    canvas: Color(.sRGB, red: 254/255.0, green: 247/255.0, blue: 252/255.0, opacity: 1),
    surface: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    raised: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    ink: Color(.sRGB, red: 29/255.0, green: 27/255.0, blue: 30/255.0, opacity: 1),
    muted: Color(.sRGB, red: 73/255.0, green: 70/255.0, blue: 73/255.0, opacity: 1),
    border: Color(.sRGB, red: 208/255.0, green: 202/255.0, blue: 207/255.0, opacity: 1),
    control: Color(.sRGB, red: 109/255.0, green: 105/255.0, blue: 109/255.0, opacity: 1),
    primary: Color(.sRGB, red: 106/255.0, green: 78/255.0, blue: 129/255.0, opacity: 1),
    onPrimary: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    primarySoft: Color(.sRGB, red: 246/255.0, green: 234/255.0, blue: 249/255.0, opacity: 1),
    sun: Color(.sRGB, red: 255/255.0, green: 234/255.0, blue: 222/255.0, opacity: 1),
    onSun: Color(.sRGB, red: 75/255.0, green: 39/255.0, blue: 12/255.0, opacity: 1),
    sky: Color(.sRGB, red: 255/255.0, green: 232/255.0, blue: 246/255.0, opacity: 1),
    onSky: Color(.sRGB, red: 63/255.0, green: 42/255.0, blue: 58/255.0, opacity: 1),
    success: Color(.sRGB, red: 35/255.0, green: 93/255.0, blue: 55/255.0, opacity: 1),
    successSoft: Color(.sRGB, red: 238/255.0, green: 246/255.0, blue: 235/255.0, opacity: 1),
    warning: Color(.sRGB, red: 101/255.0, green: 73/255.0, blue: 0/255.0, opacity: 1),
    warningSoft: Color(.sRGB, red: 255/255.0, green: 242/255.0, blue: 224/255.0, opacity: 1),
    danger: Color(.sRGB, red: 151/255.0, green: 44/255.0, blue: 37/255.0, opacity: 1),
    dangerSoft: Color(.sRGB, red: 255/255.0, green: 240/255.0, blue: 238/255.0, opacity: 1),
    onDanger: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    info: Color(.sRGB, red: 27/255.0, green: 87/255.0, blue: 126/255.0, opacity: 1),
    infoSoft: Color(.sRGB, red: 239/255.0, green: 244/255.0, blue: 252/255.0, opacity: 1),
    focus: Color(.sRGB, red: 86/255.0, green: 59/255.0, blue: 109/255.0, opacity: 1),
    surfaceNavigation: Color(.sRGB, red: 239/255.0, green: 229/255.0, blue: 240/255.0, opacity: 1),
    onNavigation: Color(.sRGB, red: 52/255.0, green: 46/255.0, blue: 55/255.0, opacity: 1),
    navigationMuted: Color(.sRGB, red: 75/255.0, green: 69/255.0, blue: 77/255.0, opacity: 1),
    navigationActive: Color(.sRGB, red: 120/255.0, green: 93/255.0, blue: 142/255.0, opacity: 1),
    onNavigationActive: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    surfaceTopbar: Color(.sRGB, red: 253/255.0, green: 240/255.0, blue: 247/255.0, opacity: 1),
    onTopbar: Color(.sRGB, red: 53/255.0, green: 46/255.0, blue: 51/255.0, opacity: 1),
    onTopbarMuted: Color(.sRGB, red: 76/255.0, green: 69/255.0, blue: 74/255.0, opacity: 1),
    topbarControl: Color(.sRGB, red: 238/255.0, green: 226/255.0, blue: 233/255.0, opacity: 1),
    surfaceGroup: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    surfaceInset: Color(.sRGB, red: 246/255.0, green: 239/255.0, blue: 243/255.0, opacity: 1),
    surfaceFloating: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    fieldFill: Color(.sRGB, red: 243/255.0, green: 236/255.0, blue: 241/255.0, opacity: 1),
    fieldHover: Color(.sRGB, red: 237/255.0, green: 230/255.0, blue: 235/255.0, opacity: 1),
    fieldLine: Color(.sRGB, red: 109/255.0, green: 105/255.0, blue: 109/255.0, opacity: 1),
    fieldLineHover: Color(.sRGB, red: 92/255.0, green: 88/255.0, blue: 92/255.0, opacity: 1),
    edgeSoft: Color(.sRGB, red: 217/255.0, green: 211/255.0, blue: 215/255.0, opacity: 1),
    secondaryContainer: Color(.sRGB, red: 255/255.0, green: 232/255.0, blue: 246/255.0, opacity: 1),
    onSecondaryContainer: Color(.sRGB, red: 63/255.0, green: 42/255.0, blue: 58/255.0, opacity: 1),
    tertiaryContainer: Color(.sRGB, red: 255/255.0, green: 234/255.0, blue: 222/255.0, opacity: 1),
    onTertiaryContainer: Color(.sRGB, red: 75/255.0, green: 39/255.0, blue: 12/255.0, opacity: 1)
  )
  public static let dark = RosemaryColors(
    canvas: Color(.sRGB, red: 33/255.0, green: 31/255.0, blue: 34/255.0, opacity: 1),
    surface: Color(.sRGB, red: 46/255.0, green: 43/255.0, blue: 47/255.0, opacity: 1),
    raised: Color(.sRGB, red: 59/255.0, green: 56/255.0, blue: 60/255.0, opacity: 1),
    ink: Color(.sRGB, red: 246/255.0, green: 239/255.0, blue: 243/255.0, opacity: 1),
    muted: Color(.sRGB, red: 197/255.0, green: 191/255.0, blue: 196/255.0, opacity: 1),
    border: Color(.sRGB, red: 90/255.0, green: 86/255.0, blue: 90/255.0, opacity: 1),
    control: Color(.sRGB, red: 175/255.0, green: 170/255.0, blue: 174/255.0, opacity: 1),
    primary: Color(.sRGB, red: 220/255.0, green: 185/255.0, blue: 245/255.0, opacity: 1),
    onPrimary: Color(.sRGB, red: 58/255.0, green: 32/255.0, blue: 80/255.0, opacity: 1),
    primarySoft: Color(.sRGB, red: 64/255.0, green: 57/255.0, blue: 68/255.0, opacity: 1),
    sun: Color(.sRGB, red: 74/255.0, green: 55/255.0, blue: 43/255.0, opacity: 1),
    onSun: Color(.sRGB, red: 255/255.0, green: 220/255.0, blue: 199/255.0, opacity: 1),
    sky: Color(.sRGB, red: 70/255.0, green: 55/255.0, blue: 66/255.0, opacity: 1),
    onSky: Color(.sRGB, red: 250/255.0, green: 217/255.0, blue: 240/255.0, opacity: 1),
    success: Color(.sRGB, red: 151/255.0, green: 213/255.0, blue: 165/255.0, opacity: 1),
    successSoft: Color(.sRGB, red: 47/255.0, green: 55/255.0, blue: 48/255.0, opacity: 1),
    warning: Color(.sRGB, red: 243/255.0, green: 198/255.0, blue: 102/255.0, opacity: 1),
    warningSoft: Color(.sRGB, red: 59/255.0, green: 52/255.0, blue: 40/255.0, opacity: 1),
    danger: Color(.sRGB, red: 255/255.0, green: 180/255.0, blue: 171/255.0, opacity: 1),
    dangerSoft: Color(.sRGB, red: 64/255.0, green: 49/255.0, blue: 48/255.0, opacity: 1),
    onDanger: Color(.sRGB, red: 84/255.0, green: 0/255.0, blue: 3/255.0, opacity: 1),
    info: Color(.sRGB, red: 152/255.0, green: 204/255.0, blue: 249/255.0, opacity: 1),
    infoSoft: Color(.sRGB, red: 48/255.0, green: 53/255.0, blue: 59/255.0, opacity: 1),
    focus: Color(.sRGB, red: 238/255.0, green: 211/255.0, blue: 255/255.0, opacity: 1),
    surfaceNavigation: Color(.sRGB, red: 24/255.0, green: 20/255.0, blue: 27/255.0, opacity: 1),
    onNavigation: Color(.sRGB, red: 239/255.0, green: 229/255.0, blue: 240/255.0, opacity: 1),
    navigationMuted: Color(.sRGB, red: 199/255.0, green: 190/255.0, blue: 201/255.0, opacity: 1),
    navigationActive: Color(.sRGB, red: 120/255.0, green: 93/255.0, blue: 142/255.0, opacity: 1),
    onNavigationActive: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    surfaceTopbar: Color(.sRGB, red: 32/255.0, green: 26/255.0, blue: 30/255.0, opacity: 1),
    onTopbar: Color(.sRGB, red: 241/255.0, green: 229/255.0, blue: 235/255.0, opacity: 1),
    onTopbarMuted: Color(.sRGB, red: 201/255.0, green: 190/255.0, blue: 196/255.0, opacity: 1),
    topbarControl: Color(.sRGB, red: 53/255.0, green: 46/255.0, blue: 51/255.0, opacity: 1),
    surfaceGroup: Color(.sRGB, red: 46/255.0, green: 43/255.0, blue: 47/255.0, opacity: 1),
    surfaceInset: Color(.sRGB, red: 50/255.0, green: 47/255.0, blue: 51/255.0, opacity: 1),
    surfaceFloating: Color(.sRGB, red: 59/255.0, green: 56/255.0, blue: 60/255.0, opacity: 1),
    fieldFill: Color(.sRGB, red: 55/255.0, green: 52/255.0, blue: 55/255.0, opacity: 1),
    fieldHover: Color(.sRGB, red: 62/255.0, green: 58/255.0, blue: 62/255.0, opacity: 1),
    fieldLine: Color(.sRGB, red: 175/255.0, green: 170/255.0, blue: 174/255.0, opacity: 1),
    fieldLineHover: Color(.sRGB, red: 197/255.0, green: 191/255.0, blue: 196/255.0, opacity: 1),
    edgeSoft: Color(.sRGB, red: 87/255.0, green: 84/255.0, blue: 88/255.0, opacity: 1),
    secondaryContainer: Color(.sRGB, red: 70/255.0, green: 55/255.0, blue: 66/255.0, opacity: 1),
    onSecondaryContainer: Color(.sRGB, red: 250/255.0, green: 217/255.0, blue: 240/255.0, opacity: 1),
    tertiaryContainer: Color(.sRGB, red: 74/255.0, green: 55/255.0, blue: 43/255.0, opacity: 1),
    onTertiaryContainer: Color(.sRGB, red: 255/255.0, green: 220/255.0, blue: 199/255.0, opacity: 1)
  )
  public static let contentMax: CGFloat = 1480
  public static let gridGap: CGFloat = 24
  public static let compactGridGap: CGFloat = 16
  public static let shellHeight: CGFloat = 76
  public static let headerIconSize: CGFloat = 20
  public static let controlRadius: CGFloat = 8
  public static let contentRadius: CGFloat = 12
  public static let dialogRadius: CGFloat = 20
  public static let touchTarget: CGFloat = 44
  public static let buttonSmallHeight: CGFloat = 32
  public static let buttonMediumHeight: CGFloat = 40
  public static let buttonLargeHeight: CGFloat = 48
  public static let drawerEnterMs: Double = 220
  public static let drawerExitMs: Double = 180
  public static let tabsMs: Double = 180
  public static let loadingCycleMs: Double = 1200
  public static let progressMs: Double = 320
  public static let radius: [String:CGFloat] = ["control": 8, "content": 12, "dialog": 20, "pill": 999]
  public static let motion = RosemaryMotion(durations: ["instantFeedback": 120, "state": 180, "transition": 260, "exit": 160, "layout": 240, "confirmation": 220, "restoration": 480, "page": 220, "drawerEnterMs": 220, "drawerExitMs": 180, "tabsMs": 180, "loadingCycleMs": 1200, "progressMs": 320, "progressFlowMs": 1800, "skeletonCycleMs": 1500], easing: "cubic-bezier(0.2, 0.7, 0.2, 1)")
  public static let typography = RosemaryTypography(families: ["ui": "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif", "editorial": "Songti SC, STSong, Noto Serif CJK SC, Georgia, serif", "latinEditorial": "Georgia, Times New Roman, serif", "code": "SFMono-Regular, Consolas, Liberation Mono, monospace"], roles: ["caption": RosemaryTypeRole(family: "ui", fontSize: 12, lineHeight: 1.5, weight: 400), "small": RosemaryTypeRole(family: "ui", fontSize: 14, lineHeight: 1.75, weight: 400), "body": RosemaryTypeRole(family: "ui", fontSize: 16, lineHeight: 1.75, weight: 400), "lead": RosemaryTypeRole(family: "ui", fontSize: 20, lineHeight: 1.75, weight: 400), "heading": RosemaryTypeRole(family: "editorial", fontSize: 28, lineHeight: 1.3, weight: 400), "title": RosemaryTypeRole(family: "editorial", fontSize: 40, lineHeight: 1.3, weight: 400), "display": RosemaryTypeRole(family: "editorial", fontSize: 64, lineHeight: 1.3, weight: 400)], lineHeights: ["body": 1.75, "compact": 1.5, "heading": 1.3], weights: ["regular": 400, "medium": 500, "semibold": 600])
  public static let componentTokens: [String:RosemaryComponentToken] = ["button": RosemaryComponentToken(foreground: "on-primary", background: "primary", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "heightSmall": 32, "heightMedium": 40, "heightLarge": 48, "paddingInline": 16], behavior: [:], flags: [:], sizes: []), "link": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "iconButton": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "input": RosemaryComponentToken(foreground: "ink", background: "field-fill", focus: "focus", border: "field-line", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "textarea": RosemaryComponentToken(foreground: "ink", background: "field-fill", focus: "focus", border: "field-line", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "select": RosemaryComponentToken(foreground: "ink", background: "field-fill", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "search": RosemaryComponentToken(foreground: "ink", background: "field-fill", focus: "focus", border: "field-line", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "checkbox": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "radio": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "switch": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "slider": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "date": RosemaryComponentToken(foreground: "ink", background: "field-fill", focus: "focus", border: "field-line", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "upload": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "tabs": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "indicatorMs": 180, "contentMs": 180], behavior: [:], flags: [:], sizes: []), "breadcrumb": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "pagination": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "menu": RosemaryComponentToken(foreground: "ink", background: "surface-floating", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "tooltip": RosemaryComponentToken(foreground: "ink", background: "surface-floating", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "popover": RosemaryComponentToken(foreground: "ink", background: "surface-floating", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "dialog": RosemaryComponentToken(foreground: "ink", background: "surface-floating", focus: "focus", border: "control", radiusRole: "dialog", radius: 20, dimensions: ["minTouchTarget": 44, "enterMs": 260, "exitMs": 160], behavior: ["completion": "animation-finished"], flags: ["interruptible": true], sizes: []), "drawer": RosemaryComponentToken(foreground: "ink", background: "surface-floating", focus: "focus", border: "control", radiusRole: "dialog", radius: 20, dimensions: ["minTouchTarget": 44, "enterMs": 220, "exitMs": 180], behavior: ["completion": "animation-finished"], flags: ["interruptible": true], sizes: []), "toast": RosemaryComponentToken(foreground: "ink", background: "surface-floating", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "alert": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "card": RosemaryComponentToken(foreground: "ink", background: "surface-group", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "list": RosemaryComponentToken(foreground: "ink", background: "surface-group", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "table": RosemaryComponentToken(foreground: "ink", background: "surface-group", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "badge": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "avatar": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "empty": RosemaryComponentToken(foreground: "ink", background: "surface-group", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "skeleton": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "loading": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "cycleMs": 1200, "appearanceDelayMs": 300], behavior: ["reducedMotion": "static", "shape": "two-fold-long-axis"], flags: [:], sizes: [17, 32, 48]), "progress": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "transitionMs": 320], behavior: ["reducedMotion": "immediate", "valueSemantics": "actual-completed-work"], flags: [:], sizes: []), "stepper": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: [])]
  public static let spacing: [CGFloat] = [4, 8, 12, 16, 24, 32, 48, 64, 96]
  public static let contrastPairs = [RosemaryContrastPair(foreground: "ink", background: "canvas", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "canvas", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "surface", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "surface", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "raised", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "raised", target: 4.5), RosemaryContrastPair(foreground: "primary", background: "primary-soft", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "primary-soft", target: 4.5), RosemaryContrastPair(foreground: "on-primary", background: "primary", target: 4.5), RosemaryContrastPair(foreground: "on-sun", background: "sun", target: 4.5), RosemaryContrastPair(foreground: "on-sky", background: "sky", target: 4.5), RosemaryContrastPair(foreground: "success", background: "success-soft", target: 4.5), RosemaryContrastPair(foreground: "warning", background: "warning-soft", target: 4.5), RosemaryContrastPair(foreground: "danger", background: "danger-soft", target: 4.5), RosemaryContrastPair(foreground: "on-danger", background: "danger", target: 4.5), RosemaryContrastPair(foreground: "info", background: "info-soft", target: 4.5), RosemaryContrastPair(foreground: "on-navigation", background: "surface-navigation", target: 4.5), RosemaryContrastPair(foreground: "on-navigation-active", background: "navigation-active", target: 4.5), RosemaryContrastPair(foreground: "navigation-muted", background: "surface-navigation", target: 4.5), RosemaryContrastPair(foreground: "on-topbar", background: "surface-topbar", target: 4.5), RosemaryContrastPair(foreground: "on-topbar-muted", background: "surface-topbar", target: 4.5), RosemaryContrastPair(foreground: "navigation-muted", background: "surface-topbar", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "surface-group", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "surface-group", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "surface-inset", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "surface-inset", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "surface-floating", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "surface-floating", target: 4.5), RosemaryContrastPair(foreground: "on-topbar", background: "topbar-control", target: 4.5), RosemaryContrastPair(foreground: "on-topbar-muted", background: "topbar-control", target: 4.5), RosemaryContrastPair(foreground: "primary", background: "canvas", target: 4.5), RosemaryContrastPair(foreground: "primary", background: "surface", target: 4.5), RosemaryContrastPair(foreground: "primary", background: "raised", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "field-fill", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "field-fill", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "field-hover", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "field-hover", target: 4.5), RosemaryContrastPair(foreground: "on-secondary-container", background: "secondary-container", target: 4.5), RosemaryContrastPair(foreground: "on-tertiary-container", background: "tertiary-container", target: 4.5), RosemaryContrastPair(foreground: "navigation-active", background: "surface-navigation", target: 3), RosemaryContrastPair(foreground: "control", background: "canvas", target: 3), RosemaryContrastPair(foreground: "control", background: "surface", target: 3), RosemaryContrastPair(foreground: "control", background: "raised", target: 3), RosemaryContrastPair(foreground: "field-line", background: "field-fill", target: 3), RosemaryContrastPair(foreground: "field-line", background: "canvas", target: 3), RosemaryContrastPair(foreground: "field-line", background: "surface-inset", target: 3), RosemaryContrastPair(foreground: "field-line-hover", background: "field-hover", target: 3), RosemaryContrastPair(foreground: "focus", background: "canvas", target: 3), RosemaryContrastPair(foreground: "focus", background: "raised", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface-group", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface-inset", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface-floating", target: 3), RosemaryContrastPair(foreground: "focus", background: "field-fill", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface-navigation", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface-topbar", target: 3)]
}
