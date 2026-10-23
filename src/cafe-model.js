export const cafeModelVersion = 'counter-assumptions-v3';
// A fictional learning model, not a calibrated extraction or sensory predictor.
export const cafeSpeed = 6;
export const cafeBeans = [
 {id:'brazil',name:['Lô A · Brazil · rang vừa đậm','Lot A · Brazil · medium-dark roast'],notes:['Chocolate & hạt','Chocolate & nuts'],base:[1,2,3],extractability:1.25},
 {id:'colombia',name:['Lô B · Colombia · rang vừa','Lot B · Colombia · medium roast'],notes:['Caramel & trái cây','Caramel & fruit'],base:[3,2,3],extractability:1},
 {id:'ethiopia',name:['Lô C · Ethiopia · rang sáng','Lot C · Ethiopia · light roast'],notes:['Hoa & cam chanh','Floral & citrus'],base:[4,1,3],extractability:.9}
];
export const cafeGuests = [
 {name:'An',request:['“Một ly dịu, ít chua, đậm vừa thôi nhé.”','“Something mellow, low in acidity, with a medium strength.”'],target:[1,2,3]},
 {name:'Linh',request:['“Tôi thích vị trái cây sáng, nhẹ và ít đắng.”','“I like bright fruit, a light cup and little bitterness.”'],target:[4,1,2]},
 {name:'Minh',request:['“Cho tôi ly đậm, hơi đắng, ít chua để bắt đầu ngày mới.”','“A strong, slightly bitter, low-acidity cup to start my day.”'],target:[1,3,4]}
];
export function cafeStart(bean='brazil',heat=92){
 if(!cafeBeans.some(b=>b.id===bean)||![88,92,96].includes(heat))throw Error('Invalid cafe recipe');
 return {bean,heat,time:0,pourTime:0,started:false,wasPouring:false,poured:0,water:0,absorbed:0,drained:0,overflow:0,contact:0,holds:0,extracted:0,solubles:0,cupSolubles:0,lostSolubles:0,events:[],done:false};
}
export function cafeTick(state,holding,seconds){
 if(!Number.isFinite(seconds)||seconds<0)throw Error('Invalid timestep');
 if(state.done||(!state.started&&!holding))return {...state};
 const s={...state,events:[...state.events]},dt=Math.min(.1,seconds);
 let added=holding?Math.min(24*dt,180-s.poured):0;
 if(holding&&180-s.poured-added<1)added=180-s.poured;
 const pouring=added>0;
 if(!s.started&&pouring){s.started=true;s.events.push({type:'start',time:0,volume:0});}
 if(pouring!==s.wasPouring){s.events.push({type:pouring?'pour':'pause',time:s.time,volume:s.poured});if(pouring)s.holds++;}
 s.wasPouring=pouring;s.time+=dt*cafeSpeed;s.pourTime+=Math.min(dt,added/24)*cafeSpeed;s.poured+=added;s.water+=added;
 // Fixed 12 g dose, 24 ml water retention. Time advances only after first water.
 const retained=Math.min(s.water,24-s.absorbed);s.absorbed+=retained;s.water-=retained;
 if(s.water>.5){
  s.contact+=dt*cafeSpeed;
  const rate=.009*cafeBeans.find(b=>b.id===s.bean).extractability*Math.exp((s.heat-92)*.035)*Math.min(1,s.water/12);
  const dissolved=(12*.28-s.extracted)*(1-Math.exp(-rate*dt*cafeSpeed));
  s.extracted+=dissolved;s.solubles+=dissolved;
 }
 const spill=Math.max(0,s.water-64);
 const lost=s.water>0?s.solubles*spill/s.water:0;
 s.overflow+=spill;s.water-=spill;s.solubles-=lost;s.lostSolubles+=lost;
 const out=Math.min(s.water,(5+s.water*.12)*dt);
 const cup=s.water>0?s.solubles*out/s.water:0;
 s.water-=out;s.drained+=out;s.solubles-=cup;s.cupSolubles+=cup;
 s.done=s.poured>=179.9&&s.water<.5;
 if(s.done)s.events.push({type:'finish',time:s.time,volume:s.poured});
 return s;
}
export function cafeResult(state,guest=0){
 const b=cafeBeans.find(b=>b.id===state.bean);if(!b||!state.done||!cafeGuests[guest])throw Error('Unfinished cup');
 const yieldRatio=state.extracted/12;
 const zone=yieldRatio<.16?'low':yieldRatio>.23?'high':'balanced';
 // No empirical sensory fit: acidity and bitterness stay fictional lot attributes.
 const clamp=n=>Math.max(1,Math.min(5,Math.round(n)));
 const concentration=state.drained>0?state.cupSolubles/state.drained:0;
 const strength=concentration<.009?1:concentration<.012?2:concentration<.016?3:concentration<.019?4:5;
 const flavor=[b.base[0],b.base[1],strength];
 const distance=flavor.reduce((sum,n,i)=>sum+Math.abs(n-cafeGuests[guest].target[i]),0);
 const fit=distance<=1?'great':distance<=3?'close':'different';
 return {version:3,kind:'game_simulation',modelVersion:cafeModelVersion,evidence:{flavor:'fictional_lot_profile',physics:'uncalibrated_game_assumption',sourceReview:'pending_primary_review',confidence:null},bean:state.bean,heat:state.heat,flavor,guest,fit,distance,zone,time:state.time,pourTime:state.pourTime,waitTime:state.time-state.pourTime,overflow:Math.round(state.overflow),beverage:Math.round(state.drained),holds:state.holds,contact:state.contact,events:state.events};
}
export function cafeAdvice(r){
 if(r.fit==='great')return 'success';
 if(r.overflow>3)return 'overflow';
 if(r.zone==='low')return r.heat<96?'low':'pulse';
 if(r.zone==='high')return r.heat>88?'high':'pulse';
 return 'profile';
}
export function cafeClock(seconds){const n=Math.max(0,Math.floor(seconds));return `${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;}
