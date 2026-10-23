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

const newFooterColStandard = `      <div class="footer-col">
        <h4>Product Reviews</h4>
        <ul>
          <li><a href="/blog.html">All Reviews Directory &rarr;</a></li>
          <li><a href="/youth-to-the-people-supershroom-facial-cleanser-review.html">YTTP Supershroom Cleanser</a></li>
          <li><a href="/youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html">YTTP Adaptogen Peptide Cream</a></li>
          <li><a href="/youth-to-the-people-superfood-air-whip-moisture-cream-review.html">YTTP Superfood Air-Whip Cream</a></li>
          <li><a href="/youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html">YTTP Superberry Dream Mask</a></li>
        </ul>
      </div>`;

const newFooterColBlogStyle = `        <div>
          <h4 style="color: #ffffff; font-size: 0.95rem; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Product Reviews</h4>
          <ul style="list-style: none;">
            <li style="margin-bottom: 8px;"><a href="/blog.html" style="color: #a8bec3; text-decoration: none;">All Reviews Directory &rarr;</a></li>
            <li style="margin-bottom: 8px;"><a href="/youth-to-the-people-supershroom-facial-cleanser-review.html" style="color: #a8bec3; text-decoration: none;">YTTP Supershroom Cleanser</a></li>
            <li style="margin-bottom: 8px;"><a href="/youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html" style="color: #a8bec3; text-decoration: none;">YTTP Adaptogen Peptide Cream</a></li>
            <li style="margin-bottom: 8px;"><a href="/youth-to-the-people-superfood-air-whip-moisture-cream-review.html" style="color: #a8bec3; text-decoration: none;">YTTP Superfood Air-Whip Cream</a></li>
            <li style="margin-bottom: 8px;"><a href="/youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html" style="color: #a8bec3; text-decoration: none;">YTTP Superberry Dream Mask</a></li>
          </ul>
        </div>`;

let count = 0;

htmlFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Replace <div class="footer-col"> <h4>Product Reviews</h4> ... </div>
  content = content.replace(/<div class="footer-col">\s*<h4>(?:Product Reviews|Reviews Directory|Latest Reviews)<\/h4>[\s\S]*?<\/div>/gi, newFooterColStandard);

  // 2. Replace <div> <h4 ...>Product Reviews</h4> <ul ...> ... </ul> </div>
  content = content.replace(/<div>\s*<h4[^>]*>Product Reviews<\/h4>[\s\S]*?<\/div>/gi, newFooterColBlogStyle);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`Updated footer in: ${path.relative(process.cwd(), filePath)}`);
  }
});

console.log(`Done! Updated footers in ${count} files.`);
