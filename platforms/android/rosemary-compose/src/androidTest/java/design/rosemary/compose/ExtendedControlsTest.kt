@file:OptIn(androidx.compose.ui.test.ExperimentalTestApi::class)

package design.rosemary.compose

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createComposeRule
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test

class ExtendedControlsTest {
    @get:Rule val compose = createComposeRule()

    @Test
    fun numericDraftValidatesAndCommits() {
        var value = 5.0
        compose.setContent { RosemaryTheme { RosemaryNumberField("数量", value, { value = it }) } }
        compose.onNode(hasSetTextAction()).performTextReplacement("101")
        compose.onNodeWithText("应用数值").performClick()
        compose.runOnIdle { assertEquals(5.0, value, 0.0) }
        compose.onNode(hasSetTextAction()).performTextReplacement("25")
        compose.onNodeWithText("应用数值").performClick()
        compose.runOnIdle { assertEquals(25.0, value, 0.0) }
    }

    @Test
    fun longSelectionKeepsDraftUntilConfirmation() {
        var choice = "0"
        compose.setContent {
            RosemaryTheme {
                RosemarySelect(
                    "分类",
                    choice,
                    (0..20).map { RosemaryOption(it.toString(), "选项 $it", it != 2) },
                    { choice = it },
                )
            }
        }
        compose.onNodeWithText("选项 0").performClick()
        compose.onNodeWithText("搜索选项").performTextReplacement("选项 1")
        compose.onNode(hasText("选项 1") and !hasSetTextAction()).performClick()
        compose.runOnIdle { assertEquals("0", choice) }
        compose.onNodeWithText("取消").performClick()
        compose.runOnIdle { assertEquals("0", choice) }
        compose.onNodeWithText("选项 0").performClick()
        compose.onNodeWithText("搜索选项").performTextReplacement("选项 3")
        compose.onNode(hasText("选项 3") and !hasSetTextAction()).performClick()
        compose.onNodeWithText("确认").performClick()
        compose.runOnIdle { assertEquals("3", choice) }
    }

    @Test
    fun virtualGridFiltersAndTouchSelection() {
        val cfg = RosemaryGridConfiguration()
        var selection = setOf<String>()
        val rows =
            (0..999).map {
                RosemaryRecord(
                    "r$it",
                    mapOf("name" to "项目 $it", "kind" to if (it % 2 == 0) "A" else "B"),
                )
            }
        compose.setContent {
            RosemaryTheme {
                RosemaryDataGrid(
                    listOf(RosemaryColumn("name", "名称", true), RosemaryColumn("kind", "分类", true)),
                    rows,
                    selection,
                    { selection = it },
                    { _, _, _ -> },
                    cfg,
                )
            }
        }
        compose.onNodeWithContentDescription("选择 项目 0").performClick()
        compose.runOnIdle {
            assertEquals(setOf("r0"), selection)
            cfg.filters["name"] = "项目 99"
            cfg.filters["kind"] = "A"
        }
        compose.onNodeWithText("5 条记录 · 0 项已选择").assertExists()
        compose.onNodeWithContentDescription("选择 项目 990").assertExists()
        compose.onNodeWithContentDescription("选择 项目 999").assertDoesNotExist()
    }

    @Test
    fun disabledFileDoesNotInvokeSelectionOrOpen() {
        var calls = 0
        compose.setContent {
            RosemaryTheme {
                RosemaryFileRow(
                    RosemaryItem("file", "禁用文件", enabled = false),
                    false,
                    { calls++ },
                    onOpen = { calls++ },
                )
            }
        }
        compose.onNodeWithText("禁用文件").assertIsNotEnabled()
        compose.onNodeWithText("打开 禁用文件").assertIsNotEnabled()
        compose.runOnIdle { assertEquals(0, calls) }
    }

    @Test
    fun keyboardCommandSkipsDisabledAndCommitsOnce() {
        var calls = 0
        var closes = 0
        compose.setContent {
            RosemaryTheme {
                RosemaryCommandPalette(
                    listOf(
                        RosemaryAction("a", "保存", { calls++ }),
                        RosemaryAction("b", "禁用", null),
                        RosemaryAction("c", "归档", { calls += 10 }),
                    ),
                    { closes++ },
                )
            }
        }
        compose.onNodeWithText("搜索命令").performClick()
        compose.onNodeWithText("搜索命令").performKeyInput {
            pressKey(Key.DirectionDown)
            pressKey(Key.Enter)
        }
        compose.runOnIdle {
            assertEquals(10, calls)
            assertEquals(1, closes)
        }
    }

    @Test
    fun typedModalCancellationIsSingleAndDistinct() {
        var reason: RosemaryDismissReason? = null
        var visible by mutableStateOf(true)
        compose.setContent {
            RosemaryTheme {
                if (visible)
                    RosemaryModal(
                        "one",
                        "项目设置",
                        {
                            reason = it
                            visible = false
                        },
                    ) {
                        Text("草稿")
                    }
            }
        }
        compose.onNodeWithText("取消").performClick()
        compose.runOnIdle { assertEquals(RosemaryDismissReason.Cancel, reason) }
    }
}
