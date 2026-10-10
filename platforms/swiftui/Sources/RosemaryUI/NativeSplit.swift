import SwiftUI

#if canImport(UIKit)
  import UIKit
  struct RosemaryNativeSplit: UIViewRepresentable {
    let fraction: Double, width: Double, rtl: Bool
    let onChange: (Double) -> Void
    @Environment(\.colorScheme) private var scheme
    func makeUIView(context: Context) -> RosemarySplitControl { RosemarySplitControl() }
    func updateUIView(_ view: RosemarySplitControl, context: Context) {
      view.fraction = fraction
      view.span = width
      view.rtl = rtl
      view.onChange = onChange
      view.palette = RosemaryTheme(scheme: scheme)
      view.refresh()
    }
  }
  final class RosemarySplitControl: UIButton {
    var fraction = 0.5, span = 1.0, start = 0.5
    var rtl = false, dragging = false, pointerInside = false
    var onChange: ((Double) -> Void)?
    var palette = RosemaryTheme(scheme: .light)
    override var canBecomeFirstResponder: Bool { true }
    override init(frame: CGRect) {
      super.init(frame: frame)
      setImage(UIImage(systemName: "line.3.horizontal"), for: .normal)
      layer.cornerRadius = 8
      accessibilityLabel = "调整分栏"
      accessibilityTraits = [.adjustable]
      addGestureRecognizer(UIPanGestureRecognizer(target: self, action: #selector(pan(_:))))
      addGestureRecognizer(UIHoverGestureRecognizer(target: self, action: #selector(hover(_:))))
      addTarget(self, action: #selector(focus), for: .touchDown)
    }
    required init?(coder: NSCoder) { fatalError("init(coder:) is not supported") }
    @objc private func focus() {
      becomeFirstResponder()
      refresh()
    }
    override func becomeFirstResponder() -> Bool {
      let v = super.becomeFirstResponder()
      refresh()
      return v
    }
    override func resignFirstResponder() -> Bool {
      let v = super.resignFirstResponder()
      refresh()
      return v
    }
    override var isHighlighted: Bool { didSet { refresh() } }
    func refresh() {
      tintColor = UIColor(palette.accent)
      backgroundColor = UIColor(palette.accent).withAlphaComponent(
        dragging || isHighlighted ? 0.18 : pointerInside || isFirstResponder ? 0.1 : 0)
      layer.borderWidth = isFirstResponder ? 1 : 0
      layer.borderColor = UIColor(palette.accent).cgColor
      accessibilityValue = "\(Int(fraction*100))%"
    }
    @objc private func hover(_ g: UIHoverGestureRecognizer) {
      pointerInside = g.state != .ended && g.state != .cancelled
      refresh()
    }
    @objc private func pan(_ g: UIPanGestureRecognizer) {
      if g.state == .began {
        start = fraction
        dragging = true
        becomeFirstResponder()
      }
      if g.state == .changed {
        onChange?(
          min(
            0.8, max(0.2, start + Double(g.translation(in: self).x) / max(1, span) * (rtl ? -1 : 1))
          ))
      }
      if g.state == .ended || g.state == .cancelled { dragging = false }
      refresh()
    }
    override func accessibilityIncrement() { onChange?(min(0.8, fraction + 0.05)) }
    override func accessibilityDecrement() { onChange?(max(0.2, fraction - 0.05)) }
    override var keyCommands: [UIKeyCommand]? {
      [UIKeyCommand.inputLeftArrow, UIKeyCommand.inputRightArrow].map {
        let c = UIKeyCommand(input: $0, modifierFlags: [], action: #selector(key(_:)))
        c.wantsPriorityOverSystemBehavior = true
        return c
      }
    }
    @objc private func key(_ c: UIKeyCommand) {
      onChange?(
        min(
          0.8,
          max(
            0.2,
            fraction + (c.input == UIKeyCommand.inputRightArrow ? 0.05 : -0.05) * (rtl ? -1 : 1))))
    }
  }
#endif
