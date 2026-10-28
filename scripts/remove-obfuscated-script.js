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
let count = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove the obfuscated script snippet matching function _0x1412 or similar _0x1cec patterns
  const regex = /<script\b[^>]*>[\s\S]*?function _0x1412[\s\S]*?<\/script>/gi;
  content = content.replace(regex, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Removed obfuscated script from: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Finished! Removed obfuscated script from ${count} HTML files.`);
