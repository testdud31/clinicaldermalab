# Clinical Derma Lab - GitHub Pages Deployment & Hosting Guide

This repository is optimized for hosting on **GitHub Pages** with automated zero-configuration continuous deployment, static multi-page rendering, custom domains, and search engine optimization.

---

## 🚀 Quick Start: Deploying to GitHub Pages in 2 Steps

### Step 1: Push Code to Your GitHub Repository
Push this codebase to your GitHub repository on the `main` or `master` branch:

```bash
git init
git add .
git commit -m "feat: Clinical Derma Lab complete build ready for GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. Navigate to your repository on **GitHub.com**.
2. Click **Settings** (tab at the top) &rarr; **Pages** (in the left sidebar under *Code and automation*).
3. Under **Build and deployment** &rarr; **Source**, select:
   👉 **GitHub Actions**
4. That's it! The included `.github/workflows/deploy.yml` workflow will automatically trigger, build the complete static site with Vite, and deploy it to your live GitHub Pages URL (e.g. `https://<your-username>.github.io/<your-repo-name>/` or your custom domain).

---

## 🛠 Included GitHub Optimizations

### 1. Automated GitHub Actions Workflow (`.github/workflows/deploy.yml`)
- Automatically triggers on every push to `main` or `master`.
- Uses official GitHub actions (`actions/configure-pages@v5`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`).
- Handles Node.js 20 caching, static compilation via `npm run build`, and atomic zero-downtime deployment.

### 2. Bypass Jekyll Processing (`.nojekyll`)
- Placed in both the project root and `public/.nojekyll` (which copies to `dist/.nojekyll`).
- Tells GitHub Pages to serve all HTML, CSS, JavaScript, and static asset folders directly without interference from Jekyll.

### 3. Custom Error & Route Resolution (`404.html`)
- Built and served automatically by GitHub Pages when an unknown route or trailing slash mismatch occurs.
- Includes our clinical theme layout, links to all primary diagnostic hubs, and a smart JavaScript resolver that corrects URLs without the `.html` extension.

### 4. Dynamic Base URL Handling
- `vite.config.ts` dynamically respects `VITE_BASE_URL`.
- If hosted at a subfolder repository (e.g. `https://<user>.github.io/<repo>/`), the GitHub Action automatically sets the correct base path.
- If hosted on a custom domain (e.g. `https://clinicaldermalab.com`), it defaults to the root domain (`/`).

### 5. Custom Domain Support (CNAME)
To connect your own custom domain:
1. In `public/`, create a file named `CNAME` (see `CNAME.example` for reference).
2. Inside `public/CNAME`, write your domain name (e.g., `clinicaldermalab.com`).
3. Configure your DNS provider:
   - For an apex domain (`example.com`), add `A` records pointing to GitHub Pages IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - For a subdomain or `www`, add a `CNAME` record pointing to `<your-username>.github.io`.
4. In GitHub Settings &rarr; Pages, check **Enforce HTTPS**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Compile production build to /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 Site Structure
- `/` (`index.html`) - Main Clinical Portal & Trust Hub
- `/blog.html` - Complete 24-Product Dermatology Review Directory
- `/treatments` (`treatments.html`) - Medical Catalog & Procedures
- `/conditions` (`conditions.html`) - Diagnostic Cutaneous Concerns
- `/science-and-ingredients` - Biochemical Glossary
- `/medical-review-board` - E-E-A-T Dermatological Advisory Board
- `/404.html` - Custom error & routing handler
- `*.html` - 24 verified clinical product reviews
