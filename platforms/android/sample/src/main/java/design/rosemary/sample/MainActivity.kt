package design.rosemary.sample

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp
import design.rosemary.compose.*
import kotlinx.coroutines.delay

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent { RosemaryTheme { Surface { SampleRoot() } } }
    }
}

@Composable
fun ProjectEditor() {
    var name by rememberSaveable { mutableStateOf("Rosemary Notes") }
    var notes by rememberSaveable { mutableStateOf("") }
    var category by rememberSaveable { mutableStateOf("personal") }
    var sync by rememberSaveable { mutableStateOf(true) }
    var consent by rememberSaveable { mutableStateOf(false) }
    var tab by rememberSaveable { mutableIntStateOf(0) }
    var progress by rememberSaveable { mutableFloatStateOf(0f) }
    var status by rememberSaveable { mutableStateOf("更改保存在本地草稿中") }
    var busy by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var failNext by rememberSaveable { mutableStateOf(true) }
    var confirm by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) { if (!busy && status == "正在保存") status = "保存已中断，草稿已保留" }
    LaunchedEffect(busy) {
        if (busy) {
            delay(600)
            progress = if (failNext) .5f else 1f
            status = if (failNext) "保存失败，草稿已保留，请重试" else "已保存"
            failNext = false
            busy = false
        }
    }
    Column(
        Modifier.safeDrawingPadding()
            .imePadding()
            .verticalScroll(rememberScrollState())
            .padding(24.dp),
    ) {
        Text("Rosemary SDK · 本地预览", style = MaterialTheme.typography.headlineSmall)
        Spacer(Modifier.height(24.dp))
        RosemaryTabs(listOf("编辑", "状态"), tab, { tab = it }) { page ->
            if (page == 0)
                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    RosemaryTextField(
                        name,
                        {
                            name = it
                            error = null
                        },
                        "项目名称",
                        Modifier.fillMaxWidth(),
                        enabled = !busy,
                        error = error,
                    )
                    RosemaryTextArea(
                        notes,
                        { notes = it },
                        "项目笔记",
                        Modifier.fillMaxWidth(),
                        enabled = !busy,
                    )
                    RosemarySelect(
                        "分类",
                        category,
                        listOf(
                            RosemaryOption("personal", "个人"),
                            RosemaryOption("team", "团队"),
                            RosemaryOption("locked", "归档", false),
                        ),
                        { category = it },
                        enabled = !busy,
                    )
                    RosemarySwitch("自动同步", sync, { sync = it }, enabled = !busy)
                    RosemaryCheckbox(
                        "保存前通知我",
                        if (consent) ToggleableState.On else ToggleableState.Off,
                        { consent = !consent },
                        enabled = !busy,
                    )
                    RosemarySlider("备份预览", progress * 100, { progress = it / 100 }, enabled = !busy)
                    RosemaryProgress("保存进度", progress)
                    RosemaryButton(
                        if (failNext) "保存项目" else "重试保存",
                        {
                            if (name.isBlank()) error = "请输入项目名称"
                            else {
                                busy = true
                                progress = .5f
                                status = "正在保存"
                            }
                        },
                        busy = busy,
                    )
                    Text(status)
                }
            else
                RosemaryEmptyState(
                    "暂时没有记录",
                    "保存后的项目会显示在这里。",
                    action = { RosemaryButton("清空草稿", { confirm = true }, enabled = !busy) },
                )
        }
    }
    if (confirm)
        RosemaryAlertDialog(
            "清空草稿？",
            "项目名称和笔记将被清空。",
            "清空草稿",
            {
                name = ""
                notes = ""
                confirm = false
            },
            { confirm = false },
        )
}

@Composable
fun SampleRoot() {
    var gallery by rememberSaveable { mutableStateOf(false) }
    Column {
        TextButton(onClick = { gallery = !gallery }) { Text(if (gallery) "返回项目编辑" else "全部组件") }
        if (gallery) Gallery() else ProjectEditor()
    }
}
