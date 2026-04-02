# Deployment Guide — REX CMA CGM

## Recommended Strategy: Vercel (Free Tier)

**Chosen:** Option A — Vercel (frontend + serverless API) — no separate backend needed.

### Why Vercel?

| Criterion | Vercel | Streamlit Cloud | ngrok |
|---|---|---|---|
| Free | ✅ | ✅ | ✅ (with limitations) |
| 50 concurrent users | ✅ (CDN + serverless) | ⚠️ (limited concurrency) | ⚠️ (laptop bandwidth) |
| Mobile UX | ✅ (Next.js, any browser) | ❌ (Streamlit is not mobile-first) | ✅ |
| No IT friction | ✅ (just a URL) | ✅ | ⚠️ (URL changes each session) |
| Zero cold start for chat | ✅ (Next.js API routes, always warm) | ❌ | N/A |
| Persistent URL | ✅ | ✅ | ❌ (paid plan needed) |

**Verdict:** Vercel gives you a permanent public URL, handles 50+ simultaneous users easily via its global CDN, requires zero server management, and the Next.js API routes (serverless functions) eliminate the cold-start problem you'd get with Railway/Render free tiers. It's the clear winner.

---

## Deploy to Vercel (Step-by-Step)

### Prerequisites
- GitHub account (free)
- Vercel account (free) — sign in with GitHub at [vercel.com](https://vercel.com)
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Step 1: Push to GitHub

```bash
cd /path/to/REX-CMA
git init
git add .
git commit -m "Initial commit — REX CMA CGM app"
# Create a new repo on github.com, then:
git remote add origin https://github.com/Kassabth/rex-cma.git
git push -u origin main
```

### Step 2: Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Select your `rex-cma` repository
4. Framework preset: **Next.js** (auto-detected)
5. Click **"Deploy"** — first deploy takes ~2 minutes

### Step 3: Set Environment Variables

After deploy, go to:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add:
| Name | Value |
|---|---|
| `GEMINI_API_KEY` | `your_actual_gemini_api_key` |

Then go to **Deployments → Redeploy** to apply the env var.

### Step 4: Share the URL

Vercel gives you a URL like: `https://rex-cma.vercel.app`

Share this with your 50 attendees before the presentation. They scan a QR code or click the link.

---

## Local Development

```bash
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY
npm install
npm run dev
# App runs at http://localhost:3000
```

---

## Custom Domain (Optional)

In Vercel Dashboard → Settings → Domains, you can add a custom domain (e.g., `rex.devoteam.com`) if you have one available.

---

## QR Code for Presentation

Generate a QR code pointing to your Vercel URL:
- [qr-code-generator.com](https://www.qr-code-generator.com)
- Display it on the first slide so attendees can join instantly

---

## Costs

| Service | Cost |
|---|---|
| Vercel Hobby Plan | **Free** |
| Gemini API (gemini-1.5-flash) | **Free** up to generous limits (see [Google AI pricing](https://ai.google.dev/pricing)) |
| Total | **$0** |
