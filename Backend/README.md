# Backend

This folder contains all backend-related files for the project.

## Structure

### `/database`
Contains MySQL database scripts:
- `create-database.sql` - Database schema creation
- `seed-data.sql` - Initial data seeding

### `/api` 
Reserved for future API development

### `/config`
Reserved for database and server configuration files

## Database Setup with XAMPP

1. Start XAMPP and ensure MySQL is running
2. Open phpMyAdmin (usually at http://localhost/phpmyadmin)
3. Create a new database for the project
4. Import the SQL files from the `/database` folder:
   - First run `create-database.sql` to create the schema
   - Then run `seed-data.sql` to populate with initial data

## Development Notes

- This backend is designed to work with XAMPP's MySQL installation
- Future API endpoints will be added to the `/api` folder
- Database configuration will be stored in the `/config` folder
