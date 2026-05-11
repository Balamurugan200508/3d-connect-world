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

function rmDir(dir) {
    if (fs.existsSync(dir)) {
        console.log(`[Clean] Removing ${dir}`);
        fs.rmSync(dir, { recursive: true, force: true });
    }
}

console.log('--- STARTING UNIFIED BUILD ---');
console.log('CWD:', process.cwd());
console.log('DIRNAME:', __dirname);

try {
    // 1. Build Stage 2 (Next.js)
    console.log('Step 1: Building Stage 2...');
    execSync('cd stage2 && npm install && npm run build', { stdio: 'inherit' });

    // 2. Prepare dist-vercel
    const distDir = path.join(__dirname, 'dist-vercel');
    console.log(`Step 2: Preparing ${distDir}...`);
    rmDir(distDir);
    fs.mkdirSync(path.join(distDir, 'portfolio'), { recursive: true });
    fs.mkdirSync(path.join(distDir, 'way'), { recursive: true });
    fs.mkdirSync(path.join(distDir, 'buildings'), { recursive: true });

    // 3. Copy Stage 1 (Portfolio)
    console.log('Step 3: Copying Stage 1...');
    copyDir(path.join(__dirname, 'stage1'), path.join(distDir, 'portfolio'));

    // 4. Copy Stage 2 (Way)
    console.log('Step 4: Copying Stage 2...');
    const stage2Out = path.join(__dirname, 'stage2', 'out');
    if (fs.existsSync(stage2Out)) {
        copyDir(stage2Out, path.join(distDir, 'way'));
    } else {
        console.error('ERROR: stage2/out does not exist after build!');
    }

    // 5. Copy Animation Assets into Way/sequence
    console.log('Step 5: Injecting Animation Assets...');
    const animSrc = path.join(__dirname, 'animation-assets');
    const animDest = path.join(distDir, 'way', 'sequence');
    copyDir(animSrc, animDest);

    // 6. Copy Stage 3 (Buildings)
    console.log('Step 6: Copying Stage 3...');
    const stage3Dist = path.join(__dirname, 'stage3', 'dist');
    if (fs.existsSync(stage3Dist)) {
        copyDir(stage3Dist, path.join(distDir, 'buildings'));
    } else {
        console.warn('Warning: stage3/dist not found!');
    }

    // 7. Create root index redirect
    console.log('Step 7: Creating redirect index...');
    const redirectHtml = `<html><head><meta http-equiv="refresh" content="0;url=/way/"><script>window.location.href="/way/"</script></head><body></body></html>`;
    fs.writeFileSync(path.join(distDir, 'index.html'), redirectHtml);

    console.log('--- BUILD COMPLETE ---');
    console.log('Final dist-vercel content:', fs.readdirSync(distDir));

} catch (err) {
    console.error('BUILD FAILED!');
    console.error(err);
    process.exit(1);
}
