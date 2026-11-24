# AEROMARINE — PRODUCTION DEPLOYMENT & INFRASTRUCTURE REPORT
**Target Domain**: [https://www.aeromarine.site](https://www.aeromarine.site)  
**Deployment Date**: 2026-11-24  
**Release Version**: v2.0.0 (CMS Transformation Release)  

---

## 1. System Architecture Overview

AeroMarine is architected as a distributed full-stack web application consisting of two primary tiers and hosted cloud infrastructure:

```
[ Internet Users & Search Engines ]
               │
               ▼
[ Cloudflare / Reverse Proxy SSL (aeromarine.site) ]
               │
       ┌───────┴───────┐
       ▼               ▼
[ Client SPA (Vite/React) ]   [ Express REST API (Node.js) ]
       │                               │
       │                               ├─► MongoDB Atlas (Primary DB)
       │                               ├─► Cloudinary / Local Disk (Media)
       │                               └─► Resend API (Email Notifications)
```

- **Frontend Application (`client/`)**:
  - React 18 Single Page Application (SPA) built with Vite and Tailwind CSS.
  - Hosted at `https://www.aeromarine.site`.
  - Repository: `git@github.com:sonumoria5541-create/aeroMarine-Frontend.git`.
- **Backend Service (`server/`)**:
  - Node.js & Express RESTful API engine.
  - Multi-tier controllers, Mongoose schemas, JWT authentication, and ledger synchronization.
  - Repository: `git@github.com:sonumoria5541-create/aeroMarine-Backend.git`.
- **Database**:
  - MongoDB Atlas Cloud Cluster (`aeromarine`).

---

## 2. Environment Variables & Secret Configuration

### Backend Environment Configuration (`server/.env`)
Ensure the following variables are securely set in the production environment:

| Variable | Description | Example / Status |
|---|---|---|
| `PORT` | Node server listener port | `5000` |
| `NODE_ENV` | Environment identifier | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Cryptographic secret for signing tokens | Verified (High Entropy) |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `FRONTEND_URL` | CORS authorized origin | `https://www.aeromarine.site` |
| `RESEND_API_KEY` | Resend API key for inquiry & alert emails | Configured |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary asset cloud storage | Configured (with local fallback) |
| `CLOUDINARY_API_KEY` | Cloudinary access key | Configured |
| `CLOUDINARY_API_SECRET` | Cloudinary secret | Configured |

### Frontend Environment Configuration (`client/.env`)

| Variable | Description | Production Value |
|---|---|---|
| `VITE_API_URL` | Public API endpoint URL | `https://www.aeromarine.site/api` |

---

## 3. Database Schemas & CMS Collections

The database cluster includes the following operational and CMS collections:

1. **`pages`** (`Page.js`):
   - Stores user-facing website pages.
   - Fields: `title`, `slug` (unique indexed), `status` (`draft` / `published`), `isSystemPage`, `seo` (metaTitle, metaDescription, ogImage, canonicalUrl), `sections` (array of typed visual blocks: hero, stats, features, plans_catalog, about_story, testimonials, faq, rich_text, cta, contact_block).
2. **`media_items`** (`MediaItem.js`):
   - Central catalog of digital assets.
   - Fields: `filename`, `url`, `publicId`, `storageType` (`cloudinary` / `local`), `mimeType`, `size`, `dimensions` (width, height), `folder`, `altText`, `caption`, `usageCount`.
3. **`inquiries`** (`Inquiry.js`):
   - Customer submissions from the contact desk.
   - Fields: `inquiryId` (e.g., `INQ-58291-1029`), `name`, `email`, `phone`, `subject`, `message`, `status` (`new`, `in_progress`, `resolved`, `closed`, `spam`), `priority`, `coordinatorNotes`.
4. **`navigation_menus`** (`NavigationMenu.js`):
   - Header, footer, and mobile navigation link structures.
   - Fields: `location` (`header`, `footer`, `mobile`, `quick_links`), `items` array with `label`, `url`, `order`, `openInNewTab`.
5. **`system_settings`** (`SystemSetting.js`):
   - Singleton collection for website branding, color palettes, sticky header preferences, footer coordinates, and announcement marquee.
6. **`users`**, **`plans`**, **`orders`**, **`transactions`**, **`audit_logs`**:
   - Financial ledger and account management collections.

---

## 4. Production Deployment & Build Pipeline

### 4.1 Frontend Build & Deployment
```bash
# In the client directory:
cd client
npm install --production=false
npm run build
# Output generated in client/dist/
```
The compiled output in `client/dist/` is served via the reverse proxy (Nginx or Cloudflare Pages) with HTML5 history API fallback:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 4.2 Backend Service Deployment
```bash
# In the server directory:
cd server
npm install --production
npm test
# Verify all 45 tests pass
pm2 restart aeromarine-api || pm2 start src/index.js --name "aeromarine-api"
```

---

## 5. Automated Sitemaps & Search Engine Indexing

- **Dynamic Sitemap Endpoint**:
  - `GET https://www.aeromarine.site/sitemap.xml`
  - Handled directly by `server/src/controllers/seoController.js`
  - Dynamically queries all published pages from MongoDB and constructs a W3C-compliant XML sitemap with `<loc>`, `<lastmod>`, `<changefreq>`, and `<priority>`.
- **Robots.txt Directive**:
  - `GET https://www.aeromarine.site/robots.txt`
  - Explicitly permits search engines to index public landing pages while disallowing `/admin/`, `/login`, `/dashboard`, and `/api/`. Points to the dynamic sitemap.

---

## 6. Security & Hardening Checklist

- [x] **Owner Account Protection**: Primary owner (`8427348239`) is flagged as protected in database and code. Cannot be deleted, suspended, or demoted.
- [x] **System Page Protection**: Critical pages (`home`, `about`, `contact`, `terms`, `privacy`, `risk-disclosure`, `refund-policy`, `containers`) are guarded against accidental deletion.
- [x] **Role-Based Access Control**: Granular permissions checklist implemented across all admin API endpoints.
- [x] **Data Redaction & Sanitization**: Passwords hashed with bcrypt (10 rounds). Sensitive fields stripped before JSON serialization.
- [x] **Safe Media Asset Deletion**: Reference check validates that images in use on published pages cannot be deleted without warning.
- [x] **Ledger Idempotency**: Strict balance checks prevent double-spending or unauthorized withdrawals.

---

## 7. Operational Monitoring & Disaster Recovery

### Daily Backups
- **MongoDB Atlas Automated Snapshots**: Daily cluster backup with point-in-time recovery enabled.
- **Media Assets**: Mirrored across Cloudinary CDN and local uploads folder.

### Health Checks
- REST API Health Check: `GET https://www.aeromarine.site/api/health`
- Expected Response: `{"status":"ok","timestamp":"..."}`
