import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import {
  createTheme,
  defaultThemes,
  themeCssVariables,
  validateTheme,
} from "@rosemary-ui/tokens";
import type {
  ContrastDiagnostic,
  RosemaryColors,
  ThemeMode,
} from "@rosemary-ui/tokens";
export interface RosemaryStrings {
  search: string;
  close: string;
  cancel: string;
  confirm: string;
  clear: string;
  chooseDate: string;
  chooseOption: string;
  previousMonth: string;
  nextMonth: string;
  year: string;
  month: string;
  invalidYear: string;
  time: string;
  invalidTime: string;
  hours: string;
  minutes: string;
  chooseFiles: string;
  dropFiles: string;
  removeFile: string;
  retryFile: string;
  uploading: string;
  uploadComplete: string;
  uploadFailed: string;
  uploadCancelled: string;
  uploadSelected: string;
  stepError: string;
  stepUnavailable: string;
  loading: string;
  loadingContent: string;
  weekdays: readonly string[];
  pagination: string;
  previousPage: string;
  nextPage: string;
  page: string;
  currentLocation: string;
  emptyRecords: string;
  steps: string;
  closeNotice: string;
  startDate: string;
  endDate: string;
  reversedRange: string;
  monthOption: string;
}
export const defaultStrings: RosemaryStrings = {
  search: "搜索",
  close: "关闭",
  cancel: "取消",
  confirm: "确认",
  clear: "清除",
  chooseDate: "选择日期",
  chooseOption: "请选择",
  previousMonth: "上个月",
  nextMonth: "下个月",
  year: "年份",
  month: "月份",
  invalidYear: "年份范围 1–9999",
  time: "时间（HH:mm）",
  invalidTime: "时间范围 00:00–23:59",
  hours: "小时",
  minutes: "分钟",
  chooseFiles: "选择文件",
  dropFiles: "拖放文件，或使用选择文件按钮",
  removeFile: "移除",
  retryFile: "重试",
  uploading: "正在上传",
  uploadComplete: "上传完成",
  uploadFailed: "上传失败",
  uploadCancelled: "已取消",
  uploadSelected: "已选择",
  stepError: "步骤失败",
  stepUnavailable: "不可用",
  loading: "正在加载",
  loadingContent: "正在加载内容",
  pagination: "分页",
  previousPage: "上一页",
  nextPage: "下一页",
  page: "第 {page} 页",
  currentLocation: "当前位置",
  emptyRecords: "暂无记录",
  steps: "步骤",
  closeNotice: "关闭提示",
  startDate: "开始日期",
  endDate: "结束日期",
  reversedRange: "结束日期不能早于开始日期。",
  monthOption: "{month} 月",
  weekdays: ["一", "二", "三", "四", "五", "六", "日"],
};
export const englishStrings: RosemaryStrings = {
  search: "Search",
  close: "Close",
  cancel: "Cancel",
  confirm: "Confirm",
  clear: "Clear",
  chooseDate: "Choose date",
  chooseOption: "Choose an option",
  previousMonth: "Previous month",
  nextMonth: "Next month",
  year: "Year",
  month: "Month",
  invalidYear: "Year must be 1–9999",
  time: "Time (HH:mm)",
  invalidTime: "Time must be 00:00–23:59",
  hours: "Hours",
  minutes: "Minutes",
  chooseFiles: "Choose files",
  dropFiles: "Drop files here, or use Choose files",
  removeFile: "Remove",
  retryFile: "Retry",
  uploading: "Uploading",
  uploadComplete: "Upload complete",
  uploadFailed: "Upload failed",
  uploadCancelled: "Cancelled",
  uploadSelected: "Selected",
  stepError: "Step failed",
  stepUnavailable: "Unavailable",
  loading: "Loading",
  loadingContent: "Loading content",
  pagination: "Pagination",
  previousPage: "Previous page",
  nextPage: "Next page",
  page: "Page {page}",
  currentLocation: "Current location",
  emptyRecords: "No records",
  steps: "Steps",
  closeNotice: "Dismiss notice",
  startDate: "Start date",
  endDate: "End date",
  reversedRange: "End date must not precede start date.",
  monthOption: "Month {month}",
  weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};
