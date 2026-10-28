import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(findHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = findHtmlFiles(process.cwd());

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove any custom define(window) fetch overriding script if present in html files
  const regex = /<script>\s*\(function\(\)\s*\{[\s\S]*?Object\.defineProperty\([\s\S]*?fetch[\s\S]*?\}\)\(\);\s*<\/script>/gi;
  content = content.replace(regex, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Removed fetch overriding script from: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Cleanup finished.');
