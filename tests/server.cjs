// Local server that mimics Vercel: serves index.html and runs api/*.js with an in-memory database.
// Usage: npm run dev  →  http://127.0.0.1:3000
const http = require('node:http'), fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
process.env.TECLADO_MEMORY_DB ??= '1';
process.env.META_PIXEL_ID ??= 'off'; // local copies don't send visits to the real Meta Pixel
process.env.GOOGLE_ADS_ID ??= 'off'; // nor conversions to Google Ads
process.env.POSTHOG_KEY ??= 'off'; // nor events to PostHog

let middleware = null;
function createServer() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const match = /^\/api\/([a-z]+)$/.exec(url.pathname);
    if (!match) {
      const publicFiles = new Set(['/analytics.js', '/app.js', '/app.css', '/nueva.html', '/nueva.css', '/nueva.js', '/desafios.js', '/belts.js', '/manifest.webmanifest', '/sw.js', '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png', '/icons/apple-touch-icon.png', '/dojo.css', '/dojo.js', '/scenery.css', '/scenery.js', '/typists.css', '/typists.js', '/cognitive.css', '/figures.js', '/numeric.js', '/english.js', '/logic.js', '/legal.css', '/monk.js', '/monk.css', '/comentarios.html', '/admin.html', '/vendor/qrcode.js', '/precios.html', '/profesional.html', '/terminos.html', '/privacidad.html', '/reembolsos.html', '/demo/teclado-ciego-demo.mp4', ...['beach', 'mountains', 'forest'].flatMap(name => ['/assets/' + name + '.jpg', '/assets/' + name + '-thumb.jpg'])]);
      // "/" is decided as middleware.js decides it on Vercel (A/B test of the home): the same cookie, robots and ?home=
      let home = 'actual';
      if (url.pathname === '/') {
        const { decide } = await (middleware ??= import('../middleware.js'));
        const d = decide({ url: 'http://localhost' + req.url, cookie: req.headers.cookie, userAgent: req.headers['user-agent'], env: process.env });
        home = d.variant;
        if (d.cookies.length) res.setHeader('Set-Cookie', d.cookies);
      }
      const pathname = url.pathname === '/' ? (home === 'nueva' ? '/nueva.html' : '/index.html') : url.pathname === '/profesional' ? '/profesional.html' : url.pathname === '/admin' ? '/admin.html' : url.pathname === '/nueva' ? '/nueva.html' : url.pathname; // as vercel.json
      if (pathname !== '/index.html' && !publicFiles.has(pathname)) { res.statusCode = 404; return res.end('Not found'); }
      const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.png': 'image/png', '.webmanifest': 'application/manifest+json' };
      res.setHeader('Content-Type', types[path.extname(pathname)]);
      return res.end(fs.readFileSync(path.join(root, pathname)));
    }
    const file = path.join(root, 'api', match[1] + '.js');
    if (!fs.existsSync(file)) { res.statusCode = 404; return res.end('{}'); }
    let raw = '';
    for await (const chunk of req) raw += chunk;
    try { req.body = raw ? JSON.parse(raw) : {}; } catch { req.body = raw; }
    res.status = code => { res.statusCode = code; return res; };
    res.json = data => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(data)); return res; };
    await require(file)(req, res);
  });
}

module.exports = { createServer };
if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, '127.0.0.1', () => console.log('Templo Ninja en http://127.0.0.1:' + port));
}
