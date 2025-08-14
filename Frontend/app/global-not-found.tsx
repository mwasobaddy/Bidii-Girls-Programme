'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg mx-auto text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          {/* 404 Number with Animation */}
          <div className="text-8xl font-bold text-[#e51083] mb-4 animate-pulse">
            404
          </div>
          
          {/* Error Message */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              The page you're looking for seems to have wandered off. It might have been moved, 
              deleted, or you might have typed the URL incorrectly.
            </p>
          </div>

          {/* Bidii Girls Programme Branding */}
          <div className="py-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#e51083] to-[#c50e73] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">BG</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Bidii Girls Programme
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Empowering Girls Through Education
            </p>
          </div>

          {/* Search Suggestions */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Looking for something specific?
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-left">
                <div className="font-medium text-gray-700 dark:text-gray-300">Popular Pages:</div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• About Us</li>
                  <li>• Our Projects</li>
                  <li>• Active Campaigns</li>
                </ul>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-700 dark:text-gray-300">Get Involved:</div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Contact Us</li>
                  <li>• Gallery</li>
                  <li>• Our Blog</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="space-y-4">
            <Link href="/" className="block">
              <Button className="w-full bg-[#e51083] hover:bg-[#c50e73] text-white text-lg py-3">
                🏠 Take Me Home
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/about">
                <Button variant="outline" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  About Us
                </Button>
              </Link>
              <Link href="/projects">
                <Button variant="outline" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  Projects
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Link href="/campaigns">
                <Button variant="outline" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  Campaigns
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full text-[#e51083] border-[#e51083] hover:bg-[#e51083] hover:text-white">
                  Contact
                </Button>
              </Link>
            </div>

            <Link href="/gallery">
              <Button variant="ghost" className="w-full text-[#e51083] hover:bg-[#e51083] hover:text-white">
                View Gallery
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="text-sm text-gray-500 dark:text-gray-400 pt-6 border-t space-y-2">
            <p>
              Still can't find what you're looking for?
            </p>
            <Link href="/contact" className="text-[#e51083] hover:underline font-medium">
              Contact our support team →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
