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
          <Link href="/blog">
            <Button className="bg-[#e51083] hover:bg-[#c50e73]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function BlogDetail({ auth, blogPost: initialBlogPost }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [post, setPost] = useState(initialBlogPost);
  const [loading, setLoading] = useState(!initialBlogPost);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      if (initialBlogPost) return;
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blog/${window.location.pathname.split('/').pop()}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Post not found");
          } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to fetch blog post");
          }
          return;
        }

        const postData = await response.json();
        setPost(postData);
      } catch (err) {
        console.error("Error fetching blog post:", err);
        setError(
          "Failed to connect to the database. Please check your database configuration."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, []);

  if (loading) {
    return (
      <GuestLayout>
        <Head title="Loading..." />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083] mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Loading blog post...
            </p>
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

  if (!post) {
    return (
      <GuestLayout>
        <Head title="Not Found" />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/blog">
              <Button className="bg-[#e51083] hover:bg-[#c50e73]">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </GuestLayout>
    );
  }

  const nextImage = () => {
    if (post.images && post.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post.images && post.images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + post.images.length) % post.images.length
      );
    }
  };

  // Process post data
  const processedPost = {
    ...post,
    author: post.author || "Bidii Team",
    date: post.created_at
      ? new Date(post.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Unknown date",
    category: post.category || "General",
    readTime: estimateReadTime(post.content),
    images: post.images || [],
  };

  // Helper function to estimate read time
  function estimateReadTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  }

  return (
    <GuestLayout>
      <Head title={processedPost.title} />
      
      <div>
        {/* Header */}
        <section className="py-12 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <Link href="/blog">
              <Button
                variant="ghost"
                className="mb-6 hover:scale-105 transition-transform"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
              <Badge className="mb-4 bg-[#e51083]">{processedPost.category}</Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-6 animate-fade-in-up">
                {processedPost.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{processedPost.author}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{processedPost.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{processedPost.readTime}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-auto hover:scale-105 transition-transform"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
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
                  src={getImageUrl(processedPost.featured_image)}
                  alt={processedPost.title}
                  width={800}
                  height={500}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none mb-12 animate-fade-in-up animation-delay-200"
                dangerouslySetInnerHTML={{ __html: processedPost.content }}
              />

              {/* Image Carousel */}
              {processedPost.images && processedPost.images.length > 0 && (
                <Card className="mb-12 animate-fade-in-up animation-delay-400">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>

                    <div className="relative">
                      <div className="aspect-video relative overflow-hidden rounded-lg">
                        <img
                          src={getImageUrl(processedPost.images[currentImageIndex])}
                          alt={`Gallery image ${currentImageIndex + 1}`}
                          className="w-full h-full object-cover transition-all duration-300"
                        />
                      </div>

                      {processedPost.images.length > 1 && (
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
                    {processedPost.images.length > 1 && (
                      <div className="flex space-x-2 mt-4 overflow-x-auto">
                        {processedPost.images.map((img, index) => (
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
                      Image {currentImageIndex + 1} of {processedPost.images.length}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call to Action */}
              <Card className="bg-[#e51083] text-white animate-fade-in-up animation-delay-600">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
                  <p className="mb-6">
                    Help us continue creating stories like this. Your support
                    makes a real difference in girls' lives.
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
