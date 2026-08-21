/* ============================================================================
   PASALO CARS PH - LISTINGS / MARKETPLACE PAGE
   Compatible with v1-marketplace branch
   ============================================================================ */

(function () {
  'use strict';

  // ---------- Helpers ----------
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

  function toNumber(val) {
    if (val == null || val === '') return null;
    var n = Number(String(val).replace(/,/g, ''));
    return Number.isNaN(n) ? null : n;
  }

  // ---------- Shared state ----------
  var allVehicles = [];
  var filteredVehicles = [];

  // ---------- Card template ----------
  function listingCard(v) {
    var t = vehicleTitle(v);
    var img = v.image
      ? '<img src="' + escapeHtml(v.image) + '" alt="' + escapeHtml(t) + '" loading="lazy" onerror="this.style.display=\'none\'">'
      : '';
    var emoji = escapeHtml(v.emoji || '🚗');

    return (
      '<article class="vehicle-card">' +
      '<div class="vehicle-image">' +
      (img || '<div style="display:grid;place-items:center;font-size:48px;height:100%;background:#edf0f4">' + emoji + '</div>') +
      (v.color ? '<div class="vehicle-badges"><span class="badge">' + escapeHtml(v.color) + '</span></div>' : '') +
      '</div>' +
      '<div class="vehicle-body">' +
      '<div class="vehicle-title">' + escapeHtml(t) + '</div>' +
      '<div class="vehicle-price">' + money(v.cashOut) + ' cash-out</div>' +
      '<div class="vehicle-monthly">' + money(v.monthly) + (v.monthly != null ? ' / month' : '') + '</div>' +
      '<div class="vehicle-meta">' +
      '<span>📍 ' + escapeHtml(show(v.location)) + '</span>' +
      '<span>🏦 ' + escapeHtml(show(v.bank)) + '</span>' +
      '<span>' + escapeHtml(ageLabel(v)) + '</span>' +
      '</div>' +
      '<a class="btn btn-secondary" href="vehicle.html?id=' + encodeURIComponent(v.id) + '">View Details</a>' +
      '</div>' +
      '</article>'
    );
  }

  // ---------- Populate filter dropdowns ----------
  function populateFilters() {
    var makes = new Set();
    var locations = new Set();
    var bodies = new Set();

    allVehicles.forEach(function (v) {
      if (v.make) makes.add(v.make);
      if (v.location && v.location !== 'To confirm') locations.add(v.location);
      if (v.bodyType) bodies.add(v.bodyType);
    });

    function fillSelect(id, values) {
      var el = document.getElementById(id);
      if (!el) return;
      var current = el.value;
      el.innerHTML = '<option value="">Any</option>';
      Array.from(values).sort().forEach(function (val) {
        var opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        el.appendChild(opt);
      });
      if (current) el.value = current;
    }

    fillSelect('make', makes);
    fillSelect('location', locations);
    fillSelect('body', bodies);
  }

  // ---------- Filter + Sort ----------
  function applyFilters() {
    var q = (document.getElementById('q')?.value || '').trim().toLowerCase();
    var make = document.getElementById('make')?.value || '';
    var loc = document.getElementById('location')?.value || '';
    var body = document.getElementById('body')?.value || '';
    var maxMonthly = toNumber(document.getElementById('monthly')?.value) ?? Infinity;
    var maxCash = toNumber(document.getElementById('cash')?.value) ?? Infinity;
    var minMonthly = toNumber(document.getElementById('min-monthly')?.value) ?? 0;
    var minCash = toNumber(document.getElementById('min-cash')?.value) ?? 0;
    var sort = document.getElementById('sort')?.value || 'new';

    filteredVehicles = allVehicles.filter(function (v) {
      if (v.status !== 'active') return false;

      var title = (v.make + ' ' + v.model + ' ' + (v.variant || '') + ' ' + (v.color || '')).toLowerCase();
      if (q && !title.includes(q)) return false;
      if (make && v.make !== make) return false;
      if (loc && v.location !== loc) return false;
      if (body && v.bodyType !== body) return false;

      var monthly = toNumber(v.monthly);
      var cash = toNumber(v.cashOut);

      if (monthly != null) {
        if (monthly > maxMonthly) return false;
        if (monthly < minMonthly) return false;
      }
      if (cash != null) {
        if (cash > maxCash) return false;
        if (cash < minCash) return false;
      }

      return true;
    });

    // Sort
    if (sort === 'monthly') {
      filteredVehicles.sort(function (a, b) {
        return (toNumber(a.monthly) ?? Infinity) - (toNumber(b.monthly) ?? Infinity);
      });
    } else if (sort === 'cash') {
      filteredVehicles.sort(function (a, b) {
        return (toNumber(a.cashOut) ?? Infinity) - (toNumber(b.cashOut) ?? Infinity);
      });
    } else if (sort === 'year') {
      filteredVehicles.sort(function (a, b) {
        return (b.year || 0) - (a.year || 0);
      });
    } else {
      // newest first
      filteredVehicles.sort(function (a, b) {
        return new Date(b.listedAt || 0) - new Date(a.listedAt || 0);
      });
    }

    renderResults();
  }

  // ---------- Render results ----------
  function renderResults() {
    var grid = document.getElementById('results-grid');
    var countEl = document.getElementById('result-count');
    var summaryEl = document.getElementById('result-summary');

    if (!grid) return;

    if (countEl) {
      countEl.textContent = filteredVehicles.length + ' vehicle' + (filteredVehicles.length === 1 ? '' : 's') + ' found';
    }
    if (summaryEl) {
      summaryEl.textContent = filteredVehicles.length ? 'Showing latest listings' : 'No matches found';
    }

    if (filteredVehicles.length === 0) {
      grid.innerHTML = '<div class="empty">No vehicles match those filters yet. Try a wider budget or location.</div>';
      return;
    }

    grid.innerHTML = filteredVehicles.map(listingCard).join('');
  }

  // ---------- Clear filters ----------
  function clearFilters() {
    ['q', 'make', 'location', 'body', 'monthly', 'cash', 'min-monthly', 'min-cash'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
    var sortEl = document.getElementById('sort');
    if (sortEl) sortEl.value = 'new';
    applyFilters();
  }

  // ---------- Load data ----------
  function loadVehicles() {
    var grid = document.getElementById('results-grid');
    if (grid) {
      grid.innerHTML = '<div class="empty">Loading marketplace...</div>';
    }

    fetch('data/vehicles.json?v=' + Date.now(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        allVehicles = Array.isArray(data.vehicles) ? data.vehicles : [];
        window.vehicles = allVehicles; // for data-recovery.js compatibility

        populateFilters();
        applyFilters();

        console.log('✅ Marketplace loaded', allVehicles.length, 'vehicles');
      })
      .catch(function (err) {
        console.error('Failed to load vehicles.json', err);
        if (grid) {
          grid.innerHTML =
            '<div class="empty">Could not load vehicle data. <button type="button" class="btn btn-secondary" id="retry-listings">Retry</button></div>';
          document.getElementById('retry-listings')?.addEventListener('click', loadVehicles);
        }
      });
  }

  // ---------- Expose for data-recovery.js ----------
  window.renderListings = applyFilters;

  // ---------- Boot ----------
  document.addEventListener('DOMContentLoaded', function () {
    // Only run on listings page
    if (!document.getElementById('results-grid')) return;

    document.getElementById('apply')?.addEventListener('click', applyFilters);
    document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
    document.getElementById('sort')?.addEventListener('change', applyFilters);

    // Live search (optional)
    document.getElementById('q')?.addEventListener('input', function () {
      clearTimeout(window._searchTimer);
      window._searchTimer = setTimeout(applyFilters, 300);
    });

    loadVehicles();
  });
})();
