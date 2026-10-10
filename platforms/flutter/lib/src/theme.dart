import 'package:flutter/material.dart';
import '../rosemary_tokens.dart';

@immutable
class RosemaryTheme extends ThemeExtension<RosemaryTheme> {
  final Color accent, onAccent, surface, ink, border, danger;
  const RosemaryTheme({
    required this.accent,
    required this.onAccent,
    required this.surface,
    required this.ink,
    required this.border,
    required this.danger,
  });

  static const light = RosemaryTheme(
    accent: RosemaryLightTokens.semantic_color_accent,
    onAccent: RosemaryLightTokens.semantic_color_on_accent,
    surface: RosemaryLightTokens.semantic_color_surface,
    ink: RosemaryLightTokens.semantic_color_text,
    border: RosemaryLightTokens.semantic_color_border_control,
    danger: RosemaryLightTokens.semantic_color_danger,
  );
  static const dark = RosemaryTheme(
    accent: RosemaryDarkTokens.semantic_color_accent,
    onAccent: RosemaryDarkTokens.semantic_color_on_accent,
    surface: RosemaryDarkTokens.semantic_color_surface,
    ink: RosemaryDarkTokens.semantic_color_text,
    border: RosemaryDarkTokens.semantic_color_border_control,
    danger: RosemaryDarkTokens.semantic_color_danger,
  );

  static RosemaryTheme of(BuildContext context) =>
      Theme.of(context).extension<RosemaryTheme>() ??
      (Theme.of(context).brightness == Brightness.dark ? dark : light);

  @override
  RosemaryTheme copyWith({
    Color? accent,
    Color? onAccent,
    Color? surface,
    Color? ink,
    Color? border,
    Color? danger,
  }) => RosemaryTheme(
    accent: accent ?? this.accent,
    onAccent: onAccent ?? this.onAccent,
    surface: surface ?? this.surface,
    ink: ink ?? this.ink,
    border: border ?? this.border,
    danger: danger ?? this.danger,
  );

  @override
  RosemaryTheme lerp(covariant RosemaryTheme? other, double t) {
    if (other == null) return this;
    return RosemaryTheme(
      accent: Color.lerp(accent, other.accent, t)!,
      onAccent: Color.lerp(onAccent, other.onAccent, t)!,
      surface: Color.lerp(surface, other.surface, t)!,
      ink: Color.lerp(ink, other.ink, t)!,
      border: Color.lerp(border, other.border, t)!,
      danger: Color.lerp(danger, other.danger, t)!,
    );
  }
}
