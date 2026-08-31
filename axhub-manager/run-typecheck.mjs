// 临时：对学校卫生项目跑 typecheck，过滤 PrototypeLayout 相关错误（用完即删）
import { spawn } from 'node:child_process';
const cwd = 'C:/Users/游翔/Documents/AI work/Axhub/01-项目/学校卫生';
const p = spawn('npm.cmd', ['run', 'typecheck'], { cwd, shell: true });
let out = '';
p.stdout.on('data', (d) => (out += d));
p.stderr.on('data', (d) => (out += d));
p.on('close', (code) => {
  const lines = out.split('\n').filter((l) => l.includes('PrototypeLayout'));
  console.log('=== PrototypeLayout-related ===');
  console.log(lines.join('\n') || '(none)');
  console.log('EXIT=' + code);
});
