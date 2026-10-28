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

  // Remove stray </footer> inside <head> or right before </head>
  content = content.replace(/<\/head>/gi, match => match); // keep
  // If </footer> appears before </head>
  const headMatch = content.match(/<head>[\s\S]*?<\/head>/i);
  if (headMatch) {
    let headContent = headMatch[0];
    if (headContent.includes('</footer>')) {
      headContent = headContent.replace(/<\/undefined>|<\/footer>/gi, '');
      content = content.replace(/<head>[\s\S]*?<\/head>/i, headContent);
    }
  }

  // Also remove obfuscated script if any remains
  const regex = /<script\b[^>]*>[\s\S]*?function _0x1412[\s\S]*?<\/script>/gi;
  content = content.replace(regex, '');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Cleaned stray tags in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log('Cleanup complete.');
