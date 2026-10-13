import SwiftUI

/// Read within modal content to close with a specific semantic reason.
public struct RosemaryDismissAction {
  private let action: (RosemaryDismissReason) -> Void
  public init(_ action: @escaping (RosemaryDismissReason) -> Void = { _ in }) {
    self.action = action
  }
  public func callAsFunction(_ reason: RosemaryDismissReason = .cancel) { action(reason) }
}
private struct DismissActionKey: EnvironmentKey {
  static let defaultValue = RosemaryDismissAction()
}
extension EnvironmentValues {
  public var rosemaryDismiss: RosemaryDismissAction {
    get { self[DismissActionKey.self] }
    set { self[DismissActionKey.self] = newValue }
  }
}
