'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* Error Icon */}
          <div className="text-6xl text-red-500 mb-4">
            ⚠️
          </div>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Something went wrong!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
            </p>
          </div>

          {/* Bidii Girls Programme Branding */}
          <div className="py-4">
            <div className="w-16 h-16 mx-auto bg-[#e51083] rounded-full flex items-center justify-center mb-4">
              <span className="text-white font-bold text-xl">BG</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Bidii Girls Programme
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Empowering Girls Through Education
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={reset}
              className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white"
            >
              Try Again
            </Button>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                Go Home
              </Button>
            </Link>
          </div>

          {/* Error Details (in development) */}
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left text-xs text-gray-500 dark:text-gray-400 pt-4 border-t">
              <summary className="cursor-pointer">Error Details</summary>
              <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
                {error.message}
              </pre>
            </details>
          )}

          {/* Help Text */}
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-[#e51083] hover:underline">
              contact our support team
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
