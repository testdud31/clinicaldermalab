import fs from 'fs';
import path from 'path';

const reviewFiles = [
  'beauty-by-earth-self-tanner-lotion-review.html',
  'beekman-1802-advanced-better-aging-cream-review.html',
  'beekman-1802-bloom-cream-moisturizer-review.html',
  'cetaphil-extra-gentle-daily-scrub-review.html',
  'colorescience-total-protection-face-shield-flex-spf-50-review.html',
  'elemis-dynamic-resurfacing-facial-pads-review.html',
  'elemis-pro-collagen-cleansing-balm-review.html',
  'elemis-pro-collagen-eye-revive-mask-review.html',
  'elemis-pro-collagen-marine-cream-spf-30-review.html',
  'elemis-superfood-midnight-facial-review.html',
  'eltamd-am-restore-face-moisturizer-review.html',
  'flakes-anti-dandruff-shampoo-and-conditioner-set-review.html',
  'kiehls-ultra-facial-cream-review.html',
  'la-roche-posay-toleriane-double-repair-review.html',
  'obagi-professional-c-serum-review.html',
  'palmers-cocoa-butter-stretch-mark-kit-review.html',
  'paul-mitchell-tea-tree-hair-and-body-moisturizer-review.html',
  'the-bald-brothers-scalp-moisturizer-review.html',
  'the-bald-brothers-spf-50-invisible-sunscreen-gel-review.html',
  'uv-clear-sunscreen-review.html',
  'youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html',
  'youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html',
  'youth-to-the-people-superfood-air-whip-moisture-cream-review.html',
  'youth-to-the-people-supershroom-facial-cleanser-review.html'
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 30);
}

let fixedCount = 0;

reviewFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Add global smooth scrolling & scroll-margin-top CSS if missing
  if (!content.includes('scroll-margin-top')) {
    const scrollFixCss = `
    html {
      scroll-behavior: smooth;
    }
    section[id], div[id], [id] {
      scroll-margin-top: 85px;
    }`;
    content = content.replace('</style>', `${scrollFixCss}\n  </style>`);
  }

  // Parse sections in article body
  const articleRegex = /<article>([\s\S]*?)<\/article>/i;
  const articleMatch = content.match(articleRegex);
  if (!articleMatch) return;

  let articleBody = articleMatch[1];

  // Find all sections or h2 tags inside articleBody
  // Map sections/h2s to generate TOC links and assign matching IDs
  const sectionList = [];

  // Match <section ...> or <h2 ...>
  // We can scan for <section ...> or <h2 ...>
  // Let's replace section tags or h2 tags to ensure each main topic has a clear ID
  let sectionIndex = 1;

  articleBody = articleBody.replace(/<section([^>]*)>([\s\S]*?)<\/section>/gi, (fullSec, secAttrs, secInner) => {
    // Check if section contains h2
    const h2Match = secInner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    if (!h2Match) return fullSec; // Skip sections without h2 like related or framework

    const h2TextRaw = h2Match[1].replace(/<[^>]+>/g, '').trim();
    if (h2TextRaw.toLowerCase().includes('framework') || h2TextRaw.toLowerCase().includes('browse by targeted')) {
      return fullSec;
    }

    // Clean title for TOC label
    let cleanTitle = h2TextRaw.replace(/^[\d\.\s]+/, '').trim();
    // Generate clean ID
    let secId = slugify(cleanTitle);

    if (!secId || secId.length < 3) secId = `section-${sectionIndex}`;

    // Common standard aliases
    if (cleanTitle.toLowerCase().includes('executive') || cleanTitle.toLowerCase().includes('summary')) secId = 'executive-summary';
    else if (cleanTitle.toLowerCase().includes('biochem') || cleanTitle.toLowerCase().includes('active') || cleanTitle.toLowerCase().includes('mechanism')) secId = 'biochemistry';
    else if (cleanTitle.toLowerCase().includes('surfactant') || cleanTitle.toLowerCase().includes('texture') || cleanTitle.toLowerCase().includes('sensory') || cleanTitle.toLowerCase().includes('formula')) secId = 'formula-and-texture';
    else if (cleanTitle.toLowerCase().includes('clinical') || cleanTitle.toLowerCase().includes('lab') || cleanTitle.toLowerCase().includes('testing') || cleanTitle.toLowerCase().includes('bioinstrumentation')) secId = 'clinical-testing';
    else if (cleanTitle.toLowerCase().includes('ingredient') || cleanTitle.toLowerCase().includes('formulation') || cleanTitle.toLowerCase().includes('breakdown')) secId = 'ingredient-matrix';
    else if (cleanTitle.toLowerCase().includes('comparison') || cleanTitle.toLowerCase().includes('head-to-head') || cleanTitle.toLowerCase().includes('benchmark')) secId = 'comparative-testing';
    else if (cleanTitle.toLowerCase().includes('faq') || cleanTitle.toLowerCase().includes('frequently') || cleanTitle.toLowerCase().includes('question')) secId = 'faq';

    // Add to sectionList
    sectionList.push({ id: secId, label: `${sectionIndex}. ${cleanTitle}` });
    sectionIndex++;

    // Rebuild section with id
    const cleanAttrs = secAttrs.replace(/id="[^"]*"/gi, '').trim();
    return `<section id="${secId}" ${cleanAttrs}>${secInner}</section>`;
  });

  // Check if verdict div exists
  if (content.includes('id="verdict"') || content.includes('class="verdict-box"')) {
    sectionList.push({ id: 'verdict', label: `${sectionIndex}. Final Verdict & Score` });
  }

  // Re-build TOC container block with exact matching IDs
  if (sectionList.length > 0) {
    const tocItemsHtml = sectionList.map(s => `<li><a href="#${s.id}">${s.label}</a></li>`).join('\n            ');

    const newTocHtml = `<!-- Table of Contents & Jump Links for Professional Navigation -->
        <nav class="toc-container" aria-label="Table of Contents">
          <div class="toc-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Article Contents &amp; Jump Links
          </div>
          <ul class="toc-links">
            ${tocItemsHtml}
          </ul>
        </nav>`;

    // Replace old <nav class="toc-container" ...> ... </nav>
    const oldTocRegex = /<nav class="toc-container"[\s\S]*?<\/nav>/i;
    if (oldTocRegex.test(content)) {
      content = content.replace(oldTocRegex, newTocHtml);
    }
  }

  // Update article content in main content
  content = content.replace(articleRegex, `<article>${articleBody}</article>`);

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log(`Fixed TOC & Jump Links for: ${file} (${sectionList.length} jump targets)`);
  }
});

console.log(`Finished fixing TOC jump links across ${fixedCount} review files.`);
