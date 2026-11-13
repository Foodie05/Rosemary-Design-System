package design.rosemary.compose

import org.junit.Assert.*
import org.junit.Test

class FieldValidationTest {
    @Test
    fun firstBlurClearAndComposition() {
        val state = RosemaryFieldValidationState()
        state.blur("abc")
        assertFalse(state.armed)
        state.focus()
        state.edit("abc")
        assertFalse(state.armed)
        state.blur("abc", true)
        assertFalse(state.armed)
        state.focus()
        state.blur("abc")
        assertTrue(state.armed)
        state.edit("")
        assertFalse(state.armed)
        state.edit("abc12345")
        assertFalse(state.armed)
        state.focus()
        state.blur("abc12345")
        assertTrue(state.armed)
        assertTrue(RosemaryFieldRequirement.password().all { it.check("abcdefg!") })
    }
}
