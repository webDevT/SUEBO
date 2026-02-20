const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${src} -> ${dest}`);
    } catch (error) {
        console.error(`Error copying ${src}:`, error.message);
    }
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

const srcDir = 'app/img';
const destDir = 'app/temp/img';

ensureDir(destDir);

const files = fs.readdirSync(srcDir);

files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    if (fs.statSync(srcPath).isFile()) {
        copyFile(srcPath, destPath);
    }
});

console.log('Image copying completed!');
