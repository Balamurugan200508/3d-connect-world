/**
 * Entraiot Connect — Unified Production Server
 *
 * Routes
 * ──────
 *   /                 → redirects to /portfolio
 *   /portfolio/*      → Stage 1  — pre-built Three.js/React static site
 *   /way/*            → Stage 2  — Next.js 16 bike scrollytelling (standalone)
 *   /buildings/*      → Stage 3  — Vite 3D buildings (built dist/)
 *   /api/health       → JSON health-check
 *
 * Start (production)
 * ──────────────────
 *   npm install
 *   NODE_ENV=production node server.js
 */

'use strict';

const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app  = express();
const PORT = process.env.PORT || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Register extra MIME types ─────────────────────────────────────────────
express.static.mime.define({ 'model/gltf-binary': ['glb'] });
express.static.mime.define({ 'model/gltf+json':   ['gltf'] });
express.static.mime.define({ 'audio/mp4':         ['m4a']  });
express.static.mime.define({ 'font/woff2':        ['woff2'] });
express.static.mime.define({ 'image/webp':        ['webp'] });

// ─── Security + CORS headers ──────────────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ─── Helpers ──────────────────────────────────────────────────────────────
function staticOpts(noCache = false) {
  return {
    setHeaders(res, filePath) {
      if (noCache || filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    }
  };
}

function spaFallback(dir, indexName = 'index.html') {
  return (req, res, next) => {
    const indexPath = path.join(dir, indexName);
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    next();
  };
}

// ─── Health check ─────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    stages: {
      stage1: '/portfolio  — static Three.js portfolio',
      stage2: '/way        — Next.js bike scrollytelling',
      stage3: '/buildings  — Vite 3D buildings',
    }
  });
});

// ─── File Debug Route ─────────────────────────────────────────────────────
app.get('/api/files', (req, res) => {
  function getFiles(dir, fileList = []) {
    if (!fs.existsSync(dir)) return [`${dir} does not exist`];
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const name = path.join(dir, file);
      if (fs.statSync(name).isDirectory()) {
        getFiles(name, fileList);
      } else {
        fileList.push(name.replace(__dirname, ''));
      }
    });
    return fileList;
  }
  res.json({
    root: fs.readdirSync(__dirname),
    dist: fs.existsSync(path.join(__dirname, 'dist-vercel')) ? fs.readdirSync(path.join(__dirname, 'dist-vercel')) : 'missing',
    all_files: getFiles(path.join(__dirname, 'dist-vercel')).slice(0, 100) // first 100 files
  });
});

const STAGE1_DIR = path.resolve(__dirname, 'dist-vercel', 'portfolio');
const STAGE2_DIR = path.resolve(__dirname, 'dist-vercel', 'way');
const STAGE3_DIR = path.resolve(__dirname, 'dist-vercel', 'buildings');

// ─── Static Routes (Move to top) ──────────────────────────────────────────
app.use('/portfolio', express.static(STAGE1_DIR, staticOpts(true)));
app.use('/way', express.static(STAGE2_DIR, staticOpts(true)));
app.use('/buildings', express.static(STAGE3_DIR, staticOpts(true)));
app.use('/assets', express.static(path.join(STAGE1_DIR, 'assets'), staticOpts(true)));

// ─── SPA Fallbacks ────────────────────────────────────────────────────────
app.get('/portfolio/*', spaFallback(STAGE1_DIR));
app.get('/way/*', spaFallback(STAGE2_DIR));
app.get('/buildings/*', spaFallback(STAGE3_DIR));

// ─── Root ─────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.redirect('/way'));
app.get('/way', (req, res) => res.sendFile(path.join(STAGE2_DIR, 'index.html')));

console.log('----------------------------------------------------');
console.log('SERVER STARTING...');
console.log('CWD:', process.cwd());
console.log('DIRNAME:', __dirname);
console.log('Files in root:', fs.readdirSync(__dirname));
console.log('STAGE1_DIR:', STAGE1_DIR, 'Exists:', fs.existsSync(STAGE1_DIR));
console.log('STAGE2_DIR:', STAGE2_DIR, 'Exists:', fs.existsSync(STAGE2_DIR));
console.log('STAGE3_DIR:', STAGE3_DIR, 'Exists:', fs.existsSync(STAGE3_DIR));

// Deep check for index.html
if (fs.existsSync(STAGE2_DIR)) {
  const indexPath = path.join(STAGE2_DIR, 'index.html');
  console.log('STAGE2 index.html Exists:', fs.existsSync(indexPath));
}

console.log('----------------------------------------------------');

// ─── Global Static Fallback ───────────────────────────────────────────────
if (IS_PROD && fs.existsSync(STAGE3_DIR)) {
  app.use(express.static(STAGE3_DIR, staticOpts(true)));
}
app.use(express.static(STAGE1_DIR, staticOpts(true)));

// ─── 404 ──────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path,
    available: ['/portfolio', '/way', '/buildings', '/api/health'],
  });
});

// ─── 500 ──────────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[server error]', err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ─── Boot ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n🚀  Entraiot Connect — Unified Server');
  console.log(`    http://localhost:${PORT}/portfolio   Stage 1 — 3D Portfolio`);
  console.log(`    http://localhost:${PORT}/way         Stage 2 — Bike Scrollytelling`);
  console.log(`    http://localhost:${PORT}/buildings   Stage 3 — 3D Buildings`);
  console.log(`    http://localhost:${PORT}/api/health  Health check`);
  console.log(`    Mode: ${IS_PROD ? 'production' : 'development'}\n`);
});
