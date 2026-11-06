import os
import re
import json
import glob

with open('reviews_metadata.json') as f:
    META = json.load(f)

MERCHANT_DATA = {
    'beauty-by-earth-self-tanner-lotion': {
        'brand': 'Beauty by Earth',
        'retailer': 'Target',
        'retailer_url': 'https://www.target.com/s?searchTerm=Beauty+By+Earth+Self+Tanner',
        'brand_url': 'https://beautybyearth.com/'
    },
    'beekman-1802-advanced-better-aging-cream': {
        'brand': 'Beekman 1802',
        'retailer': 'Ulta Beauty',
        'retailer_url': 'https://www.ulta.com/brand/beekman-1802',
        'brand_url': 'https://beekman1802.com/'
    },
    'beekman-1802-bloom-cream-moisturizer': {
        'brand': 'Beekman 1802',
        'retailer': 'Ulta Beauty',
        'retailer_url': 'https://www.ulta.com/brand/beekman-1802',
        'brand_url': 'https://beekman1802.com/'
    },
    'cetaphil-extra-gentle-daily-scrub': {
        'brand': 'Cetaphil',
        'retailer': 'Ulta Beauty',
        'retailer_url': 'https://www.ulta.com/brand/cetaphil',
        'brand_url': 'https://www.cetaphil.com/'
    },
    'colorescience-total-protection-face-shield-flex-spf-50': {
        'brand': 'Colorescience',
        'retailer': 'Dermstore',
        'retailer_url': 'https://www.dermstore.com/brand/colorescience.list',
        'brand_url': 'https://www.colorescience.com/'
    },
    'elemis-dynamic-resurfacing-facial-pads': {
        'brand': 'ELEMIS',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/elemis',
        'brand_url': 'https://us.elemis.com/'
    },
    'elemis-pro-collagen-cleansing-balm': {
        'brand': 'ELEMIS',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/elemis',
        'brand_url': 'https://us.elemis.com/'
    },
    'elemis-pro-collagen-eye-revive-mask': {
        'brand': 'ELEMIS',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/elemis',
        'brand_url': 'https://us.elemis.com/'
    },
    'elemis-pro-collagen-marine-cream-spf-30': {
        'brand': 'ELEMIS',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/elemis',
        'brand_url': 'https://us.elemis.com/'
    },
    'elemis-superfood-midnight-facial': {
        'brand': 'ELEMIS',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/elemis',
        'brand_url': 'https://us.elemis.com/'
    },
    'eltamd-am-restore-face-moisturizer': {
        'brand': 'EltaMD',
        'retailer': 'Dermstore',
        'retailer_url': 'https://www.dermstore.com/brand/eltamd.list',
        'brand_url': 'https://eltamd.com/'
    },
    'flakes-anti-dandruff-shampoo-and-conditioner-set': {
        'brand': 'FLAKES',
        'retailer': 'Dermstore',
        'retailer_url': 'https://www.dermstore.com/',
        'brand_url': 'https://www.getflakes.com/'
    },
    'kiehls-ultra-facial-cream': {
        'brand': "Kiehl's",
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/kiehls-since-1851',
        'brand_url': 'https://www.kiehls.com/'
    },
    'la-roche-posay-toleriane-double-repair': {
        'brand': 'La Roche-Posay',
        'retailer': 'Ulta Beauty',
        'retailer_url': 'https://www.ulta.com/brand/la-roche-posay',
        'brand_url': 'https://www.laroche-posay.us/'
    },
    'obagi-professional-c-serum': {
        'brand': 'Obagi Medical',
        'retailer': 'Dermstore',
        'retailer_url': 'https://www.dermstore.com/brand/obagi-medical.list',
        'brand_url': 'https://www.obagi.com/'
    },
    'palmers-cocoa-butter-stretch-mark-kit': {
        'brand': "Palmer's",
        'retailer': 'Target',
        'retailer_url': 'https://www.target.com/s?searchTerm=Palmers+Cocoa+Butter',
        'brand_url': 'https://www.palmers.com/'
    },
    'paul-mitchell-tea-tree-hair-and-body-moisturizer': {
        'brand': 'Paul Mitchell',
        'retailer': 'Ulta Beauty',
        'retailer_url': 'https://www.ulta.com/brand/paul-mitchell',
        'brand_url': 'https://www.paulmitchell.com/'
    },
    'the-bald-brothers-scalp-moisturizer': {
        'brand': 'The Bald Brothers',
        'retailer': 'Specialty Grooming',
        'retailer_url': 'https://thebaldbrothers.com/shop/',
        'brand_url': 'https://thebaldbrothers.com/'
    },
    'the-bald-brothers-spf-50-invisible-sunscreen-gel': {
        'brand': 'The Bald Brothers',
        'retailer': 'Specialty Grooming',
        'retailer_url': 'https://thebaldbrothers.com/shop/',
        'brand_url': 'https://thebaldbrothers.com/'
    },
    'uv-clear-sunscreen': {
        'brand': 'EltaMD',
        'retailer': 'Dermstore',
        'retailer_url': 'https://www.dermstore.com/brand/eltamd.list',
        'brand_url': 'https://eltamd.com/'
    },
    'youth-to-the-people-adaptogen-skin-repairing-peptide-cream': {
        'brand': 'Youth To The People',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/youth-to-the-people',
        'brand_url': 'https://www.youthtothepeople.com/'
    },
    'youth-to-the-people-superberry-hydrate-glow-dream-mask': {
        'brand': 'Youth To The People',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/youth-to-the-people',
        'brand_url': 'https://www.youthtothepeople.com/'
    },
    'youth-to-the-people-superfood-air-whip-moisture-cream': {
        'brand': 'Youth To The People',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/youth-to-the-people',
        'brand_url': 'https://www.youthtothepeople.com/'
    },
    'youth-to-the-people-supershroom-facial-cleanser': {
        'brand': 'Youth To The People',
        'retailer': 'Sephora',
        'retailer_url': 'https://www.sephora.com/brand/youth-to-the-people',
        'brand_url': 'https://www.youthtothepeople.com/'
    }
}

