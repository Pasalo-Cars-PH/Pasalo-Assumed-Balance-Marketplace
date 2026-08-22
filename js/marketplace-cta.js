/* Pasalo Cars PH — quick inquiry CTA (single button only) */
(function () {
  const root = document.querySelector('#results-grid');
  if (!root) return;

  const decorate = () => {
    root.querySelectorAll('.vehicle-card').forEach(card => {
      // Kung may Inquire on Messenger na, huwag nang magdagdag
      if (card.querySelector('.quick-inquiry')) return;

      const details = card.querySelector('a[href*="vehicle.html?id="]');
      if (!details) return;

      const id = new URL(details.href, location.href).searchParams.get('id');
      const title = card.querySelector('.vehicle-title')?.textContent.trim() || 'vehicle';
      const monthly = card.querySelector('.vehicle-monthly')?.textContent.trim() || '';
      const cash = card.querySelector('.vehicle-price')?.textContent.trim() || '';

      const a = document.createElement('a');
      a.className = 'quick-inquiry btn btn-primary';
      a.href = 'https://m.me/PasaloCarsPH21?ref=' + encodeURIComponent(`Marketplace inquiry | ${title} | ${id}`);
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = '💬 Inquire on Messenger';
      a.style.marginTop = '8px';
      a.style.width = '100%';
      a.style.display = 'inline-flex';
      a.style.justifyContent = 'center';

      // Ilagay sa baba ng View Details (hindi duplicate)
      const body = card.querySelector('.vehicle-body');
      if (body) body.appendChild(a);
    });
  };

  const observer = new MutationObserver(decorate);
  observer.observe(root, { childList: true, subtree: true });
  decorate();
})();
