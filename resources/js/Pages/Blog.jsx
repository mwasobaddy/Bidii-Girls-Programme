import { Head } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@inertiajs/react";
import { Calendar, User, ArrowRight, AlertCircle } from "lucide-react";
import { DonateButton } from "@/components/donate-button";
import { BlogFilter } from "@/components/blog-filter";
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

// Transform database blog post to component format
function transformBlogPost(post) {
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || post.content.substring(0, 150) + "...",
    image: post.featured_image || "/placeholder.svg?height=200&width=300",
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
    slug: post.slug,
  };
}

// Helper function to estimate read time
function estimateReadTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
}

// Error fallback component
function DatabaseError({ message }) {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 dark:text-red-200 mb-2">
            Database Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-6">{message}</p>
          <div className="space-y-4">
            <p className="text-sm text-red-500 dark:text-red-400">
              Please ensure your database connection is working properly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Blog({ auth, blogPosts: initialBlogPosts = [] }) {
  const [blogPosts, setBlogPosts] = useState(initialBlogPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(["All"]);

  useEffect(() => {
    async function fetchBlogPosts() {
      if (initialBlogPosts.length > 0) {
        // Process initial blog posts to get categories
        const transformedPosts = initialBlogPosts.map(transformBlogPost);
        setBlogPosts(transformedPosts);
        
        // Extract unique categories from blog posts
        const uniqueCategories = Array.from(
          new Set(
            initialBlogPosts
              .map(post => post.category)
              .filter(category => category !== null && category !== undefined && category.trim() !== "")
          )
        ).sort();

        // Add unique categories to the categories array
        setCategories(["All", ...uniqueCategories]);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/blog`);
        if (response.ok) {
          const posts = await response.json();
          const transformedPosts = posts.map(transformBlogPost);
          setBlogPosts(transformedPosts);
          
          // Extract unique categories from blog posts
          const uniqueCategories = Array.from(
            new Set(
              posts
                .map(post => post.category)
                .filter(category => category !== null && category !== undefined && category.trim() !== "")
            )
          ).sort();

          // Add unique categories to the categories array
          setCategories(["All", ...uniqueCategories]);
        } else {
          console.error('Failed to fetch blog posts');
          setError('Failed to connect to the database. Please check your database configuration.');
        }
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Failed to connect to the database. Please check your database configuration.');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <GuestLayout>
        <Head title="Blog" />
        <div>
          <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Stories of impact, education, and empowerment from the field
              </p>
            </div>
          </section>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e51083]"></div>
            <p className="ml-4 text-gray-600 dark:text-gray-400">Loading blog posts...</p>
          </div>
        </div>
      </GuestLayout>
    );
  }

  if (error) {
    return (
      <GuestLayout>
        <Head title="Blog" />
        <div>
          <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
              <p className="text-xl md:text-2xl max-w-3xl mx-auto">
                Stories of impact, education, and empowerment from the field
              </p>
            </div>
          </section>
          <DatabaseError message={error} />
        </div>
      </GuestLayout>
    );
  }

  return (
    <GuestLayout>
      <Head title="Blog" />
      
      <div>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-r from-[#e51083] to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto">
              Stories of impact, education, and empowerment from the field
            </p>
            {blogPosts.length === 0 && (
              <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-400 rounded-lg text-yellow-100">
                ⚠️ No blog posts found in the database. Please add some blog posts or check if the seed data was imported correctly.
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Blog Filter and Posts */}
        <BlogFilter categories={categories} blogPosts={blogPosts} />

        {/* Call to Action */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Your support can help us expand our reach and impact more lives.
              Every donation brings us closer to our goal of eradicating period
              poverty.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-12">
              <DonateButton className="flex-1 h-11 flex items-center justify-center rounded-md font-medium transition-all duration-200 hover:scale-[0.98]" />
              <Link href="/contact" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full h-11 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 bg-transparent rounded-md font-medium transition-all duration-200 hover:scale-[0.98] focus:ring-2 focus:ring-[#e51083]/20"
                >
                  Volunteer with Us
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Stay Updated</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest stories and updates
              from our programs.
            </p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e51083]"
              />
              <button className="bg-[#e51083] hover:bg-[#c50e73] text-white px-6 py-2 rounded-md transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </GuestLayout>
  );
}