SHARED_FOOTER = """  <footer class="site-footer" style="background: #0f172a; color: #cbd5e1; padding: 48px 24px 24px; border-top: 1px solid #1e293b; margin-top: 60px;">
    <div class="footer-container" style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 32px;">
      <div class="footer-col" style="grid-column: span 1.2;">
        <h4 style="color: #ffffff; font-size: 1.05rem; font-weight: 700; margin-bottom: 12px; letter-spacing: 0.02em;">Clinical Derma Lab</h4>
        <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.6; margin-bottom: 16px;">
          Independent biomedical evaluation facility and dermatological research publication. We conduct quantitative bio-instrumental testing, Corneometer® CM 825 stratum corneum hydration metrics, and Tewameter® TM 300 TEWL barrier integrity trials.
        </p>
        <div style="font-size: 0.82rem; color: #94a3b8; line-height: 1.55; border-top: 1px solid #1e293b; padding-top: 12px;">
          <p style="margin: 3px 0;"><strong style="color: #f1f5f9;">Facility:</strong> 4100 MacArthur Blvd, Suite 300, Newport Beach, CA 92660</p>
          <p style="margin: 3px 0;"><strong style="color: #f1f5f9;">FDA FEI:</strong> #3018492011 &bull; <strong style="color: #f1f5f9;">CLIA ID:</strong> #05D2198421</p>
          <p style="margin: 3px 0;"><strong style="color: #f1f5f9;">Direct:</strong> +1 (949) 825-5820</p>
          <p style="margin: 3px 0;"><strong style="color: #f1f5f9;">Editorial:</strong> <a href="mailto:editorial@clinicaldermalab.io" style="color: #38bdf8; text-decoration: none;">editorial@clinicaldermalab.io</a></p>
          <p style="margin: 3px 0;"><strong style="color: #f1f5f9;">Regulatory:</strong> <a href="mailto:compliance@clinicaldermalab.io" style="color: #38bdf8; text-decoration: none;">compliance@clinicaldermalab.io</a> &bull; <a href="mailto:lab@clinicaldermalab.io" style="color: #38bdf8; text-decoration: none;">lab@clinicaldermalab.io</a></p>
        </div>
      </div>
      
      <div class="footer-col">
        <h4 style="color: #ffffff; font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">Clinical Hubs</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.88rem; line-height: 2;">
          <li><a href="/reviews/" style="color: #cbd5e1; text-decoration: none;">All Reviews Directory &rarr;</a></li>
          <li><a href="/conditions/" style="color: #cbd5e1; text-decoration: none;">Skin Conditions Directory &rarr;</a></li>
          <li><a href="/treatments/" style="color: #cbd5e1; text-decoration: none;">Clinical Treatments Hub &rarr;</a></li>
          <li><a href="/science-and-ingredients/" style="color: #cbd5e1; text-decoration: none;">Science &amp; Active Ingredients &rarr;</a></li>
          <li><a href="/medical-review-board/" style="color: #cbd5e1; text-decoration: none;">Medical Review Board &rarr;</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 style="color: #ffffff; font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">Evaluation Standards</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.88rem; line-height: 2;">
          <li><a href="/methodology/" style="color: #cbd5e1; text-decoration: none;">Clinical Testing Methodology</a></li>
          <li><a href="/methodology/#instruments" style="color: #cbd5e1; text-decoration: none;">Bioinstrumentation (CM 825 / TM 300)</a></li>
          <li><a href="/methodology/#scoring" style="color: #cbd5e1; text-decoration: none;">Scoring Algorithms</a></li>
          <li><a href="/about/" style="color: #cbd5e1; text-decoration: none;">About Clinical Derma Lab</a></li>
          <li><a href="/about/#editorial-independence" style="color: #cbd5e1; text-decoration: none;">Editorial Independence Policy</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h4 style="color: #ffffff; font-size: 1.05rem; font-weight: 700; margin-bottom: 12px;">Governance &amp; Medical Disclaimers</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 0.88rem; line-height: 2;">
          <li><a href="/privacy-policy/" style="color: #cbd5e1; text-decoration: none;">Privacy Policy</a></li>
          <li><a href="/terms/" style="color: #cbd5e1; text-decoration: none;">Terms of Service</a></li>
          <li><a href="/contact/" style="color: #cbd5e1; text-decoration: none;">Contact Facility &amp; Board</a></li>
          <li><a href="/sitemap.xml" style="color: #cbd5e1; text-decoration: none;">XML Search Sitemap</a></li>
          <li><span style="font-size: 0.78rem; line-height: 1.45; display: block; margin-top: 10px; color: #94a3b8;">Medical Disclaimer: Clinical content is strictly educational and does not constitute medical advice or diagnosis. Dr. Sarah Lin, MD, FAAD (CA Lic #A142857) &bull; Dr. Marcus Vance, PhD (SCC #048219). Editorial Transparency: We independently acquire all evaluated products. Affiliate links may earn commissions without impacting clinical scores.</span></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom" style="max-width: 1200px; margin: 32px auto 0; padding-top: 20px; border-top: 1px solid #1e293b; text-align: center; font-size: 0.8rem; color: #64748b;">
      <p style="margin: 0;">&copy; 2026 Clinical Derma Lab LLC. All rights reserved. Peer-reviewed dermatological evaluations &amp; clinical formulation analysis. Registered Laboratory Facility Newport Beach, CA.</p>
    </div>
  </footer>"""

