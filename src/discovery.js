import {recipeReference} from './recipe-references.js';
import {firstPourAxes,firstPourLimits,firstPourBeans,validFirstRecipe} from './first-pour-model.js';
export const firstExperimentFields=['grind','temp','ratio','time'];
export function firstRecipeChanges(before,after){
 if(!validFirstRecipe(before)||!validFirstRecipe(after))throw Error('Invalid comparison recipe');
 return ['bean',...Object.keys(firstPourLimits),'referenceId'].filter(k=>before[k]!==after[k]);
}
export function firstExperimentPair(records,entry){
 if(!entry?.baselineId)return {status:'unlinked'};
 const baseline=records.find(r=>r.id===entry.baselineId);
 if(!baseline)return {status:'missing-baseline'};
 const changed=firstRecipeChanges(baseline.recipe,entry.recipe);
 return {status:changed.length===1&&firstExperimentFields.includes(changed[0])?'one-change':'multiple-or-unchanged',baseline,changed};
}
export function firstRadarPoints(axes){
 return firstPourAxes.map((key,index)=>{const value=axes?.[key];if(!Number.isInteger(value)||value<1||value>5)return null;const angle=-Math.PI/2+index*Math.PI/3;return {key,value,x:160+Math.cos(angle)*90*value/5,y:142+Math.sin(angle)*90*value/5};});
}
export function firstMemoryMatches(entry,query){
 const fold=text=>String(text??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase();
 const text=fold([entry.recipe.bean,firstPourBeans.find(b=>b.id===entry.recipe.bean)?.name,entry.feedback.notes,entry.feedback.nextChange,recipeReference(entry.recipe.referenceId)?.author,recipeReference(entry.recipe.referenceId)?.title].join(' '));
 return fold(query).trim().split(/\s+/).every(word=>text.includes(word));
}
export function firstSensoryRadar(language,series){
 const tx=(vi,en)=>language==='vi'?vi:en,escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const labels=language==='vi'?['Hương thơm','Chua','Ngọt','Đắng','Thể chất','Hậu vị']:['Aroma','Acidity','Sweetness','Bitterness','Body','Aftertaste'];
 const point=(i,r)=>[160+Math.cos(-Math.PI/2+i*Math.PI/3)*r,142+Math.sin(-Math.PI/2+i*Math.PI/3)*r];
 const meshes=[1,2,3,4,5].map(n=>`<polygon points="${firstPourAxes.map((_,i)=>point(i,90*n/5).join(',')).join(' ')}"/>`).join('');
 const axes=firstPourAxes.map((_,i)=>{const [x,y]=point(i,90),[lx,ly]=point(i,117);return `<line x1="160" y1="142" x2="${x}" y2="${y}"/><text x="${lx}" y="${ly+4}" text-anchor="middle">${labels[i]}</text>`;}).join('');
 const plots=series.map((item,index)=>{const points=firstRadarPoints(item.feedback.axes),complete=points.every(Boolean);return `<g class="radar-series radar-series-${index}">${complete?`<polygon points="${points.map(p=>`${p.x},${p.y}`).join(' ')}"/>`:points.map((p,i)=>p&&points[(i+1)%6]?`<line x1="${p.x}" y1="${p.y}" x2="${points[(i+1)%6].x}" y2="${points[(i+1)%6].y}"/>`:'').join('')}${points.filter(Boolean).map(p=>`<circle cx="${p.x}" cy="${p.y}" r="4"/>`).join('')}</g>`;}).join('');
 const mixed=series.length>1&&new Set(series.map(s=>s.feedback.context)).size>1;
 return `<section class="sensory-radar"><h4>${tx('Bản đồ cảm nhận của bạn','Your sensory map')}</h4><p class="help">${tx('Cường độ bạn tự đánh giá 1–5; không phải mô hình dự đoán. Trống nghĩa là chưa đánh giá, không phải 0. Hình lớn hơn không có nghĩa ngon hơn.','Your own intensity ratings, 1–5; not a model prediction. Blank means unrated, not zero. A larger shape does not mean better coffee.')}</p>${mixed?`<p class="warning">${tx('Hai ghi chú khác ngữ cảnh (suy ngẫm / tự báo nếm thật). Không dùng chúng như hai phép đo tương đương.','These notes have different contexts (reflection / self-reported tasting). Do not treat them as equivalent measurements.')}</p>`:''}<svg viewBox="0 0 320 284" aria-hidden="true" focusable="false"><g class="radar-grid">${meshes}${axes}</g>${plots}</svg><div class="radar-legend">${series.map((s,i)=>`<p class="radar-legend-${i}"><strong>${escape(s.label)}</strong> · ${s.feedback.context==='reflection'?tx('Suy ngẫm game','Game reflection'):tx('Tự báo nếm thật · chưa xác minh','Self-reported tasting · unverified')}</p>`).join('')}</div><dl class="radar-values">${firstPourAxes.map((key,i)=>`<div><dt>${labels[i]}</dt><dd>${series.map(s=>`${escape(s.label)}: ${s.feedback.axes[key]??'—'}`).join(' · ')}</dd></div>`).join('')}</dl></section>`;
}
