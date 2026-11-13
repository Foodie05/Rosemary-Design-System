(() => {
  'use strict';
  const specification=window.ROSEMARY_INPUT_VALIDATION;
  const passwordPolicy=specification.password;
  const rule=(id,text,pass)=>({id,text,pass});
  function password(value) {
    const characters=Array.from(value);
    let letters=false,digits=false,symbols=false;
    for(const character of characters){const n=character.codePointAt(0);if(n>=65&&n<=90||n>=97&&n<=122)letters=true;else if(n>=48&&n<=57)digits=true;else if(n>=33&&n<=126)symbols=true;}
    return [
      rule('length',passwordPolicy.requirements[0],characters.length>=passwordPolicy.minLength&&characters.length<=passwordPolicy.maxLength),
      rule('characters',passwordPolicy.requirements[1],characters.length>0&&characters.every(c=>c.codePointAt(0)>=passwordPolicy.allowedCodePointMin&&c.codePointAt(0)<=passwordPolicy.allowedCodePointMax)),
      rule('categories',passwordPolicy.requirements[2],Number(letters)+Number(digits)+Number(symbols)>=passwordPolicy.minimumCategories)
    ];
  }
  function evaluate(kind,value,{max=32,min=0,step=1,after,nonblank=false}={}) {
    value=String(value);
    if(kind==='password')return password(value);
    if(kind==='name')return [rule('length',`1–${max} 个字符`,Array.from(value).length>=1&&Array.from(value).length<=max),rule('content','不能只包含空白字符',value.trim().length>0)];
    if(kind==='textLimit'){const rows=[rule('length',`最多 ${max} 个字符`,value.length<=max)];if(nonblank)rows.push(rule('content','不能只包含空白字符',value.trim().length>0));return rows;}
    if(kind==='email')return [rule('email','使用有效邮箱格式，例如 name@example.com',/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))];
    if(kind==='hex')return [rule('hex','完整的六位 HEX 色值，例如 #614578',/^#[\da-f]{6}$/i.test(value))];
    if(kind==='integer'){const n=Number(value),valid=/^-?\d+$/.test(value)&&Number.isSafeInteger(n);const rows=[rule('range',`${min}–${max} 之间的整数`,valid&&n>=min&&n<=max)];if(step>1)rows.push(rule('step',`以 ${min} 为起点，每次递增 ${step}`,valid&&(n-min)%step===0));return rows;}
    if(kind==='time')return [rule('time','24 小时制时间，格式为 HH:mm',/^([01]\d|2[0-3]):[0-5]\d$/.test(value))];
    if(kind==='date') {
      const parts=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);let valid=false;
      if(parts){const [y,m,d]=parts.slice(1).map(Number),date=new Date(0);date.setUTCHours(0,0,0,0);date.setUTCFullYear(y,m-1,d);valid=y>=1&&date.getUTCFullYear()===y&&date.getUTCMonth()===m-1&&date.getUTCDate()===d;}
      const results=[rule('date','有效日期，格式为 YYYY-MM-DD',valid)];
      if(after!==undefined){const afterValid=after!==''&&evaluate('date',after).every(r=>r.pass);results.push(rule('range','结束日期不能早于开始日期',valid&&afterValid?value>=after:null));}
      return results;
    }
    return [rule('present','填写此项后继续',value.length>0)];
  }
  function transition(previous,action,value,kind,options) {
    const focused=action==='focus'?true:action==='blur'?false:Boolean(previous?.focused);
    const armed=value!==''&&(action==='blur'||Boolean(previous?.armed));
    const results=evaluate(kind,value,options);
    return {focused,armed,status:!armed?'neutral':results.some(r=>r.pass===false)?'invalid':results.every(r=>r.pass===true)?'valid':'neutral',results};
  }
  const api={evaluate,transition,password,policy:passwordPolicy};window.RosemaryValidation=api;
  if(typeof document==='undefined')return;
  const bindings=new Map();let serial=0,scanQueued=false;
  const selector='input[data-validation],textarea[data-validation]';
  const optionsFor=input=>({max:Number(input.dataset.validationMax)|| (input.dataset.validation==='integer'&&input.max!==''?Number(input.max):input.maxLength>0?input.maxLength:32),min:Number(input.dataset.validationMin)||Number(input.min)||0,step:Number(input.step)||1,nonblank:input.required,after:input.dataset.validationAfter?document.getElementById(input.dataset.validationAfter)?.value:undefined});
  const valid=input=>input.value!==''&&evaluate(input.dataset.validation,input.value,optionsFor(input)).every(r=>r.pass);
  function formValid(form) {
    return [...form.querySelectorAll(selector)].filter(input=>!input.disabled&&!input.closest('[hidden]')).every(valid)&&[...form.querySelectorAll('[data-validation-ack]')].every(input=>input.checked);
  }
  function gate(form) {if(!form?.matches('[data-validation-gate]'))return;const allowed=formValid(form);form.querySelectorAll('[type=submit]').forEach(button=>{if(button.disabled===allowed)button.disabled=!allowed;});}
  function gateActions() {document.querySelectorAll('[data-validation-field]').forEach(button=>{const input=document.getElementById(button.dataset.validationField),allowed=Boolean(input&&valid(input));if(button.disabled===allowed)button.disabled=!allowed;});}
  function render(binding) {
    const {input,list,state}=binding;
    const signature=state.status+'|'+state.results.map(r=>state.armed?String(r.pass):'-').join();
    if(binding.signature===signature)return;
    binding.signature=signature;
    if(state.status==='neutral')input.removeAttribute('aria-invalid');else input.setAttribute('aria-invalid',String(state.status==='invalid'));
    input.dataset.validationState=state.status;
    list.setAttribute('aria-live',state.armed?'polite':'off');
    state.results.forEach((result,index)=>{
      const item=list.children[index],status=state.armed&&result.pass!==null?(result.pass?'valid':'invalid'):'neutral';
      item.dataset.state=status;
      item.querySelector('.rm-rule-icon').innerHTML=status==='neutral'?'<span class="rm-rule-dot"></span>':window.RosemaryUI.icon(status==='valid'?'check':'close');
      item.querySelector('.rm-rule-state').textContent=status==='neutral'?'要求：':status==='valid'?'已满足：':'未满足：';
    });
    document.dispatchEvent(new CustomEvent('rosemary:validation-change',{detail:{input}}));
  }
  function update(input,action) {
    const binding=bindings.get(input);if(!binding)return;
    binding.state=transition(binding.state,action,input.value,input.dataset.validation,optionsFor(input));render(binding);gate(input.form);gateActions();
  }
  function refreshDependents(input) {if(input?.id)for(const other of bindings.keys())if(other.dataset.validationAfter===input.id)update(other,'refresh');}
  function mount(input) {
    if(bindings.has(input))return;
    if(!input.id)input.id='rm-validated-field-'+(++serial);
    const list=document.createElement('ul');list.className='rm-field-rules';list.id=input.id+'-requirements';list.setAttribute('aria-label','输入要求');
    const results=evaluate(input.dataset.validation,input.value,optionsFor(input));
    list.innerHTML=results.map(result=>`<li data-state="neutral"><span class="rm-rule-icon" aria-hidden="true"></span><span class="sr-only rm-rule-state">要求：</span><span>${window.RosemaryUI.escape(result.text)}</span></li>`).join('');
    const anchor=input.closest('.cs-input-wrap,.cd-picker-input,.studio-source-row,.cd-year-jump>div')||input;
    // When a label encloses its input, keep the visible label as its accessible
    // name; the new nearby requirements are a description, not part of its name.
    const enclosing=input.closest('label');
    if(enclosing&&!input.hasAttribute('aria-label')){const copy=enclosing.cloneNode(true);copy.querySelectorAll('input,textarea,select,button,ul,.cd-help,.cd-error').forEach(node=>node.remove());input.setAttribute('aria-label',copy.textContent.trim());}
    const countRow=anchor.nextElementSibling;
    if(input.dataset.validation==='textLimit'&&countRow?.matches('.cd-between')&&countRow.querySelector('[data-cd-count]'))countRow.querySelector('.cd-help').replaceWith(list);
    else anchor.after(list);
    const described=new Set([list.id,...(input.getAttribute('aria-describedby')||'').split(/\s+/).filter(id=>id&&document.getElementById(id))]);input.setAttribute('aria-describedby',[...described].join(' '));
    const binding={input,list,state:transition(null,'initial',input.value,input.dataset.validation,optionsFor(input)),signature:null};bindings.set(input,binding);render(binding);gate(input.form);gateActions();
  }
  function scan() {
    scanQueued=false;
    for(const [input,binding]of bindings)if(!input.isConnected){binding.list.remove();bindings.delete(input);}
    document.querySelectorAll('textarea[maxlength],input[maxlength]:not([type=password])').forEach(input=>{if(!input.dataset.validation&&!input.disabled&&!input.readOnly)input.dataset.validation='textLimit';});
    document.querySelectorAll(selector).forEach(mount);
    document.querySelectorAll('form[data-validation-gate]').forEach(gate);gateActions();
  }
  const queueScan=()=>{if(!scanQueued){scanQueued=true;queueMicrotask(scan);}};
  new MutationObserver(queueScan).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-validation','data-validation-max','disabled','hidden']});
  document.addEventListener('focusin',event=>{if(bindings.has(event.target))update(event.target,'focus');},{capture:true});
  document.addEventListener('focusout',event=>{const group=event.target.closest?.('.cs-input-wrap,.cd-year-jump,.cd-picker'),input=bindings.has(event.target)?event.target:group?.querySelector('[data-validation]');if(group&&group.contains(event.relatedTarget))return;if(bindings.has(input)){update(input,'blur');refreshDependents(input);}},{capture:true});
  document.addEventListener('input',event=>{if(bindings.has(event.target)&&!event.isComposing)update(event.target,'input');refreshDependents(event.target);gate(event.target.form);},{capture:true});
  document.addEventListener('compositionend',event=>{if(bindings.has(event.target))update(event.target,'input');},{capture:true});
  document.addEventListener('change',event=>{if(bindings.has(event.target))update(event.target,'refresh');refreshDependents(event.target);gate(event.target.form);},{capture:true});
  document.addEventListener('reset',event=>queueMicrotask(()=>{event.target.querySelectorAll(selector).forEach(input=>{const binding=bindings.get(input);if(binding){binding.state=null;update(input,'initial');}});gate(event.target);}));
  api.formValid=formValid;api.isValid=valid;api.refresh=input=>update(input,'refresh');api.mountWithin=()=>scan();
  scan();
})();
