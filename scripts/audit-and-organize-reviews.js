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

let updatedCount = 0;

reviewFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${file}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Ensure Amazon affiliate button code matches requirement 1: class="amazon-affiliate-button">
  content = content.replace(/class="amazon-affiliate-button"\s+target="_blank"\s+rel="nofollow sponsored noopener">/g, 'class="amazon-affiliate-button">');
  content = content.replace(/class="amazon-affiliate-button"\s+target="_blank"\s+rel="[^"]*">/g, 'class="amazon-affiliate-button">');

  // 2. Add Table of Contents / Executive Jump Links styling if missing in <style>
  if (!content.includes('.toc-container')) {
    const tocCss = `
    /* Modern Editorial Table of Contents & Executive Jump Links */
    .toc-container {
      background: #f7f4ef;
      border: 1px solid var(--border, #e8e2d7);
      border-left: 4px solid var(--accent-green, #2e663e);
      border-radius: 8px;
      padding: 16px 20px;
      margin: 20px 0 28px;
    }
    .toc-title {
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--primary-dark, #15241b);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toc-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px 18px;
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.84rem;
    }
    .toc-links a {
      color: var(--accent-dark, #744d24);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.15s ease;
    }
    .toc-links a:hover {
      color: var(--primary, #233729);
      text-decoration: underline;
    }
    .section-kicker {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--accent-green, #2e663e);
      margin-bottom: 4px;
    }`;
    content = content.replace('</style>', `${tocCss}\n  </style>`);
  }

  // 3. Inject Table of Contents block right after </header> inside <article> if not present
  if (!content.includes('class="toc-container"')) {
    const tocBlock = `
        <!-- Table of Contents & Jump Links for Professional Navigation -->
        <nav class="toc-container" aria-label="Table of Contents">
          <div class="toc-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            Article Contents &amp; Jump Links
          </div>
          <ul class="toc-links">
            <li><a href="#executive-summary">1. Executive Summary</a></li>
            <li><a href="#biochemistry">2. Biochemistry &amp; Formula</a></li>
            <li><a href="#surfactant-architecture">3. Texture &amp; Application</a></li>
            <li><a href="#clinical-testing">4. Clinical Results</a></li>
            <li><a href="#ingredient-matrix">5. Ingredient Analysis</a></li>
            <li><a href="#comparison">6. Comparative Testing</a></li>
            <li><a href="#faq">7. Frequently Asked Questions</a></li>
          </ul>
        </nav>`;

    content = content.replace('</header>', `</header>\n${tocBlock}`);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
    console.log(`Updated: ${file}`);
  } else {
    console.log(`No changes needed: ${file}`);
  }
});

console.log(`Finished processing. Updated ${updatedCount} files.`);
