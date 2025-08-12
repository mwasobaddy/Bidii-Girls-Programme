# 🚀 Bidii Girls Programme - Complete Hostinger Production Deployment Guide

## 📋 Overview

This guide will walk you through deploying your **Laravel Backend** and **Next.js Frontend** to Hostinger hosting step by step.

### 🏗️ Project Structure
```
Your Project:
├── Backend/ (Laravel 11 API)
├── Frontend/ (Next.js App)
└── This deployment guide
```

---

## 🔧 Phase 1: Pre-Deployment Preparation

### Step 1.1: Create Production Environment Files

#### Backend Production Environment
Create `.env.production` in your Backend folder:

```bash
# Production Environment for Hostinger
APP_NAME="Bidii Girls Programme"
APP_ENV=production
APP_KEY=base64:GENERATE_NEW_KEY_IN_PRODUCTION
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://bidiigirlsprogramme.org

# Database Configuration (Hostinger MySQL)
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=u367410712_bidii_girls
DB_USERNAME=u367410712_bidii_girls
DB_PASSWORD=@Hiikey682311!

# Cache and Session (Production)
CACHE_STORE=file
SESSION_DRIVER=file
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=.bidiigirlsprogramme.org

# Queue
QUEUE_CONNECTION=database

# Mail Configuration (Update with real SMTP)
MAIL_MAILER=smtp
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=587
MAIL_USERNAME=noreply@bidiigirlsprogramme.org
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@bidiigirlsprogramme.org"
MAIL_FROM_NAME="${APP_NAME}"

# JWT Configuration
JWT_SECRET=GENERATE_NEW_JWT_SECRET_IN_PRODUCTION
JWT_ALGO=HS256
JWT_TTL=60

# Logging
LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

# CORS Configuration
CORS_ALLOWED_ORIGINS="https://bidiigirlsprogramme.org,https://www.bidiigirlsprogramme.org"
```

#### Frontend Production Environment
Create `.env.production` in your Frontend folder:

```bash
# Production API Configuration
NEXT_PUBLIC_API_BASE_URL=https://bidiigirlsprogramme.org/api
NEXT_PUBLIC_BACKEND_URL=https://bidiigirlsprogramme.org

# Production Settings
NODE_ENV=production
NEXT_PUBLIC_APP_NAME="Bidii Girls Programme"
NEXT_PUBLIC_APP_URL=https://bidiigirlsprogramme.org
```

### Step 1.2: Optimize Code for Production

#### Backend Optimizations
```bash
# In your local Backend folder, run:
cd Backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Frontend Optimizations  
```bash
# In your local Frontend folder, run:
cd Frontend
npm install
npm run build
```

**Note:** The application uses standard Next.js build (not static export) to support dynamic routes and API integration.

---

## 🌐 Phase 2: Hostinger Server Setup

### Step 2.1: Access Your Hostinger Server

#### Via SSH (Recommended)
```bash
# Replace with your actual SSH details
ssh ssh -p 65002 u367410712@82.29.157.59
# Or if Hostinger provides a specific SSH endpoint:
ssh u367410712@srv100.your-hostinger-server.com
```

#### Via cPanel File Manager (Alternative)
1. Login to Hostinger cPanel
2. Go to "File Manager"
3. Navigate to `public_html`

### Step 2.2: Create Directory Structure

```bash
# Once connected via SSH, create the following structure:
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html

# Create directories
mkdir -p api
mkdir -p frontend-static
mkdir -p backups

# Set proper permissions
chmod 755 api
chmod 755 frontend-static
```

---

## 📂 Phase 3: Deploy Laravel Backend

### Step 3.1: Upload Backend Files

#### Via SSH (Recommended Method)
```bash
# From your local machine, compress and upload Backend
cd /path/to/your/project
tar -czf backend.tar.gz Backend/
scp backend.tar.gz ssh -p 65002 u367410712@82.29.157.59:/home/u367410712/domains/bidiigirlsprogramme.org/public_html/

