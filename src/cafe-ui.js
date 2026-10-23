import { cafeBeans, cafeGuests, cafeStart, cafeTick, cafeResult } from './cafe-model.js';
export function mountCafe(){
 const studio=document.querySelector('#app');studio.hidden=true;
 const root=document.createElement('div');root.id='cafe';studio.before(root);
 let lang='vi';try{lang=localStorage.getItem('c6s.language')==='en'?'en':'vi';}catch{}
 const tx=(vi,en)=>lang==='vi'?vi:en, at=values=>values[lang==='vi'?0:1];
 let guest=0,bean='brazil',heat=92,state=null,holding=false,toggle=false,screen='setup',previous=null,result=null,frame=0,last=0,rounds=[];
 try{const data=JSON.parse(localStorage.getItem('c6s.cafe.v1')||'[]');if(Array.isArray(data))rounds=data.filter(r=>r&&cafeBeans.some(b=>b.id===r.bean)&&Number.isInteger(r.guest)&&r.guest>=0&&r.guest<3&&Array.isArray(r.flavor)&&r.flavor.length===3&&r.flavor.every(n=>Number.isInteger(n)&&n>=1&&n<=5)).slice(-30);}catch{}
 const labels=()=>[tx('Chua','Acidity'),tx('Đắng','Bitterness'),tx('Độ đậm','Body')];
 const meters=values=>values.map((n,i)=>`<div class="flavor-row"><span>${labels()[i]}</span><meter min="0" max="5" value="${n}"></meter><b>${n}/5</b></div>`).join('');
 function hint(r){
  const target=cafeGuests[guest].target;
  if(r.overflow>3)return tx('Nước đã tràn phễu. Lần tới chia thành các nhịp ngắn, thả nút khi mực nước gần vạch tràn.','Water overflowed. Try shorter pulses and release before the overflow line.');
  if(r.flavor[0]>target[0])return tx('Ly còn chua hơn yêu cầu. Thử tăng nhiệt độ một nấc; giữ nguyên hạt để so sánh.','More acidic than requested. Try one hotter setting with the same beans.');
  if(r.flavor[1]>target[1])return tx('Ly đắng hơn yêu cầu. Thử giảm nhiệt độ một nấc; giữ nguyên hạt để so sánh.','More bitter than requested. Try one cooler setting with the same beans.');
  if(r.flavor[2]!==target[2])return tx('Độ đậm còn lệch. Thử một loại hạt khác và giữ nhiệt độ để nghe câu chuyện khác của ly cà phê.','Body differs. Try another bean at the same temperature to explore its character.');
  return tx('Bạn đã đến gần khẩu vị khách. Thử đổi một yếu tố để xem ly thay đổi ra sao, hoặc phục vụ vị khách tiếp theo.','You are close to the guest’s taste. Change one thing to explore, or serve the next guest.');
 }
 function render(){
  const note=root.querySelector('#cafe-note');if(note&&result)result.note=note.value;
  document.documentElement.lang=lang;
  root.innerHTML=`<main class="cafe-main"><header class="cafe-header"><span class="eyebrow">THE COFFEE SIX SENSE</span><label>${tx('Ngôn ngữ','Language')}<select id="cafe-language"><option value="vi" ${lang==='vi'?'selected':''}>Tiếng Việt</option><option value="en" ${lang==='en'?'selected':''}>English</option></select></label></header><h1>${tx('Một ly, một khám phá.','One cup, one discovery.')}</h1><p class="cafe-intro">${tx('Mở quầy cà phê nhỏ. Tự tay rót một ly hợp ý khách.','Open your little coffee counter. Pour a cup your guest will love.')}</p><section class="guest-card"><span class="guest-avatar" aria-hidden="true">${cafeGuests[guest].name[0]}</span><div><small>${tx('Khách tại quầy','At the counter')} · ${guest+1}/3</small><h2>${cafeGuests[guest].name}</h2><p>${at(cafeGuests[guest].request)}</p><details><summary>${tx('Khẩu vị khách','Guest’s taste')}</summary>${meters(cafeGuests[guest].target)}</details></div></section><section class="panel cafe-play" id="cafe-play" tabindex="-1">${screen==='setup'?setup():screen==='pour'?pour():outcome()}</section><p class="help model-note">${tx('Hương vị được tạo bởi mô hình trò chơi, không dự đoán chất lượng hay vị của cà phê thật.','Flavors come from a game model, not a prediction of real coffee taste or quality.')}</p><button id="studio-toggle" class="secondary">${tx('Hồ sơ hạt & nhật ký · tùy chọn','Bean library & journal · optional')}</button><p class="help">${tx('Tiến độ quầy được lưu trên trình duyệt này khi có thể.','Counter progress is saved in this browser when available.')} ${rounds.length} ${tx('ly đã pha','cups brewed')}.</p></main>`;
  root.querySelector('#cafe-language').onchange=e=>{stopHolding();lang=e.target.value;try{localStorage.setItem('c6s.language',lang);}catch{}render();};
  root.querySelector('#studio-toggle').onclick=()=>{studio.hidden=!studio.hidden;if(!studio.hidden)studio.scrollIntoView({behavior:'smooth'});};
  if(screen==='setup'){
   root.querySelectorAll('[name=cafe-bean]').forEach(el=>el.onchange=()=>{bean=el.value;render();});
   root.querySelector('#cafe-heat').onchange=e=>{heat=Number(e.target.value);};
   root.querySelectorAll('.cafe-start').forEach(button=>button.onclick=()=>{state=cafeStart(bean,heat);screen='pour';render();root.querySelector('#hold-pour').focus();last=performance.now();frame=requestAnimationFrame(tick);});
  }else if(screen==='pour')bindPour();
  else {
   bindNote();
   root.querySelector('#cafe-retry').onclick=()=>{previous=result;screen='setup';render();root.querySelector('#cafe-play').focus();};
   root.querySelector('#cafe-next').onclick=()=>{guest=(guest+1)%3;previous=null;screen='setup';render();root.querySelector('#cafe-play').focus();};
  }
 }
 function setup(){return `<h2>${previous?tx('Thử lại cùng yêu cầu','Try the same order'):tx('Chọn hạt cho ly này','Choose this cup’s beans')}</h2><button class="cafe-start cafe-quick">${tx('Pha ngay với lựa chọn bên dưới','Brew with the choices below')}</button><div class="bean-options">${cafeBeans.map(b=>`<label><input type="radio" name="cafe-bean" value="${b.id}" ${bean===b.id?'checked':''}><strong>${at(b.name)}</strong><small>${tx('Đặc tính trong game','In-game profile')}: ${labels().map((l,i)=>`${l} ${b.base[i]}/5`).join(' · ')}</small></label>`).join('')}</div><label>${tx('Nhiệt độ · nóng hơn tăng đắng, giảm chua trong game','Temperature · hotter increases bitterness and reduces acidity in this game')}<select id="cafe-heat">${[88,92,96].map(n=>`<option ${heat===n?'selected':''}>${n}</option>`).join('')}</select></label>${previous?`<aside class="experiment">${hint(previous)}</aside>`:''}<button id="cafe-start" class="cafe-start">${tx('Vào bàn rót','Start pouring')}</button><p class="help">${tx('Khoảng 30 giây. Nhấn giữ để rót, thả để nước rút. Không cần dụng cụ thật.','About 30 seconds. Hold to pour; release to let water drain. No equipment needed.')}</p>`;}
 function pour(){return `<h2>${tx('Tự tay rót ly của bạn','Pour your own cup')}</h2><p>${tx('Đích: 180 ml. Chia nhịp rót để nước không vượt vạch tràn.','Goal: 180 ml. Pour in pulses to keep water below the overflow line.')}</p><div class="live-brew" aria-hidden="true"><div class="kettle">☕</div><div class="pour-stream"></div><div class="live-filter"><span class="spill-line"></span><div class="live-water"></div><div class="live-grounds"></div></div><div class="live-cup"><div></div></div></div><div class="live-stats"><span>${tx('Đã rót','Poured')}: <b id="live-volume">0</b>/180 ml</span><span>${tx('Tràn','Spilled')}: <b id="live-spill">0</b> ml</span></div><progress id="live-progress" max="180" value="0" aria-label="${tx('Lượng nước đã rót','Water poured')}"></progress><p id="live-status" role="status">${tx('Sẵn sàng. Nhấn giữ để bắt đầu.','Ready. Hold to begin.')}</p><button id="hold-pour" class="hold-pour">${tx('Nhấn giữ để rót','Hold to pour')}</button><button id="toggle-pour" class="secondary">${tx('Bật / tắt rót bằng một lần chạm','Toggle pouring with one tap')}</button><p class="help">${tx('Bàn phím: giữ Space trên nút rót. Nút bật/tắt hỗ trợ thao tác không cần giữ. Chuyển ứng dụng sẽ tạm dừng.','Keyboard: hold Space on the pour button. Use the toggle for hold-free control. Switching apps pauses the game.')}</p><button id="cafe-abort" class="secondary">${tx('Pha lại từ đầu','Restart this cup')}</button>`;}
 function outcome(){const b=cafeBeans.find(b=>b.id===result.bean);const response=result.fit==='great'?tx('“Đúng gu tôi rồi! Cảm ơn bạn.”','“That’s my kind of coffee! Thank you.”'):result.fit==='close'?tx('“Khá gần rồi. Chỉnh một chút nữa nhé?”','“Pretty close. Could you adjust it a little?”'):tx('“Ly này có cá tính, nhưng chưa hợp gu tôi.”','“An interesting cup, but not quite my taste.”');
 return `<h2>${tx('Ly của bạn đã sẵn sàng','Your cup is ready')}</h2><div class="finished-cup" aria-hidden="true">☕</div><p class="guest-response">${response}</p><p>${at(b.name)} · ${result.heat}°C · ${result.time}s</p>${meters(result.flavor)}<p>${tx('Trong mô hình: hạt tạo đặc tính nền; nước nóng và thời gian bột tiếp xúc nước làm giảm chua, tăng đắng. Nước tràn làm ly nhạt đi.','In this model: beans set the base profile; hotter water and longer wet contact reduce acidity and increase bitterness. Overflow weakens body.')}</p><p>${tx('Lượt này','This cup')}: ${result.contact}s ${tx('tiếp xúc nước','wet contact')}, ${result.overflow} ml ${tx('tràn','spilled')}.</p>${previous?`<div class="cup-comparison"><h3>${tx('Hai ly khác nhau ở đâu?','What changed between cups?')}</h3><p>${tx('Ly trước → ly này','Previous → current')}: ${at(cafeBeans.find(b=>b.id===previous.bean).name)} ${previous.heat}°C → ${at(b.name)} ${result.heat}°C</p>${labels().map((l,i)=>`<p>${l}: <b>${previous.flavor[i]} → ${result.flavor[i]}</b> ${previous.flavor[i]===result.flavor[i]?tx('(chưa đổi mức)','(same level)'):''}</p>`).join('')}<p>${tx('Nước tràn','Spilled')}: ${previous.overflow} → ${result.overflow} ml</p></div>`:''}<aside class="experiment">${hint(result)}</aside><div class="actions"><button id="cafe-retry">${tx('Pha lại & so sánh hai ly','Brew again & compare')}</button><button id="cafe-next" class="secondary">${tx('Đón khách tiếp theo','Next guest')}</button></div><details class="optional-note"><summary>${tx('Ghi một điều khám phá · tùy chọn','Note a discovery · optional')}</summary><label>${tx('Tôi nhận ra…','I noticed…')}<textarea id="cafe-note" maxlength="1000">${String(result.note||'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))}</textarea></label><button id="save-cafe-note">${tx('Lưu ghi chú','Save note')}</button><p id="cafe-note-status" role="status"></p></details>`;
 }
 function stopHolding(){holding=false;toggle=false;}
 function bindPour(){
  const button=root.querySelector('#hold-pour');
  button.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();button.setPointerCapture(e.pointerId);if(!holding)state.holds++;holding=true;};
  button.onpointerup=button.onpointercancel=button.onlostpointercapture=()=>{holding=false;};
  button.onkeydown=e=>{if((e.code==='Space'||e.code==='Enter')&&!e.repeat){e.preventDefault();state.holds++;holding=true;}};
  button.onkeyup=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();holding=false;}};button.onblur=()=>{holding=false;};
  root.querySelector('#toggle-pour').onclick=()=>{toggle=!toggle;if(toggle)state.holds++;};
  root.querySelector('#cafe-abort').onclick=()=>{cancelAnimationFrame(frame);stopHolding();screen='setup';render();};
 }
 function bindNote(){root.querySelector('#save-cafe-note').onclick=()=>{result.note=root.querySelector('#cafe-note').value;try{localStorage.setItem('c6s.cafe.v1',JSON.stringify(rounds));root.querySelector('#cafe-note-status').textContent=tx('Đã lưu.','Saved.');}catch{root.querySelector('#cafe-note-status').textContent=tx('Không lưu được trên trình duyệt này. Hãy sao chép ghi chú.','Unable to save here. Please copy your note.');}};}
 function tick(now){
  const dt=Math.min((now-last)/1000,.1);last=now;
  if(!document.hidden)state=cafeTick(state,holding||toggle,dt);
  if(state.done){stopHolding();result=cafeResult(state,guest);rounds.push(result);rounds=rounds.slice(-30);try{localStorage.setItem('c6s.cafe.v1',JSON.stringify(rounds));}catch{}screen='result';render();root.querySelector('#cafe-play').focus();return;}
  root.querySelector('#live-volume').textContent=Math.round(state.poured);root.querySelector('#live-spill').textContent=Math.round(state.overflow);root.querySelector('#live-progress').value=state.poured;
  root.querySelector('.live-water').style.height=`${state.water/64*100}%`;root.querySelector('.live-cup>div').style.height=`${state.drained/180*100}%`;
  root.querySelector('.live-brew').classList.toggle('is-pouring',(holding||toggle)&&state.poured<180);
  const status=state.poured>=180?tx('Đủ nước! Đợi ly chảy xong…','Enough water! Let the cup drain…'):state.water>49?tx('Nước gần vạch tràn — thả nút để nước rút!','Near the overflow line — release to drain!'):(holding||toggle)?tx('Đang rót… quan sát mực nước.','Pouring… watch the water level.'):tx('Nước đang rút. Bạn chọn lúc rót tiếp.','Water is draining. Choose when to pour again.');if(root.querySelector('#live-status').textContent!==status)root.querySelector('#live-status').textContent=status;
  root.querySelector('#hold-pour').disabled=state.poured>=180;root.querySelector('#toggle-pour').disabled=state.poured>=180;root.querySelector('#toggle-pour').setAttribute('aria-pressed',String(toggle));
  frame=requestAnimationFrame(tick);
 }
 window.addEventListener('blur',stopHolding);document.addEventListener('visibilitychange',()=>{if(document.hidden)stopHolding();});
 render();
}
