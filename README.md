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

## 🚀 How to Push & Deploy to GitHub Pages

### Step 1: Initialize Git and Push to GitHub
```bash
# 1. Initialize git repository
git init

# 2. Add all files
git add .

# 3. Commit your files
git commit -m "Deploy CBSE Class 11 Physics App"

# 4. Set main branch
git branch -M main

# 5. Link your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# 6. Push to GitHub
git push -u origin main
```

---

## 🛠️ Resolving Common GitHub Actions Deployment Errors

If your GitHub Actions run fails, check these **two required GitHub settings**:

### 1. Enable "GitHub Actions" as the Pages Source
1. Open your repository on GitHub.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, change from *Deploy from a branch* to **GitHub Actions**.

### 2. Enable Workflow Read & Write Permissions
1. In your repository, go to **Settings** > **Actions** > **General**.
2. Scroll down to **Workflow permissions**.
3. Select **Read and write permissions**.
4. Check the box **Allow GitHub Actions to create and approve pull requests**.
5. Click **Save**.

### 3. Re-run Failed Jobs
1. Go to the **Actions** tab on GitHub.
2. Click on the latest workflow run.
3. Click **Re-run all jobs** in the top right.

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
