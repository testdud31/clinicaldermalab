import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          blog: path.resolve(__dirname, 'blog.html'),
          cetaphilScrub: path.resolve(__dirname, 'cetaphil-extra-gentle-daily-scrub-review.html'),
          elemisMidnightFacial: path.resolve(__dirname, 'elemis-superfood-midnight-facial-review.html'),
          elemisMarineSPF: path.resolve(__dirname, 'elemis-pro-collagen-marine-cream-spf-30-review.html'),
          elemisResurfacingPads: path.resolve(__dirname, 'elemis-dynamic-resurfacing-facial-pads-review.html'),
          elemisBalm: path.resolve(__dirname, 'elemis-pro-collagen-cleansing-balm-review.html'),
          elemisEyeMask: path.resolve(__dirname, 'elemis-pro-collagen-eye-revive-mask-review.html'),
          colorescienceFlex: path.resolve(__dirname, 'colorescience-total-protection-face-shield-flex-spf-50-review.html'),
          eltamdAMRestore: path.resolve(__dirname, 'eltamd-am-restore-face-moisturizer-review.html'),
          uvClear: path.resolve(__dirname, 'uv-clear-sunscreen-review.html'),
          toleriane: path.resolve(__dirname, 'la-roche-posay-toleriane-double-repair-review.html'),
          bloomCream: path.resolve(__dirname, 'beekman-1802-bloom-cream-moisturizer-review.html'),
          milkrxCream: path.resolve(__dirname, 'beekman-1802-advanced-better-aging-cream-review.html'),
          obagiSerum: path.resolve(__dirname, 'obagi-professional-c-serum-review.html'),
          kiehlsCream: path.resolve(__dirname, 'kiehls-ultra-facial-cream-review.html'),
          teaTreeMoisturizer: path.resolve(__dirname, 'paul-mitchell-tea-tree-hair-and-body-moisturizer-review.html'),
          flakesSet: path.resolve(__dirname, 'flakes-anti-dandruff-shampoo-and-conditioner-set-review.html'),
          palmersStretchMark: path.resolve(__dirname, 'palmers-cocoa-butter-stretch-mark-kit-review.html'),
          baldBrothersMoisturizer: path.resolve(__dirname, 'the-bald-brothers-scalp-moisturizer-review.html'),
          baldBrothersSunscreen: path.resolve(__dirname, 'the-bald-brothers-spf-50-invisible-sunscreen-gel-review.html'),
          beautyByEarthTanner: path.resolve(__dirname, 'beauty-by-earth-self-tanner-lotion-review.html'),
          yttpCleanser: path.resolve(__dirname, 'youth-to-the-people-supershroom-facial-cleanser-review.html'),
          yttpAdaptogen: path.resolve(__dirname, 'youth-to-the-people-adaptogen-skin-repairing-peptide-cream-review.html'),
          yttpAirWhip: path.resolve(__dirname, 'youth-to-the-people-superfood-air-whip-moisture-cream-review.html'),
          yttpDreamMask: path.resolve(__dirname, 'youth-to-the-people-superberry-hydrate-glow-dream-mask-review.html'),
          about: path.resolve(__dirname, 'about.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
          terms: path.resolve(__dirname, 'terms.html'),
          methodology: path.resolve(__dirname, 'methodology.html'),
          treatmentsDir: path.resolve(__dirname, 'treatments/index.html'),
          treatments: path.resolve(__dirname, 'treatments.html'),
          conditionsDir: path.resolve(__dirname, 'conditions/index.html'),
          conditions: path.resolve(__dirname, 'conditions.html'),
          scienceIngredientsDir: path.resolve(__dirname, 'science-and-ingredients/index.html'),
          scienceIngredients: path.resolve(__dirname, 'science-and-ingredients.html'),
          medicalReviewBoardDir: path.resolve(__dirname, 'medical-review-board/index.html'),
          medicalReviewBoard: path.resolve(__dirname, 'medical-review-board.html'),
          notFound: path.resolve(__dirname, '404.html'),
        },
      },
    },
    base: process.env.VITE_BASE_URL || process.env.BASE_URL || '/',
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
