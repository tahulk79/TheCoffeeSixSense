import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { missionProgress } from '../src/missions.js';
import { standalone } from '../scripts/build-standalone.mjs';
const brew = (bean='ethiopia', overrides={}) => ({bean,parameters:{dose:20,water:300,temp:94,grind:18},discovery:'Try a new setting',simulatedScore:95,...overrides});
test('quests unlock in order while preserving progress from old history', () => {
  const empty=missionProgress([]);assert.equal(empty[0].locked,false);assert.ok(empty.slice(1).every(m=>m.locked));
  const sessions=['ethiopia','colombia','brazil'].map(bean=>brew(bean));
  const quests=missionProgress(sessions);assert.equal(quests[0].complete,true);assert.equal(quests[1].complete,true);assert.equal(quests[2].locked,false);assert.equal(quests[3].locked,true);
});
test('controlled experiment requires consecutive same-bean brews, one changed field and discovery', () => {
  const changed=brew('ethiopia',{parameters:{dose:20,water:300,temp:93,grind:18}});
  assert.equal(missionProgress([brew(),changed])[2].complete,true);
  for (const invalid of [brew(),{...changed,bean:'brazil'},{...changed,discovery:'  '},{...changed,parameters:{dose:21,water:300,temp:93,grind:18}},{...changed,parameters:{dose:20}}]) assert.equal(missionProgress([brew(),invalid])[2].complete,false);
});
test('rhythm requires three qualifying scores of one bean', () => {
  assert.equal(missionProgress(['ethiopia','brazil','colombia'].map(bean=>brew(bean)))[3].complete,false);
  assert.equal(missionProgress([brew(),brew(),brew('ethiopia',{simulatedScore:89})])[3].complete,false);
  assert.equal(missionProgress([brew(),brew(),brew()])[3].complete,true);
});
test('Pages artifact matches the source modules and styles', () => {
  assert.equal(fs.readFileSync('docs/index.html','utf8'),standalone);
});
