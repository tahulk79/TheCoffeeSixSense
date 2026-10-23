const labelAliases = {
 name:['name','product','product name','coffee name','ten hat','ten san pham','ten ca phe'],
 roaster:['roaster','roasted by','brand','hang rang','nha rang','thuong hieu'],
 origin:['country','origin','country of origin','xuat xu','quoc gia'],
 region:['region','growing region','vung trong','vung nguyen lieu'],
 variety:['variety','varietal','giong','giong ca phe'],
 process:['process','processing','processing method','so che','cach so che','phuong phap so che'],
 roastLevel:['roast level','roast','muc rang','do rang'],
 roastDate:['roast date','roasted on','ngay rang'],
 labelNotes:['tasting notes','flavour notes','flavor notes','notes','huong vi','ghi chu huong vi'],
 brewGuide:['brew guide','brewing guide','recipe','brew recipe','cong thuc','huong dan pha','cong thuc pha']
};
const foldLabel = value => value.normalize('NFD').replace(/\p{Diacritic}/gu,'').replace(/đ/g,'d').replace(/Đ/g,'D').toLowerCase().trim();
export function extractLabelFields(pages) {
 const fields=Object.fromEntries(Object.keys(labelAliases).map(key=>[key,{value:null,confidence:'unknown',evidence:null}]));
 const conflicts=new Set();
 for(const page of pages)for(const raw of String(page.text||'').normalize('NFC').split(/\r?\n/)){
  const line=raw.trim(),separator=line.search(/[:：]/);if(separator<1)continue;
  const label=foldLabel(line.slice(0,separator));
  const key=Object.keys(labelAliases).find(key=>labelAliases[key].includes(label));if(!key)continue;
  const value=line.slice(separator+1).trim().slice(0,key==='brewGuide'||key==='labelNotes'?1000:160);
  if(!value)continue;
  if(conflicts.has(key))continue;
  if(fields[key].value && foldLabel(fields[key].value)!==foldLabel(value)) {fields[key]={value:null,confidence:'unknown',evidence:`${fields[key].evidence} / ${line}`.slice(0,500)};conflicts.add(key);continue;}
  fields[key]={value,confidence:page.confidence>=90?'high':'low',evidence:line.slice(0,500)};
 }
 return {fields};
}
let ocrScriptPromise;
async function loadLocalOcr(base) {
 if(globalThis.Tesseract?.createWorker)return globalThis.Tesseract;
 if(!ocrScriptPromise)ocrScriptPromise=new Promise((resolve,reject)=>{
  const script=document.createElement('script');script.src=new URL('engine/tesseract.min.js',base).href;
  script.onload=()=>globalThis.Tesseract?.createWorker?resolve(globalThis.Tesseract):reject(new Error('OCR unavailable'));
  script.onerror=()=>{script.remove();ocrScriptPromise=null;reject(new Error('OCR unavailable'));};document.head.append(script);
 });return ocrScriptPromise;
}
export async function readPackagingLocally(images,{signal,onProgress=()=>{}}={}) {
 if(!Array.isArray(images)||images.length<1||images.length>4)throw new Error('Invalid photo count');
 const base=new URL('./ocr/',location.href);let worker;let pageIndex=0;
 let abortListener;
 const aborted=new Promise((_,reject)=>{abortListener=()=>{worker?.terminate();reject(new DOMException('Cancelled','AbortError'));};signal?.addEventListener('abort',abortListener,{once:true});});
 try{
  if(signal?.aborted)throw new DOMException('Cancelled','AbortError');
  const engine=await Promise.race([loadLocalOcr(base),aborted]);
  const workerPromise=engine.createWorker(['eng','vie'],1,{workerPath:new URL('engine/worker.min.js',base).href,corePath:new URL('engine/tesseract-core-lstm.wasm.js',base).href,langPath:new URL('lang/',base).href,workerBlobURL:false,gzip:true,logger:status=>{if(status.status==='recognizing text')onProgress(Math.min(99,Math.round(10+90*(pageIndex+(status.progress||0))/images.length)));}});
  // A late initialization must also terminate after cancellation.
  workerPromise.then(created=>{if(signal?.aborted)created.terminate();}).catch(()=>{});
  worker=await Promise.race([workerPromise,aborted]);onProgress(10);
  const pages=[];
  for(pageIndex=0;pageIndex<images.length;pageIndex++){
   const {data}=await Promise.race([worker.recognize(images[pageIndex]),aborted]);pages.push({text:data.text,confidence:data.confidence});
  }
  onProgress(100);return {extraction:extractLabelFields(pages),text:pages.map(p=>p.text).join('\n\n').slice(0,20000)};
 }finally{signal?.removeEventListener('abort',abortListener);await worker?.terminate();}
}
