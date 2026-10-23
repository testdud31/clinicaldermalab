import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'docs') {
        results = results.concat(findHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = findHtmlFiles(process.cwd());
let updatedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove <div class="clinical-authority-bar"> ... </div> safely using DOM-like closing tag match or specific class
  // Match specifically <div class="clinical-authority-bar" ...> up to its closing </div>
  content = content.replace(/<div[^>]*class="clinical-authority-bar"[\s\S]*?<\/button>\s*<\/div>\s*<\/div>/gi, '');
  content = content.replace(/<div[^>]*class="clinical-authority-bar"[\s\S]*?<\/div>\s*<\/div>/gi, '');

  // 2. Remove <section id="clinical-framework" ...> ... </section> safely
  content = content.replace(/<section[^>]*id="clinical-framework"[\s\S]*?<\/section>/gi, '');
  content = content.replace(/<section[^>]*class="clinical-framework-section"[\s\S]*?<\/section>/gi, '');

  // Clean any leftover comments referencing 4-Pillar
  content = content.replace(/<!--[\s\S]*?4-Pillar Clinical Evaluation Framework[\s\S]*?-->/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Done! Updated ${updatedCount} files.`);
