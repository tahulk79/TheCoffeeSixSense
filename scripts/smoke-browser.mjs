import { chooseObservedPour, finishPour } from './browser-helpers.mjs';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:5173';
import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
async function brew(page){await page.locator('#brew button[type=submit]').click();await finishPour(page);await page.locator('#taste').waitFor();}
for(const path of ['/','/docs/index.html'])for(const width of [360,768,1440]){
 const context=await browser.newContext({viewport:{width,height:900},acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(baseURL+path);
 assert.equal(await page.locator('html').getAttribute('lang'),'vi');assert.match(await page.locator('h1').innerText(),/Pha/);
 await page.locator('#recipe-controls summary').click();await page.locator('[name=water]').fill('0');await page.locator('#brew button[type=submit]').click();assert.equal(await page.locator('.pour-choice').count(),0);
 await page.locator('#reference').click();assert.equal(await page.locator('[name=water]').inputValue(),'300');
 await page.locator('#brew button[type=submit]').click();await chooseObservedPour(page);
 await page.locator('#language').selectOption('en');assert.match(await page.locator('#pour-title').innerText(),/2 \/ 3/);
 await chooseObservedPour(page);await chooseObservedPour(page);
 assert.equal(await page.locator('[name=aroma]').inputValue(),'');assert.equal(await page.locator('[name=ratingMode]').inputValue(),'hypothesis');
 await page.locator('[name=notes]').fill('A gentle cup <script>alert(1)</script>');await page.locator('[name=discovery]').fill('Try a coarser grind');await page.locator('#sensory-details summary').click();await page.locator('[name=aroma]').selectOption('4');
 await page.locator('#language').selectOption('vi');assert.equal(await page.locator('[name=notes]').inputValue(),'A gentle cup <script>alert(1)</script>');assert.equal(await page.locator('[name=aroma]').inputValue(),'4');
 await page.locator('#taste button[type=submit]').click();await page.locator('#saved-title').waitFor();assert.equal(await page.locator('.session').count(),1);assert.match(await page.locator('.journey').innerText(),/15 XP/);
 await page.locator('#again').click();assert.equal(await page.locator('[name=grind]').inputValue(),'18');await page.locator('[name=grind]').fill('19');await brew(page);
 await page.locator('[name=ratingMode]').selectOption('real');await page.locator('#sensory-details summary').click();await page.locator('[name=mood]').selectOption('5');await page.locator('#taste button[type=submit]').click();
 await page.reload();assert.equal(await page.locator('.session').count(),2);assert.match(await page.locator('.session').first().innerText(),/ly cà phê thật/);
 await page.locator('.compare summary').click();assert.equal(await page.locator('#comparison tbody tr').count(),9);await page.locator('#compare-a').selectOption('1');assert.match(await page.locator('#comparison').innerText(),/Chọn hai/);
 const dl=page.waitForEvent('download');await page.locator('#export').click();assert.equal((await dl).suggestedFilename(),'coffee-memory.json');
 // Failed writes retain the draft and cannot give XP or create a duplicate session.
 await brew(page);await page.locator('[name=notes]').fill('Keep this draft');await page.evaluate(()=>{globalThis.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
 await page.locator('#taste button[type=submit]').click();assert.match(await page.locator('#save-error').innerText(),/Chưa lưu/);assert.equal(await page.locator('[name=notes]').inputValue(),'Keep this draft');assert.equal(await page.locator('.session').count(),2);
 const draftDl=page.waitForEvent('download');await page.locator('#draft-export').click();assert.equal((await draftDl).suggestedFilename(),'coffee-memory-draft.json');
 await page.evaluate(()=>Storage.prototype.setItem=globalThis.originalSet);await page.locator('#taste button[type=submit]').click();assert.equal(await page.locator('.session').count(),3);
 await page.locator('#again').click();await page.locator('#brew button[type=submit]').click();page.once('dialog',d=>d.dismiss());await page.locator('#cancel').click();assert.equal(await page.locator('.pour-choice').count(),2);page.once('dialog',d=>d.accept());await page.locator('#cancel').click();assert.equal(await page.locator('#brew').count(),1);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);
 console.log(`${path} ${width}px: bilingual brew/taste/save/retry, comparison, export, quota recovery, cancel, no overflow/errors passed`);await context.close();
}
// Old journal migration and corrupt storage never erase user data.
for(const invalid of [false,true]){
 const context=await browser.newContext();const page=await context.newPage();await page.goto(baseURL+'/docs/index.html');
 const raw=invalid?'{broken':JSON.stringify([{bean:'ethiopia',date:'2026-10-23T09:00:00Z',parameters:{dose:20,water:300,temp:94,grind:18},simulatedScore:100,notes:'Old note',taste:{aroma:3}}]);
 await page.evaluate(raw=>localStorage.setItem('c6s.sessions.v1',raw),raw);await page.reload();
 if(invalid){await page.locator('#recovery').waitFor();await brew(page);assert.equal(await page.locator('#taste button[type=submit]').isDisabled(),true);assert.equal(await page.evaluate(()=>localStorage.getItem('c6s.sessions.v1')),raw);}
 else{assert.equal(await page.locator('.session').count(),1);assert.match(await page.locator('.session').innerText(),/chưa phân loại/);assert.equal(await page.locator('#quick-play').isVisible(),true);}
 await context.close();
}
console.log('Legacy history and corrupt-storage preservation passed');await browser.close();
