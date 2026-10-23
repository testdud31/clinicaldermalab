import { BreadcrumbItem, FAQItem, ReviewerInfo, SEOPageConfig } from './types';

export const DEFAULT_REVIEWER: ReviewerInfo = {
  name: 'Dr. Aris Thorne',
  title: 'Chief Medical Officer & Board-Certified Dermatologist',
  credentials: 'MD, FAAD',
  role: 'Clinical Director & Lead Dermatological Investigator',
  affiliation: 'American Academy of Dermatology (AAD) & Clinical Derma Lab Research Unit',
  url: 'https://www.clinicaldermalab.io/medical-review-board',
};

/**
 * Generates Schema.org MedicalClinic & MedicalBusiness organization data
 */
export function generateMedicalClinicSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    '@id': 'https://www.clinicaldermalab.io/#medicalclinic',
    name: 'Clinical Derma Lab',
    alternateName: 'ClinicalDermaLab',
    url: 'https://www.clinicaldermalab.io/',
    logo: 'https://www.clinicaldermalab.io/images/clinicaldermalab-logo.svg',
    image: 'https://www.clinicaldermalab.io/images/clinicaldermalab-logo.svg',
    description:
      'Independent dermatological laboratory and evidence-based skincare meta-analysis collective. We test barrier dynamics, transepidermal water loss (TEWL), comedogenicity, and active compound tolerability.',
    medicalSpecialty: [
      'https://health-lifesci.schema.org/Dermatology',
      'https://health-lifesci.schema.org/PlasticSurgery'
    ],
    knowsAbout: [
      'Dermatology',
      'Stratum Corneum Biophysics',
      'Topical Formulation Chemistry',
      'Transepidermal Water Loss',
      'Non-Comedogenic Formulation Screening',
      'Photoaging and Broad-Spectrum Photoprotection'
    ],
    founder: {
      '@type': 'Person',
      name: 'Dr. Aris Thorne',
      honorificSuffix: 'MD, FAAD',
      jobTitle: 'Board-Certified Dermatologist & Clinical Director',
      url: 'https://www.clinicaldermalab.io/medical-review-board'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Editorial & Clinical Inquiries',
      email: 'editorial@www.clinicaldermalab.io',
      availableLanguage: ['English']
    }
  };
}

/**
 * Generates Schema.org BreadcrumbList data
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

/**
 * Generates Schema.org FAQPage data
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generates Schema.org MedicalWebPage data for educational and clinical pages
 */
export function generateMedicalWebPageSchema(config: SEOPageConfig) {
  const reviewer = config.reviewer || DEFAULT_REVIEWER;
  const graph: any[] = [
    {
      '@type': 'MedicalWebPage',
      '@id': `${config.canonicalUrl}#medicalwebpage`,
      url: config.canonicalUrl,
      name: config.title,
      description: config.description,
      lastReviewed: config.lastReviewedDate || '2026-10-22',
      reviewedBy: {
        '@type': 'Person',
        name: reviewer.name,
        honorificSuffix: reviewer.credentials,
        jobTitle: reviewer.title,
        affiliation: {
          '@type': 'MedicalOrganization',
          name: reviewer.affiliation
        },
        url: reviewer.url
      },
      publisher: {
        '@type': 'MedicalClinic',
        name: 'Clinical Derma Lab',
        url: 'https://www.clinicaldermalab.io/'
      }
    }
  ];

  if (config.breadcrumbs && config.breadcrumbs.length > 0) {
    graph.push(generateBreadcrumbSchema(config.breadcrumbs));
  }

  if (config.faqs && config.faqs.length > 0) {
    graph.push(generateFAQSchema(config.faqs));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph
  };
}
