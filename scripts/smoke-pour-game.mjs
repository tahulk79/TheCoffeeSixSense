const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import assert from 'node:assert/strict';
import {chooseObservedPour,finishPour} from './browser-helpers.mjs';
const baseURL=process.env.BASE_URL||'http://127.0.0.1:5173';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
for(const path of (process.env.TEST_PATHS||'/,/docs/index.html').split(','))for(const width of [360,768,1440]){
 const context=await browser.newContext({viewport:{width,height:width===360?640:900}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(baseURL+path);await page.waitForFunction(()=>document.querySelector('#add-bean')&&!document.querySelector('#add-bean').disabled);if(width===360){const rect=await page.locator('#quick-play').boundingBox();assert.ok(rect&&rect.y+rect.height<=640);}await page.locator('#quick-play').click();assert.equal(await page.locator('.dripper').getAttribute('data-cue'),'dryBloom');
 await page.locator('[data-action=settle]').dblclick();assert.equal(await page.locator('.dripper').getAttribute('data-cue'),'unevenFlow');assert.match(await page.locator('.decision-feedback').innerText(),/Mảng khô/);
 const cue=await page.locator('.dripper').getAttribute('data-cue');await page.locator('#language').selectOption('en');assert.equal(await page.locator('.dripper').getAttribute('data-cue'),cue);await chooseObservedPour(page);await chooseObservedPour(page);
 assert.match(await page.locator('.balance').innerText(),/94/);assert.match(await page.locator('.score-ledger').innerText(),/−6/);assert.equal(await page.locator('#sensory-details').getAttribute('open'),null);assert.equal(await page.locator('#result > .pour-report li').count(),3);
 await page.locator('#taste button[type=submit]').click();await page.locator('#saved-title').waitFor();assert.match(await page.locator('.journey').innerText(),/10 XP/);
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('c6s.sessions.v1'))[0]);assert.deepEqual(before.pourRun.actions,['settle','redistribute','finishEven']);
 await page.locator('#try-next').click();assert.match(await page.locator('#recipe-message').innerText(),/Gently swirl/);await page.locator('#language').selectOption('vi');assert.match(await page.locator('#recipe-message').innerText(),/Đảo nhẹ/);
 assert.equal(await page.locator('[name=grind]').inputValue(),String(before.parameters.grind));await page.locator('#brew button[type=submit]').click();await finishPour(page);assert.match(await page.locator('.balance').innerText(),/100/);assert.equal(await page.locator('#recipe-message').innerText(),'');await page.locator('#taste button[type=submit]').click();await page.locator('#saved-title').waitFor();
 const history=await page.evaluate(()=>JSON.parse(localStorage.getItem('c6s.sessions.v1')));assert.equal(history.length,2);assert.equal(history[0].pourRun.scenario,history[1].pourRun.scenario);assert.deepEqual(history[0].parameters,history[1].parameters);assert.equal(history[1].simulatedScore,100);
 // The next clean-round goal changes one approach; keep the same scenario.
 await page.locator('#try-next').click();assert.equal(await page.locator('[name=technique]').inputValue(),'steady');await page.locator('#brew button[type=submit]').click();assert.equal(await page.locator('.dripper').getAttribute('data-cue'),'evenBloom');
 // Keyboard choices work and can finish without fine motor timing.
 for(let i=0;i<3;i++){const cue=await page.locator('.dripper').getAttribute('data-cue');const action={dryBloom:'swirl',evenBloom:'settle',highWater:'pause',lowWater:'feed',unevenFlow:'redistribute',tiltedBed:'recenter',levelBed:'finishEven'}[cue];assert.ok(action);await page.locator(`[data-action=${action}]`).focus();await page.keyboard.press('Enter');}
 await page.locator('#taste').waitFor();assert.match(await page.locator('.balance').innerText(),/100/);
 await page.reload();assert.equal(await page.locator('.session').count(),2);assert.equal(await page.locator('.session .pour-report').count(),2);assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 console.log(`${path} ${width}px: visible cues, consequences, 94→100 replay, one-change goal, keyboard and persistence passed`);await context.close();
}
await browser.close();
