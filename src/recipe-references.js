// Recipe facts transcribed in our own words; no claim of creator endorsement.
export const recipeReferences=[{
 id:'hoffmann-ultimate-v60-v1',author:'James Hoffmann',title:'The Ultimate V60 Technique',brewer:'V60',dose:30,waterGrams:500,
 originalUrl:'https://www.youtube.com/watch?v=AI4ynXzkSQo',verification:'secondary-cross-checked',
 checkedOn:'2026-10-24',
 corroboration:[{name:'Coffee Coach · V60',url:'https://github.com/edjw/Coffee-Coach/blob/5205fb1a29b6148763f15ae2f6b51df28598d499/src/routes/v60-by-james-hoffman/index.svelte'}, {name:'Hoffmann calculator · Ultimate V60',url:'https://github.com/mascent/james-hoffmann-calculator/blob/244ef16d3f7c64b6919d29e6f110a5539798b370/_recipes/V60_old.html'}],
 steps:[
 {start:0,end:45,total:60,text:['Làm ướt giấy lọc trước. Bloom với 60 g nước (chọn mức 2× lượng bột trong khoảng 2–3× được ghi ở bản đối chiếu); chờ tới 0:45.','Rinse the paper first. Bloom with 60 g water (choosing 2× the dose within the 2–3× range in the transcription); wait until 0:45.']},
 {start:45,end:75,total:300,text:['Từ 0:45 đến 1:15, rót thêm 240 g để tổng nước đạt 300 g.','From 0:45 to 1:15, add 240 g to reach 300 g total water.']},
 {start:75,end:105,total:500,text:['Từ 1:15 đến 1:45, rót thêm 200 g để tổng nước đạt 500 g.','From 1:15 to 1:45, add 200 g to reach 500 g total water.']},
 {start:105,end:null,total:500,text:['Khuấy nhẹ một vòng mỗi chiều; khi nước rút bớt, lắc xoay nhẹ phễu rồi để nước rút. Không áp một thời điểm rút xong cố định cho mọi hạt.','Stir gently once each way; after the water level falls, swirl gently and let it drain. Do not impose one final drawdown time on every coffee.']}
 ],
 sourceLimit:['Đã đối chiếu hai bản chép cộng đồng cùng dẫn video này; chưa xem trực tiếp video gốc trong lần cập nhật này. Bản calculator trộn đơn vị g/ml; sổ này dùng gram nước theo bản Coffee Coach.','Cross-checked against two community transcriptions linking this video; the original video was not directly reviewed for this update. The calculator mixes g/ml; this notebook uses water mass in grams from Coffee Coach.'],
 adaptation:['Bàn pha chỉ luyện mốc lượng nước qua ba nhịp, dùng thang ml danh nghĩa cho các con số gram gốc. Chưa mô phỏng chờ 45 giây, tốc độ rót thật, khuấy/lắc hay chiết xuất. Nhiệt độ, cỡ xay và thời gian mô hình giữ theo thiết lập của bạn; không được trích từ các nguồn đã đối chiếu.','The station practices the three water targets using nominal game ml for the original gram numbers. It does not reproduce the 45-second wait, real flow, stirring/swirling or extraction. Temperature, grind and model time stay at your settings; they are not sourced from the reviewed transcriptions.']
}];
export function recipeReference(id){return recipeReferences.find(r=>r.id===id)||null;}
export function recipeReferencePlan(recipe){if(!recipeReference(recipe.referenceId))throw Error('Unknown recipe reference');const total=Math.round(recipe.dose*recipe.ratio);return [Math.round(recipe.dose*2),Math.round(total*.6),total];}
export function isReferenceExample(recipe){const r=recipeReference(recipe?.referenceId);return Boolean(r&&Math.abs(recipe.dose-r.dose)<.000001&&Math.abs(recipe.dose*recipe.ratio-r.waterGrams)<.000001);}
export function referencePracticeRecipe(current,id){const r=recipeReference(id);if(!r)throw Error('Unknown recipe reference');return {...current,dose:r.dose,ratio:r.waterGrams/r.dose,referenceId:r.id};}
