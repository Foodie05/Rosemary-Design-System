package design.rosemary.compose

import org.junit.Assert.*
import org.junit.Test

class ExtendedStateTest {
    @Test
    fun gridMultiFilterAndBounds() {
        val cfg =
            RosemaryGridConfiguration(mapOf("name" to 999f), mapOf("name" to "9", "kind" to "A"))
        val rows =
            (0..99).map {
                RosemaryRecord(
                    "r$it",
                    mapOf("name" to "项目 $it", "kind" to if (it % 2 == 0) "A" else "B"),
                )
            }
        assertEquals(listOf("r90", "r92", "r94", "r96", "r98"), cfg.visible(rows).map { it.id })
        assertEquals(480f, cfg.width("name"))
        cfg.widths["name"] = -100f
        assertEquals(96f, cfg.width("name"))
    }

    @Test
    fun treeParentDepthAndVisibility() {
        val roots = listOf(RosemaryTreeNode("a", "项目", listOf(RosemaryTreeNode("b", "笔记"))))
        assertEquals(listOf("a"), visibleTree(roots, emptySet()).map { it.node.id })
        val entries = visibleTree(roots, setOf("a"))
        assertEquals(listOf("a", "b"), entries.map { it.node.id })
        assertEquals("a", entries[1].parent)
        assertEquals(1, entries[1].depth)
    }

    @Test
    fun modalRejectsOldIdentityAndDuplicateClose() {
        val events = mutableListOf<RosemaryDismissReason>()
        val session = RosemaryModalSession("new", events::add)
        assertFalse(session.close("old", RosemaryDismissReason.Confirm))
        assertTrue(session.close("new", RosemaryDismissReason.Cancel))
        assertFalse(session.close("new", RosemaryDismissReason.Confirm))
        assertEquals(listOf(RosemaryDismissReason.Cancel), events)
    }

    @Test
    fun toastPausedDeadlineAndOldMessage() {
        var now = 0L
        val state = RosemaryToastState { now }
        state.resume("detached")
        state.show("第一条", 100)
        val old = state.id
        now = 20
        state.pause("reader")
        assertEquals(80L, state.remainingMillis())
        now = 400
        assertEquals(80L, state.remainingMillis())
        state.resume("reader")
        state.show("第二条", 200)
        state.dismiss(old)
        assertEquals("第二条", state.message)
        now = 450
        state.pause("app")
        assertEquals(150L, state.remainingMillis())
        state.dismiss()
        assertNull(state.message)
    }
}
