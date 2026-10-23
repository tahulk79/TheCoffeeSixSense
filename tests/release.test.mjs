import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('release activation, rollback and rejection preserve the active release', () => {
  const base=fs.mkdtempSync(path.join(os.tmpdir(),'c6s-release-'));
  try {
    fs.mkdirSync(`${base}/releases`); fs.mkdirSync(`${base}/incoming`);
    const script=fs.readFileSync('deploy/release.sh','utf8').replace('base=/srv/coffee-six-sense',`base=${base}`);
    fs.writeFileSync(`${base}/release.sh`,script);
    const run=(op,id)=>spawnSync('bash',[`${base}/release.sh`,op,id],{encoding:'utf8',timeout:10000});
    const a='a'.repeat(40)+'-1-1', b='b'.repeat(40)+'-2-1', bad='c'.repeat(40)+'-3-1';
    for(const id of [a,b]) {
      fs.mkdirSync(`${base}/incoming/${id}/assets`,{recursive:true});
      fs.writeFileSync(`${base}/incoming/${id}/index.html`,'<h1>coffee</h1>');
      fs.writeFileSync(`${base}/incoming/${id}/health.txt`,id+'\n');
      assert.equal(run('activate',id).status,0);
      assert.equal(fs.readlinkSync(`${base}/current`),`${base}/releases/${id}`);
    }
    assert.equal(run('rollback',a).status,0);
    assert.equal(fs.readlinkSync(`${base}/current`),`${base}/releases/${a}`);
    assert.notEqual(run('activate',a).status,0);
    assert.notEqual(run('rollback','../../etc').status,0);
    fs.mkdirSync(`${base}/incoming/${bad}`);
    assert.notEqual(run('activate',bad).status,0);
    assert.equal(fs.readlinkSync(`${base}/current`),`${base}/releases/${a}`);
  } finally { fs.rmSync(base,{recursive:true,force:true}); }
});
