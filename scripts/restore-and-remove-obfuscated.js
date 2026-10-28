import fs from 'fs';
import path from 'path';

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursive(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const docsDir = path.join(process.cwd(), 'docs');
const rootDir = process.cwd();

// 1. Copy everything from docs/ to root
console.log('Restoring files from /docs...');
fs.readdirSync(docsDir).forEach(item => {
  if (item === '.' || item === '..') return;
  const srcPath = path.join(docsDir, item);
  const destPath = path.join(rootDir, item);
  copyRecursive(srcPath, destPath);
});
console.log('Restoration complete.');

// 2. Function to recursively find all HTML files and remove obfuscated script
function processHtmlFiles(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'docs') {
        count += processHtmlFiles(filePath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      // Precise regex for the obfuscated script block containing _0x1412
      const obfuscatedRegex = /<script\b[^>]*>[\s\S]*?_0x1412[\s\S]*?<\/script>/gi;
      content = content.replace(obfuscatedRegex, '');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed obfuscated script from: ${path.relative(rootDir, filePath)}`);
        count++;
      }
    }
  });
  return count;
}

const cleanedCount = processHtmlFiles(rootDir);
console.log(`Successfully cleaned obfuscated script from ${cleanedCount} HTML files.`);
