/* Pasalo Cars PH — multi-photo vehicle gallery */
(function(){
  const root=document.querySelector('#vehicle-root');
  if(!root)return;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const getId=()=>new URLSearchParams(location.search).get('id');
  const toUrl=raw=>{if(!raw)return null;const p=String(raw).trim();if(/^https?:\/\//i.test(p))return p;return new URL(p.replace(/^\.\//,''),document.baseURI).href};
  let cachedVehicles=null;
  async function getVehicle(){
    const id=getId();
    if(!id)return null;
    if(!cachedVehicles){
      const sources=['data/vehicles.json','data/vehicles-extra.json','data/vehicles-new.json'];
      const results=await Promise.allSettled(sources.map(async path=>{const u=new URL(path,document.baseURI);u.searchParams.set('v','20260819-2');const r=await fetch(u.href,{cache:'no-store'});if(!r.ok)throw new Error(r.status);return r.json()}));
      cachedVehicles=results.filter(r=>r.status==='fulfilled').flatMap(r=>r.value?.vehicles||[]);
    }
    return cachedVehicles.find(v=>v.id===id)||null;
  }
  async function build(){
    const photo=root.querySelector('.detail-photo');
    if(!photo||photo.dataset.galleryReady)return;
    const vehicle=await getVehicle();
    if(!vehicle||!root.querySelector('.detail-card'))return;
    const raw=Array.isArray(vehicle.images)&&vehicle.images.length?vehicle.images:(vehicle.image?[vehicle.image]:[]);
    const urls=raw.map(toUrl).filter(Boolean);
    if(urls.length<=1){photo.dataset.galleryReady='1';return;}
    photo.dataset.galleryReady='1';
    let index=0;
    const title=`${vehicle.make||''} ${vehicle.model||''} ${vehicle.variant||''}`.trim();
    photo.classList.add('vehicle-gallery');
    photo.innerHTML=`<div class="gallery-main"><img id="gallery-main-image" src="${esc(urls[0])}" alt="${esc(title)}" loading="eager" decoding="async"><button class="gallery-arrow gallery-prev" type="button" aria-label="Previous photo">‹</button><button class="gallery-arrow gallery-next" type="button" aria-label="Next photo">›</button><span class="gallery-count" id="gallery-count">1 / ${urls.length}</span></div><div class="gallery-thumbs" role="tablist" aria-label="Vehicle photos">${urls.map((u,i)=>`<button class="gallery-thumb${i===0?' active':''}" type="button" data-index="${i}" aria-label="View photo ${i+1}"><img src="${esc(u)}" alt="" loading="lazy"></button>`).join('')}</div>`;
    const main=photo.querySelector('#gallery-main-image');
    const count=photo.querySelector('#gallery-count');
    const thumbs=[...photo.querySelectorAll('.gallery-thumb')];
    const show=i=>{index=(i+urls.length)%urls.length;main.src=urls[index];main.alt=`${title} — photo ${index+1}`;count.textContent=`${index+1} / ${urls.length}`;thumbs.forEach((b,n)=>b.classList.toggle('active',n===index));thumbs[index]?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'})};
    photo.querySelector('.gallery-prev').addEventListener('click',()=>show(index-1));
    photo.querySelector('.gallery-next').addEventListener('click',()=>show(index+1));
    thumbs.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.index))));
    let startX=null;
    photo.addEventListener('touchstart',e=>{startX=e.touches[0].clientX},{passive:true});
    photo.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45)show(index+(dx<0?1:-1));startX=null},{passive:true});
    document.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')show(index-1);if(e.key==='ArrowRight')show(index+1)});
  }
  const observer=new MutationObserver(()=>build());
  observer.observe(root,{childList:true,subtree:true});
  build();
})();
