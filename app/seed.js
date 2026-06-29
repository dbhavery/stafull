/* ======================================================================
   StaFull — demo seed data (sample, simulated; pre-launch business).
   One DFW franchise is fully detailed; the rest of the network carries
   roll-up figures only. Everything downstream (store/ui) reads window.STAFULL_SEED.
   No real customers exist yet — these are representative records.
   ====================================================================== */
(function () {

  /* fuel grades — monochrome UI, distinguished by label. Prices in $/gal. */
  var FUELS = {
    diesel:  { label: 'Diesel',  pump: 3.94, ours: 3.79 },
    regular: { label: 'Regular', pump: 3.49, ours: 3.34 },
    premium: { label: 'Premium', pump: 4.19, ours: 4.01 },
    def:     { label: 'DEF',     pump: 1.20, ours: 1.06 }
  };
  function save(grade, gal) { var f = FUELS[grade]; return +( (f.pump - f.ours) * gal ).toFixed(2); }

  /* ---- the network (HQ view): one detailed franchise + roll-ups ---- */
  var franchises = [
    { id: 'dfw', name: 'StaFull DFW', region: 'Dallas–Fort Worth, TX', owner: 'Priya Raman',
      opened: '2025-09', status: 'Active', detailed: true,
      royaltyRate: 0.06, brandFee: 0.01, techLeasePerTruck: 600,
      customers: 142, activeVehicles: 511, trucks: 3, drivers: 5,
      mrr: 61240, gallonsMTD: 84200, royaltyMTD: 3674, savingsToCustomersMTD: 12180,
      uptime: 0.992, complianceScore: 98 },
    { id: 'hou', name: 'StaFull Houston', region: 'Houston, TX', owner: 'D. Okafor',
      opened: '2025-11', status: 'Active', detailed: false,
      royaltyRate: 0.06, brandFee: 0.01, techLeasePerTruck: 600,
      customers: 118, activeVehicles: 437, trucks: 3, drivers: 4,
      mrr: 52900, gallonsMTD: 71500, royaltyMTD: 3174, savingsToCustomersMTD: 10410,
      uptime: 0.989, complianceScore: 96 },
    { id: 'atx', name: 'StaFull Austin', region: 'Austin, TX', owner: 'L. Brennan',
      opened: '2026-01', status: 'Active', detailed: false,
      royaltyRate: 0.06, brandFee: 0.01, techLeasePerTruck: 600,
      customers: 73, activeVehicles: 248, trucks: 2, drivers: 3,
      mrr: 31800, gallonsMTD: 39100, royaltyMTD: 1908, savingsToCustomersMTD: 5720,
      uptime: 0.984, complianceScore: 97 },
    { id: 'sat', name: 'StaFull San Antonio', region: 'San Antonio, TX', owner: 'R. Casillas',
      opened: '2026-04', status: 'Ramping', detailed: false,
      royaltyRate: 0.06, brandFee: 0.01, techLeasePerTruck: 600,
      customers: 31, activeVehicles: 96, trucks: 1, drivers: 2,
      mrr: 12300, gallonsMTD: 14600, royaltyMTD: 738, savingsToCustomersMTD: 2140,
      uptime: 0.978, complianceScore: 94 }
  ];

  /* franchise-sales pipeline (HQ) */
  var franchisePipeline = [
    { market: 'Oklahoma City, OK', stage: 'Discovery',      candidate: 'OKC Mobility Group', value: 185000 },
    { market: 'Fort Worth (2nd), TX', stage: 'Application', candidate: 'B. Tran',           value: 185000 },
    { market: 'El Paso, TX',     stage: 'SBA underwriting',  candidate: 'Sun City Fuel Co.', value: 185000 },
    { market: 'New Orleans, LA', stage: 'Signed — onboarding', candidate: 'Crescent Logistics', value: 210000 }
  ];

  /* ---- DFW franchise detail ---- */

  /* EV tankers */
  var tankers = [
    { id: 'TKR-04', name: 'Tanker 04', battery: 0.78, status: 'On route',
      inventory: { diesel: 920, regular: 1340, premium: 410, def: 180 } },
    { id: 'TKR-02', name: 'Tanker 02', battery: 0.54, status: 'On route',
      inventory: { diesel: 410, regular: 980, premium: 260, def: 40 } },
    { id: 'TKR-07', name: 'Tanker 07', battery: 0.96, status: 'Depot — charging',
      inventory: { diesel: 1500, regular: 1500, premium: 600, def: 240 } }
  ];

  /* drivers */
  var drivers = [
    { id: 'DRV-1', name: 'T. Alvarez', status: 'Driving',     truckId: 'TKR-04', routeId: 'R-1', shiftStart: '20:10', stopsDone: 3, stopsTotal: 6 },
    { id: 'DRV-2', name: 'K. Nguyen',  status: 'Dispensing',  truckId: 'TKR-02', routeId: 'R-2', shiftStart: '20:00', stopsDone: 1, stopsTotal: 4 },
    { id: 'DRV-3', name: 'R. Boone',   status: 'Pre-trip',    truckId: 'TKR-07', routeId: 'R-3', shiftStart: '21:30', stopsDone: 0, stopsTotal: 6 },
    { id: 'DRV-4', name: 'S. Patel',   status: 'Off shift',   truckId: null,     routeId: null,  shiftStart: null,    stopsDone: 0, stopsTotal: 0 },
    { id: 'DRV-5', name: 'M. Cole',    status: 'Available',   truckId: null,     routeId: null,  shiftStart: null,    stopsDone: 0, stopsTotal: 0 }
  ];

  /* customers (DFW). currentCustomerId = the demo "you" — a multi-vehicle small business. */
  var customers = [
    { id: 'CUS-1', name: 'Lone Star HVAC',          type: 'COMMERCIAL', plan: 'Commercial · NET-30', terms: 'NET-30',
      since: '2025-10', savingsToDate: 4185.40, contact: 'ops@lonestarhvac.example' },
    { id: 'CUS-2', name: 'Dana Whitfield',          type: 'RESIDENTIAL', plan: 'Monthly', terms: 'Card on file',
      since: '2025-12', savingsToDate: 214.80, contact: 'dana.w@example.com' },
    { id: 'CUS-3', name: 'Brightline Logistics',    type: 'FLEET', plan: 'Commercial · NET-45', terms: 'NET-45',
      since: '2025-09', savingsToDate: 18920.10, contact: 'fuel@brightline.example' },
    { id: 'CUS-4', name: 'Cedar Ridge Landscaping', type: 'COMMERCIAL', plan: 'Commercial · NET-30', terms: 'NET-30',
      since: '2026-01', savingsToDate: 1962.25, contact: 'shop@cedarridge.example' },
    { id: 'CUS-5', name: 'Carlos Mendez',           type: 'RESIDENTIAL', plan: 'Bi-weekly', terms: 'Card on file',
      since: '2026-02', savingsToDate: 96.40, contact: 'c.mendez@example.com' },
    { id: 'CUS-6', name: 'MetroParcel',             type: 'FLEET', plan: 'Commercial · NET-30', terms: 'NET-30',
      since: '2025-11', savingsToDate: 9430.75, contact: 'depot@metroparcel.example' }
  ];

  /* vehicles (by customer). level = current fuel fraction 0–1. */
  var vehicles = [
    /* Lone Star HVAC (demo customer) */
    { id: 'VEH-1', customerId: 'CUS-1', name: 'Service Van 12', model: 'Ford Transit',  plate: 'LSH-1204', fuel: 'regular', tankCap: 25, level: 0.34 },
    { id: 'VEH-2', customerId: 'CUS-1', name: 'Service Van 18', model: 'Ford Transit',  plate: 'LSH-1810', fuel: 'regular', tankCap: 25, level: 0.61 },
    { id: 'VEH-3', customerId: 'CUS-1', name: 'Crew Truck 3',   model: 'Ram 2500',      plate: 'LSH-2503', fuel: 'diesel',  tankCap: 31, level: 0.21 },
    { id: 'VEH-4', customerId: 'CUS-1', name: 'Crew Truck 7',   model: 'Ram 2500',      plate: 'LSH-2507', fuel: 'diesel',  tankCap: 31, level: 0.48 },
    { id: 'VEH-5', customerId: 'CUS-1', name: 'Box Truck 1',    model: 'Isuzu NPR',     plate: 'LSH-NPR1', fuel: 'diesel',  tankCap: 30, level: 0.55 },
    { id: 'VEH-6', customerId: 'CUS-1', name: 'Manager SUV',    model: 'Ford Explorer', plate: 'LSH-EXP9', fuel: 'premium', tankCap: 18, level: 0.72 },
    /* others (for franchise/driver views) */
    { id: 'VEH-7',  customerId: 'CUS-2', name: 'Family SUV',   model: 'Honda Pilot',   plate: 'DW-PILOT', fuel: 'regular', tankCap: 19, level: 0.28 },
    { id: 'VEH-8',  customerId: 'CUS-2', name: 'Commuter',     model: 'Toyota Camry',  plate: 'DW-CAMRY', fuel: 'regular', tankCap: 15, level: 0.41 },
    { id: 'VEH-9',  customerId: 'CUS-3', name: 'Tractor 214',  model: 'Freightliner',  plate: 'BL-0214',  fuel: 'diesel',  tankCap: 120, level: 0.18 },
    { id: 'VEH-10', customerId: 'CUS-3', name: 'Tractor 219',  model: 'Freightliner',  plate: 'BL-0219',  fuel: 'diesel',  tankCap: 120, level: 0.33 },
    { id: 'VEH-11', customerId: 'CUS-4', name: 'Crew Truck A', model: 'Ford F-250',    plate: 'CR-CRWA',  fuel: 'diesel',  tankCap: 34, level: 0.44 },
    { id: 'VEH-12', customerId: 'CUS-5', name: 'Sedan',        model: 'Mazda 3',       plate: 'CM-MZ03',  fuel: 'regular', tankCap: 13, level: 0.37 },
    { id: 'VEH-13', customerId: 'CUS-6', name: 'Van 88',       model: 'Mercedes Sprinter', plate: 'MP-0088', fuel: 'diesel', tankCap: 24, level: 0.26 }
  ];

  /* deliveries (tonight, DFW). DEL-1 is the live one the store ticks. gallons = target this fill. */
  function mkDel(o) {
    o.savings = save(o.fuel, o.gallons);
    o.amount = +(FUELS[o.fuel].ours * o.gallons).toFixed(2);
    return o;
  }
  var deliveries = [
    mkDel({ id: 'DEL-1', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-1', vehicleId: 'VEH-3',
            fuel: 'diesel', gallons: 24, status: 'dispensing', pct: 42, verified: true, window: '8:40 PM', addr: 'Lone Star HVAC yard · Bay 2' }),
    mkDel({ id: 'DEL-2', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-1', vehicleId: 'VEH-1',
            fuel: 'regular', gallons: 16, status: 'enroute', pct: 0, verified: false, window: '9:05 PM', addr: 'Lone Star HVAC yard · Bay 2' }),
    mkDel({ id: 'DEL-3', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-4', vehicleId: 'VEH-11',
            fuel: 'diesel', gallons: 19, status: 'scheduled', pct: 0, verified: false, window: '9:40 PM', addr: 'Cedar Ridge shop · 4400 Mesa' }),
    mkDel({ id: 'DEL-4', driverId: 'DRV-2', truckId: 'TKR-02', customerId: 'CUS-3', vehicleId: 'VEH-9',
            fuel: 'diesel', gallons: 98, status: 'dispensing', pct: 67, verified: true, window: '8:30 PM', addr: 'Brightline depot · Dock 7' }),
    mkDel({ id: 'DEL-5', driverId: 'DRV-2', truckId: 'TKR-02', customerId: 'CUS-6', vehicleId: 'VEH-13',
            fuel: 'diesel', gallons: 18, status: 'scheduled', pct: 0, verified: false, window: '9:20 PM', addr: 'MetroParcel · Lot C' }),
    mkDel({ id: 'DEL-6', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-2', vehicleId: 'VEH-7',
            fuel: 'regular', gallons: 14, status: 'complete', pct: 100, verified: true, window: '8:05 PM', addr: '118 Aspen Ct' }),
    mkDel({ id: 'DEL-7', driverId: 'DRV-2', truckId: 'TKR-02', customerId: 'CUS-3', vehicleId: 'VEH-10',
            fuel: 'diesel', gallons: 80, status: 'complete', pct: 100, verified: true, window: '7:50 PM', addr: 'Brightline depot · Dock 7' }),
    mkDel({ id: 'DEL-8', driverId: 'DRV-2', truckId: 'TKR-02', customerId: 'CUS-1', vehicleId: 'VEH-5',
            fuel: 'diesel', gallons: 13, status: 'flagged', pct: 0, verified: false, window: '9:55 PM', addr: 'Lone Star HVAC yard · Bay 2',
            flag: 'Fuel-type mismatch on first scan — held for re-verify' }),
    mkDel({ id: 'DEL-9', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-1', vehicleId: 'VEH-4',
            fuel: 'diesel', gallons: 17, status: 'complete', pct: 100, verified: true, window: '7:30 PM', addr: 'Lone Star HVAC yard · Bay 2' }),
    mkDel({ id: 'DEL-10', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-1', vehicleId: 'VEH-2',
            fuel: 'regular', gallons: 11, status: 'complete', pct: 100, verified: true, window: '7:12 PM', addr: 'Lone Star HVAC yard · Bay 2' }),
    mkDel({ id: 'DEL-11', driverId: 'DRV-1', truckId: 'TKR-04', customerId: 'CUS-1', vehicleId: 'VEH-6',
            fuel: 'premium', gallons: 8, status: 'complete', pct: 100, verified: true, window: 'Last night', addr: 'Lone Star HVAC yard · Bay 2' })
  ];

  /* routes (driver order) */
  var routes = [
    { id: 'R-1', driverId: 'DRV-1', stops: ['DEL-10', 'DEL-9', 'DEL-6', 'DEL-1', 'DEL-2', 'DEL-3'] },
    { id: 'R-2', driverId: 'DRV-2', stops: ['DEL-7', 'DEL-4', 'DEL-5', 'DEL-8'] },
    { id: 'R-3', driverId: 'DRV-3', stops: [] }
  ];

  /* invoices (mostly for the demo customer CUS-1) */
  var invoices = [
    { id: 'INV-2041', customerId: 'CUS-1', period: 'May 2026',  fills: 38, gallons: 612, amount: 2284.88, savings: 318.40, status: 'Paid' },
    { id: 'INV-2098', customerId: 'CUS-1', period: 'Jun 2026',  fills: 41, gallons: 668, amount: 2491.32, savings: 347.10, status: 'Due Jul 30' },
    { id: 'INV-1990', customerId: 'CUS-3', period: 'Jun 2026',  fills: 96, gallons: 8420, amount: 31911.80, savings: 1263.00, status: 'Due Aug 14' },
    { id: 'INV-2102', customerId: 'CUS-4', period: 'Jun 2026',  fills: 22, gallons: 392, amount: 1485.68, savings: 196.00, status: 'Due Jul 30' }
  ];

  /* alerts / compliance (franchise + HQ) */
  var alerts = [
    { id: 'AL-1', sev: 'high', kind: 'Fuel-type mismatch', detail: 'DEL-8 · Box Truck 1 (Lone Star HVAC) — AI scan flagged diesel nozzle vs. tagged grade. Delivery held.', when: '9:51 PM', franchise: 'dfw' },
    { id: 'AL-2', sev: 'med',  kind: 'Low inventory', detail: 'Tanker 02 · DEF at 40 gal — schedule resupply before next DEF stop.', when: '9:12 PM', franchise: 'dfw' },
    { id: 'AL-3', sev: 'med',  kind: 'Missed window', detail: 'Brightline Tractor 214 — vehicle not accessible at scheduled fill (yard gate locked). Rescheduled to next run.', when: '6:38 PM', franchise: 'dfw' },
    { id: 'AL-4', sev: 'low',  kind: 'Calibration due', detail: 'Tanker 07 meter calibration cert expires in 9 days.', when: 'Today', franchise: 'dfw' }
  ];

  /* P&L (DFW, month-to-date) */
  var pnl = {
    revenue: 61240,
    cogsFuel: 38110,
    laborOps: 9840,
    truckLease: 1800,      /* 3 trucks × $600 */
    royaltyToHQ: 3674,     /* 6% */
    brandFee: 612,         /* 1% */
    other: 2140,
    get grossProfit() { return this.revenue - this.cogsFuel; },
    get netProfit() { return this.revenue - this.cogsFuel - this.laborOps - this.truckLease - this.royaltyToHQ - this.brandFee - this.other; }
  };

  /* real geo coordinates (DFW metro) for the live maps */
  var depot = { lat: 32.812, lng: -97.005, label: 'DFW depot' };
  var geo = {
    'CUS-1': { lat: 32.912, lng: -96.638 }, // Lone Star HVAC — Garland
    'CUS-2': { lat: 33.019, lng: -96.698 }, // Dana Whitfield — Plano
    'CUS-3': { lat: 32.598, lng: -96.684 }, // Brightline depot — Wilmer/S. Dallas
    'CUS-4': { lat: 32.755, lng: -97.331 }, // Cedar Ridge — Fort Worth
    'CUS-5': { lat: 32.736, lng: -97.108 }, // Carlos Mendez — Arlington
    'CUS-6': { lat: 32.814, lng: -96.949 }  // MetroParcel — Irving
  };
  var tankerPos = {
    'TKR-04': { lat: 32.905, lng: -96.648 }, // on route near Garland
    'TKR-02': { lat: 32.612, lng: -96.690 }, // on route near Wilmer
    'TKR-07': { lat: 32.812, lng: -97.005 }  // depot, charging
  };
  /* franchise HQ markers (statewide) */
  var franchiseGeo = {
    dfw: { lat: 32.85, lng: -97.04 }, hou: { lat: 29.7604, lng: -95.3698 },
    atx: { lat: 30.2672, lng: -97.7431 }, sat: { lat: 29.4241, lng: -98.4936 }
  };

  window.STAFULL_FUELS = FUELS;
  window.STAFULL_SEED = {
    depot: depot, geo: geo, tankerPos: tankerPos, franchiseGeo: franchiseGeo,
    fuels: FUELS,
    savingsPerFill: save,
    currentFranchiseId: 'dfw',
    currentCustomerId: 'CUS-1',
    currentDriverId: 'DRV-1',
    franchises: franchises,
    franchisePipeline: franchisePipeline,
    tankers: tankers,
    drivers: drivers,
    customers: customers,
    vehicles: vehicles,
    deliveries: deliveries,
    routes: routes,
    invoices: invoices,
    alerts: alerts,
    pnl: pnl
  };
})();
