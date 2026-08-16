(function(){
  const MAIN_DATA='https://raw.githubusercontent.com/Pasalo-Cars-PH/Pasalo-Assumed-Balance-Marketplace/v1-marketplace/data/vehicles.json';
  async function recover(){
    if(typeof vehicles==='undefined') return;
    try{
      const r=await fetch(MAIN_DATA+'?v='+Date.now(),{cache:'no-store',headers:{Accept:'application/json'}});
      if(!r.ok) throw new Error('Main vehicle data HTTP '+r.status);
      const data=await r.json();
      const main=Array.isArray(data.vehicles)?data.vehicles:[];
      if(!main.length) return;
      const merged=new Map(vehicles.map(v=>[v.id,v]));
      main.forEach(v=>merged.set(v.id,v));
      const next=[...merged.values()];
      if(next.length!==vehicles.length){
        vehicles.length=0;
        next.forEach(v=>vehicles.push(v));
        if(typeof renderListings==='function') renderListings();
        if(typeof renderHome==='function') renderHome();
        if(typeof renderVehicle==='function') renderVehicle();
        console.info('Marketplace recovery loaded',vehicles.length,'vehicles');
      }
    }catch(e){ console.warn('Marketplace recovery skipped:',e.message||e); }
  }
  setTimeout(recover,1500);
  setTimeout(recover,12000);
})();
