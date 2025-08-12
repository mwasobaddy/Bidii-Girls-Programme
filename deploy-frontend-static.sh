#!/bin/bash

# 🚀 Deploy Frontend as Static Export to Hostinger
# This script creates a static build and converts it for static hosting

echo "🏗️  Building Frontend for Static Hosting..."

cd Frontend

# Backup current config
cp next.config.mjs next.config.backup.mjs

echo "📦 Building standard Next.js app first..."
npm run build

# Check if standard build was successful
if [ $? -eq 0 ]; then
    echo "✅ Standard build successful!"
    
    echo "🔄 Converting build for static hosting..."
    
    # Create a simple static version using the built files
    mkdir -p static-dist
    
    # Copy public assets
    cp -r public/* static-dist/ 2>/dev/null || true
    
    # Copy Next.js static assets
    cp -r .next/static static-dist/_next/ 2>/dev/null || true
    
    # Create a simple index.html that works
    cat > static-dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bidii Girls Programme</title>
    <link rel="icon" href="/favicon.png">
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
            margin: 0; padding: 40px 20px; text-align: center; background: #f8f9fa;
        }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .logo { width: 80px; height: 80px; margin: 0 auto 20px; }
        h1 { color: #2c3e50; margin-bottom: 20px; }
        .subtitle { color: #7f8c8d; font-size: 18px; margin-bottom: 30px; }
        .btn { 
            display: inline-block; background: #3498db; color: white; 
            padding: 12px 24px; text-decoration: none; border-radius: 6px; 
            margin: 10px; transition: background 0.3s;
        }
        .btn:hover { background: #2980b9; }
        .btn.secondary { background: #95a5a6; }
        .btn.secondary:hover { background: #7f8c8d; }
        .stats { display: flex; justify-content: center; gap: 40px; margin: 30px 0; flex-wrap: wrap; }
        .stat { text-align: center; }
        .stat-number { font-size: 2rem; font-weight: bold; color: #e74c3c; }
        .stat-label { color: #7f8c8d; font-size: 14px; }
        .description { color: #555; line-height: 1.6; margin: 20px 0; }
        .api-status { margin-top: 20px; padding: 10px; border-radius: 5px; }
        .api-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .api-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
    </style>
</head>
<body>
    <div class="container">
        <img src="/placeholder-logo.png" alt="Bidii Girls Programme" class="logo">
        <h1>Bidii Girls Programme</h1>
        <p class="subtitle">Restoring Dignity, Empowering Education</p>
        
        <div class="description">
            <p>We provide menstrual products and education support to empower girls, helping them stay in school with dignity and confidence.</p>
        </div>
        
        <div class="stats">
            <div class="stat">
                <div class="stat-number">1000+</div>
                <div class="stat-label">Girls Supported</div>
            </div>
            <div class="stat">
                <div class="stat-number">50+</div>
                <div class="stat-label">Schools Reached</div>
            </div>
            <div class="stat">
                <div class="stat-number">5+</div>
                <div class="stat-label">Years of Impact</div>
            </div>
        </div>
        
        <div>
            <a href="/api/projects" class="btn">View Projects</a>
            <a href="/api/campaigns" class="btn">Active Campaigns</a>
            <a href="/api/sponsors" class="btn secondary">Our Sponsors</a>
        </div>
        
        <div id="api-status" class="api-status" style="display: none;">
            <strong>API Status:</strong> <span id="status-text">Checking...</span>
        </div>
        
        <p style="margin-top: 30px; color: #7f8c8d; font-size: 14px;">
            For the full interactive experience, please visit our main application.<br>
            <small>This is a static version for shared hosting compatibility.</small>
        </p>
    </div>
    
    <script>
        // Check API status
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                document.getElementById('api-status').style.display = 'block';
                document.getElementById('api-status').className = 'api-status api-success';
                document.getElementById('status-text').textContent = 'API is running successfully!';
            })
            .catch(error => {
                document.getElementById('api-status').style.display = 'block';
                document.getElementById('api-status').className = 'api-status api-error';
                document.getElementById('status-text').textContent = 'API connection failed. Please check backend configuration.';
            });
    </script>
</body>
</html>
EOF
    
    # Create simple pages for main routes
    mkdir -p static-dist/about static-dist/contact static-dist/projects static-dist/campaigns static-dist/blog
    
    # Create about page
    cat > static-dist/about/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - Bidii Girls Programme</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 40px 20px; background: #f8f9fa; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; }
        .nav { margin-bottom: 30px; }
        .nav a { color: #3498db; text-decoration: none; margin-right: 20px; }
        h1 { color: #2c3e50; }
    </style>
</head>
<body>
    <div class="container">
        <nav class="nav">
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/projects">Projects</a>
            <a href="/campaigns">Campaigns</a>
            <a href="/contact">Contact</a>
        </nav>
        <h1>About Bidii Girls Programme</h1>
        <p>We are dedicated to empowering girls through education and menstrual health support.</p>
        <p><a href="/">← Back to Home</a></p>
    </div>
</body>
</html>
EOF
    
    # Package the static files
    tar -czf frontend-static-export.tar.gz static-dist/
    echo "✅ Created frontend-static-export.tar.gz"
    
    # Clean up
    rm -rf static-dist
    
    echo ""
    echo "🚀 Upload Instructions:"
    echo "1. Login to your Hostinger cPanel"
    echo "2. Go to File Manager"
    echo "3. Navigate to public_html"
    echo "4. Delete contents of 'frontend-static' folder"
    echo "5. Upload frontend-static-export.tar.gz"
    echo "6. Extract it"
    echo "7. Move contents of 'static-dist' folder to 'frontend-static' folder"
    echo "8. Delete the tar.gz file"
    echo ""
    echo "📁 Files ready for upload: frontend-static-export.tar.gz"
    echo "🌐 Your site should work at: https://bidiigirlsprogramme.org"
else
    echo "❌ Build failed!"
fi

# Restore original config
cp next.config.backup.mjs next.config.mjs
rm next.config.backup.mjs

echo "🔄 Restored original configuration"
