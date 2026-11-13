/* Rosemary's shared select surface. Native selects only hold form values. */
(() => {
  'use strict';
  const bindings=new WeakMap();
  let serial=0,opened=null;
  function mount(select) {
    if(bindings.has(select))return bindings.get(select);
    const abort=new AbortController();
    const on=(node,type,fn,options={})=>node.addEventListener(type,fn,{...options,signal:abort.signal});
    const uid=`rm-select-${++serial}`;
    const wrapper=document.createElement('span');wrapper.className='rm-select';
    const button=document.createElement('button');button.type='button';button.className=select.className+' rm-select-trigger';
    button.id=uid+'-control';button.setAttribute('role','combobox');button.setAttribute('aria-haspopup','listbox');button.setAttribute('aria-expanded','false');button.setAttribute('aria-controls',uid+'-list');
    const value=document.createElement('span');value.className='rm-select-value';
    button.append(value);button.insertAdjacentHTML('beforeend',window.RosemaryUI.icon('down'));wrapper.append(button);select.before(wrapper);
    const popup=document.createElement('div');popup.id=uid+'-list';popup.className='rm-select-list';popup.setAttribute('role','listbox');popup.hidden=true;popup.setAttribute('popover','manual');document.body.append(popup);
    const labels=[...select.labels||[]];
    const name=select.getAttribute('aria-label')||labels.map(label=>{const copy=label.cloneNode(true);copy.querySelectorAll('select,.rm-select').forEach(node=>node.remove());return copy.textContent.trim();}).join(' ')||'选择选项';
    popup.setAttribute('aria-label',name);
    const previousHidden=select.hidden,previousTabIndex=select.tabIndex;select.hidden=true;select.tabIndex=-1;select.dataset.customSelect='true';
    let cursor=-1,options=[],disposed=false,query='',queryTime=0;
    const enabled=()=>options.map((option,index)=>({option,index})).filter(item=>!item.option.disabled&&!item.option.parentElement.disabled);
    function close(restore=false,immediate=false) {
      if(opened!==api)return;
      opened=null;button.setAttribute('aria-expanded','false');button.removeAttribute('aria-activedescendant');
      popup.inert=true;popup.setAttribute('aria-hidden','true');
      const finish=()=>{if(opened===api)return;if(popup.matches(':popover-open'))popup.hidePopover();popup.hidden=true;button.removeAttribute('data-popup-open');};
      if(immediate||!window.RosemaryMotion?.surface){window.RosemaryMotion?.cancel(popup);finish();}
      else window.RosemaryMotion.surface(popup,{open:false,kind:'disclosure',onFinish:finish});
      if(restore&&button.isConnected)button.focus({preventScroll:true});
    }
    function paintTheme() {
      const style=getComputedStyle(button);
      const radius=Math.max(...[style.borderTopLeftRadius,style.borderTopRightRadius,style.borderBottomLeftRadius,style.borderBottomRightRadius].map(x=>parseFloat(x)||0))+'px';
      popup.style.setProperty('--select-radius',radius);button.style.setProperty('--select-connected-radius',radius);
      popup.style.setProperty('--select-surface',style.getPropertyValue('--field-hover')||style.backgroundColor);
      const roles=Object.keys(window.RosemaryColors?.current().colors.light||{});
      for(const role of roles){const value=style.getPropertyValue('--'+role);if(value)popup.style.setProperty('--'+role,value);}
    }
    function position() {
      if(opened!==api)return;
      if(!button.isConnected||!button.checkVisibility()){close();return;}
      const box=window.RosemaryMotion?.anchorRect(button)||button.getBoundingClientRect(),width=Math.min(box.width<100?180:box.width,innerWidth-24);
      popup.style.width=width+'px';popup.style.maxHeight='340px';
      const below=Math.max(0,innerHeight-box.bottom-12),above=Math.max(0,box.top-12);
      const desired=Math.min(340,popup.scrollHeight);
      const placement=below>=Math.min(desired,96)||below>=above?'below':'above';
      const available=placement==='below'?below:above;
      popup.style.maxHeight=Math.max(40,Math.min(340,available))+'px';
      popup.style.left=Math.max(12,Math.min(box.left,innerWidth-width-12))+'px';
      popup.dataset.placement=placement;button.dataset.popupPlacement=placement;
      popup.style.top=(placement==='below'?box.bottom:Math.max(12,box.top-popup.getBoundingClientRect().height))+'px';
    }
    function active(index) {
      cursor=index;
      popup.querySelectorAll('[role="option"]').forEach(node=>node.classList.toggle('is-active',Number(node.dataset.optionIndex)===index));
      const target=popup.querySelector(`[data-option-index="${index}"]`);
      if(target){button.setAttribute('aria-activedescendant',target.id);const top=target.offsetTop,bottom=top+target.offsetHeight;if(top<popup.scrollTop)popup.scrollTop=top;else if(bottom>popup.scrollTop+popup.clientHeight)popup.scrollTop=bottom-popup.clientHeight;}
    }
    function sync() {
      options=[...select.options];
      value.textContent=select.selectedOptions[0]?.textContent||'请选择';button.disabled=select.disabled;
      button.setAttribute('aria-label',`${name}：${value.textContent}`);
      if(select.getAttribute('aria-describedby'))button.setAttribute('aria-describedby',select.getAttribute('aria-describedby'));
      button.setAttribute('aria-invalid',select.getAttribute('aria-invalid')||'false');
      popup.replaceChildren();
      const addOption=(option,parent)=> {
        const index=options.indexOf(option),item=document.createElement('button');item.type='button';item.className='rm-select-option';item.id=uid+'-option-'+index;
        item.setAttribute('role','option');item.setAttribute('aria-selected',String(option.selected));item.dataset.optionIndex=String(index);item.tabIndex=-1;item.disabled=option.disabled||option.parentElement.disabled;item.textContent=option.textContent;
        item.insertAdjacentHTML('beforeend',window.RosemaryUI.icon('check'));parent.append(item);
      };
      for(const child of select.children) {
        if(child.tagName==='OPTGROUP') {
          const group=document.createElement('div');group.setAttribute('role','group');group.setAttribute('aria-label',child.label);
          const heading=document.createElement('p');heading.className='rm-select-group';heading.textContent=child.label;group.append(heading);
          [...child.children].forEach(option=>addOption(option,group));popup.append(group);
        } else if(child.tagName==='OPTION')addOption(child,popup);
      }
      if(opened===api){position();active(enabled().some(item=>item.index===cursor)?cursor:enabled()[0]?.index??-1);}
    }
    function open(index) {
      if(button.disabled)return;
      if(opened&&opened!==api)opened.close();
      sync();paintTheme();opened=api;popup.inert=false;popup.removeAttribute('aria-hidden');popup.hidden=false;if(popup.showPopover)popup.showPopover();button.setAttribute('aria-expanded','true');position();button.dataset.popupOpen='true';
      window.RosemaryMotion?.surface(popup,{kind:'disclosure'});
      active(index??(enabled().some(item=>item.index===select.selectedIndex)?select.selectedIndex:enabled()[0]?.index??-1));
    }
    function commit(index) {
      if(index<0||options[index]?.disabled||options[index]?.parentElement.disabled)return;
      select.selectedIndex=index;close(true);sync();
      select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}));
    }
    on(button,'click',()=>opened===api?close():open());
    on(button,'keydown',event=> {
      const items=enabled();if(!items.length)return;
      if(event.key==='Escape'&&opened===api){event.preventDefault();event.stopPropagation();close(true);return;}
      if(event.key==='Tab'){close();return;}
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
        event.preventDefault();
        if(opened!==api){open(event.key==='Home'?items[0].index:event.key==='End'?items.at(-1).index:undefined);return;}
        const current=items.findIndex(item=>item.index===cursor);
        const next=event.key==='Home'?0:event.key==='End'?items.length-1:(current+(event.key==='ArrowUp'?-1:1)+items.length)%items.length;
        active(items[next].index);
      } else if(event.key==='Enter'||event.key===' ') {
        event.preventDefault();if(!event.repeat)opened===api?commit(cursor):open();
      } else if(event.key.length===1&&!event.metaKey&&!event.ctrlKey&&!event.altKey&&!event.isComposing) {
        const now=Date.now();query=now-queryTime>900?event.key:query+event.key;queryTime=now;
        const found=items.find(item=>item.option.textContent.trim().toLocaleLowerCase().startsWith(query.toLocaleLowerCase()));
        if(found){event.preventDefault();opened===api?active(found.index):open(found.index);}
      }
    });
    on(popup,'click',event=>{const option=event.target.closest('[data-option-index]');if(option&&!option.disabled)commit(Number(option.dataset.optionIndex));});
    on(popup,'pointermove',event=>{const option=event.target.closest('[data-option-index]');if(option&&!option.disabled)active(Number(option.dataset.optionIndex));});
    on(document,'pointerdown',event=>{if(opened===api&&!wrapper.contains(event.target)&&!popup.contains(event.target))close();});
    on(document,'click',event=>{if(opened===api&&!event.composedPath().includes(wrapper)&&!event.composedPath().includes(popup))close();});
    on(document,'focusin',event=>{if(opened===api&&!wrapper.contains(event.target)&&!popup.contains(event.target))close();});
    on(document,'rosemary:layout-motion',position);on(window,'resize',position);on(document,'scroll',position,{capture:true});on(select,'change',sync);
    labels.forEach(label=>on(label,'click',event=>{if(event.target===label){event.preventDefault();button.focus();}}));
    const observer=new MutationObserver(sync);observer.observe(select,{childList:true,subtree:true,attributes:true,attributeFilter:['disabled','selected','aria-invalid']});
    const api={button,sync,close,paintTheme,destroy(){if(disposed)return;disposed=true;close(false,true);window.RosemaryMotion?.cancel(popup);abort.abort();observer.disconnect();popup.remove();wrapper.remove();select.hidden=previousHidden;select.tabIndex=previousTabIndex;delete select.dataset.customSelect;bindings.delete(select);}};
    bindings.set(select,api);sync();return api;
  }
  window.RosemarySelect={refreshAppearance(){opened?.paintTheme();},mountWithin(root){const items=[...root.querySelectorAll('select:not([data-appearance-value])')].map(mount);return()=>items.forEach(item=>item.destroy());},refresh(select){bindings.get(select)?.sync();},control(select){return bindings.get(select)?.button||select;},close(){opened?.close();}};
})();
