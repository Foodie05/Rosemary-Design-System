import SwiftUI

public enum RosemaryCalendarView { case days, months, years }
public struct RosemaryDate: View {
  private var p = RosemaryPalette()
  let label: String
  let seed: RosemaryLocalDate
  let bounds: ClosedRange<RosemaryLocalDate>
  let onCommit: (RosemaryLocalDate?) -> Void
  @Binding var value: RosemaryLocalDate?
  @Binding var open: Bool
  @State private var draft = RosemaryDateDraft(nil)
  @State private var text = ""
  @State private var error: String?
  @State private var cursor = RosemaryLocalDate(year: 1, month: 1, day: 1)!
  @State private var mode = CalendarMode.days
  @State private var yearText = ""
  @FocusState private var fieldFocus: Bool
  @FocusState private var dayFocus: Int?
  private typealias CalendarMode = RosemaryCalendarView
  private let initialView: RosemaryCalendarView
  public init(
    _ label: String, value: Binding<RosemaryLocalDate?>, isExpanded: Binding<Bool>,
    initialMonth: RosemaryLocalDate, initialView: RosemaryCalendarView = .days,
    bounds: ClosedRange<RosemaryLocalDate> = RosemaryLocalDate(
      year: 1, month: 1, day: 1)!...RosemaryLocalDate(year: 9999, month: 12, day: 31)!,
    onCommit: @escaping (RosemaryLocalDate?) -> Void = { _ in }
  ) {
    self.label = label
    _value = value
    _open = isExpanded
    seed = initialMonth
    self.initialView = initialView
    self.bounds = bounds
    self.onCommit = onCommit
    _cursor = State(
      initialValue: max(
        bounds.lowerBound, min(bounds.upperBound, value.wrappedValue ?? initialMonth)))
    _draft = State(initialValue: RosemaryDateDraft(value.wrappedValue))
    _text = State(initialValue: value.wrappedValue?.description ?? "")
  }
  private func begin() {
    draft = RosemaryDateDraft(value)
    cursor = max(bounds.lowerBound, min(bounds.upperBound, value ?? seed))
    text = value?.description ?? ""
    yearText = String(cursor.year)
    error = nil
    mode = initialView
  }
  private func cancel() {
    draft.cancel()
    text = value?.description ?? ""
    error = nil
    open = false
    fieldFocus = true
  }
  private func parse() -> Bool {
    if text.isEmpty {
      draft.value = nil
      error = nil
      return true
    }
    guard let d = RosemaryLocalDate(text), bounds.contains(d) else {
      error = p.text("Use YYYY-MM-DD within the permitted range")
      return false
    }
    draft.value = d
    cursor = d
    error = nil
    return true
  }
  private func commit() {
    guard parse() else { return }
    value = draft.commit()
    open = false
    fieldFocus = true
    onCommit(value)
  }
  private func move(_ delta: Int) {
    if let next = cursor.addingDays(delta), bounds.contains(next) {
      cursor = next
      dayFocus = next.day
    }
  }
  // Calendar UI follows the shared Monday-first contract; model weekday remains Sunday=0.
  private let weekStart = 1
  private var firstWeekday: Int {
    (RosemaryLocalDate(year: cursor.year, month: cursor.month, day: 1)!.weekday - weekStart + 7) % 7
  }
  private var weekdayLabels: [String] {
    let keys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (0..<7).map { p.text(keys[($0 + weekStart) % 7]) }
  }
  @Environment(\.layoutDirection) private var direction
  @Environment(\.dynamicTypeSize) private var textSize
  @ScaledMetric(relativeTo: .body) private var dayWidth: CGFloat = 44
  private func pick(_ d: RosemaryLocalDate) {
    draft.value = d
    text = d.description
    cursor = d
    error = nil
  }
  private func month(_ delta: Int) {
    if let d = cursor.addingMonths(delta) {
      cursor = d
      dayFocus = d.day
      yearText = String(d.year)
    }
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label).rosemaryTypography(.small, weight: .medium).foregroundStyle(p.colors.ink)
      HStack {
        TextField("", text: $text, prompt: Text("YYYY-MM-DD").foregroundStyle(p.colors.muted))
          .textFieldStyle(.plain).focused($fieldFocus).onSubmit(commit).accessibilityLabel(label)
          .accessibilityHint(p.text("Gregorian local date, YYYY-MM-DD")).onKeyPress(.downArrow) {
            open = true
            begin()
            dayFocus = cursor.day
            return .handled
          }
        RosemaryIconButton("calendar", label: "\(p.text("Choose")) \(label)") {
          if open {
            cancel()
          } else {
            open = true
            begin()
          }
        }
      }.modifier(RosemaryFieldFrame(invalid: error != nil, focused: fieldFocus))
      if let error { Text(error).rosemaryTypography(.caption).foregroundStyle(p.colors.danger) }
      if open {
        RosemaryCard {
          VStack(spacing: 12) {
            calendarHeader
            if mode == .days {
              dayGrid
            } else if mode == .months {
              LazyVGrid(columns: [
                GridItem(.adaptive(minimum: textSize.isAccessibilitySize ? 180 : 80))
              ]) {
                ForEach(1...12, id: \.self) { m in
                  RosemaryButton(String(m), variant: m == cursor.month ? .primary : .quiet) {
                    cursor = RosemaryLocalDate(
                      year: cursor.year, month: m,
                      day: min(
                        cursor.day, RosemaryLocalDate.daysInMonth(year: cursor.year, month: m)))!
                    mode = .days
                  }.accessibilityLabel(p.format("Month %d", m))
                }
              }
            } else {
              VStack {
                RosemaryInput(p.text("Year 1–9999"), text: $yearText, onSubmit: jumpYear)
                RosemaryButton(p.text("Go to year"), variant: .secondary, action: jumpYear)
                LazyVGrid(columns: [
                  GridItem(.adaptive(minimum: textSize.isAccessibilitySize ? 180 : 80))
                ]) {
                  ForEach(max(1, cursor.year - 4)...min(9999, cursor.year + 4), id: \.self) { y in
                    RosemaryButton(String(y), variant: y == cursor.year ? .primary : .quiet) {
                      yearText = String(y)
                      jumpYear()
                    }
                  }
                }
              }
            }
            HStack {
              RosemaryButton(p.text("Cancel"), variant: .quiet, action: cancel)
              Spacer()
              RosemaryButton(p.text("Apply"), action: commit)
            }
          }
        }.background {
          Color.clear.contentShape(Rectangle()).frame(width: 4000, height: 4000).onTapGesture(
            perform: cancel
          ).accessibilityHidden(true)
        }.accessibilityElement(children: .contain)
          .accessibilityLabel("\(p.text("Choose")) \(label)").onKeyPress(.escape) {
          cancel()
          return .handled
        }
      }
    }.zIndex(open ? 50 : 0).onAppear {
      text = value?.description ?? ""
      if open { begin() }
    }.onChange(of: open) { _, v in
      if v {
        begin()
      } else {
        text = value?.description ?? ""
        error = nil
      }
    }.onChange(of: value) { _, _ in begin() }.onDisappear {
      draft.cancel()
      open = false
    }
  }
  private func jumpYear() {
    guard let y = Int(yearText), (1...9999).contains(y) else {
      error = p.text("Year must be 1–9999")
      return
    }
    cursor = RosemaryLocalDate(
      year: y, month: cursor.month,
      day: min(cursor.day, RosemaryLocalDate.daysInMonth(year: y, month: cursor.month)))!
    error = nil
    mode = .days
  }
  private var monthHeading: some View {
    HStack {
      RosemaryButton(String(cursor.year), variant: .quiet) {
        mode = .years
        yearText = String(cursor.year)
      }.fixedSize(horizontal: true, vertical: false)
      RosemaryButton(String(cursor.month), variant: .quiet) { mode = .months }.fixedSize(
        horizontal: true, vertical: false)
    }
  }
  private var monthArrows: some View {
    HStack {
      RosemaryIconButton("chevron", label: p.text("Previous month"), rotation: .degrees(180)) {
        month(-1)
      }.disabled(cursor.year == 1 && cursor.month == 1)
      Spacer()
      RosemaryIconButton("chevron", label: p.text("Next month")) { month(1) }.disabled(
        cursor.year == 9999 && cursor.month == 12)
    }
  }
  @ViewBuilder private var calendarHeader: some View {
    if textSize.isAccessibilitySize {
      VStack {
        monthArrows
        monthHeading
      }
    } else {
      HStack {
        RosemaryIconButton("chevron", label: p.text("Previous month"), rotation: .degrees(180)) {
          month(-1)
        }.disabled(cursor.year == 1 && cursor.month == 1)
        Spacer()
        monthHeading
        Spacer()
        RosemaryIconButton("chevron", label: p.text("Next month")) { month(1) }.disabled(
          cursor.year == 9999 && cursor.month == 12)
      }
    }
  }
  private var dayGrid: some View {
    ScrollView(.horizontal) {
      LazyVGrid(
        columns: Array(repeating: GridItem(.fixed(dayWidth), spacing: 0), count: 7), spacing: 0
      ) {
        ForEach(weekdayLabels, id: \.self) {
          Text($0).rosemaryTypography(.caption).fixedSize(horizontal: true, vertical: false)
            .foregroundStyle(
              p.colors.muted
            ).accessibilityHidden(true)
        }
        ForEach(
          0..<(firstWeekday + RosemaryLocalDate.daysInMonth(year: cursor.year, month: cursor.month)),
          id: \.self
        ) { cell in
          if cell < firstWeekday {
            Color.clear.frame(height: 44).accessibilityHidden(true)
          } else {
            let day = cell - firstWeekday + 1
            let date = RosemaryLocalDate(year: cursor.year, month: cursor.month, day: day)!
            Button {
              pick(date)
            } label: {
              Text(String(day)).rosemaryTypography(.body).fixedSize(
                horizontal: true, vertical: false
              ).frame(
                maxWidth: .infinity, minHeight: 44
              ).foregroundStyle(
                draft.value == date ? p.colors.onPrimary : p.colors.ink
              ).background(
                draft.value == date ? p.colors.primary : .clear,
                in: RoundedRectangle(cornerRadius: 8)
              ).overlay(
                RoundedRectangle(cornerRadius: 8).stroke(
                  dayFocus == day ? p.colors.focus : .clear, lineWidth: 2))
            }.buttonStyle(.plain).disabled(!bounds.contains(date)).focusable(cursor.day == day)
              .focused($dayFocus, equals: day).accessibilityLabel(date.description)
              .accessibilityAddTraits(draft.value == date ? .isSelected : [])
              .onKeyPress(.leftArrow) {
                move(direction == .rightToLeft ? 1 : -1)
                return .handled
              }.onKeyPress(.rightArrow) {
                move(direction == .rightToLeft ? -1 : 1)
                return .handled
              }.onKeyPress(.upArrow) {
                move(-7)
                return .handled
              }.onKeyPress(.downArrow) {
                move(7)
                return .handled
              }.onKeyPress(.home) {
                move(-((cursor.weekday - weekStart + 7) % 7))
                return .handled
              }.onKeyPress(.end) {
                move(6 - ((cursor.weekday - weekStart + 7) % 7))
                return .handled
              }.onKeyPress(.pageUp) {
                month(-1)
                return .handled
              }.onKeyPress(.pageDown) {
                month(1)
                return .handled
              }.onKeyPress(.tab) {
                cancel()
                return .ignored
              }
          }
        }
      }.id("\(cursor.year)-\(cursor.month)-\(weekStart)")
    }.scrollIndicators(.visible)
  }
}
public struct RosemaryTime: View {
  private var p = RosemaryPalette()
  let label: String
  let onCommit: (RosemaryLocalTime?) -> Void
  @Binding var value: RosemaryLocalTime?
  @Binding var open: Bool
  @State private var draft = RosemaryLocalTime(hour: 0, minute: 0)!
  @State private var text = ""
  @State private var error: String?
  @FocusState private var focus: Bool
  @FocusState private var optionFocus: TimeFocus?
  private struct TimeFocus: Hashable {
    let hour: Bool
    let value: Int
  }
  public init(
    _ label: String, value: Binding<RosemaryLocalTime?>, isExpanded: Binding<Bool>,
    onCommit: @escaping (RosemaryLocalTime?) -> Void = { _ in }
  ) {
    self.label = label
    _value = value
    _open = isExpanded
    self.onCommit = onCommit
  }
  private func begin() {
    draft = value ?? RosemaryLocalTime(hour: 0, minute: 0)!
    text = value?.description ?? ""
    error = nil
  }
  private func cancel() {
    begin()
    open = false
    focus = true
  }
  private func commit() {
    guard text.isEmpty || RosemaryLocalTime(text) != nil else {
      error = p.text("Use HH:mm, 00:00–23:59")
      return
    }
    value = RosemaryLocalTime(text)
    open = false
    focus = true
    error = nil
    onCommit(value)
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 8) {
      Text(label).rosemaryTypography(.small, weight: .medium).foregroundStyle(p.colors.ink)
      HStack {
        TextField("", text: $text, prompt: Text("HH:mm").foregroundStyle(p.colors.muted))
          .textFieldStyle(.plain).focused($focus).onSubmit(commit).onKeyPress(.downArrow) {
            begin()
            open = true
            optionFocus = TimeFocus(hour: true, value: draft.hour)
            return .handled
          }.accessibilityLabel(label)
        RosemaryIconButton("clock", label: "\(p.text("Choose")) \(label)") {
          if open {
            cancel()
          } else {
            begin()
            open = true
          }
        }
      }.modifier(RosemaryFieldFrame(invalid: error != nil, focused: focus))
      if let error { Text(error).rosemaryTypography(.caption).foregroundStyle(p.colors.danger) }
      if open {
        RosemaryCard {
          VStack {
            HStack(spacing: 16) {
              column(p.text("Hour"), range: 0...23, value: draft.hour, isHour: true) {
                draft = RosemaryLocalTime(hour: $0, minute: draft.minute)!
                text = draft.description
              }
              column(p.text("Minute"), range: 0...59, value: draft.minute, isHour: false) {
                draft = RosemaryLocalTime(hour: draft.hour, minute: $0)!
                text = draft.description
              }
            }
            HStack {
              RosemaryButton(p.text("Cancel"), variant: .quiet, action: cancel)
              Spacer()
              RosemaryButton(p.text("Apply"), action: commit)
            }
          }
        }.background {
          Color.clear.contentShape(Rectangle()).frame(width: 4000, height: 4000).onTapGesture(
            perform: cancel
          ).accessibilityHidden(true)
        }.onKeyPress(.escape) {
          cancel()
          return .handled
        }
      }
    }.zIndex(open ? 50 : 0).onAppear { begin() }.onChange(of: value) { _, _ in begin() }.onChange(
      of: open
    ) { _, v in if v { begin() } else { text = value?.description ?? "" } }.onDisappear {
      open = false
    }
  }
  private func column(
    _ label: String, range: ClosedRange<Int>, value: Int, isHour: Bool,
    onChange: @escaping (Int) -> Void
  ) -> some View {
    VStack {
      Text(label).rosemaryTypography(.caption, weight: .semibold).foregroundStyle(p.colors.ink)
      ScrollViewReader { proxy in
        ScrollView {
          LazyVStack(spacing: 0) {
            ForEach(range, id: \.self) { n in
              RosemaryButton(String(format: "%02d", n), variant: n == value ? .primary : .quiet) {
                onChange(n)
              }.frame(maxWidth: .infinity).id(n).focusable(n == value).focused(
                $optionFocus, equals: TimeFocus(hour: isHour, value: n)
              ).accessibilityLabel("\(label) \(n)").accessibilityAddTraits(
                n == value ? .isSelected : [])
            }
          }
        }.frame(height: 200).onAppear { proxy.scrollTo(value, anchor: .center) }.onChange(of: value)
        { _, v in
          proxy.scrollTo(v, anchor: .center)
          if optionFocus?.hour == isHour { optionFocus = TimeFocus(hour: isHour, value: v) }
        }
      }
    }.accessibilityElement(children: .contain).accessibilityAdjustableAction { d in
      onChange(max(range.lowerBound, min(range.upperBound, value + (d == .increment ? 1 : -1))))
    }.onKeyPress(.upArrow) {
      onChange(max(range.lowerBound, value - 1))
      return .handled
    }.onKeyPress(.downArrow) {
      onChange(min(range.upperBound, value + 1))
      return .handled
    }.onKeyPress(.home) {
      onChange(range.lowerBound)
      return .handled
    }.onKeyPress(.end) {
      onChange(range.upperBound)
      return .handled
    }.onKeyPress(.leftArrow) {
      optionFocus = TimeFocus(hour: true, value: draft.hour)
      return .handled
    }.onKeyPress(.rightArrow) {
      optionFocus = TimeFocus(hour: false, value: draft.minute)
      return .handled
    }.onKeyPress(.tab) {
      cancel()
      return .ignored
    }
  }
}
public struct RosemaryDateRange: View {
  private var p = RosemaryPalette()
  let label: String
  let seed: RosemaryLocalDate
  let onCommit: (RosemaryLocalDateRange) -> Void
  @Binding var value: RosemaryLocalDateRange?
  @State private var start: RosemaryLocalDate?
  @State private var end: RosemaryLocalDate?
  @State private var startOpen = false
  @State private var endOpen = false
  @State private var error: String?
  public init(
    _ label: String, value: Binding<RosemaryLocalDateRange?>, initialMonth: RosemaryLocalDate,
    onCommit: @escaping (RosemaryLocalDateRange) -> Void = { _ in }
  ) {
    self.label = label
    _value = value
    seed = initialMonth
    self.onCommit = onCommit
  }
  private func sync() {
    start = value?.start
    end = value?.end
    error = nil
  }
  public var body: some View {
    VStack(alignment: .leading, spacing: 12) {
      Text(label).rosemaryTypography(.lead, weight: .semibold).foregroundStyle(p.colors.ink)
      RosemaryDate(p.text("Start"), value: $start, isExpanded: $startOpen, initialMonth: seed)
      RosemaryDate(p.text("End"), value: $end, isExpanded: $endOpen, initialMonth: seed)
      if let error { Text(error).foregroundStyle(p.colors.danger).rosemaryTypography(.caption) }
      HStack {
        RosemaryButton(p.text("Cancel"), variant: .quiet, action: sync)
        RosemaryButton(p.text("Apply range")) {
          guard let start, let end, let range = RosemaryLocalDateRange(start: start, end: end)
          else {
            error = p.text("End must be on or after start")
            return
          }
          value = range
          error = nil
          onCommit(range)
        }
      }
    }.onAppear(perform: sync).onChange(of: value) { _, _ in sync() }
  }
}
