// Generated from design/tokens.json. Do not edit; run pnpm design:generate.
package design.rosemary.compose.generated
import androidx.compose.ui.graphics.Color
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
    val spacing = listOf(4f, 8f, 12f, 16f, 24f, 32f, 48f, 64f, 96f)
    val contrastPairs = listOf(RosemaryContrastPair("ink", "canvas", 4.5), RosemaryContrastPair("muted", "canvas", 4.5), RosemaryContrastPair("ink", "surface", 4.5), RosemaryContrastPair("muted", "surface", 4.5), RosemaryContrastPair("ink", "raised", 4.5), RosemaryContrastPair("muted", "raised", 4.5), RosemaryContrastPair("on-primary", "primary", 4.5), RosemaryContrastPair("primary", "primary-soft", 4.5), RosemaryContrastPair("ink", "primary-soft", 4.5), RosemaryContrastPair("on-sun", "sun", 4.5), RosemaryContrastPair("on-sky", "sky", 4.5), RosemaryContrastPair("success", "success-soft", 4.5), RosemaryContrastPair("warning", "warning-soft", 4.5), RosemaryContrastPair("danger", "danger-soft", 4.5), RosemaryContrastPair("info", "info-soft", 4.5), RosemaryContrastPair("on-danger", "danger", 4.5), RosemaryContrastPair("control", "canvas", 3.0), RosemaryContrastPair("control", "surface", 3.0), RosemaryContrastPair("control", "raised", 3.0), RosemaryContrastPair("focus", "canvas", 3.0), RosemaryContrastPair("focus", "surface", 3.0), RosemaryContrastPair("focus", "raised", 3.0))
}
