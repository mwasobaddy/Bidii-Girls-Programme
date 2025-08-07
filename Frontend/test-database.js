const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bidii_girls_program',
};

async function testDatabase() {
  console.log('🧪 Testing Database Connection...\n');
  console.log('Config:', {
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    database: dbConfig.database,
    password: dbConfig.password ? '***' : '(empty)'
  });
  console.log('');

  let connection;
  
  try {
    // Create connection
    console.log('1. Creating connection...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connection created successfully\n');

    // Test basic query
    console.log('2. Testing basic query...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Basic query successful\n');

    // Test table access
    console.log('3. Testing table access...');
    const tables = ['projects', 'blog_posts', 'team_members'];
    
    for (const table of tables) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result[0]?.count || 0;
        console.log(`   ✅ ${table}: ${count} records`);
      } catch (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      }
    }

    // Show sample project data
    console.log('\n4. Sample project data:');
    try {
      const [projects] = await connection.execute('SELECT id, title, status, location FROM projects LIMIT 3');
      
      if (projects.length > 0) {
        projects.forEach(project => {
          console.log(`   - ID: ${project.id}, Title: ${project.title}, Status: ${project.status}`);
        });
      } else {
        console.log('   ⚠️  No projects found');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }

    console.log('\n🎉 Database test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error('Error:', error.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure XAMPP MySQL service is running');
    console.log('2. Check if database "bidii_girls_program" exists');
    console.log('3. Verify your .env.local file configuration');
    console.log('4. Run the database setup script in Backend folder');
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

testDatabase();
