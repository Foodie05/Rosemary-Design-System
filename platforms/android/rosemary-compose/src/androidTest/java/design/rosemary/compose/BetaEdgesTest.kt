@file:OptIn(androidx.compose.ui.test.ExperimentalTestApi::class)

package design.rosemary.compose

import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import androidx.compose.ui.unit.Density
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test

class BetaEdgesTest {
    @get:Rule val compose = createComposeRule()

    @Test
    fun comboKeyboardSkipsDisabledAndDoesNotRewriteRejectedQuery() {
        var query by mutableStateOf("")
        val requests = mutableListOf<String>()
        compose.setContent {
            RosemaryTheme {
                RosemaryComboBox(
                    query,
                    { query = it },
                    "成员",
                    listOf(
                        RosemaryOption("locked", "禁用", false),
                        RosemaryOption("one", "第一项"),
                        RosemaryOption("two", "第二项"),
                    ),
                    { requests.add(it) },
                )
            }
        }
        compose.onNodeWithText("成员").performClick()
        compose.onNodeWithText("成员").performKeyInput {
            pressKey(Key.DirectionDown)
            pressKey(Key.Enter)
        }
        compose.runOnIdle {
            assertEquals(listOf("one"), requests)
            assertEquals("", query)
        }
        compose.onNodeWithText("成员").performKeyInput {
            pressKey(Key.Escape)
            pressKey(Key.Enter)
        }
        compose.runOnIdle { assertEquals(listOf("one"), requests) }
    }

    @Test
    fun replacementModalUsesOriginalCallbackExactlyOnce() {
        var current by mutableStateOf("A")
        var visible by mutableStateOf(true)
        val events = mutableListOf<String>()
        compose.setContent {
            RosemaryTheme {
                if (visible) {
                    val captured = current
                    RosemaryModal(
                        current,
                        "会话 $current",
                        {
                            events.add("$captured:$it")
                            if (captured == "B") visible = false
                        },
                    ) {
                        Text("草稿 $current")
                    }
                }
            }
        }
        compose.runOnIdle { current = "B" }
        compose.onNodeWithText("会话 B").assertExists()
        compose.runOnIdle { assertEquals(listOf("A:Programmatic"), events) }
        compose.onNodeWithText("取消").performClick()
        compose.runOnIdle { assertEquals(listOf("A:Programmatic", "B:Cancel"), events) }
    }

    @Test
    fun drawerDoesNotCloseOnOpeningAndReconcilesRejectedDismissal() {
        var closes = 0
        compose.setContent {
            CompositionLocalProvider(LocalDensity provides Density(1f)) {
                RosemaryTheme {
                    RosemaryDrawer(
                        "项目",
                        listOf(RosemaryItem("one", "设计规范")),
                        "one",
                        {},
                        true,
                        { closes++ },
                    ) {
                        Text("宿主内容")
                    }
                }
            }
        }
        compose.waitForIdle()
        compose.runOnIdle { assertEquals(0, closes) }
        compose.onRoot().performTouchInput { click(Offset(width - 8f, height / 2f)) }
        compose.waitForIdle()
        compose.runOnIdle { assertEquals(1, closes) }
        compose.onNodeWithText("设计规范").assertIsDisplayed()
    }

    @Test
    fun commandEndWrapsToFirstEnabledChoice() {
        var result: String? = null
        compose.setContent {
            RosemaryTheme {
                RosemaryCommandPalette(
                    listOf(
                        RosemaryAction("a", "A", { result = "a" }),
                        RosemaryAction("b", "B", { result = "b" }),
                    ),
                    {},
                )
            }
        }
        compose.onNodeWithText("搜索命令").performClick()
        compose.onNodeWithText("搜索命令").performKeyInput {
            pressKey(Key.MoveEnd)
            pressKey(Key.DirectionDown)
            pressKey(Key.Enter)
        }
        compose.runOnIdle { assertEquals("a", result) }
    }
}
