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
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = findFiles(process.cwd());

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.toLowerCase().includes('official domain')) {
    console.log(`Found match in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Domain verification complete.');
