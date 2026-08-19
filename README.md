# CBSE Class 11 Physics – 100 Numericals Practice Web App

An interactive, dual-pace numerical exam practice platform covering 100 CBSE Class XI Physics numericals rendered with KaTeX.

## Chapters Covered
1. **Units & Dimensions** (Q1–Q25)
2. **Motion in a Straight Line** (Q26–Q60)
3. **Simple Derivatives** (Q61–Q80)
4. **Simple Integration** (Q81–Q100)

## Dual-Pace Flow
- **Questions 1–30 (⚡ Rapid Drill)**: 30 seconds per question, 15 seconds solution review.
- **Questions 31–100 (Standard Numericals)**: 2 minutes per question, 30 seconds solution review.

---

## 🚀 How to Upload & Deploy to GitHub Pages

### Step 1: Initialize Git and Push to GitHub
Run the following commands in your project root directory:

```bash
# 1. Initialize git repository
git init

# 2. Add all files
git add .

# 3. Commit your files
git commit -m "Initial commit - CBSE Class 11 Physics 100 Numericals"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 6. Push to GitHub
git push -u origin main
```

### Step 2: Enable GitHub Pages in Repository Settings
1. Go to your GitHub repository on [github.com](https://github.com).
2. Click **Settings** (tab at the top).
3. In the left sidebar, click **Pages**.
4. Under **Build and deployment** > **Source**, select **GitHub Actions**.
5. That's it! The workflow in `.github/workflows/deploy.yml` will automatically build and deploy your app.
6. Your live web app URL will appear at the top of the Pages settings page (e.g. `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
