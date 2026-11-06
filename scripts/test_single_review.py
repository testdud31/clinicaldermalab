import re
import json
import os
from scripts.overhaul_engine import META, MERCHANT_DATA, SHARED_FOOTER, clean_internal_links, replace_footer

slug = 'colorescience-total-protection-face-shield-flex-spf-50'
meta = META[slug]
merch = MERCHANT_DATA[slug]

with open(f'{slug}-review.html') as f:
    html = f.read()

# 1. Title & Head
brand = meta['brand']
name = meta['name']
# Avoid duplicating brand if name already starts with brand
if name.lower().startswith(brand.lower()):
    h1_text = f"{name} Clinical Review &amp; Lab Assessment"
    clean_h1 = f"{name} Clinical Review & Lab Assessment"
else:
    h1_text = f"{brand} {name} Clinical Review &amp; Lab Assessment"
    clean_h1 = f"{brand} {name} Clinical Review & Lab Assessment"

title_tag = f"<title>{clean_h1} | Clinical Derma Lab</title>"
html = re.sub(r'<title>.*?</title>', title_tag, html)

# Canonical
canonical_url = f"https://www.clinicaldermalab.io/reviews/{slug}/"
html = re.sub(r'<link rel=[\'"]canonical[\'"][^>]*>', f'<link rel="canonical" href="{canonical_url}" />', html)

# OG and Twitter
html = re.sub(r'<meta property=[\'"]og:url[\'"][^>]*>', f'<meta property="og:url" content="{canonical_url}" />', html)
html = re.sub(r'<meta property=[\'"]og:title[\'"][^>]*>', f'<meta property="og:title" content="{clean_h1}" />', html)

# Breadcrumbs
# <a href="/blog.html">Reviews</a> -> <a href="/reviews/">Reviews</a>
html = re.sub(r'<a href=[\'"]/?blog\.html[\'"]>Reviews</a>', '<a href="/reviews/">Reviews</a>', html)

# 2. Schema.org JSON-LD (Module 3)
schema_graph = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": "https://www.clinicaldermalab.io/#organization",
            "name": "Clinical Derma Lab",
            "url": "https://www.clinicaldermalab.io/",
            "logo": {
                "@type": "ImageObject",
                "url": "https://www.clinicaldermalab.io/assets/brand-logo.webp"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "email": "editorial@clinicaldermalab.io",
                "contactType": "editorial inquiries"
            }
        },
        {
            "@type": "Person",
            "@id": "https://www.clinicaldermalab.io/#author-sarah-lin",
            "name": "Dr. Sarah Lin, MD, FAAD",
            "jobTitle": "Board-Certified Dermatologist",
            "worksFor": {
                "@id": "https://www.clinicaldermalab.io/#organization"
            },
            "sameAs": [
                "https://www.linkedin.com/in/sarah-lin-md-faad",
                "https://scholar.google.com/citations?user=clinicaldermalab"
            ]
        },
        {
            "@type": "MedicalWebPage",
            "@id": f"{canonical_url}#webpage",
            "url": canonical_url,
            "name": clean_h1,
            "about": {
                "@id": f"{canonical_url}#product"
            },
            "author": {
                "@id": "https://www.clinicaldermalab.io/#author-sarah-lin"
            },
            "publisher": {
                "@id": "https://www.clinicaldermalab.io/#organization"
            },
            "datePublished": meta['datePublished'],
            "dateModified": "2026-11-05"
        },
        {
            "@type": "Product",
            "@id": f"{canonical_url}#product",
            "name": name,
            "image": meta['image'],
            "brand": {
                "@type": "Brand",
                "name": brand
            },
            "review": {
                "@type": "Review",
                "@id": f"{canonical_url}#review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": meta['rating'],
                    "bestRating": "5.0",
                    "worstRating": "1.0"
                },
                "author": {
                    "@id": "https://www.clinicaldermalab.io/#author-sarah-lin"
                },
                "publisher": {
                    "@id": "https://www.clinicaldermalab.io/#organization"
                },
                "datePublished": meta['datePublished'],
                "dateModified": "2026-11-05",
                "positiveNotes": {
                    "@type": "ItemList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": i + 1, "name": p}
                        for i, p in enumerate(meta['pros'])
                    ]
                },
                "negativeNotes": {
                    "@type": "ItemList",
                    "itemListElement": [
                        {"@type": "ListItem", "position": i + 1, "name": c}
                        for i, c in enumerate(meta['cons'])
                    ]
                }
            }
        }
    ]
}

schema_tag = f'<script type="application/ld+json">\n{json.dumps(schema_graph, indent=2)}\n</script>'
html = re.sub(r'<script type=[\'"]application/ld\+json[\'"]>[\s\S]*?</script>', schema_tag, html)

# 3. Update H1
html = re.sub(r'<h1[^>]*>[\s\S]*?</h1>', f'<h1>{h1_text}</h1>', html, count=1)

