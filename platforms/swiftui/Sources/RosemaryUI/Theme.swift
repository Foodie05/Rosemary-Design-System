import SwiftUI

#if canImport(UIKit)
  import UIKit
#elseif canImport(AppKit)
  import AppKit
#endif

public enum RosemaryThemeMode: String, CaseIterable { case light, dark, system }
public enum RosemaryThemeError: Error, Equatable {
  case invalidDocument
  case missingColor(String)
  case invalidColor(String)
  case unknownColor(String)
  case duplicateColor(String)
  case unresolvableColor(String)
  case translucentColor(String)
}
/// Import the full paired canonical recipe; native platforms do not reinterpret the seed.
public struct RosemaryColorScheme {
  public let light: RosemaryTheme
  public let dark: RosemaryTheme
  public init(light: RosemaryTheme, dark: RosemaryTheme) { self.light=light; self.dark=dark }
  public static let defaults = RosemaryColorScheme(light: .light, dark: .dark)
  public init(json: Data) throws {
    guard let document=try JSONSerialization.jsonObject(with: json) as? [String:Any],
      let modes=(document["colors"] ?? document["themes"] ?? document) as? [String:Any],
      let light=modes["light"] as? [String:String], let dark=modes["dark"] as? [String:String]
    else { throw RosemaryThemeError.invalidDocument }
    self.light=try RosemaryTheme(hex: light);self.dark=try RosemaryTheme(hex: dark)
  }
}
public struct RosemaryContrastDiagnostic: Equatable {
  public let foreground: String
  public let background: String
  public let ratio: Double
  public let required: Double
}
/// Complete semantic palette. Construction from hex rejects missing/unknown/malformed values.
public struct RosemaryTheme {
  public let colors: RosemaryColors
  public init(colors: RosemaryColors) { self.colors = colors }
  public static let light = RosemaryTheme(colors: RosemaryTokens.light)
  public static let dark = RosemaryTheme(colors: RosemaryTokens.dark)
  public static let semanticNames = ["canvas", "surface", "raised", "ink", "muted", "border", "control", "primary", "onPrimary", "primarySoft", "sun", "onSun", "sky", "onSky", "focus", "surfaceNavigation", "onNavigation", "navigationMuted", "navigationActive", "onNavigationActive", "surfaceTopbar", "onTopbar", "onTopbarMuted", "topbarControl", "surfaceGroup", "surfaceInset", "surfaceFloating", "fieldFill", "fieldHover", "fieldLine", "fieldLineHover", "edgeSoft", "secondaryContainer", "onSecondaryContainer", "tertiaryContainer", "onTertiaryContainer", "success", "successSoft", "warning", "warningSoft", "danger", "dangerSoft", "info", "infoSoft", "onDanger"]
  public init(hex input: [String: String]) throws {
    var hex: [String: String] = [:]
    for (key, value) in input {
      let role = Self.camel(key)
      guard hex[role] == nil else { throw RosemaryThemeError.duplicateColor(role) }
      hex[role] = value
    }
    for name in hex.keys where !Self.semanticNames.contains(name) {
      throw RosemaryThemeError.unknownColor(name)
    }
    var c: [String: Color] = [:]
    for name in Self.semanticNames {
      guard let value = hex[name] else { throw RosemaryThemeError.missingColor(name) }
      guard let rgb = Self.rgb(value) else { throw RosemaryThemeError.invalidColor(name) }
      c[name] = Color(.sRGB, red: rgb.0, green: rgb.1, blue: rgb.2, opacity: 1)
    }
    colors = RosemaryColors(canvas: c["canvas"]!, surface: c["surface"]!, raised: c["raised"]!, ink: c["ink"]!, muted: c["muted"]!, border: c["border"]!, control: c["control"]!, primary: c["primary"]!, onPrimary: c["onPrimary"]!, primarySoft: c["primarySoft"]!, sun: c["sun"]!, onSun: c["onSun"]!, sky: c["sky"]!, onSky: c["onSky"]!, success: c["success"]!, successSoft: c["successSoft"]!, warning: c["warning"]!, warningSoft: c["warningSoft"]!, danger: c["danger"]!, dangerSoft: c["dangerSoft"]!, onDanger: c["onDanger"]!, info: c["info"]!, infoSoft: c["infoSoft"]!, focus: c["focus"]!, surfaceNavigation: c["surfaceNavigation"]!, onNavigation: c["onNavigation"]!, navigationMuted: c["navigationMuted"]!, navigationActive: c["navigationActive"]!, onNavigationActive: c["onNavigationActive"]!, surfaceTopbar: c["surfaceTopbar"]!, onTopbar: c["onTopbar"]!, onTopbarMuted: c["onTopbarMuted"]!, topbarControl: c["topbarControl"]!, surfaceGroup: c["surfaceGroup"]!, surfaceInset: c["surfaceInset"]!, surfaceFloating: c["surfaceFloating"]!, fieldFill: c["fieldFill"]!, fieldHover: c["fieldHover"]!, fieldLine: c["fieldLine"]!, fieldLineHover: c["fieldLineHover"]!, edgeSoft: c["edgeSoft"]!, secondaryContainer: c["secondaryContainer"]!, onSecondaryContainer: c["onSecondaryContainer"]!, tertiaryContainer: c["tertiaryContainer"]!, onTertiaryContainer: c["onTertiaryContainer"]!)
  }
  public static func contrastDiagnostics(hex: [String: String]) throws
    -> [RosemaryContrastDiagnostic]
  {
    _ = try RosemaryTheme(hex: hex)
    let hex = Dictionary(uniqueKeysWithValues: hex.map { (Self.camel($0.key), $0.value) })
    return RosemaryTokens.contrastPairs.compactMap { pair in
      let f = camel(pair.foreground)
      let b = camel(pair.background)
      let a = luminance(rgb(hex[f]!)!)
      let z = luminance(rgb(hex[b]!)!)
      let ratio = (max(a, z) + 0.05) / (min(a, z) + 0.05)
      return ratio + 1e-12 < pair.target
        ? RosemaryContrastDiagnostic(
          foreground: pair.foreground, background: pair.background, ratio: ratio,
          required: pair.target) : nil
    }
  }
  /// Resolves the actual palette in the specified appearance, including host Color overrides.
  /// Opaque sRGB values are required; unsupported or translucent colors throw instead of guessing.
  public func contrastDiagnostics(colorScheme: ColorScheme) throws -> [RosemaryContrastDiagnostic] {
    var values: [String: (Double, Double, Double)] = [:]
    for (key, color) in colors.toMap() {
      var red: CGFloat = 0
      var green: CGFloat = 0
      var blue: CGFloat = 0
      var alpha: CGFloat = 0
      #if canImport(UIKit)
        let traits = UITraitCollection(userInterfaceStyle: colorScheme == .dark ? .dark : .light)
        let resolved = UIColor(color).resolvedColor(with: traits)
        guard resolved.getRed(&red, green: &green, blue: &blue, alpha: &alpha) else {
          throw RosemaryThemeError.unresolvableColor(key)
        }
      #elseif canImport(AppKit)
        var resolved: NSColor?
        guard let appearance = NSAppearance(named: colorScheme == .dark ? .darkAqua : .aqua) else {
          throw RosemaryThemeError.unresolvableColor(key)
        }
        appearance.performAsCurrentDrawingAppearance {
          resolved = NSColor(color).usingColorSpace(.sRGB)
        }
        guard let resolved else { throw RosemaryThemeError.unresolvableColor(key) }
        resolved.getRed(&red, green: &green, blue: &blue, alpha: &alpha)
      #else
        throw RosemaryThemeError.unresolvableColor(key)
      #endif
      guard [red, green, blue, alpha].allSatisfy({ $0.isFinite && $0 >= 0 && $0 <= 1 }) else {
        throw RosemaryThemeError.invalidColor(key)
      }
      guard abs(alpha - 1) < 0.000001 else { throw RosemaryThemeError.translucentColor(key) }
      values[Self.camel(key)] = (Double(red), Double(green), Double(blue))
    }
    return RosemaryTokens.contrastPairs.compactMap { pair in
      let a = Self.luminance(values[Self.camel(pair.foreground)]!)
      let b = Self.luminance(values[Self.camel(pair.background)]!)
      let ratio = (max(a, b) + 0.05) / (min(a, b) + 0.05)
      return ratio + 1e-12 < pair.target
        ? RosemaryContrastDiagnostic(
          foreground: pair.foreground, background: pair.background,
          ratio: ratio, required: pair.target) : nil
    }
  }
  static func camel(_ key: String) -> String {
    let parts = key.split(separator: "-")
    return parts.enumerated().map {
      $0.offset == 0
        ? String($0.element) : $0.element.prefix(1).uppercased() + $0.element.dropFirst()
    }.joined()
  }
  public func overriding(_ overrides: [String: Color]) throws -> RosemaryTheme {
    var c = Dictionary(uniqueKeysWithValues: colors.toMap().map { (Self.camel($0.key), $0.value) })
    var seen = Set<String>()
    for (key, value) in overrides {
      let role = Self.camel(key)
      guard seen.insert(role).inserted else { throw RosemaryThemeError.duplicateColor(role) }
      guard Self.semanticNames.contains(role) else { throw RosemaryThemeError.unknownColor(key) }
      c[role] = value
    }
    return RosemaryTheme(
      colors: RosemaryColors(canvas: c["canvas"]!, surface: c["surface"]!, raised: c["raised"]!, ink: c["ink"]!, muted: c["muted"]!, border: c["border"]!, control: c["control"]!, primary: c["primary"]!, onPrimary: c["onPrimary"]!, primarySoft: c["primarySoft"]!, sun: c["sun"]!, onSun: c["onSun"]!, sky: c["sky"]!, onSky: c["onSky"]!, success: c["success"]!, successSoft: c["successSoft"]!, warning: c["warning"]!, warningSoft: c["warningSoft"]!, danger: c["danger"]!, dangerSoft: c["dangerSoft"]!, onDanger: c["onDanger"]!, info: c["info"]!, infoSoft: c["infoSoft"]!, focus: c["focus"]!, surfaceNavigation: c["surfaceNavigation"]!, onNavigation: c["onNavigation"]!, navigationMuted: c["navigationMuted"]!, navigationActive: c["navigationActive"]!, onNavigationActive: c["onNavigationActive"]!, surfaceTopbar: c["surfaceTopbar"]!, onTopbar: c["onTopbar"]!, onTopbarMuted: c["onTopbarMuted"]!, topbarControl: c["topbarControl"]!, surfaceGroup: c["surfaceGroup"]!, surfaceInset: c["surfaceInset"]!, surfaceFloating: c["surfaceFloating"]!, fieldFill: c["fieldFill"]!, fieldHover: c["fieldHover"]!, fieldLine: c["fieldLine"]!, fieldLineHover: c["fieldLineHover"]!, edgeSoft: c["edgeSoft"]!, secondaryContainer: c["secondaryContainer"]!, onSecondaryContainer: c["onSecondaryContainer"]!, tertiaryContainer: c["tertiaryContainer"]!, onTertiaryContainer: c["onTertiaryContainer"]!))
  }

