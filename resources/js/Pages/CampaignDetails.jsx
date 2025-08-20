import { Head } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Clock, Share2, AlertCircle } from "lucide-react";
import GuestLayout from "@/Layouts/GuestLayout";

const API_BASE_URL = window.location.origin + '/api';

function getImageUrl(imagePath) {
  if (!imagePath) return "/placeholder.svg";
  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  const BACKEND_URL = API_BASE_URL.replace('/api', '');
  return `${BACKEND_URL}${imagePath}`;
}

function DatabaseError({ message }) {
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

export default function CampaignDetails({ campaign }) {
  if (!campaign) {
    return (
      <GuestLayout>
        <Head title="Not Found" />
        <DatabaseError message="Campaign not found." />
      </GuestLayout>
    );
  }

  const processedCampaign = {
    ...campaign,
    author: campaign.author || "Bidii Team",
    date: campaign.created_at
      ? new Date(campaign.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date",
    category: campaign.category || "General",
    images: campaign.images || [],
  };

  return (
    <GuestLayout>
      <Head title={processedCampaign.title} />
      <div>
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <Link href="/">
              <Button variant="ghost" className="mb-6 hover:scale-105 transition-transform">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4 bg-[#e51083]">{processedCampaign.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
                {processedCampaign.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{processedCampaign.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{processedCampaign.date}</span>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto hover:scale-105 transition-transform">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="mb-12 animate-fade-in-up">
                <img
                  src={getImageUrl(processedCampaign.feature_image)}
                  alt={processedCampaign.title}
                  width={800}
                  height={500}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
              <div className="prose prose-lg max-w-none mb-12 animate-fade-in-up animation-delay-200" dangerouslySetInnerHTML={{ __html: processedCampaign.description }} />
            </div>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
