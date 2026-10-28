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
let fixedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace stray footer tags inside head
  content = content.replace(/<!-- Google tag \(gtag\.js\) -->\s*<\/undefined>|<!-- Google tag \(gtag\.js\) -->\s*<\/footer>/gi, `<!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CJ42JELK21"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-CJ42JELK21');
  </script>
</head>`);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log(`Fixed head in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Fixed ${fixedCount} HTML files.`);
