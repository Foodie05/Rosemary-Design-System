@file:OptIn(
    androidx.compose.material3.ExperimentalMaterial3Api::class,
    androidx.compose.foundation.ExperimentalFoundationApi::class,
)

package design.rosemary.compose

import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.interaction.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.selection.selectableGroup
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.key.*
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.input.*
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp

/** Stable identity and enabled state are shared by native collections, never by index. */
data class RosemaryAction(
    val id: String,
    val label: String,
    val onInvoke: (() -> Unit)?,
    val destructive: Boolean = false,
)

data class RosemaryItem(
    val id: String,
    val label: String,
    val detail: String? = null,
    val enabled: Boolean = true,
)

data class RosemaryColumn(val id: String, val label: String, val editable: Boolean = false)

data class RosemaryRecord(val id: String, val cells: Map<String, String>)

data class RosemaryTreeNode(
    val id: String,
    val label: String,
    val children: List<RosemaryTreeNode> = emptyList(),
)

@Composable
fun RosemaryButtonGroup(actions: List<RosemaryAction>, modifier: Modifier = Modifier) {
    FlowRow(
        modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        actions.forEach { a ->
            key(a.id) {
                OutlinedButton(onClick = { a.onInvoke?.invoke() }, enabled = a.onInvoke != null) {
                    Text(a.label)
                }
            }
        }
    }
}

@Composable
fun RosemarySplitButton(primary: RosemaryAction, actions: List<RosemaryAction>) {
    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        Button(onClick = { primary.onInvoke?.invoke() }, enabled = primary.onInvoke != null) {
            Text(primary.label)
        }
        RosemaryDropdownMenu("更多操作", actions)
    }
}

@Composable
fun RosemaryLinkButton(label: String, onNavigate: (() -> Unit)?, modifier: Modifier = Modifier) {
    TextButton(
        onClick = { onNavigate?.invoke() },
        enabled = onNavigate != null,
        modifier = modifier,
    ) {
        Text(label)
    }
}

@Composable
fun RosemaryFloatingActionButton(label: String, icon: ImageVector, onClick: () -> Unit) {
    ExtendedFloatingActionButton(
        onClick = onClick,
        icon = { Icon(icon, null) },
        text = { Text(label) },
    )
}

@Composable
fun RosemaryPasswordField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    enabled: Boolean = true,
    error: String? = null,
) {
    var hidden by remember { mutableStateOf(true) }
    OutlinedTextField(
        value,
        onValueChange,
        label = { Text(label) },
        singleLine = true,
        enabled = enabled,
        isError = error != null,
        supportingText =
            if (error != null) {
                { Text(error) }
            } else null,
        visualTransformation =
            if (hidden) PasswordVisualTransformation() else VisualTransformation.None,
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        trailingIcon = {
            TextButton(onClick = { hidden = !hidden }, enabled = enabled) {
                Text(if (hidden) "显示" else "隐藏")
            }
        },
    )
}

@Composable
fun RosemarySearchField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String = "搜索",
    enabled: Boolean = true,
) {
    OutlinedTextField(
        value,
        onValueChange,
        label = { Text(label) },
        singleLine = true,
        enabled = enabled,
        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
        trailingIcon = {
            TextButton(onClick = { onValueChange("") }, enabled = enabled && value.isNotEmpty()) {
                Text("清除")
            }
        },
    )
}

