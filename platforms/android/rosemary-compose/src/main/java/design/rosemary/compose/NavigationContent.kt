package design.rosemary.compose

import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.*
import androidx.compose.foundation.shape.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.*
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.layout.positionInParent
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.*
import design.rosemary.compose.generated.RosemaryIcons

@Composable
fun RosemaryIcon(
    name: String,
    modifier: Modifier = Modifier,
    tint: Color = RosemaryTheme.colors.ink,
    label: String? = null,
) {
    val strings = LocalRosemaryStrings.current

    val shapes = RosemaryIcons.paths[name] ?: error("Unknown Rosemary icon: $name")
    Canvas(
        modifier
            .size(24.dp)
            .then(
                if (label != null) Modifier.semantics { contentDescription = label }
                else Modifier.clearAndSetSemantics {}
            )
    ) {
        scale(
            size.width / 24f,
            size.height / 24f,
            pivot = androidx.compose.ui.geometry.Offset.Zero,
        ) {
            shapes.forEach { commands ->
                val path = Path()
                commands.forEach { cmd ->
                    val v = cmd.values
                    when (cmd.op) {
                        "M" -> path.moveTo(v[0], v[1])
                        "L" -> path.lineTo(v[0], v[1])
                        "C" -> path.cubicTo(v[0], v[1], v[2], v[3], v[4], v[5])
                        "Z" -> path.close()
                    }
                }
                drawPath(
                    path,
                    tint,
                    style =
                        Stroke(
                            RosemaryIcons.strokeWidth,
                            cap = StrokeCap.Round,
                            join = StrokeJoin.Round,
                        ),
                )
            }
        }
    }
}

@Composable
fun RosemaryTabs(
    value: String,
    onValueChange: (String) -> Unit,
    options: List<RosemaryOption>,
    modifier: Modifier = Modifier,
) {
    val strings = LocalRosemaryStrings.current

    val c = RosemaryTheme.colors
    val positions = remember { mutableStateMapOf<String, Pair<Float, Float>>() }
    val density = LocalDensity.current
    val target = positions[value] ?: Pair(0f, 0f)
    val duration = if (RosemaryTheme.reducedMotion) 0 else rosemaryMotion("tabsMs")
    val x by
        animateFloatAsState(
            target.first,
            tween(duration, easing = CubicBezierEasing(.2f, .7f, .2f, 1f)),
            label = "Tab position",
        )
    val width by
        animateFloatAsState(
            target.second,
            tween(duration, easing = CubicBezierEasing(.2f, .7f, .2f, 1f)),
            label = "Tab width",
        )
    Box(modifier.horizontalScroll(rememberScrollState())) {
        Row(Modifier.selectableGroup(), horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            options.forEach { option ->
                RosemaryText(
                    option.label,
                    Modifier.onGloballyPositioned { coordinates ->
                            val next =
                                coordinates.positionInParent().x to coordinates.size.width.toFloat()
                            if (positions[option.id] != next) positions[option.id] = next
                        }
                        .heightIn(min = 44.dp)
                        .rosemaryFocus()
                        .selectable(option.id == value, option.enabled, Role.Tab) {
                            onValueChange(option.id)
                        }
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    color = if (option.id == value) c.primary else c.muted,
                )
            }
        }
        Box(
            Modifier.align(AbsoluteAlignment.BottomLeft)
                .absoluteOffset { IntOffset(x.toInt(), 0) }
                .width(with(density) { width.toDp() })
                .height(2.dp)
                .background(c.primary)
        )
    }
}

@Composable
fun RosemaryBreadcrumb(
    items: List<RosemaryOption>,
    onNavigate: (String) -> Unit,
    modifier: Modifier = Modifier,
) {
    val strings = LocalRosemaryStrings.current
    Row(
        modifier.horizontalScroll(rememberScrollState()),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        items.forEachIndexed { index, item ->
            if (index > 0) RosemaryText(" / ", color = RosemaryTheme.colors.muted)
            if (index == items.lastIndex)
                RosemaryText(
                    item.label,
                    Modifier.semantics { stateDescription = strings.text("Current page") },
                )
            else RosemaryLink(item.label, { onNavigate(item.id) })
        }
    }
}

