package design.rosemary.compose

import org.junit.Assert.*
import org.junit.Test

class ProjectDraftTest {
    @Test
    fun cancelPreservesSavedName() {
        val d = ProjectDraft().edit("Changed").cancel()
        assertEquals("Rosemary Notes", d.name)
    }

    @Test
    fun failurePreservesDraftAndRetryCommits() {
        val saving = ProjectDraft().edit("Changed").beginSave()
        val d = saving.complete(false, saving.saveOperation!!)
        assertEquals("Changed", d.name)
        assertNotNull(d.error)
        val retry = d.beginSave()
        assertEquals("Changed", retry.complete(true, retry.saveOperation!!).savedName)
    }

    @Test
    fun blankAndDuplicateSubmissionAreRejected() {
        val blank = ProjectDraft().edit(" ").beginSave()
        assertFalse(blank.busy)
        assertNotNull(blank.error)
        val busy = ProjectDraft().beginSave()
        assertEquals(busy, busy.beginSave())
    }

    @Test
    fun completionCommitsSubmittedSnapshot() {
        val saving = ProjectDraft(name = "A").beginSave()
        val edited = saving.edit("B").complete(true, saving.saveOperation!!)
        assertEquals("A", edited.savedName)
        assertEquals("B", edited.name)
    }

    @Test
    fun staleCompletionCannotCommitNewSession() {
        val old = ProjectDraft(name = "A").beginSave()
        val cancelled = old.cancel()
        assertFalse(cancelled.busy)
        val current = cancelled.edit("B").beginSave()
        assertEquals(current, current.complete(true, old.saveOperation!!))
        assertEquals("B", current.complete(true, current.saveOperation!!).savedName)
    }
}