@Composable
fun RosemaryNumberField(
    label: String,
    value: Double,
    onValueChange: (Double) -> Unit,
    min: Double = 0.0,
    max: Double = 100.0,
    step: Double = 1.0,
    enabled: Boolean = true,
) {
    require(min < max && step > 0 && value in min..max)
    var draft by remember(value) { mutableStateOf(value.toString()) }
    var invalid by remember(value) { mutableStateOf(false) }
    val commit = {
        val parsed = draft.toDoubleOrNull()
        if (enabled) {
            if (parsed == null || !parsed.isFinite() || parsed !in min..max) invalid = true
            else {
                invalid = false
                onValueChange(parsed)
            }
        }
    }
    Column {
        Text(label)
        Row(verticalAlignment = Alignment.CenterVertically) {
            TextButton(
                onClick = { onValueChange((value - step).coerceIn(min, max)) },
                enabled = enabled && value > min,
                modifier = Modifier.semantics { contentDescription = "减少 $label" },
            ) {
                Text("−")
            }
            OutlinedTextField(
                value = draft,
                onValueChange = {
                    draft = it
                    invalid = false
                },
                label = { Text(label) },
                enabled = enabled,
                singleLine = true,
                isError = invalid,
                modifier = Modifier.weight(1f),
                keyboardOptions =
                    KeyboardOptions(
                        keyboardType = KeyboardType.Decimal,
                        imeAction = ImeAction.Done,
                    ),
                keyboardActions =
                    androidx.compose.foundation.text.KeyboardActions(onDone = { commit() }),
            )
            TextButton(
                onClick = { onValueChange((value + step).coerceIn(min, max)) },
                enabled = enabled && value < max,
                modifier = Modifier.semantics { contentDescription = "增加 $label" },
            ) {
                Text("+")
            }
        }
        if (invalid)
            Text(
                "请输入 $min 至 $max 的数字",
                color = MaterialTheme.colorScheme.error,
                modifier = Modifier.semantics { error("数值超出范围") },
            )
        TextButton(onClick = { commit() }, enabled = enabled) { Text("应用数值") }
    }
}

@Composable
fun <T> RosemaryRadio(
    label: String,
    value: T?,
    options: List<RosemaryOption<T>>,
    onValueChange: (T) -> Unit,
    enabled: Boolean = true,
) {
    Column(Modifier.selectableGroup()) {
        Text(label)
        options.forEach { o ->
            Row(
                Modifier.fillMaxWidth()
                    .heightIn(min = 48.dp)
                    .selectable(
                        o.value == value,
                        enabled = enabled && o.enabled,
                        role = Role.RadioButton,
                        onClick = { onValueChange(o.value) },
                    ),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                RadioButton(o.value == value, null, enabled = enabled && o.enabled)
                Spacer(Modifier.width(8.dp))
                Text(o.label)
            }
        }
    }
}

@Composable
fun RosemaryDatePicker(
    label: String,
    valueMillis: Long?,
    onValueChange: (Long) -> Unit,
    enabled: Boolean = true,
) {
    var open by remember { mutableStateOf(false) }
    LaunchedEffect(enabled) { if (!enabled) open = false }
    OutlinedButton(onClick = { open = true }, enabled = enabled) {
        Text(
            "$label ${valueMillis?.let{java.text.DateFormat.getDateInstance().apply{timeZone=java.util.TimeZone.getTimeZone("UTC")}.format(java.util.Date(it))}?:"请选择"}",
        )
    }
    if (open && enabled) {
        val state = rememberDatePickerState(initialSelectedDateMillis = valueMillis)
        DatePickerDialog(
            onDismissRequest = { open = false },
            confirmButton = {
                TextButton(
                    onClick = {
                        state.selectedDateMillis?.let(onValueChange)
                        open = false
                    },
                    enabled = state.selectedDateMillis != null,
                ) {
                    Text("确认")
                }
            },
            dismissButton = { TextButton(onClick = { open = false }) { Text("取消") } },
        ) {
            DatePicker(state)
        }
    }
}

@Composable
fun RosemaryTimePicker(
    label: String,
    hour: Int,
    minute: Int,
    onValueChange: (Int, Int) -> Unit,
    enabled: Boolean = true,
) {
    var open by remember { mutableStateOf(false) }
    LaunchedEffect(enabled) { if (!enabled) open = false }
    OutlinedButton(onClick = { open = true }, enabled = enabled) {
        Text("$label %02d:%02d".format(hour, minute))
    }
    if (open && enabled) {
        val state = rememberTimePickerState(hour, minute)
        AlertDialog(
            onDismissRequest = { open = false },
            title = { Text(label) },
            text = { TimePicker(state) },
            confirmButton = {
                TextButton(
                    onClick = {
                        onValueChange(state.hour, state.minute)
                        open = false
                    },
                ) {
                    Text("确认")
                }
            },
            dismissButton = { TextButton(onClick = { open = false }) { Text("取消") } },
        )
    }
}

