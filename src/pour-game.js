import { brewScore, experimentHint, limits, validRecipe } from './game.js';
export const pourStageNames = ['bloom','middle','finish'];
const pourChoices = [['swirl','settle'],['pause','feed','redistribute'],['recenter','finishEven']];
export function validPourRun(run, complete=false) {
 return Boolean(run && run.version===1 && Number.isInteger(run.scenario) && run.scenario>=0 && run.scenario<=2 && ['pulse','steady','fast'].includes(run.technique) && Array.isArray(run.actions) && run.actions.length<=3 && (!complete||run.actions.length===3) && run.actions.every((action,index)=>pourChoices[index].includes(action)));
}
export function createPourRun(scenario=0,technique='pulse') {
 const run={version:1,scenario,technique,actions:[]};if(!validPourRun(run))throw new Error('Invalid pour run');return run;
}
function evaluatePourChoice(run,index,action) {
 const before={...run,actions:run.actions.slice(0,index)};const cue=pourSituation(before);
 const good=action===cue.recommended;
 return {stage:pourStageNames[index],cue:cue.cue,action,good,penalty:good?0:cue.penalty,effect:good?cue.success:cue.miss};
}
export function pourSituation(run) {
 if(!validPourRun(run)||run.actions.length>=3)throw new Error('No active pour stage');
 const index=run.actions.length;let cue,recommended,success,miss,penalty;
 if(index===0){
  const dry=run.technique==='fast'||run.scenario===2||(run.technique==='pulse'&&run.scenario===0);
  cue=dry?'dryBloom':'evenBloom';recommended=dry?'swirl':'settle';success=dry?'wetGrounds':'keptBed';miss=dry?'leftDry':'extraAgitation';penalty=6;
 }else if(index===1){
  const first=evaluatePourChoice(run,0,run.actions[0]);
  cue=first.effect==='leftDry'?'unevenFlow':run.technique==='fast'||run.scenario===0?'highWater':'lowWater';
  recommended=cue==='unevenFlow'?'redistribute':cue==='highWater'?'pause':'feed';
  success=cue==='unevenFlow'?'recoveredFlow':cue==='highWater'?'drainedWater':'maintainedWater';
  miss=cue==='unevenFlow'?'keptUneven':cue==='highWater'?'crowdedWater':'lostWater';penalty=8;
 }else{
  const middle=evaluatePourChoice(run,1,run.actions[1]);
  const tilted=!middle.good||run.scenario===2;
  cue=tilted?'tiltedBed':'levelBed';recommended=tilted?'recenter':'finishEven';success=tilted?'centeredFinish':'calmFinish';miss=tilted?'leftTilted':'disturbedFinish';penalty=6;
 }
 return {stage:pourStageNames[index],cue,recommended,success,miss,penalty,choices:pourChoices[index]};
}
export function choosePourAction(run,action) {
 const situation=pourSituation(run);if(!situation.choices.includes(action))throw new Error('Invalid choice for this stage');
 const feedback=evaluatePourChoice(run,run.actions.length,action);
 return {run:{...run,actions:[...run.actions,action]},feedback};
}
export function pourSummary(run) {
 if(!validPourRun(run))throw new Error('Invalid pour run');
 const decisions=run.actions.map((action,index)=>evaluatePourChoice(run,index,action));
 return {decisions,penalty:decisions.reduce((sum,d)=>sum+d.penalty,0),good:decisions.filter(d=>d.good).length};
}
export function gameplayScore(bean,parameters,run) {
 if(!validPourRun(run,true))throw new Error('Complete three decisions first');
 if(!bean||!validRecipe(parameters))throw new Error('Invalid recipe');
 if(bean.custom)return null;
 return Math.max(0,brewScore(bean,parameters,'pulse')-pourSummary(run).penalty);
}
export function nextPourGoal(bean,parameters,run) {
 if(!validPourRun(run,true))throw new Error('Complete three decisions first');
 const summary=pourSummary(run);const mistake=summary.decisions.find(d=>!d.good);
 if(mistake){const before={...run,actions:run.actions.slice(0,pourStageNames.indexOf(mistake.stage))};return {type:'action',stage:mistake.stage,action:pourSituation(before).recommended};}
 if(!bean.custom){
  const hint=experimentHint(bean,parameters,'pulse');
  if(hint.field!=='matched'){
   const steps={dose:1,water:10,temp:1,grind:1};const direction=hint.direction==='raise'?1:-1;
   const target=bean.target[hint.field];const next=direction>0?Math.min(target,parameters[hint.field]+steps[hint.field]):Math.max(target,parameters[hint.field]-steps[hint.field]);
   return {type:'parameter',field:hint.field,value:Math.max(limits[hint.field][0],Math.min(limits[hint.field][1],next))};
  }
 }
 return {type:'technique',value:run.technique==='fast'?'steady':run.technique==='steady'?'fast':run.scenario===0?'steady':'fast'};
}
