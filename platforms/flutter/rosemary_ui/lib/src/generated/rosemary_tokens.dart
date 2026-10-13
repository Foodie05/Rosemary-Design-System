// Generated from design/tokens.json. Do not edit; run pnpm design:generate.
import 'dart:ui';
class RosemaryContrastPair { final String foreground, background; final double target; const RosemaryContrastPair(this.foreground,this.background,this.target); }
class RosemaryColors {
  final Color canvas;
  final Color surface;
  final Color raised;
  final Color ink;
  final Color muted;
  final Color border;
  final Color control;
  final Color primary;
  final Color onPrimary;
  final Color primarySoft;
  final Color sun;
  final Color onSun;
  final Color sky;
  final Color onSky;
  final Color success;
  final Color successSoft;
  final Color warning;
  final Color warningSoft;
  final Color danger;
  final Color dangerSoft;
  final Color onDanger;
  final Color info;
  final Color infoSoft;
  final Color focus;
  const RosemaryColors({required this.canvas, required this.surface, required this.raised, required this.ink, required this.muted, required this.border, required this.control, required this.primary, required this.onPrimary, required this.primarySoft, required this.sun, required this.onSun, required this.sky, required this.onSky, required this.success, required this.successSoft, required this.warning, required this.warningSoft, required this.danger, required this.dangerSoft, required this.onDanger, required this.info, required this.infoSoft, required this.focus});
  RosemaryColors copyWith({Color? canvas, Color? surface, Color? raised, Color? ink, Color? muted, Color? border, Color? control, Color? primary, Color? onPrimary, Color? primarySoft, Color? sun, Color? onSun, Color? sky, Color? onSky, Color? success, Color? successSoft, Color? warning, Color? warningSoft, Color? danger, Color? dangerSoft, Color? onDanger, Color? info, Color? infoSoft, Color? focus}) => RosemaryColors(canvas: canvas ?? this.canvas, surface: surface ?? this.surface, raised: raised ?? this.raised, ink: ink ?? this.ink, muted: muted ?? this.muted, border: border ?? this.border, control: control ?? this.control, primary: primary ?? this.primary, onPrimary: onPrimary ?? this.onPrimary, primarySoft: primarySoft ?? this.primarySoft, sun: sun ?? this.sun, onSun: onSun ?? this.onSun, sky: sky ?? this.sky, onSky: onSky ?? this.onSky, success: success ?? this.success, successSoft: successSoft ?? this.successSoft, warning: warning ?? this.warning, warningSoft: warningSoft ?? this.warningSoft, danger: danger ?? this.danger, dangerSoft: dangerSoft ?? this.dangerSoft, onDanger: onDanger ?? this.onDanger, info: info ?? this.info, infoSoft: infoSoft ?? this.infoSoft, focus: focus ?? this.focus);
  RosemaryColors lerp(RosemaryColors other, double t) => RosemaryColors(canvas: Color.lerp(canvas, other.canvas, t)!, surface: Color.lerp(surface, other.surface, t)!, raised: Color.lerp(raised, other.raised, t)!, ink: Color.lerp(ink, other.ink, t)!, muted: Color.lerp(muted, other.muted, t)!, border: Color.lerp(border, other.border, t)!, control: Color.lerp(control, other.control, t)!, primary: Color.lerp(primary, other.primary, t)!, onPrimary: Color.lerp(onPrimary, other.onPrimary, t)!, primarySoft: Color.lerp(primarySoft, other.primarySoft, t)!, sun: Color.lerp(sun, other.sun, t)!, onSun: Color.lerp(onSun, other.onSun, t)!, sky: Color.lerp(sky, other.sky, t)!, onSky: Color.lerp(onSky, other.onSky, t)!, success: Color.lerp(success, other.success, t)!, successSoft: Color.lerp(successSoft, other.successSoft, t)!, warning: Color.lerp(warning, other.warning, t)!, warningSoft: Color.lerp(warningSoft, other.warningSoft, t)!, danger: Color.lerp(danger, other.danger, t)!, dangerSoft: Color.lerp(dangerSoft, other.dangerSoft, t)!, onDanger: Color.lerp(onDanger, other.onDanger, t)!, info: Color.lerp(info, other.info, t)!, infoSoft: Color.lerp(infoSoft, other.infoSoft, t)!, focus: Color.lerp(focus, other.focus, t)!);
  Map<String,Color> toMap() => {'canvas': canvas, 'surface': surface, 'raised': raised, 'ink': ink, 'muted': muted, 'border': border, 'control': control, 'primary': primary, 'on-primary': onPrimary, 'primary-soft': primarySoft, 'sun': sun, 'on-sun': onSun, 'sky': sky, 'on-sky': onSky, 'success': success, 'success-soft': successSoft, 'warning': warning, 'warning-soft': warningSoft, 'danger': danger, 'danger-soft': dangerSoft, 'on-danger': onDanger, 'info': info, 'info-soft': infoSoft, 'focus': focus};
}
class RosemaryTokens {
  static const sdkVersion = '0.4.0';
  static const specVersion = '1.2.0';
  static const light = RosemaryColors(
    canvas: Color(0xFFF8F7FB),
    surface: Color(0xFFFFFFFF),
    raised: Color(0xFFFFFFFF),
    ink: Color(0xFF302B3B),
    muted: Color(0xFF706579),
    border: Color(0xFFDED8E5),
    control: Color(0xFF8D8198),
    primary: Color(0xFF614578),
    onPrimary: Color(0xFFFFFFFF),
    primarySoft: Color(0xFFE8E1F0),
    sun: Color(0xFFF3CD6B),
    onSun: Color(0xFF513F13),
    sky: Color(0xFFDDEBF6),
    onSky: Color(0xFF34516C),
    success: Color(0xFF2F6952),
    successSoft: Color(0xFFEAF4EE),
    warning: Color(0xFF815300),
    warningSoft: Color(0xFFFBF0D9),
    danger: Color(0xFFA53C46),
    dangerSoft: Color(0xFFFBECEE),
    onDanger: Color(0xFFFFFFFF),
    info: Color(0xFF315F9A),
    infoSoft: Color(0xFFEAF1FC),
    focus: Color(0xFF745291),
  );
  static const dark = RosemaryColors(
    canvas: Color(0xFF1C1922),
    surface: Color(0xFF25212D),
    raised: Color(0xFF302A39),
    ink: Color(0xFFF0EAF6),
    muted: Color(0xFFB9AEC6),
    border: Color(0xFF43394F),
    control: Color(0xFF94859F),
    primary: Color(0xFFCDB5EA),
    onPrimary: Color(0xFF2D2038),
    primarySoft: Color(0xFF3C2F4C),
    sun: Color(0xFFE4C16B),
    onSun: Color(0xFF3E3010),
    sky: Color(0xFF2B4256),
    onSky: Color(0xFFD9EBFB),
    success: Color(0xFF9DD5B5),
    successSoft: Color(0xFF213D30),
    warning: Color(0xFFEBC97C),
    warningSoft: Color(0xFF44371C),
    danger: Color(0xFFF1ADB6),
    dangerSoft: Color(0xFF452830),
    onDanger: Color(0xFF30171D),
    info: Color(0xFFAAC9EF),
    infoSoft: Color(0xFF253B57),
    focus: Color(0xFFCDB5EA),
  );
  static const controlRadius = 8.0;
  static const contentRadius = 12.0;
  static const dialogRadius = 20.0;
  static const touchTarget = 44.0;
  static const buttonSmallHeight = 32.0;
  static const buttonMediumHeight = 40.0;
  static const buttonLargeHeight = 48.0;
  static const drawerEnterMs = 220;
  static const drawerExitMs = 180;
  static const tabsMs = 180;
  static const loadingCycleMs = 1200;
  static const progressMs = 320;
  static const spacing = <double>[4.0, 8.0, 12.0, 16.0, 24.0, 32.0, 48.0, 64.0, 96.0];
  static const contrastPairs = [RosemaryContrastPair('ink', 'canvas', 4.5), RosemaryContrastPair('muted', 'canvas', 4.5), RosemaryContrastPair('ink', 'surface', 4.5), RosemaryContrastPair('muted', 'surface', 4.5), RosemaryContrastPair('ink', 'raised', 4.5), RosemaryContrastPair('muted', 'raised', 4.5), RosemaryContrastPair('on-primary', 'primary', 4.5), RosemaryContrastPair('primary', 'primary-soft', 4.5), RosemaryContrastPair('ink', 'primary-soft', 4.5), RosemaryContrastPair('on-sun', 'sun', 4.5), RosemaryContrastPair('on-sky', 'sky', 4.5), RosemaryContrastPair('success', 'success-soft', 4.5), RosemaryContrastPair('warning', 'warning-soft', 4.5), RosemaryContrastPair('danger', 'danger-soft', 4.5), RosemaryContrastPair('info', 'info-soft', 4.5), RosemaryContrastPair('on-danger', 'danger', 4.5), RosemaryContrastPair('control', 'canvas', 3.0), RosemaryContrastPair('control', 'surface', 3.0), RosemaryContrastPair('control', 'raised', 3.0), RosemaryContrastPair('focus', 'canvas', 3.0), RosemaryContrastPair('focus', 'surface', 3.0), RosemaryContrastPair('focus', 'raised', 3.0)];
}
