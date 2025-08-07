#!/usr/bin/env node

// Database Connection Test Script
import { testConnection, executeQuery } from '../lib/database.js';

async function testDatabaseConnection() {
  console.log('🧪 Testing Database Connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing basic connection...');
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.log('❌ Basic connection failed');
      process.exit(1);
    }
    
    console.log('✅ Basic connection successful\n');

    // Test table access and count records
    console.log('2. Testing table access...');
    
    const tables = ['projects', 'blog_posts', 'team_members'];
    
    for (const table of tables) {
      try {
        const result = await executeQuery(`SELECT COUNT(*) as count FROM ${table}`);
        const count = result[0]?.count || 0;
        console.log(`   ✅ ${table}: ${count} records`);
      } catch (error) {
        console.log(`   ❌ ${table}: Error - ${error.message}`);
      }
    }

    console.log('\n3. Testing projects data...');
    
    // Test specific project data
    try {
      const projects = await executeQuery('SELECT id, title, status, location FROM projects LIMIT 3');
      
      if (projects.length > 0) {
        console.log('   ✅ Project data preview:');
        projects.forEach(project => {
          console.log(`      - ${project.title} (${project.status}) - ${project.location}`);
        });
      } else {
        console.log('   ⚠️  No projects found in database');
      }
    } catch (error) {
      console.log(`   ❌ Projects query error: ${error.message}`);
    }

    console.log('\n🎉 Database test completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Start your Next.js development server');
    console.log('   2. Visit http://localhost:3000/projects');
    console.log('   3. Check the API endpoint: http://localhost:3000/api/test-db');

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure XAMPP MySQL is running');
    console.log('   2. Check your .env.local file');
    console.log('   3. Verify database and tables exist');
    console.log('   4. Run the database setup script');
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection();
