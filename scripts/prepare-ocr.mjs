import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root='public/ocr';const source=JSON.parse(fs.readFileSync(`${root}/lang/SOURCES.json`,'utf8'));
for(const [name,metadata]of Object.entries(source.files)){
 const bytes=fs.readFileSync(`${root}/lang/${name}`);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),metadata.sha256,`OCR language checksum mismatch: ${name}`);
}
for(const [name,expected]of [['tesseract.js','6.0.1'],['tesseract.js-core','6.0.0']])assert.equal(JSON.parse(fs.readFileSync(`node_modules/${name}/package.json`)).version,expected);
const files={
 'tesseract.min.js':'tesseract.js/dist/tesseract.min.js',
 'worker.min.js':'tesseract.js/dist/worker.min.js',
 'tesseract.min.js.LICENSE.txt':'tesseract.js/dist/tesseract.min.js.LICENSE.txt',
 'worker.min.js.LICENSE.txt':'tesseract.js/dist/worker.min.js.LICENSE.txt',
 'TESSERACT-LICENSE':'tesseract.js/LICENSE.md',
 'tesseract-core-lstm.wasm.js':'tesseract.js-core/tesseract-core-lstm.wasm.js',
 'tesseract-core-lstm.wasm':'tesseract.js-core/tesseract-core-lstm.wasm',
 'CORE-LICENSE':'tesseract.js-core/LICENSE'
};
fs.mkdirSync(`${root}/engine`,{recursive:true});
for(const [target,path]of Object.entries(files))fs.copyFileSync(`node_modules/${path}`,`${root}/engine/${target}`);
console.log('Prepared pinned OCR engine and verified English/Vietnamese language files for same-origin hosting.');
