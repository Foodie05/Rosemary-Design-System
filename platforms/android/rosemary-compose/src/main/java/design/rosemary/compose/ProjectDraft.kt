package design.rosemary.compose

/** Save completion commits its submitted snapshot; stale callbacks cannot write a newer session. */
data class ProjectDraft(
 val savedName:String="Rosemary Notes",
 val name:String=savedName,
 val busy:Boolean=false,
 val error:String?=null,
 val saveOperation:Long?=null,
 private val submittedName:String?=null,
 private val generation:Long=0
) {
 fun edit(value:String)=copy(name=value,error=null)
 fun cancel()=copy(name=savedName,busy=false,error=null,saveOperation=null,submittedName=null)
 fun beginSave()=if(busy) this else if(name.isBlank()) copy(error="请输入项目名称") else
  copy(busy=true,error=null,saveOperation=generation+1,submittedName=name,generation=generation+1)
 fun complete(success:Boolean,operation:Long)=if(!busy || operation!=saveOperation) this else
  copy(savedName=if(success) submittedName!! else savedName,busy=false,
   error=if(success) null else "保存失败，草稿已保留",saveOperation=null,submittedName=null)
}