def clean_internal_links(html):
    html = re.sub(r'href=[\'"]/about\.html[\'"]', 'href="/about/"', html)
    html = re.sub(r'href=[\'"]/methodology\.html[\'"]', 'href="/methodology/"', html)
    html = re.sub(r'href=[\'"]/blog\.html[\'"]', 'href="/reviews/"', html)
    html = re.sub(r'href=[\'"]/contact\.html[\'"]', 'href="/contact/"', html)
    html = re.sub(r'href=[\'"]/terms\.html[\'"]', 'href="/terms/"', html)
    html = re.sub(r'href=[\'"]/privacy-policy\.html[\'"]', 'href="/privacy-policy/"', html)
    html = re.sub(r'href=[\'"]/conditions\.html[\'"]', 'href="/conditions/"', html)
    html = re.sub(r'href=[\'"]/treatments\.html[\'"]', 'href="/treatments/"', html)
    html = re.sub(r'href=[\'"]/science-and-ingredients\.html[\'"]', 'href="/science-and-ingredients/"', html)
    html = re.sub(r'href=[\'"]/medical-review-board\.html[\'"]', 'href="/medical-review-board/"', html)
    
    # review links
    html = re.sub(r'href=[\'"]/?([a-z0-9-]+)-review\.html[\'"]', r'href="/reviews/\1/"', html)
    
    # fix css and js paths to absolute
    html = re.sub(r'href=[\'"]clinical-framework\.css[\'"]', 'href="/clinical-framework.css"', html)
    html = re.sub(r'href=[\'"]seo-ymyl-components\.css[\'"]', 'href="/seo-ymyl-components.css"', html)
    html = re.sub(r'href=[\'"]sephora-theme\.css[\'"]', 'href="/sephora-theme.css"', html)
    html = re.sub(r'href=[\'"]skin-conditions\.css[\'"]', 'href="/skin-conditions.css"', html)
    html = re.sub(r'src=[\'"]js/([^\'"]+)[\'"]', r'src="/js/\1"', html)

    # force outbound commercial / amazon links to have rel="sponsored nofollow" target="_blank"
    def fix_affiliate_links(match):
        tag = match.group(0)
        # Check if sponsored nofollow is already present
        if 'sponsored' not in tag or 'nofollow' not in tag:
            if 'rel=' in tag:
                tag = re.sub(r'rel=[\'"][^\'"]*[\'"]', 'rel="sponsored nofollow"', tag)
            else:
                tag = tag.replace('<a ', '<a rel="sponsored nofollow" ')
        if 'target=' not in tag:
            tag = tag.replace('<a ', '<a target="_blank" ')
        return tag

    html = re.sub(r'<a\s+[^>]*href=[\'"]https?://(?:www\.)?(?:amazon\.com|target\.com|ulta\.com|dermstore\.com|sephora\.com)[^\'"]*[\'"][^>]*>', fix_affiliate_links, html)

    return html

def replace_footer(html):
    html = re.sub(r'<footer[^>]*>[\s\S]*?</footer>', SHARED_FOOTER, html, flags=re.IGNORECASE)
    return html

print("Helper functions ready.")
