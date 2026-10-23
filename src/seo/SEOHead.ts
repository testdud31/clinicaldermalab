/**
 * Dynamic SEO Head & Meta Controller
 * Clinical Derma Lab Architecture
 * Strictly ensures:
 * - <title> under 60 characters formatted: "Primary Keyword | Clinical Derma Lab"
 * - <meta name="description"> between 150-160 characters with clinical value propositions
 * - Self-referencing <link rel="canonical">
 * - OpenGraph and Twitter card synchronization
 * - Dynamic JSON-LD structured data injection
 */

import { generateBreadcrumbSchema, generateFAQSchema, generateMedicalClinicSchema, generateMedicalWebPageSchema } from './schema-generator';
import { SEOPageConfig } from './types';

export class SEOHeadController {
  private static setOrCreateMeta(nameOrProperty: string, content: string, isProperty = false) {
    const selector = isProperty ? `meta[property="${nameOrProperty}"]` : `meta[name="${nameOrProperty}"]`;
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', nameOrProperty);
      } else {
        element.setAttribute('name', nameOrProperty);
      }
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  }

  private static setOrCreateCanonical(href: string) {
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', href);
  }

  private static setJsonLd(id: string, schemaObj: object) {
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schemaObj, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Updates head elements based on configuration
   */
  public static update(config: SEOPageConfig) {
    // 1. Title validation & enforcement (under 60 chars)
    let formattedTitle = config.title;
    if (!formattedTitle.includes('Clinical Derma Lab')) {
      formattedTitle = `${config.title} | Clinical Derma Lab`;
    }
    if (formattedTitle.length > 60) {
      // Trim responsibly to prevent search engine truncation
      formattedTitle = formattedTitle.slice(0, 57).trim() + '...';
    }
    document.title = formattedTitle;

    // 2. Meta description enforcement (150-160 chars recommended)
    let desc = config.description;
    if (desc.length > 160) {
      desc = desc.slice(0, 157).trim() + '...';
    }
    this.setOrCreateMeta('description', desc);

    // 3. Self-referencing canonical
    const canonical = config.canonicalUrl.startsWith('http')
      ? config.canonicalUrl
      : `https://www.clinicaldermalab.io${config.canonicalUrl.startsWith('/') ? '' : '/'}${config.canonicalUrl}`;
    this.setOrCreateCanonical(canonical);

    // 4. OpenGraph tags
    const ogImage = config.ogImage || 'https://www.clinicaldermalab.io/images/clinicaldermalab-logo.svg';
    this.setOrCreateMeta('og:title', formattedTitle, true);
    this.setOrCreateMeta('og:description', desc, true);
    this.setOrCreateMeta('og:url', canonical, true);
    this.setOrCreateMeta('og:type', config.pageType || 'website', true);
    this.setOrCreateMeta('og:image', ogImage, true);
    this.setOrCreateMeta('og:site_name', 'Clinical Derma Lab', true);

    // 5. Twitter Card tags
    this.setOrCreateMeta('twitter:card', 'summary_large_image');
    this.setOrCreateMeta('twitter:title', formattedTitle);
    this.setOrCreateMeta('twitter:description', desc);
    this.setOrCreateMeta('twitter:image', ogImage);

    // 6. JSON-LD Structured Data
    if (config.canonicalUrl === 'https://www.clinicaldermalab.io/' || config.canonicalUrl === '/') {
      this.setJsonLd('dynamic-seo-schema', generateMedicalClinicSchema());
    } else {
      this.setJsonLd('dynamic-seo-schema', generateMedicalWebPageSchema(config));
    }
  }
}

/**
 * React Component wrapper for SEO Head
 */
export function SEOHead(props: SEOPageConfig) {
  if (typeof window !== 'undefined') {
    SEOHeadController.update(props);
  }
  return null;
}