/** Host supplies Activity Result document picker and persists URI grants when appropriate. */
@Composable
fun RosemaryFileUpload(
    label: String,
    files: List<RosemaryItem>,
    onChoose: () -> Unit,
    onRemove: (String) -> Unit,
    busy: Boolean = false,
    error: String? = null,
) {
    Column {
        Text(label)
        OutlinedButton(onClick = onChoose, enabled = !busy) { Text(if (busy) "正在选择" else "选择文件") }
        files.forEach { f ->
            key(f.id) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(f.label)
                        f.detail?.let { Text(it) }
                    }
                    TextButton(onClick = { onRemove(f.id) }, enabled = !busy) {
                        Text("移除 ${f.label}")
                    }
                }
            }
        }
        error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
    }
}

@Composable
fun RosemaryColorPicker(
    label: String,
    value: Color,
    colors: Map<String, Color>,
    onValueChange: (Color) -> Unit,
    enabled: Boolean = true,
) {
    Column {
        Text(label)
        FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            colors.forEach { (name, color) ->
                FilterChip(
                    selected = color == value,
                    onClick = { onValueChange(color) },
                    enabled = enabled,
                    label = { Text(name) },
                    leadingIcon = {
                        Box(
                            Modifier.size(20.dp)
                                .background(color)
                                .border(1.dp, MaterialTheme.colorScheme.outline),
                        )
                    },
                )
            }
        }
    }
}

@Composable
fun <T> RosemarySegmentedControl(
    value: T,
    options: List<RosemaryOption<T>>,
    onValueChange: (T) -> Unit,
) {
    FlowRow(Modifier.selectableGroup(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        options.forEach { o ->
            FilterChip(
                selected = o.value == value,
                onClick = { onValueChange(o.value) },
                enabled = o.enabled,
                label = { Text(o.label) },
            )
        }
    }
}

@Composable
fun RosemaryBreadcrumb(ancestors: List<RosemaryAction>, current: String) {
    FlowRow(verticalArrangement = Arrangement.Center) {
        ancestors.forEach { a ->
            TextButton(onClick = { a.onInvoke?.invoke() }, enabled = a.onInvoke != null) {
                Text(a.label)
            }
            Text("›", Modifier.clearAndSetSemantics {})
        }
        Text(current, Modifier.semantics { stateDescription = "当前页面" })
    }
}

@Composable
fun RosemarySidebar(items: List<RosemaryItem>, value: String, onValueChange: (String) -> Unit) {
    Column {
        items.forEach { i ->
            NavigationDrawerItem(
                label = { Text(i.label) },
                selected = i.id == value,
                onClick = { if (i.enabled) onValueChange(i.id) },
                modifier = Modifier.semantics { if (!i.enabled) disabled() },
            )
        }
    }
}

@Composable
fun RosemaryTopNavigation(
    title: String,
    onBack: (() -> Unit)? = null,
    actions: List<RosemaryAction> = emptyList(),
) {
    TopAppBar(
        title = { Text(title) },
        navigationIcon = { if (onBack != null) TextButton(onClick = onBack) { Text("返回") } },
        actions = {
            actions.forEach { a ->
                TextButton(onClick = { a.onInvoke?.invoke() }, enabled = a.onInvoke != null) {
                    Text(a.label)
                }
            }
        },
    )
}

@Composable
fun RosemaryBottomNavigation(
    items: List<RosemaryItem>,
    value: String,
    onValueChange: (String) -> Unit,
) {
    NavigationBar {
        items.forEach { i ->
            NavigationBarItem(
                selected = i.id == value,
                onClick = { onValueChange(i.id) },
                enabled = i.enabled,
                icon = { Text(if (i.id == value) "●" else "○", Modifier.clearAndSetSemantics {}) },
                label = { Text(i.label) },
            )
        }
    }
}

@Composable
fun RosemaryPagination(page: Int, count: Int, onValueChange: (Int) -> Unit) {
    require(count > 0 && page in 0 until count)
    FlowRow(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
        OutlinedButton(onClick = { onValueChange(page - 1) }, enabled = page > 0) { Text("上一页") }
        Text("${page+1} / $count", Modifier.semantics { liveRegion = LiveRegionMode.Polite })
        OutlinedButton(onClick = { onValueChange(page + 1) }, enabled = page < count - 1) {
            Text("下一页")
        }
    }
}

@Composable
fun RosemaryStepper(
    labels: List<String>,
    value: Int,
    onValueChange: (Int) -> Unit,
    content: @Composable () -> Unit,
) {
    require(value in labels.indices)
    Column {
        FlowRow {
            labels.forEachIndexed { i, s ->
                TextButton(
                    onClick = { onValueChange(i) },
                    modifier = Modifier.semantics { selected = i == value },
                ) {
                    Text("${i+1}. $s")
                }
            }
        }
        content()
        RosemaryPagination(value, labels.size, onValueChange)
    }
}

@Composable
fun RosemaryList(
    items: List<RosemaryItem>,
    selected: String? = null,
    onActivate: ((String) -> Unit)? = null,
) {
    Column {
        items.forEach { i ->
            key(i.id) {
                ListItem(
                    headlineContent = { Text(i.label) },
                    supportingContent = i.detail?.let { { Text(it) } },
                    modifier =
                        Modifier.then(
                            if (onActivate != null)
                                Modifier.selectable(
                                    i.id == selected,
                                    enabled = i.enabled,
                                    onClick = { onActivate(i.id) },
                                )
                            else Modifier,
                        ),
                )
            }
        }
    }
}

@Composable
fun RosemaryDescriptionList(values: Map<String, String>) {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        values.forEach { (label, value) ->
            Column(Modifier.semantics(mergeDescendants = true) {}) {
                Text(label, style = MaterialTheme.typography.labelLarge)
                Text(value)
            }
        }
    }
}

