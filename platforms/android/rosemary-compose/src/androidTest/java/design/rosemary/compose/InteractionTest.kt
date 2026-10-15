package design.rosemary.compose

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toPixelMap
import androidx.compose.ui.input.InputMode
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.platform.LocalInputModeManager
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.SemanticsActions
import androidx.compose.ui.semantics.SemanticsProperties
import androidx.compose.ui.semantics.getOrNull
import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.unit.LayoutDirection
import java.time.LocalDate
import java.time.LocalTime
import org.junit.Assert.*
import org.junit.Rule
import org.junit.Test

@OptIn(ExperimentalTestApi::class)
class InteractionTest {
    @get:Rule val compose = createAndroidComposeRule<androidx.activity.ComponentActivity>()

    @Test
    fun inputReflectsHostValueAndMixedCheckboxEmitsOneChange() {
        var callbacks = 0
        var checked = 0
        var diagnosticReports = 0
        compose.setContent {
            val inputMode = LocalInputModeManager.current
            SideEffect { inputMode.requestInputMode(InputMode.Keyboard) }
            var value by remember { mutableStateOf("") }
            var reports by remember { mutableIntStateOf(0) }
            val highContrastPalette =
                design.rosemary.compose.generated.RosemaryTokens.light.let {
                    it.copy(border = it.ink, control = it.ink, focus = it.ink)
                }
            RosemaryTheme(
                highContrast = true,
                highContrastColors = highContrastPalette,
                onContrastDiagnostics = {
                    assertTrue(it.all { diagnostic -> diagnostic.passes })
                    reports++
                    diagnosticReports++
                },
            ) {
                val actualPalette = RosemaryTheme.colors
                val contrastRequested = RosemaryTheme.highContrast
                SideEffect {
                    assertTrue(contrastRequested)
                    assertEquals(highContrastPalette, actualPalette)
                }
                Column {
                    RosemaryText("Theme reports: $reports")
                    RosemaryInput(
                        value,
                        {
                            value = it
                            callbacks++
                        },
                        "Name",
                        error = if (value.isBlank()) "Required" else null,
                    )
                    RosemaryCheckbox(null, { checked++ }, "All projects")
                }
            }
        }
        compose.onNode(hasSetTextAction()).performTextInput("Rosemary")
        compose.onNode(hasSetTextAction()).assertTextEquals("Rosemary")
        compose.onNodeWithText("Required").assertDoesNotExist()
        compose.onNodeWithText("All projects").performClick()
        compose.runOnIdle {
            assertEquals(1, callbacks)
            assertEquals(1, checked)
            assertEquals(
                "Inline diagnostics callback reaches idle after updating its host",
                1,
                diagnosticReports,
            )
        }
    }

    @Test
    fun pickerCancelDiscardsAndApplyCommits() {
        var result = LocalDate.of(2026, 1, 1)
        compose.setContent {
            val inputMode = LocalInputModeManager.current
            SideEffect { inputMode.requestInputMode(InputMode.Keyboard) }
            var date by remember { mutableStateOf(result) }
            RosemaryTheme {
                RosemaryDate(
                    date,
                    {
                        date = it
                        result = it
                    },
                    "Date",
                )
            }
        }
        compose.onNodeWithText("2026-01-01").performClick()
        compose
            .onNode(hasSetTextAction() and hasContentDescription("Date (YYYY-MM-DD)"))
            .performTextReplacement("2026-02-28")
        compose.onNodeWithText("Cancel").performClick()
        compose.runOnIdle { assertEquals(LocalDate.of(2026, 1, 1), result) }
        compose.onNodeWithText("2026-01-01").performClick()
        compose
            .onNode(hasSetTextAction() and hasContentDescription("Date (YYYY-MM-DD)"))
            .performTextReplacement("2026-02-28")
        compose.onNodeWithText("Apply").performScrollTo().performClick()
        compose.runOnIdle { assertEquals(LocalDate.of(2026, 2, 28), result) }
    }

