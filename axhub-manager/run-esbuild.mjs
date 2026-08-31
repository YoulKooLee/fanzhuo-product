// 临时：用 esbuild JS API 转译三个 PrototypeLayout.tsx 验证 JSX 编译（用完即删）
import { createRequire } from 'node:module';
const require = createRequire('C:/Users/游翔/Documents/AI work/Axhub/01-项目/学校卫生/');
const esbuild = require('esbuild');

const files = [
  '01-项目/学校卫生/src/common/PrototypeLayout.tsx',
  '01-项目/Digital Twin/数字孪生/src/common/PrototypeLayout.tsx',
  '02-模板/_project-template/src/common/PrototypeLayout.tsx',
];
const base = 'C:/Users/游翔/Documents/AI work/Axhub';

let ok = true;
for (const f of files) {
  try {
    const r = await esbuild.transform(await (await import('node:fs')).promises.readFile(base + '/' + f, 'utf8'), {
      loader: 'tsx',
      jsx: 'transform',
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      target: 'es2019',
    });
    console.log('OK   ' + f + ' (out bytes=' + r.code.length + ')');
  } catch (e) {
    ok = false;
    console.log('FAIL ' + f);
    console.log(String(e.message || e).split('\n').slice(0, 20).join('\n'));
  }
}
console.log('ALL_OK=' + ok);
