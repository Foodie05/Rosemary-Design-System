package design.rosemary.sample

import android.content.Context
import design.rosemary.compose.generated.RosemaryColors
import org.json.JSONObject

/** Loads the complete shared host palette; no fork of the design JSON. */
object VigiloTheme {
    fun colors(context: Context, dark: Boolean): RosemaryColors {
        val document =
            context.assets.open("vigilo.json").bufferedReader().use { JSONObject(it.readText()) }
        val theme = document.getJSONObject("themes").getJSONObject(if (dark) "dark" else "light")
        return RosemaryColors.fromHex(theme.keys().asSequence().associateWith { theme.getString(it) })
    }
}
