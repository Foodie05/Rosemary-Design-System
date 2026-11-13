package design.rosemary.compose

import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.*
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.key.*
import androidx.compose.ui.input.pointer.pointerInput

@Composable
internal fun Modifier.rosemaryPhysicalPress(
    source: MutableInteractionSource,
    enabled: Boolean = true,
    pressScale: Float = RosemaryInteraction.pressScale,
): Modifier {
    val held by source.collectIsPressedAsState()
    val reduce = RosemaryTheme.reducedMotion
    val scale by
        animateFloatAsState(
            if (held && enabled && !reduce) pressScale else 1f,
            if (reduce) snap()
            else
                spring(
                    dampingRatio =
                        if (held) RosemaryInteraction.pressDamping
                        else RosemaryInteraction.releaseDamping,
                    stiffness =
                        if (held) RosemaryInteraction.pressStiffness
                        else RosemaryInteraction.releaseStiffness,
                ),
            label = "Rosemary press",
        )
    return animateContentSize(
            if (reduce) snap()
            else
                tween(
                    RosemaryInteraction.layoutMs.toInt(),
                    easing = CubicBezierEasing(.2f, .8f, .2f, 1f),
                )
        )
        .graphicsLayer {
            scaleX = scale
            scaleY = scale
        }
}

/** Observe input without consuming it; native click/selection semantics remain authoritative. */
@Composable
internal fun Modifier.rosemaryPhysicalTap(enabled: Boolean = true): Modifier {
    var held by remember { mutableStateOf(false) }
    val reduce = RosemaryTheme.reducedMotion
    val scale by
        animateFloatAsState(
            if (held && enabled && !reduce) RosemaryInteraction.pressScale else 1f,
            if (reduce) snap()
            else
                spring(
                    dampingRatio =
                        if (held) RosemaryInteraction.pressDamping
                        else RosemaryInteraction.releaseDamping,
                    stiffness =
                        if (held) RosemaryInteraction.pressStiffness
                        else RosemaryInteraction.releaseStiffness,
                ),
            label = "Rosemary action press",
        )
    return graphicsLayer {
            scaleX = scale
            scaleY = scale
        }
        .pointerInput(enabled) {
            if (enabled)
                try {
                    awaitPointerEventScope {
                        while (true) {
                            val e =
                                awaitPointerEvent(
                                    androidx.compose.ui.input.pointer.PointerEventPass.Initial
                                )
                            held =
                                e.changes.any {
                                    it.pressed &&
                                        it.position.x >= 0 &&
                                        it.position.y >= 0 &&
                                        it.position.x < size.width &&
                                        it.position.y < size.height
                                }
                        }
                    }
                } finally {
                    held = false
                }
        }
        .onPreviewKeyEvent { e ->
            if (e.key == Key.Enter || e.key == Key.Spacebar) {
                held = enabled && e.type == KeyEventType.KeyDown
            }
            false
        }
        .onFocusChanged { if (!it.isFocused) held = false }
}
