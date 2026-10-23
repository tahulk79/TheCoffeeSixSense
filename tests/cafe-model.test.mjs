import {test} from 'node:test';
import assert from 'node:assert/strict';
import {cafeStart,cafeTick,cafeResult} from '../src/cafe-model.js';
function brew(heat=92,pulses=true){let s=cafeStart('brazil',heat);for(let i=0;i<2000&&!s.done;i++){s=cafeTick(s,pulses?s.water<40:true,.05);}assert.ok(s.done);return cafeResult(s);}
test('pulsing prevents overflow while uninterrupted pouring loses body',()=>{const controlled=brew(),rushed=brew(92,false);assert.equal(controlled.overflow,0);assert.ok(rushed.overflow>10);assert.ok(controlled.flavor[2]>rushed.flavor[2]);});
test('temperature changes flavor for the same bean and pouring schedule',()=>{const cool=brew(88),hot=brew(96);assert.ok(cool.flavor[0]>hot.flavor[0]);assert.ok(cool.flavor[1]<hot.flavor[1]);});
test('simulation conserves water and remains immutable, even after completion',()=>{let s=cafeStart();const before={...s};cafeTick(s,true,.1);assert.deepEqual(s,before);for(let i=0;i<2000&&!s.done;i++)s=cafeTick(s,true,.05);assert.ok(Math.abs(s.poured-s.water-s.drained-s.overflow)<1e-6);assert.deepEqual(cafeTick(s,true,.1),s);assert.throws(()=>cafeResult(cafeStart()));});