# On server, extract to api folder
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
tar -xzf backend.tar.gz
mv Backend/* api/
rm -rf Backend backend.tar.gz
```

#### Via cPanel File Manager (Alternative)
1. Compress your `Backend` folder locally as `backend.zip`
2. Upload via cPanel File Manager to `public_html`
3. Extract and move contents to `api` folder

### Step 3.2: Configure Backend Environment

```bash
# On server, navigate to api folder
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html/api

# Copy production environment
cp .env.production .env

# Generate new application key
php artisan key:generate --force

# Generate new JWT secret
php artisan jwt:secret --force

# Set proper permissions
chmod 644 .env
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R u367410712:u367410712 storage
chown -R u367410712:u367410712 bootstrap/cache
```

### Step 3.3: Install Dependencies and Setup Database

```bash
# Install Composer dependencies (if not done locally)
composer install --optimize-autoloader --no-dev

# Run database migrations
php artisan migrate --force

# Seed database with initial data
php artisan db:seed --force

# Create storage link for file uploads
php artisan storage:link

# Cache configuration for production performance
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Step 3.4: Configure Apache for Laravel

Create `.htaccess` in your domain's public_html root:

```apache
# /home/u367410712/domains/bidiigirlsprogramme.org/public_html/.htaccess

# API Routes - Forward /api requests to Laravel
RewriteEngine On

# Handle API requests
RewriteRule ^api/(.*)$ api/public/index.php [L,QSA]

# Handle Laravel routes (for direct API access)
RewriteCond %{REQUEST_URI} ^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/public/index.php [L,QSA]

# Frontend routes (will be handled later)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ frontend-static/$1 [L,QSA]
```

---

## 🎨 Phase 4: Deploy Next.js Frontend

### Step 4.1: Build Frontend for Production

```bash
# On your local machine, in the Frontend folder:
cd Frontend

# Update environment for production
cp .env.production .env.local

# Build the application
npm run build

# The build output will be in .next folder
```

**Note:** This creates a production-optimized build with server-side rendering capabilities for dynamic routes.

### Step 4.2: Upload Frontend Files

#### For Hostinger (Static Hosting)
Since Hostinger primarily supports static hosting, we'll need to deploy the frontend as static files. 

```bash
# Build Frontend for Production Deployment
cd Frontend

# Option 1: For Static Hosting (Hostinger shared hosting)
# Note: This approach may have limitations with dynamic features

# Create a temporary static export config
cat > next.config.static.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
EOF

# Note: Static export will not work with the current setup due to dynamic routes with client components
# Recommended: Use Node.js hosting or upload the standard build

# Option 2: Standard Next.js Build (Recommended)
# Build the application normally
npm run build

# Package the production build
tar -czf frontend-production.tar.gz .next/ public/ package.json next.config.mjs

# Upload to server
# Option A: Using SCP (if SSH works)
scp frontend-production.tar.gz u367410712@82.29.157.59:/home/u367410712/domains/bidiigirlsprogramme.org/public_html/

# Option B: Using cPanel File Manager (Recommended if SSH fails)
# 1. Login to your Hostinger cPanel
# 2. Go to "File Manager"
# 3. Navigate to public_html
# 4. Upload frontend-production.tar.gz
# 5. Right-click and extract
# 6. Move the extracted files (.next, public, package.json, next.config.mjs) to the frontend-static folder

# On server, extract (if using SSH)
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
tar -xzf frontend-production.tar.gz

# Move extracted files to frontend-static directory
mv .next public package.json next.config.mjs frontend-static/
rm frontend-production.tar.gz

# Expected directory structure after extraction:
# public_html/
# ├── api/ (Laravel backend)
# ├── frontend-static/ (Next.js frontend)
# │   ├── .next/
# │   ├── public/
# │   ├── package.json
# │   └── next.config.mjs
# └── .htaccess (root routing config)
```

#### Alternative: Node.js Hosting (If Available)
If Hostinger supports Node.js applications:

```bash
# Upload the entire Frontend folder
scp -r Frontend/ ssh -p 65002 u367410712@82.29.157.59:/home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-app/

# On server
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-app
npm install --production
npm run build
npm start
```

#### Configure Frontend Routing
Since Next.js builds aren't designed for static hosting, we need special configuration:

Create `.htaccess` in the frontend-static folder:

```apache
# /home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-static/.htaccess

RewriteEngine On

# Serve the main page
DirectoryIndex index.html

# Handle Next.js static files
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} ^/_next/
RewriteRule ^(.*)$ /_next/$1 [L]

# Handle public assets
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/_next/
RewriteRule ^(.*)$ /public/$1 [L]

# For all other requests, serve the main page (SPA routing)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/_next/
RewriteCond %{REQUEST_URI} !^/public/
RewriteRule ^(.*)$ /index.html [L]
```

**Important:** Create an index.html file in frontend-static folder:

```bash
# On server, create a basic index.html that loads the Next.js app
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-static
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bidii Girls Programme</title>
    <script>
        // Redirect to the actual Next.js page
        window.location.href = './_next/server/app/page.html';
    </script>
</head>
<body>
    <div id="root">Loading...</div>
    <noscript>
        <meta http-equiv="refresh" content="0; url=./_next/server/app/page.html">
    </noscript>
</body>
</html>
EOF
```

---

## 🔧 Phase 5: Final Configuration

### Step 5.1: Test API Endpoints

```bash
# Test from server
curl -s https://bidiigirlsprogramme.org/api/health

# Test specific endpoints
curl -s https://bidiigirlsprogramme.org/api/sponsors
curl -s https://bidiigirlsprogramme.org/api/projects
curl -s https://bidiigirlsprogramme.org/api/campaigns
```

### Step 5.2: Configure SSL Certificate

1. **Via Hostinger cPanel:**
   - Go to "SSL/TLS"
   - Enable "Force HTTPS Redirect"
   - Install Let's Encrypt certificate for your domain

2. **Update .htaccess for HTTPS:**
```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Step 5.3: Set Up File Permissions

```bash
# Set proper ownership and permissions
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html

# API permissions
chmod -R 755 api/
chmod -R 644 api/config/
chmod 600 api/.env
chmod -R 775 api/storage/
chmod -R 775 api/bootstrap/cache/

# Frontend permissions
chmod -R 755 frontend-static/
```

---

## 🔍 Phase 6: Testing and Verification

### Step 6.1: Comprehensive Testing Checklist

#### Backend API Tests
```bash
# Test all main endpoints
curl https://bidiigirlsprogramme.org/api/health
curl https://bidiigirlsprogramme.org/api/sponsors
curl https://bidiigirlsprogramme.org/api/projects
curl https://bidiigirlsprogramme.org/api/campaigns
curl https://bidiigirlsprogramme.org/api/blog
curl https://bidiigirlsprogramme.org/api/team
```

#### Frontend Tests
1. Visit `https://bidiigirlsprogramme.org`
2. Check all pages load correctly
3. Verify API calls work from frontend
4. Test contact form functionality
5. Verify admin dashboard access

### Step 6.2: Monitor Logs

```bash
# Check Laravel logs
tail -f /home/u367410712/domains/bidiigirlsprogramme.org/public_html/api/storage/logs/laravel.log

# Check Apache error logs (location may vary)
tail -f /var/log/apache2/error.log
```

---

## 🚨 Phase 7: Troubleshooting Common Issues

### Issue 1: 500 Internal Server Error
```bash
# Check Laravel logs
cat api/storage/logs/laravel.log

# Clear cache
cd api
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

### Issue 2: Database Connection Failed
```bash
# Test database connection
cd api
php artisan tinker
# In tinker: DB::connection()->getPdo();
```

### Issue 3: File Permission Errors
```bash
# Fix storage permissions
chmod -R 775 api/storage/
chown -R u367410712:u367410712 api/storage/
```

### Issue 4: Frontend 403 Forbidden Error

**Problem:** Getting `403 Forbidden` when accessing the main domain.

**Root Cause:** Next.js standard builds aren't designed for static hosting without a Node.js server.

**Solutions:**

#### Option A: Quick Fix - Create Static Index Page
```bash
# On server, create a basic landing page
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-static
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bidii Girls Programme</title>
    <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
        .container { max-width: 600px; margin: 0 auto; }
        .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome to Bidii Girls Programme</h1>
        <p>Empowering girls through education and support.</p>
        <a href="/api/health" class="btn">Check API Status</a>
        <p><small>Frontend is being configured for static hosting.</small></p>
    </div>
</body>
</html>
EOF

# Set proper permissions
chmod 644 index.html
```

#### Option B: Create True Static Export (Recommended)
```bash
# On your local machine, create a proper static export
cd Frontend

# Create static export config
cat > next.config.export.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable features that don't work with static export
  experimental: {
    appDir: true,
  }
}

export default nextConfig
EOF

# Build static export (this will create 'out' folder)
cp next.config.mjs next.config.backup.mjs
cp next.config.export.mjs next.config.mjs
npm run build

# Package the static export
tar -czf frontend-static-export.tar.gz out/

# Upload and extract to frontend-static folder
scp frontend-static-export.tar.gz u367410712@82.29.157.59:/home/u367410712/domains/bidiigirlsprogramme.org/public_html/

# On server:
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
rm -rf frontend-static/*
tar -xzf frontend-static-export.tar.gz
mv out/* frontend-static/
rm frontend-static-export.tar.gz

# Restore original config locally
cp next.config.backup.mjs next.config.mjs
```

#### Option C: Fix .htaccess and Permissions
```bash
# Ensure proper permissions
chmod -R 755 /home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-static/
chmod -R 644 /home/u367410712/domains/bidiigirlsprogramme.org/public_html/frontend-static/*

# Update main .htaccess
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
cat > .htaccess << 'EOF'
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Routes
RewriteRule ^api/(.*)$ api/public/index.php [L,QSA]

# Frontend routes - serve index.html for all non-API requests
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ frontend-static/index.html [L,QSA]
EOF
```

### Issue 5: CORS Errors
1. Verify `config/cors.php` includes production domains
2. Clear config cache: `php artisan config:clear`

---

## 🔄 Phase 8: Future Updates

### Quick Update Process
```bash
# 1. Update local code
# 2. Test locally
# 3. Build production assets

# 4. Upload to server
scp -r Backend/ ssh -p 65002 u367410712@82.29.157.59:/home/u367410712/domains/bidiigirlsprogramme.org/public_html/api-new/

# 5. On server, backup current and switch
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
mv api api-backup-$(date +%Y%m%d)
mv api-new api

# 6. Update environment and cache
cd api
cp ../api-backup-*/env .env
php artisan config:clear
php artisan migrate --force
php artisan config:cache
```

---

## 📞 Support Contacts

### Hostinger Support
- **Support Portal:** [Hostinger Help Center](https://support.hostinger.com)
- **Live Chat:** Available 24/7 in cPanel
- **Email:** Available through your Hostinger account

### Emergency Rollback
```bash
# If something goes wrong, quickly rollback:
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
mv api api-broken
mv api-backup-YYYYMMDD api
```

---

## ✅ Final Deployment Checklist

- [ ] Backend uploaded to `/api` folder
- [ ] Environment file configured with production settings
- [ ] Database migrations run successfully
- [ ] Storage permissions set correctly
- [ ] Frontend built and uploaded to `/frontend-static`
- [ ] Apache .htaccess files configured
- [ ] SSL certificate installed and HTTPS enforced
- [ ] All API endpoints tested and working
- [ ] Frontend loads and connects to API
- [ ] Contact form functional
- [ ] Admin dashboard accessible
- [ ] Error monitoring set up

---

🎉 **Congratulations!** Your Bidii Girls Programme website should now be live at https://bidiigirlsprogramme.org

Remember to regularly backup your database and keep your dependencies updated for security.
