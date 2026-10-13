plugins { id("com.android.library"); id("org.jetbrains.kotlin.android"); id("org.jetbrains.kotlin.plugin.compose"); id("maven-publish") }
group = "design.rosemary"
version = "0.4.0"
android {
 namespace = "design.rosemary.compose"
 compileSdk = 36
 defaultConfig { minSdk = 26; targetSdk = 36; testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner" }
 buildFeatures { compose = true }
 compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }

 publishing { singleVariant("release") { withSourcesJar() } }
}
dependencies {
 api(platform("androidx.compose:compose-bom:2025.10.01"))
 api("androidx.compose.foundation:foundation")
 api("androidx.compose.ui:ui")
 api("androidx.compose.animation:animation")
 api("androidx.activity:activity-compose:1.11.0")
 testImplementation("junit:junit:4.13.2")
 androidTestImplementation(platform("androidx.compose:compose-bom:2025.10.01"))
 androidTestImplementation("androidx.compose.ui:ui-test-junit4")
 androidTestImplementation("androidx.test:runner:1.7.0")
 debugImplementation("androidx.compose.ui:ui-test-manifest")
}
afterEvaluate {
 publishing { publications { create<MavenPublication>("release") { from(components["release"]); artifactId = "rosemary-compose"; pom { name.set("Rosemary Compose"); description.set("Rosemary 1.2 design system for Android Compose"); licenses { license { name.set("MIT"); url.set("https://opensource.org/license/mit") } } } } }; repositories { maven { name = "RosemaryLocal"; url = uri(System.getenv("ROSEMARY_ARTIFACT_ROOT")?.let { "$it/android/maven" } ?: rootProject.layout.buildDirectory.dir("repository").get().asFile) } } }
}
tasks.register<Zip>("localMavenZip") {
 dependsOn("publishReleasePublicationToRosemaryLocalRepository")
 from(System.getenv("ROSEMARY_ARTIFACT_ROOT")?.let { "$it/android/maven" } ?: rootProject.layout.buildDirectory.dir("repository").get().asFile)
 archiveFileName.set("rosemary-compose-0.4.0-maven.zip")
 destinationDirectory.set(file(System.getenv("ROSEMARY_ARTIFACT_ROOT")?.let { "$it/android" } ?: rootProject.layout.buildDirectory.dir("artifacts").get().asFile))
}

kotlin { compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) } }
