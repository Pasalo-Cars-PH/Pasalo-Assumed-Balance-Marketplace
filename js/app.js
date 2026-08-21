/* Pasalo Cars PH — marketplace app (listings + home + detail) */
(function () {
  'use strict';

  var vehicles = [];
  var pageSize = 12;
  var visibleCount = pageSize;

  function money(n, fallback) {
    fallback = fallback || 'PM for details';
    if (n == null || n === '') return fallback;
    var num = Number(n);
    if (isNaN(num)) return fallback;
    return '₱' + num.toLocaleString('en-PH');
  }

  function show(v) {
    return v == null || v === '' ? 'To confirm' : String(v);
  }

  function title(v) {
    return [v.make, v.model, v.variant && v.variant !== '—' ? v.variant : '', v.year || '']
      .filter(Boolean)
      .join(' ');
  }

  function qs(key) {
    return new URLSearchParams(location.search).get(key);
  }

  function age(v) {
    if (!v.listedAt) return 'Listed recently';
    var h = Math.max(0, (Date.now() - new Date(v.listedAt).getTime()) / 36e5);
    if (h < 1) return 'Listed ' + Math.max(1, Math.round(h * 60)) + ' min ago';
    if (h < 24) return 'Listed ' + Math.round(h) + ' hr ago';
    var d = Math.round(h / 24);
    return 'Listed ' + d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function imgHtml(v) {
    var t = esc(title(v));
    var emoji = esc(v.emoji || '🚗');
    if (v.image) {
      return (
        '<img src="' +
        esc(v.image) +
        '" alt="' +
        t +
        '" loading="lazy" onerror="this.style.display=\'none\';var f=this.nextElementSibling;if(f)f.style.display=\'grid\'">' +
        '<span class="img-fallback" style="display:none">' +
        emoji +
        '</span>'
      );
    }
    return '<span class="img-fallback">' + emoji + '</span>';
  }

  function card(v) {
    return (
      '<article class="vehicle-card">' +
      '<div class="vehicle-image">' +
      imgHtml(v) +
      (v.color ? '<div class="vehicle-badges"><span class="badge">' + esc(v.color) + '</span></div>' : '') +
      '</div>' +
      '<div class="vehicle-body">' +
      '<div class="vehicle-title">' +
      esc(title(v)) +
      '</div>' +
      '<div class="vehicle-price">' +
      money(v.cashOut) +
      ' cash-out</div>' +
      '<div class="vehicle-monthly">' +
      money(v.monthly) +
      (v.monthly != null && v.monthly !== '' ? ' / month' : '') +
      '</div>' +
      '<div class="vehicle-meta">' +
      '<span>📍 ' +
      esc(show(v.location)) +
      '</span>' +
      '<span>🏦 ' +
      esc(show(v.bank)) +
      '</span>' +
      '<span>' +
      esc(age(v)) +
      '</span>' +
      '</div>' +
      '<a class="btn btn-secondary" href="vehicle.html?id=' +
      encodeURIComponent(v.id) +
      '">View Details</a>' +
      '</div></article>'
    );
  }

  function numOrNull(v) {
    if (v == null || v === '') return null;
    var n = Number(v);
    return isNaN(n) ? null : n;
  }

  function getFilters() {
    return {
      q: ((document.querySelector('#q') || {}).value || '').trim().toLowerCase(),
      make: (document.querySelector('#make') || {}).value || '',
      location: (document.querySelector('#location') || {}).value || '',
      body: (document.querySelector('#body') || {}).value || '',
      maxMonthly: numOrNull((document.querySelector('#monthly') || {}).value),
      maxCash: numOrNull((document.querySelector('#cash') || {}).value),
      minMonthly: numOrNull((document.querySelector('#min-monthly') || {}).value) || 0,
      minCash: numOrNull((document.querySelector('#min-cash') || {}).value) || 0,
      sort: (document.querySelector('#sort') || {}).value || 'new'
    };
  }

  function filterList() {
    var f = getFilters();
    var list = vehicles.filter(function (v) {
      if (v.status !== 'active') return false;

      var hay = [v.make, v.model, v.variant, v.color, v.bodyType].join(' ').toLowerCase();
      if (f.q && hay.indexOf(f.q) === -1) return false;
      if (f.make && v.make !== f.make) return false;
      if (f.body && v.bodyType !== f.body) return false;
      if (f.location && v.location !== f.location) return false;

      var m = numOrNull(v.monthly);
      var c = numOrNull(v.cashOut);

      if (m != null) {
        if (f.maxMonthly != null && m > f.maxMonthly) return false;
        if (f.minMonthly > 0 && m < f.minMonthly) return false;
      } else if (f.minMonthly > 0) {
        return false;
      }

      if (c != null) {
        if (f.maxCash != null && c > f.maxCash) return false;
        if (f.minCash > 0 && c < f.minCash) return false;
      } else if (f.minCash > 0) {
        return false;
      }

      return true;
    });

    if (f.sort === 'monthly') {
      list.sort(function (a, b) {
        return (numOrNull(a.monthly) ?? 1e12) - (numOrNull(b.monthly) ?? 1e12);
      });
    } else if (f.sort === 'cash') {
      list.sort(function (a, b) {
        return (numOrNull(a.cashOut) ?? 1e12) - (numOrNull(b.cashOut) ?? 1e12);
      });
    } else if (f.sort === 'year') {
      list.sort(function (a, b) {
        return (Number(b.year) || 0) - (Number(a.year) || 0);
      });
    } else {
      list.sort(function (a, b) {
        return new Date(b.listedAt || 0) - new Date(a.listedAt || 0);
      });
    }
    return list;
  }

  function fillSelect(sel, values, placeholder) {
    if (!sel) return;
    var cur = sel.value;
    var uniq = [];
    values.forEach(function (v) {
      if (v && uniq.indexOf(v) === -1) uniq.push(v);
    });
    uniq.sort();
    sel.innerHTML =
      '<option value="">' +
      placeholder +
      '</option>' +
      uniq
        .map(function (v) {
          return '<option value="' + esc(v) + '">' + esc(v) + '</option>';
        })
        .join('');
    if (cur) sel.value = cur;
  }

  function drawListings() {
    var grid = document.querySelector('#results-grid');
    if (!grid) return;

    var list = filterList();
    var count = document.querySelector('#result-count');
    var summary = document.querySelector('#result-summary');
    var loadWrap = document.querySelector('#load-more-wrap');
    var loadCount = document.querySelector('#load-more-count');

    if (count) {
      count.textContent =
        list.length + ' vehicle' + (list.length === 1 ? '' : 's') + ' found';
    }
    if (summary) {
      summary.textContent =
        list.length === 0
          ? 'Try wider budget or location'
          : 'Showing live marketplace catalog';
    }

    var slice = list.slice(0, visibleCount);
    grid.innerHTML = slice.length
      ? slice.map(card).join('')
      : '<div class="empty">No vehicles match those filters yet. Try a wider budget or location.</div>';

    if (loadWrap) {
      var more = list.length > visibleCount;
      loadWrap.classList.toggle('hidden', !more);
      if (loadCount) {
        loadCount.textContent = more
          ? 'Showing ' + slice.length + ' of ' + list.length
          : list.length
            ? 'Showing all ' + list.length
            : '';
      }
    }
  }

  function renderListings() {
    var grid = document.querySelector('#results-grid');
    if (!grid) return;

    var qEl = document.querySelector('#q');
    var makeEl = document.querySelector('#make');
    var locEl = document.querySelector('#location');
    var bodyEl = document.querySelector('#body');
    var monthlyEl = document.querySelector('#monthly');
    var cashEl = document.querySelector('#cash');
    var minMonthlyEl = document.querySelector('#min-monthly');
    var minCashEl = document.querySelector('#min-cash');
    var sortEl = document.querySelector('#sort');

    if (qEl) qEl.value = qs('q') || '';
    if (monthlyEl) monthlyEl.value = qs('monthly') || '';
    if (cashEl) cashEl.value = qs('cash') || '';
    if (minMonthlyEl) minMonthlyEl.value = qs('min-monthly') || '';
    if (minCashEl) minCashEl.value = qs('min-cash') || '';
    if (sortEl) sortEl.value = qs('sort') || 'new';

    var active = vehicles.filter(function (v) {
      return v.status === 'active';
    });
    fillSelect(
      makeEl,
      active.map(function (v) {
        return v.make;
      }),
      'Any brand'
    );
    fillSelect(
      locEl,
      active.map(function (v) {
        return v.location;
      }),
      'Any location'
    );
    fillSelect(
      bodyEl,
      active.map(function (v) {
        return v.bodyType;
      }),
      'Any type'
    );

    if (makeEl && qs('make')) makeEl.value = qs('make');
    if (locEl && qs('location')) locEl.value = qs('location');
    if (bodyEl && qs('body')) bodyEl.value = qs('body');

    function apply() {
      visibleCount = pageSize;
      var u = new URL(location.href);
      [
        ['q', qEl],
        ['make', makeEl],
        ['location', locEl],
        ['body', bodyEl],
        ['monthly', monthlyEl],
        ['cash', cashEl],
        ['min-monthly', minMonthlyEl],
        ['min-cash', minCashEl],
        ['sort', sortEl]
      ].forEach(function (pair) {
        var k = pair[0];
        var el = pair[1];
        var val = (el && el.value) || '';
        if (val) u.searchParams.set(k, val);
        else u.searchParams.delete(k);
      });
      history.replaceState({}, '', u);
      drawListings();
    }

    document.querySelector('#apply')?.addEventListener('click', apply);
    document.querySelector('#clear-filters')?.addEventListener('click', function () {
      [qEl, makeEl, locEl, bodyEl, monthlyEl, cashEl, minMonthlyEl, minCashEl].forEach(function (el) {
        if (el) el.value = '';
      });
      if (sortEl) sortEl.value = 'new';
      apply();
    });
    sortEl?.addEventListener('change', apply);
    document.querySelector('#load-more')?.addEventListener('click', function () {
      visibleCount += pageSize;
      drawListings();
    });
    qEl?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        apply();
      }
    });

    drawListings();
  }

  function renderHome() {
    var el = document.querySelector('#featured-list');
    if (!el) return;
    var list = vehicles
      .filter(function (v) {
        return v.status === 'active';
      })
      .sort(function (a, b) {
        return new Date(b.listedAt || 0) - new Date(a.listedAt || 0);
      })
      .slice(0, 6);
    el.innerHTML = list.length
      ? list.map(card).join('')
      : '<div class="empty">No featured vehicles yet.</div>';
  }

  function renderVehicle() {
    var root = document.querySelector('#vehicle-root');
    if (!root) return;
    var id = qs('id');
    var v = vehicles.find(function (x) {
      return x.id === id;
    });
    if (!v) {
      root.innerHTML =
        '<div class="empty">Vehicle not found. <a href="listings.html">Browse →</a></div>';
      return;
    }
    root.innerHTML =
      '<div class="detail-top"><div class="detail-photo">' +
      imgHtml(v) +
      '</div><div class="detail-card">' +
      '<span class="eyebrow">AVAILABLE LISTING</span><h1>' +
      esc(title(v)) +
      '</h1>' +
      '<p class="vehicle-meta">📍 ' +
      esc(show(v.location)) +
      ' · 🏦 ' +
      esc(show(v.bank)) +
      '</p>' +
      '<div class="detail-price">' +
      money(v.cashOut) +
      '</div><p>Cash-out</p>' +
      '<div class="vehicle-monthly">' +
      money(v.monthly) +
      ' / month</div>' +
      '<a class="btn btn-primary" href="listings.html" style="margin-top:16px;display:inline-flex">Back to listings</a>' +
      '</div></div>';
  }

  function setupMobileNav() {
    var btn = document.querySelector('.menu-toggle');
    var nav =
      document.querySelector('.nav-mobile') ||
      document.querySelector('.mobile-nav') ||
      document.querySelector('#mobile-nav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      nav.setAttribute('aria-hidden', String(!open));
      nav.classList.toggle('open', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        btn.setAttribute('aria-expanded', 'false');
        nav.setAttribute('aria-hidden', 'true');
        nav.classList.remove('open');
      });
    });
  }

  function showError(msg) {
    var count = document.querySelector('#result-count');
    var summary = document.querySelector('#result-summary');
    var grid = document.querySelector('#results-grid');
    if (count) count.textContent = 'Unable to load marketplace';
    if (summary) summary.textContent = msg;
    if (grid) {
      grid.innerHTML =
        '<div class="empty">' +
        esc(msg) +
        ' <button type="button" class="btn btn-secondary" id="retry-load">Retry</button></div>';
      document.querySelector('#retry-load')?.addEventListener('click', loadData);
    }
  }

  function afterLoad() {
    renderHome();
    renderListings();
    renderVehicle();
  }

  function loadData() {
    fetch('data/vehicles.json?v=' + Date.now(), {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        vehicles = Array.isArray(data.vehicles)
          ? data.vehicles
          : Array.isArray(data)
            ? data
            : [];
        window.vehicles = vehicles;
        if (!vehicles.length) {
          showError('No vehicles in catalog yet.');
          return;
        }
        afterLoad();
        console.log('Pasalo Cars PH:', vehicles.length, 'vehicles');
      })
      .catch(function (err) {
        console.warn(err);
        showError('Could not load data/vehicles.json');
      });
  }

  function boot() {
    setupMobileNav();
    loadData();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.renderHome = renderHome;
  window.renderListings = renderListings;
  window.renderVehicle = renderVehicle;
  window.drawListings = drawListings;
})();
