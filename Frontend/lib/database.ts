import mysql from 'mysql2/promise';

interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

const dbConfig: DbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bidii_girls_program',
};

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  try {
    const [rows] = await pool.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

export async function executeQuerySingle<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  try {
    const [rows] = await pool.execute(query, params);
    const results = rows as T[];
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    await pool.execute('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Close all connections (useful for cleanup)
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
