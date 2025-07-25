import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  try {
    console.log('🚀 Starting database initialization...');

    // Read and execute create database script
    const createScript = fs.readFileSync(
      path.join(process.cwd(), '../Backend/scripts/create-database.sql'), 
      'utf8'
    );
    
    console.log('📝 Creating database and tables...');
    await connection.execute(createScript);
    console.log('✅ Database and tables created successfully');

    // Read and execute seed data script
    const seedScript = fs.readFileSync(
      path.join(process.cwd(), '../Backend/scripts/seed-data.sql'), 
      'utf8'
    );
    
    console.log('🌱 Seeding database with initial data...');
    await connection.execute(seedScript);
    console.log('✅ Database seeded successfully');

    console.log('🎉 Database initialization completed!');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase().catch(console.error);
}

export default initializeDatabase;
