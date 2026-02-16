# 🎉 Top Glow - Modular Header/Footer System

## ✅ Problem Solved! System Works Stable

This project uses a **modular header and footer system** that allows you to edit them in one place and automatically update on all pages **WITHOUT infinite loops**.

## 🏗️ Project Structure

```
app/
├── includes/              ← 🎯 EDIT HERE
│   ├── header.html        ← Common header for all pages
│   └── footer.html        ← Common footer for all pages
├── src/                   ← 📝 SOURCE FILES (with @@include)
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   └── contact.html
├── temp/                  ← 🚫 PROCESSED FILES (DON'T EDIT!)
│   ├── index.html
│   ├── about.html
│   └── ...
├── css/                   ← CSS files
├── js/                    ← JavaScript files
├── img/                   ← Images
└── fonts/                 ← Fonts
```

## 🎯 How It Works

1. **You edit** `app/includes/header.html` or `app/includes/footer.html`
2. **You edit** `app/src/index.html`, `app/src/about.html`, etc.
3. **Gulp automatically** processes files from `app/src/` and saves result in `app/temp/`
4. **Browser-sync** shows updates from `app/temp/` folder
5. **Changes appear** on all pages automatically!

## 🚀 Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start
# or
gulp

# Build for production
npm run build
# or
gulp build

# Process HTML only
gulp html

# Copy static files
gulp copy-assets
```

## 📝 How to Edit

### ✅ CORRECT - Edit these files:

**To change header:**
- Open `app/includes/header.html`
- Make changes (navigation, logo, meta tags)
- Changes automatically appear on all pages

**To change footer:**
- Open `app/includes/footer.html`
- Make changes (contacts, social links, copyright)
- Changes automatically appear on all pages

**To change page content:**
- Open `app/src/index.html`, `app/src/about.html`, etc.
- Add your content between `@@include()` tags

### ❌ DON'T EDIT:
- Files in `app/temp/` folder - they are generated automatically!

## 📄 Adding New Pages

1. Create new file in `app/src/` folder, e.g. `app/src/new-page.html`
2. Add at the beginning: `@@include('includes/header.html')`
3. Add at the end: `@@include('includes/footer.html')`
4. Add your page content between them

**Example:**
```html
@@include('includes/header.html')

<!-- Your content here -->
<h1>New Page</h1>
<p>Your page content</p>

@@include('includes/footer.html')
```

5. Run `npm run dev` or `gulp`
6. File will appear in `app/temp/new-page.html`

## 🔧 Technical Details

### Technologies used:
- **Gulp 4** - for build automation
- **gulp-file-include** - for module inclusion
- **Browser-sync** - for automatic browser refresh
- **Bootstrap 5** - for styling
- **Sass** - for CSS preprocessing

### Gulp Configuration:
- **Source files:** `app/src/*.html`
- **Processed files:** `app/temp/*.html`
- **Header/Footer:** `app/includes/*.html`
- **Static files:** copied to `app/temp/`

## 🎉 Benefits of Fixed System

- ✅ **No infinite loops** - problem completely solved
- ✅ **Fast work** - files processed only on changes
- ✅ **Safety** - source files are not overwritten
- ✅ **Convenience** - change header/footer once → all pages updated
- ✅ **Automatic** - browser-sync shows changes instantly
- ✅ **Modular** - easy to add new pages
- ✅ **Consistent** - same header and footer on all pages

## 🐛 Solved Problems

### Problem: Infinite Loop
**Cause:** fileinclude plugin with `basepath: '@file'` setting was overwriting source files

**Solution:** 
- Created separate `app/src/` folder for source files
- Changed `basepath` to `'app/'` instead of `'@file'`
- Gulp now processes files from `app/src/` and saves result in `app/temp/`

## 📚 Additional Resources

- [Gulp Documentation](https://gulpjs.com/docs/en/getting-started/quick-start)
- [gulp-file-include](https://www.npmjs.com/package/gulp-file-include)
- [Browser-sync](https://browsersync.io/docs)

## 🎯 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start project
npm run dev

# 3. Open browser at http://localhost:3000
# 4. Edit app/includes/header.html or app/includes/footer.html
# 5. See changes automatically in browser!
```

**Ready to use!** 🚀