// 零依赖静态服务器 (正确返回 ES 模块的 text/javascript MIME)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PORT = process.env.PORT || 8765;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.join(ROOT, p);
  if (!fp.startsWith(ROOT)) { res.statusCode = 403; res.end('403'); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.statusCode = 404; res.setHeader('Content-Type', 'text/plain; charset=utf-8'); res.end('404 Not Found: ' + p); return; }
    res.setHeader('Content-Type', MIME[path.extname(fp)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`\n  ➜  一级回热朗肯循环 · 3D 仿真\n     打开:  http://localhost:${PORT}/\n`);
});
