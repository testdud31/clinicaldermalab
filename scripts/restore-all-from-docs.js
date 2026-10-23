import fs from 'fs';
import path from 'path';

const docsDir = path.join(process.cwd(), 'docs');
const rootDir = process.cwd();

const htmlFiles = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));

let restoredCount = 0;

htmlFiles.forEach(file => {
  const docsFilePath = path.join(docsDir, file);
  const rootFilePath = path.join(rootDir, file);

  if (fs.existsSync(docsFilePath)) {
    let content = fs.readFileSync(docsFilePath, 'utf8');

    // Remove <div class="clinical-authority-bar" ...> ... </div>
    // Specifically target <div class="clinical-authority-bar"> up to </div> of authority-bar
    content = content.replace(/<div[^>]*class="clinical-authority-bar"[\s\S]*?<\/div>\s*<\/div>/gi, '');

    // Remove 4-pillar framework <section id="clinical-framework" ...> ... </section>
    content = content.replace(/<section[^>]*id="clinical-framework"[\s\S]*?<\/section>/gi, '');

    fs.writeFileSync(rootFilePath, content, 'utf8');
    restoredCount++;
  }
});

console.log(`Restored and cleaned ${restoredCount} HTML files from /docs.`);
