# Production Deployment Guide: Reqworks DevQueue

This guide contains step-by-step instructions on how to secure, configure, and deploy the **Reqworks DevQueue** platform to industry-grade production environments.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Obtain Production Environment Credentials](#step-1-obtain-production-environment-credentials)
   - [MongoDB Atlas (Database)](#mongodb-atlas-database)
   - [Resend SMTP / Email Provider (Email Alerts & Auth)](#resend-smtp--email-provider-email-alerts--auth)
   - [Razorpay API Credentials (Billing)](#razorpay-api-credentials-billing)
   - [Telegram Bot (Admin Instant Alerts)](#telegram-bot-admin-instant-alerts)
3. [Step 2: Backend Environment Variables (`.env`)](#step-2-backend-environment-variables-env)
4. [Step 3: Frontend Deployment Configuration](#step-3-frontend-deployment-configuration)
   - [Vercel Deployment (Recommended)](#vercel-deployment-recommended-separate-hosting)
   - [Monolithic Deployment (Serving React from Node/Express)](#monolithic-deployment-unified-hosting)
5. [Step 4: Push to GitHub & Deploy](#step-4-push-to-github--deploy)
6. [Step 5: Database Seeding (Admin User Creation)](#step-5-database-seeding-admin-user-creation)

---

## 1. Prerequisites
- A **GitHub** account.
- A **Vercel** account (for frontend hosting).
- A **Render**, **Railway**, or **VPS** account (for backend hosting).

---

## Step 1: Obtain Production Environment Credentials

### MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in/sign up.
2. Click **Create a Cluster** (Shared Tier is free). Select your preferred cloud provider and region.
3. In **Database Access**, create a user with a secure password and set the role to `Atlas Admin` or `Read and write to any database`.
4. In **Network Access**, click **Add IP Address** and select **Allow Access from Anywhere** (`0.0.0.0/0`) since cloud platforms like Render use dynamic IPs.
5. Go to **Database -> Clusters -> Connect -> Drivers -> Node.js**.
6. Copy the connection string (looks like `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/?retryWrites=true&w=majority`). Replace `<password>` with your created database user's password.
7. Save this as `MONGODB_URI`.

### Resend SMTP / Email Provider (Email Alerts & Auth)
To send verification OTPs, password reset emails, and billing receipt alerts via SMTP, we recommend **Resend** or a similar service:
1. Go to [Resend](https://resend.com) and create an account.
2. Go to **Domains** -> **Add Domain** and verify your domain by adding the DNS TXT records to your domain provider (e.g. GoDaddy, Namecheap).
3. Go to **API Keys** -> **Create API Key**. Copy this key.
4. If using Resend's SMTP relay:
   - **Host**: `smtp.resend.com`
   - **Port**: `587`
   - **User**: `resend`
   - **Password**: *Your API Key*
5. Save these credentials for your `.env` variables.

### Razorpay API Credentials (Billing)
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch to **Live Mode** (or **Test Mode** for staging verification).
3. Go to **Account & Settings** -> **API Keys** -> **Generate Key**.
4. Download the key details:
   - `RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
5. *Note: If these variables are not set or left as placeholder, the system defaults to simulator mode so you can verify billing without charging cards.*

### Telegram Bot (Admin Instant Alerts)
To get instant alerts on your mobile phone when estimates are requested or stages change:
1. Open Telegram and search for `@BotFather`.
2. Type `/newbot` and follow instructions to give your bot a name and username.
3. BotFather will provide an **API Token** (e.g. `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`). Copy this as `TELEGRAM_BOT_TOKEN`.
4. Start a chat with your new bot and type any message.
5. Create a group containing you and your bot (if you want shared alerts), or chat with it privately.
6. Open your browser and go to: `https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/getUpdates`
7. Look for `"chat":{"id":xxxxxxxxx}` in the JSON response. That integer (e.g. `987654321`) is your `TELEGRAM_CHAT_ID`.
8. Save these as credentials.

---

## Step 2: Backend Environment Variables (`.env`)

Create a secure `.env` file on your backend hosting platform with the following values:

```ini
# Server configuration
PORT=5000
NODE_ENV=production

# URLs (Make sure to exclude trailing slashes)
CLIENT_URL=https://your-frontend-domain.vercel.app

# Database
MONGODB_URI=mongodb+srv://your_user:your_password@cluster.xxxx.mongodb.net/devqueue?retryWrites=true&w=majority

# JWT Configurations
JWT_SECRET=super_secure_unpredictable_secret_key_12345!
JWT_EXPIRE=7d

# SMTP Email Settings (e.g., Resend SMTP, Gmail, Sendgrid)
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_USER=resend
EMAIL_PASS=re_xxxx_xxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Reqworks Support

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxx

# Telegram Notification Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ
TELEGRAM_CHAT_ID=987654321
```

---

## Step 3: Frontend Deployment Configuration

Vite builds the frontend into a static bundle. Because all fetch calls are written as relative paths (e.g. `fetch('/api/auth/me')`), we must route `/api` to the backend.

### Vercel Deployment (Recommended: Separate Hosting)

1. Create a `vercel.json` file in the `frontend` root directory:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-backend-api.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   *Replace `https://your-backend-api.onrender.com` with your actual live backend endpoint.*
2. Deploy the `frontend` folder to Vercel. Vercel will build Vite and serve the single page application (SPA) with zero CORS complications.

---

### Monolithic Deployment (Unified Hosting)

If you prefer deploying a single service (serving the React static dist files from the Express server):
1. In `backend/server.js`, import `path` and insert the static serving middleware right above the global error handler:
   ```javascript
   const path = require('path');
   if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../frontend/dist')));
     app.get('*', (req, res) => {
       res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
     });
   }
   ```
2. Build the frontend locally or in a build pipeline using `npm run build` in the `frontend` folder.
3. Deploy the root repository to Render/Railway and run `npm install` followed by `npm start` from the `backend` folder.

---

## Step 4: Push to GitHub & Deploy

1. Initialize git and commit your files:
   ```powershell
   git init
   git add .
   git commit -m "chore: prepare codebase for production release"
   ```
2. Create a new repository on GitHub.
3. Link and push your branch:
   ```powershell
   git remote add origin https://github.com/your-username/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```
4. Connect the repository to your hosting service (e.g. Vercel for Frontend, Render for Backend) and input the environment variables from [Step 2](#step-2-backend-environment-variables-env).

---

## Step 5: Database Seeding (Admin User Creation)

Once the backend is deployed and connected to your MongoDB Atlas instance, you must seed the initial admin account.

1. Locate the file `backend/scripts/seedAdmin.js`.
2. Run this script in the production environment console, or temporarily execute it locally with your production `MONGODB_URI` environment variable set:
   ```powershell
   # Locally executing with production DB connection
   $env:MONGODB_URI="mongodb+srv://your_production_connection_string"
   node backend/scripts/seedAdmin.js
   ```
3. Once completed, your database will contain the production administrator account under:
   - **Email**: `Reqworks.tech@gmail.com`
   - **Password**: `@#$Req0046`
   *(You can change these defaults by setting `ADMIN_EMAIL` and `ADMIN_PASSWORD` in your production environment variables before running the script).*

You are now fully set up and ready to go!
