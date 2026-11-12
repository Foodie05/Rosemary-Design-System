/* Client-only color workbench. Source images stay in browser memory. */
(() => {
  'use strict';
  const {icon,escape,section,table,note}=window.RosemaryUI;
  const E=window.RosemaryColors;
  const presets=[['紫藤','#614578'],['松针','#24675E'],['海湾','#167F9A'],['暖杏','#B86935'],['莓果','#AD3B72'],['晴蓝','#365CB0']];
  const labels={'navigation-active':'导航选中','surface-navigation':'导航容器','surface-topbar':'顶栏容器',canvas:'页面底色','surface-group':'内容容器','surface-inset':'内嵌容器','surface-floating':'浮层',primary:'主要操作','primary-soft':'主色柔和容器','secondary-container':'辅助容器','tertiary-container':'点缀容器'};
  const onRole={'navigation-active':'on-navigation-active','surface-navigation':'on-navigation','surface-topbar':'on-topbar',canvas:'ink','surface-group':'ink','surface-inset':'ink','surface-floating':'ink',primary:'on-primary','primary-soft':'primary','secondary-container':'on-secondary-container','tertiary-container':'on-tertiary-container'};
  let cleanup;
  function render(){
    return section('studio','Rosemary 色彩工作台',`<div class="color-studio" data-color-studio><div class="studio-intro"><div><p class="studio-eyebrow">一枚种子色，两种表达</p><h3>让每一层都有合适的颜色。</h3><p>从颜色或图片出发，同时生成深浅主题、容器与内容色，以及可检查的对比度。</p></div><a class="text-link" href="#/colors?section=recipe">了解配色机制${icon('arrow')}</a></div>
      <div class="studio-controls"><div class="studio-source"><label for="studio-hex">种子色</label><div class="studio-source-row"><input type="color" id="studio-picker" aria-label="选择种子色" value="#614578"><input type="text" id="studio-hex" value="#614578" spellcheck="false" maxlength="7" aria-describedby="studio-hex-help"></div><span id="studio-hex-help" class="field-help">完整 HEX，例如 #614578</span></div>
      <div class="studio-mood"><span id="studio-mood-label">色彩表达</span><div class="studio-moods" role="radiogroup" aria-labelledby="studio-mood-label"><button type="button" role="radio" aria-checked="true" data-tab-key="calm">沉静</button><button type="button" role="radio" aria-checked="false" data-tab-key="vivid" tabindex="-1">鲜亮</button></div><p class="field-help" data-studio-mood-copy>柔和色调，适合阅读与长时间专注。</p></div>
      <div class="studio-image"><span>从图片取色</span><label class="button secondary studio-upload" for="studio-image">${icon('upload')}选择图片<input id="studio-image" type="file" accept="image/png,image/jpeg,image/webp"></label><p class="field-help">PNG、JPEG、WebP，最大 8 MB；仅在本机处理。</p></div></div>
      <div class="studio-presets" aria-label="种子色预设">${presets.map(([name,hex])=>`<button type="button" data-studio-seed="${hex}" aria-label="使用${name}种子色" style="--seed:${hex}"><i aria-hidden="true"></i>${name}</button>`).join('')}</div><div class="studio-image-results" data-studio-image-results></div>
      <input class="studio-copy-fallback" data-studio-copy-value type="text" readonly hidden aria-label="待复制色值"><p class="studio-status" data-studio-status role="status">修改先更新下方预览，选择“应用到本站”后再改变整站颜色。</p><div class="studio-previews" data-studio-previews></div>
      <div class="studio-palette-heading"><div><h4>容器与内容，一起选择</h4><p>色块内的文字使用配对的内容色。点击色值可以复制。</p></div><div class="studio-view-switch" role="radiogroup" aria-label="查看角色色值的主题"><button type="button" role="radio" aria-checked="true" data-tab-key="light">浅色</button><button type="button" role="radio" aria-checked="false" data-tab-key="dark" tabindex="-1">深色</button></div></div><div class="studio-role-grid" data-studio-roles></div>
      <details class="studio-tones"><summary>查看完整色调阶</summary><div data-studio-tones></div></details>
      <div class="studio-footer"><p data-studio-checks></p><div class="button-row"><button type="button" class="button primary" data-studio-action="apply">应用到本站</button><button type="button" class="button secondary" data-studio-action="export">导出配色 JSON</button><button type="button" class="button quiet" data-studio-action="reset">恢复 Rosemary</button></div></div></div>`);
  }
  function recipe(){return section('recipe','从种子色到可用界面',table(['层次','Rosemary 的规则'],[['色彩来源','输入 HEX 或从本机图片提取候选种子色。种子色决定主要色相，不直接当作所有部件的背景。'],['色调阶','采用 Material Color Utilities 的 HCT 色彩计算与 sRGB 色域映射，生成主色、辅助、点缀、表面与导航色调阶。'],['两种配方','沉静使用较克制的彩度；鲜亮增强按钮和小面积重点；两种配方的大面积背景都限制彩度。浅深主题分别分配明度，仍使用同一组语义角色。'],['容器与内容色','导航、顶栏、页面、内容、内嵌、浮层各有角色；on-* 内容色成对提供。导航比正文更沉，顶栏使用较轻的辅助色调，避免两个区域都压成灰色。'],['面积与彩度','页面与内容底色 HCT 彩度不超过 6，导航不超过 10，顶栏不超过 8，柔和与辅助容器不超过 16。图片和 HEX 共用这些上限；鲜亮只增强小面积操作色。'],['状态与对比','危险、成功、警告与信息保留稳定语义色相；每次生成检查文字、焦点和编辑底线对比，低对比组合不交付为通过。'],['应用与导出','预览和应用分开。应用保存在当前浏览器；导出包括深浅角色、表现层角色、色调阶与检查结果，themes 部分保留现有 24-role 结构。']])+note('借鉴计算方法，保留 Rosemary 的设计判断','HCT 来自 <a class="text-link" href="https://github.com/material-foundation/material-color-utilities">Material Color Utilities</a>；容器角色、沉静／鲜亮配方和导航层级由 Rosemary 定义。低彩度种子色使用品牌梅紫色相补足，避免退回整页灰色。颜色对比检查不等同于整站可访问性认证。'))}
  function init(){
    cleanup?.();const root=document.querySelector('[data-color-studio]');if(!root)return;
    const abort=new AbortController();const $=s=>root.querySelector(s);const on=(node,type,fn)=>node.addEventListener(type,fn,{signal:abort.signal});
    let draft=E.preference(),scheme=E.generate(draft),view='light',disposed=false,imageVersion=0;
    const status=text=>{$('[data-studio-status]').textContent=text;};
    const css=colors=>Object.entries(colors).map(([key,value])=>`--${key}:${value}`).join(';');
    const preview=(mode,name)=>{const c=scheme.colors[mode];return `<div class="studio-preview" style="${css(c)}" data-studio-preview="${mode}"><header><span>${name}</span><span>${draft.mood==='calm'?'沉静':'鲜亮'}</span></header><div class="studio-preview-shell"><aside><strong>Forma</strong><span class="is-current">${icon('book')}记录</span><span>${icon('calendar')}安排</span><span>${icon('heart')}收藏</span></aside><div class="studio-preview-main"><p class="studio-preview-kicker">一段有序的日常</p><h4>${draft.mood==='calm'?'留一点空间，慢慢整理。':'让新的想法，清楚发光。'}</h4><article><span class="studio-preview-tag">本周</span><strong>周末的小计划</strong><p data-studio-preview-count>整理照片、散步，再读几页书。</p><button type="button" data-studio-add="${mode}">添加示例${icon('plus')}</button></article><div class="studio-preview-bottom"><span>主要内容</span><span>关联信息</span></div></div></div><div class="studio-preview-result" role="status" data-studio-preview-result></div></div>`;};
    function rolesView(){
      const c=scheme.colors[view];$('[data-studio-roles]').innerHTML=Object.entries(labels).map(([role,name])=>{const fg=onRole[role];return `<article class="studio-role" style="background:${c[role]};color:${c[fg]}"><span>${name}</span><button type="button" data-studio-copy="${c[role]}" aria-label="复制${name} ${c[role]}"><span>容器</span><strong>${c[role]}</strong></button><button type="button" data-studio-copy="${c[fg]}" aria-label="复制${name}内容色 ${c[fg]}"><span>内容</span><strong>${c[fg]}</strong></button><small>${E.contrast(c[role],c[fg]).toFixed(2)}:1 · ${fg}</small></article>`;}).join('');
      const names={primary:'主色',secondary:'辅助',tertiary:'点缀',surface:'表面',navigation:'导航'};
      $('[data-studio-tones]').innerHTML=Object.entries(scheme.palettes).map(([name,list])=>`<div class="studio-tone-row"><span>${names[name]}</span><div>${list.map(x=>`<button type="button" data-studio-copy="${x.hex}" aria-label="复制${names[name]}明度${x.tone} ${x.hex}" style="background:${x.hex};color:${E.contrast('#FFFFFF',x.hex)>E.contrast('#000000',x.hex)?'#FFFFFF':'#000000'}">${x.tone}</button>`).join('')}</div></div>`).join('');
    }
    function update(){
      scheme=E.generate(draft);$('#studio-picker').value=draft.seed;$('#studio-hex').value=draft.seed;
      root.querySelectorAll('[data-studio-seed]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.studioSeed.toUpperCase()===draft.seed.toUpperCase())));
      $('[data-studio-mood-copy]').textContent=draft.mood==='calm'?'柔和色调，适合阅读与长时间专注。':'鲜明的操作色与小面积重点；大面积容器保持柔和。';
      $('[data-studio-previews]').innerHTML=preview('light','浅色')+preview('dark','深色');rolesView();
      const checks=[...scheme.checks.light,...scheme.checks.dark];$('[data-studio-checks]').textContent=`${checks.length} 组对比检查全部通过 · 深浅主题同步生成${scheme.source.neutralFallback?' · 低彩度来源已采用品牌色相':''}`;
      $('#studio-hex').removeAttribute('aria-invalid');
    }
    const moodBinding=window.RosemaryMotion.bindRadioGroup($('.studio-moods'),{initialKey:draft.mood,onChange:key=>{draft={...draft,mood:key};update();}});
    const viewBinding=window.RosemaryMotion.bindRadioGroup($('.studio-view-switch'),{initialKey:view,onChange:key=>{view=key;rolesView();}});
    const setSeed=seed=>{imageVersion++;draft={...draft,seed:seed.toUpperCase()};update();status('预览已更新；应用到本站后，会同步更新其他页面。');};
    on($('#studio-picker'),'input',event=>setSeed(event.target.value));
    on($('#studio-hex'),'input',event=>{imageVersion++;if(/^#[\da-f]{6}$/i.test(event.target.value))setSeed(event.target.value);});
    on($('#studio-hex'),'blur',event=>{if(!/^#[\da-f]{6}$/i.test(event.target.value)){event.target.setAttribute('aria-invalid','true');status('请输入完整的六位 HEX 色值，例如 #614578。');}});
    on(root,'click',async event=>{
      const preset=event.target.closest('[data-studio-seed]');if(preset){setSeed(preset.dataset.studioSeed);return;}
      const copy=event.target.closest('[data-studio-copy]');if(copy){try{await navigator.clipboard.writeText(copy.dataset.studioCopy);if(!disposed){$('[data-studio-copy-value]').hidden=true;status('已复制 '+copy.dataset.studioCopy+'。');}}catch{if(!disposed){const fallback=$('[data-studio-copy-value]');fallback.hidden=false;fallback.value=copy.dataset.studioCopy;fallback.focus({preventScroll:true});fallback.select();status('请复制已选中的色值；当前种子色和预览保持不变。');}}return;}
      const add=event.target.closest('[data-studio-add]');if(add){const panel=add.closest('[data-studio-preview]');const count=Number(panel.dataset.count||0)+1;panel.dataset.count=String(count);panel.querySelector('[data-studio-preview-count]').textContent=`已添加 ${count} 条示例记录。`;panel.querySelector('[data-studio-preview-result]').textContent='仅用于预览颜色，未连接真实账户。';return;}
      const action=event.target.closest('[data-studio-action]')?.dataset.studioAction;
      if(['apply','export'].includes(action)&&!/^#[\da-f]{6}$/i.test($('#studio-hex').value)){status('请先修正种子色。');$('#studio-hex').focus();return;}
      if(action==='apply'){const saved=E.choose(draft);status(saved?'已应用到本站；深浅主题、组件和导航会使用这套配色。':'本页已应用；浏览器未能保存偏好。');}
      if(action==='reset'){imageVersion++;$('[data-studio-copy-value]').hidden=true;$('#studio-image').value='';$('[data-studio-image-results]').replaceChildren();E.reset();draft=E.preference();moodBinding.select(draft.mood,{animate:false});update();status('已恢复 Rosemary 默认种子色与沉静配方。');}
      if(action==='export'){const blob=new Blob([JSON.stringify(scheme,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`rosemary-${draft.mood}-${draft.seed.slice(1)}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),15000);status('已导出深浅角色、表现层角色、色调阶与对比检查结果。');}
    });
    on($('#studio-image'),'change',async event=>{
      const file=event.target.files[0],version=++imageVersion;if(!file)return;
      if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){status('请选择不超过 8 MB 的 PNG、JPEG 或 WebP 图片。');return;}
      status('正在本机提取图片颜色…');let bitmap;
      try{bitmap=await createImageBitmap(file,{resizeWidth:128,resizeHeight:128,resizeQuality:'medium'});if(disposed||version!==imageVersion)return;
        const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const ctx=canvas.getContext('2d',{willReadFrequently:true});ctx.drawImage(bitmap,0,0,64,64);const data=ctx.getImageData(0,0,64,64).data,pixels=[];
        for(let i=0;i<data.length;i+=4)if(data[i+3]>=192)pixels.push((0xff000000|(data[i]<<16)|(data[i+1]<<8)|data[i+2])>>>0);
        const candidates=E.extract(pixels);if(disposed||version!==imageVersion)return;
        $('[data-studio-image-results]').innerHTML=`<span>${candidates.fallbackUsed?'建议起点':'图片候选色'}</span>${candidates.map(hex=>`<button type="button" data-studio-seed="${hex}" aria-label="使用图片颜色 ${hex}" style="--seed:${hex}"><i aria-hidden="true"></i>${hex}</button>`).join('')}`;
        setSeed(candidates[0]);status(candidates.fallbackUsed?'图片以低彩度为主，已用 Rosemary 种子色作为起点。':'已在本机提取候选色；可以改选，也可以继续调整色彩表达。');
      }catch{if(!disposed&&version===imageVersion)status('未能读取这张图片，请换一张有效的 PNG、JPEG 或 WebP 图片。');}finally{bitmap?.close();}
    });
    update();
    cleanup=()=>{disposed=true;imageVersion++;abort.abort();moodBinding();viewBinding();cleanup=null;};
  }
  window.RosemaryColorStudio={render,recipe,init,destroy:()=>cleanup?.()};
})();
