import SwiftUI

#if canImport(UIKit)
  import UIKit
#elseif canImport(AppKit)
  import AppKit
#endif
public enum RosemaryTextRole: String { case caption, small, body, lead, heading, title, display }
private struct RosemaryTypographyModifier: ViewModifier {
  let role: RosemaryTextRole
  let weight: Font.Weight?
  private let token: RosemaryTypeRole
  @ScaledMetric private var size: CGFloat
  init(_ role: RosemaryTextRole, weight: Font.Weight?) {
    self.role = role
    self.weight = weight
    token = RosemaryTokens.typography.roles[role.rawValue]!
    let relative: Font.TextStyle =
      role == .caption
      ? .caption
      : role == .small
        ? .subheadline
        : role == .body ? .body : role == .lead ? .title3 : role == .heading ? .title2 : .largeTitle
    _size = ScaledMetric(wrappedValue: token.fontSize, relativeTo: relative)
  }
  func body(content: Content) -> some View {
    let w = weight ?? (token.weight >= 600 ? .semibold : token.weight >= 500 ? .medium : .regular)
    let serif = token.family == "editorial" || token.family == "latinEditorial"
    #if canImport(UIKit)
      let nativeLineHeight = UIFont.systemFont(ofSize: size).lineHeight
    #elseif canImport(AppKit)
      let nativeLineHeight =
        NSFont.systemFont(ofSize: size).ascender - NSFont.systemFont(ofSize: size).descender
        + NSFont.systemFont(ofSize: size).leading
    #else
      let nativeLineHeight = size * 1.2
    #endif
    return content.font(.system(size: size, weight: w, design: serif ? .serif : .default))
      .lineSpacing(max(0, size * token.lineHeight - nativeLineHeight))
  }
}
extension View {
  public func rosemaryTypography(_ role: RosemaryTextRole = .body, weight: Font.Weight? = nil)
    -> some View
  { modifier(RosemaryTypographyModifier(role, weight: weight)) }
}

private struct RosemaryControlTypography: ViewModifier {
  let component: String
  let label: Bool
  @ScaledMetric private var size: CGFloat
  private let lineRatio: CGFloat
  init(_ component: String, label: Bool) {
    self.component = component
    self.label = label
    let dimensions = RosemaryTokens.componentTokens[component]!.dimensions
    let points = dimensions[label ? "labelFontSize" : "fontSize"]!
    _size = ScaledMetric(wrappedValue: points, relativeTo: .body)
    lineRatio = dimensions[label ? "labelLineHeight" : "lineHeight"]! / points
  }
  func body(content: Content) -> some View {
    #if canImport(UIKit)
      let native = UIFont.systemFont(ofSize: size).lineHeight
    #elseif canImport(AppKit)
      let font = NSFont.systemFont(ofSize: size)
      let native = font.ascender - font.descender + font.leading
    #else
      let native = size * 1.2
    #endif
    return content.font(
      .system(size: size, weight: label || component == "button" ? .medium : .regular)
    )
    .lineSpacing(max(0, size * lineRatio - native))
    .frame(minHeight: size * lineRatio, alignment: .leading)
  }
}
extension View {
  func rosemaryControlTypography(_ component: String, label: Bool = false) -> some View {
    modifier(RosemaryControlTypography(component, label: label))
  }
}
