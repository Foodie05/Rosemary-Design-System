import SwiftUI

/// Native scaling and accessibility minimums are applied by callers; semantic values stay generated.
enum RosemaryNativeMetrics {
  static func duration(_ role: String) -> Double { RosemaryTokens.motion.durations[role]! / 1000 }
  static func dimension(_ component: String, _ role: String) -> CGFloat {
    RosemaryTokens.componentTokens[component]!.dimensions[role]!
  }
  static func radius(_ component: String) -> CGFloat {
    RosemaryTokens.componentTokens[component]!.radius
  }
}
