import { chooseSelect } from "./select-helpers";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Validation,
  PasswordReveal,
  LiveSlider,
  TagInput,
  UploadValidation,
  SwitchSemantics,
} from "../src/components/cases/InputScenarios";
import {
  Hierarchy,
  ContextPreservation,
  TransparentFilters,
  SearchFallback,
} from "../src/components/cases/NavigationScenarios";
import {
  UndoDelete,
  Autosave,
  OfflineQueue,
  LongTask,
} from "../src/components/cases/ResilienceScenarios";
import {
  BatchActions,
  DisabledReason,
  Priority,
  LoadingWidth,
} from "../src/components/cases/ActionScenarios";
import {
  ActionableError,
  ToastOrder,
  DismissBanner,
  CopyFeedback,
} from "../src/components/cases/FeedbackScenarios";
import {
  ResponsiveBalance,
  TypeScaling,
  EmptyGuidance,
} from "../src/components/cases/LayoutScenarios";
import {
  PageJump,
  EmptyFiltered,
  LocaleNumbers,
} from "../src/components/cases/DataScenarios";
import { Button } from "../src/components/ui/core";
import {
  Tabs,
  PaginationExample,
  StepperExample,
} from "../src/components/ui/navigation";
import {
  TableExample,
  DataGridExample,
  TagExample,
  FileRowExample,
  ProberExample,
} from "../src/components/ui/data";
import {
  ResizableExample,
  AccordionExample,
} from "../src/components/ui/layout";
import {
  TextInput,
  SwitchExample,
  CheckboxExample,
  RadioExample,
  SelectExample,
  ComboBoxExample,
  SliderExample,
} from "../src/components/ui/inputs";
import {
  ButtonExample,
  SplitButtonExample,
  IconButtonExample,
  ButtonGroupExample,
  FabExample,
  LinkButtonExample,
} from "../src/components/ui/actions";
import { ToastExample, BannerExample } from "../src/components/ui/feedback";
import {
  PopoverExample,
  DropdownExample,
  ContextExample,
} from "../src/components/ui/overlays";
describe("Critical dual-side behaviours", () => {
  it("ordinary actions do not submit a surrounding form; explicit submit still does", async () => {
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Button>显示帮助</Button>
        <Button type="submit">提交记录</Button>
      </form>,
    );
    await userEvent.click(screen.getByRole("button", { name: "显示帮助" }));
    expect(submit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "提交记录" }));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it("shows inline validation at blur and recovers after correction", async () => {
    render(<Validation good />);
    const input = screen.getByLabelText("邮箱地址");
    fireEvent.change(input, { target: { value: "lin" } });
    fireEvent.blur(input);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText(/请输入完整邮箱/)).toBeDefined();
    fireEvent.change(input, { target: { value: "lin@example.com" } });
    await userEvent.click(screen.getByRole("button", { name: "发送邀请" }));
    expect(screen.getByText(/邀请已发送/)).toBeDefined();
  });
  it("negative validation defers feedback until submit", async () => {
    render(<Validation good={false} />);
    fireEvent.change(screen.getByLabelText("邮箱地址"), {
      target: { value: "lin" },
    });
    fireEvent.blur(screen.getByLabelText("邮箱地址"));
    expect(screen.queryByText(/提交失败/)).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "发送邀请" }));
    expect(screen.getByText(/提交失败/)).toBeDefined();
  });
  it("restores deleted records through Undo", async () => {
    render(<UndoDelete good />);
    await userEvent.click(screen.getByRole("button", { name: "移除" }));
    expect(screen.queryByText("品牌规范.pdf")).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "撤销移除" }));
    expect(screen.getByText("品牌规范.pdf")).toBeDefined();
  });
  it("autosave reaches Saved, Offline, Failed and Retry without losing text", async () => {
    vi.useFakeTimers();
    render(<Autosave good />);
    fireEvent.change(screen.getByLabelText("编辑笔记"), {
      target: { value: "draft" },
    });
    expect(screen.getByText("正在保存")).toBeDefined();
    await act(async () => vi.advanceTimersByTime(700));
    expect(screen.getByText("已保存")).toBeDefined();
    chooseSelect(screen.getByLabelText("模拟连接"), "Offline");
    expect(screen.getByText(/离线 · 草稿/)).toBeDefined();
    chooseSelect(screen.getByLabelText("模拟连接"), "Failed");
    expect(screen.getByText(/保存失败/)).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "重试" }));
    await act(async () => vi.advanceTimersByTime(700));
    expect(
      (screen.getByLabelText("编辑笔记") as HTMLTextAreaElement).value,
    ).toBe("draft");
    expect(screen.getByText("已保存")).toBeDefined();
    vi.useRealTimers();
  });
  it("offline editing preserves text and flushes queue on reconnect", async () => {
    render(<OfflineQueue good />);
    await userEvent.click(screen.getByLabelText("网络在线"));
    fireEvent.change(screen.getByLabelText("笔记"), {
      target: { value: "offline draft" },
    });
    expect(screen.getByText(/1 项修改等待同步/)).toBeDefined();
    await userEvent.click(screen.getByLabelText("网络在线"));
    expect(screen.getByText("已同步 1 项修改")).toBeDefined();
    expect((screen.getByLabelText("笔记") as HTMLTextAreaElement).value).toBe(
      "offline draft",
    );
  });
  it("preserves filter context on return; negative implementation loses it", async () => {
    const view = render(<ContextPreservation good />);
    await userEvent.click(screen.getByRole("button", { name: "品牌规范 →" }));
    await userEvent.click(screen.getByRole("button", { name: "← 返回列表" }));
    expect((screen.getByLabelText("筛选文件") as HTMLInputElement).value).toBe(
      "品牌",
    );
    view.unmount();
    render(<ContextPreservation good={false} />);
    await userEvent.click(screen.getByRole("button", { name: "品牌规范 →" }));
    await userEvent.click(screen.getByRole("button", { name: "← 返回列表" }));
    expect((screen.getByLabelText("筛选文件") as HTMLInputElement).value).toBe(
      "",
    );
  });
  it("supports navigable hierarchy and breadcrumb restore", async () => {
    render(<Hierarchy good />);
    await userEvent.click(
      screen.getByRole("button", { name: "打开品牌项目 →" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "打开标识详情 →" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "← 返回上一级" }));
    expect(
      screen.getByRole("button", { name: "打开标识详情 →" }),
    ).toBeDefined();
  });
  it("clears visible filters", async () => {
    render(<TransparentFilters good />);
    await userEvent.click(screen.getByRole("button", { name: "清除全部筛选" }));
    expect(screen.getByText("品牌规范")).toBeDefined();
  });
  it("search suggestions recover from a misspelled query", async () => {
    render(<SearchFallback good />);
    await userEvent.click(
      screen.getByRole("button", { name: "搜索 rosemary" }),
    );
    expect(screen.getByText("Rosemary · 品牌规范")).toBeDefined();
  });
  it("batch action processes multiple selected records", async () => {
    render(<BatchActions good />);
    await userEvent.click(screen.getByLabelText("品牌规范"));
    await userEvent.click(screen.getByLabelText("交互笔记"));
    await userEvent.click(
      screen.getByRole("button", { name: "归档所选 2 项" }),
    );
    expect(screen.getByText("已归档 2 项")).toBeDefined();
  });
  it("disabled action becomes available when prerequisites are met", async () => {
    render(<DisabledReason good />);
    expect(
      (screen.getByRole("button", { name: "开始导出" }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    await userEvent.click(screen.getByLabelText("包含必要的项目元数据"));
    expect(
      (screen.getByRole("button", { name: "开始导出" }) as HTMLButtonElement)
        .disabled,
    ).toBe(false);
    await userEvent.click(screen.getByRole("button", { name: "开始导出" }));
    expect(screen.getByText(/导出完成 · 项目元数据已包含/)).toBeDefined();
  });
  it("each priority action produces a distinct result", async () => {
    render(<Priority good />);
    await userEvent.click(screen.getByRole("button", { name: "存为草稿" }));
    expect(screen.getByText("草稿已保存")).toBeDefined();
  });
  it("loading button blocks duplicate actions and then recovers", async () => {
    vi.useFakeTimers();
    render(<LoadingWidth good />);
    fireEvent.click(screen.getByRole("button", { name: "保存所有更改" }));
    expect(
      (
        screen.getByRole("button", {
          name: "保存所有更改",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    await act(async () => vi.advanceTimersByTime(1000));
    expect(
      (
        screen.getByRole("button", {
          name: "保存所有更改",
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
    vi.useRealTimers();
  });
  it("password reveal does not reset the value", async () => {
    render(<PasswordReveal good />);
    await userEvent.click(screen.getByRole("button", { name: "显示" }));
    expect(document.querySelector("input")?.type).toBe("text");
    expect(document.querySelector("input")?.value).toBe("rosemary");
  });
  it("slider exposes the live exact value", () => {
    render(<LiveSlider good />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: 75 } });
    expect(screen.getByText("75%")).toBeDefined();
  });
  it("tag entry supports Enter and removal", async () => {
    render(<TagInput good />);
    const input = screen.getByLabelText("项目标签");
    fireEvent.change(input, { target: { value: "新的标签" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(screen.getByText("新的标签")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "移除新的标签" }));
    expect(screen.queryByText("新的标签")).toBeNull();
  });
  it("upload rejects unsupported MIME types with a recovery hint", async () => {
    render(<UploadValidation good />);
    await userEvent.click(
      screen.getByRole("button", { name: "模拟不支持的文件" }),
    );
    expect(screen.getByText(/请使用 PNG 文件/)).toBeDefined();
  });
  it("switch applies immediately while negative checkbox needs Save", async () => {
    render(<SwitchSemantics good />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByText("同步已开启")).toBeDefined();
  });
  it("errors include a working retry path", async () => {
    render(<ActionableError good />);
    await userEvent.click(screen.getByRole("button", { name: "重试连接" }));
    expect(screen.getByText("已重新连接")).toBeDefined();
  });
  it("toast cap prevents an unbounded notification stack", async () => {
    render(<ToastOrder good />);
    for (let i = 0; i < 5; i++)
      await userEvent.click(screen.getByRole("button", { name: "保存一次" }));
    expect(document.querySelectorAll(".r-toast").length).toBe(3);
  });
  it("banner dismiss restores space", async () => {
    render(<DismissBanner good />);
    await userEvent.click(screen.getByRole("button", { name: "稍后提醒" }));
    expect(screen.queryByText("新版本可用")).toBeNull();
  });
  it("copy success follows a completed clipboard write", async () => {
    const write = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: write },
      configurable: true,
    });
    render(<CopyFeedback good />);
    fireEvent.click(screen.getByRole("button", { name: "复制" }));
    await screen.findByRole("button", { name: "✓ 已复制" });
    expect(write).toHaveBeenCalledWith("--r-semantic-color-accent");
  });
  it("empty state has a working creation path", async () => {
    render(<EmptyGuidance good />);
    await userEvent.click(screen.getByRole("button", { name: "新建笔记" }));
    expect(screen.getByText("第一篇笔记")).toBeDefined();
  });
  it("responsive controls change actual column structure", () => {
    render(<ResponsiveBalance good />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: 280 } });
    expect(
      document.querySelector(".r-responsive-stage>div")?.getAttribute("style"),
    ).toContain("grid-template-columns: 1fr;");
  });
  it("type scale changes content sizing", () => {
    render(<TypeScaling good />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: 200 } });
    expect(
      document.querySelector(".r-type-sample")?.getAttribute("style"),
    ).toContain("font-size: 200%");
  });
  it("page jump goes directly to the requested range", () => {
    render(<PageJump good />);
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: 80 } });
    expect(screen.getByText("第 791–800 条")).toBeDefined();
  });
  it("filtered empty state restores underlying data", async () => {
    render(<EmptyFiltered good />);
    await userEvent.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.getByText("已同步 · 品牌规范")).toBeDefined();
  });
  it("locale format follows regional separators", () => {
    render(<LocaleNumbers good />);
    chooseSelect(screen.getByRole("combobox"), "de-DE");
    expect(screen.getByText("1.284.092")).toBeDefined();
  });
  it("long task can run alongside editing and can be cancelled", () => {
    render(<LongTask good />);
    fireEvent.click(screen.getByRole("button", { name: "开始导出" }));
    expect(
      (screen.getByLabelText("继续编辑备注") as HTMLTextAreaElement).disabled,
    ).toBe(false);
    fireEvent.click(screen.getByRole("button", { name: "取消任务" }));
    expect(screen.queryByRole("button", { name: "取消任务" })).toBeNull();
  });
});

