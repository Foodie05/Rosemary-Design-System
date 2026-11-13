package design.rosemary.compose

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.*

data class RosemaryFieldRequirement(
    val id: String,
    val label: String,
    val check: (String) -> Boolean,
) {
    companion object {
        fun password(locale: String = "en"): List<RosemaryFieldRequirement> {
            val labels =
                if (locale.startsWith("zh")) RosemaryPasswordPolicy.requirements
                else
                    listOf(
                        "8–32 characters",
                        "Only English letters, digits and ASCII punctuation; no spaces",
                        "At least two of: letters, digits, punctuation",
                    )
            return listOf(
                RosemaryFieldRequirement("length", labels[0]) {
                    RosemaryPasswordPolicy.check(it).length
                },
                RosemaryFieldRequirement("characters", labels[1]) {
                    RosemaryPasswordPolicy.check(it).characters
                },
                RosemaryFieldRequirement("categories", labels[2]) {
                    RosemaryPasswordPolicy.check(it).categories
                },
            )
        }
    }
}

class RosemaryFieldValidationState {
    var armed by mutableStateOf(false)
        private set

    private var hadFocus = false

    fun focus() {
        hadFocus = true
    }

    fun edit(value: String) {
        if (value.isEmpty()) armed = false
    }

    fun blur(value: String, composing: Boolean = false) {
        if (value.isEmpty()) armed = false else if (hadFocus && !composing) armed = true
        hadFocus = false
    }
}

@Composable
internal fun FieldRequirements(
    value: String,
    rules: List<RosemaryFieldRequirement>,
    active: Boolean,
) {
    val colors = RosemaryTheme.colors
    Column(
        verticalArrangement = Arrangement.spacedBy(5.dp),
        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
    ) {
        rules.forEach { rule ->
            val pass = rule.check(value)
            Row(
                horizontalArrangement = Arrangement.spacedBy(7.dp),
                modifier =
                    Modifier.semantics(mergeDescendants = true) {
                        if (active) stateDescription = if (pass) "✓" else "✕"
                    },
            ) {
                if (active)
                    RosemaryIcon(
                        if (pass) "check" else "close",
                        Modifier.size(16.dp),
                        tint = if (pass) colors.muted else colors.danger,
                    )
                else Spacer(Modifier.size(16.dp))
                RosemaryText(
                    rule.label,
                    color = if (active && !pass) colors.danger else colors.muted,
                    size = 14.sp,
                )
            }
        }
    }
}
