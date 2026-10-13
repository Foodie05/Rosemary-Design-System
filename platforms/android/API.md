# Compose API 0.4.0

All values and business operations belong to the host. Internal popup visibility and drafts are transient. Every composable accepts a `Modifier`; labels are supplied by the host. Lists use stable host IDs. Disabled and busy controls do not emit activation. Callbacks do not perform networking or create a global timer.

## Theme and localization

```kotlin
RosemaryTheme(mode = RosemaryThemeMode.System, language = RosemaryLanguage.Chinese) {
  val colors = RosemaryTheme.colors.copy(primary = Color(0xFF315F9A))
  RosemaryTheme(colors = colors, reduceMotion = appReduceMotion,
    onContrastDiagnostics = { results -> report(results.filterNot { it.passes }) }) {
    RosemaryInput(name, { name = it }, label = "项目名称")
  }
}
```

`RosemaryThemeMode.Inherit` is the nested default; System follows Android dark mode. Use `direction = LayoutDirection.Rtl` for explicit RTL. Text uses sp and follows system font scaling. All 24 role values must be opaque, finite sRGB colors with channels in 0..1 (wide-gamut themes must be explicitly converted by the host); malformed roles throw an explanatory `IllegalArgumentException`. `rosemaryValidateTheme` returns all 22 shared contrast pairs and never silently recolors. The application can use the diagnostic callback for reporting. Reduced motion is the OR of ancestor, application and runtime Android animator-scale preference; an observer updates while mounted and is removed on disposal.

`RosemaryStrings` replaces internal text and `RosemaryLanguage.English/Chinese` supplies built-in labels. Consumer labels must be localized by the consumer. Local values propagate into Popup/Dialog content. Loader and progress animation pause when lifecycle is not STARTED and stop on unmount. Toast timer additionally pauses for explicit `paused`, hover and focus.

The following behavior and keyboard descriptions are shared contracts; HTML/ARIA terminology describes the Web mapping. Android uses native Compose semantics, editable text/IME, focus and accessibility actions. These descriptions are requirements, not claims of manual TalkBack certification.

## Components

### RosemaryButton

```kotlin
RosemaryButton(label: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true, busy: Boolean = false, variant: RosemaryButtonVariant = RosemaryButtonVariant.Primary, leading: (@Composable () -> Unit)? = null, trailing: (@Composable () -> Unit)? = null)
```

**Contract states:** 默认、悬停、按下、焦点、禁用、加载；完成和失败通过关联状态反馈。

**Contract events:** activate. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 一次激活执行一次。加载期间阻止重复提交，保持标签与宽度，明确成功或失败。

**Keyboard and accessibility:** Tab 聚焦；Enter / Space 激活。 使用原生 button。说明禁用原因；异步操作可使用 aria-busy。

### RosemaryLink

```kotlin
RosemaryLink(label: String, onNavigate: () -> Unit, modifier: Modifier = Modifier, current: Boolean = false)
```

**Contract states:** 默认、悬停、焦点、当前页面、已访问（适用时）。

**Contract events:** navigate. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 保留真实 href、浏览器返回和新标签页能力。

**Keyboard and accessibility:** Tab 聚焦，Enter 激活；不要把 Space 改成链接激活。 使用 a。当前位置用 aria-current，外部打开有必要时说明。

### RosemaryIconButton

```kotlin
RosemaryIconButton(label: String, onClick: () -> Unit, modifier: Modifier = Modifier, enabled: Boolean = true, pressed: Boolean = false, busy:Boolean=false, danger:Boolean=false, content: @Composable () -> Unit)
```

**Contract states:** 默认、悬停、按下、焦点、禁用、选中（若为切换）。

**Contract events:** activate, pressed-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 执行与可见标签按钮相同的动作，提示不承载必要信息。

**Keyboard and accessibility:** Tab、Enter、Space；切换型使用持续选中状态。 button 必须有 aria-label 或可见文本；装饰 SVG 隐藏。

### RosemaryInput

```kotlin
RosemaryInput(value: String, onValueChange: (String)->Unit, label: String, modifier: Modifier = Modifier, placeholder: String = "", enabled: Boolean = true, readOnly: Boolean = false, error: String? = null, keyboardOptions: KeyboardOptions = KeyboardOptions.Default, password: Boolean = false, onCommit: () -> Unit = {})
```

**Contract states:** 空、聚焦、已填、只读、禁用、错误、校验中。

**Contract events:** value-change, commit. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 提交或合适时机校验；保留输入；不要在尚未输入时连续报错。

