import SwiftUI

public struct RosemaryFieldRequirement: Identifiable {
  public let id: String
  public let label: String
  public let check: (String) -> Bool
  public init(_ id: String, label: String, check: @escaping (String) -> Bool) {
    self.id = id
    self.label = label
    self.check = check
  }
  public static func password(locale: String = "en") -> [Self] {
    let labels =
      locale.hasPrefix("zh")
      ? RosemaryPasswordPolicy.requirements
      : [
        "8–32 characters", "Only English letters, digits and ASCII punctuation; no spaces",
        "At least two of: letters, digits, punctuation",
      ]
    return [
      Self("length", label: labels[0]) { RosemaryPasswordPolicy.check($0).length },
      Self("characters", label: labels[1]) { RosemaryPasswordPolicy.check($0).characters },
      Self("categories", label: labels[2]) { RosemaryPasswordPolicy.check($0).categories },
    ]
  }
}
public struct RosemaryFieldValidationState: Equatable {
  public private(set) var armed = false
  private var hadFocus = false
  public init() {}
  public mutating func focus() { hadFocus = true }
  public mutating func edit(_ value: String) { if value.isEmpty { armed = false } }
  public mutating func blur(_ value: String, isComposing: Bool = false) {
    if value.isEmpty { armed = false } else if hadFocus && !isComposing { armed = true }
    hadFocus = false
  }
}
struct RosemaryFieldRequirements: View {
  private var p = RosemaryPalette()
  let value: String
  let rules: [RosemaryFieldRequirement]
  let active: Bool
  var body: some View {
    VStack(alignment: .leading, spacing: 5) {
      ForEach(rules) { rule in
        let pass = rule.check(value)
        HStack(alignment: .top, spacing: 7) {
          if active {
            RosemaryIcon(pass ? "check" : "close", size: 16).accessibilityLabel(
              pass ? p.text("Checked") : p.text("Error"))
          } else {
            Color.clear.frame(width: 16, height: 16).accessibilityHidden(true)
          }
          Text(rule.label).font(.system(size: 14)).fixedSize(horizontal: false, vertical: true)
        }.foregroundStyle(active && !pass ? p.colors.danger : p.colors.muted)
          .accessibilityElement(children: .ignore)
          .accessibilityLabel(rule.label)
          .accessibilityValue(
            p.text(active ? (pass ? "Requirement met" : "Requirement not met") : "Not checked"))
      }
    }
  }
}
