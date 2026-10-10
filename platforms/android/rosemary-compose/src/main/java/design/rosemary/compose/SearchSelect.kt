@file:OptIn(androidx.compose.material3.ExperimentalMaterial3Api::class)

package design.rosemary.compose

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.dp

@Composable
internal fun <T> RosemarySearchSelect(
    label: String,
    value: T?,
    options: List<RosemaryOption<T>>,
    onValueChange: (T) -> Unit,
    modifier: Modifier,
    enabled: Boolean,
) {
    var open by remember { mutableStateOf(false) }
    var query by remember { mutableStateOf("") }
    var draft by remember { mutableStateOf<T?>(null) }
    val active = enabled && options.any { it.enabled }
    LaunchedEffect(active) { if (!active) open = false }
    Column(modifier) {
        Text(label)
        Spacer(Modifier.height(8.dp))
        OutlinedButton(
            onClick = {
                draft = value
                query = ""
                open = true
            },
            enabled = active,
            modifier =
                Modifier.heightIn(min = 48.dp).semantics {
                    contentDescription = label
                    stateDescription = if (open) "已展开" else "已收起"
                },
        ) {
            Text(options.firstOrNull { it.value == value }?.label ?: "请选择")
        }
    }
    if (open && active)
        ModalBottomSheet(onDismissRequest = { open = false }) {
            Column(Modifier.fillMaxWidth().padding(16.dp)) {
                Text(
                    label,
                    style = MaterialTheme.typography.titleLarge,
                    modifier = Modifier.semantics { heading() },
                )
                RosemarySearchField(query, { query = it }, "搜索选项")
                val filtered = options.filter { it.label.contains(query, true) }
                if (filtered.isEmpty()) Text("没有匹配的选项", Modifier.padding(16.dp))
                LazyColumn(Modifier.fillMaxWidth().heightIn(max = 400.dp).selectableGroup()) {
                    items(filtered, key = { it.value as Any }) { o ->
                        Row(
                            Modifier.fillMaxWidth()
                                .heightIn(min = 48.dp)
                                .selectable(
                                    o.value == draft,
                                    enabled = o.enabled,
                                    role = Role.RadioButton,
                                    onClick = { draft = o.value },
                                ),
                            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
                        ) {
                            RadioButton(o.value == draft, null, enabled = o.enabled)
                            Text(o.label, Modifier.padding(8.dp))
                        }
                    }
                }
                FlowRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    TextButton(onClick = { open = false }) { Text("取消") }
                    TextButton(
                        onClick = {
                            val chosen = draft
                            if (
                                chosen != null &&
                                    enabled &&
                                    options.any { it.value == chosen && it.enabled }
                            ) {
                                open = false
                                onValueChange(chosen)
                            }
                        },
                        enabled = options.any { it.value == draft && it.enabled },
                    ) {
                        Text("确认")
                    }
                }
            }
        }
}
