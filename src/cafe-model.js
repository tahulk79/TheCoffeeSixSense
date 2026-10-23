// Deliberately small game model: these values are fictional, not brewing predictions.
export const cafeBeans = [
 {id:'brazil',name:['Brazil · Chocolate & hạt','Brazil · Chocolate & nuts'],base:[1,2,4]},
 {id:'colombia',name:['Colombia · Caramel & trái cây','Colombia · Caramel & fruit'],base:[3,2,3]},
 {id:'ethiopia',name:['Ethiopia · Hoa & cam chanh','Ethiopia · Floral & citrus'],base:[4,1,2]}
];
export const cafeGuests = [
 {name:'An',request:['“Một ly dịu, ít chua, đậm vừa thôi nhé.”','“Something mellow, low in acidity, with a medium body.”'],target:[1,2,3]},
 {name:'Linh',request:['“Tôi thích vị trái cây sáng, nhẹ và ít đắng.”','“I like bright fruit, a light body and little bitterness.”'],target:[4,1,2]},
 {name:'Minh',request:['“Cho tôi ly đậm, hơi đắng, ít chua để bắt đầu ngày mới.”','“A full-bodied, slightly bitter, low-acidity cup to start my day.”'],target:[1,4,4]}
];
export function cafeStart(bean='brazil',heat=92){
 if(!cafeBeans.some(b=>b.id===bean)||![88,92,96].includes(heat))throw Error('Invalid cafe recipe');
 return {bean,heat,time:0,poured:0,water:0,drained:0,overflow:0,contact:0,holds:0,done:false};
}
export function cafeTick(state,holding,seconds){
 if(state.done)return {...state};
 const s={...state},dt=Math.max(0,Math.min(.1,seconds));
 const added=holding?Math.min(24*dt,180-s.poured):0;
 s.time+=dt;s.poured+=added;s.water+=added;
 const spill=Math.max(0,s.water-64);s.overflow+=spill;s.water-=spill;
 if(s.water>.5)s.contact+=dt;
 const out=Math.min(s.water,(5+s.water*.12)*dt);s.water-=out;s.drained+=out;
 s.done=s.poured>=179.99&&s.water<.5;
 return s;
}
export function cafeResult(state,guest=0){
 const b=cafeBeans.find(b=>b.id===state.bean);if(!b||!state.done)throw Error('Unfinished cup');
 const extraction=(state.heat-92)/4+(state.contact-24)/12;
 const clamp=n=>Math.max(1,Math.min(5,Math.round(n)));
 const flavor=[clamp(b.base[0]-extraction),clamp(b.base[1]+extraction),clamp(b.base[2]-(180-state.drained)/25)];
 const target=cafeGuests[guest].target;
 const distance=flavor.reduce((sum,n,i)=>sum+Math.abs(n-target[i]),0);
 return {bean:state.bean,heat:state.heat,flavor,guest,fit:distance<=1?'great':distance<=3?'close':'different',distance,time:Math.round(state.time),overflow:Math.round(state.overflow),holds:state.holds,contact:Math.round(state.contact)};
}
