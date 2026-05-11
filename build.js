const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function copyDir(src, dest) {
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

function rmDir(dir) {
    if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

console.log('--- Starting Unified Build ---');

// 1. Build Stage 2 (Next.js)
console.log('Building Stage 2...');
execSync('cd stage2 && npm install && npm run build', { stdio: 'inherit' });

// 2. Prepare dist-vercel
const distDir = path.join(__dirname, 'dist-vercel');
console.log(`Preparing ${distDir}...`);
rmDir(distDir);
fs.mkdirSync(path.join(distDir, 'portfolio'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'way'), { recursive: true });
fs.mkdirSync(path.join(distDir, 'buildings'), { recursive: true });

// 3. Copy Stage 1 (Portfolio)
console.log('Copying Stage 1...');
copyDir(path.join(__dirname, 'stage1'), path.join(distDir, 'portfolio'));

// 4. Copy Stage 2 (Way)
console.log('Copying Stage 2...');
copyDir(path.join(__dirname, 'stage2', 'out'), path.join(distDir, 'way'));

// 5. Copy Animation Assets into Way/sequence
console.log('Injecting Animation Assets...');
const sequenceDir = path.join(distDir, 'way', 'sequence');
rmDir(sequenceDir);
copyDir(path.join(__dirname, 'animation-assets'), sequenceDir);

// 6. Copy Stage 3 (Buildings)
console.log('Copying Stage 3...');
if (fs.existsSync(path.join(__dirname, 'stage3', 'dist'))) {
    copyDir(path.join(__dirname, 'stage3', 'dist'), path.join(distDir, 'buildings'));
} else {
    console.warn('Warning: stage3/dist not found!');
}

// 7. Create root index redirect
console.log('Creating redirect index...');
const redirectHtml = `<html><head><meta http-equiv="refresh" content="0;url=/way/"><script>window.location.href="/way/"</script></head><body></body></html>`;
fs.writeFileSync(path.join(distDir, 'index.html'), redirectHtml);

console.log('--- Build Complete ---');
