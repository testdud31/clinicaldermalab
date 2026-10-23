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
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.xml') || file.endsWith('.txt')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = findFiles(process.cwd());
let count = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace https://www.clinicaldermalab.io -> https://www.clinicaldermalab.io
  content = content.replace(/https:\/\/clinicaldermalab\.ai\.studio/g, 'https://www.clinicaldermalab.io');

  // Replace www.clinicaldermalab.io -> www.clinicaldermalab.io (if any remain)
  content = content.replace(/clinicaldermalab\.ai\.studio/g, 'www.clinicaldermalab.io');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Updated domain in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Finished domain update! Updated ${count} files.`);
