const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const HOST = '127.0.0.1';
const PORT = 8844;
const ROOT = __dirname;
const index = fs.readFileSync(path.join(ROOT, 'index.html'));
const warning = fs.readFileSync(path.join(ROOT, 'security-warning.mp4'));

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${HOST}:${PORT}`);

  if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname === '/') {
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': index.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (req.method === 'GET') res.end(index);
    else res.end();
    return;
  }

  // yt-dlp's generic extractor accepts direct video/* resources. The bytes are
  // intentionally harmless plain text, so the resulting .mp4 is only a marker.
  if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname === '/security-warning.mp4') {
    res.writeHead(200, {
      'Content-Type': 'video/mp4',
      'Content-Length': warning.length,
      'Cache-Control': 'no-store',
      'Accept-Ranges': 'none',
    });
    if (req.method === 'GET') res.end(warning);
    else res.end();
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(PORT, HOST, () => {
  console.log(`Safe local PoC: http://${HOST}:${PORT}`);
});