@Composable
fun RosemaryTable(
    columns: List<RosemaryColumn>,
    rows: List<RosemaryRecord>,
    sortColumn: String? = null,
    ascending: Boolean = true,
    onSort: ((String, Boolean) -> Unit)? = null,
) {
    BoxWithConstraints {
        if (maxWidth < 600.dp)
            Column {
                if (onSort != null)
                    FlowRow {
                        columns.forEach { c ->
                            TextButton(
                                onClick = {
                                    onSort(c.id, if (sortColumn == c.id) !ascending else true)
                                },
                            ) {
                                Text("按${c.label}排序")
                            }
                        }
                    }
                rows.forEach { row ->
                    key(row.id) {
                        RosemaryCard {
                            RosemaryDescriptionList(
                                columns.associate { it.label to (row.cells[it.id] ?: "") },
                            )
                        }
                    }
                }
            }
        else
            Column(Modifier.horizontalScroll(rememberScrollState())) {
                Row {
                    columns.forEach { c ->
                        TextButton(
                            onClick = {
                                onSort?.invoke(c.id, if (sortColumn == c.id) !ascending else true)
                            },
                            enabled = onSort != null,
                            modifier = Modifier.width(180.dp),
                        ) {
                            Text(c.label)
                        }
                    }
                }
                rows.forEach { row ->
                    key(row.id) {
                        Row {
                            columns.forEach { c ->
                                Text(row.cells[c.id] ?: "", Modifier.width(180.dp).padding(12.dp))
                            }
                        }
                    }
                }
            }
    }
}

@Composable
fun RosemaryDataGrid(
    columns: List<RosemaryColumn>,
    rows: List<RosemaryRecord>,
    selected: Set<String>,
    onSelectionChange: (Set<String>) -> Unit,
    onCellCommit: (String, String, String) -> Unit,
    configuration: RosemaryGridConfiguration = remember { RosemaryGridConfiguration() },
) {
    RosemaryVirtualDataGrid(columns, rows, selected, onSelectionChange, onCellCommit, configuration)
}

