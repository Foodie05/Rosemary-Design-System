import SwiftUI

public struct RosemaryOption<Value: Hashable>: Identifiable {
  public let value: Value
  public let label: String
  public let disabled: Bool
  public var id: Value { value }
  public init(_ value: Value, label: String, disabled: Bool = false) {
    self.value = value
    self.label = label
    self.disabled = disabled
  }
}
public struct RosemarySelect<Value: Hashable>: View {
  private var p = RosemaryPalette()
  let label: String
  let options: [RosemaryOption<Value>]
  let error: String?
  @Binding var selection: Value?
  @Binding var open: Bool
  @State private var cursor: Int = 0
  @State private var prefix = ""
  @State private var prefixTime = Date.distantPast
  @FocusState private var focus: Bool
  public init(
    _ label: String, selection: Binding<Value?>, isExpanded: Binding<Bool>,
    options: [RosemaryOption<Value>], error: String? = nil
  ) {
    self.label = label
    _selection = selection
    _open = isExpanded
    self.options = options
    self.error = error
  }
  private func move(_ delta: Int) {
    guard !options.isEmpty else { return }
    for offset in 1...options.count {
      let i = (cursor + offset * delta + options.count * 2) % options.count
      if !options[i].disabled {
        cursor = i
        return
      }
    }
  }
  private func choose(_ i: Int) {
    guard options.indices.contains(i), !options[i].disabled else { return }
    selection = options[i].value
    open = false
    focus = true
  }
  private func expand() {
    open.toggle()
    cursor =
      options.firstIndex { $0.value == selection } ?? options.firstIndex { !$0.disabled } ?? 0
  }
  private var selectedLabel: String { options.first { $0.value == selection }?.label ?? label }
  private func optionRow(_ i: Int, _ o: RosemaryOption<Value>) -> some View {
    Button {
      choose(i)
    } label: {
      HStack {
        Text(o.label).frame(maxWidth: .infinity, alignment: .leading)
        if o.value == selection { RosemaryIcon("check") }
      }.padding(12).frame(minHeight: 44).foregroundStyle(
        o.disabled ? p.colors.muted : p.colors.ink
      ).background(cursor == i ? p.colors.primarySoft : p.colors.surface)
    }.buttonStyle(.plain).disabled(o.disabled).id(i).accessibilityAddTraits(
      o.value == selection ? .isSelected : [])
  }
  private var optionsPanel: some View {
    ScrollViewReader { proxy in
      ScrollView {
        VStack(spacing: 0) {
          ForEach(Array(options.enumerated()), id: \.element.id) { i, o in
            optionRow(i, o)
          }
        }
      }.onAppear { proxy.scrollTo(cursor, anchor: .center) }
        .onChange(of: cursor) { _, value in proxy.scrollTo(value, anchor: .center) }
    }.background(p.colors.surface, in: RoundedRectangle(cornerRadius: 8))
      .overlay(
        RoundedRectangle(cornerRadius: 8).stroke(p.colors.control, lineWidth: p.stroke)
      )
      .onKeyPress(.escape) {
        open = false
        focus = true
        return .handled
      }
      .onKeyPress(.tab) {
        open = false
        return .ignored
      }
  }
  private var trigger: some View {
    Button(action: expand) {
      HStack {
        Text(selectedLabel).frame(
          maxWidth: .infinity, alignment: .leading)
        RosemaryIcon("down")
      }
    }.buttonStyle(.plain).modifier(RosemaryFieldFrame(invalid: error != nil, focused: focus))
      .focused($focus).accessibilityLabel(label).accessibilityValue(
        "\(options.first { $0.value == selection }?.label ?? ""), \(open ? p.text("Expanded"):p.text("Collapsed"))"
      )
      .onKeyPress(.downArrow) {
        if !open { expand() } else { move(1) }
        return .handled
      }
      .onKeyPress(.upArrow) {
        if !open { expand() } else { move(-1) }
        return .handled
      }
      .onKeyPress(.home) {
        cursor = options.firstIndex { !$0.disabled } ?? 0
        return .handled
      }
      .onKeyPress(.end) {
        cursor = options.lastIndex { !$0.disabled } ?? 0
        return .handled
      }
      .onKeyPress(.return) {
        if open { choose(cursor) } else { expand() }
        return .handled
      }
      .onKeyPress(.escape) {
        open = false
        return .handled
      }
      .onKeyPress(.tab) {
        open = false
        return .ignored
      }
      .onKeyPress(phases: .down) { key in
        guard open, !key.characters.isEmpty, key.characters.first?.isLetter == true else {
          return .ignored
        }
        if Date().timeIntervalSince(prefixTime) > 0.7 { prefix = "" }
        prefix += key.characters.lowercased()
        prefixTime = Date()
        if let i = options.firstIndex(where: {
          !$0.disabled && $0.label.lowercased().hasPrefix(prefix)
        }) {
          cursor = i
        }
        return .handled
      }

  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(label).rosemaryTypography(.small, weight: .medium).foregroundStyle(p.colors.ink)
      trigger.overlay(alignment: .topLeading) {
        if open {
          RosemaryAnchoredLayer(
            width: 280, height: min(240, CGFloat(options.count) * 44),
            dismissOutside: { open = false }
          ) { optionsPanel }
        }
      }
      if let error { Text(error).rosemaryTypography(.caption).foregroundStyle(p.colors.danger) }
    }.zIndex(open ? 50 : 0).onDisappear {
      open = false
      prefix = ""
    }
  }
}

