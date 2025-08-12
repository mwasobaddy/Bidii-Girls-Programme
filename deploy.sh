#!/bin/bash

# Bidii Girls Programme - Production Deployment Script
# This script helps deploy the Laravel backend and Next.js frontend to Hostinger

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Pre-deployment Checklist:${NC}"
echo "1. ✅ Update domain URLs in .env.production files"
echo "2. ✅ Configure database credentials" 
echo "3. ✅ Generate APP_KEY for Laravel"
echo "4. ✅ Set up SSL certificate on Hostinger"
echo "5. ✅ Configure Apache/Nginx on Hostinger"
echo ""

# Backend deployment steps
echo -e "${GREEN}🔧 Laravel Backend Deployment Steps:${NC}"
echo "1. Upload Backend/laravel-api/ to your domain's root directory"
echo "2. Point your domain to the 'public' folder"
echo "3. Run: composer install --optimize-autoloader --no-dev"
echo "4. Copy .env.production to .env and update database credentials"
echo "5. Run: php artisan key:generate"
echo "6. Run: php artisan migrate --force"
echo "7. Run: php artisan db:seed --force"
echo "8. Run: php artisan config:cache"
echo "9. Run: php artisan route:cache"
echo "10. Run: php artisan view:cache"
echo ""

# Frontend deployment steps  
echo -e "${GREEN}🌐 Next.js Frontend Deployment Steps:${NC}"
echo "Option A - Static Export (Recommended for Hostinger):"
echo "1. Update Frontend/.env.production with your domain"
echo "2. Run: npm run build"
echo "3. Run: npm run export"
echo "4. Upload the 'out' folder contents to a subdomain or subfolder"
echo ""
echo "Option B - Node.js Hosting (if Hostinger supports it):"
echo "1. Upload Frontend/ folder to your server"
echo "2. Run: npm install --production"
echo "3. Run: npm run build"
echo "4. Run: npm start"
echo ""

echo -e "${YELLOW}📁 Recommended Hostinger Folder Structure:${NC}"
echo "public_html/"
echo "├── api/ (Laravel backend - point domain here)"
echo "│   ├── app/"
echo "│   ├── public/ (this is your document root)"
echo "│   ├── .env"
echo "│   └── ..."
echo "└── frontend/ (Next.js static files or separate subdomain)"
echo "    ├── _next/"
echo "    ├── index.html"
echo "    └── ..."
echo ""

echo -e "${GREEN}✅ Deployment script ready!${NC}"
echo "Please follow the steps above to deploy to Hostinger."
