import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'seo-and-domain-redirect-middleware',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const pathname = url.split('?')[0].split('#')[0];
            const search = url.includes('?') ? '?' + url.split('?')[1] : '';

            // 1. Host Domain Redirect
            const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
            const hostname = rawHost.split(',')[0].trim().split(':')[0];
            if (hostname === 'clinicaldermalab.ai.studio' || hostname.endsWith('.clinicaldermalab.ai.studio')) {
              res.writeHead(301, { Location: `https://clinicaldermalab.io${req.url || ''}` });
              res.end();
              return;
            }

            // 2. Sitemap.xml serving with 200 OK and proper XML MIME type
            if (pathname === '/sitemap.xml') {
              const sitemapPath = path.resolve(__dirname, 'sitemap.xml');
              if (fs.existsSync(sitemapPath)) {
                res.writeHead(200, {
                  'Content-Type': 'application/xml; charset=UTF-8',
                  'Cache-Control': 'public, max-age=3600',
                });
                res.end(fs.readFileSync(sitemapPath, 'utf8'));
                return;
              }
            }

            // 3. HTTP 301 Redirections for legacy .html paths to clean trailing-slash directories
            const staticMap: Record<string, string> = {
              '/about.html': '/about/',
              '/methodology.html': '/methodology/',
              '/blog.html': '/reviews/',
              '/contact.html': '/contact/',
              '/terms.html': '/terms/',
              '/privacy-policy.html': '/privacy-policy/',
              '/conditions.html': '/conditions/',
              '/treatments.html': '/treatments/',
              '/science-and-ingredients.html': '/science-and-ingredients/',
              '/medical-review-board.html': '/medical-review-board/',
            };

            if (staticMap[pathname]) {
              res.writeHead(301, { Location: staticMap[pathname] + search });
              res.end();
              return;
            }

            const reviewMatch = pathname.match(/^\/([a-z0-9-]+)-review\.html$/);
            if (reviewMatch) {
              res.writeHead(301, { Location: `/reviews/${reviewMatch[1]}/${search}` });
              res.end();
              return;
            }

            next();
          });
        },
        configurePreviewServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url || '';
            const pathname = url.split('?')[0].split('#')[0];
            const search = url.includes('?') ? '?' + url.split('?')[1] : '';

            const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
            const hostname = rawHost.split(',')[0].trim().split(':')[0];
            if (hostname === 'clinicaldermalab.ai.studio' || hostname.endsWith('.clinicaldermalab.ai.studio')) {
              res.writeHead(301, { Location: `https://clinicaldermalab.io${req.url || ''}` });
              res.end();
              return;
            }

            if (pathname === '/sitemap.xml') {
              const sitemapPath = path.resolve(__dirname, 'sitemap.xml');
              if (fs.existsSync(sitemapPath)) {
                res.writeHead(200, {
                  'Content-Type': 'application/xml; charset=UTF-8',
                  'Cache-Control': 'public, max-age=3600',
                });
                res.end(fs.readFileSync(sitemapPath, 'utf8'));
                return;
              }
            }

            const staticMap: Record<string, string> = {
              '/about.html': '/about/',
              '/methodology.html': '/methodology/',
              '/blog.html': '/reviews/',
              '/contact.html': '/contact/',
              '/terms.html': '/terms/',
              '/privacy-policy.html': '/privacy-policy/',
              '/conditions.html': '/conditions/',
              '/treatments.html': '/treatments/',
              '/science-and-ingredients.html': '/science-and-ingredients/',
              '/medical-review-board.html': '/medical-review-board/',
            };

            if (staticMap[pathname]) {
              res.writeHead(301, { Location: staticMap[pathname] + search });
              res.end();
              return;
            }

            const reviewMatch = pathname.match(/^\/([a-z0-9-]+)-review\.html$/);
            if (reviewMatch) {
              res.writeHead(301, { Location: `/reviews/${reviewMatch[1]}/${search}` });
              res.end();
              return;
            }

            next();
          });
        },
      },
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          'main': path.resolve(__dirname, 'index.html'),
          'blog': path.resolve(__dirname, 'blog.html'),
          'reviewsDir': path.resolve(__dirname, 'reviews/index.html'),
          'aboutDir': path.resolve(__dirname, 'about/index.html'),
          'about': path.resolve(__dirname, 'about.html'),
          'contactDir': path.resolve(__dirname, 'contact/index.html'),
          'contact': path.resolve(__dirname, 'contact.html'),
          'privacyDir': path.resolve(__dirname, 'privacy-policy/index.html'),
          'privacy': path.resolve(__dirname, 'privacy-policy.html'),
          'termsDir': path.resolve(__dirname, 'terms/index.html'),
          'terms': path.resolve(__dirname, 'terms.html'),
          'methodologyDir': path.resolve(__dirname, 'methodology/index.html'),
          'methodology': path.resolve(__dirname, 'methodology.html'),
          'treatmentsDir': path.resolve(__dirname, 'treatments/index.html'),
          'treatments': path.resolve(__dirname, 'treatments.html'),
          'conditionsDir': path.resolve(__dirname, 'conditions/index.html'),
          'conditions': path.resolve(__dirname, 'conditions.html'),
          'scienceIngredientsDir': path.resolve(__dirname, 'science-and-ingredients/index.html'),
          'scienceIngredients': path.resolve(__dirname, 'science-and-ingredients.html'),
          'medicalReviewBoardDir': path.resolve(__dirname, 'medical-review-board/index.html'),
          'medicalReviewBoard': path.resolve(__dirname, 'medical-review-board.html'),
          'notFound': path.resolve(__dirname, '404.html'),
          'BeautyByEarthSelfTannerLotionDir': path.resolve(__dirname, 'reviews/beauty-by-earth-self-tanner-lotion/index.html'),
          'BeautyByEarthSelfTannerLotionStub': path.resolve(__dirname, 'beauty-by-earth-self-tanner-lotion-review.html'),
          'Beekman1802AdvancedBetterAgingCreamDir': path.resolve(__dirname, 'reviews/beekman-1802-advanced-better-aging-cream/index.html'),
          'Beekman1802AdvancedBetterAgingCreamStub': path.resolve(__dirname, 'beekman-1802-advanced-better-aging-cream-review.html'),
          'Beekman1802BloomCreamMoisturizerDir': path.resolve(__dirname, 'reviews/beekman-1802-bloom-cream-moisturizer/index.html'),
          'Beekman1802BloomCreamMoisturizerStub': path.resolve(__dirname, 'beekman-1802-bloom-cream-moisturizer-review.html'),
          'CetaphilExtraGentleDailyScrubDir': path.resolve(__dirname, 'reviews/cetaphil-extra-gentle-daily-scrub/index.html'),
          'CetaphilExtraGentleDailyScrubStub': path.resolve(__dirname, 'cetaphil-extra-gentle-daily-scrub-review.html'),
          'ColorescienceTotalProtectionFaceShieldFlexSpf50Dir': path.resolve(__dirname, 'reviews/colorescience-total-protection-face-shield-flex-spf-50/index.html'),
          'ColorescienceTotalProtectionFaceShieldFlexSpf50Stub': path.resolve(__dirname, 'colorescience-total-protection-face-shield-flex-spf-50-review.html'),
          'ElemisDynamicResurfacingFacialPadsDir': path.resolve(__dirname, 'reviews/elemis-dynamic-resurfacing-facial-pads/index.html'),
          'ElemisDynamicResurfacingFacialPadsStub': path.resolve(__dirname, 'elemis-dynamic-resurfacing-facial-pads-review.html'),
          'ElemisProCollagenCleansingBalmDir': path.resolve(__dirname, 'reviews/elemis-pro-collagen-cleansing-balm/index.html'),
          'ElemisProCollagenCleansingBalmStub': path.resolve(__dirname, 'elemis-pro-collagen-cleansing-balm-review.html'),
          'ElemisProCollagenEyeReviveMaskDir': path.resolve(__dirname, 'reviews/elemis-pro-collagen-eye-revive-mask/index.html'),
          'ElemisProCollagenEyeReviveMaskStub': path.resolve(__dirname, 'elemis-pro-collagen-eye-revive-mask-review.html'),
          'ElemisProCollagenMarineCreamSpf30Dir': path.resolve(__dirname, 'reviews/elemis-pro-collagen-marine-cream-spf-30/index.html'),
          'ElemisProCollagenMarineCreamSpf30Stub': path.resolve(__dirname, 'elemis-pro-collagen-marine-cream-spf-30-review.html'),
          'ElemisSuperfoodMidnightFacialDir': path.resolve(__dirname, 'reviews/elemis-superfood-midnight-facial/index.html'),
          'ElemisSuperfoodMidnightFacialStub': path.resolve(__dirname, 'elemis-superfood-midnight-facial-review.html'),
          'EltamdAmRestoreFaceMoisturizerDir': path.resolve(__dirname, 'reviews/eltamd-am-restore-face-moisturizer/index.html'),
          'EltamdAmRestoreFaceMoisturizerStub': path.resolve(__dirname, 'eltamd-am-restore-face-moisturizer-review.html'),
          'FlakesAntiDandruffShampooAndConditionerSetDir': path.resolve(__dirname, 'reviews/flakes-anti-dandruff-shampoo-and-conditioner-set/index.html'),
          'FlakesAntiDandruffShampooAndConditionerSetStub': path.resolve(__dirname, 'flakes-anti-dandruff-shampoo-and-conditioner-set-review.html'),
          'KiehlsUltraFacialCreamDir': path.resolve(__dirname, 'reviews/kiehls-ultra-facial-cream/index.html'),
          'KiehlsUltraFacialCreamStub': path.resolve(__dirname, 'kiehls-ultra-facial-cream-review.html'),
          'LaRochePosayTolerianeDoubleRepairDir': path.resolve(__dirname, 'reviews/la-roche-posay-toleriane-double-repair/index.html'),
          'LaRochePosayTolerianeDoubleRepairStub': path.resolve(__dirname, 'la-roche-posay-toleriane-double-repair-review.html'),
          'ObagiProfessionalCSerumDir': path.resolve(__dirname, 'reviews/obagi-professional-c-serum/index.html'),
          'ObagiProfessionalCSerumStub': path.resolve(__dirname, 'obagi-professional-c-serum-review.html'),
          'PalmersCocoaButterStretchMarkKitDir': path.resolve(__dirname, 'reviews/palmers-cocoa-butter-stretch-mark-kit/index.html'),
          'PalmersCocoaButterStretchMarkKitStub': path.resolve(__dirname, 'palmers-cocoa-butter-stretch-mark-kit-review.html'),
          'PaulMitchellTeaTreeHairAndBodyMoisturizerDir': path.resolve(__dirname, 'reviews/paul-mitchell-tea-tree-hair-and-body-moisturizer/index.html'),
          'PaulMitchellTeaTreeHairAndBodyMoisturizerStub': path.resolve(__dirname, 'paul-mitchell-tea-tree-hair-and-body-moisturizer-review.html'),
          'TheBaldBrothersScalpMoisturizerDir': path.resolve(__dirname, 'reviews/the-bald-brothers-scalp-moisturizer/index.html'),
          'TheBaldBrothersScalpMoisturizerStub': path.resolve(__dirname, 'the-bald-brothers-scalp-moisturizer-review.html'),
          'TheBaldBrothersSpf50InvisibleSunscreenGelDir': path.resolve(__dirname, 'reviews/the-bald-brothers-spf-50-invisible-sunscreen-gel/index.html'),
          'TheBaldBrothersSpf50InvisibleSunscreenGelStub': path.resolve(__dirname, 'the-bald-brothers-spf-50-invisible-sunscreen-gel-review.html'),
          'UvClearSunscreenDir': path.resolve(__dirname, 'reviews/uv-clear-sunscreen/index.html'),
          'UvClearSunscreenStub': path.resolve(__dirname, 'uv-clear-sunscreen-review.html'),
          'YouthToThePeopleAdaptogenSkinRepairingPeptideCreamDir': path.resolve(__dirname, 'reviews/youth-to-the-people-adaptogen-skin-repairing-peptide-cream/index.html'),
          'YouthToThePeopleAdaptogenSkinRepairingPeptideCreamStub': path.resolve(__dirname, 'youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html'),
          'YouthToThePeopleSuperberryHydrateGlowDreamMaskDir': path.resolve(__dirname, 'reviews/youth-to-the-people-superberry-hydrate-glow-dream-mask/index.html'),
          'YouthToThePeopleSuperberryHydrateGlowDreamMaskStub': path.resolve(__dirname, 'youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html'),
          'YouthToThePeopleSuperfoodAirWhipMoistureCreamDir': path.resolve(__dirname, 'reviews/youth-to-the-people-superfood-air-whip-moisture-cream/index.html'),
          'YouthToThePeopleSuperfoodAirWhipMoistureCreamStub': path.resolve(__dirname, 'youth-to-the-people-superfood-air-whip-moisture-cream-review.html'),
          'YouthToThePeopleSupershroomFacialCleanserDir': path.resolve(__dirname, 'reviews/youth-to-the-people-supershroom-facial-cleanser/index.html'),
          'YouthToThePeopleSupershroomFacialCleanserStub': path.resolve(__dirname, 'youth-to-the-people-supershroom-facial-cleanser-review.html'),
        },
      },
    },
    base: process.env.VITE_BASE_URL || process.env.BASE_URL || '/',
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
