package design.rosemary.compose
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
/** Android window roots create their own layout locals; preserve the host theme direction. */
@Composable internal fun RosemaryNativeDialog(onDismissRequest:()->Unit,properties:DialogProperties,content:@Composable ()->Unit){
 val direction=LocalLayoutDirection.current
 Dialog(onDismissRequest=onDismissRequest,properties=properties){CompositionLocalProvider(LocalLayoutDirection provides direction,content=content)}
}
@Composable internal fun RosemaryPopup(onDismissRequest:()->Unit,properties:PopupProperties,content:@Composable ()->Unit){
 val direction=LocalLayoutDirection.current
 Popup(onDismissRequest=onDismissRequest,properties=properties){CompositionLocalProvider(LocalLayoutDirection provides direction,content=content)}
}
