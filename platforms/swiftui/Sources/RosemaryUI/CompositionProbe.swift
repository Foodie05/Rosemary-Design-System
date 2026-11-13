import SwiftUI

#if canImport(UIKit)
  import UIKit
  struct RosemaryCompositionProbe: UIViewRepresentable {
    let changed: (Bool) -> Void
    func makeUIView(context: Context) -> Probe {
      let view = Probe()
      view.changed = changed
      view.isUserInteractionEnabled = false
      return view
    }
    func updateUIView(_ view: Probe, context: Context) { view.changed = changed }
    final class Probe: UIView {
      var changed: ((Bool) -> Void)?
      private var tokens: [NSObjectProtocol] = []
      override init(frame: CGRect) {
        super.init(frame: frame)
        for name in [
          UITextField.textDidChangeNotification, UITextView.textDidChangeNotification,
          UITextField.textDidEndEditingNotification, UITextView.textDidEndEditingNotification,
        ] {
          tokens.append(
            NotificationCenter.default.addObserver(forName: name, object: nil, queue: .main) {
              [weak self] note in
              guard let self, let input = note.object as? UIView, let window = self.window,
                input.window === window
              else { return }
              let field = input.convert(input.bounds, to: window)
              let own = self.convert(self.bounds, to: window)
              guard own.intersects(field), own.contains(CGPoint(x: field.midX, y: field.midY))
              else { return }
              self.changed?((input as? UITextInput)?.markedTextRange != nil)
            })
        }
      }
      required init?(coder: NSCoder) { fatalError("init(coder:) is unavailable") }
      deinit { tokens.forEach(NotificationCenter.default.removeObserver) }
    }
  }
#elseif canImport(AppKit)
  import AppKit
  struct RosemaryCompositionProbe: NSViewRepresentable {
    let changed: (Bool) -> Void
    func makeNSView(context: Context) -> Probe {
      let view = Probe()
      view.changed = changed
      return view
    }
    func updateNSView(_ view: Probe, context: Context) { view.changed = changed }
    final class Probe: NSView {
      var changed: ((Bool) -> Void)?
      private var tokens: [NSObjectProtocol] = []
      override init(frame: NSRect) {
        super.init(frame: frame)
        for name in [NSText.didChangeNotification, NSText.didEndEditingNotification] {
          tokens.append(
            NotificationCenter.default.addObserver(forName: name, object: nil, queue: .main) {
              [weak self] note in
              guard let self, let input = note.object as? NSTextView, let window = self.window,
                input.window === window
              else { return }
              let field = input.convert(input.bounds, to: nil)
              let own = self.convert(self.bounds, to: nil)
              guard own.intersects(field) else { return }
              self.changed?(input.hasMarkedText())
            })
        }
      }
      override func hitTest(_ point: NSPoint) -> NSView? { nil }
      required init?(coder: NSCoder) { fatalError("init(coder:) is unavailable") }
      deinit { tokens.forEach(NotificationCenter.default.removeObserver) }
    }
  }
#else
  struct RosemaryCompositionProbe: View {
    let changed: (Bool) -> Void
    var body: some View { Color.clear }
  }
#endif
