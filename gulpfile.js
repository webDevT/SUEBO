// Import required modules
const gulp = require('gulp');
const fs = require('fs');
const path = require('path');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const fileinclude = require('gulp-file-include');
const { spawn } = require('child_process');

// Clean tasks
const clean = async () => {
    await del('docs');
};

const cleanTemp = async () => {
    await del('app/temp');
};

// Sass compilation
const compileSass = () => {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 8 versions']
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'));
};

// CSS libraries compilation
const compileCSS = () => {
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/slick-carousel/slick/slick.css'
    ])
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('libs.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'));
};

// Generate search index for client-side site search
const buildSearchIndex = (done) => {
    const { execSync } = require('child_process');
    try {
        execSync('node build-search-index.js', { stdio: 'inherit', cwd: __dirname });
    } catch (e) {
        done(e);
        return;
    }
    done();
};

// HTML processing with file includes
const processHTML = () => {
    return gulp.src('app/src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app/'
        }))
        .pipe(gulp.dest('app/temp/'));
};

// JavaScript processing
const processJS = () => {
    return gulp.src('app/js/*.js')
        .pipe(gulp.dest('app/temp/js/'));
};


const compileJS = () => {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/slick-carousel/slick/slick.min.js'
    ])
        .pipe(concat('libs.js'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/js'));
};

const copyFonts = (done) => {
    const fontFiles = [
        'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff2',
        'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff',
        'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff2',
        'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff',
        'node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2',
        'node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff',
        'node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff2',
        'node_modules/@fontsource/manrope/files/manrope-latin-500-normal.woff',
        'node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2',
        'node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff',
        'node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2',
        'node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff',
        'node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff2',
        'node_modules/@fontsource/poppins/files/poppins-latin-400-normal.woff',
        'node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff2',
        'node_modules/@fontsource/poppins/files/poppins-latin-500-normal.woff',
        'node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff2',
        'node_modules/@fontsource/poppins/files/poppins-latin-600-normal.woff',
        'node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff2',
        'node_modules/@fontsource/poppins/files/poppins-latin-700-normal.woff'
    ];
    const outDir = path.join(__dirname, 'app', 'fonts');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    fontFiles.forEach((file) => {
        const src = path.join(__dirname, file);
        const name = path.basename(file);
        const dest = path.join(outDir, name);
        if (fs.existsSync(src)) fs.copyFileSync(src, dest);
    });
    done();
};

const copyFontsToTemp = (done) => {
    const srcDir = path.join(__dirname, 'app', 'fonts');
    const destDir = path.join(__dirname, 'app', 'temp', 'fonts');
    if (!fs.existsSync(srcDir)) { done(); return; }
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
    fs.readdirSync(srcDir).forEach((name) => {
        fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
    });
    done();
};

const copyAssets = () => {
    return gulp.src(['app/css/**/*', 'app/js/**/*'], { base: 'app' })
        .pipe(gulp.dest('app/temp/'));
};

// Copy images separately without processing
const copyImages = () => {
    const { execSync } = require('child_process');
    try {
        execSync('node copy-images.js', { stdio: 'inherit' });
        console.log('Images copied successfully without gulp processing');
    } catch (error) {
        console.error('Error copying images:', error.message);
    }
    return Promise.resolve();
};

// Convert PNG/JPG/JPEG to WebP before production build
const convertImages = () => {
    const { convertImages: runConvert } = require('./convert-images.js');
    return runConvert('app/img', 'app/img');
};

// Copy images for production build
const copyImagesProd = () => {
    const { execSync } = require('child_process');
    try {
        execSync('node copy-images-prod.js', { stdio: 'inherit' });
        console.log('Images copied to docs successfully');
    } catch (error) {
        console.error('Error copying images to docs:', error.message);
    }
    return Promise.resolve();
};

// Start live server
const serve = () => {
    const liveServer = spawn('npx', ['live-server', 'app/temp', '--port=3000', '--open=/'], {
        stdio: 'inherit',
        shell: true
    });
    
    liveServer.on('error', (err) => {
        console.error('Failed to start live-server:', err);
    });
    
    return liveServer;
};

// Watch for changes
const watch = () => {
    gulp.watch('app/sass/**/*.scss', compileSass);
    gulp.watch('app/src/*.html', processHTML);
    gulp.watch('app/includes/**/*.html', processHTML);
    gulp.watch('app/js/*.js', processJS);
    gulp.watch(['app/css/**/*', 'app/js/**/*'], copyAssets);
    gulp.watch('app/fonts/**/*', copyFontsToTemp);
    gulp.watch('app/img/**/*', copyImages);
};

// Export task for production build with caching
const exportBuild = () => {
    const buildHtml = gulp.src('app/src/*.html')
        .pipe(fileinclude({
            prefix: '@@',
            basepath: 'app/'
        }))
        .pipe(gulp.dest('docs'));

    const buildCss = gulp.src('app/css/**/*.css')
        .pipe(gulp.dest('docs/css'));

    const buildJs = gulp.src(['app/js/**/*.js', 'app/js/**/*.json'])
        .pipe(gulp.dest('docs/js'));

    const buildFonts = () => {
        const srcDir = path.join(__dirname, 'app', 'fonts');
        const destDir = path.join(__dirname, 'docs', 'fonts');
        if (!fs.existsSync(srcDir)) return Promise.resolve();
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        fs.readdirSync(srcDir).forEach((name) => {
            fs.copyFileSync(path.join(srcDir, name), path.join(destDir, name));
        });
        return Promise.resolve();
    };

    const buildImg = copyImagesProd();
    const buildHtaccess = gulp.src('.htaccess', { allowEmpty: true })
        .pipe(gulp.dest('docs'));

    return Promise.all([buildHtml, buildCss, buildJs, buildFonts(), buildImg, buildHtaccess]);
};

const build = gulp.series(clean, buildSearchIndex, convertImages, copyFonts, exportBuild);

// Development task
const dev = gulp.series(
    cleanTemp,
    buildSearchIndex,
    compileCSS,
    compileSass,
    copyFonts,
    copyFontsToTemp,
    compileJS,
    copyAssets,
    copyImages,
    processHTML,
    gulp.parallel(serve, watch)
);

// Export tasks
exports.clean = clean;
exports.cleanTemp = cleanTemp;
exports.buildSearchIndex = buildSearchIndex;
exports.sass = compileSass;
exports.css = compileCSS;
exports.js = compileJS;
exports.html = processHTML;
exports.script = processJS;
exports.copyFonts = copyFonts;
exports.copyFontsToTemp = copyFontsToTemp;
exports.copyAssets = copyAssets;
exports.convertImages = convertImages;
exports.copyImages = copyImages;
exports.serve = serve;
exports.watch = watch;
exports.export = exportBuild;
exports.build = build;
exports.dev = dev;
exports.default = dev;