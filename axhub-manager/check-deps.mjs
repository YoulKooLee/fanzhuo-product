// 临时：检查各项目 node_modules（用完即删）
import fs from 'node:fs';
const base = 'C:/Users/游翔/Documents/AI work/Axhub';
const dirs = ['01-项目/学校卫生', '01-项目/Digital Twin/数字孪生', '02-模板/_project-template'];
for (const d of dirs) {
  const nm = base + '/' + d + '/node_modules';
  console.log(d, 'node_modules=' + fs.existsSync(nm));
}
