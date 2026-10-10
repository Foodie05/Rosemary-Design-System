import Foundation

public enum RosemaryDismissReason: String, Codable {
  case confirm, cancel, outside, back, programmatic
}
/// Host sheet callbacks carry the captured presentation ID, never the latest mutable one.
public struct RosemaryModalSession {
  public let id: UUID
  public private(set) var result: RosemaryDismissReason?
  public init(id: UUID = UUID()) { self.id = id }
  @discardableResult public mutating func close(_ id: UUID, reason: RosemaryDismissReason) -> Bool {
    guard id == self.id, result == nil else { return false }
    result = reason
    return true
  }
}
