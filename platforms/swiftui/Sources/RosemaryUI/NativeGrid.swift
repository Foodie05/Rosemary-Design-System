import SwiftUI

public final class RosemaryGridConfiguration: ObservableObject {
  @Published public var widths: [String: Double]
  @Published public var filters: [String: String]
  public init(widths: [String: Double] = [:], filters: [String: String] = [:]) {
    self.widths = widths
    self.filters = filters
  }
  public func width(_ id: String) -> Double { min(480, max(96, widths[id] ?? 180)) }
  public func visible(_ rows: [RosemaryRecord]) -> [RosemaryRecord] {
    rows.filter { row in
      filters.allSatisfy { key, value in
        value.isEmpty || (row.cells[key] ?? "").localizedCaseInsensitiveContains(value)
      }
    }
  }
}
#if canImport(UIKit)
  import UIKit
  final class RosemaryGridLayout: UICollectionViewLayout {
    var widths: [CGFloat] = [], rowHeight: CGFloat = 64, rows = 0
    var rtl = false
    override var collectionViewContentSize: CGSize {
      CGSize(width: widths.reduce(0, +), height: CGFloat(rows + 1) * rowHeight)
    }
    override func shouldInvalidateLayout(forBoundsChange newBounds: CGRect) -> Bool { true }
    override func layoutAttributesForItem(at indexPath: IndexPath)
      -> UICollectionViewLayoutAttributes?
    {
      guard let view = collectionView, !widths.isEmpty else { return nil }
      let row = indexPath.item / widths.count
      let col = indexPath.item % widths.count
      let x: CGFloat
      if rtl {
        x =
          col == 0
          ? view.bounds.maxX - widths[0]
          : collectionViewContentSize.width - widths.prefix(col + 1).reduce(0, +)
      } else {
        x = col == 0 ? view.bounds.minX : widths.prefix(col).reduce(0, +)
      }
      let y = row == 0 ? view.bounds.minY : CGFloat(row) * rowHeight
      let attributes = UICollectionViewLayoutAttributes(forCellWith: indexPath)
      attributes.frame = CGRect(x: x, y: y, width: widths[col], height: rowHeight)
      attributes.zIndex = row == 0 ? (col == 0 ? 300 : 200) : (col == 0 ? 100 : 0)
      return attributes
    }
    override func layoutAttributesForElements(in rect: CGRect)
      -> [UICollectionViewLayoutAttributes]?
    {
      guard !widths.isEmpty else { return [] }
      let first = max(1, Int(rect.minY / rowHeight))
      let last = min(rows, Int(rect.maxY / rowHeight) + 1)
      let visibleRows = [0] + (first <= last ? Array(first...last) : [])
      return visibleRows.flatMap { r in
        widths.indices.compactMap { c in
          layoutAttributesForItem(at: IndexPath(item: r * widths.count + c, section: 0))
        }
      }.filter { $0.frame.intersects(rect) }
    }
  }
  final class RosemaryCollectionCell: UICollectionViewCell, UIGestureRecognizerDelegate {
    let selectButton = UIButton(type: .system)
    var onSelection: (() -> Void)?
    lazy var pan = UIPanGestureRecognizer(target: self, action: #selector(drag(_:)))
    let label = UILabel()
    var resize: ((CGFloat) -> Void)?
    override init(frame: CGRect) {
      super.init(frame: frame)
      label.numberOfLines = 2
      label.font = .preferredFont(forTextStyle: .body)
      label.adjustsFontForContentSizeCategory = true
      contentView.addSubview(label)
      isAccessibilityElement = true
      contentView.layer.borderWidth = 0.5
      contentView.layer.borderColor = UIColor.separator.cgColor
      pan.delegate = self
      addGestureRecognizer(pan)
      contentView.addSubview(selectButton)
      selectButton.addAction(
        UIAction { [weak self] _ in self?.onSelection?() }, for: .touchUpInside)
      selectButton.isHidden = true

    }
    required init?(coder: NSCoder) { fatalError("init(coder:) unavailable") }
    override func layoutSubviews() {
      super.layoutSubviews()
      let offset: CGFloat = selectButton.isHidden ? 0 : 44
      selectButton.frame = CGRect(x: 0, y: 0, width: 44, height: contentView.bounds.height)
      label.frame = CGRect(
        x: offset + 8, y: 8, width: max(0, contentView.bounds.width - offset - 16),
        height: max(0, contentView.bounds.height - 16))
    }
    override func gestureRecognizerShouldBegin(_ gesture: UIGestureRecognizer) -> Bool {
      guard resize != nil, let p = gesture as? UIPanGestureRecognizer else { return false }
      let v = p.velocity(in: self)
      return abs(v.x) > abs(v.y) && p.location(in: self).x > bounds.width - 44
    }
    @objc func drag(_ gesture: UIPanGestureRecognizer) {
      guard let resize else { return }
      let delta = gesture.translation(in: self).x
      gesture.setTranslation(.zero, in: self)
      resize(delta)
    }
  }
  final class RosemaryGridCollection: UICollectionView {
    var keyAction: ((String) -> Void)?
    override var canBecomeFirstResponder: Bool { true }
    override var keyCommands: [UIKeyCommand]? {
      [
        UIKeyCommand.inputUpArrow, UIKeyCommand.inputDownArrow, UIKeyCommand.inputLeftArrow,
        UIKeyCommand.inputRightArrow, "\r", " ", "\u{1B}", "+", "-",
      ].map { UIKeyCommand(input: $0, modifierFlags: [], action: #selector(key(_:))) }
    }
    @objc func key(_ command: UIKeyCommand) { if let input = command.input { keyAction?(input) } }
  }
  struct RosemaryNativeGrid: UIViewRepresentable {
    let columns: [RosemaryColumn], rows: [RosemaryRecord], selected: Set<String>
    let onSelection: (Set<String>) -> Void, onCommit: (String, String, String) -> Void
    @ObservedObject var configuration: RosemaryGridConfiguration
    @Environment(\.colorScheme) private var scheme
    @Environment(\.layoutDirection) private var direction
    var palette: RosemaryTheme { RosemaryTheme(scheme: scheme) }
    func makeCoordinator() -> Coordinator { Coordinator(self) }
    func makeUIView(context: Context) -> RosemaryGridCollection {
      let layout = RosemaryGridLayout()
      let view = RosemaryGridCollection(frame: .zero, collectionViewLayout: layout)
      view.register(RosemaryCollectionCell.self, forCellWithReuseIdentifier: "cell")
      view.dataSource = context.coordinator
      view.delegate = context.coordinator
      view.backgroundColor = UIColor(palette.surface)
      view.keyboardDismissMode = .interactive
      view.keyAction = { [weak coordinator = context.coordinator, weak view] key in
        if let view { coordinator?.key(key, view) }
      }
      return view
    }
    func updateUIView(_ view: RosemaryGridCollection, context: Context) {
      context.coordinator.parent = self
      let layout = view.collectionViewLayout as! RosemaryGridLayout
      layout.widths = columns.enumerated().map { index, column in
        let width = CGFloat(configuration.width(column.id))
        return index == 0 && view.bounds.width > 0 ? min(width, view.bounds.width * 0.45) : width
      }
      let wasRTL = layout.rtl
      layout.rtl = direction == .rightToLeft
      view.backgroundColor = UIColor(palette.surface)
      view.tintColor = UIColor(palette.accent)
      layout.rows = rows.count
      layout.rowHeight = max(64, UIFont.preferredFont(forTextStyle: .body).lineHeight * 2 + 24)
      layout.invalidateLayout()
      view.reloadData()
      if layout.rtl && (!wasRTL || view.contentOffset.x == 0) {
        view.layoutIfNeeded()
        view.contentOffset.x = max(0, layout.collectionViewContentSize.width - view.bounds.width)
      }
      if let row = context.coordinator.activeRow, !rows.contains(where: { $0.id == row }) {
        context.coordinator.activeRow = rows.first?.id
        context.coordinator.activeColumn = columns.first?.id
      }
    }
    final class Coordinator: NSObject, UICollectionViewDataSource, UICollectionViewDelegate {
      var parent: RosemaryNativeGrid
      var activeRow: String?, activeColumn: String?
      init(_ parent: RosemaryNativeGrid) { self.parent = parent }
      func collectionView(_ view: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        (parent.rows.count + 1) * parent.columns.count
      }
      func collectionView(_ view: UICollectionView, cellForItemAt indexPath: IndexPath)
        -> UICollectionViewCell
      {
        let cell =
          view.dequeueReusableCell(withReuseIdentifier: "cell", for: indexPath)
          as! RosemaryCollectionCell
        let r = indexPath.item / parent.columns.count
        let c = indexPath.item % parent.columns.count
        let col = parent.columns[c]
        cell.contentView.layer.borderColor = UIColor(parent.palette.border).cgColor
        cell.label.textColor = UIColor(parent.palette.ink)
        cell.selectButton.tintColor = UIColor(parent.palette.accent)
        cell.resize = nil
        cell.onSelection = nil
        cell.selectButton.isHidden = true
        cell.label.isAccessibilityElement = false
        cell.isAccessibilityElement = true
        cell.accessibilityCustomActions = nil
        if r == 0 {
          cell.label.text = col.label + " ↔"
          cell.label.font = .preferredFont(forTextStyle: .headline)
          cell.accessibilityLabel = "\(col.label) 列标题"
          cell.accessibilityTraits = .header
          cell.resize = { [weak self] delta in
            guard let self else { return }
            self.parent.configuration.widths[col.id] = min(
              480, max(96, self.parent.configuration.width(col.id) + Double(delta)))
          }
          cell.accessibilityCustomActions = [
            UIAccessibilityCustomAction(name: "增加列宽") { [weak self] _ in
              guard let self else { return false }
              self.parent.configuration.widths[col.id] =
                self.parent.configuration.width(col.id) + 16
              return true
            },
            UIAccessibilityCustomAction(name: "减少列宽") { [weak self] _ in
              guard let self else { return false }
              self.parent.configuration.widths[col.id] = max(
                96, self.parent.configuration.width(col.id) - 16)
              return true
            },
          ]
        } else {
          let row = parent.rows[r - 1]
          let value = row.cells[col.id] ?? ""
          cell.label.text = (c == 0 ? (parent.selected.contains(row.id) ? "✓ " : "○ ") : "") + value
          cell.label.font = .preferredFont(forTextStyle: .body)
          cell.accessibilityLabel = "第 \(r) 行，\(col.label)，\(value)"
          cell.accessibilityTraits = .button
          cell.accessibilityValue = parent.selected.contains(row.id) ? "行已选择" : "行未选择"
          cell.accessibilityCustomActions = [
            UIAccessibilityCustomAction(name: parent.selected.contains(row.id) ? "取消选择行" : "选择行") {
              [weak self] _ in
              self?.toggle(row.id)
              return self != nil
            }
          ]
          if c == 0 {
            cell.selectButton.isHidden = false
            cell.selectButton.setImage(
              UIImage(
                systemName: parent.selected.contains(row.id) ? "checkmark.circle.fill" : "circle"),
              for: .normal)
            cell.selectButton.accessibilityLabel = "选择 \(value)"
            cell.selectButton.accessibilityValue = parent.selected.contains(row.id) ? "已选择" : "未选择"
            cell.onSelection = { [weak self] in self?.toggle(row.id) }
            cell.isAccessibilityElement = false
            cell.label.isAccessibilityElement = true
            cell.label.accessibilityLabel = cell.accessibilityLabel
            cell.label.accessibilityValue = cell.accessibilityValue
            cell.label.accessibilityTraits = .button
          }
          if col.editable {
            cell.accessibilityCustomActions?.append(
              UIAccessibilityCustomAction(name: "编辑 \(col.label)") { [weak self, weak view] _ in
                guard let self, let view else { return false }
                self.edit(row.id, col.id, view)
                return true
              })
          }
        }
        cell.label.accessibilityCustomActions = cell.accessibilityCustomActions
        cell.setNeedsLayout()
        cell.backgroundColor =
          (activeRow == (r > 0 ? parent.rows[r - 1].id : nil) && activeColumn == col.id)
          ? UIColor(parent.palette.canvas) : UIColor(parent.palette.surface)
        return cell
      }
      func collectionView(_ view: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let r = indexPath.item / parent.columns.count
        let c = indexPath.item % parent.columns.count
        guard r > 0 else { return }
        activeRow = parent.rows[r - 1].id
        activeColumn = parent.columns[c].id
        view.becomeFirstResponder()
        if parent.columns[c].editable {
          edit(activeRow!, activeColumn!, view)
        } else {
          toggle(activeRow!)
        }
        view.reloadData()
      }
      func toggle(_ id: String) {
        var next = parent.selected
        if next.contains(id) { next.remove(id) } else { next.insert(id) }
        parent.onSelection(next)
      }
      func key(_ key: String, _ view: UICollectionView) {
        guard !parent.rows.isEmpty else { return }
        var r = parent.rows.firstIndex { $0.id == activeRow } ?? 0
        var c = parent.columns.firstIndex { $0.id == activeColumn } ?? 0
        switch key {
        case UIKeyCommand.inputUpArrow: r -= 1
        case UIKeyCommand.inputDownArrow: r += 1
        case UIKeyCommand.inputLeftArrow: c -= 1
        case UIKeyCommand.inputRightArrow: c += 1
        case " ":
          toggle(parent.rows[r].id)
          return
        case "\r":
          edit(parent.rows[r].id, parent.columns[c].id, view)
          return
        case "+", "-":
          let id = parent.columns[c].id
          parent.configuration.widths[id] = min(
            480, max(96, parent.configuration.width(id) + (key == "+" ? 16 : -16)))
          return
        default: return
        }
        r = min(parent.rows.count - 1, max(0, r))
        c = min(parent.columns.count - 1, max(0, c))
        activeRow = parent.rows[r].id
        activeColumn = parent.columns[c].id
        let index = IndexPath(item: (r + 1) * parent.columns.count + c, section: 0)
        view.scrollToItem(
          at: index, at: [.centeredVertically, .centeredHorizontally], animated: false)
        view.reloadData()
        if UIAccessibility.isVoiceOverRunning {
          UIAccessibility.post(notification: .layoutChanged, argument: view.cellForItem(at: index))
        }
      }
      func edit(_ rowId: String, _ colId: String, _ view: UICollectionView) {
        guard let row = parent.rows.first(where: { $0.id == rowId }),
          let col = parent.columns.first(where: { $0.id == colId }), col.editable
        else { return }
        var responder: UIResponder? = view
        while responder != nil && !(responder is UIViewController) { responder = responder?.next }
        guard let presenter = responder as? UIViewController,
          presenter.presentedViewController == nil
        else { return }
        let alert = UIAlertController(
          title: "编辑 \(col.label)", message: nil, preferredStyle: .alert)
        alert.addTextField {
          $0.text = row.cells[colId] ?? ""
          $0.accessibilityLabel = col.label
        }
        alert.addAction(UIAlertAction(title: "取消", style: .cancel))
        alert.addAction(
          UIAlertAction(title: "保存", style: .default) { [weak self, weak alert] _ in
            guard let self, self.parent.rows.contains(where: { $0.id == rowId }),
              self.parent.columns.contains(where: { $0.id == colId && $0.editable })
            else { return }
            self.parent.onCommit(rowId, colId, alert?.textFields?.first?.text ?? "")
          })
        presenter.present(alert, animated: !UIAccessibility.isReduceMotionEnabled)
      }
    }
  }
#endif
