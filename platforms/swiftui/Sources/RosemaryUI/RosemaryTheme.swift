import SwiftUI

public struct RosemaryTheme {
  public let canvas, surface, ink, accent, onAccent, border, danger: Color
  public init(scheme: ColorScheme) {
    let dark = scheme == .dark
    canvas =
      dark ? RosemaryDarkTokens.semantic_color_canvas : RosemaryLightTokens.semantic_color_canvas
    surface =
      dark ? RosemaryDarkTokens.semantic_color_surface : RosemaryLightTokens.semantic_color_surface
    ink = dark ? RosemaryDarkTokens.semantic_color_text : RosemaryLightTokens.semantic_color_text
    accent =
      dark ? RosemaryDarkTokens.semantic_color_accent : RosemaryLightTokens.semantic_color_accent
    onAccent =
      dark
      ? RosemaryDarkTokens.semantic_color_on_accent : RosemaryLightTokens.semantic_color_on_accent
    border =
      dark
      ? RosemaryDarkTokens.semantic_color_border_control
      : RosemaryLightTokens.semantic_color_border_control
    danger =
      dark ? RosemaryDarkTokens.semantic_color_danger : RosemaryLightTokens.semantic_color_danger
  }
}
public struct RosemaryThemeModifier: ViewModifier {
  @Environment(\.colorScheme) private var scheme
  public func body(content: Content) -> some View {
    content.tint(RosemaryTheme(scheme: scheme).accent).foregroundColor(
      RosemaryTheme(scheme: scheme).ink
    ).background(RosemaryTheme(scheme: scheme).canvas)
  }
}
extension View { public func rosemaryTheme() -> some View { modifier(RosemaryThemeModifier()) } }

extension View {
  @ViewBuilder func rosemaryNavigationStyle() -> some View {
    #if os(iOS)
      navigationViewStyle(.stack)
    #else
      self
    #endif
  }
}