    @Test
    fun modalKeyboardFocusReturnsToTrigger() {
        compose.setContent {
            val inputMode = LocalInputModeManager.current
            SideEffect { inputMode.requestInputMode(InputMode.Keyboard) }
            var open by remember { mutableStateOf(false) }
            RosemaryTheme {
                Column {
                    RosemaryButton("Open", { open = true })
                    RosemaryDialog(open, "Review", { open = false }) {
                        RosemaryButton("Cancel", { open = false })
                    }
                }
            }
        }
        compose.waitUntil(3000) {
            compose.activity.window.decorView.isAttachedToWindow &&
                compose.activity.window.decorView.hasWindowFocus()
        }
        compose.runOnIdle {
            assertTrue(
                "Host view starts attached and with native focus",
                compose.activity.window.decorView.isAttachedToWindow &&
                    compose.activity.window.decorView.hasWindowFocus(),
            )
        }
        compose.onNodeWithText("Open").performSemanticsAction(SemanticsActions.RequestFocus) {
            it()
        }
        compose.onNodeWithText("Open").assertIsFocused().performKeyInput { pressKey(Key.Enter) }
        compose.onNodeWithText("Review").assertIsDisplayed()
        compose.onNodeWithText("Cancel").performSemanticsAction(SemanticsActions.RequestFocus) {
            it()
        }
        compose.onNodeWithText("Cancel").assertIsFocused().performKeyInput { pressKey(Key.Tab) }
        compose.onNodeWithText("Cancel").assertIsFocused()
        compose.runOnIdle {
            assertFalse(
                "Background window cannot receive input while modal is active",
                compose.activity.window.decorView.hasWindowFocus(),
            )
        }
        compose.onNodeWithText("Cancel").performClick()
        compose.onNodeWithText("Review").assertDoesNotExist()
        compose.onNodeWithText("Open").assertIsFocused()
        compose.waitUntil(3000) { compose.activity.window.decorView.hasWindowFocus() }
        compose.runOnIdle {
            assertTrue(
                "Native input focus returned",
                compose.activity.window.decorView.hasWindowFocus(),
            )
        }
    }

    @Test
    fun selectKeyboardSkipsDisabledAndRestoresFocus() {
        var chosen = "a"
        compose.setContent {
            val inputMode = LocalInputModeManager.current
            SideEffect { inputMode.requestInputMode(InputMode.Keyboard) }
            var value by remember { mutableStateOf("a") }
            RosemaryTheme {
                RosemarySelect(
                    value,
                    {
                        value = it
                        chosen = it
                    },
                    listOf(
                        RosemaryOption("a", "Alpha"),
                        RosemaryOption("b", "Blocked", false),
                        RosemaryOption("c", "Charlie"),
                    ),
                    "Section",
                )
            }
        }
        val trigger = compose.onNodeWithText("Alpha")
        trigger.assertContentDescriptionEquals("Section")
        trigger.assert(
            SemanticsMatcher.expectValue(SemanticsProperties.StateDescription, "Collapsed")
        )
        // Check actual trailing glyph pixels, excluding the field border and label. This fails
        // when the trigger regresses to a text-only button even if its semantics remain correct.
        val pixels = trigger.captureToImage().toPixelMap()
        val density = compose.activity.resources.displayMetrics.density
        val trailingStart = pixels.width - (30 * density).toInt()
        val trailingEnd = pixels.width - (12 * density).toInt()
        val center = pixels.height / 2
        val half = (9 * density).toInt()
        val glyphColors =
            (center - half until center + half)
                .flatMap { y ->
                    (trailingStart until trailingEnd).map { x -> pixels[x, y] }
                }
                .toSet()
        assertTrue("Select displays a trailing disclosure glyph", glyphColors.size > 3)
        compose.onNodeWithText("Alpha").performSemanticsAction(SemanticsActions.RequestFocus) {
            it()
        }
        compose.onNodeWithText("Alpha").performKeyInput { pressKey(Key.DirectionDown) }
        compose.onNodeWithText("Blocked").assertIsNotEnabled()
        val selectedOption = compose.onAllNodesWithText("Alpha").onLast()
        selectedOption.assertIsSelected()
        val selectedPixels = selectedOption.captureToImage().toPixelMap()
        val checkColors =
            (selectedPixels.height / 2 - half until selectedPixels.height / 2 + half)
                .flatMap { y ->
                    (selectedPixels.width - (30 * density).toInt() until
                            selectedPixels.width - (12 * density).toInt())
                        .map { x -> selectedPixels[x, y] }
                }
                .toSet()
        assertTrue("Committed option displays its check glyph", checkColors.size > 3)
        selectedOption.performKeyInput { pressKey(Key.DirectionDown) }
        selectedOption.assertIsSelected()
        compose.onNodeWithText("Charlie").assertIsNotSelected().performKeyInput {
            pressKey(Key.Enter)
        }
        compose.runOnIdle { assertEquals("c", chosen) }
        compose.onNodeWithText("Charlie").assertIsFocused()
    }

