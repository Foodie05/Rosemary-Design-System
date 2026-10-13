plugins { id("com.android.application"); id("org.jetbrains.kotlin.android"); id("org.jetbrains.kotlin.plugin.compose") }
android {
 namespace = "design.rosemary.sample"; compileSdk = 36
 defaultConfig { applicationId = "design.rosemary.sample"; minSdk = 26; targetSdk = 36; versionCode = 4; versionName = "0.4.0"; testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner" }
 sourceSets.getByName("main").assets.srcDir(rootProject.projectDir.resolve("../../design/themes"))
 buildFeatures { compose = true }
 compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }

}
dependencies { implementation("design.rosemary:rosemary-compose:0.4.0"); implementation("androidx.activity:activity-compose:1.11.0"); debugImplementation("androidx.compose.ui:ui-tooling"); androidTestImplementation(platform("androidx.compose:compose-bom:2025.10.01")); androidTestImplementation("androidx.compose.ui:ui-test-junit4"); androidTestImplementation("androidx.test:runner:1.7.0") }

kotlin { compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) } }
