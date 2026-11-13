package design.rosemary.compose

import androidx.compose.animation.core.Easing

/** Exactly the same piecewise-linear spring samples as the portal CSS. */
internal fun rosemaryDisclosureEasing(opening: Boolean): Easing = Easing { fraction ->
    val values =
        if (opening) RosemaryInteraction.disclosureEnter else RosemaryInteraction.disclosureExit
    val position = fraction.coerceIn(0f, 1f) * (values.size - 1)
    val index = position.toInt().coerceAtMost(values.size - 2)
    values[index] + (values[index + 1] - values[index]) * (position - index)
}