@Composable
fun RosemaryBadge(label: String) {
    Surface(color = MaterialTheme.colorScheme.primaryContainer, shape = RoundedCornerShape(8.dp)) {
        Text(label, Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
    }
}

@Composable
fun RosemaryTag(
    label: String,
    selected: Boolean = false,
    onSelected: ((Boolean) -> Unit)? = null,
    onRemove: (() -> Unit)? = null,
) {
    InputChip(
        selected = selected,
        onClick = { onSelected?.invoke(!selected) },
        enabled = onSelected != null || onRemove != null,
        label = { Text(label) },
        trailingIcon =
            onRemove?.let {
                {
                    TextButton(
                        onClick = it,
                        modifier = Modifier.semantics { contentDescription = "移除 $label" },
                    ) {
                        Text("×")
                    }
                }
            },
    )
}

@Composable
fun RosemaryAvatar(label: String, initials: String, image: (@Composable () -> Unit)? = null) {
    Surface(
        shape = androidx.compose.foundation.shape.CircleShape,
        modifier =
            Modifier.size(48.dp).semantics {
                contentDescription = label
                role = Role.Image
            },
    ) {
        Box(contentAlignment = Alignment.Center) {
            if (image != null) image() else Text(initials, Modifier.clearAndSetSemantics {})
        }
    }
}

@Composable
fun RosemarySheet(
    title: String,
    onDismiss: () -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.padding(24.dp).verticalScroll(rememberScrollState()).imePadding()) {
            Text(
                title,
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.semantics { heading() },
            )
            TextButton(onClick = onDismiss) { Text("关闭") }
            content()
        }
    }
}

@Composable
fun RosemaryToast(message: String) {
    Surface(shape = RoundedCornerShape(8.dp), shadowElevation = 4.dp) {
        Text(message, Modifier.padding(16.dp).semantics { liveRegion = LiveRegionMode.Polite })
    }
}

@Composable
fun RosemarySnackbar(message: String, action: RosemaryAction, onDismiss: () -> Unit) {
    Snackbar(
        action = {
            TextButton(onClick = { action.onInvoke?.invoke() }, enabled = action.onInvoke != null) {
                Text(action.label)
            }
        },
        dismissAction = { TextButton(onClick = onDismiss) { Text("关闭") } },
    ) {
        Text(message)
    }
}

@Composable
fun RosemaryBanner(title: String, message: String, actions: List<RosemaryAction> = emptyList()) {
    Column {
        Text(title, modifier = Modifier.semantics { heading() })
        Text(message)
        RosemaryButtonGroup(actions)
    }
}

@Composable
fun RosemarySkeleton(label: String = "正在加载内容", lines: Int = 3) {
    Column(Modifier.semantics { contentDescription = label }) {
        repeat(lines) {
            Box(
                Modifier.fillMaxWidth()
                    .padding(vertical = 4.dp)
                    .height(16.dp)
                    .background(MaterialTheme.colorScheme.surfaceVariant),
            )
        }
    }
}

@Composable
fun RosemaryTooltip(message: String, content: @Composable () -> Unit) {
    TooltipBox(
        positionProvider = TooltipDefaults.rememberPlainTooltipPositionProvider(),
        tooltip = { PlainTooltip { Text(message) } },
        state = rememberTooltipState(),
    ) {
        content()
    }
}

@Composable
fun RosemaryPopover(label: String, content: @Composable () -> Unit) {
    var open by remember { mutableStateOf(false) }
    val wide = androidx.compose.ui.platform.LocalConfiguration.current.screenWidthDp >= 600
    Box {
        OutlinedButton(onClick = { open = true }) { Text(label) }
        if (open) {
            if (wide)
                DropdownMenu(
                    expanded = true,
                    onDismissRequest = { open = false },
                    modifier = Modifier.widthIn(min = 240.dp, max = 360.dp).heightIn(max = 400.dp),
                ) {
                    Column(
                        Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                    ) {
                        Text(label, style = MaterialTheme.typography.titleMedium)
                        content()
                        TextButton(onClick = { open = false }) { Text("关闭 $label") }
                    }
                }
            else RosemarySheet(label, { open = false }) { content() }
        }
    }
}

