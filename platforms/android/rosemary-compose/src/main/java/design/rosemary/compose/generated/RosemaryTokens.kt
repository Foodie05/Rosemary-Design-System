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
    val surfaceNavigation: Color,
    val onNavigation: Color,
    val navigationMuted: Color,
    val navigationActive: Color,
    val onNavigationActive: Color,
    val surfaceTopbar: Color,
    val onTopbar: Color,
    val onTopbarMuted: Color,
    val topbarControl: Color,
    val surfaceGroup: Color,
    val surfaceInset: Color,
    val surfaceFloating: Color,
    val fieldFill: Color,
    val fieldHover: Color,
    val fieldLine: Color,
    val fieldLineHover: Color,
    val edgeSoft: Color,
    val secondaryContainer: Color,
    val onSecondaryContainer: Color,
    val tertiaryContainer: Color,
    val onTertiaryContainer: Color,
) {
  companion object {
    fun fromHex(values: Map<String,String>): RosemaryColors {
      require(values.keys == setOf("canvas", "surface", "raised", "ink", "muted", "border", "control", "primary", "on-primary", "primary-soft", "sun", "on-sun", "sky", "on-sky", "success", "success-soft", "warning", "warning-soft", "danger", "danger-soft", "on-danger", "info", "info-soft", "focus", "surface-navigation", "on-navigation", "navigation-muted", "navigation-active", "on-navigation-active", "surface-topbar", "on-topbar", "on-topbar-muted", "topbar-control", "surface-group", "surface-inset", "surface-floating", "field-fill", "field-hover", "field-line", "field-line-hover", "edge-soft", "secondary-container", "on-secondary-container", "tertiary-container", "on-tertiary-container")) { "Expected all 45 semantic roles" }
      fun color(name: String): Color { val value = values.getValue(name); require(Regex("#[0-9A-Fa-f]{6}").matches(value)) { "Invalid color: " + name }; return Color(0xFF000000L or value.drop(1).toLong(16)) }
      return RosemaryColors(canvas = color("canvas"), surface = color("surface"), raised = color("raised"), ink = color("ink"), muted = color("muted"), border = color("border"), control = color("control"), primary = color("primary"), onPrimary = color("on-primary"), primarySoft = color("primary-soft"), sun = color("sun"), onSun = color("on-sun"), sky = color("sky"), onSky = color("on-sky"), success = color("success"), successSoft = color("success-soft"), warning = color("warning"), warningSoft = color("warning-soft"), danger = color("danger"), dangerSoft = color("danger-soft"), onDanger = color("on-danger"), info = color("info"), infoSoft = color("info-soft"), focus = color("focus"), surfaceNavigation = color("surface-navigation"), onNavigation = color("on-navigation"), navigationMuted = color("navigation-muted"), navigationActive = color("navigation-active"), onNavigationActive = color("on-navigation-active"), surfaceTopbar = color("surface-topbar"), onTopbar = color("on-topbar"), onTopbarMuted = color("on-topbar-muted"), topbarControl = color("topbar-control"), surfaceGroup = color("surface-group"), surfaceInset = color("surface-inset"), surfaceFloating = color("surface-floating"), fieldFill = color("field-fill"), fieldHover = color("field-hover"), fieldLine = color("field-line"), fieldLineHover = color("field-line-hover"), edgeSoft = color("edge-soft"), secondaryContainer = color("secondary-container"), onSecondaryContainer = color("on-secondary-container"), tertiaryContainer = color("tertiary-container"), onTertiaryContainer = color("on-tertiary-container"))
    }
  }
  fun toMap(): Map<String,Color> = mapOf("canvas" to canvas, "surface" to surface, "raised" to raised, "ink" to ink, "muted" to muted, "border" to border, "control" to control, "primary" to primary, "on-primary" to onPrimary, "primary-soft" to primarySoft, "sun" to sun, "on-sun" to onSun, "sky" to sky, "on-sky" to onSky, "success" to success, "success-soft" to successSoft, "warning" to warning, "warning-soft" to warningSoft, "danger" to danger, "danger-soft" to dangerSoft, "on-danger" to onDanger, "info" to info, "info-soft" to infoSoft, "focus" to focus, "surface-navigation" to surfaceNavigation, "on-navigation" to onNavigation, "navigation-muted" to navigationMuted, "navigation-active" to navigationActive, "on-navigation-active" to onNavigationActive, "surface-topbar" to surfaceTopbar, "on-topbar" to onTopbar, "on-topbar-muted" to onTopbarMuted, "topbar-control" to topbarControl, "surface-group" to surfaceGroup, "surface-inset" to surfaceInset, "surface-floating" to surfaceFloating, "field-fill" to fieldFill, "field-hover" to fieldHover, "field-line" to fieldLine, "field-line-hover" to fieldLineHover, "edge-soft" to edgeSoft, "secondary-container" to secondaryContainer, "on-secondary-container" to onSecondaryContainer, "tertiary-container" to tertiaryContainer, "on-tertiary-container" to onTertiaryContainer)
}
object RosemaryTokens {
    const val sdkVersion = "0.5.0"
    const val specVersion = "1.3.0"
    val light = RosemaryColors(
      canvas = Color(0xFFFEF7FC),
      surface = Color(0xFFFFFFFF),
      raised = Color(0xFFFFFFFF),
      ink = Color(0xFF1D1B1E),
      muted = Color(0xFF494649),
      border = Color(0xFFD0CACF),
      control = Color(0xFF6D696D),
      primary = Color(0xFF6A4E81),
      onPrimary = Color(0xFFFFFFFF),
      primarySoft = Color(0xFFF6EAF9),
      sun = Color(0xFFFFEADE),
      onSun = Color(0xFF4B270C),
      sky = Color(0xFFFFE8F6),
      onSky = Color(0xFF3F2A3A),
      success = Color(0xFF235D37),
      successSoft = Color(0xFFEEF6EB),
      warning = Color(0xFF654900),
      warningSoft = Color(0xFFFFF2E0),
      danger = Color(0xFF972C25),
      dangerSoft = Color(0xFFFFF0EE),
      onDanger = Color(0xFFFFFFFF),
      info = Color(0xFF1B577E),
      infoSoft = Color(0xFFEFF4FC),
      focus = Color(0xFF563B6D),
      surfaceNavigation = Color(0xFFEFE5F0),
      onNavigation = Color(0xFF342E37),
      navigationMuted = Color(0xFF4B454D),
      navigationActive = Color(0xFF785D8E),
      onNavigationActive = Color(0xFFFFFFFF),
      surfaceTopbar = Color(0xFFFDF0F7),
      onTopbar = Color(0xFF352E33),
      onTopbarMuted = Color(0xFF4C454A),
      topbarControl = Color(0xFFEEE2E9),
      surfaceGroup = Color(0xFFFFFFFF),
      surfaceInset = Color(0xFFF6EFF3),
      surfaceFloating = Color(0xFFFFFFFF),
      fieldFill = Color(0xFFF3ECF1),
      fieldHover = Color(0xFFEDE6EB),
      fieldLine = Color(0xFF6D696D),
      fieldLineHover = Color(0xFF5C585C),
      edgeSoft = Color(0xFFD9D3D7),
      secondaryContainer = Color(0xFFFFE8F6),
      onSecondaryContainer = Color(0xFF3F2A3A),
      tertiaryContainer = Color(0xFFFFEADE),
      onTertiaryContainer = Color(0xFF4B270C),
    )
    val dark = RosemaryColors(
      canvas = Color(0xFF211F22),
      surface = Color(0xFF2E2B2F),
      raised = Color(0xFF3B383C),
      ink = Color(0xFFF6EFF3),
      muted = Color(0xFFC5BFC4),
      border = Color(0xFF5A565A),
      control = Color(0xFFAFAAAE),
      primary = Color(0xFFDCB9F5),
      onPrimary = Color(0xFF3A2050),
      primarySoft = Color(0xFF403944),
      sun = Color(0xFF4A372B),
      onSun = Color(0xFFFFDCC7),
      sky = Color(0xFF463742),
      onSky = Color(0xFFFAD9F0),
      success = Color(0xFF97D5A5),
      successSoft = Color(0xFF2F3730),
      warning = Color(0xFFF3C666),
      warningSoft = Color(0xFF3B3428),
      danger = Color(0xFFFFB4AB),
      dangerSoft = Color(0xFF403130),
      onDanger = Color(0xFF540003),
      info = Color(0xFF98CCF9),
      infoSoft = Color(0xFF30353B),
      focus = Color(0xFFEED3FF),
      surfaceNavigation = Color(0xFF18141B),
      onNavigation = Color(0xFFEFE5F0),
      navigationMuted = Color(0xFFC7BEC9),
      navigationActive = Color(0xFF785D8E),
      onNavigationActive = Color(0xFFFFFFFF),
      surfaceTopbar = Color(0xFF201A1E),
      onTopbar = Color(0xFFF1E5EB),
      onTopbarMuted = Color(0xFFC9BEC4),
      topbarControl = Color(0xFF352E33),
      surfaceGroup = Color(0xFF2E2B2F),
      surfaceInset = Color(0xFF322F33),
      surfaceFloating = Color(0xFF3B383C),
      fieldFill = Color(0xFF373437),
      fieldHover = Color(0xFF3E3A3E),
      fieldLine = Color(0xFFAFAAAE),
      fieldLineHover = Color(0xFFC5BFC4),
      edgeSoft = Color(0xFF575458),
      secondaryContainer = Color(0xFF463742),
      onSecondaryContainer = Color(0xFFFAD9F0),
      tertiaryContainer = Color(0xFF4A372B),
      onTertiaryContainer = Color(0xFFFFDCC7),
    )
    const val contentMax = 1480f
    const val gridGap = 24f
    const val compactGridGap = 16f
    const val shellHeight = 76f
    const val headerIconSize = 20f
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
    val componentTokens = mapOf("button" to RosemaryComponentToken("on-primary", "primary", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "heightSmall" to 32f, "heightMedium" to 40f, "heightLarge" to 48f, "paddingInline" to 16f, "darkFillInset" to 1f), mapOf(), mapOf(), listOf()), "link" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "iconButton" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "input" to RosemaryComponentToken("ink", "field-fill", "focus", "field-line", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "textarea" to RosemaryComponentToken("ink", "field-fill", "focus", "field-line", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "select" to RosemaryComponentToken("ink", "field-fill", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "search" to RosemaryComponentToken("ink", "field-fill", "focus", "field-line", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "checkbox" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "radio" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "switch" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "slider" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "date" to RosemaryComponentToken("ink", "field-fill", "focus", "field-line", "control", 8f, mapOf("minTouchTarget" to 44f, "minHeight" to 44f), mapOf(), mapOf(), listOf()), "upload" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "tabs" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "indicatorMs" to 180f, "contentMs" to 180f), mapOf(), mapOf(), listOf()), "breadcrumb" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "pagination" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "menu" to RosemaryComponentToken("ink", "surface-floating", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "tooltip" to RosemaryComponentToken("ink", "surface-floating", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "popover" to RosemaryComponentToken("ink", "surface-floating", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "dialog" to RosemaryComponentToken("ink", "surface-floating", "focus", "control", "dialog", 20f, mapOf("minTouchTarget" to 44f, "enterMs" to 260f, "exitMs" to 160f), mapOf("completion" to "animation-finished"), mapOf("interruptible" to true), listOf()), "drawer" to RosemaryComponentToken("ink", "surface-floating", "focus", "control", "dialog", 20f, mapOf("minTouchTarget" to 44f, "enterMs" to 220f, "exitMs" to 180f), mapOf("completion" to "animation-finished"), mapOf("interruptible" to true), listOf()), "toast" to RosemaryComponentToken("ink", "surface-floating", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "alert" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "card" to RosemaryComponentToken("ink", "surface-group", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "list" to RosemaryComponentToken("ink", "surface-group", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "table" to RosemaryComponentToken("ink", "surface-group", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "badge" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "avatar" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "empty" to RosemaryComponentToken("ink", "surface-group", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "skeleton" to RosemaryComponentToken("ink", "surface", "focus", "border", "content", 12f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()), "loading" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "cycleMs" to 1200f, "appearanceDelayMs" to 300f), mapOf("reducedMotion" to "static", "shape" to "two-fold-long-axis"), mapOf(), listOf(17f, 32f, 48f)), "progress" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f, "transitionMs" to 320f), mapOf("reducedMotion" to "immediate", "valueSemantics" to "actual-completed-work"), mapOf(), listOf()), "stepper" to RosemaryComponentToken("ink", "surface", "focus", "control", "control", 8f, mapOf("minTouchTarget" to 44f), mapOf(), mapOf(), listOf()))
    val spacing = listOf(4f, 8f, 12f, 16f, 24f, 32f, 48f, 64f, 96f)
    val contrastPairs = listOf(RosemaryContrastPair("ink", "canvas", 4.5), RosemaryContrastPair("muted", "canvas", 4.5), RosemaryContrastPair("ink", "surface", 4.5), RosemaryContrastPair("muted", "surface", 4.5), RosemaryContrastPair("ink", "raised", 4.5), RosemaryContrastPair("muted", "raised", 4.5), RosemaryContrastPair("primary", "primary-soft", 4.5), RosemaryContrastPair("ink", "primary-soft", 4.5), RosemaryContrastPair("on-primary", "primary", 4.5), RosemaryContrastPair("on-sun", "sun", 4.5), RosemaryContrastPair("on-sky", "sky", 4.5), RosemaryContrastPair("success", "success-soft", 4.5), RosemaryContrastPair("warning", "warning-soft", 4.5), RosemaryContrastPair("danger", "danger-soft", 4.5), RosemaryContrastPair("on-danger", "danger", 4.5), RosemaryContrastPair("info", "info-soft", 4.5), RosemaryContrastPair("on-navigation", "surface-navigation", 4.5), RosemaryContrastPair("on-navigation-active", "navigation-active", 4.5), RosemaryContrastPair("navigation-muted", "surface-navigation", 4.5), RosemaryContrastPair("on-topbar", "surface-topbar", 4.5), RosemaryContrastPair("on-topbar-muted", "surface-topbar", 4.5), RosemaryContrastPair("navigation-muted", "surface-topbar", 4.5), RosemaryContrastPair("ink", "surface-group", 4.5), RosemaryContrastPair("muted", "surface-group", 4.5), RosemaryContrastPair("ink", "surface-inset", 4.5), RosemaryContrastPair("muted", "surface-inset", 4.5), RosemaryContrastPair("ink", "surface-floating", 4.5), RosemaryContrastPair("muted", "surface-floating", 4.5), RosemaryContrastPair("on-topbar", "topbar-control", 4.5), RosemaryContrastPair("on-topbar-muted", "topbar-control", 4.5), RosemaryContrastPair("primary", "canvas", 4.5), RosemaryContrastPair("primary", "surface", 4.5), RosemaryContrastPair("primary", "raised", 4.5), RosemaryContrastPair("ink", "field-fill", 4.5), RosemaryContrastPair("muted", "field-fill", 4.5), RosemaryContrastPair("ink", "field-hover", 4.5), RosemaryContrastPair("muted", "field-hover", 4.5), RosemaryContrastPair("on-secondary-container", "secondary-container", 4.5), RosemaryContrastPair("on-tertiary-container", "tertiary-container", 4.5), RosemaryContrastPair("navigation-active", "surface-navigation", 3.0), RosemaryContrastPair("control", "canvas", 3.0), RosemaryContrastPair("control", "surface", 3.0), RosemaryContrastPair("control", "raised", 3.0), RosemaryContrastPair("field-line", "field-fill", 3.0), RosemaryContrastPair("field-line", "canvas", 3.0), RosemaryContrastPair("field-line", "surface-inset", 3.0), RosemaryContrastPair("field-line-hover", "field-hover", 3.0), RosemaryContrastPair("focus", "canvas", 3.0), RosemaryContrastPair("focus", "raised", 3.0), RosemaryContrastPair("focus", "surface-group", 3.0), RosemaryContrastPair("focus", "surface-inset", 3.0), RosemaryContrastPair("focus", "surface-floating", 3.0), RosemaryContrastPair("focus", "field-fill", 3.0), RosemaryContrastPair("focus", "surface", 3.0), RosemaryContrastPair("focus", "surface-navigation", 3.0), RosemaryContrastPair("focus", "surface-topbar", 3.0))
}
