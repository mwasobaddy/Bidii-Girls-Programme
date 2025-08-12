"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATIC_IDS } from "@/lib/static-data";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  AlertCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DonateButton } from "@/components/donate-button";

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

interface Campaign {
  id: number;
  title: string;
  description: string;
  location: string;
  urgency: string;
  beneficiaries: number;
  linked_blog?: number | null;
  feature_image: string;
  start_date: string;
  end_date?: string | null;
  content?: string | null;
  status?: string;
  goal_amount?: number;
  raised_amount?: number;
  images?: string[];
  created_at: string;
  updated_at: string;
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
          <Link href="/campaigns">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CampaignDetailPage() {
  const params = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        setLoading(true);
        const response = await fetch(`/api/campaigns/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Campaign not found");
          } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to fetch campaign");
          }
          return;
        }

        const campaignData = await response.json();
        setCampaign(campaignData);
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError(
          "Failed to connect to the database. Please check your database configuration."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchCampaign();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading campaign...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <DatabaseError message={error} />;
  }

  if (!campaign) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/campaigns">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    if (campaign.images && campaign.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % campaign.images!.length);
    }
  };

  const prevImage = () => {
    if (campaign.images && campaign.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + campaign.images!.length) % campaign.images!.length
      );
    }
  };

  const progressPercentage = (campaign.goal_amount || 0) > 0 
    ? Math.min(((campaign.raised_amount || 0) / (campaign.goal_amount || 1)) * 100, 100) 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

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

          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-[#e51083]">{campaign.status || campaign.urgency}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
              {campaign.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Start: {formatDate(campaign.start_date)}</span>
              </div>
              {campaign.end_date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>End: {formatDate(campaign.end_date)}</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto hover:scale-105 transition-transform"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Progress Section - only show if goal_amount exists */}
            {(campaign.goal_amount || 0) > 0 && (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-[#e51083]" />
                        <span className="font-semibold">Goal</span>
                      </div>
                      <p className="text-2xl font-bold text-[#e51083]">
                        {formatCurrency(campaign.goal_amount || 0)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span className="font-semibold">Raised</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(campaign.raised_amount || 0)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-[#e51083] h-3 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="mb-12 animate-fade-in-up">
              <Image
                src={getImageUrl(campaign.feature_image)}
                alt={campaign.title}
                width={800}
                height={500}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            {/* Description */}
            <div className="mb-8 animate-fade-in-up animation-delay-200">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Detailed Content */}
            {campaign.content && (
              <div
                className="prose prose-lg max-w-none mb-12 animate-fade-in-up animation-delay-300"
                dangerouslySetInnerHTML={{ __html: campaign.content }}
              />
            )}

            {/* Image Gallery */}
            {campaign.images && campaign.images.length > 0 && (
              <Card className="mb-12 animate-fade-in-up animation-delay-400">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>

                  <div className="relative">
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <Image
                        src={getImageUrl(
                          campaign.images[currentImageIndex]
                        )}
                        alt={`Gallery image ${currentImageIndex + 1}`}
                        fill
                        className="object-cover transition-all duration-300"
                      />
                    </div>

                    {campaign.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={prevImage}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:scale-110 transition-all"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={nextImage}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 hover:scale-110 transition-all"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Navigation */}
                  {campaign.images.length > 1 && (
                    <div className="flex space-x-2 mt-4 overflow-x-auto">
                      {campaign.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                            index === currentImageIndex
                              ? "border-[#e51083]"
                              : "border-gray-300"
                          }`}
                        >
                          <Image
                            src={getImageUrl(img)}
                            alt={`Thumbnail ${index + 1}`}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Image {currentImageIndex + 1} of {campaign.images.length}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Call to Action */}
            <Card className="bg-[#e51083] text-white animate-fade-in-up animation-delay-600">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Support This Campaign</h3>
                <p className="mb-6">
                  Your contribution will help us reach our goal and make a real
                  difference in the lives of those we serve.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <DonateButton className="bg-white text-[#e51083] hover:bg-gray-100 hover:scale-105 transition-all" />
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="w-full border-white text-white hover:bg-white hover:text-[#e51083] bg-transparent hover:scale-105 transition-all"
                    >
                      Get Involved
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