  private static func rgb(_ hex: String) -> (Double, Double, Double)? {
    guard hex.count == 7, hex.first == "#", let n = UInt32(hex.dropFirst(), radix: 16) else {
      return nil
    }
    return (Double((n >> 16) & 255) / 255, Double((n >> 8) & 255) / 255, Double(n & 255) / 255)
  }
  private static func luminance(_ rgb: (Double, Double, Double)) -> Double {
    func linear(_ n: Double) -> Double { n <= 0.04045 ? n / 12.92 : pow((n + 0.055) / 1.055, 2.4) }
    return 0.2126 * linear(rgb.0) + 0.7152 * linear(rgb.1) + 0.0722 * linear(rgb.2)
  }
}
private struct ThemeKey: EnvironmentKey { static let defaultValue: RosemaryTheme? = nil }
private struct SystemAppearanceKey: EnvironmentKey { static let defaultValue: ColorScheme? = nil }
private struct MotionKey: EnvironmentKey { static let defaultValue = false }
extension EnvironmentValues {
  fileprivate var rosemarySystemAppearance: ColorScheme? {
    get { self[SystemAppearanceKey.self] }
    set { self[SystemAppearanceKey.self] = newValue }
  }
  public var rosemaryTheme: RosemaryTheme? {
    get { self[ThemeKey.self] }
    set { self[ThemeKey.self] = newValue }
  }
  public var rosemaryReduceMotion: Bool {
    get { self[MotionKey.self] }
    set { self[MotionKey.self] = newValue }
  }
}
struct RosemaryPalette: DynamicProperty {
  @Environment(\.rosemaryStrings) var strings
  @Environment(\.locale) var locale
  @Environment(\.rosemaryTheme) var theme
  @Environment(\.colorScheme) var scheme
  @Environment(\.accessibilityReduceMotion) var systemReduce
  @Environment(\.rosemaryReduceMotion) var appReduce
  @Environment(\.colorSchemeContrast) var contrast
  var colors: RosemaryColors {
    theme?.colors ?? (scheme == .dark ? RosemaryTokens.dark : RosemaryTokens.light)
  }
  var reduce: Bool { systemReduce || appReduce }
  var stroke: CGFloat { contrast == .increased ? 2 : 1 }
}
extension View {
  public func rosemaryTheme(_ theme: RosemaryTheme) -> some View {
    environment(\.rosemaryTheme, theme)
  }
  public func rosemaryTheme(_ scheme: RosemaryColorScheme, mode: RosemaryThemeMode = .system) -> some View {
    modifier(ThemeModeModifier(mode: mode, scheme: scheme))
  }
  public func rosemaryTheme(_ mode: RosemaryThemeMode) -> some View {
    modifier(ThemeModeModifier(mode: mode))
  }
  public func rosemaryTheme(overrides: [String: Color]) throws -> some View {
    var seen = Set<String>()
    for key in overrides.keys {
      let role = RosemaryTheme.camel(key)
      guard RosemaryTheme.semanticNames.contains(role) else {
        throw RosemaryThemeError.unknownColor(key)
      }
      guard seen.insert(role).inserted else { throw RosemaryThemeError.duplicateColor(role) }
    }
    return modifier(ThemeOverrideModifier(overrides: overrides))
  }
  public func rosemaryReduceMotion(_ reduced: Bool) -> some View {
    environment(\.rosemaryReduceMotion, reduced)
  }
}
private struct ThemeModeModifier: ViewModifier {
  let mode: RosemaryThemeMode
  let scheme: RosemaryColorScheme
  @Environment(\.colorScheme) private var hostAppearance
  @Environment(\.rosemarySystemAppearance) private var inheritedSystemAppearance
  init(mode: RosemaryThemeMode, scheme: RosemaryColorScheme = .defaults) { self.mode = mode;self.scheme=scheme }
  private var systemAppearance: ColorScheme { inheritedSystemAppearance ?? hostAppearance }
  @ViewBuilder private func themed(_ content: Content) -> some View {
    switch mode {
    case .light: content.environment(\.rosemaryTheme, scheme.light).environment(\.colorScheme, .light)
    case .dark: content.environment(\.rosemaryTheme, scheme.dark).environment(\.colorScheme, .dark)
    case .system:
      content.environment(\.rosemaryTheme, systemAppearance == .dark ? scheme.dark : scheme.light).environment(\.colorScheme, systemAppearance)
    }
  }
  func body(content: Content) -> some View {
    // Preserve the appearance entering the outermost Rosemary theme. An explicit
    // local dark/light mode must not become the baseline of a nested system mode.
    themed(content).environment(\.rosemarySystemAppearance, systemAppearance)
  }
}

