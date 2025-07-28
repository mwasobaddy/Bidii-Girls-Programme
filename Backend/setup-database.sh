#!/bin/bash

# Database Setup Script for Bidii Girls Program
# This script helps set up the database using XAMPP's MySQL

echo "🚀 Bidii Girls Program - Database Setup"
echo "======================================="

# Check if XAMPP MySQL is running
if ! pgrep -f "mysqld" > /dev/null; then
    echo "❌ MySQL is not running. Please start XAMPP's MySQL service first."
    echo "   1. Open XAMPP Control Panel"
    echo "   2. Start MySQL service"
    echo "   3. Run this script again"
    exit 1
fi

echo "✅ MySQL service detected"

# Database configuration
DB_NAME="bidii_girls_program"
MYSQL_PATH="/Applications/XAMPP/xamppfiles/bin/mysql"
DB_USER="root"

# Check if mysql command exists
if [ ! -f "$MYSQL_PATH" ]; then
    echo "❌ XAMPP MySQL not found at $MYSQL_PATH"
    echo "   Please check your XAMPP installation path"
    exit 1
fi

echo "✅ XAMPP MySQL found"

# Function to execute SQL commands
execute_sql() {
    local sql_file="$1"
    local description="$2"
    
    echo "📝 $description..."
    
    if [ ! -f "$sql_file" ]; then
        echo "❌ File not found: $sql_file"
        return 1
    fi
    
    # Execute SQL file
    $MYSQL_PATH -u $DB_USER -p -e "USE $DB_NAME; SOURCE $sql_file;" 2>/dev/null
    
    if [ $? -eq 0 ]; then
        echo "✅ $description completed successfully"
    else
        echo "❌ $description failed"
        return 1
    fi
}

# Create database
echo "📝 Creating database '$DB_NAME'..."
$MYSQL_PATH -u $DB_USER -p -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully"
else
    echo "❌ Failed to create database. Please check your MySQL credentials."
    exit 1
fi

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATABASE_DIR="$SCRIPT_DIR/database"

# Import schema
execute_sql "$DATABASE_DIR/create-database.sql" "Importing database schema"

if [ $? -ne 0 ]; then
    echo "❌ Schema import failed. Exiting."
    exit 1
fi

# Import seed data
execute_sql "$DATABASE_DIR/seed-data.sql" "Importing seed data"

if [ $? -ne 0 ]; then
    echo "❌ Seed data import failed. Exiting."
    exit 1
fi

# Verify setup
echo "🔍 Verifying database setup..."
TABLE_COUNT=$($MYSQL_PATH -u $DB_USER -p -e "USE $DB_NAME; SHOW TABLES;" 2>/dev/null | wc -l)

if [ $TABLE_COUNT -gt 8 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "📊 Database Summary:"
    echo "   Database Name: $DB_NAME"
    echo "   Tables Created: $(($TABLE_COUNT - 1))"
    echo "   Host: localhost"
    echo "   Port: 3306"
    echo "   Username: $DB_USER"
    echo ""
    echo "🌐 Access phpMyAdmin at: http://localhost/phpmyadmin"
    echo ""
    echo "🎉 Your database is ready for development!"
else
    echo "❌ Database setup verification failed"
    echo "   Please check the setup manually in phpMyAdmin"
fi
