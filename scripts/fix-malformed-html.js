import fs from 'fs';
import path from 'path';

function fixMalformedHtml(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        count += fixMalformedHtml(filePath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      // Remove stray </head> or </footer> inside <head>
      // For instance, if </head> or </footer> appears before </head> or inside head
      content = content.replace(/<head>([\s\S]*?)<\/head>/gi, (match, headInner) => {
        // Clean headInner of stray </footer> or </head>
        let cleanedInner = headInner.replace(/<\/footer>/gi, '').replace(/<\/head>/gi, '');
        return `<head>${cleanedInner}</head>`;
      });

      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed malformed tags in: ${path.relative(process.cwd(), filePath)}`);
        count++;
      }
    }
  });
  return count;
}

const fixed = fixMalformedHtml(process.cwd());
console.log(`Fixed malformed HTML in ${fixed} files.`);
