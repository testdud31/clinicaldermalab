import fs from 'fs';
import path from 'path';

const allHtmlFiles = fs.readdirSync(process.cwd()).filter(f => f.endsWith('.html'));

allHtmlFiles.forEach(file => {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const footerColMatch = content.match(/<div class="footer-col"[\s\S]*?Product Reviews[\s\S]*?<\/ul>\s*<\/div>/i);
  if (footerColMatch) {
    console.log(`=== ${file} ===`);
    console.log(footerColMatch[0]);
  }
});
