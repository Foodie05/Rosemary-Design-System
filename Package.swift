// swift-tools-version: 5.9
import PackageDescription

let package = Package(
  name: "RosemaryUI", platforms: [.iOS(.v17), .macOS(.v14)],
  products: [.library(name: "RosemaryUI", targets: ["RosemaryUI"])],
  targets: [
    .target(name: "RosemaryUI", path: "platforms/swiftui/Sources/RosemaryUI"),
    .testTarget(
      name: "RosemaryUITests", dependencies: ["RosemaryUI"],
      path: "platforms/swiftui/Tests/RosemaryUITests"),
  ], swiftLanguageVersions: [.v5])
