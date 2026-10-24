const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://coffee.test/',async r=>r.fulfill({body:await fs.readFile(new URL('../docs/index.html',import.meta.url),'utf8'),contentType:'text/html'}));
 await page.goto('https://coffee.test/');await page.locator('#practice-counter>summary').click();await page.clock.install();await page.clock.pauseAt(new Date());await page.screenshot({path:`/tmp/cafe-${width}-setup.png`,fullPage:true});
 assert.equal(await page.locator('#app').isVisible(),false);await page.locator('.lesson-picker summary').click();await page.locator('[data-lesson=free]').click();
 await page.locator('#cafe-start').click();await page.clock.runFor(2000);assert.equal(await page.locator('#live-clock').innerText(),'00:00');
 const hold=page.locator('#hold-pour');await hold.scrollIntoViewIfNeeded();const box=await hold.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.clock.runFor(1000);await page.mouse.up();const released=Number(await page.locator('#live-volume').innerText());assert.ok(released>10);assert.match(await page.locator('#live-pour-clock').innerText(),/00:0[56]/);const pourClock=await page.locator('#live-pour-clock').innerText();assert.equal(await page.locator('#live-clock').innerText(),pourClock);await page.clock.runFor(1000);assert.equal(Number(await page.locator('#live-volume').innerText()),released);assert.match(await page.locator('#live-clock').innerText(),/00:1[12]/);assert.equal(await page.locator('#live-pour-clock').innerText(),pourClock);assert.equal(await page.locator('.live-brew').evaluate(el=>el.classList.contains('is-pouring')),false);assert.equal(await page.locator('.live-brew').evaluate(el=>el.classList.contains('is-draining')),false);
 await hold.focus();await page.keyboard.down('Space');await page.clock.runFor(500);await page.keyboard.up('Space');await page.clock.runFor(100);assert.equal(await page.locator('.live-brew').evaluate(el=>el.classList.contains('is-draining')),true);const clockRect=await page.locator('.live-timers').boundingBox();assert.ok(clockRect.y>=0&&clockRect.y+clockRect.height<=844);await page.screenshot({path:`/tmp/cafe-${width}-timers.png`});assert.ok(Number(await page.locator('#live-volume').innerText())>released);
 await page.locator('#toggle-pour').dispatchEvent('click');await page.evaluate(()=>dispatchEvent(new Event('blur')));const paused=await page.locator('#live-volume').innerText();await page.clock.runFor(500);assert.equal(await page.locator('#live-volume').innerText(),paused);
 await page.locator('#cafe-abort').click();await page.locator('#cafe-start').click();
 // Advance the animation clock without waiting 30 real seconds per cup.
 
 await page.locator('#toggle-pour').click();
 await page.clock.runFor(16000);
 await page.screenshot({path:`/tmp/cafe-${width}-pour.png`,fullPage:true});
 await page.clock.runFor(50000);
 assert.ok(await page.locator('#cafe-retry').isVisible());
 const first=await page.locator('#cafe-play').innerText();assert.match(first,/ml/);assert.ok((await page.evaluate(()=>JSON.parse(localStorage.getItem('c6s.counter.v1')).rounds.at(-1))).overflow>10);
 await page.locator('#cafe-retry').click();await page.locator('#cafe-heat').selectOption('88');await page.locator('#cafe-start').click();
 for(let i=0;i<6;i++){await page.locator('#toggle-pour').dispatchEvent('click');await page.clock.runFor(1300);if(await page.locator('#toggle-pour').isEnabled())await page.locator('#toggle-pour').dispatchEvent('click');await page.clock.runFor(2200);}
 await page.clock.runFor(30000);
 assert.ok(await page.locator('.cup-comparison').isVisible());assert.match(await page.locator('.cup-comparison').innerText(),/Số nhịp rót/);await page.locator('.round-details>summary').click();await page.locator('.brew-timeline summary').click();assert.ok(await page.locator('.brew-timeline li').count()>5);
 await page.screenshot({path:`/tmp/cafe-${width}-result.png`,fullPage:true});
 await page.locator('.optional-note summary').click();await page.locator('#cafe-note').fill('Less overflow <test>');await page.locator('#cafe-language').selectOption('en');assert.equal(await page.locator('#cafe-note').inputValue(),'Less overflow <test>');await page.locator('.optional-note summary').click();await page.locator('#save-cafe-note').click();assert.match(await page.locator('#cafe-note-status').innerText(),/Saved/);assert.match(await page.locator('#cafe-play').innerText(),/What changed/);
 await page.locator('#cafe-next').click();assert.match(await page.locator('.guest-card').innerText(),/Linh/);
 await page.reload();await page.locator('#practice-counter>summary').click();assert.match(await page.locator('.cafe-main').innerText(),/2 cups brewed/);await page.locator('#studio-toggle').click();assert.ok(await page.locator('#app').isVisible());
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);console.log(`${width}px: hold/release, keyboard, blur, two cups, comparison, notes, language, persistence and optional studio passed`);await page.close();
}
await browser.close();
