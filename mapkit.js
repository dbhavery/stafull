/* ======================================================================
   StaFull map kit, real Leaflet maps with dark (monochrome) CARTO tiles
   and brand-red markers. Shared by the marketing coverage map and the
   franchise / HQ dashboards. Requires Leaflet (loaded via CDN on the page).
   Red is used only as a marker FILL/RING, never as text.
   ====================================================================== */
(function () {
  var TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  var ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

  function create(elId, opts) {
    opts = opts || {};
    if (typeof L === 'undefined') return null;
    var map = L.map(elId, {
      center: opts.center || [32.85, -97.04],
      zoom: opts.zoom || 10,
      zoomControl: opts.zoomControl !== false,
      scrollWheelZoom: false,        // don't trap page scroll
      attributionControl: true,
      dragging: opts.dragging !== false,
      doubleClickZoom: true
    });
    L.tileLayer(TILE, { attribution: ATTR, subdomains: 'abcd', maxZoom: 19 }).addTo(map);
    if (map.attributionControl) map.attributionControl.setPrefix(false);
    return map;
  }

  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }

  /* a colored marker; kind sets size/shape, o.color sets the hue (default brand red).
     o.live adds a pulsing ring in the same color. */
  function pin(map, lat, lng, o) {
    o = o || {};
    var kind = o.kind || 'stop';
    var live = !!o.live;
    var color = o.color || '#a30000';
    var cls = 'sf-mk sf-mk-' + kind;
    var label = o.label ? '<span class="sf-mk-lbl">' + o.label + '</span>' : '';
    var size = kind === 'city' ? 16 : (kind === 'truck' ? 20 : 13);
    var ring = live ? '<span class="sf-mk-pulse" style="color:' + color + '"></span>' : '';
    var dot = '<span class="sf-mk-dot" style="background:' + color + ';box-shadow:0 0 0 4px ' +
              hexToRgba(color, 0.22) + ',0 1px 4px rgba(0,0,0,.6)"></span>';
    var icon = L.divIcon({
      className: '',
      html: '<div class="' + cls + '">' + ring + dot + label + '</div>',
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });
    var m = L.marker([lat, lng], { icon: icon, title: o.title || o.label || '' });
    if (map) m.addTo(map);
    return m;
  }

  function fit(map, latlngs, pad) {
    if (!map || !latlngs.length) return;
    map.fitBounds(L.latLngBounds(latlngs), { padding: [pad || 30, pad || 30] });
  }

  window.StaFullMap = { create: create, pin: pin, fit: fit };
})();
