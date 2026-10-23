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

// Helper to convert full size Amazon image URL to thumbnail URL
function getThumbUrl(url) {
  if (!url) return '';
  if (url.includes('._SL1500_.')) return url.replace('._SL1500_.', '._SS40_.');
  if (url.includes('._SL1086_.')) return url.replace('._SL1086_.', '._SS40_.');
  if (url.includes('._SL1000_.')) return url.replace('._SL1000_.', '._SS40_.');
  if (url.includes('._AC_SL1500_.')) return url.replace('._AC_SL1500_.', '._SS40_.');
  return url;
}

let fixedCount = 0;

reviewFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Extract Product JSON-LD image list
  // Look specifically for "@type": "Product" section
  let productImages = [];

  const jsonLdMatch = content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  if (jsonLdMatch) {
    try {
      const data = JSON.parse(jsonLdMatch[1]);
      const graph = data['@graph'] || [data];
      const productObj = graph.find(item => item['@type'] === 'Product');
      if (productObj && productObj.image) {
        if (Array.isArray(productObj.image)) {
          productImages = productObj.image;
        } else if (typeof productObj.image === 'string') {
          productImages = [productObj.image];
        }
      }
    } catch (e) {
      // Fallback regex if JSON parse fails
      const imgArrayMatch = content.match(/"@type"\s*:\s*"Product"[\s\S]*?"image"\s*:\s*\[([\s\S]*?)\]/i);
      if (imgArrayMatch) {
        productImages = imgArrayMatch[1].match(/https:\/\/[^"]+/g) || [];
      }
    }
  }

  // Fallback: if no JSON-LD product images, grab main image or figures in this specific file
  if (productImages.length === 0) {
    const mainMatch = content.match(/id="main-product-img"[^>]*src="([^"]*)"/i) || content.match(/src="([^"]*)"[^>]*id="main-product-img"/i);
    if (mainMatch) productImages.push(mainMatch[1]);

    // Also look for figure images inside the content section of THIS file
    const figMatches = content.match(/<figure[\s\S]*?<img [^>]*src="([^"]*)"[\s\S]*?<\/figure>/gi) || [];
    figMatches.forEach(fig => {
      const srcM = fig.match(/src="([^"]*)"/i);
      if (srcM && !productImages.includes(srcM[1])) {
        productImages.push(srcM[1]);
      }
    });
  }

  // Ensure unique list
  productImages = [...new Set(productImages)];

  if (productImages.length === 0) {
    console.log(`No product images found for ${file}`);
    return;
  }

  const mainImgUrl = productImages[0];

  // Update main-product-img src
  content = content.replace(/(id="main-product-img"[^>]*src=")([^"]*)(")/i, `$1${mainImgUrl}$3`);
  content = content.replace(/(src=")([^"]*)("[^>]*id="main-product-img")/i, `$1${mainImgUrl}$3`);

  // Build new thumbnail gallery buttons using ONLY productImages
  const thumbButtons = productImages.map((imgUrl, idx) => {
    const isActive = idx === 0;
    const borderStyle = isActive ? 'border: 2px solid var(--accent-mushroom);' : 'border: 1px solid var(--border);';
    const activeClass = isActive ? 'gallery-thumb-btn active-thumb' : 'gallery-thumb-btn';
    const thumbSrc = getThumbUrl(imgUrl);

    return `            <button type="button" class="${activeClass}" onclick="switchProductImg(this, '${imgUrl}')" style="${borderStyle} border-radius: 6px; padding: 2px; background: #ffffff; cursor: pointer; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; box-shadow: 0 1px 3px rgba(0,0,0,0.06);">
              <img src="${thumbSrc}" alt="Product Angle ${idx + 1}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
            </button>`;
  }).join('\n');

  const newGalleryHtml = `<div class="thumbnail-gallery" style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 4px;">
${thumbButtons}
          </div>`;

  // Replace <div class="thumbnail-gallery" ...> ... </div>
  const galleryRegex = /<div class="thumbnail-gallery"[\s\S]*?<\/div>/i;
  if (galleryRegex.test(content)) {
    content = content.replace(galleryRegex, newGalleryHtml);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    fixedCount++;
    console.log(`Fixed gallery for: ${file} (${productImages.length} genuine images)`);
  }
});

console.log(`Finished fixing galleries! Updated ${fixedCount} files.`);
