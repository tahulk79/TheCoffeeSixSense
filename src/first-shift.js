import {firstRecipeChanges} from './discovery.js';
export const firstShiftKey='c6s.first-shift.v1';
export function emptyShiftFeedback(){return {fun:null,returnIntent:null,note:''};}
export function validShiftFeedback(feedback){return Boolean(feedback&&(feedback.fun===null||Number.isInteger(feedback.fun)&&feedback.fun>=1&&feedback.fun<=5)&&[null,'yes','maybe','no'].includes(feedback.returnIntent)&&typeof feedback.note==='string'&&feedback.note.length<=1000);}
export function createFirstShift(id){if(typeof id!=='string'||!id||id.length>160)throw Error('Invalid shift ID');return {version:1,id,answer:null,feedback:emptyShiftFeedback()};}
export function loadFirstShift(raw){
 if(raw===null)return {session:null,writable:true};
 try{const value=JSON.parse(raw);if(value.version!==1||typeof value.id!=='string'||!value.id||value.id.length>160||!validShiftFeedback(value.feedback)||value.answer!==null&&(!value.answer||typeof value.answer.bId!=='string'||!['grind','temp','ratio','time'].includes(value.answer.field)))throw Error('Invalid shift');return {session:value,writable:true};}catch{return {session:null,writable:false,raw};}
}
export function firstShiftProgress(session,records){
 if(!session)return {phase:'welcome',completed:0,a:null,b:null};
 const a=records.find(r=>r.shift?.id===session.id&&r.shift.role==='a'&&r.pour.water===180&&r.practice?.pauses>=1);
 if(!a){const attempt=records.findLast(r=>r.shift?.id===session.id&&r.shift.role==='a');return {phase:'a',completed:0,a:null,b:null,reason:records.some(r=>r.shift?.id===session.id&&r.shift.role==='b')?'missing-a':attempt?(attempt.pour.water!==180?'need-volume':'need-pause'):null};}
 const b=records.find(r=>{if(r.shift?.id!==session.id||r.shift.role!=='b'||r.baselineId!==a.id)return false;const changed=firstRecipeChanges(a.recipe,r.recipe);return changed.length===1&&changed[0]==='grind'&&Math.abs(a.recipe.grind-r.recipe.grind)===1;});
 if(!b)return {phase:'b',completed:1,a,b:null};
 const correct=session.answer?.bId===b.id&&session.answer.field==='grind';
 return {phase:correct?'complete':'observe',completed:correct?3:2,a,b};
}
export function answerFirstShift(session,records,field){
 const progress=firstShiftProgress(session,records);if(!['observe','complete'].includes(progress.phase)||!['grind','temp','ratio','time'].includes(field))throw Error('No saved pair to observe');
 return {...session,answer:{bId:progress.b.id,field}};
}