**Keyboard and accessibility:** 原生文本编辑；Enter 是否提交由表单语义决定。 label 与 input 关联；帮助与错误通过 aria-describedby；错误用 aria-invalid。

### RosemaryTextarea

```kotlin
RosemaryTextarea(value: String,onValueChange: (String)->Unit,label: String,modifier: Modifier=Modifier,placeholder: String="",enabled: Boolean=true,readOnly: Boolean=false,error: String?=null,minLines: Int=4)
```

**Contract states:** 空、聚焦、已填、只读、禁用、错误。

**Contract events:** value-change, commit. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 支持自然换行、粘贴和中断草稿；不要通过 Enter 意外提交。

**Keyboard and accessibility:** Enter 换行；快捷提交必须有可见替代并说明。 原生 textarea 与标签；字数说明不按每个字符重复播报。

### RosemarySelect

```kotlin
RosemarySelect(value: String?,onValueChange:(String)->Unit,options:List<RosemaryOption>,label:String,modifier:Modifier=Modifier,enabled:Boolean=true,error:String?=null,onOpenChange:(Boolean)->Unit={})
```

**Contract states:** 未选择、选中、展开、聚焦、禁用、错误。

**Contract events:** value-change, open-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 默认选择不得替用户作出有重大后果的决定；变化是否立即生效要明确。

**Keyboard and accessibility:** 方向键移动，Home / End 到首尾；Enter / Space 展开或确认，Esc 取消，Tab 离开收起；支持前缀键入定位。 定制 combobox/listbox 与分组语义；当前值、选中项和展开状态同步；隐藏表单值不触发系统菜单。

### RosemarySearch

```kotlin
RosemarySearch(query:String,onQueryChange:(String)->Unit,onSubmit:()->Unit,label:String="Search",modifier:Modifier=Modifier,busy:Boolean=false,onClear:()->Unit={onQueryChange("")})
```

**Contract states:** 空、输入中、请求中、有结果、无结果、错误。

**Contract events:** query-change, submit, clear. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 明确搜索范围；异步查询取消过期结果；保留查询词。

**Keyboard and accessibility:** Enter 提交或选中结果，方向键按模式移动，Esc 关闭临时搜索。 输入有标签；结果数量适度播报，不能每个字符大量打断。

### RosemaryCheckbox

```kotlin
RosemaryCheckbox(checked:Boolean?,onCheckedChange:(Boolean)->Unit,label:String,modifier:Modifier=Modifier,enabled:Boolean=true)
```

**Contract states:** 未选、已选、部分选中、焦点、禁用、错误组。

**Contract events:** value-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 允许独立切换；全选与部分选中关系明确。

**Keyboard and accessibility:** Space 切换；Tab 按合理顺序移动。 原生 checkbox；相关组选用 fieldset/legend；部分选中同步属性。

### RosemaryRadio

```kotlin
RosemaryRadio(selected:Boolean,onSelect:()->Unit,label:String,modifier:Modifier=Modifier,enabled:Boolean=true)
```

**Contract states:** 未选、已选、焦点、禁用、组错误。

**Contract events:** value-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 同组只有一个值；必须选择时清楚说明。

**Keyboard and accessibility:** 方向键在同组中移动，Space 选择。 原生 radio，共用 name；组有 legend。

### RosemarySwitch

```kotlin
RosemarySwitch(checked:Boolean,onCheckedChange:(Boolean)->Unit,label:String,modifier:Modifier=Modifier,enabled:Boolean=true,busy:Boolean=false,error:String?=null)
```

**Contract states:** 开、关、焦点、禁用、保存中、保存失败。

**Contract events:** value-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 切换结果明确。保存失败恢复真实状态并说明，不把假成功留在界面。

**Keyboard and accessibility:** Space 切换；Tab 聚焦。 使用 role=switch 与 aria-checked，或适合的原生实现。

### RosemarySlider

```kotlin
RosemarySlider(value:Float,onValueChange:(Float)->Unit,label:String,modifier:Modifier=Modifier,range:ClosedFloatingPointRange<Float> = 0f..100f,step:Float=1f,enabled:Boolean=true,onCommit:()->Unit={})
```

**Contract states:** 默认、焦点、拖动、最小／最大、禁用。

**Contract events:** value-change, commit. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 显示当前值和单位，允许非拖拽操作。

**Keyboard and accessibility:** 方向键改变步长；Home/End 到边界。 优先 input type=range，关联 output；自定义同步 aria-valuenow 等。

