export const recipeFields = ['dose', 'water', 'temp', 'grind'];
export const limits = { dose: [5, 50], water: [50, 800], temp: [75, 100], grind: [1, 40] };
export const coffeeBeans = [
  { id: 'ethiopia', name: 'Ethiopia · Washed', target: { dose: 20, water: 300, temp: 94, grind: 18 }, notes: 'floral' },
  { id: 'colombia', name: 'Colombia · Honey', target: { dose: 20, water: 300, temp: 93, grind: 20 }, notes: 'caramel' },
  { id: 'brazil', name: 'Brazil · Natural', target: { dose: 20, water: 300, temp: 92, grind: 22 }, notes: 'chocolate' }
];
export function validRecipe(parameters) {
  return recipeFields.every(k => Number.isFinite(parameters?.[k]) && parameters[k] >= limits[k][0] && parameters[k] <= limits[k][1]);
}
export function brewScore(bean, parameters, technique = 'pulse') {
  if (!bean || !validRecipe(parameters) || !['pulse', 'steady', 'fast'].includes(technique)) throw new Error('Invalid recipe');
  const weights = { dose: 3, water: 0.16, temp: 4, grind: 3 };
  return Math.max(0, Math.round(100 - recipeFields.reduce((sum, k) => sum + Math.abs(parameters[k] - bean.target[k]) * weights[k], 0) - ({pulse:0,steady:4,fast:12}[technique])));
}
export function pourPlan(parameters) {
  if (!validRecipe(parameters)) throw new Error('Invalid recipe');
  const bloom = Math.min(Math.round(parameters.dose * 2), Math.floor(parameters.water / 3));
  return [bloom, Math.round((parameters.water + bloom) / 2), parameters.water];
}
export function experimentHint(bean, parameters, technique) {
  const weights = { dose: 3, water: 0.16, temp: 4, grind: 3 };
  const field = recipeFields.slice().sort((a,b) => Math.abs(parameters[b]-bean.target[b])*weights[b]-Math.abs(parameters[a]-bean.target[a])*weights[a])[0];
  if (parameters[field] !== bean.target[field]) return { field, direction: parameters[field] > bean.target[field] ? 'lower' : 'raise' };
  return { field: technique === 'pulse' ? 'matched' : 'technique' };
}
export function loadJournal(raw) {
  if (raw === null) return { sessions: [], writable: true };
  try {
    const sessions = JSON.parse(raw);
    const optionalText = (s, key) => s[key] === undefined || typeof s[key] === 'string';
    const validTaste = taste => taste === undefined || taste === null || (typeof taste === 'object' && !Array.isArray(taste) && ['aroma','acidity','sweetness','bitterness','body','aftertaste'].every(k => taste[k] === undefined || taste[k] === null || (Number.isInteger(taste[k]) && taste[k] >= 1 && taste[k] <= 5)));
    const validOptional = s => optionalText(s,'notes') && optionalText(s,'discovery') && validTaste(s.taste) && (s.technique === undefined || ['pulse','steady','fast'].includes(s.technique)) && (s.ratingMode === undefined || ['real','hypothesis'].includes(s.ratingMode)) && (s.mood === undefined || s.mood === null || (Number.isInteger(s.mood) && s.mood >= 1 && s.mood <= 5));
    if (!Array.isArray(sessions) || !sessions.every(s => s && validOptional(s) && (coffeeBeans.some(b => b.id === s.bean) || (typeof s.bean === 'string' && /^custom-[a-zA-Z0-9-]+$/.test(s.bean) && typeof s.beanProfile?.name === 'string' && s.beanProfile.name.trim().length > 0 && s.beanProfile.name.length <= 160)) && validRecipe(s.parameters) && typeof s.date === 'string' && Number.isFinite(Date.parse(s.date)) && ((s.bean.startsWith('custom-') && s.simulatedScore === null) || (!s.bean.startsWith('custom-') && Number.isFinite(s.simulatedScore) && s.simulatedScore >= 0 && s.simulatedScore <= 100)))) throw new Error('Invalid journal');
    return { sessions, writable: true };
  } catch { return { sessions: [], writable: false, raw }; }
}
export function tasteMean(session) {
  const values = ['aroma','acidity','sweetness','bitterness','body','aftertaste'].map(k => session.taste?.[k]).filter(n => Number.isFinite(n) && n >= 1 && n <= 5);
  return values.length ? (values.reduce((a,b) => a+b,0) / values.length).toFixed(1) : '—';
}
