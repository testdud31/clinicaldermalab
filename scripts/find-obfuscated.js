import fs from 'fs';
import path from 'path';

function findFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        results = results.concat(findFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const files = findFiles(process.cwd());
files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('_0x1412')) {
    console.log(`Found in: ${path.relative(process.cwd(), filePath)}`);
  }
});
