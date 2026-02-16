const fs = require('fs');
const path = require('path');

// Функція для копіювання файлів
function copyFile(src, dest) {
    try {
        fs.copyFileSync(src, dest);
        console.log(`Copied: ${src} -> ${dest}`);
    } catch (error) {
        console.error(`Error copying ${src}:`, error.message);
    }
}

// Функція для створення директорії
function ensureDir(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

// Копіюємо зображення для продакшн
const srcDir = 'app/img';
const destDir = 'docs/img';

ensureDir(destDir);

// Читаємо всі файли в srcDir
const files = fs.readdirSync(srcDir);

files.forEach(file => {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);
    
    // Перевіряємо, чи це файл (не директорія)
    if (fs.statSync(srcPath).isFile()) {
        copyFile(srcPath, destPath);
    }
});

console.log('Production images copying completed!');
