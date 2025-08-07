import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/database';

export async function GET() {
  try {
    const health = await healthCheck();
    
    return NextResponse.json({
      service: 'database',
      ...health,
    }, {
      status: health.status === 'healthy' ? 200 : 503
    });
  } catch (error) {
    return NextResponse.json({
      service: 'database',
      status: 'unhealthy',
      details: {
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }, {
      status: 503
    });
  }
}
