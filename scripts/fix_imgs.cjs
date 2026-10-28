const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Clean up self-closing slashes inside img tags before appending attributes
html = html.replace(/<div class="spotlight-img-box">\s*<img([^>]+)>/g, (fullBox, imgAttrs) => {
  let cleanAttrs = imgAttrs.replace(/\s*\/\s*$/, '');
  if (!cleanAttrs.includes('width=')) cleanAttrs += ' width="160"';
  if (!cleanAttrs.includes('height=')) cleanAttrs += ' height="160"';
  if (!cleanAttrs.includes('loading=')) cleanAttrs += ' loading="lazy"';
  if (!cleanAttrs.includes('decoding=')) cleanAttrs += ' decoding="async"';
  return '<div class="spotlight-img-box">\n            <img' + cleanAttrs + ' />';
});

// Clean up compare-product-img tags
html = html.replace(/<img([^>]+class="[^"]*compare-product-img[^"]*"[^>]*)>/g, (fullTag, attrs) => {
  let cleanAttrs = attrs.replace(/\s*\/\s*$/, '');
  if (!cleanAttrs.includes('width=')) cleanAttrs += ' width="58"';
  if (!cleanAttrs.includes('height=')) cleanAttrs += ' height="64"';
  if (!cleanAttrs.includes('loading=')) cleanAttrs += ' loading="lazy"';
  if (!cleanAttrs.includes('decoding=')) cleanAttrs += ' decoding="async"';
  return '<img' + cleanAttrs + ' />';
});

fs.writeFileSync('index.html', html);
console.log('Fixed img tags in index.html');