export interface ThemeContextValue {
  colors: RosemaryColors;
  mode: ThemeMode;
  direction: "ltr" | "rtl";
  reducedMotion: boolean;
  language: string;
  strings: RosemaryStrings;
}
const ThemeContext = createContext<ThemeContextValue | null>(null);
const fallback: ThemeContextValue = {
  colors: defaultThemes.light,
  mode: "light",
  direction: "ltr",
  reducedMotion: false,
  language: "zh-CN",
  strings: defaultStrings,
};
function mediaSubscribe(query: string, listener: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
function usePreference(query: string) {
  return useSyncExternalStore(
    (listener) => mediaSubscribe(query, listener),
    () => typeof window !== "undefined" && !!window.matchMedia?.(query).matches,
    () => false,
  );
}
export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  mode?: ThemeMode;
  colors?: Partial<RosemaryColors>;
  direction?: "ltr" | "rtl";
  reducedMotion?: boolean;
  language?: string;
  strings?: Partial<RosemaryStrings>;
  onDiagnostics?: (diagnostics: readonly ContrastDiagnostic[]) => void;
}
/** Omitted mode inherits the nearest provider. Explicit mode starts from its built-in palette; partial colors merge once and are validated. */
export function ThemeProvider({
  children,
  mode,
  colors,
  direction,
  reducedMotion,
  language,
  strings,
  onDiagnostics,
  style,
  className,
  ...props
}: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const dark = usePreference("(prefers-color-scheme: dark)");
  const reduce = usePreference("(prefers-reduced-motion: reduce)");
  const effectiveMode = mode ?? parent?.mode ?? "system";
  const palette = useMemo(
    () =>
      createTheme(
        mode === undefined && parent
          ? parent.colors
          : defaultThemes[
              effectiveMode === "system"
                ? dark
                  ? "dark"
                  : "light"
                : effectiveMode
            ],
        colors,
      ),
    [mode, parent, effectiveMode, dark, colors],
  );
  const diagnostics = useMemo(() => validateTheme(palette), [palette]);
  useEffect(() => {
    onDiagnostics?.(diagnostics);
  }, [diagnostics, onDiagnostics]);
  const value = useMemo(
    () => ({
      colors: palette,
      mode: effectiveMode,
      direction: direction ?? parent?.direction ?? "ltr",
      reducedMotion: reduce || !!parent?.reducedMotion || !!reducedMotion,
      language: language ?? parent?.language ?? "zh-CN",
      strings: {
        ...(language
          ? language.toLowerCase().startsWith("en")
            ? englishStrings
            : defaultStrings
          : (parent?.strings ?? defaultStrings)),
        ...strings,
      },
    }),
    [
      palette,
      effectiveMode,
      direction,
      parent,
      reducedMotion,
      reduce,
      language,
      strings,
    ],
  );
  return (
    <ThemeContext.Provider value={value}>
      <div
        {...props}
        className={["rm-theme", className].filter(Boolean).join(" ")}
        dir={value.direction}
        lang={value.language}
        data-rm-theme={effectiveMode}
        data-rm-reduced-motion={value.reducedMotion ? "true" : "false"}
        style={{ ...themeCssVariables(palette), ...style } as CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
export function useRosemaryTheme() {
  return useContext(ThemeContext) ?? fallback;
}

export const RosemaryProvider = ThemeProvider;
export function useRosemaryStrings() {
  return useRosemaryTheme().strings;
}
export function useDocumentVisible() {
  return useSyncExternalStore(
    (listener) => {
      if (typeof document === "undefined") return () => {};
      document.addEventListener("visibilitychange", listener);
      return () => document.removeEventListener("visibilitychange", listener);
    },
    () => typeof document === "undefined" || !document.hidden,
    () => true,
  );
}
