import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {normalizeBeanFields,normalizeExtraction,mergeExtraction,validBeanProfile,validRoastDate} from '../src/bean-model.js';
import {loadJournal} from '../src/game.js';
import {createBeanScanner} from '../server/bean-scan.mjs';
test('extraction keeps missing data blank and rejects ambiguous dates',()=>{
 const extraction=normalizeExtraction({fields:{name:{value:' Label coffee ',confidence:'high',evidence:'Label coffee'},origin:{value:null},roastDate:{value:'10/11/26',confidence:'high'}}});
 assert.equal(extraction.name.value,'Label coffee');assert.equal(extraction.origin.value,'');assert.equal(extraction.roastDate.value,'');assert.equal(extraction.roastDate.confidence,'unknown');assert.equal(validRoastDate('2026-02-31'),false);
 assert.equal(mergeExtraction({name:'My own name'},extraction).name,'My own name');assert.equal(mergeExtraction({},extraction).name,'Label coffee');
});
test('profiles require a name and safe image data; all optional fields may be unknown',()=>{
 assert.equal(validBeanProfile({id:'custom-abc',fields:normalizeBeanFields({name:'My coffee'})}),true);
 assert.equal(validBeanProfile({id:'custom-abc',fields:normalizeBeanFields()}),false);
 assert.equal(validBeanProfile({id:'custom-abc',fields:{name:'Bag'},photos:[{id:'photo1',kind:'beans',dataUrl:'javascript:alert(1)'}]}),false);
});
test('custom journal records keep a bean snapshot and have no simulated target score',()=>{
 const session={bean:'custom-abc',beanProfile:{name:'My coffee',origin:'Vietnam'},parameters:{dose:20,water:300,temp:94,grind:18},simulatedScore:null,date:'2026-10-23T00:00:00Z'};
 assert.equal(loadJournal(JSON.stringify([session])).writable,true);assert.equal(loadJournal(JSON.stringify([{...session,simulatedScore:100}])).writable,false);assert.equal(loadJournal(JSON.stringify([{...session,beanProfile:{}}])).writable,false);
});
test('Pages AI config matches the Vite config and ships without a secret or guessed endpoint',()=>{
 assert.equal(fs.readFileSync('docs/bean-ai.json','utf8'),fs.readFileSync('public/bean-ai.json','utf8'));assert.deepEqual(JSON.parse(fs.readFileSync('public/bean-ai.json','utf8')),{endpoint:''});
});
const origin='https://tahulk79.github.io';const image='data:image/jpeg;base64,/9j/AA==';
const request=(body={images:[image]},override={})=>new Request('http://localhost/api/bean-scan',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json',...override},body:JSON.stringify(body)});
test('scanner sends only provided photos, requests strict extraction, and normalizes provider output',async()=>{
 let upstream;
 const handler=createBeanScanner({apiKey:'test-only-not-a-key',origins:[origin],consumeQuota:async()=>true,fetchAI:async(url,options)=>{upstream=JSON.parse(options.body);assert.equal(url,'https://api.openai.com/v1/responses');return Response.json({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify({fields:{name:{value:'Bag name',confidence:'high',evidence:'Bag name'}}})}]}]});}});
 const response=await handler(request());assert.equal(response.status,200);assert.equal((await response.json()).fields.name.value,'Bag name');assert.equal(upstream.store,false);assert.equal(upstream.text.format.strict,true);assert.deepEqual(upstream.input[0].content,[{type:'input_image',image_url:image,detail:'high'}]);assert.equal(response.headers.get('access-control-allow-origin'),origin);
});
test('scanner rejects unavailable credentials, disallowed origins, bad photos, and quotas without provider calls',async()=>{
 const handler=options=>createBeanScanner({apiKey:'test-only',origins:[origin],consumeQuota:async()=>true,fetchAI:()=>{throw new Error('Must not call');},...options});
 assert.equal((await handler({apiKey:''})(request())).status,503);assert.equal((await handler({})(request(undefined,{Origin:'https://other.test'}))).status,403);assert.equal((await handler({})(request({images:['https://private-host/image.jpg']}))).status,400);assert.equal((await handler({consumeQuota:async()=>false})(request())).status,429);
});
test('provider errors and refusal do not expose request photos, keys or raw error details',async()=>{
 for(const result of [new Response('secret error',{status:401}),Response.json({status:'incomplete'}),Response.json({status:'completed',output:[{content:[{type:'refusal',refusal:'No'}]}]})]){
 const handler=createBeanScanner({apiKey:'test-only',origins:[origin],consumeQuota:async()=>true,fetchAI:async()=>result});const response=await handler(request());assert.equal(response.status,502);assert.ok(!(await response.text()).includes('secret error'));
 }
});
