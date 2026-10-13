import java.io.ByteArrayInputStream
import java.util.zip.ZipInputStream

plugins { id("com.android.library"); id("org.jetbrains.kotlin.android"); id("org.jetbrains.kotlin.plugin.compose"); id("maven-publish") }
group = "design.rosemary"
version = "0.4.0"
val sdkRoot = rootProject.projectDir.parentFile.parentFile
val licenseResource = layout.projectDirectory.file("src/main/resources/META-INF/Rosemary-LICENSE")
val brandResource = layout.projectDirectory.file("src/main/resources/META-INF/Rosemary-BRAND-ASSETS.md")
val verifyLicenseResources = tasks.register("verifyLicenseResources") {
 inputs.files(sdkRoot.resolve("LICENSE"), sdkRoot.resolve("BRAND-ASSETS.md"), licenseResource, brandResource)
 doLast {
  check(sdkRoot.resolve("LICENSE").readBytes().contentEquals(licenseResource.asFile.readBytes())) { "Packaged MIT license differs from repository LICENSE" }
  check(sdkRoot.resolve("BRAND-ASSETS.md").readBytes().contentEquals(brandResource.asFile.readBytes())) { "Packaged brand policy differs from repository BRAND-ASSETS.md" }
 }
}
android {
 namespace = "design.rosemary.compose"
 compileSdk = 36
 defaultConfig { minSdk = 26; targetSdk = 36; testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner" }
 buildFeatures { compose = true }
 compileOptions { sourceCompatibility = JavaVersion.VERSION_17; targetCompatibility = JavaVersion.VERSION_17 }

 publishing { singleVariant("release") { withSourcesJar() } }
}
tasks.named("preBuild").configure { dependsOn(verifyLicenseResources) }
tasks.withType<Jar>().configureEach {
 if (name == "sourceReleaseJar") {
  dependsOn(verifyLicenseResources)
  from(licenseResource) { into("META-INF") }
  from(brandResource) { into("META-INF") }
  duplicatesStrategy = DuplicatesStrategy.EXCLUDE
 }
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
val localMavenZip = tasks.register<Zip>("localMavenZip") {
 dependsOn("publishReleasePublicationToRosemaryLocalRepository")
 from(System.getenv("ROSEMARY_ARTIFACT_ROOT")?.let { "$it/android/maven" } ?: rootProject.layout.buildDirectory.dir("repository").get().asFile)
 from(sdkRoot.resolve("LICENSE"))
 from(sdkRoot.resolve("BRAND-ASSETS.md"))
 archiveFileName.set("rosemary-compose-0.4.0-maven.zip")
 destinationDirectory.set(file(System.getenv("ROSEMARY_ARTIFACT_ROOT")?.let { "$it/android" } ?: rootProject.layout.buildDirectory.dir("artifacts").get().asFile))
}
val verifyPackagedLicenses = tasks.register("verifyPackagedLicenses") {
 dependsOn(localMavenZip)
 doLast {
  fun entryBytes(archive: ByteArray, name: String): ByteArray {
   ZipInputStream(ByteArrayInputStream(archive)).use { zip ->
    var entry = zip.nextEntry
    while (entry != null) {
     if (entry.name == name) return zip.readBytes()
     entry = zip.nextEntry
    }
   }
   error("Packaged license entry missing: $name")
  }
  val bundle = localMavenZip.get().archiveFile.get().asFile.readBytes()
  val mavenPath = "${project.group.toString().replace('.', '/')}/rosemary-compose/${project.version}/rosemary-compose-${project.version}"
  val classes = entryBytes(entryBytes(bundle, "$mavenPath.aar"), "classes.jar")
  val sources = entryBytes(bundle, "$mavenPath-sources.jar")
  for ((name, packagedName) in listOf("LICENSE" to "Rosemary-LICENSE", "BRAND-ASSETS.md" to "Rosemary-BRAND-ASSETS.md")) {
   val expected = sdkRoot.resolve(name).readBytes()
   check(entryBytes(bundle, name).contentEquals(expected)) { "Maven ZIP $name differs" }
   check(entryBytes(classes, "META-INF/$packagedName").contentEquals(expected)) { "AAR classes.jar $name differs" }
   check(entryBytes(sources, "META-INF/$packagedName").contentEquals(expected)) { "Sources JAR $name differs" }
  }
  logger.lifecycle("AAR classes.jar, sources JAR and Maven ZIP contain byte-exact MIT and brand policy notices.")
 }
}
localMavenZip.configure { finalizedBy(verifyPackagedLicenses) }

kotlin { compilerOptions { jvmTarget.set(org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17) } }
