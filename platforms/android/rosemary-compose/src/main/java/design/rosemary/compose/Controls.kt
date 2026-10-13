package design.rosemary.compose

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.*
import androidx.compose.foundation.shape.*
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.key.*
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.input.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.PopupProperties
import kotlin.math.roundToInt

@Composable
fun RosemaryButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    busy: Boolean = false,
    variant: RosemaryButtonVariant = RosemaryButtonVariant.Primary,
    leading: (@Composable () -> Unit)? = null,
    trailing: (@Composable () -> Unit)? = null,
) {
    val strings = LocalRosemaryStrings.current

    val c = RosemaryTheme.colors
    val fill =
        when (variant) {
            RosemaryButtonVariant.Primary -> c.primary
            RosemaryButtonVariant.Danger -> c.danger
            RosemaryButtonVariant.Secondary -> c.surface
            RosemaryButtonVariant.Text -> Color.Transparent
        }
    val ink =
        when (variant) {
            RosemaryButtonVariant.Primary -> c.onPrimary
            RosemaryButtonVariant.Danger -> c.onDanger
            else -> c.primary
        }
    Row(
        modifier
            .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
            .rosemaryFocus()
            .clip(RoundedCornerShape(rosemaryRadius("input")))
            .background(if (enabled) fill else c.border)
            .border(
                if (variant == RosemaryButtonVariant.Secondary) 1.dp else 0.dp,
                if (variant == RosemaryButtonVariant.Secondary) c.control else Color.Transparent,
                RoundedCornerShape(rosemaryRadius("input")),
            )
            .clickable(enabled = enabled && !busy, role = Role.Button, onClick = onClick)
            .semantics { if (busy) stateDescription = strings.text("Busy") }
            .padding(horizontal = 16.dp, vertical = 10.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        if (busy) RosemaryLoading(size = 18.dp, label = "", color = ink) else leading?.invoke()
        RosemaryText(label, color = if (enabled) ink else c.muted)
        trailing?.invoke()
    }
}

@Composable
fun RosemaryLink(
    label: String,
    onNavigate: () -> Unit,
    modifier: Modifier = Modifier,
    current: Boolean = false,
) {
    val strings = LocalRosemaryStrings.current

    RosemaryText(
        label,
        modifier
            .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
            .rosemaryFocus()
            .clickable(role = Role.Button, onClick = onNavigate)
            .semantics { if (current) stateDescription = strings.text("Current page") }
            .padding(vertical = 10.dp),
        color = RosemaryTheme.colors.primary,
    )
}

@Composable
fun RosemaryIconButton(
    label: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    pressed: Boolean = false,
    busy: Boolean = false,
    danger: Boolean = false,
    content: @Composable () -> Unit,
) {
    val strings = LocalRosemaryStrings.current

    val c = RosemaryTheme.colors
    Box(
        modifier
            .sizeIn(
                minWidth = rosemaryDimension("iconButton", "minTouchTarget"),
                minHeight = rosemaryDimension("iconButton", "minTouchTarget"),
            )
            .rosemaryFocus()
            .clip(RoundedCornerShape(rosemaryRadius("input")))
            .background(
                if (danger) c.dangerSoft else if (pressed) c.primarySoft else Color.Transparent
            )
            .clickable(enabled = enabled && !busy, role = Role.Button, onClick = onClick)
            .semantics {
                contentDescription = label
                stateDescription =
                    strings.text(if (busy) "Busy" else if (pressed) "Pressed" else "Not pressed")
            }
            .padding(10.dp),
        contentAlignment = Alignment.Center,
    ) {
        if (busy) RosemaryLoading(size = 18.dp, label = "") else content()
    }
}

@Composable
fun RosemaryInput(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    enabled: Boolean = true,
    readOnly: Boolean = false,
    error: String? = null,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    password: Boolean = false,
    onCommit: () -> Unit = {},
) {
    val strings = LocalRosemaryStrings.current

    Field(
        value,
        onValueChange,
        label,
        modifier,
        placeholder,
        enabled,
        readOnly,
        error,
        keyboardOptions,
        password,
        1,
        onCommit,
    )
}

@Composable
fun RosemaryTextarea(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    enabled: Boolean = true,
    readOnly: Boolean = false,
    error: String? = null,
    minLines: Int = 4,
) {
    val strings = LocalRosemaryStrings.current

    Field(
        value,
        onValueChange,
        label,
        modifier,
        placeholder,
        enabled,
        readOnly,
        error,
        KeyboardOptions.Default,
        false,
        minLines,
        {},
    )
}

@Composable
private fun Field(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier,
    placeholder: String,
    enabled: Boolean,
    readOnly: Boolean,
    error: String?,
    options: KeyboardOptions,
    password: Boolean,
    minLines: Int,
    onCommit: () -> Unit,
) {
    val c = RosemaryTheme.colors
    Column(modifier, verticalArrangement = Arrangement.spacedBy(4.dp)) {
        RosemaryText(label, size = 14.sp)
        BasicTextField(
            value,
            onValueChange,
            Modifier.fillMaxWidth()
                .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
                .rosemaryFocus()
                .border(
                    1.dp,
                    if (error != null) c.danger else c.control,
                    RoundedCornerShape(rosemaryRadius("input")),
                )
                .background(c.surface, RoundedCornerShape(rosemaryRadius("input")))
                .padding(12.dp)
                .semantics {
                    contentDescription = label
                    if (error != null) error(error)
                },
            enabled = enabled,
            readOnly = readOnly,
            textStyle = rosemaryTextStyle(color = c.ink),
            keyboardOptions = options,
            keyboardActions = KeyboardActions(onDone = { onCommit() }, onSearch = { onCommit() }),
            singleLine = minLines == 1,
            minLines = minLines,
            visualTransformation =
                if (password) PasswordVisualTransformation() else VisualTransformation.None,
            cursorBrush = SolidColor(c.primary),
            decorationBox = { inner ->
                Box {
                    if (value.isEmpty()) RosemaryText(placeholder, color = c.muted)
                    inner()
                }
            },
        )
        if (error != null) RosemaryText(error, color = c.danger, size = 14.sp)
    }
}

data class RosemaryOption(
    val id: String,
    val label: String,
    val enabled: Boolean = true,
    val group: String? = null,
)

@Composable
fun RosemarySelect(
    value: String?,
    onValueChange: (String) -> Unit,
    options: List<RosemaryOption>,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    error: String? = null,
    onOpenChange: (Boolean) -> Unit = {},
) {
    var open by remember { mutableStateOf(false) }
    var cursor by
        remember(options, value) {
            mutableIntStateOf(
                options.indexOfFirst { it.id == value && it.enabled }.takeIf { it >= 0 }
                    ?: options.indexOfFirst { it.enabled }
            )
        }
    var prefix by remember { mutableStateOf("") }
    var typedAt by remember { mutableLongStateOf(0) }
    val c = RosemaryTheme.colors
    val strings = LocalRosemaryStrings.current
    val triggerFocus = remember { FocusRequester() }
    val itemFocus = remember(options) { List(options.size) { FocusRequester() } }
    fun close() {
        open = false
        onOpenChange(false)
        triggerFocus.requestFocus()
    }
    fun move(index: Int) {
        if (index in options.indices && options[index].enabled) {
            cursor = index
            itemFocus[index].requestFocus()
        }
    }
    Column(modifier) {
        RosemaryText(label, size = 14.sp)
        Box {
            RosemaryButton(
                options.find { it.id == value }?.label ?: rString("Choose…"),
                {
                    open = !open
                    onOpenChange(open)
                },
                Modifier.fillMaxWidth()
                    .focusRequester(triggerFocus)
                    .onPreviewKeyEvent {
                        if (
                            enabled &&
                                it.type == KeyEventType.KeyDown &&
                                it.key in listOf(Key.DirectionDown, Key.DirectionUp)
                        ) {
                            open = true
                            onOpenChange(true)
                            true
                        } else false
                    }
                    .semantics {
                        stateDescription = strings.text(if (open) "Expanded" else "Collapsed")
                        if (error != null) error(error)
                    },
                enabled = enabled,
                variant = RosemaryButtonVariant.Secondary,
            )
            if (open)
                RosemaryPopup(
                    onDismissRequest = { close() },
                    properties = PopupProperties(focusable = true),
                ) {
                    LaunchedEffect(Unit) { if (cursor >= 0) itemFocus[cursor].requestFocus() }
                    Column(
                        Modifier.widthIn(min = 220.dp, max = 340.dp)
                            .heightIn(max = 360.dp)
                            .verticalScroll(rememberScrollState())
                            .background(c.raised, RoundedCornerShape(rosemaryRadius("input")))
                            .border(1.dp, c.border, RoundedCornerShape(rosemaryRadius("input")))
                            .padding(4.dp)
                            .selectableGroup()
                            .onPreviewKeyEvent { event ->
                                if (event.type != KeyEventType.KeyDown) false
                                else
                                    when (event.key) {
                                        Key.DirectionDown -> {
                                            move(
                                                (cursor + 1..options.lastIndex).firstOrNull {
                                                    options[it].enabled
                                                } ?: options.indexOfFirst { it.enabled }
                                            )
                                            true
                                        }
                                        Key.DirectionUp -> {
                                            move(
                                                (cursor - 1 downTo 0).firstOrNull {
                                                    options[it].enabled
                                                } ?: options.indexOfLast { it.enabled }
                                            )
                                            true
                                        }
                                        Key.MoveHome -> {
                                            move(options.indexOfFirst { it.enabled })
                                            true
                                        }
                                        Key.MoveEnd -> {
                                            move(options.indexOfLast { it.enabled })
                                            true
                                        }
                                        Key.Enter,
                                        Key.Spacebar -> {
                                            if (
                                                cursor in options.indices && options[cursor].enabled
                                            ) {
                                                onValueChange(options[cursor].id)
                                                close()
                                            }
                                            true
                                        }
                                        Key.Escape -> {
                                            close()
                                            true
                                        }
                                        else -> {
                                            val char = event.nativeKeyEvent.unicodeChar.toChar()
                                            if (char.isLetterOrDigit()) {
                                                val now = android.os.SystemClock.uptimeMillis()
                                                prefix =
                                                    (if (now - typedAt > 700) "" else prefix) +
                                                        char.lowercase()
                                                typedAt = now
                                                move(
                                                    options.indexOfFirst {
                                                        it.enabled &&
                                                            it.label.lowercase().startsWith(prefix)
                                                    }
                                                )
                                                true
                                            } else false
                                        }
                                    }
                            }
                    ) {
                        var group: String? = null
                        options.forEachIndexed { index, option ->
                            if (option.group != group) {
                                group = option.group
                                group?.let { RosemaryText(it, size = 12.sp) }
                            }
                            RosemaryText(
                                option.label,
                                Modifier.fillMaxWidth()
                                    .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
                                    .focusRequester(itemFocus[index])
                                    .rosemaryFocus()
                                    .selectable(
                                        option.id == value,
                                        enabled = option.enabled,
                                        role = Role.RadioButton,
                                    ) {
                                        onValueChange(option.id)
                                        close()
                                    }
                                    .background(
                                        if (option.id == value) c.primarySoft else Color.Transparent
                                    )
                                    .padding(12.dp),
                            )
                        }
                        if (options.isEmpty())
                            RosemaryButton(
                                rString("Cancel"),
                                { close() },
                                variant = RosemaryButtonVariant.Text,
                            )
                    }
                }
        }
        if (error != null) RosemaryText(error, color = c.danger, size = 14.sp)
    }
}

@Composable
fun RosemarySearch(
    query: String,
    onQueryChange: (String) -> Unit,
    onSubmit: () -> Unit,
    label: String = "Search",
    modifier: Modifier = Modifier,
    busy: Boolean = false,
    onClear: () -> Unit = { onQueryChange("") },
) {
    val strings = LocalRosemaryStrings.current

    Row(
        modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        RosemaryInput(
            query,
            onQueryChange,
            label,
            Modifier.weight(1f),
            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
            onCommit = onSubmit,
        )
        if (query.isNotEmpty())
            RosemaryButton(rString("Clear"), onClear, variant = RosemaryButtonVariant.Text)
        RosemaryButton(rString("Search"), onSubmit, busy = busy)
    }
}

@Composable
fun RosemaryCheckbox(
    checked: Boolean?,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val strings = LocalRosemaryStrings.current

    val c = RosemaryTheme.colors
    val fill by
        animateColorAsState(
            if (checked != false) c.primary else c.surface,
            tween(if (RosemaryTheme.reducedMotion) 0 else rosemaryMotion("instantFeedback")),
            label = "Checkbox state",
        )
    Row(
        modifier
            .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
            .rosemaryFocus()
            .triStateToggleable(
                when (checked) {
                    true -> androidx.compose.ui.state.ToggleableState.On
                    false -> androidx.compose.ui.state.ToggleableState.Off
                    null -> androidx.compose.ui.state.ToggleableState.Indeterminate
                },
                enabled = enabled,
                role = Role.Checkbox,
            ) {
                onCheckedChange(checked != true)
            }
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Canvas(Modifier.size(20.dp)) {
            drawRoundRect(
                fill,
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(4.dp.toPx()),
            )
            drawRoundRect(
                c.control,
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(4.dp.toPx()),
                style = Stroke(1.dp.toPx()),
            )
            if (checked == true) {
                val p = Path()
                p.moveTo(size.width * .2f, size.height * .5f)
                p.lineTo(size.width * .43f, size.height * .74f)
                p.lineTo(size.width * .8f, size.height * .27f)
                drawPath(p, c.onPrimary, style = Stroke(2.dp.toPx()))
            } else if (checked == null)
                drawLine(
                    c.onPrimary,
                    androidx.compose.ui.geometry.Offset(size.width * .2f, size.height * .5f),
                    androidx.compose.ui.geometry.Offset(size.width * .8f, size.height * .5f),
                    2.dp.toPx(),
                )
        }
        RosemaryText(label, color = if (enabled) c.ink else c.muted)
    }
}

@Composable
fun RosemaryRadio(
    selected: Boolean,
    onSelect: () -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val strings = LocalRosemaryStrings.current

    val c = RosemaryTheme.colors
    val fraction by
        animateFloatAsState(
            if (selected) 1f else 0f,
            tween(if (RosemaryTheme.reducedMotion) 0 else rosemaryMotion("instantFeedback")),
            label = "Radio state",
        )
    Row(
        modifier
            .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
            .rosemaryFocus()
            .selectable(selected, enabled, Role.RadioButton, onClick = onSelect)
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Canvas(Modifier.size(20.dp)) {
            drawCircle(c.control, style = Stroke(1.dp.toPx()))
            if (fraction > 0) drawCircle(c.primary, radius = size.minDimension * .28f * fraction)
        }
        RosemaryText(label, color = if (enabled) c.ink else c.muted)
    }
}

@Composable
fun RosemarySwitch(
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    busy: Boolean = false,
    error: String? = null,
) {
    val strings = LocalRosemaryStrings.current

    val c = RosemaryTheme.colors
    val fraction by
        animateFloatAsState(
            if (checked) 1f else 0f,
            tween(if (RosemaryTheme.reducedMotion) 0 else rosemaryMotion("state")),
            label = "Switch position",
        )
    val track by
        animateColorAsState(
            if (checked) c.primary else c.control,
            tween(if (RosemaryTheme.reducedMotion) 0 else rosemaryMotion("state")),
            label = "Switch track",
        )
    Row(
        modifier
            .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
            .rosemaryFocus()
            .toggleable(checked, enabled && !busy, Role.Switch) { onCheckedChange(it) }
            .semantics {
                if (busy) stateDescription = strings.text("Busy")
                if (error != null) error(error)
            }
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Box(Modifier.size(44.dp, 26.dp).background(track, CircleShape).padding(3.dp)) {
            Box(
                Modifier.size(20.dp)
                    .align(Alignment.CenterStart)
                    .offset(x = 18.dp * fraction)
                    .background(c.onPrimary, CircleShape)
            )
        }
        RosemaryText(label)
        if (busy) RosemaryLoading(18.dp, "")
    }
}

@Composable
fun RosemarySlider(
    value: Float,
    onValueChange: (Float) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    range: ClosedFloatingPointRange<Float> = 0f..100f,
    step: Float = 1f,
    enabled: Boolean = true,
    onCommit: () -> Unit = {},
) {
    val strings = LocalRosemaryStrings.current

    require(
        value.isFinite() &&
            range.start.isFinite() &&
            range.endInclusive.isFinite() &&
            step.isFinite() &&
            range.endInclusive > range.start &&
            step > 0
    )
    val c = RosemaryTheme.colors
    val safe = value.coerceIn(range)
    val latestChange by rememberUpdatedState(onValueChange)
    val latestCommit by rememberUpdatedState(onCommit)
    var pixels by remember { mutableIntStateOf(1) }
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    val fraction = (safe - range.start) / (range.endInclusive - range.start)
    fun set(v: Float) {
        onValueChange(
            (range.start + ((v - range.start) / step).roundToInt() * step).coerceIn(range)
        )
    }
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        RosemaryText("$label: ${"%.1f".format(safe)}")
        Row(verticalAlignment = Alignment.CenterVertically) {
            RosemaryButton(
                "−",
                {
                    set(safe - step)
                    onCommit()
                },
                enabled = enabled,
                variant = RosemaryButtonVariant.Secondary,
            )
            BoxWithConstraints(
                Modifier.weight(1f)
                    .height(44.dp)
                    .padding(horizontal = 12.dp)
                    .onSizeChanged { pixels = it.width }
                    .pointerInput(range, step, enabled, rtl) {
                        if (enabled)
                            detectTapGestures { position ->
                                val f = (position.x / pixels).coerceIn(0f, 1f)
                                latestChange(
                                    (range.start +
                                            ((range.endInclusive - range.start) *
                                                    (if (rtl) 1 - f else f) / step)
                                                .roundToInt() * step)
                                        .coerceIn(range)
                                )
                                latestCommit()
                            }
                    }
                    .pointerInput(range, step, enabled, rtl) {
                        if (enabled)
                            detectDragGestures(
                                onDragStart = { position ->
                                    val f = (position.x / pixels).coerceIn(0f, 1f)
                                    latestChange(
                                        (range.start +
                                                ((range.endInclusive - range.start) *
                                                        (if (rtl) 1 - f else f) / step)
                                                    .roundToInt() * step)
                                            .coerceIn(range)
                                    )
                                },
                                onDragEnd = { latestCommit() },
                                onDrag = { change, _ ->
                                    change.consume()
                                    val f = (change.position.x / pixels).coerceIn(0f, 1f)
                                    latestChange(
                                        (range.start +
                                                ((range.endInclusive - range.start) *
                                                        (if (rtl) 1 - f else f) / step)
                                                    .roundToInt() * step)
                                            .coerceIn(range)
                                    )
                                },
                            )
                    }
                    .rosemaryFocus()
                    .focusable(enabled)
                    .onPreviewKeyEvent {
                        if (it.type == KeyEventType.KeyDown && enabled) {
                            when (it.key) {
                                Key.DirectionRight -> {
                                    set(safe + if (rtl) -step else step)
                                    true
                                }
                                Key.DirectionLeft -> {
                                    set(safe + if (rtl) step else -step)
                                    true
                                }
                                Key.DirectionUp -> {
                                    set(safe + step)
                                    true
                                }
                                Key.DirectionDown -> {
                                    set(safe - step)
                                    true
                                }
                                Key.MoveHome -> {
                                    set(range.start)
                                    true
                                }
                                Key.MoveEnd -> {
                                    set(range.endInclusive)
                                    true
                                }
                                else -> false
                            }
                        } else false
                    }
                    .semantics {
                        contentDescription = label
                        progressBarRangeInfo =
                            ProgressBarRangeInfo(
                                safe,
                                range,
                                (((range.endInclusive - range.start) / step).toInt() - 1)
                                    .coerceAtLeast(0),
                            )
                        setProgress {
                            if (enabled) {
                                set(it)
                                onCommit()
                                true
                            } else false
                        }
                    }
            ) {
                val width = maxWidth
                Box(
                    Modifier.fillMaxWidth()
                        .height(4.dp)
                        .align(Alignment.Center)
                        .background(c.border, CircleShape)
                )
                Box(
                    Modifier.fillMaxWidth(fraction.coerceAtLeast(.001f))
                        .height(4.dp)
                        .align(Alignment.CenterStart)
                        .background(c.primary, CircleShape)
                )
                Box(
                    Modifier.offset(x = (width - 20.dp) * fraction)
                        .size(20.dp)
                        .align(Alignment.CenterStart)
                        .background(c.primary, CircleShape)
                )
            }
            RosemaryButton(
                "+",
                {
                    set(safe + step)
                    onCommit()
                },
                enabled = enabled,
                variant = RosemaryButtonVariant.Secondary,
            )
        }
    }
}
