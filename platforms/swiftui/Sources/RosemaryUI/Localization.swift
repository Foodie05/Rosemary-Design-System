import SwiftUI

/// Override any built-in accessibility/status string without replacing consumer labels.
public struct RosemaryStrings {
  public let overrides: [String: String]
  public init(_ overrides: [String: String] = [:]) { self.overrides = overrides }
  public static let chinese: [String: String] = [
    "Read only": "只读", "Visited": "已访问", "Indeterminate": "进度未知", "Remove": "移除", "Retry": "重试",
    "Uploading": "上传中", "selected": "已选择",
    "uploading": "上传中",
    "uploaded": "已上传", "failed": "失败", "cancelled": "已取消", "Loading": "加载中", "Stopped": "已停止",
    "Checked": "已选中", "Unchecked": "未选中", "Mixed": "部分选中", "Selected": "已选中", "Not selected": "未选中",
    "On": "开启", "Off": "关闭", "Expanded": "已展开", "Collapsed": "已收起", "Current page": "当前页面",
    "Breadcrumb": "面包屑导航", "Previous page": "上一页", "Next page": "下一页", "Previous month": "上个月",
    "Next month": "下个月", "Unsorted": "未排序", "Ascending": "升序", "Descending": "降序", "Dismiss": "关闭",
    "Close": "关闭", "Clear": "清除", "Choose": "选择", "Show explanation": "显示说明", "Cancel": "取消",
    "Apply": "应用", "Apply range": "应用区间", "Start": "开始日期", "End": "结束日期", "Hour": "小时",
    "Minute": "分钟", "Go to year": "跳转到年份", "Year 1–9999": "年份 1–9999",
    "Year must be 1–9999": "年份必须介于 1–9999",
    "Use YYYY-MM-DD within the permitted range": "请以 YYYY-MM-DD 输入范围内的日期",
    "Gregorian local date, YYYY-MM-DD": "公历本地日期，格式 YYYY-MM-DD",
    "Use HH:mm, 00:00–23:59": "请以 HH:mm 输入 00:00–23:59 的时间",
    "End must be on or after start": "结束日期不能早于开始日期", "Sun": "日", "Mon": "一", "Tue": "二", "Wed": "三",
    "Thu": "四", "Fri": "五", "Sat": "六", "upcoming": "待开始", "current": "当前步骤", "complete": "已完成",
    "error": "错误", "unavailable": "不可进入", "Month %d": "%d 月", "Year %@": "%@ 年",
    "Step %d of %d, %@": "第 %d 步，共 %d 步，%@", "Page %d of %d": "第 %d 页，共 %d 页",
    "%d percent, %@ of %@": "%d%%，已完成 %@，总计 %@",
  ]
}
private struct StringsKey: EnvironmentKey { static let defaultValue = RosemaryStrings() }
extension EnvironmentValues {
  public var rosemaryStrings: RosemaryStrings {
    get { self[StringsKey.self] }
    set { self[StringsKey.self] = newValue }
  }
}
extension View {
  public func rosemaryStrings(_ strings: RosemaryStrings) -> some View {
    environment(\.rosemaryStrings, strings)
  }
}
extension RosemaryPalette {
  func text(_ key: String) -> String {
    strings.overrides[key]
      ?? (locale.language.languageCode?.identifier == "zh"
        ? RosemaryStrings.chinese[key] ?? key : key)
  }
  func format(_ key: String, _ args: CVarArg...) -> String {
    String(format: text(key), locale: locale, arguments: args)
  }
}
