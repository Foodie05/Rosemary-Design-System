import SwiftUI

public struct RosemaryIcon: View {
  public let name: String
  public var size: CGFloat
  public var rotation: Angle
  public init(_ name: String, size: CGFloat = 20, rotation: Angle = .zero) {
    precondition(RosemaryIcons.paths[name] != nil, "Unknown Rosemary icon: \(name)")
    self.name = name
    self.size = size
    self.rotation = rotation
  }
  public var body: some View {
    GeometryReader { geo in
      let scale = min(geo.size.width, geo.size.height) / 24
      Path { path in
        for commands in RosemaryIcons.paths[name] ?? [] {
          for c in commands {
            let v = c.values
            switch c.op {
            case "M": path.move(to: CGPoint(x: v[0] * scale, y: v[1] * scale))
            case "L": path.addLine(to: CGPoint(x: v[0] * scale, y: v[1] * scale))
            case "C":
              path.addCurve(
                to: CGPoint(x: v[4] * scale, y: v[5] * scale),
                control1: CGPoint(x: v[0] * scale, y: v[1] * scale),
                control2: CGPoint(x: v[2] * scale, y: v[3] * scale))
            case "Z": path.closeSubpath()
            default: preconditionFailure("Unsupported generated command")
            }
          }
        }
      }.stroke(style: StrokeStyle(lineWidth: 1.6 * scale, lineCap: .round, lineJoin: .round))
    }.frame(width: size, height: size).rotationEffect(rotation).accessibilityHidden(true)
  }
}