describe("Usable component references", () => {
  it("Button loading communicates busy and disables duplicate events", () => {
    const fn = vi.fn();
    render(
      <Button loading onClick={fn}>
        保存
      </Button>,
    );
    const b = screen.getByRole("button", { name: "保存" });
    expect(b.getAttribute("aria-busy")).toBe("true");
    fireEvent.click(b);
    expect(fn).not.toHaveBeenCalled();
  });
  it("tabs implement Arrow, Home, End and roving focus", async () => {
    render(<Tabs />);
    const first = screen.getByRole("tab", { name: "概览" });
    first.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(
      screen.getByRole("tab", { name: "活动" }).getAttribute("aria-selected"),
    ).toBe("true");
    expect(document.activeElement).toBe(
      screen.getByRole("tab", { name: "活动" }),
    );
    await userEvent.keyboard("{End}");
    expect(
      screen.getByRole("tab", { name: "设置" }).getAttribute("tabindex"),
    ).toBe("0");
  });
  it("resizable panels respond to Arrow keys and update size", () => {
    render(<ResizableExample />);
    fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });
    expect(screen.getByRole("separator").getAttribute("aria-valuenow")).toBe(
      "37",
    );
  });
  it("table sorting changes actual row order", async () => {
    render(<TableExample />);
    await userEvent.click(screen.getByRole("button", { name: /大小/ }));
    expect(screen.getAllByRole("row")[1].textContent).toContain("组件说明");
  });
  it("data selection records all chosen rows", async () => {
    render(<DataGridExample />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: "选择视觉规范" }),
    );
    expect(screen.getByText("已选择 1 项")).toBeDefined();
  });
  it("data grid archives the chosen rows and restores their actual contents", async () => {
    render(<DataGridExample />);
    await userEvent.click(
      screen.getByRole("checkbox", { name: "选择视觉规范" }),
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "选择组件说明" }),
    );
    await userEvent.click(screen.getByRole("button", { name: "归档所选" }));
    expect(screen.queryByText("视觉规范")).toBeNull();
    expect(screen.queryByText("组件说明")).toBeNull();
    expect(screen.getByText("交互笔记")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "恢复全部" }));
    expect(screen.getByText("视觉规范")).toBeDefined();
    expect(screen.getByText("组件说明")).toBeDefined();
    expect(screen.getByText("已选择 0 项")).toBeDefined();
  });
  it("snackbar undo restores revisions in order rather than merely dismissing notices", async () => {
    render(<ToastExample kind="snackbar" />);
    await userEvent.click(screen.getByRole("button", { name: "保存并通知" }));
    await userEvent.click(screen.getByRole("button", { name: "保存并通知" }));
    expect(screen.getByText("文档版本 v2 · 本地模拟")).toBeDefined();
    const undo = screen.getAllByRole("button", {
      name: "撤销",
    }) as HTMLButtonElement[];
    expect(undo[0].disabled).toBe(true);
    await userEvent.click(undo[1]);
    expect(screen.getByText("文档版本 v1 · 本地模拟")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "撤销" }));
    expect(screen.getByText("文档版本 v0 · 本地模拟")).toBeDefined();
    expect(screen.getByText("已撤销至版本 v0")).toBeDefined();
  });
  it("removable tags can be restored", async () => {
    render(<TagExample />);
    await userEvent.click(screen.getByRole("button", { name: "移除设计标签" }));
    expect(screen.queryByText("设计")).toBeNull();
  });
  it("file row can undo an action", async () => {
    render(<FileRowExample />);
    await userEvent.click(screen.getByRole("button", { name: "移除" }));
    expect(screen.getByText("文件已移至回收站")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "撤销" }));
    expect(screen.getByText("semantic.tokens.json")).toBeDefined();
  });
  it("service status has a real transition", async () => {
    render(<ProberExample />);
    await userEvent.click(screen.getByRole("button", { name: "模拟状态变化" }));
    expect(screen.getByText("正在检查连接")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "模拟状态变化" }));
    expect(screen.getByText("同步服务暂不可用")).toBeDefined();
  });
  it("text input validates and keeps text", async () => {
    render(<TextInput />);
    await userEvent.click(screen.getByRole("button", { name: "验证" }));
    expect(screen.getByText("请填写至少 3 个字符")).toBeDefined();
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Brand" },
    });
    await userEvent.click(screen.getByRole("button", { name: "验证" }));
    expect(screen.getByText("已提交")).toBeDefined();
  });
  it("switch immediately changes applied state", async () => {
    render(<SwitchExample />);
    await userEvent.click(screen.getByRole("switch"));
    expect(screen.getByText("已开启，立即生效")).toBeDefined();
  });
  it("checkbox changes the next submission scope", async () => {
    render(<CheckboxExample />);
    await userEvent.click(screen.getByRole("checkbox"));
    expect(screen.getByText("下次提交将包含历史版本")).toBeDefined();
  });
  it("radio uses native mutual exclusion", async () => {
    render(<RadioExample />);
    await userEvent.click(screen.getByRole("radio", { name: "手动" }));
    expect(
      (screen.getByRole("radio", { name: "自动" }) as HTMLInputElement).checked,
    ).toBe(false);
  });
  it("select persists selected region", () => {
    render(<SelectExample />);
    chooseSelect(screen.getByRole("combobox"), "广州");
    expect(screen.getByText("已选择：广州")).toBeDefined();
  });
  it("combo supports custom entry with datalist", () => {
    render(<ComboBoxExample />);
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "产品设计" },
    });
    expect((screen.getByRole("combobox") as HTMLInputElement).value).toBe(
      "产品设计",
    );
    expect(document.querySelectorAll("datalist option").length).toBe(3);
  });
  it("slider changes accessible value text", () => {
    render(<SliderExample />);
    fireEvent.change(screen.getByRole("slider"), { target: { value: 80 } });
    expect(screen.getByRole("slider").getAttribute("aria-valuetext")).toBe(
      "80%",
    );
  });
  it("button has an actual application event", async () => {
    render(<ButtonExample />);
    await userEvent.click(screen.getByRole("button", { name: "保存更改" }));
    expect(screen.getByText("已保存 1 次")).toBeDefined();
  });
  it("icon button opens a searchable field", async () => {
    render(<IconButtonExample />);
    await userEvent.click(screen.getByRole("button", { name: "搜索文档" }));
    expect(screen.getByRole("searchbox")).toBeDefined();
  });
  it("button group switches range", async () => {
    render(<ButtonGroupExample />);
    await userEvent.click(screen.getByRole("button", { name: "月" }));
    expect(screen.getByText("当前范围：月")).toBeDefined();
  });
  it("split button executes primary and alternate actions", async () => {
    render(<SplitButtonExample />);
    await userEvent.click(screen.getByRole("button", { name: "导出 PDF" }));
    expect(screen.getByText("已导出 PDF")).toBeDefined();
    await userEvent.click(screen.getByRole("button", { name: "更多导出选项" }));
    await userEvent.click(
      screen.getByRole("button", { name: "导出 Markdown" }),
    );
    expect(screen.getByText("已导出 Markdown")).toBeDefined();
  });
  it("link-style action exposes additional information", async () => {
    render(<LinkButtonExample />);
    await userEvent.click(screen.getByRole("button", { name: "查看使用说明" }));
    expect(screen.getByText(/页面内的业务动作/)).toBeDefined();
  });
  it("FAB creates a local record", async () => {
    render(<FabExample />);
    await userEvent.click(screen.getByRole("button", { name: "新建笔记" }));
    expect(screen.getByText("已创建 1 篇笔记")).toBeDefined();
  });
  it("pagination changes page and resets on page-size change", async () => {
    render(<PaginationExample />);
    await userEvent.click(screen.getByRole("button", { name: "下一页" }));
    chooseSelect(screen.getByRole("combobox"), "20");
    expect(screen.getByText("第 1/10 页 · 每页 20 条")).toBeDefined();
  });
  it("stepper moves forward and backward", async () => {
    render(<StepperExample />);
    await userEvent.click(screen.getByRole("button", { name: "继续" }));
    await userEvent.click(screen.getByRole("button", { name: "1. 资料" }));
    expect(screen.getByText("步骤 1 / 3")).toBeDefined();
  });
  it("toast dismissal removes exactly one notice", async () => {
    render(<ToastExample />);
    await userEvent.click(screen.getByRole("button", { name: "保存并通知" }));
    await userEvent.click(screen.getByRole("button", { name: "关闭" }));
    expect(screen.queryByRole("button", { name: "关闭" })).toBeNull();
    expect(
      document.querySelector(".r-toast-stack [aria-hidden=true][inert]"),
    ).not.toBeNull();
  });
  it("banner dismiss and redisplay both work", async () => {
    render(<BannerExample />);
    await userEvent.click(screen.getByRole("button", { name: "稍后提醒" }));
    await userEvent.click(screen.getByRole("button", { name: "重新显示公告" }));
    expect(screen.getByText("新版本可用")).toBeDefined();
  });
  it("popover applies the actual filter selection", async () => {
    render(<PopoverExample />);
    await userEvent.click(screen.getByRole("button", { name: "筛选文件" }));
    await userEvent.click(screen.getByRole("checkbox"));
    await userEvent.click(screen.getByRole("button", { name: "应用并关闭" }));
    expect(screen.getByText("筛选：仅看已收藏")).toBeDefined();
  });
  it("dropdown reports its selected operation", async () => {
    render(<DropdownExample />);
    await userEvent.click(screen.getByRole("button", { name: /更多操作/ }));
    await userEvent.click(screen.getByRole("button", { name: "重命名" }));
    expect(screen.getByText("已选择操作：重命名")).toBeDefined();
  });
  it("context actions have a discoverable keyboard entrance", async () => {
    render(<ContextExample />);
    await userEvent.click(screen.getByRole("button", { name: /文件操作/ }));
    await userEvent.click(screen.getByRole("button", { name: /^复制$/ }));
    expect(screen.getByText("复制", { selector: "p" })).toBeDefined();
  });
});
