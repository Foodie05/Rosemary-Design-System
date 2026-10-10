import SwiftUI
import UniformTypeIdentifiers

public struct RosemaryAction: Identifiable {
  public let id, label: String
  public let action: (() -> Void)?
  public let destructive: Bool
  public init(_ id: String, _ label: String, destructive: Bool = false, action: (() -> Void)?) {
    self.id = id
    self.label = label
    self.destructive = destructive
    self.action = action
  }
}
public struct RosemaryItem: Identifiable {
  public let id, label: String
  public let detail: String?
  public let enabled: Bool
  public init(_ id: String, _ label: String, detail: String? = nil, enabled: Bool = true) {
    self.id = id
    self.label = label
    self.detail = detail
    self.enabled = enabled
  }
}
public struct RosemaryColumn: Identifiable {
  public let id, label: String
  public let editable: Bool
  public init(_ id: String, _ label: String, editable: Bool = false) {
    self.id = id
    self.label = label
    self.editable = editable
  }
}
public struct RosemaryRecord: Identifiable {
  public let id: String
  public let cells: [String: String]
  public init(_ id: String, _ cells: [String: String]) {
    self.id = id
    self.cells = cells
  }
}
public struct RosemaryTreeNode: Identifiable {
  public let id, label: String
  public let children: [RosemaryTreeNode]
  public init(_ id: String, _ label: String, children: [RosemaryTreeNode] = []) {
    self.id = id
    self.label = label
    self.children = children
  }
}

