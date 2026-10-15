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
    focus: Color
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
  }
  public func toMap() -> [String:Color] { ["canvas": canvas, "surface": surface, "raised": raised, "ink": ink, "muted": muted, "border": border, "control": control, "primary": primary, "on-primary": onPrimary, "primary-soft": primarySoft, "sun": sun, "on-sun": onSun, "sky": sky, "on-sky": onSky, "success": success, "success-soft": successSoft, "warning": warning, "warning-soft": warningSoft, "danger": danger, "danger-soft": dangerSoft, "on-danger": onDanger, "info": info, "info-soft": infoSoft, "focus": focus] }
}
public enum RosemaryTokens {
  public static let sdkVersion = "0.4.1"
  public static let specVersion = "1.2.0"
  public static let light = RosemaryColors(
    canvas: Color(.sRGB, red: 248/255.0, green: 247/255.0, blue: 251/255.0, opacity: 1),
    surface: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    raised: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    ink: Color(.sRGB, red: 48/255.0, green: 43/255.0, blue: 59/255.0, opacity: 1),
    muted: Color(.sRGB, red: 112/255.0, green: 101/255.0, blue: 121/255.0, opacity: 1),
    border: Color(.sRGB, red: 222/255.0, green: 216/255.0, blue: 229/255.0, opacity: 1),
    control: Color(.sRGB, red: 141/255.0, green: 129/255.0, blue: 152/255.0, opacity: 1),
    primary: Color(.sRGB, red: 97/255.0, green: 69/255.0, blue: 120/255.0, opacity: 1),
    onPrimary: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    primarySoft: Color(.sRGB, red: 232/255.0, green: 225/255.0, blue: 240/255.0, opacity: 1),
    sun: Color(.sRGB, red: 243/255.0, green: 205/255.0, blue: 107/255.0, opacity: 1),
    onSun: Color(.sRGB, red: 81/255.0, green: 63/255.0, blue: 19/255.0, opacity: 1),
    sky: Color(.sRGB, red: 221/255.0, green: 235/255.0, blue: 246/255.0, opacity: 1),
    onSky: Color(.sRGB, red: 52/255.0, green: 81/255.0, blue: 108/255.0, opacity: 1),
    success: Color(.sRGB, red: 47/255.0, green: 105/255.0, blue: 82/255.0, opacity: 1),
    successSoft: Color(.sRGB, red: 234/255.0, green: 244/255.0, blue: 238/255.0, opacity: 1),
    warning: Color(.sRGB, red: 129/255.0, green: 83/255.0, blue: 0/255.0, opacity: 1),
    warningSoft: Color(.sRGB, red: 251/255.0, green: 240/255.0, blue: 217/255.0, opacity: 1),
    danger: Color(.sRGB, red: 165/255.0, green: 60/255.0, blue: 70/255.0, opacity: 1),
    dangerSoft: Color(.sRGB, red: 251/255.0, green: 236/255.0, blue: 238/255.0, opacity: 1),
    onDanger: Color(.sRGB, red: 255/255.0, green: 255/255.0, blue: 255/255.0, opacity: 1),
    info: Color(.sRGB, red: 49/255.0, green: 95/255.0, blue: 154/255.0, opacity: 1),
    infoSoft: Color(.sRGB, red: 234/255.0, green: 241/255.0, blue: 252/255.0, opacity: 1),
    focus: Color(.sRGB, red: 116/255.0, green: 82/255.0, blue: 145/255.0, opacity: 1)
  )
  public static let dark = RosemaryColors(
    canvas: Color(.sRGB, red: 28/255.0, green: 25/255.0, blue: 34/255.0, opacity: 1),
    surface: Color(.sRGB, red: 37/255.0, green: 33/255.0, blue: 45/255.0, opacity: 1),
    raised: Color(.sRGB, red: 48/255.0, green: 42/255.0, blue: 57/255.0, opacity: 1),
    ink: Color(.sRGB, red: 240/255.0, green: 234/255.0, blue: 246/255.0, opacity: 1),
    muted: Color(.sRGB, red: 185/255.0, green: 174/255.0, blue: 198/255.0, opacity: 1),
    border: Color(.sRGB, red: 67/255.0, green: 57/255.0, blue: 79/255.0, opacity: 1),
    control: Color(.sRGB, red: 148/255.0, green: 133/255.0, blue: 159/255.0, opacity: 1),
    primary: Color(.sRGB, red: 205/255.0, green: 181/255.0, blue: 234/255.0, opacity: 1),
    onPrimary: Color(.sRGB, red: 45/255.0, green: 32/255.0, blue: 56/255.0, opacity: 1),
    primarySoft: Color(.sRGB, red: 60/255.0, green: 47/255.0, blue: 76/255.0, opacity: 1),
    sun: Color(.sRGB, red: 228/255.0, green: 193/255.0, blue: 107/255.0, opacity: 1),
    onSun: Color(.sRGB, red: 62/255.0, green: 48/255.0, blue: 16/255.0, opacity: 1),
    sky: Color(.sRGB, red: 43/255.0, green: 66/255.0, blue: 86/255.0, opacity: 1),
    onSky: Color(.sRGB, red: 217/255.0, green: 235/255.0, blue: 251/255.0, opacity: 1),
    success: Color(.sRGB, red: 157/255.0, green: 213/255.0, blue: 181/255.0, opacity: 1),
    successSoft: Color(.sRGB, red: 33/255.0, green: 61/255.0, blue: 48/255.0, opacity: 1),
    warning: Color(.sRGB, red: 235/255.0, green: 201/255.0, blue: 124/255.0, opacity: 1),
    warningSoft: Color(.sRGB, red: 68/255.0, green: 55/255.0, blue: 28/255.0, opacity: 1),
    danger: Color(.sRGB, red: 241/255.0, green: 173/255.0, blue: 182/255.0, opacity: 1),
    dangerSoft: Color(.sRGB, red: 69/255.0, green: 40/255.0, blue: 48/255.0, opacity: 1),
    onDanger: Color(.sRGB, red: 48/255.0, green: 23/255.0, blue: 29/255.0, opacity: 1),
    info: Color(.sRGB, red: 170/255.0, green: 201/255.0, blue: 239/255.0, opacity: 1),
    infoSoft: Color(.sRGB, red: 37/255.0, green: 59/255.0, blue: 87/255.0, opacity: 1),
    focus: Color(.sRGB, red: 205/255.0, green: 181/255.0, blue: 234/255.0, opacity: 1)
  )
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
  public static let componentTokens: [String:RosemaryComponentToken] = ["button": RosemaryComponentToken(foreground: "on-primary", background: "primary", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "heightSmall": 32, "heightMedium": 40, "heightLarge": 48, "paddingInline": 16], behavior: [:], flags: [:], sizes: []), "link": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "iconButton": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "input": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "textarea": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "select": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "search": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "checkbox": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "radio": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "switch": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "slider": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "date": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "minHeight": 44], behavior: [:], flags: [:], sizes: []), "upload": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "tabs": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "indicatorMs": 180, "contentMs": 180], behavior: [:], flags: [:], sizes: []), "breadcrumb": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "pagination": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "menu": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "tooltip": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "popover": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "dialog": RosemaryComponentToken(foreground: "ink", background: "raised", focus: "focus", border: "control", radiusRole: "dialog", radius: 20, dimensions: ["minTouchTarget": 44, "enterMs": 260, "exitMs": 160], behavior: ["completion": "animation-finished"], flags: ["interruptible": true], sizes: []), "drawer": RosemaryComponentToken(foreground: "ink", background: "raised", focus: "focus", border: "control", radiusRole: "dialog", radius: 20, dimensions: ["minTouchTarget": 44, "enterMs": 220, "exitMs": 180], behavior: ["completion": "animation-finished"], flags: ["interruptible": true], sizes: []), "toast": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "alert": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "card": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "list": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "table": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "badge": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "avatar": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "empty": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "skeleton": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "border", radiusRole: "content", radius: 12, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: []), "loading": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "cycleMs": 1200, "appearanceDelayMs": 300], behavior: ["reducedMotion": "static", "shape": "two-fold-long-axis"], flags: [:], sizes: [17, 32, 48]), "progress": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44, "transitionMs": 320], behavior: ["reducedMotion": "immediate", "valueSemantics": "actual-completed-work"], flags: [:], sizes: []), "stepper": RosemaryComponentToken(foreground: "ink", background: "surface", focus: "focus", border: "control", radiusRole: "control", radius: 8, dimensions: ["minTouchTarget": 44], behavior: [:], flags: [:], sizes: [])]
  public static let spacing: [CGFloat] = [4, 8, 12, 16, 24, 32, 48, 64, 96]
  public static let contrastPairs = [RosemaryContrastPair(foreground: "ink", background: "canvas", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "canvas", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "surface", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "surface", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "raised", target: 4.5), RosemaryContrastPair(foreground: "muted", background: "raised", target: 4.5), RosemaryContrastPair(foreground: "on-primary", background: "primary", target: 4.5), RosemaryContrastPair(foreground: "primary", background: "primary-soft", target: 4.5), RosemaryContrastPair(foreground: "ink", background: "primary-soft", target: 4.5), RosemaryContrastPair(foreground: "on-sun", background: "sun", target: 4.5), RosemaryContrastPair(foreground: "on-sky", background: "sky", target: 4.5), RosemaryContrastPair(foreground: "success", background: "success-soft", target: 4.5), RosemaryContrastPair(foreground: "warning", background: "warning-soft", target: 4.5), RosemaryContrastPair(foreground: "danger", background: "danger-soft", target: 4.5), RosemaryContrastPair(foreground: "info", background: "info-soft", target: 4.5), RosemaryContrastPair(foreground: "on-danger", background: "danger", target: 4.5), RosemaryContrastPair(foreground: "control", background: "canvas", target: 3), RosemaryContrastPair(foreground: "control", background: "surface", target: 3), RosemaryContrastPair(foreground: "control", background: "raised", target: 3), RosemaryContrastPair(foreground: "focus", background: "canvas", target: 3), RosemaryContrastPair(foreground: "focus", background: "surface", target: 3), RosemaryContrastPair(foreground: "focus", background: "raised", target: 3)]
}
