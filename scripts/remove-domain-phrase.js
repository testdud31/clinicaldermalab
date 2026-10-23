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
    } else if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json') || file.endsWith('.css')) {
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

  // Remove " " and variations like " ", " "
  content = content.replace(/\s*[\bull•·|-]?\s*Official domain:\s*clinicaldermalab\.ai\.studio\s*[\bull•·|-]?\s*/gi, ' ');
  content = content.replace(/Official domain:\s*clinicaldermalab\.ai\.studio/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Removed phrase from: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Finished removing phrase! Updated ${updatedCount} files.`);
