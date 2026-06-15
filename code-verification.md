# GitHub Actions Code Verification Guide

This guide outlines how to implement a secure code verification layer using GitHub Actions to complement your existing server cron-job automation.

---

## 1. The Workflow Strategy

Adding a verification step ensures that your server never accidentally pulls and deploys broken code.
[ Push Code to dev ] ──> [ Open PR to main ] ──> [ GitHub Compiles Angular & .NET ]
                                                         │
         ┌───────────────────────────────────────────────┴───────────────┐
         ▼                                                               ▼
   [ Build Fails (Red X) ]                                    [ Build Succeeds (Green Check) ]
    Fix code locally.                                          Merge PR. Server cron job 
    Server is never disrupted.                                 safely pulls verified code.

---

## 2. The GitHub Actions Workflow File

Create a file in your repository at the exact path: `.github/workflows/verify-code.yml` and paste the following content.

```yaml
name: Verify Code

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  verify-backend:
    name: Compile .NET API
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup .NET SDK
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: '8.0' # Adjust to match your target .NET version

      - name: Restore dependencies
        run: dotnet restore ./backend/YourProject.sln # Update with your solution path

      - name: Compile Code
        run: dotnet build ./backend/YourProject.sln --configuration Release --no-restore

  verify-frontend:
    name: Compile Angular App
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # Adjust to match your Angular version

      - name: Install dependencies
        run: npm ci
        working-directory: ./frontend # Update with your frontend folder path

      - name: Compile Frontend
        run: npm run build -- --configuration=production
        working-directory: ./frontend
```

---

## 3. Best Practices for Your Specific Setup

* **Isolate Your Folders:** Ensure your repository structure keeps the backend code and frontend code cleanly separated (e.g., a `/frontend` directory and a `/backend` directory).
* **Branch Protection:** In your GitHub repository settings, you can optionally enable branch protection for `main` to require status checks to pass before merging. This enforces that the code *must* compile successfully before your cron job can ever see it.
* **Keep Using Your Cron Job:** Because GitHub handles the compilation in the cloud, you don't need to change any configuration on your server. Your existing automated pull script remains 100% untouched and secure.