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

/** Draft query and committed value remain independent, controlled by the host. */
@Composable
fun <T> RosemaryComboBox(
    query: String,
    onQueryChange: (String) -> Unit,
    label: String,
    options: List<RosemaryOption<T>>,
    onSelected: (T) -> Unit,
    enabled: Boolean = true,
) {
    var active by remember(query) { mutableStateOf<T?>(null) }
    val matches = options.filter { it.label.contains(query, true) }
    val choices = matches.filter { it.enabled }
    val highlight = active?.takeIf { value -> choices.any { it.value == value } }
    val list = rememberLazyListState()
    val scope = rememberCoroutineScope()
    fun move(delta: Int) {
        if (enabled && choices.isNotEmpty()) {
            val i = choices.indexOfFirst { it.value == highlight }
            val next =
                choices[
                    if (i < 0) {
                        if (delta > 0) 0 else choices.lastIndex
                    } else (i + delta + choices.size) % choices.size]
            active = next.value
            scope.launch { list.scrollToItem(matches.indexOfFirst { it.value == next.value }) }
        }
    }
    fun select(value: T?) {
        if (enabled)
            options.firstOrNull { it.value == value && it.enabled }?.let { onSelected(it.value) }
    }
    Column(
        Modifier.onPreviewKeyEvent { e ->
            if (!enabled || e.type != KeyEventType.KeyDown) false
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
                    Key.Enter -> {
                        select(highlight)
                        true
                    }
                    Key.Escape -> {
                        active = null
                        true
                    }
                    else -> false
                }
        },
    ) {
        RosemarySearchField(
            query,
            {
                active = null
                onQueryChange(it)
            },
            label,
            enabled,
        )
        if (matches.isEmpty()) Text("没有匹配的选项", Modifier.padding(8.dp))
        LazyColumn(state = list, modifier = Modifier.fillMaxWidth().heightIn(max = 240.dp)) {
            items(matches, key = { it.value as Any }) { o ->
                TextButton(
                    onClick = { select(o.value) },
                    enabled = enabled && o.enabled,
                    colors =
                        ButtonDefaults.textButtonColors(
                            containerColor =
                                if (o.value == highlight)
                                    MaterialTheme.colorScheme.secondaryContainer
                                else androidx.compose.ui.graphics.Color.Transparent,
                        ),
                    modifier =
                        Modifier.fillMaxWidth().heightIn(min = 48.dp).semantics {
                            selected = o.value == highlight
                        },
                ) {
                    Text(o.label)
                }
            }
        }
    }
}
