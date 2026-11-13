package design.rosemary.compose

import android.database.ContentObserver
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.accessibility.AccessibilityManager
import androidx.annotation.RequiresApi
import androidx.compose.foundation.border
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.colorspace.ColorSpaces
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import design.rosemary.compose.generated.*
import kotlin.math.pow
import org.json.JSONObject

enum class RosemaryThemeMode {
    System,
    Light,
    Dark,
    Inherit,
}

/** Both appearance palettes from a canonical studio/SDK JSON recipe. */
data class RosemaryColorScheme(val light: RosemaryColors, val dark: RosemaryColors) {
    companion object {
        val Default = RosemaryColorScheme(RosemaryTokens.light, RosemaryTokens.dark)

        fun fromJson(json: String): RosemaryColorScheme {
            val source = JSONObject(json)
            val modes = source.optJSONObject("colors") ?: source.optJSONObject("themes") ?: source
            fun palette(mode: String): RosemaryColors {
                val values = modes.getJSONObject(mode)
                return RosemaryColors.fromHex(
                    values.keys().asSequence().associateWith { values.getString(it) }
                )
            }
            return RosemaryColorScheme(palette("light"), palette("dark"))
        }
    }
}

enum class RosemaryTone {
    Neutral,
    Info,
    Success,
    Warning,
    Danger,
}

enum class RosemaryButtonVariant {
    Primary,
    Secondary,
    Text,
    Danger,
}

enum class RosemaryDismissReason {
    Confirm,
    Cancel,
    Outside,
    Escape,
    Back,
    Programmatic,
    Unmount,
}

private val LocalRosemaryDark = staticCompositionLocalOf { false }
private val LocalRosemaryThemePresent = staticCompositionLocalOf { false }
internal val LocalRosemaryColors = staticCompositionLocalOf { RosemaryTokens.light }
internal val LocalRosemaryReducedMotion = staticCompositionLocalOf { false }
private val LocalRosemaryHighContrast = staticCompositionLocalOf { false }

object RosemaryTheme {
    val isDark: Boolean
        @Composable get() = LocalRosemaryDark.current

    val colors: RosemaryColors
        @Composable get() = LocalRosemaryColors.current

    val reducedMotion: Boolean
        @Composable get() = LocalRosemaryReducedMotion.current

    val highContrast: Boolean
        @Composable get() = LocalRosemaryHighContrast.current
}

@RequiresApi(36)
@Composable
private fun systemHighContrastText(): Boolean {
    val context = LocalContext.current
    val manager = remember(context) { context.getSystemService(AccessibilityManager::class.java) }
    var enabled by remember(manager) { mutableStateOf(manager.isHighContrastTextEnabled) }
    DisposableEffect(manager) {
        val listener = AccessibilityManager.HighContrastTextStateChangeListener { enabled = it }
        manager.addHighContrastTextStateChangeListener(context.mainExecutor, listener)
        onDispose { manager.removeHighContrastTextStateChangeListener(listener) }
    }
    return enabled
}

/** Pass colors.copy(role = ...) for partial role overrides; nested themes inherit by default. */
@Composable
fun RosemaryTheme(
    mode: RosemaryThemeMode = RosemaryThemeMode.Inherit,
    colors: RosemaryColors? = null,
    scheme: RosemaryColorScheme? = null,
    direction: LayoutDirection? = null,
    reduceMotion: Boolean = false,
    language: RosemaryLanguage? = null,
    strings: RosemaryStrings? = null,
    onContrastDiagnostics: ((List<RosemaryContrastDiagnostic>) -> Unit)? = null,
    highContrast: Boolean = false,
    highContrastColors: RosemaryColors? = null,
    content: @Composable () -> Unit,
) {
    val parent = LocalRosemaryColors.current
    val parentPresent = LocalRosemaryThemePresent.current
    val contrastRequested =
        highContrast ||
            LocalRosemaryHighContrast.current ||
            (if (Build.VERSION.SDK_INT >= 36) systemHighContrastText() else false)
    val pair = scheme ?: RosemaryColorScheme.Default
    val dark =
        when (mode) {
            RosemaryThemeMode.Dark -> true
            RosemaryThemeMode.Light -> false
            RosemaryThemeMode.System -> isSystemInDarkTheme()
            RosemaryThemeMode.Inherit ->
                if (parentPresent) LocalRosemaryDark.current else isSystemInDarkTheme()
        }
    val resolved =
        (if (contrastRequested) highContrastColors else null)
            ?: colors
            ?: if (mode == RosemaryThemeMode.Inherit && parentPresent && scheme == null) parent
            else if (dark) pair.dark else pair.light
    val diagnostics = remember(resolved) { rosemaryValidateTheme(resolved) }
    val reportDiagnostics by rememberUpdatedState(onContrastDiagnostics)
    LaunchedEffect(diagnostics) {
        reportDiagnostics?.invoke(diagnostics)
    }
    val context = LocalContext.current
    var systemReduced by
        remember(context) {
            mutableStateOf(
                Settings.Global.getFloat(
                    context.contentResolver,
                    Settings.Global.ANIMATOR_DURATION_SCALE,
                    1f,
                ) == 0f
            )
        }
    DisposableEffect(context) {
        val observer =
            object : ContentObserver(Handler(Looper.getMainLooper())) {
                override fun onChange(selfChange: Boolean) {
                    systemReduced =
                        Settings.Global.getFloat(
                            context.contentResolver,
                            Settings.Global.ANIMATOR_DURATION_SCALE,
                            1f,
                        ) == 0f
                }
            }
        context.contentResolver.registerContentObserver(
            Settings.Global.getUriFor(Settings.Global.ANIMATOR_DURATION_SCALE),
            false,
            observer,
        )
        onDispose { context.contentResolver.unregisterContentObserver(observer) }
    }
    val inheritedStrings = LocalRosemaryStrings.current
    val resolvedStrings =
        remember(strings, language, inheritedStrings) {
            strings ?: language?.let(::defaultStrings) ?: inheritedStrings
        }
    CompositionLocalProvider(
        LocalRosemaryThemePresent provides true,
        LocalRosemaryStrings provides resolvedStrings,
        LocalRosemaryColors provides resolved,
        LocalRosemaryDark provides dark,
        LocalRosemaryHighContrast provides contrastRequested,
        LocalRosemaryReducedMotion provides
            (reduceMotion || systemReduced || LocalRosemaryReducedMotion.current),
        LocalLayoutDirection provides (direction ?: LocalLayoutDirection.current),
        content = content,
    )
}

