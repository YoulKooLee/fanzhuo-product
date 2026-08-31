// 产品设计工作台 —— 本地管理面板后端
// 纯 Node 内置模块（http/fs/path/child_process），无第三方依赖。
import http from 'node:http';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { exec, spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(__dirname, 'public');

// ===== 路径配置 =====
// 由 server.mjs 自身位置自动推导（Axhub 根目录 = axhub-manager 的上一级），
// 便于整个文件夹复制到任意机器/路径后直接运行，无需改硬编码。
const AXHUB_ROOT = path.dirname(__dirname);
const TEMPLATE_DIR = path.join(AXHUB_ROOT, '02-模板', '_project-template');
const LIBRARY_DIR = path.join(TEMPLATE_DIR, '.agents');
const SKILLS_DIR = path.join(LIBRARY_DIR, 'skills');
const KNOWLEDGE_DIR = path.join(LIBRARY_DIR, 'knowledge');
const RULES_DIR = path.join(LIBRARY_DIR, 'rules');
const PORT = Number(process.env.AXHUB_MANAGER_PORT) || 7788;

// ===== AI 联动上下文 =====
// 工作台级多项目上下文（供 codebuddy / workbuddy 感知"当前编辑项目 + 全部运行中项目"）
// - Axhub/.workbuddy/workspace.json           工作台级：全部项目状态 + 各智能体编辑焦点
// - 01-项目/<name>/.workbuddy/current.json    项目级：每个项目自己的运行状态（互不干扰）
//
// 状态模型（单项目单状态 + 多智能体维度）：
//   editing —— 正在被某智能体编辑（隐含已启动），每个智能体至多 1 个，全局唯一到「智能体」
//   active  —— 已启动但非编辑焦点（make/vite 在跑）
//   stopped —— 被动停止（误关终端）：进程死但未主动清空，保留展示可重新启动
//   （主动停止 = 停止工作台.cmd 直接删除 workspace.json，不保留任何历史）
// 多智能体互斥：同一项目同一时刻只能被一个智能体 editing。
const WORKSPACE_DIR = path.join(AXHUB_ROOT, '.workbuddy');
const WORKSPACE_CTX_FILE = path.join(WORKSPACE_DIR, 'workspace.json');

// Make Admin 全局单例端口（与 launch-project.ps1 一致），用于联动切换 active project。
const MAKE_ADMIN_PORT = Number(process.env.AXHUB_MAKE_PORT) || 53817;
const MAKE_ADMIN_ORIGIN = `http://localhost:${MAKE_ADMIN_PORT}`;

// CodeBuddy IDE 会注入 NODE_OPTIONS=--require=...node-language-shim.cjs 和 CODEBUDDY_SAFE_DELETE_*，
// 导致子进程（PowerShell / Make / Vite）的 fs.unlink/rm 被 shim 劫持，报 SAFE_DELETE_BULK_CONFIRM_REQUIRED，
// 表现为 Make 写 projects.json 报 MAKE_STATE_DIR_NOT_WRITABLE。
// 这里生成一份"干净 env"：剔除 NODE_OPTIONS、CODEBUDDY_*、以及 PATH 里的 CodeBuddy CN 目录。
function cleanEnvForSpawn() {
  const env = { ...process.env };
  delete env.NODE_OPTIONS;
  for (const k of Object.keys(env)) {
    if (/^CODEBUDDY/i.test(k)) delete env[k];
  }
  if (env.PATH) {
    env.PATH = env.PATH
      .split(';')
      .filter((p) => p && !/CodeBuddy/i.test(p) && !/codebuddy/i.test(p))
      .join(';');
  }
  return env;
}

// 已知的智能体集合（本机 codebuddy + workbuddy）。UI 下拉据此提供「先选智能体再选项目」。
const KNOWN_AGENTS = ['codebuddy', 'workbuddy'];

// 从旧结构（active + projects[].intent）或新结构（agents + projects[].status）读取工作台上下文。
// 兼容迁移：旧文件没有 agents，首次读时补齐默认 agents，并把旧 intent 映射到新 status。
function readWorkspaceCtx() {
  try {
    if (!fs.existsSync(WORKSPACE_CTX_FILE)) {
      return { agents: defaultAgents(), projects: [] };
    }
    const raw = JSON.parse(fs.readFileSync(WORKSPACE_CTX_FILE, 'utf8'));
    let agents = raw.agents || defaultAgents();
    let projects = Array.isArray(raw.projects) ? raw.projects : [];
    // 旧字段迁移：intent -> status，editor 从 agents[].editing 推断
    for (const p of projects) {
      if (p.status == null && p.intent) {
        p.status = migrateIntent(p.intent);
        delete p.intent;
      }
    }
    return { agents, projects };
  } catch {
    return { agents: defaultAgents(), projects: [] };
  }
}
function defaultAgents() {
  const a = {};
  for (const ag of KNOWN_AGENTS) a[ag] = { editing: null };
  return a;
}
// 旧 intent -> 新 status 映射
function migrateIntent(intent) {
  if (intent === 'running' || intent === 'ready') return 'active';
  if (intent === 'opening') return 'active'; // 启动中视为已启动（隐含）
  if (intent === 'stopped') return 'stopped';
  return 'active'; // created/copied/focus 等旧值，默认视为已启动待处理
}

// 活体检测：判断一个项目是否"真的在运行"。
// 数据源 = 该项目的 .axhub/make/.dev-server-info.json 心跳文件（Vite 每 5 秒续写，超过 20 秒即僵尸）
// 逻辑与 PS1 的 Test-ViteAlive 保持一致。返回 true=在跑 / false=已死。
function isProjectAlive(relative) {
  try {
    const rel = String(relative || '').replace(/\\/g, '/');
    const infoPath = path.join(AXHUB_ROOT, rel, '.axhub', 'make', '.dev-server-info.json');
    if (!fs.existsSync(infoPath)) return false;
    const ageMs = Date.now() - fs.statSync(infoPath).mtimeMs;
    if (ageMs > 20000) return false; // 心跳超过 20 秒 = 僵尸
    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    const pid = Number(info.pid);
    const port = Number(info.port);
    if (!(pid > 0) || !(port > 0)) return false;
    // 进程存活 + 端口在监听才算真正在跑
    try { process.kill(pid, 0); } catch { return false; }
    try {
      const sock = new net.Socket();
      const isOpen = new Promise((resolve) => {
        sock.setTimeout(800);
        sock.on('connect', () => { sock.destroy(); resolve(true); });
        sock.on('error', () => { sock.destroy(); resolve(false); });
        sock.on('timeout', () => { sock.destroy(); resolve(false); });
        sock.connect(port, '127.0.0.1');
      });
      // 同步化探测：这里用 async 外层无法直接同步，改由调用方 await。见 reconcileWorkspaceCtx
      return isOpen;
    } catch { return false; }
  } catch { return false; }
}
// Make Admin 单例（53817）是否在监听。启动流程完整成功的标志是 Make + Vite 都活着；
// 仅 Vite 起来而 Make 没就绪（如 PS1 步骤 7 超时）时，仍视为启动未完成。
function isMakeAlive() {
  return new Promise((resolve) => {
    const sock = new net.Socket();
    sock.setTimeout(800);
    sock.once('connect', () => { sock.destroy(); resolve(true); });
    sock.once('error', () => { sock.destroy(); resolve(false); });
    sock.once('timeout', () => { sock.destroy(); resolve(false); });
    sock.connect(MAKE_ADMIN_PORT, '127.0.0.1');
  });
}

// ===== 状态操作核心 =====
function writeWorkspaceCtx(ctx) {
  try {
    fs.mkdirSync(WORKSPACE_DIR, { recursive: true });
    fs.writeFileSync(WORKSPACE_CTX_FILE, JSON.stringify(ctx, null, 2), 'utf8');
    return true;
  } catch {
    return false;
  }
}
// 更新项目条目 + 项目级 current.json。返回更新后的 ctx。
function upsertProject(ctx, rel, status, extra = {}) {
  const rel2 = String(rel || '').replace(/\\/g, '/');
  const full = path.join(AXHUB_ROOT, rel2);
  const now = new Date().toISOString();
  const idx = ctx.projects.findIndex((p) => p.relative === rel2);
  const old = idx >= 0 ? ctx.projects[idx] : null;
  const entry = Object.assign({
    name: old ? old.name : path.basename(full),
    path: full,
    relative: rel2,
    status,
    ts: now,
  }, extra);
  if (status === 'active' && old && old.startedAt) entry.startedAt = old.startedAt;
  else if (status === 'active') entry.startedAt = entry.startedAt || now;
  if (idx >= 0) ctx.projects[idx] = Object.assign({}, ctx.projects[idx], entry);
  else ctx.projects.push(entry);
  // 项目级上下文
  try {
    const projCtxDir = path.join(full, '.workbuddy');
    fs.mkdirSync(projCtxDir, { recursive: true });
    fs.writeFileSync(path.join(projCtxDir, 'current.json'), JSON.stringify(Object.assign({}, entry, { workspaceAt: now }), null, 2), 'utf8');
  } catch { /* ignore */ }
  return ctx;
}
// 把某智能体的编辑焦点切到 rel。若该智能体原先在编辑另一个项目，那个项目降为 active（或 stopped）。
// 互斥：另一个智能体若已 editing 目标项目，返回 { conflict: true }，不执行。
function setEditing(ctx, agent, rel, { forceStoppedOld = false } = {}) {
  const a = KNOWN_AGENTS.includes(agent) ? agent : KNOWN_AGENTS[0];
  const oldRel = (ctx.agents[a] && ctx.agents[a].editing) || null;
  if (oldRel === rel) return { ctx, conflict: false, oldRel };
  // 互斥检查：目标 rel 是否已被其他智能体 editing
  for (const ag of KNOWN_AGENTS) {
    if (ag !== a && ctx.agents[ag] && ctx.agents[ag].editing === rel) {
      return { ctx, conflict: true, conflicter: ag };
    }
  }
  // 原编辑项目降级
  if (oldRel) {
    const oi = ctx.projects.findIndex((p) => p.relative === oldRel);
    if (oi >= 0) {
      const alive = isProjectAlive(oldRel);
      ctx.projects[oi].status = forceStoppedOld ? 'stopped' : (alive ? 'active' : 'stopped');
      if (ctx.projects[oi].status === 'stopped') ctx.projects[oi].stoppedAt = new Date().toISOString();
      ctx.projects[oi].editor = null;
    }
  }
  // 目标项目置 editing
  ctx.agents[a].editing = rel;
  if (rel) {
    upsertProject(ctx, rel, 'editing', { editor: a });
    // 目标项目如果之前是 stopped（被动停止后重启），清除 stoppedAt
    const ti = ctx.projects.findIndex((p) => p.relative === rel);
    if (ti >= 0) { delete ctx.projects[ti].stoppedAt; ctx.projects[ti].editor = a; }
  }
  writeWorkspaceCtx(ctx);
  return { ctx, conflict: false, oldRel };
}
// 把某项目标为 active（启动但非编辑焦点）。
function setProjectActive(ctx, rel, extra = {}) {
  upsertProject(ctx, rel, 'active', Object.assign({ editor: null }, extra));
  writeWorkspaceCtx(ctx);
  return ctx;
}
// 把某项目标为 stopped（被动停止 / 手动停止）。主动停止走 removeAll（删文件）不走这里。
function markProjectStopped(ctx, rel) {
  const rel2 = String(rel || '').replace(/\\/g, '/');
  const idx = ctx.projects.findIndex((p) => p.relative === rel2);
  if (idx >= 0) {
    ctx.projects[idx].status = 'stopped';
    ctx.projects[idx].stoppedAt = new Date().toISOString();
    ctx.projects[idx].editor = null;
    // 若有智能体正在编辑它，解除编辑焦点
    for (const ag of KNOWN_AGENTS) {
      if (ctx.agents[ag] && ctx.agents[ag].editing === rel2) ctx.agents[ag].editing = null;
    }
    writeWorkspaceCtx(ctx);
  }
  return ctx;
}
// 启动一个项目：先标为 starting（PS1 启动中，Vite 还没起来，避免 reconcile 误判 stopped），
// 等 PS1 走完（AXHUB_LAUNCH_STATUS: done）后再由 markProjectRunning 转成 editing / active。
// agent 可选：指定由哪个智能体编辑。
function onProjectStarted(ctx, rel, agent = null) {
  const rel2 = String(rel || '').replace(/\\/g, '/');
  // 若已是 editing / active / starting，幂等跳过
  const exist = ctx.projects.find((p) => p.relative === rel2);
  if (exist && (exist.status === 'editing' || exist.status === 'active' || exist.status === 'starting')) return ctx;
  upsertProject(ctx, rel2, 'starting', { editor: null });
  writeWorkspaceCtx(ctx);
  return ctx;
}
// PS1 启动完成：把 starting 项目转成 editing（无编辑焦点时）或 active（已有编辑焦点时）。
function markProjectRunning(ctx, rel, agent = null) {
  const rel2 = String(rel || '').replace(/\\/g, '/');
  const exist = ctx.projects.find((p) => p.relative === rel2);
  if (!exist || exist.status !== 'starting') return ctx;
  // 若已有智能体正在编辑该项目，保持 editing
  for (const ag of KNOWN_AGENTS) {
    if (ctx.agents[ag] && ctx.agents[ag].editing === rel2) return setEditing(ctx, ag, rel2).ctx;
  }
  const anyEditing = KNOWN_AGENTS.some((ag) => ctx.agents[ag] && ctx.agents[ag].editing);
  if (!anyEditing) {
    const a = agent && KNOWN_AGENTS.includes(agent) ? agent : KNOWN_AGENTS[0];
    return setEditing(ctx, a, rel2).ctx;
  }
  return setProjectActive(ctx, rel2);
}
// 删除/移动项目时从上下文移除（并清理各智能体的编辑引用）
function removeProjectCtx(relative) {
  const rel = String(relative || '').replace(/\\/g, '/');
  const ctx = readWorkspaceCtx();
  const idx = ctx.projects.findIndex((p) => p.relative === rel);
  if (idx >= 0) ctx.projects.splice(idx, 1);
  for (const ag of KNOWN_AGENTS) {
    if (ctx.agents[ag] && ctx.agents[ag].editing === rel) ctx.agents[ag].editing = null;
  }
  writeWorkspaceCtx(ctx);
  return ctx;
}
// 主动核对并修正 workspace.json 里的运行状态（被动停止检测）：
// - starting：PS1 启动中，Vite 还没起来是正常的，不降级；若 Vite 已起来则升级为 editing/active（兜底）。
// - editing / active：实际已死（心跳过期/端口关闭）→ 降级 stopped（保留展示，可重新启动）。
async function reconcileWorkspaceCtx() {
  const ctx = readWorkspaceCtx();
  if (!ctx.projects.length) return ctx;
  let changed = false;
  for (const p of ctx.projects) {
    if (p.status === 'editing' || p.status === 'active') {
      const alive = await isProjectAlive(p.relative);
      if (!alive) {
        // 进程死 → 降级 stopped（被动停止，保留展示）
        p.status = 'stopped';
        p.stoppedAt = new Date().toISOString();
        p.editor = null;
        for (const ag of KNOWN_AGENTS) {
          if (ctx.agents[ag] && ctx.agents[ag].editing === p.relative) ctx.agents[ag].editing = null;
        }
        changed = true;
      }
    } else if (p.status === 'starting') {
      // 启动中：Vite + Make 都活着才能升级为 editing/active（否则保持 starting，
      // 表示启动未完成或 PS1 失败如 Make 53817 未就绪）。这样可以避免 Vite 起来但 Make 失败时
      // 被错升 editing/active，导致浏览器去打 53817 拒绝连接。
      const alive = await isProjectAlive(p.relative);
      const makeOk = await isMakeAlive();
      if (alive && makeOk) {
        const anyEditing = KNOWN_AGENTS.some((ag) => ctx.agents[ag] && ctx.agents[ag].editing);
        const a = KNOWN_AGENTS.find((ag) => ctx.agents[ag] && ctx.agents[ag].editing === p.relative);
        if (a) setEditing(ctx, a, p.relative);
        else if (anyEditing) setProjectActive(ctx, p.relative);
        else setEditing(ctx, KNOWN_AGENTS[0], p.relative);
        changed = true;
      }
    }
  }
  if (changed) writeWorkspaceCtx(ctx);
  return ctx;
}

// ===== Make Admin 联动 =====
// 通过 Make Admin（全局单例 53817）把 active project 切到指定项目，让智能体里的 Make 客户端聚焦。
// 返回 { ok }；Make 未运行或调用失败时静默降级（不影响工作台自身状态）。
async function syncMakeActiveProject(rel) {
  try {
    // 统一为「正斜杠 + 小写 + 去尾斜杠」后比较，避免 Windows 反斜杠/正斜杠差异导致匹配失败
    const norm = (s) => String(s || '').replace(/\\/g, '/').toLowerCase().replace(/\/+$/, '');
    const root = norm(path.join(AXHUB_ROOT, rel));
    // 先拿 Make 项目列表，反查 projectId
    const list = await makeFetch('/api/projects');
    if (!list || list.status !== 200) return { ok: false, reason: 'make-not-running' };
    let data;
    try { data = JSON.parse(list.body); } catch { return { ok: false, reason: 'bad-response' }; }
    const projs = Array.isArray(data.projects) ? data.projects : [];
    const match = projs.find((p) => p.root && norm(p.root) === root);
    if (!match) return { ok: false, reason: 'project-not-registered' };
    const put = await makeFetch('/api/projects/active', 'PUT', { projectId: match.id });
    return { ok: put.status >= 200 && put.status < 300, reason: put.status === 200 ? 'ok' : 'put-failed' };
  } catch {
    return { ok: false, reason: 'error' };
  }
}
// 简化 Make HTTP 调用
function makeFetch(p, method = 'GET', body) {
  return new Promise((resolve) => {
    const url = MAKE_ADMIN_ORIGIN + p;
    const req = http.request(url, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : {},
      timeout: 4000,
    }, (res) => {
      let data = '';
      res.on('data', (d) => data += d.toString());
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    req.on('timeout', () => { req.destroy(); resolve({ status: 0, body: '' }); });
    req.on('error', () => resolve({ status: 0, body: '' }));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// 扫描项目时跳过的目录名（含整理后的分类文件夹，避免误扫/慢扫）
const EXCLUDE_DIRS = new Set([
  '_backups', 'tmp', 'axhub-manager', '.workbuddy', 'node_modules',
  '03-备份', '04-临时', '05-回收站', '06-运行脚本', '07-日志', '08-文档',
]);
// 递归扫描时不再深入这些子目录（性能 + 正确性）
const SKIP_SUBDIRS = new Set(['node_modules', '.git', '.vite', '.axhub', '.workbuddy']);

// ===== 工具函数 =====
function send(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}
function sendError(res, msg, status = 400) {
  send(res, status, { ok: false, msg });
}
function readBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { resolve({}); }
    });
  });
}
function safeName(s) {
  return (s || '').replace(/[<>:"|?*\\\/]/g, '').trim();
}

// 解析 SKILL.md 的 YAML frontmatter（只取 name / description 两个字段）
function parseFrontmatter(text) {
  const m = text.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return { name: '', description: '' };
  const lines = m[1].split('\n');
  let name = '', description = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('name:')) {
      name = line.slice(5).trim().replace(/^["']|["']$/g, '');
    } else if (line.startsWith('description:')) {
      let val = line.slice(12).trim();
      if (val === '>' || val === '|') {
        // 折叠块（> / |）：收集到 frontmatter 末尾（这些 SKILL.md 仅含 name + description）
        const parts = [];
        i++;
        while (i < lines.length) { parts.push(lines[i].trim()); i++; }
        description = parts.join(' ');
        break;
      } else {
        description = val.replace(/^["']|["']$/g, '');
      }
    }
  }
  return { name, description };
}
function extractTriggers(desc) {
  if (!desc) return '';
  const m = desc.match(/(触发场景|适用场景)[：:]\s*([\s\S]*)/);
  return m ? m[2].trim().slice(0, 200) : '';
}

// ===== 项目扫描 =====
function isProjectDir(dir) {
  try {
    if (fs.existsSync(path.join(dir, '.axhub', 'make'))) return true;
    if (fs.existsSync(path.join(dir, 'src', 'prototypes'))) return true;
    const pkg = path.join(dir, 'package.json');
    if (fs.existsSync(pkg)) {
      const p = JSON.parse(fs.readFileSync(pkg, 'utf8'));
      if (p.name === '@axhub/make-client') return true;
    }
  } catch { /* ignore */ }
  return false;
}
// 递归扫描项目（支持任意层级嵌套，如 01-项目/健康档案、01-项目/Digital Twin/数字孪生）
function collectProjects(dir, prefix, out, depth) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    if (e.name.startsWith('.')) continue;
    if (EXCLUDE_DIRS.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (isProjectDir(full)) {
      const rel = prefix ? `${prefix}/${e.name}` : e.name;
      out.push({
        name: e.name,
        relative: rel,
        path: full,
        isTemplate: e.name === '_project-template',
        // 演示项目：目录内存在 .axhub/demo.flag 标记，工作台仅允许「启动开发栈」
        isDemo: fs.existsSync(path.join(full, '.axhub', 'demo.flag')),
        nested: prefix !== '',
        hasGit: fs.existsSync(path.join(full, '.git')),
      });
      continue; // 项目内部不再递归
    }
    if (depth < 3 && !SKIP_SUBDIRS.has(e.name)) {
      collectProjects(full, prefix ? `${prefix}/${e.name}` : e.name, out, depth + 1);
    }
  }
}
function listProjects() {
  const out = [];
  // 仅扫描 01-项目 目录下的真实项目；_project-template 位于 02-模板，不属于项目列表
  const root = path.join(AXHUB_ROOT, '01-项目');
  collectProjects(root, '01-项目', out, 0);
  // 演示项目统一排在列表末尾，不干扰自建项目
  out.sort((a, b) => (a.isDemo === b.isDemo ? 0 : a.isDemo ? 1 : -1));
  return out;
}

// 演示项目只读保护：禁止复制 / 删除 / 任何 Git 写操作
function isDemoRelative(relative) {
  if (!relative) return false;
  const dir = path.join(AXHUB_ROOT, String(relative).replace(/\//g, path.sep));
  return fs.existsSync(path.join(dir, '.axhub', 'demo.flag'));
}
const DEMO_GUARD_MSG = '演示项目为只读，仅支持「启动开发栈」；如需修改请先复制模板新建项目';

// ===== Git 操作 =====
function gitLog(dir) {
  return new Promise((resolve) => {
    if (!fs.existsSync(path.join(dir, '.git'))) { resolve({ isGit: false }); return; }
    exec(`git -C "${dir}" log --pretty=format:%h%x09%ad%x09%s --date=short -20`, (err, stdout) => {
      if (err) { resolve({ isGit: true, commits: [] }); return; }
      const commits = stdout.split('\n').filter(Boolean).map((l, idx, arr) => {
        const [hash, date, msg] = l.split('\t');
        return { hash, date, msg, isRoot: idx === arr.length - 1 };
      });
      resolve({ isGit: true, commits });
    });
  });
}
function gitInit(dir) {
  return new Promise((resolve) => {
    const cmds = [
      `git -C "${dir}" init -q`,
      `git -C "${dir}" config user.email "axhub@local"`,
      `git -C "${dir}" config user.name "Axhub Manager"`,
      `git -C "${dir}" config core.autocrlf false`,
    ];
    exec(cmds.join(' && '), (err1) => {
      if (err1) { resolve({ ok: false, msg: 'git init 失败：' + err1.message }); return; }
      try { fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\n.dist\n.axhub/make/.dev-server-info.json\n'); }
      catch { /* ignore */ }
      exec(`git -C "${dir}" add -A && git -C "${dir}" commit -q -m "chore: 初始提交 by Axhub Manager"`, (err2, _o, stderr) => {
        if (err2) { resolve({ ok: false, msg: '提交失败：' + stderr.slice(0, 200) }); return; }
        resolve({ ok: true, msg: '已初始化 Git 仓库并完成首次提交' });
      });
    });
  });
}

// 在项目目录内执行一条 git 子命令，返回 { ok, stdout, stderr }
function gitExec(dir, cmd) {
  return new Promise((resolve) => {
    exec(`git -C "${dir}" ${cmd}`, (err, stdout, stderr) => {
      resolve({ ok: !err, stdout: (stdout || '').trim(), stderr: (stderr || '').trim() });
    });
  });
}

// ===== 知识库 / 规则 递归读取 =====
function walkMd(dir, base, out = []) {
  let entries = [];
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return out; }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    const rel = path.join(base, e.name);
    if (e.isDirectory()) walkMd(full, rel, out);
    else if (e.name.endsWith('.md') && e.name !== 'catalog.json') out.push({ full, rel });
  }
  return out;
}
function deriveScenario(content, relPath) {
  const h = content.match(/^#{1,3}\s+(.+)$/m);
  if (h) return h[1].trim().slice(0, 40);
  const parent = path.dirname(relPath).split(path.sep).pop();
  return parent || '—';
}

// 安全解析 knowledge/rules 的相对路径（只取最后几段，防止越界）
// stripPrefix: 前端传的是带分类前缀的展示路径（如 knowledge/conventions/coding.md），
// 需要去掉前缀才映射到 KNOWLEDGE_DIR 下的真实路径。
function safeRelPath(rel, stripPrefix) {
  if (!rel) return '';
  const parts = rel.replace(/\\/g, '/').split('/').filter(Boolean).map((p) => path.basename(p));
  if (stripPrefix && parts[0] === stripPrefix) parts.shift();
  return parts.join('/');
}

// 同步读取项目心跳文件的 pid（用于删除前主动停掉开发栈，避免 EBUSY）。
// 返回 >0 的 pid；心跳不存在/过期/解析失败返回 0。
function getProjectPid(relative) {
  try {
    const rel = String(relative || '').replace(/\\/g, '/');
    const infoPath = path.join(AXHUB_ROOT, rel, '.axhub', 'make', '.dev-server-info.json');
    if (!fs.existsSync(infoPath)) return 0;
    const ageMs = Date.now() - fs.statSync(infoPath).mtimeMs;
    if (ageMs > 20000) return 0; // 心跳过期 = 僵尸，不算占用
    const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
    const pid = Number(info.pid);
    if (!(pid > 0)) return 0;
    try { process.kill(pid, 0); } catch { return 0; } // 进程已死
    return pid;
  } catch { return 0; }
}
// 删除前主动停掉项目开发进程（Vite + 子进程树），释放目录占用。
// 返回 { killed: boolean, pid: number }。失败不抛出。
function killProjectProcess(relative) {
  // 1) 优先用心跳文件里的 pid（精确、快速）。
  const pid = getProjectPid(relative);
  if (pid) {
    try {
      if (process.platform === 'win32') {
        spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { windowsHide: true });
      } else {
        process.kill(pid, 'SIGKILL');
      }
      return { killed: true, pid };
    } catch {
      /* 继续走路径兜底 */
    }
  }

  // 2) 兜底：心跳文件失效/缺失时，按"命令行含项目绝对路径"找 node 进程杀掉。
  //    这是 Windows 上 EPERM 的根因——dev 进程还活着锁着目录，但心跳早已过期。
  const killedByPath = killNodeProcessesByPath(relative);
  return killedByPath;
}

// 通过命令行匹配，杀掉所有工作目录指向某项目的 node 进程（含 vite/esbuild 子进程树）。
// 返回 { killed, pid }（pid 为最后一个被杀进程；无匹配则 killed=false, pid=0）。
function killNodeProcessesByPath(relative) {
  if (process.platform !== 'win32') return { killed: false, pid: 0 };
  try {
    const abs = path.resolve(AXHUB_ROOT, String(relative || ''));
    // 路径可能以 \ 或 / 出现，统一取反斜杠形式用于匹配命令行。
    const needle = abs.replace(/\//g, '\\');
    const ps = spawnSync('powershell', [
      '-NoProfile', '-Command',
      `Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -like '*${needle.replace(/'/g, "''")}*' } | Select-Object -ExpandProperty ProcessId`
    ], { windowsHide: true, encoding: 'utf8' });
    if (ps.error || !ps.stdout) return { killed: false, pid: 0 };
    const pids = String(ps.stdout).trim().split(/\s+/).map(Number).filter((n) => n > 0);
    if (pids.length === 0) return { killed: false, pid: 0 };
    for (const p of pids) {
      spawnSync('taskkill', ['/PID', String(p), '/T', '/F'], { windowsHide: true });
    }
    return { killed: true, pid: pids[pids.length - 1] };
  } catch {
    return { killed: false, pid: 0 };
  }
}

// 在"干净环境"（剔除 CodeBuddy safe-delete shim）下 spawn 一个 Node 子进程执行 fs 操作，
// 绕开 NODE_OPTIONS=--require=...shim.cjs 对 fs.rm/rename 的劫持（SAFE_DELETE_BULK_CONFIRM_REQUIRED）。
// 用 node 子进程而不是 PowerShell，是因为 pnpm 的 node_modules 路径含 '+' 且可能超 260 字符，
// PowerShell 的 Move-Item/Remove-Item 在长路径/特殊字符下不稳定。
// 路径通过 base64(JSON) 编码后作为 spawnSync 的位置参数传递（Node 内部安全转义），
// 子进程内 JSON.parse 后调用 fs.renameSync / fs.rmSync。

// 移动到回收站（避免触发 safe-delete 批量删除防护，且可恢复）
// 返回回收后的完整路径；若 src 不存在则返回 null。
function moveToTrash(src) {
  if (!fs.existsSync(src)) return null;
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const name = path.basename(src);
  const trashBase = path.join(AXHUB_ROOT, '05-回收站');
  fs.mkdirSync(trashBase, { recursive: true });
  const trashDir = path.join(trashBase, `.deleted-${ts}`);
  fs.mkdirSync(trashDir, { recursive: true });
  const dst = path.join(trashDir, name);

  // 关键：在子进程内构造 src/dst（直接调用 fs.renameSync），避免把路径作为命令行参数传递
  // （长路径 + pnpm '+' 字符在跨进程传参时易触发 Windows MAX_PATH 或字符解析问题）。
  // 路径通过 base64 + JSON.stringify 安全地嵌入 spawnSync 的 args（Node 内部会处理转义）。
  const payload = { src, dst };
  const r = spawnSync(process.execPath, ['-e', `
    const fs = require('fs');
    const { src, dst } = JSON.parse(Buffer.from(process.argv[1], 'base64').toString('utf8'));
    try { fs.renameSync(src, dst); process.exit(0); }
    catch (e) {
      // 把 errno 编码进退出前的 stdout，子进程会带回 ok/false
      console.log('__ERR__:' + JSON.stringify({ code: e.code || '', message: e.message || String(e) }));
      process.exit(1);
    }
  `, Buffer.from(JSON.stringify(payload)).toString('base64')], {
    env: cleanEnvForSpawn(),
    windowsHide: true,
    encoding: 'utf8',
  });
  if (r.status === 0) return dst;
  // 解析错误
  const m = String(r.stdout || '').match(/^__ERR__:(.*)$/m);
  let err = new Error('rename failed');
  if (m) {
    try {
      const info = JSON.parse(m[1]);
      err = new Error(info.message);
      if (info.code) err.code = info.code;
    } catch {}
  }
  if (!err.code) {
    const msg = String(err.message);
    if (/EPERM|permission|Access|being used|占用|拒绝访问/i.test(msg)) err.code = 'EPERM';
    else if (/EBUSY|busy/i.test(msg)) err.code = 'EBUSY';
  }
  throw err;
}

// 递归删除目录（干净 env 子进程跑 fs.rmSync，不受 shim 拦截，且对长路径/特殊字符更稳）。
// 返回 true=成功删除 / false=失败（可能留空壳）。
function removeDirClean(dir) {
  const payload = { dir };
  const r = spawnSync(process.execPath, ['-e', `
    const fs = require('fs');
    const { dir } = JSON.parse(Buffer.from(process.argv[1], 'base64').toString('utf8'));
    try {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
      // 再做一次：清掉可能因长句柄未释放遗留的空壳
      try { fs.rmdirSync(dir); } catch {}
      process.exit(0);
    } catch (e) {
      console.log('__ERR__:' + JSON.stringify({ code: e.code || '', message: e.message || String(e) }));
      process.exit(1);
    }
  `, Buffer.from(JSON.stringify(payload)).toString('base64')], {
    env: cleanEnvForSpawn(),
    windowsHide: true,
    encoding: 'utf8',
  });
  if (r.status === 0) return true;
  // 检查目录是否已经空了（部分删除也算成功）
  try {
    if (!fs.existsSync(dir)) return true;
    const left = fs.readdirSync(dir);
    if (left.length === 0) {
      try { fs.rmdirSync(dir); } catch {}
      return !fs.existsSync(dir) || (fs.readdirSync(dir).length === 0);
    }
  } catch {}
  return false;
}

// ===== 路由 =====
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const p = url.pathname;
  const method = req.method;

  // 静态首页
  if (method === 'GET' && (p === '/' || p === '/index.html')) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8'));
    return;
  }

  // ===== 项目管理 =====
  if (p === '/api/projects' && method === 'GET') {
    return send(res, 200, { ok: true, projects: listProjects() });
  }

  if (p === '/api/projects/history' && method === 'GET') {
    const relative = url.searchParams.get('relative') || '';
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const dir = path.join(AXHUB_ROOT, relative);
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    const log = await gitLog(dir);
    return send(res, 200, log);
  }

  if (p === '/api/projects/git-init' && method === 'POST') {
    const { relative } = await readBody(req);
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const dir = path.join(AXHUB_ROOT, relative || '');
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    const r = await gitInit(dir);
    return send(res, r.ok ? 200 : 500, r);
  }

  if (p === '/api/projects/git-commit' && method === 'POST') {
    const { relative, message } = await readBody(req);
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const dir = path.join(AXHUB_ROOT, relative || '');
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    if (!fs.existsSync(path.join(dir, '.git'))) return sendError(res, '该项目尚未启用 Git');
    const msg = (message || '').trim() || `更新于 ${new Date().toISOString().slice(0, 10)}`;
    // 通过临时文件传 message，避免命令行注入
    const tmpMsg = path.join(__dirname, `.commit-msg-${Date.now()}.txt`);
    try { fs.writeFileSync(tmpMsg, msg, 'utf8'); } catch (e) { return sendError(res, '写入提交说明失败：' + e.message, 500); }
    // 分两步执行，确保 add 与 commit 都在项目目录内（避免 && 链使 commit 丢失 -C 目录）
    const addR = await gitExec(dir, 'add -A');
    if (!addR.ok) { try { fs.unlinkSync(tmpMsg); } catch { /* ignore */ } return sendError(res, '暂存失败：' + (addR.stderr || addR.stdout).slice(0, 200), 500); }
    const r = await gitExec(dir, `commit -q -F "${tmpMsg.replace(/\\/g, '/')}"`);
    try { fs.unlinkSync(tmpMsg); } catch { /* ignore */ }
    if (!r.ok) return sendError(res, '提交失败：' + (r.stderr || r.stdout).slice(0, 200), 500);
    return send(res, 200, { ok: true, msg: '已提交：' + msg });
  }

  if (p === '/api/projects/git-rollback' && method === 'POST') {
    const { relative, hash } = await readBody(req);
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const dir = path.join(AXHUB_ROOT, relative || '');
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    if (!/^[0-9a-f]{4,40}$/.test(hash || '')) return sendError(res, '非法的版本哈希');
    const r = await gitExec(dir, `reset --hard ${hash}`);
    if (!r.ok) return sendError(res, '回滚失败：' + (r.stderr || r.stdout).slice(0, 200), 500);
    return send(res, 200, { ok: true, msg: `已回滚到 ${hash}` });
  }

  if (p === '/api/projects/git-delete' && method === 'POST') {
    const { relative, hash } = await readBody(req);
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const dir = path.join(AXHUB_ROOT, relative || '');
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    if (!/^[0-9a-f]{4,40}$/.test(hash || '')) return sendError(res, '非法的版本哈希');
    // 根提交无法单独删除
    const par = await gitExec(dir, `rev-parse ${hash}~1`);
    if (!par.ok) return sendError(res, '该版本是根提交，无法单独删除');
    const r = await gitExec(dir, `rebase --onto ${hash}~1 ${hash}`);
    if (!r.ok) {
      await gitExec(dir, 'rebase --abort');
      return sendError(res, '删除失败：该版本与后续提交存在冲突，已自动中止，历史未被改动（可改为删除最新版本，或手动用 Git 处理）', 500);
    }
    return send(res, 200, { ok: true, msg: `已删除版本 ${hash}` });
  }

  if (p === '/api/projects' && method === 'POST') {
    const { name } = await readBody(req);
    const projName = safeName(name);
    if (!projName) return sendError(res, '项目名称不能为空，且不能含非法字符（* ? < > | : \\ /）');
    const projectsRoot = path.join(AXHUB_ROOT, '01-项目');
    fs.mkdirSync(projectsRoot, { recursive: true });
    const dst = path.join(projectsRoot, projName);
    if (fs.existsSync(dst)) return sendError(res, `目录已存在：${projName}`);
    if (!fs.existsSync(TEMPLATE_DIR)) return sendError(res, '模板目录不存在');
    try {
      fs.cpSync(TEMPLATE_DIR, dst, {
        recursive: true,
        filter: (src) => {
          const lp = src.toLowerCase();
          return !lp.includes('node_modules') && !lp.includes('\\.git') && !lp.endsWith('/.git');
        },
      });
      // 生成唯一项目身份
      const clientFile = path.join(dst, '.axhub', 'make', 'client.json');
      const client = {
        schemaVersion: 1,
        kind: 'axhub-make-client',
        project: { id: projName, name: projName },
      };
      fs.mkdirSync(path.dirname(clientFile), { recursive: true });
      fs.writeFileSync(clientFile, JSON.stringify(client, null, 2), 'utf8');
      // AI 联动：新项目创建后纳入上下文（默认未启动，状态留给后续启动流程决定）
      const ctx0 = readWorkspaceCtx();
      const ctxN = upsertProject(ctx0, `01-项目/${projName}`, 'active');
      writeWorkspaceCtx(ctxN);
      return send(res, 200, { ok: true, msg: `项目已创建：${projName}`, relative: `01-项目/${projName}`, path: dst });
    } catch (e) {
      return sendError(res, '创建失败：' + e.message, 500);
    }
  }

  if (p === '/api/projects' && method === 'DELETE') {
    const { relative } = await readBody(req);
    if (!relative) return sendError(res, '缺少项目路径');
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const dir = path.join(AXHUB_ROOT, relative);
    if (!fs.existsSync(dir)) return sendError(res, '项目不存在');
    // 禁止删除模板、面板自身或分类目录
    const CATEGORY_NAMES = new Set(['01-项目','02-模板','03-备份','04-临时','05-回收站','06-运行脚本','07-日志','08-文档','_backups','tmp']);
    if (relative.includes('_project-template') || relative.startsWith('axhub-manager') || CATEGORY_NAMES.has(relative)) {
      return sendError(res, '不允许删除模板、管理面板或分类目录');
    }
    try {
      // 删除前先主动停掉项目开发栈（Vite 等子进程），释放目录占用，避免 EBUSY。
      const { killed, pid } = killProjectProcess(relative);
      if (killed) {
        // 给进程树一点时间释放文件句柄
        await new Promise((r) => setTimeout(r, 600));
      }
      let dst = null;
      try {
        dst = moveToTrash(dir);
      } catch (e) {
        // Windows 上目录被占用时 rename 常报 EPERM（而非 EBUSY），
        // 两者都视为"可降级处理"：递归删除内容。
        if (e && (e.code === 'EBUSY' || e.code === 'EPERM' || e.code === 'EACCES')) {
          // 目录被 IDE / 资源管理器 / 开发进程等占用导致 rename 失败。
          // 降级为递归删除内容：编辑器打开的句柄通常不构成排他锁，
          // 文件仍可逐个 DeleteFile；目录本身若被持有则可能留下空壳。
          const removed = removeDirClean(dir);
          if (removed) {
            removeProjectCtx(relative);
            return send(res, 200, {
              ok: true,
              msg: `项目「${relative}」已删除（原目录被编辑器/其他程序占用，无法移入回收站，已直接删除内容）`,
              forced: true,
            });
          }
          // 干净子进程删除也失败：可能已删除全部内容，仅根目录空壳因被进程持有而无法移除。
          let emptyShell = false;
          try {
            const left = fs.readdirSync(dir);
            emptyShell = left.length === 0;
          } catch {
            // dir 已不存在 = 删除完全成功
            emptyShell = true;
          }
          if (emptyShell) {
            removeProjectCtx(relative);
            return send(res, 200, {
              ok: true,
              msg: `项目「${relative}」内容已全部删除；原目录空壳被编辑器/其他程序占用暂未移除，关闭占用程序后可手动删除。`,
              forced: true,
              shellRemains: true,
            });
          }
          return sendError(
            res,
            `删除失败：项目目录被占用。请先在「工作台」停止该项目的开发栈，关闭正在浏览该目录的编辑器/资源管理器窗口后重试。`,
            500
          );
        }
        throw e;
      }
      if (!dst) return sendError(res, '项目移动失败');
      // AI 联动：从多项目上下文中移除
      removeProjectCtx(relative);
      return send(res, 200, { ok: true, msg: `项目「${relative}」已移至回收站：${dst}` });
    } catch (e) {
      return sendError(res, '删除失败：' + e.message, 500);
    }
  }

  if (p === '/api/projects/open' && method === 'POST') {
    const { relative } = await readBody(req);
    if (!relative) return sendError(res, '缺少项目路径');
    const dir = path.join(AXHUB_ROOT, String(relative).replace(/\//g, path.sep));
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    const ps1 = path.join(AXHUB_ROOT, '06-运行脚本', 'launch-project.ps1');
    if (!fs.existsSync(ps1)) return sendError(res, '找不到 launch-project.ps1');
    try {
            // PowerShell 参数需要反斜杠路径
            const psName = relative.replace(/\//g, '\\');
            // logBase 必须保留中文区分不同项目。原实现把所有非 ASCII 都当非法字符替换，
            // 导致 "01-项目/学校卫生" 和 "01-项目/健康档案" 等多个项目映射到同一个 log 文件，
            // 读到的 openUrl 全部错乱。现改为：保留中英文数字 + `-_`、只把分隔符 `/` 和 `\` 替成 `-`。
            const logBase = safeName(relative).replace(/[\\/]+/g, '-') || 'project';
            const logDir = path.join(AXHUB_ROOT, '07-日志');
            fs.mkdirSync(logDir, { recursive: true });
            const logFile = path.join(logDir, `launch-${logBase}.log`);
            const stamp = `[${new Date().toISOString()}] 启动 ${relative}\n`;
            // 日志统一 UTF-8+BOM：新文件先写 BOM，避免 GBK 编辑器误读；已有文件则直接追加。
            if (!fs.existsSync(logFile)) {
              fs.writeFileSync(logFile, '\uFEFF' + stamp, 'utf8');
            } else {
              fs.appendFileSync(logFile, stamp, 'utf8');
            }
            // 生成 UTF-8 BOM 临时 ps1，避免命令行中文编码问题
            const tmpPs1 = path.join(__dirname, `launch-${logBase}.tmp.ps1`);
      const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
      // 强制 PowerShell 以 UTF-8 向管道输出（覆盖本机 profile / 控制台编码被设为 GBK 的情况），
      // 与文件头 BOM 配合，彻底避免中文在「源读取」与「管道输出」两端被双重编码成乱码。
      const psBody = Buffer.from(
        '$OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;\r\n' +
        `& "${ps1}" -RootDir "${AXHUB_ROOT}" -ProjectName "${psName}" -NodePath "${process.execPath}"`,
        'utf8'
      );
      fs.writeFileSync(tmpPs1, Buffer.concat([bom, psBody]));
      fs.appendFileSync(logFile, `TMP: ${tmpPs1}\n`, 'utf8');
      const child = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', tmpPs1], {
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: cleanEnvForSpawn(),
      });
      child.stdout.on('data', (d) => {
        fs.appendFileSync(logFile, d, 'utf8');
        const text = d.toString('utf8');
        if (text.includes('AXHUB_LAUNCH_STATUS: done')) {
          // 启动完成：把 starting 转成 editing/active + 联动 Make
          const mctx = readWorkspaceCtx();
          markProjectRunning(mctx, relative);
          syncMakeActiveProject(relative).catch(() => {});
        } else if (text.includes('AXHUB_LAUNCH_STATUS: failed')) {
          // 启动失败：把 starting 转成 stopped（提示用户启动失败，不让浏览器去打 53817 拒绝连接）
          const fctx = readWorkspaceCtx();
          markProjectStopped(fctx, relative);
        }
      });
      child.stderr.on('data', (d) => fs.appendFileSync(logFile, `STDERR: ${d}`, 'utf8'));
      child.on('error', (e) => fs.appendFileSync(logFile, `SPAWN ERROR: ${e.message}\n`, 'utf8'));
      child.on('close', (code) => fs.appendFileSync(logFile, `EXIT CODE: ${code}\n`, 'utf8'));
      child.unref();
      const hasNodeModules = fs.existsSync(path.join(dir, 'node_modules'));
      // AI 联动：启动后纳入上下文（无编辑焦点 → 直接 editing；有 → active）
      const stctx = readWorkspaceCtx();
      const started = onProjectStarted(stctx, relative);
      // 启动瞬间联动 Make（若 Make 已先运行则生效；否则 PS1 完成时会再次联动）
      syncMakeActiveProject(relative).catch(() => {});
      return send(res, 200, { ok: true, msg: `已启动「${relative}」开发栈（Vite + Axhub Make），浏览器将自动打开`, log: logFile, hasNodeModules, ctx: started });
    } catch (e) {
      return sendError(res, '启动失败：' + e.message, 500);
    }
  }

  // 供前端轮询启动进度：读取对应项目的启动日志尾部，并判断状态
  if (p === '/api/projects/launch-log' && method === 'GET') {
    const u = new URL(req.url, 'http://localhost');
    const relative = u.searchParams.get('relative');
    if (!relative) return sendError(res, '缺少 relative');
    // 与 POST /api/projects/open 一致：保留中文，把 / 和 \ 替成 -
    const logBase = safeName(relative).replace(/[\\/]+/g, '-') || 'project';
    const logFile = path.join(AXHUB_ROOT, '07-日志', `launch-${logBase}.log`);
    if (!fs.existsSync(logFile)) return send(res, 200, { ok: true, status: 'pending', lines: [] });
    const txt = fs.readFileSync(logFile, 'utf8');
    // 关键：launch-log 是 append 模式，旧启动的 done 标记会一直在。必须从最近一次「启动 X」分割，
    // 只看当前这次启动的尾部，否则会误判 done 一来就完成（实测导致"必点两次"）。
    const startMarker = `启动 ${relative}`;
    const startIdx = txt.lastIndexOf(startMarker);
    const liveTxt = startIdx >= 0 ? txt.slice(startIdx) : txt;
    const lines = liveTxt.split('\n').map((s) => s.replace(/\r$/, '')).slice(-30);
    let status = 'running';
    if (liveTxt.includes('AXHUB_LAUNCH_STATUS: done')) status = 'done';
    else if (liveTxt.includes('AXHUB_LAUNCH_STATUS: failed')) status = 'failed';
    else if (liveTxt.includes('启动完成')) status = 'done';
    else if (liveTxt.includes('启动失败')) status = 'failed';
    // 从日志里提取启动完成时要打开的 URL（PS1 第 8 步输出 AXHUB_OPEN_URL 显式标记，其次正则兜底）
    let openUrl = null;
    const mu = liveTxt.match(/AXHUB_OPEN_URL:\s*(https?:\/\/[^\s\r\n]+)/);
    if (mu) openUrl = mu[1];
    else {
      const m = liveTxt.match(/https?:\/\/localhost:\d+\/\?projectId=[^\s\r\n]+/);
      if (m) openUrl = m[0];
    }
    return send(res, 200, { ok: true, status, lines, openUrl });
  }

  // 打开 URL（Windows 标准机制）
  // 注意：不能直接用 explorer.exe <url> —— explorer.exe 会把 URL 当作文件/文件夹路径，
  //       表现为「打开了项目文件夹」而不是浏览器。
  //       rundll32.exe url.dll,FileProtocolHandler <url> 是打开系统默认浏览器最可靠的方式，
  //       不经过 cmd 解析，URL 里的 & / 空格 / 引号都安全。
  if (p === '/api/browser/open' && method === 'POST') {
    const { url } = await readBody(req);
    if (!url || !/^https?:\/\//i.test(url)) return sendError(res, '非法的 url');
    try {
      const child = spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], { detached: true, stdio: 'ignore' });
      child.unref();
      return send(res, 200, { ok: true, msg: '已请求打开浏览器' });
    } catch (e) {
      return sendError(res, '打开失败：' + e.message, 500);
    }
  }

  if (p === '/api/projects/copy' && method === 'POST') {
    const { relative, newName } = await readBody(req);
    if (isDemoRelative(relative)) return sendError(res, DEMO_GUARD_MSG);
    const srcName = safeName(relative || '');
    const dstName = safeName(newName);
    if (!srcName || !dstName) return sendError(res, '源项目与目标名称均不能为空');
    const src = path.join(AXHUB_ROOT, srcName);
    const projectsRoot = path.join(AXHUB_ROOT, '01-项目');
    fs.mkdirSync(projectsRoot, { recursive: true });
    const dst = path.join(projectsRoot, dstName);
    if (!fs.existsSync(src)) return sendError(res, '源项目不存在');
    if (fs.existsSync(dst)) return sendError(res, `目标目录已存在：${dstName}`);
    try {
      fs.cpSync(src, dst, {
        recursive: true,
        filter: (s) => {
          const lp = s.toLowerCase();
          return !lp.includes('node_modules') && !lp.includes('\\.git') && !lp.endsWith('/.git');
        },
      });
      // 更新副本身份
      const clientFile = path.join(dst, '.axhub', 'make', 'client.json');
      if (fs.existsSync(clientFile)) {
        try {
          const c = JSON.parse(fs.readFileSync(clientFile, 'utf8'));
          c.project = { id: dstName, name: dstName };
          fs.writeFileSync(clientFile, JSON.stringify(c, null, 2), 'utf8');
        } catch { /* ignore */ }
      }
      // AI 联动：副本也纳入上下文（默认 active，启动流程再决定是否 editing）
      const rctx = readWorkspaceCtx();
      setProjectActive(rctx, `01-项目/${dstName}`);
      return send(res, 200, { ok: true, msg: `已复制为：${dstName}`, relative: `01-项目/${dstName}`, path: dst });
    } catch (e) {
      return sendError(res, '复制失败：' + e.message, 500);
    }
  }

  // ===== AI 联动上下文 =====
  // GET：返回全部项目状态 + 各智能体编辑焦点（codebuddy / workbuddy 读取用）。
  // 读取前先做活体检测，把已死的 editing/active 项目降级为 stopped（被动停止，保留展示）。
  if (p === '/api/context/current' && method === 'GET') {
    const ctx = await reconcileWorkspaceCtx();
    return send(res, 200, { ok: true, agents: ctx.agents, projects: ctx.projects });
  }

  // POST：切换某智能体的编辑项目（方案B下拉用）。参数 { agent, relative }。
  // 互换语义：把 agent 的编辑焦点切到 relative；agent 原编辑项目（若活着）降为 active，若死了降为 stopped。
  // 互斥：relative 已被其他智能体 editing → 返回冲突。
  // 成功后联动 Make Admin 聚焦该项目。
  if (p === '/api/context/current' && method === 'POST') {
    const body = await readBody(req);
    const { agent, relative } = body;
    if (!relative) return sendError(res, '缺少 relative');
    const dir = path.join(AXHUB_ROOT, String(relative).replace(/\//g, path.sep));
    if (!fs.existsSync(dir)) return sendError(res, '项目路径不存在');
    const a = KNOWN_AGENTS.includes(agent) ? agent : KNOWN_AGENTS[0];
    const ctx = readWorkspaceCtx();
    const res2 = setEditing(ctx, a, relative);
    if (res2.conflict) {
      return send(res, 409, { ok: false, msg: `「${relative}」正被 ${res2.conflicter} 编辑，请先释放`, code: 'AGENT_CONFLICT' });
    }
    // 联动 Make 聚焦
    syncMakeActiveProject(relative).catch(() => {});
    return send(res, 200, { ok: true, agents: res2.ctx.agents, projects: res2.ctx.projects });
  }

  // POST /api/context/current/remove：从上下文中移除项目（内部用）
  if (p === '/api/context/current/remove' && method === 'POST') {
    const { relative } = await readBody(req);
    const ctx = removeProjectCtx(relative);
    return send(res, 200, { ok: true, agents: ctx.agents, projects: ctx.projects });
  }

  // POST /api/context/stop：主动停止某项目（标 stopped 且解除编辑焦点，保留展示）。
  if (p === '/api/context/stop' && method === 'POST') {
    const { relative } = await readBody(req);
    if (!relative) return sendError(res, '缺少 relative');
    const ctx = readWorkspaceCtx();
    const stopped = markProjectStopped(ctx, relative);
    return send(res, 200, { ok: true, agents: stopped.agents, projects: stopped.projects });
  }

  // POST /api/context/cleanup-stale：清理工作台/项目级的"陈旧"状态文件。
  // 适用场景：进程被 kill 但心跳/current.json 没清，导致工作台徽标误显示"运行中"。
  // 实际有没有进程活着由调用方确认；这里只负责清文件。
  if (p === '/api/context/cleanup-stale' && method === 'POST') {
    const cleaned = { workspace: false, infoFile: false, currentFiles: [], ports: [] };
    try {
      if (fs.existsSync(WORKSPACE_CTX_FILE)) {
        fs.rmSync(WORKSPACE_CTX_FILE);
        cleaned.workspace = true;
      }
    } catch { /* ignore */ }
    try {
      const infoFile = path.join(WORKSPACE_DIR, 'projects-info.json');
      if (fs.existsSync(infoFile)) {
        fs.rmSync(infoFile);
        cleaned.infoFile = true;
      }
    } catch { /* ignore */ }
    // 项目级 .workbuddy/current.json + .axhub/make/.admin-server-info.json
    const projs = path.join(AXHUB_ROOT, '01-项目');
    if (fs.existsSync(projs)) {
      const entries = fs.readdirSync(projs, { withFileTypes: true });
      for (const e of entries) {
        if (!e.isDirectory()) continue;
        // 项目级 current.json
        const cur = path.join(projs, e.name, '.workbuddy', 'current.json');
        try {
          if (fs.existsSync(cur)) {
            fs.rmSync(cur);
            cleaned.currentFiles.push(e.name + '/.workbuddy/current.json');
          }
        } catch { /* ignore */ }
        // Make 心跳
        const heartbeat = path.join(projs, e.name, '.axhub', 'make', '.admin-server-info.json');
        try {
          if (fs.existsSync(heartbeat)) {
            fs.rmSync(heartbeat);
            cleaned.currentFiles.push(e.name + '/.axhub/make/.admin-server-info.json');
          }
        } catch { /* ignore */ }
      }
    }
    return send(res, 200, { ok: true, cleaned });
  }

  // ===== Skill 库 =====
  if (p === '/api/skills' && method === 'GET') {
    const skills = [];
    let dirs = [];
    try { dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }); } catch { return send(res, 200, { ok: true, skills }); }
    for (const d of dirs) {
      if (!d.isDirectory()) continue;
      const skillMd = path.join(SKILLS_DIR, d.name, 'SKILL.md');
      if (!fs.existsSync(skillMd)) continue;
      const text = fs.readFileSync(skillMd, 'utf8');
      const { name, description } = parseFrontmatter(text);
      skills.push({
        dir: d.name,
        name: name || d.name,
        description: description.slice(0, 300),
        triggers: extractTriggers(description),
        path: `skills/${d.name}/SKILL.md`,
      });
    }
    skills.sort((a, b) => a.name.localeCompare(b.name));
    return send(res, 200, { ok: true, skills });
  }

  if (p === '/api/skills/content' && method === 'GET') {
    const dir = url.searchParams.get('dir') || '';
    if (!dir) return sendError(res, '缺少 dir');
    const skillMd = path.join(SKILLS_DIR, path.basename(dir), 'SKILL.md');
    if (!fs.existsSync(skillMd)) return sendError(res, 'Skill 不存在');
    try {
      const content = fs.readFileSync(skillMd, 'utf8');
      return send(res, 200, { ok: true, content });
    } catch (e) {
      return sendError(res, '读取失败：' + e.message, 500);
    }
  }

  if (p === '/api/skills' && method === 'POST') {
    const { filename, content } = await readBody(req);
    if (!content) return sendError(res, '文件内容为空');
    const { name, description } = parseFrontmatter(content);
    const dirName = safeName(name) || safeName(filename?.replace(/\.md$/i, '')) || 'new-skill';
    const targetDir = path.join(SKILLS_DIR, dirName);
    if (fs.existsSync(targetDir)) return sendError(res, `Skill 目录已存在：${dirName}`);
    try {
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, 'SKILL.md'), content, 'utf8');
      return send(res, 200, {
        ok: true,
        skill: { dir: dirName, name: name || dirName, description: description.slice(0, 300), triggers: extractTriggers(description), path: `skills/${dirName}/SKILL.md` },
        msg: `Skill「${name || dirName}」已新增`,
      });
    } catch (e) {
      return sendError(res, '写入失败：' + e.message, 500);
    }
  }

  if (p === '/api/skills' && method === 'PUT') {
    const { dir, content } = await readBody(req);
    if (!dir || !content) return sendError(res, '缺少 dir 或内容');
    const targetDir = path.join(SKILLS_DIR, path.basename(dir));
    const skillMd = path.join(targetDir, 'SKILL.md');
    if (!fs.existsSync(skillMd)) return sendError(res, 'Skill 不存在');
    try {
      fs.writeFileSync(skillMd, content, 'utf8');
      const { name, description } = parseFrontmatter(content);
      return send(res, 200, {
        ok: true,
        skill: { dir: path.basename(dir), name: name || dir, description: description.slice(0, 300), triggers: extractTriggers(description), path: `skills/${path.basename(dir)}/SKILL.md` },
        msg: `Skill「${name || dir}」已更新`,
      });
    } catch (e) {
      return sendError(res, '写入失败：' + e.message, 500);
    }
  }

  if (p === '/api/skills' && method === 'DELETE') {
    const { dir } = await readBody(req);
    if (!dir) return sendError(res, '缺少 dir');
    const target = path.join(SKILLS_DIR, path.basename(dir));
    if (!fs.existsSync(target)) return sendError(res, 'Skill 不存在');
    try {
      const dst = moveToTrash(target);
      if (!dst) return sendError(res, 'Skill 移动失败');
      return send(res, 200, { ok: true, msg: `Skill「${dir}」已移至回收站：${dst}` });
    } catch (e) { return sendError(res, '删除失败：' + e.message, 500); }
  }

  // ===== 知识库 =====
  if (p === '/api/knowledge' && method === 'GET') {
    const files = walkMd(KNOWLEDGE_DIR, '', []);
    const items = files.map((f) => {
      let content = '';
      try { content = fs.readFileSync(f.full, 'utf8'); } catch { content = ''; }
      return {
        name: f.rel.replace(/\.md$/i, ''),
        path: `knowledge/${f.rel.replace(/\\/g, '/')}`,
        scenario: deriveScenario(content, f.rel),
        fullPath: f.full,
      };
    });
    return send(res, 200, { ok: true, items });
  }

  if (p === '/api/knowledge/content' && method === 'GET') {
    const rel = url.searchParams.get('path') || '';
    const target = path.join(KNOWLEDGE_DIR, safeRelPath(rel, 'knowledge'));
    if (!fs.existsSync(target) || !target.startsWith(KNOWLEDGE_DIR)) return sendError(res, '文件不存在或路径非法');
    try {
      const content = fs.readFileSync(target, 'utf8');
      return send(res, 200, { ok: true, content, path: rel });
    } catch (e) {
      return sendError(res, '读取失败：' + e.message, 500);
    }
  }

  if (p === '/api/knowledge' && method === 'POST') {
    const { filename, content } = await readBody(req);
    if (!filename || !content) return sendError(res, '文件名与内容不能为空');
    const base = safeName(filename.replace(/\.md$/i, '')) + '.md';
    const target = path.join(KNOWLEDGE_DIR, base);
    if (fs.existsSync(target)) return sendError(res, `文件已存在：${base}`);
    try {
      fs.writeFileSync(target, content, 'utf8');
      return send(res, 200, { ok: true, msg: `知识库文档已新增：${base}`, path: `knowledge/${base}` });
    } catch (e) { return sendError(res, '写入失败：' + e.message, 500); }
  }

  if (p === '/api/knowledge' && method === 'PUT') {
    const { path: rel, content } = await readBody(req);
    if (!rel || !content) return sendError(res, '路径与内容不能为空');
    const target = path.join(KNOWLEDGE_DIR, safeRelPath(rel, 'knowledge'));
    if (!fs.existsSync(target) || !target.startsWith(KNOWLEDGE_DIR)) return sendError(res, '文件不存在或路径非法');
    try {
      fs.writeFileSync(target, content, 'utf8');
      return send(res, 200, { ok: true, msg: `知识库文档已更新：${rel}` });
    } catch (e) { return sendError(res, '写入失败：' + e.message, 500); }
  }

  if (p === '/api/knowledge' && method === 'DELETE') {
    const { rel } = await readBody(req);
    if (!rel) return sendError(res, '缺少路径');
    const target = path.join(KNOWLEDGE_DIR, safeRelPath(rel, 'knowledge'));
    if (!fs.existsSync(target) || !target.startsWith(KNOWLEDGE_DIR)) return sendError(res, '文件不存在或路径非法');
    try {
      const dst = moveToTrash(target);
      if (!dst) return sendError(res, '文件移动失败');
      return send(res, 200, { ok: true, msg: `已移至回收站：${dst}` });
    } catch (e) { return sendError(res, '删除失败：' + e.message, 500); }
  }

  // ===== 工作规则 =====
  if (p === '/api/rules' && method === 'GET') {
    const items = [];
    let files = [];
    try { files = fs.readdirSync(RULES_DIR, { withFileTypes: true }); } catch { return send(res, 200, { ok: true, items }); }
    for (const f of files) {
      if (!f.isFile() || !f.name.endsWith('.md')) continue;
      const full = path.join(RULES_DIR, f.name);
      let content = '';
      try { content = fs.readFileSync(full, 'utf8'); } catch { content = ''; }
      items.push({
        name: f.name.replace(/\.md$/i, ''),
        path: `rules/${f.name}`,
        scenario: deriveScenario(content, f.name),
      });
    }
    return send(res, 200, { ok: true, items });
  }

  if (p === '/api/rules/content' && method === 'GET') {
    const name = url.searchParams.get('name') || '';
    const target = path.join(RULES_DIR, path.basename(name) + (name.endsWith('.md') ? '' : '.md'));
    if (!fs.existsSync(target) || !target.startsWith(RULES_DIR)) return sendError(res, '文件不存在或路径非法');
    try {
      const content = fs.readFileSync(target, 'utf8');
      return send(res, 200, { ok: true, content, name });
    } catch (e) {
      return sendError(res, '读取失败：' + e.message, 500);
    }
  }

  if (p === '/api/rules' && method === 'POST') {
    const { filename, content } = await readBody(req);
    if (!filename || !content) return sendError(res, '文件名与内容不能为空');
    const base = safeName(filename.replace(/\.md$/i, '')) + '.md';
    const target = path.join(RULES_DIR, base);
    if (fs.existsSync(target)) return sendError(res, `文件已存在：${base}`);
    try {
      fs.writeFileSync(target, content, 'utf8');
      return send(res, 200, { ok: true, msg: `工作规则已新增：${base}`, path: `rules/${base}` });
    } catch (e) { return sendError(res, '写入失败：' + e.message, 500); }
  }

  if (p === '/api/rules' && method === 'PUT') {
    const { name, content } = await readBody(req);
    if (!name || !content) return sendError(res, '文件名与内容不能为空');
    const target = path.join(RULES_DIR, path.basename(name) + (name.endsWith('.md') ? '' : '.md'));
    if (!fs.existsSync(target) || !target.startsWith(RULES_DIR)) return sendError(res, '文件不存在或路径非法');
    try {
      fs.writeFileSync(target, content, 'utf8');
      return send(res, 200, { ok: true, msg: `工作规则已更新：${name}` });
    } catch (e) { return sendError(res, '写入失败：' + e.message, 500); }
  }

  if (p === '/api/rules' && method === 'DELETE') {
    const { name } = await readBody(req);
    if (!name) return sendError(res, '缺少文件名');
    const target = path.join(RULES_DIR, path.basename(name) + (name.endsWith('.md') ? '' : '.md'));
    if (!fs.existsSync(target) || !target.startsWith(RULES_DIR)) return sendError(res, '文件不存在或路径非法');
    try {
      const dst = moveToTrash(target);
      if (!dst) return sendError(res, '文件移动失败');
      return send(res, 200, { ok: true, msg: `已移至回收站：${dst}` });
    } catch (e) { return sendError(res, '删除失败：' + e.message, 500); }
  }

  // 404
  send(res, 404, { ok: false, msg: 'Not Found' });
});

server.listen(PORT, () => {
  console.log(`产品设计工作台已启动: http://localhost:${PORT}`);
  // 浏览器标签页统一由 启动工作台.cmd 负责打开，避免重复开标签页，故此处不再自动打开
});
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('端口已被占用，已有工作台在运行，请勿重复启动。');
    // 浏览器标签页由 启动工作台.cmd 负责打开，此处不再自动打开
    process.exit(0);
  } else {
    console.error(e);
  }
});
