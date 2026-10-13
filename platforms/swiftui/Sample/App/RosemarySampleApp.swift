import RosemaryUI
import SwiftUI

@main struct RosemarySampleApp: App {
  var body: some Scene { WindowGroup { Gallery() } }
}
private struct Record: Identifiable {
  let id: String
  let name: String
  let status: String
}
struct Gallery: View {
  @Environment(\.colorScheme) private var systemScheme
  private var effectiveTheme: RosemaryThemeMode {
    theme == .system ? (systemScheme == .dark ? .dark : .light) : theme
  }
  private var currentColors: RosemaryColors {
    effectiveTheme == .dark ? RosemaryTokens.dark : RosemaryTokens.light
  }
  @State private var tab = "forms"
  @State private var theme = RosemaryThemeMode.system
  @State private var language = "en"
  @State private var rtl = false
  @State private var reduced = false
  @State private var text = ""
  @State private var notes = ""
  @State private var dialogDraft = ""
  @State private var checked = false
  @State private var choice = "draft"
  @State private var on = false
  @State private var slider = 0.5
  @State private var select: String?
  @State private var selectOpen = false
  @State private var date: RosemaryLocalDate? = RosemaryLocalDate("2026-10-13")!
  @State private var dateOpen = false
  @State private var time: RosemaryLocalTime?
  @State private var timeOpen = false
  @State private var range: RosemaryLocalDateRange?
  @State private var page = 1
  @State private var menu = false
  @State private var popover = false
  @State private var tooltip = false
  @State private var dialog = false
  @State private var drawer = false
  @State private var toast = false
  @State private var toastPaused = true
  @State private var toastDuration: Duration? = .milliseconds(900)
  @State private var toastDismissals = 0
  @State private var loading = false
  @State private var completed = 0.0
  @State private var sorted: String? = "name"
  @State private var ascending = true
  @State private var selectedRecord = ""
  @State private var result = ""
  @State private var uploadFiles: [RosemaryUploadFile] = []
  @State private var errorAlert = true
  @State private var skeleton = true
  @FocusState private var modalTrigger: Bool
  private let records = [
    Record(id: "a", name: "Reading notes", status: "Draft"),
    Record(id: "b", name: "Planting plan", status: "Ready"),
    Record(id: "c", name: "October archive", status: "Saved"),
  ]
  private let seed = RosemaryLocalDate("2026-10-13")!
  private var capture: String? {
    let args = ProcessInfo.processInfo.arguments
    guard let i = args.firstIndex(of: "--capture"), args.indices.contains(i + 1) else { return nil }
    return args[i + 1]
  }
  init() {
    let args = ProcessInfo.processInfo.arguments
    let mode: RosemaryThemeMode = args.contains("--dark") ? .dark : .system
    _theme = State(initialValue: mode)
    _rtl = State(initialValue: args.contains("--rtl"))
    let kind: String? = {
      guard let i = args.firstIndex(of: "--capture"), args.indices.contains(i + 1) else {
        return nil
      }
      return args[i + 1]
    }()
    _dateOpen = State(initialValue: ["date", "year", "month"].contains(kind ?? ""))
    _timeOpen = State(initialValue: kind == "time")
    _selectOpen = State(initialValue: kind == "select")
    _popover = State(initialValue: kind == "edge-popover")
    _toast = State(initialValue: kind == "toast")
  }
  var body: some View { Group { if let capture { captureScreen(capture) } else { galleryScreen } } }
  @ViewBuilder private func captureScreen(_ kind: String) -> some View {
    ScrollView {
      VStack(alignment: .leading, spacing: 18) {
        Text("Rosemary SDK 0.4.0 · \(kind)").font(.title2.weight(.semibold))
        if ["date", "year", "month"].contains(kind) {
          RosemaryDate(
            "Local date", value: $date, isExpanded: $dateOpen, initialMonth: seed,
            initialView: kind == "year" ? .years : kind == "month" ? .months : .days)
          Text("Date value: \(date?.description ?? "nil")").accessibilityIdentifier("date-value")
        } else if kind == "time" {
          RosemaryTime("Local time", value: $time, isExpanded: $timeOpen)
        } else if kind == "select" {
          RosemarySelect(
            "Long choices", selection: $select, isExpanded: $selectOpen,
            options: (1...40).map {
              RosemaryOption("choice-\($0)", label: "Choice \($0)", disabled: $0 == 2)
            })
          Text("Following content stays in place").accessibilityIdentifier("select-following")
        } else if kind == "edge-popover" {
          Spacer().frame(height: 490)
          HStack {
            Spacer()
            RosemaryPopover("Boundary placement", isPresented: $popover) {
              Text("Edge trigger")
            } content: {
              RosemaryInput("Popover notes", text: $notes)
              Text("Anchored inside the usable viewport")
            }
          }
        } else if kind == "nested-theme" {
          Text(systemScheme == .dark ? "dark" : "light").accessibilityIdentifier("host-appearance")
          VStack(spacing: 12) {
            AppearanceProbe(identifier: "dark-subtree-appearance")
            AppearanceProbe(identifier: "system-subtree-appearance").rosemaryTheme(.system)
          }.rosemaryTheme(RosemaryThemeMode.dark)
        } else if kind == "toast" {
          RosemaryToast("Timed notification", isPresented: $toast, duration: toastDuration,
            isPaused: toastPaused) { toastDismissals += 1 }
          RosemaryButton("Resume notification") { toastPaused = false }
          RosemaryButton("Show persistent notification") {
            toastDuration = nil
            toastPaused = false
            toast = true
          }
          Text("Dismissals: \(toastDismissals)")
        } else if kind == "busy" {
          RosemaryButton("Saving", isLoading: true) {}
          RosemaryButton("Removing", variant: .danger, isLoading: true) {}
          RosemaryLoading("Reading records", isRunning: true)
          RosemaryProgress("Unknown work", isRunning: false)
        } else {
          RosemaryInput("Reader name", text: $text, placeholder: "Your name")
          RosemaryCheckbox("Remember choice", isChecked: $checked)
          RosemarySwitch("Notifications", isOn: $on)
          RosemaryCard {
            VStack(alignment: .leading, spacing: 12) {
              Text("Inherited theme")
              RosemaryLoading("Reading records", isRunning: false)
              RosemaryProgress("Processed", value: 3, total: 6, isRunning: false)
            }
          }
          RosemaryCard {
            Text("Vigilo local theme")
            RosemaryButton("Save changes") { result = "Saved" }
          }.rosemaryTheme(SubbrandThemes.vigilo(effectiveTheme))
          RosemaryButton("Open details") { drawer = true }
        }
      }.frame(maxWidth: .infinity, alignment: .leading).padding(20).foregroundStyle(
        currentColors.ink)
    }
    .background(currentColors.canvas)
    .rosemaryDrawer("Record details", isPresented: $drawer) {
      RosemaryList(records) { row in Text(row.name) }
      RosemaryButton("Done") { drawer = false }
    }
    .rosemaryTheme(theme).environment(\.layoutDirection, rtl ? .rightToLeft : .leftToRight)
    .dynamicTypeSize(
      ProcessInfo.processInfo.arguments.contains("--large") ? .accessibility3 : .large
    )
    .onAppear { if kind == "drawer" { drawer = true } }
  }
  private var galleryScreen: some View {
    VStack(spacing: 12) {
      Text("Rosemary SDK 0.4.0").font(.title2.weight(.semibold)).padding(.top)
      HStack(spacing: 0) {
        RosemaryButton(theme.rawValue.capitalized, variant: .quiet) {
          theme = theme == .system ? .light : theme == .light ? .dark : .system
        }.accessibilityIdentifier("theme")
        RosemaryButton(language == "en" ? "中文" : "English", variant: .quiet) {
          language = language == "en" ? "zh" : "en"
        }.accessibilityIdentifier("language")
        RosemaryButton("RTL", variant: .quiet) { rtl.toggle() }
        RosemaryButton("Motion", variant: .quiet) { reduced.toggle() }
      }
      RosemaryTabs(
        selection: $tab,
        tabs: [
          RosemaryOption("forms", label: "Forms"),
          RosemaryOption("navigation", label: "Navigation"),
          RosemaryOption("feedback", label: "Feedback"),
          RosemaryOption("overlays", label: "Overlays"),
        ]
      ) { selected in
        ScrollView {
          VStack(alignment: .leading, spacing: 18) {
            switch selected {
            case "forms": forms
            case "navigation": navigation
            case "feedback": feedback
            default: overlays
            }
            Text(result).font(.caption).accessibilityIdentifier("result")
          }.padding(16)
        }.scrollDismissesKeyboard(.interactively).accessibilityIdentifier("gallery-scroll")
      }.padding(.horizontal, 12)
    }.foregroundStyle(currentColors.ink)
      .background(currentColors.canvas)
      .rosemaryDialog(
        "Confirm changes", isPresented: $dialog, onDismiss: { result = "Dialog: \($0.rawValue)" },
        restoreFocus: { modalTrigger = true }
      ) {
        DialogEditor(draft: $dialogDraft) {
          notes = dialogDraft
          result = "Saved: \(notes)"
        }
      }
      .rosemaryDrawer(
        "Record details", isPresented: $drawer, onDismiss: { result = "Drawer: \($0.rawValue)" },
        restoreFocus: { modalTrigger = true }
      ) {
        VStack(alignment: .leading, spacing: 16) {
          RosemaryList(records) { row in Text(row.name) }
          RosemaryButton("Done") { drawer = false }
        }
      }
      .rosemaryTheme(theme).rosemaryReduceMotion(reduced).environment(
        \.locale, Locale(identifier: language)
      ).environment(\.layoutDirection, rtl ? .rightToLeft : .leftToRight)
  }
  private var forms: some View {
    Group {
      RosemaryInput("Name", text: $text, placeholder: "Your name").accessibilityIdentifier("input")
      Text("Name value: \(text)").accessibilityIdentifier("name-value")
      RosemaryTextarea("Notes", text: $notes)
      RosemarySearch("Search records", text: $text) { result = "Search: \($0)" }
      RosemaryCheckbox("Remember choice", isChecked: $checked).accessibilityIdentifier("checkbox")
      Text(checked ? "Remembered" : "Not remembered").accessibilityIdentifier("checked-value")
      RosemaryRadio("Draft", value: "draft", selection: $choice)
      RosemaryRadio("Ready", value: "ready", selection: $choice)
      RosemarySwitch("Notifications", isOn: $on).accessibilityIdentifier("switch")
      RosemarySlider("Volume", value: $slider, in: 0...1, step: 0.1)
      RosemarySelect(
        "Status", selection: $select, isExpanded: $selectOpen,
        options: [
          RosemaryOption("draft", label: "Draft"), RosemaryOption("ready", label: "Ready"),
          RosemaryOption("disabled", label: "Unavailable", disabled: true),
        ])
      RosemaryDate(
        "Date", value: $date, isExpanded: $dateOpen, initialMonth: seed,
        onCommit: { result = "Committed date: \($0?.description ?? "nil")" })
      Text("Date value: \(date?.description ?? "nil")").accessibilityIdentifier("date-value")
      RosemaryTime(
        "Local time", value: $time, isExpanded: $timeOpen,
        onCommit: { result = "Committed time: \($0?.description ?? "nil")" })
      RosemaryDateRange(
        "Date range", value: $range, initialMonth: seed,
        onCommit: { result = "Range: \($0.start) – \($0.end)" })
      RosemaryUpload(
        "Choose files", allowsMultiple: true, files: uploadFiles,
        onRemove: { id in uploadFiles.removeAll { $0.id == id } },
        onRetry: { id in result = "Retry requested: \(id)" },
        onCancel: { id in result = "Cancel requested: \(id)" }
      ) { response in
        switch response {
        case .success(let urls):
          uploadFiles = urls.map {
            RosemaryUploadFile($0.absoluteString, name: $0.lastPathComponent)
          }
          result = "Selected \(urls.count) files"
        case .failure(let error): result = error.localizedDescription
        }
      }
      RosemaryButton("Submit") { result = "Submitted: \(text)" }
      RosemaryLink(
        "Rosemary source",
        destination: URL(string: "https://github.com/rosemary-design/rosemary-design-system-sdk")!)
      RosemaryIconButton("plus", label: "Add record") { result = "Add requested" }
    }
  }
  private var navigation: some View {
    Group {
      RosemaryBreadcrumb([
        RosemaryBreadcrumbItem("home", label: "Home", action: { result = "Home requested" }),
        RosemaryBreadcrumbItem("records", label: "Records"),
      ])
      RosemaryPagination(page: $page, pageCount: 6, onChange: { result = "Page \($0)" })
      RosemaryMenu(
        "Record actions", isExpanded: $menu,
        actions: [
          RosemaryMenuAction(
            "copy", title: "Copy title", icon: "copy", action: { result = "Copied title" }),
          RosemaryMenuAction(
            "delete", title: "Delete record", icon: "trash", destructive: true,
            action: { result = "Delete requested" }),
        ])
      RosemaryList(records, onSelect: { selectedRecord = $0.name }) { row in
        HStack {
          Text(row.name)
          Spacer()
          RosemaryBadge(row.status)
        }
      }
      Text("Selected: \(selectedRecord)")
      RosemaryTable(
        rows: records,
        columns: [
          RosemaryTableColumn(
            "name", title: "Name", value: { $0.name }, sort: { $0.name < $1.name }),
          RosemaryTableColumn(
            "status", title: "Status", value: { $0.status }, sort: { $0.status < $1.status }),
        ], sortedColumn: $sorted, ascending: $ascending)
      RosemaryStepper(
        [
          RosemaryStep("read", title: "Read", state: .complete, canEnter: true),
          RosemaryStep("edit", title: "Edit", state: .current),
          RosemaryStep("save", title: "Save", state: .upcoming),
        ], onSelect: { result = "Step: \($0)" })
    }
  }
  private var feedback: some View {
    Group {
      RosemaryCard {
        VStack(alignment: .leading, spacing: 12) {
          RosemaryAvatar("Rosemary Reader")
          RosemaryBadge("Ready", status: .success)
          Text("Consumer supplied content")
        }
      }
      if errorAlert {
        RosemaryAlert(
          "Review needed", message: "A local record needs attention.", status: .warning,
          onDismiss: { errorAlert = false })
      }
      RosemaryEmpty("No matches", message: "Try another search.") {
        RosemaryButton("Clear filters") {
          text = ""
          result = "Filters cleared"
        }
      }
      if skeleton { RosemarySkeleton(lines: 3) }
      RosemaryButton(skeleton ? "Finish skeleton" : "Show skeleton", variant: .secondary) {
        skeleton.toggle()
      }
      RosemaryLoading(loading ? "Reading records" : "Reading stopped", isRunning: loading)
      HStack {
        RosemaryButton("Start loading") { loading = true }
        RosemaryButton("Finish loading", variant: .secondary) { loading = false }
      }
      RosemaryProgress("Unknown work amount", isRunning: loading)
      RosemaryProgress("Processed records", value: completed, total: 6, isRunning: completed < 6)
      RosemaryButton("Process next") { completed = min(6, completed + 1) }.disabled(completed >= 6)
      RosemaryButton("Show toast", variant: .secondary) { toast = true }
      RosemaryToast("Record saved", isPresented: $toast)
    }
  }
  private var overlays: some View {
    Group {
      RosemaryTooltip("This action shows supplementary text", isPresented: $tooltip) {
        RosemaryIconButton("info", label: "Explanation") { tooltip.toggle() }
      }
      RosemaryPopover(
        "Quick edit", isPresented: $popover, onDismiss: { result = "Popover: \($0.rawValue)" }
      ) {
        Text("Open popover")
      } content: {
        RosemaryInput("Popover notes", text: $notes)
        RosemaryButton("Apply notes") {
          popover = false
          result = "Notes applied"
        }
      }
      RosemaryButton("Open dialog") {
        dialogDraft = notes
        dialog = true
      }.focused($modalTrigger)
        .accessibilityIdentifier("dialog-trigger")
      RosemaryButton("Open drawer", variant: .secondary) { drawer = true }.focused($modalTrigger)
        .accessibilityIdentifier("drawer-trigger")
      Text("Overlay state: \(dialog ? "dialog":drawer ? "drawer":"closed")")
        .accessibilityIdentifier("overlay-state")
    }
  }
}

