// 临时：检查 react 类型声明（用完即删）
import fs from 'node:fs';
const nm = 'C:/Users/游翔/Documents/AI work/Axhub/01-项目/学校卫生/node_modules';
const typesDir = nm + '/@types';
console.log('has @types dir: ' + fs.existsSync(typesDir));
if (fs.existsSync(typesDir)) {
  console.log(fs.readdirSync(typesDir).join(', '));
}
console.log('react version: ' + (JSON.parse(fs.readFileSync(nm + '/react/package.json', 'utf8')).version || '?'));
console.log('react has types field: ' + JSON.stringify(JSON.parse(fs.readFileSync(nm + '/react/package.json', 'utf8')).types || 'none'));
