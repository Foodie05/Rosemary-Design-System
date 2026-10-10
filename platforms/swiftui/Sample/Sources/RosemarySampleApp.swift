import RosemaryUI
import SwiftUI

@main struct RosemarySampleApp: App {
  var body: some Scene { WindowGroup { SampleRoot().rosemaryTheme() } }
}
private struct SampleRoot: View {
  let args = ProcessInfo.processInfo.arguments
  var gallery: String? {
    guard let i = args.firstIndex(of: "--gallery"), args.indices.contains(i + 1),
      Gallery.ids.contains(args[i + 1])
    else { return nil }
    return args[i + 1]
  }
  @Environment(\.layoutDirection) private var direction
  @Environment(\.sizeCategory) private var category
  var body: some View {
    Group {
      if let gallery {
        NavigationView { Gallery(initialId: gallery) }.navigationViewStyle(.stack)
      } else {
        ProjectEditor()
      }
    }
    .environment(\.layoutDirection, args.contains("--rtl") ? .rightToLeft : direction)
    .environment(
      \.sizeCategory, args.contains("--large") ? .accessibilityExtraExtraExtraLarge : category
    )
    .preferredColorScheme(args.contains("--dark") ? .dark : args.contains("--light") ? .light : nil)
  }
}
struct ProjectEditor: View {
  @State private var draft = ProjectDraft()
  @State private var notes = ""
  @State private var category: String? = "personal"
  @State private var sync = true
  @State private var consent = false
  @State private var editing = false
  @State private var confirm = false
  @State private var failNext = true
  @State private var editName = ""
  @State private var status = "更改保存在本地草稿中"
  @State private var tab = 0
  @State private var progress = 0.0
  var body: some View {
    NavigationView {
      ScrollView {
        VStack(alignment: .leading, spacing: 24) {
          RosemaryTabs(["编辑", "状态"], value: $tab) { i in
            if i == 0 {
              VStack(alignment: .leading, spacing: 16) {
                RosemaryTextField("项目名称", value: $draft.name, error: draft.error)
                RosemaryTextArea("项目笔记", value: $notes)
                RosemarySelect(
                  "分类", value: $category,
                  options: [
                    RosemaryOption("personal", "个人"), RosemaryOption("team", "团队"),
                    RosemaryOption("locked", "归档", enabled: false),
                  ])
                RosemarySwitch("自动同步", value: $sync)
                RosemaryCheckbox("保存前通知我", value: $consent)
                RosemarySlider("备份预览", value: $progress, range: 0...1)
                RosemaryProgress("保存进度", value: progress)
                RosemaryButton(failNext ? "保存项目" : "重试保存", busy: draft.busy) {
                  guard draft.beginSave(), let operation = draft.saveOperation else { return }
                  let success = !failNext
                  status = "正在保存"
                  progress = 0.5
                  Task { @MainActor in
                    try? await Task.sleep(nanoseconds: 600_000_000)
                    guard draft.complete(success: success, operation: operation) else { return }
                    status = !success ? "保存失败，草稿已保留，请重试" : "已保存"
                    progress = !success ? 0.5 : 1
                    failNext = false
                  }
                }
                Text(status)
              }.disabled(draft.busy)
            } else {
              RosemaryEmptyState("暂时没有记录", message: "保存后的项目会显示在这里。") {
                RosemaryButton("清空草稿", enabled: !draft.busy) { confirm = true }
              }
            }
          }
        }.padding(24)
      }.navigationTitle("Rosemary SDK").toolbar {
        NavigationLink("全部组件", destination: Gallery())
        RosemaryIconButton("修改名称", systemImage: "pencil") {
          editName = draft.name
          editing = true
        }.disabled(draft.busy)
      }
    }
    .onDisappear {
      if draft.busy { status = "保存已中断，草稿已保留" }
      draft.invalidateSave()
    }
    .sheet(isPresented: $editing) {
      RosemaryDialog(
        "修改项目名称",
        onConfirm: {
          draft.edit(editName)
          editing = false
        }, onCancel: { editing = false }
      ) { RosemaryTextField("项目名称", value: $editName) }
    }
    .rosemaryAlertDialog(
      "清空草稿？", isPresented: $confirm, message: "项目名称和笔记将被清空。", confirmLabel: "清空草稿"
    ) {
      draft.edit("")
      notes = ""
    }
  }
}
