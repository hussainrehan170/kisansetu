# 🌾 KisanSetu (किसान सेतु — जुड़ाव से समृद्धि)
> Smart India Hackathon 2026 · Problem Statement SIH26132  
> **Strengthening Market Linkages & Transparent Price Discovery for Farmers**

---

## ⚡ Unified Vercel & NPM Deployment

This project is configured as a single unified NPM application with **zero separate backend requirement**. It can be deployed directly to **Vercel** with one click.

### 🚀 Deploy to Vercel (Step-by-Step)

#### Method 1: Via Vercel Web Dashboard (Recommended)
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial KisanSetu commit"
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/kisansetu.git
   git push -u origin main
   ```
2. Go to **[vercel.com/new](https://vercel.com/new)**.
3. Import your `kisansetu` repository.
4. Vercel will automatically detect:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**. Your website will be live in ~30 seconds with global CDN and SSL!

#### Method 2: Via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 🛠️ Local Development (NPM)

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 📂 Project Architecture

```text
├── vercel.json           # Vercel deployment, rewrite rules & headers
├── package.json          # Unified NPM dependencies & build scripts
├── vite.config.js        # Vite production bundler config
├── tailwind.config.js    # Agri-Trust Modern UI color tokens
├── postcss.config.js     # PostCSS styling setup
├── index.html            # Vite SPA entrance
│
├── api/                  # Vercel Serverless Functions (Backend)
│   ├── register.js       # POST /api/register (Device registration)
│   ├── registrations.js  # GET /api/registrations (Saved list)
│   └── health.js         # GET /api/health (Uptime check)
│
├── src/                  # React 18 Application Source Code
│   ├── main.jsx          # App root mount
│   ├── App.jsx           # Routing & role guards
│   ├── api.js            # Unified API client with self-contained fallback
│   ├── components/       # Navbar, Layout, ProtectedRoute
│   ├── context/          # AuthContext (Farmer / Buyer / Admin)
│   ├── locales/          # English, Hindi, Marathi dictionaries
│   └── pages/
│       ├── CoverPage.jsx # Cinematic landing, 3-language gate, compulsory modal
│       ├── MarketPrices.jsx # APMC live prices, trend meters, arrival charts
│       ├── farmer/       # Farmer dashboard, lot creation, bid accept
│       ├── buyer/        # Institutional procurement & lot bidding
│       ├── shared/       # Escrow ledger, contracts & disputes
│       └── admin/        # APMC & buyer verification portal
│
├── public/               # Static assets & branding
│   ├── logo.png          # Official KisanSetu emblem
│   └── images/           # High-resolution agricultural imagery
│
└── dist/                 # Production pre-built distribution directory
```

---

## ✨ Features Included

* **Compulsory Registration Modal**: Required one-time device verification with 10-digit Indian phone validation (`^[6-9]\d{9}$`).
* **Location-Based Language Selector**: Automatically offers English, Hindi, and local state language.
* **Farmer-Friendly UI**: High-contrast, large-font price meters (🔴 Bearish / 🟡 Average / 🟢 High Profit).
* **Dual Portals**: Unified farmer lot listing and institutional buyer bidding workflows.
* **Escrow & Dispute Redressal**: Digital contract lifecycle with 24h grievance SLA.