    @Test
    fun disablingAnOpenSelectClosesItsPopupAndPreventsActivation() {
        var disable: (() -> Unit)? = null
        var opens = 0
        compose.setContent {
            var enabled by remember { mutableStateOf(true) }
            disable = { enabled = false }
            RosemaryTheme {
                RosemarySelect(
                    "a",
                    {},
                    listOf(RosemaryOption("a", "Alpha"), RosemaryOption("b", "Beta")),
                    "Section",
                    enabled = enabled,
                    onOpenChange = { if (it) opens++ },
                )
            }
        }
        compose.onNodeWithText("Alpha").performClick()
        compose.onNodeWithText("Beta").assertIsDisplayed()
        compose.runOnIdle { disable!!() }
        compose.onNodeWithText("Beta").assertDoesNotExist()
        compose.onNodeWithText("Alpha").assertIsNotEnabled()
        compose
            .onNodeWithText("Alpha")
            .assert(SemanticsMatcher.expectValue(SemanticsProperties.StateDescription, "Collapsed"))
        compose.runOnIdle { assertEquals(1, opens) }
    }

    @Test
    fun drawerReopenInterruptsExitAndPopupInheritsLocalTheme() {
        var setOpen: ((Boolean) -> Unit)? = null
        var inherited = Color.Unspecified
        var completions = 0
        var reduced = false
        var setRtl: ((Boolean) -> Unit)? = null
        compose.setContent {
            var rtl by remember { mutableStateOf(false) }
            setRtl = { rtl = it }
            val inputMode = LocalInputModeManager.current
            SideEffect { inputMode.requestInputMode(InputMode.Keyboard) }
            var open by remember { mutableStateOf(true) }
            setOpen = { open = it }
            RosemaryTheme(
                colors =
                    design.rosemary.compose.generated.RosemaryTokens.dark.copy(primary = Color.Red),
                reduceMotion = false,
                direction = if (rtl) LayoutDirection.Rtl else LayoutDirection.Ltr,
            ) {
                val motion = RosemaryTheme.reducedMotion
                SideEffect { reduced = motion }
                Column {
                    RosemaryDrawer(
                        open,
                        "Details",
                        { open = false },
                        onAnimationFinished = { completions++ },
                    ) {
                        RosemaryText("Drawer body")
                    }
                    RosemaryPopover(true, {}, trigger = {}) {
                        val color = RosemaryTheme.colors.primary
                        SideEffect { inherited = color }
                        RosemaryText("Popover body")
                    }
                }
            }
        }
        compose.mainClock.autoAdvance = false
        val initialLeft =
            compose.onNodeWithText("Drawer body").fetchSemanticsNode().boundsInRoot.left
        compose.runOnIdle { setOpen!!(false) }
        compose.mainClock.advanceTimeBy(64)
        if (!reduced)
            assertTrue(
                "Drawer has a real exit intermediate frame",
                compose.onNodeWithText("Drawer body").fetchSemanticsNode().boundsInRoot.left >
                    initialLeft,
            )
        compose.runOnIdle { setOpen!!(true) }
        compose.mainClock.advanceTimeBy(400)
        compose.onNodeWithText("Drawer body").assertExists()
        compose.runOnIdle { assertEquals(Color.Red, inherited) }
        compose.runOnIdle { setOpen!!(false) }
        compose.mainClock.advanceTimeBy(400)
        compose.onNodeWithText("Drawer body").assertDoesNotExist()
        compose.runOnIdle {
            assertTrue(completions > 0)
            setRtl!!(true)
            setOpen!!(true)
        }
        compose.mainClock.advanceTimeBy(400)
        val rtlOpenLeft =
            compose.onNodeWithText("Drawer body").fetchSemanticsNode().boundsInRoot.left
        compose.runOnIdle { setOpen!!(false) }
        compose.mainClock.advanceTimeBy(64)
        if (!reduced)
            assertTrue(
                "RTL drawer exits toward inline end",
                compose.onNodeWithText("Drawer body").fetchSemanticsNode().boundsInRoot.left <
                    rtlOpenLeft,
            )
        else compose.onNodeWithText("Drawer body").assertDoesNotExist()
        compose.mainClock.advanceTimeBy(400)
        compose.mainClock.autoAdvance = true
    }

