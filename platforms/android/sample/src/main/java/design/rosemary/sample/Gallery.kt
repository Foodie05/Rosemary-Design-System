package design.rosemary.sample

import android.provider.OpenableColumns
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.vector.*
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp
import design.rosemary.compose.*

val rosemaryGalleryIds =
    listOf(
        "button",
        "icon-button",
        "button-group",
        "split-button",
        "link-button",
        "floating-action-button",
        "text-field",
        "text-area",
        "password-field",
        "search-field",
        "number-field",
        "checkbox",
        "radio",
        "switch",
        "slider",
        "select",
        "combo-box",
        "date-picker",
        "time-picker",
        "file-upload",
        "color-picker",
        "tabs",
        "segmented-control",
        "breadcrumb",
        "sidebar",
        "top-navigation",
        "bottom-navigation",
        "pagination",
        "stepper",
        "command-palette",
        "table",
        "data-grid",
        "list",
        "description-list",
        "tree-view",
        "badge",
        "tag",
        "avatar",
        "dialog",
        "alert-dialog",
        "sheet",
        "toast",
        "snackbar",
        "banner",
        "progress",
        "skeleton",
        "spinner",
        "tooltip",
        "popover",
        "dropdown-menu",
        "context-menu",
        "drawer",
        "card",
        "accordion",
        "divider",
        "empty-state",
        "scroll-area",
        "resizable-panels",
        "metric-card",
        "prober-status",
        "file-row",
    )

