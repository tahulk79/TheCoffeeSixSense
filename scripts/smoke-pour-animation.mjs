import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:950}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://coffee.test/',async r=>r.fulfill({body:await fs.readFile(new URL('../docs/index.html',import.meta.url),'utf8'),contentType:'text/html'}));await page.goto('https://coffee.test/');await page.locator('#open-first-pour').click();await page.clock.install({time:new Date('2026-10-24T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-24T12:00:01Z'));await page.locator('#fp-start').click();await page.locator('#fp-toggle').click();await page.clock.runFor(1200);
 assert.ok(await page.locator('.fp-stream').isVisible());assert.ok(await page.locator('.fp-coffee-stream').isVisible());
 const drop=page.locator('.fp-coffee-stream i').first(),water=page.locator('.fp-stream');
 const before=await drop.evaluate(el=>getComputedStyle(el).transform),waterBefore=await water.evaluate(el=>getComputedStyle(el).backgroundPositionY);
 await page.waitForTimeout(160);assert.notEqual(await drop.evaluate(el=>getComputedStyle(el).transform),before);assert.notEqual(await water.evaluate(el=>getComputedStyle(el).backgroundPositionY),waterBefore);
 await page.locator('.fp-station').screenshot({path:`/tmp/pour-animation-${width}-flow.png`});
 await page.locator('#fp-toggle').click();const fill=await page.locator('#fp-cup-fill').evaluate(el=>parseFloat(el.style.height));assert.equal(await water.isVisible(),false);assert.equal(await page.locator('.fp-coffee-stream').isVisible(),true);await page.clock.runFor(250);assert.ok(await page.locator('#fp-cup-fill').evaluate(el=>parseFloat(el.style.height))>fill);assert.equal(await page.locator('.fp-coffee-stream').isVisible(),true);
 await page.locator('.fp-station').screenshot({path:`/tmp/pour-animation-${width}-released.png`});await page.clock.runFor(2000);assert.equal(await page.locator('.fp-coffee-stream').isVisible(),false);
 await page.locator('#cafe-language').selectOption('en');assert.ok(await page.locator('#fp-hold').isVisible());
 await page.locator('#fp-reset').click();await page.locator('#fp-start').click();for(let stage=0;stage<3;stage++){await page.locator('#fp-toggle').click();await page.clock.runFor([2500,6100,3700][stage]);if(stage<2){assert.ok(await page.locator('#fp-next').isVisible());await page.locator('#fp-next').click();}}
 assert.equal(await page.locator('#fp-save').count(),0);assert.ok(await page.locator('.fp-coffee-stream').isVisible());assert.match(await page.locator('#fp-stage-status').innerText(),/waiting for.*drops/);assert.equal(await page.locator('#fp-toggle').isDisabled(),true);assert.equal(await page.locator('#fp-next').isDisabled(),true);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await drop.evaluate(el=>getComputedStyle(el).animationName),'none');assert.ok(await page.locator('.fp-coffee-stream').isVisible());await page.clock.runFor(10000);assert.ok(await page.locator('#fp-save').isVisible());assert.match(await page.locator('.fp-score').innerText(),/100\/100/);assert.deepEqual(errors,[]);console.log(`${width}px: water and droplets actually animate; release keeps drawdown and cup filling; final drops precede result; reduced motion remains legible`);await page.close();
}
await browser.close();
