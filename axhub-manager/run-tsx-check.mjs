// 临时：用 typescript transpileModule 验证三个 PrototypeLayout.tsx 的 JSX 语法（用完即删）
import { createRequire } from 'node:module';
import fs from 'node:fs';

const require = createRequire('C:/Users/游翔/Documents/AI work/Axhub/01-项目/学校卫生/');
const ts = require('typescript');

const files = [
  '01-项目/学校卫生/src/common/PrototypeLayout.tsx',
  '01-项目/Digital Twin/数字孪生/src/common/PrototypeLayout.tsx',
  '02-模板/_project-template/src/common/PrototypeLayout.tsx',
];
const base = 'C:/Users/游翔/Documents/AI work/Axhub';

let ok = true;
for (const f of files) {
  const src = fs.readFileSync(base + '/' + f, 'utf8');
  const out = ts.transpileModule(src, {
    compilerOptions: {
      jsx: 'react',
      jsxFactory: 'React.createElement',
      jsxFragmentFactory: 'React.Fragment',
      target: ts.ScriptTarget.ES2019,
      module: ts.ModuleKind.ESNext,
    },
    fileName: f,
    reportDiagnostics: true,
  });
  const errs = (out.diagnostics || []).filter((d) => d.category === ts.DiagnosticCategory.Error);
  if (errs.length === 0) {
    console.log('OK   ' + f + ' (out bytes=' + out.outputText.length + ')');
  } else {
    ok = false;
    console.log('FAIL ' + f);
    for (const d of errs) {
      const msg = ts.flattenDiagnosticMessageText(d.messageText, '\n');
      const pos = d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start) : null;
      console.log('  ' + (pos ? (pos.line + 1) + ':' + (pos.character + 1) + ' ' : '') + msg);
    }
  }
}
console.log('ALL_OK=' + ok);
