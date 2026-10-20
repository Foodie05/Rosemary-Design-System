/* Called by the portal's existing Chrome harness; this module starts no processes. */
export async function runComponentChecks({route,click,key,evaluate,until,delay,check,send,screenshot}) {
  const selector = '[data-component-demo]';
  const visited = new Set();
  const cleanupNames = [];
  let cleanupDeadline = 0;
  const within = code => evaluate(`(() => {
    const host=document.querySelector(${JSON.stringify(selector)});
    const $=query=>host.querySelector(query);
    const $$=query=>[...host.querySelectorAll(query)];
    ${code}
  })()`);
  const expect = async (name, expression) => check(`Component: ${name}`,await within(`return (${expression});`));
  const visit = async id => {
    await route(`components?component=${id}`);
    await until(`document.querySelector('[data-component-demo="${id}"]')!==null`);
    visited.add(id);
  };
  const action = name => click(`${selector} [data-cd-action="cd-${name}"]`);
  const focus = query => within(`$(${JSON.stringify(query)}).focus();`);
  const fill = (name,value,event='input') => within(`const input=$('[data-cd-field=${JSON.stringify(name)}]');
    input.value=${JSON.stringify(value)};input.dispatchEvent(new Event(${JSON.stringify(event)},{bubbles:true}));`);
  const submit = () => click(`${selector} [data-cd-form] button[type="submit"]`);
  const remember = name => within(`window.__rosemaryComponentChecks.refs[${JSON.stringify(name)}]=host;`);
  const afterLeaving = async (name,pendingMs=0) => {
    cleanupNames.push(name);
    cleanupDeadline=Math.max(cleanupDeadline,Date.now()+pendingMs+100);
    await evaluate(`(() => {
      const state=window.__rosemaryComponentChecks;
      const root=state.refs[${JSON.stringify(name)}];
      state.snapshots[${JSON.stringify(name)}]=root.outerHTML;
    })()`);
    check(`Component cleanup: ${name} is detached`,await evaluate(`!window.__rosemaryComponentChecks.refs[${JSON.stringify(name)}].isConnected`));
  };
  await until(`!document.getElementById('toast-region') || document.getElementById('toast-region').children.length===0`,8000);
  const globalToastBefore=await evaluate(`document.getElementById('toast-region')?.innerHTML || ''`);
  await evaluate(`window.__rosemaryComponentChecks={refs:{},snapshots:{}}`);

  try {
    // Force a fresh first preview even if the caller left the button demo selected.
    await visit('badge');
    await visit('button');
    await action('save');
    await expect('save marks itself busy and keeps its action label',`$('[data-cd-action="cd-save"]').getAttribute('aria-busy')==='true'&&$('[data-cd-action="cd-save"]').getAttribute('aria-disabled')==='true'&&$('[data-cd-action="cd-save"]').textContent.includes('保存更改')`);
    await action('save');
    await action('reset');
    await delay(1000);
    await expect('cancelling a save prevents its delayed completion',`host.dataset.cdState==='ready'&&!$('[data-cd-action="cd-save"]').hasAttribute('aria-busy')&&$('[data-cd-status]').textContent.includes('已取消')`);
    await action('save');
    await until(`document.querySelector('[data-component-demo="button"]').dataset.cdState==='saved'`);
    await expect('a subsequent save completes with a local result',`!$('[data-cd-action="cd-save"]').hasAttribute('aria-disabled')&&$('[data-cd-status]').textContent.includes('已保存')`);
    await action('preview');
    await expect('preview action reports its own result',`$('[data-cd-status]').textContent.includes('预览')`);
    await action('delete');
    await expect('danger action reports that only the sample was removed',`$('[data-cd-status]').textContent.includes('未删除任何真实数据')`);
    await action('save');
    await remember('pending-save');

    await visit('link');
    await afterLeaving('pending-save',1000);
    await expect('links keep real navigation and local download destinations',`$$('a[href]').length===3&&$('a[download]').getAttribute('href').startsWith('data:text/plain')&&!$$('a').some(a=>a.hasAttribute('role')||a.hasAttribute('data-cd-action'))`);
    await click(`${selector} a[href="#/components?component=input"]`);
    await until(`document.querySelector('[data-component-demo="input"]')!==null`);
    check('Component: navigation link changes to its actual component destination',await evaluate(`document.getElementById('component-spec-select').value==='input'`));

    await visit('iconButton');
    await focus('[data-cd-action="cd-bookmark"]');
    await key(' ','Space');
    await expect('icon toggle activates with Space and exposes its pressed state',`$('[data-cd-action="cd-bookmark"]').getAttribute('aria-pressed')==='true'&&$('[data-cd-status]').textContent.includes('已收藏')`);
    await action('bookmark');
    await expect('icon toggle can be cleared',`$('[data-cd-action="cd-bookmark"]').getAttribute('aria-pressed')==='false'`);
    await action('edit');
    await expect('edit icon names the local action',`$('[data-cd-status]').textContent.includes('编辑')`);
    await action('remove');
    await expect('remove icon returns local feedback',`$('[data-cd-status]').textContent.includes('未影响真实数据')`);

    await visit('input');
    await fill('name','');
    await submit();
    await expect('empty required name is rejected beside the input',`$('[data-cd-field="name"]').getAttribute('aria-invalid')==='true'&&$('[data-cd-error]').textContent.includes('请输入')&&document.activeElement===$('[data-cd-field="name"]')`);
    await fill('name','测试收藏夹');
    await submit();
    await expect('valid name is retained and clears the validation error',`$('[data-cd-field="name"]').value==='测试收藏夹'&&$('[data-cd-field="name"]').getAttribute('aria-invalid')==='false'&&!$('[data-cd-error]').textContent&&$('[data-cd-status]').textContent.includes('测试收藏夹')`);
    await expect('readonly and disabled input variants use native states',`$('input[readonly]').readOnly&&$('input[disabled]').disabled`);

    await visit('textarea');
    await fill('notes','第一行\n第二行');
    await expect('multiline input counts actual characters without per-character live announcements',`$('[data-cd-field="notes"]').value.includes(String.fromCharCode(10))&&$('[data-cd-count]').textContent==='7 / 160'&&$('[data-cd-count]').getAttribute('aria-live')==='off'`);
    await submit();
    await expect('textarea saves its multiline content without replacing the value',`$('[data-cd-status]').textContent.includes('7 个字符')&&$('[data-cd-field="notes"]').value===['第一行','第二行'].join(String.fromCharCode(10))`);

    await visit('select');
    await fill('category','旅行','change');
    await expect('grouped selection changes the actual value and result',`$('[data-cd-field="category"]').value==='旅行'&&$('[data-cd-status]').textContent.includes('旅行')&&$$('optgroup').length===2`);
    await fill('category','','change');
    await expect('empty selection remains explicit',`$('[data-cd-status]').textContent.includes('尚未选择')&&$('select[disabled]').disabled`);

    await visit('search');
    await fill('query','清单');
    await submit();
    await expect('submitted query filters to both matching records',`$$('[data-cd-results] li').length===2&&$('[data-cd-results]').textContent.includes('旅行清单')&&$('[data-cd-results]').textContent.includes('购物清单')&&$('[data-cd-status]').textContent.includes('2 条')`);
    await fill('query','不存在的演示内容');
    await submit();
    await expect('no-result state retains the query and a recovery direction',`!$$('[data-cd-results] li').length&&$('[data-cd-results]').textContent.includes('没有找到')&&$('[data-cd-results]').textContent.includes('不存在的演示内容')&&$('[data-cd-field="query"]').value==='不存在的演示内容'`);
    await action('clear');
    await expect('clearing search restores all records and useful focus',`$$('[data-cd-results] li').length===6&&$('[data-cd-field="query"]').value===''&&document.activeElement===$('[data-cd-field="query"]')`);

    await visit('checkbox');
    await expect('checkbox group starts genuinely mixed',`$('[data-cd-field="all"]').indeterminate&&$$('[data-cd-choice]:checked').length===2`);
    await click(`${selector} [data-cd-field="all"]`);
    await expect('select-all checks all enabled children',`$$('[data-cd-choice]:checked').length===3&&$('[data-cd-field="all"]').checked&&!$('[data-cd-field="all"]').indeterminate`);
    await click(`${selector} [data-cd-choice="text"]`);
    await expect('clearing one child restores mixed state',`$$('[data-cd-choice]:checked').length===2&&$('[data-cd-field="all"]').indeterminate`);
    await click(`${selector} [data-cd-field="all"]`);
    await click(`${selector} [data-cd-field="all"]`);
    await expect('select-all can clear the complete group',`$$('[data-cd-choice]:checked').length===0&&!$('[data-cd-field="all"]').checked&&!$('[data-cd-field="all"]').indeterminate`);

    await visit('radio');
    await click(`${selector} input[type="radio"][value="manual"]`);
    await expect('radio selection is exclusive and has concrete feedback',`$$('input[type="radio"]:checked').length===1&&$('input[value="manual"]').checked&&$('[data-cd-status]').textContent.includes('仅手动打开')`);
    await focus('input[value="manual"]');
    await key('ArrowUp','ArrowUp');
    await expect('native radio arrow navigation selects the preceding enabled option',`$('input[value="monthly"]').checked&&document.activeElement===$('input[value="monthly"]')`);

    await visit('switch');
    await focus('[data-cd-action="cd-toggle"]');
    await key(' ','Space');
    await expect('switch changes immediately with Space and explains the resulting state',`$('[data-cd-action="cd-toggle"]').getAttribute('aria-checked')==='true'&&$('[data-cd-switch-description]').textContent.includes('已开启')`);
    await action('toggle');
    await expect('switch turns off without changing its accessible label',`$('[data-cd-action="cd-toggle"]').getAttribute('aria-checked')==='false'&&$('label').textContent==='每周提醒'&&$('[role="switch"][disabled]').disabled`);

    await visit('slider');
    await fill('range','35');
    await expect('range updates its precise input, output and accessible unit',`$('[data-cd-field="number"]').value==='35'&&$('[data-cd-value]').textContent==='35 分钟'&&$('[data-cd-field="range"]').getAttribute('aria-valuetext')==='35 分钟'`);
    await fill('number','63','change');
    await expect('numeric slider entry clamps to the maximum',`$('[data-cd-field="range"]').value==='60'&&$('[data-cd-field="number"]').value==='60'`);
    await fill('number','17','change');
    await expect('numeric slider entry respects its five-minute step',`$('[data-cd-field="range"]').value==='15'&&$('[data-cd-value]').textContent==='15 分钟'`);
    await fill('number','','change');
    await expect('empty numeric entry restores the last valid value with an explanation',`$('[data-cd-field="number"]').value==='15'&&$('[data-cd-status]').textContent.includes('请输入')`);
    await focus('[data-cd-field="range"]');
    await key('End','End');
    await expect('native range keyboard End reaches the actual upper bound',`$('[data-cd-field="range"]').value==='60'&&$('[data-cd-field="number"]').value==='60'`);

    await visit('date');
    await fill('end','2026-10-10');
    await submit();
    await expect('reversed date range is rejected without discarding input',`$('[data-cd-field="end"]').value==='2026-10-10'&&$('[data-cd-field="end"]').getAttribute('aria-invalid')==='true'&&$('[data-cd-error]').textContent.includes('不能早于')`);
    await fill('start','2028-02-29');
    await fill('end','2028-03-01');
    await fill('time','09:30');
    await submit();
    await expect('valid leap-day range and local time are confirmed accurately',`!$('[data-cd-error]').textContent&&$('[data-cd-status]').textContent.includes('2028-02-29 至 2028-03-01')&&$('[data-cd-status]').textContent.includes('09:30')&&$('[data-cd-field="end"]').getAttribute('aria-invalid')==='false'`);

    await visit('upload');
    await within(`const transfer=new DataTransfer();
      transfer.items.add(new File(['demo'],'<demo>.txt',{type:'text/plain'}));
      transfer.items.add(new File([new Uint8Array(5*1024*1024+1)],'oversize-demo.bin'));
      const input=$('[data-cd-field="files"]');input.files=transfer.files;input.dispatchEvent(new Event('change',{bubbles:true}));`);
    await expect('file selection shows only safe names and actual sizes with an oversize warning',`$$('[data-cd-files] li').length===2&&$('[data-cd-files]').textContent.includes('<demo>.txt')&&!$('demo')&&$('[data-cd-files]').textContent.includes('4 B')&&$('[data-cd-files]').textContent.includes('超过 5 MB')&&$('[data-cd-status]').textContent.includes('没有上传')`);
    await click(`${selector} [data-cd-remove-file="0"]`);
    await expect('removing a file preserves the other metadata and returns to the chooser',`$$('[data-cd-files] li').length===1&&$('[data-cd-files]').textContent.includes('oversize-demo.bin')&&document.activeElement===$('[data-cd-field="files"]')`);
    await click(`${selector} [data-cd-remove-file="1"]`);
    await expect('removing all selected files restores the empty state',`!$$('[data-cd-files] li').length&&$('[data-cd-status]').textContent.includes('尚未选择')`);

    await visit('tabs');
    await click(`${selector} [role="tab"][data-tab-key="kept"]`);
    await expect('shared tabs display the actual saved subset',`$('[data-cd-tablist]').dataset.motionTabs==='shared'&&$$('[data-cd-panel] li').length===2&&$('[data-cd-panel]').textContent.includes('家庭相册')&&!$('[data-cd-panel]').textContent.includes('旅行清单')`);
    await click(`${selector} [role="tab"][data-tab-key="draft"]`);
    await expect('draft tab contains only the draft from this record set',`$$('[data-cd-panel] li').length===1&&$('[data-cd-panel]').textContent.includes('旅行清单')&&$('[data-cd-panel]').getAttribute('aria-labelledby')===$('[data-tab-key="draft"]').id`);
    await click(`${selector} [role="tab"][data-tab-key="all"]`);
    await expect('all tab restores its complete three-record set',`$$('[data-cd-panel] li').length===3`);

    await visit('breadcrumb');
    await expect('breadcrumb represents a hierarchy with a non-link current location',`$$('nav ol li').length===3&&$('nav [aria-current="page"]').tagName==='SPAN'&&$('nav a').getAttribute('href')==='#/overview'`);
    await click(`${selector} nav a[href="#/overview"]`);
    await until(`location.hash==='#/overview'&&document.querySelector('main article[data-page=overview].forma-home')!==null`);
    check('Component: breadcrumb ancestor follows a real portal route',await evaluate(`!document.querySelector('[data-component-demo]')`));

    await visit('pagination');
    await expect('pagination begins at a bounded first page',`$('[data-cd-action="cd-previous"]').disabled&&$('[data-cd-page="1"]').getAttribute('aria-current')==='page'&&$('[data-cd-results]').textContent.includes('周末记录')`);
    await click(`${selector} [data-cd-page="2"]`);
    await expect('page two replaces results and announces its real range',`$('[data-cd-page="2"]').getAttribute('aria-current')==='page'&&$('[data-cd-results]').textContent.includes('家庭相册')&&$('[data-cd-results]').textContent.includes('阅读笔记')&&!$('[data-cd-results]').textContent.includes('周末记录')&&$('[data-cd-status]').textContent.includes('3–4')`);
    await action('next');
    await expect('last page contains the final records and disables next',`$('[data-cd-action="cd-next"]').disabled&&$('[data-cd-results]').textContent.includes('购物清单')&&$('[data-cd-results]').textContent.includes('工作备忘')`);
    await action('previous');
    await expect('previous page restores the earlier result set',`$('[data-cd-page="2"]').getAttribute('aria-current')==='page'&&!$('[data-cd-action="cd-next"]').disabled`);

    await visit('menu');
    await action('menu-save');
    await expect('menu action acts on the sample and closes the disclosure',`$('[data-cd-status]').textContent.includes('已收藏')&&$('[data-cd-popup]').hidden&&$('[data-cd-action="cd-disclose"]').getAttribute('aria-expanded')==='false'`);
    await action('disclose');
    await focus('[data-cd-action="cd-menu-copy"]');
    await key('Escape','Escape');
    await expect('menu Escape returns focus without invoking an action',`$('[data-cd-popup]').hidden&&document.activeElement===$('[data-cd-action="cd-disclose"]')&&$('[data-cd-status]').textContent.includes('已收藏')`);
    await action('disclose');
    await action('menu-copy');
    await expect('menu copy has a concrete local result',`$('[data-cd-status]').textContent.includes('周末记录的副本')&&$('[data-cd-popup]').hidden`);
    await action('disclose');
    await action('menu-remove');
    await expect('menu removal changes the object presentation',`$('[data-cd-object-name]').textContent.includes('已移除')&&$('[data-cd-popup]').hidden`);

    await visit('tooltip');
    await focus('[data-cd-action="cd-tooltip"]');
    await expect('tooltip is available on keyboard focus',`!$('[data-cd-tooltip]').hidden&&$('[data-cd-tooltip]').getAttribute('role')==='tooltip'`);
    await key('Escape','Escape');
    await expect('tooltip Escape dismisses it without moving focus',`$('[data-cd-tooltip]').hidden&&document.activeElement===$('[data-cd-action="cd-tooltip"]')`);
    await evaluate(`RosemarySelect.control(document.getElementById('component-spec-select')).focus()`);
    await focus('[data-cd-action="cd-tooltip"]');
    await expect('refocusing the tooltip trigger restores the supplemental text',`!$('[data-cd-tooltip]').hidden`);
    await key('Escape','Escape');

    await visit('popover');
    await fill('name','未提交的示例草稿');
    await action('close-popup');
    await action('disclose');
    await expect('popover keeps an unsubmitted draft when reopened',`!$('[data-cd-popup]').hidden&&$('[data-cd-field="name"]').value==='未提交的示例草稿'`);
    await key('Escape','Escape');
    await expect('popover Escape returns focus and preserves its value',`$('[data-cd-popup]').hidden&&document.activeElement===$('[data-cd-action="cd-disclose"]')&&$('[data-cd-field="name"]').value==='未提交的示例草稿'`);
    await action('disclose');
    await fill('name','');
    await submit();
    await expect('popover refuses an empty name without closing',`!$('[data-cd-popup]').hidden&&$('[data-cd-field="name"]').getAttribute('aria-invalid')==='true'&&$('[data-cd-error]').textContent.includes('请输入')`);
    await fill('name','已保存的示例名称');
    await submit();
    await expect('popover save updates the associated object and closes',`$('[data-cd-popup]').hidden&&$('[data-cd-object-name]').textContent==='已保存的示例名称'&&$('[data-cd-status]').textContent.includes('已保存的示例名称')`);

    for (const id of ['dialog','drawer']) {
      await visit(id);
      await action('open-modal');
      await expect(`${id} opens as a named native modal and focuses its name field`,`$('[data-cd-dialog]').open&&$('[data-cd-dialog]').matches(':modal')&&$('[data-cd-dialog]').hasAttribute('aria-labelledby')&&document.activeElement===$('[data-cd-field="name"]')`);
      await fill('name',`${id} 示例草稿`);
      await fill('notes','只用于测试的本地说明。');
      await within(`$$('[data-cd-dialog] [data-cd-action="cd-close-modal"]').at(-1).focus();`);
      await key('Tab','Tab');
      await expect(`${id} keeps Tab focus within its modal`,`$('[data-cd-dialog]').contains(document.activeElement)`);
      await key('Tab','Tab',8);
      await expect(`${id} also wraps reverse Tab at the modal boundary`,`document.activeElement===$$('[data-cd-dialog] [data-cd-action="cd-close-modal"]').at(-1)`);
      await key('Escape','Escape');
      await until(`!document.querySelector('[data-cd-dialog]').open`);
      await expect(`${id} closes safely and returns focus to its own trigger`,`document.activeElement===$('[data-cd-action="cd-open-modal"]')&&$('[data-cd-status]').textContent.includes('草稿仍保留')`);
      await action('open-modal');
      await expect(`${id} retains both unsubmitted fields on reopening`,`$('[data-cd-field="name"]').value===${JSON.stringify(`${id} 示例草稿`)}&&$('[data-cd-field="notes"]').value==='只用于测试的本地说明。'`);
      await fill('name','');
      await submit();
      await expect(`${id} validation leaves the modal open and focuses the failing field`,`$('[data-cd-dialog]').open&&$('[data-cd-field="name"]').getAttribute('aria-invalid')==='true'&&document.activeElement===$('[data-cd-field="name"]')`);
      await fill('name',`${id} 已保存示例`);
      await submit();
      await until(`!document.querySelector('[data-cd-dialog]').open`);
      await expect(`${id} saves the actual name and restores trigger focus`,`$('[data-cd-status]').textContent.includes(${JSON.stringify(`${id} 已保存示例`)})&&document.activeElement===$('[data-cd-action="cd-open-modal"]')`);
      await action('open-modal');
      await remember(`open-${id}`);
      await visit('badge');
      await afterLeaving(`open-${id}`);
      check(`Component cleanup: switching away closes an open ${id}`,await evaluate(`!window.__rosemaryComponentChecks.refs['open-${id}'].querySelector('dialog').open&&!document.querySelector('dialog.cd-dialog[open]')`));
    }

    await visit('toast');
    await focus('[data-cd-action="cd-show-toast"]');
    await action('show-toast');
    await expect('toast shows its result inside the preview without stealing focus',`!$('[data-cd-toast]').hidden&&$('[data-cd-toast-message]').textContent==='更改已保存。'&&document.activeElement===$('[data-cd-action="cd-show-toast"]')`);
    await action('dismiss-toast');
    await expect('toast can be dismissed with a useful remaining focus target',`$('[data-cd-toast]').hidden&&document.activeElement===$('[data-cd-action="cd-show-toast"]')`);
    await action('show-toast');
    await remember('pending-toast');

    await visit('alert');
    await afterLeaving('pending-toast',6200);
    await expect('inline alert keeps a persistent error and a recovery action',`$('[data-cd-recoverable]').classList.contains('cd-danger')&&$('[data-cd-alert-copy]').textContent.includes('草稿仍保留')`);
    await action('retry-alert');
    await expect('alert recovery changes the actual inline state and preserves its explanation',`$('[data-cd-recoverable]').classList.contains('cd-success')&&!$('[data-cd-recoverable]').classList.contains('cd-danger')&&$('[data-cd-alert-title]').textContent.includes('已恢复')&&$('[data-cd-alert-copy]').textContent.includes('未进行真实网络连接')`);

    await visit('card');
    await expect('cards present distinct objects and a visible noninteractive selected variant',`$$('article.cd-card').length===2&&$$('.cd-card h4').map(n=>n.textContent).join(',')==='周末记录,旅行清单'&&$('.cd-card-selected').textContent.includes('已选择')&&!$$('article[tabindex],article[role="button"]').length`);

    await visit('list');
    await click(`${selector} [data-cd-list-index="1"]`);
    await expect('list selection updates one pressed row and the matching details',`$$('[data-cd-list-index][aria-pressed="true"]').length===1&&$('[data-cd-list-index="1"]').getAttribute('aria-pressed')==='true'&&$('[data-cd-detail]').textContent.includes('旅行清单')&&$('[data-cd-detail]').textContent.includes('草稿')`);

    await visit('table');
    await focus('[data-cd-sort="date"]');
    await click(`${selector} [data-cd-sort="date"]`);
    await expect('ascending table sort reorders real date cells and retains header focus',`$('[data-cd-sort-header="date"]').getAttribute('aria-sort')==='ascending'&&$$('[data-cd-tbody] time').map(n=>n.dateTime).join(',')==='2026-10-06,2026-10-08,2026-10-10,2026-10-12'&&document.activeElement===$('[data-cd-sort="date"]')`);
    await click(`${selector} [data-cd-sort="date"]`);
    await expect('table sort reverses the real row order',`$('[data-cd-sort-header="date"]').getAttribute('aria-sort')==='descending'&&$$('[data-cd-tbody] time').map(n=>n.dateTime).join(',')==='2026-10-12,2026-10-10,2026-10-08,2026-10-06'`);
    await click(`${selector} [data-cd-sort="name"]`);
    await expect('switching sortable columns clears the prior sort state and orders names',`$('[data-cd-sort-header="date"]').getAttribute('aria-sort')==='none'&&$('[data-cd-sort-header="name"]').getAttribute('aria-sort')==='ascending'&&$$('[data-cd-tbody] th[scope="row"]').map(n=>n.textContent).every((name,i,names)=>i===0||names[i-1].localeCompare(name,'zh-CN')<=0)`);

    await visit('badge');
    await expect('badges expose text for each status and are not pretend buttons',`$('.cd-badge.cd-success').textContent.includes('已保存')&&$('.cd-badge.cd-warning').textContent.includes('等待同步')&&$('.cd-badge.cd-danger').textContent.includes('同步失败')&&$('.cd-count-badge').getAttribute('aria-label')==='3 条未读记录'&&!$$('.cd-badge[tabindex],.cd-badge[role="button"]').length`);

    await visit('avatar');
    await expect('avatar fallbacks retain adjacent identities and the group description',`$$('.cd-avatar-sizes .cd-avatar').map(n=>n.textContent).join(',')==='林,陈,RM'&&$('.cd-avatar-sizes').textContent.includes('林晓')&&$('.cd-avatar-sizes').textContent.includes('陈宁')&&$('.cd-avatar-group-row').textContent.includes('4 位成员')&&!$$('img').length`);

    await visit('empty');
    await action('add-record');
    await expect('first-use empty action creates its local sample without clearing a separate filter',`$('[data-cd-empty-title]').textContent.includes('已添加')&&$('[data-cd-empty-copy]').textContent.includes('周末记录')&&$('[data-cd-filter-title]').textContent.includes('没有符合')`);
    await action('clear-filter');
    await expect('no-results recovery clears the stated filter rather than creating another record',`$('[data-cd-filter-title]').textContent.includes('全部 6 条')&&$('[data-cd-filter-copy]').textContent.includes('没有修改记录内容')&&$('[data-cd-empty-title]').textContent.includes('已添加')`);

    await visit('skeleton');
    await expect('skeleton is decorative inside a busy content region',`$('[data-cd-skeleton]').getAttribute('aria-hidden')==='true'&&$('[data-cd-skeleton-region]').getAttribute('aria-busy')==='true'&&!$('[data-cd-skeleton]').hidden`);
    await action('reveal');
    await expect('skeleton completion replaces placeholders with three real records',`$('[data-cd-skeleton]').hidden&&!$('[data-cd-skeleton-result]').hidden&&$$('[data-cd-skeleton-result] li').length===3&&$('[data-cd-skeleton-region]').getAttribute('aria-busy')==='false'`);
    await action('reload');
    await until(`document.querySelector('[data-component-demo="skeleton"]').dataset.cdState==='complete'`);
    await expect('reloaded skeleton completes and stops its decorative animation',`!$('[data-cd-skeleton]').classList.contains('cd-is-running')&&$('[data-cd-skeleton-region]').getAttribute('aria-busy')==='false'`);
    await action('reload');
    await remember('pending-skeleton');

    await visit('loading');
    await afterLeaving('pending-skeleton',1300);
    await action('start-loading');
    await expect('unknown loading uses the folded loader and a true busy state, not a percentage',`$('[data-cd-loading-region]').getAttribute('aria-busy')==='true'&&$('.fold-loader').classList.contains('is-running')&&!$('progress')&&$('[data-cd-loading-copy]').textContent.includes('总量未知')`);
    await action('cancel-loading');
    await expect('loading cancel immediately ends the operation and its animation',`host.dataset.cdState==='cancelled'&&$('[data-cd-loading-region]').getAttribute('aria-busy')==='false'&&!$('.fold-loader').classList.contains('is-running')`);
    await action('start-loading');
    await action('finish-loading');
    await expect('loading can restart and finish explicitly',`host.dataset.cdState==='complete'&&!$('.fold-loader').classList.contains('is-running')&&$('[data-cd-status]').textContent.includes('已完成')`);
    await action('start-loading');
    await remember('running-fold');

    await visit('progress');
    await afterLeaving('running-fold');
    check('Component cleanup: leaving loading stops the detached folded animation',await evaluate(`!window.__rosemaryComponentChecks.refs['running-fold'].querySelector('.is-running')`));
    await expect('known progress starts with matching numeric and completed-record state',`$('[data-cd-progress]').value===2&&$('[data-cd-progress]').max===6&&$$('[data-cd-progress-items] [data-cd-done="true"]').length===2`);
    await action('advance-progress');
    await expect('processing one record increments the native value and real completed list immediately',`$('[data-cd-progress]').value===3&&$$('[data-cd-progress-items] [data-cd-done="true"]').length===3&&$('[data-cd-progress-count]').textContent.includes('3 / 6')`);
    await action('cancel-progress');
    await expect('cancelling known progress preserves its completed work',`host.dataset.cdState==='cancelled'&&$('[data-cd-progress]').value===3&&$('[data-cd-action="cd-advance-progress"]').disabled&&$('[data-cd-status]').textContent.includes('3 项')`);
    await action('restart-progress');
    await expect('unknown-total phase removes the native value and hides determinate visual fill',`host.dataset.cdState==='unknown'&&!$('[data-cd-progress]').hasAttribute('value')&&$('[data-cd-progress-track]').hidden&&!$('[data-cd-progress-unknown]').hidden&&$('[data-cd-progress-unknown] .fold-loader').classList.contains('is-running')`);
    await action('cancel-progress');
    await expect('unknown progress can also be cancelled',`host.dataset.cdState==='cancelled'&&!$('[data-cd-progress-unknown] .fold-loader').classList.contains('is-running')&&$('[data-cd-progress]').value===0`);
    await action('restart-progress');
    await action('known-progress');
    await delay(160);
    await expect('known total starts at zero and never advances without a completed item',`host.dataset.cdState==='known'&&$('[data-cd-progress]').value===0&&$('[data-cd-progress]').max===6&&!$('[data-cd-progress-track]').hidden&&$('[data-cd-progress-unknown]').hidden&&$$('[data-cd-progress-items] [data-cd-done="true"]').length===0`);
    for (let count=1;count<=6;count++) {
      await action('advance-progress');
      await expect(`progress completed count ${count} is tied to the processed records`,`$('[data-cd-progress]').value===${count}&&$$('[data-cd-progress-items] [data-cd-done="true"]').length===${count}`);
    }
    await until(`Math.abs(new DOMMatrixReadOnly(getComputedStyle(document.querySelector('[data-cd-progress-fill]')).transform).a-1)<0.002`);
    await expect('completed progress reaches the exact visual endpoint and disables further work',`host.dataset.cdState==='complete'&&$('[data-cd-action="cd-advance-progress"]').disabled&&$('[data-cd-action="cd-cancel-progress"]').disabled&&$('[data-cd-progress-fill]').style.getPropertyValue('--progress-ratio')==='1'`);
    const accessibility=await send('Accessibility.getFullAXTree');
    check('Component: determinate progress has one named native accessible progressbar',accessibility.nodes.filter(node=>!node.ignored&&node.role?.value==='progressbar'&&node.name?.value==='已整理的记录数量').length===1);

    await visit('stepper');
    await fill('name','');
    await submit();
    await expect('stepper prevents entering the next step with an invalid name',`$('[data-cd-step="0"]').getAttribute('aria-current')==='step'&&$('[data-cd-field="name"]').getAttribute('aria-invalid')==='true'&&!$('[data-cd-step-panel="0"]').hidden`);
    await fill('name','分步演示记录');
    await submit();
    await fill('category','阅读','change');
    await action('back-step');
    await expect('returning to a previous step preserves the entered name',`$('[data-cd-step="0"]').getAttribute('aria-current')==='step'&&$('[data-cd-field="name"]').value==='分步演示记录'`);
    await submit();
    await expect('returning forward also preserves the selected category',`$('[data-cd-field="category"]').value==='阅读'&&$('[data-cd-step="1"]').getAttribute('aria-current')==='step'`);
    await submit();
    await expect('confirmation step reviews the actual values before creation',`$('[data-cd-step="2"]').getAttribute('aria-current')==='step'&&$('[data-cd-review-name]').textContent==='分步演示记录'&&$('[data-cd-review-category]').textContent==='阅读'&&$('[data-cd-next-step]').textContent==='创建记录'`);
    await action('back-step');
    await fill('category','旅行','change');
    await submit();
    await expect('review reflects a revised earlier choice',`$('[data-cd-review-category]').textContent==='旅行'`);
    await submit();
    await expect('final submission completes all steps only after confirmation',`host.dataset.cdState==='complete'&&$$('[data-cd-step][data-cd-complete="true"]').length===3&&!$('[data-cd-step][aria-current]')&&$('[data-cd-next-step]').hidden&&$('[data-cd-status]').textContent.includes('分步演示记录')`);
    await action('restart-step');
    await expect('stepper can restart while retaining editable values',`$('[data-cd-step="0"]').getAttribute('aria-current')==='step'&&$('[data-cd-field="name"]').value==='分步演示记录'&&!$('[data-cd-next-step]').hidden`);

    await visit('badge');
    await delay(Math.max(0,cleanupDeadline-Date.now()));
    for (const name of cleanupNames) {
      check(`Component cleanup: ${name} has no delayed DOM mutation`,await evaluate(`(() => {const s=window.__rosemaryComponentChecks;return s.refs[${JSON.stringify(name)}].outerHTML===s.snapshots[${JSON.stringify(name)}];})()`));
    }
    check('Component: interaction checks visited all 33 catalog entries',visited.size===33);
    check('Component: demos never populated the global notification overlay',await evaluate(`(document.getElementById('toast-region')?.innerHTML || '')===${JSON.stringify(globalToastBefore)}`));
    check('Component: interaction suite leaves no active modal, loader or transient local overlay',await evaluate(`!document.querySelector('dialog.cd-dialog[open],.cd-demo .is-running,.cd-demo .cd-is-running,.cd-demo [data-cd-toast]:not([hidden])')&&document.querySelector('[data-component-demo="badge"]')!==null`));
  } finally {
    // Route replacement invokes demo cleanup even if an assertion aborts mid-modal/task.
    await route('components?component=badge');
    await until(`document.querySelector('[data-component-demo="badge"]')!==null`);
    await evaluate(`delete window.__rosemaryComponentChecks`);
  }
}
