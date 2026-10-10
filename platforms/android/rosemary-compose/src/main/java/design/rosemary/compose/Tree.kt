package design.rosemary.compose

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.*
import androidx.compose.ui.input.key.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.launch

internal data class TreeEntry(val node: RosemaryTreeNode, val parent: String?, val depth: Int)

internal fun visibleTree(nodes: List<RosemaryTreeNode>, expanded: Set<String>): List<TreeEntry> {
    val seen = mutableSetOf<String>()
    val result = mutableListOf<TreeEntry>()
    fun visit(n: RosemaryTreeNode, parent: String?, depth: Int, shown: Boolean) {
        require(seen.add(n.id)) { "Tree IDs must be unique: ${n.id}" }
        if (shown) result += TreeEntry(n, parent, depth)
        n.children.forEach { visit(it, n.id, depth + 1, shown && n.id in expanded) }
    }
    nodes.forEach { visit(it, null, 0, true) }
    return result
}

@Composable
fun RosemaryTreeView(
    nodes: List<RosemaryTreeNode>,
    expanded: Set<String>,
    selected: String?,
    onExpandedChange: (Set<String>) -> Unit,
    onSelected: (String) -> Unit,
) {
    val entries = visibleTree(nodes, expanded)
    val list = rememberLazyListState()
    val scope = rememberCoroutineScope()
    val focus = remember { mutableMapOf<String, FocusRequester>() }
    var active by remember { mutableStateOf<String?>(null) }
    var prefix by remember { mutableStateOf("") }
    var lastType by remember { mutableLongStateOf(0) }
    fun move(index: Int) {
        if (entries.isNotEmpty()) {
            val i = index.coerceIn(0, entries.lastIndex)
            val id = entries[i].node.id
            active = id
            scope.launch {
                list.scrollToItem(i)
                withFrameNanos {}
                focus[id]?.requestFocus()
            }
        }
    }
    var previous by remember { mutableStateOf<List<TreeEntry>>(emptyList()) }
    LaunchedEffect(entries.map { it.node.id }) {
        if (active != null && entries.none { it.node.id == active }) {
            val parents = previous.associate { it.node.id to it.parent }
            var candidate = active
            while (candidate != null && entries.none { it.node.id == candidate }) candidate =
                parents[candidate]
            move(entries.indexOfFirst { it.node.id == candidate }.coerceAtLeast(0))
        }
        previous = entries
        val allIds = mutableSetOf<String>()
        fun ids(n: RosemaryTreeNode) {
            allIds += n.id
            n.children.forEach(::ids)
        }
        nodes.forEach(::ids)
        focus.keys.retainAll(allIds)
    }
    LazyColumn(
        state = list,
        modifier =
            Modifier.fillMaxWidth().height(400.dp).onPreviewKeyEvent { e ->
                if (e.type != KeyEventType.KeyDown || entries.isEmpty()) false
                else {
                    val i = entries.indexOfFirst { it.node.id == active }.coerceAtLeast(0)
                    val entry = entries[i]
                    val n = entry.node
                    when (e.key) {
                        Key.DirectionDown -> {
                            move(i + 1)
                            true
                        }
                        Key.DirectionUp -> {
                            move(i - 1)
                            true
                        }
                        Key.MoveHome -> {
                            move(0)
                            true
                        }
                        Key.MoveEnd -> {
                            move(entries.lastIndex)
                            true
                        }
                        Key.DirectionRight -> {
                            if (n.children.isNotEmpty()) {
                                if (n.id !in expanded) onExpandedChange(expanded + n.id)
                                else move(i + 1)
                            }
                            true
                        }
                        Key.DirectionLeft -> {
                            if (n.id in expanded) onExpandedChange(expanded - n.id)
                            else
                                entry.parent?.let { p ->
                                    move(entries.indexOfFirst { it.node.id == p })
                                }
                            true
                        }
                        Key.Enter,
                        Key.Spacebar -> {
                            onSelected(n.id)
                            true
                        }
                        else -> {
                            val char = e.nativeKeyEvent.unicodeChar
                            if (
                                char > 31 && !e.isCtrlPressed && !e.isAltPressed && !e.isMetaPressed
                            ) {
                                val now = android.os.SystemClock.uptimeMillis()
                                prefix =
                                    if (now - lastType > 700) char.toChar().toString()
                                    else prefix + char.toChar()
                                lastType = now
                                val match = entries.indexOfFirst {
                                    it.node.label.startsWith(prefix, true)
                                }
                                if (match >= 0) move(match)
                                true
                            } else false
                        }
                    }
                }
            },
    ) {
        items(entries, key = { it.node.id }) { entry ->
            val n = entry.node
            val requester = focus.getOrPut(n.id) { FocusRequester() }
            Row(
                Modifier.fillMaxWidth().padding(start = (entry.depth * 16).coerceAtMost(80).dp),
                verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
            ) {
                if (n.children.isNotEmpty())
                    TextButton(
                        onClick = {
                            onExpandedChange(
                                if (n.id in expanded) expanded - n.id else expanded + n.id,
                            )
                        },
                        modifier =
                            Modifier.width(48.dp)
                                .onFocusChanged { if (it.isFocused) active = n.id }
                                .semantics {
                                    contentDescription =
                                        "${if(n.id in expanded)"收起" else "展开"} ${n.label}"
                                },
                    ) {
                        Text(if (n.id in expanded) "−" else "+")
                    }
                TextButton(
                    onClick = {
                        active = n.id
                        onSelected(n.id)
                    },
                    modifier =
                        Modifier.weight(1f)
                            .heightIn(min = 48.dp)
                            .focusRequester(requester)
                            .onFocusChanged { if (it.isFocused) active = n.id }
                            .semantics {
                                this.selected = n.id == selected
                                contentDescription = "${n.label} · 第 ${entry.depth+1} 级"
                                if (n.children.isNotEmpty())
                                    stateDescription = if (n.id in expanded) "已展开" else "已收起"
                            },
                ) {
                    Text(n.label, maxLines = 2, overflow = TextOverflow.Ellipsis)
                }
            }
        }
    }
}
