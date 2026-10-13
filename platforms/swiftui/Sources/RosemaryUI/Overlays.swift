import SwiftUI

#if canImport(UIKit)
  import UIKit
#endif
public enum RosemaryDismissReason: String {
  case confirm, cancel, outside, escape, back, programmatic, unmount
}

public struct RosemaryPopover<Trigger: View, Content: View>: View {
  private var p = RosemaryPalette()
  let title: String
  let trigger: Trigger
  let content: Content
  let onDismiss: (RosemaryDismissReason) -> Void
  @Binding var presented: Bool
  @FocusState private var triggerFocus: Bool
  public init(
    _ title: String, isPresented: Binding<Bool>,
    onDismiss: @escaping (RosemaryDismissReason) -> Void = { _ in },
    @ViewBuilder trigger: () -> Trigger, @ViewBuilder content: () -> Content
  ) {
    self.title = title
    _presented = isPresented
    self.onDismiss = onDismiss
    self.trigger = trigger()
    self.content = content()
  }
  private func dismiss(_ reason: RosemaryDismissReason) {
    guard presented else { return }
    presented = false
    triggerFocus = true
    onDismiss(reason)
  }
  public var body: some View {
    Button {
      presented.toggle()
    } label: {
      trigger
    }.buttonStyle(RosemaryButtonStyle(.secondary)).focused($triggerFocus).accessibilityValue(
      presented ? p.text("Expanded") : p.text("Collapsed")
    )
    .overlay(alignment: .topLeading) {
      if presented {
        RosemaryAnchoredLayer(width: 320, height: 300, dismissOutside: { dismiss(.outside) }) {
          RosemaryCard {
            VStack(alignment: .leading, spacing: 12) {
              HStack {
                Text(title).rosemaryTypography(.lead, weight: .semibold).accessibilityAddTraits(
                  .isHeader)
                Spacer()
                RosemaryIconButton("close", label: "\(p.text("Close")) \(title)") {
                  dismiss(.cancel)
                }
              }
              ScrollView { VStack(alignment: .leading, spacing: 12) { content } }
            }
          }
        }.transition(.opacity)
      }
    }.zIndex(presented ? 50 : 0).animation(
      p.reduce ? nil : .easeInOut(duration: presented ? 0.18 : 0.12), value: presented
    ).onKeyPress(.escape) {
      dismiss(.escape)
      return .handled
    }.onKeyPress(.tab) {
      presented = false
      onDismiss(.cancel)
      return .ignored
    }.onDisappear {
      if presented {
        presented = false
        onDismiss(.unmount)
      }
    }
  }
}
/// Explanatory, noninteractive text. Touch uses an explicit accessibility action.
public struct RosemaryTooltip<Content: View>: View {
  private var p = RosemaryPalette()
  let text: String
  let content: Content
  @Binding var presented: Bool
  @FocusState private var focused: Bool
  public init(_ text: String, isPresented: Binding<Bool>, @ViewBuilder content: () -> Content) {
    self.text = text
    _presented = isPresented
    self.content = content()
  }
  public var body: some View {
    content.focused($focused).accessibilityHint(text).accessibilityAction(
      named: p.text("Show explanation")
    ) { presented.toggle() }.onHover { presented = $0 }.onChange(of: focused) { _, v in
      presented = v
    }
    .overlay(alignment: .bottomLeading) {
      if presented {
        RosemaryAnchoredLayer(width: 280, height: 100) {
          ScrollView {
            Text(text).rosemaryTypography(.caption).foregroundStyle(p.colors.ink)
              .frame(maxWidth: .infinity, alignment: .leading).padding(10)
          }.background(p.colors.raised, in: RoundedRectangle(cornerRadius: 8))
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(p.colors.border, lineWidth: p.stroke))
            .onHover { if $0 { presented = true } }.accessibilityHidden(true)
        }
      }
    }.zIndex(presented ? 50 : 0).onKeyPress(.escape) {
      presented = false
      return .handled
    }.onKeyPress(.tab) {
      presented = false
      return .ignored
    }.onDisappear { presented = false }
  }
}
public enum RosemaryDrawerEdge { case leading, trailing, bottom }
private struct RosemaryModalModifier<Panel: View>: ViewModifier {
  private var p = RosemaryPalette()
  @Binding var presented: Bool
  let title: String
  let drawer: RosemaryDrawerEdge?
  let modal: Bool
  let dismissOutside: Bool
  let panel: Panel
  let onDismiss: (RosemaryDismissReason) -> Void
  let restoreFocus: () -> Void
  @State private var mounted = false
  @State private var visible = false
  @State private var cleanup: Task<Void, Never>?
  @State private var generation = 0
  @State private var requestedReason: RosemaryDismissReason?
  @FocusState private var closeFocus: Bool
  @AccessibilityFocusState private var a11yFocus: Bool
  @Environment(\.layoutDirection) var direction
  init(
    presented: Binding<Bool>, title: String, drawer: RosemaryDrawerEdge?, modal: Bool,
    dismissOutside: Bool, panel: Panel, onDismiss: @escaping (RosemaryDismissReason) -> Void,
    restoreFocus: @escaping () -> Void
  ) {
    _presented = presented
    self.title = title
    self.drawer = drawer
    self.modal = modal
    self.dismissOutside = dismissOutside
    self.panel = panel
    self.onDismiss = onDismiss
    self.restoreFocus = restoreFocus
  }
  private func dismiss(_ reason: RosemaryDismissReason) {
    guard presented else { return }
    requestedReason = reason
    presented = false
  }
  private func sync() {
    generation += 1
    let token = generation
    cleanup?.cancel()
    if presented {
      mounted = true
      cleanup = Task { @MainActor in
        await Task.yield()
        guard !Task.isCancelled, token == generation else { return }
        withAnimation(
          p.reduce
            ? nil
            : .easeOut(
              duration: Double(
                RosemaryNativeMetrics.dimension(drawer == nil ? "dialog" : "drawer", "enterMs"))
                / 1000)
        ) { visible = true }
        if modal {
          closeFocus = true
          a11yFocus = true
        }
      }
    } else if mounted {
      let reason = requestedReason ?? .programmatic
      requestedReason = nil
      withAnimation(
        p.reduce
          ? nil
          : .easeIn(
            duration: Double(
              RosemaryNativeMetrics.dimension(drawer == nil ? "dialog" : "drawer", "exitMs")) / 1000
          ), completionCriteria: .logicallyComplete
      ) {
        visible = false
      } completion: {
        guard token == generation, !presented else { return }
        mounted = false
        closeFocus = false
        if modal { restoreFocus() }
        onDismiss(reason)
      }
    }
  }
  private var alignment: Alignment {
    guard let drawer else { return .center }
    switch drawer {
    case .leading: return .leading
    case .trailing: return .trailing
    case .bottom: return .bottom
    }
  }
  private func offset(_ g: GeometryProxy) -> CGSize {
    guard !visible, let drawer else { return .zero }
    switch drawer {
    case .leading:
      return CGSize(width: (direction == .rightToLeft ? 1 : -1) * min(390, g.size.width), height: 0)
    case .trailing:
      return CGSize(width: (direction == .rightToLeft ? -1 : 1) * min(390, g.size.width), height: 0)
    case .bottom: return CGSize(width: 0, height: g.size.height * 0.75)
    }
  }
  func body(content: Content) -> some View {
    ZStack {
      content.disabled(mounted && modal).accessibilityHidden(mounted && modal)
      if mounted {
        GeometryReader { g in
          ZStack(alignment: alignment) {
            if modal {
              Color.black.opacity(visible ? 0.36 : 0).ignoresSafeArea().contentShape(Rectangle())
                .onTapGesture { if dismissOutside { dismiss(.outside) } }.accessibilityHidden(true)
            }
            VStack(alignment: .leading, spacing: 16) {
              HStack(alignment: .top) {
                Text(title).rosemaryTypography(.lead, weight: .semibold).accessibilityAddTraits(
                  .isHeader
                )
                .accessibilityFocused($a11yFocus)
                Spacer()
                RosemaryIconButton("close", label: "\(p.text("Close")) \(title)") {
                  dismiss(.cancel)
                }.focused($closeFocus)
              }
              ScrollView {
                VStack(alignment: .leading, spacing: 16) { panel }.environment(
                  \.rosemaryDismiss, RosemaryDismissAction(dismiss)
                ).frame(
                  maxWidth: .infinity, alignment: .leading)
              }
            }.padding(24).frame(
              width: drawer == .bottom
                ? g.size.width : min(drawer == nil ? 520 : 390, max(0, g.size.width - 24)),
              height: drawer == nil
                ? min(g.size.height * 0.8, 560)
                : drawer == .bottom ? g.size.height * 0.75 : g.size.height
            )
            .background(
              p.colors.raised,
              in: RoundedRectangle(
                cornerRadius: RosemaryNativeMetrics.radius(drawer == nil ? "dialog" : "drawer"))
            ).overlay(
              RoundedRectangle(
                cornerRadius: RosemaryNativeMetrics.radius(drawer == nil ? "dialog" : "drawer")
              ).stroke(
                p.colors.border, lineWidth: p.stroke)
            ).foregroundStyle(p.colors.ink).opacity(visible ? 1 : 0).offset(offset(g)).padding(
              drawer == nil ? 12 : 0
            ).accessibilityElement(children: .contain).accessibilityAddTraits(modal ? .isModal : [])
            .onKeyPress(.escape) {
              dismiss(.escape)
              return .handled
            }
          }.frame(maxWidth: .infinity, maxHeight: .infinity, alignment: alignment)
        }.zIndex(100)
      }
    }.onChange(of: presented) { _, _ in sync() }.onAppear(perform: sync).onDisappear {
      cleanup?.cancel()
      cleanup = nil
      generation += 1
      if mounted {
        mounted = false
        visible = false
        presented = false
        onDismiss(.unmount)
      }
    }
  }
}
extension View {
  public func rosemaryDialog<Content: View>(
    _ title: String, isPresented: Binding<Bool>, dismissOnOutside: Bool = true,
    onDismiss: @escaping (RosemaryDismissReason) -> Void = { _ in },
    restoreFocus: @escaping () -> Void = {}, @ViewBuilder content: () -> Content
  ) -> some View {
    modifier(
      RosemaryModalModifier(
        presented: isPresented, title: title, drawer: nil, modal: true,
        dismissOutside: dismissOnOutside, panel: content(), onDismiss: onDismiss,
        restoreFocus: restoreFocus))
  }
  public func rosemaryDrawer<Content: View>(
    _ title: String, isPresented: Binding<Bool>, edge: RosemaryDrawerEdge = .trailing,
    isModal: Bool = true, dismissOnOutside: Bool = true,
    onDismiss: @escaping (RosemaryDismissReason) -> Void = { _ in },
    restoreFocus: @escaping () -> Void = {}, @ViewBuilder content: () -> Content
  ) -> some View {
    modifier(
      RosemaryModalModifier(
        presented: isPresented, title: title, drawer: edge, modal: isModal,
        dismissOutside: dismissOnOutside, panel: content(), onDismiss: onDismiss,
        restoreFocus: restoreFocus))
  }
}
/// Mounts a modal above a supplied host; background keyboard and accessibility interactions are contained.
public struct RosemaryDialog<Background: View, Content: View>: View {
  let title: String
  let presented: Binding<Bool>
  let background: Background
  let content: Content
  let onDismiss: (RosemaryDismissReason) -> Void
  let restoreFocus: () -> Void
  public init(
    _ title: String, isPresented: Binding<Bool>,
    onDismiss: @escaping (RosemaryDismissReason) -> Void = { _ in },
    restoreFocus: @escaping () -> Void = {}, @ViewBuilder background: () -> Background,
    @ViewBuilder content: () -> Content
  ) {
    self.title = title
    presented = isPresented
    self.background = background()
    self.content = content()
    self.onDismiss = onDismiss
    self.restoreFocus = restoreFocus
  }
  public var body: some View {
    background.rosemaryDialog(
      title, isPresented: presented, onDismiss: onDismiss, restoreFocus: restoreFocus
    ) { content }
  }
}
public struct RosemaryDrawer<Background: View, Content: View>: View {
  let title: String
  let presented: Binding<Bool>
  let edge: RosemaryDrawerEdge
  let modal: Bool
  let background: Background
  let content: Content
  let onDismiss: (RosemaryDismissReason) -> Void
  let restoreFocus: () -> Void
  public init(
    _ title: String, isPresented: Binding<Bool>, edge: RosemaryDrawerEdge = .trailing,
    isModal: Bool = true, onDismiss: @escaping (RosemaryDismissReason) -> Void = { _ in },
    restoreFocus: @escaping () -> Void = {}, @ViewBuilder background: () -> Background,
    @ViewBuilder content: () -> Content
  ) {
    self.title = title
    presented = isPresented
    self.edge = edge
    modal = isModal
    self.background = background()
    self.content = content()
    self.onDismiss = onDismiss
    self.restoreFocus = restoreFocus
  }
  public var body: some View {
    background.rosemaryDrawer(
      title, isPresented: presented, edge: edge, isModal: modal, onDismiss: onDismiss,
      restoreFocus: restoreFocus
    ) { content }
  }
}
