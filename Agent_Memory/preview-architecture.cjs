// 启动一个静态文件服务预览 Axhub 架构图
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = 18080;
const ROOT = 'C:\\Users\\游翔\\Documents\\AI work\\Axhub\\08-文档\\';
const TARGET = 'architecture-overview.html';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.png':  'image/png',
  '.svg':  'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/' || url === '') url = '/' + TARGET;
  const filePath = path.join(ROOT, url);
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
  fs.stat(filePath, (err, st) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    if (st.isDirectory()) { res.writeHead(302, { Location: url + (url.endsWith('/')?'':'/') }); res.end(); return; }
    const ext = path.extname(filePath).toLowerCase();
    const type = types[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`预览服务已启动  http://127.0.0.1:${PORT}/${TARGET}`);
});
