// swift-tools-version: 5.9
import PackageDescription
let package = Package(name: "RosemaryUI", platforms: [.iOS(.v15), .macOS(.v12)],
 products: [.library(name: "RosemaryUI", targets: ["RosemaryUI"])],
 targets: [.target(name: "RosemaryUI"), .testTarget(name: "RosemaryUITests", dependencies: ["RosemaryUI"])])
