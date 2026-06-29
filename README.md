# StaFull

Marketing site + role-based product demo for **StaFull** — a mobile, on-site fuel-delivery service. EV vans refuel vehicles right where they're parked (residential and commercial fleets), below pump price, with every fill AI-verified.

A zero-build static site — plain HTML, CSS, and vanilla JS. No framework, no bundler.

## What's here

**Marketing pages** — `index.html` (home), `pricing.html`, `fleets.html`, `coverage.html`, `about.html`, `contact.html`, `legal.html`, `404.html`.

**Role-based demo app** (`app/`) — a dependency-free, SPA-feel demo across four roles on shared sample data:
- `customer.html` — vehicles, schedule, deliveries, billing, live fill
- `driver.html` — shift, route, deliver + AI verify, truck
- `franchise.html` — dispatch + live fleet map, fleet, territory, P&L
- `hq.html` — network, franchises, finance, compliance

`mode.js` serves the gated real experience on the production domain and a walkable demo everywhere else. To change the demo data, edit `app/seed.js` only.

**Design** — monochrome greyscale surfaces with a single brand red (`#a30000`); bright semantic colors are used only for functional indicators (status pills, fuel-grade chips, map markers). Tokens live in `styles.css`.

**Maps** — real [Leaflet](https://leafletjs.com/) maps with dark CARTO tiles via `mapkit.js` / `mapkit.css`.

**`assets/`** — original monochrome regulatory compliance marks (DOT, PHMSA, EPA, OSHA, NFPA 30A).

## Run locally

```bash
python -m http.server 5001
# open http://127.0.0.1:5001/  (localhost = demo mode)
```

## Deploy

Static — host anywhere. With the Vercel CLI:

```bash
vercel --prod
```

## License

[MIT](LICENSE) © Donald B. Havery
