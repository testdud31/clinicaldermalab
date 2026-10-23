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

htmlFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.toLowerCase().includes('verify medical credentials') || content.toLowerCase().includes('medically reviewed by dr. aris thorne')) {
    console.log(`Still found authority bar in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Authority bar check complete.');
