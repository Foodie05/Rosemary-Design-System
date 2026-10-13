package design.rosemary.compose

import androidx.compose.runtime.*

enum class RosemaryLanguage {
    English,
    Chinese,
}

/** Host can replace every internal message; component labels remain host supplied. */
fun interface RosemaryStrings {
    fun text(english: String): String
}

private val chinese =
    mapOf(
        "{value} of {max}" to "已完成 {value}，共 {max}",
        "Paused" to "已暂停",
        "Sorted ascending" to "升序排列",
        "Sorted descending" to "降序排列",
        "Page {page} of {pages}" to "第 {page} 页，共 {pages} 页",
        "Running" to "运行中",
        "Idle" to "空闲",
        "Completed" to "已完成",
        "Cancelled" to "已取消",
        "Error" to "出错",
        "Timeout" to "已超时",
        "Mon" to "一",
        "Tue" to "二",
        "Wed" to "三",
        "Thu" to "四",
        "Fri" to "五",
        "Sat" to "六",
        "Sun" to "日",
        "Choose…" to "请选择…",
        "Busy" to "处理中",
        "Pressed" to "已按下",
        "Not pressed" to "未按下",
        "Current page" to "当前页",
        "Expanded" to "已展开",
        "Collapsed" to "已收起",
        "Clear" to "清除",
        "Search" to "搜索",
        "Choose time" to "选择时间",
        "Choose date" to "选择日期",
        "Date picker" to "日期选择器",
        "Date (YYYY-MM-DD)" to "日期 (YYYY-MM-DD)",
        "End date (YYYY-MM-DD)" to "结束日期 (YYYY-MM-DD)",
        "Enter a valid date from 0001 to 9999" to "请输入 0001 至 9999 年的有效日期",
        "End must be on or after start" to "结束日期不能早于开始日期",
        "Year" to "年",
        "Month" to "月",
        "Year must be 1–9999" to "年份须为 1–9999",
        "Previous month" to "上个月",
        "Next month" to "下个月",
        "Previous years" to "上一组年份",
        "Next years" to "下一组年份",
        "Time (HH:mm)" to "时间 (HH:mm)",
        "Enter 00:00–23:59" to "请输入 00:00–23:59",
        "Hours" to "小时",
        "Minutes" to "分钟",
        "Cancel" to "取消",
        "Apply" to "确定",
        "Choose files" to "选择文件",
        "Retry" to "重试",
        "Remove" to "移除",
        "Previous" to "上一页",
        "Next" to "下一页",
        "Actions" to "操作",
        "Current step" to "当前步骤",
        "Dismiss" to "关闭",
        "In progress" to "进行中",
        "Indeterminate" to "进度未知",
        "Loading" to "加载中",
        "Loading content" to "正在加载内容",
    )
internal val LocalRosemaryStrings =
    staticCompositionLocalOf<RosemaryStrings> { RosemaryStrings { it } }

@Composable internal fun rString(key: String): String = LocalRosemaryStrings.current.text(key)

internal fun defaultStrings(language: RosemaryLanguage) = RosemaryStrings {
    if (language == RosemaryLanguage.Chinese) chinese[it] ?: it else it
}
