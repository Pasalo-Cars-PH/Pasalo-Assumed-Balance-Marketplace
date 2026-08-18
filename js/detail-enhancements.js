/* Pasalo Cars PH — premium vehicle detail enhancements */
(function(){
  const root=document.querySelector('#vehicle-root');
  if(!root)return;
  const money=v=>v==null||v===''?'To confirm':'₱'+Number(String(v).replace(/[^0-9.-]/g,'')).toLocaleString('en-PH');
  const show=v=>v==null||v===''?'To confirm':String(v);
  const title=v=>`${v.make||''} ${v.model||''}${v.variant&&v.variant!=='—'?` ${v.variant}`:''}${v.year&&v.year!=='—'?` ${v.year}`:''}`.trim();
  const id=new URLSearchParams(location.search).get('id');
  let done=false;
  function enhance(){
    if(done||!root.querySelector('.detail-card')||!Array.isArray(window.vehicles))return;
    const v=window.vehicles.find(x=>x.id===id);
    if(!v)return;
    done=true;
    const card=root.querySelector('.detail-card');
    const summary=document.createElement('div');
    summary.className='detail-enhancements';
    summary.innerHTML=`<div class="detail-summary">
      <div class="detail-summary-item"><small>Monthly</small><b>${money(v.monthly)}</b></div>
      <div class="detail-summary-item"><small>Cash-out</small><b>${money(v.cashOut)}</b></div>
      <div class="detail-summary-item"><small>Months paid</small><b>${show(v.monthsPaid)}</b></div>
      <div class="detail-summary-item"><small>Remaining</small><b>${show(v.monthsRemaining)}</b></div>
      <div class="detail-summary-item"><small>Next due</small><b>${show(v.nextDue)}</b></div>
      <div class="detail-summary-item"><small>Term</small><b>${show(v.term)}</b></div>
    </div>
    ${v.notes?`<div class="detail-notes"><h3>Listing notes</h3><p>${String(v.notes).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}</p></div>`:''}
    <div class="detail-verify"><strong>Before paying:</strong> confirm the current loan figures, payment status, documents, actual unit, seller authority and bank/dealer requirements. Listing information can change and should be verified directly before any transaction.</div>`;
    card.insertAdjacentElement('afterend',summary);
    document.querySelector('.sticky-cta a')?.addEventListener('click',function(e){e.preventDefault();const btn=document.querySelector('#inquire-btn');if(btn)btn.click();else document.querySelector('#inquiry')?.scrollIntoView({behavior:'smooth'});});
  }
  const observer=new MutationObserver(enhance);
  observer.observe(root,{childList:true,subtree:true});
  enhance();
})();
