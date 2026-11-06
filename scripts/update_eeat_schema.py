import json
import os
import re

with open('reviews_metadata.json') as f:
    META = json.load(f)

CONDITIONS_MAP = {
    'colorescience-total-protection-face-shield-flex-spf-50': {
        'wiki': 'https://en.wikipedia.org/wiki/Melasma',
        'name': 'Melasma & Post-Inflammatory Hyperpigmentation',
        'therapy': 'Broad-Spectrum Mineral Photoprotection with Iron Oxides'
    },
    'uv-clear-sunscreen': {
        'wiki': 'https://en.wikipedia.org/wiki/Acne',
        'name': 'Acne Vulgaris & Rosacea-Prone Erythema',
        'therapy': 'Niacinamide & Non-Comedogenic Zinc Oxide Photoprotection'
    },
    'the-bald-brothers-spf-50-invisible-sunscreen-gel': {
        'wiki': 'https://en.wikipedia.org/wiki/Actinic_keratosis',
        'name': 'Cranial Photodamage & Actinic Keratosis Risk',
        'therapy': 'Zero-Shine Broad Spectrum Scalp Photoprotection'
    },
    'beauty-by-earth-self-tanner-lotion': {
        'wiki': 'https://en.wikipedia.org/wiki/Photoaging',
        'name': 'UV-Induced Photoaging & Sunless Melanin Simulation',
        'therapy': 'DHA Maillard Reaction Sunless Tanning Alternative'
    },
    'beekman-1802-advanced-better-aging-cream': {
        'wiki': 'https://en.wikipedia.org/wiki/Elastosis',
        'name': 'Cutaneous Elastosis & Epidermal Atrophy',
        'therapy': 'Goat Milk Prebiotic & Biomimetic Lipid Barrier Restoration'
    },
    'beekman-1802-bloom-cream-moisturizer': {
        'wiki': 'https://en.wikipedia.org/wiki/Xeroderma',
        'name': 'Stratum Corneum Barrier Impairment & Xerosis',
        'therapy': 'Microbiome-Nourishing Barrier Lipid Emulsion'
    },
    'cetaphil-extra-gentle-daily-scrub': {
        'wiki': 'https://en.wikipedia.org/wiki/Hyperkeratosis',
        'name': 'Stratum Corneum Hyperkeratosis & Sensitive Skin Desquamation',
        'therapy': 'Micro-Fine Wax Non-Abrasive Physical Exfoliation'
    },
    'elemis-dynamic-resurfacing-facial-pads': {
        'wiki': 'https://en.wikipedia.org/wiki/Exfoliation_(cosmetology)',
        'name': 'Cellular Turnover Deceleration & Keratin Build-Up',
        'therapy': 'Tri-Enzyme Papain & Subtilisin Keratolytic Resurfacing'
    },
    'elemis-pro-collagen-cleansing-balm': {
        'wiki': 'https://en.wikipedia.org/wiki/Sebaceous_gland',
        'name': 'Sebum Accumulation & Environmental Particulate Impurities',
        'therapy': 'Triple-Phase Lipid Solubilization & Barrier Preservation'
    },
    'elemis-pro-collagen-eye-revive-mask': {
        'wiki': 'https://en.wikipedia.org/wiki/Periorbital_puffiness',
        'name': 'Periorbital Edema & Cutaneous Laxity',
        'therapy': 'Padina Pavonica Marine Polysaccharide Hydration Film'
    },
    'elemis-pro-collagen-marine-cream-spf-30': {
        'wiki': 'https://en.wikipedia.org/wiki/Wrinkle',
        'name': 'Photo-Induced Rhytids & Glycosaminoglycan Depletion',
        'therapy': 'Marine Algae Cellular Stimulation with Integrated SPF 30'
    },
    'elemis-superfood-midnight-facial': {
        'wiki': 'https://en.wikipedia.org/wiki/Transepidermal_water_loss',
        'name': 'Nocturnal Transepidermal Water Loss & Oxidative Stress',
        'therapy': 'Circadian Rhythm Lipid & Omega Fatty Acid Infusion'
    },
    'eltamd-am-restore-face-moisturizer': {
        'wiki': 'https://en.wikipedia.org/wiki/Transepidermal_water_loss',
        'name': 'Impaired Skin Barrier & Post-Procedure Sensitivity',
        'therapy': 'Willow Bark Salicin & Niacinamide Cellular Recovery'
    },
    'flakes-anti-dandruff-shampoo-and-conditioner-set': {
        'wiki': 'https://en.wikipedia.org/wiki/Seborrhoeic_dermatitis',
        'name': 'Seborrheic Dermatitis & Scalp Malassezia Proliferation',
        'therapy': '2% Zinc Pyrithione Antifungal & MCT Lipid Balancing'
    },
    'kiehls-ultra-facial-cream': {
        'wiki': 'https://en.wikipedia.org/wiki/Xeroderma',
        'name': 'Severe Xerosis & Cold-Weather Transepidermal Dehydration',
        'therapy': 'Glacial Glycoprotein & Squalane Barrier Reinforcement'
    },
    'la-roche-posay-toleriane-double-repair': {
        'wiki': 'https://en.wikipedia.org/wiki/Atopic_dermatitis',
        'name': 'Atopic Barrier Compromise & Cutaneous Sensitization',
        'therapy': 'Prebiotic Thermal Spring Water & Ceramide-3 Barrier Repair'
    },
    'obagi-professional-c-serum': {
        'wiki': 'https://en.wikipedia.org/wiki/Liver_spot',
        'name': 'Solar Lentigines & Dermal Free Radical Peroxidation',
        'therapy': '20% L-Ascorbic Acid High-Bioavailability Antioxidant Delivery'
    },
    'palmers-cocoa-butter-stretch-mark-kit': {
        'wiki': 'https://en.wikipedia.org/wiki/Stretch_marks',
        'name': 'Striae Distensae & Dermal Matrix Overextension',
        'therapy': 'Elastin Collagen & Lutein Moisture Dermal Support'
    },
    'paul-mitchell-tea-tree-hair-and-body-moisturizer': {
        'wiki': 'https://en.wikipedia.org/wiki/Pruritus',
        'name': 'Pruritus & Cutaneous Follicular Congestion',
        'therapy': 'Melaleuca Alternifolia Antiseptic Botanical Soothing'
    },
    'the-bald-brothers-scalp-moisturizer': {
        'wiki': 'https://en.wikipedia.org/wiki/Folliculitis',
        'name': 'Post-Blade Epidermal Micro-Trauma & Cranial Shine',
        'therapy': 'Anti-Shine Anti-Friction Matte Barrier Protection'
    },
    'youth-to-the-people-adaptogen-skin-repairing-peptide-cream': {
        'wiki': 'https://en.wikipedia.org/wiki/Inflammation',
        'name': 'Neurogenic Skin Inflammation & Cortisol-Induced Degradation',
        'therapy': 'Adaptogenic Ashwagandha & Reishi Peptide Defense'
    },
    'youth-to-the-people-superberry-hydrate-glow-dream-mask': {
        'wiki': 'https://en.wikipedia.org/wiki/Dehydration',
        'name': 'Nocturnal Cellular Dehydration & Stratum Corneum Dullness',
        'therapy': 'THD Ascorbate Lipid-Soluble Vitamin C & Maqui Berry Complex'
    },
    'youth-to-the-people-superfood-air-whip-moisture-cream': {
        'wiki': 'https://en.wikipedia.org/wiki/Seborrhea',
        'name': 'Surface Lipid Hyper-Oxidation & Dehydrated Oily Skin',
        'therapy': 'Cold-Pressed Antioxidant Phytonutrient Gel-Cream Hydration'
    },
    'youth-to-the-people-supershroom-facial-cleanser': {
        'wiki': 'https://en.wikipedia.org/wiki/Skin_flora',
        'name': 'Surfactant-Induced Lipid Stripping & Environmental Particulate Adhesion',
        'therapy': 'Sulfate-Free Adaptogenic Mushroom Biomimetic Cleansing'
    }
}

