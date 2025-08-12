# 🚀 Bidii Girls Programme - Hostinger Production Deployment Guide

## 📋 Prerequisites

Before deploying to Hostinger, ensure you have:
- ✅ Hostinger hosting account with PHP 8.1+ support
- ✅ Domain name configured
- ✅ SSL certificate enabled
- ✅ Access to cPanel or file manager
- ✅ MySQL database created

## 🗂️ Project Structure

Your project consists of:
- **Backend**: Laravel 11 API (`Backend/laravel-api/`)
- **Frontend**: Next.js application (`Frontend/`)

## 🔧 Step 1: Deploy Laravel Backend

### 1.1 Upload Backend Files
1. Compress the `Backend/laravel-api/` folder
2. Upload to your Hostinger account
3. Extract to your domain's root directory (usually `public_html`)

### 1.2 Configure Document Root
1. In cPanel, go to "Subdomains" or "Addon Domains"
2. Point your domain to the `public` folder inside laravel-api
   - Example: `public_html/laravel-api/public`

### 1.3 Environment Configuration
1. Copy `.env.production` to `.env` in the laravel-api root
2. Update these values in `.env`:
   ```env
   APP_URL=https://yourdomain.com
   DB_HOST=localhost
   DB_DATABASE=your_db_name
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_db_password
   ```

### 1.4 Install Dependencies & Setup
Run these commands in your hosting terminal (if available) or contact support:
```bash
cd laravel-api
composer install --optimize-autoloader --no-dev
php artisan key:generate
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
```

### 1.5 Set Permissions
Ensure these folders are writable (755 or 775):
- `storage/`
- `storage/logs/`
- `storage/framework/`
- `bootstrap/cache/`

## 🌐 Step 2: Deploy Next.js Frontend

### Option A: Static Export (Recommended)

1. **Update Environment Variables**
   ```bash
   cd Frontend
   cp .env.production .env.local
   ```
   Update `.env.local` with your actual domain:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://yourdomain.com/api
   NEXT_PUBLIC_BACKEND_URL=https://yourdomain.com
   ```

2. **Build and Export**
   ```bash
   npm install
   npm run build
   ```

3. **Upload Static Files**
   - The build creates an `out` folder
   - Upload contents of `out/` to a subdomain or subfolder
   - Example: `frontend.yourdomain.com` or `yourdomain.com/app`

### Option B: Node.js Hosting (If Supported)

1. Upload the entire `Frontend/` folder
2. Install dependencies: `npm install --production`
3. Build: `npm run build`
4. Start: `npm start`

## 🔗 Step 3: Configure CORS

Update `Backend/laravel-api/config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['https://yourdomain.com', 'https://frontend.yourdomain.com'],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'allowed_methods' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

## 📁 Recommended Hostinger Folder Structure

```
public_html/
├── laravel-api/
│   ├── app/
│   ├── public/ ← Domain points here
│   ├── .env
│   └── ...
└── frontend/ (or use subdomain)
    ├── _next/
    ├── index.html
    └── ...
```

## 🔧 Step 4: Configure Apache/Nginx

### Apache (.htaccess in public folder)
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Angular and Vue history mode:
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^.*$ /index.php [L]
</IfModule>
```

## 🗄️ Step 5: Database Setup

1. Create MySQL database in cPanel
2. Import the database structure:
   ```sql
   -- Run migrations on production
   php artisan migrate --force
   php artisan db:seed --force
   ```

## 🔒 Step 6: Security Configuration

1. **File Permissions**: Set proper permissions (644 for files, 755 for folders)
2. **Environment Variables**: Never commit `.env` files
3. **SSL Certificate**: Ensure HTTPS is enabled
4. **Directory Listing**: Disable directory browsing

## 📊 Step 7: Testing Production Deployment

1. **Backend API Test**:
   ```bash
   curl https://yourdomain.com/api/health
   ```

2. **Frontend Test**:
   Visit your frontend URL and check:
   - Pages load correctly
   - API calls work
   - Images display properly

3. **Database Test**:
   ```bash
   curl https://yourdomain.com/api/dashboard/stats
   ```

## 🚨 Troubleshooting

### Common Issues:

1. **500 Internal Server Error**
   - Check Laravel logs: `storage/logs/laravel.log`
   - Verify file permissions
   - Check `.env` configuration

2. **CORS Errors**
   - Update `config/cors.php`
   - Clear config cache: `php artisan config:clear`

3. **Database Connection Issues**
   - Verify database credentials in `.env`
   - Check if database exists
   - Test connection: `php artisan migrate:status`

4. **Static Assets Not Loading**
   - Check `public/storage` symlink
   - Verify asset paths in Next.js

## 📝 Post-Deployment Checklist

- [ ] Backend API responding (`/api/health`)
- [ ] Frontend loading correctly
- [ ] Database migrations completed
- [ ] SSL certificate working
- [ ] CORS configured properly
- [ ] File permissions set correctly
- [ ] Admin dashboard accessible
- [ ] Image uploads working
- [ ] Contact form functional

## 🔄 Future Updates

To update your production site:

1. Make changes locally
2. Test thoroughly
3. Commit and push to your repository
4. Download/pull changes on Hostinger
5. Run: `php artisan config:clear && php artisan cache:clear`
6. Rebuild frontend if needed

## 📞 Support

If you encounter issues:
1. Check Hostinger documentation
2. Contact Hostinger support for server-specific issues
3. Check Laravel and Next.js documentation
4. Review error logs in `storage/logs/`

---

🎉 **Congratulations!** Your Bidii Girls Programme website should now be live on Hostinger!
