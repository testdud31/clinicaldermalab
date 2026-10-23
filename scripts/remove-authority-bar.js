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
let count = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove <div class="clinical-authority-bar" ...> ... </div>
  content = content.replace(/<div[^>]*class="clinical-authority-bar"[\s\S]*?<\/div>/gi, '');
  // Also match any leftover authority bar blocks containing "Medically Reviewed by" or "Verify Medical Credentials"
  content = content.replace(/<div[^>]*>[\s\S]*?Medically Reviewed by[\s\S]*?Verify Medical Credentials[\s\S]*?<\/div>/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Removed authority bar from: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Finished removing authority bar! Updated ${count} HTML files.`);
