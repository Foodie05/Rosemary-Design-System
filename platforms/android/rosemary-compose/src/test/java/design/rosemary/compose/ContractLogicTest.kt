package design.rosemary.compose

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.colorspace.ColorSpaces
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import design.rosemary.compose.generated.*
import java.time.LocalDate
import org.junit.Assert.*
import org.junit.Test

class ContractLogicTest {
    @Test
    fun anchoredPopupsPreferBelowFlipAboveAndRespectRtlWindowEdges() {
        val position = RosemaryAnchoredPopupPosition(4)
        val window = IntSize(400, 800)
        val popup = IntSize(220, 200)
        fun at(anchor: IntRect, rtl: Boolean = false) =
            position.calculatePosition(
                anchor,
                window,
                if (rtl) LayoutDirection.Rtl else LayoutDirection.Ltr,
                popup,
            )
        assertEquals(IntOffset(20, 148), at(IntRect(20, 100, 320, 144)))
        assertEquals(IntOffset(100, 148), at(IntRect(20, 100, 320, 144), true))
        assertEquals(IntOffset(176, 496), at(IntRect(300, 700, 390, 744)))
        assertEquals(
            IntOffset(0, 596),
            position.calculatePosition(
                IntRect(0, 10, 400, 700),
                window,
                LayoutDirection.Ltr,
                IntSize(500, 200),
            ),
        )
        assertEquals(
            IntOffset(20, 16),
            position.calculatePosition(
                IntRect(20, 300, 320, 344),
                window,
                LayoutDirection.Ltr,
                IntSize(220, 780),
            ),
        )
    }

    @Test
    fun dateBoundariesAndLeapYearsAreStrict() {
        assertEquals(LocalDate.of(1, 1, 1), RosemaryDateRules.parse("0001-01-01"))
        assertEquals(LocalDate.of(9999, 12, 31), RosemaryDateRules.parse("9999-12-31"))
        listOf("0000-01-01", "10000-01-01", "2025-02-29", "2026-04-31", "2026-1-01").forEach {
            assertNull(it, RosemaryDateRules.parse(it))
        }
        assertNotNull(RosemaryDateRules.parse("2000-02-29"))
        assertNull(RosemaryDateRules.parse("1900-02-29"))
    }

    @Test
    fun everyMinuteAndRangeAreSupported() {
        for (hour in 0..23) for (minute in 0..59) assertNotNull(
            RosemaryDateRules.parseTime("%02d:%02d".format(hour, minute))
        )
        assertNull(RosemaryDateRules.parseTime("24:00"))
        val start = LocalDate.of(2026, 1, 2)
        assertFalse(RosemaryDateRules.validRange(start, start.minusDays(1)))
        assertTrue(RosemaryDateRules.validRange(start, start))
    }

    @Test
    fun defaultThemesPassEverySharedContrastPair() {
        listOf(RosemaryTokens.light, RosemaryTokens.dark).forEach { colors ->
            val results = rosemaryValidateTheme(colors)
            assertEquals(22, results.size)
            results.forEach {
                assertTrue("${it.foreground}/${it.background}: ${it.ratio}", it.passes)
            }
        }
    }

    @Test
    fun hostOverridesReportFailuresWithoutRecoloring() {
        val colors = RosemaryTokens.light.copy(primary = RosemaryTokens.light.surface)
        assertTrue(rosemaryValidateTheme(colors).any { !it.passes })
        assertEquals(RosemaryTokens.light.surface, colors.primary)
    }

    @Test
    fun unsupportedThemeColorsAreRejectedAndContrastConvertsToSrgb() {
        listOf(Color.Transparent, Color(.3f, .5f, .7f, colorSpace = ColorSpaces.DisplayP3))
            .forEach { color ->
                assertThrows(IllegalArgumentException::class.java) {
                    rosemaryValidateTheme(RosemaryTokens.light.copy(primary = color))
                }
            }
        val p3 = Color(.3f, .5f, .7f, colorSpace = ColorSpaces.DisplayP3)
        assertEquals(
            rosemaryContrast(p3.convert(ColorSpaces.Srgb), Color.White),
            rosemaryContrast(p3, Color.White),
            0.000001,
        )
    }

    @Test
    fun modalCompletionIsAtMostOnceAndIdentityBound() {
        var count = 0
        val session = RosemaryModalSession("new") { count++ }
        assertFalse(session.close("old", RosemaryDismissReason.Cancel))
        assertTrue(session.close("new", RosemaryDismissReason.Confirm))
        assertFalse(session.close("new", RosemaryDismissReason.Outside))
        assertEquals(1, count)
    }
}