@Composable
fun RosemaryDropdownMenu(label: String, actions: List<RosemaryAction>) {
    var open by remember { mutableStateOf(false) }
    Box {
        OutlinedButton(onClick = { open = true }, enabled = actions.any { it.onInvoke != null }) {
            Text(label)
        }
        DropdownMenu(open, { open = false }) {
            actions.forEach { a ->
                DropdownMenuItem(
                    text = {
                        Text(
                            a.label,
                            color =
                                if (a.destructive) MaterialTheme.colorScheme.error
                                else LocalContentColor.current,
                        )
                    },
                    enabled = a.onInvoke != null,
                    onClick = {
                        open = false
                        a.onInvoke?.invoke()
                    },
                )
            }
        }
    }
}

@Composable
fun RosemaryContextMenu(actions: List<RosemaryAction>, content: @Composable () -> Unit) {
    var open by remember { mutableStateOf(false) }
    val currentActions by rememberUpdatedState(actions)
    fun invoke(id: String) {
        open = false
        currentActions.firstOrNull { it.id == id }?.onInvoke?.invoke()
    }
    Column {
        Box(
            Modifier.combinedClickable(onClick = {}, onLongClick = { open = true }).semantics {
                customActions =
                    actions
                        .filter { it.onInvoke != null }
                        .map { a ->
                            CustomAccessibilityAction(a.label) {
                                invoke(a.id)
                                true
                            }
                        }
            },
        ) {
            content()
            DropdownMenu(open, { open = false }) {
                actions.forEach { a ->
                    DropdownMenuItem(
                        text = { Text(a.label) },
                        onClick = { invoke(a.id) },
                        enabled = a.onInvoke != null,
                    )
                }
            }
        }
        RosemaryDropdownMenu("更多操作", actions)
    }
}

@Composable
fun RosemaryDrawer(
    title: String,
    items: List<RosemaryItem>,
    value: String,
    onValueChange: (String) -> Unit,
    open: Boolean,
    onClose: () -> Unit,
    content: @Composable () -> Unit,
) {
    val state = rememberDrawerState(DrawerValue.Closed)
    val currentOpen by rememberUpdatedState(open)
    val currentClose by rememberUpdatedState(onClose)
    var presented by remember { mutableStateOf(false) }
    LaunchedEffect(open) {
        if (open) {
            state.open()
            presented = state.isOpen
        } else {
            presented = false
            state.close()
        }
    }
    LaunchedEffect(state) {
        snapshotFlow { Triple(state.currentValue, state.targetValue, state.isAnimationRunning) }
            .collect { (value, target, moving) ->
                if (
                    presented &&
                        currentOpen &&
                        value == DrawerValue.Closed &&
                        target == DrawerValue.Closed &&
                        !moving
                ) {
                    presented = false
                    currentClose()
                    withFrameNanos {}
                    if (currentOpen) {
                        state.open()
                        presented = state.isOpen
                    }
                }
            }
    }
    ModalNavigationDrawer(
        drawerState = state,
        drawerContent = {
            ModalDrawerSheet {
                Text(title, Modifier.padding(16.dp))
                RosemarySidebar(items, value) {
                    onValueChange(it)
                    currentClose()
                }
            }
        },
        content = content,
    )
}

@Composable
fun RosemaryCard(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    OutlinedCard(modifier, shape = RoundedCornerShape(8.dp)) {
        Box(Modifier.padding(16.dp)) { content() }
    }
}

