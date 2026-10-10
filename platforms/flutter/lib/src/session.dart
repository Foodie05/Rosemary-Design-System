import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'components.dart';

/// One result per presentation; a late close from an older session is rejected.
enum RosemaryDismissReason { confirm, cancel, outside, back, programmatic }

class RosemaryModalSession {
  final String id;
  RosemaryDismissReason? _result;
  final ValueChanged<RosemaryDismissReason> onClose;
  RosemaryModalSession(this.id, this.onClose);
  RosemaryDismissReason? get result => _result;
  bool close(String sessionId, RosemaryDismissReason reason) {
    if (sessionId != id || _result != null) return false;
    _result = reason;
    onClose(reason);
    return true;
  }
}

Future<RosemaryDismissReason> showRosemaryModal(
  BuildContext context, {
  required String title,
  required Widget content,
  required String sessionId,
  ValueChanged<RosemaryDismissReason>? onClose,
  bool canConfirm = true,
  bool barrierDismissible = true,
}) async {
  final focus = FocusManager.instance.primaryFocus;
  final session = RosemaryModalSession(sessionId, onClose ?? (_) {});
  final navigator = Navigator.of(context, rootNavigator: true);
  final parentRoute = ModalRoute.of(context);
  late final RawDialogRoute<RosemaryDismissReason> route;
  route = RawDialogRoute<RosemaryDismissReason>(
    traversalEdgeBehavior: TraversalEdgeBehavior.closedLoop,
    barrierDismissible: false,
    barrierLabel: MaterialLocalizations.of(context).modalBarrierDismissLabel,
    transitionDuration: MediaQuery.disableAnimationsOf(context)
        ? Duration.zero
        : const Duration(milliseconds: 240),
    pageBuilder: (c, _, __) {
      void close(RosemaryDismissReason reason) {
        if (session.result != null || !route.isActive) return;
        // Remove this exact presentation before notifying a host that may open another.
        if (route.isCurrent) {
          navigator.pop(reason);
        } else {
          navigator.removeRoute(route, reason);
        }
        session.close(sessionId, reason);
      }

      return CallbackShortcuts(
        bindings: {
          const SingleActivator(LogicalKeyboardKey.escape): () =>
              close(RosemaryDismissReason.back),
        },
        child: FocusScope(
          autofocus: true,
          child: PopScope(
            canPop: false,
            onPopInvokedWithResult: (didPop, result) {
              if (!didPop) close(RosemaryDismissReason.back);
            },
            child: Stack(
              children: [
                Positioned.fill(
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: barrierDismissible
                        ? () => close(RosemaryDismissReason.outside)
                        : null,
                  ),
                ),
                Center(
                  child: RosemaryDialog(
                    title: title,
                    content: content,
                    onCancel: () => close(RosemaryDismissReason.cancel),
                    onConfirm: canConfirm
                        ? () => close(RosemaryDismissReason.confirm)
                        : null,
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    },
  );
  final result = await navigator.push(route);
  await route.completed;
  if (result == null)
    session.close(sessionId, RosemaryDismissReason.programmatic);
  if (parentRoute?.isCurrent == true &&
      focus != null &&
      focus.context != null) {
    focus.requestFocus();
  }
  return session.result ?? RosemaryDismissReason.programmatic;
}
