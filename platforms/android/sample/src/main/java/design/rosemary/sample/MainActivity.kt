package design.rosemary.sample

import android.app.Activity
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.*
import androidx.core.view.WindowCompat
import design.rosemary.compose.*
import java.time.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Gallery(
                intent.getStringExtra("component")?.takeIf { it in componentIds } ?: "button",
                intent.getBooleanExtra("dark", false),
                intent.getBooleanExtra("custom", false),
            )
        }
    }
}

val componentIds =
    listOf(
        "button",
        "link",
        "iconButton",
        "input",
        "textarea",
        "select",
        "search",
        "checkbox",
        "radio",
        "switch",
        "slider",
        "date",
        "upload",
        "tabs",
        "breadcrumb",
        "pagination",
        "menu",
        "tooltip",
        "popover",
        "dialog",
        "drawer",
        "toast",
        "alert",
        "card",
        "list",
        "table",
        "badge",
        "avatar",
        "empty",
        "skeleton",
        "loading",
        "progress",
        "stepper",
    )

@Composable
fun Gallery(
    initialComponent: String = "button",
    initialDark: Boolean = false,
    initialCustom: Boolean = false,
) {
    var chinese by remember { mutableStateOf(false) }
    var dark by remember { mutableStateOf(initialDark) }
    var alternate by remember { mutableStateOf(initialCustom) }
    var rtl by remember { mutableStateOf(false) }
    var reduced by remember { mutableStateOf(false) }
    var highContrast by remember { mutableStateOf(false) }
    var selected by remember { mutableStateOf(initialComponent) }
    RosemaryTheme(
        language = if (chinese) RosemaryLanguage.Chinese else RosemaryLanguage.English,
        mode = if (dark) RosemaryThemeMode.Dark else RosemaryThemeMode.Light,
        direction = if (rtl) LayoutDirection.Rtl else LayoutDirection.Ltr,
        reduceMotion = reduced,
    ) {
        val base = RosemaryTheme.colors
        val context = LocalContext.current
        LaunchedEffect(dark) {
            withFrameNanos {}
            (context as? Activity)?.let { activity ->
                val bars =
                    WindowCompat.getInsetsController(activity.window, activity.window.decorView)
                bars.isAppearanceLightStatusBars = !dark
                bars.isAppearanceLightNavigationBars = !dark
            }
        }
        val vigilo = remember(context, dark) { VigiloTheme.colors(context, dark) }
        val palette = if (alternate) vigilo else base
        RosemaryTheme(
            colors = palette,
            highContrast = highContrast,
            highContrastColors =
                palette.copy(border = palette.ink, control = palette.ink, focus = palette.ink),
        ) {
            Column(
                Modifier.fillMaxSize()
                    .background(RosemaryTheme.colors.canvas)
                    .statusBarsPadding()
                    .navigationBarsPadding()
                    .verticalScroll(rememberScrollState())
                    .padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                RosemaryText("Rosemary · Compose SDK 0.4.2", size = 28.sp)
                Row(Modifier.horizontalScroll(rememberScrollState())) {
                    RosemarySwitch(chinese, { chinese = it }, "中文")
                    RosemarySwitch(dark, { dark = it }, "Dark")
                    RosemarySwitch(alternate, { alternate = it }, "Vigilo")
                    RosemarySwitch(rtl, { rtl = it }, "RTL")
                    RosemarySwitch(reduced, { reduced = it }, "Reduce motion")
                    RosemarySwitch(highContrast, { highContrast = it }, "High contrast")
                }
                RosemarySelect(
                    selected,
                    { selected = it },
                    componentIds.map { RosemaryOption(it, it) },
                    "Component",
                    Modifier.testTag("gallery-selector"),
                )
                key(selected) { Demo(selected) }
                RosemaryText(
                    "Local Maven consumer · API 26+",
                    color = RosemaryTheme.colors.muted,
                    size = 12.sp,
                )
            }
        }
    }
}

