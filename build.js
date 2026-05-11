const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyDir(src, dest) {
    console.log(`[Copy] ${src} -> ${dest}`);
    if (!fs.existsSync(src)) {
        console.warn(`[Warning] Source does not exist: ${src}`);
        return;
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('--- STARTING RESILIENT BUILD ---');
const distDir = path.join(__dirname, 'dist-vercel');

// Only clean if it's NOT already populated by Git
if (!fs.existsSync(path.join(distDir, 'portfolio'))) {
    console.log('dist-vercel/portfolio missing, creating structure...');
    fs.mkdirSync(path.join(distDir, 'portfolio'), { recursive: true });
    fs.mkdirSync(path.join(distDir, 'way'), { recursive: true });
    fs.mkdirSync(path.join(distDir, 'buildings'), { recursive: true });
} else {
    console.log('dist-vercel already exists from Git, skipping destructive clean.');
}

try {
    // Attempt build but don't crash if it fails (since we have Git fallback)
    console.log('Attempting Stage 2 build...');
    try {
        execSync('cd stage2 && npm install && npm run build', { stdio: 'inherit' });
        console.log('Copying Stage 2 build output...');
        const stage2Out = path.join(__dirname, 'stage2', 'out');
        if (fs.existsSync(stage2Out)) {
            copyDir(stage2Out, path.join(distDir, 'way'));
        }
    } catch (e) {
        console.warn('Stage 2 build failed, using Git fallback files.');
    }

    // Ensure animation assets are present
    console.log('Ensuring animation assets...');
    const animSrc = path.join(__dirname, 'animation-assets');
    const animDest = path.join(distDir, 'way', 'sequence');
    if (!fs.existsSync(path.join(animDest, 'index.json'))) {
        copyDir(animSrc, animDest);
    }

    console.log('--- BUILD STEP COMPLETE ---');
} catch (err) {
    console.error('Critical Build Error:', err);
}
