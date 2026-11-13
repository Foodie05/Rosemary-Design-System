import SwiftUI

struct RosemaryPressStyle: ButtonStyle {
  private var p = RosemaryPalette()
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.scaleEffect(
      p.reduce ? 1 : configuration.isPressed ? RosemaryInteraction.pressScale : 1
    )
    .animation(
      p.reduce
        ? nil
        : .interpolatingSpring(
          mass: 1,
          stiffness: configuration.isPressed
            ? RosemaryInteraction.pressStiffness : RosemaryInteraction.releaseStiffness,
          damping: 2
            * (configuration.isPressed
              ? RosemaryInteraction.pressDamping : RosemaryInteraction.releaseDamping)
            * sqrt(
              configuration.isPressed
                ? RosemaryInteraction.pressStiffness : RosemaryInteraction.releaseStiffness)),
      value: configuration.isPressed)
  }
}

struct RosemaryAnimatedWidth: ViewModifier {
  private var p = RosemaryPalette()
  @State private var width: CGFloat?
  func body(content: Content) -> some View {
    content.fixedSize(horizontal: true, vertical: false)
      .background(
        GeometryReader { proxy in
          Color.clear.preference(key: RosemaryButtonWidthKey.self, value: proxy.size.width)
        }
      )
      .frame(width: width)
      .onPreferenceChange(RosemaryButtonWidthKey.self) { next in
        guard next > 0, next != width else { return }
        if width == nil || p.reduce {
          width = next
        } else {
          withAnimation(
            .timingCurve(0.2, 0.8, 0.2, 1, duration: RosemaryInteraction.layoutMs / 1000)
          ) { width = next }
        }
      }
  }
}
private struct RosemaryButtonWidthKey: PreferenceKey {
  static var defaultValue: CGFloat = 0
  static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}
