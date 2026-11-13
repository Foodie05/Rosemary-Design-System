// Generated from design/input-validation.json; run pnpm design:generate.
package design.rosemary.compose

data class RosemaryPasswordResult(val length: Boolean, val characters: Boolean, val categories: Boolean) {
    val valid: Boolean get() = length && characters && categories
}
object RosemaryPasswordPolicy {
    const val minLength = 8
    const val maxLength = 32
    const val minimumCategories = 2
    val requirements: List<String> = listOf("8–32 个字符", "仅使用英文字母、数字和英文符号，不含空格", "字母、数字、英文符号中至少包含两类")
    fun check(value: String): RosemaryPasswordResult {
        val points = value.codePoints().toArray()
        val letters = points.any { it in 65..90 || it in 97..122 }
        val digits = points.any { it in 48..57 }
        val symbols = points.any { it in 33..126 && it !in 65..90 && it !in 97..122 && it !in 48..57 }
        return RosemaryPasswordResult(points.size in minLength..maxLength,
            points.isNotEmpty() && points.all { it in 33..126 },
            listOf(letters, digits, symbols).count { it } >= minimumCategories)
    }
}
