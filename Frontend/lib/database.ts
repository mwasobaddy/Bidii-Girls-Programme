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
  connectionLimit: process.env.NODE_ENV === 'production' ? 10 : 3, // Higher limit for production
  queueLimit: 0,
});

export async function executeQuery<T = any>(
  query: string,
  params: any[] = []
): Promise<T[]> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    return rows as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  } finally {
    if (connection) connection.release(); // Always release connection back to pool
  }
}

export async function executeInsert(
  query: string,
  params: any[] = []
): Promise<{ insertId: number; affectedRows: number }> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.execute(query, params);
    const insertResult = result as any;
    return {
      insertId: insertResult.insertId,
      affectedRows: insertResult.affectedRows
    };
  } catch (error) {
    console.error('Database insert error:', error);
    throw error;
  } finally {
    if (connection) connection.release(); // Always release connection back to pool
  }
}

export async function executeQuerySingle<T = any>(
  query: string,
  params: any[] = []
): Promise<T | null> {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, params);
    const results = rows as T[];
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Database query error:', error);
    throw new Error('Database query failed');
  } finally {
    if (connection) connection.release(); // Always release connection back to pool
  }
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  } finally {
    if (connection) connection.release();
  }
}

// Get pool status for monitoring (simplified)
export function getPoolStatus() {
  const connectionLimit = process.env.NODE_ENV === 'production' ? 10 : 3;
  return {
    connectionLimit,
    queueLimit: 0,
    timestamp: new Date().toISOString(),
  };
}

// Health check function for production monitoring
export async function healthCheck(): Promise<{ 
  status: 'healthy' | 'unhealthy', 
  details: any 
}> {
  try {
    const isConnected = await testConnection();
    const poolStatus = getPoolStatus();
    
    return {
      status: isConnected ? 'healthy' : 'unhealthy',
      details: {
        connected: isConnected,
        poolStatus,
        timestamp: new Date().toISOString(),
      }
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    };
  }
}

// Close all connections (useful for cleanup)
export async function closePool(): Promise<void> {
  await pool.end();
}

export default pool;
