package design.rosemary.sample

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.*
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.unit.*
import design.rosemary.compose.RosemaryTheme
import org.junit.Rule
import org.junit.Test

class GalleryTest {
    @get:Rule val compose = createComposeRule()

    @Test
    fun all61ThemesRTLAndLargeType() {
        var id by mutableStateOf("button")
        var dark by mutableStateOf(false)
        var rtl by mutableStateOf(false)
        compose.setContent {
            CompositionLocalProvider(
                LocalDensity provides Density(1f, 2f),
                LocalLayoutDirection provides if (rtl) LayoutDirection.Rtl else LayoutDirection.Ltr,
            ) {
                RosemaryTheme(dark = dark) {
                    Box(Modifier.width(320.dp)) { key(id, dark, rtl) { Gallery(initialId = id) } }
                }
            }
        }
        for (theme in listOf(false, true)) for (direction in listOf(false, true)) for (component in
            rosemaryGalleryIds) {
            compose.runOnIdle {
                dark = theme
                rtl = direction
                id = component
            }
            compose.waitForIdle()
            compose.onNodeWithText("组件预览 · $component").assertExists()
        }
    }
}
