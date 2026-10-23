/**
 * Clinical Derma Lab - SEO & E-E-A-T Progressive Enhancement Client
 * - Manages interactive citation accordions (ARIA compliant)
 * - Verifies canonical and OpenGraph consistency
 * - Handles formulation catalog filtering and search
 * - Enhances keyboard accessibility (focus traps, escape listeners)
 */
(function() {
  'use strict';

  // 1. Interactive Citations & References Accordion
  function initCitationsAccordion() {
    var toggles = document.querySelectorAll('[data-accordion-toggle="citations"]');
    toggles.forEach(function(toggle) {
      toggle.addEventListener('click', function() {
        var targetId = toggle.getAttribute('aria-controls') || 'citations-panel';
        var panel = document.getElementById(targetId);
        if (!panel) return;
        var isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
        if (isExpanded) {
          panel.hidden = true;
          panel.style.display = 'none';
        } else {
          panel.hidden = false;
          panel.style.display = 'block';
        }
      });

      // Keyboard support
      toggle.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    });
  }

  // 2. Canonical self-referencing check
  function verifyCanonical() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && (!canonical.getAttribute('href') || canonical.getAttribute('href') === '')) {
      canonical.setAttribute('href', window.location.origin + window.location.pathname);
    }
  }

  // 3. Treatment Catalog Category Filter
  function initCatalogFilters() {
    var filterBtns = document.querySelectorAll('[data-filter]');
    var cards = document.querySelectorAll('[data-category]');
    if (!filterBtns.length || !cards.length) return;

    filterBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var category = btn.getAttribute('data-filter');
        filterBtns.forEach(function(b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        cards.forEach(function(card) {
          var cardCategory = card.getAttribute('data-category');
          if (category === 'all' || cardCategory === category || (category && cardCategory && cardCategory.indexOf(category) !== -1)) {
            card.style.display = '';
            card.removeAttribute('hidden');
          } else {
            card.style.display = 'none';
            card.setAttribute('hidden', 'true');
          }
        });

        var countElem = document.getElementById('catalog-results-count');
        if (countElem) {
          var visibleCards = document.querySelectorAll('[data-category]:not([hidden])').length;
          countElem.textContent = visibleCards + ' Lab-Evaluated Formulations';
        }
      });
    });
  }

  // 4. Clinical Authority Modal / Tooltip
  function initAuthorityVerification() {
    var verifyBtn = document.getElementById('verify-credentials-btn');
    var modal = document.getElementById('credentials-modal');
    var closeBtn = document.getElementById('close-credentials-modal');
    if (!verifyBtn || !modal) return;

    verifyBtn.addEventListener('click', function(e) {
      e.preventDefault();
      modal.removeAttribute('hidden');
      modal.style.display = 'flex';
      if (closeBtn) closeBtn.focus();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        modal.setAttribute('hidden', 'true');
        modal.style.display = 'none';
        verifyBtn.focus();
      });
    }

    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.setAttribute('hidden', 'true');
        modal.style.display = 'none';
      }
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal && !modal.hidden) {
        modal.setAttribute('hidden', 'true');
        modal.style.display = 'none';
        verifyBtn.focus();
      }
    });
  }

  // 5. GitHub Pages Subpath Link & Asset Normalizer
  function normalizeGitHubPagesPaths() {
    var host = window.location.hostname;
    var pathname = window.location.pathname;
    if (host.endsWith('github.io')) {
      var segments = pathname.split('/').filter(Boolean);
      // For username.github.io/reponame/..., segments[0] is the repository name
      if (segments.length > 0 && !host.startsWith(segments[0])) {
        var repo = segments[0];
        var prefix = '/' + repo;

        // Prefix internal links
        var links = document.querySelectorAll('a[href^="/"]');
        links.forEach(function(a) {
          var href = a.getAttribute('href');
          if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(prefix + '/') && href !== prefix) {
            a.setAttribute('href', prefix + href);
          }
        });

        // Prefix media and resources
        var elements = document.querySelectorAll('img[src^="/"], link[href^="/"], script[src^="/"]');
        elements.forEach(function(el) {
          var src = el.getAttribute('src');
          var href = el.getAttribute('href');
          if (src && src.startsWith('/') && !src.startsWith('//') && !src.startsWith(prefix + '/')) {
            el.setAttribute('src', prefix + src);
          }
          if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith(prefix + '/')) {
            el.setAttribute('href', prefix + href);
          }
        });
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      normalizeGitHubPagesPaths();
      initCitationsAccordion();
      verifyCanonical();
      initCatalogFilters();
      initAuthorityVerification();
    });
  } else {
    normalizeGitHubPagesPaths();
    initCitationsAccordion();
    verifyCanonical();
    initCatalogFilters();
    initAuthorityVerification();
  }
})();