@Composable
fun RosemaryPagination(
    page: Int,
    pages: Int,
    onPageChange: (Int) -> Unit,
    modifier: Modifier = Modifier,
    busy: Boolean = false,
) {
    val strings = LocalRosemaryStrings.current
    require(pages >= 1 && page in 1..pages)
    Row(
        modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        RosemaryButton(
            rString("Previous"),
            { onPageChange(page - 1) },
            enabled = page > 1 && !busy,
            variant = RosemaryButtonVariant.Secondary,
        )
        RosemaryText(
            rString("Page {page} of {pages}")
                .replace("{page}", page.toString())
                .replace("{pages}", pages.toString()),
            Modifier.semantics { liveRegion = LiveRegionMode.Polite },
        )
        RosemaryButton(
            rString("Next"),
            { onPageChange(page + 1) },
            enabled = page < pages && !busy,
            variant = RosemaryButtonVariant.Secondary,
        )
    }
}

@Composable
fun RosemaryMenu(
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    items: List<RosemaryOption>,
    onActivate: (String) -> Unit,
    modifier: Modifier = Modifier,
    trigger: @Composable () -> Unit,
) {
    val strings = LocalRosemaryStrings.current

    Box(modifier) {
        trigger()
        if (open)
            RosemaryPopup(
                onDismissRequest = { onOpenChange(false) },
                properties = PopupProperties(focusable = true),
            ) {
                Column(
                    Modifier.widthIn(min = 200.dp, max = 320.dp)
                        .heightIn(max = 420.dp)
                        .verticalScroll(rememberScrollState())
                        .background(
                            RosemaryTheme.colors.raised,
                            RoundedCornerShape(rosemaryRadius("menu")),
                        )
                        .padding(8.dp)
                        .semantics { paneTitle = strings.text("Actions") }
                ) {
                    items.forEach {
                        RosemaryButton(
                            it.label,
                            {
                                onActivate(it.id)
                                onOpenChange(false)
                            },
                            Modifier.fillMaxWidth(),
                            enabled = it.enabled,
                            variant = RosemaryButtonVariant.Text,
                        )
                    }
                }
            }
    }
}

@Composable
fun RosemaryTooltip(
    text: String,
    open: Boolean,
    onOpenChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    trigger: @Composable () -> Unit,
) {
    val strings = LocalRosemaryStrings.current
    Box(modifier) {
        trigger()
        if (open)
            RosemaryPopup(
                onDismissRequest = { onOpenChange(false) },
                properties = PopupProperties(focusable = false),
            ) {
                RosemaryText(
                    text,
                    Modifier.widthIn(max = 280.dp)
                        .background(
                            RosemaryTheme.colors.ink,
                            RoundedCornerShape(rosemaryRadius("menu")),
                        )
                        .padding(12.dp)
                        .semantics { liveRegion = LiveRegionMode.Polite },
                    color = RosemaryTheme.colors.surface,
                )
            }
    }
}

@Composable
fun RosemaryPopover(
    open: Boolean,
    onDismiss: (RosemaryDismissReason) -> Unit,
    modifier: Modifier = Modifier,
    trigger: @Composable () -> Unit,
    content: @Composable ColumnScope.() -> Unit,
) {
    val strings = LocalRosemaryStrings.current
    Box(modifier) {
        trigger()
        if (open)
            RosemaryPopup(
                onDismissRequest = { onDismiss(RosemaryDismissReason.Outside) },
                properties = PopupProperties(focusable = false),
            ) {
                Column(
                    Modifier.widthIn(min = 240.dp, max = 360.dp)
                        .heightIn(max = 500.dp)
                        .verticalScroll(rememberScrollState())
                        .background(
                            RosemaryTheme.colors.raised,
                            RoundedCornerShape(rosemaryRadius("card")),
                        )
                        .border(
                            1.dp,
                            RosemaryTheme.colors.border,
                            RoundedCornerShape(rosemaryRadius("card")),
                        )
                        .padding(16.dp),
                    content = content,
                )
            }
    }
}

