'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/hooks/use-language';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* 404 Number */}
          <div className="text-6xl font-bold text-[#e51083] mb-4">
            404
          </div>
          
          {/* Error Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or the URL might be incorrect.
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

          {/* Navigation Buttons */}
          <div className="space-y-3">
            <Link href="/" className="block">
              <Button className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white">
                Go Home
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <Link href="/about">
                <Button variant="outline" size="sm" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  About Us
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" size="sm" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  Projects
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Link href="/campaigns">
                <Button variant="outline" size="sm" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  Campaigns
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="sm" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  Contact
                </Button>
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 dark:text-gray-400 pt-4 border-t">
            If you believe this is an error, please{' '}
            <Link href="/contact" className="text-[#e51083] hover:underline">
              contact us
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
