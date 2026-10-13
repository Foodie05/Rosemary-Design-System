plugins {
 id("com.android.library") version "8.13.2" apply false
 id("com.android.application") version "8.13.2" apply false
 id("org.jetbrains.kotlin.android") version "2.3.20" apply false
 id("org.jetbrains.kotlin.plugin.compose") version "2.3.20" apply false
}
subprojects { layout.buildDirectory.set(file("${System.getenv("ROSEMARY_BUILD_ROOT") ?: rootProject.projectDir.resolve("build").absolutePath}/android/${project.name}")) }
