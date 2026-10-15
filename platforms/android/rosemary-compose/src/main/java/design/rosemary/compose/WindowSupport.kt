package design.rosemary.compose

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.unit.*
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties

/** Android window roots create their own layout locals; preserve the host theme direction. */
@Composable
internal fun RosemaryNativeDialog(
    onDismissRequest: () -> Unit,
    properties: DialogProperties,
    content: @Composable () -> Unit,
) {
    val direction = LocalLayoutDirection.current
    Dialog(onDismissRequest = onDismissRequest, properties = properties) {
        CompositionLocalProvider(LocalLayoutDirection provides direction, content = content)
    }
}

@Composable
internal fun RosemaryPopup(
    onDismissRequest: () -> Unit,
    properties: PopupProperties,
    content: @Composable () -> Unit,
) {
    val direction = LocalLayoutDirection.current
    val gap = with(LocalDensity.current) { 4.dp.roundToPx() }
    val position = remember(gap) { RosemaryAnchoredPopupPosition(gap) }
    Popup(
        popupPositionProvider = position,
        onDismissRequest = onDismissRequest,
        properties = properties,
    ) {
        CompositionLocalProvider(LocalLayoutDirection provides direction, content = content)
    }
}

/** Prefer below the trigger; flip above when needed and keep the popup inside the window. */
internal class RosemaryAnchoredPopupPosition(private val gap: Int) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset {
        val minX = minOf(gap, (windowSize.width - popupContentSize.width).coerceAtLeast(0))
        val minY = minOf(gap, (windowSize.height - popupContentSize.height).coerceAtLeast(0))
        val maxX = (windowSize.width - popupContentSize.width - gap).coerceAtLeast(minX)
        val maxY = (windowSize.height - popupContentSize.height - gap).coerceAtLeast(minY)
        val start =
            if (layoutDirection == LayoutDirection.Rtl) anchorBounds.right - popupContentSize.width
            else anchorBounds.left
        val below = anchorBounds.bottom + gap
        val above = anchorBounds.top - gap - popupContentSize.height
        val y =
            when {
                below <= maxY -> below
                above >= minY -> above
                else -> below.coerceIn(minY, maxY)
            }
        return IntOffset(start.coerceIn(minX, maxX), y.coerceIn(minY, maxY))
    }
}