/** Shared type roles mapped to Android platform font categories; no bundled font files. */
@Composable
fun rosemaryTextStyle(
    role: String = "body",
    color: Color = RosemaryTheme.colors.ink,
    size: TextUnit = TextUnit.Unspecified,
): TextStyle {
    val type = RosemaryTokens.typography.roles[role] ?: error("Unknown type role: $role")
    val resolved = if (size == TextUnit.Unspecified) type.fontSize.sp else size
    val family =
        when (type.family) {
            "editorial",
            "latinEditorial" -> FontFamily.Serif
            "code" -> FontFamily.Monospace
            else -> FontFamily.SansSerif
        }
    return TextStyle(
        color = color,
        fontSize = resolved,
        lineHeight = resolved * type.lineHeight,
        fontWeight = FontWeight(type.weight),
        fontFamily = family,
    )
}

internal fun rosemaryMotion(name: String): Int = RosemaryTokens.motion.durations.getValue(name)

internal fun rosemaryDimension(component: String, name: String): Dp =
    RosemaryTokens.componentTokens.getValue(component).dimensions.getValue(name).dp

internal fun rosemaryRadius(component: String): Dp =
    RosemaryTokens.componentTokens.getValue(component).radius.dp

@Composable
fun RosemaryText(
    text: String,
    modifier: Modifier = Modifier,
    color: Color = RosemaryTheme.colors.ink,
    size: TextUnit = TextUnit.Unspecified,
    role: String = "body",
) {
    BasicText(text, modifier, style = rosemaryTextStyle(role, color, size))
}

@Composable
internal fun Modifier.rosemaryFocus(radius: Dp = RosemaryTokens.controlRadius.dp): Modifier {
    var focused by remember { mutableStateOf(false) }
    val colors = RosemaryTheme.colors
    return onFocusChanged { focused = it.isFocused }
        .border(
            if (focused) 2.dp else 0.dp,
            if (focused) colors.focus else Color.Transparent,
            RoundedCornerShape(radius),
        )
}

