"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DonateButton } from "@/components/donate-button";
import { Campaign } from "@/lib/types";
import { getAllCampaigns } from "@/lib/services";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to construct proper image URLs
function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return "/placeholder.svg";
  
  // If it's already a full URL or base64, return as is
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const BACKEND_URL = API_BASE_URL.replace('/api', '');
  return `${BACKEND_URL}${imagePath}`;
}

// Error fallback component
function DatabaseError({ message }: { message: string }) {
  return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Database Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">{message}</p>
          <Link href="/">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        setLoading(true);
        const campaignsData = await getAllCampaigns();
        setCampaigns(campaignsData);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError(
          "Failed to connect to the database. Please check your database configuration."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading campaigns...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <DatabaseError message={error} />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="pt-16">
      {/* Header */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-6 hover:scale-105 transition-transform"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              Our Campaigns
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 animate-fade-in-up animation-delay-200">
              Join us in making a difference through our active campaigns and initiatives.
            </p>
          </div>
        </div>
      </section>

      {/* Campaigns Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">No Campaigns Available</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We don't have any active campaigns at the moment. Please check back later.
              </p>
              <Link href="/">
                <Button className="bg-[#e51083] hover:bg-[#c50e73]">
                  Return to Home
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {campaigns.map((campaign, index) => (
                <Card
                  key={campaign.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="relative">
                    <Image
                      src={getImageUrl(campaign.feature_image)}
                      alt={campaign.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 text-xs ${
                        (campaign.status || campaign.urgency) === "active" || (campaign.status || campaign.urgency) === "Active"
                          ? "bg-green-500"
                          : (campaign.status || campaign.urgency) === "completed" || (campaign.status || campaign.urgency) === "Completed"
                          ? "bg-blue-500"
                          : (campaign.status || campaign.urgency) === "urgent" || (campaign.status || campaign.urgency) === "Urgent"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {campaign.status || campaign.urgency || 'Active'}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{campaign.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
                      {campaign.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{campaign.start_date ? formatDate(campaign.start_date) : 'Date TBD'}</span>
                      </div>
                      {campaign.beneficiaries && (
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-[#e51083]" />
                          <span>{campaign.beneficiaries} people</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
                      <Link href={`/campaigns/${campaign.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98] border-[#e51083] text-[#e51083] hover:bg-[#e51083] hover:text-white bg-transparent"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
