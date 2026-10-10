package design.rosemary.compose

import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.*

/** The host supplies one stable ID per presentation and owns dismissal visibility. */
@Composable
fun RosemaryModal(
    sessionId: String,
    title: String,
    onClose: (RosemaryDismissReason) -> Unit,
    confirmLabel: String = "确认",
    canConfirm: Boolean = true,
    barrierDismissible: Boolean = true,
    content: @Composable () -> Unit,
) {
    val currentClose = remember(sessionId) { mutableStateOf(onClose) }
    currentClose.value = onClose
    val session = remember(sessionId) { RosemaryModalSession(sessionId) { currentClose.value(it) } }
    fun close(reason: RosemaryDismissReason) {
        session.close(sessionId, reason)
    }
    DisposableEffect(session) {
        onDispose { session.close(session.id, RosemaryDismissReason.Programmatic) }
    }
    Dialog(
        onDismissRequest = { close(RosemaryDismissReason.Back) },
        properties =
            DialogProperties(
                dismissOnBackPress = true,
                dismissOnClickOutside = false,
                usePlatformDefaultWidth = false,
            ),
    ) {
        Box(
            Modifier.fillMaxSize().safeDrawingPadding().imePadding(),
            contentAlignment = Alignment.Center,
        ) {
            Box(
                Modifier.matchParentSize().pointerInput(barrierDismissible) {
                    detectTapGestures {
                        if (barrierDismissible) close(RosemaryDismissReason.Outside)
                    }
                },
            )
            Surface(
                shape = androidx.compose.foundation.shape.RoundedCornerShape(16.dp),
                tonalElevation = 6.dp,
                modifier =
                    Modifier.padding(16.dp).widthIn(max = 560.dp).pointerInput(Unit) {
                        detectTapGestures {}
                    },
            ) {
                Column(
                    Modifier.verticalScroll(rememberScrollState()).padding(24.dp).semantics {
                        paneTitle = title
                    },
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    Text(
                        title,
                        style = MaterialTheme.typography.headlineSmall,
                        modifier = Modifier.semantics { heading() },
                    )
                    content()
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                        TextButton(onClick = { close(RosemaryDismissReason.Cancel) }) { Text("取消") }
                        Button(
                            onClick = { close(RosemaryDismissReason.Confirm) },
                            enabled = canConfirm,
                        ) {
                            Text(confirmLabel)
                        }
                    }
                }
            }
        }
    }
}
