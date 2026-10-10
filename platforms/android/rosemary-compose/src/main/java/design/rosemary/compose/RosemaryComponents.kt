package design.rosemary.compose

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.*
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp

data class RosemaryOption<T>(val value: T, val label: String, val enabled: Boolean = true)

enum class RosemaryDismissReason {
    Confirm,
    Cancel,
    Outside,
    Back,
    Programmatic,
    OutsideOrBack,
}

@Composable
fun RosemaryButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    busy: Boolean = false,
) {
    Button(
        onClick = onClick,
        enabled = enabled && !busy,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier.heightIn(min = 48.dp).semantics { if (busy) stateDescription = "正在处理" },
    ) {
        Box(contentAlignment = Alignment.Center) {
            Text(label, modifier = Modifier.padding(horizontal = 24.dp))
            if (busy) RosemarySpinner("正在处理", Modifier.align(Alignment.CenterStart).size(16.dp))
        }
    }
}

@Composable
fun RosemaryIconButton(
    label: String,
    icon: ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    busy: Boolean = false,
) {
    IconButton(
        onClick = onClick,
        enabled = enabled && !busy,
        modifier =
            modifier.sizeIn(minWidth = 48.dp, minHeight = 48.dp).semantics {
                contentDescription = label
                if (busy) stateDescription = "正在处理"
            },
    ) {
        if (busy) RosemarySpinner("正在处理", Modifier.size(20.dp))
        else Icon(icon, contentDescription = null)
    }
}

@Composable
fun RosemaryTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    error: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        enabled = enabled,
        isError = error != null,
        supportingText =
            if (error != null) {
                { Text(error) }
            } else null,
        singleLine = true,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier,
    )
}

@Composable
fun RosemaryTextArea(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    error: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        enabled = enabled,
        isError = error != null,
        supportingText =
            if (error != null) {
                { Text(error) }
            } else null,
        minLines = 3,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier,
    )
}

@Composable
fun RosemaryCheckbox(
    label: String,
    value: ToggleableState,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Row(
        modifier
            .toggleable(
                value = value == ToggleableState.On,
                enabled = enabled,
                role = Role.Checkbox,
                onValueChange = { onClick() },
            )
            .heightIn(min = 48.dp)
            .semantics { toggleableState = value }
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        TriStateCheckbox(state = value, onClick = null, enabled = enabled)
        Spacer(Modifier.width(8.dp))
        Text(label)
    }
}

