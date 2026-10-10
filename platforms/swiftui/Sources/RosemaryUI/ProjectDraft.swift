import Foundation

/// A save completes only the submitted snapshot and its matching operation.
public struct ProjectDraft: Equatable {
  public private(set) var savedName: String
  public var name: String
  public private(set) var busy = false
  public private(set) var error: String?
  public private(set) var saveOperation: UInt64?
  private var submittedName: String?
  private var generation: UInt64 = 0

  public init(name: String = "Rosemary Notes") {
    self.name = name
    self.savedName = name
  }
  public mutating func edit(_ text: String) {
    name = text
    error = nil
  }
  public mutating func cancel() {
    name = savedName
    error = nil
    invalidateSave()
  }
  public mutating func invalidateSave() {
    busy = false
    saveOperation = nil
    submittedName = nil
  }
  @discardableResult public mutating func beginSave() -> Bool {
    guard !busy else { return false }
    guard !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
      error = "请输入项目名称"
      return false
    }
    generation += 1
    saveOperation = generation
    submittedName = name
    busy = true
    error = nil
    return true
  }
  @discardableResult public mutating func complete(success: Bool, operation: UInt64) -> Bool {
    guard busy, operation == saveOperation, let submittedName else { return false }
    busy = false
    saveOperation = nil
    self.submittedName = nil
    if success {
      savedName = submittedName
      error = nil
    } else {
      error = "保存失败，草稿已保留"
    }
    return true
  }
}
