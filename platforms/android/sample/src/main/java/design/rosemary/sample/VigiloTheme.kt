package design.rosemary.sample
import android.content.Context
import androidx.compose.ui.graphics.Color
import design.rosemary.compose.generated.RosemaryColors
import org.json.JSONObject
/** Loads the complete shared host palette; no fork of the design JSON. */
object VigiloTheme {
 fun colors(context:Context,dark:Boolean):RosemaryColors {
  val document=context.assets.open("vigilo.json").bufferedReader().use{JSONObject(it.readText())}
  val theme=document.getJSONObject("themes").getJSONObject(if(dark)"dark"else"light")
  fun color(role:String)=Color(android.graphics.Color.parseColor(theme.getString(role)))
  return RosemaryColors(
   canvas = color("canvas"),
   surface = color("surface"),
   raised = color("raised"),
   ink = color("ink"),
   muted = color("muted"),
   border = color("border"),
   control = color("control"),
   primary = color("primary"),
   onPrimary = color("on-primary"),
   primarySoft = color("primary-soft"),
   sun = color("sun"),
   onSun = color("on-sun"),
   sky = color("sky"),
   onSky = color("on-sky"),
   success = color("success"),
   successSoft = color("success-soft"),
   warning = color("warning"),
   warningSoft = color("warning-soft"),
   danger = color("danger"),
   dangerSoft = color("danger-soft"),
   onDanger = color("on-danger"),
   info = color("info"),
   infoSoft = color("info-soft"),
   focus = color("focus"),
  )
 }
}
