# StaFull

Marketing site and clickable product demo for StaFull, a planned on-site fuel-delivery service for cars and small fleets.

All data in the demo is sample data. The customers, drivers, deliveries, franchises and dollar figures are made up and live in one file, `app/seed.js`. Nothing in this repo connects to a real fuel system, payment processor or vehicle.

## The problem

A fuel-delivery operator has to show customers, drivers and franchise buyers how the service will work before the real system exists. A slide deck cannot show what a driver sees during a shift or how one franchise's numbers add up into the network totals.

## How it solves it

- **Marketing pages** that describe the service: home, pricing, fleets, coverage, about, contact, legal and a 404 page.
- **A demo app** with four role screens that all read the same sample data:
  - `app/customer.html`: vehicles, scheduling, deliveries, billing and a live fill view
  - `app/driver.html`: shift, route, a deliver-and-check screen and truck inventory
  - `app/franchise.html`: dispatch board, fleet map, territory and unit P&L
  - `app/hq.html`: network figures, franchises, royalties and compliance alerts

`app/mode.js` picks the mode from the hostname. On `stafull.com` and `www.stafull.com` the demo app is closed and the sign-in page shows an invitation-only message. On every other host (localhost, `demo.stafull.com`, preview URLs) the sign-in page shows the role picker and the demo opens.

Deliveries in the demo are simulated in the browser: a timer advances the fill percentage and moves the driver's next stop up when one completes. The timer does not run when the browser asks for reduced motion. Anything changed in the demo (for example a scheduled fill) is lost when the page reloads.

## Who it helps

- A fuel-delivery operator pitching to customers and franchise buyers.
- Developers who want a multi-role demo with no build step to copy from.

## Technical details

- Plain HTML, CSS and JavaScript with no framework, bundler or package install.
- `app/seed.js` holds every sample record. Edit it to change the demo data.
- `app/store.js` reads the seed, keeps the demo session and role in `sessionStorage`, and runs the simulated deliveries.
- `app/ui.js` draws the shared app shell (sidebar, role switcher, "Demo" flag).
- Maps use [Leaflet](https://leafletjs.com/) 1.9.4 from unpkg with dark CARTO tiles, set up in `mapkit.js` and `mapkit.css`.
- Design tokens are in `styles.css`: gray surfaces with one brand red (`#a30000`). Bright colors are used only for status pills, fuel-grade chips and map markers.
- `assets/` holds monochrome marks for DOT, PHMSA, EPA, OSHA and NFPA 30A.
- There are no automated tests and no CI.

### Run locally

```bash
git clone https://github.com/dbhavery/stafull
cd stafull
python -m http.server 5001
```

Open http://127.0.0.1:5001/ and choose Sign in. Localhost runs in demo mode.

### Deploy

The site is static and can be hosted anywhere. With the Vercel CLI:

```bash
vercel --prod
```

## License

[MIT](LICENSE), Donald B. Havery
