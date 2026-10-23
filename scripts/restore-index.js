import fs from 'fs';
import path from 'path';

const srcPath = path.join(process.cwd(), 'docs', 'index.html');
const destPath = path.join(process.cwd(), 'index.html');

let content = fs.readFileSync(srcPath, 'utf8');

// Remove authority bar if present
content = content.replace(/<div[^>]*class="clinical-authority-bar"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/gi, '');

// Remove 4-pillar framework section if present
content = content.replace(/<section[^>]*id="clinical-framework"[\s\S]*?<\/section>/gi, '');
content = content.replace(/<section[^>]*class="clinical-framework-section"[\s\S]*?<\/section>/gi, '');

fs.writeFileSync(destPath, content, 'utf8');
console.log('Restored index.html from docs/index.html cleanly!');
