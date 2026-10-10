import 'dart:async';
import 'package:flutter/material.dart';
import 'extended.dart' show RosemaryToast;

/// A passive message owns one timer. Actions belong in Snackbar or Banner.
class RosemaryToastController extends ChangeNotifier {
  final Stopwatch _clock = Stopwatch()..start();
  late final int Function() _now;
  RosemaryToastController({int Function()? nowMillis}) {
    _now = nowMillis ?? () => _clock.elapsedMilliseconds;
  }
  String? message;
  int id = 0;
  int _remaining = 0;
  int? _started;
  Timer? _timer;
  final _paused = <String>{'detached'};
  bool _disposed = false;
  int get remainingMillis =>
      (_remaining - (_started == null ? 0 : _now() - _started!)).clamp(
        0,
        _remaining,
      );
  void show(String message, {Duration duration = const Duration(seconds: 4)}) {
    if (_disposed) return;
    if (duration <= Duration.zero)
      throw ArgumentError('Toast duration must be positive');
    _timer?.cancel();
    id++;
    this.message = message;
    _remaining = duration.inMilliseconds;
    _started = null;
    _arm();
    notifyListeners();
  }

  void dismiss([int? expected]) {
    if (_disposed || message == null || (expected != null && expected != id))
      return;
    _timer?.cancel();
    _started = null;
    _paused.removeAll({'pointer', 'focus', 'accessibility-focus'});
    message = null;
    notifyListeners();
  }

  void pause(String reason) {
    if (_disposed || !_paused.add(reason)) return;
    _remaining = remainingMillis;
    _started = null;
    _timer?.cancel();
  }

  void resume(String reason) {
    if (_disposed || !_paused.remove(reason)) return;
    _arm();
  }

  void _arm() {
    if (message == null || _paused.isNotEmpty || _started != null) return;
    _started = _now();
    final session = id;
    _timer = Timer(Duration(milliseconds: _remaining), () {
      if (!_disposed && _paused.isEmpty && session == id) dismiss(session);
    });
  }

  @override
  void dispose() {
    _disposed = true;
    _timer?.cancel();
    _clock.stop();
    super.dispose();
  }
}

class RosemaryToastHost extends StatefulWidget {
  final RosemaryToastController controller;
  final Widget child;
  const RosemaryToastHost({
    super.key,
    required this.controller,
    required this.child,
  });
  @override
  State<RosemaryToastHost> createState() => _ToastHostState();
}

class _ToastHostState extends State<RosemaryToastHost>
    with WidgetsBindingObserver {
  final transient = <String>{};
  void pauseFor(String key, bool active) {
    if (active) {
      transient.add(key);
      widget.controller.pause(key);
    } else {
      transient.remove(key);
      widget.controller.resume(key);
    }
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    widget.controller.resume('detached');
    updateApp(WidgetsBinding.instance.lifecycleState);
  }

  void updateApp(AppLifecycleState? state) {
    state == null || state == AppLifecycleState.resumed
        ? widget.controller.resume('app')
        : widget.controller.pause('app');
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) => updateApp(state);
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    MediaQuery.accessibleNavigationOf(context)
        ? widget.controller.pause('reader')
        : widget.controller.resume('reader');
  }

  @override
  void didUpdateWidget(covariant RosemaryToastHost old) {
    super.didUpdateWidget(old);
    if (old.controller != widget.controller) {
      old.controller.pause('detached');
      for (final key in transient) {
        old.controller.resume(key);
        widget.controller.pause(key);
      }
      widget.controller.resume('detached');
      updateApp(WidgetsBinding.instance.lifecycleState);
      MediaQuery.accessibleNavigationOf(context)
          ? widget.controller.pause('reader')
          : widget.controller.resume('reader');
    }
  }

  @override
  void dispose() {
    widget.controller.pause('detached');
    for (final key in ['pointer', 'focus', 'accessibility-focus'])
      widget.controller.resume(key);
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Stack(
    children: [
      widget.child,
      AnimatedBuilder(
        animation: widget.controller,
        builder: (context, _) {
          final message = widget.controller.message;
          final id = widget.controller.id;
          if (message == null) return const SizedBox.shrink();
          return Positioned(
            left: 16,
            right: 16,
            bottom: 16,
            child: SafeArea(
              child: Align(
                alignment: Alignment.bottomCenter,
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 480),
                  child: MouseRegion(
                    onEnter: (_) => pauseFor('pointer', true),
                    onExit: (_) => pauseFor('pointer', false),
                    child: Focus(
                      onFocusChange: (v) => pauseFor('focus', v),
                      child: Semantics(
                        onDidGainAccessibilityFocus: () =>
                            pauseFor('accessibility-focus', true),
                        onDidLoseAccessibilityFocus: () =>
                            pauseFor('accessibility-focus', false),
                        child: Material(
                          color: Theme.of(context).colorScheme.surface,
                          elevation: 4,
                          borderRadius: BorderRadius.circular(8),
                          child: Row(
                            children: [
                              Expanded(child: RosemaryToast(message: message)),
                              IconButton(
                                tooltip: '关闭通知',
                                onPressed: () => widget.controller.dismiss(id),
                                icon: const Icon(Icons.close),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    ],
  );
}

/// Host preference extends the system setting; it never cancels OS reduced motion.
class RosemaryMotionScope extends StatelessWidget {
  final bool reducedMotion;
  final Widget child;
  const RosemaryMotionScope({
    super.key,
    required this.reducedMotion,
    required this.child,
  });
  @override
  Widget build(BuildContext context) => MediaQuery(
    data: MediaQuery.of(context).copyWith(
      disableAnimations:
          reducedMotion || MediaQuery.disableAnimationsOf(context),
    ),
    child: child,
  );
}
