import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
const html=await fs.readFile(new URL('../docs/index.html',import.meta.url),'utf8');
const origin='https://coffee.test/TheCoffeeSixSense/';
async function open(page){await page.route(origin,r=>r.fulfill({body:html,contentType:'text/html'}));await page.goto(origin);await page.locator('#open-first-pour').click();}
async function complete(page){for(let i=0;i<3;i++){if(page.viewportSize().width<1000)await page.locator('#fp-toggle').tap();else await page.locator('#fp-toggle').click();await page.clock.runFor(i===2?12000:7000);if(i<2){assert.equal(await page.locator('#fp-hold').isDisabled(),true);await page.locator('#fp-next').click();}}await page.locator('#fp-save').waitFor();}
for(const width of [320,390,820,1440]){
 const page=await browser.newPage({viewport:{width,height:1024},hasTouch:width<1000});const errors=[];page.on('pageerror',e=>errors.push(e.message));await open(page);
 const legacy=await page.evaluate(()=>Object.fromEntries(['c6s.sessions.v1','c6s.counter.v1','c6s.cafe.v1','c6s.real-brews.v1','tcs6-memory-v1'].map(k=>[k,localStorage.getItem(k)])));
 assert.equal(await page.locator('#first-pour').isVisible(),true);
 await page.locator('#fp-recipe [name=ratio]').fill('0');await page.locator('#fp-start').click();assert.ok(await page.locator('#fp-recipe').isVisible());assert.equal(await page.locator('#fp-recipe [name=ratio]').evaluate(el=>el.validity.valid),false);
 await page.locator('#fp-preset').click();await page.locator('#fp-start').click();
 if(width===320){await page.locator('#fp-toggle').click();await page.waitForTimeout(650);assert.ok(Number(await page.locator('#fp-water').innerText())>5);await page.locator('#fp-toggle').click();}
 await page.clock.install({time:new Date('2026-10-24T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-24T12:00:01Z'));
 await page.locator('#fp-hold').focus();await page.keyboard.down('Space');await page.clock.runFor(500);await page.keyboard.up('Space');const held=Number(await page.locator('#fp-water').innerText());assert.ok(held>0);await page.clock.runFor(500);assert.equal(Number(await page.locator('#fp-water').innerText()),held);
 await page.locator('#fp-toggle').click();await page.clock.runFor(300);await page.evaluate(()=>dispatchEvent(new Event('blur')));const paused=await page.locator('#fp-water').innerText();await page.clock.runFor(500);assert.equal(await page.locator('#fp-water').innerText(),paused);
 await page.locator('#fp-toggle').click();await page.clock.runFor(300);await page.locator('#fp-stage-title').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));
 await page.screenshot({path:`/tmp/first-pour-${width}-pour.png`});
 await page.locator('#fp-reset').click();await page.locator('#fp-start').click();await complete(page);
 assert.match(await page.locator('#fp-game').innerText(),/300 ml/);assert.match(await page.locator('.fp-score').innerText(),/100\/100/);
 await page.locator('#fp-feedback [name=notes]').fill('Một góc yên bình <script>not executable</script>');
 await page.locator('#fp-feedback [name=nextChange]').fill('Thử cỡ xay 19');
 await page.locator('#fp-feedback details summary').click();await page.locator('#fp-feedback [name=aroma]').selectOption('5');await page.locator('#fp-feedback [name=enjoyment]').selectOption('2');
 // EN/VI through the existing global language control preserves an unsaved result.
 await page.locator('#cafe-language').selectOption('en');assert.equal(await page.locator('#fp-feedback [name=notes]').inputValue(),'Một góc yên bình <script>not executable</script>');assert.match(await page.locator('#fp-game').innerText(),/Three stages complete/);
 await page.locator('#fp-save').click();await page.locator('#fp-save').click();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('c6s.first-pour.v03')).records.length),1);
 await page.locator('#fp-retry').click();assert.equal(await page.locator('#fp-recipe [name=grind]').inputValue(),'18');await page.locator('#fp-recipe [name=grind]').fill('19');await page.locator('#fp-start').click();await complete(page);await page.locator('#fp-save').click();
 assert.match(await page.locator('#fp-comparison').innerText(),/Grind/);assert.match(await page.locator('#fp-comparison').innerText(),/5/);assert.equal(await page.locator('.fp-history article').count(),2);
 const download=page.waitForEvent('download');await page.locator('#fp-export').click();const downloaded=await download;const exported=JSON.parse(await fs.readFile(await downloaded.path(),'utf8'));assert.equal(exported.records.length,2);assert.equal(exported.kind,'first-pour-game-memory');assert.equal(exported.records[0].feedback.axes.aroma,5);assert.equal(exported.records[0].feedback.enjoyment,2);assert.equal(exported.records[0].result.score,100);assert.equal(exported.records[1].result.score,97);
 assert.equal(await page.locator('#fp-comparison td').first().evaluate(el=>getComputedStyle(el).whiteSpace),'normal');await page.locator('#fp-comparison').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'start'}));await page.screenshot({path:`/tmp/first-pour-${width}-memory.png`});
 await page.reload();await page.locator('#open-first-pour').click();assert.equal(await page.locator('.fp-history article').count(),2);await page.locator('[data-delete]').first().click();await page.locator('[data-confirm-delete]').click();assert.equal(await page.locator('.fp-history article').count(),1);await page.reload();await page.locator('#open-first-pour').click();assert.equal(await page.locator('.fp-history article').count(),1);
 const after=await page.evaluate(()=>Object.fromEntries(['c6s.sessions.v1','c6s.counter.v1','c6s.cafe.v1','c6s.real-brews.v1','tcs6-memory-v1'].map(k=>[k,localStorage.getItem(k)])));assert.deepEqual(after,legacy);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);console.log(`${width}px: input bounds, three stages, hold/keyboard/blur, reset, result, language/drafts, save/deduplicate/reload, compare/export/delete and old stores passed`);await page.close();
}
// Quota failure keeps an exportable draft and permits retry; malformed data never overwritten.
for(const corrupt of [false,true]){
 const page=await browser.newPage();await page.addInitScript(corrupt=>{if(corrupt)localStorage.setItem('c6s.first-pour.v03','{broken-original');else{const original=Storage.prototype.setItem;Storage.prototype.setItem=function(key,value){if(key==='c6s.first-pour.v03'&&!window.allowFirstSave)throw new DOMException('Quota','QuotaExceededError');return original.call(this,key,value);};}},corrupt);await open(page);await page.clock.install({time:new Date('2026-10-24T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-24T12:00:01Z'));await page.locator('#fp-start').click();await complete(page);await page.locator('#fp-save').click();assert.match(await page.locator('#fp-notice').innerText(),corrupt?/không ghi đè/:/Chưa lưu/);const dl=page.waitForEvent('download');await page.locator('#fp-draft-export').click();const file=JSON.parse(await fs.readFile(await (await dl).path(),'utf8'));assert.equal(file.record.pour.water,300);if(corrupt)assert.equal(await page.evaluate(()=>localStorage.getItem('c6s.first-pour.v03')),'{broken-original');else{await page.evaluate(()=>{window.allowFirstSave=true;});await page.locator('#fp-save').click();assert.equal(await page.locator('.fp-history article').count(),1);}await page.close();
}
await browser.close();console.log('Quota retry, draft export and corrupt-store protection passed');