@Composable
fun RosemaryAccordion(
    label: String,
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    content: @Composable () -> Unit,
) {
    val reduced = LocalRosemaryPolicy.current.reduced
    Column {
        TextButton(
            onClick = { onExpandedChange(!expanded) },
            modifier =
                Modifier.fillMaxWidth().semantics {
                    stateDescription = if (expanded) "已展开" else "已收起"
                },
        ) {
            Text(label)
        }
        androidx.compose.animation.AnimatedVisibility(
            visible = expanded,
            enter =
                if (reduced) androidx.compose.animation.EnterTransition.None
                else
                    androidx.compose.animation.expandVertically(
                        androidx.compose.animation.core.tween(240),
                    ) +
                        androidx.compose.animation.fadeIn(
                            androidx.compose.animation.core.tween(160),
                        ),
            exit =
                if (reduced) androidx.compose.animation.ExitTransition.None
                else
                    androidx.compose.animation.shrinkVertically(
                        androidx.compose.animation.core.tween(240),
                    ) +
                        androidx.compose.animation.fadeOut(
                            androidx.compose.animation.core.tween(120),
                        ),
        ) {
            content()
        }
    }
}

@Composable
fun RosemaryDivider() {
    HorizontalDivider(Modifier.padding(vertical = 16.dp))
}

@Composable
fun RosemaryScrollArea(
    state: ScrollState = rememberScrollState(),
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(Modifier.verticalScroll(state), content = content)
}

@Composable
fun RosemaryResizablePanels(
    fraction: Float,
    onValueChange: (Float) -> Unit,
    leading: @Composable () -> Unit,
    trailing: @Composable () -> Unit,
) {
    require(fraction in 0.2f..0.8f)
    val density = LocalDensity.current
    val direction = LocalLayoutDirection.current
    val current by rememberUpdatedState(fraction)
    val callback by rememberUpdatedState(onValueChange)
    val interaction = remember { MutableInteractionSource() }
    val hovered by interaction.collectIsHoveredAsState()
    val focused by interaction.collectIsFocusedAsState()
    var pressed by remember { mutableStateOf(false) }
    BoxWithConstraints {
        if (maxWidth < 600.dp)
            Column {
                leading()
                Spacer(Modifier.height(24.dp))
                trailing()
            }
        else {
            val width = with(density) { (maxWidth - 48.dp).toPx() }
            val sign = if (direction == LayoutDirection.Rtl) -1 else 1
            Row {
                Box(Modifier.weight(fraction)) { leading() }
                Box(
                    Modifier.width(48.dp)
                        .heightIn(min = 48.dp)
                        .background(
                            MaterialTheme.colorScheme.primary.copy(
                                alpha =
                                    if (pressed) 0.18f else if (hovered || focused) 0.1f else 0f,
                            ),
                            RoundedCornerShape(8.dp),
                        )
                        .onPreviewKeyEvent { e ->
                            if (e.type != KeyEventType.KeyDown) false
                            else
                                when (e.key) {
                                    Key.DirectionRight -> {
                                        callback((current + 0.05f * sign).coerceIn(0.2f, 0.8f))
                                        true
                                    }
                                    Key.DirectionLeft -> {
                                        callback((current - 0.05f * sign).coerceIn(0.2f, 0.8f))
                                        true
                                    }
                                    else -> false
                                }
                        }
                        .hoverable(interaction)
                        .focusable(interactionSource = interaction)
                        .pointerInput(width, direction) {
                            detectDragGestures(
                                onDragStart = { pressed = true },
                                onDragEnd = { pressed = false },
                                onDragCancel = { pressed = false },
                            ) { change, drag ->
                                change.consume()
                                callback((current + drag.x / width * sign).coerceIn(0.2f, 0.8f))
                            }
                        }
                        .semantics {
                            contentDescription = "调整分栏"
                            progressBarRangeInfo = ProgressBarRangeInfo(fraction, 0.2f..0.8f)
                            setProgress {
                                callback(it.coerceIn(0.2f, 0.8f))
                                true
                            }
                        },
                    contentAlignment = Alignment.Center,
                ) {
                    Text("⋮")
                }
                Box(Modifier.weight(1 - fraction)) { trailing() }
            }
        }
    }
}

