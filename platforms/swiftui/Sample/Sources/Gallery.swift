import RosemaryUI
import SwiftUI

struct Gallery: View {
  static let ids = [
    "button", "icon-button", "button-group", "split-button", "link-button",
    "floating-action-button", "text-field", "text-area", "password-field", "search-field",
    "number-field", "checkbox", "radio", "switch", "slider", "select", "combo-box", "date-picker",
    "time-picker", "file-upload", "color-picker", "tabs", "segmented-control", "breadcrumb",
    "sidebar", "top-navigation", "bottom-navigation", "pagination", "stepper", "command-palette",
    "table", "data-grid", "list", "description-list", "tree-view", "badge", "tag", "avatar",
    "dialog", "alert-dialog", "sheet", "toast", "snackbar", "banner", "progress", "skeleton",
    "spinner", "tooltip", "popover", "dropdown-menu", "context-menu", "drawer", "card", "accordion",
    "divider", "empty-state", "scroll-area", "resizable-panels", "metric-card", "prober-status",
    "file-row",
  ]
  @StateObject private var toast = RosemaryToastState()
  @State var id = "button"
  @State var text = "Rosemary Notes"
  @State var status = "等待操作"
  @State var selected: String? = "a"
  @State var navigation = "a"
  @State var checked = false
  @State var expanded = false
  @State var modal = false
  @State var modalSession: RosemaryModalSession?
  @State var drawer = false
  @State var number = 50.0
  @State var index = 0
  @State var fraction = 0.5
  @State var date = Date()
  @State var selection: Set<String> = []
  @State var treeOpen: Set<String> = []
  @State var files: [RosemaryItem] = []
  @State var rows = [
    RosemaryRecord("row-a", ["name": "项目 A", "size": "184 KB"]),
    RosemaryRecord("row-b", ["name": "项目 B", "size": "92 KB"]),
  ]
  init(initialId: String = "button") { _id = State(initialValue: initialId) }
  let items = [
    RosemaryItem("a", "设计规范", detail: "本地文档"), RosemaryItem("b", "交互笔记", detail: "团队文档"),
    RosemaryItem("disabled", "归档", enabled: false),
  ]
  var options: [RosemaryOption<String>] {
    items.map { RosemaryOption($0.id, $0.label, enabled: $0.enabled) }
  }
  var actions: [RosemaryAction] {
    [
      RosemaryAction("save", "保存", action: { status = "已保存" }),
      RosemaryAction("disabled", "禁用操作", action: nil),
      RosemaryAction("reset", "重置", action: { status = "已重置" }),
    ]
  }
  var columns: [RosemaryColumn] {
    [RosemaryColumn("name", "项目名称", editable: true), RosemaryColumn("size", "大小")]
  }
  var body: some View {
    RosemaryToastHost(state: toast) {
      ScrollView {
        VStack(alignment: .leading, spacing: 24) {
          Picker("组件", selection: $id) { ForEach(Self.ids, id: \.self) { Text($0).tag($0) } }
            .pickerStyle(.menu)
          sample()
          Text(status)
        }.padding(16)
      }
    }.navigationTitle("组件预览 · \(id)").onChange(of: id) { _ in
      index = 0
      modal = false
    }.sheet(isPresented: $modal) {
      RosemarySheet("项目设置", onClose: { modal = false }) { RosemaryTextField("草稿", value: $text) }
    }.rosemaryModal(
      session: $modalSession, title: "项目设置",
      onClose: { _, reason in status = "关闭方式：\(reason.rawValue)" }
    ) { RosemaryTextField("草稿", value: $text) }
    .rosemaryAlertDialog("清空草稿？", isPresented: $expanded, message: "确认后清空。", confirmLabel: "清空") {
      text = ""
    }
  }
  func sample() -> AnyView {
    switch id {
    case "button": return AnyView(RosemaryButton("保存") { status = "已保存" })
    case "icon-button":
      return AnyView(RosemaryIconButton("新建项目", systemImage: "plus") { status = "已创建" })
    case "button-group": return AnyView(RosemaryButtonGroup(actions))
    case "split-button": return AnyView(RosemarySplitButton(actions[0], actions: actions))
    case "link-button":
      return AnyView(
        RosemaryLinkButton("打开设计指南", url: URL(string: "https://design.rosemaryis.cc/#/overview")!))
    case "floating-action-button":
      return AnyView(RosemaryFloatingActionButton("新建", systemImage: "plus") { status = "已创建" })
    case "text-field": return AnyView(RosemaryTextField("项目名称", value: $text))
    case "text-area": return AnyView(RosemaryTextArea("项目笔记", value: $text))
    case "password-field": return AnyView(RosemaryPasswordField("密码", value: $text))
    case "search-field": return AnyView(RosemarySearchField(value: $text))
    case "number-field": return AnyView(RosemaryNumberField("数量", value: $number))
    case "checkbox": return AnyView(RosemaryCheckbox("通知我", value: $checked))
    case "radio": return AnyView(RosemaryRadio("分类", value: $selected, options: options))
    case "switch": return AnyView(RosemarySwitch("自动同步", value: $checked))
    case "slider": return AnyView(RosemarySlider("强度", value: $number))
    case "select": return AnyView(RosemarySelect("分类", value: $selected, options: options))
    case "combo-box":
      return AnyView(
        RosemaryComboBox("搜索分类", query: $text, options: options) { value in
          selected = value
          text = options.first { $0.value == value }?.label ?? ""
        })
    case "date-picker":
      return AnyView(
        RosemaryDatePicker(
          "日期", value: $date,
          range: Date(
            timeIntervalSince1970: 1_577_836_800)...Date(timeIntervalSince1970: 1_893_456_000)))
    case "time-picker": return AnyView(RosemaryTimePicker("时间", value: $date))
    case "file-upload":
      return AnyView(
        RosemaryFileUpload(
          "项目文件", files: files,
          onSelected: { result in
            switch result {
            case .success(let urls):
              files += urls.map { RosemaryItem($0.absoluteString, $0.lastPathComponent) }
            case .failure: status = "选择失败，请重试"
            }
          }, onRemove: { id in files.removeAll { $0.id == id } }))
    case "color-picker":
      return AnyView(
        RosemaryColorPicker(
          "颜色", value: Binding(get: { checked ? .green : .blue }, set: { checked = $0 == .green })))
    case "tabs":
      return AnyView(
        RosemaryTabs(["编辑", "状态"], value: Binding(get: { index % 2 }, set: { index = $0 })) {
          value in if value == 0 { RosemaryTextField("草稿", value: $text) } else { Text(status) }
        })
    case "segmented-control":
      return AnyView(RosemarySegmentedControl("分类", value: $navigation, options: options))
    case "breadcrumb":
      return AnyView(
        RosemaryBreadcrumb(
          [RosemaryAction("home", "首页", action: { id = "button" })], current: "项目详情"))
    case "sidebar": return AnyView(RosemarySidebar(items, value: $navigation).frame(height: 300))
    case "top-navigation": return AnyView(RosemaryTopNavigation("项目", actions: actions))
    case "bottom-navigation":
      return AnyView(
        RosemaryBottomNavigation(items, value: $navigation) { id in Text("\(id) 项目详情") }.frame(
          height: 300))
    case "pagination": return AnyView(RosemaryPagination(page: index % 3, count: 3) { index = $0 })
    case "stepper":
      return AnyView(
        RosemaryStepper(
          ["项目", "成员", "确认"], value: Binding(get: { index % 3 }, set: { index = $0 })
        ) { _ in RosemaryTextField("草稿", value: $text) })
    case "command-palette":
      return AnyView(
        RosemaryButton("搜索命令") { modal = true }.sheet(isPresented: $modal) {
          RosemaryCommandPalette(actions, onClose: { modal = false })
        })
    case "table":
      return AnyView(
        RosemaryTable(columns: columns, rows: rows, onSort: { _, _ in rows.reverse() }))
    case "data-grid":
      return AnyView(
        RosemaryDataGrid(columns: columns, rows: rows, selected: $selection) { row, col, value in
          rows = rows.map { record in
            RosemaryRecord(
              record.id,
              record.id == row
                ? record.cells.merging([col: value], uniquingKeysWith: { $1 }) : record.cells)
          }
        })
    case "list":
      return AnyView(RosemaryList(items, selected: navigation, onActivate: { navigation = $0 }))
    case "description-list":
      return AnyView(
        RosemaryDescriptionList([
          RosemaryItem("project", "项目", detail: "Rosemary"),
          RosemaryItem("version", "版本", detail: "本地预览"),
        ]))
    case "tree-view":
      return AnyView(
        RosemaryTreeView(
          [RosemaryTreeNode("root", "项目", children: [RosemaryTreeNode("child", "笔记")])],
          expanded: $treeOpen, selected: $selected))
    case "badge": return AnyView(RosemaryBadge("Beta 待验收"))
    case "tag":
      return AnyView(
        RosemaryTag(
          "团队", selected: checked, onSelected: { checked = $0 }, onRemove: { status = "已移除标签" }))
    case "avatar": return AnyView(RosemaryAvatar("Rosemary 团队", initials: "RI"))
    case "dialog", "sheet": return AnyView(RosemaryButton("打开") { modal = true })
    case "alert-dialog": return AnyView(RosemaryButton("打开确认") { expanded = true })
    case "toast": return AnyView(RosemaryButton("显示通知") { toast.show("草稿已保存") })
    case "snackbar":
      return AnyView(
        RosemarySnackbar(
          "项目已移除", action: RosemaryAction("undo", "撤销", action: { status = "已恢复" }),
          onDismiss: { status = "通知已关闭" }))
    case "banner": return AnyView(RosemaryBanner("离线", message: "草稿已保留", actions: actions))
    case "progress": return AnyView(RosemaryProgress("导出", value: number / 100))
    case "skeleton": return AnyView(RosemarySkeleton())
    case "spinner": return AnyView(RosemarySpinner())
    case "tooltip":
      return AnyView(RosemaryTooltip("保存当前草稿") { RosemaryButton("保存") { status = "已保存" } })
    case "popover": return AnyView(RosemaryPopover("项目详情") { Text(status) })
    case "dropdown-menu": return AnyView(RosemaryDropdownMenu("操作", actions: actions))
    case "context-menu": return AnyView(RosemaryContextMenu(actions) { Text("长按查看操作") })
    case "drawer":
      return AnyView(
        RosemaryDrawer("项目", items: items, value: $navigation, open: $drawer) {
          RosemaryButton("打开导航") { drawer = true }
        })
    case "card": return AnyView(RosemaryCard { Text("项目说明") })
    case "accordion":
      return AnyView(
        RosemaryAccordion("更多设置", expanded: $checked) { RosemaryTextField("草稿", value: $text) })
    case "divider":
      return AnyView(
        VStack {
          Text("项目")
          RosemaryDivider()
          Text("成员")
        })
    case "empty-state":
      return AnyView(
        RosemaryEmptyState("暂无项目", message: "创建一个项目开始。") { RosemaryButton("新建") { status = "已创建" } }
      )
    case "scroll-area":
      return AnyView(
        RosemaryScrollArea {
          VStack { ForEach(0..<30, id: \.self) { Text("项目 \($0)").padding(16) } }
        }.frame(height: 240))
    case "resizable-panels":
      return AnyView(
        RosemaryResizablePanels(
          fraction: $fraction, leading: { Text("项目列表") }, trailing: { Text("项目详情") }
        ).frame(height: 300))
    case "metric-card":
      return AnyView(
        RosemaryMetricCard(
          "项目数量", value: "24", detail: "比上周增加 3", series: [18, 19, 17, 22, 21, 24],
          trend: "一周增加 3 个项目"))
    case "prober-status":
      return AnyView(RosemaryProberStatus("同步服务", state: "离线 · 草稿已保留", recovery: actions[0]))
    case "file-row":
      return AnyView(
        RosemaryFileRow(
          items[0], selected: $checked, actions: actions,
          metadata: RosemaryFileMetadata(kind: "文档", size: "184 KB", sync: "已同步"),
          onOpen: { status = "已打开设计规范" }))
    default: preconditionFailure("Missing preview: \(id)")
    }
  }
}
