function card(v){
  return `<article class="vehicle-card">
    <div class="vehicle-image">
      ${img(v)}
      <div class="vehicle-badges">
        ${v.color?`<span class="badge">${v.color}</span>`:''}
        ${v.verified?'<span class="badge">🟢 VERIFIED</span>':''}
      </div>
    </div>
    <div class="vehicle-body">
      <div class="vehicle-title">${title(v)}</div>
      <div class="vehicle-price">${money(v.cashOut)} cash-out</div>
      <div class="vehicle-monthly">${money(v.monthly)}${v.monthly!=null?' / month':''}</div>
      <div class="vehicle-meta">
        <span>📍 ${show(v.location)}</span>
        <span>🏦 ${show(v.bank)}</span>
        <span>${age(v)}</span>
      </div>
      <div class="vehicle-actions">
        <a class="btn btn-secondary" href="vehicle.html?id=${v.id}">View Details</a>
        <a class="btn btn-primary" href="https://m.me/YourPageUsername?text=${encodeURIComponent('Hi, interested in ' + title(v))}" target="_blank" rel="noopener">
          Inquire on Messenger
        </a>
      </div>
    </div>
  </article>`
}
