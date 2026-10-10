import SwiftUI

public struct RosemaryButton: View {
  public let label: String
  public var busy: Bool
  public var enabled: Bool
  public let action: () -> Void
  @Environment(\.colorScheme) private var scheme
  public init(
    _ label: String, busy: Bool = false, enabled: Bool = true, action: @escaping () -> Void
  ) {
    self.label = label
    self.busy = busy
    self.enabled = enabled
    self.action = action
  }
  public var body: some View {
    Button(action: action) {
      Text(label).padding(.horizontal, 24).frame(minHeight: 44)
        .overlay(alignment: .leading) {
          if busy {
            RosemarySpinner("正在处理").tint(RosemaryTheme(scheme: scheme).onAccent).frame(
              width: 16, height: 16
            ).accessibilityHidden(true)
          }
        }
    }.buttonStyle(.borderedProminent).tint(RosemaryTheme(scheme: scheme).accent)
      .disabled(!enabled || busy).accessibilityLabel(label).accessibilityValue(busy ? "正在处理" : "")
  }
}
public struct RosemaryIconButton: View {
  public let label, systemImage: String
  public var busy: Bool
  public var enabled: Bool
  public let action: () -> Void
  public init(
    _ label: String, systemImage: String, busy: Bool = false, enabled: Bool = true,
    action: @escaping () -> Void
  ) {
    self.label = label
    self.systemImage = systemImage
    self.busy = busy
    self.enabled = enabled
    self.action = action
  }
  public var body: some View {
    Button(action: action) {
      Group { if busy { RosemarySpinner("正在处理") } else { Image(systemName: systemImage) } }.frame(
        minWidth: 44, minHeight: 44)
    }
    .disabled(!enabled || busy).accessibilityLabel(label).accessibilityValue(busy ? "正在处理" : "")
  }
}
public struct RosemaryTextField: View {
  @Environment(\.colorScheme) private var scheme
  public let label: String
  @Binding public var value: String
  public var enabled: Bool
  public var error: String?
  public init(_ label: String, value: Binding<String>, enabled: Bool = true, error: String? = nil) {
    self.label = label
    self._value = value
    self.enabled = enabled
    self.error = error
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      TextField(label, text: $value).textFieldStyle(.roundedBorder).disabled(!enabled)
        .accessibilityLabel(label)
      if let error {
        Text(error).foregroundColor(RosemaryTheme(scheme: scheme).danger).font(.callout)
      }
    }.accessibilityElement(children: .contain)
  }
}
public struct RosemaryTextArea: View {
  public let label: String
  @Binding public var value: String
  public var enabled: Bool
  public var error: String?
  @Environment(\.colorScheme) private var scheme
  public init(_ label: String, value: Binding<String>, enabled: Bool = true, error: String? = nil) {
    self.label = label
    self._value = value
    self.enabled = enabled
    self.error = error
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      TextEditor(text: $value).frame(minHeight: 120)
        .padding(8).overlay(
          RoundedRectangle(cornerRadius: 8).stroke(RosemaryTheme(scheme: scheme).border)
        ).disabled(!enabled).accessibilityLabel(label).accessibilityHint(error ?? "")
      if let error {
        Text(error).foregroundColor(RosemaryTheme(scheme: scheme).danger).accessibilityLabel(
          "输入错误：\(error)")
      }
    }
  }
}
public struct RosemaryCheckbox: View {
  public let label: String
  @Binding public var value: Bool
  public var enabled: Bool
  public init(_ label: String, value: Binding<Bool>, enabled: Bool = true) {
    self.label = label
    self._value = value
    self.enabled = enabled
  }
  public var body: some View {
    Button {
      value.toggle()
    } label: {
      Label(label, systemImage: value ? "checkmark.circle.fill" : "circle").frame(minHeight: 44)
    }
    .buttonStyle(.plain).disabled(!enabled).accessibilityLabel(label).accessibilityAddTraits(
      value ? [.isSelected] : []
    ).accessibilityValue(
      value ? "已选中" : "未选中")
  }
}
public struct RosemarySwitch: View {
  public let label: String
  @Binding public var value: Bool
  public var enabled: Bool
  public init(_ label: String, value: Binding<Bool>, enabled: Bool = true) {
    self.label = label
    self._value = value
    self.enabled = enabled
  }
  public var body: some View { Toggle(label, isOn: $value).disabled(!enabled).frame(minHeight: 44) }
}
public struct RosemarySlider: View {
  public let label: String
  @Binding public var value: Double
  public let range: ClosedRange<Double>
  public var enabled: Bool
  public init(
    _ label: String, value: Binding<Double>, range: ClosedRange<Double> = 0...100,
    enabled: Bool = true
  ) {
    precondition(range.lowerBound < range.upperBound)
    self.label = label
    self._value = value
    self.range = range
    self.enabled = enabled
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text("\(label) \(Int(value))")
      Slider(value: $value, in: range).disabled(!enabled).accessibilityLabel(label)
        .accessibilityValue("\(Int(value))")
    }
  }
}
public struct RosemaryOption<Value: Hashable>: Identifiable {
  public let value: Value
  public let label: String
  public var enabled: Bool
  public var id: Value { value }
  public init(_ value: Value, _ label: String, enabled: Bool = true) {
    self.value = value
    self.label = label
    self.enabled = enabled
  }
}
public struct RosemarySelect<Value: Hashable>: View {
  public let label: String
  @Binding public var value: Value?
  public let options: [RosemaryOption<Value>]
  public var enabled: Bool
  @State private var open = false
  @State private var draft: Value?
  @State private var query = ""
  public init(
    _ label: String, value: Binding<Value?>, options: [RosemaryOption<Value>], enabled: Bool = true
  ) {
    precondition(Set(options.map(\.value)).count == options.count)
    self.label = label
    self._value = value
    self.options = options
    self.enabled = enabled
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label)
      if options.count > 8 {
        Button {
          draft = value
          query = ""
          open = true
        } label: {
          HStack {
            Text(options.first { $0.value == value }?.label ?? "请选择")
            Spacer(minLength: 16)
            Image(systemName: "chevron.down")
          }.frame(minHeight: 44)
        }.disabled(!enabled || !options.contains { $0.enabled }).accessibilityLabel(label)
          .sheet(isPresented: $open) {
            NavigationView {
              VStack(spacing: 16) {
                TextField("搜索选项", text: $query).textFieldStyle(.roundedBorder).padding(.horizontal)
                List {
                  ForEach(
                    options.filter {
                      query.isEmpty || $0.label.localizedCaseInsensitiveContains(query)
                    }
                  ) { o in
                    Button {
                      draft = o.value
                    } label: {
                      HStack {
                        Text(o.label)
                        Spacer()
                        if o.value == draft { Image(systemName: "checkmark") }
                      }
                    }
                    .disabled(!o.enabled).accessibilityAddTraits(
                      o.value == draft ? [.isSelected] : [])
                  }
                  if !options.contains(where: {
                    query.isEmpty || $0.label.localizedCaseInsensitiveContains(query)
                  }) {
                    Text("没有匹配的选项")
                  }
                }
                HStack {
                  Button("取消") { open = false }
                  Spacer()
                  Button("确认") {
                    if enabled, let chosen = draft,
                      options.contains(where: { $0.value == chosen && $0.enabled })
                    {
                      value = chosen
                      open = false
                    }
                  }.disabled(!enabled || !options.contains { $0.value == draft && $0.enabled })
                }.padding().frame(minHeight: 44)
              }.navigationTitle(label)
            }
          }
      } else {
        Menu {
          ForEach(options) { o in
            Button {
              value = o.value
            } label: {
              if o.value == value {
                Label(o.label, systemImage: "checkmark")
              } else {
                Text(o.label)
              }
            }.disabled(!o.enabled)
          }
        } label: {
          HStack {
            Text(options.first { $0.value == value }?.label ?? "请选择")
            Spacer(minLength: 16)
            Image(systemName: "chevron.down")
          }.padding(.horizontal, 12).frame(minHeight: 44)
        }
        .menuStyle(.borderlessButton).disabled(!enabled || !options.contains { $0.enabled })
        .accessibilityLabel(label)
        .accessibilityValue(options.first { $0.value == value }?.label ?? "请选择")
      }
    }.onChange(of: enabled) { if !$0 { open = false } }
  }
}
public struct RosemaryTabs<Content: View>: View {
  @Environment(\.sizeCategory) private var typeSize
  public let labels: [String]
  @Binding public var value: Int
  private let content: (Int) -> Content
  public init(
    _ labels: [String], value: Binding<Int>, @ViewBuilder content: @escaping (Int) -> Content
  ) {
    precondition(!labels.isEmpty && labels.indices.contains(value.wrappedValue))
    self.labels = labels
    self._value = value
    self.content = content
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      if typeSize.isAccessibilityCategory || labels.contains(where: { $0.count > 18 }) {
        VStack(alignment: .leading) {
          ForEach(labels.indices, id: \.self) { i in
            Button(labels[i]) { value = i }.frame(minHeight: 44).accessibilityAddTraits(
              i == value ? [.isSelected] : [])
          }
        }
      } else {
        Picker("页面", selection: $value) {
          ForEach(labels.indices, id: \.self) { Text(labels[$0]).tag($0) }
        }.pickerStyle(.segmented)
      }
      content(value)
    }
  }
}
public struct RosemaryDialog<Content: View>: View {
  public let title: String
  public let confirmLabel: String
  public let canConfirm: Bool
  public let onConfirm, onCancel: () -> Void
  private let content: Content
  public init(
    _ title: String, confirmLabel: String = "确认", canConfirm: Bool = true,
    onConfirm: @escaping () -> Void,
    onCancel: @escaping () -> Void, @ViewBuilder content: () -> Content
  ) {
    self.canConfirm = canConfirm
    self.title = title
    self.confirmLabel = confirmLabel
    self.onConfirm = onConfirm
    self.onCancel = onCancel
    self.content = content()
  }
  public var body: some View {
    NavigationView {
      ScrollView {
        VStack(alignment: .leading, spacing: 24) {
          content
          VStack(alignment: .trailing, spacing: 8) {
            Button("取消", action: onCancel)
            RosemaryButton(confirmLabel, enabled: canConfirm, action: onConfirm)
          }
        }.padding(24)
      }.navigationTitle(title)
    }.rosemaryNavigationStyle().rosemaryTheme()
  }
}
extension View {
  /// Native alert owns dismissal/focus. The host changes data only in onConfirm.
  public func rosemaryAlertDialog(
    _ title: String, isPresented: Binding<Bool>, message: String, confirmLabel: String,
    onConfirm: @escaping () -> Void
  ) -> some View {
    alert(title, isPresented: isPresented) {
      Button("取消", role: .cancel) {}
      Button(confirmLabel, role: .destructive, action: onConfirm)
    } message: {
      Text(message)
    }
  }
}
public struct RosemaryProgress: View {
  public let label: String
  public let value: Double
  public init(_ label: String, value: Double) {
    precondition((0...1).contains(value))
    self.label = label
    self.value = value
  }
  public var body: some View {
    ProgressView(value: value) { Text("\(label) \(Int(value*100))%") }.accessibilityLabel(label)
      .accessibilityValue("\(Int(value*100))%")
  }
}
public struct RosemarySpinner: View {
  public let label: String
  @Environment(\.accessibilityReduceMotion) private var reduced
  @Environment(\.rosemaryReducedMotion) private var appReduced
  @Environment(\.scenePhase) private var scene
  public init(_ label: String = "正在加载") { self.label = label }
  public var body: some View {
    Group {
      if reduced || appReduced || scene != .active {
        Image(systemName: "hourglass")
      } else {
        ProgressView()
      }
    }
    .accessibilityLabel(label)
  }
}
public struct RosemaryEmptyState<Action: View>: View {
  public let title, message: String
  private let action: Action
  public init(_ title: String, message: String, @ViewBuilder action: () -> Action) {
    self.title = title
    self.message = message
    self.action = action()
  }
  public var body: some View {
    VStack(spacing: 16) {
      Text(title).font(.headline).accessibilityAddTraits(.isHeader)
      Text(message)
      action
    }.padding(24)
  }
}
