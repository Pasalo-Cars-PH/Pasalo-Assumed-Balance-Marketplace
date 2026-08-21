/* ============================================================================
   PASALO CARS PH - MAIN APPLICATION SCRIPT (FIXED)
   - Mobile nav
   - Featured listings from data/vehicles.json
   - Null-safe money display
   - Image fallback
   ============================================================================ */

(function () {
  'use strict';

  // ---------- helpers ----------
  function money(n, fallback) {
    fallback = fallback || 'PM for details';
    if (n == null || n === '' || Number.isNaN(Number(n))) return fallback;
    return '₱' + Number(n).toLocaleString('en-PH');
  }

  function show(v) {
    return v == null || v === '' ? 'To confirm' : String(v);
  }

  function vehicleTitle(v) {
    return [v.make, v.model, v.variant && v.variant !== '—' ? v.variant : '', v.year && v.year !== '—' ? v.year : '']
      .filter(Boolean)
      .join(' ');
  }

  function ageLabel(v) {
    if (!v.listedAt) return 'Listed recently';
    var h = Math.max(0, (Date.now() - new Date(v.listedAt).getTime()) / 36e5);
    if (h < 1) return 'Listed ' + Math.max(1, Math.round(h * 60)) + ' min ago';
    if (h < 24) return 'Listed ' + Math.round(h) + ' hr ago';
    var d = Math.round(h / 24);
    return 'Listed ' + d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function getUrlParameter(param) {
    return new URLSearchParams(window.location.search).get(param);
  }

  function trackEvent(action, data) {
    console.log('📊 Event: ' + action, data || {});
  }

  function debounce(func, wait) {
    var timeout;
    return function executedFunction() {
      var args = arguments;
      var later = function () {
        clearTimeout(timeout);
        func.apply(null, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Shared catalog (also used by listings pages if same app.js)
  var vehicles = [];

  // ---------- mobile menu ----------
  function setupMobileMenu() {
    var menuToggle = document.querySelector('.menu-toggle');
    var mobileNav = document.querySelector('.nav-mobile') || document.querySelector('.mobile-nav') || document.querySelector('#mobile-nav');

    if (!menuToggle || !mobileNav) return;

    function setOpen(open) {
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileNav.setAttribute('aria-hidden', open ? 'false' : 'true');
      mobileNav.classList.toggle('open', open);
      // optional visual for hamburger
      if (menuToggle.textContent.trim() === '☰' || menuToggle.textContent.trim() === '✕') {
        menuToggle.textContent = open ? '✕' : '☰';
      }
    }

    menuToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      setOpen(!isExpanded);
    });

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('click', function (event) {
      var isClickInsideMenu = mobileNav.contains(event.target);
      var isClickInsideToggle = menuToggle.contains(event.target);
      var isMenuOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      if (!isClickInsideMenu && !isClickInsideToggle && isMenuOpen) {
        setOpen(false);
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 768) setOpen(false);
    });
  }

  // ---------- smooth scroll ----------
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ---------- featured cards (matches your index.html classes) ----------
  function featuredCard(v) {
    var t = vehicleTitle(v);
    var img = v.image
      ? '<img src="' + escapeHtml(v.image) + '" alt="' + escapeHtml(t) + '" class="vehicle-image" loading="lazy" onerror="this.style.display=\'none\'">'
      : '';
    var emoji = escapeHtml(v.emoji || '🚗');

    return (
      '<article class="vehicle-card">' +
      (img || '<div class="vehicle-image" style="display:grid;place-items:center;font-size:48px;background:#edf0f4">' + emoji + '</div>') +
      '<div class="vehicle-info">' +
      '<h3 class="vehicle-title">' + escapeHtml(t) + '</h3>' +
      '<div>' +
      '<div class="vehicle-price-label">CASH-OUT</div>' +
      '<div class="vehicle-price">' + money(v.cashOut) + '</div>' +
      '<div class="vehicle-monthly">' + money(v.monthly) + (v.monthly != null ? ' / month' : '') + '</div>' +
      '</div>' +
      '<div class="vehicle-details">' +
      '<div class="vehicle-detail-item"><span>📍 ' + escapeHtml(show(v.location)) + '</span></div>' +
      '<div class="vehicle-detail-item"><span>🏦 ' + escapeHtml(show(v.bank)) + '</span></div>' +
      '<div class="vehicle-detail-item"><span>⏱️ ' + escapeHtml(ageLabel(v)) + '</span></div>' +
      '</div>' +
      '<div class="vehicle-actions">' +
      '<a href="vehicle.html?id=' + encodeURIComponent(v.id) + '" class="btn btn-secondary">View Details</a>' +
      '<button type="button" class="btn btn-primary" data-vehicle-id="' + escapeHtml(v.id) + '">Inquire</button>' +
      '</div>' +
      '</div>' +
      '</article>'
    );
  }

  function populateFeaturedListings() {
    var featuredList = document.querySelector('#featured-list');
    if (!featuredList) return;

    var list = vehicles
      .filter(function (v) {
        return v.status === 'active';
      })
      .sort(function (a, b) {
        return new Date(b.listedAt || 0) - new Date(a.listedAt || 0);
      })
      .slice(0, 6);

    if (!list.length) {
      featuredList.innerHTML = '<div class="empty">No featured vehicles yet. Check back soon.</div>';
      return;
    }

    featuredList.innerHTML = list.map(featuredCard).join('');

    featuredList.querySelectorAll('[data-vehicle-id]').forEach(function (button) {
      button.addEventListener('click', function () {
        handleInquire(this.getAttribute('data-vehicle-id'));
      });
    });
  }

  function handleInquire(vehicleId) {
    trackEvent('inquire_click', { vehicleId: vehicleId });
    // Prefer detail page with inquiry section
    window.location.href = 'vehicle.html?id=' + encodeURIComponent(vehicleId);
  }

  // ---------- search (optional live log) ----------
  function initializeSearch() {
    var searchInput =
      document.querySelector('.search-box input[type="search"]') ||
      document.querySelector('.search-box input[name="q"]');
    if (!searchInput) return;

    var handleSearch = debounce(function (e) {
      var query = e.target.value.trim();
      if (query.length >= 2) {
        trackEvent('search_type', { query: query });
      }
    }, 300);

    searchInput.addEventListener('input', handleSearch);
  }

  // ---------- intersection observer ----------
  function initializeObserver() {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.vehicle-card, .category-card').forEach(function (card) {
      observer.observe(card);
    });
  }

  // ---------- load vehicles.json ----------
  function loadVehicles() {
    var featuredList = document.querySelector('#featured-list');
    if (featuredList) {
      featuredList.innerHTML = '<div class="empty">Loading marketplace...</div>';
    }

    return fetch('data/vehicles.json?v=' + Date.now(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        vehicles = Array.isArray(data.vehicles) ? data.vehicles : Array.isArray(data) ? data : [];
        window.vehicles = vehicles;
        populateFeaturedListings();
        // re-run observer after cards exist
        initializeObserver();
        console.log('✅ Pasalo Cars PH loaded', vehicles.length, 'vehicles');
      })
      .catch(function (err) {
        console.warn('Failed to load vehicles.json', err);
        if (featuredList) {
          featuredList.innerHTML =
            '<div class="empty">Could not load vehicle data. ' +
            '<button type="button" class="btn btn-secondary" id="retry-vehicles">Retry</button></div>';
          var retry = document.getElementById('retry-vehicles');
          if (retry) retry.addEventListener('click', loadVehicles);
        }
      });
  }

  // ---------- boot ----------
  document.addEventListener('DOMContentLoaded', function () {
    setupMobileMenu();
    setupSmoothScroll();
    initializeSearch();
    loadVehicles();
  });

  // expose helpers for other scripts (data-recovery, listings, etc.)
  window.getUrlParameter = getUrlParameter;
  window.trackEvent = trackEvent;
  window.populateFeaturedListings = populateFeaturedListings;
  window.handleInquire = handleInquire;
})();
