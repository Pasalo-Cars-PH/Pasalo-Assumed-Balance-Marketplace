/* Pasalo Cars PH — quick inquiry CTA */
(function(){
  const root=document.querySelector('#results-grid');
  if(!root)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const decorate=()=>{
    root.querySelectorAll('.vehicle-card').forEach(card=>{
      if(card.querySelector('.quick-inquiry'))return;
      const details=card.querySelector('a[href*="vehicle.html?id="]');
      if(!details)return;
      const id=new URL(details.href,location.href).searchParams.get('id');
      const title=card.querySelector('.vehicle-title')?.textContent.trim()||'vehicle';
      const monthly=card.querySelector('.vehicle-monthly')?.textContent.trim()||'';
      const cash=card.querySelector('.vehicle-price')?.textContent.trim()||'';
      const meta=card.querySelector('.vehicle-meta')?.textContent.trim()||'';
      const a=document.createElement('a');
      a.className='quick-inquiry btn btn-primary';
      a.href='https://m.me/PasaloCarsPH21?ref='+encodeURIComponent(`Marketplace inquiry | ${title} | ${id}`);
      a.target='_blank';
      a.rel='noopener';
      a.textContent='💬 Inquire on Messenger';
      a.dataset.message=`Hi Pasalo Cars PH! I’m interested in ${title}. ${cash} cash-out | ${monthly}. ${meta}`;
      card.querySelector('.vehicle-body')?.appendChild(a);
    });
  };
  const observer=new MutationObserver(decorate);
  observer.observe(root,{childList:true,subtree:true});
  decorate();
})();