    @Test
    fun extremeYearViewsAndTimeCancelPreserveHost() {
        var result = LocalDate.of(1, 1, 1)
        var time = LocalTime.of(0, 0)
        compose.setContent {
            val inputMode = LocalInputModeManager.current
            SideEffect { inputMode.requestInputMode(InputMode.Keyboard) }
            RosemaryTheme {
                RosemaryDate(
                    result,
                    { result = it },
                    "Date",
                    time = time,
                    onTimeChange = { time = it },
                )
            }
        }
        compose.onNodeWithText("0001-01-01").performClick()
        compose.onAllNodesWithText("1").onFirst().performClick()
        compose
            .onNode(hasSetTextAction() and hasContentDescription("Year"))
            .performTextReplacement("9999")
        compose.onAllNodesWithText("9999").onLast().performScrollTo().performClick()
        compose.onNodeWithText("12").performScrollTo().performClick()
        compose.onNodeWithText("Next month").assertIsNotEnabled()
        compose
            .onNode(hasSetTextAction() and hasContentDescription("Time (HH:mm)"))
            .performTextReplacement("23:59")
        compose.onNodeWithText("Cancel").performScrollTo().performClick()
        compose.runOnIdle {
            assertEquals(LocalDate.of(1, 1, 1), result)
            assertEquals(LocalTime.MIDNIGHT, time)
        }
    }

    @Test
    fun progressCancellationRetainsMeasuredValueAndStopsFlow() {
        var setState: ((RosemaryProgressState) -> Unit)? = null
        var reduced = false
        compose.mainClock.autoAdvance = false
        compose.setContent {
            var state by remember { mutableStateOf(RosemaryProgressState.Running) }
            setState = { state = it }
            RosemaryTheme(language = RosemaryLanguage.Chinese) {
                val motion = RosemaryTheme.reducedMotion
                SideEffect { reduced = motion }
                RosemaryProgress(
                    35f,
                    modifier = Modifier.testTag("measured-progress"),
                    state = state,
                )
            }
        }
        fun pixels(): List<Color> {
            val map = compose.onNodeWithTag("measured-progress").captureToImage().toPixelMap()
            return (0 until map.height).flatMap { y -> (0 until map.width).map { x -> map[x, y] } }
        }
        compose.mainClock.advanceTimeBy(32)
        val running = pixels()
        assertTrue(
            "Canvas capture contains actual component pixels: distinct=${running.toSet().size}, total=${running.size}",
            running.toSet().size > 3,
        )
        var moved = false
        repeat(8) {
            compose.mainClock.advanceTimeBy(240)
            compose.waitForIdle()
            if (running != pixels()) moved = true
        }
        if (!reduced) assertTrue("Running progress has an actual moving highlight", moved)
        compose.runOnIdle { setState!!(RosemaryProgressState.Cancelled) }
        compose.mainClock.advanceTimeBy(100)
        val stopped = pixels()
        compose.mainClock.advanceTimeBy(700)
        assertTrue("Cancelled progress keeps its fill but stops the highlight", stopped == pixels())
        compose
            .onNode(
                SemanticsMatcher.expectValue(
                    SemanticsProperties.ProgressBarRangeInfo,
                    androidx.compose.ui.semantics.ProgressBarRangeInfo(35f, 0f..100f),
                )
            )
            .assertExists()
        compose
            .onNode(
                SemanticsMatcher("Localized cancellation state") {
                    it.config.getOrNull(SemanticsProperties.StateDescription)?.startsWith("已取消") ==
                        true
                }
            )
            .assertExists()
        compose.mainClock.autoAdvance = true
    }

    @Test
    fun toastTimerPausesWhileActionDescendantHasFocus() {
        var dismissed = 0
        compose.setContent {
            val input = LocalInputModeManager.current
            SideEffect { input.requestInputMode(InputMode.Keyboard) }
            RosemaryTheme {
                Column {
                    RosemaryToast(
                        "Review",
                        { dismissed++ },
                        actionLabel = "Keep editing",
                        onAction = {},
                        timeoutMillis = 500,
                    )
                    RosemaryButton("Outside", {})
                }
            }
        }
        compose.onNodeWithText("Keep editing").performSemanticsAction(
            SemanticsActions.RequestFocus
        ) {
            it()
        }
        compose.onNodeWithText("Keep editing").assertIsFocused()
        android.os.SystemClock.sleep(800)
        compose.runOnIdle { assertEquals("Focused toast action pauses dismissal", 0, dismissed) }
        compose.onNodeWithText("Outside").performSemanticsAction(SemanticsActions.RequestFocus) {
            it()
        }
        compose.waitUntil(2000) { dismissed == 1 }
        compose.runOnIdle { assertEquals(1, dismissed) }
    }
}
