// Import required modules
const gulp = require('gulp');
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

// Copy static assets
const copyAssets = () => {
    const copyFiles = gulp.src(['app/css/**/*', 'app/js/**/*', 'app/fonts/**/*'], { base: 'app' })
        .pipe(gulp.dest('app/temp/'));
    
    return copyFiles;
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

// Copy images for production build
const copyImagesProd = () => {
    const { execSync } = require('child_process');
    try {
        // Змінюємо шлях для продакшн збирання
        execSync('node copy-images-prod.js', { stdio: 'inherit' });
        console.log('Images copied to docs successfully without gulp processing');
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
    gulp.watch(['app/css/**/*', 'app/js/**/*', 'app/fonts/**/*'], copyAssets);
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

    const buildJs = gulp.src('app/js/**/*.js')
        .pipe(gulp.dest('docs/js'));

    const buildFonts = gulp.src('app/fonts/**/*.*')
        .pipe(gulp.dest('docs/fonts'));

    // Copy images
    const buildImg = copyImagesProd();

    // Copy .htaccess file
    const buildHtaccess = gulp.src('.htaccess', { allowEmpty: true })
        .pipe(gulp.dest('docs'));

    return Promise.all([buildHtml, buildCss, buildJs, buildFonts, buildImg, buildHtaccess]);
};

// Build task
const build = gulp.series(clean, exportBuild);

// Development task
const dev = gulp.series(
    cleanTemp,
    compileCSS,
    compileSass,
    compileJS,
    copyAssets,
    copyImages,
    processHTML,
    gulp.parallel(serve, watch)
);

// Export tasks
exports.clean = clean;
exports.cleanTemp = cleanTemp;
exports.sass = compileSass;
exports.css = compileCSS;
exports.js = compileJS;
exports.html = processHTML;
exports.script = processJS;
exports.copyAssets = copyAssets;
exports.copyImages = copyImages;
exports.serve = serve;
exports.watch = watch;
exports.export = exportBuild;
exports.build = build;
exports.dev = dev;
exports.default = dev;