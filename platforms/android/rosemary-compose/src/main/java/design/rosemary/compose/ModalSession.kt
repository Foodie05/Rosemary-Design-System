package design.rosemary.compose

/** Atomic completion identity is deliberately independent of animation and host navigation. */
class RosemaryModalSession(val id: String, private val onClose: (RosemaryDismissReason) -> Unit) {
    var result: RosemaryDismissReason? = null
        private set

    fun close(sessionId: String, reason: RosemaryDismissReason): Boolean {
        if (sessionId != id || result != null) return false
        result = reason
        onClose(reason)
        return true
    }
}
