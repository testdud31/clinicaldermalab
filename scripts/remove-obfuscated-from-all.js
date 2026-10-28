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

// 1. Copy from docs/ to root to start clean
console.log('Restoring root files from /docs...');
fs.readdirSync(docsDir).forEach(item => {
  if (item === '.' || item === '..') return;
  const srcPath = path.join(docsDir, item);
  const destPath = path.join(rootDir, item);
  copyRecursive(srcPath, destPath);
});
console.log('Restoration complete.');

// 2. Remove obfuscated script from a directory (both root and docs)
function cleanDirectory(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        count += cleanDirectory(filePath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      // Precise regex matching <script> ... _0x1412 ... </script>
      // We make sure it doesn't match greedy across multiple tags by being specific
      const regex = /<script\b[^>]*>[\s\S]*?_0x1412[\s\S]*?<\/script>/gi;
      content = content.replace(regex, '');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned obfuscated script in: ${path.relative(rootDir, filePath)}`);
        count++;
      }
    }
  });
  return count;
}

console.log('Cleaning root HTML files...');
const rootCleaned = cleanDirectory(rootDir);
console.log(`Cleaned ${rootCleaned} files.`);
