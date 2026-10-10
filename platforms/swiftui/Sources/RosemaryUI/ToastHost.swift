import SwiftUI

#if canImport(UIKit)
  import UIKit
#endif
private struct RosemaryMotionKey: EnvironmentKey { static let defaultValue = false }
extension EnvironmentValues {
  public var rosemaryReducedMotion: Bool {
    get { self[RosemaryMotionKey.self] }
    set { self[RosemaryMotionKey.self] = newValue }
  }
}
extension View {
  public func rosemaryMotion(reduced: Bool) -> some View {
    environment(\.rosemaryReducedMotion, reduced)
  }
}
@MainActor public final class RosemaryToastState: ObservableObject {
  @Published public private(set) var message: String?
  @Published public private(set) var id = UUID()
  private let now: () -> TimeInterval
  private var remaining: TimeInterval = 0, started: TimeInterval?
  private var timer: Timer?
  private var paused = Set(["detached"])
  public init(now: @escaping () -> TimeInterval = { ProcessInfo.processInfo.systemUptime }) {
    self.now = now
  }
  public var remainingTime: TimeInterval { max(0, remaining - (started.map { now() - $0 } ?? 0)) }
  public func show(_ message: String, duration: TimeInterval = 4) {
    precondition(duration > 0 && duration.isFinite)
    timer?.invalidate()
    id = UUID()
    self.message = message
    remaining = duration
    started = nil
    arm()
  }
  public func dismiss(_ expected: UUID? = nil) {
    guard message != nil, expected == nil || expected == id else { return }
    timer?.invalidate()
    started = nil
    paused.subtract(["focus", "pointer"])
    message = nil
  }
  public func pause(_ reason: String) {
    guard paused.insert(reason).inserted else { return }
    remaining = remainingTime
    started = nil
    timer?.invalidate()
  }
  public func resume(_ reason: String) {
    guard paused.remove(reason) != nil else { return }
    arm()
  }
  private func arm() {
    guard message != nil, paused.isEmpty, started == nil else { return }
    started = now()
    let identity = id
    let t = Timer(timeInterval: remaining, repeats: false) { [weak self] _ in
      Task { @MainActor in
        guard let self, self.paused.isEmpty, self.id == identity else { return }
        self.dismiss(identity)
      }
    }
    timer = t
    RunLoop.main.add(t, forMode: .common)
  }
  deinit { timer?.invalidate() }
}
public struct RosemaryToastHost<Content: View>: View {
  @ObservedObject private var state: RosemaryToastState
  private let content: Content
  @Environment(\.scenePhase) private var scene
  @Environment(\.colorScheme) private var scheme
  @State private var attached: RosemaryToastState?
  @State private var hovered = false
  @FocusState private var focused: Bool
  public init(state: RosemaryToastState, @ViewBuilder content: () -> Content) {
    self.state = state
    self.content = content()
  }
  private func attach() {
    attached?.pause("detached")
    attached?.resume("pointer")
    attached?.resume("focus")
    attached = state
    if hovered { state.pause("pointer") }
    if focused { state.pause("focus") }
    app()
    reader()
    state.resume("detached")
  }
  private func app() { if scene == .active { state.resume("app") } else { state.pause("app") } }
  private func reader() {
    #if canImport(UIKit)
      if UIAccessibility.isVoiceOverRunning {
        state.pause("reader")
      } else {
        state.resume("reader")
      }
    #endif
  }
  public var body: some View {
    ZStack(alignment: .bottom) {
      content
      if let message = state.message {
        HStack {
          RosemaryToast(message)
          Button("关闭通知") { state.dismiss() }.frame(minHeight: 44).focused($focused)
        }.padding(8).frame(maxWidth: 480).background(RosemaryTheme(scheme: scheme).surface)
          .clipShape(RoundedRectangle(cornerRadius: 8)).padding(16).onHover {
            hovered = $0
            if $0 { state.pause("pointer") } else { state.resume("pointer") }
          }
      }
    }
    .onAppear {
      attach()
    }.onDisappear {
      attached?.pause("detached")
      attached?.resume("pointer")
      attached?.resume("focus")
      attached = nil
    }
    .onChange(of: ObjectIdentifier(state)) { _ in attach() }
    .onChange(of: scene) { _ in app() }.onChange(of: focused) {
      if $0 { state.pause("focus") } else { state.resume("focus") }
    }
    #if canImport(UIKit)
      .onReceive(
        NotificationCenter.default.publisher(
          for: UIAccessibility.voiceOverStatusDidChangeNotification)
      ) { _ in reader() }
      .onChange(of: state.message) {
        if let message = $0 { UIAccessibility.post(notification: .announcement, argument: message) }
      }
    #endif
  }
}
