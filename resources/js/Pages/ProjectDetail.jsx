import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  ChevronLeft,
  ChevronRight,
  Share2,
  AlertCircle,
  MapPin,
  Users,
} from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import GuestLayout from "@/Layouts/GuestLayout";

const API_BASE_URL = window.location.origin + '/api';

// Helper function to construct proper image URLs
function getImageUrl(imagePath) {
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
          <Link href="/projects">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail({ auth, project }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [error, setError] = useState(null);

  if (!project) {
    return (
      <GuestLayout>
        <Head title="Project Not Found" />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The project you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/projects">
              <Button className="bg-[#e51083] hover:bg-[#c50e73]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Button>
            </Link>
          </div>
        </div>
      </GuestLayout>
    );
  }

  if (error) {
    return (
      <GuestLayout>
        <Head title="Error" />
        <DatabaseError message={error} />
      </GuestLayout>
    );
  }

  const nextImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project.images && project.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + project.images.length) % project.images.length
      );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'planning':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <GuestLayout>
      <Head title={project.title} />
      
      <div>
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
              <Badge className={`mb-4 ${getStatusColor(project.status)}`}>
                {project.status}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
                {project.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                {project.location && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>{project.location}</span>
                  </div>
                )}
                {project.start_date && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Start: {formatDate(project.start_date)}</span>
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

              {/* Project Stats */}
              {(project.beneficiaries || 0) > 0 && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-[#e51083]" />
                        <span className="font-semibold">Beneficiaries</span>
                      </div>
                      <p className="text-2xl font-bold text-[#e51083]">
                        {(project.beneficiaries || 0).toLocaleString()}
                      </p>
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
                <img
                  src={getImageUrl(project.featured_image)}
                  alt={project.title}
                  width={800}
                  height={500}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Description */}
              <div className="mb-8 animate-fade-in-up animation-delay-200">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Detailed Content */}
              {project.content && (
                <div
                  className="prose prose-lg max-w-none mb-12 animate-fade-in-up animation-delay-300"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              )}

              {/* Image Gallery */}
              {project.images && project.images.length > 0 && (
                <Card className="mb-12 animate-fade-in-up animation-delay-400">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Project Gallery</h3>

                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden rounded-lg">
                        <img
                          src={getImageUrl(
                            project.images[currentImageIndex]
                          )}
                          alt={`Gallery image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                      </div>

                      {project.images.length > 1 && (
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
                    {project.images.length > 1 && (
                      <div className="flex space-x-2 mt-4 overflow-x-auto">
                        {project.images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-all duration-300 hover:scale-105 ${
                              index === currentImageIndex
                                ? "border-[#e51083]"
                                : "border-gray-300"
                            }`}
                          >
                            <img
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
                      Image {currentImageIndex + 1} of {project.images.length}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call to Action */}
              <Card className="bg-[#e51083] text-white animate-fade-in-up animation-delay-600">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Support This Project</h3>
                  <p className="mb-6">
                    Help us continue making a difference in communities like this.
                    Your support enables us to reach more people and create lasting change.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <DonateButton className="bg-white text-[#e51083] hover:bg-gray-100 hover:scale-105 transition-all" />
                    <Link href="/contact">
                      <Button
                        variant="outline"
                        className="w-full border-white text-white hover:bg-white hover:text-[#e51083] bg-transparent hover:scale-105 transition-all"
                      >
                        Volunteer With Us
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
