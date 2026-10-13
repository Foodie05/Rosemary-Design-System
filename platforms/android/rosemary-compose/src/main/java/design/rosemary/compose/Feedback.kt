package design.rosemary.compose

import androidx.activity.compose.BackHandler
import androidx.compose.animation.core.*
import androidx.compose.foundation.*
import androidx.compose.foundation.interaction.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.*
import androidx.compose.runtime.*
import androidx.compose.ui.*
import androidx.compose.ui.draw.*
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.semantics.*
import androidx.compose.ui.input.key.*
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.*
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.platform.LocalLayoutDirection
import android.view.WindowManager
import androidx.lifecycle.*
import kotlinx.coroutines.delay

/** Completion identity is independent of host navigation and animation. */
class RosemaryModalSession(val id:String,private val onClose:(RosemaryDismissReason)->Unit) {
 var result:RosemaryDismissReason?=null;private set
 @Synchronized fun close(sessionId:String,reason:RosemaryDismissReason):Boolean {if(sessionId!=id||result!=null)return false;result=reason;onClose(reason);return true}
}
@Composable fun RosemaryDialog(open:Boolean,title:String,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,content:@Composable ColumnScope.()->Unit) {
 val strings=LocalRosemaryStrings.current

 if(open) RosemaryNativeDialog(onDismissRequest={onDismiss(RosemaryDismissReason.Outside)},properties=DialogProperties(dismissOnBackPress=false,dismissOnClickOutside=true)) {
 BackHandler {onDismiss(RosemaryDismissReason.Back)}
 Column(modifier.widthIn(max=560.dp).heightIn(max=640.dp).verticalScroll(rememberScrollState()).background(RosemaryTheme.colors.raised,RoundedCornerShape(20.dp)).padding(24.dp).onPreviewKeyEvent{if(it.type==KeyEventType.KeyDown&&it.key==Key.Escape){onDismiss(RosemaryDismissReason.Escape);true}else false}.semantics{paneTitle=title},verticalArrangement=Arrangement.spacedBy(16.dp)){RosemaryText(title,Modifier.semantics{heading()},size=20.sp);content()}
 }
}
/** Animate toward the latest host state; reverse an in-flight transition without restarting it. */
@Composable fun RosemaryDrawer(open:Boolean,title:String,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,modal:Boolean=true,onAnimationFinished:(Boolean)->Unit={},content:@Composable ColumnScope.()->Unit) {
 val strings=LocalRosemaryStrings.current

 val reduced=RosemaryTheme.reducedMotion;val rtl=LocalLayoutDirection.current==LayoutDirection.Rtl;val latestFinished by rememberUpdatedState(onAnimationFinished)
 val fraction by animateFloatAsState(if(open)1f else 0f,tween(if(reduced)0 else if(open)220 else 180,easing=CubicBezierEasing(.2f,.7f,.2f,1f)),label="Drawer",finishedListener={latestFinished(it==1f)})
 if(open||fraction>.001f) {
 val panel:@Composable ()->Unit = {BoxWithConstraints(Modifier.fillMaxSize()){
  if(modal)Box(Modifier.fillMaxSize().background(RosemaryTheme.colors.ink.copy(alpha=.32f*fraction)).clickable{onDismiss(RosemaryDismissReason.Outside)}.semantics{contentDescription="Dismiss $title"})
  val width=minOf(maxWidth*.9f,420.dp)
  Column(modifier.align(Alignment.CenterEnd).fillMaxHeight().width(width).offset{IntOffset((width.toPx()*(1-fraction)).toInt(),0)}.background(RosemaryTheme.colors.raised).verticalScroll(rememberScrollState()).padding(24.dp).onPreviewKeyEvent{if(it.type==KeyEventType.KeyDown&&it.key==Key.Escape){onDismiss(RosemaryDismissReason.Escape);true}else false}.semantics{paneTitle=title},verticalArrangement=Arrangement.spacedBy(16.dp)){RosemaryText(title,Modifier.semantics{heading()},size=20.sp);content()}
 }}
 if(modal)RosemaryNativeDialog(onDismissRequest={onDismiss(RosemaryDismissReason.Outside)},properties=DialogProperties(usePlatformDefaultWidth=false,dismissOnBackPress=false,dismissOnClickOutside=true)){val view=LocalView.current;SideEffect{(view.parent as? DialogWindowProvider)?.window?.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)};BackHandler{onDismiss(RosemaryDismissReason.Back)};panel()}else panel()
 }
}
@Composable private fun lifecycleActive():Boolean {
 val owner=LocalLifecycleOwner.current;var active by remember(owner){mutableStateOf(owner.lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED))}
 DisposableEffect(owner){val observer=LifecycleEventObserver{_,_->active=owner.lifecycle.currentState.isAtLeast(Lifecycle.State.STARTED)};owner.lifecycle.addObserver(observer);onDispose{owner.lifecycle.removeObserver(observer)}}
 return active
}
enum class RosemaryLoadingState { Idle, Running, Completed, Cancelled, Error, Timeout }
@Composable fun RosemaryLoading(size:Dp=32.dp,label:String="Loading",modifier:Modifier=Modifier,onCancel:(()->Unit)?=null,state:RosemaryLoadingState=RosemaryLoadingState.Running,color:Color=RosemaryTheme.colors.primary) {
 val strings=LocalRosemaryStrings.current

 val c=RosemaryTheme.colors;val active=lifecycleActive();val reduced=RosemaryTheme.reducedMotion
 val phase=if(active&&!reduced&&state==RosemaryLoadingState.Running){val transition=rememberInfiniteTransition(label="Facet shuffle");transition.animateFloat(0f,1f,infiniteRepeatable(tween(1200,easing=LinearEasing)),label="Facet phase").value}else 0f
 fun interpolate(values:List<Float>):Float {val stops=listOf(0f,.2f,.45f,.7f,1f);val p=phase;val i=(0..3).firstOrNull{p<=stops[it+1]}?:3;val f=((p-stops[i])/(stops[i+1]-stops[i])).coerceIn(0f,1f);val eased=CubicBezierEasing(.42f,0f,.58f,1f).transform(f);return values[i]+(values[i+1]-values[i])*eased}
 val backAngle=interpolate(listOf(0f,-58f,0f,58f,0f));val frontAngle=-backAngle
 val backAlpha=interpolate(listOf(.4f,.4f,.67f,.51f,.4f));val frontAlpha=interpolate(listOf(1f,1f,.78f,.92f,1f))
 Row(modifier,verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(8.dp)) {
 Box(Modifier.size(size,size*1.125f).clearAndSetSemantics{}){
  @Composable fun facet(front:Boolean){Canvas(Modifier.align(AbsoluteAlignment.TopLeft).absoluteOffset(x=size*(if(front).39f else .24f),y=size*1.125f*.08f).width(size*.38f).height(size*1.125f*.84f).graphicsLayer{rotationY=if(front)frontAngle else backAngle;transformOrigin=TransformOrigin(if(front)0f else 1f,.5f);cameraDistance=size.toPx()*3.75f;alpha=if(front)frontAlpha else backAlpha}){val p=Path();if(front){p.moveTo(0f,this.size.height*.15f);p.lineTo(this.size.width,0f);p.lineTo(this.size.width,this.size.height*.85f);p.lineTo(0f,this.size.height)}else{p.moveTo(0f,0f);p.lineTo(this.size.width,this.size.height*.15f);p.lineTo(this.size.width,this.size.height);p.lineTo(0f,this.size.height*.85f)};p.close();drawPath(p,color)}}
  if(phase in .2f.. .6999f){facet(true);facet(false)}else{facet(false);facet(true)}
 }
 if(label.isNotEmpty())RosemaryText(if(label=="Loading")rString(if(state==RosemaryLoadingState.Running)"Loading"else state.name)else label,Modifier.semantics{liveRegion=LiveRegionMode.Polite;stateDescription=strings.text(state.name)});if(state==RosemaryLoadingState.Running)onCancel?.let{RosemaryButton(rString("Cancel"),it,variant=RosemaryButtonVariant.Text)}
 }
}
@Composable fun RosemaryProgress(value:Float?,max:Float=100f,label:String="Progress",modifier:Modifier=Modifier,status:String?=null,onCancel:(()->Unit)?=null,onRetry:(()->Unit)?=null) {
 val strings=LocalRosemaryStrings.current

 require(max>0&&max.isFinite());require(value==null||value.isFinite())
 val rtl=LocalLayoutDirection.current==LayoutDirection.Rtl;val c=RosemaryTheme.colors;val target=value?.div(max)?.coerceIn(0f,1f)?:1f;val reduced=RosemaryTheme.reducedMotion;val active=lifecycleActive()
 val fraction by animateFloatAsState(target,tween(if(reduced)0 else 320),label="Progress value")
 val phase=if(active&&!reduced&&(value==null||value<max)){val transition=rememberInfiniteTransition(label="Progress highlight");transition.animateFloat(-1f,1.5f,infiniteRepeatable(tween(1200,easing=LinearEasing)),label="Highlight phase").value}else -1f
 Column(modifier,verticalArrangement=Arrangement.spacedBy(8.dp)){RosemaryText(if(value!=null)"$label: ${((value/max).coerceIn(0f,1f)*100).toInt()}%"else "$label: ${status?:"In progress"}")
 Canvas(Modifier.fillMaxWidth().height(12.dp).clip(RoundedCornerShape(6.dp)).semantics{contentDescription=label;progressBarRangeInfo=if(value==null)ProgressBarRangeInfo.Indeterminate else ProgressBarRangeInfo(value.coerceIn(0f,max),0f..max);stateDescription=status?:if(value==null)"Indeterminate"else "${value.coerceIn(0f,max)} of $max"}){drawRect(c.border);clipRect(left=if(rtl)size.width*(1-fraction)else 0f,right=if(rtl)size.width else size.width*fraction){drawRect(c.primary);if(!reduced){val x=size.width*(if(rtl)1-phase else phase);drawRect(Brush.linearGradient(listOf(Color.Transparent,c.onPrimary.copy(alpha=.4f),Color.Transparent),start=androidx.compose.ui.geometry.Offset(x,0f),end=androidx.compose.ui.geometry.Offset(x+size.width*.35f,0f)))}}}
 status?.let{RosemaryText(it,color=c.muted,size=14.sp)};Row{onCancel?.let{RosemaryButton(rString("Cancel"),it,variant=RosemaryButtonVariant.Text)};onRetry?.let{RosemaryButton(rString("Retry"),it,variant=RosemaryButtonVariant.Text)}}
 }
}
@Composable fun RosemaryToast(message:String,onDismiss:(RosemaryDismissReason)->Unit,modifier:Modifier=Modifier,actionLabel:String?=null,onAction:(()->Unit)?=null,timeoutMillis:Long?=null,paused:Boolean=false) {
 val strings=LocalRosemaryStrings.current

 val source=remember{MutableInteractionSource()};val focused by source.collectIsFocusedAsState();val hovered by source.collectIsHoveredAsState();val active=lifecycleActive();val callback by rememberUpdatedState(onDismiss)
 var remaining by remember(message,timeoutMillis){mutableLongStateOf(timeoutMillis?:Long.MAX_VALUE)}
 LaunchedEffect(paused,focused,hovered,active,message,timeoutMillis){if(timeoutMillis!=null&&!paused&&!focused&&!hovered&&active){while(remaining>0){val tick=minOf(remaining,100L);delay(tick);remaining-=tick};callback(RosemaryDismissReason.Programmatic)}}
 Row(modifier.widthIn(max=480.dp).background(RosemaryTheme.colors.raised,RoundedCornerShape(12.dp)).border(1.dp,RosemaryTheme.colors.border,RoundedCornerShape(12.dp)).focusable(interactionSource=source).hoverable(source).padding(16.dp).semantics{liveRegion=LiveRegionMode.Polite},verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(8.dp)){RosemaryText(message,Modifier.weight(1f));if(actionLabel!=null&&onAction!=null)RosemaryButton(actionLabel,onAction,variant=RosemaryButtonVariant.Text);RosemaryButton(rString("Dismiss"),{onDismiss(RosemaryDismissReason.Cancel)},variant=RosemaryButtonVariant.Text)}
}