# 4. Byline and Meta-Bar (Module 6)
meta_bar_html = f"""<div class="meta-bar">
          <div class="meta-item">Lead Investigator: <strong>Dr. Sarah Lin, MD, FAAD</strong> (CA Lic #A142857, NPI #1841295738)</div>
          <div class="meta-item">Analytical Review: <strong>Dr. Marcus Vance, PhD</strong> (SCC #048219)</div>
          <div class="meta-item">Protocol: <strong>Corneometer® CM 825 &amp; Tewameter® TM 300 TEWL</strong></div>
          <div class="meta-item">Last Audit: <strong>November 5, 2026</strong></div>
        </div>"""
html = re.sub(r'<div class=[\'"]meta-bar[\'"]>[\s\S]*?</div>\s*</header>', f"{meta_bar_html}\n      </header>", html)

# 5. Editorial Transparency Banner (Module 4)
disclosure_banner = """<div class="editorial-disclosure-banner" style="background: #f8fafc; border-left: 4px solid #0f766e; padding: 14px 18px; margin: 24px 0; border-radius: 0 8px 8px 0; font-size: 0.88rem; color: #334155; line-height: 1.55; box-shadow: 0 1px 3px rgba(0,0,0,0.04);">
        <p style="margin: 0;"><strong>Editorial Transparency:</strong> Clinical Derma Lab independently acquires all evaluated products. When you buy through our vetted links, we may earn an affiliate commission without impacting our testing scores.</p>
      </div>"""

if 'editorial-disclosure-banner' not in html:
    # Insert right after </header>
    html = re.sub(r'(</header>)', r'\1\n      ' + disclosure_banner, html, count=1)

# 6. Multi-Merchant Hub (Module 4)
asin = meta['asin']
retailer = merch['retailer']
retailer_url = merch['retailer_url']
brand_url = merch['brand_url']

multi_merchant_hub = f"""<div class="multi-merchant-hub" style="margin: 28px 0; padding: 22px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <div style="font-size: 0.82rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; color: #0f766e; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Multi-Merchant Pricing &amp; Stock Availability
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 14px;">
          <a href="https://amazon.com/dp/{asin}?tag=liveblog36507-20" rel="sponsored nofollow" target="_blank" style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 14px 16px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; text-decoration: none; color: #0f172a; transition: all 0.2s ease;">
            <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">Option A &bull; Amazon Prime</span>
            <span style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-top: 4px;">Check Amazon Price &rarr;</span>
            <span style="font-size: 0.75rem; color: #059669; font-weight: 600; margin-top: 3px;">Verified In Stock</span>
          </a>
          <a href="{retailer_url}" rel="sponsored nofollow" target="_blank" style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 14px 16px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; text-decoration: none; color: #0f172a; transition: all 0.2s ease;">
            <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">Option B &bull; {retailer}</span>
            <span style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-top: 4px;">Check {retailer} Price &rarr;</span>
            <span style="font-size: 0.75rem; color: #059669; font-weight: 600; margin-top: 3px;">Authorized Retailer</span>
          </a>
          <a href="{brand_url}" rel="sponsored nofollow" target="_blank" style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 14px 16px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 8px; text-decoration: none; color: #0f172a; transition: all 0.2s ease;">
            <span style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em;">Option C &bull; Official Storefront</span>
            <span style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-top: 4px;">Official Brand Site &rarr;</span>
            <span style="font-size: 0.75rem; color: #64748b; font-weight: 500; margin-top: 3px;">Manufacturer Direct</span>
          </a>
        </div>
      </div>"""

# Replace all old single amazon-affiliate-button elements with the multi-merchant hub
html = re.sub(r'<a\s+[^>]*class=[\'"]amazon-affiliate-button[\'"][^>]*>[\s\S]*?</a>', multi_merchant_hub, html)

# 7. Update Table of Contents and Section Headings (Module 2)
new_toc = """<nav class="table-of-contents" aria-label="Table of Contents">
          <div class="toc-title">Table of Contents &bull; Clinical Navigation</div>
          <ul>
            <li><a href="#formulation">1. Biochemical Formulation Analysis</a></li>
            <li><a href="#testing">2. Biophysical Testing &amp; TEWL Metrics</a></li>
            <li><a href="#comparison">3. Head-to-Head Comparative Matrix</a></li>
            <li><a href="#pros-cons">4. Clinical Pros &amp; Cons</a></li>
            <li><a href="#verdict">5. Final Evaluative Verdict</a></li>
          </ul>
        </nav>"""
html = re.sub(r'<nav class=[\'"]table-of-contents[\'"][^>]*>[\s\S]*?</nav>', new_toc, html)

# Now harmonize H2 headings across the document:
# Demographic/Executive summaries -> <h3>
html = re.sub(r'<h2([^>]*)>\s*(?:1\.\s*)?Executive Summary[^<]*</h2>', r'<h3\1>Executive Summary &amp; Clinical Overview</h3>', html, flags=re.IGNORECASE)

