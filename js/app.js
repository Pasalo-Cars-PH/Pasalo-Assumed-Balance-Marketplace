const SUPABASE_URL='https://jpktdmpcodwdmaucvmgd.supabase.co';
const SUPABASE_KEY='sb_publishable_wvefX4h41g-0X2XX8Lp-pg_t2R9Qmwn';

async function saveInquiry(v,data){
 const body={buyer_name:data.get('name'),buyer_mobile:data.get('mobile'),buyer_location:data.get('location'),preferred_contact:data.get('contact'),monthly_budget:Number(String(data.get('monthly')||'').replace(/[^0-9.]/g,''))||null,cashout_budget:Number(String(data.get('cash')||'').replace(/[^0-9.]/g,''))||null,unit_id:v.id,unit_name:`${v.make} ${v.model}${v.variant&&v.variant!=='—'?` ${v.variant}`:''}${v.year&&v.year!=='—'?` ${v.year}`:''}`,listing_owner_name:v.agent?.name||v.owner?.name||null,listing_owner_facebook:v.agent?.facebook||v.owner?.facebook||null,listing_owner_mobile:v.agent?.mobile||v.owner?.mobile||null,inquiry_message:`Marketplace inquiry for ${v.make} ${v.model}`,source:'pasalo-marketplace'};
 const r=await fetch(`${SUPABASE_URL}/rest/v1/marketplace_inquiries`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':`Bearer ${SUPABASE_KEY}`,'Prefer':'return=minimal'},body:JSON.stringify(body)});
 if(!r.ok) throw new Error(await r.text());
 return true;
}

// Centralized inquiry handler: every buyer lead is captured by Pasalo Cars PH first.
document.addEventListener('submit',async e=>{
 const form=e.target;
 if(!form.matches('#inquiry-form')) return;
 e.preventDefault();
 const button=form.querySelector('button[type="submit"],button:not([type])');
 const v=vehicles.find(x=>x.id===qs('id'));
 const success=document.querySelector('#inquiry-success');
 const error=document.querySelector('#inquiry-error');
 if(!v)return;
 if(button){button.disabled=true;button.textContent='Sending...'}
 try{
  await saveInquiry(v,new FormData(form));
  form.classList.add('hidden');
  error?.classList.add('hidden');
  success?.classList.remove('hidden');
 }catch(err){
  console.error('Marketplace inquiry failed:',err);
  error?.classList.remove('hidden');
  if(button){button.disabled=false;button.textContent='Get Vehicle Details'}
 }
});
