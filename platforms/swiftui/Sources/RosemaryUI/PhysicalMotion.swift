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

/// Piecewise-linear interpolation of the portal's actual rounded spring table.
struct RosemaryDisclosureAnimation: CustomAnimation {
  let opening: Bool
  var duration: Double {
    (opening ? RosemaryInteraction.disclosureMs : RosemaryInteraction.disclosureExitMs) / 1000
  }
  func progress(_ fraction: Double) -> Double {
    let values = opening ? RosemaryInteraction.disclosureEnter : RosemaryInteraction.disclosureExit
    let position = min(1, max(0, fraction)) * Double(values.count - 1)
    let index = min(values.count - 2, Int(position))
    return values[index] + (values[index + 1] - values[index]) * (position - Double(index))
  }
  func animate<V: VectorArithmetic>(
    value: V, time: TimeInterval, context: inout AnimationContext<V>
  ) -> V? {
    guard time < duration else { return nil }
    return value.scaled(by: progress(time / duration))
  }
}

private struct RosemarySelectionPressedKey: EnvironmentKey {
  static let defaultValue = false
}
struct RosemarySelectionStyle: ButtonStyle {
  func makeBody(configuration: Configuration) -> some View {
    configuration.label.environment(\.rosemarySelectionPressed, configuration.isPressed)
  }
}
extension EnvironmentValues {
  fileprivate var rosemarySelectionPressed: Bool {
    get { self[RosemarySelectionPressedKey.self] }
    set { self[RosemarySelectionPressedKey.self] = newValue }
  }
}
struct RosemarySelectionMotion: ViewModifier {
  @Environment(\.rosemarySelectionPressed) private var pressed
  @Environment(\.isEnabled) private var enabled
  private var p = RosemaryPalette()
  func body(content: Content) -> some View {
    content.scaleEffect(pressed && enabled && !p.reduce ? RosemaryInteraction.selectionScale : 1)
      .animation(
        p.reduce || !enabled
          ? nil
          : .interpolatingSpring(
            mass: 1,
            stiffness: pressed
              ? RosemaryInteraction.pressStiffness : RosemaryInteraction.releaseStiffness,
            damping: 2
              * (pressed ? RosemaryInteraction.pressDamping : RosemaryInteraction.releaseDamping)
              * sqrt(
                pressed ? RosemaryInteraction.pressStiffness : RosemaryInteraction.releaseStiffness)
          ),
        value: pressed)
  }
}
