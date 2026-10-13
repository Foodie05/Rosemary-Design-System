(() => {
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const productName = name => name === 'forma' ? 'Forma' : name;
  const brandName = name => name === 'forma' ? 'Rosemary Forma' : `rosemary ${name}`;
  const icon = (name, extra = '') => `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${(window.RosemaryIconLibrary.icons[name] || window.RosemaryIconLibrary.icons.book).paths}</svg>`;
  const mark = () => `<img class="official-logo" src="${window.ROSEMARY_LOGO_DATA}" alt="" width="1000" height="1000">`;
  // Product marks share one 64-unit badge frame; each core uses a distinct solid silhouette.
  const productMarks = {
    epass:'<path class="rm-product-mark-core" fill-rule="evenodd" d="M15 48V29c0-10.5 7-17 17-17s17 6.5 17 17v19H38V30c0-4.2-2.1-7-6-7s-6 2.8-6 7v18H15Z"/>',
    lilt:'<path class="rm-product-mark-core" d="M15 26a4 4 0 0 1 8 0v16a4 4 0 0 1-8 0V26Zm13-8a4 4 0 0 1 8 0v28a4 4 0 0 1-8 0V18Zm13 5a4 4 0 0 1 8 0v18a4 4 0 0 1-8 0V23Z"/>',
    vigilo:'<rect class="rm-product-mark-core" x="14" y="15" width="34" height="15" rx="5"/><rect class="rm-product-mark-core rm-product-mark-layer" x="18" y="34" width="32" height="15" rx="5"/><circle class="rm-product-mark-cutout" cx="22" cy="22.5" r="3"/><path class="rm-product-mark-cutout" d="M29 20h12v5H29z"/><circle class="rm-product-mark-cutout" cx="26" cy="41.5" r="3"/><path class="rm-product-mark-cutout" d="M33 39h10v5H33z"/>',
    forma:'<path class="rm-product-mark-core" d="M15 16h15v15H15V16Zm19 0h15v9H34v-9Zm0 13h15v19H34V29ZM15 35h15v13H15V35Z"/>',
    folio:'<path class="rm-product-mark-core rm-product-mark-layer" d="M22 13h19a8 8 0 0 1 8 8v23H30a8 8 0 0 1-8-8V13Z"/><path class="rm-product-mark-core" d="M15 20h19a8 8 0 0 1 8 8v23H23a8 8 0 0 1-8-8V20Z"/><path class="rm-product-mark-cutout" d="M23 29h12v5H23zm0 9h9v5h-9z"/>'
  };
  const productMark = name => `<svg class="rm-product-logo" viewBox="0 0 64 64" aria-hidden="true"><rect class="rm-product-mark-bg" x="4" y="4" width="56" height="56" rx="14"/><rect class="rm-product-mark-frame" x="5" y="5" width="54" height="54" rx="13"/>${productMarks[name]||productMarks.folio}</svg>`;
  const brandLockup = (name,{size=48,className=''}={}) => `<span class="rm-brand ${escape(className)}" style="--brand-height:${Math.max(24,Math.min(120,Number(size)||48))}px" role="img" aria-label="${escape(brandName(name))}"><span class="rm-brand-parent">${mark()}</span><span class="rm-brand-words"><span>rosemary</span><strong>${escape(productName(name))}</strong></span></span>`;
  const brandMark = (name,{size=32,label=true,className=''}={}) => `<span class="rm-brand-mark ${escape(className)}" style="--brand-mark-size:${Math.max(20,Math.min(80,Number(size)||32))}px" role="img" aria-label="${escape(productName(name))}"><span class="rm-brand-mark-symbol">${productMark(name)}</span>${label?`<span class="rm-brand-mark-label" aria-hidden="true">${escape(productName(name))}</span>`:''}</span>`;
  const foldLoader = (extra = '') => `<span class="fold-loader ${escape(extra)}" aria-hidden="true"><i class="fold-pane fold-pane-back"></i><i class="fold-pane fold-pane-front"></i><i class="fold-spine"></i></span>`;
  const svgSource = id => {
    const item = window.RosemaryIconLibrary.icons[id] || window.RosemaryIconLibrary.icons.book;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="${escape(item.label)}"><title>${escape(item.label)}</title>${item.paths}</svg>`;
  };
  const compare = (good, bad, goodText, badText) => `<div class="visual-comparison"><figure class="comparison do"><div class="comparison-preview" aria-hidden="true">${good}</div><figcaption><strong>${icon('check')}Do · 推荐</strong><p>${goodText}</p></figcaption></figure><figure class="comparison dont"><div class="comparison-preview" aria-hidden="true">${bad}</div><figcaption><strong>${icon('close')}Don’t · 避免</strong><p>${badText}</p></figcaption></figure></div>`;
  const link = (id, text) => `<a class="text-link" href="#/${id}">${text}${icon('arrow')}</a>`;
  const button = (text, action, variant = 'primary', extra = '') => `<button type="button" class="button ${variant}" data-action="${action}" ${extra}>${text}</button>`;
  const note = (title, text, sun = false) => `<aside class="note${sun ? ' sun-note' : ''}"><strong>${title}</strong>${text}</aside>`;
  const section = (id, title, body, intro = '') => `<section class="section" id="${id}"><div class="section-heading"><h2>${title}</h2></div>${intro ? `<p class="section-intro">${intro}</p>` : ''}${body}</section>`;
  const table = (heads, rows) => `<div class="data-table-wrap"><table class="data-table"><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const list = items => `<ul class="guideline-list">${items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
  const rules = (good, bad) => `<div class="two-rules"><div class="rule do"><h3>${icon('check')}Do · 推荐</h3><p>${good}</p></div><div class="rule avoid"><h3>${icon('close')}Don’t · 避免</h3><p>${bad}</p></div></div>`;
  const demo = (body, caption, extra = '') => `<div class="demo"><div class="demo-stage ${extra}">${body}</div><div class="demo-caption">${caption}</div></div>`;
  const code = text => `<pre><code>${escape(text)}</code></pre>`;
  window.RosemaryUI = {icon,mark,productMark,brandLockup,brandMark,link,button,note,section,table,list,rules,demo,code,escape,foldLoader,svgSource,compare};
})();
