/* Pasalo Cars PH — defensive JSON loader fix */
(function () {
  'use strict';

  var originalFetch = window.fetch.bind(window);
  var DATA_RE = /(?:^|\/)data\/vehicles\.json(?:\?|$)/i;

  function repair(text) {
    return String(text || '')
      .replace(/^\uFEFF/, '')
      /* Current catalog has one legacy entry with: "cash_out": 760000" followed immediately by the next key. */
      .replace(/("cash_out"\s*:\s*-?\d+(?:\.\d+)?)"\s*(?=")/g, '$1,\n')
      /* Normalize numeric values that were accidentally stored as quoted strings. */
      .replace(/("(?:cash_out|monthly_payment|remaining_months|year|odometer|unitPrice|monthly|monthsPaid|monthsRemaining)"\s*:\s*)"(-?\d+(?:\.\d+)?)"/g, '$1$2')
      .replace(/("(?:cash_out|monthly_payment|remaining_months|year|odometer|unitPrice|monthly|monthsPaid|monthsRemaining)"\s*:\s*)""(-?\d+(?:\.\d+)?)"/g, '$1$2')
      /* Remove accidental quote after numeric JSON values. */
      .replace(/("(?:cash_out|monthly_payment|remaining_months|year|odometer)"\s*:\s*-?\d+(?:\.\d+)?)"(?=\s*[,}\n])/g, '$1')
      /* Remove accidental quote after boolean values. */
      .replace(/("(?:verified|featured)"\s*:\s*(?:true|false))"(?=\s*[,}\n])/g, '$1');
  }

  window.fetch = function (input, init) {
    var url = typeof input === 'string' ? input : (input && input.url) || '';
    if (!DATA_RE.test(url)) return originalFetch(input, init);

    return originalFetch(input, init).then(function (response) {
      if (!response.ok) return response;
      return response.text().then(function (text) {
        try {
          JSON.parse(text);
          return new Response(text, { status: response.status, statusText: response.statusText, headers: response.headers });
        } catch (firstError) {
          var fixed = repair(text);
          JSON.parse(fixed);
          console.info('Pasalo Cars PH: repaired vehicle JSON before app load.');
          return new Response(fixed, { status: response.status, statusText: response.statusText, headers: response.headers });
        }
      });
    });
  };
})();