public struct RosemaryButtonGroup: View {
  public let actions: [RosemaryAction]
  public init(_ actions: [RosemaryAction]) { self.actions = actions }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      ForEach(actions) { a in
        Button(a.label) { a.action?() }.disabled(a.action == nil).frame(minHeight: 44)
      }
    }
  }
}
public struct RosemarySplitButton: View {
  public let primary: RosemaryAction, actions: [RosemaryAction]
  public init(_ primary: RosemaryAction, actions: [RosemaryAction]) {
    self.primary = primary
    self.actions = actions
  }
  public var body: some View {
    HStack {
      RosemaryButton(primary.label, enabled: primary.action != nil) { primary.action?() }
      RosemaryDropdownMenu("更多操作", actions: actions)
    }
  }
}
public struct RosemaryLinkButton: View {
  public let label: String, url: URL
  public init(_ label: String, url: URL) {
    self.label = label
    self.url = url
  }
  public var body: some View { Link(label, destination: url).frame(minHeight: 44) }
}
/// iOS places the primary action in a host toolbar rather than inventing an Android floating layer.
public struct RosemaryFloatingActionButton: View {
  public let label, systemImage: String
  public let action: () -> Void
  public init(_ label: String, systemImage: String, action: @escaping () -> Void) {
    self.label = label
    self.systemImage = systemImage
    self.action = action
  }
  public var body: some View {
    Button(action: action) { Label(label, systemImage: systemImage).frame(minHeight: 44) }
      .buttonStyle(.borderedProminent)
  }
}
public struct RosemaryPasswordField: View {
  public let label: String
  @Binding public var value: String
  public var enabled: Bool
  public let error: String?
  @State private var hidden = true
  public init(_ label: String, value: Binding<String>, enabled: Bool = true, error: String? = nil) {
    self.label = label
    _value = value
    self.enabled = enabled
    self.error = error
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      Group {
        if hidden { SecureField(label, text: $value) } else { TextField(label, text: $value) }
      }.textFieldStyle(.roundedBorder).disabled(!enabled)
      Button(hidden ? "显示密码" : "隐藏密码") { hidden.toggle() }.disabled(!enabled).frame(minHeight: 44)
      if let error { Text(error).foregroundColor(.red) }
    }
  }
}
public struct RosemarySearchField: View {
  public let label: String
  @Binding public var value: String
  public init(_ label: String = "搜索", value: Binding<String>) {
    self.label = label
    _value = value
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      HStack {
        TextField(label, text: $value).textFieldStyle(.roundedBorder)
        Button("清除搜索") { value = "" }.disabled(value.isEmpty).frame(minHeight: 44)
      }
    }
  }
}
public struct RosemaryNumberField: View {
  public let label: String, range: ClosedRange<Double>, step: Double
  @Binding public var value: Double
  public let enabled: Bool
  @State private var draft = ""
  @State private var invalid = false
  public init(
    _ label: String, value: Binding<Double>, range: ClosedRange<Double> = 0...100, step: Double = 1,
    enabled: Bool = true
  ) {
    precondition(step > 0 && range.contains(value.wrappedValue))
    self.label = label
    _value = value
    self.range = range
    self.step = step
    self.enabled = enabled
  }
  private func commit() {
    guard enabled else { return }
    guard let n = Double(draft), n.isFinite, range.contains(n) else {
      invalid = true
      return
    }
    invalid = false
    value = n
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      TextField(label, text: $draft).textFieldStyle(.roundedBorder).onSubmit { commit() }.disabled(
        !enabled)
      if invalid {
        Text("请输入 \(range.lowerBound) 至 \(range.upperBound) 的数字").foregroundColor(.red)
          .accessibilityLabel("输入错误：数值超出范围")
      }
      Stepper("调整 \(label)", value: $value, in: range, step: step).disabled(!enabled).frame(
        minHeight: 44)
      Button("应用数值") { commit() }.disabled(!enabled).frame(minHeight: 44)
    }.onAppear { draft = String(value) }.onChange(of: value) {
      draft = String($0)
      invalid = false
    }
  }
}
public struct RosemaryRadio<Value: Hashable>: View {
  public let label: String, options: [RosemaryOption<Value>]
  @Binding public var value: Value?
  public init(_ label: String, value: Binding<Value?>, options: [RosemaryOption<Value>]) {
    self.label = label
    _value = value
    self.options = options
  }
  public var body: some View {
    VStack(alignment: .leading) {
      Text(label)
      ForEach(options) { o in
        Button {
          value = o.value
        } label: {
          Label(o.label, systemImage: o.value == value ? "largecircle.fill.circle" : "circle")
            .frame(minHeight: 44)
        }.disabled(!o.enabled).accessibilityValue(o.value == value ? "已选中" : "未选中")
      }
    }
  }
}
public struct RosemaryComboBox<Value: Hashable>: View {
  public let label: String, options: [RosemaryOption<Value>]
  @Binding public var query: String
  public let onSelected: (Value) -> Void
  @State private var active: Value?
  @Environment(\.isEnabled) private var enabled
  public init(
    _ label: String, query: Binding<String>, options: [RosemaryOption<Value>],
    onSelected: @escaping (Value) -> Void
  ) {
    self.label = label
    _query = query
    self.options = options
    self.onSelected = onSelected
  }
  private var matches: [RosemaryOption<Value>] {
    options.filter { query.isEmpty || $0.label.localizedCaseInsensitiveContains(query) }
  }
  private func select(_ value: Value?) {
    if enabled, let o = options.first(where: { $0.value == value && $0.enabled }) {
      onSelected(o.value)
    }
  }
  public var body: some View {
    ScrollViewReader { proxy in
      VStack(alignment: .leading, spacing: 8) {
        Text(label)
        #if canImport(UIKit)
          RosemaryComboInput(
            label: label, query: $query, enabled: enabled,
            onKey: { key in
              let choices = matches.filter(\.enabled)
              if key == "confirm" {
                select(active)
                return
              }
              if key == "cancel" {
                active = nil
                return
              }
              guard enabled, !choices.isEmpty else { return }
              let old = choices.firstIndex(where: { $0.value == active })
              let next =
                old.map { ($0 + (key == "next" ? 1 : choices.count - 1)) % choices.count }
                ?? (key == "next" ? 0 : choices.count - 1)
              active = choices[next].value
              proxy.scrollTo(choices[next].value, anchor: .center)
            }
          ).frame(minHeight: 44)
        #else
          TextField(label, text: $query, onCommit: { select(active) }).textFieldStyle(
            .roundedBorder)
        #endif
        if matches.isEmpty { Text("没有匹配的选项") }
        ScrollView {
          LazyVStack(alignment: .leading, spacing: 0) {
            ForEach(matches) { o in
              Button(o.label) { select(o.value) }.frame(
                maxWidth: .infinity, minHeight: 44, alignment: .leading
              )
              .padding(.horizontal, 8).disabled(!o.enabled)
              .background(o.value == active ? Color.accentColor.opacity(0.12) : Color.clear)
              .accessibilityAddTraits(o.value == active ? .isSelected : []).id(o.value)
            }
          }
        }.frame(maxHeight: 240)
      }.onChange(of: query) { _ in active = nil }
        .onChange(of: options.map(\.value)) { _ in
          if !matches.contains(where: { $0.value == active && $0.enabled }) { active = nil }
        }
    }
  }
}
public struct RosemaryDatePicker: View {
  public let label: String, range: ClosedRange<Date>
  @Binding public var value: Date
  public init(_ label: String, value: Binding<Date>, range: ClosedRange<Date>) {
    self.label = label
    _value = value
    self.range = range
  }
  public var body: some View {
    DatePicker(label, selection: $value, in: range, displayedComponents: .date)
  }
}
public struct RosemaryTimePicker: View {
  public let label: String
  @Binding public var value: Date
  public init(_ label: String, value: Binding<Date>) {
    self.label = label
    _value = value
  }
  public var body: some View {
    DatePicker(label, selection: $value, displayedComponents: .hourAndMinute)
  }
}
/// Security-scoped access, persistence and upload remain the caller's responsibility.
public struct RosemaryFileUpload: View {
  public let label: String, files: [RosemaryItem], types: [UTType], error: String?
  public let onSelected: (Result<[URL], Error>) -> Void, onRemove: (String) -> Void
  public let busy: Bool
  @State private var open = false
  public init(
    _ label: String, files: [RosemaryItem], types: [UTType] = [.item], busy: Bool = false,
    error: String? = nil, onSelected: @escaping (Result<[URL], Error>) -> Void,
    onRemove: @escaping (String) -> Void
  ) {
    self.label = label
    self.files = files
    self.types = types
    self.busy = busy
    self.error = error
    self.onSelected = onSelected
    self.onRemove = onRemove
  }
  public var body: some View {
    VStack(alignment: .leading) {
      Text(label)
      Button("选择文件") { open = true }.disabled(busy).frame(minHeight: 44)
      ForEach(files) { f in
        VStack(alignment: .leading) {
          Text(f.label)
          if let detail = f.detail { Text(detail) }
          Button("移除 \(f.label)") { onRemove(f.id) }.disabled(busy).frame(minHeight: 44)
        }
      }
      if let error { Text(error).foregroundColor(.red) }
    }.fileImporter(
      isPresented: $open, allowedContentTypes: types, allowsMultipleSelection: true,
      onCompletion: onSelected)
  }
}
public struct RosemaryColorPicker: View {
  public let label: String
  @Binding public var value: Color
  public init(_ label: String, value: Binding<Color>) {
    self.label = label
    _value = value
  }
  public var body: some View { ColorPicker(label, selection: $value, supportsOpacity: false) }
}
public struct RosemarySegmentedControl<Value: Hashable>: View {
  public let label: String, options: [RosemaryOption<Value>]
  @Binding public var value: Value
  @Environment(\.sizeCategory) private var size
  public init(_ label: String, value: Binding<Value>, options: [RosemaryOption<Value>]) {
    self.label = label
    _value = value
    self.options = options
  }
  public var body: some View {
    Group {
      if size.isAccessibilityCategory {
        VStack(alignment: .leading) {
          Text(label)
          ForEach(options) { o in
            Button {
              value = o.value
            } label: {
              Label(o.label, systemImage: o.value == value ? "checkmark.circle" : "circle").frame(
                minHeight: 44)
            }.disabled(!o.enabled)
          }
        }
      } else {
        Picker(label, selection: $value) {
          ForEach(options) { o in Text(o.label).tag(o.value).disabled(!o.enabled) }
        }.pickerStyle(.menu)
      }
    }
  }
}
public struct RosemaryBreadcrumb: View {
  public let ancestors: [RosemaryAction], current: String
  public init(_ ancestors: [RosemaryAction], current: String) {
    self.ancestors = ancestors
    self.current = current
  }
  public var body: some View {
    VStack(alignment: .leading) {
      ForEach(ancestors) { a in
        Button(a.label) { a.action?() }.disabled(a.action == nil).frame(minHeight: 44)
      }
      Text(current).accessibilityValue("当前页面")
    }
  }
}
public struct RosemarySidebar: View {
  public let items: [RosemaryItem]
  @Binding public var value: String
  public init(_ items: [RosemaryItem], value: Binding<String>) {
    self.items = items
    _value = value
  }
  public var body: some View {
    List(items) { i in
      Button {
        value = i.id
      } label: {
        HStack {
          Text(i.label)
          if i.id == value { Image(systemName: "checkmark") }
        }.frame(minHeight: 44)
      }.disabled(!i.enabled).accessibilityValue(i.id == value ? "已选中" : "未选中")
    }
  }
}
extension View {
  /// Attach to the host's NavigationView/NavigationStack content; native back owns the stack.
  public func rosemaryTopNavigation(
    _ title: String, onBack: (() -> Void)? = nil, actions: [RosemaryAction] = []
  ) -> some View {
    navigationTitle(title).toolbar {
      ToolbarItem(placement: .navigation) { if let onBack { Button("返回", action: onBack) } }
      ToolbarItemGroup(placement: .primaryAction) {
        ForEach(actions) { a in Button(a.label) { a.action?() }.disabled(a.action == nil) }
      }
    }
  }
}
public struct RosemaryTopNavigation: View {
  public let title: String, actions: [RosemaryAction]
  public let onBack: (() -> Void)?
  public init(_ title: String, onBack: (() -> Void)? = nil, actions: [RosemaryAction] = []) {
    self.title = title
    self.onBack = onBack
    self.actions = actions
  }
  public var body: some View {
    NavigationView { Color.clear.rosemaryTopNavigation(title, onBack: onBack, actions: actions) }
      .rosemaryNavigationStyle().frame(minHeight: 140)
  }
}
public struct RosemaryBottomNavigation<Content: View>: View {
  public let items: [RosemaryItem]
  @Binding public var value: String
  private let content: (String) -> Content
  public init(
    _ items: [RosemaryItem], value: Binding<String>,
    @ViewBuilder content: @escaping (String) -> Content
  ) {
    self.items = items
    _value = value
    self.content = content
  }
  public var body: some View {
    TabView(selection: $value) {
      ForEach(items.filter { $0.enabled }) { i in
        content(i.id).tabItem { Label(i.label, systemImage: "circle") }.tag(i.id)
      }
    }
  }
}
public struct RosemaryPagination: View {
  public let page, count: Int, onChanged: (Int) -> Void
  public init(page: Int, count: Int, onChanged: @escaping (Int) -> Void) {
    precondition(count > 0 && (0..<count).contains(page))
    self.page = page
    self.count = count
    self.onChanged = onChanged
  }
  public var body: some View {
    VStack {
      Button("上一页") { onChanged(page - 1) }.disabled(page == 0).frame(minHeight: 44)
      Text("\(page+1) / \(count)")
      Button("下一页") { onChanged(page + 1) }.disabled(page == count - 1).frame(minHeight: 44)
    }
  }
}
public struct RosemaryStepper<Content: View>: View {
  public let labels: [String]
  @Binding public var value: Int
  private let content: (Int) -> Content
  public init(
    _ labels: [String], value: Binding<Int>, @ViewBuilder content: @escaping (Int) -> Content
  ) {
    precondition(labels.indices.contains(value.wrappedValue))
    self.labels = labels
    _value = value
    self.content = content
  }
  public var body: some View {
    VStack(alignment: .leading) {
      ForEach(labels.indices, id: \.self) { i in
        Button("\(i+1). \(labels[i])") { value = i }.accessibilityValue(i == value ? "当前步骤" : "")
          .frame(minHeight: 44)
      }
      content(value)
      RosemaryPagination(page: value, count: labels.count) { value = $0 }
    }
  }
}
public struct RosemaryCommandPalette: View {
  public let actions: [RosemaryAction], onClose: () -> Void
  @State private var query = ""
  public init(_ actions: [RosemaryAction], onClose: @escaping () -> Void) {
    self.actions = actions
    self.onClose = onClose
  }
  public var body: some View {
    #if canImport(UIKit)
      RosemaryNativeCommands(actions: actions, onClose: onClose).frame(height: 400)
    #else
      VStack {
        RosemarySearchField("搜索命令", value: $query)
        ScrollView {
          RosemaryButtonGroup(
            actions.filter { query.isEmpty || $0.label.localizedCaseInsensitiveContains(query) }.map
            {
              a in
              RosemaryAction(
                a.id, a.label,
                action: a.action.map { action in
                  {
                    onClose()
                    action()
                  }
                })
            })
        }
      }
    #endif
  }
}
public struct RosemaryList: View {
  public let items: [RosemaryItem], selected: String?
  public let onActivate: ((String) -> Void)?
  public init(
    _ items: [RosemaryItem], selected: String? = nil, onActivate: ((String) -> Void)? = nil
  ) {
    self.items = items
    self.selected = selected
    self.onActivate = onActivate
  }
  public var body: some View {
    LazyVStack(alignment: .leading, spacing: 16) {
      ForEach(items) { i in
        VStack(alignment: .leading) {
          if let onActivate {
            Button {
              i.enabled ? onActivate(i.id) : ()
            } label: {
              Text(i.label).frame(minHeight: 44)
            }.disabled(!i.enabled).accessibilityValue(i.id == selected ? "已选中" : "")
          } else {
            Text(i.label)
          }
          if let detail = i.detail { Text(detail) }
        }
      }
    }
  }
}
public struct RosemaryDescriptionList: View {
  public let values: [RosemaryItem]
  public init(_ values: [RosemaryItem]) { self.values = values }
  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      ForEach(values) { i in
        VStack(alignment: .leading) {
          Text(i.label).font(.headline)
          Text(i.detail ?? "")
        }.accessibilityElement(children: .combine)
      }
    }
  }
}
public struct RosemaryTable: View {
  public let columns: [RosemaryColumn], rows: [RosemaryRecord], sortColumn: String?
  public let ascending: Bool, onSort: ((String, Bool) -> Void)?
  public init(
    columns: [RosemaryColumn], rows: [RosemaryRecord], sortColumn: String? = nil,
    ascending: Bool = true, onSort: ((String, Bool) -> Void)? = nil
  ) {
    self.columns = columns
    self.rows = rows
    self.sortColumn = sortColumn
    self.ascending = ascending
    self.onSort = onSort
  }
  public var body: some View {
    VStack(alignment: .leading) {
      if let onSort {
        ForEach(columns) { c in
          Button("按\(c.label)排序") { onSort(c.id, sortColumn == c.id ? !ascending : true) }.frame(
            minHeight: 44)
        }
      }
      LazyVStack {
        ForEach(rows) { row in
          RosemaryCard {
            RosemaryDescriptionList(
              columns.map { RosemaryItem($0.id, $0.label, detail: row.cells[$0.id] ?? "") })
          }
        }
      }
    }
  }
}
private struct RosemaryGridCell: View {
  let row, column, value: String, onCommit: (String) -> Void
  @State private var draft = ""
  var body: some View {
    VStack(alignment: .leading) {
      TextField(column, text: $draft).textFieldStyle(.roundedBorder).onSubmit { onCommit(draft) }
      Button("保存 \(column)") { onCommit(draft) }.disabled(draft == value).frame(minHeight: 44)
    }.onAppear { draft = value }.onChange(of: value) { draft = $0 }
  }
}
public struct RosemaryDataGrid: View {
  public let columns: [RosemaryColumn], rows: [RosemaryRecord]
  @Binding public var selected: Set<String>
  public let onCellCommit: (String, String, String) -> Void
  @StateObject private var configuration: RosemaryGridConfiguration
  public init(
    columns: [RosemaryColumn], rows: [RosemaryRecord], selected: Binding<Set<String>>,
    configuration: RosemaryGridConfiguration? = nil,
    onCellCommit: @escaping (String, String, String) -> Void
  ) {
    precondition(!columns.isEmpty && Set(rows.map(\.id)).count == rows.count)
    self.columns = columns
    self.rows = rows
    _selected = selected
    self.onCellCommit = onCellCommit
    _configuration = StateObject(wrappedValue: configuration ?? RosemaryGridConfiguration())
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      ForEach(columns) { col in
        RosemarySearchField(
          "筛选 \(col.label)",
          value: Binding(
            get: { configuration.filters[col.id] ?? "" },
            set: { configuration.filters[col.id] = $0 }))
      }
      Text("\(configuration.visible(rows).count) 条记录 · \(selected.count) 项已选择")
      #if canImport(UIKit)
        RosemaryNativeGrid(
          columns: columns, rows: configuration.visible(rows), selected: selected,
          onSelection: { selected = $0 }, onCommit: onCellCommit, configuration: configuration
        ).frame(height: 400)
      #else
        ScrollView {
          LazyVStack {
            ForEach(configuration.visible(rows)) { row in
              RosemaryCard {
                VStack {
                  RosemaryCheckbox(
                    row.id,
                    value: Binding(
                      get: { selected.contains(row.id) },
                      set: { if $0 { selected.insert(row.id) } else { selected.remove(row.id) } }))
                  ForEach(columns) { col in
                    if col.editable {
                      RosemaryGridCell(
                        row: row.id, column: col.label, value: row.cells[col.id] ?? "",
                        onCommit: { onCellCommit(row.id, col.id, $0) })
                    } else {
                      Text("\(col.label): \(row.cells[col.id] ?? "")")
                    }
                  }
                }
              }
            }
          }
        }
      #endif
    }
  }
}
public struct RosemaryTreeView: View {
  public let nodes: [RosemaryTreeNode]
  @Binding public var expanded: Set<String>
  @Binding public var selected: String?
  public init(
    _ nodes: [RosemaryTreeNode], expanded: Binding<Set<String>>, selected: Binding<String?>
  ) {
    self.nodes = nodes
    _expanded = expanded
    _selected = selected
  }
  public var body: some View {
    #if canImport(UIKit)
      RosemaryNativeTree(nodes: nodes, expanded: $expanded, selected: $selected).frame(height: 400)
    #else
      ScrollView {
        LazyVStack(alignment: .leading) {
          ForEach(rosemaryVisibleTree(nodes, expanded), id: \.node.id) { entry in
            HStack {
              if !entry.node.children.isEmpty {
                Button(expanded.contains(entry.node.id) ? "收起" : "展开") {
                  if expanded.contains(entry.node.id) {
                    expanded.remove(entry.node.id)
                  } else {
                    expanded.insert(entry.node.id)
                  }
                }
              }
              Button(entry.node.label) { selected = entry.node.id }.accessibilityValue(
                selected == entry.node.id ? "已选中" : ""
              ).frame(minHeight: 44)
            }.padding(.leading, CGFloat(min(5, entry.depth) * 16))
          }
        }
      }.frame(height: 400)
    #endif
  }
}
public struct RosemaryBadge: View {
  public let label: String
  @Environment(\.colorScheme) private var scheme
  public init(_ label: String) { self.label = label }
  public var body: some View {
    Text(label).padding(.horizontal, 8).padding(.vertical, 4).background(
      RosemaryTheme(scheme: scheme).accent.opacity(0.12)
    ).clipShape(RoundedRectangle(cornerRadius: 8))
  }
}
public struct RosemaryTag: View {
  public let label: String, selected: Bool, onSelected: ((Bool) -> Void)?, onRemove: (() -> Void)?
  public init(
    _ label: String, selected: Bool = false, onSelected: ((Bool) -> Void)? = nil,
    onRemove: (() -> Void)? = nil
  ) {
    self.label = label
    self.selected = selected
    self.onSelected = onSelected
    self.onRemove = onRemove
  }
  public var body: some View {
    HStack {
      if let onSelected {
        Button(label) { onSelected(!selected) }.accessibilityValue(selected ? "已选中" : "未选中").frame(
          minHeight: 44)
      } else {
        Text(label)
      }
      if let onRemove { Button("移除 \(label)", action: onRemove).frame(minHeight: 44) }
    }.padding(8).overlay(RoundedRectangle(cornerRadius: 8).stroke(.secondary))
  }
}
public struct RosemaryAvatar: View {
  public let label, initials: String
  public let image: Image?
  public init(_ label: String, initials: String, image: Image? = nil) {
    self.label = label
    self.initials = initials
    self.image = image
  }
  public var body: some View {
    Group { if let image { image.resizable().scaledToFill() } else { Text(initials) } }.frame(
      width: 48, height: 48
    ).clipShape(Circle()).accessibilityElement(children: .ignore).accessibilityLabel(label)
      .accessibilityAddTraits(.isImage)
  }
}
public struct RosemarySheet<Content: View>: View {
  public let title: String, onClose: () -> Void
  private let content: Content
  public init(_ title: String, onClose: @escaping () -> Void, @ViewBuilder content: () -> Content) {
    self.title = title
    self.onClose = onClose
    self.content = content()
  }
  public var body: some View {
    NavigationView {
      ScrollView {
        VStack(alignment: .leading, spacing: 24) {
          Button("关闭", action: onClose).frame(minHeight: 44)
          content
        }.padding(24)
      }.navigationTitle(title)
    }.rosemaryNavigationStyle()
  }
}
public struct RosemaryToast: View {
  public let message: String
  public init(_ message: String) { self.message = message }
  public var body: some View {
    Text(message).padding(16).background(.regularMaterial).clipShape(
      RoundedRectangle(cornerRadius: 8)
    ).accessibilityElement(children: .combine)
  }
}
public struct RosemarySnackbar: View {
  public let message: String, action: RosemaryAction, onDismiss: () -> Void
  public init(_ message: String, action: RosemaryAction, onDismiss: @escaping () -> Void) {
    self.message = message
    self.action = action
    self.onDismiss = onDismiss
  }
  public var body: some View {
    VStack(alignment: .leading) {
      Text(message)
      Button(action.label) { action.action?() }.disabled(action.action == nil).frame(minHeight: 44)
      Button("关闭", action: onDismiss).frame(minHeight: 44)
    }.padding(16).background(.regularMaterial)
  }
}
public struct RosemaryBanner: View {
  public let title, message: String, actions: [RosemaryAction]
  public init(_ title: String, message: String, actions: [RosemaryAction] = []) {
    self.title = title
    self.message = message
    self.actions = actions
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(title).font(.headline).accessibilityAddTraits(.isHeader)
      Text(message)
      RosemaryButtonGroup(actions)
    }
  }
}
public struct RosemarySkeleton: View {
  public let label: String, lines: Int
  public init(_ label: String = "正在加载内容", lines: Int = 3) {
    self.label = label
    self.lines = lines
  }
  public var body: some View {
    VStack {
      ForEach(0..<lines, id: \.self) { _ in
        RoundedRectangle(cornerRadius: 4).fill(.secondary.opacity(0.15)).frame(height: 16)
      }
    }.accessibilityElement(children: .ignore).accessibilityLabel(label)
  }
}
public struct RosemaryTooltip<Content: View>: View {
  public let message: String
  private let content: Content
  public init(_ message: String, @ViewBuilder content: () -> Content) {
    self.message = message
    self.content = content()
  }
  public var body: some View { content.help(message).accessibilityHint(message) }
}
public struct RosemaryPopover<Content: View>: View {
  public let label: String
  private let content: Content
  @State private var open = false
  public init(_ label: String, @ViewBuilder content: () -> Content) {
    self.label = label
    self.content = content()
  }
  public var body: some View {
    Button(label) { open = true }.frame(minHeight: 44).popover(isPresented: $open) {
      RosemarySheet(label, onClose: { open = false }) { content }
    }
  }
}
final class RosemaryLiveActions: ObservableObject {
  var actions: [RosemaryAction] = []
  func invoke(_ id: String) { actions.first(where: { $0.id == id })?.action?() }
}
public struct RosemaryDropdownMenu: View {
  @StateObject private var live = RosemaryLiveActions()
  public let label: String, actions: [RosemaryAction]
  public init(_ label: String, actions: [RosemaryAction]) {
    self.label = label
    self.actions = actions
  }
  public var body: some View {
    let _ = live.actions = actions
    Menu(label) {
      ForEach(actions) { a in
        Button(role: a.destructive ? .destructive : nil) {
          live.invoke(a.id)
        } label: {
          Text(a.label)
        }.disabled(a.action == nil)
      }
    }.frame(minHeight: 44).disabled(!actions.contains { $0.action != nil })
  }
}
public struct RosemaryContextMenu<Content: View>: View {
  @StateObject private var live = RosemaryLiveActions()
  public let actions: [RosemaryAction]
  private let content: Content
  public init(_ actions: [RosemaryAction], @ViewBuilder content: () -> Content) {
    self.actions = actions
    self.content = content()
  }
  public var body: some View {
    let _ = live.actions = actions
    VStack(alignment: .leading, spacing: 8) {
      content.contextMenu {
        ForEach(actions) { a in
          Button(role: a.destructive ? .destructive : nil) {
            live.invoke(a.id)
          } label: {
            Text(a.label)
          }.disabled(a.action == nil)
        }
      }
      RosemaryDropdownMenu("更多操作", actions: actions)
    }
  }
}
public struct RosemaryDrawer<Content: View>: View {
  public let title: String, items: [RosemaryItem]
  @Binding public var value: String
  @Binding public var open: Bool
  private let content: Content
  public init(
    _ title: String, items: [RosemaryItem], value: Binding<String>, open: Binding<Bool>,
    @ViewBuilder content: () -> Content
  ) {
    self.title = title
    self.items = items
    _value = value
    _open = open
    self.content = content()
  }
  public var body: some View {
    content.sheet(isPresented: $open) {
      NavigationView {
        RosemarySidebar(
          items,
          value: Binding(
            get: { value },
            set: {
              value = $0
              open = false
            })
        ).navigationTitle(title).toolbar { Button("关闭") { open = false } }
      }
    }
  }
}
public struct RosemaryCard<Content: View>: View {
  private let content: Content
  @Environment(\.colorScheme) private var scheme
  public init(@ViewBuilder content: () -> Content) { self.content = content() }
  public var body: some View {
    content.padding(16).frame(maxWidth: .infinity, alignment: .leading).background(
      RosemaryTheme(scheme: scheme).surface
    ).overlay(RoundedRectangle(cornerRadius: 8).stroke(RosemaryTheme(scheme: scheme).border))
      .clipShape(RoundedRectangle(cornerRadius: 8))
  }
}
public struct RosemaryAccordion<Content: View>: View {
  public let label: String
  @Binding public var expanded: Bool
  private let content: Content
  public init(_ label: String, expanded: Binding<Bool>, @ViewBuilder content: () -> Content) {
    self.label = label
    _expanded = expanded
    self.content = content()
  }
  public var body: some View { DisclosureGroup(label, isExpanded: $expanded) { content } }
}
public struct RosemaryDivider: View {
  public init() {}
  public var body: some View { Divider().padding(.vertical, 16) }
}
public struct RosemaryScrollArea<Content: View>: View {
  private let content: Content
  public init(@ViewBuilder content: () -> Content) { self.content = content() }
  public var body: some View { ScrollView { content } }
}
public struct RosemaryResizablePanels<Leading: View, Trailing: View>: View {
  @Binding public var fraction: Double
  private let leading: Leading, trailing: Trailing
  @State private var dragStart: Double?
  @Environment(\.layoutDirection) private var direction
  public init(
    fraction: Binding<Double>, @ViewBuilder leading: () -> Leading,
    @ViewBuilder trailing: () -> Trailing
  ) {
    precondition((0.2...0.8).contains(fraction.wrappedValue))
    _fraction = fraction
    self.leading = leading()
    self.trailing = trailing()
  }
  public var body: some View {
    GeometryReader { geo in
      if geo.size.width < 600 {
        ScrollView {
          VStack(spacing: 24) {
            leading
            trailing
          }
        }
      } else {
        HStack(spacing: 0) {
          leading.frame(width: (geo.size.width - 44) * fraction)
          #if canImport(UIKit)
            RosemaryNativeSplit(
              fraction: fraction, width: Double(geo.size.width - 44),
              rtl: direction == .rightToLeft,
              onChange: { fraction = $0 }
            ).frame(width: 44, height: 44)
          #else
            Image(systemName: "line.3.horizontal").frame(width: 44, height: 44).contentShape(
              Rectangle()
            ).gesture(
              DragGesture().onChanged { event in
                if dragStart == nil { dragStart = fraction }
                fraction = min(
                  0.8,
                  max(
                    0.2,
                    (dragStart ?? fraction) + event.translation.width / (geo.size.width - 44)
                      * (direction == .rightToLeft ? -1 : 1)))
              }.onEnded { _ in dragStart = nil }
            ).accessibilityLabel("调整分栏").accessibilityValue("\(Int(fraction*100))%")
              .accessibilityAdjustableAction { adjust in
                fraction = min(0.8, max(0.2, fraction + (adjust == .increment ? 0.05 : -0.05)))
              }
          #endif
          trailing.frame(maxWidth: .infinity)
        }
      }
    }
  }
}
public struct RosemaryMetricCard: View {
  public let label, value, detail: String, series: [Double], trend: String?
  @Environment(\.colorScheme) private var scheme
  public init(
    _ label: String, value: String, detail: String = "", series: [Double] = [], trend: String? = nil
  ) {
    self.label = label
    self.value = value
    self.detail = detail
    self.series = series
    self.trend = trend
  }
  public var body: some View {
    let points = series.filter { $0.isFinite }
    let description =
      trend
      ?? (points.count < 2
        ? ""
        : points.last! > points.first! ? "趋势上升" : points.last! < points.first! ? "趋势下降" : "趋势稳定")
    RosemaryCard {
      VStack(alignment: .leading, spacing: 8) {
        Text(label)
        Text(value).font(.title)
        if !description.isEmpty { Text(description) }
        if points.count > 1 {
          GeometryReader { g in
            Path { path in
              let low = points.min()!
              let span = points.max()! - low
              for i in points.indices {
                let x = 2 + (g.size.width - 4) * Double(i) / Double(points.count - 1)
                let y =
                  span == 0
                  ? g.size.height / 2 : 2 + (g.size.height - 4) * (1 - (points[i] - low) / span)
                if i == 0 {
                  path.move(to: CGPoint(x: x, y: y))
                } else {
                  path.addLine(to: CGPoint(x: x, y: y))
                }
              }
            }.stroke(RosemaryTheme(scheme: scheme).accent, lineWidth: 1.75)
          }.frame(height: 48).accessibilityHidden(true)
        }
        if !detail.isEmpty { Text(detail) }
      }
    }
  }
}
public enum RosemaryHealth { case unknown, healthy, degraded, offline }
public struct RosemaryProberStatus: View {
  public let label, state: String, recovery: RosemaryAction?, health: RosemaryHealth,
    latency: TimeInterval?, checkedAt: Date?
  public init(
    _ label: String, state: String, recovery: RosemaryAction? = nil,
    health: RosemaryHealth = .unknown, latency: TimeInterval? = nil, checkedAt: Date? = nil
  ) {
    precondition(latency == nil || latency! >= 0)
    self.label = label
    self.state = state
    self.recovery = recovery
    self.health = health
    self.latency = latency
    self.checkedAt = checkedAt
  }
  private var icon: String {
    switch health {
    case .healthy: return "checkmark.circle"
    case .degraded: return "exclamationmark.triangle"
    case .offline: return "cloud.slash"
    case .unknown: return "questionmark.circle"
    }
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      HStack {
        Image(systemName: icon).frame(width: 20, height: 20).accessibilityHidden(true)
        Text(state)
      }
      if let latency { Text("响应时间 \(Int(latency*1000)) ms") }
      if let checkedAt { Text("检查时间 \(checkedAt.formatted())") }
      if let recovery {
        Button(recovery.label) { recovery.action?() }.disabled(recovery.action == nil).frame(
          minHeight: 44)
      }
    }
  }
}
public struct RosemaryFileMetadata {
  public let kind, size, sync: String
  public init(kind: String = "", size: String = "", sync: String = "") {
    self.kind = kind
    self.size = size
    self.sync = sync
  }
  public var description: String {
    [kind, size, sync].filter { !$0.isEmpty }.joined(separator: " · ")
  }
}
public struct RosemaryFileRow: View {
  public let file: RosemaryItem, actions: [RosemaryAction], metadata: RosemaryFileMetadata?,
    onOpen: (() -> Void)?
  @Binding public var selected: Bool
  public init(
    _ file: RosemaryItem, selected: Binding<Bool>, actions: [RosemaryAction] = [],
    metadata: RosemaryFileMetadata? = nil, onOpen: (() -> Void)? = nil
  ) {
    self.file = file
    _selected = selected
    self.actions = actions
    self.metadata = metadata
    self.onOpen = onOpen
  }
  public var body: some View {
    RosemaryContextMenu(file.enabled ? actions : []) {
      VStack(alignment: .leading, spacing: 8) {
        RosemaryCheckbox(file.label, value: $selected, enabled: file.enabled)
        if let detail = file.detail { Text(detail) }
        if let metadata, !metadata.description.isEmpty { Text(metadata.description) }
        if let onOpen {
          Button("打开 \(file.label)", action: onOpen).disabled(!file.enabled).frame(minHeight: 44)
        }
      }
    }
  }
}
