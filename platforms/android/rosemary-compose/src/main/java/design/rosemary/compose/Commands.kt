package design.rosemary.compose

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.key.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

@Composable
fun RosemaryCommandPalette(actions: List<RosemaryAction>, onClose: () -> Unit) {
    var query by remember { mutableStateOf("") }
    var active by remember { mutableStateOf<String?>(null) }
    val filtered = actions.filter { it.label.contains(query, true) }
    val valid = filtered.filter { it.onInvoke != null }
    val highlight = active?.takeIf { id -> valid.any { it.id == id } } ?: valid.firstOrNull()?.id
    val list = rememberLazyListState()
    val scope = rememberCoroutineScope()
    fun move(delta: Int) {
        if (valid.isNotEmpty()) {
            val index = valid.indexOfFirst { it.id == highlight }
            val next = valid[((index + delta + valid.size) % valid.size)].id
            active = next
            scope.launch { list.scrollToItem(filtered.indexOfFirst { it.id == next }) }
        }
    }
    fun invoke(id: String?) {
        actions
            .firstOrNull { it.id == id && it.onInvoke != null }
            ?.let {
                onClose()
                it.onInvoke?.invoke()
            }
    }
    Column(
        Modifier.onPreviewKeyEvent { e ->
            if (e.type != KeyEventType.KeyDown) false
            else
                when (e.key) {
                    Key.DirectionDown -> {
                        move(1)
                        true
                    }
                    Key.DirectionUp -> {
                        move(-1)
                        true
                    }
                    Key.MoveHome -> {
                        active = valid.firstOrNull()?.id
                        scope.launch { list.scrollToItem(0) }
                        true
                    }
                    Key.MoveEnd -> {
                        active = valid.lastOrNull()?.id
                        scope.launch {
                            if (filtered.isNotEmpty()) list.scrollToItem(filtered.lastIndex)
                        }
                        true
                    }
                    Key.Enter -> {
                        invoke(highlight)
                        true
                    }
                    Key.Escape -> {
                        onClose()
                        true
                    }
                    else -> false
                }
        },
    ) {
        RosemarySearchField(
            query,
            {
                query = it
                active = null
            },
            "搜索命令",
        )
        if (filtered.isEmpty()) Text("没有匹配的命令", Modifier.padding(24.dp))
        LazyColumn(Modifier.fillMaxWidth().heightIn(max = 400.dp), state = list) {
            items(filtered, key = { it.id }) { a ->
                TextButton(
                    onClick = { invoke(a.id) },
                    enabled = a.onInvoke != null,
                    colors =
                        ButtonDefaults.textButtonColors(
                            containerColor =
                                if (a.id == highlight) MaterialTheme.colorScheme.secondaryContainer
                                else androidx.compose.ui.graphics.Color.Transparent,
                        ),
                    modifier =
                        Modifier.fillMaxWidth().heightIn(min = 48.dp).semantics {
                            selected = a.id == highlight
                        },
                ) {
                    Text(a.label)
                }
            }
        }
        TextButton(onClick = onClose) { Text("关闭命令面板") }
    }
}
