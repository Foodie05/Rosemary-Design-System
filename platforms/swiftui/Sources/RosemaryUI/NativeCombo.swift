import SwiftUI

#if canImport(UIKit)
  import UIKit
  private final class RosemaryComboTextField: UITextField {
    var onKey: ((String) -> Void)?
    override var keyCommands: [UIKeyCommand]? {
      [UIKeyCommand.inputDownArrow, UIKeyCommand.inputUpArrow, UIKeyCommand.inputEscape].map {
        let command = UIKeyCommand(input: $0, modifierFlags: [], action: #selector(key(_:)))
        command.wantsPriorityOverSystemBehavior = true
        return command
      }
    }
    @objc private func key(_ command: UIKeyCommand) {
      onKey?(
        command.input == UIKeyCommand.inputDownArrow
          ? "next" : command.input == UIKeyCommand.inputUpArrow ? "previous" : "cancel")
    }
  }
  struct RosemaryComboInput: UIViewRepresentable {
    let label: String
    @Binding var query: String
    let enabled: Bool, onKey: (String) -> Void
    @Environment(\.colorScheme) private var scheme
    func makeCoordinator() -> Coordinator { Coordinator(self) }
    func makeUIView(context: Context) -> UITextField {
      let field = RosemaryComboTextField()
      field.delegate = context.coordinator
      field.addTarget(
        context.coordinator, action: #selector(Coordinator.changed(_:)), for: .editingChanged)
      field.borderStyle = .roundedRect
      field.returnKeyType = .done
      field.font = .preferredFont(forTextStyle: .body)
      field.adjustsFontForContentSizeCategory = true
      field.setContentCompressionResistancePriority(.defaultLow, for: .horizontal)
      return field
    }
    func updateUIView(_ field: UITextField, context: Context) {
      context.coordinator.parent = self
      if field.text != query && field.markedTextRange == nil { field.text = query }
      field.accessibilityLabel = label
      field.placeholder = label
      field.isEnabled = enabled
      (field as? RosemaryComboTextField)?.onKey = onKey
      let p = RosemaryTheme(scheme: scheme)
      field.textColor = UIColor(p.ink)
      field.tintColor = UIColor(p.accent)
      field.backgroundColor = UIColor(p.surface)
    }
    final class Coordinator: NSObject, UITextFieldDelegate {
      var parent: RosemaryComboInput
      init(_ parent: RosemaryComboInput) { self.parent = parent }
      @objc func changed(_ field: UITextField) { parent.query = field.text ?? "" }
      func textFieldShouldReturn(_ field: UITextField) -> Bool {
        parent.onKey("confirm")
        return false
      }
    }
  }
#endif
