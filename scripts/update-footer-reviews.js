import fs from 'fs';
import path from 'path';

function findHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist' && file !== 'docs') {
        results = results.concat(findHtmlFiles(filePath));
      }
    } else if (file.endsWith('.html')) {
      results.push(filePath);
    }
  });
  return results;
}

const htmlFiles = findHtmlFiles(process.cwd());
console.log(`Found ${htmlFiles.length} HTML files.`);

const newFooterColHtml = `      <div class="footer-col">
        <h4>Product Reviews</h4>
        <ul>
          <li><a href="/blog.html">All Reviews Directory &rarr;</a></li>
          <li><a href="/youth-to-the-people-supershroom-facial-cleanser-review.html">YTTP Supershroom Cleanser</a></li>
          <li><a href="/youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html">YTTP Adaptogen Peptide Cream</a></li>
          <li><a href="/youth-to-the-people-superfood-air-whip-moisture-cream-review.html">YTTP Superfood Air-Whip Cream</a></li>
          <li><a href="/youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html">YTTP Superberry Dream Mask</a></li>
        </ul>
      </div>`;

let updatedCount = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace <div class="footer-col"> <h4>Product Reviews</h4> ... </div>
  const footerColRegex = /<div class="footer-col">\s*<h4>Product Reviews<\/h4>[\s\S]*?<\/div>/i;

  if (footerColRegex.test(content)) {
    content = content.replace(footerColRegex, newFooterColHtml);
  } else {
    // Try matching if heading is Product Reviews or Reviews Directory
    const altRegex = /<div class="footer-col">\s*<h4>(?:Product Reviews|Reviews Directory|Latest Reviews)<\/h4>[\s\S]*?<\/div>/i;
    if (altRegex.test(content)) {
      content = content.replace(altRegex, newFooterColHtml);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated footer in: ${path.relative(process.cwd(), filePath)}`);
  } else {
    console.log(`No footer replacement match or already updated in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Successfully updated ${updatedCount} HTML files.`);
