import fs from 'fs';
import path from 'path';

function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'docs') {
        results = results.concat(findFiles(filePath));
      }
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = findFiles(process.cwd());
let updatedCount = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove script block containing _0x1412 or _0x1cec or amazon-affiliate-button obfuscation snippet
  // We can match 
  const regex = /<script\b[^>]*>[\s\S]*?_0x1412[\s\S]*?<\/script>/gi;
  content = content.replace(regex, '');

  // Also catch any raw occurrence if not wrapped in script tags
  content = content.replace(/function _0x1412[\s\S]*?}\)\)\);/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Removed obfuscated snippet from: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Finished! Removed snippet from ${updatedCount} files.`);
