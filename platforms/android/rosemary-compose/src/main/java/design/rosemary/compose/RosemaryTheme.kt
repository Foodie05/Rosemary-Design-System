package design.rosemary.compose

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import design.rosemary.tokens.RosemaryDarkTokens as D
import design.rosemary.tokens.RosemaryLightTokens as L

@Composable
fun RosemaryTheme(
    dark: Boolean = isSystemInDarkTheme(),
    reducedMotion: Boolean = false,
    content: @Composable () -> Unit,
) {
    val colors =
        if (dark)
            darkColorScheme(
                primary = D.semantic_color_accent,
                onPrimary = D.semantic_color_on_accent,
                primaryContainer = D.semantic_color_accent_subtle,
                onPrimaryContainer = D.semantic_color_text,
                secondary = D.semantic_color_accent,
                onSecondary = D.semantic_color_on_accent,
                secondaryContainer = D.semantic_color_accent_subtle,
                onSecondaryContainer = D.semantic_color_text,
                tertiary = D.semantic_color_info,
                onTertiary = D.semantic_color_on_accent,
                tertiaryContainer = D.semantic_color_info_subtle,
                onTertiaryContainer = D.semantic_color_text,
                background = D.semantic_color_canvas,
                onBackground = D.semantic_color_text,
                surface = D.semantic_color_surface,
                onSurface = D.semantic_color_text,
                surfaceVariant = D.semantic_color_surface_subtle,
                onSurfaceVariant = D.semantic_color_text_secondary,
                surfaceTint = D.semantic_color_accent,
                surfaceDim = D.semantic_color_canvas,
                surfaceBright = D.semantic_color_surface,
                surfaceContainerLowest = D.semantic_color_canvas,
                surfaceContainerLow = D.semantic_color_surface,
                surfaceContainer = D.semantic_color_surface,
                surfaceContainerHigh = D.semantic_color_surface_subtle,
                surfaceContainerHighest = D.semantic_color_surface_subtle,
                outline = D.semantic_color_border_control,
                outlineVariant = D.semantic_color_border,
                error = D.semantic_color_danger,
                onError = D.semantic_color_on_accent,
                errorContainer = D.semantic_color_danger_subtle,
                onErrorContainer = D.semantic_color_text,
                scrim = D.semantic_color_overlay,
                inverseSurface = L.semantic_color_canvas,
                inverseOnSurface = L.semantic_color_text,
                inversePrimary = L.semantic_color_accent,
            )
        else
            lightColorScheme(
                primary = L.semantic_color_accent,
                onPrimary = L.semantic_color_on_accent,
                primaryContainer = L.semantic_color_accent_subtle,
                onPrimaryContainer = L.semantic_color_text,
                secondary = L.semantic_color_accent,
                onSecondary = L.semantic_color_on_accent,
                secondaryContainer = L.semantic_color_accent_subtle,
                onSecondaryContainer = L.semantic_color_text,
                tertiary = L.semantic_color_info,
                onTertiary = L.semantic_color_on_accent,
                tertiaryContainer = L.semantic_color_info_subtle,
                onTertiaryContainer = L.semantic_color_text,
                background = L.semantic_color_canvas,
                onBackground = L.semantic_color_text,
                surface = L.semantic_color_surface,
                onSurface = L.semantic_color_text,
                surfaceVariant = L.semantic_color_surface_subtle,
                onSurfaceVariant = L.semantic_color_text_secondary,
                surfaceTint = L.semantic_color_accent,
                surfaceDim = L.semantic_color_canvas,
                surfaceBright = L.semantic_color_surface,
                surfaceContainerLowest = L.semantic_color_canvas,
                surfaceContainerLow = L.semantic_color_surface,
                surfaceContainer = L.semantic_color_surface,
                surfaceContainerHigh = L.semantic_color_surface_subtle,
                surfaceContainerHighest = L.semantic_color_surface_subtle,
                outline = L.semantic_color_border_control,
                outlineVariant = L.semantic_color_border,
                error = L.semantic_color_danger,
                onError = L.semantic_color_on_accent,
                errorContainer = L.semantic_color_danger_subtle,
                onErrorContainer = L.semantic_color_text,
                scrim = L.semantic_color_overlay,
                inverseSurface = D.semantic_color_canvas,
                inverseOnSurface = D.semantic_color_text,
                inversePrimary = D.semantic_color_accent,
            )
    val policy = rememberRosemaryPolicy(reducedMotion)
    androidx.compose.runtime.CompositionLocalProvider(LocalRosemaryPolicy provides policy) {
        MaterialTheme(colorScheme = colors, content = content)
    }
}
