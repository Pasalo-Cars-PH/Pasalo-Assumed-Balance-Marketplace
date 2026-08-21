/* Pasalo Cars PH — marketplace app */
(function () {
  'use strict';

  var vehicles = [];
  var pageSize = 12;
  var visibleCount = pageSize;

  function qs(key) { return new URLSearchParams(location.search).get(key); }
  function show(v) { return v == null || v === '' ? 'To confirm' : String(v); }
  function num(v) {
    if (v == null || v === '') return null;
    var n = Number(String(v).replace(/,/g, '').replace(/₱/g, ''));
    return isNaN(n) ? null : n;
  }
  function money(v, fallback) {
    var n = num(v);
    return n == null ? (fallback || 'PM for details') : '₱' + n.toLocaleString('en-PH');
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function title(v) {
    return [v.make, v.model, v.variant && v.variant !== '—' ? v.variant : '', v.year || '']
      .filter(Boolean).join(' ');
  }
  function age(v) {
    if (!v.listedAt) return 'Listed recently';
    var t = new Date(v.listedAt).getTime();
    if (!isFinite(t)) return 'Listed recently';
    var h = Math.max(0, (Date.now() - t) / 36e5);
    if (h < 1) return 'Listed ' + Math.max(1, Math.round(h * 60)) + ' min ago';
    if (h < 24) return 'Listed ' + Math.round(h) + ' hr ago';
    var d = Math.round(h / 24);
    return 'Listed ' + d + ' day' + (d === 1 ? '' : 's') + ' ago';
  }

  /* Converts older imported field names to the current marketplace schema. */
  function normalize(v) {
    v = v || {};
    if (v.monthly == null && v.monthly_payment != null) v.monthly = v.monthly_payment;
    if (v.cashOut == null && v.cash_out != null) v.cashOut = v.cash_out;
    if (!v.bank && v.financing) v.bank = v.financing;
    if (v.monthsRemaining == null && v.remaining_months != null) v.monthsRemaining = v.remaining_months;
    if (!v.nextDue && v.due_date) v.nextDue = v.due_date;
    if (!v.mileage && v.odometer != null) v.mileage = String(v.odometer) + (v.odometer_unit ? ' ' + v.odometer_unit : '');
    if (!v.bodyType) {
      var m = String(v.model || '').toLowerCase();
      if (/raptor|ranger|triton|hilux|navara/.test(m)) v.bodyType = 'Pickup';
      else if (/terra|everest|fortuner|suv/.test(m)) v.bodyType = 'SUV';
      else v.bodyType = 'Other';
    }
    if (!v.status) v.status = 'active';
    return v;
  }

  /* Repair the known malformed numeric entry in the current catalog without changing listing data. */
  function repairCatalogText(text) {
    text = String(text || '').replace(/^\uFEFF/, '');
    text = text.replace(/("cash_out"\s*:\s*-?\d+(?:\.\d+)?)"\s*(?=")/g, '$1,\n');
    text = text.replace(/("(?:monthly_payment|cash_out|unitPrice|monthly|year|remaining_months|monthsRemaining|monthsPaid|odometer)"\s*:\s*)"(-?\d+(?:\.\d+)?)"/g, '$1$2');
    text = text.replace(/("(?:monthly_payment|cash_out|unitPrice|monthly|year|remaining_months|monthsRemaining|monthsPaid|odometer)"\s*:\s*)""(-?\d+(?:\.\d+)?)"/g, '$1$2');
    return text;
  }

  function imgHtml(v) {
    var t = esc(title(v));
    var emoji = esc(v.emoji || '🚗');
    if (!v.image) return '<span class="img-fallback">' + emoji + '</span>';
    return '<img src="' + esc(v.image) + '" alt="' + t + '" loading="lazy" onerror="this.style.display=\'none\';var f=this.nextElementSibling;if(f)f.style.display=\'grid\'">' +
      '<span class="img-fallback" style="display:none">' + emoji + '</span>';
  }

  function card(v) {
    return '<article class="vehicle-card"><div class="vehicle-image">' + imgHtml(v) +
      (v.color ? '<div class="vehicle-badges"><span class="badge">' + esc(v.color) + '</span></div>' : '') +
      '</div><div class="vehicle-body"><div class="vehicle-title">' + esc(title(v)) + '</div>' +
      '<div class="vehicle-price">' + money(v.cashOut) + ' cash-out</div>' +
      '<div class="vehicle-monthly">' + money(v.monthly) + (v.monthly != null && v.monthly !== '' ? ' / month' : '') + '</div>' +
      '<div class="vehicle-meta"><span>📍 ' + esc(show(v.location)) + '</span><span>🏦 ' + esc(show(v.bank)) + '</span><span>' + esc(age(v)) + '</span></div>' +
      '<a class="btn btn-secondary" href="vehicle.html?id=' + encodeURIComponent(v.id) + '">View Details</a>' +
      '</div></article>';
  }

  function filters() {
    return {
      q: ((document.querySelector('#q') || {}).value || '').trim().toLowerCase(),
      make: (document.querySelector('#make') || {}).value || '',
      location: (document.querySelector('#location') || {}).value || '',
      body: (document.querySelector('#body') || {}).value || '',
      maxMonthly: num((document.querySelector('#monthly') || {}).value),
      maxCash: num((document.querySelector('#cash') || {}).value),
      minMonthly: num((document.querySelector('#min-monthly') || {}).value) || 0,
      minCash: num((document.querySelector('#min-cash') || {}).value) || 0,
      sort: (document.querySelector('#sort') || {}).value || 'new'
    };
  }

  function filterList() {
    var f = filters();
    var list = vehicles.filter(function (v) {
      if (v.status !== 'active') return false;
      var hay = [v.make, v.model, v.variant, v.color, v.bodyType].join(' ').toLowerCase();
      if (f.q && hay.indexOf(f.q) === -1) return false;
      if (f.make && v.make !== f.make) return false;
      if (f.body && v.bodyType !== f.body) return false;
      if (f.location && v.location !== f.location) return false;
      var m = num(v.monthly), c = num(v.cashOut);
      if (m != null && f.maxMonthly != null && m > f.maxMonthly) return false;
      if (m != null && f.minMonthly > 0 && m < f.minMonthly) return false;
      if (m == null && f.minMonthly > 0) return false;
      if (c != null && f.maxCash != null && c > f.maxCash) return false;
      if (c != null && f.minCash > 0 && c < f.minCash) return false;
      if (c == null && f.minCash > 0) return false;
      return true;
    });
    if (f.sort === 'monthly') list.sort(function(a,b){ return (num(a.monthly) ?? 1e12) - (num(b.monthly) ?? 1e12); });
    else if (f.sort === 'cash') list.sort(function(a,b){ return (num(a.cashOut) ?? 1e12) - (num(b.cashOut) ?? 1e12); });
    else if (f.sort === 'year') list.sort(function(a,b){ return (Number(b.year)||0) - (Number(a.year)||0); });
    else list.sort(function(a,b){ return new Date(b.listedAt||0) - new Date(a.listedAt||0); });
    return list;
  }

  function fillSelect(sel, values, placeholder) {
    if (!sel) return;
    var cur = sel.value, uniq = [];
    values.forEach(function(v){ if(v && uniq.indexOf(v) === -1) uniq.push(v); });
    uniq.sort();
    sel.innerHTML = '<option value="">' + placeholder + '</option>' + uniq.map(function(v){ return '<option value="'+esc(v)+'">'+esc(v)+'</option>'; }).join('');
    if (cur) sel.value = cur;
  }

  function drawListings() {
    var grid = document.querySelector('#results-grid');
    if (!grid) return;
    var list = filterList();
    var count = document.querySelector('#result-count');
    var summary = document.querySelector('#result-summary');
    var wrap = document.querySelector('#load-more-wrap');
    var lc = document.querySelector('#load-more-count');
    if (count) count.textContent = list.length + ' vehicle' + (list.length === 1 ? '' : 's') + ' found';
    if (summary) summary.textContent = list.length ? 'Showing live marketplace catalog' : 'Try wider budget or location';
    var slice = list.slice(0, visibleCount);
    grid.innerHTML = slice.length ? slice.map(card).join('') : '<div class="empty">No vehicles match those filters yet. Try a wider budget or location.</div>';
    if (wrap) wrap.classList.toggle('hidden', list.length <= visibleCount);
    if (lc) lc.textContent = list.length > visibleCount ? 'Showing ' + slice.length + ' of ' + list.length : (list.length ? 'Showing all ' + list.length : '');
  }

  function renderListings() {
    var grid = document.querySelector('#results-grid');
    if (!grid) return;
    var q = document.querySelector('#q'), make = document.querySelector('#make'), loc = document.querySelector('#location'), body = document.querySelector('#body');
    var monthly = document.querySelector('#monthly'), cash = document.querySelector('#cash'), minM = document.querySelector('#min-monthly'), minC = document.querySelector('#min-cash'), sort = document.querySelector('#sort');
    if(q) q.value=qs('q')||''; if(monthly) monthly.value=qs('monthly')||''; if(cash) cash.value=qs('cash')||''; if(minM) minM.value=qs('min-monthly')||''; if(minC) minC.value=qs('min-cash')||''; if(sort) sort.value=qs('sort')||'new';
    var active=vehicles.filter(function(v){return v.status==='active';});
    fillSelect(make,active.map(function(v){return v.make;}),'Any brand');
    fillSelect(loc,active.map(function(v){return v.location;}),'Any location');
    fillSelect(body,active.map(function(v){return v.bodyType;}),'Any type');
    if(make&&qs('make'))make.value=qs('make'); if(loc&&qs('location'))loc.value=qs('location'); if(body&&qs('body'))body.value=qs('body');
    function apply(){
      visibleCount=pageSize; var u=new URL(location.href);
      [['q',q],['make',make],['location',loc],['body',body],['monthly',monthly],['cash',cash],['min-monthly',minM],['min-cash',minC],['sort',sort]].forEach(function(p){var val=(p[1]&&p[1].value)||''; if(val)u.searchParams.set(p[0],val);else u.searchParams.delete(p[0]);});
      history.replaceState({},'',u); drawListings();
    }
    var applyBtn=document.querySelector('#apply'); if(applyBtn)applyBtn.addEventListener('click',apply);
    var clear=document.querySelector('#clear-filters'); if(clear)clear.addEventListener('click',function(){[q,make,loc,body,monthly,cash,minM,minC].forEach(function(e){if(e)e.value='';});if(sort)sort.value='new';apply();});
    if(sort)sort.addEventListener('change',apply);
    var more=document.querySelector('#load-more'); if(more)more.addEventListener('click',function(){visibleCount+=pageSize;drawListings();});
    if(q)q.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();apply();}});
    drawListings();
  }

  function renderHome() {
    var el=document.querySelector('#featured-list'); if(!el)return;
    var list=vehicles.filter(function(v){return v.status==='active';}).sort(function(a,b){return new Date(b.listedAt||0)-new Date(a.listedAt||0);}).slice(0,6);
    el.innerHTML=list.length?list.map(card).join(''):'<div class="empty">No featured vehicles yet.</div>';
  }

  function renderVehicle() {
    var root=document.querySelector('#vehicle-root'); if(!root)return;
    var id=qs('id'), v=vehicles.find(function(x){return x.id===id;});
    if(!v){root.innerHTML='<div class="empty">Vehicle not found. <a href="listings.html">Browse →</a></div>';return;}
    root.innerHTML='<div class="detail-top"><div class="detail-photo">'+imgHtml(v)+'</div><div class="detail-card"><span class="eyebrow">AVAILABLE LISTING</span><h1>'+esc(title(v))+'</h1><p class="vehicle-meta">📍 '+esc(show(v.location))+' · 🏦 '+esc(show(v.bank))+'</p><div class="detail-price">'+money(v.cashOut)+'</div><p>Cash-out</p><div class="vehicle-monthly">'+money(v.monthly)+' / month</div><a class="btn btn-primary" href="listings.html" style="margin-top:16px;display:inline-flex">Back to listings</a></div></div>';
  }

  function setupMobileNav(){
    var btn=document.querySelector('.menu-toggle'), nav=document.querySelector('.nav-mobile')||document.querySelector('.mobile-nav')||document.querySelector('#mobile-nav');
    if(!btn||!nav)return;
    btn.addEventListener('click',function(e){e.stopPropagation();var open=btn.getAttribute('aria-expanded')!=='true';btn.setAttribute('aria-expanded',String(open));nav.setAttribute('aria-hidden',String(!open));nav.classList.toggle('open',open);});
    nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){btn.setAttribute('aria-expanded','false');nav.setAttribute('aria-hidden','true');nav.classList.remove('open');});});
  }

  function showError(msg){
    var count=document.querySelector('#result-count'), summary=document.querySelector('#result-summary'), grid=document.querySelector('#results-grid'), featured=document.querySelector('#featured-list');
    if(count)count.textContent='Unable to load marketplace';
    if(summary)summary.textContent=msg;
    var html='<div class="empty">'+esc(msg)+' <button type="button" class="btn btn-secondary" id="retry-load">Retry</button></div>';
    if(grid)grid.innerHTML=html;
    if(featured)featured.innerHTML=html;
    var retry=document.querySelector('#retry-load'); if(retry)retry.addEventListener('click',loadData);
  }

  function loadData(){
    fetch('data/vehicles.json?v=' + Date.now(),{cache:'no-store',headers:{Accept:'application/json'}})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
      .then(function(text){
        var data;
        try { data=JSON.parse(repairCatalogText(text)); }
        catch(e){ console.error('vehicles.json parse failed',e); throw new Error('Catalog JSON is malformed'); }
        var raw=Array.isArray(data.vehicles)?data.vehicles:(Array.isArray(data)?data:[]);
        vehicles=raw.map(normalize);
        window.vehicles=vehicles;
        if(!vehicles.length)throw new Error('No vehicles in catalog');
        afterLoad();
        console.log('Pasalo Cars PH:',vehicles.length,'vehicles loaded');
      })
      .catch(function(err){console.warn(err);showError('Could not load the vehicle catalog. Please tap Retry.');});
  }

  function afterLoad(){renderHome();renderListings();renderVehicle();}
  function boot(){setupMobileNav();loadData();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
  window.renderHome=renderHome; window.renderListings=renderListings; window.renderVehicle=renderVehicle; window.drawListings=drawListings;
})();
