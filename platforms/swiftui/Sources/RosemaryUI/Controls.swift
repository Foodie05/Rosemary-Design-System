import SwiftUI
import UniformTypeIdentifiers

public enum RosemaryButtonVariant { case primary, secondary, quiet, danger }
public struct RosemaryButtonStyle: ButtonStyle {
  private var p = RosemaryPalette()
  public let variant: RosemaryButtonVariant
  private let showsBusy: Bool
  @Environment(\.isEnabled) private var enabled
  @Environment(\.isFocused) private var focused
  public init(_ variant: RosemaryButtonVariant = .primary) {
    self.variant = variant
    showsBusy = false
  }
  init(_ variant: RosemaryButtonVariant, showsBusy: Bool) {
    self.variant = variant
    self.showsBusy = showsBusy
  }
  private var fillInset: CGFloat {
    p.scheme == .dark && p.stroke == 1 && (variant == .primary || variant == .danger)
      ? RosemaryNativeMetrics.dimension("button", "darkFillInset") : 0
  }
  public func makeBody(configuration: Configuration) -> some View {
    configuration.label.rosemaryTypography(.body, weight: .semibold).padding(
      .horizontal, RosemaryNativeMetrics.dimension("button", "paddingInline")
    )
    .padding(
      .vertical, 10
    ).frame(minHeight: 44).contentShape(Rectangle())
    .foregroundStyle(
      variant == .primary
        ? p.colors.onPrimary : variant == .danger ? p.colors.onDanger : p.colors.primary
    )
    .background {
      RoundedRectangle(cornerRadius: max(0, RosemaryNativeMetrics.radius("button") - fillInset))
        .fill(
          variant == .primary
            ? p.colors.primary
            : variant == .danger
              ? p.colors.danger : variant == .secondary ? p.colors.surfaceInset : .clear
        )
        .padding(fillInset)
    }
    .clipShape(RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("button"))).opacity(
      enabled ? (configuration.isPressed ? 0.75 : 1) : showsBusy ? 1 : 0.45
    )
    .modifier(RosemaryAnimatedWidth())
    .scaleEffect(
      p.reduce || !enabled ? 1 : configuration.isPressed ? RosemaryInteraction.pressScale : 1
    )
    .animation(
      p.reduce
        ? nil
        : .interpolatingSpring(
          mass: 1,
          stiffness: configuration.isPressed
            ? RosemaryInteraction.pressStiffness : RosemaryInteraction.releaseStiffness,
          damping: 2
            * (configuration.isPressed
              ? RosemaryInteraction.pressDamping : RosemaryInteraction.releaseDamping)
            * sqrt(
              configuration.isPressed
                ? RosemaryInteraction.pressStiffness : RosemaryInteraction.releaseStiffness)),
      value: configuration.isPressed
    )
    .overlay(
      RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("button")).stroke(
        focused ? p.colors.focus : p.stroke > 1 ? p.colors.control : .clear,
        lineWidth: focused ? 2 : p.stroke))
  }
}
public struct RosemaryButton: View {
  private var p = RosemaryPalette()
  @Environment(\.isEnabled) private var enabled
  let title: String
  let variant: RosemaryButtonVariant
  let loading: Bool
  let action: () -> Void
  public init(
    _ title: String, variant: RosemaryButtonVariant = .primary, isLoading: Bool = false,
    action: @escaping () -> Void
  ) {
    self.title = title
    self.variant = variant
    self.loading = isLoading
    self.action = action
  }
  public var body: some View {
    Button(action: action) {
      HStack {
        if loading {
          RosemaryLoading(
            "", isRunning: true, size: 18,
            color: variant == .primary
              ? p.colors.onPrimary : variant == .danger ? p.colors.onDanger : p.colors.primary)
        }
        Text(title)
      }
    }.buttonStyle(RosemaryButtonStyle(variant, showsBusy: loading && enabled)).disabled(loading)
      .accessibilityValue(
        loading ? p.text("Loading") : "")
  }
}
public struct RosemaryLink: View {
  private var p = RosemaryPalette()
  let title: String
  let url: URL
  let current: Bool
  let visited: Bool
  public init(_ title: String, destination: URL, isCurrent: Bool = false, isVisited: Bool = false) {
    self.title = title
    url = destination
    current = isCurrent
    visited = isVisited
  }
  public var body: some View {
    Link(title, destination: url).rosemaryTypography(.body, weight: current ? .semibold : .regular)
      .foregroundStyle(visited ? p.colors.muted : p.colors.primary)
      .underline().frame(
        minHeight: 44
      ).buttonStyle(RosemaryPressStyle()).accessibilityValue(
        current ? p.text("Current page") : visited ? p.text("Visited") : "")
  }
}
public struct RosemaryIconButton: View {
  private var p = RosemaryPalette()
  let loading: Bool
  let icon: String
  let label: String
  let rotation: Angle
  let action: () -> Void
  public init(
    _ icon: String, label: String, rotation: Angle = .zero, isLoading: Bool = false,
    action: @escaping () -> Void
  ) {
    self.icon = icon
    self.label = label
    self.rotation = rotation
    loading = isLoading
    self.action = action
  }
  public var body: some View {
    Button(action: action) {
      if loading {
        RosemaryLoading("", isRunning: true, size: 20)
      } else {
        RosemaryIcon(icon, rotation: rotation).frame(minWidth: 20, minHeight: 20)
      }
    }.buttonStyle(RosemaryButtonStyle(.quiet)).disabled(loading).accessibilityLabel(label)
      .accessibilityValue(loading ? p.text("Loading") : "")
  }
}
public struct RosemaryInput: View {
  private var p = RosemaryPalette()
  let label: String
  let placeholder: String
  let error: String?
  let secure: Bool
  let readOnly: Bool
  let requirements: [RosemaryFieldRequirement]
  let verification: AnyView?
  let isComposing: Bool
  @State private var validation = RosemaryFieldValidationState()
  @State private var nativeComposing = false
  let onSubmit: () -> Void
  @Binding var text: String
  @FocusState private var focused: Bool
  public init(
    _ label: String, text: Binding<String>, placeholder: String = "", error: String? = nil,
    secure: Bool = false, isReadOnly: Bool = false,
    requirements: [RosemaryFieldRequirement] = [], verification: AnyView? = nil,
    isComposing: Bool = false, onSubmit: @escaping () -> Void = {}
  ) {
    self.label = label
    _text = text
    self.placeholder = placeholder
    self.error = error
    self.secure = secure
    readOnly = isReadOnly
    self.requirements = requirements
    self.verification = verification
    self.isComposing = isComposing
    self.onSubmit = onSubmit
  }
  private var active: Bool { validation.armed && !text.isEmpty && !isComposing && !nativeComposing }
  private var invalid: Bool { error != nil || active && requirements.contains { !$0.check(text) } }
  @ViewBuilder private var editor: some View {
    if readOnly {
      Text(secure ? String(repeating: "•", count: text.count) : text)
        .textSelection(.enabled).frame(maxWidth: .infinity, alignment: .leading)
    } else if secure {
      SecureField("", text: $text, prompt: Text(placeholder).foregroundStyle(p.colors.muted))
    } else {
      TextField("", text: $text, prompt: Text(placeholder).foregroundStyle(p.colors.muted))
    }
  }
  private var framedEditor: some View {
    editor.textFieldStyle(.plain).focused($focused).onSubmit(onSubmit)
      .modifier(RosemaryFieldFrame(invalid: invalid, focused: focused))
  }
  private var fieldHint: String { (readOnly ? p.text("Read only") + " " : "") + (error ?? "") }
  private var accessibleEditor: some View {
    framedEditor.background(RosemaryCompositionProbe { nativeComposing = $0 })
      .accessibilityLabel(label).accessibilityHint(fieldHint)
  }
  @ViewBuilder private var feedback: some View {
    RosemaryFieldRequirements(value: text, rules: requirements, active: active)
    if let verification { verification }
    if let error { Text(error).font(.system(size: 14)).foregroundStyle(p.colors.danger) }
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(label).rosemaryTypography(.small, weight: .medium).foregroundStyle(p.colors.ink)
      accessibleEditor
      feedback
    }
    .onChange(of: focused) { (_: Bool, value: Bool) in
      if value {
        validation.focus()
      } else {
        validation.blur(text, isComposing: isComposing || nativeComposing)
      }
    }
    .onChange(of: text) { (_: String, value: String) in validation.edit(value) }
  }

}
public struct RosemaryTextarea: View {
  private var p = RosemaryPalette()
  let label: String
  let error: String?
  let readOnly: Bool
  let requirements: [RosemaryFieldRequirement]
  let verification: AnyView?
  let isComposing: Bool
  @State private var validation = RosemaryFieldValidationState()
  @State private var nativeComposing = false
  @Binding var text: String
  @FocusState var focused: Bool
  public init(
    _ label: String, text: Binding<String>, error: String? = nil, isReadOnly: Bool = false,
    requirements: [RosemaryFieldRequirement] = [], verification: AnyView? = nil,
    isComposing: Bool = false
  ) {
    self.label = label
    _text = text
    self.error = error
    readOnly = isReadOnly
    self.requirements = requirements
    self.verification = verification
    self.isComposing = isComposing
  }
  private var active: Bool { validation.armed && !text.isEmpty && !isComposing && !nativeComposing }
  private var invalid: Bool { error != nil || active && requirements.contains { !$0.check(text) } }
  @ViewBuilder private var editor: some View {
    if readOnly {
      Text(text).textSelection(.enabled)
        .frame(maxWidth: .infinity, minHeight: 100, alignment: .topLeading)
    } else {
      TextEditor(text: $text).scrollContentBackground(.hidden).frame(minHeight: 100)
    }
  }
  private var framedEditor: some View {
    editor.focused($focused).modifier(RosemaryFieldFrame(invalid: invalid, focused: focused))
  }
  private var fieldHint: String { (readOnly ? p.text("Read only") + " " : "") + (error ?? "") }
  private var accessibleEditor: some View {
    framedEditor.background(RosemaryCompositionProbe { nativeComposing = $0 })
      .accessibilityLabel(label).accessibilityHint(fieldHint)
  }
  @ViewBuilder private var feedback: some View {
    RosemaryFieldRequirements(value: text, rules: requirements, active: active)
    if let verification { verification }
    if let error { Text(error).font(.system(size: 14)).foregroundStyle(p.colors.danger) }
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 6) {
      Text(label).rosemaryTypography(.small, weight: .medium).foregroundStyle(p.colors.ink)
      accessibleEditor
      feedback
    }
    .onChange(of: focused) { (_: Bool, value: Bool) in
      if value {
        validation.focus()
      } else {
        validation.blur(text, isComposing: isComposing || nativeComposing)
      }
    }
    .onChange(of: text) { (_: String, value: String) in validation.edit(value) }
  }

}
public enum RosemarySearchPresentation { case inline, dialog }
public struct RosemarySearch: View {
  private var p = RosemaryPalette()
  let label: String
  let submit: (String) -> Void
  let presentation: RosemarySearchPresentation
  @Binding var text: String
  @State private var expanded: Bool
  @FocusState private var focused: Bool
  @FocusState private var entryFocused: Bool
  public init(
    _ label: String, text: Binding<String>, presentation: RosemarySearchPresentation = .inline,
    initiallyExpanded: Bool = true, onSearch: @escaping (String) -> Void
  ) {
    self.label = label
    _text = text
    submit = onSearch
    self.presentation = presentation
    _expanded = State(initialValue: presentation == .inline && initiallyExpanded)
  }
  private var searchField: some View {
    HStack {
      RosemaryIcon("search").foregroundStyle(p.colors.muted)
      TextField("", text: $text, prompt: Text(label).foregroundStyle(p.colors.muted))
        .textFieldStyle(.plain).focused($focused).onSubmit { submit(text) }.accessibilityLabel(
          label)
      if !text.isEmpty {
        RosemaryIconButton("close", label: "\(p.text("Clear")) \(label)") {
          text = ""
          submit("")
        }
      }
    }.modifier(RosemaryFieldFrame(focused: focused))
      .onKeyPress(.escape) {
        if presentation == .dialog {
          expanded = false
          entryFocused = true
        } else if !text.isEmpty {
          text = ""
        } else {
          expanded = false
          entryFocused = true
        }
        return .handled
      }
  }
  public var body: some View {
    Group {
      if presentation == .inline && expanded {
        searchField
      } else {
        RosemaryIconButton("search", label: label) {
          expanded = true
          focused = true
        }.focused($entryFocused)
      }
    }.animation(
      p.reduce
        ? nil : .timingCurve(0.2, 0.8, 0.2, 1, duration: RosemaryInteraction.layoutMs / 1000),
      value: expanded
    )
    .rosemaryDialog(
      label,
      isPresented: Binding(get: { presentation == .dialog && expanded }, set: { expanded = $0 }),
      restoreFocus: { entryFocused = true }
    ) { searchField.onAppear { focused = true } }
  }
}
public struct RosemaryCheckbox: View {
  private var p = RosemaryPalette()
  let label: String
  let mixed: Bool
  @Binding var checked: Bool
  public init(_ label: String, isChecked: Binding<Bool>, isMixed: Bool = false) {
    self.label = label
    _checked = isChecked
    mixed = isMixed
  }
  public var body: some View {
    Button {
      checked.toggle()
    } label: {
      HStack(spacing: 10) {
        ZStack {
          RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("checkbox") / 2).fill(
            checked || mixed ? p.colors.primary : p.colors.surface)
          RoundedRectangle(cornerRadius: RosemaryNativeMetrics.radius("checkbox") / 2).stroke(
            p.colors.control, lineWidth: p.stroke)
          if mixed {
            Rectangle().fill(p.colors.onPrimary).frame(width: 10, height: 2)
          } else if checked {
            RosemaryIcon("check", size: 15).foregroundStyle(p.colors.onPrimary)
          }
        }.frame(width: 20, height: 20)
        Text(label).foregroundStyle(p.colors.ink)
        Spacer(minLength: 0)
      }.padding(.vertical, 10).frame(minHeight: 44).contentShape(Rectangle())
    }.buttonStyle(RosemaryPressStyle()).animation(
      p.reduce ? nil : .easeInOut(duration: RosemaryNativeMetrics.duration("state")), value: checked
    )
    .accessibilityRepresentation {
      Toggle(label, isOn: $checked).accessibilityValue(
        mixed ? p.text("Mixed") : checked ? p.text("Checked") : p.text("Unchecked"))
    }.accessibilityLabel(label).accessibilityValue(
      mixed ? p.text("Mixed") : checked ? p.text("Checked") : p.text("Unchecked")
    ).accessibilityAddTraits(checked ? [.isSelected] : [])
  }
}
public struct RosemaryRadio<Value: Hashable>: View {
  private var p = RosemaryPalette()
  let label: String
  let value: Value
  @Binding var selection: Value
  public init(_ label: String, value: Value, selection: Binding<Value>) {
    self.label = label
    self.value = value
    _selection = selection
  }
  public var body: some View {
    Button {
      selection = value
    } label: {
      HStack(spacing: 10) {
        ZStack {
          Circle().stroke(p.colors.control, lineWidth: p.stroke)
          if selection == value { Circle().fill(p.colors.primary).padding(5) }
        }.frame(width: 20, height: 20)
        Text(label).foregroundStyle(p.colors.ink)
        Spacer(minLength: 0)
      }.frame(minHeight: 44)
    }.buttonStyle(RosemaryPressStyle()).animation(
      p.reduce ? nil : .easeInOut(duration: RosemaryNativeMetrics.duration("state")),
      value: selection
    )
    .accessibilityLabel(label).accessibilityValue(
      selection == value ? p.text("Selected") : p.text("Not selected")
    ).accessibilityAddTraits(selection == value ? [.isSelected] : [])
  }
}
public struct RosemarySwitch: View {
  private var p = RosemaryPalette()
  @Environment(\.layoutDirection) private var direction
  let label: String
  @Binding var on: Bool
  public init(_ label: String, isOn: Binding<Bool>) {
    self.label = label
    _on = isOn
  }
  public var body: some View {
    Button {
      withAnimation(p.reduce ? nil : .easeInOut(duration: RosemaryNativeMetrics.duration("state")))
      { on.toggle() }
    } label: {
      HStack {
        Text(label).foregroundStyle(p.colors.ink)
        Spacer()
        Capsule().fill(on ? p.colors.primary : p.colors.control).frame(width: 42, height: 24)
          .overlay(alignment: on ? .trailing : .leading) {
            Circle().fill(p.colors.surface).frame(width: 18, height: 18).padding(3)
          }
      }.frame(minHeight: 44)
    }.buttonStyle(RosemaryPressStyle()).accessibilityRepresentation { Toggle(label, isOn: $on) }
      .accessibilityLabel(label).accessibilityValue(on ? p.text("On") : p.text("Off"))
      .accessibilityAddTraits(on ? [.isSelected] : [])
  }
}
public struct RosemarySlider: View {
  @Environment(\.isEnabled) private var enabled
  private var p = RosemaryPalette()
  @GestureState private var dragging = false
  @Environment(\.layoutDirection) var direction
  let label: String
  let range: ClosedRange<Double>
  let step: Double
  @Binding var value: Double
  public init(
    _ label: String, value: Binding<Double>, in range: ClosedRange<Double> = 0...1,
    step: Double = 0.01
  ) {
    precondition(range.upperBound > range.lowerBound && step > 0)
    self.label = label
    _value = value
    self.range = range
    self.step = step
  }
  private var ratio: Double {
    max(0, min(1, (value - range.lowerBound) / (range.upperBound - range.lowerBound)))
  }
  private func set(_ n: Double) {
    guard enabled else { return }
    value = max(
      range.lowerBound,
      min(range.upperBound, range.lowerBound + ((n - range.lowerBound) / step).rounded() * step))
  }
  public var body: some View {
    VStack(alignment: .leading) {
      Text(label).foregroundStyle(p.colors.ink)
      GeometryReader { g in
        ZStack(alignment: .leading) {
          Capsule().fill(p.colors.border).frame(height: 6)
          Capsule().fill(p.colors.primary).frame(width: g.size.width * ratio, height: 6)
          Circle().fill(p.colors.surface).overlay(Circle().stroke(p.colors.primary, lineWidth: 2))
            .frame(width: 22, height: 22).offset(
              x: (g.size.width - 22) * ratio * (direction == .rightToLeft ? -1 : 1))
        }.animation(
          p.reduce || dragging
            ? nil : .timingCurve(0.2, 0.8, 0.2, 1, duration: RosemaryInteraction.layoutMs / 1000),
          value: value
        ).frame(height: 44).contentShape(Rectangle()).gesture(
          DragGesture(minimumDistance: 0).updating($dragging) { _, state, _ in state = true }
            .onChanged { v in
              let r = max(0, min(1, v.location.x / g.size.width))
              set(
                range.lowerBound + (direction == .rightToLeft ? 1 - r : r)
                  * (range.upperBound - range.lowerBound))
            })
      }.frame(height: 44).accessibilityElement().accessibilityLabel(label).accessibilityValue(
        value.formatted()
      ).accessibilityAdjustableAction { d in set(value + (d == .increment ? step : -step)) }
        .focusable().onKeyPress(.leftArrow) {
          set(value + (direction == .rightToLeft ? step : -step))
          return .handled
        }.onKeyPress(.rightArrow) {
          set(value + (direction == .rightToLeft ? -step : step))
          return .handled
        }.onKeyPress(.home) {
          set(range.lowerBound)
          return .handled
        }.onKeyPress(.end) {
          set(range.upperBound)
          return .handled
        }
    }
  }
}
public enum RosemaryUploadState { case selected, uploading, uploaded, failed, cancelled }
public struct RosemaryUploadFile: Identifiable {
  public let id: String
  public let name: String
  public let state: RosemaryUploadState
  public let progress: Double?
  public let error: String?
  public init(
    _ id: String, name: String, state: RosemaryUploadState = .selected, progress: Double? = nil,
    error: String? = nil
  ) {
    precondition(progress == nil || (progress!.isFinite && (0...1).contains(progress!)))
    self.id = id
    self.name = name
    self.state = state
    self.progress = progress
    self.error = error
  }
}
public struct RosemaryUpload: View {
  private var p = RosemaryPalette()
  let label: String
  let types: [UTType]
  let multiple: Bool
  let files: [RosemaryUploadFile]
  let onSelect: (Result<[URL], Error>) -> Void
  let onRemove: ((String) -> Void)?
  let onRetry: ((String) -> Void)?
  let onCancel: ((String) -> Void)?
  @State private var open = false
  public init(
    _ label: String, allowedTypes: [UTType] = [.data], allowsMultiple: Bool = false,
    files: [RosemaryUploadFile] = [], onRemove: ((String) -> Void)? = nil,
    onRetry: ((String) -> Void)? = nil, onCancel: ((String) -> Void)? = nil,
    onSelect: @escaping (Result<[URL], Error>) -> Void
  ) {
    self.label = label
    types = allowedTypes
    multiple = allowsMultiple
    self.files = files
    self.onRemove = onRemove
    self.onRetry = onRetry
    self.onCancel = onCancel
    self.onSelect = onSelect
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Button {
        open = true
      } label: {
        HStack {
          RosemaryIcon("upload")
          Text(label)
        }
      }.buttonStyle(RosemaryButtonStyle(.secondary)).fileImporter(
        isPresented: $open, allowedContentTypes: types, allowsMultipleSelection: multiple,
        onCompletion: onSelect)
      ForEach(files) { file in
        RosemaryCard {
          VStack(alignment: .leading, spacing: 8) {
            HStack(alignment: .top) {
              RosemaryIcon("paperclip").foregroundStyle(p.colors.muted)
              Text(file.name).foregroundStyle(p.colors.ink).frame(
                maxWidth: .infinity, alignment: .leading)
              if file.state == .uploading, let onCancel {
                RosemaryIconButton("close", label: "\(p.text("Cancel")) \(file.name)") {
                  onCancel(file.id)
                }
              } else if let onRemove {
                RosemaryIconButton("trash", label: "\(p.text("Remove")) \(file.name)") {
                  onRemove(file.id)
                }
              }
            }
            if file.state == .uploading {
              if let progress = file.progress {
                RosemaryProgress(p.text("Uploading"), value: progress, total: 1)
              } else {
                RosemaryLoading(p.text("Uploading"), isRunning: true, size: 18)
              }
            } else {
              RosemaryBadge(
                p.text(String(describing: file.state)),
                status: file.state == .failed
                  ? .danger : file.state == .uploaded ? .success : .neutral)
            }
            if let error = file.error {
              Text(error).rosemaryTypography(.caption).foregroundStyle(p.colors.danger)
            }
            if file.state == .failed, let onRetry {
              RosemaryButton(p.text("Retry"), variant: .secondary) { onRetry(file.id) }
            }
          }
        }.accessibilityElement(children: .contain)
      }
    }.onDisappear { open = false }
  }
}