@Composable
fun Gallery(initialId: String = "button") {
    var id by rememberSaveable { mutableStateOf(initialId) }
    var text by rememberSaveable { mutableStateOf("Rosemary Notes") }
    var choice by rememberSaveable { mutableStateOf("a") }
    var checked by rememberSaveable { mutableStateOf(false) }
    var expanded by rememberSaveable { mutableStateOf(false) }
    var number by rememberSaveable { mutableDoubleStateOf(50.0) }
    var index by rememberSaveable { mutableIntStateOf(0) }
    var fraction by rememberSaveable { mutableFloatStateOf(.5f) }
    var status by rememberSaveable { mutableStateOf("等待操作") }
    var modal by remember { mutableStateOf(false) }
    var date by rememberSaveable { mutableStateOf<Long?>(1791590400000) }
    var hour by rememberSaveable { mutableIntStateOf(9) }
    var minute by rememberSaveable { mutableIntStateOf(30) }
    var selection by remember { mutableStateOf(setOf<String>()) }
    var treeOpen by remember { mutableStateOf(setOf<String>()) }
    var rows by remember {
        mutableStateOf(
            listOf(
                RosemaryRecord("row-a", mapOf("name" to "项目 A", "size" to "184 KB")),
                RosemaryRecord("row-b", mapOf("name" to "项目 B", "size" to "92 KB")),
            ),
        )
    }
    var sessionId by remember { mutableStateOf("") }
    var files by remember { mutableStateOf(listOf<RosemaryItem>()) }
    val toast = remember { RosemaryToastState() }
    var detail by rememberSaveable { mutableStateOf(false) }
    val context = LocalContext.current
    val picker =
        rememberLauncherForActivityResult(ActivityResultContracts.OpenMultipleDocuments()) { uris ->
            files =
                (files +
                        uris.map { uri ->
                            val name =
                                context.contentResolver
                                    .query(
                                        uri,
                                        arrayOf(OpenableColumns.DISPLAY_NAME),
                                        null,
                                        null,
                                        null,
                                    )
                                    ?.use { c -> if (c.moveToFirst()) c.getString(0) else "文件" }
                                    ?: "文件"
                            RosemaryItem(uri.toString(), name)
                        })
                    .distinctBy { it.id }
        }
    val items =
        listOf(
            RosemaryItem("a", "设计规范", detail = "本地文档"),
            RosemaryItem("b", "交互笔记", detail = "团队文档"),
            RosemaryItem("disabled", "归档", enabled = false),
        )
    val options = items.map { RosemaryOption(it.id, it.label, it.enabled) }
    val actions =
        listOf(
            RosemaryAction("save", "保存", { status = "已保存" }),
            RosemaryAction("disabled", "禁用操作", null),
            RosemaryAction("reset", "重置", { status = "已重置" }),
        )
    val columns = listOf(RosemaryColumn("name", "项目名称", true), RosemaryColumn("size", "大小"))
    val icon = remember {
        ImageVector.Builder("Add", 24.dp, 24.dp, 24f, 24f)
            .apply {
                path(stroke = SolidColor(Color.Black), strokeLineWidth = 1.75f) {
                    moveTo(12f, 4f)
                    lineTo(12f, 20f)
                    moveTo(4f, 12f)
                    lineTo(20f, 12f)
                }
            }
            .build()
    }
    RosemaryToastHost(toast, Modifier.fillMaxSize()) {
        Column(
            Modifier.safeDrawingPadding()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
        ) {
            Text("组件预览 · $id", style = MaterialTheme.typography.titleLarge)
            RosemarySelect(
                "组件",
                id,
                rosemaryGalleryIds.map { RosemaryOption(it, it) },
                {
                    id = it
                    modal = false
                    index = 0
                },
            )
            if (detail) {
                Text("项目详情")
                RosemaryButton("返回组件预览", { detail = false })
            } else
                when (id) {
                    "button" -> RosemaryButton("保存", { status = "已保存" })
                    "icon-button" -> RosemaryIconButton("新建项目", icon, { status = "已新建" })
                    "button-group" -> RosemaryButtonGroup(actions)
                    "split-button" -> RosemarySplitButton(actions.first(), actions)
                    "link-button" -> RosemaryLinkButton("打开本地详情", { detail = true })
                    "floating-action-button" ->
                        RosemaryFloatingActionButton("新建", icon, { status = "已新建" })
                    "text-field" -> RosemaryTextField(text, { text = it }, "项目名称")
                    "text-area" -> RosemaryTextArea(text, { text = it }, "项目笔记")
                    "password-field" -> RosemaryPasswordField(text, { text = it }, "密码")
                    "search-field" -> RosemarySearchField(text, { text = it })
                    "number-field" -> RosemaryNumberField("数量", number, { number = it })
                    "checkbox" ->
                        RosemaryCheckbox(
                            "通知我",
                            if (checked) ToggleableState.On else ToggleableState.Off,
                            { checked = !checked },
                        )
                    "radio" -> RosemaryRadio("分类", choice, options, { choice = it })
                    "switch" -> RosemarySwitch("自动同步", checked, { checked = it })
                    "slider" -> RosemarySlider("强度", number.toFloat(), { number = it.toDouble() })
                    "select" -> RosemarySelect("分类", choice, options, { choice = it })
                    "combo-box" ->
                        RosemaryComboBox(
                            text,
                            { text = it },
                            "搜索分类",
                            options,
                            {
                                choice = it
                                text = options.first { o -> o.value == it }.label
                            },
                        )
                    "date-picker" -> RosemaryDatePicker("日期", date, { date = it })
                    "time-picker" ->
                        RosemaryTimePicker(
                            "时间",
                            hour,
                            minute,
                            { h, m ->
                                hour = h
                                minute = m
                            },
                        )
                    "file-upload" ->
                        RosemaryFileUpload(
                            "项目文件",
                            files,
                            { picker.launch(arrayOf("*/*")) },
                            { file -> files = files.filter { it.id != file } },
                        )
                    "color-picker" ->
                        RosemaryColorPicker(
                            "颜色",
                            if (checked) Color.Green else Color.Blue,
                            mapOf("松绿" to Color.Green, "蓝色" to Color.Blue),
                            { checked = it == Color.Green },
                        )
                    "tabs" ->
                        RosemaryTabs(listOf("编辑", "状态"), index % 2, { index = it }) {
                            if (it == 0) RosemaryTextField(text, { text = it }, "草稿")
                            else Text(status)
                        }
                    "segmented-control" ->
                        RosemarySegmentedControl(choice, options, { choice = it })
                    "breadcrumb" ->
                        RosemaryBreadcrumb(
                            listOf(
                                RosemaryAction(
                                    "home",
                                    "组件预览",
                                    {
                                        id = "button"
                                        detail = false
                                    },
                                ),
                            ),
                            "项目详情",
                        )
                    "sidebar" -> RosemarySidebar(items, choice, { choice = it })
                    "top-navigation" -> RosemaryTopNavigation("项目", actions = actions)
                    "bottom-navigation" -> RosemaryBottomNavigation(items, choice, { choice = it })
                    "pagination" -> RosemaryPagination(index % 3, 3, { index = it })
                    "stepper" ->
                        RosemaryStepper(listOf("项目", "成员", "确认"), index % 3, { index = it }) {
                            RosemaryTextField(text, { text = it }, "草稿")
                        }
                    "command-palette" -> {
                        RosemaryButton("搜索命令", { modal = true })
                        if (modal)
                            androidx.compose.ui.window.Dialog(
                                onDismissRequest = { modal = false },
                            ) {
                                Surface { RosemaryCommandPalette(actions, { modal = false }) }
                            }
                    }
                    "table" ->
                        RosemaryTable(columns, rows, onSort = { _, _ -> rows = rows.reversed() })
                    "data-grid" ->
                        RosemaryDataGrid(
                            columns,
                            rows,
                            selection,
                            { selection = it },
                            { row, col, value ->
                                rows = rows.map {
                                    if (it.id == row)
                                        RosemaryRecord(it.id, it.cells + mapOf(col to value))
                                    else it
                                }
                            },
                        )
                    "list" -> RosemaryList(items, choice, { choice = it })
                    "description-list" ->
                        RosemaryDescriptionList(mapOf("项目" to "Rosemary", "版本" to "本地预览"))
                    "tree-view" ->
                        RosemaryTreeView(
                            listOf(
                                RosemaryTreeNode(
                                    "root",
                                    "项目",
                                    listOf(RosemaryTreeNode("child", "笔记")),
                                ),
                            ),
                            treeOpen,
                            choice,
                            { treeOpen = it },
                            { choice = it },
                        )
                    "badge" -> RosemaryBadge("Beta 待验收")
                    "tag" -> RosemaryTag("团队", checked, { checked = it }, { status = "标签已移除" })
                    "avatar" -> RosemaryAvatar("Rosemary 团队", "RI")
                    "dialog",
                    "alert-dialog",
                    "sheet" -> {
                        RosemaryButton(
                            "打开",
                            {
                                sessionId = java.util.UUID.randomUUID().toString()
                                modal = true
                            },
                        )
                        if (modal) {
                            when (id) {
                                "sheet" ->
                                    RosemarySheet("详情", { modal = false }) {
                                        RosemaryTextField(text, { text = it }, "草稿")
                                    }
                                "alert-dialog" ->
                                    RosemaryAlertDialog(
                                        "清空草稿？",
                                        "确认后清空。",
                                        "清空",
                                        {
                                            text = ""
                                            modal = false
                                        },
                                        { modal = false },
                                    )
                                else ->
                                    RosemaryModal(
                                        sessionId,
                                        "项目设置",
                                        { reason ->
                                            modal = false
                                            status = "关闭方式：$reason"
                                        },
                                    ) {
                                        RosemaryTextField(text, { text = it }, "草稿")
                                    }
                            }
                        }
                    }
                    "toast" -> RosemaryButton("显示通知", { toast.show("草稿已保存") })
                    "snackbar" ->
                        RosemarySnackbar(
                            "项目已移除",
                            RosemaryAction("undo", "撤销", { status = "已恢复" }),
                            { status = "通知已关闭" },
                        )
                    "banner" -> RosemaryBanner("离线", "草稿已保留", actions)
                    "progress" -> RosemaryProgress("导出", number.toFloat() / 100)
                    "skeleton" -> RosemarySkeleton()
                    "spinner" -> RosemarySpinner("正在加载", Modifier.size(24.dp))
                    "tooltip" ->
                        RosemaryTooltip("保存当前草稿") { RosemaryButton("保存", { status = "已保存" }) }
                    "popover" -> RosemaryPopover("项目详情") { Text(status) }
                    "dropdown-menu" -> RosemaryDropdownMenu("操作", actions)
                    "context-menu" -> RosemaryContextMenu(actions) { Text("长按查看操作") }
                    "drawer" -> {
                        RosemaryButton("打开导航", { modal = true })
                        RosemaryDrawer(
                            "项目",
                            items,
                            choice,
                            { choice = it },
                            modal,
                            { modal = false },
                        ) {
                            Text("项目详情")
                        }
                    }
                    "card" -> RosemaryCard { Text("项目说明") }
                    "accordion" ->
                        RosemaryAccordion("更多设置", expanded, { expanded = it }) {
                            RosemaryTextField(text, { text = it }, "草稿")
                        }
                    "divider" -> {
                        Text("项目")
                        RosemaryDivider()
                        Text("成员")
                    }
                    "empty-state" ->
                        RosemaryEmptyState(
                            "暂无项目",
                            "创建一个项目开始。",
                            action = { RosemaryButton("新建", { status = "已创建" }) },
                        )
                    "scroll-area" ->
                        Box(Modifier.height(240.dp)) {
                            RosemaryScrollArea {
                                repeat(30) { Text("项目 $it", Modifier.padding(16.dp)) }
                            }
                        }
                    "resizable-panels" ->
                        RosemaryResizablePanels(
                            fraction,
                            { fraction = it },
                            { Text("项目列表") },
                            { Text("项目详情") },
                        )
                    "metric-card" ->
                        RosemaryMetricCard(
                            "项目数量",
                            "24",
                            "比上周增加 3",
                            listOf(18.0, 19.0, 17.0, 22.0, 21.0, 24.0),
                            "一周增加 3 个项目",
                        )
                    "prober-status" ->
                        RosemaryProberStatus(
                            "同步服务",
                            "离线 · 草稿已保留",
                            actions.first(),
                            RosemaryHealth.Offline,
                            checkedAtMillis = 1791590400000,
                        )
                    "file-row" ->
                        RosemaryFileRow(
                            items.first(),
                            checked,
                            { checked = it },
                            actions,
                            RosemaryFileMetadata("文档", "184 KB", "已同步"),
                            { detail = true },
                        )
                    else -> error("Missing gallery: $id")
                }
            Text(status)
        }
    }
}
