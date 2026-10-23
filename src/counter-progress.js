export const counterKey = 'c6s.counter.v1';
export const oldCounterKey = 'c6s.cafe.v1';
export const counterLessons = [
 {id:'control',guest:0,title:['Giữ nước trong phễu','Keep water in the filter'],goal:['Pha một ly tràn không quá 1 ml. Quan sát nước còn lại trong bột và lượng thu trong ly.','Brew with at most 1 ml overflow. Notice retained water and collected beverage.'],discovery:['Nước rót không bằng đồ uống: một phần được bột giữ lại trong mô hình.','Poured water differs from beverage: the model retains some in the grounds.']},
 {id:'compare',guest:1,title:['Đổi nhịp, quan sát hai ly','Change the rhythm, compare cups'],goal:['Pha hai ly cùng hạt và nhiệt độ, đổi nhịp rót rồi xác định ly sau thu được nhiều hay ít đồ uống hơn.','Brew twice with the same bean and temperature, change the rhythm, then identify the beverage-yield difference.'],discovery:['So sánh lượng đồ uống và nước tràn trước khi kết luận về hương vị.','Compare collected beverage and overflow before drawing taste conclusions.']},
 {id:'service',guest:2,title:['Hợp gu và khéo tay','Taste fit and pouring skill'],goal:['Phục vụ đúng gu Minh trong game, đồng thời tràn không quá 1 ml. Đây là hai mục tiêu riêng.','Match Minh’s fictional taste while spilling at most 1 ml. These are separate goals.'],discovery:['Khẩu vị khách và kỹ năng rót là hai đánh giá riêng; không phải điểm ngon ngoài đời.','Guest preference and pouring skill are separate, not a real-world quality score.']}
];
export function counterYieldAnswer(current,baseline){return current.beverage>baseline.beverage?'more':current.beverage<baseline.beverage?'less':'same';}
export function counterPair(round,rounds){
 const index=rounds.findIndex(r=>r.id===round.id),base=rounds.slice(0,index<0?rounds.length:index).find(r=>r.id===round.baselineId);
 if(!base||round.bean!==base.bean||round.heat!==base.heat||!Number.isFinite(round.beverage)||!Number.isFinite(base.beverage)||!Number.isFinite(round.holds)||!Number.isFinite(base.holds))return null;
 if(round.holds===base.holds&&Math.abs(round.time-base.time)<6)return null;
 return base;
}
export function counterProgress(rounds=[]){
 const proof={};
 for(const r of rounds){
  if(r.lesson==='control'&&r.overflow<=1&&Number.isFinite(r.overflow)&&!proof.control)proof.control=r.id;
  if(proof.control&&r.lesson==='compare'&&!proof.compare){const base=counterPair(r,rounds);if(base&&base.lesson==='compare'&&r.observationAnswer===counterYieldAnswer(r,base))proof.compare=r.id;}
  if(proof.compare&&r.lesson==='service'&&r.fit==='great'&&r.overflow<=1&&!proof.service)proof.service=r.id;
 }
 const completed=counterLessons.filter(l=>proof[l.id]).map(l=>l.id);
 return {completed,proof,next:counterLessons.find(l=>!proof[l.id])?.id||'free',xp:rounds.length*10+completed.length*15+rounds.filter(r=>typeof r.note==='string'&&r.note.trim()).length*5};
}
export function validCounterRound(r){
 if(!r||typeof r.id!=='string'||!['brazil','colombia','ethiopia'].includes(r.bean)||!Number.isInteger(r.guest)||r.guest<0||r.guest>2||!Array.isArray(r.flavor)||r.flavor.length!==3||!r.flavor.every(v=>Number.isInteger(v)&&v>=1&&v<=5))return false;
 if(r.kind!==undefined&&r.kind!=='game_simulation')return false;
 if(r.lesson!==undefined&&!['control','compare','service','free'].includes(r.lesson))return false;
 if(r.note!==undefined&&(typeof r.note!=='string'||r.note.length>1000))return false;
 if(r.observationAnswer!==undefined&&!['more','less','same'].includes(r.observationAnswer))return false;
 if(r.baselineId!==undefined&&r.baselineId!==null&&typeof r.baselineId!=='string')return false;
 for(const key of ['time','pourTime','waitTime','overflow','beverage','holds','contact'])if(r[key]!==undefined&&(!Number.isFinite(r[key])||r[key]<0))return false;
 if(r.heat!==undefined&&![88,92,96].includes(r.heat))return false;
 if(r.date!==null&&r.date!==undefined&&!Number.isFinite(Date.parse(r.date)))return false;
 if(r.fit!==undefined&&!['great','close','different'].includes(r.fit))return false;
 if(r.events!==undefined&&(!Array.isArray(r.events)||!r.events.every(e=>e&&['start','pour','pause','finish'].includes(e.type)&&Number.isFinite(e.time)&&e.time>=0&&Number.isFinite(e.volume)&&e.volume>=0)))return false;
 return true;
}
export function emptyCounter(){return {version:1,rounds:[],resume:{lesson:'control',guest:0,bean:'brazil',heat:92},favoriteId:null};}
export function loadCounter(raw,legacyRaw=null){
 const blank=emptyCounter();
 try{
  if(raw===null){
   if(legacyRaw===null)return {store:blank,writable:true,raw:null,source:'new'};
   const old=JSON.parse(legacyRaw);if(!Array.isArray(old))throw Error();
   const rounds=old.map((r,i)=>({...r,id:typeof r?.id==='string'?r.id:`legacy-counter-${i}`,date:r?.date||null,imported:true}));
   if(!rounds.every(validCounterRound)||new Set(rounds.map(r=>r.id)).size!==rounds.length)throw Error();
   return {store:{...blank,rounds},writable:true,raw:legacyRaw,source:'legacy'};
  }
  const s=JSON.parse(raw),v=s?.resume;
  if(s?.version!==1||!Array.isArray(s.rounds)||!s.rounds.every(validCounterRound)||new Set(s.rounds.map(r=>r.id)).size!==s.rounds.length||!v||!['control','compare','service','free'].includes(v.lesson)||!['brazil','colombia','ethiopia'].includes(v.bean)||![88,92,96].includes(v.heat)||!Number.isInteger(v.guest)||v.guest<0||v.guest>2||(s.favoriteId!==null&&!s.rounds.some(r=>r.id===s.favoriteId)))throw Error();
  return {store:s,writable:true,raw,source:'counter'};
 }catch{return {store:blank,writable:false,raw:raw===null?legacyRaw:raw,source:raw===null?'legacy':'counter'};}
}
export function addCounterRound(store,round){
 if(!validCounterRound(round))throw Error('Invalid counter round');
 if(store.rounds.some(r=>r.id===round.id))return store;
 const next={...store,rounds:[...store.rounds,round]};
 const lesson=round.lesson==='free'?'free':counterProgress(next.rounds).next,guest=counterLessons.find(l=>l.id===lesson)?.guest??round.guest;
 return {...next,resume:{lesson,guest,bean:round.bean,heat:round.heat}};
}
export function cafeFrameDelta(now,last){
 if(last===null||!Number.isFinite(now)||!Number.isFinite(last))return 0;
 return Math.max(0,Math.min(.1,(now-last)/1000));
}
