import { missionProgress } from './missions.js';
import { progression } from './progression.js';
import { coffeeBeans, recipeFields, limits, validRecipe, brewScore, pourPlan, experimentHint, loadJournal, tasteMean } from './game.js';
import { translate } from './i18n.js';
import './style.css';

const key = 'c6s.sessions.v1';
const dimensions = ['aroma','acidity','sweetness','bitterness','body','aftertaste'];
const app = document.querySelector('#app');
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let language = 'vi';
try { language = localStorage.getItem('c6s.language') === 'en' ? 'en' : 'vi'; } catch {}
const t = name => translate(language, name);
let journal;
try { journal = loadJournal(localStorage.getItem(key)); } catch { journal = { sessions: [], writable: false }; }
let sessions = journal.sessions;
let recipe = { bean: 'ethiopia', parameters: { ...coffeeBeans[0].target }, technique: 'pulse' };
let stage = 'configure', pourStep = 0, draft = null, message = '', saveError = false, busy = false;
const beanFor = id => coffeeBeans.find(b => b.id === id);
const modeLabel = session => t(session.ratingMode === 'real' ? 'real' : session.ratingMode === 'hypothesis' ? 'hypothesis' : 'legacy');
const ratingFields = () => dimensions.map(k => ratingSelect(k, draft?.taste?.[k])).join('');
function ratingSelect(name, value) {
  return `<label>${t(name)} (1–5)<select name="${name}"><option value="">${t('unrated')}</option>${[1,2,3,4,5].map(n => `<option ${Number(value) === n ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;
}
function download(value, filename, raw = false) {
  const url = URL.createObjectURL(new Blob([raw ? value : JSON.stringify(value,null,2)], {type:'application/json'}));
  const link = document.createElement('a');link.href=url;link.download=filename;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function capture() {
  const form = document.querySelector('#brew');
  if (form && stage === 'configure') {
    recipe = { bean:form.elements.bean.value, parameters:Object.fromEntries(recipeFields.map(k=>[k,Number(form.elements[k].value)])), technique:form.elements.technique.value };
  }
  const taste = document.querySelector('#taste');
  if (taste && draft && stage === 'tasting') {
    draft.ratingMode = taste.elements.ratingMode.value;
    draft.taste = Object.fromEntries(dimensions.map(k=>[k,taste.elements[k].value === '' ? null : Number(taste.elements[k].value)]));
    draft.mood = taste.elements.mood.value === '' ? null : Number(taste.elements.mood.value);
    draft.notes=taste.elements.notes.value;draft.discovery=taste.elements.discovery.value;
  }
}
function focusOn(selector) {
  const element = document.querySelector(selector);
  element?.focus({preventScroll:true});element?.scrollIntoView({behavior:'smooth',block:'start'});
}
function renderDesk() {
  if (stage === 'configure') return `<form id="brew"><label>${t('bean')}<select name="bean">${coffeeBeans.map(b=>`<option value="${b.id}" ${recipe.bean===b.id?'selected':''}>${b.name} — ${t(b.notes)}</option>`).join('')}</select></label><div class="fields">${recipeFields.map(k=>`<label>${t(k)}<input name="${k}" type="number" min="${limits[k][0]}" max="${limits[k][1]}" step="${k==='dose'?'0.1':'1'}" value="${esc(recipe.parameters[k])}" required></label>`).join('')}</div><p id="ratio">${t('ratio')}: 1 : ${(recipe.parameters.water/recipe.parameters.dose).toFixed(1)}</p><label>${t('technique')}<select name="technique">${['pulse','steady','fast'].map(k=>`<option value="${k}" ${recipe.technique===k?'selected':''}>${t(k)}</option>`).join('')}</select></label><p class="help">${t('techniqueHelp')}</p><div class="actions"><button type="submit">${t('start')}</button><button type="button" class="secondary" id="reference">${t('reference')}</button></div></form>`;
  if (stage === 'pouring') {
    const plan=pourPlan(recipe.parameters), names=['bloom','middle','finish'];
    const poured=pourStep===0?0:plan[pourStep-1];
    return `<div class="pour-scene"><div class="cup" aria-hidden="true"><div style="height:${poured/recipe.parameters.water*100}%"></div></div><h3 id="pour-title" tabindex="-1">${pourStep+1} / 3 · ${t(names[pourStep])}</h3><p>${t(names[pourStep]+'Help')}</p><p>${t('technique')}: <strong>${t(recipe.technique)}</strong></p><progress max="${recipe.parameters.water}" value="${poured}" aria-label="${t('poured')}"></progress><p>${t('poured')}: ${poured} / ${recipe.parameters.water} ml</p><button id="pour" type="button">${t('pour')} ${plan[pourStep]} ml (+${plan[pourStep]-poured} ml)</button><p class="help">${t('virtualTime')}</p><button id="cancel" class="secondary" type="button">${t('cancel')}</button></div>`;
  }
  const hint=experimentHint(beanFor(draft.bean),draft.parameters,draft.technique);
  const hintText=hint.field==='matched'?t('matched'):hint.field==='technique'?t('techniqueHint'):`${t(hint.direction)} ${t(hint.field).toLowerCase()} ${t('hintEnd')}`;
  const result=`<div class="balance"><span>${t('balance')}</span><strong>${draft.simulatedScore}<small> / 100</small></strong></div><p class="help">${t('disclaimer')}</p><aside class="experiment"><h3>${t('feedback')}</h3><p>${hintText}</p></aside>`;
  if (stage === 'saved') return `${result}<div class="success" role="status"><h3 id="saved-title" tabindex="-1">${t('saveSuccess')}</h3><p>+${draft.discovery.trim()?15:10} XP</p></div><div class="actions"><button type="button" id="again">${t('retry')}</button><button type="button" id="new" class="secondary">${t('newBrew')}</button></div>`;
  return `${result}<form id="taste"><h3 id="taste-title" tabindex="-1">${t('tasteTitle')}</h3><label>${t('mode')}<select name="ratingMode"><option value="hypothesis" ${draft.ratingMode==='hypothesis'?'selected':''}>${t('hypothesis')}</option><option value="real" ${draft.ratingMode==='real'?'selected':''}>${t('real')}</option></select></label><p class="help">${t('modeHelp')}</p><p>${t('ratingsHelp')}</p><div class="fields">${ratingFields()}</div>${ratingSelect('mood',draft.mood)}<p class="help">${t('moodHelp')}</p><label>${t('notes')}<textarea name="notes" maxlength="1000" rows="3" placeholder="${t('notesPlaceholder')}">${esc(draft.notes)}</textarea></label><label>${t('discovery')}<textarea name="discovery" maxlength="1000" rows="2" placeholder="${t('discoveryPlaceholder')}">${esc(draft.discovery)}</textarea></label><p id="save-error" role="alert" tabindex="-1">${saveError?t('saveError'):''}</p><div class="actions"><button type="submit" ${journal.writable?'':'disabled'}>${t('save')}</button><button type="button" id="draft-export" class="secondary">${t('draftExport')}</button><button type="button" id="cancel" class="secondary">${t('cancel')}</button></div></form>`;
}
function renderHistory() {
  return `<section class="panel" id="memory"><div class="section-head"><h2>${t('memory')}</h2><button id="export" class="secondary" type="button">${t('export')}</button></div>${sessions.length>1?`<details class="compare"><summary>${t('compare')}</summary><div class="fields"><label>${t('sessionA')}<select id="compare-a">${sessions.map((s,i)=>`<option value="${i}" ${i===sessions.length-2?'selected':''}>#${i+1} · ${esc(beanFor(s.bean).name)}</option>`).join('')}</select></label><label>${t('sessionB')}<select id="compare-b">${sessions.map((s,i)=>`<option value="${i}" ${i===sessions.length-1?'selected':''}>#${i+1} · ${esc(beanFor(s.bean).name)}</option>`).join('')}</select></label></div><div id="comparison"></div><p class="help">${t('compareHelp')}</p></details>`:''}<div id="history">${sessions.length?sessions.slice().reverse().map((s,i)=>`<article class="session"><strong>${esc(beanFor(s.bean).name)} · ${s.simulatedScore}/100</strong><small>${esc(new Date(s.date).toLocaleString(language==='vi'?'vi-VN':'en-GB'))} · ${modeLabel(s)}</small><p>${t('personal')}: ${tasteMean(s)}/5</p><p>${esc(s.discovery||t('noDiscovery'))}</p><p>${esc(s.notes||t('noNotes'))}</p><small>${recipeFields.map(k=>`${t(k)}: ${s.parameters[k]}`).join(' · ')} · ${s.technique?t(s.technique):t('noTechnique')}</small>${s.mood?`<p>${t('mood')}: ${esc(s.mood)}/5</p>`:''}<button class="secondary retry" data-session="${sessions.length-1-i}" type="button">${t('retry')}</button></article>`).join(''):`<p>${t('empty')}</p>`}</div></section>`;
}
function render() {
  document.documentElement.lang=language;
  const journey=progression(sessions), missions=missionProgress(sessions), active=missions.find(m=>!m.complete&&!m.locked);
  app.innerHTML=`<main><header><div class="section-head"><span class="eyebrow">THE COFFEE SIX SENSE · PHASE 1</span><label class="language">${t('language')}<select id="language"><option value="vi" ${language==='vi'?'selected':''}>Tiếng Việt</option><option value="en" ${language==='en'?'selected':''}>English</option></select></label></div><h1>${t('title')}</h1><p>${t('intro')}</p><details class="guide" ${sessions.length?'':'open'}><summary>${t('guide')}</summary><p>${t('guideText')}</p></details></header>${!journal.writable?`<div class="warning" role="alert"><p>${t('storageError')}</p>${journal.raw!==undefined?`<button id="recovery" type="button">${t('recovery')}</button>`:''}</div>`:''}<section class="panel" id="desk" aria-labelledby="desk-title"><h2 id="desk-title" tabindex="-1">${t('desk')}</h2><ol class="steps">${['configure','pouring','tasting','saved'].map(k=>`<li ${stage===k?'aria-current="step"':''}>${t(k)}</li>`).join('')}</ol><p id="recipe-message" role="status">${esc(message)}</p><div id="result">${renderDesk()}</div></section><section class="panel journey" aria-labelledby="journey-title"><h2 id="journey-title">${t('journey')}</h2><p><strong>${t('level')} ${journey.level}</strong> · ${journey.xp} XP · ${journey.remaining} ${t('nextLevel')}</p><progress max="50" value="${journey.progress}" aria-label="${t('nextLevel')}"></progress><p>${t('xpText')}</p><details><summary>${t('journey')} · ${journey.badges.filter(b=>b.earned).length}/4</summary><ul class="badges">${journey.badges.map(b=>`<li class="${b.earned?'earned':''}"><strong>${b.earned?'✓':'○'} ${t(b.name)}</strong><small>${t(b.hint)}</small></li>`).join('')}</ul></details></section><section class="panel missions"><div class="section-head"><h2>${t('quests')}</h2><span>${missions.filter(m=>m.complete&&!m.locked).length} / 4 ${t('complete')}</span></div><p>${t('questHelp')}</p><ol class="quest-list">${missions.map(m=>`<li class="quest ${m.locked?'locked':m.complete?'complete':'active'}"><div><strong>${t(m.locked?'locked':m.complete?'complete':'current')} · ${t(m.id+'Title')}</strong><p>${t(m.id+'Description')}</p><span>${m.count} / ${m.total}</span></div>${!m.complete&&!m.locked?`<button id="start-quest" type="button">${t(m.id==='experiment'&&sessions.length?'lastRecipe':'startQuest')}</button>`:''}</li>`).join('')}</ol>${!active?`<p id="quest-message">${t('allQuests')}</p>`:''}</section>${renderHistory()}<footer>${t('disclaimer')}</footer></main>`;
  bind(active);
}
function changeRecipe(session, prompt='') {
  if ((stage==='pouring'||stage==='tasting')&&!confirm(t('cancelConfirm'))) return;
  recipe=session?{bean:session.bean,parameters:{...session.parameters},technique:session.technique||'pulse'}:recipe;
  stage='configure';draft=null;pourStep=0;message=prompt;saveError=false;render();focusOn('#desk-title');
}
function bind(activeMission) {
  document.querySelector('#language').onchange=e=>{capture();language=e.target.value;try{localStorage.setItem('c6s.language',language);}catch{}render();document.querySelector('#language').focus();};
  document.querySelector('#brew')?.addEventListener('input',()=>{capture();document.querySelector('#ratio').textContent=`${t('ratio')}: 1 : ${validRecipe(recipe.parameters)?(recipe.parameters.water/recipe.parameters.dose).toFixed(1):'—'}`;});
  document.querySelector('#brew')?.addEventListener('submit',e=>{e.preventDefault();capture();if(!validRecipe(recipe.parameters))return;stage='pouring';pourStep=0;message='';render();focusOn('#pour-title');});
  document.querySelector('#reference')?.addEventListener('click',()=>{capture();recipe.parameters={...beanFor(recipe.bean).target};recipe.technique='pulse';render();focusOn('#desk-title');});
  document.querySelector('#pour')?.addEventListener('click',e=>{
    if(busy)return;busy=true;e.currentTarget.disabled=true;
    // Each click advances one explicit simulated pour; no background timer can skip a step.
    pourStep++;
    if(pourStep===3){stage='tasting';draft={id:globalThis.crypto?.randomUUID?.()||`brew-${Date.now()}-${Math.random().toString(36).slice(2)}`,date:new Date().toISOString(),bean:recipe.bean,parameters:{...recipe.parameters},technique:recipe.technique,simulatedScore:brewScore(beanFor(recipe.bean),recipe.parameters,recipe.technique),ratingMode:'hypothesis',taste:{},mood:null,notes:'',discovery:''};}
    render();focusOn(stage==='tasting'?'#taste-title':'#pour-title');busy=false;
  });
  document.querySelector('#cancel')?.addEventListener('click',()=>changeRecipe(null));
  document.querySelector('#taste')?.addEventListener('submit',e=>{
    e.preventDefault();capture();if(!journal.writable||busy)return;busy=true;
    const next=[...sessions,draft];
    try{localStorage.setItem(key,JSON.stringify(next));sessions=next;stage='saved';saveError=false;message='';}
    catch{saveError=true;}
    busy=false;render();focusOn(saveError?'#save-error':'#saved-title');
  });
  document.querySelector('#draft-export')?.addEventListener('click',()=>{capture();download([draft],'coffee-memory-draft.json');});
  document.querySelector('#again')?.addEventListener('click',()=>changeRecipe(draft));
  document.querySelector('#new')?.addEventListener('click',()=>changeRecipe({bean:'ethiopia',parameters:{...coffeeBeans[0].target},technique:'pulse'}));
  document.querySelectorAll('.retry').forEach(button=>button.onclick=()=>changeRecipe(sessions[Number(button.dataset.session)]));
  document.querySelector('#start-quest')?.addEventListener('click',()=>{
    if((stage==='pouring'||stage==='tasting')&&!confirm(t('cancelConfirm')))return;
    capture();stage='configure';draft=null;saveError=false;
    if(activeMission.id==='experiment'&&sessions.length){const last=sessions.at(-1);recipe={bean:last.bean,parameters:{...last.parameters},technique:last.technique||'pulse'};}
    if(activeMission.id==='explore'&&activeMission.bean){recipe.bean=activeMission.bean;recipe.parameters={...beanFor(recipe.bean).target};}
    message=t(activeMission.id+'Prompt');render();focusOn('#desk-title');
  });
  document.querySelector('#export').onclick=()=>download(sessions,'coffee-memory.json');
  document.querySelector('#recovery')?.addEventListener('click',()=>download(journal.raw,'coffee-memory-recovery.json',true));
  const ca=document.querySelector('#compare-a'),cb=document.querySelector('#compare-b');
  if(ca&&cb){
    const update=()=>{
      const a=sessions[Number(ca.value)],b=sessions[Number(cb.value)];
      const rows=[...recipeFields.map(k=>[t(k),a.parameters[k],b.parameters[k]]),[t('technique'),a.technique?t(a.technique):t('noTechnique'),b.technique?t(b.technique):t('noTechnique')],[t('balance'),a.simulatedScore,b.simulatedScore],[t('mode'),modeLabel(a),modeLabel(b)],[t('personal'),tasteMean(a),tasteMean(b)]];
      document.querySelector('#comparison').innerHTML=ca.value===cb.value?`<p>${t('sameSession')}</p>`:`<div class="table-wrap"><table><thead><tr><th>${t('measure')}</th><th>${t('sessionA')}</th><th>${t('sessionB')}</th></tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>`<${i?'td':'th'}>${esc(cell)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table></div>`;
    };ca.onchange=update;cb.onchange=update;update();
  }
}
render();
