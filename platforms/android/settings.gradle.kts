pluginManagement { repositories { google(); mavenCentral(); gradlePluginPortal() } }
dependencyResolutionManagement { repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS); repositories { maven { url = uri(System.getenv("ROSEMARY_ARTIFACT_ROOT")?.let { "$it/android/maven" } ?: "build/repository") }; google(); mavenCentral() } }
rootProject.name = "RosemaryAndroid"
include(":rosemary-compose", ":sample")
