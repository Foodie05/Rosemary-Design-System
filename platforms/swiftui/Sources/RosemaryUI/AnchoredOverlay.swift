import SwiftUI

#if canImport(UIKit)
  import UIKit
#elseif canImport(AppKit)
  import AppKit
#endif

/// Placement uses the hosting window's usable viewport, rather than an arbitrary hit-test rectangle.
struct RosemaryOverlayPlacement: Equatable {
  let origin: CGPoint
  let size: CGSize
  static func resolve(
    anchor: CGRect, viewport: CGRect, preferredWidth: CGFloat, preferredHeight: CGFloat,
    rightToLeft: Bool
  ) -> Self {
    let width = min(max(0, viewport.width), max(anchor.width, preferredWidth))
    let below = max(0, viewport.maxY - anchor.maxY - 8)
    let above = max(0, anchor.minY - viewport.minY - 8)
    let down = below >= preferredHeight || below >= above
    let height = min(preferredHeight, down ? below : above)
    let x = min(
      max(rightToLeft ? anchor.maxX - width : anchor.minX, viewport.minX),
      max(viewport.minX, viewport.maxX - width))
    let y = down ? anchor.maxY + 8 : anchor.minY - height - 8
    return Self(
      origin: CGPoint(x: x - anchor.minX, y: max(viewport.minY, y) - anchor.minY),
      size: CGSize(width: width, height: height))
  }
}
struct RosemaryAnchoredLayer<Panel: View>: View {
  let preferredWidth: CGFloat
  let preferredHeight: CGFloat
  let dismissOutside: (() -> Void)?
  let panel: Panel
  @State private var viewport = CGRect.zero
  @Environment(\.layoutDirection) private var direction
  init(
    width: CGFloat = 320, height: CGFloat = 300, dismissOutside: (() -> Void)? = nil,
    @ViewBuilder panel: () -> Panel
  ) {
    preferredWidth = width
    preferredHeight = height
    self.dismissOutside = dismissOutside
    self.panel = panel()
  }
  var body: some View {
    GeometryReader { g in
      let anchor = g.frame(in: .global)
      let usable =
        viewport.isEmpty
        ? CGRect(
          x: 12, y: 12, width: max(320, anchor.maxX) - 24, height: max(600, anchor.maxY + 320) - 24)
        : viewport.insetBy(dx: 12, dy: 12)
      let placement = RosemaryOverlayPlacement.resolve(
        anchor: anchor, viewport: usable,
        preferredWidth: preferredWidth, preferredHeight: preferredHeight,
        rightToLeft: direction == .rightToLeft)
      ZStack(alignment: .topLeading) {
        if let dismissOutside {
          Color.clear.contentShape(Rectangle()).frame(width: usable.width, height: usable.height)
            .offset(x: usable.minX - anchor.minX, y: usable.minY - anchor.minY)
            .onTapGesture(perform: dismissOutside).accessibilityHidden(true)
        }
        panel.environment(\.layoutDirection, direction).frame(
          width: placement.size.width, height: placement.size.height, alignment: .topLeading
        )
        .offset(x: placement.origin.x, y: placement.origin.y)
      }
      .environment(\.layoutDirection, .leftToRight)
      .background(
        WindowViewportProbe { if viewport != $0 { viewport = $0 } }.frame(width: 0, height: 0))
    }
  }
}
#if canImport(UIKit)
  private struct WindowViewportProbe: UIViewRepresentable {
    let update: (CGRect) -> Void
    func makeUIView(context: Context) -> Probe {
      let view = Probe()
      view.update = update
      return view
    }
    func updateUIView(_ uiView: Probe, context: Context) {
      uiView.update = update
      uiView.report()
    }
    final class Probe: UIView {
      var update: ((CGRect) -> Void)?
      private var keyboardFrame: CGRect?
      override init(frame: CGRect) {
        super.init(frame: frame)
        observeKeyboard()
      }
      required init?(coder: NSCoder) {
        super.init(coder: coder)
        observeKeyboard()
      }
      deinit { NotificationCenter.default.removeObserver(self) }
      private func observeKeyboard() {
        NotificationCenter.default.addObserver(
          self, selector: #selector(keyboardChanged(_:)),
          name: UIResponder.keyboardWillChangeFrameNotification, object: nil)
        NotificationCenter.default.addObserver(
          self, selector: #selector(keyboardChanged(_:)),
          name: UIResponder.keyboardWillHideNotification, object: nil)
      }
      @objc private func keyboardChanged(_ notification: Notification) {
        keyboardFrame =
          notification.name == UIResponder.keyboardWillHideNotification
          ? nil : notification.userInfo?[UIResponder.keyboardFrameEndUserInfoKey] as? CGRect
        report()
      }
      override func didMoveToWindow() {
        super.didMoveToWindow()
        report()
      }
      override func layoutSubviews() {
        super.layoutSubviews()
        report()
      }
      func report() {
        guard let window else { return }
        var bounds = window.bounds.inset(by: window.safeAreaInsets)
        if let keyboardFrame {
          let keyboard = window.convert(keyboardFrame, from: window.screen.coordinateSpace)
          if keyboard.intersects(bounds) && keyboard.maxY >= bounds.maxY
            && keyboard.width >= bounds.width * 0.5
          {
            bounds.size.height = max(0, keyboard.minY - bounds.minY)
          }
        }
        DispatchQueue.main.async { [weak self] in self?.update?(bounds) }
      }
    }
  }
#elseif canImport(AppKit)
  private struct WindowViewportProbe: NSViewRepresentable {
    let update: (CGRect) -> Void
    func makeNSView(context: Context) -> Probe {
      let view = Probe()
      view.update = update
      return view
    }
    func updateNSView(_ nsView: Probe, context: Context) {
      nsView.update = update
      nsView.report()
    }
    final class Probe: NSView {
      var update: ((CGRect) -> Void)?
      override func viewDidMoveToWindow() {
        super.viewDidMoveToWindow()
        report()
      }
      override func layout() {
        super.layout()
        report()
      }
      func report() {
        guard let bounds = window?.contentView?.bounds else { return }
        DispatchQueue.main.async { [weak self] in
          self?.update?(CGRect(origin: .zero, size: bounds.size))
        }
      }
    }
  }
#endif