@Composable
fun RosemarySwitch(
    label: String,
    value: Boolean,
    onValueChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    Row(
        modifier
            .toggleable(
                value = value,
                enabled = enabled,
                role = Role.Switch,
                onValueChange = onValueChange,
            )
            .heightIn(min = 48.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Switch(checked = value, onCheckedChange = null, enabled = enabled)
        Spacer(Modifier.width(12.dp))
        Text(label)
    }
}

@Composable
fun RosemarySlider(
    label: String,
    value: Float,
    onValueChange: (Float) -> Unit,
    modifier: Modifier = Modifier,
    range: ClosedFloatingPointRange<Float> = 0f..100f,
    steps: Int = 0,
    enabled: Boolean = true,
    onValueChangeFinished: (() -> Unit)? = null,
) {
    require(range.start < range.endInclusive && value in range && steps >= 0)
    Column(modifier) {
        Text("$label ${value.toInt()}")
        Slider(
            value = value,
            onValueChange = onValueChange,
            valueRange = range,
            steps = steps,
            enabled = enabled,
            onValueChangeFinished = onValueChangeFinished,
            modifier = Modifier.semantics { contentDescription = label },
        )
    }
}

@Composable
fun <T> RosemarySelect(
    label: String,
    value: T?,
    options: List<RosemaryOption<T>>,
    onValueChange: (T) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    require(options.map { it.value }.distinct().size == options.size)
    if (options.size > 8) {
        RosemarySearchSelect(label, value, options, onValueChange, modifier, enabled)
        return
    }
    var expanded by remember { mutableStateOf(false) }
    val active = enabled && options.any { it.enabled }
    LaunchedEffect(active) { if (!active) expanded = false }
    Column(modifier) {
        Text(label)
        Spacer(Modifier.height(8.dp))
        Box {
            OutlinedButton(
                onClick = { expanded = true },
                enabled = active,
                shape = RoundedCornerShape(8.dp),
                modifier =
                    Modifier.heightIn(min = 48.dp).semantics {
                        contentDescription = label
                        stateDescription = if (expanded) "已展开" else "已收起"
                    },
            ) {
                Text(options.firstOrNull { it.value == value }?.label ?: "请选择")
                Spacer(Modifier.width(16.dp))
                Text("⌄", modifier = Modifier.clearAndSetSemantics {})
            }
            DropdownMenu(expanded = expanded && active, onDismissRequest = { expanded = false }) {
                options.forEach { o ->
                    DropdownMenuItem(
                        text = { Text(o.label) },
                        enabled = o.enabled,
                        leadingIcon =
                            if (o.value == value) {
                                { Text("✓") }
                            } else null,
                        modifier = Modifier.semantics { selected = o.value == value },
                        onClick = {
                            expanded = false
                            onValueChange(o.value)
                        },
                    )
                }
            }
        }
    }
}

@Composable
fun RosemaryTabs(
    labels: List<String>,
    value: Int,
    onValueChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable (Int) -> Unit,
) {
    require(labels.isNotEmpty() && value in labels.indices)
    Column(modifier) {
        // A scrollable native tab row preserves large type and narrow-screen access.
        PrimaryScrollableTabRow(selectedTabIndex = value, edgePadding = 0.dp) {
            labels.forEachIndexed { i, label ->
                Tab(selected = i == value, onClick = { onValueChange(i) }, text = { Text(label) })
            }
        }
        Spacer(Modifier.height(16.dp))
        content(value)
    }
}

@Composable
fun RosemaryDialog(
    title: String,
    onDismiss: (RosemaryDismissReason) -> Unit,
    onConfirm: () -> Unit,
    modifier: Modifier = Modifier,
    confirmLabel: String = "确认",
    enabled: Boolean = true,
    content: @Composable () -> Unit,
) {
    AlertDialog(
        onDismissRequest = { onDismiss(RosemaryDismissReason.OutsideOrBack) },
        title = { Text(title) },
        text = content,
        confirmButton = {
            TextButton(onClick = onConfirm, enabled = enabled) { Text(confirmLabel) }
        },
        dismissButton = {
            TextButton(onClick = { onDismiss(RosemaryDismissReason.Cancel) }) { Text("取消") }
        },
        modifier = modifier,
    )
}

@Composable
fun RosemaryAlertDialog(
    title: String,
    message: String,
    confirmLabel: String,
    onConfirm: () -> Unit,
    onDismiss: (RosemaryDismissReason) -> Unit,
) {
    RosemaryDialog(
        title = title,
        onConfirm = onConfirm,
        onDismiss = onDismiss,
        confirmLabel = confirmLabel,
    ) {
        Text(message)
    }
}

@Composable
fun RosemaryProgress(label: String, value: Float, modifier: Modifier = Modifier) {
    require(value in 0f..1f)
    Column(modifier) {
        Text("$label ${(value*100).toInt()}%")
        Spacer(Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { value },
            modifier =
                Modifier.fillMaxWidth().height(8.dp).semantics { contentDescription = label },
        )
    }
}

@Composable
fun RosemarySpinner(label: String, modifier: Modifier = Modifier, reducedMotion: Boolean = false) {
    val policy = LocalRosemaryPolicy.current
    if (reducedMotion || policy.reduced || !policy.active)
        Text("…", modifier = modifier.semantics { contentDescription = label })
    else
        CircularProgressIndicator(
            modifier = modifier.semantics { contentDescription = label },
            strokeWidth = 2.dp,
            color = LocalContentColor.current,
        )
}

@Composable
fun RosemaryEmptyState(
    title: String,
    message: String,
    modifier: Modifier = Modifier,
    action: (@Composable () -> Unit)? = null,
) {
    Column(modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            title,
            style = MaterialTheme.typography.titleMedium,
            modifier = Modifier.semantics { heading() },
        )
        Spacer(Modifier.height(8.dp))
        Text(message)
        if (action != null) {
            Spacer(Modifier.height(16.dp))
            action()
        }
    }
}

/** Full selection/composition state for IME-sensitive host applications. */
@Composable
fun RosemaryTextField(
    value: androidx.compose.ui.text.input.TextFieldValue,
    onValueChange: (androidx.compose.ui.text.input.TextFieldValue) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    error: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        enabled = enabled,
        isError = error != null,
        supportingText =
            if (error != null) {
                { Text(error) }
            } else null,
        singleLine = true,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier,
    )
}

@Composable
fun RosemaryTextArea(
    value: androidx.compose.ui.text.input.TextFieldValue,
    onValueChange: (androidx.compose.ui.text.input.TextFieldValue) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    error: String? = null,
) {
    OutlinedTextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(label) },
        enabled = enabled,
        isError = error != null,
        supportingText =
            if (error != null) {
                { Text(error) }
            } else null,
        minLines = 3,
        shape = RoundedCornerShape(8.dp),
        modifier = modifier,
    )
}
