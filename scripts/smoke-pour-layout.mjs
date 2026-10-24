import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
for(const [width,height] of [[320,700],[390,844],[820,1024],[1440,900]])for(const language of ['vi','en']){
 const page=await browser.newPage({viewport:{width,height}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.route('https://coffee.test/',async r=>r.fulfill({body:await fs.readFile(new URL('../docs/index.html',import.meta.url),'utf8'),contentType:'text/html'}));await page.goto('https://coffee.test/');await page.locator('#cafe-language').selectOption(language);await page.locator('#open-first-pour').click();await page.clock.install({time:new Date('2026-10-24T12:00:00Z')});await page.clock.pauseAt(new Date('2026-10-24T12:00:01Z'));await page.locator('#fp-start').click();
 await page.screenshot({path:`/tmp/pour-layout-${width}-${language}-initial.png`});
 // The user's initial positioning is allowed; subsequent automatic stage changes must not scroll.
 await page.locator('#fp-hold').evaluate(el=>el.scrollIntoView({behavior:'instant',block:'center'}));
 await page.evaluate(()=>{window.originalPour=document.querySelector('#fp-hold');window.originalArt=document.querySelector('.fp-station');});
 const geometry=()=>page.evaluate(()=>({scroll:scrollY,buttons:['fp-hold','fp-toggle','fp-next'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {y:r.y,height:r.height};})}));
 const base=await geometry();assert.ok(base.buttons.every(r=>r.y>=0&&r.y+r.height<=height),`initial controls not in viewport at ${width}`);
 async function unchanged(label){const current=await geometry();assert.ok(Math.abs(current.scroll-base.scroll)<1,`${label}: page scrolled at ${width}/${language}`);current.buttons.forEach((r,i)=>{assert.ok(Math.abs(r.y-base.buttons[i].y)<1,`${label}: button ${i} moved at ${width}/${language}`);assert.ok(Math.abs(r.height-base.buttons[i].height)<1,`${label}: button height changed`);});assert.equal(await page.evaluate(()=>originalPour===document.querySelector('#fp-hold')&&originalArt===document.querySelector('.fp-station')),true);}
 for(let stage=0;stage<3;stage++){
  await page.locator('#fp-toggle').dispatchEvent('click');await page.clock.runFor([2500,6100,3700][stage]);await unchanged(`stage ${stage+1} complete`);
  assert.equal(await page.locator('#fp-toggle').isDisabled(),true);assert.equal(await page.locator('.fp-stages [aria-current=step]').count(),1);
  if(stage<2){assert.equal(await page.locator('#fp-next').isEnabled(),true);await page.locator('#fp-next').dispatchEvent('click');await unchanged(`stage ${stage+2} start`);assert.equal(await page.evaluate(()=>document.activeElement.id),'fp-hold');}
 }
 await page.screenshot({path:`/tmp/pour-layout-${width}-${language}.png`});await page.clock.runFor(10000);assert.ok(await page.locator('#fp-save').isVisible());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);console.log(`${width}x${height} ${language}: all three control positions, page scroll, focus and artwork nodes stable across every stage; completion works`);await page.close();
}
await browser.close();
