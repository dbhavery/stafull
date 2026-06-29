/* StaFull runtime mode. real = stafull.com / www (gated, public blocked past sign-in).
   demo = every other host (previews, portfolio showcase, localhost) = full demo app. */
(function () {
  var h = location.hostname;
  var isRealSite = /^(www\.)?stafull\.com$/i.test(h);
  var mode = isRealSite ? 'real' : 'demo';
  window.STAFULL_MODE = mode;
  window.StaFullMode = { mode: mode, isReal: function () { return mode === 'real'; }, isDemo: function () { return mode === 'demo'; } };
})();
