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

const files = findHtmlFiles(process.cwd());

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.toLowerCase().includes('(seo clinical faq)') || content.toLowerCase().includes('seo clinical faq')) {
    console.log(`Found match in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Verification check complete.');