@Composable
internal fun Modifier.rosemaryFieldFocus(invalid: Boolean = false): Modifier {
    var focused by remember { mutableStateOf(false) }
    var origin by remember { mutableFloatStateOf(.5f) }
    var pointerPending by remember { mutableStateOf(false) }
    val progress = remember { androidx.compose.animation.core.Animatable(1f) }
    val c = RosemaryTheme.colors
    val highContrast = RosemaryTheme.highContrast
    val reduce = RosemaryTheme.reducedMotion
    val opacity by
        androidx.compose.animation.core.animateFloatAsState(
            if (focused || invalid || highContrast) 1f else 0f,
            if (reduce) androidx.compose.animation.core.snap()
            else
                androidx.compose.animation.core.tween(
                    if (focused) 0 else RosemaryInteraction.fieldExitMs.toInt()
                ),
            label = "Field focus opacity",
        )
    LaunchedEffect(focused, reduce) {
        if (focused && !reduce) {
            progress.snapTo(0f)
            progress.animateTo(
                1f,
                androidx.compose.animation.core.tween(
                    RosemaryInteraction.fieldEnterMs.toInt(),
                    easing = androidx.compose.animation.core.CubicBezierEasing(.2f, .7f, .2f, 1f),
                ),
            )
        } else progress.snapTo(1f)
    }
    val radius = rosemaryRadius("input")
    return pointerInput(Unit) {
            awaitPointerEventScope {
                while (true) {
                    val event =
                        awaitPointerEvent(
                            androidx.compose.ui.input.pointer.PointerEventPass.Initial
                        )
                    if (event.changes.any { it.pressed && !it.previousPressed }) {
                        origin = (event.changes.first().position.x / size.width).coerceIn(0f, 1f)
                        pointerPending = true
                    }
                }
            }
        }
        .onFocusChanged {
            if (it.isFocused && !pointerPending) origin = .5f
            pointerPending = false
            focused = it.isFocused
        }
        .drawWithContent {
            drawContent()
            if (opacity <= 0f) return@drawWithContent
            val line = if (highContrast) 2.dp.toPx() else RosemaryInteraction.fieldWidth.dp.toPx()
            val inset = line / 2
            val w = (size.width - line).coerceAtLeast(0f)
            val h = (size.height - line).coerceAtLeast(0f)
            val rad = (radius.toPx() - inset).coerceIn(0f, minOf(w, h) / 2)
            val x = (origin * size.width - inset).coerceIn(rad, (w - rad).coerceAtLeast(rad))
            val color =
                (if (invalid) c.danger else if (focused) c.focus else c.control).copy(
                    alpha = opacity
                )
            val paths =
                (0..3).map { index ->
                    androidx.compose.ui.graphics.Path().apply {
                        if (index < 2) {
                            if (index == 0) {
                                moveTo(x, 0f)
                                lineTo(w - rad, 0f)
                                quadraticBezierTo(w, 0f, w, rad)
                                lineTo(w, h - rad)
                                quadraticBezierTo(w, h, w - rad, h)
                                lineTo(x, h)
                            } else {
                                moveTo(x, h)
                                lineTo(w - rad, h)
                                quadraticBezierTo(w, h, w, h - rad)
                                lineTo(w, rad)
                                quadraticBezierTo(w, 0f, w - rad, 0f)
                                lineTo(x, 0f)
                            }
                        } else {
                            if (index == 2) {
                                moveTo(x, 0f)
                                lineTo(rad, 0f)
                                quadraticBezierTo(0f, 0f, 0f, rad)
                                lineTo(0f, h - rad)
                                quadraticBezierTo(0f, h, rad, h)
                                lineTo(x, h)
                            } else {
                                moveTo(x, h)
                                lineTo(rad, h)
                                quadraticBezierTo(0f, h, 0f, h - rad)
                                lineTo(0f, rad)
                                quadraticBezierTo(0f, 0f, rad, 0f)
                                lineTo(x, 0f)
                            }
                        }
                    }
                }
            withTransform({ translate(inset, inset) }) {
                paths.forEach { path ->
                    val measure = androidx.compose.ui.graphics.PathMeasure()
                    measure.setPath(path, false)
                    val visible = androidx.compose.ui.graphics.Path()
                    measure.getSegment(
                        0f,
                        measure.length *
                            .501f *
                            (if (invalid || highContrast) 1f else progress.value),
                        visible,
                    )
                    drawPath(
                        visible,
                        color,
                        style = androidx.compose.ui.graphics.drawscope.Stroke(line),
                    )
                }
            }
        }
}

internal fun toneColors(colors: RosemaryColors, tone: RosemaryTone): Pair<Color, Color> =
    when (tone) {
        RosemaryTone.Info -> colors.infoSoft to colors.info
        RosemaryTone.Success -> colors.successSoft to colors.success
        RosemaryTone.Warning -> colors.warningSoft to colors.warning
        RosemaryTone.Danger -> colors.dangerSoft to colors.danger
        RosemaryTone.Neutral -> colors.primarySoft to colors.ink
    }

/** Diagnostic only: the SDK never silently changes consumer colors. */
fun rosemaryContrast(foreground: Color, background: Color): Double {
    fun luminance(color: Color): Double {
        val c = color.convert(ColorSpaces.Srgb)
        fun channel(v: Float): Double =
            if (v <= .04045f) v / 12.92 else ((v + .055) / 1.055).pow(2.4)
        return .2126 * channel(c.red) + .7152 * channel(c.green) + .0722 * channel(c.blue)
    }
    val a = luminance(foreground)
    val b = luminance(background)
    return (maxOf(a, b) + .05) / (minOf(a, b) + .05)
}

data class RosemaryContrastDiagnostic(
    val foreground: String,
    val background: String,
    val ratio: Double,
    val target: Double,
) {
    val passes
        get() = ratio >= target
}

fun rosemaryValidateTheme(colors: RosemaryColors): List<RosemaryContrastDiagnostic> {
    val map = colors.toMap()
    map.forEach { (name, color) ->
        require(
            color.colorSpace == ColorSpaces.Srgb &&
                color.alpha.isFinite() &&
                color.alpha == 1f &&
                listOf(color.red, color.green, color.blue).all { it.isFinite() && it in 0f..1f }
        ) {
            "$name must be an opaque finite sRGB color with channels in 0..1; convert wide-gamut colors explicitly before supplying a theme"
        }
    }
    return RosemaryTokens.contrastPairs.map { pair ->
        RosemaryContrastDiagnostic(
            pair.foreground,
            pair.background,
            rosemaryContrast(map.getValue(pair.foreground), map.getValue(pair.background)),
            pair.target,
        )
    }
}
