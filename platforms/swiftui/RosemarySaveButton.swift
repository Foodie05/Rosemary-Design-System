import SwiftUI

// Include generated RosemaryTokens.swift in this target.
struct RosemarySaveButton: View {
  @Environment(\.colorScheme) private var scheme
  let save: () -> Void
  var body: some View {
    Button("保存更改", action: save)
      .buttonStyle(.borderedProminent)
      .tint(scheme == .dark
        ? RosemaryDarkTokens.semantic_color_accent
        : RosemaryLightTokens.semantic_color_accent)
      .accessibilityHint("保存当前文档")
  }
}
