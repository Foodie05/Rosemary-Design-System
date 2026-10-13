package design.rosemary.compose

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.input.key.*
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.graphics.Color
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.*
import java.time.*
import java.time.format.DateTimeFormatter
import java.time.format.ResolverStyle
import java.util.Locale

object RosemaryDateRules {
 private val formatter=DateTimeFormatter.ofPattern("uuuu-MM-dd",Locale.ROOT).withResolverStyle(ResolverStyle.STRICT)
 fun parse(value:String):LocalDate? = try { if(!Regex("[0-9]{4}-[0-9]{2}-[0-9]{2}").matches(value))null else LocalDate.parse(value,formatter).takeIf{it.year in 1..9999} }catch(_:Exception){null}
 fun format(value:LocalDate):String { require(value.year in 1..9999);return value.format(formatter) }
 fun parseTime(value:String):LocalTime? = try { if(!Regex("[0-9]{2}:[0-9]{2}").matches(value))null else LocalTime.parse(value) }catch(_:Exception){null}
 fun validRange(start:LocalDate?,end:LocalDate?):Boolean = start!=null && end!=null && !end.isBefore(start)
 fun month(year:Int,month:Int):List<LocalDate?> { require(year in 1..9999);val first=LocalDate.of(year,month,1);return List(first.dayOfWeek.value-1){null}+List(first.lengthOfMonth()){first.plusDays(it.toLong())} }
}
enum class RosemaryDateMode { Date, Time, DateTime, Range }
/** No timezone conversion. Apply emits a single complete draft; Cancel emits no value callback. */
@Composable fun RosemaryDate(value:LocalDate?,onValueChange:(LocalDate)->Unit,label:String,modifier:Modifier=Modifier,time:LocalTime?=null,onTimeChange:((LocalTime)->Unit)?=null,end:LocalDate?=null,onRangeChange:((LocalDate,LocalDate)->Unit)?=null,enabled:Boolean=true,mode:RosemaryDateMode?=null,expanded:Boolean?=null,onOpenChange:(Boolean)->Unit={}) {
 val strings=LocalRosemaryStrings.current

 var internalOpen by remember { mutableStateOf(false) };val open=expanded?:internalOpen;val actualMode=mode?:if(onRangeChange!=null)RosemaryDateMode.Range else if(onTimeChange!=null)RosemaryDateMode.DateTime else RosemaryDateMode.Date;fun setOpen(next:Boolean){internalOpen=next;onOpenChange(next)}
 Column(modifier){RosemaryText(label,size=14.sp);Box {RosemaryButton(if(actualMode==RosemaryDateMode.Time)time?.format(DateTimeFormatter.ofPattern("HH:mm"))?:rString("Choose time")else value?.let(RosemaryDateRules::format)?:rString("Choose date"),{setOpen(true)},enabled=enabled,variant=RosemaryButtonVariant.Secondary)
 if(open&&enabled) key(value,time,end,actualMode) {DatePanel(value,time,end,actualMode==RosemaryDateMode.Range,actualMode==RosemaryDateMode.Time||actualMode==RosemaryDateMode.DateTime,actualMode!=RosemaryDateMode.Time,{setOpen(false)}){date,clock,last->if(actualMode==RosemaryDateMode.Range)onRangeChange?.invoke(date,last!!)else if(actualMode!=RosemaryDateMode.Time)onValueChange(date);if(clock!=null)onTimeChange?.invoke(clock);setOpen(false)}} }
 }
}
private enum class DateView { Days, Months, Years }
@Composable private fun DatePanel(value:LocalDate?,time:LocalTime?,end:LocalDate?,range:Boolean,withTime:Boolean,withDate:Boolean,onCancel:()->Unit,onApply:(LocalDate,LocalTime?,LocalDate?)->Unit) {
 var draft by remember { mutableStateOf(value?.let(RosemaryDateRules::format)?:if(!withDate)RosemaryDateRules.format(LocalDate.now())else"") };var clock by remember { mutableStateOf(time?.format(DateTimeFormatter.ofPattern("HH:mm"))?:"00:00") };var last by remember {mutableStateOf(end?.let(RosemaryDateRules::format)?:"")}
 val initial=value?:LocalDate.now();var visible by remember {mutableStateOf(YearMonth.from(initial))};var yearInput by remember{mutableStateOf(initial.year.toString())};var view by remember{mutableStateOf(DateView.Days)};var yearPage by remember{mutableIntStateOf(((initial.year-1)/12)*12+1)}
 var focused by remember{mutableStateOf(initial)};var gridFocused by remember{mutableStateOf(false)};val focus=remember{FocusRequester()};val rtl=LocalLayoutDirection.current==LayoutDirection.Rtl
 val date=RosemaryDateRules.parse(draft);val finalDate=RosemaryDateRules.parse(last);val valid=date!=null&&(!withTime||RosemaryDateRules.parseTime(clock)!=null)&&(!range||RosemaryDateRules.validRange(date,finalDate));val c=RosemaryTheme.colors
 fun moveDate(days:Long=0,months:Long=0){val next=try{focused.plusDays(days).plusMonths(months)}catch(_:Exception){focused};if(next.year in 1..9999){focused=next;visible=YearMonth.from(next)}}
 RosemaryPopup(onDismissRequest=onCancel,properties=PopupProperties(focusable=true)){Column(Modifier.widthIn(min=320.dp,max=360.dp).heightIn(max=640.dp).verticalScroll(rememberScrollState()).background(c.raised,RoundedCornerShape(12.dp)).border(1.dp,c.border,RoundedCornerShape(12.dp)).padding(6.dp).semantics{paneTitle="Date picker"},verticalArrangement=Arrangement.spacedBy(8.dp)) {
 if(withDate){
 RosemaryInput(draft,{draft=it;RosemaryDateRules.parse(it)?.let{d->focused=d;visible=YearMonth.from(d)}},rString("Date (YYYY-MM-DD)"),error=if(draft.isNotEmpty()&&date==null)rString("Enter a valid date from 0001 to 9999")else null)
 if(range)RosemaryInput(last,{last=it},rString("End date (YYYY-MM-DD)"),error=if(last.isNotEmpty()&&!RosemaryDateRules.validRange(date,finalDate))rString("End must be on or after start")else null)
 Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){RosemaryButton("${visible.year}",{view=DateView.Years;yearPage=((visible.year-1)/12)*12+1},variant=RosemaryButtonVariant.Secondary);RosemaryButton("${visible.monthValue}",{view=DateView.Months},variant=RosemaryButtonVariant.Secondary)}
 when(view){
 DateView.Years->{RosemaryInput(yearInput,{yearInput=it;it.toIntOrNull()?.takeIf{y->y in 1..9999}?.let{y->visible=visible.withYear(y);yearPage=((y-1)/12)*12+1}},rString("Year"),error=if(yearInput.toIntOrNull() !in 1..9999)rString("Year must be 1–9999")else null);(yearPage..minOf(yearPage+11,9999)).toList().chunked(3).forEach{row->Row{row.forEach{y->RosemaryButton(y.toString(),{visible=visible.withYear(y);yearInput=y.toString();view=DateView.Months},Modifier.weight(1f).semantics{selected=y==visible.year},variant=if(y==visible.year)RosemaryButtonVariant.Primary else RosemaryButtonVariant.Text)}}};Row{RosemaryButton(rString("Previous years"),{yearPage=maxOf(1,yearPage-12)},enabled=yearPage>1,variant=RosemaryButtonVariant.Text);RosemaryButton(rString("Next years"),{yearPage=minOf(9997,yearPage+12)},enabled=yearPage+12<=9999,variant=RosemaryButtonVariant.Text)}}
 DateView.Months->{(1..12).toList().chunked(3).forEach{row->Row{row.forEach{m->RosemaryButton(m.toString(),{visible=visible.withMonth(m);view=DateView.Days},Modifier.weight(1f).semantics{selected=m==visible.monthValue},variant=if(m==visible.monthValue)RosemaryButtonVariant.Primary else RosemaryButtonVariant.Text)}}}}
 DateView.Days->{
 Row(Modifier.fillMaxWidth()){listOf("Mon","Tue","Wed","Thu","Fri","Sat","Sun").forEach{RosemaryText(rString(it),Modifier.weight(1f),size=12.sp)}}
 Column(Modifier.focusRequester(focus).onFocusChanged{gridFocused=it.isFocused}.rosemaryFocus().focusable().onPreviewKeyEvent{if(it.type!=KeyEventType.KeyDown)false else when(it.key){Key.DirectionLeft->{moveDate(days=if(rtl)1 else -1);true};Key.DirectionRight->{moveDate(days=if(rtl)-1 else 1);true};Key.DirectionUp->{moveDate(days=-7);true};Key.DirectionDown->{moveDate(days=7);true};Key.MoveHome->{moveDate(days=1L-focused.dayOfWeek.value);true};Key.MoveEnd->{moveDate(days=7L-focused.dayOfWeek.value);true};Key.PageUp->{moveDate(months=if(it.isCtrlPressed)-12 else -1);true};Key.PageDown->{moveDate(months=if(it.isCtrlPressed)12 else 1);true};Key.Enter,Key.Spacebar->{draft=RosemaryDateRules.format(focused);true};Key.Escape->{onCancel();true};else->false}}.semantics{contentDescription="Calendar ${RosemaryDateRules.format(focused)}";collectionInfo=CollectionInfo(6,7)}){
 RosemaryDateRules.month(visible.year,visible.monthValue).chunked(7).forEachIndexed {ri,week->Row(Modifier.fillMaxWidth()){(0..6).forEach{index->val cell=week.getOrNull(index);if(cell==null)Spacer(Modifier.weight(1f).height(44.dp))else Box(Modifier.weight(1f).height(44.dp).background(if(cell==date)c.primarySoft else Color.Transparent,RoundedCornerShape(4.dp)).border(if(gridFocused&&cell==focused)2.dp else 0.dp,if(gridFocused&&cell==focused)c.focus else Color.Transparent,RoundedCornerShape(4.dp)).pointerInput(cell){detectTapGestures{focused=cell;draft=RosemaryDateRules.format(cell);focus.requestFocus()}}.semantics{contentDescription=RosemaryDateRules.format(cell);selected=cell==date;role=Role.Button;collectionItemInfo=CollectionItemInfo(ri,1,index,1);onClick{focused=cell;draft=RosemaryDateRules.format(cell);true}},contentAlignment=Alignment.Center){RosemaryText(cell.dayOfMonth.toString(),color=if(cell==date)c.primary else c.ink)}}}}
 }
 Row{RosemaryButton(rString("Previous month"),{if(visible!=YearMonth.of(1,1))visible=visible.minusMonths(1)},enabled=visible!=YearMonth.of(1,1),variant=RosemaryButtonVariant.Text);RosemaryButton(rString("Next month"),{if(visible!=YearMonth.of(9999,12))visible=visible.plusMonths(1)},enabled=visible!=YearMonth.of(9999,12),variant=RosemaryButtonVariant.Text)}
 }
 }
 }
 if(withTime){RosemaryInput(clock,{clock=it},rString("Time (HH:mm)"),error=if(RosemaryDateRules.parseTime(clock)==null)rString("Enter 00:00–23:59")else null);val current=RosemaryDateRules.parseTime(clock)?:LocalTime.MIDNIGHT;val hourScroll=rememberLazyListState((current.hour-1).coerceAtLeast(0));val minuteScroll=rememberLazyListState((current.minute-1).coerceAtLeast(0));LaunchedEffect(current.hour){hourScroll.scrollToItem((current.hour-1).coerceAtLeast(0))};LaunchedEffect(current.minute){minuteScroll.scrollToItem((current.minute-1).coerceAtLeast(0))};Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){Column(Modifier.weight(1f)){RosemaryText(rString("Hours"));LazyColumn(Modifier.height(132.dp),state=hourScroll){items((0..23).toList()){hour->RosemaryButton("%02d".format(hour),{clock="%02d:%02d".format(hour,current.minute)},Modifier.fillMaxWidth().semantics{selected=hour==current.hour},variant=if(hour==current.hour)RosemaryButtonVariant.Primary else RosemaryButtonVariant.Text)}}};Column(Modifier.weight(1f)){RosemaryText(rString("Minutes"));LazyColumn(Modifier.height(132.dp),state=minuteScroll){items((0..59).toList()){minute->RosemaryButton("%02d".format(minute),{clock="%02d:%02d".format(current.hour,minute)},Modifier.fillMaxWidth().semantics{selected=minute==current.minute},variant=if(minute==current.minute)RosemaryButtonVariant.Primary else RosemaryButtonVariant.Text)}}}}}
 Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){RosemaryButton(rString("Cancel"),onCancel,variant=RosemaryButtonVariant.Secondary);RosemaryButton(rString("Apply"),{onApply(date!!,if(withTime)RosemaryDateRules.parseTime(clock)else null,if(range)finalDate else null)},enabled=valid)}
 }}
}
data class RosemaryFile(val id:String,val name:String,val progress:Float?=null,val error:String?=null)
/** Android Storage Access Framework returns scoped content URIs; the host owns copying and upload. */
@Composable fun RosemaryUpload(files:List<RosemaryFile>,onFilesSelected:(List<Uri>)->Unit,onRemove:(String)->Unit,modifier:Modifier=Modifier,mimeTypes:Array<String> = arrayOf("*/*"),multiple:Boolean=true,onRetry:(String)->Unit={},onCancel:(String)->Unit={}) {
 val strings=LocalRosemaryStrings.current

 val many=rememberLauncherForActivityResult(ActivityResultContracts.OpenMultipleDocuments()){onFilesSelected(it)}
 val single=rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()){it?.let{uri->onFilesSelected(listOf(uri))}}
 Column(modifier,verticalArrangement=Arrangement.spacedBy(8.dp)){RosemaryButton(rString("Choose files"),{if(multiple)many.launch(mimeTypes)else single.launch(mimeTypes)},variant=RosemaryButtonVariant.Secondary);files.forEach{file->RosemaryCard {RosemaryText(file.name);file.progress?.let{RosemaryProgress(it,1f,"Uploading ${file.name}")};file.error?.let{RosemaryAlert(it,RosemaryTone.Danger);RosemaryButton(rString("Retry"),{onRetry(file.id)})};Row{RosemaryButton(rString("Remove"),{onRemove(file.id)},variant=RosemaryButtonVariant.Text);if(file.progress!=null)RosemaryButton(rString("Cancel"),{onCancel(file.id)},variant=RosemaryButtonVariant.Text)}}}}
}