### RosemaryDate

```kotlin
RosemaryDate(value:LocalDate?,onValueChange:(LocalDate)->Unit,label:String,modifier:Modifier=Modifier,time:LocalTime?=null,onTimeChange:((LocalTime)->Unit)?=null,end:LocalDate?=null,onRangeChange:((LocalDate,LocalDate)->Unit)?=null,enabled:Boolean=true,mode:RosemaryDateMode?=null,expanded:Boolean?=null,onOpenChange:(Boolean)->Unit={})
```

**Contract states:** 未选、已选、打开、输入无效、区间倒置。

**Contract events:** date-change, time-change, range-change, open-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 日期使用 YYYY-MM-DD，范围 0001–9999 年；时间使用 24 小时 HH:mm，支持每一分钟。可直接输入或定制选择；结束日期不能早于开始日期，值按本地日期与时间保留，不转换时区。

**Keyboard and accessibility:** Tab 到入口；Enter / Space 或字段 ArrowDown 打开。日历方向键移动、Home / End 到周首尾、PageUp / PageDown 换月；点击年份或月份进入专门视图，年份可直接输入跳转；Enter / Space 选日期。时间上下键选择、左右键换列、Home / End 到首尾；完成后应用。Esc 取消并返回入口，Tab 离开或点击外部收起。 带名称的非模态选择面板；日历网格与时间列表标记选中值，仅一个选项进入 Tab 顺序。保留文本输入与关联错误，不强制依靠图形选择。

### RosemaryUpload

```kotlin
RosemaryUpload(files:List<RosemaryFile>,onFilesSelected:(List<Uri>)->Unit,onRemove:(String)->Unit,modifier:Modifier=Modifier,mimeTypes:Array<String> = arrayOf("*/*"),multiple:Boolean=true,onRetry:(String)->Unit={},onCancel:(String)->Unit={})
```

**Contract states:** 未选、选择中、校验、上传中、部分成功、失败、取消。

**Contract events:** files-selected, file-removed, retry, cancel. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 上传前说明限制；逐文件反馈；保留可重试列表。

**Keyboard and accessibility:** 选择按钮可聚焦；原生文件对话框；移除操作有名称。 真实 input type=file；状态播报克制，错误按文件关联。

### RosemaryTabs

```kotlin
RosemaryTabs(value:String,onValueChange:(String)->Unit,options:List<RosemaryOption>,modifier:Modifier=Modifier)
```

**Contract states:** 未选、已选、焦点、禁用、面板加载。

**Contract events:** value-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 切换后选中与内容一致；保留必要的筛选和滚动上下文。

**Keyboard and accessibility:** 方向键移动；Home/End 首尾；激活模式与加载延迟匹配。 tablist、tab、tabpanel 与 aria-controls/labelledby，单一 tab stop。

### RosemaryBreadcrumb

```kotlin
RosemaryBreadcrumb(items:List<RosemaryOption>,onNavigate:(String)->Unit,modifier:Modifier=Modifier)
```

**Contract states:** 上级可导航、当前不可重复导航、焦点。

**Contract events:** navigate. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 保持层级含义，折叠后可访问隐藏上级。

**Keyboard and accessibility:** Tab 和 Enter；顺序与阅读顺序一致。 nav 有名称，使用有序列表，当前项 aria-current=page。

### RosemaryPagination

```kotlin
RosemaryPagination(page:Int,pages:Int,onPageChange:(Int)->Unit,modifier:Modifier=Modifier,busy:Boolean=false)
```

**Contract states:** 首页、末页、当前页、加载、失败。

**Contract events:** page-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 改变页码后说明新结果；筛选变更时处理无效页码。

**Keyboard and accessibility:** Tab、Enter；不可用方向要有可理解状态。 导航有名称，当前页 aria-current=page；结果更新适度播报。

### RosemaryMenu

```kotlin
RosemaryMenu(open:Boolean,onOpenChange:(Boolean)->Unit,items:List<RosemaryOption>,onActivate:(String)->Unit,modifier:Modifier=Modifier,trigger: @Composable ()->Unit)
```

**Contract states:** 关闭、展开、聚焦项、禁用项。

**Contract events:** activate, open-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 点外部或 Esc 关闭并合理恢复焦点；动作完成后关闭。

**Keyboard and accessibility:** 原生菜单按平台；disclosure 使用 Tab，不冒充完整 ARIA menu。 aria-expanded、控制关系；只有实现菜单键盘协议才使用 menu/menuitem。

