package design.rosemary.compose

import android.database.ContentObserver
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.view.ViewTreeObserver
import android.view.accessibility.AccessibilityManager
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView

internal data class RosemaryPolicy(
    val reduced: Boolean = false,
    val active: Boolean = true,
    val reader: Boolean = false,
)

internal val LocalRosemaryPolicy = staticCompositionLocalOf { RosemaryPolicy() }

@Composable
internal fun rememberRosemaryPolicy(reduced: Boolean): RosemaryPolicy {
    val context = LocalContext.current
    val view = LocalView.current
    val manager =
        context.getSystemService(android.content.Context.ACCESSIBILITY_SERVICE)
            as AccessibilityManager
    var active by remember(view) { mutableStateOf(view.hasWindowFocus()) }
    var systemReduced by
        remember(context) {
            mutableStateOf(
                Settings.Global.getFloat(
                    context.contentResolver,
                    Settings.Global.ANIMATOR_DURATION_SCALE,
                    1f,
                ) == 0f,
            )
        }
    var reader by remember(manager) { mutableStateOf(manager.isTouchExplorationEnabled) }
    DisposableEffect(view, context, manager) {
        val focus = ViewTreeObserver.OnWindowFocusChangeListener { active = it }
        view.viewTreeObserver.addOnWindowFocusChangeListener(focus)
        val observer =
            object : ContentObserver(Handler(Looper.getMainLooper())) {
                override fun onChange(selfChange: Boolean) {
                    systemReduced =
                        Settings.Global.getFloat(
                            context.contentResolver,
                            Settings.Global.ANIMATOR_DURATION_SCALE,
                            1f,
                        ) == 0f
                }
            }
        context.contentResolver.registerContentObserver(
            Settings.Global.getUriFor(Settings.Global.ANIMATOR_DURATION_SCALE),
            false,
            observer,
        )
        val listener = AccessibilityManager.TouchExplorationStateChangeListener { reader = it }
        manager.addTouchExplorationStateChangeListener(listener)
        onDispose {
            if (view.viewTreeObserver.isAlive)
                view.viewTreeObserver.removeOnWindowFocusChangeListener(focus)
            context.contentResolver.unregisterContentObserver(observer)
            manager.removeTouchExplorationStateChangeListener(listener)
        }
    }
    return RosemaryPolicy(reduced || systemReduced, active, reader)
}
