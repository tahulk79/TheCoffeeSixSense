import {test} from 'node:test';
import assert from 'node:assert/strict';
import {coffeeBeans, validRecipe, brewScore, pourPlan, experimentHint, loadJournal, tasteMean} from '../src/game.js';
import {copy,translate} from '../src/i18n.js';
import {missionProgress} from '../src/missions.js';
const bean=coffeeBeans[0];
const saved=()=>({bean:bean.id,parameters:{...bean.target},date:new Date().toISOString(),simulatedScore:100});
test('reference recipes work and technique changes simulated balance only',()=>{
 for(const bean of coffeeBeans){assert.equal(brewScore(bean,bean.target,'pulse'),100);assert.equal(brewScore(bean,bean.target,'steady'),96);assert.equal(brewScore(bean,bean.target,'fast'),88);}
 assert.equal(validRecipe({...bean.target,water:NaN}),false);assert.equal(validRecipe({...bean.target,temp:101}),false);assert.throws(()=>brewScore(bean,{...bean.target,dose:0}));assert.throws(()=>brewScore(bean,bean.target,'unknown'));
});
test('three pours always advance and finish at the chosen volume including boundary recipes',()=>{
 for(const dose of [5,20,50])for(const water of [50,300,800]){const recipe={...bean.target,dose,water};const plan=pourPlan(recipe);assert.equal(plan.length,3);assert.ok(plan[0]>0);assert.ok(plan[0]<plan[1]&&plan[1]<plan[2]);assert.equal(plan[2],water);}
});
test('feedback identifies the largest weighted discrepancy or technique',()=>{
 assert.deepEqual(experimentHint(bean,{...bean.target,temp:80},'pulse'),{field:'temp',direction:'raise'});
 assert.deepEqual(experimentHint(bean,bean.target,'fast'),{field:'technique'});
 assert.deepEqual(experimentHint(bean,bean.target,'pulse'),{field:'matched'});
});
test('old journal records remain readable without fabricating new ratings or techniques',()=>{
 const old=saved();const loaded=loadJournal(JSON.stringify([old]));assert.equal(loaded.writable,true);assert.deepEqual(loaded.sessions,[old]);assert.equal(tasteMean(old),'—');assert.equal(loadJournal(null).writable,true);
});
test('corrupt and invalid journals are preserved and cannot be overwritten',()=>{
 for(const raw of ['{bad','{}',JSON.stringify([null]),JSON.stringify([{...saved(),parameters:{dose:20}}]),JSON.stringify([{...saved(),technique:'<img src=x onerror=alert(1)>'}]),JSON.stringify([{...saved(),discovery:15}]),JSON.stringify([{...saved(),taste:{aroma:9}}])]){const loaded=loadJournal(raw);assert.equal(loaded.writable,false);assert.equal(loaded.raw,raw);assert.deepEqual(loaded.sessions,[]);}
});
test('personal mean ignores unanswered dimensions',()=>{
 assert.equal(tasteMean({taste:{aroma:4,acidity:null}}),'4.0');assert.equal(tasteMean({taste:{aroma:null}}),'—');
});
test('both languages have complete matching dictionaries',()=>{
 assert.deepEqual(Object.keys(copy.vi).sort(),Object.keys(copy.en).sort());assert.equal(translate('vi','start'),'Bắt đầu pha');assert.equal(translate('en','start'),'Start brewing');
});
test('a one-technique experiment counts, but a technique plus recipe change does not',()=>{
 const a={...saved(),technique:'steady'};const b={...saved(),technique:'pulse',discovery:'Compare pours'};
 assert.equal(missionProgress([a,b])[2].complete,true);assert.equal(missionProgress([a,{...b,parameters:{...b.parameters,temp:93}}])[2].complete,false);
});
