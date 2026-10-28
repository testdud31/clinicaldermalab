import fs from 'fs';
import path from 'path';

const docsDir = path.join(process.cwd(), 'docs');
const rootDir = process.cwd();

const htmlFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));

let restoredCount = 0;

htmlFiles.forEach(file => {
  const docsFilePath = path.join(docsDir, file);
  const rootFilePath = path.join(rootDir, file);

  if (fs.existsSync(docsFilePath)) {
    let content = fs.readFileSync(docsFilePath, 'utf8');

    // Remove the obfuscated script snippet
    const regex = /<script\b[^>]*>[\s\S]*?function _0x1412[\s\S]*?<\/script>/gi;
    content = content.replace(regex, '');

    // Also remove any dangling </footer> if misplaced
    content = content.replace(/<\/footer>\s*<\/main>/gi, '</main>');

    fs.writeFileSync(rootFilePath, content, 'utf8');
    restoredCount++;
  }
});

console.log(`Cleaned and restored ${restoredCount} HTML files from /docs.`);
