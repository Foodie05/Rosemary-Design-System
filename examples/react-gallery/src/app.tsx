import { useState } from "react";
import { createRoot } from "react-dom/client";
import * as R from "@rosemary-ui/react";
import type { ReactNode } from "react";
import type { ThemeMode } from "@rosemary-ui/tokens";
import "@rosemary-ui/react/css";
import "./gallery.css";
function Example({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      className="gallery-example"
      data-component={id}
      aria-labelledby={`example-${id}`}
    >
      <header>
        <span>{id}</span>
        <h2 id={`example-${id}`}>{title}</h2>
      </header>
      {children}
    </section>
  );
}
function Gallery() {
  const [mode, setMode] = useState<ThemeMode>("light"),
    [rtl, setRtl] = useState(false),
    [reduce, setReduce] = useState(false),
    [refuse, setRefuse] = useState(false),
    [events, setEvents] = useState<string[]>([]);
  const [name, setName] = useState("Rosemary"),
    [notes, setNotes] = useState(""),
    [query, setQuery] = useState(""),
    [choice, setChoice] = useState("forma"),
    [check, setCheck] = useState<boolean | "mixed">("mixed"),
    [radio, setRadio] = useState("a"),
    [enabled, setEnabled] = useState(false),
    [volume, setVolume] = useState(30),
    [date, setDate] = useState<string | null>("0001-01-01"),
    [time, setTime] = useState("09:30"),
    [files, setFiles] = useState<File[]>([]),
    [tab, setTab] = useState("overview"),
    [page, setPage] = useState(1),
    [menu, setMenu] = useState(false),
    [popover, setPopover] = useState(false),
    [dialog, setDialog] = useState(false),
    [drawer, setDrawer] = useState(false),
    [modal, setModal] = useState(true),
    [toast, setToast] = useState(false),
    [alert, setAlert] = useState(true),
    [progress, setProgress] = useState(40),
    [step, setStep] = useState("review"),
    [ascending, setAscending] = useState(true),
    [loading, setLoading] = useState(true);
  function change<T>(label: string, setter: (value: T) => void, value: T) {
    setEvents((old) => [`${label}: ${String(value)}`, ...old].slice(0, 8));
    if (!refuse) setter(value);
  }
  const [range, setRange] = useState<R.LocalDateRange>({
    start: "0001-01-01",
    end: "0001-01-02",
  });
  const rows = [
    { id: "forma", name: "Forma", count: 33 },
    { id: "epass", name: "epass", count: 12 },
    { id: "lilt", name: "lilt", count: 8 },
  ].sort((a, b) =>
    ascending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name),
  );
  return (
    <R.RosemaryProvider
      mode={mode}
      direction={rtl ? "rtl" : "ltr"}
      reducedMotion={reduce}
    >
      <main className="gallery-shell">
        <header className="gallery-hero">
          <div>
            <R.BrandBadge product="forma" size={64} label="Forma" />
            <span>ROSEMARY FORMA · SDK 0.4.2</span>
          </div>
          <h1>
            Components that belong
            <br />
            to your product.
          </h1>
          <p>设计规范 1.2.0。主题、可访问语义与受控行为，共享同一套约定。</p>
          <div className="gallery-controls">
            <R.Radio
              label="主题"
              value={mode}
              options={[
                { value: "light", label: "浅色" },
                { value: "dark", label: "深色" },
                { value: "system", label: "跟随系统" },
              ]}
              onValueChange={(v) => setMode(v as ThemeMode)}
            />
            <R.Checkbox label="RTL" checked={rtl} onCheckedChange={setRtl} />
            <R.Checkbox
              label="减少动态"
              checked={reduce}
              onCheckedChange={setReduce}
            />
            <R.Checkbox
              label="拒绝状态更新（验收）"
              checked={refuse}
              onCheckedChange={setRefuse}
            />
          </div>
          <output className="gallery-events" aria-live="polite">
            {events[0] ?? "操作下方组件，观察调用方状态"}
          </output>
        </header>
        <div className="gallery-grid">
          <Example id="button" title="动作">
            <R.Button onClick={() => change("button", setToast, true)}>
              保存记录
            </R.Button>
            <R.Button
              variant="secondary"
              loading={loading}
              onClick={() => change("busy", setToast, true)}
            >
              正在处理
            </R.Button>
            <R.Button variant="ghost" onClick={() => setLoading(!loading)}>
              切换加载状态
            </R.Button>
          </Example>
          <Example id="link" title="目的地">
            <R.Link href="#example-table">查看记录表</R.Link>
          </Example>
          <Example id="iconButton" title="清晰的图标动作">
            <R.IconButton
              icon="heart"
              label="收藏"
              onClick={() => change("favorite", setToast, true)}
            />
          </Example>
          <Example id="input" title="单行输入">
            <R.Input
              label="名称"
              value={name}
              onValueChange={(v) => change("input", setName, v)}
              description="公开显示的名称"
            />
          </Example>
          <Example id="textarea" title="长文本">
            <R.Textarea
              label="备注"
              value={notes}
              onValueChange={(v) => change("textarea", setNotes, v)}
              maxLength={500}
            />
          </Example>
          <Example id="select" title="自定义选择">
            <R.Select
              label="产品"
              value={choice}
              options={[
                { value: "forma", label: "Forma" },
                { value: "epass", label: "epass" },
                { value: "lilt", label: "lilt" },
                { value: "locked", label: "不可用", disabled: true },
              ]}
              onValueChange={(v) => change("select", setChoice, v)}
            />
          </Example>
          <Example id="search" title="查询">
            <R.Search
              label="查询记录"
              value={query}
              onValueChange={(v) => change("search", setQuery, v)}
              onSearch={(v) =>
                setEvents((old) => [`search submitted: ${v}`, ...old])
              }
            />
          </Example>
          <Example id="checkbox" title="三态选择">
            <R.Checkbox
              label="选择全部记录"
              checked={check}
              onCheckedChange={(v) => change("checkbox", setCheck, v)}
            />
          </Example>
          <Example id="radio" title="互斥选项">
            <R.Radio
              label="访问权限"
              value={radio}
              options={[
                { value: "a", label: "仅成员" },
                { value: "b", label: "邀请链接" },
              ]}
              onValueChange={(v) => change("radio", setRadio, v)}
            />
          </Example>
          <Example id="switch" title="立即生效">
            <span id="visible-switch-label">允许通知</span>{" "}
            <R.Switch
              label="允许通知"
              checked={enabled}
              onCheckedChange={(v) => change("switch", setEnabled, v)}
            />
          </Example>
          <Example id="slider" title="连续值">
            <R.Slider
              label="音量"
              value={volume}
              min={0}
              max={100}
              onValueChange={(v) => change("slider", setVolume, v)}
            />
          </Example>
          <Example id="date" title="公历日期与本地时间">
            <R.DatePicker
              label="日期"
              value={date}
              onValueChange={(v) => change("date", setDate, v)}
              withTime
              time={time}
              onTimeChange={(v) => change("time", setTime, v)}
            />
          </Example>
          <Example id="upload" title="文件选择与拖放">
            <p>此示例仅选择附件，不向服务端发送文件。</p>
            <R.Upload
              label="附件"
              files={files}
              accept=".txt,.pdf,image/*"
              maxSize={10485760}
              maxCount={5}
              onFilesChange={(v) => change("upload", setFiles, v)}
              onReject={(r) =>
                setEvents((old) => [
                  `upload rejected: ${r.map((f) => f.reason).join(", ")}`,
                  ...old,
                ])
              }
            />
          </Example>
          <Example id="tabs" title="同一上下文">
            <R.Tabs
              label="记录区域"
              value={tab}
              items={[
                {
                  value: "overview",
                  label: "概览",
                  content: <p>记录的整体进展。</p>,
                },
                {
                  value: "activity",
                  label: "动态",
                  content: <p>最近的活动记录。</p>,
                },
              ]}
              onValueChange={(v) => change("tabs", setTab, v)}
            />
          </Example>
          <Example id="breadcrumb" title="层级路径">
            <R.Breadcrumb
              items={[
                { label: "首页", href: "#" },
                { label: "工作空间", href: "#" },
                { label: "记录" },
              ]}
            />
          </Example>
          <Example id="pagination" title="结果页">
            <R.Pagination
              page={page}
              pageCount={12}
              onPageChange={(v) => change("pagination", setPage, v)}
            />
          </Example>
          <Example id="menu" title="一组操作">
            <R.Menu
              label="更多操作"
              open={menu}
              onOpenChange={(v) => change("menu", setMenu, v)}
              items={[
                {
                  id: "copy",
                  label: "复制链接",
                  onSelect: () => setEvents((old) => ["copied link", ...old]),
                },
                {
                  id: "disabled",
                  label: "不可用操作",
                  disabled: true,
                  onSelect: () => {},
                },
                {
                  id: "delete",
                  label: "删除",
                  danger: true,
                  onSelect: () => setDialog(true),
                },
              ]}
            />
          </Example>
          <Example id="tooltip" title="简短说明">
            <R.Tooltip content="归档后仍可恢复">
              <R.IconButton
                icon="archive"
                label="归档"
                variant="secondary"
                onClick={() => change("archive", setToast, true)}
              />
            </R.Tooltip>
          </Example>
          <Example id="popover" title="轻量补充">
            <R.Popover
              label="记录详情"
              open={popover}
              onOpenChange={(v) => change("popover", setPopover, v)}
            >
              <p>创建于 2026-10-13，本内容继承当前局部主题。</p>
              <R.Button
                variant="secondary"
                onClick={() => change("popover", setPopover, false)}
              >
                完成查看
              </R.Button>
            </R.Popover>
          </Example>
          <Example id="dialog" title="需要决定">
            <R.Button
              variant="secondary"
              onClick={() => change("dialog", setDialog, true)}
            >
              打开对话框
            </R.Button>
            <R.Dialog
              open={dialog}
              onOpenChange={(v) => change("dialog", setDialog, v)}
              title="确认归档"
              description="归档后，可以从记录列表中恢复。"
              footer={
                <>
                  <R.Button
                    variant="secondary"
                    onClick={() => change("dialog", setDialog, false)}
                  >
                    取消
                  </R.Button>
                  <R.Button
                    onClick={() => {
                      change("dialog", setDialog, false);
                      change("toast", setToast, true);
                    }}
                  >
                    确认归档
                  </R.Button>
                </>
              }
            >
              <R.Input
                label="归档说明"
                value={notes}
                onValueChange={(v) => change("notes", setNotes, v)}
              />
            </R.Dialog>
          </Example>
          <Example id="drawer" title="保持当前任务">
            <R.Button
              variant="secondary"
              onClick={() => change("drawer", setDrawer, true)}
            >
              打开抽屉
            </R.Button>
            <R.Checkbox
              label="模态抽屉"
              checked={modal}
              onCheckedChange={setModal}
            />
            <R.Drawer
              open={drawer}
              modal={modal}
              onOpenChange={(v) => change("drawer", setDrawer, v)}
              title="记录设置"
              closeOnOutside
              onAnimationComplete={(v) =>
                setEvents((old) => [`drawer animation completed: ${v}`, ...old])
              }
            >
              <R.Checkbox
                label="允许通知"
                checked={enabled}
                onCheckedChange={(v) => change("switch", setEnabled, v)}
              />
              <R.Button onClick={() => change("drawer", setDrawer, false)}>
                关闭抽屉
              </R.Button>
            </R.Drawer>
          </Example>
          <Example id="toast" title="轻量反馈">
            <R.Button
              variant="secondary"
              onClick={() => change("toast", setToast, true)}
            >
              显示提示
            </R.Button>
            <R.Toast
              open={toast}
              title="记录已保存"
              tone="success"
              onDismiss={() => change("toast", setToast, false)}
            >
              操作已经完成。
            </R.Toast>
          </Example>
          <Example id="alert" title="持续状态">
            {alert ? (
              <R.Alert
                tone="warning"
                title="需要补充信息"
                onDismiss={() => change("alert", setAlert, false)}
              >
                请检查访问权限后继续。
              </R.Alert>
            ) : (
              <R.Button
                variant="secondary"
                onClick={() => change("alert", setAlert, true)}
              >
                重新显示
              </R.Button>
            )}
          </Example>
          <Example id="card" title="内容容器">
            <R.Card>
              <R.Badge>Forma</R.Badge>
              <h3>本周计划</h3>
              <p>清晰组织内容，保留行动与状态。</p>
              <R.Button
                variant="secondary"
                onClick={() => change("card", setToast, true)}
              >
                查看计划
              </R.Button>
            </R.Card>
          </Example>
          <Example id="list" title="可扫描记录">
            <R.List
              label="记录"
              items={[
                {
                  id: "a",
                  content: "设计审核",
                  description: "今天 · 等待确认",
                  action: (
                    <R.IconButton
                      icon="arrow"
                      label="打开设计审核"
                      variant="ghost"
                      onClick={() => change("list", setDrawer, true)}
                    />
                  ),
                },
                { id: "b", content: "组件文档", description: "昨天 · 已完成" },
              ]}
            />
          </Example>
          <Example id="table" title="结构化数据">
            <R.Table
              caption="产品记录"
              columns={[
                {
                  id: "name",
                  header: "名称",
                  sortable: true,
                  render: (r) => r.name,
                },
                { id: "count", header: "控件", render: (r) => r.count },
              ]}
              rows={rows}
              rowKey={(r) => r.id}
              sort={{
                column: "name",
                direction: ascending ? "ascending" : "descending",
              }}
              onSortChange={(s) =>
                change("table", setAscending, s.direction === "ascending")
              }
            />
          </Example>
          <Example id="badge" title="附着状态">
            <R.Badge>主色</R.Badge> <R.Badge tone="success">已完成</R.Badge>{" "}
            <R.Badge tone="danger">需要处理</R.Badge>
          </Example>
          <Example id="avatar" title="身份">
            <R.Avatar name="Rosemary" /> <R.Avatar name="LI" size={48} />
          </Example>
          <Example id="empty" title="没有内容时">
            <R.Empty
              title="还没有记录"
              description="创建第一条记录，开始组织工作。"
              action={
                <R.Button onClick={() => change("empty", setDialog, true)}>
                  创建记录
                </R.Button>
              }
            />
          </Example>
          <Example id="skeleton" title="占位骨架">
            <R.Skeleton active={loading} lines={4} />
            <R.Button variant="ghost" onClick={() => setLoading(!loading)}>
              切换加载状态
            </R.Button>
          </Example>
          <Example id="loading" title="双卡片折叠">
            <R.Loading active={loading} label="正在处理" size="large" />
            <R.Button variant="ghost" onClick={() => setLoading(!loading)}>
              切换加载状态
            </R.Button>
          </Example>
          <Example id="progress" title="真实进度">
            <R.Progress label="导出进度" value={progress} />
            <p>{progress}% 已完成</p>
            <R.Button
              variant="secondary"
              onClick={() =>
                change("progress", setProgress, Math.min(100, progress + 20))
              }
            >
              推进 20%
            </R.Button>
            <R.Button
              variant="ghost"
              onClick={() => change("progress", setProgress, 0)}
            >
              重置
            </R.Button>
          </Example>
          <Example id="stepper" title="顺序任务">
            <R.Stepper
              label="发布流程"
              current={step}
              items={[
                { id: "edit", title: "编辑" },
                { id: "review", title: "审核" },
                { id: "publish", title: "发布" },
              ]}
              onStepChange={(v) => change("stepper", setStep, v)}
            />
          </Example>
        </div>
        <footer className="gallery-footer">
          <section aria-label="日期变体" className="gallery-date-variants">
            <R.TimePicker
              label="本地时间"
              value={time}
              onValueChange={(v) => change("time", setTime, v)}
            />
            <R.DateRange
              label="日期区间"
              value={range}
              onValueChange={(v) => change("range", setRange, v)}
            />
          </section>
          <R.RosemaryProvider
            mode="dark"
            colors={{
              primary: "#AAC9EF",
              onPrimary: "#253B57",
              focus: "#AAC9EF",
            }}
          >
            <div className="gallery-local">
              <R.BrandBadge product="epass" label="epass" />
              <p>局部主题，独立于主 Provider。</p>
              <R.Button onClick={() => setToast(true)}>继续</R.Button>
            </div>
          </R.RosemaryProvider>
          <p>
            所有示例使用本 SDK。真实 Safari、屏幕阅读器和真机人工验证尚未完成。
          </p>
        </footer>
      </main>
    </R.RosemaryProvider>
  );
}
function GeometryFixture() {
  const [transferFiles] = useState(() => [
    new File(["a"], "retry.txt"),
    new File(["b"], "done.txt"),
  ]);
  const [transferState, setTransferState] = useState<R.UploadFileState>({
    status: "failed",
    error: "Connection lost",
  });
  const [open, setOpen] = useState(false),
    [value, setValue] = useState("item-0"),
    [searches, setSearches] = useState(0);
  return (
    <R.RosemaryProvider language="en" reducedMotion direction="rtl">
      <div style={{ padding: 24 }}>
        <R.Tabs
          label="Mutable tabs"
          value="third"
          onValueChange={() => {}}
          items={[
            { value: "first", label: "First", content: "one" },
            { value: "second", label: "Second", content: "two" },
            { value: "third", label: "Third", content: "three" },
          ]}
        />
        <R.Progress label="Outer RTL progress" value={40} />
        <R.Pagination
          label="Outer RTL pages"
          page={2}
          pageCount={3}
          onPageChange={() => {}}
        />
        <R.RosemaryProvider direction="ltr">
          <R.Progress label="Inner LTR progress" value={40} />
          <R.Pagination
            label="Inner LTR pages"
            page={2}
            pageCount={3}
            onPageChange={() => {}}
          />
        </R.RosemaryProvider>
        <R.Search
          label="Disabled search"
          value=""
          disabled
          onValueChange={() => {}}
          onSearch={() => setSearches(searches + 1)}
        />
        <output aria-label="Search count">{searches}</output>
        <R.Upload
          label="Transfer"
          files={transferFiles}
          onFilesChange={() => {}}
          fileStates={
            new Map([
              [transferFiles[0], transferState],
              [transferFiles[1], { status: "complete" }],
            ])
          }
          onRetry={() =>
            setTransferState({ status: "uploading", progress: 45 })
          }
          onCancel={() => setTransferState({ status: "cancelled" })}
        />
        <R.Stepper
          label="Exceptional steps"
          current="error"
          items={[
            { id: "error", title: "Failed step", state: "error" },
            { id: "locked", title: "Locked step", state: "unavailable" },
          ]}
          onStepChange={() => {}}
        />
        <div style={{ position: "fixed", bottom: 8, right: 8, width: 100 }}>
          <R.Select
            label="Long list"
            value={value}
            onValueChange={setValue}
            options={Array.from({ length: 60 }, (_, i) => ({
              value: `item-${i}`,
              label: `Option ${String(i).padStart(2, "0")}`,
            }))}
          />
          <R.Menu
            label="Edge menu"
            open={open}
            onOpenChange={setOpen}
            items={Array.from({ length: 20 }, (_, i) => ({
              id: String(i),
              label: `Action ${i}`,
              onSelect: () => {},
            }))}
          />
        </div>
      </div>
    </R.RosemaryProvider>
  );
}
function FieldFixture() {
  const params = new URLSearchParams(window.location.search);
  const [value, setValue] = useState("draft");
  const [open, setOpen] = useState(false);
  return (
    <R.RosemaryProvider
      language="en"
      mode={params.get("theme") === "dark" ? "dark" : "light"}
    >
      <main
        style={{
          padding: 24,
          maxWidth: 420,
          minHeight: "100vh",
          alignContent: "start",
          display: "grid",
          gap: 16,
        }}
      >
        <h1>Field states</h1>
        <R.Input
          label="Read only"
          value="Saved record"
          readOnly
          onValueChange={() => {}}
        />
        <R.Input
          label="Unavailable"
          value="Offline"
          disabled
          onValueChange={() => {}}
        />
        <R.Textarea
          label="Unavailable notes"
          value="Offline notes"
          disabled
          onValueChange={() => {}}
        />
        <R.Input
          label="Invalid"
          value="Invalid record"
          error="Check this value"
          onValueChange={() => {}}
        />
        <R.Input
          label="Placeholder"
          value=""
          placeholder="Enter a record name"
          onValueChange={() => {}}
        />
        <R.Select
          label="Long choice"
          value={value}
          onValueChange={setValue}
          options={[
            {
              value: "draft",
              label:
                "A deliberately long record classification without truncation",
            },
            { value: "ready", label: "Ready" },
          ]}
        />
        <R.Menu
          label="More actions for this deliberately long record name"
          open={open}
          onOpenChange={setOpen}
          items={[{ id: "save", label: "Save record", onSelect: () => {} }]}
        />
      </main>
    </R.RosemaryProvider>
  );
}
createRoot(document.getElementById("root")!).render(
  window.location.search.includes("fields") ? (
    <FieldFixture />
  ) : window.location.search.includes("geometry") ? (
    <GeometryFixture />
  ) : (
    <Gallery />
  ),
);
