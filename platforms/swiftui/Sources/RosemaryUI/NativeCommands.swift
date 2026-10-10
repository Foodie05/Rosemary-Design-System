import SwiftUI

#if canImport(UIKit)
  import UIKit
  struct RosemaryNativeCommands: UIViewControllerRepresentable {
    let actions: [RosemaryAction], onClose: () -> Void
    @Environment(\.colorScheme) private var scheme
    func makeUIViewController(context: Context) -> RosemaryCommandsController {
      RosemaryCommandsController()
    }
    func updateUIViewController(_ controller: RosemaryCommandsController, context: Context) {
      controller.actions = actions
      controller.onClose = onClose
      controller.palette = RosemaryTheme(scheme: scheme)
      controller.refresh()
    }
  }
  final class RosemaryCommandsController: UIViewController, UITableViewDataSource,
    UITableViewDelegate, UITextFieldDelegate
  {
    var actions = [RosemaryAction](), filtered = [RosemaryAction]()
    var onClose: (() -> Void)?
    var palette = RosemaryTheme(scheme: .light)
    let search = UITextField(), table = UITableView(frame: .zero, style: .plain),
      close = UIButton(type: .system)
    var active: String?
    override func loadView() {
      view = UIView()
      search.placeholder = "搜索命令"
      search.accessibilityLabel = "搜索命令"
      search.borderStyle = .roundedRect
      search.returnKeyType = .go
      search.delegate = self
      search.addTarget(self, action: #selector(query), for: .editingChanged)
      table.dataSource = self
      table.delegate = self
      table.rowHeight = UITableView.automaticDimension
      table.estimatedRowHeight = 48
      table.register(UITableViewCell.self, forCellReuseIdentifier: "command")
      close.setTitle("关闭命令面板", for: .normal)
      close.addAction(UIAction { [weak self] _ in self?.onClose?() }, for: .touchUpInside)
      let stack = UIStackView(arrangedSubviews: [search, table, close])
      stack.axis = .vertical
      stack.spacing = 8
      stack.translatesAutoresizingMaskIntoConstraints = false
      view.addSubview(stack)
      NSLayoutConstraint.activate([
        stack.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
        stack.bottomAnchor.constraint(equalTo: view.safeAreaLayoutGuide.bottomAnchor),
        stack.leadingAnchor.constraint(equalTo: view.leadingAnchor),
        stack.trailingAnchor.constraint(equalTo: view.trailingAnchor),
        search.heightAnchor.constraint(greaterThanOrEqualToConstant: 44),
        close.heightAnchor.constraint(greaterThanOrEqualToConstant: 44),
      ])
    }
    override func viewDidLoad() {
      super.viewDidLoad()
      refresh()
    }
    override func viewDidAppear(_ animated: Bool) {
      super.viewDidAppear(animated)
      search.becomeFirstResponder()
    }
    @objc func query() {
      active = nil
      refresh()
    }
    func refresh() {
      guard isViewLoaded else { return }
      filtered = actions.filter {
        (search.text ?? "").isEmpty || $0.label.localizedCaseInsensitiveContains(search.text ?? "")
      }
      if !filtered.contains(where: { $0.id == active && $0.action != nil }) {
        active = filtered.first { $0.action != nil }?.id
      }
      view.backgroundColor = UIColor(palette.surface)
      table.backgroundColor = UIColor(palette.surface)
      search.textColor = UIColor(palette.ink)
      search.backgroundColor = UIColor(palette.surface)
      view.tintColor = UIColor(palette.accent)
      table.reloadData()
      if filtered.isEmpty {
        let empty = UILabel()
        empty.text = "没有匹配的命令"
        empty.textColor = UIColor(palette.ink)
        empty.textAlignment = .center
        table.backgroundView = empty
      } else {
        table.backgroundView = nil
      }
    }
    func tableView(_ table: UITableView, numberOfRowsInSection section: Int) -> Int {
      filtered.count
    }
    func tableView(_ table: UITableView, cellForRowAt path: IndexPath) -> UITableViewCell {
      let a = filtered[path.row]
      let cell = table.dequeueReusableCell(withIdentifier: "command", for: path)
      var content = cell.defaultContentConfiguration()
      content.text = a.label
      content.textProperties.numberOfLines = 0
      content.textProperties.color = UIColor(palette.ink)
      cell.contentConfiguration = content
      cell.isUserInteractionEnabled = a.action != nil
      cell.accessibilityLabel = a.label
      cell.accessibilityTraits =
        a.action == nil
        ? [.button, .notEnabled] : a.id == active ? [.button, .selected] : [.button]
      cell.backgroundColor = UIColor(a.id == active ? palette.canvas : palette.surface)
      return cell
    }
    func invoke(_ id: String?) {
      guard let action = actions.first(where: { $0.id == id && $0.action != nil })?.action else {
        return
      }
      onClose?()
      action()
    }
    func tableView(_ table: UITableView, didSelectRowAt path: IndexPath) {
      invoke(filtered[path.row].id)
    }
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
      invoke(active)
      return false
    }
    override var keyCommands: [UIKeyCommand]? {
      [
        UIKeyCommand.inputUpArrow, UIKeyCommand.inputDownArrow, UIKeyCommand.inputHome,
        UIKeyCommand.inputEnd, UIKeyCommand.inputEscape,
      ].map {
        let command = UIKeyCommand(input: $0, modifierFlags: [], action: #selector(key(_:)))
        command.wantsPriorityOverSystemBehavior = true
        return command
      }
    }
    @objc func key(_ command: UIKeyCommand) {
      if command.input == UIKeyCommand.inputEscape {
        onClose?()
        return
      }
      let enabled = filtered.filter { $0.action != nil }
      guard !enabled.isEmpty else { return }
      let i = enabled.firstIndex { $0.id == active } ?? 0
      switch command.input {
      case UIKeyCommand.inputUpArrow: active = enabled[(i + enabled.count - 1) % enabled.count].id
      case UIKeyCommand.inputDownArrow: active = enabled[(i + 1) % enabled.count].id
      case UIKeyCommand.inputHome: active = enabled.first?.id
      case UIKeyCommand.inputEnd: active = enabled.last?.id
      default: return
      }
      refresh()
      if let i = filtered.firstIndex(where: { $0.id == active }) {
        table.scrollToRow(at: IndexPath(row: i, section: 0), at: .middle, animated: false)
      }
    }
  }
#endif
