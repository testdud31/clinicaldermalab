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

const masterStyles = `
    /* High-Contrast Professional Verdict Box */
    .verdict-box {
      background: linear-gradient(135deg, #112317 0%, #1a3322 100%) !important;
      color: #ffffff !important;
      border-radius: 14px;
      padding: 36px 28px;
      margin: 40px 0;
      box-shadow: 0 10px 30px rgba(17, 35, 23, 0.25);
      border: 1px solid #284c33;
      text-align: center;
    }
    .verdict-header {
      margin-bottom: 18px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
    }
    .verdict-award-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #d97706;
      color: #ffffff;
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 4px 12px;
      border-radius: 100px;
      margin-bottom: 10px;
    }
    .verdict-header h2 {
      color: #ffffff !important;
      font-size: 1.6rem !important;
      font-weight: 800;
      margin-bottom: 10px;
      border-bottom: none !important;
      padding-bottom: 0 !important;
    }
    .verdict-score-display {
      display: inline-flex;
      align-items: baseline;
      gap: 4px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 6px 16px;
      border-radius: 8px;
    }
    .verdict-score-display .score-num {
      font-size: 1.75rem;
      font-weight: 900;
      color: #fbbf24;
    }
    .verdict-score-display .score-denom {
      font-size: 0.88rem;
      color: #a7f3d0;
      font-weight: 600;
    }
    .verdict-body {
      max-width: 720px;
      margin: 0 auto;
    }
    .verdict-text {
      color: #e2e8f0 !important;
      font-size: 1.02rem !important;
      line-height: 1.7 !important;
      margin-bottom: 22px !important;
    }
    .verdict-text strong {
      color: #ffffff !important;
      font-weight: 700;
    }
    .verdict-affiliate-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
    }
    .verdict-affiliate-area .amazon-affiliate-button img {
      max-width: 240px;
      height: auto;
      border-radius: 8px;
      transition: transform 0.2s ease, filter 0.2s ease;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
    }
    .verdict-affiliate-area .amazon-affiliate-button:hover img {
      transform: translateY(-2px);
      filter: brightness(1.08);
    }
    .verdict-disclosure {
      font-size: 0.75rem;
      color: #a0aec0;
    }

    /* Pro Related Products Section */
    .related-section {
      margin: 44px 0;
      padding: 32px 24px;
      background: #fcfbf9;
      border: 1px solid var(--border, #e8e2d7);
      border-radius: 12px;
    }
    .related-section h3 {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary-dark, #15241b);
      margin-bottom: 20px;
      letter-spacing: -0.3px;
    }
    .related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 20px;
    }
    .related-card {
      background: #ffffff;
      border: 1px solid var(--border, #e8e2d7) !important;
      border-radius: 10px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: var(--text, #1e2923);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .related-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.06);
      border-color: var(--accent-green, #2e663e) !important;
    }
    .related-thumb {
      width: 100%;
      height: 180px;
      background: #f8f6f2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-bottom: 1px solid #f0eae1;
      overflow: hidden;
    }
    .related-thumb img {
      max-width: 100%;
      max-height: 100%;
      width: auto !important;
      height: auto !important;
      object-fit: contain;
      transition: transform 0.25s ease;
    }
    .related-card:hover .related-thumb img {
      transform: scale(1.04);
    }
    .related-info {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .related-category-tag {
      font-size: 0.68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--accent-green, #2e663e);
      margin-bottom: 6px;
    }
    .related-info h4 {
      font-size: 0.98rem;
      font-weight: 700;
      color: var(--primary-dark, #15241b);
      margin-bottom: 8px;
      line-height: 1.35;
    }
    .related-info p {
      font-size: 0.82rem;
      color: var(--text-muted, #596760);
      line-height: 1.5;
      margin-bottom: 14px;
      flex-grow: 1;
    }
    .related-cta {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--accent-green, #2e663e);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
`;

let processed = 0;

reviewFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // Inject master styles before </style>
  if (!content.includes('verdict-award-badge')) {
    content = content.replace('</style>', `${masterStyles}\n</style>`);
  }

  // Fix related card structure: ensure <div class="related-thumb"><img ... /></div>
  content = content.replace(/<a ([^>]*class="related-card"[^>]*)>\s*<img ([^>]*class="related-thumb"[^>]*)>/g, (m, aAttrs, imgAttrs) => {
    // Extract src and alt from imgAttrs
    const srcMatch = imgAttrs.match(/src="([^"]*)"/);
    const altMatch = imgAttrs.match(/alt="([^"]*)"/);
    const src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    // Clean inline border styles from aAttrs
    const cleanAAttrs = aAttrs.replace(/style="[^"]*"/g, '');
    return `<a ${cleanAAttrs}>\n            <div class="related-thumb">\n              <img src="${src}" alt="${alt}" />\n            </div>`;
  });

  // Fix any remaining standalone <img ... class="related-thumb" ... /> without wrapper div
  content = content.replace(/<img ([^>]*class="related-thumb"[^>]*)>/g, (m, imgAttrs) => {
    const srcMatch = imgAttrs.match(/src="([^"]*)"/);
    const altMatch = imgAttrs.match(/alt="([^"]*)"/);
    const src = srcMatch ? srcMatch[1] : '';
    const alt = altMatch ? altMatch[1] : '';
    return `<div class="related-thumb"><img src="${src}" alt="${alt}" /></div>`;
  });

  // Re-format Verdict Box HTML
  // Extract verdict text, score, and amazon link
  const verdictRegex = /<div id="verdict" class="verdict-box">([\s\S]*?)<\/div>\s*<\/article>/;
  const match = content.match(verdictRegex);

  if (match) {
    const inner = match[1];

    // Extract score
    let score = '4.9';
    const scoreMatch = inner.match(/Verdict:\s*([\d\.]+)\s*\/\s*5/i) || inner.match(/Rating:\s*([\d\.]+)/i);
    if (scoreMatch) {
      let rawScore = parseFloat(scoreMatch[1]);
      if (rawScore > 5) {
        if (rawScore >= 40 && rawScore <= 50) rawScore = rawScore / 10;
        else rawScore = 4.8;
      }
      score = rawScore.toFixed(1);
    }

    // Extract Amazon URL
    let amazonUrl = 'https://amazon.com/';
    const urlMatch = inner.match(/href="([^"]*amazon\.com[^"]*)"/i);
    if (urlMatch) {
      amazonUrl = urlMatch[1];
    }

    // Extract paragraph text and clean markdown **
    let pText = '';
    const pMatch = inner.match(/<p>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      pText = pMatch[1].trim();
      pText = pText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Clean any nested inner div or whitespace
      pText = pText.replace(/<div[^>]*>/gi, '').replace(/<\/div>/gi, '');
    } else {
      pText = 'Our clinical panel awards this formulation our highest recommendation for safety, efficacy, and superior dermal compatibility.';
    }

    const cleanVerdictHtml = `<div id="verdict" class="verdict-box">
        <div class="verdict-header">
          <span class="verdict-award-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: -2px;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Clinical Gold Seal Award Winner
          </span>
          <h2>Final Clinical Verdict &amp; Score</h2>
          <div class="verdict-score-display">
            <span class="score-num">${score}</span>
            <span class="score-denom">/ 5.0 Rating</span>
          </div>
        </div>
        <div class="verdict-body">
          <p class="verdict-text">
            ${pText}
          </p>
          <div class="verdict-affiliate-area">
            <a href="${amazonUrl}" class="amazon-affiliate-button">
              <img src="https://g.top4top.io/p_390434fjf1.png" alt="Buy On Amazon" />
            </a>
            <span class="verdict-disclosure">Verified Amazon Purchase Link • Free Prime Delivery Eligible</span>
          </div>
        </div>
      </div>\n    </article>`;

    content = content.replace(verdictRegex, cleanVerdictHtml);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  processed++;
  console.log(`Processed: ${file}`);
});

console.log(`Done! Updated ${processed} files.`);
