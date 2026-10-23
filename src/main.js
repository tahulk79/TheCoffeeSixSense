import './style.css';

const beans = [
  { id: 'ethiopia', name: 'Ethiopia · Washed', target: { dose: 20, water: 300, temp: 94, grind: 18 }, notes: 'Floral · Citrus' },
  { id: 'colombia', name: 'Colombia · Honey', target: { dose: 20, water: 300, temp: 93, grind: 20 }, notes: 'Caramel · Red fruit' },
  { id: 'brazil', name: 'Brazil · Natural', target: { dose: 20, water: 300, temp: 92, grind: 22 }, notes: 'Chocolate · Nuts' }
];
const key = 'c6s.sessions.v1';
const read = () => { try { const x = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(x) ? x : []; } catch { return []; } };
let sessions = read();
const app = document.querySelector('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const label = b => beans.find(x => x.id === b)?.name || b;
const score = (bean, p) => Math.max(0, Math.round(100 - Object.keys(bean.target).reduce((sum, k) => sum + Math.abs(Number(p[k]) - bean.target[k]) * ({dose:3,water:0.16,temp:4,grind:3}[k]), 0)));
function render() {
  app.innerHTML = `<main><header><span class="eyebrow">THE COFFEE SIX SENSE · MVP 0.1</span><h1>Brew. Taste. Discover.</h1><p>Learn pour-over through experiments. Your sixth sense is the meaning you find in the cup.</p></header>
  <section class="panel"><h2>01 / Coffee Desk</h2><form id="brew"><label>Bean<select name="bean">${beans.map(b => `<option value="${b.id}">${b.name} — ${b.notes}</option>`).join('')}</select></label><div class="fields">
  <label>Dose (g)<input name="dose" type="number" min="5" max="50" value="20" required></label>
  <label>Water (ml)<input name="water" type="number" min="50" max="800" value="300" required></label>
  <label>Temperature (°C)<input name="temp" type="number" min="75" max="100" value="93" required></label>
  <label>Grind (relative setting)<input name="grind" type="number" min="1" max="40" value="20" required></label></div>
  <button type="submit">Simulate brew</button></form><div id="result" aria-live="polite"></div></section>
  <section class="panel"><div class="section-head"><h2>02 / Coffee Memory</h2><button id="export" class="secondary" type="button">Export JSON</button></div><div id="history">${sessions.length ? sessions.slice().reverse().map(s => `<article class="session"><strong>${esc(label(s.bean))} · ${s.simulatedScore}/100</strong><small>${esc(s.date)}</small><p>${esc(s.notes || 'No tasting notes yet')}</p><small>${esc(JSON.stringify(s.parameters))}</small></article>`).join('') : '<p>No brews yet. Make your first cup above.</p>'}</div></section><footer>Simulation scores are educational game estimates, not measured extraction or objective taste quality.</footer></main>`;
  document.querySelector('#brew').addEventListener('submit', e => {
    e.preventDefault(); const form = new FormData(e.currentTarget); const bean = beans.find(b => b.id === form.get('bean'));
    const parameters = Object.fromEntries(['dose','water','temp','grind'].map(k => [k, Number(form.get(k))]));
    const simulatedScore = score(bean, parameters);
    const result = document.querySelector('#result');
    result.innerHTML = `<div class="result"><h3>Simulated balance: ${simulatedScore}/100</h3><p>This is a simplified game model, not a prediction of what you will actually taste.</p><label>What did you notice? (taste, feelings, discoveries)<textarea id="notes" maxlength="1000" rows="3" placeholder="Describe your experience..."></textarea></label><button id="save" type="button">Save to Coffee Memory</button></div>`;
    document.querySelector('#save').onclick = () => {
      sessions.push({id:crypto.randomUUID(),date:new Date().toISOString(),bean:bean.id,parameters,simulatedScore,notes:document.querySelector('#notes').value});
      try {localStorage.setItem(key,JSON.stringify(sessions));render();} catch {alert('Local storage is unavailable. Export your data after enabling storage.');}
    };
  });
  document.querySelector('#export').onclick = () => {
    const blob = new Blob([JSON.stringify(sessions,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download='coffee-memory.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
}
render();
