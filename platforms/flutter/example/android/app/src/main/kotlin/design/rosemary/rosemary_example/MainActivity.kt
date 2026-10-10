package design.rosemary.rosemary_example
import android.app.Activity
import android.content.Intent
import android.provider.OpenableColumns
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
 private var pending:MethodChannel.Result?=null
 override fun configureFlutterEngine(engine:FlutterEngine){
  super.configureFlutterEngine(engine)
  MethodChannel(engine.dartExecutor.binaryMessenger,"design.rosemary/documents").setMethodCallHandler{call,result->
   if(call.method!="choose"){result.notImplemented();return@setMethodCallHandler}
   if(pending!=null){result.error("busy","文件选择已打开",null);return@setMethodCallHandler}
   pending=result
   try{startActivityForResult(Intent(Intent.ACTION_OPEN_DOCUMENT).apply{type="*/*";addCategory(Intent.CATEGORY_OPENABLE);putExtra(Intent.EXTRA_ALLOW_MULTIPLE,true)},601)}
   catch(e:Exception){pending=null;result.error("unavailable","无法打开文件选择",null)}
  }
 }
 override fun onActivityResult(requestCode:Int,resultCode:Int,data:Intent?){
  super.onActivityResult(requestCode,resultCode,data)
  if(requestCode!=601)return
  val result=pending?:return;pending=null
  if(resultCode!=Activity.RESULT_OK){result.success(emptyList<Map<String,String>>());return}
  val uris= data?.clipData?.let{clip->(0 until clip.itemCount).map{clip.getItemAt(it).uri}} ?: listOfNotNull(data?.data)
  val files=uris.map{uri->
   val name=contentResolver.query(uri,arrayOf(OpenableColumns.DISPLAY_NAME),null,null,null)?.use{c->if(c.moveToFirst())c.getString(0)else "文件"}?:"文件"
   mapOf("id" to uri.toString(),"name" to name)
  }
  result.success(files)
 }
 override fun onDestroy(){pending?.error("interrupted","文件选择已中断",null);pending=null;super.onDestroy()}
}
