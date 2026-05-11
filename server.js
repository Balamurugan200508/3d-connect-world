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
const PORT = 3000;
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

// ─── Root ─────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.redirect('/way'));

// ══════════════════════════════════════════════════════════════════════════
// STAGE 1 — pre-built static portfolio  →  /portfolio
// ══════════════════════════════════════════════════════════════════════════
const STAGE1_DIR = path.join(__dirname, 'stage1');
const STAGE2_DIR = path.join(__dirname, 'stage2');

console.log('----------------------------------------------------');
console.log('SERVER STARTING...');
console.log('CWD:', process.cwd());
console.log('__dirname:', __dirname);
console.log('STAGE1_DIR:', STAGE1_DIR);
console.log('----------------------------------------------------');

app.use('/portfolio', express.static(STAGE1_DIR, staticOpts(true)));
app.get('/portfolio', spaFallback(STAGE1_DIR));
app.get('/portfolio/*', spaFallback(STAGE1_DIR));

// Fallback for Stage 1 dynamic imports that request /assets/* instead of /portfolio/assets/*
app.use('/assets', express.static(path.join(STAGE1_DIR, 'assets'), staticOpts(true)));

// ══════════════════════════════════════════════════════════════════════════
// STAGE 2 — Next.js standalone bike scrollytelling  →  /way
// ══════════════════════════════════════════════════════════════════════════
const NEXT_STANDALONE = path.join(__dirname, 'stage2', '.next', 'standalone');
const NEXT_STATIC     = path.join(__dirname, 'stage2', '.next', 'static');
const NEXT_PUBLIC     = path.join(__dirname, 'stage2', 'public');
const NEXT_PORT       = 3001;

if (IS_PROD && fs.existsSync(NEXT_STANDALONE)) {
  // Spawn Next.js standalone server as a child process
  const { spawn } = require('child_process');
  
  function findServerJs(dir) {
    if (!fs.existsSync(dir)) return null;
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        if (item === 'node_modules' || item === '.next') continue;
        const found = findServerJs(fullPath);
        if (found) return found;
      } else if (item === 'server.js') {
        return fullPath;
      }
    }
    return null;
  }

  let nextServerPath = path.join(NEXT_STANDALONE, 'server.js');
  if (!fs.existsSync(nextServerPath)) {
    const found = findServerJs(NEXT_STANDALONE);
    if (found) {
      nextServerPath = found;
    } else {
      console.error('[Stage 2] Could not find Next.js server.js in standalone directory!');
    }
  }

  const nextServer = spawn(
    process.execPath,
    [nextServerPath],
    {
      env: {
        ...process.env,
        PORT: String(NEXT_PORT),
        HOSTNAME: '127.0.0.1',
        NODE_ENV: 'production',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    }
  );
  nextServer.stdout.on('data', d => process.stdout.write(`[Stage 2] ${d}`));
  nextServer.stderr.on('data', d => process.stderr.write(`[Stage 2] ${d}`));
  nextServer.on('error', (err) => console.error('[Stage 2] Next.js failed to start:', err));
  process.on('exit', () => nextServer.kill());
  process.on('SIGINT', () => { nextServer.kill(); process.exit(0); });
  process.on('SIGTERM', () => { nextServer.kill(); process.exit(0); });

  // Serve Next.js static files directly (since standalone doesn't include them)
  app.use('/way/_next/static', express.static(NEXT_STATIC, staticOpts()));
  app.use('/way', express.static(NEXT_PUBLIC, staticOpts(true)));

  // Register proxy immediately — it handles connection retries automatically.
  // Express strips /way before forwarding, so pathRewrite re-adds it.
  // Next.js was built with basePath=/way so it needs the full prefix.
  app.use('/way', createProxyMiddleware({
    target: `http://127.0.0.1:${NEXT_PORT}`,
    changeOrigin: true,
    ws: true,
    pathRewrite: (reqPath) => reqPath === '/' ? '/way' : '/way' + reqPath,
    on: {
      error(err, req, res) {
        console.error('[Stage 2 proxy error]', err.message);
        if (!res.headersSent) {
          res.status(502).json({ error: 'Stage 2 (Next.js) is starting up — retry in a moment.' });
        }
      }
    }
  }));

} else if (!IS_PROD) {
  // Dev: proxy to next dev server (run separately with: cd stage2 && npm run dev)
  app.use('/way', createProxyMiddleware({
    target: `http://127.0.0.1:${NEXT_PORT}`,
    changeOrigin: true,
    ws: true,
    pathRewrite: (path) => path === '/' ? '/way' : '/way' + path,
    on: {
      error(err, req, res) {
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Stage 2 Next.js dev server not running.',
            hint: `cd stage2 && npm run dev -- --port ${NEXT_PORT}`
          });
        }
      }
    }
  }));
} else {
  // Prod but no standalone build — serve static export fallback
  const NEXT_OUT = path.join(__dirname, 'stage2', 'out');
  if (fs.existsSync(NEXT_OUT)) {
    app.use('/way', express.static(NEXT_OUT, staticOpts()));
    app.get('/way/*', spaFallback(NEXT_OUT));
  } else {
    app.use('/way', (_req, res) =>
      res.status(503).json({ error: 'Stage 2 not built. Run: cd stage2 && npm run build' })
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════
// STAGE 3 — Vite 3D buildings  →  /buildings
// ══════════════════════════════════════════════════════════════════════════
const STAGE3_DIST = path.join(__dirname, 'stage3', 'dist');
const VITE_PORT   = 3002;

if (IS_PROD && fs.existsSync(STAGE3_DIST)) {
  app.use('/buildings', express.static(STAGE3_DIST, staticOpts(true)));
  app.get('/buildings', spaFallback(STAGE3_DIST));
  app.get('/buildings/*', spaFallback(STAGE3_DIST));
} else {
  // Dev: proxy to Vite dev server
  app.use('/buildings', createProxyMiddleware({
    target: `http://127.0.0.1:${VITE_PORT}`,
    changeOrigin: true,
    ws: true,
    pathRewrite: { '^/buildings': '' },
    on: {
      error(err, req, res) {
        if (!res.headersSent) {
          res.status(502).json({
            error: 'Stage 3 Vite dev server not running.',
            hint: `cd stage3 && npx vite --port ${VITE_PORT}`
          });
        }
      }
    }
  }));
}

// ─── Global Static Fallback ───────────────────────────────────────────────
// If any file (like /temp.gltf) is requested at the root and missed by routes above,
// try to serve it from STAGE3_DIST or STAGE1_DIR before returning 404.
if (IS_PROD && fs.existsSync(STAGE3_DIST)) {
  app.use(express.static(STAGE3_DIST, staticOpts(true)));
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
