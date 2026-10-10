package design.rosemary.compose
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import design.rosemary.tokens.RosemaryLightTokens as L
import design.rosemary.tokens.RosemaryDarkTokens as D
@Composable fun RosemaryTheme(dark: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit) {
 val colors = if (dark) darkColorScheme(primary=D.semantic_color_accent, onPrimary=D.semantic_color_on_accent,
  background=D.semantic_color_canvas, onBackground=D.semantic_color_text, surface=D.semantic_color_surface,
  onSurface=D.semantic_color_text, surfaceVariant=D.semantic_color_surface_subtle,
  onSurfaceVariant=D.semantic_color_text_secondary, outline=D.semantic_color_border_control, error=D.semantic_color_danger)
 else lightColorScheme(primary=L.semantic_color_accent, onPrimary=L.semantic_color_on_accent,
  background=L.semantic_color_canvas, onBackground=L.semantic_color_text, surface=L.semantic_color_surface,
  onSurface=L.semantic_color_text, surfaceVariant=L.semantic_color_surface_subtle,
  onSurfaceVariant=L.semantic_color_text_secondary, outline=L.semantic_color_border_control, error=L.semantic_color_danger)
 MaterialTheme(colorScheme=colors, content=content)
}
