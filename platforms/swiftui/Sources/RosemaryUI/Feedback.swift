import SwiftUI

public enum RosemaryStatus { case neutral, info, success, warning, danger }
extension RosemaryStatus {
  func colors(_ c: RosemaryColors) -> (Color, Color, String) {
    switch self {
    case .neutral: return (c.muted, c.canvas, "info")
    case .info: return (c.info, c.infoSoft, "info")
    case .success: return (c.success, c.successSoft, "check")
    case .warning: return (c.warning, c.warningSoft, "warning")
    case .danger: return (c.danger, c.dangerSoft, "warning")
    }
  }
}
private struct FoldFace: Shape {
  let front: Bool
  func path(in r: CGRect) -> Path {
    Path { p in
      let points =
        front
        ? [(0.0, 0.15), (1.0, 0.0), (1.0, 0.85), (0.0, 1.0)]
        : [(0.0, 0.0), (1.0, 0.15), (1.0, 1.0), (0.0, 0.85)]
      for (i, v) in points.enumerated() {
        let point = CGPoint(x: r.minX + r.width * v.0, y: r.minY + r.height * v.1)
        if i == 0 { p.move(to: point) } else { p.addLine(to: point) }
      }
      p.closeSubpath()
    }
  }
}
public struct RosemaryFoldFrame: Equatable {
  public let backAngle: Double
  public let frontAngle: Double
  public let backOpacity: Double
  public let frontOpacity: Double
  public let backOnTop: Bool
  public static func at(_ fraction: Double) -> Self {
    let t = max(0, min(1, fraction))
    let stops: [Double] = [0, 0.2, 0.45, 0.7, 1]
    func interpolate(_ values: [Double]) -> Double {
      for i in 0..<4 where t <= stops[i + 1] {
        let n = (t - stops[i]) / (stops[i + 1] - stops[i])
        let e = (1 - cos(n * .pi)) / 2
        return values[i] + (values[i + 1] - values[i]) * e
      }
      return values[4]
    }
    return Self(
      backAngle: interpolate([0, -58, 0, 58, 0]), frontAngle: interpolate([0, 58, 0, -58, 0]),
      backOpacity: interpolate([0.4, 0.52, 0.67, 0.51, 0.4]),
      frontOpacity: interpolate([1, 0.90, 0.78, 0.92, 1]), backOnTop: t >= 0.2 && t < 0.7)
  }
}
/// Portal fold silhouettes: upright overlap, inner long-edge pivot, 1200ms layer exchange.
public struct RosemaryLoading: View {
  private var p = RosemaryPalette()
  @Environment(\.scenePhase) var scene
  let label: String
  let running: Bool
  let size: CGFloat
  let color: Color?
  public init(_ label: String, isRunning: Bool, size: CGFloat = 32, color: Color? = nil) {
    self.label = label
    running = isRunning
    self.size = size
    self.color = color
  }
  public var body: some View {
    HStack(spacing: 10) {
      TimelineView(.animation(paused: !running || p.reduce || scene != .active)) { context in
        let t =
          running && !p.reduce && scene == .active
          ? context.date.timeIntervalSinceReferenceDate.truncatingRemainder(
            dividingBy: RosemaryNativeMetrics.duration("loadingCycleMs"))
            / RosemaryNativeMetrics.duration("loadingCycleMs")
          : 0
        let f = RosemaryFoldFrame.at(t)
        let h = size * 1.125
        ZStack(alignment: .topLeading) {
          FoldFace(front: false).fill(color ?? p.colors.primary).frame(
            width: size * 0.38, height: h * 0.84
          )
          .opacity(f.backOpacity).rotation3DEffect(
            .degrees(f.backAngle), axis: (x: 0, y: 1, z: 0), anchor: .trailing, perspective: 0.3
          ).offset(x: size * 0.24, y: h * 0.08).zIndex(f.backOnTop ? 2 : 1)
          FoldFace(front: true).fill(color ?? p.colors.primary).frame(
            width: size * 0.38, height: h * 0.84
          )
          .opacity(f.frontOpacity).rotation3DEffect(
            .degrees(f.frontAngle), axis: (x: 0, y: 1, z: 0), anchor: .leading, perspective: 0.3
          ).offset(x: size * 0.39, y: h * 0.08).zIndex(f.backOnTop ? 1 : 2)
        }.frame(width: size, height: h).environment(\.layoutDirection, .leftToRight)
          .accessibilityHidden(true)
      }
      if !label.isEmpty { Text(label).foregroundStyle(p.colors.muted) }
    }.accessibilityElement(children: .combine).accessibilityLabel(label).accessibilityValue(
      running ? p.text("Loading") : p.text("Stopped"))
  }
}
public struct RosemaryProgress: View {
  private var p = RosemaryPalette()
  @Environment(\.scenePhase) var scene
  @Environment(\.layoutDirection) var direction
  let label: String
  let value: Double?
  let total: Double?
  let running: Bool
  public init(_ label: String, value: Double, total: Double, isRunning: Bool = true) {
    precondition(value.isFinite && total.isFinite && total > 0)
    self.label = label
    self.value = value
    self.total = total
    running = isRunning
  }
  /// Unknown work amount: no synthetic value, total or accessible percentage is exposed.
  public init(_ label: String, isRunning: Bool = true) {
    self.label = label
    value = nil
    total = nil
    running = isRunning
  }
  public var isIndeterminate: Bool { value == nil }
  public var fraction: Double? {
    guard let value, let total else { return nil }
    return max(0, min(1, value / total))
  }
  private var active: Bool { running && !p.reduce && scene == .active }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      HStack {
        Text(label).foregroundStyle(p.colors.ink)
        Spacer()
        if let value, let total {
          Text("\(value.formatted()) / \(total.formatted())").rosemaryTypography(.caption)
            .monospacedDigit().foregroundStyle(p.colors.muted)
        } else {
          Text(p.text(running ? "Indeterminate" : "Stopped")).rosemaryTypography(.caption)
            .foregroundStyle(p.colors.muted)
        }
      }
      GeometryReader { g in
        ZStack(alignment: .leading) {
          Capsule().fill(p.colors.border)
          if let fraction {
            Rectangle().fill(p.colors.primary).frame(width: g.size.width * fraction).overlay(
              alignment: .leading
            ) {
              TimelineView(.animation(paused: !active || fraction >= 1 || fraction <= 0)) {
                context in
                let cycle = RosemaryNativeMetrics.duration("progressFlowMs")
                let t =
                  context.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: cycle)
                  / cycle
                if active && fraction > 0 && fraction < 1 {
                  LinearGradient(
                    colors: [.clear, p.colors.onPrimary.opacity(0.28), .clear],
                    startPoint: .leading, endPoint: .trailing
                  )
                  .frame(width: 80).offset(
                    x: ((g.size.width * fraction + 80) * t - 80)
                      * (direction == .rightToLeft ? -1 : 1))
                }
              }
            }.clipped().animation(
              p.reduce ? nil : .easeInOut(duration: RosemaryNativeMetrics.duration("progressMs")),
              value: fraction)
          } else {
            TimelineView(.animation(paused: !active)) { context in
              let cycle = RosemaryNativeMetrics.duration("progressFlowMs")
              let t =
                active
                ? context.date.timeIntervalSinceReferenceDate.truncatingRemainder(dividingBy: cycle)
                  / cycle : 0.5
              Capsule().fill(p.colors.primary).frame(width: g.size.width * 0.3)
                .offset(
                  x: (g.size.width * 1.3 * t - g.size.width * 0.3)
                    * (direction == .rightToLeft ? -1 : 1))
            }
          }
        }.clipShape(Capsule())
      }.frame(height: 8)
    }.accessibilityElement(children: .ignore).accessibilityLabel(label).accessibilityValue(
      accessibleValue)
  }
  private var accessibleValue: String {
    if let fraction, let value, let total {
      return p.format(
        "%d percent, %@ of %@", Int(fraction * 100), value.formatted(), total.formatted())
    }
    return p.text(running ? "Indeterminate" : "Stopped")
  }
}
public struct RosemaryBadge: View {
  private var p = RosemaryPalette()
  let label: String
  let status: RosemaryStatus
  public init(_ label: String, status: RosemaryStatus = .neutral) {
    self.label = label
    self.status = status
  }
  public var body: some View {
    let c = status.colors(p.colors)
    Text(label).rosemaryTypography(.caption, weight: .medium).padding(.horizontal, 9).padding(
      .vertical, 4
    )
    .foregroundStyle(c.0).background(c.1, in: Capsule())
  }
}
public struct RosemaryAlert: View {
  private var p = RosemaryPalette()
  let title: String
  let message: String
  let status: RosemaryStatus
  let onDismiss: (() -> Void)?
  public init(
    _ title: String, message: String, status: RosemaryStatus = .info, onDismiss: (() -> Void)? = nil
  ) {
    self.title = title
    self.message = message
    self.status = status
    self.onDismiss = onDismiss
  }
  public var body: some View {
    let c = status.colors(p.colors)
    HStack(alignment: .top, spacing: 12) {
      RosemaryIcon(c.2).foregroundStyle(c.0)
      VStack(alignment: .leading, spacing: 4) {
        Text(title).rosemaryTypography(.body, weight: .semibold)
        Text(message).rosemaryTypography(.small)
      }.frame(maxWidth: .infinity, alignment: .leading)
      if let onDismiss {
        RosemaryIconButton("close", label: "\(p.text("Dismiss")) \(title)", action: onDismiss)
      }
    }.padding(16).foregroundStyle(p.colors.ink).background(
      c.1, in: RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("card"))
    ).accessibilityElement(children: .contain)
  }
}
public struct RosemaryToast: View {
  @Binding var presented: Bool
  let title: String
  let status: RosemaryStatus
  let duration: Duration?
  let onDismiss: () -> Void
  @Environment(\.scenePhase) var scene
  @State private var task: Task<Void, Never>?
  public init(
    _ title: String, isPresented: Binding<Bool>, status: RosemaryStatus = .success,
    duration: Duration? = .seconds(5), onDismiss: @escaping () -> Void = {}
  ) {
    self.title = title
    _presented = isPresented
    self.status = status
    self.duration = duration
    self.onDismiss = onDismiss
  }
  private func dismiss() {
    guard presented else { return }
    task?.cancel()
    presented = false
    onDismiss()
  }
  private func schedule() {
    task?.cancel()
    guard presented, scene == .active, let duration else { return }
    task = Task {
      try? await Task.sleep(for: duration)
      guard !Task.isCancelled else { return }
      dismiss()
    }
  }
  public var body: some View {
    Group {
      if presented {
        RosemaryAlert(title, message: "", status: status, onDismiss: dismiss).onHover { hover in
          if hover { task?.cancel() } else { schedule() }
        }.accessibilityAction(named: "Dismiss", dismiss)
      }
    }.onChange(of: presented) { _, _ in schedule() }.onChange(of: scene) { _, _ in schedule() }
      .onAppear(perform: schedule).onDisappear {
        task?.cancel()
        task = nil
      }
  }
}
public struct RosemarySkeleton: View {
  private var p = RosemaryPalette()
  let lines: Int
  public init(lines: Int = 3) {
    precondition(lines > 0)
    self.lines = lines
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      ForEach(0..<lines, id: \.self) { n in
        RoundedRectangle(cornerRadius: 4).fill(p.colors.border).frame(height: 14).padding(
          .trailing, n == lines - 1 ? 48 : 0)
      }
    }.accessibilityHidden(true)
  }
}
public struct RosemaryAvatar: View {
  private var p = RosemaryPalette()
  let name: String
  let url: URL?
  let size: CGFloat
  public init(_ name: String, imageURL: URL? = nil, size: CGFloat = 40) {
    self.name = name
    url = imageURL
    self.size = size
  }
  private var initials: String {
    name.split(separator: " ").prefix(2).compactMap(\.first).map(String.init).joined()
  }
  public var body: some View {
    AsyncImage(url: url) { phase in
      if let image = phase.image {
        image.resizable().scaledToFill()
      } else {
        Text(initials).rosemaryTypography(.lead, weight: .semibold).foregroundStyle(
          p.colors.primary
        ).frame(
          maxWidth: .infinity, maxHeight: .infinity
        ).background(p.colors.primarySoft)
      }
    }.frame(width: size, height: size).clipShape(Circle()).accessibilityLabel(name)
  }
}
public struct RosemaryEmpty<Action: View>: View {
  private var p = RosemaryPalette()
  let title: String
  let message: String
  let icon: String
  let action: Action
  public init(
    _ title: String, message: String, icon: String = "folder", @ViewBuilder action: () -> Action
  ) {
    self.title = title
    self.message = message
    self.icon = icon
    self.action = action()
  }
  public var body: some View {
    VStack(spacing: 12) {
      RosemaryIcon(icon, size: 32).foregroundStyle(p.colors.muted)
      Text(title).rosemaryTypography(.lead, weight: .semibold).foregroundStyle(p.colors.ink)
      Text(message).foregroundStyle(p.colors.muted).multilineTextAlignment(.center)
      action
    }.padding(24).frame(maxWidth: .infinity)
  }
}
public struct RosemaryCard<Content: View>: View {
  private var p = RosemaryPalette()
  let content: Content
  public init(@ViewBuilder content: () -> Content) { self.content = content() }
  public var body: some View {
    VStack(alignment: .leading, spacing: 12) { content }.padding(16).frame(
      maxWidth: .infinity, alignment: .leading
    ).background(
      p.colors.surface, in: RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("card"))
    ).overlay(
      RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("card")).stroke(
        p.colors.border, lineWidth: p.stroke)
    ).foregroundStyle(p.colors.ink)
  }
}
