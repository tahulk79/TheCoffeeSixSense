const fields = ['dose', 'water', 'temp', 'grind'];
const starterBeans = ['ethiopia', 'colombia', 'brazil'];

// Only saved sessions count. Missions are derived so old journals keep their progress.
export function missionProgress(sessions) {
  const visited = starterBeans.filter(bean => sessions.some(s => s.bean === bean));
  const discoveries = sessions.filter(s => typeof s.discovery === 'string' && s.discovery.trim()).length;
  const controlled = sessions.some((current, index) => {
    const previous = sessions[index - 1];
    if (!previous || current.bean !== previous.bean || !(typeof current.discovery === 'string' && current.discovery.trim())) return false;
    if (!fields.every(field => Number.isFinite(current.parameters?.[field]) && Number.isFinite(previous.parameters?.[field]))) return false;
    return fields.filter(field => current.parameters[field] !== previous.parameters[field]).length + Number((current.technique || 'pulse') !== (previous.technique || 'pulse')) === 1;
  });
  const steadyBean = starterBeans.find(bean => sessions.filter(s => s.bean === bean && Number.isFinite(s.simulatedScore) && s.simulatedScore >= 90).length >= 3);
  const bestRun = Math.max(0, ...starterBeans.map(bean => sessions.filter(s => s.bean === bean && Number.isFinite(s.simulatedScore) && s.simulatedScore >= 90).length));
  const missions = [
    { id: 'explore', title: 'Meet the beans', description: 'Save one brew with each of the three starter beans.', count: visited.length, total: 3, bean: starterBeans.find(bean => !visited.includes(bean)) },
    { id: 'discover', title: 'Notice something new', description: 'Save three brews with a discovery: what did you notice or want to try next?', count: Math.min(discoveries, 3), total: 3 },
    { id: 'experiment', title: 'Change one thing', description: 'Save two consecutive brews of the same bean with exactly one recipe setting changed. Add a discovery to the second brew.', count: Number(controlled), total: 1 },
    { id: 'steady', title: 'Find your rhythm', description: 'Save three brews of the same bean with a simulated balance of 90 or more. This is a game recipe goal, not a taste assessment.', count: Math.min(bestRun, 3), total: 3, bean: steadyBean }
  ];
  let unlocked = true;
  return missions.map(mission => {
    const complete = mission.count >= mission.total;
    const result = { ...mission, complete, locked: !unlocked };
    unlocked = unlocked && complete;
    return result;
  });
}
