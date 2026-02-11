# AutoTrack

A lightweight, self-hosted website analytics tool focused on simplicity and privacy.

No cookies. No sign-up. No third-party scripts. Just one `<script>` tag and you're tracking.

## Features

- **Page views** — automatic tracking on every page load
- **Click tracking** — captures element type, ID, and text
- **Time on page** — measures how long users stay
- **Multi-site** — track unlimited websites from a single instance, grouped by domain
- **Admin dashboard** — password-protected with charts and per-domain filtering
- **Privacy-first** — no personal data, no IP logging, no cookies
- **Self-hosted** — you own your data, deploy anywhere

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-username/autotrack-analytics.git
cd autotrack-analytics
npm install
```

### 2. Configure environment

Create a `.env.local` file:

```env
MONGODB_URI=mongodb+srv://your-connection-string
ADMIN_PASSWORD=your-secure-password
```

For local development, you can use a local MongoDB instead:

```env
MONGO_URI_LOCAL=mongodb://localhost:27017/autotrack
ADMIN_PASSWORD=your-secure-password
```

### 3. Run

```bash
npm run dev
```

Visit `http://localhost:3000` to see the setup instructions.

### 4. Add tracking to any website

Add this single line before `</body>` on any site you want to track:

```html
<script src="https://your-autotrack-domain.com/tracker.js"></script>
```

That's it. The tracker automatically detects:
- The **API endpoint** from its own script URL
- The **domain** from the page URL
- The **device type** from the user agent

No configuration, no IDs, no setup per site.

### 5. View analytics

Go to `/dashboard` and enter your admin password. You'll see all tracked domains with a selector to switch between them.

## Architecture

```
autotrack-analytics/
├── app/
│   ├── api/
│   │   ├── auth/route.ts        # Admin password verification
│   │   ├── domains/route.ts     # List tracked domains
│   │   ├── events/route.ts      # Event ingestion (public, CORS-enabled)
│   │   └── stats/route.ts       # Aggregated stats (protected)
│   ├── dashboard/
│   │   ├── page.tsx             # Admin dashboard with charts
│   │   └── dashboard.css
│   ├── layout.tsx
│   └── page.tsx                 # Landing page with setup instructions
├── Components/
│   ├── StatsChart.tsx           # Bar/Pie chart component
│   └── SummaryCards.tsx         # Summary statistics cards
├── modals/
│   └── Event.ts                 # Mongoose event schema
├── lib/
│   └── db.ts                    # MongoDB connection
└── public/
    └── tracker.js               # Embeddable tracking script
```

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB (via Mongoose)
- **Charts**: Chart.js + react-chartjs-2
- **Language**: TypeScript
- **Styling**: CSS

## Event Model

Each tracked interaction is stored as an event:

| Field | Type | Description |
|-------|------|-------------|
| `domain` | String | Auto-extracted from page URL |
| `eventType` | String | `page_view`, `click`, or `duration` |
| `url` | String | Full page URL |
| `referrer` | String | Previous page or source |
| `sessionId` | String | Anonymous session identifier (sessionStorage) |
| `device` | String | `desktop`, `mobile`, or `tablet` |
| `element` | String | Clicked element (e.g. `BUTTON#signup`) |
| `text` | String | Clicked element text (first 50 chars) |
| `duration` | Number | Seconds spent on page |
| `timestamp` | Date | When the event occurred |

## API Reference

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/events` | POST | None | Ingest events (CORS-enabled) |
| `/api/auth` | POST | None | Verify admin password |
| `/api/domains` | GET | Admin | List all tracked domains |
| `/api/stats?domain=example.com` | GET | Admin | Get stats for a domain |

Protected endpoints require the `x-admin-password` header.

## Deployment

AutoTrack is designed to be deployed on any platform that supports Next.js. For Vercel:

1. Push to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables: `MONGODB_URI` and `ADMIN_PASSWORD`
4. Deploy

Once deployed, add the tracking script to any website using your Vercel URL.

## Privacy

AutoTrack is built with privacy as a core principle:

- No cookies or persistent identifiers
- No IP address collection
- No personal data
- Session IDs use `sessionStorage` (cleared when the browser tab closes)
- All data stays on your own database

## License

MIT
