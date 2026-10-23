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

const dates = [];

reviewFiles.forEach(file => {
  const content = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const dateMatch = content.match(/"datePublished"\s*:\s*"([^"]+)"/) || content.match(/Last Audit:\s*<strong>([^<]+)<\/strong>/);
  const dateStr = dateMatch ? dateMatch[1] : '2026-01-01';

  // Extract article title/h1
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || content.match(/<title>([\s\S]*?)<\/title>/i);
  let title = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : file;
  title = title.split(':')[0].split('Review')[0].trim();

  dates.push({ file, title, dateStr });
});

dates.sort((a, b) => b.dateStr.localeCompare(a.dateStr));
console.log(dates.slice(0, 10));
