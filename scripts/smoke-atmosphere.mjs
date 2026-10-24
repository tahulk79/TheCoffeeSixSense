import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{const Original=window.AudioContext;window.AudioContext=class extends Original{constructor(...args){super(...args);window.testAudio=this;window.testAnalyser=this.createAnalyser();window.testAnalyser.connect(this.destination);}createDynamicsCompressor(){const node=super.createDynamicsCompressor();node.connect(window.testAnalyser);return node;}};});
 await page.route('https://coffee.test/',async r=>r.fulfill({body:await fs.readFile(new URL('../docs/index.html',import.meta.url),'utf8'),contentType:'text/html'}));
 await page.goto('https://coffee.test/');await page.locator('#cafe-sound-panel>summary').click();
 assert.equal(await page.evaluate(()=>Boolean(window.testAudio)),false);
 assert.equal(await page.locator('#cafe-music').getAttribute('aria-pressed'),'false');
 await page.screenshot({path:`/tmp/cozy-${width}-home.png`,fullPage:true});
 await page.locator('#cafe-music').click();
 await page.waitForFunction(()=>window.testAudio?.state==='running');
 await page.waitForTimeout(550);
 const rms=await page.evaluate(()=>{const samples=new Float32Array(testAnalyser.fftSize);testAnalyser.getFloatTimeDomainData(samples);return Math.sqrt(samples.reduce((sum,n)=>sum+n*n,0)/samples.length);});
 assert.ok(rms>.0001,`Audio signal missing: ${rms}`);
 await page.locator('#cafe-volume').fill('40');
 await page.locator('#cafe-language').selectOption('en');
 assert.equal(await page.locator('#cafe-music').getAttribute('aria-pressed'),'true');
 assert.equal(await page.locator('#cafe-volume').inputValue(),'40');
 await page.locator('#counter-play-nav').click();await page.locator('#toggle-pour').click();await page.waitForTimeout(800);
 assert.ok(Number(await page.locator('#live-volume').innerText())>5);
 assert.equal(await page.locator('#cafe-music').getAttribute('aria-pressed'),'true');
 await page.screenshot({path:`/tmp/cozy-${width}-pour.png`,fullPage:true});
 // Simulate the document visibility API to verify suspend/resume without a new audio context.
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForFunction(()=>testAudio.state==='suspended');
 await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:false});document.dispatchEvent(new Event('visibilitychange'));});
 await page.waitForFunction(()=>testAudio.state==='running');
 await page.locator('#cafe-music').click();await page.waitForFunction(()=>testAudio.state==='suspended');
 await page.reload();await page.locator('#cafe-sound-panel>summary').click();assert.equal(await page.locator('#cafe-volume').inputValue(),'40');assert.equal(await page.locator('#cafe-music').getAttribute('aria-pressed'),'false');assert.equal(await page.evaluate(()=>Boolean(window.testAudio)),false);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.scene-window i:first-child').evaluate(el=>getComputedStyle(el).animationName),'none');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 console.log(`${width}px: silent default, real audio signal, volume, language/rerender, pouring, visibility pause, mute/reload and reduced motion passed (RMS ${rms.toFixed(5)})`);await page.close();
}
// Unsupported audio must leave the game usable.
const page=await browser.newPage();await page.addInitScript(()=>{window.AudioContext=undefined;window.webkitAudioContext=undefined;});await page.route('https://coffee.test/',async r=>r.fulfill({body:await fs.readFile(new URL('../docs/index.html',import.meta.url),'utf8'),contentType:'text/html'}));await page.goto('https://coffee.test/');await page.locator('#cafe-sound-panel>summary').click();await page.locator('#cafe-music').click();assert.match(await page.locator('#music-status').innerText(),/Không phát/);await page.locator('#counter-play-nav').click();assert.ok(await page.locator('#hold-pour').isVisible());await browser.close();
