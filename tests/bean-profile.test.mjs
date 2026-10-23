import {test} from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {normalizeBeanFields,normalizeExtraction,mergeExtraction,validBeanProfile,validRoastDate} from '../src/bean-model.js';
import {loadJournal} from '../src/game.js';
import {extractLabelFields} from '../src/label-ocr.js';
import crypto from 'node:crypto';
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
test('OCR engine is pinned and language assets match authoritative upstream checksums',()=>{
 const metadata=JSON.parse(fs.readFileSync('public/ocr/lang/SOURCES.json','utf8'));
 for(const [name,expected]of Object.entries(metadata.files))assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/ocr/lang/'+name)).digest('hex'),expected.sha256);
 assert.equal(JSON.parse(fs.readFileSync('node_modules/tesseract.js/package.json')).version,'6.0.1');
});
test('labeled Vietnamese and English text populates only explicit fields',()=>{
 const result=extractLabelFields([{text:'Tên sản phẩm: Cà phê của tôi\nHãng rang: Six Sense\nQuốc gia: Việt Nam\nNgày rang: 2026-10-01\nHương vị: Chocolate, citrus',confidence:94}]);
 const fields=normalizeExtraction(result);assert.equal(fields.name.value,'Cà phê của tôi');assert.equal(fields.origin.value,'Việt Nam');assert.equal(fields.roastDate.value,'2026-10-01');assert.equal(fields.labelNotes.value,'Chocolate, citrus');assert.equal(fields.variety.value,'');
});
test('unlabeled text and conflicting or ambiguous fields are not guessed',()=>{
 assert.equal(extractLabelFields([{text:'ETHIOPIA\nChocolate citrus\nSPECIALTY COFFEE',confidence:99}]).fields.origin.value,null);
 const result=normalizeExtraction(extractLabelFields([{text:'Origin: Vietnam\nRoast date: 10/11/26',confidence:99},{text:'Origin: Ethiopia',confidence:99}]));assert.equal(result.origin.value,'');assert.equal(result.roastDate.value,'');assert.match(result.origin.evidence,/Vietnam/);assert.match(result.origin.evidence,/Ethiopia/);
});
test('OCR uncertainty is retained and existing manual fields win',()=>{
 const extraction=normalizeExtraction(extractLabelFields([{text:'Name: Read name\nRoaster: Label roaster',confidence:52}]));assert.equal(extraction.name.confidence,'low');assert.equal(mergeExtraction({name:'Manual name'},extraction).name,'Manual name');assert.equal(mergeExtraction({name:'Manual name'},extraction).roaster,'Label roaster');
});
