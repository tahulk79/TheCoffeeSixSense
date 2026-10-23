import { test } from 'node:test';
import assert from 'node:assert/strict';
import { progression, nextExperiment } from '../src/progression.js';
test('progress counts practice and discoveries, independent of simulated taste score', () => {
  assert.equal(progression([]).remaining, 50);
  const sessions = ['ethiopia','colombia','brazil'].map(bean => ({ bean, discovery: 'Try a different grind', simulatedScore: 0 }));
  const result = progression(sessions);
  assert.equal(result.xp,45);
  assert.equal(result.level,1);
  assert.equal(result.badges.filter(b => b.earned).length,3);
  sessions.push({bean:'ethiopia', discovery:'   '});
  assert.equal(progression(sessions).level,2);
  assert.equal(progression(sessions).remaining,45);
});
test('hints target the largest weighted recipe difference and handle a matching recipe', () => {
  const bean = {target:{dose:20,water:300,temp:94,grind:18}};
  assert.match(nextExperiment(bean,{dose:20,water:300,temp:80,grind:19}),/raising your temperature/);
  assert.match(nextExperiment(bean,{dose:20,water:300,temp:94,grind:30}),/lowering your grind setting/);
  assert.match(nextExperiment(bean,bean.target),/matched this game recipe/);
});
