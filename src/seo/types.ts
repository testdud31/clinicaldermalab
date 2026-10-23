/**
 * SEO & Medical YMYL Structured Data Types
 * Clinical Derma Lab Architecture
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CitationItem {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  volumeAndPages?: string;
  pmid?: string;
  doi?: string;
}

export interface ReviewerInfo {
  name: string;
  title: string;
  credentials: string; // e.g., "MD, FAAD"
  role: string;
  affiliation: string;
  url: string;
}

export interface SEOPageConfig {
  title: string; // Must be under 60 chars: "Primary Keyword | Clinical Derma Lab"
  description: string; // 150-160 chars
  canonicalUrl: string;
  pageType?: 'website' | 'article' | 'medicalWebPage';
  ogImage?: string;
  publishedDate?: string;
  lastReviewedDate?: string;
  reviewer?: ReviewerInfo;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  medicalConditionName?: string;
  activeIngredients?: string[];
  citations?: CitationItem[];
}
