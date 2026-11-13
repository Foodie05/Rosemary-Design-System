import SwiftUI

private struct FieldEdge: Shape {
  var origin: CGFloat
  let index: Int
  var radius: CGFloat
  func path(in rect: CGRect) -> Path {
    let w = max(0, rect.width - 1.5)
    let h = max(0, rect.height - 1.5)
    let r = min(max(0, radius - 0.75), min(w, h) / 2)
    let x = min(max(origin * rect.width - 0.75, r), w - r)
    var p = Path()
    if index == 0 {
      p.move(to: .init(x: x, y: 0))
      p.addLine(to: .init(x: w - r, y: 0))
      p.addQuadCurve(to: .init(x: w, y: r), control: .init(x: w, y: 0))
      p.addLine(to: .init(x: w, y: h - r))
      p.addQuadCurve(to: .init(x: w - r, y: h), control: .init(x: w, y: h))
      p.addLine(to: .init(x: x, y: h))
    } else if index == 1 {
      p.move(to: .init(x: x, y: h))
      p.addLine(to: .init(x: w - r, y: h))
      p.addQuadCurve(to: .init(x: w, y: h - r), control: .init(x: w, y: h))
      p.addLine(to: .init(x: w, y: r))
      p.addQuadCurve(to: .init(x: w - r, y: 0), control: .init(x: w, y: 0))
      p.addLine(to: .init(x: x, y: 0))
    } else if index == 2 {
      p.move(to: .init(x: x, y: 0))
      p.addLine(to: .init(x: r, y: 0))
      p.addQuadCurve(to: .init(x: 0, y: r), control: .zero)
      p.addLine(to: .init(x: 0, y: h - r))
      p.addQuadCurve(to: .init(x: r, y: h), control: .init(x: 0, y: h))
      p.addLine(to: .init(x: x, y: h))
    } else {
      p.move(to: .init(x: x, y: h))
      p.addLine(to: .init(x: r, y: h))
      p.addQuadCurve(to: .init(x: 0, y: h - r), control: .init(x: 0, y: h))
      p.addLine(to: .init(x: 0, y: r))
      p.addQuadCurve(to: .init(x: r, y: 0), control: .zero)
      p.addLine(to: .init(x: x, y: 0))
    }
    return p.offsetBy(dx: 0.75, dy: 0.75)
  }
}
struct RosemaryFieldOutline: ViewModifier {
  private var p = RosemaryPalette()
  let invalid: Bool
  let focused: Bool
  let editable: Bool
  init(invalid: Bool, focused: Bool, editable: Bool) {
    self.invalid = invalid
    self.focused = focused
    self.editable = editable
  }
  @State private var origin: CGFloat = 0.5
  @State private var progress: CGFloat = 0
  @State private var pointerPending = false
  func body(content: Content) -> some View {
    content.overlay {
      GeometryReader { geometry in
        ZStack {
          ForEach(0..<4) { index in
            FieldEdge(origin: origin, index: index, radius: RosemaryNativeMetrics.radius("input"))
              .trim(from: 0, to: (invalid || p.stroke > 1 ? 1 : progress) * 0.501)
              .stroke(
                invalid ? p.colors.danger : focused ? p.colors.focus : p.colors.control,
                lineWidth: RosemaryInteraction.fieldWidth)
          }
        }.opacity(invalid || focused || p.stroke > 1 ? 1 : 0)
          .animation(
            p.reduce ? nil : .easeOut(duration: RosemaryInteraction.fieldExitMs / 1000),
            value: focused
          )
          .allowsHitTesting(false).accessibilityHidden(true)
          .onChange(of: focused) { _, value in
            if value {
              if !pointerPending { origin = 0.5 }
              pointerPending = false
              progress = p.reduce ? 1 : 0
              if !p.reduce {
                withAnimation(
                  .timingCurve(0.2, 0.7, 0.2, 1, duration: RosemaryInteraction.fieldEnterMs / 1000)
                ) { progress = 1 }
              }
            }
          }
          .onAppear { progress = focused ? 1 : 0 }
          .onChange(of: p.reduce) { _, reduce in if reduce { progress = 1 } }
          .preference(key: FieldWidthKey.self, value: geometry.size.width)
      }
    }
    .simultaneousGesture(
      DragGesture(minimumDistance: 0).onChanged { event in
        // A simultaneous gesture preserves the native text-selection recognizer.
        if !pointerPending {
          origin = min(max(event.startLocation.x / max(1, fieldWidth), 0), 1)
          pointerPending = true
        }
      }.onEnded { _ in pointerPending = false }
    )
    .onPreferenceChange(FieldWidthKey.self) { fieldWidth = $0 }
  }
  @State private var fieldWidth: CGFloat = 1
}
private struct FieldWidthKey: PreferenceKey {
  static var defaultValue: CGFloat = 1
  static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}
