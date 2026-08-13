const SUPABASE_URL='https://jpktdmpcodwdmaucvmgd.supabase.co';
const SUPABASE_KEY='sb_publishable_wvefX4h41g-0X2XX8Lp-pg_t2R9Qmwn';
const ADMIN_EMAIL='derlonskie0929@gmail.com';
const {createClient}=window.supabase;
const supabase=createClient(SUPABASE_URL,SUPABASE_KEY);
const $=s=>document.querySelector(s);
const money=n=>n==null?'—':'₱'+Number(n).toLocaleString('en-PH');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const statuses=['new','contacted','qualified','referred','negotiating','closed_won','closed_lost'];
let leads=[];
function showLogin(msg=''){ $('#login-view').classList.remove('hidden'); $('#dashboard-view').classList.add('hidden'); if(msg){$('#login-error').textContent=msg;$('#login-error').classList.remove('hidden')} }
function showDashboard(){ $('#login-view').classList.add('hidden'); $('#dashboard-view').classList.remove('hidden'); }
function statusLabel(s){return s.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
function render(){
 const q=($('#search-leads').value||'').trim().toLowerCase(), f=$('#status-filter').value;
 const filtered=leads.filter(l=>{const hay=[l.buyer_name,l.buyer_mobile,l.unit_name,l.listing_owner_name].join(' ').toLowerCase();return(!q||hay.includes(q))&&(f==='all'||l.status===f)});
 $('#lead-body').innerHTML=filtered.map(l=>`<tr><td><div class="lead-name">${esc(l.buyer_name)}</div><div class="lead-sub">${esc(l.buyer_mobile)} · ${esc(l.preferred_contact||'Contact not specified')}</div></td><td><div class="lead-name">${esc(l.unit_name||'Unit not specified')}</div><div class="lead-sub">${esc(l.unit_id||'')}</div></td><td><div>${money(l.monthly_budget)}/mo</div><div class="lead-sub">Cash-out: ${money(l.cashout_budget)}</div></td><td>${esc(l.buyer_location||'—')}</td><td><div>${esc(l.listing_owner_name||'Pasalo Cars PH')}</div><div class="lead-sub">${esc(l.listing_owner_mobile||'')}</div></td><td>${new Date(l.created_at).toLocaleString('en-PH',{dateStyle:'medium',timeStyle:'short'})}</td><td><select class="status-select" data-id="${l.id}">${statuses.map(s=>`<option value="${s}" ${s===l.status?'selected':''}>${statusLabel(s)}</option>`).join('')}</select></td></tr>`).join('');
 $('#empty-leads').classList.toggle('hidden',filtered.length>0);
 $('#stat-total').textContent=leads.length; $('#stat-new').textContent=leads.filter(x=>x.status==='new').length; $('#stat-contacted').textContent=leads.filter(x=>x.status==='contacted').length; $('#stat-won').textContent=leads.filter(x=>x.status==='closed_won').length;
 document.querySelectorAll('.status-select').forEach(el=>el.addEventListener('change',()=>updateStatus(el.dataset.id,el.value)));
}
async function loadLeads(){
 $('#dashboard-error').classList.add('hidden');
 const {data,error}=await supabase.from('marketplace_inquiries').select('*').order('created_at',{ascending:false});
 if(error){$('#dashboard-error').textContent='Could not load leads: '+error.message;$('#dashboard-error').classList.remove('hidden');return}
 leads=data||[];render();
}
async function updateStatus(id,status){
 const {error}=await supabase.from('marketplace_inquiries').update({status}).eq('id',id);
 if(error){$('#dashboard-error').textContent='Status update failed: '+error.message;$('#dashboard-error').classList.remove('hidden');return}
 const lead=leads.find(x=>x.id===id);if(lead)lead.status=status;render();
}
$('#login-form').addEventListener('submit',async e=>{e.preventDefault();$('#login-error').classList.add('hidden');const email=$('#login-email').value.trim().toLowerCase(),password=$('#login-password').value;if(email!==ADMIN_EMAIL){showLogin('This admin dashboard is restricted to the authorized admin email.');return}const {error}=await supabase.auth.signInWithPassword({email,password});if(error){$('#login-error').textContent=error.message;$('#login-error').classList.remove('hidden');return}showDashboard();await loadLeads();});
$('#logout-btn').addEventListener('click',async()=>{await supabase.auth.signOut();showLogin()});
$('#refresh-btn').addEventListener('click',loadLeads);$('#search-leads').addEventListener('input',render);$('#status-filter').addEventListener('change',render);
(async()=>{const {data:{session}}=await supabase.auth.getSession();if(session?.user?.email?.toLowerCase()===ADMIN_EMAIL){showDashboard();await loadLeads()}else{if(session)await supabase.auth.signOut();showLogin()}})();
supabase.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT')showLogin()});