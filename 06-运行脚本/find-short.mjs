import { execSync } from 'node:child_process';
import { homedir } from 'node:os';

// 自动探测真实短路径
function shortOf(longPath) {
  return String(execSync(`cmd /c for %A in ("${longPath}") do @echo %~sA`, { windowsHide: true, shell: true }))
    .trim().split('\n').pop().trim();
}

const long = `${homedir()}\\Documents\\AI work\\Axhub\\06-运行脚本\\run-pandoc.mjs`;
console.log('LONG=', long);
console.log('SHORT=', shortOf(long));
