import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
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
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove any loose </footer> that appears inside head or right before body close without opening footer
  // Or simply remove any </footer> that is not preceded by <footer
  // For safety, let's remove </footer> when it's inside </head> ... </head> or near the top
  content = content.replace(/(<head>[\s\S]*?)<\/footer>/gi, '$1');
  content = content.replace(/<\/undefined>/gi, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned loose footer tag in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Loose tag cleanup complete.');
