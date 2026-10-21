/* ======================================================================
   StaFull app shell, StaFullApp.mount({ role, active }).
   Renders the role-aware sidebar + topbar, guards the session, wires
   in-page view switching, the live clock, the demo role switcher and the
   mobile drawer. Requires mode.js + seed.js + store.js loaded first.
   ====================================================================== */
(function () {
  var S = window.StaFullStore;
  var Mode = window.StaFullMode || { isReal: function () { return false; }, isDemo: function () { return true; } };

  /* ---- inline icons ---- */
  var I = {
    home:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 11l9-7 9 7"/><path d="M5 10v9h14v-9"/></svg>',
    truck:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2 6h11v9H2z"/><path d="M13 9h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>',
    cal:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>',
    route:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="18" r="2.4"/><path d="M6 8.5V14a4 4 0 004 4h4"/></svg>',
    receipt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6"/></svg>',
    copilot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',
    map:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
    gauge:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 19a8 8 0 1116 0"/><path d="M12 19l4-6"/></svg>',
    board:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>',
    chart:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 20V4"/><path d="M4 20h16"/><path d="M8 16v-4M12 16V8M16 16v-7"/></svg>',
    globe:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/></svg>',
    bldg:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 21V5l8-2v18M12 21V9l8 2v10"/><path d="M7 8v.01M7 12v.01M16 13v.01M16 16v.01"/></svg>',
    back:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
    swap:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 7h13l-3-3M17 17H4l3 3"/></svg>',
    out:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>'
  };

  /* ---- per-role nav + context ---- */
  function navFor(role) {
    if (role === 'customer') return [
      { view: 'overview',  label: 'Overview',       icon: I.home },
      { view: 'vehicles',  label: 'My Vehicles',    icon: I.truck,   badge: S.vehiclesFor(S.currentCustomer().id).length },
      { view: 'schedule',  label: 'Schedule a Fill',icon: I.cal },
      { view: 'deliveries',label: 'Deliveries',     icon: I.route },
      { view: 'invoices',  label: 'Billing',        icon: I.receipt }
    ];
    if (role === 'driver') return [
      { view: 'shift',     label: 'My Shift',        icon: I.copilot },
      { view: 'route',     label: 'Route',           icon: I.route },
      { view: 'deliver',   label: 'Deliver & Verify',icon: I.shield },
      { view: 'truck',     label: 'Truck Check',     icon: I.gauge }
    ];
    if (role === 'franchise') return [
      { view: 'dispatch',  label: 'Dispatch',          icon: I.board },
      { view: 'fleet',     label: 'Drivers & Trucks',  icon: I.truck },
      { view: 'territory', label: 'Territory',         icon: I.map },
      { view: 'pnl',       label: 'P&L',               icon: I.chart }
    ];
    if (role === 'hq') return [
      { view: 'network',    label: 'Network',            icon: I.globe },
      { view: 'franchises', label: 'Franchises',         icon: I.bldg },
      { view: 'finance',    label: 'Finance & Royalties',icon: I.chart },
      { view: 'compliance', label: 'Compliance',         icon: I.shield, badge: S.alerts().length, red: true }
    ];
    return [];
  }
  function contextFor(role) {
    if (role === 'customer')  { var c = S.currentCustomer(); return c.name + ' · ' + c.plan; }
    if (role === 'driver')    { var d = S.currentDriver(); return d.name + ' · ' + (d.truckId || 'No truck'); }
    if (role === 'franchise') { var f = S.currentFranchise(); return f.name + ' · ' + f.region; }
    if (role === 'hq')        { return 'StaFull Holdings, LLC · ' + S.franchises().length + ' franchises'; }
    return '';
  }

  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }

  function mount(opts) {
    var role = opts.role;
    var active = opts.active;

    /* ---- guard: real site (stafull.com) is gated, never serve the app ---- */
    if (Mode.isReal()) { location.replace('../signin.html'); return; }
    S.setSession(role); /* demo: deep-links + role switch stay consistent */

    var roleMeta = S.ROLES[role];
    var nav = navFor(role);
    var side = document.getElementById('app-side');
    var top = document.getElementById('app-top');

    /* ---- sidebar ---- */
    var navHtml = nav.map(function (n) {
      var badge = (n.badge != null) ? '<span class="nv-badge' + (n.red ? ' red' : '') + '">' + n.badge + '</span>' : '';
      return '<div class="nv-wrap"><button class="nv" data-view="' + n.view + '">' + n.icon +
             '<span>' + n.label + '</span>' + badge + '</button></div>';
    }).join('');
    side.innerHTML =
      '<div class="side-brand"><span>Stā<b>Full</b></span></div>' +
      '<div class="side-role"><div class="rl-tag">' + roleMeta.tag + '</div>' +
        '<div class="rl-name"><span class="rl-dot"></span>' + roleMeta.label + '</div></div>' +
      '<nav class="side-nav" aria-label="Sections">' + navHtml + '</nav>' +
      '<div class="side-foot">' +
        '<a href="../index.html">' + I.back + ' Back to stafull.com</a>' +
        '<button type="button" id="sf-signout">' + I.out + ' Exit demo</button>' +
      '</div>';

    /* ---- topbar ---- */
    var roleMenu = Object.keys(S.ROLES).map(function (k) {
      var r = S.ROLES[k];
      return '<a href="' + r.landing + '" data-role="' + k + '"' + (k === role ? ' aria-current="true"' : '') +
             '><b>' + r.label + '</b><span>' + r.tag + '</span></a>';
    }).join('');
    top.innerHTML =
      '<button class="menu-btn" id="sf-menu" aria-label="Menu"><span></span><span></span><span></span></button>' +
      '<div class="top-title"><b id="sf-title">' + roleMeta.label + '</b><span id="sf-sub">' + contextFor(role) + '</span></div>' +
      '<div class="top-right">' +
        '<span class="clock"><span class="dot"></span><span id="sf-clock">--:--</span></span>' +
        '<div class="role-switch"><button id="sf-rolebtn" aria-haspopup="true" aria-expanded="false">' +
          '<span class="rs-dot"></span><span class="rs-lbl">View as</span>' + I.swap + '</button>' +
          '<div class="role-menu" id="sf-rolemenu"><div class="rm-h">Switch demo role</div>' + roleMenu + '</div>' +
        '</div>' +
        '<span class="demo-flag">Demo · all data is sample data</span>' +
      '</div>';

    /* ---- view switching ---- */
    var views = Array.prototype.slice.call(document.querySelectorAll('.view'));
    var navBtns = Array.prototype.slice.call(side.querySelectorAll('.nv'));
    function show(view) {
      var found = false;
      views.forEach(function (v) {
        var on = v.id === 'view-' + view;
        v.classList.toggle('active', on);
        if (on) found = true;
      });
      if (!found && views.length) { view = views[0].id.replace('view-', ''); views[0].classList.add('active'); }
      navBtns.forEach(function (b) { b.setAttribute('aria-current', b.dataset.view === view ? 'true' : 'false'); });
      var vEl = document.getElementById('view-' + view);
      var t = document.getElementById('sf-title'), sub = document.getElementById('sf-sub');
      if (vEl && vEl.dataset.title) t.textContent = vEl.dataset.title; else t.textContent = roleMeta.label;
      sub.textContent = (vEl && vEl.dataset.sub) ? vEl.dataset.sub : contextFor(role);
      try { history.replaceState(null, '', '#' + view); } catch (e) {}
      closeDrawer();
      window.scrollTo(0, 0);
    }
    navBtns.forEach(function (b) { b.addEventListener('click', function () { show(b.dataset.view); }); });

    var initial = (location.hash || '').replace('#', '') || active || (nav[0] && nav[0].view);
    show(initial);

    /* ---- mobile drawer ---- */
    var scrim = h('<div class="scrim" id="sf-scrim"></div>');
    document.body.appendChild(scrim);
    function openDrawer() { side.classList.add('open'); if (scrim) scrim.classList.add('open'); }
    function closeDrawer() { side.classList.remove('open'); if (scrim) scrim.classList.remove('open'); }
    document.getElementById('sf-menu').addEventListener('click', openDrawer);
    scrim.addEventListener('click', closeDrawer);

    /* ---- role switcher ---- */
    var rbtn = document.getElementById('sf-rolebtn');
    var rmenu = document.getElementById('sf-rolemenu');
    rbtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = rmenu.classList.toggle('open');
      rbtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () { rmenu.classList.remove('open'); rbtn.setAttribute('aria-expanded', 'false'); });
    Array.prototype.forEach.call(rmenu.querySelectorAll('a'), function (a) {
      a.addEventListener('click', function () { S.setSession(a.dataset.role); /* navigation proceeds via href */ });
    });

    /* ---- sign out ---- */
    document.getElementById('sf-signout').addEventListener('click', function () {
      S.clearSession(); location.href = '../signin.html';
    });

    /* ---- live clock ---- */
    var clk = document.getElementById('sf-clock');
    function tickClock() {
      var d = new Date();
      var hh = d.getHours(), mm = d.getMinutes(), ss = d.getSeconds();
      var ap = hh >= 12 ? 'PM' : 'AM'; var h12 = hh % 12; if (h12 === 0) h12 = 12;
      clk.textContent = h12 + ':' + (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss + ' ' + ap;
    }
    tickClock(); setInterval(tickClock, 1000);

    /* ---- start the live data tick ---- */
    S.start();

    return { show: show };
  }

  window.StaFullApp = { mount: mount, icons: I };
})();
