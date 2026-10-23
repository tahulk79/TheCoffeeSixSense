import fs from 'node:fs';
const read = path => fs.readFileSync(path, 'utf8');
const modules = ['src/progression.js', 'src/missions.js'].map(path => read(path).replaceAll('export function', 'function')).join('\n');
const main = read('src/main.js').replace(/^import .*;\n/gm, '');
export const standalone = '<!doctype html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>The Coffee Six Sense</title></head><body><div id="app"></div><style>' + read('src/style.css') + '</style><script type="module">\n' + modules + '\n' + main + '\n</script></body></html>\n';
if (process.argv.includes('--write')) fs.writeFileSync('docs/index.html', standalone);