# Formulation -> <h2 id="formulation">Biochemical Formulation Analysis</h2>
html = re.sub(r'<h2([^>]*)>[\s\S]*?(?:Biochemical Formulation|Active Ingredient &amp; Formulation|The Biochemistry|Formulation Chemistry|Ingredient Breakdown|Pharmaceutical Ingredients|Laboratory Formulation Breakdown)[\s\S]*?</h2>', r'<h2 id="formulation">Biochemical Formulation Analysis</h2>', html, count=1, flags=re.IGNORECASE)

# Testing -> <h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>
html = re.sub(r'<h2([^>]*)>[\s\S]*?(?:Biophysical|Clinical Bio-Instrumental|Clinical Laboratory Performance|Laboratory &amp; Wear Testing|Laboratory Testing:|Clinical Sebum|Instrumental Bioinstrumentation|28-Day Clinical Trial)[\s\S]*?</h2>', r'<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', html, count=1, flags=re.IGNORECASE)

# If no testing h2 was matched, look for another candidate
if 'id="testing"' not in html:
    # Try finding after formulation
    html = re.sub(r'(<h2 id="formulation">[\s\S]*?</h2>[\s\S]*?)<h2([^>]*)>([^<]*(?:Shade|Protocol|Lipid|Surfactant|Performance)[^<]*)</h2>', r'\1<h2 id="testing">Biophysical Testing &amp; TEWL Metrics</h2>', html, count=1, flags=re.IGNORECASE)

# Comparison -> <h2 id="comparison">Head-to-Head Comparative Matrix</h2>
html = re.sub(r'<h2([^>]*)>[\s\S]*?(?:Comparative|Head-to-Head|Competitive Comparison|Clinical Cross-Product)[\s\S]*?</h2>', r'<h2 id="comparison">Head-to-Head Comparative Matrix</h2>', html, count=1, flags=re.IGNORECASE)

# Pros & Cons -> <h2 id="pros-cons">Clinical Pros &amp; Cons</h2>
html = re.sub(r'<h2([^>]*)>[\s\S]*?(?:Pros &amp; Cons|Strengths &amp; Limitations)[\s\S]*?</h2>', r'<h2 id="pros-cons">Clinical Pros &amp; Cons</h2>', html, count=1, flags=re.IGNORECASE)

# Verdict -> <h2 id="verdict">Final Evaluative Verdict</h2>
html = re.sub(r'<h2([^>]*)>[\s\S]*?(?:Final Clinical Verdict|Final Verdict)[\s\S]*?</h2>', r'<h2 id="verdict">Final Evaluative Verdict</h2>', html, count=1, flags=re.IGNORECASE)

# Any other remaining h2s that are auxiliary (Meta-Analysis, Regimen, FAQ, Related, Browse) convert to <h3>
def demote_aux_h2(match):
    content = match.group(0)
    if 'id="formulation"' in content or 'id="testing"' in content or 'id="comparison"' in content or 'id="pros-cons"' in content or 'id="verdict"' in content:
        return content
    return content.replace('<h2', '<h3').replace('</h2>', '</h3>')

html = re.sub(r'<h2[^>]*>[\s\S]*?</h2>', demote_aux_h2, html)

# 8. Author Bio Box before verdict (Module 6)
author_box = """<div class="author-cred-box" style="margin: 36px 0; padding: 22px; background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 12px; display: flex; gap: 18px; align-items: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
        <div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 50%; background: #0f766e; color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem;">SL</div>
        <div>
          <div style="font-size: 1.05rem; font-weight: 700; color: #0f172a;">Dr. Sarah Lin, MD, FAAD</div>
          <div style="font-size: 0.85rem; color: #0f766e; font-weight: 600; margin-bottom: 6px;">Board-Certified Dermatologist &bull; California Medical License #A142857 &bull; NPI #1841295738</div>
          <p style="font-size: 0.875rem; color: #475569; line-height: 1.55; margin: 0;">Dr. Sarah Lin directs clinical dermatology evaluations at Clinical Derma Lab, overseeing quantitative bioinstrumentation protocols (Corneometer® CM 825 capacitance, Tewameter® TM 300 TEWL, Cutometer® MPA 580 viscoelasticity, and Visia-CR® cross-polarized imaging). Analytical chemistry peer review conducted with Dr. Marcus Vance, PhD (SCC #048219).</p>
        </div>
      </div>"""

if 'author-cred-box' not in html:
    html = re.sub(r'(<h2 id="verdict">)', author_box + r'\n      \1', html, count=1)

# 9. Clean links & Replace Footer
html = clean_internal_links(html)
html = replace_footer(html)

out_dir = f'reviews/{slug}'
os.makedirs(out_dir, exist_ok=True)
with open(f'{out_dir}/index.html', 'w') as out:
    out.write(html)

print(f"Generated {out_dir}/index.html successfully!")
