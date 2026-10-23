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
let removedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove <section id="clinical-framework" ...> ... </section> or class="clinical-framework-section"
  content = content.replace(/<!--[\s\S]*?4-Pillar Clinical Evaluation Framework[\s\S]*?-->/gi, '');
  content = content.replace(/<section[^>]*id="clinical-framework"[\s\S]*?<\/section>/gi, '');
  content = content.replace(/<section[^>]*class="clinical-framework-section"[\s\S]*?<\/section>/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    removedCount++;
    console.log(`Removed clinical-framework section from: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Finished! Removed section from ${removedCount} HTML files.`);
