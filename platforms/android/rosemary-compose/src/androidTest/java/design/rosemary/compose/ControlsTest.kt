package design.rosemary.compose

import androidx.compose.runtime.*
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test

class ControlsTest {
    @get:Rule val compose = createComposeRule()

    @Test
    fun busyPreventsDuplicateSubmissionAndKeepsLabel() {
        var calls = 0
        compose.setContent { RosemaryTheme { RosemaryButton("保存", { calls++ }, busy = true) } }
        compose.onNodeWithText("保存").assertIsNotEnabled()
        assertEquals(0, calls)
    }

    @Test
    fun disabledSelectionAndExplicitCommit() {
        var value: String? = "a"
        compose.setContent {
            RosemaryTheme {
                RosemarySelect(
                    "分类",
                    value,
                    listOf(
                        RosemaryOption("a", "个人"),
                        RosemaryOption("b", "团队", false),
                        RosemaryOption("c", "公开"),
                    ),
                    { value = it },
                )
            }
        }
        compose.onNodeWithText("个人").performClick()
        compose.onNodeWithText("团队").assertIsNotEnabled()
        compose.onNodeWithText("公开").performClick()
        compose.runOnIdle { assertEquals("c", value) }
    }

    @Test
    fun checkboxIsHostControlled() {
        var clicked = false
        compose.setContent {
            RosemaryTheme { RosemaryCheckbox("通知我", ToggleableState.Off, { clicked = true }) }
        }
        compose.onNodeWithText("通知我").performClick()
        compose.onNodeWithText("通知我").assertIsOff()
        compose.runOnIdle { assertTrue(clicked) }
    }

    @Test
    fun cancelNeverConfirms() {
        var confirmed = false
        var cancelled: RosemaryDismissReason? = null
        compose.setContent {
            RosemaryTheme {
                RosemaryDialog("编辑", { cancelled = it }, { confirmed = true }) {
                    androidx.compose.material3.Text("草稿")
                }
            }
        }
        compose.onNodeWithText("取消").performClick()
        compose.runOnIdle {
            assertFalse(confirmed)
            assertEquals(RosemaryDismissReason.Cancel, cancelled)
        }
    }
}