@Composable
fun RosemaryAlert(
    message: String,
    tone: RosemaryTone = RosemaryTone.Info,
    modifier: Modifier = Modifier,
    action: (@Composable () -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current
    val (bg, fg) = toneColors(RosemaryTheme.colors, tone)
    Column(
        modifier
            .fillMaxWidth()
            .background(bg, RoundedCornerShape(rosemaryRadius("menu")))
            .padding(16.dp)
            .semantics {
                liveRegion =
                    if (tone == RosemaryTone.Danger) LiveRegionMode.Assertive
                    else LiveRegionMode.Polite
            },
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        RosemaryText(message, color = fg)
        action?.invoke()
    }
}

@Composable
fun RosemaryCard(
    modifier: Modifier = Modifier,
    selected: Boolean = false,
    onClick: (() -> Unit)? = null,
    content: @Composable ColumnScope.() -> Unit,
) {
    val strings = LocalRosemaryStrings.current
    val c = RosemaryTheme.colors
    Column(
        modifier
            .fillMaxWidth()
            .background(c.surface, RoundedCornerShape(rosemaryRadius("card")))
            .border(
                if (selected) 2.dp else 1.dp,
                if (selected) c.primary else c.border,
                RoundedCornerShape(rosemaryRadius("card")),
            )
            .then(
                if (onClick != null)
                    Modifier.rosemaryFocus(12.dp).clickable(role = Role.Button, onClick = onClick)
                else Modifier
            )
            .padding(16.dp)
            .semantics { this.selected = selected },
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = content,
    )
}

data class RosemaryListItem(
    val id: String,
    val title: String,
    val detail: String? = null,
    val enabled: Boolean = true,
)

@Composable
fun RosemaryList(
    items: List<RosemaryListItem>,
    modifier: Modifier = Modifier,
    selected: Set<String> = emptySet(),
    onSelectionChange: ((Set<String>) -> Unit)? = null,
    onActivate: ((String) -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current
    Column(modifier) {
        items.forEach { item ->
            Row(
                Modifier.fillMaxWidth()
                    .then(
                        if (onSelectionChange != null)
                            Modifier.rosemaryFocus().toggleable(
                                selected.contains(item.id),
                                item.enabled,
                                Role.Checkbox,
                            ) {
                                val next = selected.toMutableSet()
                                if (!next.add(item.id)) next.remove(item.id)
                                onSelectionChange(next)
                            }
                        else if (onActivate != null)
                            Modifier.rosemaryFocus().clickable(item.enabled, role = Role.Button) {
                                onActivate(item.id)
                            }
                        else Modifier
                    )
                    .background(
                        if (item.id in selected) RosemaryTheme.colors.primarySoft
                        else Color.Transparent
                    )
                    .padding(12.dp)
            ) {
                Column {
                    RosemaryText(item.title)
                    item.detail?.let {
                        RosemaryText(it, color = RosemaryTheme.colors.muted, size = 14.sp)
                    }
                }
            }
            Box(Modifier.fillMaxWidth().height(1.dp).background(RosemaryTheme.colors.border))
        }
    }
}

data class RosemaryTableColumn(val id: String, val title: String, val sortable: Boolean = false)

data class RosemaryTableRow(val id: String, val cells: List<String>)

@Composable
fun RosemaryTable(
    caption: String,
    columns: List<RosemaryTableColumn>,
    rows: List<RosemaryTableRow>,
    modifier: Modifier = Modifier,
    sortColumn: String? = null,
    ascending: Boolean = true,
    onSort: ((String, Boolean) -> Unit)? = null,
    onActivate: ((String) -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current
    Column(
        modifier.horizontalScroll(rememberScrollState()).semantics {
            contentDescription = caption
            collectionInfo = CollectionInfo(rows.size + 1, columns.size)
        }
    ) {
        RosemaryText(caption, size = 20.sp)
        Row {
            columns.forEach { col ->
                if (col.sortable && onSort != null)
                    RosemaryButton(
                        col.title + if (sortColumn == col.id) if (ascending) " ↑" else " ↓" else "",
                        { onSort(col.id, if (sortColumn == col.id) !ascending else true) },
                        Modifier.width(160.dp).semantics {
                            heading()
                            if (sortColumn == col.id)
                                stateDescription =
                                    strings.text(
                                        if (ascending) "Sorted ascending" else "Sorted descending"
                                    )
                        },
                        variant = RosemaryButtonVariant.Text,
                    )
                else
                    RosemaryText(
                        col.title,
                        Modifier.width(160.dp).padding(12.dp).semantics { heading() },
                    )
            }
        }
        rows.forEachIndexed { ri, row ->
            Row(
                Modifier.then(
                    if (onActivate != null)
                        Modifier.rosemaryFocus().clickable(role = Role.Button) {
                            onActivate(row.id)
                        }
                    else Modifier
                )
            ) {
                row.cells.forEachIndexed { ci, cell ->
                    RosemaryText(
                        cell,
                        Modifier.width(160.dp).padding(12.dp).semantics {
                            collectionItemInfo = CollectionItemInfo(ri + 1, 1, ci, 1)
                        },
                    )
                }
            }
        }
    }
}

@Composable
fun RosemaryBadge(
    text: String,
    tone: RosemaryTone = RosemaryTone.Neutral,
    modifier: Modifier = Modifier,
) {
    val strings = LocalRosemaryStrings.current
    val (bg, fg) = toneColors(RosemaryTheme.colors, tone)
    RosemaryText(
        text,
        modifier.background(bg, CircleShape).padding(horizontal = 8.dp, vertical = 3.dp),
        color = fg,
        size = 12.sp,
    )
}

@Composable
fun RosemaryAvatar(
    name: String,
    modifier: Modifier = Modifier,
    size: Dp = 40.dp,
    image: (@Composable () -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current
    Box(
        modifier
            .size(size)
            .clip(CircleShape)
            .background(RosemaryTheme.colors.primarySoft)
            .semantics { contentDescription = name },
        contentAlignment = Alignment.Center,
    ) {
        if (image != null) image()
        else
            RosemaryText(
                name
                    .trim()
                    .split(Regex("\\s+"))
                    .filter { it.isNotEmpty() }
                    .take(2)
                    .joinToString("") { it.take(1).uppercase() },
                color = RosemaryTheme.colors.primary,
            )
    }
}

@Composable
fun RosemaryEmpty(
    title: String,
    description: String,
    modifier: Modifier = Modifier,
    action: (@Composable () -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current
    Column(
        modifier.fillMaxWidth().padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        RosemaryText(title, size = 20.sp)
        RosemaryText(description, color = RosemaryTheme.colors.muted)
        action?.invoke()
    }
}

@Composable
fun RosemarySkeleton(
    modifier: Modifier = Modifier,
    width: Dp = 200.dp,
    height: Dp = 20.dp,
    label: String = "Loading content",
) {
    val strings = LocalRosemaryStrings.current
    Box(
        modifier
            .size(width, height)
            .background(RosemaryTheme.colors.border, RoundedCornerShape(rosemaryRadius("menu")))
            .semantics {
                contentDescription = if (label == "Loading content") strings.text(label) else label
            }
    )
}

data class RosemaryStep(
    val id: String,
    val title: String,
    val state: String = "upcoming",
    val available: Boolean = true,
)

@Composable
fun RosemaryStepper(
    steps: List<RosemaryStep>,
    current: String,
    modifier: Modifier = Modifier,
    onStepChange: ((String) -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current
    Column(
        modifier.semantics { collectionInfo = CollectionInfo(steps.size, 1) },
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        steps.forEachIndexed { index, step ->
            Row(
                Modifier.fillMaxWidth()
                    .heightIn(min = 44.dp)
                    .then(
                        if (onStepChange != null)
                            Modifier.rosemaryFocus().selectable(
                                step.id == current,
                                step.available,
                                Role.Tab,
                            ) {
                                onStepChange(step.id)
                            }
                        else Modifier
                    )
                    .padding(8.dp)
                    .semantics {
                        stateDescription = if (step.id == current) "Current step" else step.state
                    },
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                RosemaryBadge(
                    (index + 1).toString(),
                    if (step.id == current) RosemaryTone.Info else RosemaryTone.Neutral,
                )
                RosemaryText(step.title)
            }
        }
    }
}
