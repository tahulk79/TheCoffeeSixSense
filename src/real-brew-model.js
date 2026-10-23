export const realBrewSchema = 1;
export const realBrewProtocol = 'pourover-observation-v1';
export const realMeasureFields = ['dose','water','beverage','temperature','brewSeconds','pourSeconds','tds'];
export const realSensoryFields = ['acidity','bitterness','sweetness','astringency','strength','body','liking'];
export const realMeasureLimits = {dose:[.1,100],water:[1,2000],beverage:[1,2000],temperature:[1,100],brewSeconds:[1,3600],pourSeconds:[0,3600],tds:[.01,20]};
export function realMeasurements(input){
 if(input.actualBrewConfirmed!==true)throw Error('realconfirmation');
 const measurements={};
 for(const field of realMeasureFields){
  const item=input.measurements?.[field]||{};
  const value=item.value===''||item.value===null||item.value===undefined?null:Number(item.value);
  const source=item.source||'unknown';
  if(!['measured','estimated','unknown','missing'].includes(source)||value!==null&&source==='missing')throw Error('measurement');
  if(value!==null&&(!Number.isFinite(value)||value<realMeasureLimits[field][0]||value>realMeasureLimits[field][1]))throw Error('measurement');
  measurements[field]={value,source:value===null?'missing':source,unit:field==='tds'?'%':field==='temperature'?'C':field.endsWith('Seconds')?'s':'g'};
 }
 const text=k=>String(input[k]||'').trim().slice(0,160);
 const lot=text('lot'),brewer=text('brewer'),grinder=text('grinder'),grindSetting=text('grindSetting');
 if(!lot||!brewer)throw Error('identity');
 if(grindSetting&&!grinder)throw Error('grinder');
 const m=measurements;
 if(m.beverage.value!==null&&m.water.value!==null&&m.beverage.value>m.water.value)throw Error('mass');
 if(m.pourSeconds.value!==null&&m.brewSeconds.value!==null&&m.pourSeconds.value>m.brewSeconds.value)throw Error('time');
 const events=[];
 if(!Array.isArray(input.events||[])||(input.events||[]).length>200)throw Error('timeline');
 for(const e of input.events||[]){
  if((e.seconds===''||e.seconds===null)&&(e.water===''||e.water===null))continue;
  if(e.seconds===''||e.water===''||e.seconds===null||e.water===null)throw Error('timeline');
  const seconds=Number(e.seconds),water=Number(e.water);
  if(!Number.isFinite(seconds)||!Number.isFinite(water)||seconds<0||seconds>3600||water<0||water>2000||!['pour','pause','finish'].includes(e.action))throw Error('timeline');
  if(events.length&&(seconds<events.at(-1).seconds||water<events.at(-1).water))throw Error('timeline');
  if(m.brewSeconds.value!==null&&seconds>m.brewSeconds.value||m.water.value!==null&&water>m.water.value)throw Error('timeline');
  events.push({seconds,water,action:e.action,source:'user_reported'});
 }
 return {actualBrewConfirmed:true,verification:'self_reported_unverified',lot,brewer,grinder,grindSetting,measurementTools:{tdsInstrument:text('tdsInstrument')||String(input.measurementTools?.tdsInstrument||'').slice(0,160),scale:text('scaleDescription')||String(input.measurementTools?.scale||'').slice(0,160),timer:text('timerDescription')||String(input.measurementTools?.timer||'').slice(0,160)},roast:['light','medium','dark','unknown'].includes(input.roast)?input.roast:'unknown',waterDescription:text('waterDescription'),series:text('series'),repeat:text('repeat'),changedVariable:text('changedVariable'),tasterCode:text('tasterCode'),measurements,events};
}
export function realObservation(input,metadata={}){
 const observation=realMeasurements(input),sensory={};
 for(const f of realSensoryFields){const raw=input.sensory?.[f];const value=raw===''||raw===undefined||raw===null?null:Number(raw);if(value!==null&&(!Number.isInteger(value)||value<1||value>5))throw Error('sensory');sensory[f]={value,source:value===null?'missing':'self_reported'};}
 const now=new Date().toISOString(),assessed=realSensoryFields.some(f=>sensory[f].value!==null);
 return {schemaVersion:realBrewSchema,kind:'real_brew_observation',method:'pour_over',predictionModelVersion:null,formulaVersion:'apparent-ey-v1',protocol:realBrewProtocol,id:metadata.id||globalThis.crypto?.randomUUID?.()||`real-${Date.now()}-${Math.random().toString(36).slice(2)}`,startedAt:metadata.startedAt||new Date().toISOString(),recordedAt:now,sensoryRecordedAt:assessed?now:null,sensoryStatus:assessed?'recorded':'not_assessed',sensoryRecordedBeforeAnalysis:assessed,analysisRequestedAt:now,...observation,sensory,notes:String(input.notes||'').slice(0,2000),priorPredictionExposure:['yes','no','unknown'].includes(input.priorPredictionExposure)?input.priorPredictionExposure:'unknown',simulationSeenThisVisit:metadata.simulationSeenThisVisit===true,analysisVersion:'real-analysis-v1',prediction:null,blindTastingVerified:false};
}
export function realAnalysis(record){
 const m=record.measurements;
 const fields=['dose','beverage','tds'];
 const available=fields.every(f=>m[f].value!==null&&m[f].value>0);
 const ey=available?m.beverage.value*m.tds.value/m.dose.value:null;
 return {apparentExtractionPercent:ey,implausible:ey!==null&&ey>100,basis:!available?'missing':fields.every(f=>m[f].source==='measured')?'from_reported_measurements':fields.some(f=>m[f].source==='estimated')?'includes_estimates':'unclassified_inputs',missing:realMeasureFields.filter(f=>m[f].value===null),canCheckFlow:m.water.value!==null&&m.beverage.value!==null&&m.brewSeconds.value!==null&&['water','beverage','brewSeconds'].every(f=>m[f].source==='measured'),sensoryPrediction:null};
}
export function loadRealObservations(raw){
 if(raw===null)return {records:[],writable:true,raw:null};
 try{
  const records=JSON.parse(raw);
  if(!Array.isArray(records)||!records.every(r=>{
   if(!r||r.schemaVersion!==1||r.kind!=='real_brew_observation'||r.protocol!==realBrewProtocol||r.method!=='pour_over'||r.predictionModelVersion!==null||r.formulaVersion!=='apparent-ey-v1'||typeof r.id!=='string'||!Number.isFinite(Date.parse(r.recordedAt))||!(r.sensoryStatus==='recorded'&&Number.isFinite(Date.parse(r.sensoryRecordedAt))&&r.sensoryRecordedBeforeAnalysis===true||r.sensoryStatus==='not_assessed'&&r.sensoryRecordedAt===null&&r.sensoryRecordedBeforeAnalysis===false)||!Number.isFinite(Date.parse(r.startedAt))||r.prediction!==null||r.blindTastingVerified!==false)return false;
   const normalized=realMeasurements(r);
   if(!realMeasureFields.every(f=>r.measurements?.[f]?.value===normalized.measurements[f].value&&r.measurements[f].unit===normalized.measurements[f].unit&&r.measurements[f].source===normalized.measurements[f].source))return false;
   return realSensoryFields.every(f=>r.sensory?.[f]&&(r.sensory[f].value===null?r.sensory[f].source==='missing':Number.isInteger(r.sensory[f].value)&&r.sensory[f].value>=1&&r.sensory[f].value<=5&&r.sensory[f].source==='self_reported'));
  }))throw Error();
  return {records,writable:true,raw};
 }catch{return {records:[],writable:false,raw};}
}
export function realDataset(records){if(!loadRealObservations(JSON.stringify(records)).writable)throw Error('Only valid real observations may be exported');return {schemaVersion:1,datasetKind:'real_brew_observations',exportedAt:new Date().toISOString(),protocol:realBrewProtocol,units:{mass:'g',time:'real_seconds',temperature:'C',tds:'percent'},purpose:'user_export_no_automatic_training',records};}