public struct RosemaryTabs<Value: Hashable, Content: View>: View {
  private var p = RosemaryPalette()
  let options: [RosemaryOption<Value>]
  let content: (Value) -> Content
  @Binding var selection: Value
  @Namespace private var namespace
  @FocusState private var focusedTab: Value?
  public init(
    selection: Binding<Value>, tabs: [RosemaryOption<Value>],
    @ViewBuilder content: @escaping (Value) -> Content
  ) {
    _selection = selection
    options = tabs
    self.content = content
  }
  private func move(_ delta: Int) {
    guard let current = options.firstIndex(where: { $0.value == selection }), !options.isEmpty
    else { return }
    for offset in 1...options.count {
      let i = (current + offset * delta + options.count * 2) % options.count
      if !options[i].disabled {
        activate(options[i].value)
        return
      }
    }
  }
  private func activate(_ value: Value) {
    withAnimation(p.reduce ? nil : .easeInOut(duration: RosemaryNativeMetrics.duration("tabsMs"))) {
      selection = value
    }
    focusedTab = value
  }
  @Environment(\.layoutDirection) var direction
  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      ScrollView(.horizontal) {
        HStack(spacing: 16) {
          ForEach(options) { o in
            Button {
              activate(o.value)
            } label: {
              VStack(spacing: 8) {
                Text(o.label).rosemaryTypography(
                  .body, weight: selection == o.value ? .semibold : .regular
                )
                .foregroundStyle(selection == o.value ? p.colors.primary : p.colors.muted)
                .padding(.vertical, 8)
                ZStack {
                  Rectangle().fill(.clear).frame(height: 2)
                  if selection == o.value {
                    Rectangle().fill(p.colors.primary).frame(height: 2).matchedGeometryEffect(
                      id: "indicator", in: namespace)
                  }
                }
              }.fixedSize(horizontal: true, vertical: false).frame(minHeight: 44)
            }.buttonStyle(.plain).disabled(o.disabled).focused($focusedTab, equals: o.value)
              .accessibilityAddTraits(
                selection == o.value ? .isSelected : []
              ).onKeyPress(.rightArrow) {
                move(direction == .rightToLeft ? -1 : 1)
                return .handled
              }.onKeyPress(.leftArrow) {
                move(direction == .rightToLeft ? 1 : -1)
                return .handled
              }.onKeyPress(.home) {
                if let first = options.first(where: { !$0.disabled }) { activate(first.value) }
                return .handled
              }.onKeyPress(.end) {
                if let last = options.last(where: { !$0.disabled }) { activate(last.value) }
                return .handled
              }
          }
        }
      }.scrollIndicators(.hidden)
      ZStack(alignment: .topLeading) {
        content(selection).id(selection).transition(p.reduce ? .identity : .opacity)
      }
    }.animation(
      p.reduce ? nil : .easeInOut(duration: RosemaryNativeMetrics.duration("tabsMs")),
      value: selection)
  }
}
public struct RosemaryBreadcrumbItem: Identifiable {
  public let id: String
  public let label: String
  public let action: (() -> Void)?
  public init(_ id: String, label: String, action: (() -> Void)? = nil) {
    self.id = id
    self.label = label
    self.action = action
  }
}
public struct RosemaryBreadcrumb: View {
  private var p = RosemaryPalette()
  let items: [RosemaryBreadcrumbItem]
  @Environment(\.layoutDirection) var direction
  public init(_ items: [RosemaryBreadcrumbItem]) { self.items = items }
  public var body: some View {
    ScrollView(.horizontal) {
      HStack(spacing: 4) {
        ForEach(Array(items.enumerated()), id: \.element.id) { i, item in
          if i > 0 {
            RosemaryIcon("chevron", size: 16).rotationEffect(
              .degrees(direction == .rightToLeft ? 180 : 0)
            ).foregroundStyle(p.colors.muted)
          }
          if let action = item.action {
            RosemaryButton(item.label, variant: .quiet, action: action)
          } else {
            Text(item.label).rosemaryTypography(.small).foregroundStyle(p.colors.ink)
              .accessibilityValue(
                p.text("Current page"))
          }
        }
      }
    }.scrollIndicators(.hidden).accessibilityLabel(p.text("Breadcrumb"))
  }
}
public struct RosemaryPagination: View {
  private var p = RosemaryPalette()
  @Binding var page: Int
  let count: Int
  let onChange: (Int) -> Void
  public init(page: Binding<Int>, pageCount: Int, onChange: @escaping (Int) -> Void = { _ in }) {
    precondition(pageCount >= 1)
    _page = page
    count = pageCount
    self.onChange = onChange
  }
  private func set(_ n: Int) {
    let v = max(1, min(count, n))
    if v != page {
      page = v
      onChange(v)
    }
  }
  public var body: some View {
    HStack {
      RosemaryIconButton("chevron", label: p.text("Previous page"), rotation: .degrees(180)) {
        set(page - 1)
      }.disabled(page <= 1)
      Text("\(page) / \(count)").monospacedDigit().foregroundStyle(p.colors.ink).accessibilityLabel(
        p.format("Page %d of %d", page, count))
      RosemaryIconButton("chevron", label: p.text("Next page")) { set(page + 1) }.disabled(
        page >= count)
    }.accessibilityElement(children: .contain).accessibilityAdjustableAction { d in
      set(page + (d == .increment ? 1 : -1))
    }
  }
}
public struct RosemaryMenuAction: Identifiable {
  public let id: String
  public let title: String
  public let icon: String?
  public let disabled: Bool
  public let destructive: Bool
  public let action: () -> Void
  public init(
    _ id: String, title: String, icon: String? = nil, disabled: Bool = false,
    destructive: Bool = false, action: @escaping () -> Void
  ) {
    self.id = id
    self.title = title
    self.icon = icon
    self.disabled = disabled
    self.destructive = destructive
    self.action = action
  }
}
/// Disclosure action list: native focus traversal, no unsupported menu role.
public struct RosemaryMenu: View {
  private var p = RosemaryPalette()
  let label: String
  let actions: [RosemaryMenuAction]
  @Binding var open: Bool
  @FocusState private var triggerFocused: Bool
  public init(_ label: String, isExpanded: Binding<Bool>, actions: [RosemaryMenuAction]) {
    self.label = label
    _open = isExpanded
    self.actions = actions
  }
  public var body: some View {
    Button { open.toggle() } label: {
      HStack {
        Text(label)
        RosemaryIcon("down")
      }
    }.buttonStyle(RosemaryButtonStyle(.secondary)).focused($triggerFocused)
      .accessibilityLabel(label)
      .accessibilityValue(open ? p.text("Expanded") : p.text("Collapsed"))
      .overlay(alignment: .topLeading) {
        if open {
          RosemaryAnchoredLayer(
            width: 280, height: min(300, CGFloat(actions.count) * 44 + 32),
            dismissOutside: { open = false }
          ) {
            RosemaryCard {
              ScrollView {
                VStack(alignment: .leading, spacing: 0) {
                  ForEach(actions) { a in
                    Button {
                      a.action()
                      open = false
                      triggerFocused = true
                    } label: {
                      HStack {
                        if let icon = a.icon { RosemaryIcon(icon) }
                        Text(a.title).frame(maxWidth: .infinity, alignment: .leading)
                      }.padding(12).frame(minHeight: 44).foregroundStyle(
                        a.destructive ? p.colors.danger : p.colors.ink)
                    }.buttonStyle(.plain).disabled(a.disabled)
                  }
                }
              }
            }
          }
        }
      }.zIndex(open ? 50 : 0)
      .onKeyPress(.escape) {
        open = false
        triggerFocused = true
        return .handled
      }
      .onKeyPress(.tab) {
        open = false
        return .ignored
      }
      .onDisappear { open = false }
  }
}

