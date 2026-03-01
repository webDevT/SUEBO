/**
 * Build-time script: scans app/src/*.html and generates js/search-index.json
 * for client-side site search. Extracts first <h1> as title and uses filename as url.
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'app', 'src');
const OUT_FILE = path.join(__dirname, 'app', 'js', 'search-index.json');

// Human-readable title from filename (fallback when no h1)
function titleFromFilename(filename) {
	const name = filename.replace(/\.html$/, '');
	return name
		.split(/[-_]/)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
		.join(' ')
		.replace(/Index/g, 'Home');
}

// Extract first h1 text from HTML (strip inner tags)
function extractH1(html) {
	const match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
	if (!match) return null;
	const inner = match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
	return inner || null;
}

const pages = [];
const files = fs.readdirSync(SRC_DIR)
	.filter((f) => f.endsWith('.html'))
	.filter((f) => f !== '404.html');

// Optional: add extra words so page is findable by these terms (e.g. "Kontakte" for kontakte.html)
const titlePrefix = {
	'kontakte.html': 'Kontakte – '
};

for (const file of files) {
	const filePath = path.join(SRC_DIR, file);
	const html = fs.readFileSync(filePath, 'utf8');
	let title = extractH1(html) || titleFromFilename(file);
	if (titlePrefix[file]) title = titlePrefix[file] + title;
	pages.push({
		url: file,
		title: title
	});
}

// Sort: index first, then alphabetically by title
pages.sort((a, b) => {
	if (a.url === 'index.html') return -1;
	if (b.url === 'index.html') return 1;
	return a.title.localeCompare(b.title, 'de');
});

const outDir = path.dirname(OUT_FILE);
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(OUT_FILE, JSON.stringify({ pages }, null, 0), 'utf8');
console.log('Search index written:', OUT_FILE, `(${pages.length} pages)`);
