import fs from 'fs';
import path from 'path';

function fixGtagInDir(dir) {
  let count = 0;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        count += fixGtagInDir(filePath);
      }
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let original = content;

      const targetPattern = /<!-- Google tag \(gtag\.js\) -->\s*<\/footer>/gi;
      const replacement = `<!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-CJ42JELK21"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-CJ42JELK21');
  </script>`;

      content = content.replace(targetPattern, replacement);

      // Also clean up any other stray </footer> inside head if any
      if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed gtag in: ${path.relative(process.cwd(), filePath)}`);
        count++;
      }
    }
  });
  return count;
}

const fixed = fixGtagInDir(process.cwd());
console.log(`Fixed gtag in ${fixed} files.`);
