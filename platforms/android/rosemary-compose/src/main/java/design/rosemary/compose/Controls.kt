package design.rosemary.compose

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.selection.*
import androidx.compose.foundation.shape.*
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.input.key.*
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.*
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.PopupProperties
import kotlin.math.roundToInt

@Composable
private fun controlTextStyle(
    component: String,
    label: Boolean = false,
    color: Color = RosemaryTheme.colors.ink,
): TextStyle {
    val dimensions =
        design.rosemary.compose.generated.RosemaryTokens.componentTokens
            .getValue(component)
            .dimensions
    return rosemaryTextStyle(color = color)
        .copy(
            fontSize = dimensions.getValue(if (label) "labelFontSize" else "fontSize").sp,
            lineHeight = dimensions.getValue(if (label) "labelLineHeight" else "lineHeight").sp,
            fontWeight =
                if (label || component == "button") FontWeight.Medium else FontWeight.Normal,
        )
}

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
            RosemaryButtonVariant.Secondary -> c.fieldFill
            RosemaryButtonVariant.Text -> Color.Transparent
        }
    val ink =
        when (variant) {
            RosemaryButtonVariant.Primary -> c.onPrimary
            RosemaryButtonVariant.Danger -> c.onDanger
            RosemaryButtonVariant.Secondary -> c.ink
            else -> c.primary
        }
    val interaction = remember { MutableInteractionSource() }
    val held by interaction.collectIsPressedAsState()
    val reduced = RosemaryTheme.reducedMotion
    val scale by
        animateFloatAsState(
            if (held && enabled && !busy && !reduced) RosemaryInteraction.pressScale else 1f,
            if (reduced) snap()
            else
                spring(
                    dampingRatio =
                        if (held) RosemaryInteraction.pressDamping
                        else RosemaryInteraction.releaseDamping,
                    stiffness =
                        if (held) RosemaryInteraction.pressStiffness
                        else RosemaryInteraction.releaseStiffness,
                ),
            label = "Rosemary press",
        )
    val buttonRadius = rosemaryRadius("button")
    val fillInset =
        if (
            RosemaryTheme.isDark &&
                !RosemaryTheme.highContrast &&
                (variant == RosemaryButtonVariant.Primary ||
                    variant == RosemaryButtonVariant.Danger)
        )
            rosemaryDimension("button", "darkFillInset")
        else 0.dp
    Row(
        modifier
            .animateContentSize(
                if (reduced) snap()
                else
                    tween(
                        RosemaryInteraction.layoutMs.toInt(),
                        easing = CubicBezierEasing(.2f, .8f, .2f, 1f),
                    )
            )
            .graphicsLayer {
                scaleX = scale
                scaleY = scale
            }
            .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
            .rosemaryFocus()
            .clip(RoundedCornerShape(rosemaryRadius("input")))
            .drawBehind {
                val inset = if (enabled) fillInset.toPx() else 0f
                drawRoundRect(
                    if (enabled) fill else c.border,
                    topLeft = androidx.compose.ui.geometry.Offset(inset, inset),
                    size =
                        androidx.compose.ui.geometry.Size(
                            (size.width - 2 * inset).coerceAtLeast(0f),
                            (size.height - 2 * inset).coerceAtLeast(0f),
                        ),
                    cornerRadius =
                        androidx.compose.ui.geometry.CornerRadius(
                            (buttonRadius.toPx() - inset).coerceAtLeast(0f)
                        ),
                )
            }
            .border(
                if (variant == RosemaryButtonVariant.Secondary) 1.dp else 0.dp,
                if (RosemaryTheme.highContrast) c.control else Color.Transparent,
                RoundedCornerShape(rosemaryRadius("input")),
            )
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled && !busy,
                role = Role.Button,
                onClick = onClick,
            )
            .semantics { if (busy) stateDescription = strings.text("Busy") }
            .padding(
                horizontal = rosemaryDimension("button", "paddingInline"),
                vertical = rosemaryDimension("button", "paddingBlock"),
            ),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        if (busy) RosemaryLoading(size = 18.dp, label = "", color = ink) else leading?.invoke()
        BasicText(label, style = controlTextStyle("button", color = if (enabled) ink else c.muted))
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
    val interaction = remember { MutableInteractionSource() }
    Box(
        modifier
            .rosemaryPhysicalPress(interaction, enabled && !busy)
            .sizeIn(
                minWidth = rosemaryDimension("iconButton", "minTouchTarget"),
                minHeight = rosemaryDimension("iconButton", "minTouchTarget"),
            )
            .rosemaryFocus()
            .clip(RoundedCornerShape(rosemaryRadius("input")))
            .background(
                if (danger) c.dangerSoft else if (pressed) c.primarySoft else Color.Transparent
            )
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled && !busy,
                role = Role.Button,
                onClick = onClick,
            )
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

