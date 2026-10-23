import assert from 'node:assert/strict';
const observedActions={dryBloom:'swirl',evenBloom:'settle',highWater:'pause',lowWater:'feed',unevenFlow:'redistribute',tiltedBed:'recenter',levelBed:'finishEven'};
export async function chooseObservedPour(page) {
 const cue=await page.locator('.dripper').getAttribute('data-cue');assert.ok(observedActions[cue],`Unknown visible cue: ${cue}`);await page.locator(`.pour-choice[data-action="${observedActions[cue]}"]`).click();
}
export async function finishPour(page) {for(let i=0;i<3;i++)await chooseObservedPour(page);await page.locator('#taste').waitFor();}
