// 临时：启动学校卫生 vite dev server 验证 Xbox 风格（用完即删）
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const cwd = 'C:/Users/游翔/Documents/AI work/Axhub/01-项目/学校卫生';
const logFile = 'C:/Users/游翔/Documents/AI work/Axhub/axhub-manager/vite-test.log';
const out = fs.openSync(logFile, 'a');
const p = spawn('npm.cmd', ['run', 'dev'], { cwd, shell: true, stdio: ['ignore', out, out] });
console.log('VITE_PID=' + p.pid);
p.on('exit', () => console.log('VITE_EXIT'));
