export const beanFieldNames = ['name','roaster','origin','region','variety','process','roastLevel','roastDate','labelNotes','brewGuide'];
export function normalizeBeanFields(input = {}) {
  return Object.fromEntries(beanFieldNames.map(key => [key,typeof input[key] === 'string' ? input[key].trim().slice(0,key === 'brewGuide' || key === 'labelNotes' ? 1000 : 160) : '']));
}
export function validRoastDate(value) {
  if (!value) return true;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
}
export function normalizeExtraction(result) {
  if (!result || typeof result.fields !== 'object' || result.fields === null || Array.isArray(result.fields)) throw new Error('Invalid extraction');
  return Object.fromEntries(beanFieldNames.map(key => {
    const candidate = result.fields[key];
    const value = typeof candidate?.value === 'string' ? normalizeBeanFields({[key]:candidate.value})[key] : '';
    const valid = key !== 'roastDate' || validRoastDate(value);
    return [key,{value:valid?value:'',confidence:valid&&value&&candidate?.confidence==='high'&&typeof candidate.evidence==='string'&&candidate.evidence.trim()?'high':valid&&value?'low':'unknown',evidence:typeof candidate?.evidence==='string'?candidate.evidence.slice(0,500):''}];
  }));
}
export function mergeExtraction(fields, extraction) {
  const next = normalizeBeanFields(fields);
  for (const key of beanFieldNames) if (!next[key] && extraction[key]?.value) next[key] = extraction[key].value;
  return next;
}
export function validBeanProfile(profile) {
  return profile && typeof profile.id==='string' && /^custom-[a-zA-Z0-9-]+$/.test(profile.id) && profile.fields && typeof profile.fields.name==='string' && profile.fields.name.trim().length>0 && profile.fields.name.length<=160 && validRoastDate(profile.fields.roastDate) && (profile.photos === undefined || (Array.isArray(profile.photos) && profile.photos.length <= 6 && profile.photos.every(photo => photo && typeof photo.id === 'string' && /^[a-zA-Z0-9-]+$/.test(photo.id) && ['packaging','beans'].includes(photo.kind) && typeof photo.dataUrl === 'string' && photo.dataUrl.length <= 2500000 && /^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(photo.dataUrl))));
}
