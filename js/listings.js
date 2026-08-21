/* PASALO CARS PH — MARKETPLACE LISTINGS */
(function () {
  'use strict';

  var allVehicles = [];
  var filteredVehicles = [];

  function money(n, fallback) {
    fallback = fallback || 'PM for details';
    if (n == null || n === '' || Number.isNaN(Number(n))) return fallback;
    return '₱' + Number(n).toLocaleString('en-PH');
  }

  function show(v) { return v == null || v === '' ? 'To confirm' : String(v); }

  function vehicleTitle(v) {
    return [v.year, v.make, v.model, v.variant && v.variant !== '—' ? v.variant : '']
      .filter(Boolean).join(' ');
  }

  function ageLabel(v) {
    if (!v.listedAt) return 'Listed recently';
    var time = new Date(v.listedAt).getTime();
    if (!Number.isFinite(time)) return 'Listed recently';
    var h = Math.max(0, (Date.now() - time) / 36e5);
    if (h < 1) return 'Listed ' + Math.max(1, Math.round(h * 60)) + ' min ago';
    if (h < 24) return 'Listed ' + Math.round(h) + ' hr ago';
    var d = Math.round(h / 24);
    return 'Listed ' + d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function toNumber(val) {
    if (val == null || val === '') return null;
    var n = Number(String(val).replace(/[^0-9.-]/g, ''));
    return Number.isNaN(n) ? null : n;
  }

  function imageUrl(path) {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return new URL(String(path).replace(/^\.\//, ''), document.baseURI).href;
  }

  function normalizeVehicle(v) {
    if (!v || typeof v !== 'object') return v;
    // Keep old/new listing schemas compatible. This also repairs legacy field names.
    if (v.monthly == null && v.monthly_payment != null) v.monthly = v.monthly_payment;
    if (v.cashOut == null && v.cash_out != null) v.cashOut = v.cash_out;
    if (v.monthsRemaining == null && v.remaining_months != null) v.monthsRemaining = v.remaining_months;
    if (v.mileage == null && v.odometer != null) v.mileage = String(v.odometer) + (v.odometer_unit ? ' ' + v.odometer_unit : '');
    if (v.bank == null && v.financing != null) v.bank = v.financing;
    if (!v.bodyType) v.bodyType = 'Vehicle';
    if (!v.status) v.status = 'active';
    return v;
  }

  function listingCard(v) {
    var t = vehicleTitle(v);
    var img = imageUrl(v.image);
    var image = img
      ? '<img src="' + escapeHtml(img) + '" alt="' + escapeHtml(t) + '" loading="lazy" decoding="async" onerror="this.closest(\'.vehicle-image\').classList.add(\'image-failed\');this.remove()">'
      : '';
    var emoji = escapeHtml(v.emoji || '🚗');
    var cash = toNumber(v.cashOut);
    var inquiry = 'https://m.me/PasaloCarsPH21?ref=' + encodeURIComponent('Marketplace inquiry: ' + t);

    return '<article class="vehicle-card">' +
      '<div class="vehicle-image">' + (image || '<div class="vehicle-image-fallback">' + emoji + '</div>') +
      (v.color ? '<div class="vehicle-badges"><span class="badge">' + escapeHtml(v.color) + '</span></div>' : '') +
      '</div>' +
      '<div class="vehicle-body">' +
      '<div class="vehicle-title">' + escapeHtml(t) + '</div>' +
      '<div class="vehicle-price">' + (cash != null ? money(cash) : 'PM') + ' cash-out</div>' +
      '<div class="vehicle-monthly">' + money(v.monthly) + (v.monthly != null ? ' / month' : '') + '</div>' +
      '<div class="vehicle-meta"><span>📍 ' + escapeHtml(show(v.location)) + '</span><span>🏦 ' + escapeHtml(show(v.bank)) + '</span><span>' + escapeHtml(ageLabel(v)) + '</span></div>' +
      '<div class="vehicle-actions"><a class="btn btn-secondary" href="vehicle.html?id=' + encodeURIComponent(v.id) + '">View Details</a><a class="btn btn-primary" target="_blank" rel="noopener" href="' + escapeHtml(inquiry) + '">💬 Inquire</a></div>' +
      '</div></article>';
  }

  function populateFilters() {
    var makes = new Set(), locations = new Set(), bodies = new Set();
    allVehicles.forEach(function (v) {
      if (v.make) makes.add(v.make);
      if (v.location && v.location !== 'To confirm') locations.add(v.location);
      if (v.bodyType) bodies.add(v.bodyType);
    });
    function fill(id, values, label) {
      var el = document.getElementById(id); if (!el) return;
      var current = el.value;
      el.innerHTML = '<option value="">' + label + '</option>';
      Array.from(values).sort().forEach(function (value) {
        var option = document.createElement('option'); option.value = value; option.textContent = value; el.appendChild(option);
      });
      if (current) el.value = current;
    }
    fill('make', makes, 'Any brand'); fill('location', locations, 'Any location'); fill('body', bodies, 'Any type');
  }

  function applyFilters() {
    var q = (document.getElementById('q')?.value || '').trim().toLowerCase();
    var make = document.getElementById('make')?.value || '';
    var loc = document.getElementById('location')?.value || '';
    var body = document.getElementById('body')?.value || '';
    var maxMonthly = toNumber(document.getElementById('monthly')?.value); var maxCash = toNumber(document.getElementById('cash')?.value);
    var minMonthly = toNumber(document.getElementById('min-monthly')?.value); var minCash = toNumber(document.getElementById('min-cash')?.value);
    var sort = document.getElementById('sort')?.value || 'new';

    filteredVehicles = allVehicles.filter(function (v) {
      if (v.status !== 'active') return false;
      var title = [v.year, v.make, v.model, v.variant, v.color, v.location].join(' ').toLowerCase();
      if (q && !title.includes(q)) return false;
      if (make && v.make !== make) return false;
      if (loc && v.location !== loc) return false;
      if (body && v.bodyType !== body) return false;
      var monthly = toNumber(v.monthly), cash = toNumber(v.cashOut);
      if (monthly != null && maxMonthly != null && monthly > maxMonthly) return false;
      if (monthly != null && minMonthly != null && monthly < minMonthly) return false;
      if (cash != null && maxCash != null && cash > maxCash) return false;
      if (cash != null && minCash != null && cash < minCash) return false;
      return true;
    });

    if (sort === 'monthly') filteredVehicles.sort(function(a,b){return (toNumber(a.monthly) ?? Infinity)-(toNumber(b.monthly) ?? Infinity);});
    else if (sort === 'cash') filteredVehicles.sort(function(a,b){return (toNumber(a.cashOut) ?? Infinity)-(toNumber(b.cashOut) ?? Infinity);});
    else if (sort === 'year') filteredVehicles.sort(function(a,b){return (b.year || 0)-(a.year || 0);});
    else filteredVehicles.sort(function(a,b){return new Date(b.listedAt || 0)-new Date(a.listedAt || 0);});

    renderResults();
  }

  function renderResults() {
    var grid = document.getElementById('results-grid'); if (!grid) return;
    var count = document.getElementById('result-count'), summary = document.getElementById('result-summary');
    if (count) count.textContent = filteredVehicles.length + ' vehicle' + (filteredVehicles.length === 1 ? '' : 's') + ' found';
    if (summary) summary.textContent = filteredVehicles.length ? 'Showing latest listings' : 'No matches found';
    grid.innerHTML = filteredVehicles.length ? filteredVehicles.map(listingCard).join('') : '<div class="empty">No vehicles match those filters yet. Try a wider budget or location.</div>';
    if (typeof window.updateMarketplaceCTAs === 'function') window.updateMarketplaceCTAs();
  }

  function clearFilters() {
    ['q','make','location','body','monthly','cash','min-monthly','min-cash'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
    var sort=document.getElementById('sort');if(sort)sort.value='new';applyFilters();
  }

  async function fetchJson(url, timeoutMs) {
    var controller = new AbortController();
    var timer = setTimeout(function(){controller.abort();}, timeoutMs || 10000);
    try {
      var response = await fetch(url, {cache:'no-store', headers:{Accept:'application/json'}, signal:controller.signal});
      if (!response.ok) throw new Error('HTTP ' + response.status);
      var text = await response.text();
      try {
        return JSON.parse(text);
      } catch (parseError) {
        // Repair a known malformed legacy tail without modifying the source inventory.
        var repaired = text.replace(/("cash_out"\s*:\s*-?\d+(?:\.\d+)?)"(\s*,?\s*\n\s*"listedAt")/g, '$1,$2');
        return JSON.parse(repaired);
      }
    } finally { clearTimeout(timer); }
  }

  async function loadVehicles() {
    var grid=document.getElementById('results-grid');
    if(grid)grid.innerHTML='<div class="empty">Loading marketplace...</div>';
    var sources=[
      new URL('data/vehicles.json?v=' + Date.now(), document.baseURI).href,
      'https://raw.githubusercontent.com/Pasalo-Cars-PH/Pasalo-Assumed-Balance-Marketplace/v1-marketplace/data/vehicles.json?v=' + Date.now()
    ];
    var lastError;
    for(var i=0;i<sources.length;i++){
      try{
        var data=await fetchJson(sources[i],10000);
        var list=Array.isArray(data.vehicles)?data.vehicles.map(normalizeVehicle):[];
        if(!list.length) throw new Error('Vehicle data is empty');
        allVehicles=list;
        window.vehicles=allVehicles;
        populateFilters(); applyFilters();
        console.log('✅ Marketplace loaded:', allVehicles.length, 'vehicles from', sources[i]);
        return;
      }catch(err){lastError=err;console.warn('Marketplace data source failed:',sources[i],err);}
    }
    console.error('Marketplace failed to load:',lastError);
    if(grid)grid.innerHTML='<div class="empty"><b>Marketplace data could not be loaded.</b><br>Please tap Retry.<br><button type="button" class="btn btn-secondary" id="retry-listings" style="margin-top:12px">Retry</button></div>';
    document.getElementById('retry-listings')?.addEventListener('click',loadVehicles);
  }

  window.renderListings=applyFilters;

  document.addEventListener('DOMContentLoaded',function(){
    if(!document.getElementById('results-grid'))return;
    document.getElementById('apply')?.addEventListener('click',applyFilters);
    document.getElementById('clear-filters')?.addEventListener('click',clearFilters);
    document.getElementById('sort')?.addEventListener('change',applyFilters);
    document.getElementById('q')?.addEventListener('input',function(){clearTimeout(window._searchTimer);window._searchTimer=setTimeout(applyFilters,250);});
    loadVehicles();
  });
})();
