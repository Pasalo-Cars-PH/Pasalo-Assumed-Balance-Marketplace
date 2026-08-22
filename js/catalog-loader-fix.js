/* PASALO CARS PH — catalog response repair shim */
(function(){'use strict';
  var originalFetch=window.fetch;
  if(!originalFetch)return;
  function repair(text){
    text=String(text||'').replace(/^\uFEFF/,'');
    text=text.replace(/(\"cash_out\"\s*:\s*-?\d+(?:\.\d+)?)\"\s*(?=\")/g,'$1,\n');
    text=text.replace(/(\"(?:monthly_payment|cash_out|unitPrice|monthly|year|remaining_months|monthsRemaining|monthsPaid|odometer)\"\s*:\s*)\"(-?\d+(?:\.\d+)?)\"/g,'$1$2');
    text=text.replace(/(\"(?:monthly_payment|cash_out|unitPrice|monthly|year|remaining_months|monthsRemaining|monthsPaid|odometer)\"\s*:\s*)\"\"(-?\d+(?:\.\d+)?)\"/g,'$1$2');
    return text;
  }
  window.fetch=function(input,init){
    return originalFetch.call(this,input,init).then(function(response){
      var url=typeof input==='string'?input:(input&&input.url)||'';
      if(!/vehicles\.json/i.test(url)||!response.ok)return response;
      return response.clone().text().then(function(text){
        try{JSON.parse(text);return response;}catch(e){
          var fixed=repair(text);
          try{JSON.parse(fixed);return new Response(fixed,{status:response.status,statusText:response.statusText,headers:response.headers});}catch(e2){return response;}
        }
      });
    });
  };
})();