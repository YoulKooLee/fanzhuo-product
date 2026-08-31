import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

// 用 8.3 短路径解析，绕开 PowerShell 中文路径乱码
function shortPath(p) {
  return String(execSync(`cmd /c for %A in ("${p}") do @echo %~sA`, { windowsHide: true }))
    .trim().split('\n').pop().trim();
}

const base = 'C:\\Users\\游翔\\Desktop\\泛卓办公\\06 常州建科院\\接口文档\\结构监测';
const out = 'C:\\Users\\游翔\\Documents\\AI work\\Axhub\\08-文档\\结构监测-接口文档提取';
mkdirSync(out, { recursive: true });

const baseS = shortPath(base);
const outS = shortPath(out);

const files = [
  { src: `${baseS}\\物联网平台原始数据对接文档.docx`, name: '物联网平台原始数据对接文档.md' },
  { src: `${baseS}\\设备信息接口文档.pdf`, name: '设备信息接口文档.md' },
];

for (const f of files) {
  try {
    const cmd = `pandoc "${f.src}" -o "${outS}\\${f.name}"`;
    execSync(cmd, { stdio: 'inherit', windowsHide: true });
    console.log('OK:', f.name);
  } catch (e) {
    console.error('FAIL:', f.name, e.message);
  }
}
console.log('DONE');