### RosemaryTooltip

```kotlin
RosemaryTooltip(text:String,open:Boolean,onOpenChange:(Boolean)->Unit,modifier:Modifier=Modifier,trigger:@Composable ()->Unit)
```

**Contract states:** 隐藏、悬停显示、焦点显示、Esc 关闭。

**Contract events:** open-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 指针可移入提示阅读；焦点仍在触发控件。

**Keyboard and accessibility:** 聚焦可显示，Esc 可关闭；不加入额外 Tab 停点。 role=tooltip 与 aria-describedby；控件仍有独立名称。

### RosemaryPopover

```kotlin
RosemaryPopover(open:Boolean,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,trigger:@Composable ()->Unit,content:@Composable ColumnScope.()->Unit)
```

**Contract states:** 关闭、展开、输入、保存、错误。

**Contract events:** open-change, dismiss. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 明确焦点策略；不需要阻断背景时不用模态。

**Keyboard and accessibility:** Tab 可访问内容；Esc 安全关闭；保留未提交信息。 与触发器关联；按内容语义使用标题、表单等，不随意设置 dialog。

### RosemaryDialog

```kotlin
RosemaryDialog(open:Boolean,title:String,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,onAnimationFinished:(Boolean)->Unit={},content:@Composable ColumnScope.()->Unit)
```

**Contract states:** 打开、编辑、提交中、错误、关闭。

**Contract events:** open-change, dismiss. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 焦点进入模态；背景不可交互；关闭后回到入口或合理位置。

**Keyboard and accessibility:** Tab 在模态内循环，Esc 按安全规则关闭。 优先 dialog.showModal；关联标题；关闭不应丢弃未告知的数据。

### RosemaryDrawer

```kotlin
RosemaryDrawer(open:Boolean,title:String,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,modal:Boolean=true,onAnimationFinished:(Boolean)->Unit={},content:@Composable ColumnScope.()->Unit)
```

**Contract states:** 关闭、展开、加载、编辑、错误。

**Contract events:** open-change, dismiss. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 模态抽屉阻止背景交互；非模态不制造焦点陷阱；保留选择。

**Keyboard and accessibility:** 键盘可关闭和访问内容；焦点按是否模态管理。 模态可用 dialog；导航抽屉包含有名称的 nav。

### RosemaryToast

```kotlin
RosemaryToast(message:String,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,actionLabel:String?=null,onAction:(()->Unit)?=null,timeoutMillis:Long?=null,paused:Boolean=false)
```

**Contract states:** 出现、可读、关闭；连续消息应合理合并。

**Contract events:** dismiss, action. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 显示时间按内容验证；不要让必须执行的动作仅短暂出现。

**Keyboard and accessibility:** 不主动抢焦点；交互型提示要可访问并有足够时间。 普通结果使用 polite 状态播报，避免同时多个 live region 重复播报。

### RosemaryAlert

```kotlin
RosemaryAlert(message:String,tone:RosemaryTone=RosemaryTone.Info,modifier:Modifier=Modifier,action:(@Composable ()->Unit)?=null)
```

**Contract states:** 可见、处理中、恢复、失败、部分完成。

**Contract events:** action. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 错误持续到被解决或有明确处理；不要静默消失。

**Keyboard and accessibility:** 链接与修复按钮可通过键盘到达。 适当使用 status/alert；仅真正紧急的信息用打断式播报。

### RosemaryCard

```kotlin
RosemaryCard(modifier:Modifier=Modifier,selected:Boolean=false,onClick:(()->Unit)?=null,content:@Composable ColumnScope.()->Unit)
```

**Contract states:** 常规、可交互焦点、选中、加载、空、错误。

**Contract events:** activate. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 只有整个单元确实指向同一目标时才整卡可点；避免嵌套交互冲突。

**Keyboard and accessibility:** 实际动作使用按钮／链接；不把 div 改成不完整的按钮。 保留正确标题层级与链接名称。

### RosemaryList

```kotlin
RosemaryList(items:List<RosemaryListItem>,modifier:Modifier=Modifier,selected:Set<String> = emptySet(),onSelectionChange:((Set<String>)->Unit)?=null,onActivate:((String)->Unit)?=null)
```

**Contract states:** 空、有数据、选中、聚焦、加载、错误。

**Contract events:** selection-change, activate. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 主要动作稳定；拖拽排序有非拖拽替代；更新后保持合理焦点。