struct RosemaryFieldFrame: ViewModifier {
  @Environment(\.isEnabled) private var enabled
  private var p = RosemaryPalette()
  var invalid = false
  var focused = false
  var editable = true
  init(invalid: Bool = false, focused: Bool = false, editable: Bool = true) {
    self.invalid = invalid
    self.focused = focused
    self.editable = editable
  }
  func body(content: Content) -> some View {
    content.padding(12).frame(minHeight: RosemaryNativeMetrics.dimension("input", "minHeight"))
      .background(!enabled ? p.colors.canvas : invalid ? p.colors.dangerSoft : p.colors.fieldFill)
      .clipShape(RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("input")))
      .overlay(alignment: .bottom) {
        if p.stroke > 1 {
          RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("input")).stroke(invalid ? p.colors.danger : focused ? p.colors.focus : p.colors.control, lineWidth: 2)
        } else if editable {
          Rectangle().fill(invalid ? p.colors.danger : focused ? p.colors.focus : p.colors.fieldLine).frame(height: focused || invalid ? 2 : 1)
        }
      }
      .foregroundStyle(enabled ? p.colors.ink : p.colors.muted)
      .opacity(enabled ? 1 : 0.65)
  }
}

private struct ThemeOverrideModifier: ViewModifier {
  private var p = RosemaryPalette()
  let overrides: [String: Color]
  init(overrides: [String: Color]) { self.overrides = overrides }
  func body(content: Content) -> some View {
    content.environment(\.rosemaryTheme, try! RosemaryTheme(colors: p.colors).overriding(overrides))
  }
}
