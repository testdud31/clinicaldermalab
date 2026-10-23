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

  // Extract main image
  const mainImgMatch = content.match(/id="main-product-img"[^>]*src="([^"]*)"/i) || content.match(/src="([^"]*)"[^>]*id="main-product-img"/i);
  const mainImg = mainImgMatch ? mainImgMatch[1] : '';

  // Extract json-ld images if any
  const jsonLdMatch = content.match(/"image"\s*:\s*\[([\s\S]*?)\]/i);
  let jsonLdImages = [];
  if (jsonLdMatch) {
    jsonLdImages = jsonLdMatch[1].match(/https:\/\/[^"]+/g) || [];
  }

  // Extract thumbnail buttons
  const thumbMatches = content.match(/switchProductImg\(this,\s*'([^']*)'\)/gi) || [];
  const thumbUrls = thumbMatches.map(m => m.match(/switchProductImg\(this,\s*'([^']*)'\)/i)[1]);

  console.log(`=== ${file} ===`);
  console.log(`Main: ${mainImg}`);
  console.log(`JSON-LD count: ${jsonLdImages.length}`);
  console.log(`Thumb count: ${thumbUrls.length}`);
  console.log(`Thumb URLs:`, thumbUrls);
});