public struct RosemaryList<Data: RandomAccessCollection, Row: View>: View
where Data.Element: Identifiable {
  private var p = RosemaryPalette()
  let data: Data
  let row: (Data.Element) -> Row
  let onSelect: ((Data.Element) -> Void)?
  public init(
    _ data: Data, onSelect: ((Data.Element) -> Void)? = nil,
    @ViewBuilder row: @escaping (Data.Element) -> Row
  ) {
    self.data = data
    self.row = row
    self.onSelect = onSelect
  }
  public var body: some View {
    LazyVStack(spacing: 0) {
      ForEach(data) { item in
        Group {
          if let onSelect {
            Button {
              onSelect(item)
            } label: {
              row(item).frame(maxWidth: .infinity, alignment: .leading).padding(12).frame(
                minHeight: 44)
            }.buttonStyle(.plain)
          } else {
            row(item).frame(maxWidth: .infinity, alignment: .leading).padding(12)
          }
        }
        Rectangle().fill(p.colors.border).frame(height: p.stroke).accessibilityHidden(true)
      }
    }.foregroundStyle(p.colors.ink)
  }
}
public struct RosemaryTableColumn<Row>: Identifiable {
  public let id: String
  public let title: String
  public let value: (Row) -> String
  public let sort: ((Row, Row) -> Bool)?
  public init(
    _ id: String, title: String, value: @escaping (Row) -> String, sort: ((Row, Row) -> Bool)? = nil
  ) {
    self.id = id
    self.title = title
    self.value = value
    self.sort = sort
  }
}
public struct RosemaryTable<Row: Identifiable>: View {
  private var p = RosemaryPalette()
  let rows: [Row]
  let columns: [RosemaryTableColumn<Row>]
  @Binding var sortedColumn: String?
  @Binding var ascending: Bool
  public init(
    rows: [Row], columns: [RosemaryTableColumn<Row>], sortedColumn: Binding<String?>,
    ascending: Binding<Bool>
  ) {
    self.rows = rows
    self.columns = columns
    _sortedColumn = sortedColumn
    _ascending = ascending
  }
  private var sorted: [Row] {
    guard let compare = columns.first(where: { $0.id == sortedColumn })?.sort else { return rows }
    return rows.sorted { ascending ? compare($0, $1) : compare($1, $0) }
  }
  public var body: some View {
    ScrollView(.horizontal) {
      Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 12) {
        GridRow {
          ForEach(columns) { c in
            Button {
              if sortedColumn == c.id {
                ascending.toggle()
              } else {
                sortedColumn = c.id
                ascending = true
              }
            } label: {
              HStack {
                Text(c.title).rosemaryTypography(.small, weight: .semibold)
                if c.sort != nil {
                  RosemaryIcon(
                    "down", size: 14,
                    rotation: .degrees(sortedColumn == c.id && !ascending ? 0 : 180))
                }
              }.frame(minHeight: 44)
            }.buttonStyle(.plain).disabled(c.sort == nil).accessibilityValue(
              sortedColumn == c.id
                ? ascending ? p.text("Ascending") : p.text("Descending") : p.text("Unsorted"))
          }
        }
        ForEach(sorted) { row in
          GridRow {
            ForEach(columns) { c in
              Text(c.value(row)).rosemaryTypography(.body).accessibilityLabel(
                "\(c.title): \(c.value(row))"
              )
              .frame(minHeight: 44)
            }
          }.accessibilityElement(children: .combine)
        }
      }.padding(16).foregroundStyle(p.colors.ink).background(
        p.colors.surface, in: RoundedRectangle(cornerRadius: 12)
      ).overlay(RoundedRectangle(cornerRadius: 12).stroke(p.colors.border, lineWidth: p.stroke))
    }
  }
}
public enum RosemaryStepState { case upcoming, current, complete, error, unavailable }
public struct RosemaryStep: Identifiable {
  public let id: String
  public let title: String
  public let state: RosemaryStepState
  public let canEnter: Bool
  public init(_ id: String, title: String, state: RosemaryStepState, canEnter: Bool = false) {
    self.id = id
    self.title = title
    self.state = state
    self.canEnter = canEnter
  }
}
public struct RosemaryStepper: View {
  private var p = RosemaryPalette()
  let steps: [RosemaryStep]
  let onSelect: (String) -> Void
  public init(_ steps: [RosemaryStep], onSelect: @escaping (String) -> Void = { _ in }) {
    self.steps = steps
    self.onSelect = onSelect
  }
  private func label(_ i: Int, _ s: RosemaryStep) -> some View {
    HStack(spacing: 12) {
      ZStack {
        Circle().fill(s.state == .current ? p.colors.primary : p.colors.primarySoft)
        if s.state == .complete {
          RosemaryIcon("check", size: 16).foregroundStyle(p.colors.success)
        } else if s.state == .error {
          RosemaryIcon("warning", size: 16).foregroundStyle(p.colors.danger)
        } else {
          Text("\(i+1)").rosemaryTypography(.caption, weight: .bold).foregroundStyle(
            s.state == .current ? p.colors.onPrimary : p.colors.primary)
        }
      }.frame(width: 28, height: 28)
      Text(s.title).foregroundStyle(p.colors.ink).frame(maxWidth: .infinity, alignment: .leading)
    }.frame(minHeight: 44).accessibilityLabel(
      p.format("Step %d of %d, %@", i + 1, steps.count, s.title)
    ).accessibilityValue(p.text(String(describing: s.state)))
  }
  public var body: some View {
    VStack(spacing: 4) {
      ForEach(Array(steps.enumerated()), id: \.element.id) { i, s in
        if s.canEnter && s.state != .unavailable {
          Button {
            onSelect(s.id)
          } label: {
            label(i, s)
          }.buttonStyle(.plain)
        } else {
          label(i, s)
        }
      }
    }
  }
}
