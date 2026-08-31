import { execSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';

// 直接用字面量中文路径（node 进程内处理，不依赖 shell 传参）
const base = `${homedir()}\\Desktop\\泛卓办公\\06 常州建科院\\接口文档\\结构监测`;
const out = `${homedir()}\\Documents\\AI work\\Axhub\\08-文档\\结构监测-接口文档提取`;
mkdirSync(out, { recursive: true });

const files = [
  { src: `${base}\\物联网平台原始数据对接文档.docx`, name: '物联网平台原始数据对接文档.md' },
  { src: `${base}\\设备信息接口文档.pdf`, name: '设备信息接口文档.md' },
];

for (const f of files) {
  try {
    const cmd = `pandoc "${f.src}" -o "${out}\\${f.name}"`;
    console.log('RUN:', cmd);
    execSync(cmd, { stdio: 'inherit', windowsHide: true, shell: true });
    console.log('OK:', f.name);
  } catch (e) {
    console.error('FAIL:', f.name, e.message);
  }
}
console.log('DONE');
