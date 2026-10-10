import Flutter
import UIKit

@main
@objc class AppDelegate: FlutterAppDelegate, FlutterImplicitEngineDelegate {
  private let documents=RosemaryDocuments()
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  func didInitializeImplicitFlutterEngine(_ engineBridge: FlutterImplicitEngineBridge) {
    GeneratedPluginRegistrant.register(with: engineBridge.pluginRegistry)
    FlutterMethodChannel(name:"design.rosemary/documents",binaryMessenger:engineBridge.applicationRegistrar.messenger()).setMethodCallHandler{[weak self] call,result in
      guard call.method=="choose",let self else{result(FlutterMethodNotImplemented);return}
      self.documents.choose(result)
    }
  }
}

import Flutter
import UIKit
import UniformTypeIdentifiers
final class RosemaryDocuments:NSObject,UIDocumentPickerDelegate {
 private var pending:FlutterResult?
 func choose(_ result:@escaping FlutterResult){
  guard pending==nil else{result(FlutterError(code:"busy",message:"文件选择已打开",details:nil));return}
  guard let scene=UIApplication.shared.connectedScenes.compactMap({$0 as? UIWindowScene}).first(where:{$0.activationState == .foregroundActive}),let root=scene.windows.first(where:{$0.isKeyWindow})?.rootViewController else{result(FlutterError(code:"unavailable",message:"无法打开文件选择",details:nil));return}
  var presenter=root;while let next=presenter.presentedViewController{presenter=next}
  pending=result
  let picker=UIDocumentPickerViewController(forOpeningContentTypes:[.item],asCopy:true)
  picker.allowsMultipleSelection=true;picker.delegate=self;presenter.present(picker,animated:true)
 }
 func documentPicker(_ controller:UIDocumentPickerViewController,didPickDocumentsAt urls:[URL]){let result=pending;pending=nil;result?(urls.map{["id":$0.absoluteString,"name":$0.lastPathComponent]})}
 func documentPickerWasCancelled(_ controller:UIDocumentPickerViewController){let result=pending;pending=nil;result?([])}
}