**Keyboard and accessibility:** Tab 访问实际动作；可选择列表根据语义采用适当协议。 使用 ul/ol；不要将普通内容列表误设为 listbox。

### RosemaryTable

```kotlin
RosemaryTable(caption:String,columns:List<RosemaryTableColumn>,rows:List<RosemaryTableRow>,modifier:Modifier=Modifier,sortColumn:String?=null,ascending:Boolean=true,onSort:((String,Boolean)->Unit)?=null,onActivate:((String)->Unit)?=null)
```

**Contract states:** 空、加载、部分数据、排序、无结果、错误。

**Contract events:** sort-change, selection-change, activate. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 排序与筛选作用范围明确；更新不使焦点丢失。

**Keyboard and accessibility:** 排序头使用按钮；复杂编辑网格另行实现键盘协议。 table、caption、th/scope；排序使用 aria-sort。

### RosemaryBadge

```kotlin
RosemaryBadge(text:String,tone:RosemaryTone=RosemaryTone.Neutral,modifier:Modifier=Modifier)
```

**Contract states:** 常规、不同语义；交互标签另有焦点和选中态。

**Contract events:** None. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 非交互标签不显示会误导点击的反馈。

**Keyboard and accessibility:** 仅交互标签可聚焦，按按钮或复选语义实现。 不要只靠颜色区分类别与状态；数量更新适度播报。

### RosemaryAvatar

```kotlin
RosemaryAvatar(name:String,modifier:Modifier=Modifier,size:Dp=40.dp,image:(@Composable ()->Unit)?=null)
```

**Contract states:** 加载、可用、图像失败、无图像。

**Contract events:** None. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 图像失败时回退，不重复请求；隐私显示遵循产品策略。

**Keyboard and accessibility:** 非交互头像不加入 Tab 顺序；入口使用真实链接／按钮。 相邻已有姓名时图像可装饰；否则提供合适替代文本。

### RosemaryEmpty

```kotlin
RosemaryEmpty(title:String,description:String,modifier:Modifier=Modifier,action:(@Composable ()->Unit)?=null)
```

**Contract states:** 不同空因不能用同一文案代替。

**Contract events:** action. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 动作必须与原因匹配；清除筛选不能伪装成创建内容。

**Keyboard and accessibility:** 行动入口可键盘使用，状态可被读取。 结构化标题和文字；装饰插画隐藏。

### RosemarySkeleton

```kotlin
RosemarySkeleton(modifier:Modifier=Modifier,width:Dp=200.dp,height:Dp=20.dp,label:String="Loading content")
```

**Contract states:** 加载、完成、失败、空；骨架不是错误状态。

**Contract events:** None. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 不模拟可点击控件；加载结束替换为真实内容或明确错误。

**Keyboard and accessibility:** 占位不进入键盘顺序。 骨架装饰层隐藏，所属区域 aria-busy，外部状态文字描述加载。

### RosemaryLoading

```kotlin
RosemaryLoading(size:Dp=32.dp,label:String="Loading",modifier:Modifier=Modifier,onCancel:(()->Unit)?=null,state:RosemaryLoadingState=RosemaryLoadingState.Running,color:Color=RosemaryTheme.colors.primary)
```

**Contract states:** 等待、运行、完成、错误、取消、超时。

**Contract events:** cancel. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 短等待避免闪现；持续任务定义取消、离开与错误路径，不无限阻塞。

**Keyboard and accessibility:** 不要把动画加入 Tab 顺序；取消按钮必须真实可用。 图形隐藏，区域 aria-busy；状态文字只在状态改变时适度播报。

### RosemaryProgress

```kotlin
RosemaryProgress(value:Float?,max:Float=100f,label:String="Progress",modifier:Modifier=Modifier,status:String?=null,onCancel:(()->Unit)?=null,onRetry:(()->Unit)?=null,state:RosemaryProgressState=RosemaryProgressState.Running)
```

**Contract states:** 未开始、进行、暂停／取消、完成、部分失败。

**Contract events:** cancel, retry. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 百分比来自真实完成量；未知时改成不确定状态，不自动增长到 99%。

**Keyboard and accessibility:** 操作按钮可键盘使用，进度本体一般不需聚焦。 优先 progress；同步 value/max 和可理解名称，减少过密播报。

### RosemaryStepper

```kotlin
RosemaryStepper(steps:List<RosemaryStep>,current:String,modifier:Modifier=Modifier,onStepChange:((String)->Unit)?=null)
```

**Contract states:** 未开始、当前、完成、错误、不可进入。

