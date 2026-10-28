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
let foundCount = 0;

files.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('_0x1412') || content.includes('_0x1cec')) {
    console.log(`Found snippet in: ${path.relative(process.cwd(), filePath)}`);
    foundCount++;
  }
});

console.log(`Verification complete. Found in ${foundCount} files.`);
