// diag-node-procs.mjs
// 列出当前所有 node.exe 进程的 PID / 父进程 PID / 命令行。
// 用途：排查工作台 / Vite / Make 是否有残留 Node 进程、谁拉起的、在跑什么。
// 用法：node diag-node-procs.mjs
//
// 兼容性：wmic 在较新 Windows 已被移除，这里 wmic 优先、Get-CimInstance 兜底。
// 兜底通过临时 .ps1 文件执行，避免内联 PowerShell 的引号转义爆炸。

import { execSync, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// ---------- 方式一：wmic（老系统） ----------
function viaWmic() {
  return execSync(
    'wmic process where "name=\'node.exe\'" get ProcessId,ParentProcessId,CommandLine',
    { encoding: 'utf8', windowsHide: true }
  );
}

// ---------- 方式二：Get-CimInstance（新系统，走临时 .ps1） ----------
function viaCim() {
  const psContent = [
    "$ErrorActionPreference = 'Stop'",
    "Get-CimInstance Win32_Process -Filter \"name = 'node.exe'\" |",
    'Sort-Object ParentProcessId, ProcessId |',
    'ForEach-Object {',
    "  $cmd = $_.CommandLine",
    '  if ($cmd -and $cmd.Length -gt 200) { $cmd = $cmd.Substring(0, 200) + \"...\" }',
    '  if (-not $cmd) { $cmd = \"<无命令行>\" }',
    '  \"{0}`t{1}`t{2}\" -f $_.ProcessId, $_.ParentProcessId, $cmd',
    '}',
  ].join('\n');

  const psFile = path.join(os.tmpdir(), 'diag-node-procs-' + process.pid + '.ps1');
  fs.writeFileSync(psFile, psContent, 'utf8');
  try {
    return execFileSync('powershell', [
      '-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', psFile,
    ], { encoding: 'utf8', windowsHide: true, maxBuffer: 1024 * 1024 * 10 });
  } finally {
    try { fs.unlinkSync(psFile); } catch (_) {}
  }
}

// ---------- 主流程 ----------
let text = '';
try {
  text = viaWmic();
} catch {
  try {
    text = viaCim();
  } catch (e) {
    console.error('无法获取 node 进程列表（wmic 与 Get-CimInstance 均失败）：', e.message);
    process.exit(1);
  }
}

console.log('PID\tPPID\tCommandLine');
for (const line of text.split(/\r?\n/)) {
  const t = line.trim();
  if (!t) continue;
  // wmic / CIM 输出：进程ID、父进程ID、命令行（命令行可能含空格）
  const m = t.match(/^(\d+)\s+(\d+)\s+(.*)$/);
  if (m) {
    console.log(`${m[1]}\t${m[2]}\t${m[3]}`);
  } else if (/^\d+\s+\d+$/.test(t)) {
    console.log(`${t}\t<无命令行>`);
  }
}