/** Preserve 0.4.x positional arguments and trailing onCommit lambdas. */
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
) =
    RosemaryInput(
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
        requirements = emptyList(),
        verification = null,
        onCommit = onCommit,
    )

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
    requirements: List<RosemaryFieldRequirement> = emptyList(),
    verification: (@Composable () -> Unit)? = null,
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
        requirements,
        verification,
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
    requirements: List<RosemaryFieldRequirement> = emptyList(),
    verification: (@Composable () -> Unit)? = null,
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
        requirements,
        verification,
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
    requirements: List<RosemaryFieldRequirement>,
    verification: (@Composable () -> Unit)?,
) {
    val validation = remember { RosemaryFieldValidationState() }
    var editing by remember { mutableStateOf(TextFieldValue(value)) }
    SideEffect { validation.edit(value) }
    val active = validation.armed && value.isNotEmpty() && editing.composition == null
    val invalid = error != null || active && requirements.any { !it.check(value) }
    val displayed =
        if (editing.text == value) editing
        else TextFieldValue(value, TextRange(editing.selection.end.coerceAtMost(value.length)))
    val c = RosemaryTheme.colors
    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        BasicText(label, style = controlTextStyle("input", label = true))
        BasicTextField(
            displayed,
            { next ->
                editing = next
                validation.edit(next.text)
                onValueChange(next.text)
            },
            Modifier.fillMaxWidth()
                .onFocusChanged {
                    if (it.isFocused) validation.focus()
                    else validation.blur(value, editing.composition != null)
                }
                .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
                .rosemaryFieldFocus(invalid)
                .background(
                    if (!enabled || readOnly) c.surfaceInset
                    else if (invalid) c.dangerSoft else c.fieldFill,
                    RoundedCornerShape(rosemaryRadius("input")),
                )
                .alpha(if (enabled) 1f else .65f)
                .padding(horizontal = 12.dp, vertical = rosemaryDimension("input", "paddingBlock"))
                .semantics {
                    contentDescription = label
                    if (invalid)
                        error(
                            error
                                ?: requirements
                                    .filter { !it.check(value) }
                                    .joinToString { it.label }
                        )
                },
            enabled = enabled,
            readOnly = readOnly,
            textStyle = controlTextStyle("input", color = if (enabled) c.ink else c.muted),
            keyboardOptions =
                if (password && options == KeyboardOptions.Default)
                    options.copy(keyboardType = KeyboardType.Password)
                else options,
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
        FieldRequirements(value, requirements, active)
        verification?.invoke()
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
    var up by remember { mutableStateOf(false) }
    var triggerWidth by remember { mutableIntStateOf(0) }
    val density = LocalDensity.current
    val reduce = RosemaryTheme.reducedMotion
    val progress = remember { Animatable(0f) }
    val radius = rosemaryRadius("input")
    LaunchedEffect(open, reduce) {
        if (reduce) progress.snapTo(if (open) 1f else 0f)
        else
            progress.animateTo(
                if (open) 1f else 0f,
                tween(
                    if (open) RosemaryInteraction.disclosureMs.toInt()
                    else RosemaryInteraction.disclosureExitMs.toInt(),
                    easing = rosemaryDisclosureEasing(open),
                ),
            )
    }
    val arrow = progress.value * 180f
    val triggerShape =
        RoundedCornerShape(
            topStart = if (up) radius * (1f - progress.value) else radius,
            topEnd = if (up) radius * (1f - progress.value) else radius,
            bottomStart = if (!up) radius * (1f - progress.value) else radius,
            bottomEnd = if (!up) radius * (1f - progress.value) else radius,
        )
    val panelShape =
        RoundedCornerShape(
            topStart = if (up) radius else 0.dp,
            topEnd = if (up) radius else 0.dp,
            bottomStart = if (up) 0.dp else radius,
            bottomEnd = if (up) 0.dp else radius,
        )
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
    LaunchedEffect(enabled) {
        if (!enabled && open) {
            open = false
            onOpenChange(false)
        }
    }
    Column(modifier, verticalArrangement = Arrangement.spacedBy(8.dp)) {
        BasicText(label, style = controlTextStyle("select", label = true))
        Box {
            Row(
                Modifier.fillMaxWidth()
                    .onSizeChanged { triggerWidth = it.width }
                    .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
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
                    .rosemaryFocus()
                    .clip(triggerShape)
                    .background(
                        if (!enabled) c.surfaceInset
                        else if (error != null) c.dangerSoft
                        else if (open || progress.value > 0f) c.fieldHover else c.fieldFill
                    )
                    .alpha(if (enabled) 1f else .65f)
                    .border(
                        1.dp,
                        if (RosemaryTheme.highContrast) c.control else Color.Transparent,
                        RoundedCornerShape(rosemaryRadius("input")),
                    )
                    .clickable(enabled = enabled, role = Role.Button) {
                        open = !open
                        onOpenChange(open)
                    }
                    .semantics {
                        contentDescription = label
                        stateDescription = strings.text(if (open) "Expanded" else "Collapsed")
                        if (error != null) error(error)
                    }
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                BasicText(
                    options.find { it.id == value }?.label ?: rString("Choose…"),
                    Modifier.weight(1f),
                    style =
                        controlTextStyle(
                            "select",
                            color = if (!enabled || value == null) c.muted else c.ink,
                        ),
                )
                RosemaryIcon(
                    "down",
                    Modifier.size(18.dp).rotate(arrow),
                    tint = if (enabled) c.muted else c.control,
                )
            }
            if ((open || progress.value > 0f) && enabled)
                RosemaryPopup(
                    onDismissRequest = { close() },
                    properties = PopupProperties(focusable = open),
                    joined = true,
                    onDirection = { if (up != it) up = it },
                ) {
                    LaunchedEffect(open) {
                        if (open && cursor >= 0) itemFocus[cursor].requestFocus()
                    }
                    Column(
                        Modifier.width(with(density) { triggerWidth.toDp() })
                            .then(if (!open) Modifier.clearAndSetSemantics {} else Modifier)
                            .drawWithContent {
                                val top = if (up) size.height * (1 - progress.value) else 0f
                                val bottom = if (up) size.height else size.height * progress.value
                                clipRect(top = top, bottom = bottom) {
                                    this@drawWithContent.drawContent()
                                }
                            }
                            .shadow(
                                12.dp,
                                panelShape,
                                clip = false,
                                ambientColor = c.ink.copy(alpha = .08f),
                                spotColor = c.ink.copy(alpha = .16f),
                            )
                            .clip(panelShape)
                            .heightIn(max = rosemaryDimension("select", "popupMaxHeight"))
                            .verticalScroll(rememberScrollState())
                            .background(c.fieldHover, panelShape)
                            .padding(rosemaryDimension("select", "popupPadding"))
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
                            Row(
                                Modifier.fillMaxWidth()
                                    .heightIn(min = rosemaryDimension("input", "minTouchTarget"))
                                    .focusRequester(itemFocus[index])
                                    .rosemaryFocus()
                                    .selectable(
                                        option.id == value,
                                        enabled = open && option.enabled,
                                        role = Role.RadioButton,
                                    ) {
                                        onValueChange(option.id)
                                        close()
                                    }
                                    .background(
                                        if (option.id == value) c.primarySoft else Color.Transparent
                                    )
                                    .padding(horizontal = 12.dp, vertical = 9.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(8.dp),
                            ) {
                                BasicText(
                                    option.label,
                                    Modifier.weight(1f),
                                    style =
                                        rosemaryTextStyle(
                                                "small",
                                                color = if (option.enabled) c.ink else c.muted,
                                                size = 13.sp,
                                            )
                                            .copy(lineHeight = 19.5.sp),
                                )
                                Box(Modifier.size(18.dp)) {
                                    if (option.id == value)
                                        RosemaryIcon(
                                            "check",
                                            Modifier.fillMaxSize(),
                                            tint = c.primary,
                                        )
                                }
                            }
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

enum class RosemarySearchPresentation {
    Inline,
    Dialog,
}

/** Keep the legacy trailing onClear callback bound to clearing, never to content. */
@Composable
fun RosemarySearch(
    query: String,
    onQueryChange: (String) -> Unit,
    onSubmit: () -> Unit,
    label: String = "Search",
    modifier: Modifier = Modifier,
    busy: Boolean = false,
    onClear: () -> Unit = { onQueryChange("") },
) =
    RosemarySearch(
        query,
        onQueryChange,
        onSubmit,
        label,
        modifier,
        busy,
        presentation = RosemarySearchPresentation.Inline,
        initiallyExpanded = true,
        onClear = onClear,
    )

@Composable
fun RosemarySearch(
    query: String,
    onQueryChange: (String) -> Unit,
    onSubmit: () -> Unit,
    label: String = "Search",
    modifier: Modifier = Modifier,
    busy: Boolean = false,
    presentation: RosemarySearchPresentation = RosemarySearchPresentation.Inline,
    initiallyExpanded: Boolean = true,
    onClear: () -> Unit = { onQueryChange("") },
) {
    val strings = LocalRosemaryStrings.current

    var expanded by remember {
        mutableStateOf(presentation == RosemarySearchPresentation.Inline && initiallyExpanded)
    }
    var focusOnExpand by remember { mutableStateOf(false) }
    var focusOnCollapse by remember { mutableStateOf(false) }
    val entryFocus = remember { FocusRequester() }
    val fieldFocus = remember { FocusRequester() }
    val searchContent: @Composable () -> Unit = {
        LaunchedEffect(Unit) {
            if (focusOnExpand) {
                fieldFocus.requestFocus()
                focusOnExpand = false
            }
        }
        Row(
            Modifier.onPreviewKeyEvent { event ->
                if (event.type == KeyEventType.KeyDown && event.key == Key.Escape) {
                    if (presentation == RosemarySearchPresentation.Dialog || query.isEmpty()) {
                        expanded = false
                        focusOnCollapse = true
                    } else onClear()
                    true
                } else false
            },
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            RosemaryInput(
                query,
                onQueryChange,
                label,
                Modifier.weight(1f).focusRequester(fieldFocus),
                keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                onCommit = onSubmit,
            )
            if (query.isNotEmpty())
                RosemaryButton(rString("Clear"), onClear, variant = RosemaryButtonVariant.Text)
            RosemaryButton(rString("Search"), onSubmit, busy = busy)
        }
    }
    Column(modifier) {
        if (presentation == RosemarySearchPresentation.Dialog || !expanded)
            RosemaryIconButton(
                label,
                {
                    focusOnExpand = true
                    expanded = true
                },
                Modifier.focusRequester(entryFocus),
            ) {
                RosemaryIcon("search")
            }
        if (presentation == RosemarySearchPresentation.Inline && expanded) searchContent()
        if (presentation == RosemarySearchPresentation.Dialog)
            RosemaryDialog(
                expanded,
                label,
                {
                    expanded = false
                    focusOnCollapse = true
                },
            ) {
                searchContent()
            }
    }
    LaunchedEffect(focusOnCollapse) {
        if (focusOnCollapse) {
            entryFocus.requestFocus()
            focusOnCollapse = false
        }
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
    val source = remember { MutableInteractionSource() }

    val checkboxRadius = rosemaryRadius("checkbox") / 2
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
                interactionSource = source,
                indication = null,
            ) {
                onCheckedChange(checked != true)
            }
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Canvas(
            Modifier.size(20.dp)
                .rosemaryPhysicalPress(source, enabled, RosemaryInteraction.selectionScale)
        ) {
            drawRoundRect(
                fill,
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(checkboxRadius.toPx()),
            )
            drawRoundRect(
                c.control,
                cornerRadius = androidx.compose.ui.geometry.CornerRadius(checkboxRadius.toPx()),
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
    val source = remember { MutableInteractionSource() }

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
            .selectable(
                selected = selected,
                enabled = enabled,
                role = Role.RadioButton,
                interactionSource = source,
                indication = null,
                onClick = onSelect,
            )
            .padding(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp),
    ) {
        Canvas(
            Modifier.size(20.dp)
                .rosemaryPhysicalPress(source, enabled, RosemaryInteraction.selectionScale)
        ) {
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
    var focused by remember { mutableStateOf(false) }
    val inset = rosemaryDimension("slider", "trackInset")
    val thumb = rosemaryDimension("slider", "thumbSize")
    val rail = rosemaryDimension("slider", "trackHeight")
    val insetPx = with(LocalDensity.current) { inset.toPx() }
    val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
    var dragging by remember { mutableStateOf(false) }
    val reduced = RosemaryTheme.reducedMotion
    val fraction by
        animateFloatAsState(
            (safe - range.start) / (range.endInclusive - range.start),
            if (dragging || reduced) snap()
            else
                tween(
                    RosemaryInteraction.layoutMs.toInt(),
                    easing = CubicBezierEasing(.2f, .8f, .2f, 1f),
                ),
            label = "Slider travel",
        )
    fun set(v: Float) {
        onValueChange(
            (range.start + ((v - range.start) / step).roundToInt() * step).coerceIn(range)
        )
    }
    Column(modifier, verticalArrangement = Arrangement.spacedBy(6.dp)) {
        RosemaryText("$label: ${"%.1f".format(safe)}")
        Row(verticalAlignment = Alignment.CenterVertically) {
            BoxWithConstraints(
                Modifier.weight(1f)
                    .height(44.dp)
                    .onSizeChanged { pixels = it.width }
                    .pointerInput(range, step, enabled, rtl) {
                        if (enabled)
                            detectTapGestures { position ->
                                val f =
                                    ((position.x - insetPx) /
                                            (pixels - 2 * insetPx).coerceAtLeast(1f))
                                        .coerceIn(0f, 1f)
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
                                    dragging = true
                                    val f =
                                        ((position.x - insetPx) /
                                                (pixels - 2 * insetPx).coerceAtLeast(1f))
                                            .coerceIn(0f, 1f)
                                    latestChange(
                                        (range.start +
                                                ((range.endInclusive - range.start) *
                                                        (if (rtl) 1 - f else f) / step)
                                                    .roundToInt() * step)
                                            .coerceIn(range)
                                    )
                                },
                                onDragEnd = {
                                    dragging = false
                                    latestCommit()
                                },
                                onDragCancel = { dragging = false },
                                onDrag = { change, _ ->
                                    change.consume()
                                    val f =
                                        ((change.position.x - insetPx) /
                                                (pixels - 2 * insetPx).coerceAtLeast(1f))
                                            .coerceIn(0f, 1f)
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
                    .onFocusChanged { focused = it.isFocused }
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
                    Modifier.padding(horizontal = inset)
                        .fillMaxWidth()
                        .height(rail)
                        .align(Alignment.Center)
                        .background(c.control, CircleShape)
                )
                Box(
                    Modifier.offset(x = inset)
                        .width((width - inset * 2) * fraction)
                        .height(rail)
                        .align(Alignment.CenterStart)
                        .background(c.primary, CircleShape)
                )
                Box(
                    Modifier.offset(x = (width - inset * 2) * fraction + inset - thumb / 2)
                        .size(thumb)
                        .drawBehind {
                            if (focused) {
                                drawCircle(c.focus, radius = size.minDimension / 2 + 4.dp.toPx())
                                drawCircle(c.canvas, radius = size.minDimension / 2 + 2.dp.toPx())
                            }
                        }
                        .align(Alignment.CenterStart)
                        .background(c.primary, CircleShape)
                )
            }
        }
    }
}
