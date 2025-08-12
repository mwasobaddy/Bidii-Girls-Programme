#!/bin/bash

# Bidii Girls Programme - Production Deployment Script
# Run this script to prepare your application for production deployment

echo "🚀 Bidii Girls Programme - Production Deployment Preparation"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Prepare Backend for Production
echo -e "${YELLOW}📦 Step 1: Preparing Backend for Production...${NC}"

cd Backend || { print_error "Backend directory not found!"; exit 1; }

# Install production dependencies
print_status "Installing Composer dependencies for production..."
composer install --optimize-autoloader --no-dev

# Generate fresh keys for production
print_status "Preparing environment configuration..."
if [ -f .env.production ]; then
    cp .env.production .env.deploy
    print_status "Production environment template ready"
else
    print_warning "No .env.production file found - you'll need to create one manually"
fi

# Cache configuration for production
print_status "Caching Laravel configuration..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Create deployment package
print_status "Creating backend deployment package..."
cd ..
tar -czf backend-production.tar.gz Backend/ --exclude=Backend/node_modules --exclude=Backend/.git --exclude=Backend/tests
print_status "Backend package created: backend-production.tar.gz"

# Step 2: Prepare Frontend for Production
echo -e "${YELLOW}🎨 Step 2: Preparing Frontend for Production...${NC}"

cd Frontend || { print_error "Frontend directory not found!"; exit 1; }

# Install dependencies
print_status "Installing NPM dependencies..."
npm install

# Use production environment
if [ -f .env.production ]; then
    cp .env.production .env.local
    print_status "Production environment configured"
else
    print_warning "No .env.production file found - using current .env.local"
fi

# Build for production
print_status "Building Next.js application for production..."
npm run build

# For static deployment on Hostinger, create export version
print_status "Creating static export for Hostinger deployment..."
# Temporarily modify config for static export
cp next.config.mjs next.config.backup.mjs
cat > next.config.deploy.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  output: 'export',
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
}
export default nextConfig
EOF

# Build with export config
NEXT_CONFIG_FILE=next.config.deploy.mjs npm run build
FRONTEND_DIST="out"

# Restore original config
mv next.config.backup.mjs next.config.mjs

# Clean up deploy config
rm next.config.deploy.mjs

# Create deployment package
print_status "Creating frontend deployment package..."
cd ..
if [ -d "Frontend/$FRONTEND_DIST" ]; then
    tar -czf frontend-production.tar.gz Frontend/$FRONTEND_DIST/
    print_status "Frontend package created: frontend-production.tar.gz"
else
    print_error "Frontend build output not found in Frontend/$FRONTEND_DIST"
fi

# Step 3: Generate Deployment Instructions
echo -e "${YELLOW}📋 Step 3: Generating deployment instructions...${NC}"

cat > deployment-commands.txt << 'EOF'
# Hostinger SSH Deployment Commands
# Copy and paste these commands when connected to your Hostinger server

# 1. Navigate to your domain directory
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html

# 2. Create backup of current deployment (if exists)
if [ -d "api" ]; then
    mv api api-backup-$(date +%Y%m%d-%H%M%S)
fi

# 3. Create directory structure
mkdir -p api
mkdir -p frontend-static

# 4. Upload and extract backend (after uploading backend-production.tar.gz)
tar -xzf backend-production.tar.gz
mv Backend/* api/
rm -rf Backend backend-production.tar.gz

# 5. Configure backend environment
cd api
cp .env.production .env

# 6. Generate new keys
php artisan key:generate --force
php artisan jwt:secret --force

# 7. Set permissions
chmod 644 .env
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chown -R u367410712:u367410712 storage
chown -R u367410712:u367410712 bootstrap/cache

# 8. Install dependencies (if not done locally)
composer install --optimize-autoloader --no-dev

# 9. Run migrations and seed database
php artisan migrate --force
php artisan db:seed --force

# 10. Create storage link
php artisan storage:link

# 11. Cache for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 12. Go back to public_html and extract frontend
cd /home/u367410712/domains/bidiigirlsprogramme.org/public_html
tar -xzf frontend-production.tar.gz
mv Frontend/out/* frontend-static/ 2>/dev/null || mv Frontend/dist/* frontend-static/ 2>/dev/null
rm -rf Frontend frontend-production.tar.gz

# 13. Set frontend permissions
chmod -R 755 frontend-static/

# 14. Test deployment
curl -s https://bidiigirlsprogramme.org/api/health
EOF

print_status "Deployment commands saved to: deployment-commands.txt"

# Step 4: Create .htaccess files
echo -e "${YELLOW}🔧 Step 4: Creating Apache configuration files...${NC}"

# Main .htaccess for public_html
cat > htaccess-main.txt << 'EOF'
# Main .htaccess for bidiigirlsprogramme.org public_html root
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# API Routes - Forward /api requests to Laravel
RewriteRule ^api/(.*)$ api/public/index.php [L,QSA]

# Handle Laravel API routes
RewriteCond %{REQUEST_URI} ^/api/
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^api/(.*)$ api/public/index.php [L,QSA]

# Frontend routes
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ frontend-static/$1 [L,QSA]
EOF

# Frontend .htaccess
cat > htaccess-frontend.txt << 'EOF'
# .htaccess for frontend-static folder
RewriteEngine On

# Handle Next.js routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [L,QSA]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
EOF

print_status "Apache configuration files created:"
print_status "  - htaccess-main.txt (for public_html root)"
print_status "  - htaccess-frontend.txt (for frontend-static folder)"

# Summary
echo ""
echo -e "${GREEN}🎉 Production Deployment Preparation Complete!${NC}"
echo ""
echo "Files created:"
echo "  ✅ backend-production.tar.gz"
echo "  ✅ frontend-production.tar.gz"
echo "  ✅ deployment-commands.txt"
echo "  ✅ htaccess-main.txt"
echo "  ✅ htaccess-frontend.txt"
echo ""
echo "Next steps:"
echo "1. Upload backend-production.tar.gz to your Hostinger server"
echo "2. Upload frontend-production.tar.gz to your Hostinger server"
echo "3. SSH into your server and run commands from deployment-commands.txt"
echo "4. Copy htaccess-main.txt to .htaccess in your public_html root"
echo "5. Copy htaccess-frontend.txt to .htaccess in frontend-static folder"
echo ""
echo -e "${YELLOW}📖 For detailed instructions, see: PRODUCTION_DEPLOYMENT_GUIDE.md${NC}"
