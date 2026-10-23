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

reviewFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');

  // Extract TOC links
  const tocNavMatch = content.match(/<nav class="toc-container"[\s\S]*?<\/nav>/i);
  let tocHrefs = [];
  if (tocNavMatch) {
    const hrefMatches = tocNavMatch[0].match(/href="([^"]+)"/g) || [];
    tocHrefs = hrefMatches.map(h => h.replace('href="', '').replace('"', ''));
  }

  // Extract section IDs in body
  const sectionIdMatches = content.match(/<section[^>]*id="([^"]+)"/gi) || [];
  const secIds = sectionIdMatches.map(s => s.match(/id="([^"]+)"/i)[1]);

  const h2IdMatches = content.match(/<h2[^>]*id="([^"]+)"/gi) || [];
  const h2Ids = h2IdMatches.map(h => h.match(/id="([^"]+)"/i)[1]);

  const divIdMatches = content.match(/<div[^>]*id="([^"]+)"/gi) || [];
  const divIds = divIdMatches.map(d => d.match(/id="([^"]+)"/i)[1]);

  console.log(`=== ${file} ===`);
  console.log(`TOC Hrefs:`, tocHrefs);
  console.log(`Section IDs:`, secIds);
  console.log(`H2 IDs:`, h2Ids);
  console.log(`Div IDs:`, divIds.filter(i => ['verdict', 'faq', 'summary'].includes(i) || i.startsWith('sec')));
});
