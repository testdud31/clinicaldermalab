import fs from 'fs';
import path from 'path';

function removeStrayFooterInHead(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        count += removeStrayFooterInHead(filePath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      // Replace </footer> inside head or before </head>
      content = content.replace(/(<head>[\s\S]*?)<\/footer>/gi, '$1');

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed stray </footer> from: ${path.relative(process.cwd(), filePath)}`);
        count++;
      }
    }
  });
  return count;
}

const count = removeStrayFooterInHead(process.cwd());
console.log(`Removed stray </footer> from ${count} files.`);
