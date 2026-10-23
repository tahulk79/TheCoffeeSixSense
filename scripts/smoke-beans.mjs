const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');const baseURL=process.env.BASE_URL||'http://127.0.0.1:5173';import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
for(const path of ['/','/docs/index.html'])for(const connected of [false,true]){
 const context=await browser.newContext({viewport:{width:390,height:844},acceptDownloads:true});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));let scanBody;
 await page.route('**/bean-ai.json',route=>route.fulfill({json:{endpoint:connected?'https://scanner.test/api/bean-scan':''}}));
 await page.route('https://scanner.test/api/bean-scan',async route=>{scanBody=route.request().postDataJSON();await route.fulfill({headers:{'access-control-allow-origin':'*'},json:{fields:{name:{value:'AI name',confidence:'high',evidence:'AI name'},roaster:{value:'My roaster',confidence:'high',evidence:'My roaster'},origin:{value:'Vietnam',confidence:'low',evidence:'Viet…'},roastDate:{value:null,confidence:'unknown'}}}});});
 await page.goto(baseURL+path);await page.locator('#add-bean').waitFor();await page.locator('#add-bean').click();
 await page.locator('#bean-profile [name=name]').fill('My real coffee');
 const png=await page.evaluate(()=>{const canvas=document.createElement('canvas');canvas.width=320;canvas.height=240;const ctx=canvas.getContext('2d');ctx.fillStyle='#e4c39f';ctx.fillRect(0,0,320,240);ctx.fillStyle='#000';ctx.fillText('Coffee label',20,30);return canvas.toDataURL().split(',')[1];});
 const file={name:'label.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')};
 await page.locator('#packaging-photos').setInputFiles([file,{...file,name:'back.png'}]);await page.locator('#bean-profile .bean-photos img').nth(1).waitFor();
 await page.locator('#bean-photos').setInputFiles({...file,name:'beans.png'});await page.locator('#bean-profile .bean-photos img').nth(2).waitFor();
 if(connected){await page.locator('#scan-bean').click();await page.locator('#bean-profile [name=roaster]').waitFor();await page.waitForFunction(()=>document.querySelector('#bean-profile [name=roaster]').value==='My roaster');assert.equal(scanBody.images.length,2);assert.equal(await page.locator('#bean-profile [name=name]').inputValue(),'My real coffee');assert.equal(await page.locator('#bean-profile [name=roastDate]').inputValue(),'');assert.ok(await page.locator('.ai-uncertain').count()>0);}
 else{assert.equal(await page.locator('#scan-bean').count(),0);assert.match(await page.locator('#bean-profile').innerText(),/chưa được kết nối/);}
 await page.locator('#bean-profile [name=reviewed]').check();await page.locator('#bean-profile button[type=submit]').click();await page.locator('.bean-card').waitFor();assert.match(await page.locator('.bean-card').innerText(),/My real coffee/);
 await page.locator('.brew-personal').click();assert.match(await page.locator('#brew [name=bean]').inputValue(),/^custom-/);await page.locator('#brew button[type=submit]').click();for(let i=0;i<3;i++)await page.locator('#pour').click();
 assert.match(await page.locator('.balance').innerText(),/Không chấm điểm hạt riêng/);await page.locator('#taste [name=discovery]').fill('Try a different grind');await page.locator('#taste button[type=submit]').click();await page.locator('#saved-title').waitFor();
 await page.reload();await page.locator('.bean-card').waitFor();assert.equal(await page.locator('.session').count(),1);assert.match(await page.locator('.session').innerText(),/My real coffee/);assert.equal(await page.locator('.warning').count(),0);
 await page.locator('.edit-personal').click();assert.equal(await page.locator('#bean-profile .bean-photos img').count(),3);await page.locator('#bean-profile [name=name]').fill('Renamed bag');await page.locator('#bean-profile [name=reviewed]').check();await page.locator('#bean-profile button[type=submit]').click();await page.waitForFunction(()=>document.querySelector('.bean-card h3')?.textContent==='Renamed bag');assert.match(await page.locator('.session').innerText(),/My real coffee/);
 const dl=page.waitForEvent('download');await page.locator('#export-beans').click();assert.equal((await dl).suggestedFilename(),'coffee-bean-profiles.json');
 await page.locator('.retry').click();await page.locator('#reference').click();assert.equal(await page.locator('#brew [name=water]').inputValue(),'300');
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);console.log(`${path} scan=${connected}: photos, manual/AI review, field preservation, custom brewing, reload, edit, export, mobile passed`);await context.close();
}
await browser.close();
