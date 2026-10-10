import SwiftUI

struct RosemaryTreeEntry {
  let node: RosemaryTreeNode
  let parent: String?
  let depth: Int
}
func rosemaryVisibleTree(_ nodes: [RosemaryTreeNode], _ expanded: Set<String>)
  -> [RosemaryTreeEntry]
{
  var ids = Set<String>()
  var result = [RosemaryTreeEntry]()
  func visit(_ n: RosemaryTreeNode, _ parent: String?, _ depth: Int, _ shown: Bool) {
    precondition(ids.insert(n.id).inserted, "Tree IDs must be unique")
    if shown { result.append(RosemaryTreeEntry(node: n, parent: parent, depth: depth)) }
    for child in n.children { visit(child, n.id, depth + 1, shown && expanded.contains(n.id)) }
  }
  for node in nodes { visit(node, nil, 0, true) }
  return result
}
#if canImport(UIKit)
  import UIKit
  final class RosemaryTreeTable: UITableView, UIKeyInput {
    var keyAction: ((String) -> Void)?
    var typeAction: ((String) -> Void)?
    var hasText: Bool { false }
    func insertText(_ text: String) { typeAction?(text) }
    func deleteBackward() {}
    override var canBecomeFirstResponder: Bool { true }
    override var keyCommands: [UIKeyCommand]? {
      [
        UIKeyCommand.inputUpArrow, UIKeyCommand.inputDownArrow, UIKeyCommand.inputLeftArrow,
        UIKeyCommand.inputRightArrow, UIKeyCommand.inputHome, UIKeyCommand.inputEnd, "\r", " ",
      ].map { UIKeyCommand(input: $0, modifierFlags: [], action: #selector(key(_:))) }
    }
    override var inputView: UIView? { UIView(frame: .zero) }
    @objc func key(_ command: UIKeyCommand) { if let input = command.input { keyAction?(input) } }
  }
  struct RosemaryNativeTree: UIViewRepresentable {
    let nodes: [RosemaryTreeNode]
    @Binding var expanded: Set<String>
    @Binding var selected: String?
    @Environment(\.colorScheme) private var scheme
    var palette: RosemaryTheme { RosemaryTheme(scheme: scheme) }
    func makeCoordinator() -> Coordinator { Coordinator(self) }
    func makeUIView(context: Context) -> RosemaryTreeTable {
      let table = RosemaryTreeTable(frame: .zero, style: .plain)
      table.register(UITableViewCell.self, forCellReuseIdentifier: "node")
      table.rowHeight = UITableView.automaticDimension
      table.estimatedRowHeight = 64
      table.dataSource = context.coordinator
      table.delegate = context.coordinator
      table.keyAction = { [weak coordinator = context.coordinator, weak table] key in
        if let table { coordinator?.key(key, table) }
      }
      table.typeAction = { [weak coordinator = context.coordinator, weak table] text in
        if let table { coordinator?.type(text, table) }
      }
      return table
    }
    func updateUIView(_ table: RosemaryTreeTable, context: Context) {
      let c = context.coordinator
      let previous = c.entries
      c.parent = self
      c.entries = rosemaryVisibleTree(nodes, expanded)
      if let active = c.active, c.entries.allSatisfy({ $0.node.id != active }) {
        var next = previous.first { $0.node.id == active }?.parent
        while let id = next, c.entries.allSatisfy({ $0.node.id != id }) {
          next = previous.first { $0.node.id == id }?.parent
        }
        c.active = next ?? c.entries.first?.node.id
      }
      table.backgroundColor = UIColor(palette.surface)
      table.tintColor = UIColor(palette.accent)
      table.separatorColor = UIColor(palette.border)
      table.reloadData()
      if let i = c.entries.firstIndex(where: { $0.node.id == c.active }) {
        table.selectRow(at: IndexPath(row: i, section: 0), animated: false, scrollPosition: .none)
      }
    }
    final class Coordinator: NSObject, UITableViewDataSource, UITableViewDelegate {
      var parent: RosemaryNativeTree
      var entries = [RosemaryTreeEntry]()
      var active: String?
      var prefix = ""
      var lastType = Date.distantPast
      init(_ parent: RosemaryNativeTree) { self.parent = parent }
      func tableView(_ table: UITableView, numberOfRowsInSection section: Int) -> Int {
        entries.count
      }
      func tableView(_ table: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let entry = entries[indexPath.row]
        let n = entry.node
        let cell = table.dequeueReusableCell(withIdentifier: "node", for: indexPath)
        var content = cell.defaultContentConfiguration()
        content.text = n.label
        content.textProperties.numberOfLines = 0
        content.textProperties.font = .preferredFont(forTextStyle: .body)
        content.textProperties.color = UIColor(parent.palette.ink)
        cell.contentConfiguration = content
        cell.backgroundColor = UIColor(parent.palette.surface)
        cell.indentationWidth = 16
        cell.indentationLevel = min(5, entry.depth)
        cell.accessibilityLabel = "\(n.label) · 第 \(entry.depth+1) 级"
        cell.accessibilityValue =
          n.children.isEmpty ? "" : (parent.expanded.contains(n.id) ? "已展开" : "已收起")
        cell.accessibilityTraits = parent.selected == n.id ? [.button, .selected] : [.button]
        cell.accessibilityCustomActions = []
        cell.accessoryView = nil
        if !n.children.isEmpty {
          let label = parent.expanded.contains(n.id) ? "收起 \(n.label)" : "展开 \(n.label)"
          let button = UIButton(type: .system)
          button.setImage(
            UIImage(systemName: parent.expanded.contains(n.id) ? "chevron.down" : "chevron.right"),
            for: .normal)
          button.frame = CGRect(x: 0, y: 0, width: 44, height: 44)
          button.accessibilityLabel = label
          button.addAction(UIAction { [weak self] _ in self?.toggle(n.id) }, for: .touchUpInside)
          cell.accessoryView = button
          cell.accessibilityCustomActions = [
            UIAccessibilityCustomAction(name: label) { [weak self] _ in
              self?.toggle(n.id)
              return true
            }
          ]
        }
        return cell
      }
      func toggle(_ id: String) {
        guard entries.contains(where: { $0.node.id == id && !$0.node.children.isEmpty }) else {
          return
        }
        if parent.expanded.contains(id) {
          parent.expanded.remove(id)
        } else {
          parent.expanded.insert(id)
        }
      }
      func tableView(_ table: UITableView, didSelectRowAt path: IndexPath) {
        let n = entries[path.row].node
        active = n.id
        parent.selected = n.id
        table.becomeFirstResponder()
      }
      func move(_ index: Int, _ table: RosemaryTreeTable) {
        guard !entries.isEmpty else { return }
        let i = min(entries.count - 1, max(0, index))
        active = entries[i].node.id
        let path = IndexPath(row: i, section: 0)
        table.selectRow(at: path, animated: false, scrollPosition: .middle)
        if UIAccessibility.isVoiceOverRunning {
          UIAccessibility.post(notification: .layoutChanged, argument: table.cellForRow(at: path))
        }
      }
      func key(_ input: String, _ table: RosemaryTreeTable) {
        guard !entries.isEmpty else { return }
        let i = entries.firstIndex { $0.node.id == active } ?? 0
        let e = entries[i]
        switch input {
        case UIKeyCommand.inputDownArrow: move(i + 1, table)
        case UIKeyCommand.inputUpArrow: move(i - 1, table)
        case UIKeyCommand.inputHome: move(0, table)
        case UIKeyCommand.inputEnd: move(entries.count - 1, table)
        case UIKeyCommand.inputRightArrow:
          if !e.node.children.isEmpty {
            if parent.expanded.contains(e.node.id) { move(i + 1, table) } else { toggle(e.node.id) }
          }
        case UIKeyCommand.inputLeftArrow:
          if parent.expanded.contains(e.node.id) {
            toggle(e.node.id)
          } else if let p = e.parent, let j = entries.firstIndex(where: { $0.node.id == p }) {
            move(j, table)
          }
        case "\r", " ": parent.selected = e.node.id
        default: break
        }
      }
      func type(_ text: String, _ table: RosemaryTreeTable) {
        let now = Date()
        prefix = now.timeIntervalSince(lastType) > 0.7 ? text : prefix + text
        lastType = now
        if let i = entries.firstIndex(where: {
          $0.node.label.lowercased().hasPrefix(prefix.lowercased())
        }) {
          move(i, table)
        }
      }
    }
  }
#endif
