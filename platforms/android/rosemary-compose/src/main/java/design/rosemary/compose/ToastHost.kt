package design.rosemary.compose

import androidx.compose.foundation.focusGroup
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.input.pointer.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.delay

/** Monotonic time and presentation identity prevent late dismissal of a new message. */
class RosemaryToastState(private val now: () -> Long = { android.os.SystemClock.uptimeMillis() }) {
    var message: String? by mutableStateOf(null)
        private set

    var id by mutableLongStateOf(0)
        private set

    internal var revision by mutableIntStateOf(0)
        private set

    private var remaining = 0L
    private var started: Long? = null
    private val paused = mutableSetOf("detached")
    val running
        get() = message != null && paused.isEmpty()

    fun remainingMillis() = (remaining - (started?.let { now() - it } ?: 0)).coerceIn(0, remaining)

    fun show(message: String, durationMillis: Long = 4000) {
        require(durationMillis > 0)
        id++
        this.message = message
        remaining = durationMillis
        started = if (paused.isEmpty()) now() else null
        revision++
    }

    fun dismiss(expected: Long = id) {
        if (expected != id || message == null) return
        message = null
        started = null
        paused.removeAll(setOf("focus", "pointer"))
        revision++
    }

    fun pause(reason: String) {
        if (!paused.add(reason)) return
        remaining = remainingMillis()
        started = null
        revision++
    }

    fun resume(reason: String) {
        if (!paused.remove(reason)) return
        if (paused.isEmpty() && message != null) started = now()
        revision++
    }

    internal fun expire(expected: Long) {
        if (expected == id && running) dismiss(expected)
    }
}

@Composable
fun RosemaryToastHost(
    state: RosemaryToastState,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val policy = LocalRosemaryPolicy.current
    var focusPaused by remember { mutableStateOf(false) }
    var pointerPaused by remember { mutableStateOf(false) }
    DisposableEffect(state) {
        if (focusPaused) state.pause("focus")
        if (pointerPaused) state.pause("pointer")
        if (policy.reader) state.pause("reader")
        if (!policy.active) state.pause("app")
        state.resume("detached")
        onDispose {
            state.pause("detached")
            state.resume("focus")
            state.resume("pointer")
        }
    }
    LaunchedEffect(policy.active, state) {
        if (policy.active) state.resume("app") else state.pause("app")
    }
    LaunchedEffect(policy.reader, state) {
        if (policy.reader) state.pause("reader") else state.resume("reader")
    }
    LaunchedEffect(state, state.id, state.revision) {
        if (state.running) {
            val id = state.id
            delay(state.remainingMillis())
            state.expire(id)
        }
    }
    Box(modifier) {
        content()
        state.message?.let { message ->
            Surface(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(8.dp),
                shadowElevation = 4.dp,
                modifier =
                    Modifier.align(Alignment.BottomCenter)
                        .padding(16.dp)
                        .widthIn(max = 480.dp)
                        .onFocusChanged {
                            focusPaused = it.hasFocus
                            if (it.hasFocus) state.pause("focus") else state.resume("focus")
                        }
                        .focusGroup()
                        .pointerInput(state) {
                            awaitPointerEventScope {
                                while (true) {
                                    when (awaitPointerEvent().type) {
                                        PointerEventType.Enter -> {
                                            pointerPaused = true
                                            state.pause("pointer")
                                        }
                                        PointerEventType.Exit -> {
                                            pointerPaused = false
                                            state.resume("pointer")
                                        }
                                        else -> Unit
                                    }
                                }
                            }
                        },
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        message,
                        Modifier.weight(1f).padding(16.dp).semantics {
                            liveRegion = LiveRegionMode.Polite
                        },
                    )
                    TextButton(onClick = { state.dismiss() }) { Text("关闭通知") }
                }
            }
        }
    }
}
