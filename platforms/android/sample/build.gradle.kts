plugins { id("com.android.application"); id("org.jetbrains.kotlin.android"); id("org.jetbrains.kotlin.plugin.compose") }
android {
 namespace = "design.rosemary.sample"; compileSdk = 36
 defaultConfig { applicationId = "design.rosemary.sample"; minSdk = 26; targetSdk = 36; versionCode = 1; versionName = "0.3.0-prototype.1" }
 buildFeatures { compose = true }
 compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }
 kotlinOptions { jvmTarget = "17" }
}
dependencies { implementation(project(":rosemary-compose")); implementation("androidx.activity:activity-compose:1.11.0") }
