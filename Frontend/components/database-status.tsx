'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DatabaseStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/database/test');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      setStatus({
        success: false,
        message: 'Failed to connect to API',
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Database Connection</CardTitle>
        <CardDescription>
          Test your XAMPP MySQL database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </Button>
        
        {status && (
          <div className="space-y-2">
            <Badge variant={status.success ? 'default' : 'destructive'}>
              {status.success ? 'Connected' : 'Failed'}
            </Badge>
            <p className="text-sm text-muted-foreground">
              {status.message}
            </p>
            {status.timestamp && (
              <p className="text-xs text-muted-foreground">
                Tested at: {new Date(status.timestamp).toLocaleString()}
              </p>
            )}
            {status.error && (
              <p className="text-xs text-red-500">
                Error: {status.error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
