# Database Connection Management Guide

## The "Too Many Connections" Error

The `mysqli::real_connect(): (HY000/1040): Too many connections` error occurs when your application exceeds the MySQL server's maximum connection limit.

## What We've Fixed

### 1. Connection Pooling Improvements ✅
- **Development**: 3 connections max
- **Production**: 10 connections max
- **Connection Release**: All connections are now properly released back to the pool using `finally` blocks

### 2. Production-Ready Configuration ✅
```javascript
// Automatic scaling based on environment
connectionLimit: process.env.NODE_ENV === 'production' ? 10 : 3
```

### 3. Health Monitoring ✅
- Added `/api/health` endpoint to monitor database status
- Connection health checks before critical operations
- Pool status monitoring

## Production Deployment Checklist

### 1. Environment Variables
Copy `.env.production.example` to `.env.production` and configure:
```bash
NODE_ENV=production
DB_HOST=your-production-host
DB_USER=your-production-user
DB_PASSWORD=your-secure-password
DB_NAME=bidii_girls_program
```

### 2. MySQL Server Configuration
Add to your production MySQL server's `my.cnf`:
```ini
[mysqld]
max_connections = 200
wait_timeout = 28800
interactive_timeout = 28800
max_allowed_packet = 16M
```

### 3. Application Monitoring
Monitor the health endpoint:
```bash
curl https://your-domain.com/api/health
```

Response when healthy:
```json
{
  "service": "database",
  "status": "healthy",
  "details": {
    "connected": true,
    "poolStatus": {
      "connectionLimit": 10,
      "queueLimit": 0,
      "timestamp": "2025-08-07T..."
    },
    "timestamp": "2025-08-07T..."
  }
}
```

## Cloud Deployment Recommendations

### For Vercel/Netlify:
- Use managed databases (PlanetScale, AWS RDS, etc.)
- Enable connection pooling at the platform level
- Consider serverless-friendly databases

### For VPS/Dedicated Server:
- Set up database monitoring (htop, MySQL monitoring)
- Configure log rotation for MySQL
- Set up automated backups
- Consider read replicas for heavy traffic

## Preventing Connection Leaks

### ✅ What We Fixed:
1. **Explicit Connection Release**: Every database function now uses `finally` blocks
2. **Connection Pooling**: Reuses connections instead of creating new ones
3. **Error Handling**: Proper cleanup even when queries fail
4. **Environment-Based Limits**: Different limits for dev vs production

### 🚨 Warning Signs in Production:
- Slow database responses
- 503 errors from `/api/health`
- High server memory usage
- MySQL error logs showing connection limit reached

## Testing Before Production

1. **Load Testing**:
```bash
# Test with multiple concurrent requests
for i in {1..20}; do
  curl -s http://localhost:3000/api/test-db &
done
```

2. **Health Monitoring**:
```bash
# Monitor health during load
watch -n 1 'curl -s http://localhost:3000/api/health | jq'
```

## Recovery Steps if Issues Occur

1. **Immediate Fix**:
```sql
-- Show current connections
SHOW PROCESSLIST;

-- Kill hanging connections (if needed)
KILL CONNECTION <connection_id>;
```

2. **Application Restart**:
```bash
# For PM2
pm2 restart your-app

# For systemd
systemctl restart your-app
```

3. **Database Restart** (last resort):
```bash
systemctl restart mysql
```

## Best Practices

1. **Always use connection pooling** ✅ (Implemented)
2. **Set appropriate connection limits** ✅ (Implemented)
3. **Monitor database health** ✅ (Implemented)
4. **Use environment-specific configs** ✅ (Implemented)
5. **Implement proper error handling** ✅ (Implemented)
6. **Regular database maintenance** (Recommended)
7. **Load testing before deployment** (Recommended)

The changes we've made should prevent the "too many connections" error in production by properly managing the connection pool and ensuring connections are always released back to the pool.