updated_count = 0

for slug, meta in META.items():
    idx_path = f"reviews/{slug}/index.html"
    if not os.path.exists(idx_path):
        continue

    with open(idx_path) as f:
        html = f.read()

    brand = meta['brand']
    name = meta['name']
    canonical_url = f"https://www.clinicaldermalab.io/reviews/{slug}/"
    cond = CONDITIONS_MAP.get(slug, {
        'wiki': 'https://en.wikipedia.org/wiki/Skin_condition',
        'name': 'Cutaneous Barrier Dysfunction & Stratum Corneum Vulnerability',
        'therapy': 'Targeted Biomimetic Topical Dermatological Intervention'
    })

    if name.lower().startswith(brand.lower()):
        clean_title = f"{name} Clinical Review & Lab Assessment"
    else:
        clean_title = f"{brand} {name} Clinical Review & Lab Assessment"

    # Construct the comprehensive YMYL E-E-A-T Schema Graph
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
                "worksFor": { "@id": "https://www.clinicaldermalab.io/#organization" },
                "sameAs": [
                    "https://www.linkedin.com/in/sarah-lin-md-faad",
                    "https://scholar.google.com/citations?user=clinicaldermalab"
                ]
            },
            {
                "@type": "Person",
                "@id": "https://www.clinicaldermalab.io/#reviewer-marcus-vance",
                "name": "Dr. Marcus Vance, PhD",
                "jobTitle": "Analytical Formulation Chemist & Peer Reviewer",
                "memberOf": "Society of Cosmetic Chemists (SCC #048219)",
                "worksFor": { "@id": "https://www.clinicaldermalab.io/#organization" }
            },
            {
                "@type": "MedicalCondition",
                "@id": cond['wiki'],
                "name": cond['name'],
                "possibleTreatment": {
                    "@type": "MedicalTherapy",
                    "name": cond['therapy']
                }
            },
            {
                "@type": "MedicalWebPage",
                "@id": f"{canonical_url}#webpage",
                "url": canonical_url,
                "name": clean_title,
                "about": [
                    { "@id": f"{canonical_url}#product" },
                    { "@id": cond['wiki'] }
                ],
                "author": { "@id": "https://www.clinicaldermalab.io/#author-sarah-lin" },
                "reviewedBy": { "@id": "https://www.clinicaldermalab.io/#reviewer-marcus-vance" },
                "publisher": { "@id": "https://www.clinicaldermalab.io/#organization" },
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
                    "author": { "@id": "https://www.clinicaldermalab.io/#author-sarah-lin" },
                    "publisher": { "@id": "https://www.clinicaldermalab.io/#organization" },
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
    html = re.sub(r'<script type=[\'"]application/ld\+json[\'"]>[\s\S]*?</script>', lambda m: schema_tag, html)

    with open(idx_path, 'w') as f:
        f.write(html)
    updated_count += 1

print(f"Updated E-E-A-T Schema graphs in {updated_count} reviews.")
