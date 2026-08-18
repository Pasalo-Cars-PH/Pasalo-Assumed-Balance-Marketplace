/* Pasalo Cars PH — premium vehicle detail enhancements v2 */
(function(){
  const root=document.querySelector('#vehicle-root');
  if(!root)return;
  const money=v=>v==null||v===''?'To confirm':'₱'+Number(String(v).replace(/[^0-9.-]/g,'')).toLocaleString('en-PH');
  const show=v=>v==null||v===''?'To confirm':String(v);
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const id=new URLSearchParams(location.search).get('id');
  let vehicle=null,done=false;
  async function load(){
    if(vehicle||!id)return;
    const paths=['data/vehicles.json','data/vehicles-extra.json','data/vehicles-new.json'];
    const rs=await Promise.allSettled(paths.map(async p=>{const u=new URL(p,document.baseURI);u.searchParams.set('v','20260819-4');const r=await fetch(u.href,{cache:'no-store'});if(!r.ok)throw new Error(r.status);return r.json()}));
    vehicle=rs.filter(x=>x.status==='fulfilled').flatMap(x=>x.value?.vehicles||[]).find(v=>v.id===id)||null;
    enhance();
  }
  function enhance(){
    if(done||!vehicle||!root.querySelector('.detail-card'))return;
    done=true;
    const card=root.querySelector('.detail-card'),box=document.createElement('div');
    box.className='detail-enhancements';
    box.innerHTML=`<div class="detail-summary">
      <div class="detail-summary-item"><small>Monthly</small><b>${money(vehicle.monthly)}</b></div>
      <div class="detail-summary-item"><small>Cash-out</small><b>${money(vehicle.cashOut)}</b></div>
      <div class="detail-summary-item"><small>Months paid</small><b>${show(vehicle.monthsPaid)}</b></div>
      <div class="detail-summary-item"><small>Remaining</small><b>${show(vehicle.monthsRemaining)}</b></div>
      <div class="detail-summary-item"><small>Next due</small><b>${show(vehicle.nextDue)}</b></div>
      <div class="detail-summary-item"><small>Term</small><b>${show(vehicle.term)}</b></div>
    </div>
    ${vehicle.notes?`<div class="detail-notes"><h3>Listing notes</h3><p>${esc(vehicle.notes)}</p></div>`:''}
    <div class="detail-verify"><strong>Before paying:</strong> Confirm the current loan figures, payment status, documents, actual unit, seller authority and bank/dealer requirements before any payment or reservation.</div>`;
    card.insertAdjacentElement('afterend',box);
    document.querySelector('.sticky-cta a')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('#inquire-btn')?.click()});
  }
  new MutationObserver(enhance).observe(root,{childList:true,subtree:true});
  load().catch(()=>{});
})();
