import { counterProgress } from './counter-progress.js';
const weights = { dose: 3, water: 0.16, temp: 4, grind: 3 };
export function nextExperiment(bean, parameters) {
  const field = Object.keys(weights).sort((a, b) => Math.abs(parameters[b] - bean.target[b]) * weights[b] - Math.abs(parameters[a] - bean.target[a]) * weights[a])[0];
  if (Number(parameters[field]) === bean.target[field]) return 'You matched this game recipe. Try another bean, or change one setting and compare the results.';
  const names = { dose: 'dose', water: 'water volume', temp: 'temperature', grind: 'grind setting' };
  return `Try ${parameters[field] > bean.target[field] ? 'lowering' : 'raising'} your ${names[field]} next. Keep the other settings unchanged to compare the effect. This hint follows the game model, not a measured extraction.`;
}
export function progression(sessions, counterRounds = []) {
  const discoveries = sessions.filter(s => typeof s.discovery === 'string' && s.discovery.trim()).length;
  const xp = sessions.length * 10 + discoveries * 5 + counterProgress(counterRounds).xp;
  const practices=[...sessions,...counterRounds];
  const allDiscoveries=discoveries+counterProgress(counterRounds).completed.length+counterRounds.filter(r=>r.note?.trim()).length;
  const level = Math.floor(xp / 50) + 1;
  const badges = [
    { name: 'First cup', hint: 'Save your first brew', earned: practices.length >= 1 },
    { name: 'Curious taster', hint: 'Record three discoveries', earned: allDiscoveries >= 3 },
    { name: 'Bean explorer', hint: 'Save brews with all three starter beans', earned: ['ethiopia', 'colombia', 'brazil'].every(id => practices.some(s => s.bean === id)) },
    { name: 'Practice makes progress', hint: 'Save five brews', earned: practices.length >= 5 }
  ];
  return { xp, level, remaining: 50 - xp % 50, progress: xp % 50, badges };
}
