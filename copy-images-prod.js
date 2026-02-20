const fs = require('fs');
const path = require('path');

function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${path.relative('app/img', src)} -> docs/img`);
    } catch (error) {
        console.error(`Error copying ${src}:`, error.message);
    }
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function copyRecursive(srcDir, destDir) {
    if (!fs.existsSync(srcDir)) return;

    const entries = fs.readdirSync(srcDir, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(srcDir, entry.name);
        const destPath = path.join(destDir, entry.name);

        if (entry.isDirectory()) {
            ensureDir(destPath);
            copyRecursive(srcPath, destPath);
        } else {
            ensureDir(destDir);
            copyFile(srcPath, destPath);
        }
    }
}

const srcDir = 'app/img';
const destDir = 'docs/img';

ensureDir(destDir);
copyRecursive(srcDir, destDir);

console.log('Production images copying completed!');
