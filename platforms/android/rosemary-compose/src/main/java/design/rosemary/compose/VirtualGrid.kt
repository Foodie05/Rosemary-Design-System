package design.rosemary.compose

import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.*
import androidx.compose.ui.input.key.*
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

class RosemaryGridConfiguration(
    widths: Map<String, Float> = emptyMap(),
    filters: Map<String, String> = emptyMap(),
) {
    val widths = mutableStateMapOf<String, Float>().apply { putAll(widths) }
    val filters = mutableStateMapOf<String, String>().apply { putAll(filters) }

    fun width(id: String) = (widths[id] ?: 180f).coerceIn(96f, 480f)

    fun visible(rows: List<RosemaryRecord>) = rows.filter { row ->
        filters.all { (key, value) -> (row.cells[key] ?: "").contains(value, true) }
    }
}

@Composable
fun RosemaryVirtualDataGrid(
    columns: List<RosemaryColumn>,
    rows: List<RosemaryRecord>,
    selected: Set<String>,
    onSelectionChange: (Set<String>) -> Unit,
    onCellCommit: (String, String, String) -> Unit,
    configuration: RosemaryGridConfiguration,
    height: Dp = 400.dp,
) {
    require(
        columns.isNotEmpty() &&
            columns.map { it.id }.distinct().size == columns.size &&
            rows.map { it.id }.distinct().size == rows.size,
    )
    val visible = configuration.visible(rows)
    val left = rememberLazyListState()
    val right = rememberLazyListState()
    val horizontal = rememberScrollState()
    val scope = rememberCoroutineScope()
    val nodes = remember { mutableMapOf<Pair<String, String>, FocusRequester>() }
    var active by remember { mutableStateOf<Pair<String, String>?>(null) }
    var editing by remember { mutableStateOf<Pair<String, String>?>(null) }
    var draft by remember { mutableStateOf("") }
    val density = LocalDensity.current
    val rowHeight = (64 * density.fontScale.coerceAtLeast(1f)).dp
    // One shared direction at a time avoids feedback loops while retaining native touch scrolling.
    LaunchedEffect(left) {
        snapshotFlow {
            Triple(
                left.firstVisibleItemIndex,
                left.firstVisibleItemScrollOffset,
                left.isScrollInProgress,
            )
        }
            .collectLatest { (index, offset, moving) ->
                if (moving && !right.isScrollInProgress) right.scrollToItem(index, offset)
            }
    }
    LaunchedEffect(right) {
        snapshotFlow {
            Triple(
                right.firstVisibleItemIndex,
                right.firstVisibleItemScrollOffset,
                right.isScrollInProgress,
            )
        }
            .collectLatest { (index, offset, moving) ->
                if (moving && !left.isScrollInProgress) left.scrollToItem(index, offset)
            }
    }
    LaunchedEffect(visible.map { it.id }, columns.map { it.id }) {
        if (
            active != null &&
                (!visible.any { it.id == active?.first } ||
                    !columns.any { it.id == active?.second })
        )
            active = visible.firstOrNull()?.let { it.id to columns.first().id }
        if (editing != null && !rows.any { it.id == editing?.first }) editing = null
    }
    fun toggle(row: String) {
        onSelectionChange(if (row in selected) selected - row else selected + row)
    }
    fun edit(row: String, col: String) {
        val record = rows.firstOrNull { it.id == row }
        if (record != null && columns.any { it.id == col && it.editable }) {
            draft = record.cells[col] ?: ""
            editing = row to col
        }
    }
    fun focus(r: Int, c: Int) {
        if (visible.isEmpty()) return
        val rr = r.coerceIn(0, visible.lastIndex)
        val cc = c.coerceIn(0, columns.lastIndex)
        val target = visible[rr].id to columns[cc].id
        active = target
        scope.launch {
            right.scrollToItem(rr)
            left.scrollToItem(rr)
            if (cc > 0) {
                val x = columns.drop(1).take(cc - 1).sumOf { configuration.width(it.id).toDouble() }
                horizontal.scrollTo(
                    with(density) { x.toFloat().dp.roundToPx() }.coerceIn(0, horizontal.maxValue),
                )
            }
            withFrameNanos {}
            nodes[target]?.requestFocus()
        }
    }
    @Composable
    fun header(col: RosemaryColumn) {
        val width = configuration.width(col.id)
        Row(Modifier.height(rowHeight)) {
            Text(
                col.label,
                Modifier.weight(1f).padding(8.dp),
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
            )
            val drag = rememberDraggableState { delta ->
                configuration.widths[col.id] =
                    (configuration.width(col.id) + delta / density.density).coerceIn(96f, 480f)
            }
            TextButton(
                onClick = {
                    configuration.widths[col.id] =
                        (configuration.width(col.id) + 16).coerceAtMost(480f)
                },
                modifier =
                    Modifier.width(48.dp).draggable(drag, Orientation.Horizontal).semantics {
                        contentDescription = "调整 ${col.label} 列宽"
                        stateDescription = "${width.toInt()}"
                        customActions =
                            listOf(
                                CustomAccessibilityAction("增加列宽") {
                                    configuration.widths[col.id] =
                                        (configuration.width(col.id) + 16).coerceAtMost(480f)
                                    true
                                },
                                CustomAccessibilityAction("减少列宽") {
                                    configuration.widths[col.id] =
                                        (configuration.width(col.id) - 16).coerceAtLeast(96f)
                                    true
                                },
                            )
                    },
            ) {
                Text("↔", Modifier.clearAndSetSemantics {})
            }
        }
    }
    @Composable
    fun cell(record: RosemaryRecord, col: RosemaryColumn, frozen: Boolean) {
        val pair = record.id to col.id
        val requester = nodes.getOrPut(pair) { FocusRequester() }
        Row(
            Modifier.height(rowHeight),
            verticalAlignment = androidx.compose.ui.Alignment.CenterVertically,
        ) {
            if (frozen)
                Checkbox(
                    checked = record.id in selected,
                    onCheckedChange = { toggle(record.id) },
                    modifier =
                        Modifier.semantics {
                            contentDescription = "选择 ${record.cells[col.id]?:record.id}"
                        },
                )
            OutlinedButton(
                onClick = {
                    active = pair
                    if (col.editable) edit(record.id, col.id) else toggle(record.id)
                },
                modifier =
                    Modifier.weight(1f)
                        .height(rowHeight)
                        .focusRequester(requester)
                        .onFocusChanged { if (it.isFocused) active = pair }
                        .semantics {
                            this.selected = active == pair
                            contentDescription = "${col.label}: ${record.cells[col.id]?:""}"
                            stateDescription = if (record.id in selected) "行已选择" else "行未选择"
                        },
            ) {
                Text(
                    (if (frozen) if (record.id in selected) "✓ " else "○ " else "") +
                        (record.cells[col.id] ?: ""),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
    Column {
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            columns.forEach { col ->
                OutlinedTextField(
                    configuration.filters[col.id] ?: "",
                    { configuration.filters[col.id] = it },
                    label = { Text("筛选 ${col.label}") },
                    singleLine = true,
                    modifier = Modifier.width(180.dp),
                )
            }
        }
        Text("${visible.size} 条记录 · ${selected.size} 项已选择", Modifier.padding(vertical = 16.dp))
        BoxWithConstraints(
            Modifier.height(height).onPreviewKeyEvent { event ->
                if (event.type != KeyEventType.KeyDown || editing != null || visible.isEmpty())
                    false
                else {
                    var r = visible.indexOfFirst { it.id == active?.first }.coerceAtLeast(0)
                    var c = columns.indexOfFirst { it.id == active?.second }.coerceAtLeast(0)
                    when (event.key) {
                        Key.DirectionUp -> {
                            focus(r - 1, c)
                            true
                        }
                        Key.DirectionDown -> {
                            focus(r + 1, c)
                            true
                        }
                        Key.DirectionLeft -> {
                            focus(r, c - 1)
                            true
                        }
                        Key.DirectionRight -> {
                            focus(r, c + 1)
                            true
                        }
                        Key.MoveHome -> {
                            focus(if (event.isCtrlPressed) 0 else r, 0)
                            true
                        }
                        Key.MoveEnd -> {
                            focus(
                                if (event.isCtrlPressed) visible.lastIndex else r,
                                columns.lastIndex,
                            )
                            true
                        }
                        Key.Enter -> {
                            edit(visible[r].id, columns[c].id)
                            true
                        }
                        Key.Spacebar -> {
                            toggle(visible[r].id)
                            true
                        }
                        else -> false
                    }
                }
            },
        ) {
            val first = columns.first()
            val frozen = minOf(configuration.width(first.id).dp, maxWidth * .45f)
            val moving =
                maxOf(
                    columns.drop(1).sumOf { configuration.width(it.id).toDouble() }.toFloat().dp,
                    maxWidth - frozen,
                )
            Row {
                Column(Modifier.width(frozen)) {
                    header(first)
                    LazyColumn(Modifier.weight(1f), state = left) {
                        items(visible, key = { it.id }) { cell(it, first, true) }
                    }
                }
                Box(Modifier.weight(1f).horizontalScroll(horizontal)) {
                    Column(Modifier.width(moving)) {
                        Row {
                            columns.drop(1).forEach { col ->
                                Box(Modifier.width(configuration.width(col.id).dp)) { header(col) }
                            }
                        }
                        LazyColumn(Modifier.weight(1f), state = right) {
                            items(visible, key = { it.id }) { row ->
                                Row {
                                    columns.drop(1).forEach { col ->
                                        Box(Modifier.width(configuration.width(col.id).dp)) {
                                            cell(row, col, false)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    editing?.let { pair ->
        val column = columns.firstOrNull { it.id == pair.second && it.editable }
        if (column != null)
            AlertDialog(
                onDismissRequest = { editing = null },
                title = { Text("编辑 ${column.label}") },
                text = { OutlinedTextField(draft, { draft = it }, label = { Text(column.label) }) },
                confirmButton = {
                    TextButton(
                        onClick = {
                            if (rows.any { it.id == pair.first })
                                onCellCommit(pair.first, pair.second, draft)
                            editing = null
                        },
                    ) {
                        Text("保存")
                    }
                },
                dismissButton = { TextButton(onClick = { editing = null }) { Text("取消") } },
            )
    }
}
