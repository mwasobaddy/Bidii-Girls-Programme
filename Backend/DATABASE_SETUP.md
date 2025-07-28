# Database Setup Guide for XAMPP

## Prerequisites
- XAMPP is installed on your MacBook
- MySQL service is running in XAMPP

## Step-by-Step Setup Instructions

### 1. Start XAMPP Services
```bash
# Open XAMPP Control Panel and start:
# - Apache (for phpMyAdmin)
# - MySQL (for database)
```

### 2. Access phpMyAdmin
- Open your browser and go to: `http://localhost/phpmyadmin`
- You should see the phpMyAdmin interface

### 3. Create Database
1. Click on "New" in the left sidebar
2. Enter database name: `bidii_girls_program`
3. Click "Create"

### 4. Import Database Schema
1. Select your newly created database (`bidii_girls_program`)
2. Click on the "Import" tab
3. Click "Choose File" and select: `Backend/database/create-database.sql`
4. Click "Go" to execute

### 5. Import Seed Data
1. Stay in the same database
2. Click "Import" tab again
3. Click "Choose File" and select: `Backend/database/seed-data.sql`
4. Click "Go" to execute

## Alternative: Command Line Setup

If you prefer using terminal commands:

```bash
# Navigate to your project directory
cd /Users/app/Desktop/ReactNative/bidiifinali

# Access MySQL via terminal (XAMPP's MySQL)
/Applications/XAMPP/xamppfiles/bin/mysql -u root -p

# Create database
CREATE DATABASE bidii_girls_program;
USE bidii_girls_program;

# Import schema
SOURCE Backend/database/create-database.sql;

# Import seed data  
SOURCE Backend/database/seed-data.sql;
```

## Database Configuration

### Connection Details for Development:
- **Host**: `localhost` or `127.0.0.1`
- **Port**: `3306` (default XAMPP MySQL port)
- **Database**: `bidii_girls_program`
- **Username**: `root` (default XAMPP)
- **Password**: _(empty by default, or set during XAMPP setup)_

### Tables Created:
- `users` - Admin authentication
- `blog_posts` - Blog content management
- `projects` - Project tracking and funding
- `team_members` - Team information
- `gallery_images` - Image gallery management
- `donations` - Donation tracking
- `contact_messages` - Contact form submissions
- `newsletter_subscribers` - Email newsletter management

## Verification Steps

1. **Check Tables**: In phpMyAdmin, you should see all 8 tables listed
2. **Check Data**: Click on each table to verify seed data was imported
3. **Test Connection**: Use your preferred database client to connect and query

## Troubleshooting

### Common Issues:
- **XAMPP MySQL won't start**: Check if port 3306 is already in use
- **Permission denied**: Ensure XAMPP has proper permissions
- **Import fails**: Check SQL syntax and file encoding (should be UTF-8)

### Useful Commands:
```sql
-- Check database exists
SHOW DATABASES;

-- Check tables in database
USE bidii_girls_program;
SHOW TABLES;

-- Check table structure
DESCRIBE table_name;

-- Count records in tables
SELECT COUNT(*) FROM blog_posts;
SELECT COUNT(*) FROM projects;
```

## Next Steps

After successful setup:
1. Configure your frontend to connect to this database
2. Set up environment variables for database connection
3. Test API connections (when backend API is developed)

---
**Note**: This database is set up for development purposes. For production, ensure proper security measures including strong passwords and user permissions.