@Composable
private fun Demo(id: String) {
    var text by remember { mutableStateOf("") }
    var checked by remember { mutableStateOf(false) }
    var value by remember { mutableFloatStateOf(35f) }
    var option by remember { mutableStateOf("a") }
    var open by remember { mutableStateOf(false) }
    var page by remember { mutableIntStateOf(1) }
    var date by remember { mutableStateOf<LocalDate?>(LocalDate.of(2026, 10, 13)) }
    var time by remember { mutableStateOf(LocalTime.of(13, 25)) }
    var files by remember { mutableStateOf(emptyList<RosemaryFile>()) }
    var toast by remember { mutableStateOf(true) }
    var progressState by remember { mutableStateOf(RosemaryProgressState.Running) }
    val options =
        listOf(
            RosemaryOption("a", "Overview"),
            RosemaryOption("b", "Activity"),
            RosemaryOption("c", "Unavailable", false),
        )
    when (id) {
        "button" ->
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                RosemaryButton("Save changes", { text = "Saved" })
                RosemaryButton(
                    "Secondary",
                    { text = "Secondary" },
                    variant = RosemaryButtonVariant.Secondary,
                )
                RosemaryButton(
                    "Delete",
                    { text = "Deleted" },
                    variant = RosemaryButtonVariant.Danger,
                )
                RosemaryButton("Saving", {}, busy = true)
                RosemaryText(text)
            }
        "link" ->
            Column {
                RosemaryLink("Read the design specification", { text = "Navigation requested" })
                RosemaryText(text)
            }
        "iconButton" ->
            RosemaryIconButton("Toggle favorite", { checked = !checked }, pressed = checked) {
                RosemaryIcon("heart")
            }
        "input" ->
            RosemaryInput(
                text,
                { text = it },
                "Project name",
                placeholder = "Rosemary",
                error = if (text.length > 20) "Use 20 characters or fewer" else null,
            )
        "textarea" ->
            RosemaryTextarea(
                text,
                { text = it },
                "Description",
                placeholder = "Write a description",
            )
        "select" -> RosemarySelect(option, { option = it }, options, "Section")
        "search" ->
            Column {
                RosemarySearch(text, { text = it }, { option = text })
                RosemaryText("Submitted query: $option")
            }
        "checkbox" -> RosemaryCheckbox(checked, { checked = it }, "Include archived projects")
        "radio" ->
            Column {
                options.forEach {
                    RosemaryRadio(
                        option == it.id,
                        { option = it.id },
                        it.label,
                        enabled = it.enabled,
                    )
                }
            }
        "switch" -> RosemarySwitch(checked, { checked = it }, "Email notifications")
        "slider" -> RosemarySlider(value, { value = it }, "Volume")
        "date" ->
            RosemaryDate(
                date,
                { date = it },
                "Appointment",
                time = time,
                onTimeChange = { time = it },
            )
        "upload" ->
            RosemaryUpload(
                files,
                { uris ->
                    files =
                        files +
                            uris.map {
                                RosemaryFile(it.toString(), it.lastPathSegment ?: "Document")
                            }
                },
                { key -> files = files.filterNot { it.id == key } },
            )
        "tabs" ->
            Column {
                RosemaryTabs(option, { option = it }, options)
                RosemaryText("Selected section: $option")
            }
        "breadcrumb" ->
            RosemaryBreadcrumb(
                listOf(
                    RosemaryOption("home", "Home"),
                    RosemaryOption("projects", "Projects"),
                    RosemaryOption("current", "Rosemary"),
                ),
                { text = it },
            )
        "pagination" -> RosemaryPagination(page, 12, { page = it })
        "menu" ->
            Column {
                RosemaryMenu(
                    open,
                    { open = it },
                    listOf(
                        RosemaryOption("edit", "Edit"),
                        RosemaryOption("duplicate", "Duplicate"),
                    ),
                    { text = it },
                ) {
                    RosemaryButton(
                        "Actions",
                        { open = !open },
                        trailing = {
                            RosemaryIcon(
                                "down",
                                Modifier.size(18.dp).rotate(if (open) 180f else 0f),
                                tint = RosemaryTheme.colors.onPrimary,
                            )
                        },
                    )
                }
                RosemaryText(text)
            }
        "tooltip" ->
            RosemaryTooltip("Only visible to collaborators", open, { open = it }) {
                RosemaryButton(
                    "Show description",
                    { open = !open },
                    variant = RosemaryButtonVariant.Secondary,
                )
            }
        "popover" ->
            RosemaryPopover(
                open,
                { open = false },
                trigger = { RosemaryButton("Filter", { open = !open }) },
            ) {
                RosemaryCheckbox(checked, { checked = it }, "Only my projects")
                RosemaryButton("Close", { open = false })
            }
        "dialog" ->
            Column {
                RosemaryButton("Open dialog", { open = true })
                RosemaryDialog(open, "Create project", { open = false }) {
                    RosemaryInput(text, { text = it }, "Project name")
                    Row {
                        RosemaryButton(
                            "Cancel",
                            { open = false },
                            variant = RosemaryButtonVariant.Secondary,
                        )
                        RosemaryButton("Create", { open = false }, enabled = text.isNotBlank())
                    }
                }
            }
        "drawer" ->
            Column {
                RosemaryButton("Open drawer", { open = true })
                RosemaryDrawer(open, "Project settings", { open = false }) {
                    RosemaryInput(text, { text = it }, "Project name")
                    RosemarySwitch(checked, { checked = it }, "Private")
                    RosemaryButton("Close", { open = false })
                }
            }
        "toast" ->
            Column {
                RosemaryButton("Show toast", { toast = true })
                if (toast)
                    RosemaryToast(
                        "Project saved",
                        { toast = false },
                        actionLabel = "Undo",
                        onAction = { toast = false },
                    )
            }
        "alert" ->
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                RosemaryTone.entries.forEach {
                    RosemaryAlert("${it.name}: changes are local to this example", it)
                }
            }
        "card" ->
            RosemaryCard(selected = checked, onClick = { checked = !checked }) {
                RosemaryText("A useful project card", size = 20.sp)
                RosemaryText("Select this card to change its state.")
            }
        "list" ->
            RosemaryList(
                listOf(
                    RosemaryListItem("a", "Rosemary", "Design system"),
                    RosemaryListItem("b", "Studio", "Brand assets"),
                ),
                selected = if (checked) setOf("a") else emptySet(),
                onSelectionChange = { checked = it.contains("a") },
            )
        "table" ->
            RosemaryTable(
                "Projects",
                listOf(
                    RosemaryTableColumn("name", "Name", true),
                    RosemaryTableColumn("status", "Status"),
                ),
                listOf(
                    RosemaryTableRow("a", listOf("Rosemary", "Active")),
                    RosemaryTableRow("b", listOf("Studio", "Draft")),
                ),
                sortColumn = "name",
                ascending = checked,
                onSort = { _, v -> checked = v },
            )
        "badge" ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RosemaryBadge("Draft")
                RosemaryBadge("Active", RosemaryTone.Success)
                RosemaryBadge("3 errors", RosemaryTone.Danger)
            }
        "avatar" ->
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                RosemaryAvatar("Ada Lovelace")
                RosemaryAvatar("Lin Chen", size = 32.dp)
            }
        "empty" ->
            RosemaryEmpty(
                "No projects yet",
                "Create a project to start organizing your work.",
                action = { RosemaryButton("Create project", { text = "Created" }) },
            )
        "skeleton" ->
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                RosemarySkeleton(width = 180.dp)
                RosemarySkeleton(width = 280.dp)
                RosemarySkeleton(width = 240.dp)
            }
        "loading" ->
            Column {
                RosemaryLoading(label = "Importing documents", onCancel = { text = "Cancelled" })
                RosemaryText(text)
            }
        "progress" ->
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                RosemaryProgress(
                    value,
                    label = "Uploading",
                    state = progressState,
                    onCancel = { progressState = RosemaryProgressState.Cancelled },
                    onRetry = { progressState = RosemaryProgressState.Running },
                )
                RosemarySlider(value, { value = it }, "Actual progress")
                RosemaryProgress(null, label = "Connecting", state = progressState)
            }
        "stepper" ->
            RosemaryStepper(
                listOf(
                    RosemaryStep("a", "Details"),
                    RosemaryStep("b", "Review"),
                    RosemaryStep("c", "Complete", "unavailable", false),
                ),
                option,
                onStepChange = { option = it },
            )
    }
}
