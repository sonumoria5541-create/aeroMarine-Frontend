# AeroMarine — Deployment Guide

## 1. Architecture Overview
- **Frontend:** React + Vite SPA (deployable to Vercel, Netlify, or static CDN).
- **Backend:** Node.js + Express.js API (runs in WSL locally, or deployable to Render, Railway, DigitalOcean).
- **Database:** MongoDB Atlas (Multi-document ACID transaction replica set).
- **Email:** Resend API for transactional notifications.

---

## 2. Environment Variables

### Backend (`server/.env`)
```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-domain.com
API_BASE_URL=https://api.your-domain.com

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/aeromarine?retryWrites=true&w=majority

JWT_ACCESS_SECRET=your_super_long_random_jwt_access_secret_2026
JWT_REFRESH_SECRET=your_super_long_random_jwt_refresh_secret_2026
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
COOKIE_DOMAIN=.your-domain.com

RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=AeroMarine <notifications@your-verified-domain.com>
ADMIN_NOTIFICATION_EMAIL=admin@your-domain.com
SUPPORT_EMAIL=support@your-domain.com

APP_TIMEZONE=Asia/Kolkata
DEFAULT_CURRENCY=INR
APP_MODE=DEMO
REAL_MONEY_ENABLED=false
COMPLIANCE_APPROVED=false
```

### Frontend (`client/.env`)
```env
VITE_API_BASE_URL=https://api.your-domain.com/api/v1
```

---

## 3. Running Locally (WSL Backend + React Frontend)

### Start Backend in WSL:
```bash
# From Windows PowerShell / Terminal:
wsl -d Ubuntu -- bash -c "cd /mnt/d/Anti-Websitees/aeromarine/server && npm run dev"

# Or simply double-click:
start-wsl-backend.bat
```

### Start Frontend:
```bash
npm --prefix client run dev
```
Open `http://localhost:5173` in your browser.
