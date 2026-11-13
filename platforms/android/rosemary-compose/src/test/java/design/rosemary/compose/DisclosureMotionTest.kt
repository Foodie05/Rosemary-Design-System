package design.rosemary.compose

import org.junit.Assert.*
import org.junit.Test

class DisclosureMotionTest {
    @Test
    fun curveMatchesEveryPortalSampleAndIsNotLinear() {
        for (open in listOf(true, false)) {
            val curve = rosemaryDisclosureEasing(open)
            val values =
                if (open) RosemaryInteraction.disclosureEnter
                else RosemaryInteraction.disclosureExit
            for (i in 0..40) assertEquals(values[i], curve.transform(i / 40f), .000001f)
            assertTrue(curve.transform(.25f) > .3f)
        }
    }
}
