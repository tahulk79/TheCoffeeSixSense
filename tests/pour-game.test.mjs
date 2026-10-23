import {test} from 'node:test';import assert from 'node:assert/strict';
import {createPourRun,pourSituation,choosePourAction,pourSummary,gameplayScore,nextPourGoal,validPourRun} from '../src/pour-game.js';
import {coffeeBeans,loadJournal} from '../src/game.js';
import {missionProgress} from '../src/missions.js';
const bean=coffeeBeans[0];
function complete(scenario=0,technique='pulse',first=null){let run=createPourRun(scenario,technique);for(let i=0;i<3;i++)run=choosePourAction(run,i===0&&first?first:pourSituation(run).recommended).run;return run;}
test('every scenario and starting approach can be handled without an automatic technique penalty',()=>{
 for(let scenario=0;scenario<3;scenario++)for(const technique of ['pulse','steady','fast']){
  const run=complete(scenario,technique);assert.equal(pourSummary(run).good,3);assert.equal(gameplayScore(bean,bean.target,run),100);assert.equal(run.actions.length,3);
 }
});
test('the same action can help or disturb depending on the visible situation',()=>{
 assert.equal(choosePourAction(createPourRun(0,'pulse'),'swirl').feedback.good,true);
 assert.equal(choosePourAction(createPourRun(1,'steady'),'swirl').feedback.good,false);
 const early=choosePourAction(createPourRun(0),'settle');assert.equal(pourSituation(early.run).cue,'unevenFlow');
 const recovered=choosePourAction(early.run,'redistribute');assert.equal(recovered.feedback.good,true);assert.equal(pourSummary(recovered.run).penalty,6);
});
test('choices update immutable state and invalid actions cannot skip a step',()=>{
 const run=createPourRun();const next=choosePourAction(run,'swirl');assert.deepEqual(run.actions,[]);assert.deepEqual(next.run.actions,['swirl']);assert.throws(()=>choosePourAction(run,'finishEven'));assert.throws(()=>choosePourAction(complete(),'swirl'));assert.throws(()=>gameplayScore(bean,bean.target,run));assert.ok(!validPourRun({version:1,scenario:50,technique:'pulse',actions:[]}));
});
test('retrying the first missed decision changes the outcome in a repeatable situation',()=>{
 const old=complete(0,'pulse','settle');const goal=nextPourGoal(bean,bean.target,old);assert.deepEqual(goal,{type:'action',stage:'bloom',action:'swirl'});
 const retried=complete(old.scenario,old.technique);assert.ok(gameplayScore(bean,bean.target,retried)>gameplayScore(bean,bean.target,old));assert.equal(pourSummary(old).penalty,6);
});
test('a clean pour suggests only one bounded recipe change or a different visible challenge',()=>{
 const parameters={...bean.target,temp:90};const goal=nextPourGoal(bean,parameters,complete());assert.deepEqual(goal,{type:'parameter',field:'temp',value:91});assert.equal(parameters.temp,90);
 for(let scenario=0;scenario<3;scenario++)for(const technique of ['pulse','steady','fast']){
  const run=complete(scenario,technique),goal=nextPourGoal(bean,bean.target,run);assert.equal(goal.type,'technique');
  const next=complete(scenario,goal.value);assert.notDeepEqual(pourSummary(run).decisions.map(d=>d.cue),pourSummary(next).decisions.map(d=>d.cue));
 }
});
test('custom beans receive observational feedback without a target score',()=>{
 const custom={id:'custom-test',custom:true};assert.equal(gameplayScore(custom,bean.target,complete()),null);assert.equal(nextPourGoal(custom,bean.target,complete()).type,'technique');assert.throws(()=>gameplayScore(custom,{...bean.target,water:0},complete()));
});
test('journals accept complete new runs, retain old entries and preserve malformed new data',()=>{
 const record={bean:bean.id,parameters:bean.target,technique:'pulse',date:'2026-10-23T00:00:00Z',simulatedScore:100};
 assert.equal(loadJournal(JSON.stringify([record,{...record,pourRun:complete()}])).writable,true);
 for(const pourRun of [createPourRun(),{...complete(),actions:['swirl','pause','invalid']},{...complete(),scenario:8}]){
  const raw=JSON.stringify([{...record,pourRun}]);const loaded=loadJournal(raw);assert.equal(loaded.writable,false);assert.equal(loaded.raw,raw);
 }
});
test('one changed pour decision counts as a controlled experiment only in the same situation',()=>{
 const base={bean:bean.id,parameters:bean.target,technique:'pulse',pourRun:complete(),discovery:'Observe the change'};
 const second={...base,pourRun:complete(0,'pulse','settle')};assert.equal(missionProgress([base,second])[2].complete,true);
 assert.equal(missionProgress([base,{...second,pourRun:complete(2,'pulse','settle')}])[2].complete,false);
 assert.equal(missionProgress([base,{...second,parameters:{...bean.target,temp:93}}])[2].complete,false);
});
test('every reachable cue, action and effect has Vietnamese and English copy',async()=>{
 const {copy}=await import('../src/i18n.js');
 function walk(run){if(run.actions.length===3)return;const situation=pourSituation(run);for(const language of ['vi','en'])for(const key of [situation.cue+'Cue',situation.cue+'Detail',situation.cue+'Coach',...situation.choices.flatMap(action=>[action+'Action',action+'Help'])])assert.ok(copy[language][key],`${language}: ${key}`);for(const action of situation.choices){const result=choosePourAction(run,action);for(const language of ['vi','en'])assert.ok(copy[language][result.feedback.effect+'Effect']);walk(result.run);}}
 for(let scenario=0;scenario<3;scenario++)for(const technique of ['pulse','steady','fast'])walk(createPourRun(scenario,technique));
});
test('new journal records reject a mismatched starting approach without overwriting the journal',()=>{
 const raw=JSON.stringify([{bean:bean.id,parameters:bean.target,technique:'fast',pourRun:complete(0,'pulse'),date:'2026-10-23T00:00:00Z',simulatedScore:100}]);const loaded=loadJournal(raw);assert.equal(loaded.writable,false);assert.equal(loaded.raw,raw);
});
