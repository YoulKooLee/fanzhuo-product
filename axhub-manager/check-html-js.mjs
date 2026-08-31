// 临时：校验 public/index.html 内嵌 JS 语法（用完即删）
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('C:/Users/游翔/Documents/AI work/Axhub/axhub-manager/public/index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
let ok = true;
if (scripts.length === 0) {
  console.log('NO_SCRIPTS_FOUND');
  process.exit(1);
}
for (let i = 0; i < scripts.length; i++) {
  try {
    new vm.Script(scripts[i][1]);
    console.log('SCRIPT_' + (i + 1) + '_OK (' + scripts[i][1].length + ' chars)');
  } catch (e) {
    ok = false;
    console.log('SCRIPT_' + (i + 1) + '_FAIL: ' + e.message);
  }
}
console.log('ALL_OK=' + ok);
