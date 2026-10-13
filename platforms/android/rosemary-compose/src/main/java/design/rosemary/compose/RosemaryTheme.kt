package design.rosemary.compose

import android.provider.Settings
import android.database.ContentObserver
import android.os.Handler
import android.os.Looper
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.colorspace.ColorSpaces
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.unit.*
import androidx.compose.foundation.shape.RoundedCornerShape
import design.rosemary.compose.generated.*
import kotlin.math.pow

enum class RosemaryThemeMode { System, Light, Dark, Inherit }
enum class RosemaryTone { Neutral, Info, Success, Warning, Danger }
enum class RosemaryButtonVariant { Primary, Secondary, Text, Danger }
enum class RosemaryDismissReason { Confirm, Cancel, Outside, Escape, Back, Programmatic, Unmount }
private val LocalRosemaryThemePresent = staticCompositionLocalOf { false }
internal val LocalRosemaryColors = staticCompositionLocalOf { RosemaryTokens.light }
internal val LocalRosemaryReducedMotion = staticCompositionLocalOf { false }
object RosemaryTheme {
 val colors: RosemaryColors @Composable get() = LocalRosemaryColors.current
 val reducedMotion: Boolean @Composable get() = LocalRosemaryReducedMotion.current
}
/** Pass colors.copy(role = ...) for partial role overrides; nested themes inherit by default. */
@Composable fun RosemaryTheme(
 mode: RosemaryThemeMode = RosemaryThemeMode.Inherit,
 colors: RosemaryColors? = null,
 direction: LayoutDirection? = null,
 reduceMotion: Boolean = false,
 language: RosemaryLanguage? = null,
 strings: RosemaryStrings? = null,
 onContrastDiagnostics: ((List<RosemaryContrastDiagnostic>) -> Unit)? = null,
 content: @Composable () -> Unit
) {
 val parent = LocalRosemaryColors.current
 val parentPresent = LocalRosemaryThemePresent.current
 val resolved = colors ?: when(mode) { RosemaryThemeMode.System -> if(isSystemInDarkTheme()) RosemaryTokens.dark else RosemaryTokens.light; RosemaryThemeMode.Light -> RosemaryTokens.light; RosemaryThemeMode.Dark -> RosemaryTokens.dark; RosemaryThemeMode.Inherit -> if(parentPresent)parent else if(isSystemInDarkTheme())RosemaryTokens.dark else RosemaryTokens.light }
 val diagnostics = remember(resolved) { rosemaryValidateTheme(resolved) }
 LaunchedEffect(diagnostics,onContrastDiagnostics){onContrastDiagnostics?.invoke(diagnostics)}
 val context = LocalContext.current
 var systemReduced by remember(context){mutableStateOf(Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f)==0f)}
 DisposableEffect(context){val observer=object:ContentObserver(Handler(Looper.getMainLooper())){override fun onChange(selfChange:Boolean){systemReduced=Settings.Global.getFloat(context.contentResolver,Settings.Global.ANIMATOR_DURATION_SCALE,1f)==0f}};context.contentResolver.registerContentObserver(Settings.Global.getUriFor(Settings.Global.ANIMATOR_DURATION_SCALE),false,observer);onDispose{context.contentResolver.unregisterContentObserver(observer)}}
 val inheritedStrings=LocalRosemaryStrings.current
 val resolvedStrings=remember(strings,language,inheritedStrings){strings ?: language?.let(::defaultStrings) ?: inheritedStrings}
 CompositionLocalProvider(LocalRosemaryThemePresent provides true, LocalRosemaryStrings provides resolvedStrings, LocalRosemaryColors provides resolved, LocalRosemaryReducedMotion provides (reduceMotion || systemReduced || LocalRosemaryReducedMotion.current), LocalLayoutDirection provides (direction ?: LocalLayoutDirection.current), content = content)
}
@Composable fun RosemaryText(text: String, modifier: Modifier = Modifier, color: Color = RosemaryTheme.colors.ink, size: TextUnit = 16.sp) {
 BasicText(text, modifier, style = TextStyle(color = color, fontSize = size, lineHeight = size * 1.5f))
}
@Composable internal fun Modifier.rosemaryFocus(radius: Dp = 8.dp): Modifier {
 var focused by remember { mutableStateOf(false) }
 val colors = RosemaryTheme.colors
 return onFocusChanged { focused = it.isFocused }.border(if(focused) 2.dp else 0.dp, if(focused) colors.focus else Color.Transparent, RoundedCornerShape(radius))
}
internal fun toneColors(colors: RosemaryColors, tone: RosemaryTone): Pair<Color, Color> = when(tone) {
 RosemaryTone.Info -> colors.infoSoft to colors.info
 RosemaryTone.Success -> colors.successSoft to colors.success
 RosemaryTone.Warning -> colors.warningSoft to colors.warning
 RosemaryTone.Danger -> colors.dangerSoft to colors.danger
 RosemaryTone.Neutral -> colors.primarySoft to colors.ink
}
/** Diagnostic only: the SDK never silently changes consumer colors. */
fun rosemaryContrast(foreground: Color, background: Color): Double {
 fun luminance(color: Color): Double { val c=color.convert(ColorSpaces.Srgb); fun channel(v: Float): Double = if(v <= .04045f) v / 12.92 else ((v + .055) / 1.055).pow(2.4)
 return .2126*channel(c.red)+.7152*channel(c.green)+.0722*channel(c.blue) }
 val a=luminance(foreground);val b=luminance(background);return (maxOf(a,b)+.05)/(minOf(a,b)+.05)
}

data class RosemaryContrastDiagnostic(val foreground:String,val background:String,val ratio:Double,val target:Double) {val passes get() = ratio >= target}
fun rosemaryValidateTheme(colors:RosemaryColors):List<RosemaryContrastDiagnostic> {
 val map=colors.toMap()
 map.forEach{(name,color)->require(color.colorSpace==ColorSpaces.Srgb && color.alpha.isFinite() && color.alpha==1f && listOf(color.red,color.green,color.blue).all{it.isFinite() && it in 0f..1f}){"$name must be an opaque finite sRGB color with channels in 0..1; convert wide-gamut colors explicitly before supplying a theme"}}
 return RosemaryTokens.contrastPairs.map{pair->RosemaryContrastDiagnostic(pair.foreground,pair.background,rosemaryContrast(map.getValue(pair.foreground),map.getValue(pair.background)),pair.target)}
}
