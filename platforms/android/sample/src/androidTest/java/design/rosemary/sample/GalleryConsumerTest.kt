package design.rosemary.sample

import androidx.compose.ui.test.*
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import org.junit.Rule
import org.junit.Test

class GalleryConsumerTest {
    @get:Rule val compose = createAndroidComposeRule<MainActivity>()

    @Test
    fun publishedArtifactMountsEveryGallerySelectionAndThemes() {
        for (dark in listOf(false, true)) {
            if (dark) compose.onNodeWithText("Dark").performScrollTo().performClick()
            componentIds.forEach { id ->
                compose
                    .onNode(hasAnyAncestor(hasTestTag("gallery-selector")) and hasClickAction())
                    .performScrollTo()
                    .performClick()
                compose.onAllNodesWithText(id).onLast().performScrollTo().performClick()
                compose.waitForIdle()
            }
        }
    }
}
