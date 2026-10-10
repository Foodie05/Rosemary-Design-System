import SwiftUI

#if canImport(UIKit)
  import UIKit
  extension View {
    /// Each callback includes the presentation identity. The host commits only `.confirm`.
    public func rosemaryModal<Content: View>(
      session: Binding<RosemaryModalSession?>, title: String, canConfirm: Bool = true,
      barrierDismissible: Bool = true, onClose: @escaping (UUID, RosemaryDismissReason) -> Void,
      @ViewBuilder content: @escaping () -> Content
    ) -> some View {
      background(
        RosemaryModalPresenter(
          session: session, title: title, canConfirm: canConfirm,
          barrierDismissible: barrierDismissible, onClose: onClose, content: content
        ).frame(width: 0, height: 0).accessibilityHidden(true))
    }
  }
  private final class RosemaryModalAnchor: UIViewController {
    var ready: (() -> Void)?
    override func viewDidAppear(_ animated: Bool) {
      super.viewDidAppear(animated)
      ready?()
    }
  }
  private final class RosemaryModalController: UIHostingController<AnyView> {
    var close: (() -> Void)?
    override func accessibilityPerformEscape() -> Bool {
      close?()
      return true
    }
    override var keyCommands: [UIKeyCommand]? {
      let c = UIKeyCommand(
        input: UIKeyCommand.inputEscape, modifierFlags: [], action: #selector(escape))
      c.wantsPriorityOverSystemBehavior = true
      return [c]
    }
    @objc func escape() { close?() }
  }
  private struct RosemaryModalPresenter<Content: View>: UIViewControllerRepresentable {
    @Binding var session: RosemaryModalSession?
    let title: String, canConfirm: Bool, barrierDismissible: Bool,
      onClose: (UUID, RosemaryDismissReason) -> Void, content: () -> Content
    @Environment(\.colorScheme) private var scheme
    @Environment(\.accessibilityReduceMotion) private var reduced
    @Environment(\.rosemaryReducedMotion) private var appReduced
    func makeCoordinator() -> Coordinator { Coordinator(self) }
    func makeUIViewController(context: Context) -> UIViewController {
      let vc = RosemaryModalAnchor()
      vc.ready = { [weak coordinator = context.coordinator] in coordinator?.reconcile() }
      vc.view.backgroundColor = .clear
      return vc
    }
    func updateUIViewController(_ vc: UIViewController, context: Context) {
      context.coordinator.parent = self
      context.coordinator.schedule(vc)
    }
    static func dismantleUIViewController(_ vc: UIViewController, coordinator: Coordinator) {
      DispatchQueue.main.async {
        coordinator.end(.programmatic)
        vc.presentedViewController?.dismiss(animated: false)
      }
    }
    final class Coordinator {
      var parent: RosemaryModalPresenter
      var shown: UUID?
      var completed = false
      var callback: ((UUID, RosemaryDismissReason) -> Void)?
      weak var host: UIViewController?
      var transition = false
      init(_ parent: RosemaryModalPresenter) { self.parent = parent }
      func schedule(_ vc: UIViewController) {
        host = vc
        DispatchQueue.main.async { [weak self] in self?.reconcile() }
      }
      func end(_ reason: RosemaryDismissReason) {
        guard let id = shown, !completed else { return }
        completed = true
        if parent.session?.id == id { parent.session = nil }
        callback?(id, reason)
      }
      func close(_ id: UUID, _ reason: RosemaryDismissReason) {
        guard shown == id, parent.session?.id == id else { return }
        end(reason)
        reconcile()
      }
      func reconcile() {
        guard let host, host.view.window != nil, !transition else { return }
        let wanted = parent.session?.id
        if shown != wanted {
          if shown != nil {
            end(.programmatic)
            transition = true
            guard let presented = host.presentedViewController else {
              shown = nil
              transition = false
              reconcile()
              return
            }
            presented.dismiss(
              animated: !(parent.reduced || parent.appReduced),
              completion: { [weak self] in
                guard let self else { return }
                self.shown = nil
                self.transition = false
                self.reconcile()
              })
            return
          }
          guard let id = wanted else { return }
          shown = id
          completed = false
          callback = parent.onClose
          let controller = RosemaryModalController(rootView: root(id))
          controller.modalPresentationStyle = .overFullScreen
          controller.modalTransitionStyle = .crossDissolve
          controller.view.backgroundColor = .clear
          controller.isModalInPresentation = true
          controller.close = { [weak self] in self?.close(id, .back) }
          transition = true
          host.present(controller, animated: !(parent.reduced || parent.appReduced)) {
            [weak self] in
            self?.transition = false
            self?.reconcile()
          }
        } else if let id = wanted,
          let controller = host.presentedViewController as? RosemaryModalController
        {
          controller.rootView = root(id)
        }
      }
      func root(_ id: UUID) -> AnyView {
        AnyView(
          ZStack {
            Color.black.opacity(0.36).ignoresSafeArea().onTapGesture { [weak self] in
              if self?.parent.barrierDismissible == true { self?.close(id, .outside) }
            }.accessibilityHidden(true)
            RosemaryDialog(
              parent.title, canConfirm: parent.canConfirm,
              onConfirm: { [weak self] in
                if self?.parent.canConfirm == true { self?.close(id, .confirm) }
              }, onCancel: { [weak self] in self?.close(id, .cancel) }
            ) { parent.content().disabled(completed) }
            .frame(maxWidth: 560, maxHeight: 600).clipShape(RoundedRectangle(cornerRadius: 16))
            .padding(16).accessibilityAddTraits(.isModal)
          }.environment(\.colorScheme, parent.scheme)
            .environment(\.rosemaryReducedMotion, parent.appReduced))
      }
    }
  }
#endif