private enum SubbrandThemes {
  private struct Catalog: Decodable { let themes: [String: [String: String]] }
  private static let catalog: [String: RosemaryTheme] = {
    do {
      guard let url = Bundle.main.url(forResource: "vigilo", withExtension: "json") else {
        fatalError("Missing consumer Vigilo theme resource")
      }
      let data = try Data(contentsOf: url)
      let parsed = try JSONDecoder().decode(Catalog.self, from: data)
      return try parsed.themes.mapValues { colors in
        let diagnostics = try RosemaryTheme.contrastDiagnostics(hex: colors)
        precondition(diagnostics.isEmpty, "Vigilo contrast failed")
        return try RosemaryTheme(hex: colors)
      }
    } catch { fatalError("Consumer theme validation failed: \(error)") }
  }()
  static func vigilo(_ mode: RosemaryThemeMode) -> RosemaryTheme {
    catalog[mode == .dark ? "dark" : "light"]!
  }
}

private struct DialogEditor: View {
  @Environment(\.rosemaryDismiss) private var dismiss
  @Binding var draft: String
  let save: () -> Void
  var body: some View {
    VStack(alignment: .leading, spacing: 16) {
      RosemaryInput("Dialog notes", text: $draft)
      RosemaryButton("Save changes") {
        save()
        dismiss(.confirm)
      }
      RosemaryButton("Cancel dialog", variant: .quiet) { dismiss(.cancel) }
    }
  }
}

private struct AppearanceProbe: View {
  let identifier: String
  @Environment(\.colorScheme) private var appearance
  var body: some View {
    RosemaryCard {
      Text(appearance == .dark ? "dark" : "light").accessibilityIdentifier(identifier)
    }
  }
}
