/* Runs through real keyboard events in the portal's isolated Chrome harness. */
export async function runDatePickerChecks({route,click,key,evaluate,delay,check,send,screenshot,viewport}) {
  const host='[data-component-demo="date"]';
  const probe=code=>evaluate(`(() => {const root=document.querySelector('${host}');const $=selector=>root.querySelector(selector);const $$=selector=>[...root.querySelectorAll(selector)];${code}})()`);
  const expect=async(name,expression)=>{const value=await probe(`return (${expression});`);if(!value)console.log('Date picker diagnostics:',name,await probe(`return {fields:$$('[data-cd-field]').map(n=>({name:n.dataset.cdField,value:n.value})),popups:$$('[data-cd-picker-popup]').map(n=>({name:n.dataset.cdPickerPopup,hidden:n.hidden})),focus:{tag:document.activeElement.tagName,id:document.activeElement.id,data:{...document.activeElement.dataset}}};`));check(`Custom date/time: ${name}`,value);};
  const clickIn=selector=>click(`${host} ${selector}`);
  const open=name=>clickIn(`[data-cd-picker-trigger="${name}"]`);
  const focus=selector=>probe(`$(${JSON.stringify(selector)}).focus();`);
  const fill=(name,value)=>probe(`const input=$('[data-cd-field="${name}"]');input.value=${JSON.stringify(value)};input.dispatchEvent(new Event('input',{bubbles:true}));`);
  const submit=()=>clickIn('button[type="submit"]');
  const popup=name=>`$('[data-cd-picker-popup="${name}"]')`;

  // Inspect open states before the longer existing chapter/component matrix.
  for(const width of [375,1440])for(const theme of ['light','dark']) {
    await viewport(width,width===375?812:1000,theme);
    await route('components?component=date');
    await click('#component-tab-preview');
    await open('end');
    await expect(`${width}px ${theme} calendar is custom, named, selected and fits the page`,`(() => {const box=${popup('end')},rect=box.getBoundingClientRect();return !box.hidden&&box.getAttribute('role')==='dialog'&&document.getElementById(box.getAttribute('aria-labelledby')).textContent.includes('结束日期')&&box.querySelector('[role="grid"]')&&box.querySelector('[role="gridcell"][aria-selected="true"] [data-cd-date="2026-10-14"]')&&rect.left>=0&&rect.right<=innerWidth+1&&document.documentElement.scrollWidth<=innerWidth+1&&!$$('input[type="date"],input[type="time"],input[type="datetime-local"],select').length;})()`);
    await screenshot(`date-calendar-${width}-${theme}.png`);
    await key('Escape','Escape');
    await open('time');
    await expect(`${width}px ${theme} time uses two custom lists with 24 hours and 60 minutes`,`(() => {const box=${popup('time')},rect=box.getBoundingClientRect();return !box.hidden&&$$('[data-cd-time-list="0"] [role="option"]').length===24&&$$('[data-cd-time-list="1"] [role="option"]').length===60&&$$('[role="option"][aria-selected="true"]').length===2&&rect.left>=0&&rect.right<=innerWidth+1&&document.documentElement.scrollWidth<=innerWidth+1;})()`);
    await screenshot(`date-time-${width}-${theme}.png`);
    await key('Escape','Escape');
  }
  console.log('Custom date/time: 375px and 1440px light/dark open-state checks and 8 screenshots passed.');

  await viewport(1440,1000,'light');
  await focus('[data-cd-field="start"]');
  await key('ArrowDown','ArrowDown');
  await expect('field ArrowDown opens at the current date without changing its value',`!${popup('start')}.hidden&&document.activeElement.dataset.cdDate==='2026-10-12'&&$('[data-cd-field="start"]').value==='2026-10-12'`);
  await key('End','End');
  await expect('calendar End moves to the end of the Monday-based week',`document.activeElement.dataset.cdDate==='2026-10-18'`);
  await key('ArrowLeft','ArrowLeft');await key('ArrowUp','ArrowUp');
  await expect('calendar horizontal and vertical arrow keys move actual focus',`document.activeElement.dataset.cdDate==='2026-10-10'&&$('[data-cd-field="start"]').value==='2026-10-12'`);
  await key('Home','Home');
  await expect('calendar Home moves to the start of the week',`document.activeElement.dataset.cdDate==='2026-10-05'`);
  await key('PageUp','PageUp');
  await expect('PageUp moves focus to the prior month',`document.activeElement.dataset.cdDate==='2026-09-05'&&${popup('start')}.textContent.includes('2026年 9月')`);
  await key('PageDown','PageDown');await key('ArrowRight','ArrowRight');await key('Enter','Enter');
  await expect('Enter applies a focused date, dismisses and returns trigger focus',`${popup('start')}.hidden&&$('[data-cd-field="start"]').value==='2026-10-06'&&document.activeElement===$('[data-cd-picker-trigger="start"]')`);

  await open('start');await clickIn('[data-cd-picker-popup="start"] [data-cd-month="1"]');
  await expect('month buttons move the displayed calendar without committing',`${popup('start')}.textContent.includes('2026年 11月')&&$('[data-cd-field="start"]').value==='2026-10-06'&&document.activeElement.dataset.cdMonth==='1'`);
  await key('Escape','Escape');
  await expect('calendar Escape cancels navigation and restores focus and value',`${popup('start')}.hidden&&$('[data-cd-field="start"]').value==='2026-10-06'&&document.activeElement===$('[data-cd-picker-trigger="start"]')`);
  await open('start');await clickIn('[data-cd-date="2026-10-12"]');
  await expect('pointer date choice applies the clicked civil string',`$('[data-cd-field="start"]').value==='2026-10-12'&&${popup('start')}.hidden`);

  await fill('start','2028-03-31');await open('start');await key('PageUp','PageUp');
  await expect('month navigation clamps March 31 to a valid leap day',`document.activeElement.dataset.cdDate==='2028-02-29'`);
  await key(' ','Space');
  await expect('Space selects the leap day without a timezone conversion',`$('[data-cd-field="start"]').value==='2028-02-29'&&${popup('start')}.hidden`);
  await fill('end','2028-03-01');await fill('time','09:30');await submit();
  await expect('valid leap-day range and local clock values confirm exactly',`!$('[data-cd-error]').textContent&&$('[data-cd-status]').textContent.includes('2028-02-29 至 2028-03-01，本地时间 09:30')`);
  for(const [name,value] of [['start','2027-02-29'],['start','2026-04-31'],['start','0000-01-01'],['time','24:00'],['time','09:60']]) {
    await fill('start','2028-02-29');await fill('time','09:30');await fill(name,value);await submit();
    await expect(`direct invalid ${name} ${value} is rejected and retained`,`$('[data-cd-field="${name}"]').value==='${value}'&&$('[data-cd-field="${name}"]').getAttribute('aria-invalid')==='true'&&document.activeElement===$('[data-cd-field="${name}"]')&&$('[data-cd-error]').textContent.includes('有效')`);
  }
  await fill('start','2028-02-29');await fill('end','2028-02-28');await fill('time','09:30');await submit();
  await expect('reversed ranges retain both fields and focus the end error',`$('[data-cd-field="end"]').value==='2028-02-28'&&$('[data-cd-field="end"]').getAttribute('aria-invalid')==='true'&&document.activeElement===$('[data-cd-field="end"]')&&$('[data-cd-error]').textContent.includes('不能早于')`);
  await fill('end','2028-03-01');
  await send('Emulation.setTimezoneOverride',{timezoneId:'America/Los_Angeles'});
  await fill('start','2026-03-08');await fill('end','2026-03-09');await fill('time','02:30');await submit();
  await expect('civil dates and clocks remain unchanged across a DST timezone',`!$('[data-cd-error]').textContent&&$('[data-cd-status]').textContent.includes('2026-03-08 至 2026-03-09，本地时间 02:30')`);
  await send('Emulation.setTimezoneOverride',{timezoneId:''});
  await fill('start','2028-02-29');await fill('end','2028-03-01');await fill('time','09:30');
  await fill('start','0001-01-01');await open('start');
  await expect('calendar lower bound matches direct date validation',`${popup('start')}.querySelector('[data-cd-month="-1"]').disabled&&document.activeElement.dataset.cdDate==='0001-01-01'`);
  await key('ArrowLeft','ArrowLeft');
  await expect('arrow navigation cannot move before year 0001',`document.activeElement.dataset.cdDate==='0001-01-01'`);
  await key('Escape','Escape');await fill('start','9999-12-31');await open('start');
  await expect('calendar upper bound matches direct date validation',`${popup('start')}.querySelector('[data-cd-month="1"]').disabled&&document.activeElement.dataset.cdDate==='9999-12-31'`);
  await key('ArrowRight','ArrowRight');
  await expect('arrow navigation cannot move past year 9999',`document.activeElement.dataset.cdDate==='9999-12-31'`);
  await key('Escape','Escape');await fill('start','2028-02-29');

  await open('time');
  await expect('time opens at the existing hour/minute with one Tab stop per list',`document.activeElement.dataset.cdTimeValue==='9'&&$$('[data-cd-time-unit="0"][tabindex="0"]').length===1&&$$('[data-cd-time-unit="1"][tabindex="0"]').length===1&&$('[data-cd-field="time"]').value==='09:30'`);
  await key('ArrowUp','ArrowUp');await key('ArrowRight','ArrowRight');await key('End','End');
  await expect('time arrows switch column and End reaches minute 59 without committing',`document.activeElement.dataset.cdTimeUnit==='1'&&document.activeElement.dataset.cdTimeValue==='59'&&$('[data-cd-time-preview]').textContent==='08:59'&&$('[data-cd-field="time"]').value==='09:30'`);
  await key('Escape','Escape');
  await expect('time Escape discards the draft and returns trigger focus',`${popup('time')}.hidden&&$('[data-cd-field="time"]').value==='09:30'&&document.activeElement===$('[data-cd-picker-trigger="time"]')`);
  await open('time');await key('Home','Home');await key('ArrowUp','ArrowUp');await key('Tab','Tab');await key('Home','Home');await key('ArrowDown','ArrowDown');
  await expect('time wraps hours and permits exact one-minute keyboard selection',`document.activeElement.dataset.cdTimeUnit==='1'&&document.activeElement.dataset.cdTimeValue==='1'&&$('[data-cd-time-preview]').textContent==='23:01'`);
  await key('Tab','Tab');await key('Tab','Tab');await key('Enter','Enter');
  await expect('keyboard confirmation applies both time units and restores focus',`$('[data-cd-field="time"]').value==='23:01'&&${popup('time')}.hidden&&document.activeElement===$('[data-cd-picker-trigger="time"]')`);
  await open('time');await clickIn('[data-cd-time-unit="0"][data-cd-time-value="10"]');await clickIn('[data-cd-time-unit="1"][data-cd-time-value="15"]');await clickIn('[data-cd-time-confirm]');
  await expect('pointer hour/minute choices apply a precise time',`$('[data-cd-field="time"]').value==='10:15'&&${popup('time')}.hidden`);
  await open('time');await clickIn('[data-cd-time-unit="0"][data-cd-time-value="18"]');await clickIn('[data-cd-picker-popup="time"] [data-cd-picker-close]');
  await expect('explicit cancel preserves the last committed time',`$('[data-cd-field="time"]').value==='10:15'&&${popup('time')}.hidden&&document.activeElement===$('[data-cd-picker-trigger="time"]')`);

  await open('start');await open('end');
  await expect('only one picker can be open at a time',`${popup('start')}.hidden&&!${popup('end')}.hidden&&$$('[data-cd-picker-trigger][aria-expanded="true"]').length===1`);
  await click('#component-tab-usage');
  await expect('outside click on documentation closes the popup and preserves fields',`${popup('end')}.hidden&&$('[data-cd-field="start"]').value==='2028-02-29'&&$('[data-cd-field="time"]').value==='10:15'`);
  await click('#component-tab-preview');await open('end');
  await evaluate('RosemarySelect.control(document.getElementById("component-spec-select")).focus()');
  await expect('focus leaving the picker dismisses it without stealing focus',`${popup('end')}.hidden&&document.activeElement===RosemarySelect.control(document.getElementById('component-spec-select'))`);
  await open('time');await key('Tab','Tab');await key('Tab','Tab');await key('Tab','Tab');await key('Tab','Tab');
  await expect('Tab exits the nonmodal time picker and dismisses it',`${popup('time')}.hidden&&!${popup('time')}.contains(document.activeElement)`);
  await open('start');
  await probe('window.__datePickerCleanup=root;');
  await route('components?component=badge');
  check('Custom date/time: component switch hides popup and detaches the old demo',await evaluate('!window.__datePickerCleanup.isConnected&&[...window.__datePickerCleanup.querySelectorAll("[data-cd-picker-popup]")].every(n=>n.hidden)'));
  const detached=await evaluate('window.__datePickerCleanup.outerHTML');
  await key('Escape','Escape');await click('#component-tab-usage');
  check('Custom date/time: disposed outside/key listeners no longer mutate the detached picker',await evaluate(`window.__datePickerCleanup.outerHTML===${JSON.stringify(detached)}`));
  await evaluate('delete window.__datePickerCleanup');
  await route('overview');
}
