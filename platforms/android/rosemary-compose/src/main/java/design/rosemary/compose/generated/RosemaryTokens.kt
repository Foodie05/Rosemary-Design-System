// Generated from design/tokens.json. Do not edit; run pnpm design:generate.
package design.rosemary.compose.generated
import androidx.compose.ui.graphics.Color
data class RosemaryMotion(val durations: Map<String,Int>, val easing: String)
data class RosemaryTypeRole(val family: String, val fontSize: Float, val lineHeight: Float, val weight: Int)
data class RosemaryTypography(val families: Map<String,String>, val roles: Map<String,RosemaryTypeRole>, val lineHeights: Map<String,Float>, val weights: Map<String,Int>)
data class RosemaryComponentToken(val foreground: String, val background: String, val focus: String, val border: String, val radiusRole: String, val radius: Float, val dimensions: Map<String,Float>, val behavior: Map<String,String>, val flags: Map<String,Boolean>, val sizes: List<Float>)
data class RosemaryContrastPair(val foreground: String, val background: String, val target: Double)
data class RosemaryColors(
    val canvas: Color,
    val surface: Color,
    val raised: Color,
    val ink: Color,
    val muted: Color,
    val border: Color,
    val control: Color,
    val primary: Color,
    val onPrimary: Color,
    val primarySoft: Color,
    val sun: Color,
    val onSun: Color,
    val sky: Color,
    val onSky: Color,
    val success: Color,
    val successSoft: Color,
    val warning: Color,
    val warningSoft: Color,
    val danger: Color,
    val dangerSoft: Color,
    val onDanger: Color,
    val info: Color,
    val infoSoft: Color,
    val focus: Color,
) {
  fun toMap(): Map<String,Color> = mapOf("canvas" to canvas, "surface" to surface, "raised" to raised, "ink" to ink, "muted" to muted, "border" to border, "control" to control, "primary" to primary, "on-primary" to onPrimary, "primary-soft" to primarySoft, "sun" to sun, "on-sun" to onSun, "sky" to sky, "on-sky" to onSky, "success" to success, "success-soft" to successSoft, "warning" to warning, "warning-soft" to warningSoft, "danger" to danger, "danger-soft" to dangerSoft, "on-danger" to onDanger, "info" to info, "info-soft" to infoSoft, "focus" to focus)
}
object RosemaryTokens {
    const val sdkVersion = "0.4.0"
    const val specVersion = "1.2.0"
    val light = RosemaryColors(
      canvas = Color(0xFFF8F7FB),
      surface = Color(0xFFFFFFFF),
      raised = Color(0xFFFFFFFF),
      ink = Color(0xFF302B3B),
      muted = Color(0xFF706579),
      border = Color(0xFFDED8E5),
      control = Color(0xFF8D8198),
      primary = Color(0xFF614578),
      onPrimary = Color(0xFFFFFFFF),
      primarySoft = Color(0xFFE8E1F0),
      sun = Color(0xFFF3CD6B),
      onSun = Color(0xFF513F13),
      sky = Color(0xFFDDEBF6),
      onSky = Color(0xFF34516C),
      success = Color(0xFF2F6952),
      successSoft = Color(0xFFEAF4EE),
      warning = Color(0xFF815300),
      warningSoft = Color(0xFFFBF0D9),
      danger = Color(0xFFA53C46),
      dangerSoft = Color(0xFFFBECEE),
      onDanger = Color(0xFFFFFFFF),
      info = Color(0xFF315F9A),
      infoSoft = Color(0xFFEAF1FC),
      focus = Color(0xFF745291),
    )
    val dark = RosemaryColors(
      canvas = Color(0xFF1C1922),
      surface = Color(0xFF25212D),
      raised = Color(0xFF302A39),
      ink = Color(0xFFF0EAF6),
      muted = Color(0xFFB9AEC6),
      border = Color(0xFF43394F),
      control = Color(0xFF94859F),
      primary = Color(0xFFCDB5EA),
      onPrimary = Color(0xFF2D2038),
      primarySoft = Color(0xFF3C2F4C),
      sun = Color(0xFFE4C16B),
      onSun = Color(0xFF3E3010),
      sky = Color(0xFF2B4256),
      onSky = Color(0xFFD9EBFB),
      success = Color(0xFF9DD5B5),
      successSoft = Color(0xFF213D30),
      warning = Color(0xFFEBC97C),
      warningSoft = Color(0xFF44371C),
      danger = Color(0xFFF1ADB6),
      dangerSoft = Color(0xFF452830),
      onDanger = Color(0xFF30171D),
      info = Color(0xFFAAC9EF),
      infoSoft = Color(0xFF253B57),
      focus = Color(0xFFCDB5EA),
    )
    const val controlRadius = 8f
    const val contentRadius = 12f
    const val dialogRadius = 20f
    const val touchTarget = 44f
    const val buttonSmallHeight = 32f
    const val buttonMediumHeight = 40f
    const val buttonLargeHeight = 48f
    const val drawerEnterMs = 220
    const val drawerExitMs = 180
    const val tabsMs = 180
    const val loadingCycleMs = 1200
    const val progressMs = 320
    val radius = mapOf("control" to 8f, "content" to 12f, "dialog" to 20f, "pill" to 999f)
    val motion = RosemaryMotion(mapOf("instantFeedback" to 120, "state" to 180, "transition" to 260, "exit" to 160, "layout" to 240, "confirmation" to 220, "restoration" to 480, "page" to 220, "drawerEnterMs" to 220, "drawerExitMs" to 180, "tabsMs" to 180, "loadingCycleMs" to 1200, "progressMs" to 320, "progressFlowMs" to 1800, "skeletonCycleMs" to 1500), "cubic-bezier(0.2, 0.7, 0.2, 1)")
    val typography = RosemaryTypography(mapOf("ui" to "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif", "editorial" to "Songti SC, STSong, Noto Serif CJK SC, Georgia, serif", "latinEditorial" to "Georgia, Times New Roman, serif", "code" to "SFMono-Regular, Consolas, Liberation Mono, monospace"), mapOf("caption" to RosemaryTypeRole("ui", 12f, 1.5f, 400), "small" to RosemaryTypeRole("ui", 14f, 1.75f, 400), "body" to RosemaryTypeRole("ui", 16f, 1.75f, 400), "lead" to RosemaryTypeRole("ui", 20f, 1.75f, 400), "heading" to RosemaryTypeRole("editorial", 28f, 1.3f, 400), "title" to RosemaryTypeRole("editorial", 40f, 1.3f, 400), "display" to RosemaryTypeRole("editorial", 64f, 1.3f, 400)), mapOf("body" to 1.75f, "compact" to 1.5f, "heading" to 1.3f), mapOf("regular" to 400, "medium" to 500, "semibold" to 600))
    val componentTokens = mapOf("button" to RosemaryComponentToken("on-primary", "primary", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "heightSmall" to 32f, "heightMedium" to 40f, "heightLarge" to 48f, "paddingInline" to 16f), mapOf(), mapOf(), listOf()), "link" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "iconButton" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "input" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "textarea" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "select" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "search" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "checkbox" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "radio" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "switch" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "slider" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "date" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "upload" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "tabs" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "indicatorMs" to 180f, "contentMs" to 180f), mapOf(), mapOf(), listOf()), "breadcrumb" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "pagination" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "menu" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "tooltip" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "popover" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "dialog" to RosemaryComponentToken("ink", "raised", "focus", "control", "dialog", 20f, mapOf("minTouchTarget" to 44f, "enterMs" to 260f, "exitMs" to 160f), mapOf("completion" to "animation-finished"), mapOf("interruptible" to true), listOf()), "drawer" to RosemaryComponentToken("ink", "raised", "focus", "control", "dialog", 20f, mapOf("minTouchTarget" to 44f, "enterMs" to 220f, "exitMs" to 180f), mapOf("completion" to "animation-finished"), mapOf("interruptible" to true), listOf()), "toast" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "alert" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "card" to RosemaryComponentToken("ink", "surface", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "list" to RosemaryComponentToken("ink", "surface", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "table" to RosemaryComponentToken("ink", "surface", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "badge" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "avatar" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "empty" to RosemaryComponentToken("ink", "surface", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "skeleton" to RosemaryComponentToken("ink", "surface", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "loading" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "cycleMs" to 1200f, "appearanceDelayMs" to 300f), mapOf("reducedMotion" to "static", "shape" to "two-fold-long-axis"), mapOf(), listOf(17f, 32f, 48f)), "progress" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "transitionMs" to 320f), mapOf("reducedMotion" to "immediate", "valueSemantics" to "actual-completed-work"), mapOf(), listOf()), "stepper" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()))
    val spacing = listOf(4f, 8f, 12f, 16f, 24f, 32f, 48f, 64f, 96f)
    val contrastPairs = listOf(RosemaryContrastPair("ink", "canvas", 4.5), RosemaryContrastPair("muted", "canvas", 4.5), RosemaryContrastPair("ink", "surface", 4.5), RosemaryContrastPair("muted", "surface", 4.5), RosemaryContrastPair("ink", "raised", 4.5), RosemaryContrastPair("muted", "raised", 4.5), RosemaryContrastPair("on-primary", "primary", 4.5), RosemaryContrastPair("primary", "primary-soft", 4.5), RosemaryContrastPair("ink", "primary-soft", 4.5), RosemaryContrastPair("on-sun", "sun", 4.5), RosemaryContrastPair("on-sky", "sky", 4.5), RosemaryContrastPair("success", "success-soft", 4.5), RosemaryContrastPair("warning", "warning-soft", 4.5), RosemaryContrastPair("danger", "danger-soft", 4.5), RosemaryContrastPair("info", "info-soft", 4.5), RosemaryContrastPair("on-danger", "danger", 4.5), RosemaryContrastPair("control", "canvas", 3.0), RosemaryContrastPair("control", "surface", 3.0), RosemaryContrastPair("control", "raised", 3.0), RosemaryContrastPair("focus", "canvas", 3.0), RosemaryContrastPair("focus", "surface", 3.0), RosemaryContrastPair("focus", "raised", 3.0))
}
