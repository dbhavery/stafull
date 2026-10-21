/* ======================================================================
   StaFull, demo store. Session + role, read getters over the seed, a live
   "dispensing" tick, light mutations, and a tiny pub/sub. No dependencies.
   Requires seed.js + mode.js loaded first.
   ====================================================================== */
(function () {
  var SEED = window.STAFULL_SEED;
  var FUELS = window.STAFULL_FUELS;
  var subs = [];
  var timer = null;

  function emit() { for (var i = 0; i < subs.length; i++) { try { subs[i](); } catch (e) {} } }

  /* ---------- session / role ---------- */
  var ROLES = {
    customer:  { id: 'customer',  label: 'Customer',          tag: 'My account',      landing: 'customer.html' },
    driver:    { id: 'driver',    label: 'Driver Co-Pilot',   tag: 'Field app',       landing: 'driver.html' },
    franchise: { id: 'franchise', label: 'Franchise',         tag: 'Operations',      landing: 'franchise.html' },
    hq:        { id: 'hq',        label: 'HQ Command Center',  tag: 'Holdings',        landing: 'hq.html' }
  };

  function getRole() {
    try { return sessionStorage.getItem('stafull.role') || null; } catch (e) { return null; }
  }
  function setSession(role) {
    try {
      sessionStorage.setItem('stafull.session', 'demo');
      sessionStorage.setItem('stafull.role', role);
    } catch (e) {}
  }
  function hasSession() {
    try { return sessionStorage.getItem('stafull.session') === 'demo'; } catch (e) { return false; }
  }
  function clearSession() {
    try { sessionStorage.removeItem('stafull.session'); sessionStorage.removeItem('stafull.role'); } catch (e) {}
  }

  /* ---------- lookups ---------- */
  function byId(arr, id) { for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return arr[i]; return null; }

  function customer(id) { return byId(SEED.customers, id); }
  function currentCustomer() { return customer(SEED.currentCustomerId); }
  function driver(id) { return byId(SEED.drivers, id); }
  function currentDriver() { return driver(SEED.currentDriverId); }
  function franchise(id) { return byId(SEED.franchises, id); }
  function currentFranchise() { return franchise(SEED.currentFranchiseId); }
  function tanker(id) { return byId(SEED.tankers, id); }
  function vehicle(id) { return byId(SEED.vehicles, id); }
  function deliveryById(id) { return byId(SEED.deliveries, id); }

  function vehiclesFor(custId) {
    return SEED.vehicles.filter(function (v) { return v.customerId === custId; });
  }
  function invoicesFor(custId) {
    return SEED.invoices.filter(function (i) { return i.customerId === custId; });
  }
  function deliveriesFor(filter) {
    filter = filter || {};
    return SEED.deliveries.filter(function (d) {
      if (filter.driverId && d.driverId !== filter.driverId) return false;
      if (filter.customerId && d.customerId !== filter.customerId) return false;
      if (filter.status && d.status !== filter.status) return false;
      return true;
    });
  }
  function routeFor(driverId) { return byId(SEED.routes, (driver(driverId) || {}).routeId); }

  /* ---------- derived ---------- */
  function fuel(grade) { return FUELS[grade]; }
  function perGalSavings(grade) { var f = FUELS[grade]; return +(f.pump - f.ours).toFixed(2); }
  function deliveredGallons(d) { return +((d.pct / 100) * d.gallons).toFixed(1); }
  function liveSavings(d) { return +(deliveredGallons(d) * perGalSavings(d.fuel)).toFixed(2); }
  function liveAmount(d) { return +(deliveredGallons(d) * FUELS[d.fuel].ours).toFixed(2); }

  function networkTotals() {
    var t = { customers: 0, vehicles: 0, trucks: 0, drivers: 0, mrr: 0, gallonsMTD: 0, royaltyMTD: 0, savingsMTD: 0 };
    SEED.franchises.forEach(function (f) {
      t.customers += f.customers; t.vehicles += f.activeVehicles; t.trucks += f.trucks;
      t.drivers += f.drivers; t.mrr += f.mrr; t.gallonsMTD += f.gallonsMTD;
      t.royaltyMTD += f.royaltyMTD; t.savingsMTD += f.savingsToCustomersMTD;
    });
    return t;
  }

  /* ---------- mutations ---------- */
  /* schedule a fill for a vehicle, adds a 'scheduled' delivery to the demo customer route view */
  function scheduleFill(vehicleId, when) {
    var v = vehicle(vehicleId); if (!v) return null;
    var gallons = Math.round(v.tankCap * (1 - v.level));
    var n = SEED.deliveries.filter(function (d) { return d.id.indexOf('DEL-NEW') === 0; }).length;
    var del = {
      id: 'DEL-NEW' + (n + 1), driverId: 'DRV-5', truckId: 'TKR-07',
      customerId: v.customerId, vehicleId: vehicleId, fuel: v.fuel, gallons: gallons,
      status: 'scheduled', pct: 0, verified: false, window: when || 'Next window',
      addr: 'Scheduled by you', amount: +(FUELS[v.fuel].ours * gallons).toFixed(2),
      savings: +(perGalSavings(v.fuel) * gallons).toFixed(2)
    };
    SEED.deliveries.push(del);
    emit();
    return del;
  }

  /* ---------- live tick: advance any 'dispensing' delivery ---------- */
  function tick() {
    var changed = false;
    SEED.deliveries.forEach(function (d) {
      if (d.status === 'dispensing' && d.pct < 100) {
        d.pct = Math.min(100, +(d.pct + 1.3 + (d.pct % 4) * 0.12).toFixed(1));
        // raise the linked vehicle's level toward full as fuel flows
        var v = vehicle(d.vehicleId);
        if (v) v.level = Math.min(1, +(v.level + 0.012).toFixed(3));
        if (d.pct >= 100) {
          d.status = 'complete'; d.verified = true;
          // promote the driver's next enroute/scheduled stop to dispensing
          var rt = routeFor(d.driverId);
          if (rt) {
            for (var i = 0; i < rt.stops.length; i++) {
              var nxt = deliveryById(rt.stops[i]);
              if (nxt && (nxt.status === 'enroute' || nxt.status === 'scheduled')) {
                nxt.status = 'dispensing'; nxt.verified = true; break;
              }
            }
          }
        }
        changed = true;
      }
    });
    if (changed) emit();
  }

  function start() {
    if (timer) return;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    timer = setInterval(tick, 1200);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  window.StaFullStore = {
    ROLES: ROLES,
    // session
    getRole: getRole, setSession: setSession, hasSession: hasSession, clearSession: clearSession,
    // lookups
    customer: customer, currentCustomer: currentCustomer,
    driver: driver, currentDriver: currentDriver,
    franchise: franchise, currentFranchise: currentFranchise,
    tanker: tanker, tankers: function () { return SEED.tankers; },
    vehicle: vehicle, delivery: deliveryById,
    vehiclesFor: vehiclesFor, invoicesFor: invoicesFor,
    deliveriesFor: deliveriesFor, routeFor: routeFor,
    drivers: function () { return SEED.drivers; },
    customers: function () { return SEED.customers; },
    franchises: function () { return SEED.franchises; },
    alerts: function () { return SEED.alerts; },
    pipeline: function () { return SEED.franchisePipeline; },
    pnl: function () { return SEED.pnl; },
    // derived
    fuel: fuel, perGalSavings: perGalSavings,
    deliveredGallons: deliveredGallons, liveSavings: liveSavings, liveAmount: liveAmount,
    networkTotals: networkTotals,
    // mutations + live
    scheduleFill: scheduleFill,
    subscribe: function (fn) { subs.push(fn); return function () { subs = subs.filter(function (s) { return s !== fn; }); }; },
    start: start, stop: stop, tick: tick
  };
})();