@Composable
fun RosemaryMetricCard(
    label: String,
    value: String,
    detail: String = "",
    series: List<Double> = emptyList(),
    trend: String? = null,
) {
    val points = series.filter { it.isFinite() }
    val description =
        trend
            ?: (if (points.size < 2) ""
            else if (points.last() > points.first()) "趋势上升"
            else if (points.last() < points.first()) "趋势下降" else "趋势稳定")
    RosemaryCard {
        Column {
            Text(label)
            Text(value, style = MaterialTheme.typography.headlineMedium)
            if (description.isNotEmpty()) Text(description)
            if (points.size > 1) {
                val color = MaterialTheme.colorScheme.primary
                Canvas(Modifier.fillMaxWidth().height(48.dp).clearAndSetSemantics {}) {
                    val lo = points.min()
                    val span = points.max() - lo
                    val path = androidx.compose.ui.graphics.Path()
                    points.forEachIndexed { i, v ->
                        val x = 2 + (size.width - 4) * i / (points.size - 1)
                        val y =
                            if (span == 0.0) size.height / 2
                            else (2 + (size.height - 4) * (1 - (v - lo) / span)).toFloat()
                        if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
                    }
                    drawPath(
                        path,
                        color,
                        style =
                            androidx.compose.ui.graphics.drawscope.Stroke(width = 1.75.dp.toPx()),
                    )
                }
            }
            if (detail.isNotEmpty()) Text(detail)
        }
    }
}

enum class RosemaryHealth {
    Unknown,
    Healthy,
    Degraded,
    Offline,
}

@Composable
fun RosemaryProberStatus(
    label: String,
    state: String,
    recovery: RosemaryAction? = null,
    health: RosemaryHealth = RosemaryHealth.Unknown,
    latencyMillis: Long? = null,
    checkedAtMillis: Long? = null,
) {
    require(latencyMillis == null || latencyMillis >= 0)
    Column(Modifier.semantics { liveRegion = LiveRegionMode.Polite }) {
        Text(label)
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                when (health) {
                    RosemaryHealth.Healthy -> "✓"
                    RosemaryHealth.Degraded -> "!"
                    RosemaryHealth.Offline -> "×"
                    RosemaryHealth.Unknown -> "?"
                },
                Modifier.sizeIn(minWidth = 20.dp, minHeight = 20.dp).clearAndSetSemantics {},
            )
            Spacer(Modifier.width(8.dp))
            Text(state)
        }
        latencyMillis?.let { Text("响应时间 $it ms") }
        checkedAtMillis?.let {
            Text("检查时间 ${java.text.DateFormat.getDateTimeInstance().format(java.util.Date(it))}")
        }
        recovery?.let {
            TextButton(onClick = { it.onInvoke?.invoke() }, enabled = it.onInvoke != null) {
                Text(it.label)
            }
        }
    }
}

data class RosemaryFileMetadata(
    val kind: String = "",
    val size: String = "",
    val sync: String = "",
) {
    val description
        get() = listOf(kind, size, sync).filter { it.isNotEmpty() }.joinToString(" · ")
}

@Composable
fun RosemaryFileRow(
    file: RosemaryItem,
    selected: Boolean,
    onSelected: (Boolean) -> Unit,
    actions: List<RosemaryAction> = emptyList(),
    metadata: RosemaryFileMetadata? = null,
    onOpen: (() -> Unit)? = null,
) {
    RosemaryContextMenu(if (file.enabled) actions else emptyList()) {
        Column {
            RosemaryCheckbox(
                file.label,
                if (selected) androidx.compose.ui.state.ToggleableState.On
                else androidx.compose.ui.state.ToggleableState.Off,
                { onSelected(!selected) },
                enabled = file.enabled,
            )
            file.detail?.let { Text(it) }
            metadata?.let { if (it.description.isNotEmpty()) Text(it.description) }
            onOpen?.let {
                TextButton(onClick = it, enabled = file.enabled) { Text("打开 ${file.label}") }
            }
        }
    }
}