**Contract events:** step-change. Values in these events are represented by the callbacks above; consumers control business loading/error states and content slots.

**Behavior:** 进入条件、返回后保留内容和分支变化要明确。

**Keyboard and accessibility:** 仅允许进入的步骤使用链接或按钮；不能只支持点击圆点。 有序结构，当前步骤使用适当 aria-current。

## Supporting models and constraints

- `RosemaryOption(id,label,enabled,group)` is used by Select/Tabs/Menu/Breadcrumb. Select supports arrows, Home/End, typeahead, Enter, Escape, skips disabled items and restores trigger focus. Tabs use one measured indicator with 180ms interruptible position/width transitions.
- `RosemaryDateRules` validates strict YYYY-MM-DD without timezone conversion, Gregorian years 0001–9999 and HH:mm including every minute. Set `mode = RosemaryDateMode.Time` for time only, or Date/DateTime/Range explicitly. `expanded` optionally controls visibility and `onOpenChange` reports it. Date supports specialized year/month views, direct input, 44dp day cells, day-grid single Tab stop, arrows/Home/End/PageUp/PageDown/Ctrl across years, explicit Apply/Cancel. `onRangeChange` enables end-date validation; reversed ranges cannot Apply. `onTimeChange` enables hour/minute columns and direct HH:mm entry.
- `RosemaryFile` holds host upload status. Android document launchers return scoped content URIs. The host obtains/persists permitted URI access if needed, validates MIME/size, copies bytes and owns cancellation/retry. No broad file permission is requested by the library.
- `RosemaryListItem`, `RosemaryTableColumn`, `RosemaryTableRow` and `RosemaryStep` use stable host IDs. Selection and sort callbacks return IDs and values; they do not mutate host collections.
- Slider requires finite value/range/step, an increasing range and positive step. Values are clamped and steps quantized; keyboard, drag, plus/minus and accessibility setProgress are available.
- Progress requires finite values and positive finite max. Actual value/max is announced; null is indeterminate. Completed progress stops shimmer; no fake maximum below 100%.
- `RosemaryLoadingState` includes Idle/Running/Completed/Cancelled/Error/Timeout. Any nonrunning state rests in the brand pose; reduced motion rests immediately. The two facets use primary only, finite ±58° long-edge turns, 1200ms opacity and layer choreography.
- Modal Dialog uses an Android modal window; Drawer supports modal and nonmodal. Back/outside reasons are explicit, drawer enter/exit 220/180ms share scrim and panel progress, reverse on host reopen, support RTL, and report animation completion. `RosemaryModalSession` is an optional identity-bound at-most-once completion helper for host workflows.

## Validation limits

Automated Compose semantics and focus tests are not TalkBack certification. API26 and API36 CI use x86_64 devices; the local tested device is API36 ARM64. Screen reader/manual audit, signing and host business operations require application-level verification.

## Vigilo complete palette

The consumer sample bundles `design/themes/vigilo.json` as a build-time asset and loads all 24 roles with `VigiloTheme.colors(context, dark)`. Select Vigilo independently of light/dark. It does not approximate the subbrand by replacing one accent. This JSON is the same source used by the portal and shared contrast validation. Use the same host JSON loader pattern for additional projects, then pass the resulting `RosemaryColors` to `RosemaryTheme(colors = …)`.

Shared typography is consumed by `rosemaryTextStyle(role, color, size)` and `RosemaryText(role = …)`. Type size, line height and weight come from generated roles. Family identifiers map to Android system sans/serif/monospace; no proprietary font is bundled. Field editing uses the same body style. Control radii/touch targets and drawer/tabs/selection/loading/progress durations read shared component/motion data. `RosemaryProgressState` exposes Running/Idle/Paused/Cancelled/Completed/Error; only Running unfinished work animates, and actual measured value remains intact on cancellation. The sample cancels/retries by changing state.

Loading uses the shared 300ms appearance delay: a Running task completed before the delay never flashes a facet. A separately mounted Idle/Completed instance presents its static identity. Toast timeout pauses when any action descendant has focus. Dialog animates its own scrim and content over shared 260ms/160ms enter/exit durations; the scrim is not an extra keyboard Tab stop. `onAnimationFinished` reports the latest reached open/closed endpoint.

Verification emits `verification.json` and `SHA256SUMS` with actual tool versions, source inputs, Git HEAD/dirty state, artifact hashes, and device API/XML results. Dirty local development outputs are not final release evidence. Native binary and sources distributions include byte-checked MIT and brand notices.
