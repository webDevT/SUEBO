const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const inputDir = 'app/img';
const outputDir = 'app/img';
const quality = 80; // WebP quality (0-100)

// Check if cwebp is available
function checkCwebp() {
    try {
        execSync('cwebp -version', { stdio: 'ignore' });
        return true;
    } catch (error) {
        console.log('❌ cwebp not found. Please install WebP tools:');
        console.log('   Windows: Download from https://developers.google.com/speed/webp/download');
        console.log('   macOS: brew install webp');
        console.log('   Linux: sudo apt-get install webp');
        return false;
    }
}

// Convert single image to WebP
function convertToWebP(inputPath, outputPath, quality = 80) {
    try {
        const command = `cwebp -q ${quality} "${inputPath}" -o "${outputPath}"`;
        execSync(command, { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.error(`❌ Failed to convert ${inputPath}:`, error.message);
        return false;
    }
}

// Get file size in KB
function getFileSize(filePath) {
    try {
        const stats = fs.statSync(filePath);
        return Math.round(stats.size / 1024 * 100) / 100;
    } catch (error) {
        return 0;
    }
}

// Main conversion function
function convertImages() {
    console.log('🚀 Starting image conversion to WebP...\n');

    if (!checkCwebp()) {
        return;
    }

    const imageExtensions = ['.png', '.jpg', '.jpeg'];
    const convertedFiles = [];
    let totalOriginalSize = 0;
    let totalWebPSize = 0;

    // Read all files in the input directory
    const files = fs.readdirSync(inputDir);

    for (const file of files) {
        const filePath = path.join(inputDir, file);
        const ext = path.extname(file).toLowerCase();

        // Check if it's an image file
        if (imageExtensions.includes(ext)) {
            const webpFile = path.basename(file, ext) + '.webp';
            const webpPath = path.join(outputDir, webpFile);

            // Skip if WebP already exists
            if (fs.existsSync(webpPath)) {
                console.log(`⏭️  Skipping ${file} (WebP already exists)`);
                continue;
            }

            console.log(`🔄 Converting ${file}...`);

            const originalSize = getFileSize(filePath);
            totalOriginalSize += originalSize;

            if (convertToWebP(filePath, webpPath, quality)) {
                const webpSize = getFileSize(webpPath);
                totalWebPSize += webpSize;
                const savings = originalSize - webpSize;
                const savingsPercent = Math.round((savings / originalSize) * 100);

                console.log(`✅ ${file} → ${webpFile}`);
                console.log(`   Size: ${originalSize}KB → ${webpSize}KB (${savingsPercent}% saved)`);
                
                convertedFiles.push({
                    original: file,
                    webp: webpFile,
                    originalSize,
                    webpSize,
                    savings,
                    savingsPercent
                });
            }
        }
    }

    // Summary
    console.log('\n📊 Conversion Summary:');
    console.log(`   Files converted: ${convertedFiles.length}`);
    console.log(`   Total original size: ${totalOriginalSize.toFixed(2)}KB`);
    console.log(`   Total WebP size: ${totalWebPSize.toFixed(2)}KB`);
    console.log(`   Total savings: ${(totalOriginalSize - totalWebPSize).toFixed(2)}KB`);
    console.log(`   Average savings: ${Math.round(((totalOriginalSize - totalWebPSize) / totalOriginalSize) * 100)}%`);

    // Generate HTML update suggestions
    if (convertedFiles.length > 0) {
        console.log('\n📝 HTML Update Suggestions:');
        console.log('Add these <picture> elements to your HTML:');
        console.log('');

        convertedFiles.forEach(file => {
            console.log(`<!-- ${file.original} (${file.savingsPercent}% smaller) -->`);
            console.log(`<picture>`);
            console.log(`  <source srcset="img/${file.webp}" type="image/webp">`);
            console.log(`  <img src="img/${file.original}" alt="...">`);
            console.log(`</picture>`);
            console.log('');
        });
    }

    console.log('🎉 Conversion complete!');
}

// Run the conversion
convertImages();
